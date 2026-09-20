import assert from "node:assert/strict"
import test from "node:test"
import type { MediaEntry } from "./objectMedia"
import {
  areNearDuplicateMedia,
  buildMediaSearchIndex,
  computeDynamicFacetCounts,
  emptyGalleryState,
  evaluateGalleryRanking,
  filterMediaEntries,
  rankMediaEntries,
  recommendedMediaScore,
  normalizeMediaSearch,
  parseGalleryState,
  serializeGalleryState,
} from "./mediaGallery"

const entries: MediaEntry[] = [
  {
    mediaId: "vytautas-seal",
    caption: "Vytauto Didžiojo antspaudas",
    creator: "Kajetonas Kielisinskis",
    relationType: "seal_of",
    directness: "direct",
    provider: "commons",
    dateStart: 1398,
    tags: [
      { code: "antspaudas", label: "Antspaudas" },
      { code: "valdovas", label: "Valdovas" },
    ],
    relatedObjects: [
      { notePath: "objektai/asmenys/Vytautas.md", title: "Vytautas", itemType: "asmuo" },
    ],
  },
  {
    mediaId: "vilnius-map",
    caption: "Vilniaus miesto planas",
    creator: "Georg Braun",
    relationType: "map_of",
    directness: "direct",
    provider: "europeana",
    dateStart: 1576,
    tags: [
      { code: "zemelapis", label: "Žemėlapis" },
      { code: "miestas", label: "Miestas" },
    ],
    relatedObjects: [
      { notePath: "objektai/vietos/Vilnius.md", title: "Vilnius", itemType: "vieta" },
    ],
  },
  {
    mediaId: "vytautas-portrait",
    caption: "Vytauto portretas",
    creator: "Nežinomas dailininkas",
    relationType: "portrait_of",
    directness: "contextual",
    provider: "commons",
    dateStart: 1840,
    tags: [
      { code: "portretas", label: "Portretas" },
      { code: "valdovas", label: "Valdovas" },
    ],
    relatedObjects: [
      { notePath: "objektai/asmenys/Vytautas.md", title: "Vytautas", itemType: "asmuo" },
    ],
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
  assert.deepEqual(
    filterMediaEntries(entries, state).map((entry) => entry.mediaId),
    ["vytautas-seal"],
  )
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
  assert.equal(
    counts.providers.find((option) => option.value === "europeana"),
    undefined,
  )
})

test("recommended score combines relevance, evidence, quality, metadata, authority, and chronology", () => {
  const complete: MediaEntry = {
    mediaId: "complete",
    caption: "Vytauto Didžiojo portretas",
    creator: "Nežinomas XVI a. dailininkas",
    directness: "direct",
    relationType: "portrait_of",
    confidence: 0.98,
    reviewStatus: "accepted",
    width: 2400,
    height: 3200,
    institution: "Nacionalinis muziejus",
    provider: "europeana",
    canonicalUrl: "https://example.test/record/complete",
    sourceUrl: "https://example.test/complete.jpg",
    thumbUrl: "https://example.test/complete-thumb.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    dateStart: 1550,
    relatedObjects: [
      { notePath: "objektai/asmenys/Vytautas.md", title: "Vytautas", directness: "direct" },
    ],
  }
  const weak: MediaEntry = {
    mediaId: "weak",
    caption: "Pilies aplinka",
    directness: "contextual",
    relationType: "associated_symbol_of",
    confidence: 0.35,
    reviewStatus: "pending",
    sourceUrl: "https://example.test/weak.jpg",
  }

  assert.ok(
    recommendedMediaScore(complete, "Vytautas 1550") > recommendedMediaScore(weak, "Vytautas 1550"),
  )
  assert.deepEqual(
    rankMediaEntries([weak, complete], { ...emptyGalleryState(), q: "Vytautas" }).map(
      (entry) => entry.mediaId,
    ),
    ["complete", "weak"],
  )
})

test("global first page limits object and provider concentration while retaining diversity", () => {
  const repeated = Array.from(
    { length: 6 },
    (_, index): MediaEntry => ({
      mediaId: `same-${index}`,
      caption: `Vytauto portretas ${index}`,
      creator: `Dailininkas ${index}`,
      provider: "commons",
      directness: "direct",
      relationType: "portrait_of",
      confidence: 0.99 - index / 100,
      reviewStatus: "accepted",
      width: 2000,
      height: 2400,
      sourceUrl: `https://example.test/same-${index}.jpg`,
      relatedObjects: [{ notePath: "objektai/asmenys/Vytautas.md", title: "Vytautas" }],
    }),
  )
  const diverse = Array.from(
    { length: 6 },
    (_, index): MediaEntry => ({
      mediaId: `other-${index}`,
      caption: `Skirtingas vaizdas ${index}`,
      creator: `Autorius ${index}`,
      provider: index < 4 ? "europeana" : "commons",
      directness: index % 2 ? "contextual" : "direct",
      relationType: index % 2 ? "map_of" : "seal_of",
      confidence: 0.75,
      reviewStatus: "accepted",
      width: 1200,
      height: 900,
      sourceUrl: `https://example.test/other-${index}.jpg`,
      relatedObjects: [{ notePath: `objektai/vietos/Vieta-${index}.md`, title: `Vieta ${index}` }],
    }),
  )

  const firstPage = rankMediaEntries([...repeated, ...diverse], emptyGalleryState(), {
    firstPageSize: 6,
    maxPerObject: 2,
    maxProviderShare: 2 / 3,
  }).slice(0, 6)
  assert.ok(
    firstPage.filter((entry) =>
      entry.relatedObjects?.some((object) => object.notePath.endsWith("/Vytautas.md")),
    ).length <= 2,
  )
  assert.ok(firstPage.filter((entry) => entry.provider === "commons").length <= 4)
  assert.ok(new Set(firstPage.map((entry) => entry.relationType)).size >= 2)
})

test("detects provider derivatives and demotes near-duplicates", () => {
  const original: MediaEntry = {
    mediaId: "original",
    caption: "Vytauto portretas",
    creator: "Jonas",
    sourceUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Vytautas.jpg",
    confidence: 0.95,
  }
  const derivative: MediaEntry = {
    ...original,
    mediaId: "derivative",
    thumbUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Vytautas.jpg/960px-Vytautas.jpg",
    sourceUrl: "",
  }
  const novel: MediaEntry = {
    mediaId: "novel",
    caption: "Vytauto antspaudas",
    creator: "Petras",
    sourceUrl: "https://example.test/seal.jpg",
    confidence: 0.8,
    directness: "direct",
    relationType: "seal_of",
  }

  assert.equal(areNearDuplicateMedia(original, derivative), true)
  const ranking = rankMediaEntries([original, derivative, novel], emptyGalleryState(), {
    firstPageSize: 3,
  })
  assert.equal(ranking[0].mediaId === "derivative" && ranking[1].mediaId === "original", false)
})

test("keeps distinct Europeana thumbnail resources and same-caption series separate", () => {
  const first: MediaEntry = {
    mediaId: "first",
    provider: "europeana",
    caption: "Vilniaus katedra",
    creator: "Fotografas",
    dateDisplay: "2020",
    width: 1200,
    height: 900,
    displayUrl:
      "https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fexample.test%2Ffirst.jpg&type=IMAGE",
  }
  const second: MediaEntry = {
    ...first,
    mediaId: "second",
    displayUrl:
      "https://api.europeana.eu/thumbnail/v2/url.json?type=IMAGE&uri=https%3A%2F%2Fexample.test%2Fsecond.jpg",
  }
  assert.equal(areNearDuplicateMedia(first, second), false)
})

test("matches the same provider image across canonical and thumbnail URLs", () => {
  const original: MediaEntry = {
    mediaId: "original",
    canonicalUrl: "https://commons.wikimedia.org/wiki/File%3AVytautas.jpg",
  }
  const thumbnail: MediaEntry = {
    mediaId: "thumbnail",
    thumbUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Vytautas.jpg/960px-Vytautas.jpg",
  }
  assert.equal(areNearDuplicateMedia(original, thumbnail), true)
})

test("matches Commons raster derivatives only with corroborating creator metadata", () => {
  const jpeg: MediaEntry = {
    mediaId: "jpeg",
    creator: "Jean Girardet",
    canonicalUrl: "https://commons.wikimedia.org/wiki/File%3APortrait.jpg",
  }
  const png: MediaEntry = {
    mediaId: "png",
    creator: "Jean Girardet",
    canonicalUrl: "https://commons.wikimedia.org/wiki/File%3APortrait.PNG",
  }
  const differentWork: MediaEntry = {
    ...png,
    mediaId: "different",
    creator: "Another artist",
  }
  assert.equal(areNearDuplicateMedia(jpeg, png), true)
  assert.equal(areNearDuplicateMedia(jpeg, differentWork), false)
})

test("reports ranking evaluation metrics including image-open rate", () => {
  const evaluated = evaluateGalleryRanking(entries, {
    relevance: { "vytautas-seal": 3, "vilnius-map": 2, "vytautas-portrait": 1 },
    openedMediaIds: new Set(["vytautas-seal"]),
    firstPageSize: 3,
  })

  assert.equal(evaluated.ndcgAt12, 1)
  assert.equal(evaluated.firstPageUniqueObjectCount, 2)
  assert.equal(evaluated.nearDuplicateRate, 0)
  assert.equal(evaluated.uniqueProviderCount, 2)
  assert.equal(evaluated.imageOpenRate, 1 / 3)
  assert.ok(evaluated.providerDiversity > 0)
})
