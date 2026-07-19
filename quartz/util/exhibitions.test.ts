import test, { describe } from "node:test"
import assert from "node:assert"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { parseEvidenceSections } from "./citationFilter"
import {
  evidenceCitationQuoteForClaim,
  evidenceDocumentContext,
  evidenceSupportsClaim,
} from "./evidenceIntegrity"
import { exhibitionFeaturedCount, exhibitionItemCount, loadExhibitions } from "./exhibitions"

function sourcePath(url: string): string | undefined {
  const parsed = new URL(`http://exhibitions.test${url}`)
  const relativePath = decodeURIComponent(parsed.pathname).replace(/^\//, "")
  const path = join(process.cwd(), `${relativePath}.md`)
  return existsSync(path) ? path : undefined
}

function normalized(value: string): string {
  return value.trim().toLocaleLowerCase("lt").replace(/\s+/g, " ")
}

describe("exhibition manifest", () => {
  const exhibitions = loadExhibitions()
  const historical = exhibitions.find(
    (entry) => entry.slug === "parodos/vytautas-didysis-tarp-istorijos-ir-atvaizdo",
  )
  const interwar = exhibitions.find(
    (entry) => entry.slug === "parodos/vytauto-atminties-kultas-tarpukariu",
  )

  test("keeps the two curated stories complete and distinct", () => {
    assert.ok(historical)
    assert.ok(interwar)
    assert.equal(historical.sections.length, 6)
    assert.equal(exhibitionItemCount(historical), 32)
    assert.equal(exhibitionFeaturedCount(historical), 24)
    assert.equal(interwar.sections.length, 5)
    assert.equal(exhibitionItemCount(interwar), 20)
    assert.equal(exhibitionFeaturedCount(interwar), 20)

    const allItems = exhibitions.flatMap((exhibition) =>
      exhibition.sections.flatMap((section) => section.items),
    )
    const unique = (values: string[], label: string) =>
      assert.equal(new Set(values.filter(Boolean)).size, values.filter(Boolean).length, label)
    unique(
      allItems.map((item) => item.mediaId),
      "media IDs must not repeat across exhibitions",
    )
    unique(
      allItems.map((item) => item.media.canonicalUrl ?? ""),
      "canonical media URLs must not repeat across exhibitions",
    )
    unique(
      allItems.map((item) => item.media.sourceUrl ?? ""),
      "source media URLs must not repeat across exhibitions",
    )
    unique(
      allItems.map((item) => normalized(item.descriptionLt)),
      "curatorial descriptions must not repeat",
    )
  })

  test("resolves every global claim and its exact supporting quotation", () => {
    for (const exhibition of exhibitions) {
      const seenSectionClaims = new Set<string>()
      for (const section of exhibition.sections) {
        assert.ok(section.navMediaId)
        assert.ok(section.navMedia.sourceUrl || section.navMedia.thumbUrl)
        assert.ok(
          section.items.some((item) => item.mediaId === section.navMediaId),
          `${section.sectionId} navigation image is not one of its exhibits`,
        )
        for (const claim of section.claims) {
          assert.ok(!seenSectionClaims.has(claim.claimId), `${claim.claimId} repeats by section`)
          seenSectionClaims.add(claim.claimId)
        }
        for (const item of section.items) {
          assert.equal(item.media.reviewStatus, "accepted")
          assert.ok(item.media.sourceUrl || item.media.thumbUrl)
          assert.ok(
            item.claims.length > 0 || section.claims.length > 0,
            `${item.exhibitionItemId} has no item or section evidence`,
          )
        }

        for (const claim of [...section.claims, ...section.items.flatMap((item) => item.claims)]) {
          assert.match(claim.claimId, /^t-\d+$/)
          assert.match(claim.citationId, /^c-\d+$/)
          assert.ok(claim.text)
          assert.ok(claim.quote)
          assert.ok(claim.sourceTitle)
          assert.match(claim.url, new RegExp(`#claim-${claim.claimId}$`))
          const file = sourcePath(claim.url)
          assert.ok(file, `${claim.url} source file is missing`)
          const markdown = readFileSync(file, "utf8")
          const sections = parseEvidenceSections(markdown)
          const sourceClaim = (sections.get("Teiginiai") ?? []).find(
            (entry) => entry.fields.get("global_id")?.trim() === claim.claimId,
          )
          const sourceCitation = [...sections.values()]
            .flat()
            .find((entry) => entry.id === claim.citationId)
          assert.ok(sourceClaim, `${claim.claimId} is missing from ${file}`)
          assert.ok(sourceCitation, `${claim.citationId} is missing from ${file}`)
          assert.equal(sourceClaim.fields.get("teiginys")?.trim(), claim.text)
          assert.ok(
            (
              sourceClaim.lists.get("pagrindžia") ??
              sourceClaim.lists.get("pagrindzia") ??
              []
            ).includes(claim.citationId),
            `${claim.claimId} does not reference ${claim.citationId}`,
          )
          const backlinks =
            sourceCitation.lists.get("pagrindžia") ?? sourceCitation.lists.get("pagrindzia") ?? []
          assert.ok(
            backlinks.includes(sourceClaim.id) || backlinks.includes(claim.claimId),
            `${claim.citationId} does not backlink ${claim.claimId}`,
          )
          assert.equal(
            claim.quote,
            sourceCitation.fields.get("citata_originali")?.trim() ||
              evidenceCitationQuoteForClaim(
                sourceCitation,
                claim.text,
                evidenceDocumentContext(markdown),
              ),
          )
          assert.ok(
            evidenceSupportsClaim(claim.text, claim.quote, evidenceDocumentContext(markdown)),
            `${claim.citationId} does not support ${claim.claimId}`,
          )
          const originalQuote = sourceCitation.fields.get("citata_originali")?.trim()
          if (originalQuote && claim.quote !== originalQuote) {
            assert.ok(
              normalized(originalQuote).includes(normalized(claim.quote)),
              `${claim.citationId} display quote is not an exact excerpt of the original`,
            )
          }
        }
      }
    }
  })
})
