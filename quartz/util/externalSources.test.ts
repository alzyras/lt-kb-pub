import assert from "node:assert/strict"
import test from "node:test"
import {
  externalSourceGroup,
  isAllowedExternalSourceUrl,
  parseExternalSources,
} from "./externalSources"

test("parses, filters and deduplicates published external sources", () => {
  const sources = parseExternalSources(
    JSON.stringify([
      {
        title: "Vytautas Didysis",
        url: "https://lt.wikipedia.org/wiki/Vytautas_Didysis",
        publisher: "Vikipedija",
        kind: "encyclopedia",
      },
      {
        title: "Wikidata: Q218186",
        url: "https://www.wikidata.org/entity/Q218186",
        publisher: "Wikidata",
        kind: "identity",
      },
      {
        title: "duplicate",
        url: "https://lt.wikipedia.org/wiki/Vytautas_Didysis",
        publisher: "Vikipedija",
        kind: "encyclopedia",
      },
      {
        title: "nepatikimas",
        url: "https://example.com/vytautas",
        publisher: "Nežinomas",
        kind: "reference",
      },
      {
        title: "karantine",
        url: "https://www.lnb.lt/quarantine",
        publisher: "LNB",
        kind: "institutional",
        status: "quarantined",
      },
    ]),
  )

  assert.deepEqual(sources, [
    {
      title: "Vytautas Didysis",
      url: "https://lt.wikipedia.org/wiki/Vytautas_Didysis",
      publisher: "Vikipedija",
      kind: "encyclopedia",
    },
  ])
  assert.equal(externalSourceGroup(sources[0]), "Vikipedija")
})

test("accepts only HTTPS allowlisted source hosts", () => {
  assert.equal(isAllowedExternalSourceUrl("https://www.vle.lt/straipsnis/vytautas-didysis/"), true)
  assert.equal(isAllowedExternalSourceUrl("http://www.vle.lt/straipsnis/vytautas-didysis/"), false)
  assert.equal(isAllowedExternalSourceUrl("https://example.com/source"), false)
})
