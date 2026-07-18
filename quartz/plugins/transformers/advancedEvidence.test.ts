import test, { describe } from "node:test"
import assert from "node:assert"
import { AdvancedEvidence } from "./advancedEvidence"
import { FullSlug } from "../../util/path"

const markdown = `# Objektas

## Teiginiai
- id: t-001
  global_id: t-00042
  teiginys: Testinis teiginys
  atnaujinta: 2026-07-18 12:34
  saltinio_vieta: 120-156; hash=technical-only; match=exact
  sudarymo_pagrindimas: Teiginys performuluotas taip, kad aiškiai įvardytų subjektą ir kontekstą.
  susije_objektai: subject: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Lietuva; location: [[objektai/vietos/Trakai|Trakai]]
  semantiniai_rysiai: [[objektai/asmenys/Vytautas|Vytautas]] valdė teritoriją [[objektai/vietos/Trakai|Trakai]]
  temporaliniai_duomenys: valdymo laikotarpis: 1392-1430
  temporalinis_paaiskinimas: Ši data taikoma Vytauto valdymui, o ne visam jo gyvenimui.
  temporalinis_llm_pakomentavimas: LLM pažymėjo, kad citata aiškiai nurodo valdymo laikotarpį.
  ryšio_patikimumas: vede -> Jadvyga: 0.94
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: single_candidate_target; owner_before_predicate
  ryšio_sprendimo_taisykle: rule_marriage_local_spouse
  ryšio_subjekto_parinkimas: Vytautas: owner_note_path, person
  ryšio_targeto_parinkimas: Lietuva: nearest_after_predicate, state
  ryšio_slopinti_kandidatai: Trakai: candidate
  ryšio_slopinimo_priezastys: ambiguous_bare_person
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_marriage_local_spouse".
  pagrindžia:
    - c-001

## Šaltiniai ir įrodymai
- id: c-001
  santrauka: Paminėjimas
  autorius: Zenonas Ivinskis
  redaktorius: Test Redaktorius
  šaltinis: Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)
  citata_originali: |
    Cituojamas sakinys.
`

function inspectLazyClaimPayloads(output: string): string {
  return output.replace(
    /<script type="application\/json" data-claim-detail-payload="true">([^<]*)<\/script>/g,
    (_match, payload: string) => JSON.parse(payload),
  )
}

describe("AdvancedEvidence transformer", () => {
  test("renders citations inline under their supporting claim without a duplicate hidden store", () => {
    const plugin = AdvancedEvidence()
    const transformed = inspectLazyClaimPayloads(
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
      ) ?? markdown,
    )

    assert.match(transformed, /data-claim-row="true"/)
    assert.match(transformed, /<thead><tr><th>Teiginys<\/th><\/tr><\/thead>/)
    assert.doesNotMatch(transformed, /<th>Kontekstas<\/th>/)
    assert.doesNotMatch(transformed, /<th>Pagrindžia<\/th>/)
    assert.doesNotMatch(transformed, /colspan="3"/)
    assert.match(transformed, /id="claim-t-00042"/)
    assert.match(transformed, /href="#claim-t-00042"/)
    assert.match(transformed, /aria-controls="claim-evidence-t-00042"/)
    assert.match(transformed, /data-no-popover="true"/)
    assert.match(
      transformed,
      /data-citation-source-ids="zenonas-ivinskis-lietuvos-istorija-iki-vytauto-didziojo-mirties-1978-m"/,
    )
    assert.match(transformed, /data-claim-detail="t-00042"/)
    assert.match(transformed, /id="claim-evidence-t-00042"/)
    assert.match(transformed, /data-claim-citation-id="c-001"/)
    assert.match(transformed, /claim-citation-contributor/)
    assert.match(transformed, /claim-citation-author/)
    assert.match(transformed, /<strong>Autorius:<\/strong> Zenonas Ivinskis/)
    assert.match(transformed, /<strong>Redaktorius:<\/strong> Test Redaktorius/)
    assert.match(transformed, /claim-citation-source/)
    assert.match(
      transformed,
      /<strong>Šaltinis:<\/strong> Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties/,
    )
    assert.match(transformed, /data-claim-evidence-summary="true"/)
    assert.match(transformed, /Patikimumas/)
    assert.match(transformed, /claim-evidence-reliability-high/)
    assert.match(transformed, /aukstas/)
    assert.match(transformed, /Kodėl/)
    assert.match(transformed, /Ryšiai iš šios citatos/)
    assert.match(transformed, /Laikotarpis/)
    assert.match(transformed, /Cituojamas sakinys\./)
    assert.match(transformed, /claim_technical_fields/)
    const claimRowStart = transformed.indexOf('data-claim-row="true"')
    const claimRowEnd = transformed.indexOf("</tr>", claimRowStart)
    assert.ok(claimRowStart >= 0)
    assert.ok(claimRowEnd > claimRowStart)
    const claimRowRegion = transformed.slice(claimRowStart, claimRowEnd)
    assert.doesNotMatch(claimRowRegion, /advanced-evidence-table/)
    assert.doesNotMatch(claimRowRegion, /claim_technical_fields/)
    const claimDetailStart = transformed.indexOf('data-claim-detail="t-00042"')
    const claimDetailEnd = transformed.indexOf("</tr>", claimDetailStart)
    assert.ok(claimDetailStart >= 0)
    assert.ok(claimDetailEnd > claimDetailStart)
    const claimDetailRegion = transformed.slice(claimDetailStart, claimDetailEnd)
    assert.match(claimDetailRegion, /claim-technical-audit/)
    assert.match(claimDetailRegion, /claim_technical_fields/)
    assert.match(transformed, /Teiginio sudarymas/)
    assert.doesNotMatch(transformed, /Viešas ID|Originalus lokalus ID|Globalus ID/)
    assert.doesNotMatch(transformed, /technical-only|quote_start|quote_end|saltinio_vieta/)
    assert.match(transformed, /Paskutinis atnaujinimas/)
    assert.match(transformed, /advanced-field-help/)
    assert.match(transformed, /Susiję objektai/)
    assert.match(transformed, /Ryšiai/)
    assert.match(transformed, /Laikotarpiai/)
    assert.match(transformed, /Laiko paaiškinimas/)
    assert.match(transformed, /Laiko interpretacija/)
    assert.match(transformed, /Ryšio patikimumas/)
    assert.match(transformed, /Ryšio taisyklė/)
    assert.match(transformed, /Ryšio subjektas/)
    assert.match(transformed, /Ryšio objektas/)
    assert.match(transformed, /Atmesti ryšio kandidatai/)
    assert.match(transformed, /Ryšio slopinimo priežastys/)
    assert.match(transformed, /Ryšio paaiškinimas/)
    assert.match(transformed, /rule_marriage_local_spouse/)
    assert.match(transformed, /ambiguous_bare_person/)
    assert.match(transformed, /aiškiai įvardytų subjektą ir kontekstą/)
    assert.doesNotMatch(transformed, /global_id: t-00042/)
    assert.match(transformed, /href="objektai\/asmenys\/Vytautas"/)
    assert.match(transformed, /href="objektai\/vietos\/Lietuva"/)
    assert.match(transformed, />Vytautas<\/a>/)
    const summaryStart = transformed.indexOf('data-claim-evidence-summary="true"')
    const quoteStart = transformed.indexOf("claim-citation-quote")
    assert.ok(summaryStart >= 0)
    assert.ok(quoteStart > summaryStart)
    const summaryRegion = transformed.slice(summaryStart, quoteStart)
    assert.doesNotMatch(summaryRegion, /global_id/)
    assert.doesNotMatch(summaryRegion, /ryšio_sprendimo_taisykle/)
    assert.doesNotMatch(summaryRegion, /rule_marriage_local_spouse/)
    assert.doesNotMatch(transformed, /data-citation-entry="true"/)
    assert.doesNotMatch(transformed, /data-citation-store="true"/)
    assert.doesNotMatch(transformed, /^## Šaltiniai ir įrodymai/m)
  })

  test("does not infer citation author from source title when explicit author is absent", () => {
    const plugin = AdvancedEvidence()
    const sourceOnlyMarkdown = `# Objektas

## Teiginiai
- id: t-001
  teiginys: Testinis teiginys
  pagrindžia:
    - c-001

## Citatos
- id: c-001
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Testinė citata.
`

    const transformed = inspectLazyClaimPayloads(
      plugin.textTransform?.({ allSlugs: [] } as any, sourceOnlyMarkdown) ?? sourceOnlyMarkdown,
    )

    assert.doesNotMatch(transformed, /<strong>Autorius:<\/strong>/)
    assert.doesNotMatch(transformed, /data-citation-entry="true"/)
  })

  test("renders all citations linked from one claim", () => {
    const plugin = AdvancedEvidence()
    const multiCitationMarkdown = `# Objektas

## Teiginiai
- id: t-001
  teiginys: Testinis teiginys
  pagrindžia:
    - c-001
    - c-002

## Reikšmingi paminėjimai
- id: c-001
  šaltinis: Šaltinis A
  citata_originali: |
    Pirma citata.
- id: c-002
  šaltinis: Šaltinis B
  citata_originali: |
    Antra citata.
`

    const transformed = inspectLazyClaimPayloads(
      plugin.textTransform?.({ allSlugs: [] } as any, multiCitationMarkdown) ??
        multiCitationMarkdown,
    )

    assert.match(transformed, /data-claim-citation-id="c-001"/)
    assert.match(transformed, /data-claim-citation-id="c-002"/)
    assert.doesNotMatch(transformed, /data-claim-evidence-summary="true"/)
    assert.match(transformed, /Pirma citata\./)
    assert.match(transformed, /Antra citata\./)
  })

  test("uses Citatos section as the canonical citation store", () => {
    const plugin = AdvancedEvidence()
    const markdownWithCitatos = `# Objektas

## Teiginiai
- t-010
  global_id: t-05208
  teiginys: Testinis teiginys su naujos projekcijos ID.
  pagrindžia:
    - c-34195

## Reikšmingi paminėjimai
- c-001
  šaltinis: Senas paminėjimų skyrius
  citata_originali: |
    Ši citata nėra teiginio atrama.

## Citatos
- c-34195
  šaltinis: Pagrindinis šaltinis
  citata_originali: |
    Tikroji teiginio citata.
`

    const transformed = inspectLazyClaimPayloads(
      plugin.textTransform?.({ allSlugs: [] } as any, markdownWithCitatos) ?? markdownWithCitatos,
    )

    assert.match(transformed, /data-claim-citation-id="c-34195"/)
    assert.match(transformed, /Tikroji teiginio citata\./)
    assert.doesNotMatch(transformed, /Citata nerasta\./)
    assert.doesNotMatch(transformed, /^## Citatos/m)
  })

  test("shows a compact missing-citation state for unsupported claims", () => {
    const plugin = AdvancedEvidence()
    const missingCitationMarkdown = `# Objektas

## Teiginiai
- id: t-001
  teiginys: Testinis teiginys
  pagrindžia:
    - c-404
`

    const transformed = inspectLazyClaimPayloads(
      plugin.textTransform?.({ allSlugs: [] } as any, missingCitationMarkdown) ??
        missingCitationMarkdown,
    )

    assert.match(transformed, /data-claim-detail="t-001-1"/)
    assert.match(transformed, /aria-controls="claim-evidence-t-001-1"/)
    assert.match(transformed, /Citata nerasta\./)
    assert.doesNotMatch(transformed, /data-claim-citation-id="c-404"/)
  })

  test("uses unique DOM keys when local claim ids repeat and keeps public page order ids", () => {
    const plugin = AdvancedEvidence()
    const duplicateLocalIdMarkdown = `# Objektas

## Teiginiai
- id: t-001
  global_id: t-111
  teiginys: Pirmas teiginys.
  pagrindžia:
    - c-001
- id: t-001
  global_id: t-222
  teiginys: Antras teiginys.
  pagrindžia:
    - c-002

## Citatos
- id: c-001
  šaltinis: A
  citata_originali: |
    Pirma citata.
- id: c-002
  šaltinis: B
  citata_originali: |
    Antra citata.
`

    const transformed = inspectLazyClaimPayloads(
      plugin.textTransform?.({ allSlugs: [] } as any, duplicateLocalIdMarkdown) ??
        duplicateLocalIdMarkdown,
    )

    assert.match(transformed, /id="claim-t-111"/)
    assert.match(transformed, /id="claim-t-222"/)
    assert.match(transformed, /id="claim-evidence-t-111"/)
    assert.match(transformed, /id="claim-evidence-t-222"/)
    assert.match(transformed, /data-claim-detail="t-111"/)
    assert.match(transformed, /data-claim-detail="t-222"/)
    assert.match(transformed, /aria-controls="claim-evidence-t-111"/)
    assert.match(transformed, /aria-controls="claim-evidence-t-222"/)
    assert.match(transformed, /Nuoroda į teiginį t-001/)
    assert.match(transformed, /Nuoroda į teiginį t-002/)
  })

  test("keeps DOM ids unique when the same global claim is rendered twice", () => {
    const plugin = AdvancedEvidence()
    const duplicateGlobalIdMarkdown = `# Objektas

## Teiginiai
- id: t-001
  global_id: t-333
  teiginys: Pirmas to paties globalaus teiginio rodymas.
  pagrindžia:
    - c-001
- id: t-001
  global_id: t-333
  teiginys: Antras to paties globalaus teiginio rodymas.
  pagrindžia:
    - c-002

## Citatos
- id: c-001
  šaltinis: A
  citata_originali: |
    Pirma citata.
- id: c-002
  šaltinis: B
  citata_originali: |
    Antra citata.
`

    const transformed = inspectLazyClaimPayloads(
      plugin.textTransform?.({ allSlugs: [] } as any, duplicateGlobalIdMarkdown) ??
        duplicateGlobalIdMarkdown,
    )

    assert.match(transformed, /id="claim-evidence-t-333"/)
    assert.match(transformed, /id="claim-evidence-t-333-2"/)
    assert.match(transformed, /aria-controls="claim-evidence-t-333"/)
    assert.match(transformed, /aria-controls="claim-evidence-t-333-2"/)
    assert.equal((transformed.match(/id="claim-evidence-t-333"/g) ?? []).length, 1)
    assert.equal((transformed.match(/id="claim-evidence-t-333-2"/g) ?? []).length, 1)
    assert.doesNotMatch(transformed, /Globalus ID/)
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

    const transformed = inspectLazyClaimPayloads(
      plugin.textTransform?.(
        {
          allSlugs: ["objektai/vietos/Lietuva"] as FullSlug[],
        } as any,
        unresolvedMarkdown,
      ) ?? unresolvedMarkdown,
    )

    assert.match(transformed, /mentioned_place: Nežinoma/)
    assert.doesNotMatch(transformed, /href="[^"]*Nežinoma/)
  })

  test("does not auto-link stopword-like tokens such as tame", () => {
    const plugin = AdvancedEvidence()
    const markdownWithStopword = `# Objektas

## Teiginiai
- id: t-001
  global_id: t-00044
  teiginys: Testinis teiginys
  susije_objektai: mentioned_person: tame; mentioned_person: Žygimantas
  pagrindžia:
    - c-001
`

    const transformed = inspectLazyClaimPayloads(
      plugin.textTransform?.(
        {
          allSlugs: [
            "objektai/asmenys/Tame-(Baigos-brolis)",
            "objektai/asmenys/Zygimantas",
          ] as FullSlug[],
        } as any,
        markdownWithStopword,
      ) ?? markdownWithStopword,
    )

    assert.match(transformed, /mentioned_person: tame/)
    assert.doesNotMatch(transformed, /href="objektai\/asmenys\/Tame-\(Baigos-brolis\)"/)
    assert.match(transformed, /href="objektai\/asmenys\/Zygimantas"/)
  })
})
