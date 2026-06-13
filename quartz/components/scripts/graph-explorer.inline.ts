import {
  SimulationLinkDatum,
  SimulationNodeDatum,
  drag,
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
  zoom,
  zoomIdentity,
} from "d3"
import type {
  GraphExplorerIndexDetails,
  GraphExplorerLinkDetails,
} from "../../plugins/emitters/contentIndex"
import { FullSlug, SimpleSlug, getFullSlug, resolveRelative, simplifySlug } from "../../util/path"

type ExplorerRuntime = typeof globalThis & {
  loadGraphExplorerIndex?: () => Promise<Record<FullSlug, GraphExplorerIndexDetails>>
  fetchCitationSources?: Promise<CitationSourceRegistryEntry[]>
  spaNavigate?: (url: URL) => void
}

type CitationSourceRegistryEntry = {
  id: string
  title: string
  objectCount?: number
  quoteCount?: number
  count?: number
}

type FilterState = {
  focus: SimpleSlug | ""
  q: string
  preset: string
  types: string[]
  minClaims: number
  minQuotes: number
  source: string
  from: number | null
  to: number | null
  depth: number
  maxNodes: number
  showPlaces: boolean
  showTopics: boolean
  panel: "details" | "page" | "hidden"
}

type RuntimeNode = GraphExplorerIndexDetails &
  SimulationNodeDatum & {
    id: SimpleSlug
    degree: number
    globalDegree: number
    hop: number
    score: number
  }

type RuntimeLink = SimulationLinkDatum<RuntimeNode> & {
  source: RuntimeNode
  target: RuntimeNode
  details: GraphExplorerLinkDetails
}

const runtime = globalThis as ExplorerRuntime
let cachedCitationSources: CitationSourceRegistryEntry[] | null = null

const defaultState: FilterState = {
  focus: "",
  q: "",
  preset: "important",
  types: [],
  minClaims: 3,
  minQuotes: 1,
  source: "",
  from: null,
  to: null,
  depth: -1,
  maxNodes: 250,
  showPlaces: false,
  showTopics: false,
  panel: "details",
}

const typeColors: Record<string, string> = {
  asmuo: "#286456",
  autorius: "#5d6f63",
  ivykis: "#923120",
  grupe: "#9b7b49",
  vieta: "#557d8b",
  daiktas: "#735a91",
  paprotys: "#b66941",
  posakis: "#8d4d72",
  zodyno_irasas: "#626262",
  tema: "#445f8f",
}

function parseNumber(value: string | null, fallback: number): number {
  if (value == null || value === "") {
    return fallback
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseOptionalNumber(value: string | null): number | null {
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function readState(): FilterState {
  const params = new URLSearchParams(window.location.search)
  const panel = params.get("panel")
  return {
    focus: (params.get("focus") ? simplifySlug(params.get("focus") as FullSlug) : "") as
      | SimpleSlug
      | "",
    q: params.get("q") ?? "",
    preset: params.get("preset") ?? defaultState.preset,
    types: (params.get("types") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    minClaims: parseNumber(params.get("minClaims"), defaultState.minClaims),
    minQuotes: parseNumber(params.get("minQuotes"), defaultState.minQuotes),
    source: params.get("source") ?? "",
    from: parseOptionalNumber(params.get("from")),
    to: parseOptionalNumber(params.get("to")),
    depth: parseNumber(params.get("depth"), defaultState.depth),
    maxNodes: parseNumber(params.get("maxNodes"), defaultState.maxNodes),
    showPlaces: params.get("showPlaces") === "1",
    showTopics: params.get("showTopics") === "1",
    panel: panel === "page" || panel === "hidden" ? panel : "details",
  }
}

function writeState(state: FilterState) {
  const params = new URLSearchParams()
  if (state.focus) params.set("focus", state.focus)
  if (state.q) params.set("q", state.q)
  if (state.preset !== defaultState.preset) params.set("preset", state.preset)
  if (state.types.length > 0) params.set("types", state.types.join(","))
  if (state.minClaims !== defaultState.minClaims) params.set("minClaims", String(state.minClaims))
  if (state.minQuotes !== defaultState.minQuotes) params.set("minQuotes", String(state.minQuotes))
  if (state.source) params.set("source", state.source)
  if (state.from !== null) params.set("from", String(state.from))
  if (state.to !== null) params.set("to", String(state.to))
  if (state.depth !== defaultState.depth) params.set("depth", String(state.depth))
  if (state.maxNodes !== defaultState.maxNodes) params.set("maxNodes", String(state.maxNodes))
  if (state.showPlaces) params.set("showPlaces", "1")
  if (state.showTopics) params.set("showTopics", "1")
  if (state.panel !== defaultState.panel) params.set("panel", state.panel)
  const query = params.toString()
  window.history.replaceState(null, "", query ? `${window.location.pathname}?${query}` : window.location.pathname)
}

function normalizedText(value: string | undefined): string {
  return (value ?? "").toLocaleLowerCase("lt-LT")
}

function normalizeCitationSources(sources: CitationSourceRegistryEntry[]): CitationSourceRegistryEntry[] {
  return sources
    .filter(
      (source) =>
        typeof source?.id === "string" &&
        source.id.trim().length > 0 &&
        typeof source?.title === "string" &&
        source.title.trim().length > 0,
    )
    .map((source) => {
      const quoteCount = Number.isFinite(source.quoteCount)
        ? Math.max(0, Number(source.quoteCount))
        : Number.isFinite(source.count)
          ? Math.max(0, Number(source.count))
          : 0
      return {
        id: source.id.trim(),
        title: source.title.trim(),
        objectCount: Number.isFinite(source.objectCount)
          ? Math.max(0, Number(source.objectCount))
          : 0,
        quoteCount,
        count: quoteCount,
      }
    })
    .sort((a, b) => {
      const objectDiff = Number(b.objectCount ?? 0) - Number(a.objectCount ?? 0)
      if (objectDiff !== 0) return objectDiff
      const quoteDiff = Number(b.quoteCount ?? b.count ?? 0) - Number(a.quoteCount ?? a.count ?? 0)
      return quoteDiff === 0 ? a.title.localeCompare(b.title, "lt", { sensitivity: "base" }) : quoteDiff
    })
}

async function loadCitationSources(): Promise<CitationSourceRegistryEntry[]> {
  if (cachedCitationSources) return cachedCitationSources
  try {
    const resolved = await runtime.fetchCitationSources
    cachedCitationSources = normalizeCitationSources(Array.isArray(resolved) ? resolved : [])
  } catch (error) {
    console.warn("Citation source registry failed to load for graph explorer.", error)
    cachedCitationSources = []
  }
  return cachedCitationSources
}

function sourceMatches(node: GraphExplorerIndexDetails, selectedSource: string): boolean {
  if (!selectedSource) return true
  const sourceIds = node.citationSourceIds ?? []
  if (sourceIds.includes(selectedSource)) return true

  const needle = normalizedText(selectedSource)
  const sources = normalizedText([...(node.citationSourceIds ?? []), ...(node.citationSourceTitles ?? [])].join(" "))
  return sources.includes(needle)
}

function graphExplorerIndexUrls(): string[] {
  const urls: string[] = []
  const push = (url: URL) => {
    const value = url.toString()
    if (!urls.includes(value)) urls.push(value)
  }

  const prescript = [...document.scripts].find((script) => script.src.includes("prescript.js"))
  if (prescript?.src) {
    const sourceUrl = new URL(prescript.src)
    push(new URL(`static/graphExplorerIndex.json${sourceUrl.search}`, sourceUrl))
    push(new URL("static/graphExplorerIndex.json", sourceUrl))
  }
  push(new URL("../static/graphExplorerIndex.json", window.location.href))

  const cacheBusted = new URL(urls[0] ?? new URL("../static/graphExplorerIndex.json", window.location.href).toString())
  cacheBusted.searchParams.set("reload", String(Date.now()))
  push(cacheBusted)
  return urls
}

function assertExplorerIndex(value: unknown): Record<FullSlug, GraphExplorerIndexDetails> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("graphExplorerIndex.json is not an object")
  }
  if (Object.keys(value as Record<string, unknown>).length === 0) {
    throw new Error("graphExplorerIndex.json is empty")
  }
  return value as Record<FullSlug, GraphExplorerIndexDetails>
}

async function fetchExplorerIndexUrl(
  url: string,
  cache: RequestCache,
): Promise<Record<FullSlug, GraphExplorerIndexDetails>> {
  const response = await fetch(url, { cache })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }
  return assertExplorerIndex(await response.json())
}

async function loadExplorerIndex(): Promise<Record<FullSlug, GraphExplorerIndexDetails>> {
  if (runtime.loadGraphExplorerIndex) {
    try {
      return assertExplorerIndex(await runtime.loadGraphExplorerIndex())
    } catch (error) {
      console.warn("Bundled graph explorer index loader failed, retrying directly.", error)
    }
  }

  let lastError: unknown
  const urls = graphExplorerIndexUrls()
  for (const [index, url] of urls.entries()) {
    try {
      return await fetchExplorerIndexUrl(url, index === 0 ? "force-cache" : "no-store")
    } catch (error) {
      lastError = error
      console.warn("Graph explorer index fetch failed.", { url, error })
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Failed to load graph explorer index")
}

function nodeType(node: GraphExplorerIndexDetails): string {
  if (node.slug.startsWith("temos/")) return "tema"
  if (node.slug.startsWith("objektai/ivykiai/")) return "ivykis"
  if (node.slug.startsWith("objektai/grupes/")) return "grupe"
  if (node.slug.startsWith("objektai/vietos/")) return "vieta"
  if (node.slug.startsWith("objektai/daiktai/")) return "daiktas"
  if (node.slug.startsWith("objektai/paprociai/")) return "paprotys"
  if (node.slug.startsWith("objektai/posakiai/")) return "posakis"
  if (node.slug.startsWith("objektai/zodynas/")) return "zodyno_irasas"
  if (node.slug.startsWith("objektai/autoriai/")) return "autorius"
  return node.type || "asmuo"
}

function graphAllowed(node: GraphExplorerIndexDetails, state: FilterState): boolean {
  if (node.slug.startsWith("laikotarpiai/")) return false
  if (node.slug.startsWith("objektai/saltiniai/")) return false
  if (node.slug.startsWith("objektai/vietos/") && !state.showPlaces) return false
  if (node.slug.startsWith("temos/") && !state.showTopics && state.preset !== "topics") return false
  return true
}

function dateOverlaps(node: GraphExplorerIndexDetails, from: number | null, to: number | null): boolean {
  if (from === null && to === null) return true
  if (node.dateStart === undefined && node.dateEnd === undefined) return false
  const start = node.dateStart ?? node.dateEnd!
  const end = node.dateEnd ?? node.dateStart!
  if (from !== null && end < from) return false
  if (to !== null && start > to) return false
  return true
}

function matchesPreset(node: GraphExplorerIndexDetails, state: FilterState): boolean {
  const title = normalizedText(node.title)
  const tags = normalizedText((node.tags ?? []).join(" "))
  const periods = normalizedText([...(node.centuries ?? []), ...(node.periodGroups ?? [])].join(" "))
  switch (state.preset) {
    case "vytautas":
      return title.includes("vytaut") || tags.includes("vytaut")
    case "ldk":
      return periods.includes("ldk") || title.includes("lietuvos did") || tags.includes("ldk")
    case "xx":
      return (node.centuries ?? []).includes("XX") || dateOverlaps(node, 1901, 2000)
    case "people-events": {
      const kind = nodeType(node)
      return kind === "asmuo" || kind === "autorius" || kind === "ivykis"
    }
    case "events":
      return nodeType(node) === "ivykis"
    case "topics":
      return node.slug.startsWith("temos/")
    default:
      return true
  }
}

function passesFilters(node: GraphExplorerIndexDetails, state: FilterState, ignoreVolume = false): boolean {
  if (!graphAllowed(node, state)) return false
  const kind = nodeType(node)
  if (state.types.length > 0 && !state.types.includes(kind)) return false
  if (!matchesPreset(node, state)) return false
  if (!ignoreVolume && node.claimCount < state.minClaims && node.quoteCount < state.minQuotes) {
    return false
  }
  if (!sourceMatches(node, state.source)) return false
  if (!dateOverlaps(node, state.from, state.to)) return false
  if (state.q) {
    const needle = normalizedText(state.q)
    const haystack = normalizedText(
      [node.title, node.summary, ...(node.tags ?? []), ...(node.citationSourceTitles ?? [])].join(" "),
    )
    if (!haystack.includes(needle)) return false
  }
  return true
}

function passesFocusTraversalFilters(node: GraphExplorerIndexDetails, state: FilterState): boolean {
  if (!graphAllowed(node, state)) return false
  if (!dateOverlaps(node, state.from, state.to)) return false
  if (!sourceMatches(node, state.source)) return false
  return true
}

function scoreNode(node: GraphExplorerIndexDetails, degree: number): number {
  return node.claimCount + node.quoteCount * 1.8 + degree * 0.35
}

function resolveFocus(
  nodes: Map<SimpleSlug, GraphExplorerIndexDetails>,
  state: FilterState,
): SimpleSlug | "" {
  if (state.focus && nodes.has(state.focus)) return state.focus
  if (state.focus) {
    const bySimplified = [...nodes.keys()].find((slug) => slug === simplifySlug(state.focus as FullSlug))
    if (bySimplified) return bySimplified
  }
  const query = state.q || (state.preset === "vytautas" ? "Vytautas" : "")
  if (!query) return ""
  const needle = normalizedText(query)
  return (
    [...nodes.entries()].find(([, node]) => normalizedText(node.title) === needle)?.[0] ??
    [...nodes.entries()].find(([, node]) => normalizedText(node.title).includes(needle))?.[0] ??
    ""
  )
}

function buildVisibleGraph(
  nodesBySlug: Map<SimpleSlug, GraphExplorerIndexDetails>,
  state: FilterState,
): { nodes: RuntimeNode[]; links: RuntimeLink[]; focus: SimpleSlug | "" } {
  const adjacency = new Map<SimpleSlug, Set<SimpleSlug>>()
  const linkDetails = new Map<string, GraphExplorerLinkDetails>()
  for (const [source, node] of nodesBySlug) {
    for (const link of node.links ?? []) {
      const target = simplifySlug(link.target as FullSlug)
      if (!nodesBySlug.has(target)) continue
      if (!graphAllowed(nodesBySlug.get(target)!, state) || !graphAllowed(node, state)) continue
      adjacency.set(source, (adjacency.get(source) ?? new Set()).add(target))
      adjacency.set(target, (adjacency.get(target) ?? new Set()).add(source))
      linkDetails.set(`${source} ${target}`, link)
      linkDetails.set(`${target} ${source}`, {
        ...link,
        target: source as unknown as FullSlug,
        targetTitle: node.title,
        targetType: node.type,
      })
    }
  }

  const focus = resolveFocus(nodesBySlug, state)
  let selected = new Set<SimpleSlug>()
  const distances = new Map<SimpleSlug, number>()
  if (focus && state.depth >= 0) {
    selected.add(focus)
    distances.set(focus, 0)
    let frontier = new Set<SimpleSlug>([focus])
    for (let step = 0; step < state.depth; step++) {
      const next = new Set<SimpleSlug>()
      for (const slug of frontier) {
        for (const neighbour of adjacency.get(slug) ?? []) {
          const node = nodesBySlug.get(neighbour)
          if (node && passesFocusTraversalFilters(node, state)) {
            next.add(neighbour)
            selected.add(neighbour)
            if (!distances.has(neighbour)) {
              distances.set(neighbour, step + 1)
            }
          }
        }
      }
      frontier = next
    }
  } else {
    for (const [slug, node] of nodesBySlug) {
      if (passesFilters(node, state)) {
        selected.add(slug)
      }
    }
  }

  if (selected.size > state.maxNodes) {
    selected = new Set(
      [...selected]
        .sort((a, b) => {
          const aNode = nodesBySlug.get(a)!
          const bNode = nodesBySlug.get(b)!
          const distanceDiff = (distances.get(a) ?? Number.POSITIVE_INFINITY) - (distances.get(b) ?? Number.POSITIVE_INFINITY)
          if (distanceDiff !== 0) return distanceDiff
          const diff =
            scoreNode(bNode, adjacency.get(b)?.size ?? 0) - scoreNode(aNode, adjacency.get(a)?.size ?? 0)
          return diff === 0 ? aNode.title.localeCompare(bNode.title, "lt") : diff
        })
        .slice(0, state.maxNodes),
    )
    if (focus) selected.add(focus)
  }

  const runtimeNodes: RuntimeNode[] = [...selected].map((slug) => {
    const node = nodesBySlug.get(slug)!
    const degree = [...(adjacency.get(slug) ?? [])].filter((target) => selected.has(target)).length
    const globalDegree = adjacency.get(slug)?.size ?? 0
    return {
      ...node,
      id: slug,
      degree,
      globalDegree,
      hop: distances.get(slug) ?? -1,
      score: scoreNode(node, globalDegree),
    }
  })
  const runtimeBySlug = new Map(runtimeNodes.map((node) => [node.id, node]))
  const runtimeLinks: RuntimeLink[] = []
  const seenLinks = new Set<string>()
  for (const source of selected) {
    for (const target of adjacency.get(source) ?? []) {
      if (!selected.has(target)) continue
      if (focus && state.depth >= 0) {
        const sourceDistance = distances.get(source)
        const targetDistance = distances.get(target)
        if (
          sourceDistance === undefined ||
          targetDistance === undefined ||
          Math.abs(sourceDistance - targetDistance) !== 1
        ) {
          continue
        }
      }
      const pairKey = [source, target].sort().join(" ")
      if (seenLinks.has(pairKey)) continue
      seenLinks.add(pairKey)
      const details = linkDetails.get(`${source} ${target}`)
      if (!details) continue
      runtimeLinks.push({
        source: runtimeBySlug.get(source)!,
        target: runtimeBySlug.get(target)!,
        details,
      })
    }
  }
  return { nodes: runtimeNodes, links: runtimeLinks, focus }
}

function radius(node: RuntimeNode, focus: SimpleSlug | "" = ""): number {
  const base = Math.min(22, Math.max(5, 4 + Math.log1p(node.score) * 2.15))
  return node.id === focus ? Math.min(28, base + 5) : base
}

function relativePageUrl(slug: SimpleSlug): URL {
  const current = getFullSlug(window)
  const href = resolveRelative(current, slug)
  return new URL(href, window.location.toString())
}

function pageFetchUrls(slug: SimpleSlug): URL[] {
  const cleanUrl = relativePageUrl(slug)
  const htmlUrl = new URL(cleanUrl.toString())
  if (!htmlUrl.pathname.endsWith("/") && !htmlUrl.pathname.endsWith(".html")) {
    htmlUrl.pathname = `${htmlUrl.pathname}.html`
  }
  return htmlUrl.toString() === cleanUrl.toString() ? [cleanUrl] : [cleanUrl, htmlUrl]
}

function panelModeControls(state: FilterState): string {
  const button = (mode: FilterState["panel"], label: string) =>
    `<button type="button" data-panel-mode="${mode}" class="${state.panel === mode ? "is-active" : ""}">${label}</button>`
  return `<div class="graph-explorer-panel-modes" role="group" aria-label="Panelio režimas">${button("details", "Detalės")}${button("page", "Puslapis")}${button("hidden", "Slėpti")}</div>`
}

function bindPanelModeControls(panel: HTMLElement, setPanelMode: (mode: FilterState["panel"]) => void) {
  panel.querySelectorAll<HTMLButtonElement>("[data-panel-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.panelMode
      if (mode === "details" || mode === "page" || mode === "hidden") {
        setPanelMode(mode)
      }
    })
  })
}

function normalizePanelContent(content: Element, pageUrl: URL): HTMLElement {
  const clone = content.cloneNode(true) as HTMLElement
  clone.querySelectorAll("script, style, iframe, canvas, .popover, .graph, .breadcrumbs").forEach((el) => el.remove())
  clone.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
    const href = link.getAttribute("href")
    if (!href) return
    link.href = new URL(href, pageUrl).toString()
    link.dataset.noPopover = "true"
  })
  clone.querySelectorAll<HTMLImageElement>("img[src]").forEach((img) => {
    const src = img.getAttribute("src")
    if (!src) return
    img.src = new URL(src, pageUrl).toString()
  })
  return clone
}

async function renderPagePanel(
  panel: HTMLElement,
  node: RuntimeNode,
  state: FilterState,
  setPanelMode: (mode: FilterState["panel"]) => void,
) {
  const pageUrls = pageFetchUrls(node.id)
  const pageUrl = pageUrls[0]
  panel.innerHTML = `
    ${panelModeControls(state)}
    <div class="graph-explorer-panel-header">
      <p>${nodeType(node)}</p>
      <h2>${node.title}</h2>
    </div>
    <p class="graph-explorer-loading">Kraunamas puslapis...</p>
  `
  bindPanelModeControls(panel, setPanelMode)
  try {
    let response: Response | null = null
    let responseUrl = pageUrl
    for (const candidateUrl of pageUrls) {
      const candidateResponse = await fetch(candidateUrl, { cache: "force-cache" })
      if (candidateResponse.ok) {
        response = candidateResponse
        responseUrl = candidateUrl
        break
      }
    }
    if (!response) {
      panel.querySelector(".graph-explorer-loading")!.textContent = "Nepavyko rasti puslapio turinio."
      return
    }
    const html = new DOMParser().parseFromString(await response.text(), "text/html")
    const article = html.querySelector("article.popover-hint") ?? html.querySelector("article") ?? html.querySelector("main")
    if (!article) {
      panel.querySelector(".graph-explorer-loading")!.textContent = "Nepavyko rasti puslapio turinio."
      return
    }
    const content = normalizePanelContent(article, responseUrl)
    content.classList.add("graph-explorer-page-content")
    panel.querySelector(".graph-explorer-loading")?.replaceWith(content)
  } catch (error) {
    console.error(error)
    const loading = panel.querySelector(".graph-explorer-loading")
    if (loading) loading.textContent = "Nepavyko įkelti puslapio."
  }
}

function setFormState(root: HTMLElement, state: FilterState) {
  const form = root.querySelector("[data-graph-filters]") as HTMLFormElement | null
  if (!form) return
  ;(form.elements.namedItem("q") as HTMLInputElement).value = state.q
  ;(form.elements.namedItem("preset") as HTMLSelectElement).value = state.preset
  ;(form.elements.namedItem("minClaims") as HTMLInputElement).value = String(state.minClaims)
  ;(form.elements.namedItem("minQuotes") as HTMLInputElement).value = String(state.minQuotes)
  const sourceSelect = form.elements.namedItem("source") as HTMLSelectElement
  if (state.source && ![...sourceSelect.options].some((option) => option.value === state.source)) {
    sourceSelect.append(new Option(`Senas filtras: ${state.source}`, state.source))
  }
  sourceSelect.value = state.source
  ;(form.elements.namedItem("from") as HTMLInputElement).value = state.from === null ? "" : String(state.from)
  ;(form.elements.namedItem("to") as HTMLInputElement).value = state.to === null ? "" : String(state.to)
  ;(form.elements.namedItem("depth") as HTMLSelectElement).value = String(state.depth)
  ;(form.elements.namedItem("maxNodes") as HTMLInputElement).value = String(state.maxNodes)
  ;(form.elements.namedItem("showPlaces") as HTMLInputElement).checked = state.showPlaces
  ;(form.elements.namedItem("showTopics") as HTMLInputElement).checked = state.showTopics
  const types = form.elements.namedItem("types") as HTMLSelectElement
  for (const option of types.options) {
    option.selected = state.types.includes(option.value)
  }
}

function readFormState(root: HTMLElement, previous: FilterState): FilterState {
  const form = root.querySelector("[data-graph-filters]") as HTMLFormElement
  const types = form.elements.namedItem("types") as HTMLSelectElement
  return {
    ...previous,
    q: (form.elements.namedItem("q") as HTMLInputElement).value.trim(),
    preset: (form.elements.namedItem("preset") as HTMLSelectElement).value,
    minClaims: Math.max(0, parseNumber((form.elements.namedItem("minClaims") as HTMLInputElement).value, 0)),
    minQuotes: Math.max(0, parseNumber((form.elements.namedItem("minQuotes") as HTMLInputElement).value, 0)),
    source: (form.elements.namedItem("source") as HTMLSelectElement).value.trim(),
    from: parseOptionalNumber((form.elements.namedItem("from") as HTMLInputElement).value),
    to: parseOptionalNumber((form.elements.namedItem("to") as HTMLInputElement).value),
    depth: parseNumber((form.elements.namedItem("depth") as HTMLSelectElement).value, -1),
    maxNodes: Math.max(25, parseNumber((form.elements.namedItem("maxNodes") as HTMLInputElement).value, 250)),
    showPlaces: (form.elements.namedItem("showPlaces") as HTMLInputElement).checked,
    showTopics: (form.elements.namedItem("showTopics") as HTMLInputElement).checked,
    types: [...types.selectedOptions].map((option) => option.value),
  }
}

function sourceOptionLabel(source: CitationSourceRegistryEntry): string {
  const objectCount = Number(source.objectCount ?? 0)
  const quoteCount = Number(source.quoteCount ?? source.count ?? 0)
  return objectCount > 0 || quoteCount > 0
    ? `${source.title} — ${objectCount} ob. (${quoteCount} cit.)`
    : source.title
}

async function populateSourceSelect(root: HTMLElement, state: FilterState) {
  const selectElement = root.querySelector<HTMLSelectElement>("[data-source-select]")
  if (!selectElement) return
  const sources = await loadCitationSources()
  const selected = state.source
  selectElement.replaceChildren(new Option("Visos knygos", ""))
  for (const source of sources) {
    selectElement.append(new Option(sourceOptionLabel(source), source.id))
  }
  if (selected && !sources.some((source) => source.id === selected)) {
    selectElement.append(new Option(`Senas filtras: ${selected}`, selected))
  }
  selectElement.value = selected
}

function syncAdvancedFiltersForViewport(root: HTMLElement) {
  const advanced = root.querySelector<HTMLDetailsElement>(".graph-explorer-advanced")
  if (!advanced) return
  const shouldCollapse = window.matchMedia("(max-width: 760px)").matches
  advanced.open = !shouldCollapse
}

function renderNodePanel(
  panel: HTMLElement,
  node: RuntimeNode,
  state: FilterState,
  activateFocus: (slug: SimpleSlug) => void,
  clearFocus: () => void,
  setPanelMode: (mode: FilterState["panel"]) => void,
) {
  const period = [
    node.dateStart !== undefined || node.dateEnd !== undefined
      ? [node.dateStart ?? "?", node.dateEnd ?? node.dateStart ?? "?"].join("–")
      : "",
    ...(node.centuries ?? []),
  ]
    .filter(Boolean)
    .join(", ")
  if (state.panel === "page") {
    renderPagePanel(panel, node, state, setPanelMode)
    return
  }
  panel.innerHTML = `
    ${panelModeControls(state)}
    <div class="graph-explorer-panel-header">
      <p>${nodeType(node)}</p>
      <h2>${node.title}</h2>
    </div>
    <dl class="graph-explorer-stats">
      <div><dt>Teiginiai</dt><dd>${node.claimCount}</dd></div>
      <div><dt>Citatos</dt><dd>${node.quoteCount}</dd></div>
      <div><dt>Ryšiai</dt><dd>${node.degree}</dd></div>
    </dl>
    ${period ? `<p class="graph-explorer-period">${period}</p>` : ""}
    ${node.summary ? `<p class="graph-explorer-summary">${node.summary}</p>` : ""}
    <div class="graph-explorer-actions">
      <a class="graph-explorer-button" href="${relativePageUrl(node.id)}">Atidaryti</a>
      ${
        state.focus === node.id
          ? `<button type="button" data-action="clear-focus">Grįžti į bendrą žemėlapį</button>`
          : `<button type="button" data-action="focus">Rodyti tiesioginius ryšius</button>`
      }
    </div>
    ${
      node.topClaims.length > 0
        ? `<h3>Teiginiai</h3><ol>${node.topClaims
            .slice(0, 3)
            .map((claim) => `<li>${claim.text}</li>`)
            .join("")}</ol>`
        : ""
    }
    ${
      node.citationSourceTitles.length > 0
        ? `<h3>Šaltiniai</h3><ul>${node.citationSourceTitles
            .slice(0, 8)
            .map((source) => `<li>${source}</li>`)
            .join("")}</ul>`
        : ""
    }
  `
  bindPanelModeControls(panel, setPanelMode)
  panel.querySelector<HTMLButtonElement>("[data-action='focus']")?.addEventListener("click", () => {
    activateFocus(node.id)
  })
  panel.querySelector<HTMLButtonElement>("[data-action='clear-focus']")?.addEventListener("click", () => {
    clearFocus()
  })
}

function linkNode(linkEnd: RuntimeNode | string | number): RuntimeNode {
  return linkEnd as RuntimeNode
}

function renderEdgePanel(
  panel: HTMLElement,
  link: RuntimeLink,
  state: FilterState,
  setPanelMode: (mode: FilterState["panel"]) => void,
) {
  const source = linkNode(link.source)
  const target = linkNode(link.target)
  panel.innerHTML = `
    ${panelModeControls({ ...state, panel: "details" })}
    <div class="graph-explorer-panel-header">
      <p>${link.details.relationKind}</p>
      <h2>${source.title} → ${target.title}</h2>
    </div>
    <dl class="graph-explorer-stats">
      <div><dt>Įrodymai</dt><dd>${link.details.evidenceCount}</dd></div>
      <div><dt>Pasitikėjimas</dt><dd>${link.details.confidence.toFixed(2)}</dd></div>
    </dl>
    ${
      link.details.evidencePreview.length > 0
        ? `<h3>Pagrindimas</h3>${link.details.evidencePreview
            .slice(0, 3)
            .map(
              (item) => `
                <article class="graph-explorer-evidence">
                  <p>${item.claimText ?? item.quoteText ?? "Ryšys ateina iš public nuorodos."}</p>
                  ${item.quoteText && item.claimText ? `<blockquote>${item.quoteText}</blockquote>` : ""}
                </article>
              `,
            )
            .join("")}`
        : `<p class="graph-explorer-summary">Ryšys rastas public puslapio nuorodose; citatos preview šiame indekse nėra.</p>`
    }
  `
  bindPanelModeControls(panel, setPanelMode)
}

function renderGraph(
  root: HTMLElement,
  canvas: HTMLElement,
  panel: HTMLElement,
  graph: { nodes: RuntimeNode[]; links: RuntimeLink[]; focus: SimpleSlug | "" },
  state: FilterState,
  activateFocus: (slug: SimpleSlug) => void,
  clearFocus: () => void,
  setPanelMode: (mode: FilterState["panel"]) => void,
) {
  root.dataset.panel = state.panel
  canvas.innerHTML = ""
  const width = Math.max(canvas.clientWidth, 320)
  const height = Math.max(canvas.clientHeight, 320)
  const svg = select(canvas)
    .append("svg")
    .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Objektų ryšių žemėlapis")
  const showPanelButton = document.createElement("button")
  showPanelButton.className = "graph-explorer-show-panel"
  showPanelButton.type = "button"
  showPanelButton.dataset.panelShow = "true"
  showPanelButton.textContent = "Rodyti panelį"
  showPanelButton.addEventListener("click", () => setPanelMode("details"))
  canvas.append(showPanelButton)

  const stage = svg.append("g")
  const linkLayer = stage.append("g").attr("class", "graph-explorer-links")
  const nodeLayer = stage.append("g").attr("class", "graph-explorer-nodes")
  const labelLayer = stage.append("g").attr("class", "graph-explorer-labels")
  const zoomBehavior = zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.2, 5])
    .on("zoom", ({ transform }) => {
      stage.attr("transform", transform.toString())
      labelLayer.attr("font-size", 13 / transform.k)
    })

  svg.call(zoomBehavior)

  const focusNode = graph.focus ? graph.nodes.find((node) => node.id === graph.focus) : undefined
  const links = linkLayer
    .selectAll("line")
    .data(graph.links)
    .join("line")
    .attr("class", "graph-explorer-link")
    .style("stroke", (link) => (link.details.relationKind === "public_relation" ? "#b8a686" : "#8f7658"))
    .attr("stroke-width", (link) => Math.min(5, 0.6 + Math.log1p(link.details.evidenceCount) * 1.4))
    .attr("stroke-opacity", (link) => Math.max(0.32, Math.min(0.88, link.details.confidence)))
    .on("click", (event, link) => {
      event.stopPropagation()
      if (state.panel === "hidden") {
        setPanelMode("details")
      }
      renderEdgePanel(panel, link, { ...state, panel: "details" }, setPanelMode)
    })

  const nodes = nodeLayer
    .selectAll("circle")
    .data(graph.nodes)
    .join("circle")
    .attr("class", (node) => `graph-explorer-node${node.id === graph.focus ? " is-selected" : ""}`)
    .attr("r", (node) => radius(node, graph.focus))
    .attr("fill", (node) => typeColors[nodeType(node)] ?? "#9b7b49")
    .attr("stroke", (node) => (node.id === graph.focus ? "var(--secondary)" : "var(--light)"))
    .attr("stroke-width", (node) => (node.id === graph.focus ? 3 : 1))
    .attr("tabindex", 0)
    .attr("role", "button")
    .attr("aria-label", (node) => node.title)
    .on("click", (event, node) => {
      event.stopPropagation()
      activateFocus(node.id)
    })
    .call(
      drag<SVGCircleElement, RuntimeNode>()
        .on("start", (event, node) => {
          if (!event.active) simulation.alphaTarget(0.25).restart()
          node.fx = node.x
          node.fy = node.y
        })
        .on("drag", (event, node) => {
          node.fx = event.x
          node.fy = event.y
        })
        .on("end", (event, node) => {
          if (!event.active) simulation.alphaTarget(0)
          node.fx = null
          node.fy = null
        }) as any,
    )

  const labels = labelLayer
    .selectAll("text")
    .data(graph.nodes.filter((node) => node === focusNode || node.degree > 1 || node.score > 8))
    .join("text")
    .attr("class", "graph-explorer-label")
    .text((node) => node.title)
    .attr("text-anchor", "middle")
    .attr("dy", (node) => -radius(node, graph.focus) - 5)

  const simulation = forceSimulation<RuntimeNode>(graph.nodes)
    .force("charge", forceManyBody<RuntimeNode>().strength((node) => -120 - node.score * 2))
    .force("center", forceCenter(0, 0).strength(0.16))
    .force(
      "link",
      forceLink<RuntimeNode, RuntimeLink>(graph.links)
        .id((node) => node.id)
        .distance((link) => 58 + Math.max(0, 5 - link.details.evidenceCount) * 8),
    )
    .force("collide", forceCollide<RuntimeNode>((node) => radius(node, graph.focus) + 10).iterations(2))
    .on("tick", () => {
      links
        .attr("x1", (link) => linkNode(link.source).x ?? 0)
        .attr("y1", (link) => linkNode(link.source).y ?? 0)
        .attr("x2", (link) => linkNode(link.target).x ?? 0)
        .attr("y2", (link) => linkNode(link.target).y ?? 0)
      nodes.attr("cx", (node) => node.x ?? 0).attr("cy", (node) => node.y ?? 0)
      labels.attr("x", (node) => node.x ?? 0).attr("y", (node) => node.y ?? 0)
    })

  const fitGraphToCanvas = () => {
    if (graph.nodes.length === 0) return
    const xs = graph.nodes.map((node) => node.x ?? 0)
    const ys = graph.nodes.map((node) => node.y ?? 0)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const graphWidth = Math.max(1, maxX - minX)
    const graphHeight = Math.max(1, maxY - minY)
    const margin = Math.max(80, Math.min(width, height) * 0.12)
    const scale = Math.max(
      0.35,
      Math.min(2.1, Math.min((width - margin) / graphWidth, (height - margin) / graphHeight)),
    )
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    svg
      .transition()
      .duration(450)
      .call(zoomBehavior.transform, zoomIdentity.translate(-centerX * scale, -centerY * scale).scale(scale))
  }

  simulation.stop()
  simulation.tick(120)
  links
    .attr("x1", (link) => linkNode(link.source).x ?? 0)
    .attr("y1", (link) => linkNode(link.source).y ?? 0)
    .attr("x2", (link) => linkNode(link.target).x ?? 0)
    .attr("y2", (link) => linkNode(link.target).y ?? 0)
  nodes.attr("cx", (node) => node.x ?? 0).attr("cy", (node) => node.y ?? 0)
  labels.attr("x", (node) => node.x ?? 0).attr("y", (node) => node.y ?? 0)
  fitGraphToCanvas()

  if (focusNode && state.panel !== "hidden") {
    renderNodePanel(panel, focusNode, state, activateFocus, clearFocus, setPanelMode)
  } else if (state.panel === "hidden") {
    panel.innerHTML = ""
  } else {
    panel.innerHTML = `
      ${panelModeControls(state)}
      <div class="graph-explorer-panel-header">
        <p>${state.preset === "important" ? "Svarbiausi objektai" : "Žemėlapis"}</p>
        <h2>${graph.nodes.length} objektai</h2>
      </div>
      <p class="graph-explorer-summary">Spustelėk objektą arba ryšį, kad pamatytum detales ir citatų pagrindimą.</p>
    `
    bindPanelModeControls(panel, setPanelMode)
  }

  root.dataset.nodes = String(graph.nodes.length)
  root.dataset.links = String(graph.links.length)
}

async function setupGraphExplorer(root: HTMLElement) {
  const canvas = root.querySelector<HTMLElement>("[data-graph-canvas]")
  const panel = root.querySelector<HTMLElement>("[data-graph-panel]")
  const form = root.querySelector<HTMLFormElement>("[data-graph-filters]")
  const reset = root.querySelector<HTMLButtonElement>("[data-graph-reset]")
  if (!canvas || !panel || !form) return

  canvas.innerHTML = `<p class="graph-explorer-loading">Kraunamas žemėlapis...</p>`
  const rawIndex = await loadExplorerIndex()
  const nodesBySlug = new Map<SimpleSlug, GraphExplorerIndexDetails>(
    Object.entries(rawIndex).map(([slug, details]) => [simplifySlug(slug as FullSlug), details]),
  )

  let state = readState()
  syncAdvancedFiltersForViewport(root)
  await populateSourceSelect(root, state)
  setFormState(root, state)

  let pendingRenderFrame = 0
  const rerender = () => {
    pendingRenderFrame = 0
    root.dataset.panel = state.panel
    const graph = buildVisibleGraph(nodesBySlug, state)
    renderGraph(root, canvas, panel, graph, state, activateFocus, clearFocus, setPanelMode)
  }

  const scheduleRerender = () => {
    if (pendingRenderFrame) {
      window.cancelAnimationFrame(pendingRenderFrame)
    }
    pendingRenderFrame = window.requestAnimationFrame(rerender)
  }

  const setPanelMode = (mode: FilterState["panel"]) => {
    state = { ...state, panel: mode }
    writeState(state)
    rerender()
  }

  const activateFocus = (slug: SimpleSlug) => {
    state = {
      ...state,
      focus: slug,
      depth: 1,
      q: "",
      preset: "important",
      types: [],
      panel: state.panel === "hidden" ? "details" : state.panel,
    }
    writeState(state)
    setFormState(root, state)
    rerender()
  }

  const clearFocus = () => {
    state = {
      ...defaultState,
      panel: state.panel === "hidden" ? "details" : state.panel,
    }
    writeState(state)
    setFormState(root, state)
    rerender()
  }

  const updateFromForm = (immediate = false) => {
    state = readFormState(root, state)
    writeState(state)
    if (immediate) {
      if (pendingRenderFrame) {
        window.cancelAnimationFrame(pendingRenderFrame)
        pendingRenderFrame = 0
      }
      rerender()
    } else {
      scheduleRerender()
    }
  }

  form.addEventListener("input", () => updateFromForm(false))
  form.addEventListener("change", () => updateFromForm(true))
  reset?.addEventListener("click", () => {
    state = { ...defaultState }
    writeState(state)
    setFormState(root, state)
    rerender()
  })
  window.addEventListener("resize", () => syncAdvancedFiltersForViewport(root), { passive: true })
  root.querySelector<HTMLButtonElement>("[data-panel-show]")?.addEventListener("click", () => {
    setPanelMode("details")
  })

  rerender()
}

document.addEventListener("nav", () => {
  const root = document.querySelector<HTMLElement>("[data-graph-explorer]")
  document.body.classList.toggle("graph-explorer-active", Boolean(root))
  if (!root || root.dataset.loaded === "true") return
  root.dataset.loaded = "true"
  setupGraphExplorer(root).catch((error) => {
    console.error(error)
    const canvas = root.querySelector<HTMLElement>("[data-graph-canvas]")
    if (canvas) {
      canvas.innerHTML = `<p class="graph-explorer-loading">Nepavyko įkelti žemėlapio.</p>`
    }
  })
})
