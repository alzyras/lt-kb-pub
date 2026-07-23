---
tipas: vieta
pavadinimas: 'Kurenecas'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1432 m.'
  - '1433 m.'
date_start: '1432'
date_end: '1433'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
amziai:
  - 'XV'
media_total_count: '0'
media_primary_thumb_url: ''
media_primary_canonical_url: ''
media_primary_directness: ''
media_primary_relation_type: ''
media_primary_json: ''
media_direct_json: |-
  []
media_contextual_json: |-
  []
media_all_json: |-
  []
---
# Kurenecas

## Santrauka

Švitrigailos ir Livonijos ordino pajėgos ketino susijungti Kurenece. Kurenecas lokalizuojamas į šiaurę nuo Molodečno.

## Teiginiai

<a id="claim-t-187246"></a>
- t-001
  teiginys: "Kurenecas lokalizuojamas į šiaurę nuo Molodečno."
  atnaujinta: "2026-07-12 22:30"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/09_extract_places_notes.md"
  teiginio_tipas: "faktas"
  ryšio_patikimumas: "susije_su -> Molodečnas: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Kurenecas: owner_note_path, place, gap=0"
  ryšio_targeto_parinkimas: "Molodečnas: mention_match, place, gap=38"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Kurenecas\" parinktas kaip owner_note_path. Targetas \"Molodečnas\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  šaltinio_profilis: "žanras: kronika; perspektyva: neutrali_arba_neaiski; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  temporaliniai_duomenys: "įvykio data: 1432 m.; įvykio data: 1433 m."
  temporalinis_paaiskinimas: "Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui."
  temporalinis_llm_pakomentavimas: "Teiginys yra gramatiškas ir tiesiogiai paremtas lokalizacijos citata."
  pagrindžia:
    - c-170307

<a id="claim-t-187247"></a>
- t-002
  teiginys: "1433 m. vasario 15 d. Švitrigailos ir Livonijos ordino magistro Rutenbergo pajėgos turėjo susijungti Kurenece bendram žygiui į Vilnių."
  atnaujinta: "2026-07-12 22:30"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/09_extract_places_notes.md"
  teiginio_tipas: "faktas"
  ryšio_patikimumas: "buvo_sajungininkas_su -> Livonijos ordinas: 0.86"
  ryšio_patikimumo_lygis: "aukstas"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Švitrigaila: llm_allowed_candidate, person"
  ryšio_targeto_parinkimas: "Livonijos ordinas: llm_allowed_candidate, group"
  ryšio_paaiskinimas: "Livonijos ordino magistras tiesiogiai apibūdintas kaip Švitrigailos sąjungininkas."
  šaltinio_profilis: "žanras: kronika; perspektyva: neutrali_arba_neaiski; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  semantiniai_rysiai: "Švitrigaila buvo sąjungininkas su Livonijos ordinas (0.86)"
  temporaliniai_duomenys: "įvykio data: 1432 m.; įvykio data: 1433 m."
  temporalinis_paaiskinimas: "Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui."
  temporalinis_llm_pakomentavimas: "Išskleistas laikas, Rutenbergo vaidmuo ir žygio tikslas, tiesiogiai nurodyti citatoje. Nepridėtas vertinimas apie sėkmę ar platesnį karo kontekstą."
  vertinimo_atnaujinta: "2026-06-17T07:18:43Z"
  pagrindžia:
    - c-170307

## Citatos

- id: c-170307
  autorius: "Anoniminis metraštininkas"
  šaltinis: "Lietuvos metraštis, Bychovco kronika (1971 m.)"
  indeksas: "Anoniminis metraštininkas, Lietuvos metraštis, Bychovco kronika (1971 m.)."
  citata_originali: |
    ” Kalbama apie naujus Švitrigailos veiksmus 1433 m. sausio
    pabaigoje — vasario pradžioje. Nepavykus 1432 m. rudens puoli­
    mui. buvo sutarta, kad Švitrigailos sąjungininkas Livonijos ordino
    magistras Rutenbeigas 1433.1.25 jsiverš j Lietuvą iš Daugpilio pu­
    sės, o pats Švitrigaila — nuo Vitebsko pusės. Ir vasario 15 d. su­
    sijungs Kurenece, | šiaurę nuo Molodečno, bendram žygiui j Vil­
    nių.
  citata_rodoma: "Ir vasario 15 d. su­\nsijungs Kurenece, | šiaurę nuo Molodečno, bendram žygiui j Vil­\nnių."
  statusas: verified
  atnaujinta: "2026-07-12 22:57"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-001
    - t-002
