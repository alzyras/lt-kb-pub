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
  const stateSymbols = exhibitions.find(
    (entry) => entry.exhibitionId === "lietuvos-valstybes-zenklai",
  )
  const authoritySeals = exhibitions.find((entry) => entry.exhibitionId === "valdzia-vaske")

  test("keeps the curated stories complete and distinct", () => {
    assert.ok(historical)
    assert.ok(interwar)
    assert.equal(historical.title, "Vytautas Didysis: istorijos ženklai ir atvaizdo raida")
    assert.equal(
      historical.slug,
      "parodos/vytautas-didysis-istorijos-zenklai-ir-atvaizdo-raida",
      "the exhibition must use its new canonical URL",
    )
    assert.deepEqual(historical.legacySlugs, [
      "parodos/vytautas-didysis-ikonografijos-raida",
      "parodos/vytautas-didysis-tarp-istorijos-ir-atvaizdo",
    ])
    assert.equal(historical.sections.length, 6)
    assert.equal(exhibitionItemCount(historical), 34)
    assert.equal(exhibitionFeaturedCount(historical), 23)
    const preservedHistoricalMediaIds = [
      "m-f8d6413fcf11b237fca95a29",
      "m-d8759e31eee98c44627f7eec",
      "m-e37b77405063bd3988215e2a",
      "m-b250964c8795d8e4c14592f7",
      "m-203da807e4978a3a0aba6612",
      "m-33231b1750795596affa8e7c",
      "m-c79692a260b79859579e757a",
      "m-ea1dbbe398596cd2dcc84124",
      "m-ece9dfb4cc0790980d24121a",
      "m-f396e7f6eccd59dd3f8167fc",
      "m-484ab5f62e4a960c1d978db8",
      "m-1e708d0a5620d5a9bf639d0d",
      "m-51353d97f244528b962f46db",
      "m-d15bf12daf2da3d85cc37a07",
      "m-dcdbe87268bf50ba7819977b",
      "m-9271846f686d86ef49142b33",
      "m-bd5ab71ba61450749fdfcce7",
      "m-a6684ef6e82e8375a5efb21e",
      "m-35077b2615b9697b59f18d18",
      "m-d40580df0a4d385cdf5d7d00",
      "m-b439b9ea85a1a40d2d56519f",
      "m-07b98ddb6657ef599a10a45d",
      "m-c3cdf2ed3b7f84c7ecb7ec6f",
      "m-ef3a92e376d5c48b81f60aaf",
      "m-c0011d2677e2dcece9cf8f30",
      "m-25a52d83da16bb71dce53621",
      "m-c6a643bef80f021679128f09",
      "m-d0f45f8e764022d84712e3d2",
      "m-ab0b3bb8379a2cf0c44289f8",
      "m-91da24b2fe281b6c2a89696a",
      "m-3cf550452aee94802aa495df",
      "m-a3e0336946b8605650d43434",
    ]
    assert.deepEqual(
      new Set(historical.sections.flatMap((section) => section.items.map((item) => item.mediaId))),
      new Set([
        ...preservedHistoricalMediaIds,
        "m-856973a6914daf257388781f",
        "m-3d9cc48e7f9a3b7c760eec00",
      ]),
      "the 32 existing historical exhibits must remain alongside the two approved additions",
    )
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

  test("keeps the state-symbol story ordered, sourced, and ready for chapter navigation", () => {
    assert.ok(stateSymbols)
    assert.equal(stateSymbols.title, "Lietuvos valstybės ženklai")
    assert.equal(stateSymbols.subtitle, "Vytis, Gediminaičių stulpai ir valdžios atmintis")
    assert.equal(stateSymbols.slug, "parodos/lietuvos-valstybes-zenklai")
    assert.equal(stateSymbols.theme, "symbols")
    assert.deepEqual(stateSymbols.relatedObject, {
      href: "/objektai/daiktai/Vytis",
      label: "Vytis istorijos objektas",
    })
    assert.deepEqual(
      stateSymbols.sections.map((section) => section.title),
      [
        "Kai ženklas garantavo žodį",
        "Raitelis tampa Lietuvos herbu",
        "Stulpai, kryžius ir kiti ženklai",
        "Vytis ir Erelis bendroje valstybėje",
        "Ženklai ant pinigų, ginklų ir daiktų",
        "Prarasta ir susigrąžinta simbolių kalba",
      ],
    )
    assert.equal(exhibitionItemCount(stateSymbols), 28)
    assert.equal(exhibitionFeaturedCount(stateSymbols), 28)
    const items = stateSymbols.sections.flatMap((section) => section.items)
    assert.equal(new Set(items.map((item) => item.mediaId)).size, items.length)
    assert.equal(
      new Set(
        stateSymbols.sections.flatMap((section) => [
          ...section.claimRefs.map((claim) => claim.claimId),
          ...section.items.flatMap((item) => item.claimRefs.map((claim) => claim.claimId)),
        ]),
      ).size,
      stateSymbols.sections.length + items.length,
      "every chapter and exhibit must use a distinct global claim ID",
    )
    for (const section of stateSymbols.sections) {
      assert.ok(
        section.items.some((item) => item.mediaId === section.navMediaId),
        `${section.sectionId} navigation image must be one of its exhibits`,
      )
      assert.ok(section.navImagePosition?.trim(), `${section.sectionId} needs an image focus`)
      assert.ok(section.evidenceNoteLt?.trim(), `${section.sectionId} needs an evidence note`)
      assert.equal(section.claimRefs.length, 1, `${section.sectionId} needs one contextual claim`)
      for (const item of section.items) {
        assert.ok(item.evidenceNoteLt?.trim(), `${item.exhibitionItemId} needs an evidence note`)
        assert.equal(item.claimRefs.length, 1, `${item.exhibitionItemId} needs one claim`)
      }
    }
  })

  test("keeps the authority-and-seals story institutional, complete, and distinct", () => {
    assert.ok(authoritySeals)
    assert.equal(authoritySeals.title, "Valdžia vaške")
    assert.equal(authoritySeals.subtitle, "Kas kalbėjo Lietuvos vardu, 1387–1794")
    assert.equal(authoritySeals.slug, "parodos/valdzia-vaske")
    assert.equal(authoritySeals.theme, "documents")
    assert.deepEqual(authoritySeals.relatedObject, {
      href: "/objektai/daiktai/Antspaudas",
      label: "Antspaudas istorijos objektas",
    })
    assert.deepEqual(
      authoritySeals.sections.map((section) => section.title),
      [
        "Nuo rašto iki galiojančio akto",
        "Valdovo raštas kasdienybėje",
        "Didysis antspaudas kalba valstybės vardu",
        "Institucijos įgyja savo balsą",
        "Paskutiniai reformų valstybės antspaudai",
      ],
    )
    assert.equal(exhibitionItemCount(authoritySeals), 23)
    assert.equal(exhibitionFeaturedCount(authoritySeals), 23)
    const items = authoritySeals.sections.flatMap((section) => section.items)
    assert.equal(new Set(items.map((item) => item.mediaId)).size, items.length)
    for (const section of authoritySeals.sections) {
      assert.ok(
        section.items.some((item) => item.mediaId === section.navMediaId),
        `${section.sectionId} navigation image must be one of its exhibits`,
      )
      assert.ok(section.navImagePosition?.trim(), `${section.sectionId} needs an image focus`)
      assert.ok(section.evidenceNoteLt?.trim(), `${section.sectionId} needs an evidence note`)
      assert.equal(section.claimRefs.length, 1, `${section.sectionId} needs one contextual claim`)
    }
    for (const item of items) {
      assert.ok(item.creatorDisplay?.trim(), `${item.exhibitionItemId} needs a curated creator`)
      assert.ok(item.dateDisplay?.trim(), `${item.exhibitionItemId} needs a curated date`)
      assert.ok(item.evidenceNoteLt?.trim(), `${item.exhibitionItemId} needs an evidence note`)
      assert.doesNotMatch(item.creatorDisplay ?? "", /Unknown author|https?:\/\//i)
      assert.doesNotMatch(item.dateDisplay ?? "", /date QS:|\d{4}-\d{2}-\d{2} \d{2}:/i)
    }
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
    const retiredClaimIds: Array<`t-${number}`> = [
      "t-78074",
      "t-35760",
      "t-64800",
      "t-176642",
    ]
    for (const retiredClaimId of retiredClaimIds) {
      assert.ok(!claimIds.includes(retiredClaimId), `${retiredClaimId} must not remain in interwar`)
    }
    assert.ok(claimIds.includes("t-77927"))
    assert.ok(claimIds.includes("t-176734"))
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
    assert.equal(
      historical.sections.find((section) =>
        section.items.some((item) => item.exhibitionItemId === "hist-veidas-03"),
      )?.sectionId,
      "vyt-spausdintas-valdovas-1578-1675",
    )
    assert.equal(byId.get("hist-hero-1878-matejko")?.mediaId, "m-856973a6914daf257388781f")
    assert.equal(byId.get("hist-hero-1875-starzynski")?.mediaId, "m-3d9cc48e7f9a3b7c760eec00")
    assert.ok(byId.get("hist-hero-1878-matejko")?.featured)
    assert.ok(byId.get("hist-hero-1875-starzynski")?.featured)
    assert.equal(byId.get("hist-hero-1878-matejko")?.dateDisplay, "1878 m.")
    assert.equal(byId.get("hist-hero-1875-starzynski")?.dateDisplay, "1875–1900 m.")
    assert.equal(
      historical.sections.find((section) =>
        section.items.some((item) => item.exhibitionItemId === "hist-katalogas-06"),
      )?.sectionId,
      "vyt-romantizmo-portretai-1837-1870",
    )
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
