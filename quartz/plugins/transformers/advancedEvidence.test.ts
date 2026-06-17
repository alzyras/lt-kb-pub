import test, { describe } from "node:test"
import assert from "node:assert"
import { AdvancedEvidence } from "./advancedEvidence"
import { FullSlug } from "../../util/path"

const markdown = `# Objektas

## Teiginiai
- id: t-001
  global_id: t-00042
  teiginys: Testinis teiginys
  sudarymo_pagrindimas: Teiginys performuluotas taip, kad aiškiai įvardytų subjektą ir kontekstą.
  susije_objektai: subject: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Lietuva; location: [[objektai/vietos/Trakai|Trakai]]
  semantiniai_rysiai: [[objektai/asmenys/Vytautas|Vytautas]] valdė teritoriją [[objektai/vietos/Trakai|Trakai]]
  temporaliniai_duomenys: valdymo laikotarpis: 1392-1430
  temporalinis_paaiskinimas: Ši data taikoma Vytauto valdymui, o ne visam jo gyvenimui.
  temporalinis_llm_pakomentavimas: LLM pažymėjo, kad citata aiškiai nurodo valdymo laikotarpį.
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
    const transformed =
      plugin.textTransform?.(
        {
          allSlugs: [
            "objektai/asmenys/Vytautas",
            "objektai/grupes/Zydai",
            "objektai/vietos/Lietuva",
            "objektai/vietos/Trakai",
          ] as FullSlug[],
        } as any,
        markdown,
      ) ?? markdown

    assert.match(transformed, /data-claim-row="true"/)
    assert.match(transformed, /id="claim-t-00042"/)
    assert.match(transformed, /data-global-claim-id="t-00042"/)
    assert.match(transformed, /href="#claim-t-00042"/)
    assert.match(transformed, /data-no-popover="true"/)
    assert.match(transformed, /data-supporting-ids="c-001"/)
    assert.match(transformed, /claim_technical_fields/)
    assert.match(transformed, /sudarymo_pagrindimas/)
    assert.match(transformed, /susije_objektai/)
    assert.match(transformed, /semantiniai_rysiai/)
    assert.match(transformed, /temporaliniai_duomenys/)
    assert.match(transformed, /temporalinis_paaiskinimas/)
    assert.match(transformed, /temporalinis_llm_pakomentavimas/)
    assert.match(transformed, /aiškiai įvardytų subjektą ir kontekstą/)
    assert.doesNotMatch(transformed, /global_id: t-00042/)
    assert.match(transformed, /href="objektai\/asmenys\/Vytautas"/)
    assert.match(transformed, /href="objektai\/vietos\/Lietuva"/)
    assert.match(transformed, />Vytautas<\/a>/)
    assert.match(transformed, /data-citation-entry="true"/)
    assert.match(transformed, /data-citation-id="c-001"/)
    assert.match(transformed, /data-citation-source-title="Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties \(1978 m\.\)"/)
    assert.match(transformed, /data-citation-source-id="zenonas-ivinskis-lietuvos-istorija-iki-vytauto-didziojo-mirties-1978-m"/)
  })

  test("leaves unresolved advanced values as plain text", () => {
    const plugin = AdvancedEvidence()
    const unresolvedMarkdown = `# Objektas

## Teiginiai
- id: t-001
  global_id: t-00043
  teiginys: Testinis teiginys
  susije_objektai: mentioned_place: Nežinoma
  pagrindžia:
    - c-001
`

    const transformed =
      plugin.textTransform?.(
        {
          allSlugs: ["objektai/vietos/Lietuva"] as FullSlug[],
        } as any,
        unresolvedMarkdown,
      ) ?? unresolvedMarkdown

    assert.match(transformed, /mentioned_place: Nežinoma/)
    assert.doesNotMatch(transformed, /href="[^"]*Nežinoma/)
  })
})
