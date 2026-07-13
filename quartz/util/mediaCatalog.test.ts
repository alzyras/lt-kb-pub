import assert from "node:assert/strict"
import test from "node:test"
import type { FilePath, FullSlug } from "./path"
import { canonicalizeMediaObjectPaths, type MediaCatalogFile } from "./mediaCatalog"

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
