import assert from "node:assert/strict"
import test from "node:test"
import { linkEvidenceText } from "./article_links"

test("editorial evidence relinking is idempotent and never nests anchors", () => {
  const links = new Map([["t-12", "/objektai/x/irodymai/#claim-t-12"]])
  const source = '<p><a href="/objektai/x#claim-t-12">įvykis t-12</a></p>'
  const expected = '<p>įvykis <a href="/objektai/x/irodymai/#claim-t-12">t-12</a></p>'
  assert.equal(linkEvidenceText(source, links), expected)
  assert.equal(linkEvidenceText(expected, links), expected)
  assert.equal(linkEvidenceText('<p data-id="t-12">Tekstas</p>', links), '<p data-id="t-12">Tekstas</p>')
})
