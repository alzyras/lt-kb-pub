import assert from "node:assert/strict"
import test from "node:test"
import {
  assertPublishableMediaAttribution,
  collectMediaAttributionIssues,
  mediaLicenseDefinition,
  normalizeMediaAttribution,
} from "./mediaAttribution"

test("normalizes license labels and canonical URLs into the controlled vocabulary", () => {
  const normalized = normalizeMediaAttribution({
    mediaId: "europeana-one",
    license: "http://creativecommons.org/licenses/by/4.0/",
    licenseUrl: "",
    canonicalUrl: "https://www.europeana.eu/item/123#record",
    provider: "europeana",
    providerLabel: "Trakai History Museum",
    creator: "Jonas Dailininkas",
  })

  assert.equal(normalized.license, "CC BY 4.0")
  assert.equal(normalized.licenseUrl, "https://creativecommons.org/licenses/by/4.0/")
  assert.equal(normalized.canonicalUrl, "https://www.europeana.eu/item/123")
  assert.match(normalized.attribution ?? "", /Jonas Dailininkas/)
  assert.match(normalized.attribution ?? "", /Trakai History Museum/)
  assert.match(normalized.attribution ?? "", /Europeana/)
  assert.match(normalized.attribution ?? "", /www\.europeana\.eu\/item\/123/)
  assert.match(normalized.attribution ?? "", /CC BY 4\.0/)
  assert.deepEqual(collectMediaAttributionIssues([normalized]), [])
})

test("replaces uninformative own-work credits with a complete constructed credit", () => {
  const normalized = normalizeMediaAttribution({
    mediaId: "commons-one",
    license: "CC BY-SA 3.0 pl",
    attribution: "Own work",
    canonicalUrl: "https://commons.wikimedia.org/wiki/File:Example.jpg",
    creator: "Example Author",
    providerLabel: "Wikimedia Commons",
  })

  assert.equal(normalized.license, "CC BY-SA 3.0 PL")
  assert.equal(normalized.licenseUrl, "https://creativecommons.org/licenses/by-sa/3.0/pl/")
  assert.doesNotMatch(normalized.attribution ?? "", /Own work/)
  assert.match(normalized.attribution ?? "", /Example Author/)
})

test("blocks attribution-required assets without a record or responsible credit party", () => {
  const invalid = normalizeMediaAttribution({
    mediaId: "invalid-by",
    license: "CC BY 4.0",
    sourceUrl: "https://images.example/one.jpg",
  })

  assert.equal(mediaLicenseDefinition(invalid)?.attributionRequired, true)
  assert.deepEqual(collectMediaAttributionIssues([invalid]), [
    { mediaId: "invalid-by", missing: ["canonicalUrl", "creditParty"] },
  ])
  assert.throws(
    () => assertPublishableMediaAttribution([invalid]),
    /Media attribution integrity failed.*invalid-by/,
  )
})

test("normalizes restricted Creative Commons attribution licenses", () => {
  const unsupported = normalizeMediaAttribution({
    mediaId: "unsupported-by-nc",
    license: "CC BY-NC 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
    canonicalUrl: "https://example.test/record",
    creator: "Example Author",
    provider: "example",
  })

  assert.equal(unsupported.license, "CC BY-NC 4.0")
  assert.equal(mediaLicenseDefinition(unsupported)?.id, "CC-BY-NC")
  assert.equal(unsupported.licenseUrl, "https://creativecommons.org/licenses/by-nc/4.0/")
  assert.deepEqual(collectMediaAttributionIssues([unsupported]), [])
})

test("normalizes compact institutional rights labels", () => {
  const entries = [
    normalizeMediaAttribution({
      mediaId: "epaveldas-noc",
      license: "NOC-NC",
      rightsNote: "NOC-NC",
      canonicalUrl: "https://www.epaveldas.lt/preview?id=one",
      provider: "epaveldas",
      creator: "Example Author",
    }),
    normalizeMediaAttribution({
      mediaId: "epaveldas-edu",
      license: "InC-EDU",
      rightsNote: "InC-EDU",
      canonicalUrl: "https://www.epaveldas.lt/preview?id=two",
      provider: "epaveldas",
      creator: "Example Author",
    }),
  ]

  assert.equal(entries[0].license, "No Copyright - Non-Commercial Use Only 1.0")
  assert.equal(entries[0].licenseUrl, "https://rightsstatements.org/vocab/NoC-NC/1.0/")
  assert.equal(entries[1].license, "In Copyright - Educational Use Permitted 1.0")
  assert.equal(entries[1].licenseUrl, "https://rightsstatements.org/vocab/InC-EDU/1.0/")
})

test("does not require attribution for public-domain and CC0 assets", () => {
  const entries = [
    normalizeMediaAttribution({ mediaId: "pdm", license: "Public domain" }),
    normalizeMediaAttribution({ mediaId: "pd-short", license: "PD" }),
    normalizeMediaAttribution({ mediaId: "cc0", license: "CC0" }),
  ]

  assert.equal(entries[1].license, "Public Domain Mark 1.0")
  assert.equal(entries[1].licenseUrl, "https://creativecommons.org/publicdomain/mark/1.0/")
  assert.equal(mediaLicenseDefinition("unspecified"), undefined)
  assert.deepEqual(collectMediaAttributionIssues(entries), [])
})
