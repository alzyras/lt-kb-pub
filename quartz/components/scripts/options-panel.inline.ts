type CitationSourceRegistryEntry = {
  id: string
  title: string
  count: number
}

type OptionsState = {
  minQuoteCount: number
  selectedSourceIds: string[]
}

type OptionsWindow = Window &
  typeof globalThis & {
    applyQuartzOptionFilters?: () => void
    addCleanup?: (cleanup: () => void) => void
  }

type CitationSourceGlobal = typeof globalThis & {
  fetchCitationSources?: Promise<CitationSourceRegistryEntry[]>
}

const OPTIONS_STORAGE_KEY = "ltkb-options-v1"
const DEFAULT_STATE: OptionsState = {
  minQuoteCount: 0,
  selectedSourceIds: [],
}

const optionsWindow = window as OptionsWindow
const citationSourceGlobal = globalThis as CitationSourceGlobal
const panelInitialized = new WeakSet<HTMLElement>()
let state = readState()
let cachedSources: CitationSourceRegistryEntry[] = []

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function readState(): OptionsState {
  const stored = localStorage.getItem(OPTIONS_STORAGE_KEY)
  if (!stored) {
    return { ...DEFAULT_STATE }
  }
  try {
    const parsed = JSON.parse(stored) as Partial<OptionsState>
    const minQuoteCount = Number.isFinite(parsed.minQuoteCount) ? Math.max(0, Number(parsed.minQuoteCount)) : 0
    const selectedSourceIds = Array.isArray(parsed.selectedSourceIds)
      ? parsed.selectedSourceIds.filter((value): value is string => typeof value === "string")
      : []
    return { minQuoteCount, selectedSourceIds }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

function persistState() {
  localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(state))
}

function normalizeState() {
  state = {
    minQuoteCount: Math.max(0, Number(state.minQuoteCount) || 0),
    selectedSourceIds: [...new Set(state.selectedSourceIds.filter(Boolean))],
  }
}

function selectedSourceSet(): Set<string> {
  return new Set(state.selectedSourceIds)
}

function parseSourceIds(value: string | undefined): string[] {
  return (value ?? "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean)
}

function matchesSourceSelection(itemSourceIds: string[]): boolean {
  if (state.selectedSourceIds.length === 0) {
    return true
  }
  const selected = selectedSourceSet()
  return itemSourceIds.some((id) => selected.has(id))
}

function detectMaxQuoteCount(): number {
  const counts = [...document.querySelectorAll<HTMLElement>("[data-quote-count]")]
    .map((el) => Number(el.dataset.quoteCount ?? "0"))
    .filter((value) => Number.isFinite(value))
  return Math.max(50, ...counts, state.minQuoteCount)
}

function updatePeriodSummaries() {
  const controls = document.querySelectorAll<HTMLElement>(
    '.period-filter-controls[data-period-filter-controls="true"]',
  )

  controls.forEach((control) => {
    const summary = control.querySelector<HTMLElement>("[data-period-summary]")
    if (!summary) {
      return
    }
    const entries = [
      ...(control.parentElement?.querySelectorAll<HTMLLIElement>("li.section-li") ?? []),
    ]
    const visible = entries.filter((entry) => !entry.hidden).length
    summary.textContent = `Rodoma ${visible} iš ${entries.length}`
  })
}

function applyListFilters() {
  const entries = document.querySelectorAll<HTMLLIElement>("li.section-li")
  entries.forEach((entry) => {
    const periodOk = entry.dataset.periodMatch !== "false"
    const filterable = entry.dataset.citationFilterable === "true"
    let optionsOk = true
    if (filterable) {
      const quoteCount = Number(entry.dataset.quoteCount ?? "0")
      const sourceIds = parseSourceIds(entry.dataset.citationSources)
      optionsOk = quoteCount >= state.minQuoteCount && matchesSourceSelection(sourceIds)
    }
    entry.dataset.optionsMatch = optionsOk ? "true" : "false"
    entry.hidden = !(periodOk && optionsOk)
  })
  updatePeriodSummaries()
}

function syncEmptyState(
  wrapper: HTMLElement | null,
  {
    selector,
    emptySelector,
    emptyAttr,
    emptyText,
  }: {
    selector: string
    emptySelector: string
    emptyAttr: string
    emptyText: string
  },
) {
  if (!wrapper) {
    return
  }
  const visibleCount = wrapper.querySelectorAll(`${selector}:not([hidden])`).length
  let empty = wrapper.querySelector<HTMLElement>(emptySelector)
  if (!empty) {
    empty = document.createElement("p")
    empty.className = "options-filter-empty"
    empty.setAttribute("hidden", "true")
    empty.setAttribute(emptyAttr, "true")
    empty.textContent = emptyText
    wrapper.appendChild(empty)
  }
  if (visibleCount === 0) {
    empty.hidden = false
  } else {
    empty.hidden = true
  }
}

function applyCitationFilters() {
  const citationEntries = document.querySelectorAll<HTMLElement>('[data-citation-entry="true"]')
  const visibleCitationIds = new Set<string>()
  citationEntries.forEach((entry) => {
    const sourceId = String(entry.dataset.citationSourceId ?? "")
    const citationId = String(entry.dataset.citationId ?? "")
    const keep = matchesSourceSelection(sourceId ? [sourceId] : [])
    entry.hidden = !keep
    if (keep && citationId) {
      visibleCitationIds.add(citationId)
    }
  })

  const claimRows = document.querySelectorAll<HTMLElement>('[data-claim-row="true"]')
  claimRows.forEach((row) => {
    if (state.selectedSourceIds.length === 0) {
      row.hidden = false
      return
    }
    const supportingIds = parseSourceIds(row.dataset.supportingIds)
    row.hidden = !supportingIds.some((id) => visibleCitationIds.has(id))
  })

  document
    .querySelectorAll<HTMLElement>('[data-claims-table="true"]')
    .forEach((table) => {
      const hasVisibleRows = table.querySelectorAll('[data-claim-row="true"]:not([hidden])').length > 0
      table.hidden = !hasVisibleRows
    })

  document.querySelectorAll<HTMLElement>('[data-citation-section="true"]').forEach((wrapper) =>
    syncEmptyState(wrapper, {
      selector: '[data-citation-entry="true"]',
      emptySelector: "[data-citation-empty-state]",
      emptyAttr: "data-citation-empty-state",
      emptyText: "Nėra citatų pagal pasirinktus filtrus.",
    }),
  )

  document.querySelectorAll<HTMLElement>('[data-claims-section="true"]').forEach((wrapper) =>
    syncEmptyState(wrapper, {
      selector: '[data-claim-row="true"]',
      emptySelector: "[data-claims-empty-state]",
      emptyAttr: "data-claims-empty-state",
      emptyText: "Nėra teiginių pagal pasirinktus filtrus.",
    }),
  )
}

function applyFilters() {
  normalizeState()
  persistState()
  applyListFilters()
  applyCitationFilters()
  syncPanelState()
}

function syncPanelState() {
  const maxValue = detectMaxQuoteCount()
  const roots = document.querySelectorAll<HTMLElement>("[data-options-root]")
  roots.forEach((root) => {
    const range = root.querySelector<HTMLInputElement>("[data-options-quote-range]")
    const number = root.querySelector<HTMLInputElement>("[data-options-quote-number]")
    const selectedSummary = root.querySelector<HTMLElement>("[data-options-selected-summary]")
    if (range) {
      range.max = `${maxValue}`
      range.value = `${Math.min(state.minQuoteCount, maxValue)}`
    }
    if (number) {
      number.value = `${state.minQuoteCount}`
    }
    if (selectedSummary) {
      selectedSummary.textContent = `Pasirinkta: ${state.selectedSourceIds.length}`
    }

    root.querySelectorAll<HTMLInputElement>("[data-options-source-checkbox]").forEach((checkbox) => {
      checkbox.checked = state.selectedSourceIds.includes(checkbox.value)
    })
  })
}

function renderSourceList(root: HTMLElement, sources: CitationSourceRegistryEntry[]) {
  const list = root.querySelector<HTMLElement>("[data-options-source-list]")
  const search = root.querySelector<HTMLInputElement>("[data-options-source-search]")
  if (!list) {
    return
  }

  const filterTerm = (search?.value ?? "").trim().toLocaleLowerCase("lt")
  const visibleSources = sources.filter((source) =>
    source.title.toLocaleLowerCase("lt").includes(filterTerm),
  )

  if (visibleSources.length === 0) {
    list.innerHTML = `<p class="options-panel-empty">Nerasta knygų.</p>`
    return
  }

  const selected = selectedSourceSet()
  list.innerHTML = visibleSources
    .map((source) => {
      const checked = selected.has(source.id) ? 'checked="checked"' : ""
      return `
        <div class="options-panel-source-row">
          <label>
            <input type="checkbox" value="${source.id}" data-options-source-checkbox="" ${checked} />
            <span class="options-panel-source-title">${escapeHtml(source.title)}</span>
          </label>
          <span class="options-panel-source-count">${source.count}</span>
        </div>
      `
    })
    .join("")

  list.querySelectorAll<HTMLInputElement>("[data-options-source-checkbox]").forEach((checkbox) => {
    const onChange = () => {
      if (checkbox.checked) {
        state.selectedSourceIds = [...new Set([...state.selectedSourceIds, checkbox.value])]
      } else {
        state.selectedSourceIds = state.selectedSourceIds.filter((value) => value !== checkbox.value)
      }
      applyFilters()
    }
    checkbox.addEventListener("change", onChange)
      optionsWindow.addCleanup?.(() => checkbox.removeEventListener("change", onChange))
  })
}

function setPanelOpen(root: HTMLElement, open: boolean) {
  const popover = root.querySelector<HTMLElement>("[data-options-popover]")
  const toggle = root.querySelector<HTMLElement>("[data-options-toggle]")
  if (!popover || !toggle) {
    return
  }
  popover.hidden = !open
  toggle.setAttribute("aria-expanded", open ? "true" : "false")
}

function initPanel(root: HTMLElement) {
  if (panelInitialized.has(root)) {
    return
  }
  panelInitialized.add(root)

  const toggle = root.querySelector<HTMLElement>("[data-options-toggle]")
  const close = root.querySelector<HTMLElement>("[data-options-close]")
  const reset = root.querySelector<HTMLElement>("[data-options-reset]")
  const range = root.querySelector<HTMLInputElement>("[data-options-quote-range]")
  const number = root.querySelector<HTMLInputElement>("[data-options-quote-number]")
  const search = root.querySelector<HTMLInputElement>("[data-options-source-search]")

  const onToggle = () => {
    const popover = root.querySelector<HTMLElement>("[data-options-popover]")
    setPanelOpen(root, Boolean(popover?.hidden))
  }
  const onClose = () => setPanelOpen(root, false)
  const onReset = () => {
    state = { ...DEFAULT_STATE }
    if (search) {
      search.value = ""
    }
    renderSourceList(root, cachedSources)
    applyFilters()
  }
  const onRangeInput = () => {
    state.minQuoteCount = Math.max(0, Number(range?.value ?? "0") || 0)
    applyFilters()
  }
  const onNumberInput = () => {
    state.minQuoteCount = Math.max(0, Number(number?.value ?? "0") || 0)
    applyFilters()
  }
  const onSearchInput = () => renderSourceList(root, cachedSources)

  toggle?.addEventListener("click", onToggle)
  close?.addEventListener("click", onClose)
  reset?.addEventListener("click", onReset)
  range?.addEventListener("input", onRangeInput)
  number?.addEventListener("input", onNumberInput)
  search?.addEventListener("input", onSearchInput)

  optionsWindow.addCleanup?.(() => toggle?.removeEventListener("click", onToggle))
  optionsWindow.addCleanup?.(() => close?.removeEventListener("click", onClose))
  optionsWindow.addCleanup?.(() => reset?.removeEventListener("click", onReset))
  optionsWindow.addCleanup?.(() => range?.removeEventListener("input", onRangeInput))
  optionsWindow.addCleanup?.(() => number?.removeEventListener("input", onNumberInput))
  optionsWindow.addCleanup?.(() => search?.removeEventListener("input", onSearchInput))

  syncPanelState()
  renderSourceList(root, cachedSources)
}

function initOptionsPanels() {
  document.querySelectorAll<HTMLElement>("[data-options-root]").forEach((root) => initPanel(root))
  syncPanelState()
  applyFilters()
}

Promise.resolve(citationSourceGlobal.fetchCitationSources ?? [])
  .then((sources) => {
    cachedSources = Array.isArray(sources) ? sources : []
    initOptionsPanels()
  })
  .catch(() => {
    cachedSources = []
    initOptionsPanels()
  })

optionsWindow.applyQuartzOptionFilters = applyFilters
document.addEventListener("DOMContentLoaded", initOptionsPanels)
document.addEventListener("nav", initOptionsPanels)
