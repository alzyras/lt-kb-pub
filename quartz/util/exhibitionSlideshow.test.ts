import assert from "node:assert/strict"
import test from "node:test"
import {
  exhibitionSlideshowDurationMs,
  exhibitionSlideshowIsRtl,
  exhibitionSlideshowLabels,
  exhibitionSlideshowLanguage,
  exhibitionSlideshowNextIndex,
  exhibitionSlideshowSequence,
  type ExhibitionSlideshowItem,
} from "./exhibitionSlideshow"

function item(mediaId: string, featured = true): ExhibitionSlideshowItem {
  return {
    mediaId,
    titleLt: mediaId,
    descriptionLt: "Aprašas",
    dateDisplay: "1930 m.",
    sectionTitle: "Skyrius",
    sectionSlug: "skyrius",
    featured,
  }
}

test("slideshow sequence keeps featured items in story order without duplicates", () => {
  assert.deepEqual(
    exhibitionSlideshowSequence([
      item("first"),
      item("catalogue", false),
      item("second"),
      item("first"),
    ]).map((entry) => entry.mediaId),
    ["first", "second"],
  )
})

test("slideshow duration stays within readable bounds", () => {
  assert.equal(exhibitionSlideshowDurationMs(""), 10_000)
  assert.ok(exhibitionSlideshowDurationMs("žodis ".repeat(20)) > 10_000)
  assert.equal(exhibitionSlideshowDurationMs("žodis ".repeat(200)), 22_000)
})

test("slideshow navigation wraps in both directions", () => {
  assert.equal(exhibitionSlideshowNextIndex(2, 3), 0)
  assert.equal(exhibitionSlideshowNextIndex(0, 3, -1), 2)
  assert.equal(exhibitionSlideshowNextIndex(0, 0), -1)
})

test("slideshow labels cover supported languages and RTL", () => {
  assert.equal(exhibitionSlideshowLanguage("en-US"), "en")
  assert.equal(exhibitionSlideshowLanguage("unknown"), "lt")
  assert.equal(exhibitionSlideshowLabels("de").pause, "Pause")
  assert.equal(exhibitionSlideshowLabels("he").fullscreen, "מסך מלא")
  assert.equal(exhibitionSlideshowIsRtl("he"), true)
  assert.equal(exhibitionSlideshowIsRtl("en"), false)
})
