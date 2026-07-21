import test, { describe } from "node:test"
import assert from "node:assert"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { relative, resolve, sep } from "node:path"
import { parseEvidenceSections } from "./citationFilter"
import {
  evidenceCitationQuoteForClaim,
  evidenceDocumentContext,
  evidenceSupportsClaim,
  evidenceTextOverlapScore,
} from "./evidenceIntegrity"
import { exhibitionFeaturedCount, exhibitionItemCount, loadExhibitions } from "./exhibitions"
import { createUniqueSlugMap, type FilePath, type FullSlug } from "./path"

function markdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name)
    if (entry.isDirectory()) return markdownFiles(path)
    return entry.isFile() && entry.name.endsWith(".md") ? [path] : []
  })
}

const sourceFiles = markdownFiles(resolve(process.cwd(), "objektai"))
const sourceRelativePaths = sourceFiles.map(
  (filePath) => relative(process.cwd(), filePath).replaceAll(sep, "/") as FilePath,
)
const sourceSlugMap = createUniqueSlugMap(sourceRelativePaths)
const sourceFileBySlug = new Map(
  sourceFiles.map((filePath, index) => [sourceSlugMap.get(sourceRelativePaths[index]), filePath]),
)

function sourcePath(url: string): string | undefined {
  const parsed = new URL(`http://exhibitions.test${url}`)
  const slug = decodeURIComponent(parsed.pathname).replace(/^\//, "").replace(/\/$/, "")
  const path = sourceFileBySlug.get(slug as FullSlug)
  return path && existsSync(path) ? path : undefined
}

function normalized(value: string): string {
  return value
    .trim()
    .replaceAll("\\n", "\n")
    .replace(/[-\u00ad]\s*\n\s*(?=\p{L})/gu, "")
    .toLocaleLowerCase("lt")
    .replace(/\s+/g, " ")
}

describe("exhibition manifest", () => {
  const exhibitions = loadExhibitions()
  const historical = exhibitions.find(
    (entry) => entry.exhibitionId === "vytautas-didysis-tarp-istorijos-ir-atvaizdo",
  )
  const interwar = exhibitions.find(
    (entry) => entry.slug === "parodos/vytauto-atminties-kultas-tarpukariu",
  )

  test("keeps the two curated stories complete and distinct", () => {
    assert.ok(historical)
    assert.ok(interwar)
    assert.equal(historical.title, "Vytautas Didysis: ikonografijos raida")
    assert.equal(
      historical.slug,
      "parodos/vytautas-didysis-ikonografijos-raida",
      "the exhibition must use its new canonical URL",
    )
    assert.deepEqual(historical.legacySlugs, [
      "parodos/vytautas-didysis-tarp-istorijos-ir-atvaizdo",
    ])
    assert.equal(historical.sections.length, 6)
    assert.equal(exhibitionItemCount(historical), 32)
    assert.equal(exhibitionFeaturedCount(historical), 24)
    assert.equal(interwar.sections.length, 5)
    assert.equal(exhibitionItemCount(interwar), 20)
    // The second Klaipėda frame remains featured as a deliberately linked view
    // of the same event. Undated variants and alternate object sides stay catalog-only.
    assert.equal(exhibitionFeaturedCount(interwar), 15)

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

  test("keeps the interwar story chronological, dated, and free of retired evidence links", () => {
    assert.ok(interwar)
    const items = interwar.sections.flatMap((section) => section.items)
    assert.equal(items[0]?.mediaId, "m-2e8570d6a456b1ef3cbc51a9")
    assert.equal(items.length, 20)
    assert.equal(
      new Set(items.map((item) => normalized(item.titleLt))).size,
      items.length,
      "interwar exhibit titles must be distinct",
    )
    for (const item of items) {
      assert.ok(item.creatorDisplay?.trim(), `${item.exhibitionItemId} needs a curated creator`)
      assert.ok(item.dateDisplay?.trim(), `${item.exhibitionItemId} needs a curated date`)
      assert.doesNotMatch(item.creatorDisplay ?? "", /Unknown author|https?:\/\//i)
      assert.doesNotMatch(item.dateDisplay ?? "", /date QS:|\d{4}-\d{2}-\d{2} \d{2}:/i)
    }

    const claimIds = interwar.sections.flatMap((section) => [
      ...section.claimRefs.map((claim) => claim.claimId),
      ...section.items.flatMap((item) => item.claimRefs.map((claim) => claim.claimId)),
    ])
    const retiredClaimIds: Array<`t-${number}`> = ["t-78074", "t-35760", "t-64800"]
    for (const retiredClaimId of retiredClaimIds) {
      assert.ok(!claimIds.includes(retiredClaimId), `${retiredClaimId} must not remain in interwar`)
    }
    assert.ok(claimIds.includes("t-77927"))
    assert.ok(claimIds.includes("t-176734"))
    assert.ok(claimIds.includes("t-176642"))
    assert.ok(!claimIds.includes("t-198300"))
    assert.ok(!claimIds.includes("t-176638"))
    assert.ok(!claimIds.includes("t-186370"))

    const featured = items.filter((item) => item.featured)
    for (const item of featured) {
      assert.notEqual(item.dateDisplay, "Data nenurodyta", `${item.exhibitionItemId} is undated`)
    }

    const medalSides = items.filter(
      (item) =>
        item.mediaId === "m-bedd635657c08dd8b0b509d8" ||
        item.mediaId === "m-0c6126f3fd3e94e78b39962c",
    )
    assert.deepEqual(medalSides.map((item) => item.titleLt).sort(), [
      "Jubiliejinio medalio aversas",
      "Jubiliejinio medalio reversas",
    ])
    assert.deepEqual(items.find((item) => item.exhibitionItemId === "atm-kelione-03")?.relation, {
      kind: "same_event_as",
      targetItemId: "atm-kelione-02",
    })
    assert.deepEqual(
      items.find((item) => item.exhibitionItemId === "atm-institucijos-04")?.relation,
      { kind: "alternate_view_of", targetItemId: "atm-institucijos-03" },
    )
    assert.deepEqual(items.find((item) => item.exhibitionItemId === "atm-palikimas-02")?.relation, {
      kind: "alternate_view_of",
      targetItemId: "atm-palikimas-01",
    })
  })

  test("uses trustworthy dates and explicit relations for historical portrait variants", () => {
    assert.ok(historical)
    const items = historical.sections.flatMap((section) => section.items)
    const byId = new Map(items.map((item) => [item.exhibitionItemId, item]))
    assert.equal(byId.get("hist-katalogas-07")?.dateDisplay, "1831 m.")
    assert.equal(byId.get("hist-katalogas-01")?.dateDisplay, "1831–1841 m.")
    assert.equal(byId.get("hist-katalogas-05")?.dateDisplay, "1848 m.")
    assert.ok(byId.get("hist-katalogas-07")?.featured)
    assert.ok(byId.get("hist-katalogas-01")?.featured)
    assert.ok(byId.get("hist-katalogas-05")?.featured)
    assert.deepEqual(byId.get("hist-karuna-04")?.relation, {
      kind: "variant_of",
      targetItemId: "hist-pomirtinis-01",
    })
    assert.deepEqual(byId.get("hist-veidas-03")?.relation, {
      kind: "reproduction_of",
      targetItemId: "hist-pomirtinis-01",
    })
  })

  test("resolves every global claim and its exact supporting quotation", () => {
    for (const exhibition of exhibitions) {
      const seenSectionClaims = new Set<string>()
      const seenExhibitionClaims = new Set<string>()
      for (const section of exhibition.sections) {
        assert.equal(
          section.claims.length,
          section.claimRefs.length,
          `${section.sectionId} silently lost a global claim reference`,
        )
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
          assert.equal(
            item.claims.length,
            item.claimRefs.length,
            `${item.exhibitionItemId} silently lost a global claim reference`,
          )
          assert.equal(item.media.reviewStatus, "accepted")
          assert.ok(item.media.sourceUrl || item.media.thumbUrl)
          assert.ok(
            item.claims.length > 0 ||
              section.claims.length > 0 ||
              Boolean(item.evidenceNoteLt?.trim()) ||
              Boolean(section.evidenceNoteLt?.trim()),
            `${item.exhibitionItemId} has neither evidence nor an explicit metadata-only note`,
          )
        }

        for (const claim of [...section.claims, ...section.items.flatMap((item) => item.claims)]) {
          assert.ok(
            !seenExhibitionClaims.has(claim.claimId),
            `${claim.claimId} repeats within ${exhibition.exhibitionId}`,
          )
          seenExhibitionClaims.add(claim.claimId)
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
          const anchoredGlobalIds = new Map(
            [...markdown.matchAll(/<a id="claim-(t-\d+)"><\/a>\s*-\s*(t-\d+)/g)].map((match) => [
              match[2],
              match[1],
            ]),
          )
          const sourceClaim = (sections.get("Teiginiai") ?? []).find(
            (entry) =>
              entry.fields.get("global_id")?.trim() === claim.claimId ||
              anchoredGlobalIds.get(entry.id) === claim.claimId,
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
            evidenceCitationQuoteForClaim(
              sourceCitation,
              claim.text,
              evidenceDocumentContext(markdown),
              true,
            ),
          )
          assert.ok(
            evidenceTextOverlapScore(claim.text, claim.quote) >= 2,
            `${claim.citationId} has too little direct overlap with ${claim.claimId}`,
          )
          assert.ok(claim.quote.length <= 1_200, `${claim.citationId} display quote is too long`)
          assert.doesNotMatch(
            claim.quote,
            /\b\d+\s+skyrius\b|L\s+I\s+E\s+T\s+U\s+V\s+O\s+S/u,
            `${claim.citationId} display quote contains OCR page furniture`,
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
