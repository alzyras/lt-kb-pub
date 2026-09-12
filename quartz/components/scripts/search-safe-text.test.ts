import test from "node:test"
import assert from "node:assert/strict"
import { splitSearchText } from "./search-safe-text"

test("keeps malicious imported titles as text, never HTML", () => {
  const title = '<img src=x onerror="window.__searchXss=true">'
  const parts = splitSearchText(title, ["img"])
  assert.equal(parts.map((part) => part.text).join(""), title)
  assert.equal(parts.filter((part) => part.highlighted).map((part) => part.text).join(""), "img")
  assert.doesNotMatch(parts.map((part) => part.text).join(""), /<mark|<span/i)
})
