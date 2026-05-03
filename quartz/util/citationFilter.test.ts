import test, { describe } from "node:test"
import assert from "node:assert"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { collectCitationMetadata, normalizeCitationSourceId } from "./citationFilter"
import { buildCitationSourceRegistry } from "../plugins/emitters/citationSources"
import { defaultProcessedContent } from "../plugins/vfile"
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
      normalizeCitationSourceId("Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)"),
    ])
    assert.deepEqual(
      metadata.sources.map((source) => ({ id: source.id, count: source.count })),
      [
        {
          id: normalizeCitationSourceId("A. Šapoka (red.), Lietuvos istorija (1936 m.)"),
          count: 2,
        },
        {
          id: normalizeCitationSourceId("Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)"),
          count: 1,
        },
      ],
    )
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

    assert.deepEqual(registry.find((entry) => entry.id === sapokaId), {
      id: sapokaId,
      title: "A. Šapoka (red.), Lietuvos istorija (1936 m.)",
      count: 4,
    })
    assert.deepEqual(registry.find((entry) => entry.id === ivinskisId), {
      id: ivinskisId,
      title: "Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)",
      count: 2,
    })
  })
})
