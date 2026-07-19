import test, { describe } from "node:test"
import assert from "node:assert"
import { exhibitionFeaturedCount, exhibitionItemCount, loadExhibitions } from "./exhibitions"

describe("exhibition manifest", () => {
  test("keeps the published Vytautas exhibition complete and internally linked", () => {
    const exhibition = loadExhibitions().find(
      (entry) => entry.slug === "parodos/vytautas-didysis-tarp-istorijos-ir-atvaizdo",
    )
    assert.ok(exhibition)
    assert.equal(exhibition.sections.length, 6)
    assert.equal(exhibitionItemCount(exhibition), 32)
    assert.equal(exhibitionFeaturedCount(exhibition), 24)

    const items = exhibition.sections.flatMap((section) => section.items)
    assert.equal(new Set(items.map((item) => item.mediaId)).size, items.length)
    assert.ok(items.some((item) => (item.media.sourceTags ?? []).length > 0))

    for (const item of items) {
      assert.ok(item.claims.length > 0, `${item.exhibitionItemId} has no supporting claim`)
      assert.equal(item.media.reviewStatus, "accepted")
      assert.ok(item.media.sourceUrl || item.media.thumbUrl)
      for (const claim of item.claims) {
        assert.match(claim.url, /^\/objektai\/asmenys\/Vytautas-Didysis#claim-t-\d+$/)
        assert.ok(claim.text.length > 0)
        assert.ok(claim.sourceTitle.length > 0)
      }
    }
  })

  test("loads the distinct interwar memory exhibition without reusing images", () => {
    const exhibitions = loadExhibitions()
    const historical = exhibitions.find(
      (entry) => entry.slug === "parodos/vytautas-didysis-tarp-istorijos-ir-atvaizdo",
    )
    const interwar = exhibitions.find(
      (entry) => entry.slug === "parodos/vytauto-atminties-kultas-tarpukariu",
    )
    assert.ok(historical)
    assert.ok(interwar)
    assert.equal(interwar.theme, "interwar")
    assert.equal(exhibitionItemCount(interwar), 20)
    assert.equal(exhibitionFeaturedCount(interwar), 20)

    const historicalMedia = new Set(
      historical.sections.flatMap((section) => section.items).map((item) => item.mediaId),
    )
    const interwarItems = interwar.sections.flatMap((section) => section.items)
    assert.equal(interwarItems.filter((item) => historicalMedia.has(item.mediaId)).length, 0)
    for (const item of interwarItems) {
      assert.ok(item.media.sourceUrl || item.media.thumbUrl)
      assert.ok(item.claims.length > 0, `${item.exhibitionItemId} has no contextual source`)
      for (const claim of item.claims) {
        assert.ok(claim.url.startsWith("/objektai/"))
        assert.ok(claim.text.length > 0)
        assert.ok(claim.sourceTitle.length > 0)
      }
    }
  })
})
