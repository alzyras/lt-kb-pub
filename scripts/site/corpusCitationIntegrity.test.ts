import test from "node:test"
import assert from "node:assert/strict"
import { collectCorpusCitationIdIssues } from "./corpusCitationIntegrity"

function citation({
  source = "Kronika (1971 m.)",
  page = "p. 42",
  quote = "Vytautas vedė kariuomenę.",
  updatedAt = "2026-01-01",
}: { source?: string; page?: string; quote?: string; updatedAt?: string } = {}): string {
  return `## Citatos
- id: c-10001
  šaltinis: "${source}"
  puslapiai: "${page}"
  citata_originali: "${quote}"
  atnaujinta: "${updatedAt}"
`
}

test("allows an identical global citation record to appear on multiple object pages", () => {
  const issues = collectCorpusCitationIdIssues([
    { filePath: "a.md", markdown: citation() },
    { filePath: "b.md", markdown: citation({ updatedAt: "2026-09-01" }) },
  ])
  assert.deepEqual(issues, [])
})

test("rejects a reused global citation ID when source, page, or quotation differs", () => {
  for (const conflictingRecord of [
    citation({ source: "Kitas leidinys" }),
    citation({ page: "p. 43" }),
    citation({ quote: "Vilnius buvo miestas." }),
  ]) {
    const issues = collectCorpusCitationIdIssues([
      { filePath: "a.md", markdown: citation() },
      { filePath: "b.md", markdown: conflictingRecord },
    ])
    assert.equal(
      issues.filter((issue) => issue.code === "duplicate_global_citation_id_across_files").length,
      1,
    )
  }
})

test("keeps rejecting local citation IDs in public global-citation pages", () => {
  const issues = collectCorpusCitationIdIssues([
    { filePath: "a.md", markdown: citation().replace("c-10001", "c-001") },
  ])
  assert.equal(issues[0]?.code, "non_global_citation_id")
})
