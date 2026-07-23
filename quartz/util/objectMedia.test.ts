import assert from "node:assert"
import { describe, it } from "node:test"
import {
  displayCreator,
  displayDate,
  mediaDetailSlug,
  mediaDetailUrl,
  mediaImageUrl,
  mergeMediaEntries,
  withMediaDetailUrl,
} from "./objectMedia"

describe("media catalog", () => {
  it("removes Wikimedia machine metadata from display values", () => {
    assert.equal(displayCreator("w:Diebold Schilling"), "Diebold Schilling")
    assert.equal(
      displayDate('circa 1515 date QS:P,+1515-00-00T00:00:00Z/9, in "Luzerner Schilling"'),
      "circa 1515",
    )
  })

  it("deduplicates provider media and merges tags and object links", () => {
    const result = mergeMediaEntries([
      {
        mediaId: "m-one",
        caption: "Vaizdas",
        confidence: 0.8,
        tags: [{ code: "portretas", label: "Portretas" }],
        relatedObjects: [{ notePath: "objektai/asmenys/Vytautas.md", title: "Vytautas" }],
      },
      {
        mediaId: "m-one",
        confidence: 0.95,
        tags: [{ code: "valdovas", label: "Valdovas" }],
        relatedObjects: [{ notePath: "objektai/vietos/Trakai.md", title: "Trakai" }],
      },
    ])
    assert.equal(result.length, 1)
    assert.equal(result[0].confidence, 0.95)
    assert.deepEqual(result[0].tags?.map((tag) => tag.code).sort(), ["portretas", "valdovas"])
    assert.deepEqual(result[0].relatedObjects?.map((object) => object.title).sort(), [
      "Trakai",
      "Vytautas",
    ])
  })

  it("builds a readable stable media detail URL with an id suffix", () => {
    const entry = withMediaDetailUrl({
      mediaId: "m-a9916882f77bc13171fd77b9",
      caption: "Žalgirio mūšio miniatiūra iš Liucernos kronikos, 1410 m.",
    })

    assert.equal(
      mediaDetailSlug(entry),
      "galerija/zalgirio-musio-miniatiura-is-liucernos-kronikos-1410-m--m-a9916882f77bc13171fd77b9",
    )
    assert.equal(
      mediaDetailUrl(entry),
      "/galerija/zalgirio-musio-miniatiura-is-liucernos-kronikos-1410-m--m-a9916882f77bc13171fd77b9",
    )
  })

  it("uses the DB-selected thumbnail when the archival source is not an image", () => {
    const thumbnail = "https://api.europeana.eu/thumbnail/v2/url.json?uri=record.pdf&type=IMAGE"
    assert.equal(
      mediaImageUrl({ sourceUrl: "https://archive.example/record.pdf", thumbUrl: thumbnail }),
      thumbnail,
    )
  })
})
