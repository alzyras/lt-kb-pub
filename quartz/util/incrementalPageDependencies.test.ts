import assert from "node:assert/strict"
import test from "node:test"
import {
  firstPagePathBySimplifiedSlug,
  pagesReferencingChangedSlugs,
} from "./incrementalPageDependencies"

test("backlink invalidation checks old and new links against the changed-slug set", () => {
  const previous = {
    "a.md": { links: ["objektai/asmuo/senas"] },
    "b.md": { links: ["objektai/asmuo/kitas"] },
    "c.md": { links: ["objektai/asmuo/nepakeistas"] },
  }
  const current = {
    "a.md": { links: [] },
    "b.md": { links: ["objektai/asmuo/pakeistas"] },
    "c.md": { links: ["objektai/asmuo/nepakeistas"] },
    "new.md": { links: ["objektai/asmuo/pakeistas"] },
  }

  assert.deepEqual(
    pagesReferencingChangedSlugs(previous, current, [
      "objektai/asmuo/senas",
      "objektai/asmuo/pakeistas",
    ]),
    ["a.md", "b.md"],
  )
})

test("simplified slug index preserves the first route selected by the old scan", () => {
  const paths = firstPagePathBySimplifiedSlug([
    { relativePath: "folder/index.md", slug: "folder/index" },
    { relativePath: "duplicate-index.md", slug: "folder/index" },
    { relativePath: "folder.md", slug: "folder" },
    { relativePath: "other.md", slug: "other" },
  ])

  assert.equal(paths.get("folder/"), "folder/index.md")
  assert.equal(paths.get("folder"), "folder.md")
  assert.equal(paths.get("other"), "other.md")
})
