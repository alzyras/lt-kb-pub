import assert from "node:assert/strict"
import test from "node:test"
import type { FilePath, FullSlug } from "./path"
import {
  assertObjectMediaIndexEquality,
  buildMediaCatalog,
  buildObjectMediaIndex,
  canonicalizeMediaObjectPaths,
  hydrateCanonicalObjectMedia,
  mediaSetForFile,
  objectMediaIndexSnapshot,
  type MediaCatalogFile,
} from "./mediaCatalog"
import { collectMediaAttributionIssues } from "./mediaAttribution"
import { objectMediaSet } from "./objectMedia"

test("maps source note paths to their emitted public object slugs", () => {
  const files: MediaCatalogFile[] = [
    {
      slug: "objektai/asmenys/Ona-Jogailaite" as FullSlug,
      relativePath: "objektai/asmenys/Ona Jogailaitė.md" as FilePath,
      frontmatter: { title: "Ona Jogailaitė" },
    },
  ]
  const [entry] = canonicalizeMediaObjectPaths(
    [
      {
        mediaId: "m-one",
        relatedObjects: [
          { notePath: "objektai/asmenys/Ona Jogailaitė.md", title: "Ona Jogailaitė" },
        ],
      },
    ],
    files,
  )

  assert.equal(entry.relatedObjects?.[0].notePath, "objektai/asmenys/Ona-Jogailaite.md")
})

test("keeps the full reviewed gallery catalog and unique media identities", () => {
  const catalog = buildMediaCatalog([])
  const mediaIds = new Set(catalog.map((entry) => entry.mediaId).filter(Boolean))

  assert.ok(catalog.length >= 1000)
  assert.equal(mediaIds.size, catalog.length)
  assert.ok(catalog.every((entry) => entry.thumbUrl || entry.sourceUrl))
  assert.deepEqual(collectMediaAttributionIssues(catalog), [])
  assert.ok(
    catalog.every((entry) => !/^https?:\/\/creativecommons\.org/i.test(entry.license ?? "")),
  )
  assert.ok(catalog.every((entry) => !/^own work[.!]?$/i.test(entry.attribution ?? "")))
  assert.ok(
    catalog
      .filter((entry) => entry.provider === "europeana")
      .every((entry) => entry.attribution && entry.canonicalUrl),
  )
})

test("builds one relationship-aware object index and hydrates stale object frontmatter", () => {
  const catalog = [
    {
      mediaId: "m-direct",
      caption: "Tiesioginis Vytauto atvaizdas",
      confidence: 0.9,
      directness: "contextual",
      relationType: "associated_symbol_of",
      relatedObjects: [
        {
          notePath: "objektai/asmenys/Vytautas.md",
          title: "Vytautas",
          directness: "direct",
          relationType: "portrait_of",
        },
      ],
    },
    {
      mediaId: "m-context",
      caption: "Vytauto epochos žemėlapis",
      confidence: 0.8,
      relatedObjects: [
        {
          notePath: "objektai/asmenys/Vytautas.md",
          title: "Vytautas",
          directness: "contextual",
          relationType: "map_of",
        },
      ],
    },
  ]
  const index = buildObjectMediaIndex(catalog)
  const file: MediaCatalogFile = {
    slug: "objektai/asmenys/Vytautas" as FullSlug,
    relativePath: "objektai/asmenys/Vytautas.md" as FilePath,
    frontmatter: {
      title: "Vytautas",
      media_total_count: "0",
      media_primary_json: "",
      media_all_json: "[]",
      media_direct_json: "[]",
      media_contextual_json: "[]",
    },
  }

  const indexed = mediaSetForFile(index, file)
  assert.equal(indexed.totalCount, 2)
  assert.deepEqual(
    indexed.direct.map((entry) => entry.mediaId),
    ["m-direct"],
  )
  assert.deepEqual(
    indexed.contextual.map((entry) => entry.mediaId),
    ["m-context"],
  )
  hydrateCanonicalObjectMedia(file, index)
  const hydrated = objectMediaSet(file.frontmatter)
  assert.equal(hydrated.totalCount, 2)
  assert.equal(hydrated.fallbackPrimary?.mediaId, "m-direct")
  assert.equal(hydrated.fallbackPrimary?.relationType, "portrait_of")
  assert.doesNotThrow(() => assertObjectMediaIndexEquality([file], index))
  assert.deepEqual(objectMediaIndexSnapshot(index)["objektai/asmenys/Vytautas"], {
    all: ["m-direct", "m-context"],
    direct: ["m-direct"],
    contextual: ["m-context"],
    primary: "m-direct",
    totalCount: 2,
  })
})

test("fails the build equality check when a page and canonical object index diverge", () => {
  const index = buildObjectMediaIndex([
    {
      mediaId: "m-one",
      relatedObjects: [
        {
          notePath: "objektai/asmenys/Vytautas.md",
          title: "Vytautas",
          directness: "direct",
        },
      ],
    },
  ])
  const file: MediaCatalogFile = {
    slug: "objektai/asmenys/Vytautas" as FullSlug,
    relativePath: "objektai/asmenys/Vytautas.md" as FilePath,
    frontmatter: {
      title: "Vytautas",
      media_total_count: 0,
      media_all_json: "[]",
      media_direct_json: "[]",
      media_contextual_json: "[]",
    },
  }

  assert.throws(
    () => assertObjectMediaIndexEquality([file], index),
    /Canonical object→media equality check failed.*Vytautas/,
  )
})
