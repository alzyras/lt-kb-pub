import assert from "node:assert/strict"
import test from "node:test"
import { parseEvidenceSections } from "./citationFilter"

test("JSON-escaped display quotes preserve the literal source quotation", () => {
  const quote = 'Žurnalas „Pamiętnik“ ir "knyga".\nKitas sakinys.'
  const md = `## Citatos\n\n- id: c-123\n  citata_rodoma: ${JSON.stringify(quote)}\n`
  const entry = parseEvidenceSections(md).get("Citatos")?.[0]
  assert.equal(entry?.fields.get("citata_rodoma"), quote)
})
