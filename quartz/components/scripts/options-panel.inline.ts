import {
  DEFAULT_SETTINGS_STATE,
  dispatchSettingsChange,
  loadSourceCatalog,
  readSettingsState,
  selectedSources,
  sourceMatchesSelection,
  writeSettingsState,
  type SettingsState,
  type SourceCatalogEntry,
} from "../../util/sourceSettings"

type OptionsWindow = Window &
  typeof globalThis & {
    applyQuartzOptionFilters?: () => void
    addCleanup?: (cleanup: () => void) => void
    loadGraphTopology?: () => Promise<{
      nodes?: Array<{ slug: string }>
      edges?: Array<{ from: string; to: string; sourceTitles?: string[] }>
    }>
  }

type OptionsRoot = HTMLElement & {
  __optionsPanelBound?: boolean
}

const optionsWindow = window as OptionsWindow
let state: SettingsState = readSettingsState()
let cachedSources: SourceCatalogEntry[] = []
let personParentheticalObserver: MutationObserver | null = null
let personParentheticalObserverScheduled = false
const originalRelationRows = new WeakMap<HTMLLIElement, string>()

function parseSourceIds(value: string | undefined): string[] {
  return (value ?? "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean)
}

function matchesSourceSelection(itemSourceIds: string[]): boolean {
  if (state.textSources.mode === "all" && state.textSources.rules.length === 0) return true
  return itemSourceIds.some((id) => {
    const entry = cachedSources.find((source) => source.id === id) ?? {
      id,
      title: id,
      channel: "text" as const,
      kind: "book" as const,
      objectCount: 0,
      claimCount: 0,
      quoteCount: 0,
      mediaCount: 0,
    }
    return sourceMatchesSelection(entry, state.textSources)
  })
}

function targetLooksLikePersonSlug(value: string | undefined | null): boolean {
  if (!value) {
    return false
  }
  try {
    const decoded = decodeURIComponent(value)
    return decoded.includes("objektai/asmenys/")
  } catch {
    return value.includes("objektai/asmenys/")
  }
}

function isPersonTitleElement(element: HTMLElement): boolean {
  if (element.classList.contains("article-title")) {
    return targetLooksLikePersonSlug(document.body.dataset.slug)
  }
  const anchor =
    element instanceof HTMLAnchorElement ? element : element.closest<HTMLAnchorElement>("a")
  if (anchor) {
    return (
      targetLooksLikePersonSlug(anchor.dataset.slug) ||
      targetLooksLikePersonSlug(anchor.dataset.for) ||
      targetLooksLikePersonSlug(anchor.id) ||
      targetLooksLikePersonSlug(anchor.getAttribute("href"))
    )
  }
  const resultCard = element.closest<HTMLElement>(".result-card")
  return targetLooksLikePersonSlug(resultCard?.id)
}

function wrapTrailingPersonParenthetical(element: HTMLElement) {
  if (element.dataset.personParentheticalWrapped === "true") {
    return
  }
  if (!isPersonTitleElement(element)) {
    return
  }
  if (element.querySelector(".person-title-parenthetical")) {
    element.dataset.personParentheticalWrapped = "true"
    return
  }
  const trailingText = [...element.childNodes]
    .reverse()
    .find(
      (node): node is Text => node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim()),
    )
  if (!trailingText || !trailingText.textContent) {
    return
  }
  const match = trailingText.textContent.match(/(\s+\([^()]+\))$/)
  if (!match || match.index === undefined) {
    return
  }
  const suffix = match[1]
  const prefix = trailingText.textContent.slice(0, match.index)
  const suffixSpan = document.createElement("span")
  suffixSpan.className = "person-title-parenthetical"
  suffixSpan.textContent = suffix
  trailingText.replaceWith(document.createTextNode(prefix), suffixSpan)
  element.dataset.personParentheticalWrapped = "true"
}

function applyPersonParentheticalDisplay() {
  document.documentElement.classList.toggle(
    "hide-person-parentheticals",
    !state.showPersonParentheticals,
  )
  document
    .querySelectorAll<HTMLElement>(".article-title, a.internal, .result-card .card-title")
    .forEach((element) => wrapTrailingPersonParenthetical(element))
}

function schedulePersonParentheticalDisplay() {
  if (personParentheticalObserverScheduled) {
    return
  }
  personParentheticalObserverScheduled = true
  window.setTimeout(() => {
    personParentheticalObserverScheduled = false
    applyPersonParentheticalDisplay()
  }, 0)
}

function initPersonParentheticalObserver() {
  if (personParentheticalObserver || !document.body) {
    return
  }
  personParentheticalObserver = new MutationObserver(() => schedulePersonParentheticalDisplay())
  personParentheticalObserver.observe(document.body, { childList: true, subtree: true })
  optionsWindow.addCleanup?.(() => {
    personParentheticalObserver?.disconnect()
    personParentheticalObserver = null
  })
}

function optionFiltersActive(): boolean {
  return state.minClaimCount > 0 || state.textSources.mode === "custom" || state.textSources.rules.length > 0
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

function updateObjectListSummaries() {
  document.querySelectorAll<HTMLElement>('[data-object-list-controls="true"]').forEach((control) => {
    const summary = control.querySelector<HTMLElement>("[data-object-list-summary]")
    if (!summary) {
      return
    }
    const root = control.parentElement ?? document.body
    const entries = [
      ...root.querySelectorAll<HTMLLIElement>(
        'ul.section-ul[data-object-list-sortable="true"] > li.section-li',
      ),
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
    const claimCount = Number(entry.dataset.claimCount ?? "0")
    const sourceIds = parseSourceIds(entry.dataset.citationSources)
    const optionsOk = filterable ? optionsMatchItem({ filterable, claimCount, sourceIds }) : true
    const objectTagOk = entry.dataset.objectTagMatch !== "false"
    entry.dataset.optionsMatch = optionsOk ? "true" : "false"
    entry.hidden = !(periodOk && optionsOk && objectTagOk)
  })
  updatePeriodSummaries()
  syncPageListGroups()
  updateObjectListSummaries()
}

function applyExplorerFilters() {
  const evaluateLeaf = (item: HTMLLIElement): boolean => {
    const filterable = item.dataset.citationFilterable === "true"
    if (!filterable) {
      item.dataset.optionsMatch = "true"
      item.hidden = false
      return true
    }
    const claimCount = Number(item.dataset.claimCount ?? "0")
    const sourceIds = parseSourceIds(item.dataset.citationSources)
    const optionsOk = optionsMatchItem({ filterable, claimCount, sourceIds })
    item.dataset.optionsMatch = optionsOk ? "true" : "false"
    item.hidden = !optionsOk
    return optionsOk
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
    if (state.textSources.mode === "all" && state.textSources.rules.length === 0) {
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

function applyPrimaryMediaFilter() {
  document.querySelectorAll<HTMLElement>("[data-media-source-id].object-primary-media").forEach((section) => {
    const sourceId = section.dataset.mediaSourceId ?? "media-other"
    const entry = cachedSources.find((source) => source.id === sourceId)
    section.hidden = entry ? !sourceMatchesSelection(entry, state.mediaSources) : false
  })
}

function normalizedSlug(value: string): string {
  return decodeURIComponent(value)
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\//, "")
    .replace(/\.html$/, "")
    .replace(/\/$/, "")
}

async function applyRelationFilters() {
  const heading = document.querySelector<HTMLElement>("#ryšiai, #rysiai")
  if (!heading) return
  const rows: HTMLLIElement[] = []
  let sibling = heading.nextElementSibling
  while (sibling && !/^H[1-6]$/.test(sibling.tagName)) {
    rows.push(...sibling.querySelectorAll<HTMLLIElement>(":scope > li, :scope > ul > li"))
    sibling = sibling.nextElementSibling
  }
  if (state.textSources.mode === "all" && state.textSources.rules.length === 0) {
    rows.forEach((row) => {
      const original = originalRelationRows.get(row)
      if (original !== undefined) row.innerHTML = original
      row.hidden = false
    })
    return
  }
  const topology = await optionsWindow.loadGraphTopology?.().catch(() => ({ nodes: [], edges: [] })) ?? { nodes: [], edges: [] }
  const currentSlug = normalizedSlug(document.body.dataset.slug ?? "")
  const matchingNode = (topology.nodes ?? []).find((node) => normalizedSlug(node.slug) === currentSlug)
  if (!matchingNode) {
    rows.forEach((row) => { row.hidden = true })
    return
  }
  const selected = new Set(selectedSources(cachedSources, "text", state.textSources).map((source) => source.title))
  const nodeEdges = (topology.edges ?? []).filter((edge) => normalizedSlug(edge.from) === currentSlug)
  rows.forEach((row) => {
    if (!originalRelationRows.has(row)) originalRelationRows.set(row, row.innerHTML)
    const original = originalRelationRows.get(row)
    if (original !== undefined) row.innerHTML = original

    const anchors = [...row.querySelectorAll<HTMLAnchorElement>(":scope > a.internal")]
    const edgeForAnchor = (anchor: HTMLAnchorElement) => {
      const target = normalizedSlug(anchor.dataset.slug ?? anchor.getAttribute("href") ?? "")
      return nodeEdges.filter((edge) => normalizedSlug(edge.to) === target)
    }
    const visibleAnchors = anchors.filter((anchor) =>
      edgeForAnchor(anchor).some((edge) =>
        (edge.sourceTitles ?? []).some((sourceTitle) => selected.has(sourceTitle)),
      ),
    )

    const childNodes = [...row.childNodes]
    const firstAnchorIndex = childNodes.findIndex((child) => child instanceof HTMLAnchorElement)
    const isGroupedTargetList =
      firstAnchorIndex > 0 &&
      childNodes.slice(firstAnchorIndex).every((child) =>
        child instanceof HTMLAnchorElement ||
        (child.nodeType === Node.TEXT_NODE && /^\s*[,;]?\s*$/.test(child.textContent ?? "")),
      )

    if (isGroupedTargetList) {
      const prefix = childNodes.slice(0, firstAnchorIndex).map((child) => child.cloneNode(true))
      const targets: Node[] = []
      visibleAnchors.forEach((anchor, index) => {
        if (index > 0) targets.push(document.createTextNode(", "))
        targets.push(anchor.cloneNode(true))
      })
      row.replaceChildren(...prefix, ...targets)
      row.hidden = visibleAnchors.length === 0
      return
    }

    const matchingEdges = anchors.flatMap((anchor) => edgeForAnchor(anchor))
    row.hidden =
      matchingEdges.length === 0 ||
      !matchingEdges.some((edge) =>
        (edge.sourceTitles ?? []).some((sourceTitle) => selected.has(sourceTitle)),
      )
  })
}

function applyFilters() {
  state = { ...state, minClaimCount: Math.max(0, Number(state.minClaimCount) || 0) }
  writeSettingsState(state, cachedSources)
  applyPersonParentheticalDisplay()
  applyListFilters()
  applyExplorerFilters()
  applyCitationFilters()
  applyPrimaryMediaFilter()
  void applyRelationFilters()
  syncCurrentPageFilter()
  syncPanelState()
  dispatchSettingsChange()
}

function syncPanelState() {
  const maxValue = detectMaxClaimCount()
  const roots = document.querySelectorAll<HTMLElement>("[data-options-root]")
  roots.forEach((root) => {
    const range = root.querySelector<HTMLInputElement>("[data-options-quote-range]")
    const number = root.querySelector<HTMLInputElement>("[data-options-quote-number]")
    const personParentheticals = root.querySelector<HTMLInputElement>(
      "[data-options-person-parentheticals]",
    )
    const selectedSummary = root.querySelector<HTMLElement>("[data-options-selected-summary]")
    const activeCount = root.querySelector<HTMLElement>("[data-options-active-count]")
    if (range) {
      range.max = `${maxValue}`
      range.value = `${Math.min(state.minClaimCount, maxValue)}`
    }
    if (number) {
      number.value = `${state.minClaimCount}`
    }
    if (personParentheticals) {
      personParentheticals.checked = state.showPersonParentheticals
    }
    if (selectedSummary) {
      const textSources = cachedSources.filter((source) => source.channel === "text")
      const selectedCount = selectedSources(cachedSources, "text", state.textSources).length
      selectedSummary.textContent = selectedCount === textSources.length
        ? `Pasirinkti visi (${selectedCount})`
        : `Pasirinkta ${selectedCount} iš ${textSources.length}`
      if (activeCount) {
        const active = state.minClaimCount > 0 || selectedCount !== textSources.length
        activeCount.hidden = !active
        activeCount.textContent = String((state.minClaimCount > 0 ? 1 : 0) + (selectedCount !== textSources.length ? 1 : 0))
      }
    }
  })
}

function rerenderSourceLists() {
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
  const personParentheticals = root.querySelector<HTMLInputElement>(
    "[data-options-person-parentheticals]",
  )

  const onToggle = () => {
    const popover = root.querySelector<HTMLElement>("[data-options-popover]")
    setPanelOpen(root, Boolean(popover?.hidden))
  }
  const onClose = () => setPanelOpen(root, false)
  const onReset = () => {
    state = structuredClone(DEFAULT_SETTINGS_STATE)
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
  const onPersonParentheticalsChange = () => {
    state.showPersonParentheticals = personParentheticals?.checked !== false
    applyFilters()
  }
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
  personParentheticals?.addEventListener("change", onPersonParentheticalsChange)
  document.addEventListener("click", onDocumentClick)

  optionsWindow.addCleanup?.(() => toggle?.removeEventListener("click", onToggle))
  optionsWindow.addCleanup?.(() => close?.removeEventListener("click", onClose))
  optionsWindow.addCleanup?.(() => reset?.removeEventListener("click", onReset))
  optionsWindow.addCleanup?.(() => range?.removeEventListener("input", onRangeInput))
  optionsWindow.addCleanup?.(() => range?.removeEventListener("change", onRangeInput))
  optionsWindow.addCleanup?.(() => number?.removeEventListener("input", onNumberInput))
  optionsWindow.addCleanup?.(() => number?.removeEventListener("change", onNumberInput))
  optionsWindow.addCleanup?.(() =>
    personParentheticals?.removeEventListener("change", onPersonParentheticalsChange),
  )
  optionsWindow.addCleanup?.(() => document.removeEventListener("click", onDocumentClick))
  optionsWindow.addCleanup?.(() => {
    optionsRoot.__optionsPanelBound = false
  })

  syncPanelState()
}

function initOptionsPanels() {
  initPersonParentheticalObserver()
  document.querySelectorAll<HTMLElement>("[data-options-root]").forEach((root) => initPanel(root))
  syncPanelState()
  applyFilters()
}

optionsWindow.applyQuartzOptionFilters = applyFilters
initOptionsPanels()

loadSourceCatalog()
  .then((sources) => {
    cachedSources = sources
    rerenderSourceLists()
  })
  .catch(() => {
    cachedSources = []
    rerenderSourceLists()
  })

document.addEventListener("quartz-settings-change", () => {
  state = readSettingsState()
  applyPersonParentheticalDisplay()
  syncPanelState()
})
document.addEventListener("DOMContentLoaded", initOptionsPanels)
document.addEventListener("nav", initOptionsPanels)
