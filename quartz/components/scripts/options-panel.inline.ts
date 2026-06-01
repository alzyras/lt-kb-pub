type CitationSourceRegistryEntry = {
  id: string
  title: string
  count: number
}

type OptionsState = {
  minClaimCount: number
  sourceSelectionMode: "all" | "custom"
  selectedSourceIds: string[]
}

type OptionsWindow = Window &
  typeof globalThis & {
    applyQuartzOptionFilters?: () => void
    addCleanup?: (cleanup: () => void) => void
  }

type OptionsRoot = HTMLElement & {
  __optionsPanelBound?: boolean
}

type CitationSourceGlobal = typeof globalThis & {
  fetchCitationSources?: Promise<CitationSourceRegistryEntry[]>
}

const OPTIONS_STORAGE_KEY = "ltkb-options-v3"
const DEFAULT_STATE: OptionsState = {
  minClaimCount: 5,
  sourceSelectionMode: "all",
  selectedSourceIds: [],
}

const optionsWindow = window as OptionsWindow
const citationSourceGlobal = globalThis as CitationSourceGlobal
let state = readState()
let cachedSources: CitationSourceRegistryEntry[] = []

function normalizeSources(sources: CitationSourceRegistryEntry[]): CitationSourceRegistryEntry[] {
  return sources
    .filter(
      (source) =>
        typeof source?.id === "string" &&
        source.id.trim().length > 0 &&
        typeof source?.title === "string" &&
        source.title.trim().length > 0,
    )
    .map((source) => ({
      id: source.id.trim(),
      title: source.title.trim(),
      count: Number.isFinite(source.count) ? Math.max(0, Number(source.count)) : 0,
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count
      }
      return a.title.localeCompare(b.title, "lt", { sensitivity: "base" })
    })
}

function deriveSourcesFromDom(): CitationSourceRegistryEntry[] {
  const byId = new Map<string, CitationSourceRegistryEntry>()

  document.querySelectorAll<HTMLElement>('[data-citation-entry="true"]').forEach((entry) => {
    const id = String(entry.dataset.citationSourceId ?? "").trim()
    const title = String(entry.dataset.citationSourceTitle ?? "").trim()
    if (!id) {
      return
    }
    const existing = byId.get(id)
    if (existing) {
      existing.count += 1
      if (!existing.title && title) {
        existing.title = title
      }
    } else {
      byId.set(id, { id, title: title || id, count: 1 })
    }
  })

  document.querySelectorAll<HTMLElement>("[data-citation-sources]").forEach((entry) => {
    const ids = parseSourceIds(entry.dataset.citationSources)
    ids.forEach((id) => {
      const existing = byId.get(id)
      if (existing) {
        existing.count += 1
      } else {
        byId.set(id, { id, title: id, count: 1 })
      }
    })
  })

  return normalizeSources([...byId.values()])
}

async function fetchRegistryAt(url: string): Promise<CitationSourceRegistryEntry[] | null> {
  try {
    const response = await fetch(url, { cache: "force-cache" })
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    if (!Array.isArray(data)) {
      return null
    }
    return normalizeSources(data as CitationSourceRegistryEntry[])
  } catch {
    return null
  }
}

async function loadCitationSources(): Promise<CitationSourceRegistryEntry[]> {
  const fromGlobal = citationSourceGlobal.fetchCitationSources
  if (fromGlobal) {
    try {
      const resolved = await fromGlobal
      const normalized = normalizeSources(Array.isArray(resolved) ? resolved : [])
      if (normalized.length > 0) {
        return normalized
      }
    } catch {
      // fallback below
    }
  }

  const candidates = [
    "/static/citationSources.json",
    "/lt-kb-pub/static/citationSources.json",
    "./static/citationSources.json",
    "../static/citationSources.json",
    "../../static/citationSources.json",
  ]

  for (const candidate of candidates) {
    const resolved = await fetchRegistryAt(candidate)
    if (resolved && resolved.length > 0) {
      return resolved
    }
  }

  return deriveSourcesFromDom()
}

function escapeOptionsHtml(text: string): string {
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
    const minClaimCount = Number.isFinite(parsed.minClaimCount)
      ? Math.max(0, Number(parsed.minClaimCount))
      : DEFAULT_STATE.minClaimCount
    const selectedSourceIds = Array.isArray(parsed.selectedSourceIds)
      ? parsed.selectedSourceIds.filter((value): value is string => typeof value === "string")
      : []
    // Migrate older saved states: if there was an explicit selection saved before
    // sourceSelectionMode existed, preserve that custom subset instead of forcing "all".
    const sourceSelectionMode =
      parsed.sourceSelectionMode === "custom"
        ? "custom"
        : parsed.sourceSelectionMode === "all"
          ? "all"
          : selectedSourceIds.length > 0
            ? "custom"
            : "all"
    return { minClaimCount, sourceSelectionMode, selectedSourceIds }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

function persistState() {
  localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(state))
}

function normalizeState() {
  state = {
    minClaimCount: Math.max(0, Number(state.minClaimCount) || 0),
    sourceSelectionMode: state.sourceSelectionMode === "custom" ? "custom" : "all",
    selectedSourceIds: [...new Set(state.selectedSourceIds.filter(Boolean))],
  }
}

function selectedSourceSet(): Set<string> {
  return new Set(state.selectedSourceIds)
}

function isSourceSelected(sourceId: string): boolean {
  if (state.sourceSelectionMode === "all") {
    return true
  }
  return selectedSourceSet().has(sourceId)
}

function parseSourceIds(value: string | undefined): string[] {
  return (value ?? "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean)
}

function matchesSourceSelection(itemSourceIds: string[]): boolean {
  if (state.sourceSelectionMode === "all") {
    return true
  }
  if (state.selectedSourceIds.length === 0) {
    return false
  }
  const selected = selectedSourceSet()
  return itemSourceIds.some((id) => selected.has(id))
}

function optionFiltersActive(): boolean {
  return state.minClaimCount > 0 || state.sourceSelectionMode === "custom"
}

function optionsMatchItem({
  filterable,
  claimCount,
  sourceIds,
}: {
  filterable: boolean
  claimCount: number
  sourceIds: string[]
}): boolean {
  if (!optionFiltersActive()) {
    return true
  }
  if (!filterable) {
    return false
  }
  return claimCount >= state.minClaimCount && matchesSourceSelection(sourceIds)
}

function detectMaxClaimCount(): number {
  const counts = [...document.querySelectorAll<HTMLElement>("[data-claim-count]")]
    .map((el) => Number(el.dataset.claimCount ?? "0"))
    .filter((value) => Number.isFinite(value))
  return Math.max(50, ...counts, state.minClaimCount)
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

function syncPageListGroups() {
  document.querySelectorAll<HTMLElement>(".page-list-type-group").forEach((group) => {
    const entries = [...group.querySelectorAll<HTMLLIElement>("li.section-li")]
    const visible = entries.filter((entry) => !entry.hidden)
    const count = group.querySelector<HTMLElement>(".page-list-type-heading small")
    if (count) {
      count.textContent = `${visible.length}`
    }
    group.hidden = entries.length > 0 && visible.length === 0
  })
}

function applyListFilters() {
  const entries = document.querySelectorAll<HTMLLIElement>("li.section-li")
  entries.forEach((entry) => {
    const periodOk = entry.dataset.periodMatch !== "false"
    const filterable = entry.dataset.citationFilterable === "true"
    const claimCount = Number(entry.dataset.claimCount ?? "0")
    const sourceIds = parseSourceIds(entry.dataset.citationSources)
    const optionsOk = filterable
      ? optionsMatchItem({ filterable, claimCount, sourceIds })
      : true
    entry.dataset.optionsMatch = optionsOk ? "true" : "false"
    entry.hidden = !(periodOk && optionsOk)
  })
  updatePeriodSummaries()
  syncPageListGroups()
}

function applyExplorerFilters() {
  const evaluateLeaf = (item: HTMLLIElement): boolean => {
    item.dataset.optionsMatch = "true"
    item.hidden = false
    return true
  }

  const evaluateFolder = (item: HTMLLIElement): boolean => {
    const children = [
      ...(item.querySelectorAll(
        ":scope > .folder-outer > ul.content > li",
      ) as NodeListOf<HTMLLIElement>),
    ]
    children.forEach((child) => evaluateNode(child))
    item.dataset.optionsMatch = "true"
    item.hidden = false
    return true
  }

  const evaluateNode = (item: HTMLLIElement): boolean => {
    const nodeType = item.dataset.explorerNode
    if (nodeType === "folder") {
      return evaluateFolder(item)
    }
    return evaluateLeaf(item)
  }

  document.querySelectorAll<HTMLElement>(".explorer .explorer-ul").forEach((explorerList) => {
    const items = [...explorerList.children].filter(
      (child): child is HTMLLIElement => child instanceof HTMLLIElement,
    )
    items.forEach((item) => evaluateNode(item))
  })
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

function syncCurrentPageFilter() {
  const body = document.body
  const center = document.querySelector<HTMLElement>(".center")
  if (!center || !body) {
    return
  }

  const filterable = body.dataset.citationFilterable === "true"
  const claimCount = Number(body.dataset.claimCount ?? "0")
  const sourceIds = parseSourceIds(body.dataset.citationSources)
  const optionsOk = optionsMatchItem({ filterable, claimCount, sourceIds })
  const showNotice = optionFiltersActive() && filterable && !optionsOk

  let notice = center.querySelector<HTMLElement>("[data-current-options-empty]")
  if (!notice) {
    notice = document.createElement("div")
    notice.className = "options-filter-empty"
    notice.setAttribute("data-current-options-empty", "true")
    notice.hidden = true
    center.insertBefore(notice, center.firstChild)
  }
  notice.textContent =
    "Šis puslapis neatitinka pasirinktų teiginių filtrų, bet tiesiogiai atidaryti puslapiai vis tiek rodomi."
  notice.hidden = !showNotice
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
    if (state.sourceSelectionMode === "all") {
      row.hidden = false
      return
    }
    const supportingIds = parseSourceIds(row.dataset.supportingIds)
    row.hidden = !supportingIds.some((id) => visibleCitationIds.has(id))
  })

  document.querySelectorAll<HTMLElement>('[data-claims-table="true"]').forEach((table) => {
    const hasVisibleRows =
      table.querySelectorAll('[data-claim-row="true"]:not([hidden])').length > 0
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
  applyExplorerFilters()
  applyCitationFilters()
  syncCurrentPageFilter()
  syncPanelState()
  const event: CustomEventMap["quartz-options-change"] = new CustomEvent("quartz-options-change", {
    detail: {},
  })
  document.dispatchEvent(event)
}

function syncPanelState() {
  const maxValue = detectMaxClaimCount()
  const roots = document.querySelectorAll<HTMLElement>("[data-options-root]")
  roots.forEach((root) => {
    const range = root.querySelector<HTMLInputElement>("[data-options-quote-range]")
    const number = root.querySelector<HTMLInputElement>("[data-options-quote-number]")
    const selectedSummary = root.querySelector<HTMLElement>("[data-options-selected-summary]")
    if (range) {
      range.max = `${maxValue}`
      range.value = `${Math.min(state.minClaimCount, maxValue)}`
    }
    if (number) {
      number.value = `${state.minClaimCount}`
    }
    if (selectedSummary) {
      const selectedCount =
        state.sourceSelectionMode === "all" ? cachedSources.length : state.selectedSourceIds.length
      selectedSummary.textContent =
        state.sourceSelectionMode === "all" && cachedSources.length > 0
          ? `Pasirinkta: visos (${selectedCount})`
          : `Pasirinkta: ${selectedCount}`
    }

    root
      .querySelectorAll<HTMLInputElement>("[data-options-source-checkbox]")
      .forEach((checkbox) => {
        checkbox.checked = isSourceSelected(checkbox.value)
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

  list.innerHTML = visibleSources
    .map((source) => {
      const checked = isSourceSelected(source.id) ? 'checked="checked"' : ""
      return `
        <div class="options-panel-source-row">
          <label>
            <input type="checkbox" value="${source.id}" data-options-source-checkbox="" ${checked} />
            <span class="options-panel-source-title">${escapeOptionsHtml(source.title)}</span>
          </label>
          <span class="options-panel-source-count">${source.count}</span>
        </div>
      `
    })
    .join("")

  list.querySelectorAll<HTMLInputElement>("[data-options-source-checkbox]").forEach((checkbox) => {
    const onChange = () => {
      const currentSelection =
        state.sourceSelectionMode === "all"
          ? cachedSources.map((source) => source.id)
          : [...state.selectedSourceIds]
      if (checkbox.checked) {
        const nextSelection = [...new Set([...currentSelection, checkbox.value])]
        if (cachedSources.length > 0 && nextSelection.length >= cachedSources.length) {
          state.sourceSelectionMode = "all"
          state.selectedSourceIds = []
        } else {
          state.sourceSelectionMode = "custom"
          state.selectedSourceIds = nextSelection
        }
      } else {
        state.sourceSelectionMode = "custom"
        state.selectedSourceIds = currentSelection.filter((value) => value !== checkbox.value)
      }
      applyFilters()
    }
    checkbox.addEventListener("change", onChange)
    optionsWindow.addCleanup?.(() => checkbox.removeEventListener("change", onChange))
  })
}

function rerenderSourceLists() {
  document.querySelectorAll<HTMLElement>("[data-options-root]").forEach((root) => {
    renderSourceList(root, cachedSources)
  })
  applyFilters()
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
  const optionsRoot = root as OptionsRoot
  if (optionsRoot.__optionsPanelBound) {
    return
  }
  optionsRoot.__optionsPanelBound = true

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
    state.minClaimCount = Math.max(0, Number(range?.value ?? "0") || 0)
    applyFilters()
  }
  const onNumberInput = () => {
    state.minClaimCount = Math.max(0, Number(number?.value ?? "0") || 0)
    applyFilters()
  }
  const onSearchInput = () => renderSourceList(root, cachedSources)
  const onDocumentClick = (event: MouseEvent) => {
    const target = event.target
    if (!(target instanceof Node)) {
      return
    }
    if (!root.contains(target)) {
      setPanelOpen(root, false)
    }
  }

  toggle?.addEventListener("click", onToggle)
  close?.addEventListener("click", onClose)
  reset?.addEventListener("click", onReset)
  range?.addEventListener("input", onRangeInput)
  range?.addEventListener("change", onRangeInput)
  number?.addEventListener("input", onNumberInput)
  number?.addEventListener("change", onNumberInput)
  search?.addEventListener("input", onSearchInput)
  document.addEventListener("click", onDocumentClick)

  optionsWindow.addCleanup?.(() => toggle?.removeEventListener("click", onToggle))
  optionsWindow.addCleanup?.(() => close?.removeEventListener("click", onClose))
  optionsWindow.addCleanup?.(() => reset?.removeEventListener("click", onReset))
  optionsWindow.addCleanup?.(() => range?.removeEventListener("input", onRangeInput))
  optionsWindow.addCleanup?.(() => range?.removeEventListener("change", onRangeInput))
  optionsWindow.addCleanup?.(() => number?.removeEventListener("input", onNumberInput))
  optionsWindow.addCleanup?.(() => number?.removeEventListener("change", onNumberInput))
  optionsWindow.addCleanup?.(() => search?.removeEventListener("input", onSearchInput))
  optionsWindow.addCleanup?.(() => document.removeEventListener("click", onDocumentClick))
  optionsWindow.addCleanup?.(() => {
    optionsRoot.__optionsPanelBound = false
  })

  syncPanelState()
  renderSourceList(root, cachedSources)
}

function initOptionsPanels() {
  document.querySelectorAll<HTMLElement>("[data-options-root]").forEach((root) => initPanel(root))
  syncPanelState()
  applyFilters()
}

optionsWindow.applyQuartzOptionFilters = applyFilters
initOptionsPanels()

loadCitationSources()
  .then((sources) => {
    cachedSources = sources
    rerenderSourceLists()
  })
  .catch(() => {
    cachedSources = deriveSourcesFromDom()
    rerenderSourceLists()
  })
document.addEventListener("DOMContentLoaded", initOptionsPanels)
document.addEventListener("nav", initOptionsPanels)
