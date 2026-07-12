import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  selectHomeCollectionCandidates,
  type HomeCollectionCandidate,
} from "./homeCollectionSelection"

function candidate(
  slug: string,
  type: string,
  rank: number,
  overrides: Partial<HomeCollectionCandidate> = {},
): HomeCollectionCandidate {
  return {
    slug,
    type,
    rank,
    imageKey: `image-${slug}`,
    imageUrl: `https://example.com/${slug}.jpg`,
    reviewStatus: "accepted",
    directness: "direct",
    ...overrides,
  }
}

describe("home collection media selection", () => {
  it("keeps only accepted direct candidates with images", () => {
    const selected = selectHomeCollectionCandidates([
      candidate("valid", "asmuo", 10),
      candidate("missing", "vieta", 100, { imageUrl: "" }),
      candidate("rejected", "grupe", 100, { reviewStatus: "rejected" }),
      candidate("contextual", "ivykis", 100, { directness: "contextual" }),
    ])

    assert.deepEqual(
      selected.map((entry) => entry.slug),
      ["valid"],
    )
  })

  it("selects one candidate per available type before repeating types", () => {
    const selected = selectHomeCollectionCandidates(
      [
        candidate("person-1", "asmuo", 100),
        candidate("person-2", "asmuo", 90),
        candidate("person-3", "asmuo", 80),
        candidate("place-1", "vieta", 70),
        candidate("group-1", "grupe", 60),
        candidate("source-1", "saltinis", 50),
      ],
      5,
    )

    assert.deepEqual(
      selected.slice(0, 4).map((entry) => entry.type),
      ["asmuo", "vieta", "grupe", "saltinis"],
    )
    assert.equal(selected.filter((entry) => entry.type === "asmuo").length, 2)
  })

  it("deduplicates object slugs and image identities", () => {
    const selected = selectHomeCollectionCandidates([
      candidate("person", "asmuo", 10),
      candidate("person", "asmuo", 20, { imageKey: "better-image" }),
      candidate("place", "vieta", 15, { imageKey: "better-image" }),
      candidate("group", "grupe", 5),
    ])

    assert.deepEqual(
      selected.map((entry) => entry.slug),
      ["person", "group"],
    )
  })

  it("returns a smaller stable selection when fewer candidates are available", () => {
    const selected = selectHomeCollectionCandidates(
      [candidate("place", "vieta", 20), candidate("person", "asmuo", 10)],
      8,
    )

    assert.deepEqual(
      selected.map((entry) => entry.slug),
      ["place", "person"],
    )
  })
})
