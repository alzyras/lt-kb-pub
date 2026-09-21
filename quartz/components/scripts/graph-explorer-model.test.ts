import assert from "node:assert/strict"
import test, { describe } from "node:test"
import {
  buildVisibleGraph,
  isCurrentPanelRequest,
  layoutGlobalGraph,
  layoutFocusedGraph,
  graphNodeRadius,
  parseGraphState,
  serializeGraphState,
  summarizeFocusedGraph,
  type GraphState,
  type GraphTopology,
  type TopologyEdge,
  type TopologyNode,
} from "./graph-explorer-model"

function node(slug: string, connected = true): TopologyNode {
  return {
    slug,
    title: slug,
    type: "asmuo",
    claimCount: 5,
    quoteCount: 3,
    sourceTitles: ["Šaltinis A"],
    sourceIds: ["saltinis-a"],
    degree: connected ? 2 : 0,
    connected,
    relationCounts: {},
    x: 0,
    y: 0,
  }
}

function edge(id: string, from: string, to: string, kind = "puole"): TopologyEdge {
  return {
    id,
    from,
    to,
    kind,
    layer: "semantic",
    confidence: 0.9,
    evidenceCount: 1,
    sourceTitles: ["Šaltinis A"],
    sourceIds: ["saltinis-a"],
  }
}

const nodes = [node("A"), node("B"), node("C"), node("D"), node("Izoliuotas", false)]
const edges = [
  edge("e1", "A", "B"),
  edge("e2", "C", "A"),
  edge("e3", "B", "D"),
  edge("e4", "C", "B"),
]
const topology: GraphTopology = {
  version: 2,
  generatedAt: "2026-07-10T00:00:00Z",
  nodes,
  edges,
  relationKinds: {
    puole: {
      label: "Puolė",
      inverseLabel: "Buvo puolamas",
      group: "karyba",
      groupLabel: "Karyba",
      defaultOn: true,
      directional: true,
      symmetric: false,
      edgeCount: 4,
      evidenceCount: 4,
    },
  },
  relationKindCodes: ["puole"],
  sourceIds: ["saltinis-a"],
  layerFiles: {},
  nodeBuckets: 32,
  evidenceBuckets: 32,
}

function state(overrides: Partial<GraphState> = {}): GraphState {
  return {
    focus: "",
    depth: 1,
    types: ["asmuo"],
    relations: ["puole"],
    sources: [],
    minClaims: 0,
    minQuotes: 0,
    minConfidence: 0.5,
    direction: "both",
    from: null,
    to: null,
    showIsolated: false,
    panel: "hidden",
    ...overrides,
  }
}

describe("graph explorer model", () => {
  test("group filter URLs stay short with thousands of internal predicates and preserve partial legacy choices", () => {
    const relationGroups = {
      family: ["father", "mother"],
      other: Array.from(
        { length: 1331 },
        (_, i) => `authored:Istorinis asmuo su labai ilgu pavadinimu ${i} dalyvavo mūšyje`,
      ),
    }
    const defaults = { relations: Object.values(relationGroups).flat(), types: ["asmuo"] }
    const selected = state({ relations: [...relationGroups.other] })
    const params = serializeGraphState(selected, defaults, relationGroups)
    assert.ok(params.toString().length < 100)
    assert.deepEqual(
      new Set(
        parseGraphState(params, defaults.relations, defaults.types, relationGroups).relations,
      ),
      new Set(selected.relations),
    )
    const mixed = state({ relations: [...relationGroups.other, "father", "legacy_optional"] })
    const mixedParams = serializeGraphState(mixed, defaults, relationGroups)
    assert.equal(mixedParams.get("relations"), "father,legacy_optional")
    assert.deepEqual(
      new Set(
        parseGraphState(mixedParams, defaults.relations, defaults.types, relationGroups).relations,
      ),
      new Set(mixed.relations),
    )
    assert.deepEqual(
      parseGraphState(
        new URLSearchParams("relations=father"),
        defaults.relations,
        defaults.types,
        relationGroups,
      ).relations,
      ["father"],
    )
    const empty = serializeGraphState(state({ relations: [] }), defaults, relationGroups)
    assert.deepEqual(
      parseGraphState(empty, defaults.relations, defaults.types, relationGroups).relations,
      [],
    )
  })
  test("unique visible edges determine size and global radial order across types", () => {
    const mixed = {
      ...topology,
      nodes: nodes.map((n, i) => ({
        ...n,
        type: i % 2 ? "vieta" : "asmuo",
        claimCount: i * 9000,
        degree: 999,
      })),
    }
    const graph = buildVisibleGraph(
      mixed,
      [...edges, ...edges],
      state({ types: ["vieta", "asmuo"] }),
    )
    assert.equal(graph.edges.length, edges.length)
    assert.equal(graph.nodes.find((n) => n.id === "B")!.degree, 3)
    layoutGlobalGraph(graph.nodes)
    const ordered = [...graph.nodes].sort(
      (a, b) => b.degree - a.degree || Math.hypot(a.px, a.py) - Math.hypot(b.px, b.py),
    )
    for (let i = 1; i < ordered.length; i++) {
      assert.ok(
        Math.hypot(ordered[i - 1].px, ordered[i - 1].py) <=
          Math.hypot(ordered[i].px, ordered[i].py) + 1e-8,
      )
      assert.ok(graphNodeRadius(ordered[i - 1]) >= graphNodeRadius(ordered[i]))
    }
    const filtered = buildVisibleGraph(
      mixed,
      edges.slice(0, 1),
      state({ types: ["vieta", "asmuo"] }),
    )
    assert.deepEqual(
      filtered.nodes.map((n) => n.degree),
      [1, 1],
    )
  })
  test("focused layout keeps the selected object central and ranks every neighbour globally", () => {
    const graph = buildVisibleGraph(topology, edges, state({ focus: "A", depth: 3 }))
    layoutFocusedGraph(graph)
    assert.equal(graph.focus!.px, 0)
    assert.equal(graph.focus!.py, 0)
    const rest = graph.nodes
      .filter((n) => n !== graph.focus)
      .sort((a, b) => b.degree - a.degree || Math.hypot(a.px, a.py) - Math.hypot(b.px, b.py))
    for (let i = 1; i < rest.length; i++)
      assert.ok(Math.hypot(rest[i - 1].px, rest[i - 1].py) <= Math.hypot(rest[i].px, rest[i].py))
  })
  test("panel requests cannot repaint a hidden or stale panel", () => {
    assert.equal(isCurrentPanelRequest(4, 4, "details"), true)
    assert.equal(isCurrentPanelRequest(4, 5, "details"), false)
    assert.equal(isCurrentPanelRequest(4, 4, "hidden"), false)
  })

  test("global view has no node cap and hides only isolated nodes by default", () => {
    const graph = buildVisibleGraph(topology, edges, state())
    assert.deepEqual(new Set(graph.nodes.map((entry) => entry.id)), new Set(["A", "B", "C", "D"]))
    assert.equal(graph.edges.length, 4)

    const withIsolated = buildVisibleGraph(topology, edges, state({ showIsolated: true }))
    assert.equal(withIsolated.nodes.length, 5)
  })

  test("global layout is deterministic and keeps every node in a compact radial field", () => {
    const graph = buildVisibleGraph(topology, edges, state())
    layoutGlobalGraph(graph.nodes)
    const first = graph.nodes.map(({ id, px, py }) => ({ id, px, py }))
    assert.ok(first.every(({ px, py }) => Number.isFinite(px) && Number.isFinite(py)))
    assert.ok(first.every(({ px, py }) => Math.hypot(px, py) <= 910))

    layoutGlobalGraph(graph.nodes)
    assert.deepEqual(
      graph.nodes.map(({ id, px, py }) => ({ id, px, py })),
      first,
    )
  })

  test("depth one includes every incoming and outgoing neighbour", () => {
    const graph = buildVisibleGraph(topology, edges, state({ focus: "A", depth: 1 }))
    assert.deepEqual(new Set(graph.nodes.map((entry) => entry.id)), new Set(["A", "B", "C"]))
    assert.deepEqual(new Set(graph.edges.map((entry) => entry.id)), new Set(["e1", "e2", "e4"]))
  })

  test("global layout preserves a large mixed collection and is independent of input order", () => {
    const collection = Array.from({ length: 12000 }, (_, index) => ({
      ...node(`object-${index}`),
      id: `object-${index}`,
      type: ["asmuo", "vieta", "ivykis"][index % 3],
      degree: index % 29,
      px: 0,
      py: 0,
      hop: -1,
    }))
    const reversed = collection.toReversed().map((entry) => ({ ...entry }))
    layoutGlobalGraph(collection)
    layoutGlobalGraph(reversed)
    assert.equal(collection.length, 12000)
    assert.ok(collection.every(({ px, py }) => Number.isFinite(px) && Number.isFinite(py)))
    assert.ok(collection.every(({ px, py }) => Math.hypot(px, py) <= 910))
    assert.deepEqual(reversed.toReversed(), collection)
  })

  test("equally connected types fill the same radial band instead of separate rings", () => {
    const collection = ["asmuo", "vieta"].flatMap((type) =>
      Array.from({ length: 100 }, (_, index) => ({
        ...node(`${type}/${String(index).padStart(3, "0")}`),
        id: `${type}/${String(index).padStart(3, "0")}`,
        type,
        degree: 1,
        px: 0,
        py: 0,
        hop: -1,
      })),
    )
    layoutGlobalGraph(collection)
    for (let index = 0; index < 100; index++) {
      const a = collection[index],
        b = collection[index + 100]
      assert.ok(Math.abs(Math.hypot(a.px, a.py) - Math.hypot(b.px, b.py)) < 1e-8)
    }
  })

  test("focus summary distinguishes neighbours, direct edges and subgraph edges", () => {
    const graph = buildVisibleGraph(topology, edges, state({ focus: "A", depth: 1 }))
    graph.focus!.relationCounts = { puole: { out: 3, in: 4 } }
    assert.deepEqual(summarizeFocusedGraph(graph), {
      directEdges: 2,
      linkedObjects: 2,
      possibleDirectEdges: 7,
      subgraphEdges: 3,
      subgraphNodes: 3,
    })
  })

  test("direction filter distinguishes outgoing and incoming neighbours", () => {
    const outgoing = buildVisibleGraph(topology, edges, state({ focus: "A", direction: "out" }))
    assert.deepEqual(new Set(outgoing.nodes.map((entry) => entry.id)), new Set(["A", "B"]))
    assert.deepEqual(
      outgoing.edges.map((entry) => entry.id),
      ["e1"],
    )

    const incoming = buildVisibleGraph(topology, edges, state({ focus: "A", direction: "in" }))
    assert.deepEqual(new Set(incoming.nodes.map((entry) => entry.id)), new Set(["A", "C"]))
    assert.deepEqual(
      incoming.edges.map((entry) => entry.id),
      ["e2"],
    )
  })

  test("disabled relation removes its edges and no-longer-needed nodes", () => {
    const graph = buildVisibleGraph(topology, edges, state({ focus: "A", relations: [] }))
    assert.deepEqual(
      graph.nodes.map((entry) => entry.id),
      ["A"],
    )
    assert.equal(graph.edges.length, 0)
  })

  test("book filter uses canonical source IDs for nodes and edges", () => {
    const graph = buildVisibleGraph(topology, edges, state(), new Set(["saltinis-a"]))
    assert.equal(graph.edges.length, 4)
    const empty = buildVisibleGraph(topology, edges, state(), new Set(["kitas-saltinis"]))
    assert.equal(empty.nodes.length, 0)
    assert.equal(empty.edges.length, 0)
  })

  test("URL state round-trips focus, filters, direction, depth and panel", () => {
    const original = state({
      focus: "A",
      depth: 2,
      direction: "in",
      types: ["asmuo", "ivykis"],
      relations: [],
      sources: ["source-a"],
      minClaims: 4,
      minQuotes: 2,
      minConfidence: 0.8,
      from: 1300,
      to: 1450,
      showIsolated: true,
      panel: "details",
    })
    const params = serializeGraphState(original, { relations: ["puole"], types: ["asmuo"] })
    const restored = parseGraphState(params, ["puole"], ["asmuo"])
    assert.deepEqual(restored, original)
  })
})
