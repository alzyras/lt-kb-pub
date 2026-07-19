import test, { describe } from "node:test"
import assert from "node:assert"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { exhibitionFeaturedCount, exhibitionItemCount, loadExhibitions } from "./exhibitions"

function sourceContainsClaimAnchor(url: string): boolean {
  const parsed = new URL(`http://exhibitions.test${url}`)
  const relativePath = decodeURIComponent(parsed.pathname).replace(/^\//, "")
  const candidates = [
    join(process.cwd(), "content", `${relativePath}.md`),
    join(
      process.cwd(),
      "content",
      relativePath.replace(/Vytautas-Didysis$/, "Vytautas") + ".md",
    ),
  ]
  const sourcePath = candidates.find((candidate) => existsSync(candidate))
  return Boolean(sourcePath && readFileSync(sourcePath, "utf8").includes(parsed.hash.slice(1)))
}

function sourceClaimText(url: string, code: string): string | undefined {
  const parsed = new URL(`http://exhibitions.test${url}`)
  const relativePath = decodeURIComponent(parsed.pathname).replace(/^\//, "")
  const candidates = [
    join(process.cwd(), "content", `${relativePath}.md`),
    join(
      process.cwd(),
      "content",
      relativePath.replace(/Vytautas-Didysis$/, "Vytautas") + ".md",
    ),
  ]
  const sourcePath = candidates.find((candidate) => existsSync(candidate))
  if (!sourcePath) return undefined
  const lines = readFileSync(sourcePath, "utf8").split("\n")
  const anchor = `<a id="claim-${code}"></a>`
  const anchorIndex = lines.findIndex((line) => line.includes(anchor))
  if (anchorIndex < 0) return undefined
  for (const line of lines.slice(anchorIndex, anchorIndex + 80)) {
    const match = line.match(/^\s*teiginys:\s*"(.*)"$/)
    if (match) return match[1]
  }
  return undefined
}

describe("exhibition manifest", () => {
  test("keeps the published Vytautas exhibition complete and internally linked", () => {
    const exhibition = loadExhibitions().find(
      (entry) => entry.slug === "parodos/vytautas-didysis-tarp-istorijos-ir-atvaizdo",
    )
    assert.ok(exhibition)
    assert.equal(exhibition.sections.length, 6)
    assert.equal(exhibitionItemCount(exhibition), 32)
    assert.equal(exhibitionFeaturedCount(exhibition), 24)

    const items = exhibition.sections.flatMap((section) => section.items)
    assert.equal(new Set(items.map((item) => item.mediaId)).size, items.length)
    assert.ok(items.some((item) => (item.media.sourceTags ?? []).length > 0))

    for (const item of items) {
      assert.ok(item.claims.length > 0, `${item.exhibitionItemId} has no supporting claim`)
      assert.equal(item.media.reviewStatus, "accepted")
      assert.ok(item.media.sourceUrl || item.media.thumbUrl)
      for (const claim of item.claims) {
        assert.match(claim.url, /^\/objektai\/asmenys\/Vytautas-Didysis#claim-t-\d+$/)
        assert.equal(claim.code, claim.url.match(/#claim-(t-\d+)$/)?.[1])
        assert.ok(claim.text.length > 0)
        assert.ok(claim.sourceTitle.length > 0)
        assert.ok(sourceContainsClaimAnchor(claim.url), `${claim.url} has no source anchor`)
        assert.equal(sourceClaimText(claim.url, claim.code), claim.text)
      }
    }
  })

  test("loads the distinct interwar memory exhibition without reusing images", () => {
    const exhibitions = loadExhibitions()
    const historical = exhibitions.find(
      (entry) => entry.slug === "parodos/vytautas-didysis-tarp-istorijos-ir-atvaizdo",
    )
    const interwar = exhibitions.find(
      (entry) => entry.slug === "parodos/vytauto-atminties-kultas-tarpukariu",
    )
    assert.ok(historical)
    assert.ok(interwar)
    assert.equal(interwar.theme, "interwar")
    assert.equal(exhibitionItemCount(interwar), 20)
    assert.equal(exhibitionFeaturedCount(interwar), 20)

    const historicalMedia = new Set(
      historical.sections.flatMap((section) => section.items).map((item) => item.mediaId),
    )
    const interwarItems = interwar.sections.flatMap((section) => section.items)
    assert.equal(interwarItems.filter((item) => historicalMedia.has(item.mediaId)).length, 0)
    for (const item of interwarItems) {
      assert.ok(item.media.sourceUrl || item.media.thumbUrl)
      assert.ok(item.claims.length > 0, `${item.exhibitionItemId} has no contextual source`)
      for (const claim of item.claims) {
        assert.ok(claim.url.startsWith("/objektai/"))
        assert.equal(claim.code, claim.url.match(/#claim-(t-\d+)$/)?.[1])
        assert.ok(claim.text.length > 0)
        assert.ok(claim.sourceTitle.length > 0)
        assert.ok(sourceContainsClaimAnchor(claim.url), `${claim.url} has no source anchor`)
        assert.equal(sourceClaimText(claim.url, claim.code), claim.text)
      }
    }
  })
})
