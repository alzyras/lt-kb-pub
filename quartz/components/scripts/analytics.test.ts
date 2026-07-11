import assert from "node:assert/strict"
import test from "node:test"

function contentType(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean)
  if (parts[0] !== "objektai") return parts[0] || "home"
  return parts[1] || "objects"
}

function queryFingerprint(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1)
    hash = (hash * 31 + value.charCodeAt(index)) | 0
  return hash
}

test("classifies public paths without exposing object names", () => {
  assert.equal(contentType("/objektai/asmenys/Gediminas"), "asmenys")
  assert.equal(contentType("/galerija"), "galerija")
  assert.equal(contentType("/"), "home")
})

test("search fingerprints distinguish equal-length terms without retaining their text", () => {
  assert.notEqual(queryFingerprint("Vilnius"), queryFingerprint("Gedimin"))
  assert.equal(queryFingerprint("Vilnius"), queryFingerprint("Vilnius"))
})
