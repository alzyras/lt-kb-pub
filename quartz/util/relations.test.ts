import test from "node:test"
import assert from "node:assert/strict"
import {
  buildCanonicalRelationIndex,
  buildRelationTargetMap,
  relationTargetSlug,
  relationTargetWikilinks,
  RelationDocument,
} from "./relations"

function document(
  filePath: string,
  slug: string,
  frontmatter: string,
): RelationDocument {
  return {
    filePath: filePath as RelationDocument["filePath"],
    slug: slug as RelationDocument["slug"],
    markdown: `---\n${frontmatter}\n---\n# Objektas\n`,
  }
}

test("resolves typed exact labels and aliases before transliterated fallbacks", () => {
  const map = buildRelationTargetMap([
    document(
      "objektai/vietos/Plockas.md",
      "objektai/vietos/Plockas",
      "tipas: vieta\npavadinimas: Plockas\naliases:\n  - Mazovijos Plockas",
    ),
    document(
      "objektai/vietos/Płockas.md",
      "objektai/vietos/Plockas-duplicate",
      "tipas: vieta\npavadinimas: Płockas",
    ),
  ])

  assert.equal(relationTargetSlug("Plockas: place", map), "objektai/vietos/Plockas")
  assert.equal(relationTargetSlug("Płockas: place", map), "objektai/vietos/Plockas-duplicate")
  assert.equal(relationTargetSlug("Mazovijos Plockas: place", map), "objektai/vietos/Plockas")
})

test("returns null for an actually duplicated canonical label", () => {
  const map = buildRelationTargetMap([
    document(
      "objektai/vietos/Pirmas.md",
      "objektai/vietos/Pirmas",
      "tipas: vieta\npavadinimas: Bendra vieta",
    ),
    document(
      "objektai/vietos/Antras.md",
      "objektai/vietos/Antras",
      "tipas: vieta\npavadinimas: Bendra vieta",
    ),
  ])

  assert.equal(relationTargetSlug("Bendra vieta: place", map), null)
})

test("merges wikilink, markdown-link and claim evidence into one canonical pair", () => {
  const source: RelationDocument = {
    filePath: "objektai/asmenys/Šaltinis.md" as RelationDocument["filePath"],
    slug: "objektai/asmenys/Šaltinis" as RelationDocument["slug"],
    markdown: `## Teiginiai
<a id="claim-t-900001"></a>
- t-001
  teiginys: Šaltinis siejamas su Lietuva.
  ryšio_targeto_parinkimas: "Lietuva: llm_allowed_candidate, place"

## Ryšiai
- Tiesiogiai: [[objektai/vietos/Lietuva]] ir [Lietuva](/objektai/vietos/Lietuva)
`,
  }
  const target = document(
    "objektai/vietos/Lietuva.md",
    "objektai/vietos/Lietuva",
    "tipas: vieta\npavadinimas: Lietuva",
  )
  const map = buildRelationTargetMap([source, target])
  const relations = buildCanonicalRelationIndex([source, target], map)

  assert.deepEqual(relationTargetWikilinks(source.markdown), [
    "objektai/vietos/Lietuva",
    "/objektai/vietos/Lietuva",
  ])
  assert.deepEqual(relations, [
    {
      sourceSlug: "objektai/asmenys/Šaltinis",
      targetSlug: "objektai/vietos/Lietuva",
      directCount: 2,
      claimIds: ["t-900001"],
    },
  ])
})
