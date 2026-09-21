import {
  buildVisibleGraph,
  cloneGraphState,
  layoutFocusedGraph,
  nodePasses,
  parseGraphState,
  serializeGraphState,
  type GraphState,
  type GraphTopology,
  type RuntimeNode,
  type TopologyEdge,
  type TopologyNode,
} from "./graph-explorer-model"
import { createMapRenderer, type Camera, type MapRenderer } from "./graph-explorer-renderer"
import { objectShardFile, type ObjectPreview, type OuterIndex } from "../../util/graphExplorerData"
import { graphVisualRegistry as visual } from "../../util/graphVisualRegistry"
import { emitAnalyticsMap } from "../../util/analytics-client"

type SearchNode = Pick<TopologyNode, "slug" | "title" | "type" | "connected">
type SlugMap = {
  graphToPublic: Record<string, string>
  publicToGraph: Record<string, string>
  aliases?: Record<string, string>
}
type PreviewShard = { preview?: ObjectPreview; neighbourCount: number }
const labels: Record<string, string> = visual.typeLabels,
  colors: Record<string, number> = visual.typeColors
const groups = [
  ["giminyste", "Giminystė"],
  ["valdzia", "Valdžia"],
  ["diplomatija", "Diplomatija"],
  ["karyba", "Karyba"],
  ["judejimas", "Judėjimas ir gyvenimas"],
  ["ukis", "Ūkis ir kultūra"],
  ["other", "Kiti ryšiai"],
]
function escape(value: unknown) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  )
}
function normalize(value: string) {
  return value
    .toLocaleLowerCase("lt")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}
const dot = (type: string) =>
  `<i class="graph-type-dot" style="--type-color:#${(colors[type] ?? visual.fallbackNode).toString(16).padStart(6, "0")}"></i>`

async function setup(root: HTMLElement) {
  document.body.classList.add("graph-explorer-active")
  const q = <T extends HTMLElement = HTMLElement>(selector: string) =>
    root.querySelector<T>(selector)!
  const canvas = q("[data-graph-canvas]"),
    panel = q("[data-graph-panel]"),
    panelBody = q("[data-preview-content]"),
    filters = q("[data-filters]"),
    status = q("[data-graph-status]")
  const input = q<HTMLInputElement>("[data-graph-search-input]"),
    suggest = q("[data-graph-suggest]"),
    suggestions = q("[data-graph-suggest-list]")
  const base = new URL("/static/graph-data/", location.origin)
  const controller = new AbortController()
  let dead = false,
    generation = 0,
    previewToken = 0,
    outerToken = 0,
    searchToken = 0,
    renderer: MapRenderer | undefined
  let previewReturn: HTMLElement | null = null,
    searchPromise: Promise<SearchNode[]> | undefined
  let historyIndex = 0
  let cleanupDetails = () => {}
  window.addCleanup(() => {
    dead = true
    ++generation
    ++previewToken
    ++outerToken
    controller.abort()
    cleanupDetails()
    renderer?.destroy()
    document.body.classList.remove("graph-explorer-active")
  })
  const historyEntries: Array<{ state: GraphState; camera?: Camera }> = []
  const data = async <T>(file: string, signal = controller.signal): Promise<T> => {
    const url = new URL(file, base)
    if (file.startsWith("explorer/") || file.startsWith("objects/"))
      url.searchParams.set("v", topology?.generatedAt ?? "")
    const response = await fetch(url, {
      signal,
      cache:
        file === "explorer/core.json" ||
        file === "explorer/index.json" ||
        file === "../graphSlugMap.json"
          ? "no-cache"
          : "force-cache",
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json()
  }
  let topology: GraphTopology | undefined
  const [loaded, index, slugMap] = await Promise.all([
    data<GraphTopology>("explorer/core.json"),
    data<OuterIndex>("explorer/index.json"),
    data<SlugMap>("../graphSlugMap.json"),
  ])
  topology = loaded
  const allTypes = Object.keys(index.sectors)
  const defaultRelations = Object.keys(loaded.relationKinds).filter(
    (kind) => loaded.relationKinds[kind].defaultOn,
  )
  const defaults = { types: allTypes, relations: defaultRelations }
  const relationGroups = Object.fromEntries(
    groups.map(([code]) => [
      code,
      defaultRelations.filter((kind) => {
        const group = loaded.relationKinds[kind].group
        return (groups.some(([key]) => key === group) ? group : "other") === code
      }),
    ]),
  )
  const readState = () => {
    const state = parseGraphState(
      new URLSearchParams(location.search),
      defaultRelations,
      allTypes,
      relationGroups,
    )
    const key = state.focus.replace(/\/index$/, "").replace(/\/$/, "")
    state.focus = slugMap.publicToGraph[key] ?? slugMap.aliases?.[key] ?? key
    state.focus = slugMap.aliases?.[state.focus] ?? state.focus
    return state
  }
  let state = readState(),
    allEdges = [...loaded.edges]
  const canonicalNodes = new Map(loaded.nodes.map((node) => [node.slug, node]))
  let visibleCoreIds = new Set<string>()
  async function ensureFocusNode() {
    const requested = state.focus
    if (!requested || canonicalNodes.has(requested)) return
    const match = (await getSearch()).find((node) => node.slug === requested)
    if (dead) return
    if (!match) {
      if (state.focus === requested) state.focus = ""
      return
    }
    if (!canonicalNodes.has(requested)) {
      const node: TopologyNode = {
        ...match,
        degree: 0,
        claimCount: 0,
        quoteCount: 0,
        sourceIds: [],
        sourceTitles: [],
        relationCounts: {},
      }
      canonicalNodes.set(requested, node)
      loaded.nodes.push(node)
    }
  }
  const groupKinds = new Map(
    groups.map(([code]) => [
      code,
      Object.keys(loaded.relationKinds).filter((kind) => {
        const group = loaded.relationKinds[kind].group
        return (groups.some(([key]) => key === group) ? group : "other") === code
      }),
    ]),
  )
  const layerCache = new Map<string, TopologyEdge[]>()
  let fullTopology: Promise<GraphTopology> | undefined
  async function legacyLayers() {
    const kinds = state.relations.filter(
      (kind) => loaded.layerFiles[kind] && !defaultRelations.includes(kind),
    )
    if (!kinds.length) return
    fullTopology ??= data<GraphTopology>("topology.json")
    const full = await fullTopology
    for (const kind of kinds) {
      if (layerCache.has(kind)) continue
      const tuples = await data<Array<[string, number, number, number, number, number, number[]]>>(
        full.layerFiles[kind],
      )
      const edges = tuples.map(([id, from, to, code, confidence, evidenceCount, refs]) => ({
        id,
        from: full.nodes[from].slug,
        to: full.nodes[to].slug,
        kind: full.relationKindCodes[code] ?? kind,
        layer: kind,
        confidence,
        evidenceCount,
        sourceIds: refs.map((i) => full.sourceIds[i]),
        sourceTitles: [],
      }))
      layerCache.set(kind, edges)
      const ids = new Set(edges.flatMap((e) => [e.from, e.to]))
      for (const node of full.nodes)
        if (
          ids.has(node.slug) &&
          slugMap.graphToPublic[node.slug] &&
          !canonicalNodes.has(node.slug)
        ) {
          canonicalNodes.set(node.slug, node)
          loaded.nodes.push(node)
        }
    }
    allEdges = [...loaded.edges, ...[...layerCache.values()].flat()]
  }
  function pageUrl(slug: string) {
    return "/" + (slugMap.graphToPublic[slug] ?? slug).split("/").map(encodeURIComponent).join("/")
  }
  const previewCache = new Map<string, Promise<PreviewShard>>()
  function closePreview(restore = true) {
    ++previewToken
    panel.hidden = true
    if (restore) previewReturn?.focus({ preventScroll: true })
  }
  function closeFilters(restore = true) {
    filters.hidden = true
    q("[data-filter-toggle]").setAttribute("aria-expanded", "false")
    if (restore) q("[data-filter-toggle]").focus()
  }
  async function preview(node: SearchNode) {
    const token = ++previewToken
    if (panel.hidden) {
      const active = document.activeElement as HTMLElement
      previewReturn = suggest.contains(active) ? input : active
    }
    closeFilters(false)
    suggest.hidden = true
    input.setAttribute("aria-expanded", "false")
    panel.hidden = false
    panelBody.scrollTop = 0
    const heading = `<div class="graph-preview-type">${dot(node.type)}${escape(labels[node.type] ?? node.type)}</div><h2>${escape(node.title)}</h2>`
    const actions = (count?: number) =>
      `<div class="graph-preview-actions">${count && count > 0 ? '<button type="button" data-explore>Tyrinėti ryšius</button>' : ""}<a href="${escape(pageUrl(node.slug))}" data-open-page>Atidaryti puslapį ↗</a></div>`
    panelBody.innerHTML =
      heading + '<p class="graph-preview-empty">Įkeliama peržiūra…</p>' + actions()
    q("[data-preview-close]").focus({ preventScroll: true })
    try {
      if (!previewCache.has(node.slug))
        previewCache.set(
          node.slug,
          data<PreviewShard>(`objects/${objectShardFile(node.slug)}.json`).catch((error) => {
            previewCache.delete(node.slug)
            throw error
          }),
        )
      const shard = await previewCache.get(node.slug)!
      if (dead || token !== previewToken || panel.hidden) return
      const metadata = shard.preview,
        image = metadata?.image,
        credit = metadata?.summaryCredit
      panelBody.innerHTML =
        heading +
        (image
          ? `<figure class="graph-preview-image"><img src="${escape(image.url)}" alt="${escape(image.caption)}" width="640" height="460" style="object-position:${escape(image.position)}" /><figcaption>${escape(image.credit)}${image.license ? ` · ${image.licenseUrl ? `<a href="${escape(image.licenseUrl)}" target="_blank" rel="noopener">${escape(image.license)}</a>` : escape(image.license)}` : ""}</figcaption></figure>`
          : "") +
        (metadata?.summary
          ? `<p class="graph-preview-summary">${escape(metadata.summary)}</p>${credit ? `<small class="graph-preview-credit"><a href="${escape(credit.url)}" target="_blank" rel="noopener">${escape(credit.label)}</a> · <a href="${escape(credit.licenseUrl)}" target="_blank" rel="noopener">${escape(credit.license)}</a></small>` : ""}`
          : "") +
        `<dl class="graph-preview-facts">${(metadata?.dates ?? []).map((date) => `<div><dt>${escape(date.label)}</dt><dd>${escape(date.value)}</dd></div>`).join("")}<div><dt>Susiję objektai</dt><dd>${shard.neighbourCount.toLocaleString("lt")}</dd></div></dl>` +
        (!shard.neighbourCount
          ? '<p class="graph-preview-empty">Šis objektas dar neturi publikuotų ryšių. Jo istoriją rasite objekto puslapyje.</p>'
          : "") +
        actions(shard.neighbourCount)
      panelBody
        .querySelector<HTMLImageElement>("img")
        ?.addEventListener(
          "error",
          (event) => (event.currentTarget as HTMLElement).closest("figure")?.remove(),
          { once: true },
        )
      panelBody.querySelector("[data-explore]")?.addEventListener("click", () => {
        closePreview(false)
        state.focus = node.slug
        state.panel = "hidden"
        state.depth = 1
        void change(true)
      })
    } catch {
      if (dead || token !== previewToken) return
      panelBody.innerHTML =
        heading +
        '<p class="graph-preview-empty">Peržiūros nepavyko įkelti. Galite atidaryti objekto puslapį.</p>' +
        actions()
    }
  }
  const tiles = new Map<string, RuntimeNode[]>(),
    pending = new Map<string, Promise<RuntimeNode[]>>()
  const added = new Set<string>()
  let outerAbort = new AbortController(),
    outerRunning = false,
    outerAgain = false,
    outerError = false
  const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  async function loadOuter() {
    if (dead || !state.showIsolated || !renderer) return
    if (outerRunning) {
      outerAgain = true
      return
    }
    outerRunning = true
    const token = outerToken,
      target = renderer
    try {
      const bounds = target.viewport(),
        margin = 180 / target.camera().k
      const wanted = index.tiles.filter(
        (tile) =>
          tile.maxX >= bounds.minX - margin &&
          tile.minX <= bounds.maxX + margin &&
          tile.maxY >= bounds.minY - margin &&
          tile.minY <= bounds.maxY + margin,
      )
      wanted.sort(
        (a, b) =>
          Math.hypot(
            (a.minX + a.maxX) / 2 - (bounds.minX + bounds.maxX) / 2,
            (a.minY + a.maxY) / 2 - (bounds.minY + bounds.maxY) / 2,
          ) -
          Math.hypot(
            (b.minX + b.maxX) / 2 - (bounds.minX + bounds.maxX) / 2,
            (b.minY + b.maxY) / 2 - (bounds.minY + bounds.maxY) / 2,
          ),
      )
      for (const tile of wanted) {
        if (dead || token !== outerToken || !state.showIsolated || renderer !== target) break
        let nodes = tiles.get(tile.file)
        if (!nodes) {
          if (!pending.has(tile.file))
            pending.set(
              tile.file,
              data<RuntimeNode[]>(`explorer/${tile.file}`, outerAbort.signal)
                .then((value) => {
                  tiles.set(tile.file, value)
                  return value
                })
                .finally(() => pending.delete(tile.file)),
            )
          nodes = await pending.get(tile.file)!
        }
        let cursor = 0
        while (cursor < nodes.length) {
          await frame()
          if (dead || token !== outerToken || !state.showIsolated || renderer !== target) break
          const started = performance.now(),
            batch: RuntimeNode[] = []
          while (cursor < nodes.length && batch.length < 200 && performance.now() - started < 8) {
            const node = nodes[cursor++]
            if (
              !added.has(node.id) &&
              !visibleCoreIds.has(node.id) &&
              nodePasses(node, state, new Set(state.sources))
            ) {
              added.add(node.id)
              batch.push(node)
            }
          }
          if (batch.length) target.append(batch)
        }
      }
      if (outerError && token === outerToken && !dead) {
        status.textContent = ""
        outerError = false
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        outerError = true
        status.textContent =
          "Dalies išorinio sluoksnio nepavyko įkelti. Pajudinus vaizdą bus bandoma dar kartą."
      }
    } finally {
      outerRunning = false
      if (outerAgain) {
        outerAgain = false
        void loadOuter()
      }
    }
  }
  function resetOuter() {
    ++outerToken
    outerAbort.abort()
    outerAbort = new AbortController()
    added.clear()
    renderer?.clearOuter()
  }
  const filterInputs = new Map<string, HTMLInputElement>()
  function checkbox(
    code: string,
    text: string,
    container: HTMLElement,
    handler: (checked: boolean) => void,
    type?: string,
  ) {
    const label = document.createElement("label")
    label.innerHTML = `<input type="checkbox" />${type ? dot(type) : ""}<span>${escape(text)}</span>`
    const checkbox = label.querySelector("input")!
    checkbox.addEventListener("change", () => handler(checkbox.checked))
    container.append(label)
    filterInputs.set(code, checkbox)
  }
  for (const type of allTypes) {
    checkbox(
      `type:${type}`,
      labels[type] ?? type,
      q("[data-type-options]"),
      (checked) => {
        state.types = checked
          ? allTypes.filter((value) => value === type || state.types.includes(value))
          : state.types.filter((value) => value !== type)
        void change()
      },
      type,
    )
    const button = document.createElement("button")
    button.type = "button"
    button.innerHTML = dot(type) + escape(labels[type] ?? type)
    button.addEventListener("click", () => {
      state.types = state.types.length === 1 && state.types[0] === type ? [...allTypes] : [type]
      void change()
    })
    q("[data-orbit-types]").append(button)
  }
  for (const [code, text] of groups)
    checkbox(`group:${code}`, text, q("[data-relation-options]"), (checked) => {
      const kinds = groupKinds.get(code)!
      state.relations = checked
        ? [
            ...new Set([
              ...state.relations,
              ...kinds.filter((kind) => loaded.relationKinds[kind].defaultOn),
            ]),
          ]
        : state.relations.filter((kind) => !kinds.includes(kind))
      void change()
    })
  function sync() {
    for (const type of allTypes)
      filterInputs.get(`type:${type}`)!.checked = state.types.includes(type)
    for (const [code] of groups) {
      const kinds = groupKinds
        .get(code)!
        .filter((kind) => loaded.relationKinds[kind].defaultOn || state.relations.includes(kind))
      const count = kinds.filter((kind) => state.relations.includes(kind)).length,
        checkbox = filterInputs.get(`group:${code}`)!
      checkbox.checked = count > 0 && count === kinds.length
      checkbox.indeterminate = count > 0 && count < kinds.length
    }
    q<HTMLInputElement>("[data-date-from]").value = state.from === null ? "" : String(state.from)
    q<HTMLInputElement>("[data-date-to]").value = state.to === null ? "" : String(state.to)
    q<HTMLInputElement>("[data-isolated]").checked = state.showIsolated
    const legacy = Boolean(
      state.sources.length ||
      state.minClaims ||
      state.minQuotes ||
      state.minConfidence !== 0.5 ||
      state.direction !== "both",
    )
    q("[data-legacy-filters]").hidden = !legacy
    const count =
      Number(state.types.length !== allTypes.length) +
      Number(
        state.relations.length !== defaultRelations.length ||
          defaultRelations.some((kind) => !state.relations.includes(kind)),
      ) +
      Number(state.from !== null || state.to !== null) +
      Number(state.showIsolated) +
      Number(legacy)
    q("[data-filter-count]").hidden = !count
    q("[data-filter-count]").textContent = String(count)
    q<HTMLButtonElement>("[data-history-back]").disabled = historyIndex === 0
    q<HTMLButtonElement>("[data-history-forward]").disabled =
      historyIndex >= historyEntries.length - 1
    q("[data-overview]").hidden = Boolean(state.focus)
    q("[data-focus-context]").hidden = !state.focus
    q("[data-focus-title]").textContent =
      canonicalNodes.get(state.focus)?.title ?? state.focus.split("/").pop() ?? ""
    q<HTMLSelectElement>("[data-graph-depth]").value = String(state.depth)
  }
  const historyUrl = () => {
    const params = serializeGraphState(state, defaults, relationGroups)
    return location.pathname + (params.size ? `?${params}` : "")
  }
  function saveHistory(push = true) {
    history.replaceState({ ...history.state, graphIndex: historyIndex }, "", location.href)
    if (push) {
      historyEntries.splice(historyIndex + 1)
      historyEntries.push({ state: cloneGraphState(state) })
      historyIndex = historyEntries.length - 1
    }
    if (push) history.pushState({ graphIndex: historyIndex }, "", historyUrl())
    else history.replaceState({ graphIndex: historyIndex }, "", historyUrl())
  }
  let renderQueue = Promise.resolve()
  async function render(fit = false, camera?: Camera) {
    const request = ++generation
    renderQueue = renderQueue
      .catch(() => {})
      .then(async () => {
        if (dead || request !== generation) return
        const previous = camera ?? (!fit ? renderer?.camera() : undefined)
        await legacyLayers()
        await ensureFocusNode()
        if (dead || request !== generation) return
        resetOuter()
        renderer?.destroy()
        renderer = undefined
        const graph = buildVisibleGraph(
          loaded,
          allEdges,
          { ...state, showIsolated: false },
          new Set(state.sources),
        )
        visibleCoreIds = new Set(graph.nodes.map((node) => node.id))
        layoutFocusedGraph(graph, index.sectors)
        const next = await createMapRenderer(canvas, graph, {
          select: preview,
          camera: (value) => {
            if (historyEntries[historyIndex]) historyEntries[historyIndex].camera = value
            void loadOuter()
          },
        })
        if (dead || request !== generation) {
          next.destroy()
          return
        }
        renderer = next
        if (previous) next.applyCamera(previous)
        status.textContent = graph.nodes.length ? "" : "Pagal šiuos filtrus susietų objektų nėra."
        sync()
        void loadOuter()
      })
      .catch(() => {
        status.textContent = "Nepavyko atnaujinti žemėlapio. Pabandykite atstatyti filtrus."
      })
    return renderQueue
  }
  async function change(fit = false) {
    saveHistory()
    sync()
    await render(fit)
  }
  const onPop = () => {
    closePreview(false)
    closeFilters(false)
    state = readState()
    const saved = history.state?.graphIndex
    if (Number.isInteger(saved) && historyEntries[saved]) historyIndex = saved
    sync()
    void render(false, historyEntries[historyIndex]?.camera)
  }
  addEventListener("popstate", onPop)
  q("[data-history-back]").addEventListener("click", () => history.back())
  q("[data-history-forward]").addEventListener("click", () => history.forward())
  q("[data-graph-home]").addEventListener("click", () => {
    closePreview(false)
    state.focus = ""
    state.depth = 1
    state.panel = "hidden"
    void change(true)
  })
  q("[data-filter-toggle]").addEventListener("click", () => {
    if (!filters.hidden) closeFilters()
    else {
      closePreview(false)
      filters.hidden = false
      q("[data-filter-toggle]").setAttribute("aria-expanded", "true")
      q("[data-filter-close]").focus()
    }
  })
  root
    .querySelectorAll("[data-filter-close]")
    .forEach((button) => button.addEventListener("click", () => closeFilters()))
  q("[data-preview-close]").addEventListener("click", () => closePreview())
  q("[data-reset-filters]").addEventListener("click", () => {
    state = {
      ...parseGraphState(new URLSearchParams(), defaultRelations, allTypes),
      focus: state.focus,
    }
    void change()
  })
  for (const field of ["from", "to"] as const)
    q<HTMLInputElement>(`[data-date-${field}]`).addEventListener("change", (event) => {
      const value = (event.target as HTMLInputElement).value
      state[field] = value && Number.isFinite(Number(value)) ? Number(value) : null
      if (state.from !== null && state.to !== null && state.from > state.to)
        [state.from, state.to] = [state.to, state.from]
      void change()
    })
  q<HTMLInputElement>("[data-isolated]").addEventListener("change", (event) => {
    state.showIsolated = (event.target as HTMLInputElement).checked
    saveHistory()
    sync()
    if (state.showIsolated) void loadOuter()
    else resetOuter()
  })
  q<HTMLSelectElement>("[data-graph-depth]").addEventListener("change", (event) => {
    state.depth = Number((event.target as HTMLSelectElement).value)
    void change(true)
  })
  q("[data-graph-theme]").addEventListener("click", () => {
    const theme = document.documentElement.getAttribute("saved-theme") === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("saved-theme", theme)
    localStorage.setItem("theme", theme)
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }))
    void render()
  })
  q("[data-zoom-fit]").addEventListener("click", () => renderer?.fit(state.showIsolated))
  for (const [action, factor] of [
    ["in", 1.4],
    ["out", 1 / 1.4],
  ] as const)
    q(`[data-zoom-${action}]`).addEventListener("click", () => {
      if (!renderer) return
      const camera = renderer.camera(),
        k = Math.max(0.06, Math.min(8, camera.k * factor)),
        x = canvas.clientWidth / 2,
        y = canvas.clientHeight / 2
      renderer.applyCamera({
        x: x - ((x - camera.x) * k) / camera.k,
        y: y - ((y - camera.y) * k) / camera.k,
        k,
      })
    })
  const getSearch = () =>
    (searchPromise ??= data<SearchNode[]>("explorer/search.json").catch((error) => {
      searchPromise = undefined
      throw error
    }))
  input.addEventListener("focus", () => {
    void getSearch().catch(() => {})
  })
  input.addEventListener("input", async () => {
    const token = ++searchToken,
      query = normalize(input.value.trim())
    suggestions.replaceChildren()
    suggest.hidden = !query
    input.setAttribute("aria-expanded", String(Boolean(query)))
    if (!query) return
    suggestions.innerHTML = "<p>Ieškoma…</p>"
    try {
      const nodes = await getSearch()
      if (dead || token !== searchToken) return
      const matches = nodes
        .filter((node) => normalize(node.title).includes(query))
        .sort(
          (a, b) =>
            Number(normalize(b.title).startsWith(query)) -
              Number(normalize(a.title).startsWith(query)) || a.title.localeCompare(b.title, "lt"),
        )
        .slice(0, 12)
      suggestions.replaceChildren()
      for (const node of matches) {
        const button = document.createElement("button")
        button.type = "button"
        button.setAttribute("role", "option")
        button.innerHTML =
          dot(node.type) +
          `<span>${escape(node.title)}<small>${escape(labels[node.type] ?? node.type)}</small></span>`
        button.addEventListener("click", () => {
          void preview(node)
        })
        suggestions.append(button)
      }
      if (!matches.length) suggestions.innerHTML = "<p>Objektų nerasta.</p>"
    } catch {
      if (token === searchToken)
        suggestions.innerHTML = "<p>Paieškos nepavyko įkelti. Bandykite dar kartą.</p>"
    }
  })
  input.addEventListener("keydown", (event) => {
    if (["ArrowDown", "Enter"].includes(event.key) && !suggest.hidden) {
      event.preventDefault()
      const first = suggestions.querySelector<HTMLButtonElement>("button")
      if (event.key === "Enter") first?.click()
      else first?.focus()
    }
  })
  suggestions.addEventListener("keydown", (event) => {
    const buttons = [...suggestions.querySelectorAll<HTMLButtonElement>("button")],
      i = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === "ArrowDown") {
      event.preventDefault()
      buttons[Math.min(buttons.length - 1, i + 1)]?.focus()
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (!i) input.focus()
      else buttons[i - 1]?.focus()
    }
  })
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return
    if (!suggest.hidden) {
      suggest.hidden = true
      input.setAttribute("aria-expanded", "false")
      input.focus()
    } else if (!filters.hidden) closeFilters()
    else if (!panel.hidden) closePreview()
  }
  document.addEventListener("keydown", onKey)
  let resizeTimer = 0
  let lastWidth = canvas.clientWidth,
    lastHeight = canvas.clientHeight
  const resize = new ResizeObserver(() => {
    if (canvas.clientWidth === lastWidth && canvas.clientHeight === lastHeight) return
    lastWidth = canvas.clientWidth
    lastHeight = canvas.clientHeight
    clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      void render(true)
    }, 160)
  })
  resize.observe(canvas)
  cleanupDetails = () => {
    outerAbort.abort()
    resize.disconnect()
    clearTimeout(resizeTimer)
    removeEventListener("popstate", onPop)
    document.removeEventListener("keydown", onKey)
  }
  const initialPreviewToken = previewToken
  await ensureFocusNode()
  if (dead) return
  historyEntries.push({ state: cloneGraphState(state) })
  saveHistory(false)
  sync()
  if (state.focus && state.panel !== "hidden" && previewToken === initialPreviewToken) {
    const node = canonicalNodes.get(state.focus)
    if (node) void preview(node)
  }
  await render(true)
  if (dead) return
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
    canvas.animate(
      [
        { opacity: 0, transform: "scale(.9)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      { duration: 1100, easing: "cubic-bezier(.2,.7,.2,1)" },
    )
}
export async function initClient() {
  const root = document.querySelector<HTMLElement>("[data-graph-explorer]")
  if (!root || root.dataset.graphExplorerInitialized === "true") return
  root.dataset.graphExplorerInitialized = "true"
  await setup(root).catch(() => {
    delete root.dataset.graphExplorerInitialized
    emitAnalyticsMap("load_error", { map_view: "full" })
    const status = root.querySelector<HTMLElement>("[data-graph-status]")
    if (status)
      status.textContent = "Nepavyko įkelti žemėlapio. Atnaujinkite puslapį ir bandykite dar kartą."
  })
}
