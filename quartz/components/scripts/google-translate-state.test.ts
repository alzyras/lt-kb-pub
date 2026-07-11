import assert from "node:assert/strict"
import test from "node:test"
import { localizedUrl, resolvePreferredLanguage } from "./google-translate-state"

test("URL language wins over stored language", () => {
  assert.deepEqual(resolvePreferredLanguage("?lang=de&utm_source=gmail", "en"), {
    language: "de",
    fromUrl: true,
  })
})

test("stored language is used when URL has no supported language", () => {
  assert.deepEqual(resolvePreferredLanguage("?lang=invalid", "uk"), {
    language: "uk",
    fromUrl: false,
  })
})

test("localized URL preserves tracking, media, and hash parameters", () => {
  assert.equal(
    localizedUrl(
      "https://lietuvosistorija.eu/objektai/asmenys/Gediminas?utm_source=gmail&media=portrait#roles",
      "de",
    ),
    "/objektai/asmenys/Gediminas?utm_source=gmail&media=portrait&lang=de#roles",
  )
})

test("Lithuanian removes only the language parameter", () => {
  assert.equal(
    localizedUrl("https://lietuvosistorija.eu/galerija?lang=he&utm_content=gallery", "lt"),
    "/galerija?utm_content=gallery",
  )
})
