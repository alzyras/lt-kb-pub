import assert from "node:assert/strict"
import test from "node:test"
import type { MediaEntry } from "./objectMedia"
import {
  buildMediaSearchIndex,
  computeDynamicFacetCounts,
  emptyGalleryState,
  filterMediaEntries,
  normalizeMediaSearch,
  parseGalleryState,
  serializeGalleryState,
} from "./mediaGallery"

const entries: MediaEntry[] = [
  {
    mediaId: "vytautas-seal", caption: "Vytauto Didžiojo antspaudas", creator: "Kajetonas Kielisinskis",
    relationType: "seal_of", directness: "direct", provider: "commons", dateStart: 1398,
    tags: [{ code: "antspaudas", label: "Antspaudas" }, { code: "valdovas", label: "Valdovas" }],
    relatedObjects: [{ notePath: "objektai/asmenys/Vytautas.md", title: "Vytautas", itemType: "asmuo" }],
  },
  {
    mediaId: "vilnius-map", caption: "Vilniaus miesto planas", creator: "Georg Braun",
    relationType: "map_of", directness: "direct", provider: "europeana", dateStart: 1576,
    tags: [{ code: "zemelapis", label: "Žemėlapis" }, { code: "miestas", label: "Miestas" }],
    relatedObjects: [{ notePath: "objektai/vietos/Vilnius.md", title: "Vilnius", itemType: "vieta" }],
  },
  {
    mediaId: "vytautas-portrait", caption: "Vytauto portretas", creator: "Nežinomas dailininkas",
    relationType: "portrait_of", directness: "contextual", provider: "commons", dateStart: 1840,
    tags: [{ code: "portretas", label: "Portretas" }, { code: "valdovas", label: "Valdovas" }],
    relatedObjects: [{ notePath: "objektai/asmenys/Vytautas.md", title: "Vytautas", itemType: "asmuo" }],
  },
]

test("normalizes Lithuanian search and finds prefixes", () => {
  assert.equal(normalizeMediaSearch("ŽEMĖLAPIS"), "zemelapis")
  const index = buildMediaSearchIndex(entries)
  assert.deepEqual([...index.search("Vytaut antsp")], ["vytautas-seal"])
  assert.deepEqual([...index.search("Kielisinskis")], ["vytautas-seal"])
})

test("uses OR inside a facet and AND between facets", () => {
  const state = emptyGalleryState()
  state.types = ["seal_of", "map_of"]
  state.providers = ["commons"]
  assert.deepEqual(filterMediaEntries(entries, state).map((entry) => entry.mediaId), ["vytautas-seal"])
})

test("serializes and restores multi-select state", () => {
  const state = emptyGalleryState()
  state.q = "Vytautas"
  state.tags = ["valdovas", "antspaudas"]
  state.sort = "date-asc"
  const query = serializeGalleryState(state, "vytautas-seal")
  const restored = parseGalleryState(query)
  assert.equal(restored.q, "Vytautas")
  assert.deepEqual(restored.tags, ["valdovas", "antspaudas"])
  assert.equal(restored.sort, "date-asc")
  assert.match(query, /media=vytautas-seal/)
})

test("facet counts ignore their own active selection", () => {
  const state = emptyGalleryState()
  state.types = ["seal_of"]
  state.providers = ["commons"]
  const counts = computeDynamicFacetCounts(entries, state)
  assert.equal(counts.types.find((option) => option.value === "portrait_of")?.count, 1)
  assert.equal(counts.providers.find((option) => option.value === "europeana"), undefined)
})
