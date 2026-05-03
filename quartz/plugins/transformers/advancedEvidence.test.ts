import test, { describe } from "node:test"
import assert from "node:assert"
import { AdvancedEvidence } from "./advancedEvidence"

const markdown = `# Objektas

## Teiginiai
- id: t-001
  teiginys: Testinis teiginys
  pagrindžia:
    - c-001

## Šaltiniai ir įrodymai
- id: c-001
  santrauka: Paminėjimas
  šaltinis: Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)
  citata_originali: |
    Cituojamas sakinys.
`

describe("AdvancedEvidence transformer", () => {
  test("adds machine-readable claim and citation metadata for filtering", () => {
    const plugin = AdvancedEvidence()
    const transformed = plugin.textTransform?.({} as any, markdown) ?? markdown

    assert.match(transformed, /data-claim-row="true"/)
    assert.match(transformed, /data-supporting-ids="c-001"/)
    assert.match(transformed, /data-citation-entry="true"/)
    assert.match(transformed, /data-citation-id="c-001"/)
    assert.match(transformed, /data-citation-source-title="Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties \(1978 m\.\)"/)
    assert.match(transformed, /data-citation-source-id="zenonas-ivinskis-lietuvos-istorija-iki-vytauto-didziojo-mirties-1978-m"/)
  })
})
