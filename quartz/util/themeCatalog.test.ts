import assert from "node:assert/strict"
import test from "node:test"
import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug } from "./path"
import { legacyTagDestination, selectTopThemes, themeEntries } from "./themeCatalog"

function theme(title: string, category: string, count: number, role = "core"): QuartzPluginData {
  return {
    slug: `temos/${title}` as FullSlug,
    frontmatter: {
      title,
      pavadinimas: title,
      tipas: "tema",
      kanonine_tema: true,
      tema_kategorija: category,
      tema_kategorijos_pavadinimas: category,
      tema_graph_role: role,
      tema_objektu_skaicius: count,
    },
  }
}

test("themeEntries excludes intersections and sorts by object count", () => {
  const intersection = theme("karas - mūšis", "sankirtos", 99)
  intersection.frontmatter!.tipas = "temu_sankirta"
  intersection.frontmatter!.kanonine_tema = false
  const entries = themeEntries([
    theme("mūšis", "ivykiai", 20),
    theme("karas", "ivykiai", 40),
    intersection,
  ])
  assert.deepEqual(
    entries.map((entry) => entry.title),
    ["karas", "mūšis"],
  )
})

test("selectTopThemes caps categories then fills remaining places", () => {
  const selected = selectTopThemes(
    [
      theme("a1", "a", 100),
      theme("a2", "a", 90),
      theme("a3", "a", 80),
      theme("b1", "b", 70),
      theme("b2", "b", 60),
      theme("support", "c", 1000, "supporting"),
    ],
    5,
    2,
  )
  assert.deepEqual(
    selected.map((entry) => entry.title),
    ["a1", "a2", "b1", "b2", "a3"],
  )
})

test("legacy tag routes resolve to unified destinations", () => {
  assert.equal(legacyTagDestination("index"), "temos")
  assert.equal(legacyTagDestination("asmuo"), "objektai/asmenys")
  assert.equal(legacyTagDestination("istorikas"), "temos/istorikas")
})
