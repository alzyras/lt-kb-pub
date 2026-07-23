import test, { describe } from "node:test"
import assert from "node:assert"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import {
  CITATION_SECTION_TITLES,
  collectClaimCount,
  collectCitationMetadata,
  normalizeCitationSourceId,
  parseEvidenceSections,
} from "./citationFilter"
import {
  buildCitationSourceRegistry,
  buildSourceCatalog,
} from "../plugins/emitters/citationSources"
import { defaultProcessedContent } from "../plugins/vfile"
import { collectEvidenceIntegrityIssues } from "./evidenceIntegrity"
import type { FilePath, FullSlug } from "./path"

const markdown = `---
title: Test Object
---
# Test Object

## Reikšmingi paminėjimai
- id: c-001
  santrauka: Pirmas
  šaltinis: A. Šapoka (red.), Lietuvos istorija (1936 m.)
  citata_originali: |
    Pirma citata.

- id: c-002
  santrauka: Antras
  šaltinis: Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)
  citata_originali: |
    Antra citata.

- id: c-003
  santrauka: Trečias
  šaltinis: A. Šapoka (red.), Lietuvos istorija (1936 m.)
  citata_originali: |
    Trečia citata.
`

function citationEntriesForIntegrity(markdown: string) {
  const sections = parseEvidenceSections(markdown)
  const canonical = (sections.get("Citatos") ?? []).filter((entry) => entry.id.startsWith("c-"))
  const allCitations = [...sections.entries()]
    .filter(([title]) => CITATION_SECTION_TITLES.has(title))
    .flatMap(([, entries]) => entries)
    .filter((entry) => entry.id.startsWith("c-"))
  if (canonical.length > 0) {
    return { sections, citationLookup: allCitations, citationBacklinks: canonical }
  }
  return {
    sections,
    citationLookup: allCitations,
    citationBacklinks: allCitations,
  }
}

function listMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      return listMarkdownFiles(entryPath)
    }
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : []
  })
}

describe("citationFilter metadata", () => {
  test("collects citation counts and source ids from evidence sections", () => {
    const metadata = collectCitationMetadata(markdown)
    assert.equal(metadata.quoteCount, 3)
    assert.deepEqual(metadata.sourceTitles, [
      "A. Šapoka (red.), Lietuvos istorija (1936 m.)",
      "Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)",
    ])
    assert.deepEqual(metadata.sourceIds, [
      normalizeCitationSourceId("A. Šapoka (red.), Lietuvos istorija (1936 m.)"),
      normalizeCitationSourceId(
        "Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)",
      ),
    ])
    assert.deepEqual(
      metadata.sources.map((source) => ({ id: source.id, count: source.count })),
      [
        {
          id: normalizeCitationSourceId("A. Šapoka (red.), Lietuvos istorija (1936 m.)"),
          count: 2,
        },
        {
          id: normalizeCitationSourceId(
            "Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)",
          ),
          count: 1,
        },
      ],
    )
  })

  test("collects claim counts from the Teiginiai section", () => {
    const withClaims = `${markdown}
## Teiginiai
- t-001
  teiginys: Pirmas teiginys.
  pagrindžia:
    - c-001
- t-002
  teiginys: Antras teiginys.
  pagrindžia:
    - c-002

## Ryšiai
- [[Kitas]]
`
    assert.equal(collectClaimCount(withClaims), 2)
  })

  test("builds global citation source registry from processed content", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "citation-filter-"))
    const firstPath = path.join(tempDir, "objektai", "asmenys", "Testas.md")
    const secondPath = path.join(tempDir, "objektai", "daiktai", "Kitas.md")
    fs.mkdirSync(path.dirname(firstPath), { recursive: true })
    fs.mkdirSync(path.dirname(secondPath), { recursive: true })
    fs.writeFileSync(firstPath, markdown)
    fs.writeFileSync(secondPath, markdown.replace("Antra citata.", "Kita citata."))

    const first = defaultProcessedContent({
      slug: "objektai/asmenys/Testas" as FullSlug,
      relativePath: "objektai/asmenys/Testas.md" as FilePath,
      filePath: firstPath as FilePath,
    })
    const second = defaultProcessedContent({
      slug: "objektai/daiktai/Kitas" as FullSlug,
      relativePath: "objektai/daiktai/Kitas.md" as FilePath,
      filePath: secondPath as FilePath,
    })

    const registry = buildCitationSourceRegistry([first, second])
    const sapokaId = normalizeCitationSourceId("A. Šapoka (red.), Lietuvos istorija (1936 m.)")
    const ivinskisId = normalizeCitationSourceId(
      "Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)",
    )

    assert.deepEqual(
      registry.find((entry) => entry.id === sapokaId),
      {
        id: sapokaId,
        title: "A. Šapoka (red.), Lietuvos istorija (1936 m.)",
        objectCount: 2,
        quoteCount: 4,
        count: 4,
      },
    )
    assert.deepEqual(
      registry.find((entry) => entry.id === ivinskisId),
      {
        id: ivinskisId,
        title: "Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)",
        objectCount: 2,
        quoteCount: 2,
        count: 2,
      },
    )
    const catalog = buildSourceCatalog([first, second])
    assert.equal(catalog.find((entry) => entry.id === sapokaId)?.channel, "text")
    assert.equal(catalog.find((entry) => entry.id === sapokaId)?.kind, "book")
  })

  test("keeps Vytautas citations and evidence links intact", () => {
    const vytautasPath = path.resolve("objektai/asmenys/Vytautas.md")
    const vytautasMarkdown = fs.readFileSync(vytautasPath, "utf8")
    const { sections, citationLookup, citationBacklinks } =
      citationEntriesForIntegrity(vytautasMarkdown)
    const claims = sections.get("Teiginiai") ?? []
    const claimIds = new Set(claims.map((entry) => entry.id))
    const citationIds = new Set(citationLookup.map((entry) => entry.id))
    const originalQuoteBlockCount = vytautasMarkdown.match(/^\s*citata_originali:/gm)?.length ?? 0

    assert.ok(
      citationBacklinks.length >= 40,
      `Expected at least 40 Vytautas citations, got ${citationBacklinks.length}`,
    )
    assert.ok(
      originalQuoteBlockCount >= 40,
      `Expected at least 40 Vytautas original quote blocks, got ${originalQuoteBlockCount}`,
    )

    // Global claim identities live in the hidden anchor; public claim fields
    // intentionally expose only the stable local page id.
    const leadershipClaim = claims.find((entry) =>
      (entry.fields.get("teiginys") ?? "").includes("Žalgirio mūšio metu Vytautas Didysis"),
    )
    assert.ok(leadershipClaim, "Expected the Žalgirio leadership claim to remain present")
    assert.match(vytautasMarkdown, /<a id="claim-t-198399"><\/a>/)
    const leadershipSupports = leadershipClaim?.lists.get("pagrindžia") ?? []
    assert.ok(leadershipSupports.length > 0, "Expected the leadership claim to retain evidence")
    const leadershipQuotes = citationLookup
      .filter((entry) => leadershipSupports.includes(entry.id))
      .map((entry) => (entry.fields.get("citata_originali") ?? "").replace(/\u00ad\s*/g, ""))
      .join("\n")
    assert.match(leadershipQuotes, /Vytautas savo kariuomenę pats vedė/)
    assert.doesNotMatch(leadershipQuotes, /Didelis ir darbininkas/)

    for (const claim of claims) {
      const supports = claim.lists.get("pagrindžia") ?? []
      const resolvedSupports = supports.filter((citationId) => citationIds.has(citationId))
      if (claim.fields.get("statusas") === "patvirtinta") {
        assert.notEqual(
          supports.length,
          0,
          `Confirmed claim ${claim.id} has no supporting citations`,
        )
      }
      if (supports.length > 0) {
        assert.ok(
          resolvedSupports.length > 0,
          `Claim ${claim.id} has no resolvable supporting citation`,
        )
      }
    }

    for (const citation of citationBacklinks) {
      for (const claimId of citation.lists.get("pagrindžia") ?? []) {
        assert.ok(
          claimIds.has(claimId),
          `Citation ${citation.id} points to missing claim ${claimId}`,
        )
      }
    }
  })

  test("keeps object evidence links internally consistent", () => {
    const objectFiles = listMarkdownFiles(path.resolve("objektai"))

    for (const filePath of objectFiles) {
      const objectMarkdown = fs.readFileSync(filePath, "utf8")
      const { sections, citationLookup, citationBacklinks } =
        citationEntriesForIntegrity(objectMarkdown)
      const claims = sections.get("Teiginiai") ?? []
      const claimIds = new Set(claims.map((entry) => entry.id))
      const citationIds = new Set(citationLookup.map((entry) => entry.id))

      for (const claim of claims) {
        const supports = claim.lists.get("pagrindžia") ?? []
        const resolvedSupports = supports.filter((citationId) => citationIds.has(citationId))
        if (claim.fields.get("statusas") === "patvirtinta") {
          assert.notEqual(
            supports.length,
            0,
            `${path.relative(process.cwd(), filePath)}: confirmed claim ${claim.id} has no supporting citations`,
          )
        }
        if (supports.length > 0) {
          assert.ok(
            resolvedSupports.length > 0,
            `${path.relative(process.cwd(), filePath)}: claim ${claim.id} has no resolvable supporting citation`,
          )
        }
      }

      for (const citation of citationBacklinks) {
        for (const claimId of citation.lists.get("pagrindžia") ?? []) {
          assert.ok(
            claimIds.has(claimId),
            `${path.relative(process.cwd(), filePath)}: citation ${citation.id} points to missing claim ${claimId}`,
          )
        }
      }
    }
  })

  test("keeps the full object corpus integrity-clean before rendering", () => {
    const failures: string[] = []
    for (const filePath of listMarkdownFiles(path.resolve("objektai"))) {
      const issues = collectEvidenceIntegrityIssues(fs.readFileSync(filePath, "utf8"))
      for (const issue of issues) {
        failures.push(
          `${path.relative(process.cwd(), filePath)}: ${issue.code} ${issue.entryId}${issue.relatedId ? ` -> ${issue.relatedId}` : ""}`,
        )
      }
    }
    assert.deepEqual(failures, [])
  })
})
