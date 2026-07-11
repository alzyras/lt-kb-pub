import assert from "node:assert"
import { describe, it } from "node:test"
import { mergeMediaEntries } from "./objectMedia"

describe("media catalog", () => {
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
    assert.deepEqual(result[0].relatedObjects?.map((object) => object.title).sort(), ["Trakai", "Vytautas"])
  })
})
