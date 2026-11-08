import assert from "node:assert/strict"
import test from "node:test"
import {
  selectCollectionSpotlightItems,
  validCollectionSpotlightData,
  type CollectionSpotlightObject,
} from "./homeCollectionSpotlight"

function object(slug: string, claims: string[]): CollectionSpotlightObject {
  return {
    title: slug,
    slug: `objektai/asmenys/${slug}`,
    typeLabel: "Asmuo",
    claimCount: claims.length,
    claims: claims.map((text, index) => ({ id: `t-${index + 1}`, text })),
  }
}

test("spotlight data keeps every valid object in the loaded collection", () => {
  const input = [
    object("Gediminas", ["Gedimino teiginys"]),
    object("Mindaugas", ["Mindaugo teiginys"]),
  ]
  assert.deepEqual(
    validCollectionSpotlightData(input).map((entry) => entry.slug),
    ["objektai/asmenys/Gediminas", "objektai/asmenys/Mindaugas"],
  )
})

test("spotlight prefers distinct objects and distinct statements", () => {
  const objects = [
    object("Gediminas", ["Gedimino 1", "Gedimino 2"]),
    object("Mindaugas", ["Mindaugo 1", "Mindaugo 2"]),
    object("Vytautas", ["Vytauto 1", "Vytauto 2"]),
  ]

  const selected = selectCollectionSpotlightItems(objects, 4, () => 0)
  assert.equal(selected.length, 4)
  assert.equal(new Set(selected.slice(0, 3).map((entry) => entry.object.slug)).size, 3)
  assert.equal(new Set(selected.map((entry) => entry.claim.text)).size, 4)
})

test("spotlight handles empty input and non-positive limits", () => {
  assert.deepEqual(selectCollectionSpotlightItems([], 5), [])
  assert.deepEqual(selectCollectionSpotlightItems([object("Gediminas", ["Vienas"])], 0), [])
})
