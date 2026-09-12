import assert from "node:assert/strict"
import test from "node:test"
import { validateSiteStylesheet } from "./siteStylesheet"

const theme = `:root {
  --bm-font: Arial; --ui-page: white; --bodyFont: Arial;
  --light: white; --secondary: red;
} body { margin: 0; font-family: var(--bodyFont); }`

test("accepts the generated escaped-space syntax-highlighting selector", () => {
  assert.doesNotThrow(() =>
    validateSiteStylesheet(String.raw`code[data-theme*=\ ] { color: red; }` + theme),
  )
})

test("rejects the formatter-corrupted selector that swallows the global stylesheet", () => {
  assert.throws(() =>
    validateSiteStylesheet(String.raw`code[data-theme*="\"] { color: red; }` + theme),
  )
})

test("rejects a component-only stylesheet with the global theme missing", () => {
  assert.throws(
    () => validateSiteStylesheet(".object-detail-hero { display: grid; }"),
    /missing the global theme property/,
  )
})
