export type RelationCount = { out: number; in: number }
export type GraphPlaceAuthority = {
  latitude?: number | null
  longitude?: number | null
  parent_entity_id?: string
  parent_region?: string
  valid_from?: string
  valid_to?: string
  historical_names?: Array<{
    name: string
    valid_from?: string
    valid_to?: string
  }>
}
export type TopologyNode = {
  slug: string
  title: string
  type: string
  claimCount: number
  quoteCount: number
  dateStart?: number
  dateEnd?: number
  sourceTitles: string[]
  sourceIds: string[]
  entityId?: string
  canonicalName?: string
  entityRoles?: string[]
  entityViewRole?: string
  entityAliases?: string[]
  sameAs?: string[]
  placeAuthority?: GraphPlaceAuthority
  x?: number
  y?: number
  degree: number
  connected: boolean
  relationCounts: Record<string, RelationCount>
}
export type TopologyEdge = {
  id: string
  from: string
  to: string
  kind: string
  layer: string
  confidence: number
  evidenceCount: number
  sourceTitles: string[]
  sourceIds: string[]
}
export type RelationKind = {
  label: string
  inverseLabel: string
  group: string
  groupLabel: string
  defaultOn: boolean
  directional: boolean
  symmetric: boolean
  edgeCount: number
  evidenceCount: number
}
export type GraphTopology = {
  version: number
  generatedAt: string
  nodes: TopologyNode[]
  edges: TopologyEdge[]
  relationKinds: Record<string, RelationKind>
  relationKindCodes: string[]
  sourceIds: string[]
  layerFiles: Record<string, string>
  nodeBuckets: number
  evidenceBuckets: number
}
export type GraphState = {
  focus: string
  depth: number
  types: string[]
  relations: string[]
  sources: string[]
  minClaims: number
  minQuotes: number
  minConfidence: number
  direction: "both" | "out" | "in"
  from: number | null
  to: number | null
  showIsolated: boolean
  panel: "details" | "page" | "hidden"
}
export type RuntimeNode = TopologyNode & {
  id: string
  px: number
  py: number
  hop: number
  isolated?: boolean
}
export type RuntimeEdge = TopologyEdge & { source: RuntimeNode; target: RuntimeNode }
export type VisibleGraph = { nodes: RuntimeNode[]; edges: RuntimeEdge[]; focus: RuntimeNode | null }
export type FocusGraphSummary = {
  directEdges: number
  linkedObjects: number
  possibleDirectEdges: number
  subgraphEdges: number
  subgraphNodes: number
}

export function summarizeFocusedGraph(graph: VisibleGraph): FocusGraphSummary {
  if (!graph.focus) {
    return {
      directEdges: 0,
      linkedObjects: 0,
      possibleDirectEdges: 0,
      subgraphEdges: graph.edges.length,
      subgraphNodes: graph.nodes.length,
    }
  }

  const focusId = graph.focus.id
  const directEdges = graph.edges.filter((edge) => edge.from === focusId || edge.to === focusId)
  const linkedObjects = new Set(
    directEdges.map((edge) => (edge.from === focusId ? edge.to : edge.from)),
  ).size
  const possibleDirectEdges = Object.values(graph.focus.relationCounts ?? {}).reduce(
    (sum, count) => sum + count.in + count.out,
    0,
  )

  return {
    directEdges: directEdges.length,
    linkedObjects,
    possibleDirectEdges,
    subgraphEdges: graph.edges.length,
    subgraphNodes: graph.nodes.length,
  }
}

export const graphCoreRadius = 900

export function graphNodeRadius(
  node: Pick<RuntimeNode, "degree" | "isolated">,
  focused = false,
): number {
  return node.isolated ? 3.5 : Math.min(19, 4 + Math.log1p(node.degree) * 2) + (focused ? 4 : 0)
}

export function layoutGlobalGraph(
  nodes: RuntimeNode[],
  innerRadius = 65,
  outerRadius = graphCoreRadius,
  sectors?: Record<string, { start: number; span: number }>,
): void {
  if (!nodes.length) return

  const groups = new Map<string, RuntimeNode[]>()
  for (const node of nodes) {
    const group = groups.get(node.type) ?? []
    group.push(node)
    groups.set(node.type, group)
  }

  const orderedGroups = [...groups.values()].sort(
    (a, b) => b.length - a.length || a[0].type.localeCompare(b[0].type, "lt"),
  )
  const total = nodes.length
  const ranked = [...nodes].sort((a, b) => b.degree - a.degree || a.id.localeCompare(b.id, "lt"))
  // Equal-degree objects share one radial band across all types. A global
  // slug rank would group directory names into separate concentric islands.
  const bands = new Map<number, { start: number; count: number }>()
  for (const [index, node] of ranked.entries()) {
    const band = bands.get(node.degree)
    if (band) band.count++
    else bands.set(node.degree, { start: index, count: 1 })
  }
  let offset = 0

  for (const group of orderedGroups) {
    group.sort((a, b) => b.degree - a.degree || a.id.localeCompare(b.id, "lt"))
    const start = sectors?.[group[0].type]?.start ?? (offset / total) * Math.PI * 2
    const span = sectors?.[group[0].type]?.span ?? (group.length / total) * Math.PI * 2
    const counts = new Map<number, number>()
    const ordinals = new Map<number, number>()
    for (const node of group) counts.set(node.degree, (counts.get(node.degree) ?? 0) + 1)

    for (let index = 0; index < group.length; index++) {
      const node = group[index]
      const phase = (index * 0.61803398875) % 1
      const band = bands.get(node.degree)!
      const ordinal = ordinals.get(node.degree) ?? 0
      ordinals.set(node.degree, ordinal + 1)
      const rank = band.start + ((ordinal + 0.5) / counts.get(node.degree)!) * band.count
      const distance = Math.sqrt(rank / total)
      const angle = start + span * (0.012 + phase * 0.976)
      const radius = innerRadius + distance * (outerRadius - innerRadius)
      node.px = Math.cos(angle) * radius
      node.py = Math.sin(angle) * radius
    }
    offset += group.length
  }
}

export function layoutFocusedGraph(
  graph: VisibleGraph,
  sectors?: Record<string, { start: number; span: number }>,
): void {
  if (!graph.focus) return layoutGlobalGraph(graph.nodes, 65, graphCoreRadius, sectors)
  graph.focus.px = graph.focus.py = 0
  const neighbours = graph.nodes.filter((n) => n !== graph.focus)
  layoutGlobalGraph(
    neighbours,
    85,
    Math.max(330, Math.min(graphCoreRadius, Math.sqrt(neighbours.length) * 35)),
    sectors,
  )
}

function parseNumber(value: string | null, fallback: number): number {
  const parsed = Number(value)
  return value !== null && value !== "" && Number.isFinite(parsed) ? parsed : fallback
}

function parseOptional(value: string | null): number | null {
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function parseGraphState(
  params: URLSearchParams,
  defaultRelations: string[],
  allTypes: string[],
  relationGroups?: Record<string, string[]>,
): GraphState {
  const panel = params.get("panel")
  const direction = params.get("direction")
  return {
    focus: params.get("focus") ?? "",
    depth: parseNumber(params.get("depth"), 1),
    types: params.has("types")
      ? (params.get("types") ?? "").split(",").filter(Boolean)
      : [...allTypes],
    relations:
      params.has("groups") && relationGroups
        ? [
            ...new Set([
              ...(params.get("groups") ?? "")
                .split(",")
                .flatMap((group) => relationGroups[group] ?? []),
              ...(params.get("relations") ?? "").split(",").filter(Boolean),
            ]),
          ]
        : params.has("relations")
          ? (params.get("relations") ?? "").split(",").filter(Boolean)
          : [...defaultRelations],
    sources: (params.get("sources") ?? "").split(",").filter(Boolean),
    minClaims: parseNumber(params.get("minClaims"), 0),
    minQuotes: parseNumber(params.get("minQuotes"), 0),
    minConfidence: parseNumber(params.get("minConfidence"), 0.5),
    direction: direction === "out" || direction === "in" ? direction : "both",
    from: parseOptional(params.get("from")),
    to: parseOptional(params.get("to")),
    showIsolated: params.get("isolated") === "1",
    panel: panel === "details" || panel === "page" || panel === "hidden" ? panel : "hidden",
  }
}

export function serializeGraphState(
  state: GraphState,
  defaults: { relations: string[]; types: string[] },
  relationGroups?: Record<string, string[]>,
): URLSearchParams {
  const params = new URLSearchParams()
  if (state.focus) params.set("focus", state.focus)
  if (state.depth !== 1) params.set("depth", String(state.depth))
  if (state.types.join() !== defaults.types.join()) params.set("types", state.types.join(","))
  const selected = new Set(state.relations)
  const changed = relationGroups
    ? selected.size !== defaults.relations.length ||
      defaults.relations.some((kind) => !selected.has(kind))
    : state.relations.join() !== defaults.relations.join()
  if (changed) {
    if (relationGroups) {
      const fullGroups = Object.keys(relationGroups).filter(
        (group) =>
          relationGroups[group].length > 0 &&
          relationGroups[group].every((kind) => selected.has(kind)),
      )
      const grouped = new Set(fullGroups.flatMap((group) => relationGroups[group]))
      const partial = state.relations.filter((kind) => !grouped.has(kind))
      params.set("groups", fullGroups.join(","))
      if (partial.length) params.set("relations", partial.join(","))
    } else params.set("relations", state.relations.join(","))
  }
  if (state.sources.length) params.set("sources", state.sources.join(","))
  if (state.minClaims) params.set("minClaims", String(state.minClaims))
  if (state.minQuotes) params.set("minQuotes", String(state.minQuotes))
  if (state.minConfidence !== 0.5) params.set("minConfidence", String(state.minConfidence))
  if (state.direction !== "both") params.set("direction", state.direction)
  if (state.from !== null) params.set("from", String(state.from))
  if (state.to !== null) params.set("to", String(state.to))
  if (state.showIsolated) params.set("isolated", "1")
  if (state.panel !== "hidden") params.set("panel", state.panel)
  return params
}

export function cloneGraphState(state: GraphState): GraphState {
  return {
    ...state,
    types: [...state.types],
    relations: [...state.relations],
    sources: [...state.sources],
  }
}

export function isCurrentPanelRequest(
  requestToken: number,
  activeToken: number,
  panel: GraphState["panel"],
): boolean {
  return requestToken === activeToken && panel !== "hidden"
}

export function nodePasses(
  node: TopologyNode,
  state: GraphState,
  selectedSourceIds: Set<string>,
): boolean {
  if (!state.types.includes(node.type)) return false
  if (node.claimCount < state.minClaims || node.quoteCount < state.minQuotes) return false
  const start = node.dateStart ?? node.dateEnd
  const end = node.dateEnd ?? node.dateStart
  if ((state.from !== null || state.to !== null) && start === undefined && end === undefined)
    return false
  if (state.from !== null && (end ?? -Infinity) < state.from) return false
  if (state.to !== null && (start ?? Infinity) > state.to) return false
  if (selectedSourceIds.size && !node.sourceIds.some((source) => selectedSourceIds.has(source)))
    return false
  return true
}

function edgePasses(
  edge: TopologyEdge,
  state: GraphState,
  selectedSourceIds: Set<string>,
): boolean {
  if (!state.relations.includes(edge.kind) || edge.confidence < state.minConfidence) return false
  if (selectedSourceIds.size && !edge.sourceIds.some((source) => selectedSourceIds.has(source)))
    return false
  return true
}

export function buildVisibleGraph(
  topology: GraphTopology,
  allEdges: TopologyEdge[],
  state: GraphState,
  selectedSourceIds = new Set<string>(),
): VisibleGraph {
  const allowed = new Map(
    topology.nodes
      .filter((node) => nodePasses(node, state, selectedSourceIds))
      .map((node) => [node.slug, node]),
  )
  if (state.focus) {
    const focusNode = topology.nodes.find((node) => node.slug === state.focus)
    if (focusNode) allowed.set(focusNode.slug, focusNode)
  }
  const seen = new Set<string>()
  const edges = allEdges.filter((edge) => {
    if (seen.has(edge.id)) return false
    seen.add(edge.id)
    return (
      allowed.has(edge.from) && allowed.has(edge.to) && edgePasses(edge, state, selectedSourceIds)
    )
  })
  const adjacency = new Map<string, Set<string>>()
  for (const edge of edges) {
    if (state.direction !== "in")
      (adjacency.get(edge.from) ?? adjacency.set(edge.from, new Set()).get(edge.from)!).add(edge.to)
    if (state.direction !== "out")
      (adjacency.get(edge.to) ?? adjacency.set(edge.to, new Set()).get(edge.to)!).add(edge.from)
  }
  const selected = new Set<string>()
  const hops = new Map<string, number>()
  if (state.focus && allowed.has(state.focus) && state.depth >= 0) {
    selected.add(state.focus)
    hops.set(state.focus, 0)
    let frontier = new Set([state.focus])
    for (let hop = 1; hop <= state.depth; hop++) {
      const next = new Set<string>()
      for (const slug of frontier) {
        for (const target of adjacency.get(slug) ?? []) {
          if (!selected.has(target)) {
            selected.add(target)
            hops.set(target, hop)
            next.add(target)
          }
        }
      }
      frontier = next
    }
  } else {
    for (const slug of allowed.keys()) {
      if (state.showIsolated || (adjacency.get(slug)?.size ?? 0) > 0) selected.add(slug)
    }
  }
  const runtimeNodes: RuntimeNode[] = [...selected].map((slug) => {
    const node = allowed.get(slug)!
    return { ...node, id: slug, px: node.x ?? 0, py: node.y ?? 0, hop: hops.get(slug) ?? -1 }
  })
  const byId = new Map(runtimeNodes.map((node) => [node.id, node]))
  const runtimeEdges = edges
    .filter((edge) => {
      if (!selected.has(edge.from) || !selected.has(edge.to)) return false
      if (!state.focus || state.direction === "both") return true
      if (edge.from !== state.focus && edge.to !== state.focus) return true
      return state.direction === "out" ? edge.from === state.focus : edge.to === state.focus
    })
    .map((edge) => ({ ...edge, source: byId.get(edge.from)!, target: byId.get(edge.to)! }))
  for (const node of runtimeNodes) node.degree = 0
  for (const edge of runtimeEdges) {
    edge.source.degree++
    if (edge.target !== edge.source) edge.target.degree++
  }
  return {
    nodes: runtimeNodes,
    edges: runtimeEdges,
    focus: state.focus ? (byId.get(state.focus) ?? null) : null,
  }
}
