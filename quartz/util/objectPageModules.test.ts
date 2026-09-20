import assert from "node:assert/strict"
import test from "node:test"
import { moduleVisible, objectPageModules } from "./objectPageModules"

test("shows populated batch modules and summary candidates outside preview mode", () => {
  const modules = objectPageModules({
    object_page_view_json: JSON.stringify({ wiki: { status: "quarantined", intro: "Įvadas" } }),
    object_page_internal_summary_candidate_json: JSON.stringify({
      status: "quarantined",
      text: "Santrauka",
    }),
  })
  assert.equal(moduleVisible(modules.wiki), true)
  assert.equal(modules.internal_summary.text, "Santrauka")
})

test("retains an existing summary, rejects withdrawn modules and tolerates absent data", () => {
  assert.equal(
    objectPageModules({
      object_page_view_json: { internal_summary: { text: "Esama" } },
      object_page_internal_summary_candidate_json: { text: "Kita" },
    }).internal_summary.text,
    "Esama",
  )
  assert.equal(moduleVisible({ status: "revoked" }), false)
  assert.deepEqual(objectPageModules({ object_page_view_json: "broken" }), {})
})
