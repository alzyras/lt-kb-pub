import assert from "node:assert/strict"
import test from "node:test"
import { explorerData, objectPreview, excerpt } from "./graphExplorerData"
import {
  buildVisibleGraph,
  layoutFocusedGraph,
  parseGraphState,
  type GraphTopology,
} from "../components/scripts/graph-explorer-model"

const node = (slug: string, type = "asmuo") => ({
  slug,
  title: slug,
  type,
  degree: 99,
  connected: true,
  claimCount: 1,
  quoteCount: 0,
  sourceIds: [],
  sourceTitles: [],
  relationCounts: {},
})
const topology: GraphTopology = {
  version: 1,
  generatedAt: "test",
  nodes: [
    node("A"),
    node("B", "vieta"),
    ...Array.from({ length: 1500 }, (_, i) => node(`isolated-${i}`, i % 2 ? "asmuo" : "vieta")),
  ],
  edges: [
    {
      id: "one",
      from: "A",
      to: "B",
      kind: "real",
      layer: "semantic",
      confidence: 1,
      evidenceCount: 500,
      sourceIds: [],
      sourceTitles: [],
    },
  ],
  relationKinds: {
    real: {
      label: "Real",
      inverseLabel: "Real",
      group: "karyba",
      groupLabel: "Karyba",
      defaultOn: true,
      directional: true,
      symmetric: false,
      edgeCount: 1,
      evidenceCount: 500,
    },
  },
  relationKindCodes: ["real"],
  sourceIds: [],
  layerFiles: {},
  nodeBuckets: 32,
  evidenceBuckets: 32,
}
test("spatial parts cover true disconnected nodes exactly once, even with stale connected flags", () => {
  const dataset = explorerData(topology)
  assert.deepEqual(
    dataset.core.nodes.map((n) => n.slug),
    ["A", "B"],
  )
  const all = [...dataset.tiles.values()].flat()
  assert.equal(all.length, 1500)
  assert.equal(new Set(all.map((n) => n.id)).size, 1500)
  assert.equal(
    dataset.index.tiles.reduce((sum, t) => sum + t.count, 0),
    1500,
  )
  for (const tile of dataset.index.tiles)
    for (const n of dataset.tiles.get(tile.file.replace(/^outer\//, "").replace(/\.json$/, ""))!) {
      assert.ok(n.px >= tile.minX && n.px <= tile.maxX && n.py >= tile.minY && n.py <= tile.maxY)
      assert.ok(Math.hypot(n.px, n.py) >= 1080 && Math.hypot(n.px, n.py) <= 2160)
      const sector = dataset.index.sectors[n.type],
        angle = (Math.atan2(n.py, n.px) + Math.PI * 2) % (Math.PI * 2)
      assert.ok(angle >= sector.start && angle <= sector.start + sector.span)
    }
  const state = parseGraphState(new URLSearchParams(), ["real"], ["asmuo", "vieta"])
  const graph = buildVisibleGraph(dataset.core, dataset.core.edges, state)
  layoutFocusedGraph(graph, dataset.index.sectors)
  const positions = graph.nodes.map((n) => [n.id, n.px, n.py])
  const withOuter = [...graph.nodes, ...all]
  assert.deepEqual(
    withOuter.slice(0, 2).map((n) => [n.id, n.px, n.py]),
    positions,
  )
  const filtered = buildVisibleGraph(dataset.core, [], state)
  assert.equal(filtered.nodes.length, 0)
  assert.ok(all.every((n) => n.id !== "A" && n.id !== "B"))
  assert.deepEqual(dataset, explorerData({ ...topology, nodes: [...topology.nodes].reverse() }))
})
test("preview uses the published encyclopedia, labelled dates, image focus and credits", () => {
  const preview = objectPreview(
    {
      object_page_view_json: JSON.stringify({
        wiki: {
          status: "published",
          intro: "Enciklopedinė įžanga. Dar vienas sakinys.",
          infobox: [
            { label: "Gimė", value: "1275 m." },
            { label: "Tėvas", value: "Kitas asmuo" },
          ],
          source: {
            publisher: "Vikipedija",
            url: "https://lt.wikipedia.org/wiki/Gediminas",
            license: "CC BY-SA 4.0",
          },
        },
        internal_summary: { text: "Vietinė santrauka." },
      }),
      media_primary_json: JSON.stringify({
        thumbUrl: "/image.webp",
        focalPoint: { x: 50, y: 25 },
        creator: "Autorius",
        license: "Public domain",
      }),
    },
    "Atsarginė santrauka.",
  )
  assert.equal(preview.summary, "Enciklopedinė įžanga. Dar vienas sakinys.")
  assert.deepEqual(preview.dates, [{ label: "Gimė", value: "1275 m." }])
  assert.equal(preview.image?.position, "50% 25%")
  assert.equal(preview.summaryCredit?.label, "Vikipedija")
})
test("withdrawn enrichment never leaks into preview; missing content stays empty", () => {
  assert.equal(
    objectPreview({
      object_page_view_json: JSON.stringify({
        wiki: { status: "revoked", intro: "Neviešinti." },
        internal_summary: { text: "Publikuota vietinė santrauka." },
      }),
    }).summary,
    "Publikuota vietinė santrauka.",
  )
  assert.deepEqual(objectPreview({}), {})
  const sentence = "Šis sakinys sudaro tiksliai septynis paprastus žodžius."
  const text = excerpt(Array(30).fill(sentence).join(" "))
  assert.ok(text.endsWith("žodžius."))
  assert.ok(text.split(/\s+/).length <= 90)
})
