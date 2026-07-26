import assert from "node:assert/strict"
import test from "node:test"
import { isGeneratedMediaDetailLink } from "./links"

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
