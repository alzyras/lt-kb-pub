import test, { describe } from "node:test"
import assert from "node:assert/strict"
import type { MediaEntry } from "./objectMedia"
import { resolveExhibitionNavigationMedia } from "./exhibitionMedia"

const media = (mediaId: string, title: string): MediaEntry => ({ mediaId, title })

describe("exhibition navigation media", () => {
  test("prefers the canonical media catalog", () => {
    const catalogEntry = media("media-1", "Catalog")
    const inlineEntry = media("media-1", "Inline")

    assert.equal(
      resolveExhibitionNavigationMedia(
        "media-1",
        [{ media: inlineEntry }],
        new Map([["media-1", catalogEntry]]),
      ),
      catalogEntry,
    )
  })

  test("uses matching item media when the catalog has no entry", () => {
    const inlineEntry = media("media-1", "Inline")

    assert.equal(
      resolveExhibitionNavigationMedia("media-1", [{ media: inlineEntry }], new Map()),
      inlineEntry,
    )
  })

  test("returns undefined when neither source has a match", () => {
    assert.equal(
      resolveExhibitionNavigationMedia(
        "media-1",
        [{ media: media("media-2", "Other") }],
        new Map(),
      ),
      undefined,
    )
  })
})
