import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import {
  buildVisibleGraph,
  graphNodeRadius,
  layoutFocusedGraph,
  parseGraphState,
  type GraphTopology,
  type RuntimeNode,
} from "../quartz/components/scripts/graph-explorer-model"
import { objectShardFile, type OuterIndex } from "../quartz/util/graphExplorerData"

const base = path.resolve(process.argv[2] || "public")
const read = <T>(file: string): T => JSON.parse(fs.readFileSync(path.join(base, file), "utf8"))
const core = read<GraphTopology>("static/graph-data/explorer/core.json")
const index = read<OuterIndex>("static/graph-data/explorer/index.json")
const search = read<Array<{ slug: string }>>("static/graph-data/explorer/search.json")
const all = read<GraphTopology>("static/graph-data/topology.json")
const slugMap = read<{ graphToPublic: Record<string, string> }>("static/graphSlugMap.json")
const validIds = new Set(all.nodes.filter((n) => slugMap.graphToPublic[n.slug]).map((n) => n.slug))
const publishedConnected = new Set(
  all.edges
    .filter(
      (e) =>
        all.relationKinds[e.kind]?.defaultOn !== false &&
        validIds.has(e.from) &&
        validIds.has(e.to),
    )
    .flatMap((e) => [e.from, e.to]),
)
assert.deepEqual(
  new Set(core.nodes.map((n) => n.slug)),
  publishedConnected,
  "Core must derive connectedness from the published network",
)
assert.equal(new Set(core.edges.map((e) => e.id)).size, core.edges.length, "Duplicate edge IDs")
const coreIds = new Set(core.nodes.map((n) => n.slug)),
  outerIds = new Set<string>()
let count = 0
for (const tile of index.tiles) {
  assert.ok(/^outer\/[\d_-]+\.json$/.test(tile.file), "Invalid spatial filename")
  const nodes = read<RuntimeNode[]>(`static/graph-data/explorer/${tile.file}`)
  assert.equal(nodes.length, tile.count)
  for (const node of nodes) {
    assert.ok(!coreIds.has(node.id) && !outerIds.has(node.id), `Duplicate ${node.id}`)
    assert.ok(node.isolated && !node.connected)
    assert.ok(
      node.px >= tile.minX && node.px <= tile.maxX && node.py >= tile.minY && node.py <= tile.maxY,
    )
    assert.ok(
      Math.hypot(node.px, node.py) >= 1080 - 1e-6 && Math.hypot(node.px, node.py) <= 2160 + 1e-6,
    )
    outerIds.add(node.id)
    count++
  }
}
assert.equal(count, index.count)
assert.equal(search.length, new Set(search.map((n) => n.slug)).size, "Duplicate search entries")
assert.deepEqual(
  new Set(search.map((n) => n.slug)),
  new Set([...coreIds, ...outerIds]),
  "Search and spatial coverage differ",
)
const types = Object.keys(index.sectors),
  relations = Object.keys(core.relationKinds).filter((k) => core.relationKinds[k].defaultOn)
for (const kinds of [
  relations,
  relations.filter((k) => core.relationKinds[k].group === "giminyste"),
]) {
  const state = parseGraphState(new URLSearchParams(), kinds, types)
  const graph = buildVisibleGraph(core, core.edges, state)
  layoutFocusedGraph(graph, index.sectors)
  const ranked = [...graph.nodes].sort(
    (a, b) => b.degree - a.degree || a.id.localeCompare(b.id, "lt"),
  )
  for (let i = 1; i < ranked.length; i++) {
    assert.ok(
      Math.hypot(ranked[i - 1].px, ranked[i - 1].py) <=
        Math.hypot(ranked[i].px, ranked[i].py) + 1e-6,
      "Global radial order violated",
    )
    assert.ok(
      graphNodeRadius(ranked[i - 1]) >= graphNodeRadius(ranked[i]),
      "Bubble size order violated",
    )
  }
}
assert.deepEqual(
  new Set(search.map((n) => n.slug)),
  validIds,
  "Only published objects belong in explorer search",
)
for (const node of search) {
  assert.ok(
    fs.existsSync(path.join(base, `static/graph-data/objects/${objectShardFile(node.slug)}.json`)),
    `Missing preview shard: ${node.slug}`,
  )
  const target = slugMap.graphToPublic[node.slug]
  assert.ok(target, `Missing public route: ${node.slug}`)
  assert.ok(
    fs.existsSync(path.join(base, `${target}.html`)) ||
      fs.existsSync(path.join(base, target, "index.html")),
    `Broken object page: ${target}`,
  )
}
console.log(
  `Graph explorer verified: ${core.nodes.length} connected objects, ${core.edges.length} unique edges, ${count} isolated objects in ${index.tiles.length} spatial parts; ${search.length} preview fragments.`,
)
