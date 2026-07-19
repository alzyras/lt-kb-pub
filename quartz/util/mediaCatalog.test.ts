import assert from "node:assert/strict"
import test from "node:test"
import type { FilePath, FullSlug } from "./path"
import {
  buildMediaCatalog,
  canonicalizeMediaObjectPaths,
  type MediaCatalogFile,
} from "./mediaCatalog"

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
})
