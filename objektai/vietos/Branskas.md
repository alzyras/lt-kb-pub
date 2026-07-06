---
tipas: vieta
pavadinimas: 'Branskas'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1971 m.'
date_start: '1971'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - vieta
amziai:
  - 'XX'
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
# Branskas

## Santrauka

Branskas apibūdinamas kaip Palenkės miestas. Branskas lokalizuojamas prie Nureco, Vakarų Bugo intako.

## Teiginiai

<a id="claim-t-187174"></a>
- t-002
  global_id: t-187174
  teiginys: "Branskas lokalizuojamas prie Nureco, Vakarų Bugo intako."
  teiginio_tipas: "faktas"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  saltinio_vieta: "555414-555656; hash=ed4ab1b11b233849b85a002f08a175b203c4ebe72b0767cb27f7910323dbe396; match=exact"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/09_extract_places_notes.md"
  ryšio_patikimumas: "susije_su -> Balstogė: 0.83"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Branskas: owner_note_path, place, gap=0"
  ryšio_targeto_parinkimas: "Balstogė: mention_match, place"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Branskas\" parinktas kaip owner_note_path. Targetas \"Balstogė\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality."
  pagrindžia:
    - c-170265

<a id="claim-t-187175"></a>
- t-001
  global_id: t-187175
  teiginys: "Branskas buvo Palenkės miestas, 1971 m. leidimo komentare priskirtas Lenkijos Balstogės vaivadijai."
  teiginio_tipas: "faktas"
  semantiniai_rysiai: "Branskas priklausė Palenkė (0.91)"
  temporaliniai_duomenys: "įvykio data: 1971 m."
  temporalinis_paaiskinimas: "Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui."
  temporalinis_llm_pakomentavimas: "Patikslinta, kad administracinė lokalizacija yra leidimo komentaro teiginys."
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  saltinio_vieta: "555414-555656; hash=ed4ab1b11b233849b85a002f08a175b203c4ebe72b0767cb27f7910323dbe396; match=exact"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/09_extract_places_notes.md"
  ryšio_patikimumas: "priklause -> Palenkė: 0.91"
  ryšio_patikimumo_lygis: "aukstas"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Branskas: llm_allowed_candidate, place"
  ryšio_targeto_parinkimas: "Palenkė: llm_allowed_candidate, place"
  ryšio_paaiskinimas: "Komentare Branskas tiesiogiai apibūdinamas kaip Palenkės miestas."
  vertinimo_atnaujinta: "2026-06-16T21:06:50Z"
  vertinimo_autorius: "rewrite_source_claims / rewrite"
  pagrindžia:
    - c-170265
- susijęs iš Bielskas: Bielskas lokalizuojamas prie Baltosios, Narevo intako, į pietus nuo Balstogės.
- susijęs iš Bielskas: Bielskas lokalizuojamas prie Baltosios, Narevo intako, į pietus nuo Balstogės.
- susijęs iš Bielskas: Bielskas buvo Palenkės miestas, 1971 m. leidimo komentare tapatintas su Lenkijos Bielsku Podlaskiu.
- susijęs iš Bielskas: Bielskas buvo Palenkės miestas, 1971 m. leidimo komentare tapatintas su Lenkijos Bielsku Podlaskiu.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    1  Bielskas — kalbamu m elu Palenkės, o dabar Lenkijos Bielsk-
    Podlaski miestas (prie Baltosios, Narevo intako, | pietus nuo Bal­
    stogės).
    ! Branskas — Palenkės, dabar Lenkijos Balstogės vaivadijos mies­
    tas (prie Vakarų Bugo intako Nureco).
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: aukstas
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
    - t-001

## Citatos

- id: c-170265
  autorius: "Anoniminis metraštininkas"
  šaltinis: "Lietuvos metraštis, Bychovco kronika (1971 m.)"
  citata_originali: |
    1  Bielskas — kalbamu m elu Palenkės, o dabar Lenkijos Bielsk-
    Podlaski miestas (prie Baltosios, Narevo intako, | pietus nuo Bal­
    stogės).
    ! Branskas — Palenkės, dabar Lenkijos Balstogės vaivadijos mies­
    tas (prie Vakarų Bugo intako Nureco).
  citata_rodoma: "Branskas — Palenkės, dabar Lenkijos Balstogės vaivadijos mies­\ntas (prie Vakarų Bugo intako Nureco)."
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-187175
    - t-187174

## Ryšiai
- Branskas priklausė [[objektai/vietos/Palenkė]]
