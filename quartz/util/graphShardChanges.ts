type GraphNode = {
  slug?: unknown
  title?: unknown
  type?: unknown
  claimCount?: unknown
  quoteCount?: unknown
}

type GraphEdge = {
  id?: unknown
  from?: unknown
  to?: unknown
  kind?: unknown
  evidenceCount?: unknown
  confidence?: unknown
  claimIds?: unknown
  quoteIds?: unknown
}

type GraphTopology = {
  nodes?: GraphNode[]
  edges?: GraphEdge[]
  relationKinds?: Record<string, { defaultOn?: unknown; group?: unknown }>
}

function nodeMap(topology: GraphTopology): Map<string, GraphNode> {
  return new Map((topology.nodes ?? []).map((node) => [String(node.slug ?? ""), node]))
}

function edgeKey(edge: GraphEdge): string {
  return JSON.stringify([
    String(edge.id ?? ""),
    String(edge.from ?? ""),
    String(edge.to ?? ""),
    String(edge.kind ?? ""),
    Number(edge.evidenceCount ?? 0),
    Number(edge.confidence ?? 0),
    Array.isArray(edge.claimIds) ? edge.claimIds : [],
    Array.isArray(edge.quoteIds) ? edge.quoteIds : [],
  ])
}

function edgeCounts(topology: GraphTopology): Map<string, number> {
  const counts = new Map<string, number>()
  for (const edge of topology.edges ?? []) {
    const key = edgeKey(edge)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

/** Return the object shards whose rendered payload differs between two graphs. */
export function changedObjectGraphShardSlugs(
  previous: GraphTopology,
  current: GraphTopology,
): Set<string> {
  const changed = new Set<string>()
  const previousNodes = nodeMap(previous)
  const currentNodes = nodeMap(current)
  const objectSlug = (slug: string) => slug.startsWith("objektai/")
  const add = (slug: unknown) => {
    const value = String(slug ?? "")
    if (objectSlug(value)) changed.add(value)
  }

  const affectedKinds = new Set<string>()
  const kinds = new Set([
    ...Object.keys(previous.relationKinds ?? {}),
    ...Object.keys(current.relationKinds ?? {}),
  ])
  for (const kind of kinds) {
    const before = previous.relationKinds?.[kind]
    const after = current.relationKinds?.[kind]
    if (before?.defaultOn !== after?.defaultOn || before?.group !== after?.group) {
      affectedKinds.add(kind)
    }
  }

  const previousEdgeCounts = edgeCounts(previous)
  const currentEdgeCounts = edgeCounts(current)
  const changedEdges = new Set<string>()
  for (const [key, count] of previousEdgeCounts) {
    if (count !== currentEdgeCounts.get(key)) changedEdges.add(key)
  }
  for (const [key, count] of currentEdgeCounts) {
    if (count !== previousEdgeCounts.get(key)) changedEdges.add(key)
  }

  for (const key of changedEdges) {
    const [, from, to] = JSON.parse(key) as [string, string, string, string]
    add(from)
    add(to)
  }

  for (const edge of [...(previous.edges ?? []), ...(current.edges ?? [])]) {
    if (affectedKinds.has(String(edge.kind ?? ""))) {
      add(edge.from)
      add(edge.to)
    }
  }

  for (const slug of new Set([...previousNodes.keys(), ...currentNodes.keys()])) {
    const before = previousNodes.get(slug)
    const after = currentNodes.get(slug)
    if (!before || !after) {
      add(slug)
      for (const edge of [...(previous.edges ?? []), ...(current.edges ?? [])]) {
        if (edge.from === slug) add(edge.to)
        if (edge.to === slug) add(edge.from)
      }
      continue
    }

    if (
      before.title !== after.title ||
      before.type !== after.type ||
      before.claimCount !== after.claimCount ||
      before.quoteCount !== after.quoteCount
    ) {
      add(slug)
    }
    if (before.title !== after.title || before.type !== after.type) {
      for (const edge of [...(previous.edges ?? []), ...(current.edges ?? [])]) {
        if (edge.from === slug) add(edge.to)
        if (edge.to === slug) add(edge.from)
      }
    }
  }

  return changed
}
