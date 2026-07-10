import assert from "node:assert/strict"
import test, { describe } from "node:test"
import {
  buildVisibleGraph,
  parseGraphState,
  serializeGraphState,
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
  return { id, from, to, kind, layer: "semantic", confidence: 0.9, evidenceCount: 1, sourceTitles: ["Šaltinis A"], sourceIds: ["saltinis-a"] }
}

const nodes = [node("A"), node("B"), node("C"), node("D"), node("Izoliuotas", false)]
const edges = [edge("e1", "A", "B"), edge("e2", "C", "A"), edge("e3", "B", "D"), edge("e4", "C", "B")]
const topology: GraphTopology = {
  version: 2,
  generatedAt: "2026-07-10T00:00:00Z",
  nodes,
  edges,
  relationKinds: {
    puole: { label: "Puolė", inverseLabel: "Buvo puolamas", group: "karyba", groupLabel: "Karyba", defaultOn: true, directional: true, symmetric: false, edgeCount: 4, evidenceCount: 4 },
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
  test("global view has no node cap and hides only isolated nodes by default", () => {
    const graph = buildVisibleGraph(topology, edges, state())
    assert.deepEqual(new Set(graph.nodes.map((entry) => entry.id)), new Set(["A", "B", "C", "D"]))
    assert.equal(graph.edges.length, 4)

    const withIsolated = buildVisibleGraph(topology, edges, state({ showIsolated: true }))
    assert.equal(withIsolated.nodes.length, 5)
  })

  test("depth one includes every incoming and outgoing neighbour", () => {
    const graph = buildVisibleGraph(topology, edges, state({ focus: "A", depth: 1 }))
    assert.deepEqual(new Set(graph.nodes.map((entry) => entry.id)), new Set(["A", "B", "C"]))
    assert.deepEqual(new Set(graph.edges.map((entry) => entry.id)), new Set(["e1", "e2", "e4"]))
  })

  test("direction filter distinguishes outgoing and incoming neighbours", () => {
    const outgoing = buildVisibleGraph(topology, edges, state({ focus: "A", direction: "out" }))
    assert.deepEqual(new Set(outgoing.nodes.map((entry) => entry.id)), new Set(["A", "B"]))
    assert.deepEqual(outgoing.edges.map((entry) => entry.id), ["e1"])

    const incoming = buildVisibleGraph(topology, edges, state({ focus: "A", direction: "in" }))
    assert.deepEqual(new Set(incoming.nodes.map((entry) => entry.id)), new Set(["A", "C"]))
    assert.deepEqual(incoming.edges.map((entry) => entry.id), ["e2"])
  })

  test("disabled relation removes its edges and no-longer-needed nodes", () => {
    const graph = buildVisibleGraph(topology, edges, state({ focus: "A", relations: [] }))
    assert.deepEqual(graph.nodes.map((entry) => entry.id), ["A"])
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
    const original = state({ focus: "A", depth: 2, direction: "in", types: ["asmuo", "ivykis"], relations: [], sources: ["source-a"], minClaims: 4, minQuotes: 2, minConfidence: 0.8, from: 1300, to: 1450, showIsolated: true, panel: "details" })
    const params = serializeGraphState(original, { relations: ["puole"], types: ["asmuo"] })
    const restored = parseGraphState(params, ["puole"], ["asmuo"])
    assert.deepEqual(restored, original)
  })
})
