import assert from "node:assert/strict"
import test from "node:test"
import { isGeneratedMediaDetailLink, isGeneratedObjectEvidenceLink } from "./links"

test("preserves generated evidence routes only for existing source objects", () => {
  const slugs = ["objektai/asmenys/Motiejus-Valancius"]
  for (const tail of ["/irodymai/#claim-t-12", "/irodymai/2#claim-t-123", "/irodymai"]) {
    assert.equal(isGeneratedObjectEvidenceLink("/" + slugs[0] + tail, slugs), true)
  }
  assert.equal(isGeneratedObjectEvidenceLink("/objektai/asmenys/Unknown/irodymai/#claim-t-12", slugs), false)
  assert.equal(isGeneratedObjectEvidenceLink("/" + slugs[0] + "/irodymai/0", slugs), false)
  assert.equal(isGeneratedObjectEvidenceLink("https://example.com/" + slugs[0] + "/irodymai", slugs), false)
})

test("recognizes canonical generated media detail routes", () => {
  assert.equal(
    isGeneratedMediaDetailLink("/galerija/puota-pas-radvilas--m-article-ebd39ff36cb3f3fe70bb2be3"),
    true,
  )
  assert.equal(
    isGeneratedMediaDetailLink(
      "/galerija/vilniaus-vaizdas-ir-planas-1576-m--m-d9c7a19da6f6d56ef839a3f8",
    ),
    true,
  )
})

test("does not bypass validation for ordinary or malformed gallery links", () => {
  assert.equal(
    isGeneratedMediaDetailLink("/galerija/puota-pas-radvilas-m-article-ebd39ff36cb3f3fe70bb2be3"),
    false,
  )
  assert.equal(isGeneratedMediaDetailLink("/galerija"), false)
  assert.equal(
    isGeneratedMediaDetailLink(
      "https://example.com/galerija/puota--m-article-ebd39ff36cb3f3fe70bb2be3",
    ),
    false,
  )
})
