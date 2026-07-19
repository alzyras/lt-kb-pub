import test, { describe } from "node:test"
import assert from "node:assert"
import { collectEvidenceIntegrityIssues } from "./evidenceIntegrity"

const validMarkdown = `# Objektas

## Teiginiai
- id: t-001
  global_id: t-10001
  teiginys: Vytautas vedė kariuomenę.
  pagrindžia:
    - c-001

## Citatos
- id: c-001
  citata_originali: |
    Vytautas vedė kariuomenę prie mūšio.
  pagrindžia:
    - t-10001
`

describe("evidence integrity", () => {
  test("accepts a matching forward and backlink pair", () => {
    assert.deepEqual(collectEvidenceIntegrityIssues(validMarkdown), [])
  })

  test("rejects a missing citation and a broken backlink", () => {
    const issues = collectEvidenceIntegrityIssues(
      validMarkdown.replace("    - c-001", "    - c-404"),
    )
    assert.ok(issues.some((issue) => issue.code === "missing_supporting_citation"))
    assert.ok(issues.some((issue) => issue.code === "backlink_forward_mismatch"))
  })

  test("flags a citation whose text does not support the claim", () => {
    const mismatched = validMarkdown.replace(
      "Vytautas vedė kariuomenę prie mūšio.",
      "Vilnius buvo didelis miestas.",
    )
    const issues = collectEvidenceIntegrityIssues(mismatched)
    assert.ok(issues.some((issue) => issue.code === "citation_text_mismatch"))
  })

  test("uses the original quote before a shortened display excerpt", () => {
    const withExcerpt = validMarkdown.replace(
      "  citata_originali: |\n    Vytautas vedė kariuomenę prie mūšio.",
      "  citata_originali: |\n    Vytautas vedė kariuomenę prie mūšio. Jogaila vadovavo kitai daliai.\n  citata_rodoma: |\n    kitai daliai.",
    )
    assert.deepEqual(collectEvidenceIntegrityIssues(withExcerpt), [])
  })

  test("rejects duplicate global claim ids", () => {
    const duplicate = validMarkdown.replace(
      "\n## Citatos",
      "\n- id: t-002\n  global_id: t-10001\n  teiginys: Kitas teiginys.\n\n## Citatos",
    )
    const issues = collectEvidenceIntegrityIssues(duplicate)
    assert.ok(issues.some((issue) => issue.code === "duplicate_claim_global_id"))
  })
})
