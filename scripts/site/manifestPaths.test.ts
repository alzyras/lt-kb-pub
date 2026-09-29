import { strict as assert } from "node:assert"
import { describe, it } from "node:test"
import { indexNormalizedPaths } from "./manifestPaths"

describe("public manifest path normalization", () => {
  it("matches composed and decomposed Lithuanian filenames while preserving their filesystem path", () => {
    const composed = "objektai/zodynas/žodis.md"
    const decomposed = composed.normalize("NFD")
    const index = indexNormalizedPaths([decomposed])

    assert.equal(index.paths.get(composed.normalize("NFC")), decomposed)
    assert.deepEqual(index.collisions, [])
  })

  it("reports distinct files that collide after Unicode normalization", () => {
    const composed = "objektai/zodynas/žodis.md"
    const decomposed = composed.normalize("NFD")
    const index = indexNormalizedPaths([composed, decomposed])

    assert.equal(index.paths.size, 1)
    assert.deepEqual(index.collisions, [{ key: composed, paths: [composed, decomposed] }])
  })

  it("does not conflate case-distinct filenames", () => {
    const index = indexNormalizedPaths(["objektai/X.md", "objektai/x.md"])
    assert.equal(index.paths.size, 2)
    assert.deepEqual(index.collisions, [])
  })
})
