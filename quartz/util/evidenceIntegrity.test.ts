import test, { describe } from "node:test"
import assert from "node:assert"
import {
  collectCorpusEvidenceIntegrityIssues,
  collectEvidenceIntegrityIssues,
  evidenceSupportsClaim,
} from "./evidenceIntegrity"

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

  test("accepts an article citation represented only by its bibliographic index", () => {
    const indexOnly = `# Objektas

## Teiginiai
- id: t-001
  teiginys: Straipsnyje aprašomas istorinis faktas.
  pagrindžia:
    - c-001

## Citatos
- id: c-001
  šaltinis: Tyrimo straipsnis (2016 m.)
  puslapiai: p. 42 (PDF 58)
  indeksas: Tyrimo autorius, Tyrimo straipsnis (2016 m.), p. 42 (PDF 58).
  citatos_rezimas: indeksas
  pagrindžia:
    - t-001
`
    assert.deepEqual(collectEvidenceIntegrityIssues(indexOnly), [])
  })

  test("normalizes OCR line-break hyphenation and page context", () => {
    const withOcr = `---
pavadinimas: Klastyklė
---
# Klastyklė

## Teiginiai
- t-001
  teiginys: Atskiras javų valymo įrankis.
  pagrindžia:
    - c-001

## Citatos
- c-001
  citata_originali: |
    Su klastykle nuvaro į šalį viską, kas grū-
    duose nereikalinga.
  pagrindžia:
    - t-001
`
    assert.deepEqual(collectEvidenceIntegrityIssues(withOcr), [])
  })

  test("matches non-Latin citation tokens without relying on ASCII-only text", () => {
    const cyrillic = validMarkdown
      .replace("Vytautas vedė kariuomenę prie mūšio.", "Ипатиевская летопись.")
      .replace("Vytautas vedė kariuomenę.", "Ипатиевская летопись.")
    assert.deepEqual(collectEvidenceIntegrityIssues(cyrillic), [])
  })

  test("rejects duplicate global claim ids", () => {
    const duplicate = validMarkdown.replace(
      "\n## Citatos",
      "\n- id: t-002\n  global_id: t-10001\n  teiginys: Kitas teiginys.\n\n## Citatos",
    )
    const issues = collectEvidenceIntegrityIssues(duplicate)
    assert.ok(issues.some((issue) => issue.code === "duplicate_claim_global_id"))
  })

  test("does not trust one weak word prefix for an unrelated citation", () => {
    assert.equal(
      evidenceSupportsClaim(
        "Žalgirio mūšio metu Vytautas Didysis pats vedė savo kariuomenę ir vadovavo visai sąjunginei kariuomenei.",
        "Didelis ir darbininkas. Mokėjo laiką taip suvartoti, jog nė minutė nenueidavo niekais. Pasižymėjo stropiu valdymu.",
        "Vytautas (Lietuvos valdovas, XIV–XV a.)",
      ),
      false,
    )
  })

  test("accepts a direct quote and a short object quote by page context", () => {
    assert.equal(
      evidenceSupportsClaim(
        "Vytautas vedė kariuomenę.",
        "Vytautas savo kariuomenę pats vedė.",
        "Vytautas",
      ),
      true,
    )
    assert.equal(
      evidenceSupportsClaim(
        "Atskiras javų valymo įrankis.",
        "Su klastykle nuvaro į šalį viską, kas grūduose nereikalinga.",
        "Klastyklė",
      ),
      true,
    )
  })

  test("rejects duplicate global ids across documents and missing global ids", () => {
    const issues = collectCorpusEvidenceIntegrityIssues([
      { filePath: "a.md", markdown: validMarkdown },
      {
        filePath: "b.md",
        markdown: validMarkdown.replace("t-10001", "t-10001").replace("t-001", "t-002"),
      },
      {
        filePath: "c.md",
        markdown: validMarkdown.replace("  global_id: t-10001\n", ""),
      },
    ])
    assert.ok(issues.some((issue) => issue.code === "duplicate_claim_global_id_across_files"))
    assert.ok(issues.some((issue) => issue.code === "missing_claim_global_id"))
  })
})
