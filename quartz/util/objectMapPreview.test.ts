import test from "node:test"
import assert from "node:assert/strict"
import { objectMapPreviewNeighbours } from "./objectMapPreview"

test("object previews retain every public neighbour without an arbitrary cap", () => {
  for (const count of [0, 1, 12, 73, 96, 150, 199, 200, 201, 500]) {
    const neighbours = Array.from({ length: count }, (_, id) => ({ id }))
    const selected = objectMapPreviewNeighbours(neighbours)
    assert.equal(selected.length, count)
    assert.deepEqual(selected, neighbours)
    assert.equal(neighbours.length, count, "selection must not truncate the complete inventory")
  }
})
