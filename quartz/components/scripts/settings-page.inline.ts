import {
  DEFAULT_SETTINGS_STATE,
  SOURCE_KIND_SPECS,
  dispatchSettingsChange,
  loadSourceCatalog,
  readSettingsState,
  selectedSources,
  setSelectionRule,
  sourceMatchesSelection,
  writeSettingsState,
  type SettingsState,
  type SourceCatalogEntry,
  type SourceChannel,
  type SourceSelection,
  type SourceSelectionRule,
} from "../../util/sourceSettings"

type SettingsRoot = HTMLElement & { __settingsReady?: boolean }
let catalog: SourceCatalogEntry[] = []
let state: SettingsState = readSettingsState()
let saveTimer = 0

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")
}

function selectionFor(channel: SourceChannel): SourceSelection {
  return channel === "text" ? state.textSources : state.mediaSources
}

function setSelection(channel: SourceChannel, selection: SourceSelection) {
  state = channel === "text" ? { ...state, textSources: selection } : { ...state, mediaSources: selection }
}

function matchingEntries(channel: SourceChannel, scope: SourceSelectionRule["scope"], id: string) {
  return catalog.filter((entry) => entry.channel === channel && (
    (scope === "kind" && entry.kind === id) ||
    (scope === "series" && entry.seriesId === id) ||
    (scope === "source" && entry.id === id)
  ))
}

function checkboxState(channel: SourceChannel, scope: SourceSelectionRule["scope"], id: string) {
  const entries = matchingEntries(channel, scope, id)
  const selected = entries.filter((entry) => sourceMatchesSelection(entry, selectionFor(channel))).length
  return { checked: entries.length > 0 && selected === entries.length, mixed: selected > 0 && selected < entries.length }
}

function sourceMetrics(entry: SourceCatalogEntry): string {
  return entry.channel === "media"
    ? `${entry.objectCount} ob. · ${entry.mediaCount} vaizd.`
    : `${entry.objectCount} ob. · ${entry.claimCount} teig. · ${entry.quoteCount} cit.`
}

function leafRow(entry: SourceCatalogEntry): string {
  const checked = sourceMatchesSelection(entry, selectionFor(entry.channel)) ? "checked" : ""
  const volume = entry.volumeLabel ? `<span class="settings-source-volume">${escapeHtml(entry.volumeLabel)}</span>` : ""
  const link = entry.publicSlug
    ? `<a class="settings-source-link" href="/${encodeURI(entry.publicSlug)}" aria-label="Atidaryti šaltinio puslapį">↗</a>`
    : ""
  return `<div class="settings-source-row" data-settings-search-text="${escapeHtml(`${entry.title} ${entry.seriesTitle ?? ""} ${entry.searchText ?? ""}`.toLocaleLowerCase("lt"))}">
    <label><input type="checkbox" data-settings-rule-scope="source" data-settings-rule-id="${escapeHtml(entry.id)}" data-settings-channel="${entry.channel}" ${checked} />
    <span class="settings-source-name">${escapeHtml(entry.title)} ${volume}</span></label>
    <span class="settings-source-metrics">${sourceMetrics(entry)}</span>${link}
  </div>`
}

function groupCheckbox(channel: SourceChannel, scope: SourceSelectionRule["scope"], id: string, label: string, count: number): string {
  const current = checkboxState(channel, scope, id)
  return `<label class="settings-group-label"><input type="checkbox" data-settings-rule-scope="${scope}" data-settings-rule-id="${escapeHtml(id)}" data-settings-channel="${channel}" ${current.checked ? "checked" : ""} data-settings-mixed="${current.mixed ? "true" : "false"}" /><span>${escapeHtml(label)}</span><small>${count}</small></label>`
}

function renderTree(root: SettingsRoot, channel: SourceChannel) {
  const target = root.querySelector<HTMLElement>(`[data-settings-source-tree="${channel}"]`)
  if (!target) return
  const entries = catalog.filter((entry) => entry.channel === channel)
  if (entries.length === 0) {
    target.innerHTML = `<p class="settings-empty">Šio tipo šaltinių dar nėra.</p>`
    return
  }
  const kinds = SOURCE_KIND_SPECS.filter((spec) => spec.channel === channel && entries.some((entry) => entry.kind === spec.code))
  target.innerHTML = kinds.map((spec) => {
    const kindEntries = entries.filter((entry) => entry.kind === spec.code)
    const series = new Map<string, SourceCatalogEntry[]>()
    const singles: SourceCatalogEntry[] = []
    for (const entry of kindEntries) {
      if (entry.seriesId) series.set(entry.seriesId, [...(series.get(entry.seriesId) ?? []), entry])
      else singles.push(entry)
    }
    const seriesHtml = [...series].map(([seriesId, values]) => `<details class="settings-series" open>
      <summary>${groupCheckbox(channel, "series", seriesId, values[0].seriesTitle ?? seriesId, values.length)}</summary>
      <div class="settings-series-children">${values.map(leafRow).join("")}</div>
    </details>`).join("")
    return `<details class="settings-kind" open><summary>${groupCheckbox(channel, "kind", spec.code, spec.label, kindEntries.length)}</summary>
      <div class="settings-kind-children">${seriesHtml}${singles.map(leafRow).join("")}</div>
    </details>`
  }).join("")

  target.querySelectorAll<HTMLInputElement>("[data-settings-mixed=true]").forEach((input) => {
    input.indeterminate = true
    input.setAttribute("aria-checked", "mixed")
  })
  target.querySelectorAll<HTMLInputElement>("[data-settings-rule-scope]").forEach((input) => {
    input.addEventListener("click", (event) => event.stopPropagation())
    input.addEventListener("change", () => {
      const scope = input.dataset.settingsRuleScope as SourceSelectionRule["scope"]
      const id = input.dataset.settingsRuleId ?? ""
      const inputChannel = input.dataset.settingsChannel as SourceChannel
      setSelection(inputChannel, setSelectionRule(selectionFor(inputChannel), { scope, id, include: input.checked }, catalog, inputChannel))
      saveAndRender(root)
    })
  })
  applySearch(root, channel)
}

function applySearch(root: SettingsRoot, channel: SourceChannel) {
  const input = root.querySelector<HTMLInputElement>(`[data-settings-source-search="${channel}"]`)
  const term = (input?.value ?? "").trim().toLocaleLowerCase("lt")
  root.querySelectorAll<HTMLElement>(`[data-settings-source-tree="${channel}"] .settings-source-row`).forEach((row) => {
    row.hidden = Boolean(term) && !(row.dataset.settingsSearchText ?? "").includes(term)
  })
  root.querySelectorAll<HTMLDetailsElement>(`[data-settings-source-tree="${channel}"] details`).forEach((group) => {
    const visible = group.querySelectorAll(".settings-source-row:not([hidden])").length
    group.hidden = visible === 0
    if (term && visible > 0) group.open = true
  })
}

function syncSummary(root: SettingsRoot, channel: SourceChannel) {
  const total = catalog.filter((entry) => entry.channel === channel).length
  const selected = selectedSources(catalog, channel, selectionFor(channel)).length
  const summary = root.querySelector<HTMLElement>(`[data-settings-summary="${channel}"]`)
  if (summary) summary.textContent = selected === total ? `Pasirinkti visi ${total}` : `Pasirinkta ${selected} iš ${total}`
}

function syncDisplay(root: SettingsRoot) {
  const range = root.querySelector<HTMLInputElement>("[data-settings-min-claims-range]")
  const number = root.querySelector<HTMLInputElement>("[data-settings-min-claims-number]")
  const people = root.querySelector<HTMLInputElement>("[data-settings-person-parentheticals]")
  const advanced = root.querySelector<HTMLInputElement>("[data-settings-advanced-evidence]")
  if (range) range.value = String(state.minClaimCount)
  if (number) number.value = String(state.minClaimCount)
  if (people) people.checked = state.showPersonParentheticals
  if (advanced) advanced.checked = state.advancedEvidence
}

function render(root: SettingsRoot) {
  renderTree(root, "text")
  renderTree(root, "media")
  syncSummary(root, "text")
  syncSummary(root, "media")
  syncDisplay(root)
}

function saveAndRender(root: SettingsRoot) {
  writeSettingsState(state, catalog)
  dispatchSettingsChange()
  render(root)
  const status = root.querySelector<HTMLElement>("[data-settings-save-status]")
  if (status) {
    status.textContent = "Išsaugota"
    window.clearTimeout(saveTimer)
    saveTimer = window.setTimeout(() => { status.textContent = "" }, 1400)
  }
}

function initSettingsPage(root: SettingsRoot) {
  if (root.__settingsReady) return
  root.__settingsReady = true
  state = readSettingsState()
  root.querySelectorAll<HTMLButtonElement>("[data-settings-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.settingsTab
      root.querySelectorAll<HTMLButtonElement>("[data-settings-tab]").forEach((candidate) => candidate.setAttribute("aria-selected", String(candidate === button)))
      root.querySelectorAll<HTMLElement>("[data-settings-panel]").forEach((panel) => { panel.hidden = panel.dataset.settingsPanel !== tab })
    })
  })
  for (const channel of ["text", "media"] as const) {
    root.querySelector<HTMLInputElement>(`[data-settings-source-search="${channel}"]`)?.addEventListener("input", () => applySearch(root, channel))
    root.querySelector(`[data-settings-select-all="${channel}"]`)?.addEventListener("click", () => { setSelection(channel, { mode: "all", rules: [] }); saveAndRender(root) })
    root.querySelector(`[data-settings-select-none="${channel}"]`)?.addEventListener("click", () => { setSelection(channel, { mode: "custom", rules: [] }); saveAndRender(root) })
  }
  const updateMinimum = (value: string) => { state = { ...state, minClaimCount: Math.max(0, Number(value) || 0) }; saveAndRender(root) }
  root.querySelector<HTMLInputElement>("[data-settings-min-claims-range]")?.addEventListener("input", (event) => updateMinimum((event.currentTarget as HTMLInputElement).value))
  root.querySelector<HTMLInputElement>("[data-settings-min-claims-number]")?.addEventListener("change", (event) => updateMinimum((event.currentTarget as HTMLInputElement).value))
  root.querySelector<HTMLInputElement>("[data-settings-person-parentheticals]")?.addEventListener("change", (event) => { state = { ...state, showPersonParentheticals: (event.currentTarget as HTMLInputElement).checked }; saveAndRender(root) })
  root.querySelector<HTMLInputElement>("[data-settings-advanced-evidence]")?.addEventListener("change", (event) => { state = { ...state, advancedEvidence: (event.currentTarget as HTMLInputElement).checked }; saveAndRender(root) })
  root.querySelector("[data-settings-reset]")?.addEventListener("click", () => { state = structuredClone(DEFAULT_SETTINGS_STATE); saveAndRender(root) })
  loadSourceCatalog().then((entries) => { catalog = entries; render(root) })
  render(root)
}

document.querySelectorAll<SettingsRoot>("[data-settings-page]").forEach(initSettingsPage)
document.addEventListener("nav", () => document.querySelectorAll<SettingsRoot>("[data-settings-page]").forEach(initSettingsPage))
