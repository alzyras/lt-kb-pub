import assert from "node:assert/strict"
import test from "node:test"
import { VFile } from "vfile"
import {
  buildGraphSlugMap,
  resolveGraphSlug,
  resolvePublicSlug,
  withPublicObjectNodes,
} from "./graphIdentity"
import type { ProcessedContent } from "../plugins/vfile"
import type { FilePath, FullSlug } from "./path"

function page(slug: string, relativePath: string): ProcessedContent {
  const file = new VFile("")
  file.data = { slug: slug as FullSlug, relativePath: relativePath as FilePath }
  return [{ type: "root", children: [] }, file]
}

test("maps transliterated public slugs to canonical graph slugs", () => {
  const map = buildGraphSlugMap(
    [
      page("objektai/grupes/Zydai", "objektai/grupes/Žydai.md"),
      page("objektai/vietos/Siauliai", "objektai/vietos/Šiauliai.md"),
      page("objektai/asmenys/Kestutis", "objektai/asmenys/Kęstutis.md"),
    ],
    "test-build",
  )
  assert.equal(resolveGraphSlug("objektai/grupes/Zydai", map), "objektai/grupes/Žydai")
  assert.equal(resolvePublicSlug("objektai/grupes/Žydai", map), "objektai/grupes/Zydai")
  assert.equal(resolveGraphSlug("objektai/vietos/Siauliai", map), "objektai/vietos/Šiauliai")
  assert.equal(map.generatedAt, "test-build")
})

test("does not map source pages into the object graph", () => {
  const map = buildGraphSlugMap(
    [page("objektai/saltiniai/Zydai-Lietuvoje", "objektai/saltiniai/Žydai Lietuvoje.md")],
    "test-build",
  )
  assert.deepEqual(map.publicToGraph, {})
})

test("records transliteration collisions and prefers an exact public slug", () => {
  const map = buildGraphSlugMap(
    [
      page("objektai/asmenys/Astikas", "objektai/asmenys/Aštikas.md"),
      page("objektai/asmenys/Astikas", "objektai/asmenys/Astikas.md"),
    ],
    "test-build",
  )
  assert.equal(map.publicToGraph["objektai/asmenys/Astikas"], "objektai/asmenys/Astikas")
  assert.equal(map.graphToPublic["objektai/asmenys/Aštikas"], "objektai/asmenys/Astikas")
  assert.deepEqual(map.collisions["objektai/asmenys/Astikas"], [
    "objektai/asmenys/Astikas",
    "objektai/asmenys/Aštikas",
  ])
})

test("resolves a filename variant through a canonical frontmatter alias", () => {
  const file = page("objektai/vietos/Valerijono-bursos", "objektai/vietos/Valerijono bursos.md")
  file[1].data.frontmatter = {
    title: "Valerijono bursa",
    aliases: ["objektai/vietos/Valerijono bursa", "Valerijono Bursa"],
  }
  const map = buildGraphSlugMap([file], "test-build", ["objektai/vietos/Valerijono bursa"])
  assert.equal(
    resolveGraphSlug("objektai/vietos/Valerijono-bursos", map),
    "objektai/vietos/Valerijono bursa",
  )
  assert.equal(
    resolveGraphSlug("objektai/vietos/Valerijono-Bursa", map),
    "objektai/vietos/Valerijono bursa",
  )
})

test("adds scoped projection objects to stale graph topology without duplicating nodes", () => {
  const topology = {
    nodes: [{ slug: "objektai/asmenys/Esamas", title: "Esamas" }],
    edges: [],
  }
  const complete = withPublicObjectNodes(topology, [
    "objektai/asmenys/Esamas",
    "objektai/asmenys/Mykolas Petraškevičius",
    "objektai/saltiniai/Nenaudojamas",
  ])
  assert.deepEqual(
    complete.nodes.map((node: { slug: string }) => node.slug),
    ["objektai/asmenys/Esamas", "objektai/asmenys/Mykolas Petraškevičius"],
  )
  assert.equal(complete.nodes[1].connected, false)
})
