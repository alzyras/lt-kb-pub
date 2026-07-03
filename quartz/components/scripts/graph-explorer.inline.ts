import {
  SimulationLinkDatum,
  SimulationNodeDatum,
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
  sources: string[]
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
  sources: [],
  from: null,
  to: null,
  depth: -1,
  maxNodes: 250,
  showPlaces: false,
  showTopics: false,
  panel: "hidden",
}

function mobileGraphProfile(): boolean {
  return window.matchMedia("(max-width: 760px), (pointer: coarse)").matches
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
  const mobile = mobileGraphProfile()
  const explicitFocus = params.get("focus")
  const defaultDepth = explicitFocus ? (mobile ? 1 : 2) : defaultState.depth
  const sources = (params.get("sources") ?? params.get("source") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
  return {
    focus: (explicitFocus ? simplifySlug(explicitFocus as FullSlug) : "") as
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
    sources: [...new Set(sources)],
    from: parseOptionalNumber(params.get("from")),
    to: parseOptionalNumber(params.get("to")),
    depth: parseNumber(params.get("depth"), defaultDepth),
    maxNodes: parseNumber(params.get("maxNodes"), mobile ? 110 : defaultState.maxNodes),
    showPlaces: params.get("showPlaces") === "1",
    showTopics: params.get("showTopics") === "1",
    panel: panel === "details" || panel === "page" || panel === "hidden" ? panel : defaultState.panel,
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
  if (state.sources.length > 0) params.set("sources", state.sources.join(","))
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

function sourceMatches(node: GraphExplorerIndexDetails, selectedSources: string[]): boolean {
  if (selectedSources.length === 0) return true
  const sourceIds = node.citationSourceIds ?? []
  if (selectedSources.some((source) => sourceIds.includes(source))) return true

  const needles = selectedSources.map((source) => normalizedText(source)).filter(Boolean)
  const sources = normalizedText([...(node.citationSourceIds ?? []), ...(node.citationSourceTitles ?? [])].join(" "))
  return needles.some((needle) => sources.includes(needle))
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
  if (!sourceMatches(node, state.sources)) return false
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
  if (!sourceMatches(node, state.sources)) return false
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
  ;(form.elements.namedItem("from") as HTMLInputElement).value = state.from === null ? "" : String(state.from)
  ;(form.elements.namedItem("to") as HTMLInputElement).value = state.to === null ? "" : String(state.to)
  const activeDepth = form.querySelector<HTMLInputElement>(`input[name="depth"][value="${state.depth}"]`)
  if (activeDepth) activeDepth.checked = true
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
  const activeDepth = form.querySelector<HTMLInputElement>("input[name='depth']:checked")
  return {
    ...previous,
    q: (form.elements.namedItem("q") as HTMLInputElement).value.trim(),
    preset: (form.elements.namedItem("preset") as HTMLSelectElement).value,
    minClaims: Math.max(0, parseNumber((form.elements.namedItem("minClaims") as HTMLInputElement).value, 0)),
    minQuotes: Math.max(0, parseNumber((form.elements.namedItem("minQuotes") as HTMLInputElement).value, 0)),
    from: parseOptionalNumber((form.elements.namedItem("from") as HTMLInputElement).value),
    to: parseOptionalNumber((form.elements.namedItem("to") as HTMLInputElement).value),
    depth: parseNumber(activeDepth?.value ?? null, -1),
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

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function sourceSummaryLabel(state: FilterState, sources: CitationSourceRegistryEntry[]): string {
  if (state.sources.length === 0) return "Visos knygos"
  if (state.sources.length === 1) {
    const source = sources.find((entry) => entry.id === state.sources[0])
    return source ? source.title : "1 knyga"
  }
  return `${state.sources.length} knygos`
}

function syncSourceControls(
  root: HTMLElement,
  state: FilterState,
  onSourcesChange: (sources: string[]) => void,
) {
  const sources = cachedCitationSources ?? []
  const list = root.querySelector<HTMLElement>("[data-source-list]")
  const summary = root.querySelector<HTMLElement>("[data-source-summary]")
  const search = root.querySelector<HTMLInputElement>("[data-source-search]")
  if (summary) {
    summary.textContent = sourceSummaryLabel(state, sources)
  }
  if (!list) return
  if (!cachedCitationSources) {
    list.innerHTML = `<p class="graph-explorer-empty">Kraunamos knygos...</p>`
    return
  }
  const selected = new Set(state.sources)
  const query = normalizedText(search?.value ?? "")
  const filtered = sources.filter((source) => normalizedText(source.title).includes(query))
  if (filtered.length === 0) {
    list.innerHTML = `<p class="graph-explorer-empty">Nerasta knygų.</p>`
    return
  }
  list.innerHTML = filtered
    .map((source) => {
      const checked = selected.has(source.id) ? `checked` : ""
      return `
        <label class="graph-explorer-source-option">
          <input type="checkbox" value="${escapeHtml(source.id)}" ${checked} data-source-checkbox />
          <span>${escapeHtml(sourceOptionLabel(source))}</span>
        </label>
      `
    })
    .join("")
  list.querySelectorAll<HTMLInputElement>("[data-source-checkbox]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const next = new Set(state.sources)
      if (checkbox.checked) {
        next.add(checkbox.value)
      } else {
        next.delete(checkbox.value)
      }
      onSourcesChange([...next])
    })
  })
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

type CanvasTransform = {
  x: number
  y: number
  k: number
}

function linkEndpoints(link: RuntimeLink): [RuntimeNode, RuntimeNode] {
  return [linkNode(link.source), linkNode(link.target)]
}

function nodeScreenPosition(node: RuntimeNode, transform: CanvasTransform): { x: number; y: number } {
  return {
    x: (node.x ?? 0) * transform.k + transform.x,
    y: (node.y ?? 0) * transform.k + transform.y,
  }
}

function distanceToSegment(
  pointX: number,
  pointY: number,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): number {
  const dx = endX - startX
  const dy = endY - startY
  if (dx === 0 && dy === 0) return Math.hypot(pointX - startX, pointY - startY)
  const t = Math.max(0, Math.min(1, ((pointX - startX) * dx + (pointY - startY) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(pointX - (startX + t * dx), pointY - (startY + t * dy))
}

function labelCandidates(nodes: RuntimeNode[], focus: SimpleSlug | "", mobile: boolean): RuntimeNode[] {
  const cap = mobile ? 20 : 70
  return nodes
    .filter((node) => node.id === focus || node.globalDegree > 3 || node.score > 12)
    .sort((a, b) => {
      if (a.id === focus) return -1
      if (b.id === focus) return 1
      const diff = b.score + b.globalDegree * 0.8 - (a.score + a.globalDegree * 0.8)
      return diff === 0 ? a.title.localeCompare(b.title, "lt") : diff
    })
    .slice(0, cap)
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
  const mobile = mobileGraphProfile()
  const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
  const canvasElement = document.createElement("canvas")
  canvasElement.className = "graph-explorer-renderer"
  canvasElement.width = Math.floor(width * pixelRatio)
  canvasElement.height = Math.floor(height * pixelRatio)
  canvasElement.style.width = `${width}px`
  canvasElement.style.height = `${height}px`
  canvasElement.setAttribute("role", "img")
  canvasElement.setAttribute("aria-label", "Objektų ryšių žemėlapis")
  canvas.append(canvasElement)
  const ctx = canvasElement.getContext("2d")
  if (!ctx) return

  const showPanelButton = document.createElement("button")
  showPanelButton.className = "graph-explorer-show-panel"
  showPanelButton.type = "button"
  showPanelButton.dataset.panelShow = "true"
  showPanelButton.textContent = "Rodyti panelį"
  showPanelButton.addEventListener("click", () => setPanelMode("details"))
  canvas.append(showPanelButton)

  let transform: CanvasTransform = { x: width / 2, y: height / 2, k: 1 }
  let selectedLink: RuntimeLink | null = null
  let hoverNode: RuntimeNode | null = null
  let draggingNode: RuntimeNode | null = null
  const focusNode = graph.focus ? graph.nodes.find((node) => node.id === graph.focus) : undefined
  const labels = labelCandidates(graph.nodes, graph.focus, mobile)

  const draw = () => {
    ctx.save()
    ctx.scale(pixelRatio, pixelRatio)
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = getComputedStyle(canvasElement).getPropertyValue("--light") || "#f8f2e8"
    ctx.fillRect(0, 0, width, height)

    for (const link of graph.links) {
      const [source, target] = linkEndpoints(link)
      const s = nodeScreenPosition(source, transform)
      const t = nodeScreenPosition(target, transform)
      const evidenceWeight = Math.min(4.5, 0.55 + Math.log1p(link.details.evidenceCount) * 1.2)
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(t.x, t.y)
      ctx.strokeStyle =
        link === selectedLink
          ? "#923120"
          : link.details.relationKind === "public_relation"
            ? "rgba(150, 130, 94, 0.52)"
            : "rgba(111, 88, 58, 0.68)"
      ctx.globalAlpha = Math.max(0.28, Math.min(0.86, link.details.confidence))
      ctx.lineWidth = evidenceWeight
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    for (const node of graph.nodes) {
      const pos = nodeScreenPosition(node, transform)
      const r = radius(node, graph.focus) * Math.max(0.72, Math.min(1.25, Math.sqrt(transform.k)))
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2)
      ctx.fillStyle = typeColors[nodeType(node)] ?? "#9b7b49"
      ctx.fill()
      ctx.strokeStyle =
        node.id === graph.focus
          ? "#923120"
          : node === hoverNode
            ? "rgba(146, 49, 32, 0.9)"
            : "rgba(255, 250, 241, 0.9)"
      ctx.lineWidth = node.id === graph.focus ? 4 : node === hoverNode ? 2.4 : 1.2
      ctx.stroke()
    }

    const visibleLabels =
      transform.k < 0.58 && focusNode
        ? labels.filter((node) => node.id === focusNode.id || node.globalDegree > 10)
        : labels
    for (const node of visibleLabels) {
      const pos = nodeScreenPosition(node, transform)
      const baseSize = node.id === graph.focus ? 14 : 12
      const size = Math.max(10, Math.min(16, baseSize / Math.sqrt(Math.max(0.82, transform.k))))
      const r = radius(node, graph.focus) * Math.max(0.72, Math.min(1.25, Math.sqrt(transform.k)))
      ctx.font = `${node.id === graph.focus ? 700 : 500} ${size}px var(--bodyFont, serif)`
      ctx.textAlign = "center"
      ctx.textBaseline = "bottom"
      ctx.lineWidth = 4
      ctx.strokeStyle = "rgba(248, 242, 232, 0.88)"
      ctx.fillStyle = "#33241a"
      ctx.strokeText(node.title, pos.x, pos.y - r - 4)
      ctx.fillText(node.title, pos.x, pos.y - r - 4)
    }
    ctx.restore()
  }

  const hitNode = (event: PointerEvent | MouseEvent): RuntimeNode | null => {
    const rect = canvasElement.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return (
      [...graph.nodes]
        .reverse()
        .find((node) => {
          const pos = nodeScreenPosition(node, transform)
          const hitRadius = Math.max(12, radius(node, graph.focus) * Math.sqrt(transform.k) + 6)
          return Math.hypot(pos.x - x, pos.y - y) <= hitRadius
        }) ?? null
    )
  }

  const hitLink = (event: PointerEvent | MouseEvent): RuntimeLink | null => {
    const rect = canvasElement.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    let best: { link: RuntimeLink; distance: number } | null = null
    for (const link of graph.links) {
      const [source, target] = linkEndpoints(link)
      const s = nodeScreenPosition(source, transform)
      const t = nodeScreenPosition(target, transform)
      const distance = distanceToSegment(x, y, s.x, s.y, t.x, t.y)
      if (distance <= 7 && (!best || distance < best.distance)) {
        best = { link, distance }
      }
    }
    return best?.link ?? null
  }

  const zoomBehavior = zoom<HTMLCanvasElement, unknown>()
    .scaleExtent([0.2, 5])
    .on("zoom", (event) => {
      transform = {
        x: event.transform.x,
        y: event.transform.y,
        k: event.transform.k,
      }
      draw()
    })

  select(canvasElement).call(zoomBehavior as any)
  canvasElement.addEventListener("pointermove", (event) => {
    if (draggingNode) {
      const rect = canvasElement.getBoundingClientRect()
      draggingNode.fx = (event.clientX - rect.left - transform.x) / transform.k
      draggingNode.fy = (event.clientY - rect.top - transform.y) / transform.k
      draggingNode.x = draggingNode.fx
      draggingNode.y = draggingNode.fy
      draw()
      return
    }
    const nextHover = hitNode(event)
    if (nextHover !== hoverNode) {
      hoverNode = nextHover
      canvasElement.style.cursor = hoverNode ? "pointer" : hitLink(event) ? "pointer" : "grab"
      draw()
    }
  })
  canvasElement.addEventListener("pointerdown", (event) => {
    const node = hitNode(event)
    if (!node) return
    event.preventDefault()
    draggingNode = node
    node.fx = node.x
    node.fy = node.y
    canvasElement.setPointerCapture(event.pointerId)
  })
  canvasElement.addEventListener("pointerup", (event) => {
    const dragged = draggingNode
    if (draggingNode) {
      draggingNode.fx = null
      draggingNode.fy = null
      draggingNode = null
      canvasElement.releasePointerCapture(event.pointerId)
    }
    const node = hitNode(event)
    if (node && node === dragged) {
      activateFocus(node.id)
      return
    }
    const link = hitLink(event)
    if (link) {
      selectedLink = link
      if (state.panel === "hidden") setPanelMode("details")
      renderEdgePanel(panel, link, { ...state, panel: "details" }, setPanelMode)
      draw()
    }
  })

  const simulation = forceSimulation<RuntimeNode>(graph.nodes)
    .force("charge", forceManyBody<RuntimeNode>().strength((node) => -90 - Math.min(60, node.score * 1.6)))
    .force("center", forceCenter(0, 0).strength(0.18))
    .force(
      "link",
      forceLink<RuntimeNode, RuntimeLink>(graph.links)
        .id((node) => node.id)
        .distance((link) => 54 + Math.max(0, 5 - link.details.evidenceCount) * 7),
    )
    .force("collide", forceCollide<RuntimeNode>((node) => radius(node, graph.focus) + 9).iterations(mobile ? 1 : 2))

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
    select(canvasElement)
      .transition()
      .duration(mobile ? 180 : 360)
      .call(zoomBehavior.transform as any, zoomIdentity.translate(width / 2 - centerX * scale, height / 2 - centerY * scale).scale(scale))
  }

  simulation.stop()
  simulation.tick(mobile ? 45 : 90)
  draw()
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
  setFormState(root, state)

  let pendingRenderFrame = 0
  const setSources = (sources: string[]) => {
    state = { ...state, sources: [...new Set(sources.filter(Boolean))] }
    writeState(state)
    syncSourceControls(root, state, setSources)
    rerender()
  }

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
      depth: mobileGraphProfile() ? 1 : 2,
      q: "",
      panel: state.panel === "hidden" ? "details" : state.panel,
    }
    writeState(state)
    setFormState(root, state)
    syncSourceControls(root, state, setSources)
    rerender()
  }

  const clearFocus = () => {
    state = {
      ...defaultState,
      panel: state.panel === "hidden" ? "details" : state.panel,
    }
    writeState(state)
    setFormState(root, state)
    syncSourceControls(root, state, setSources)
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
    syncSourceControls(root, state, setSources)
    rerender()
  })
  root.querySelector<HTMLButtonElement>("[data-panel-show]")?.addEventListener("click", () => {
    setPanelMode("details")
  })
  root.querySelector<HTMLButtonElement>("[data-panel-toggle]")?.addEventListener("click", () => {
    setPanelMode(state.panel === "hidden" ? "details" : "hidden")
  })
  root.querySelector<HTMLInputElement>("[data-source-search]")?.addEventListener("input", () => {
    syncSourceControls(root, state, setSources)
  })
  root.querySelector<HTMLButtonElement>("[data-source-select-all]")?.addEventListener("click", () => {
    setSources([])
  })
  root.querySelector<HTMLButtonElement>("[data-source-clear]")?.addEventListener("click", () => {
    setSources([])
  })

  const closePopovers = () => {
    root.querySelectorAll<HTMLElement>("[data-popover-panel]").forEach((panel) => {
      panel.hidden = true
    })
    root.querySelectorAll<HTMLButtonElement>("[data-popover-toggle]").forEach((button) => {
      button.setAttribute("aria-expanded", "false")
    })
  }
  root.querySelectorAll<HTMLButtonElement>("[data-popover-toggle]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault()
      event.stopPropagation()
      const targetName = button.dataset.popoverToggle
      const target = targetName
        ? root.querySelector<HTMLElement>(`[data-popover-panel="${targetName}"]`)
        : null
      const shouldOpen = Boolean(target?.hidden)
      closePopovers()
      if (target && shouldOpen) {
        target.hidden = false
        button.setAttribute("aria-expanded", "true")
      }
    })
  })
  root.querySelectorAll<HTMLButtonElement>("[data-popover-close]").forEach((button) => {
    button.addEventListener("click", closePopovers)
  })
  document.addEventListener("click", (event) => {
    const target = event.target
    if (target instanceof Node && !form.contains(target)) {
      closePopovers()
    }
  })

  await loadCitationSources()
  syncSourceControls(root, state, setSources)
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
