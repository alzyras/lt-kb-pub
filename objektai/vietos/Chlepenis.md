---
tipas: vieta
pavadinimas: 'Chlepenis'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1492 m.'
  - '1494 m.'
date_start: '1492'
date_end: '1494'
sukurta: ''
atnaujinta: ''
tags:
  - miestas
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
entity_id: "ent-983df4d5588f71b9b8164cc1"
canonical_name: "Chlepenis"
entity_roles: ["place"]
entity_view_role: "place"
entity_aliases: ["Chlepenis"]
sameAs: []
canonical_biography: "Pagal 1494.II.5 sutartį Chlepenis buvo pripažintas Maskvos Didžiajai Kunigaikštystei. Chlepenis aiškinamas kaip anuometinis Viazmos žemės miestas."
place_authority: true
historical_names: []
---
# Chlepenis

## Santrauka

Pagal 1494.II.5 sutartį Chlepenis buvo pripažintas Maskvos Didžiajai Kunigaikštystei. Chlepenis aiškinamas kaip anuometinis Viazmos žemės miestas.

## Teiginiai

<a id="claim-t-187213"></a>
- t-001
  teiginys: "Chlepenis lokalizuojamas apie 40 km į pietus nuo Rževo, prie Gžatės ir Vazuzos upių santakos."
  atnaujinta: "2026-08-11 18:54"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/09_extract_places_notes.md"
  teiginio_tipas: "faktas"
  ryšio_patikimumas: "susije_su -> Volga: 0.83"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Chlepenis: owner_note_path, place, gap=0"
  ryšio_targeto_parinkimas: "Volga: mention_match, place"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Chlepenis\" parinktas kaip owner_note_path. Targetas \"Volga\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality."
  šaltinio_profilis: "žanras: kronika; perspektyva: neutrali_arba_neaiski; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  pagrindžia:
    - c-170283

<a id="claim-t-187214"></a>
- t-002
  teiginys: "Chlepenis aiškinamas kaip anuometinis Viazmos žemės miestas."
  atnaujinta: "2026-08-11 18:54"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/09_extract_places_notes.md"
  teiginio_tipas: "faktas"
  ryšio_patikimumas: "priklause -> Viazma: 0.80"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Chlepenis: llm_allowed_candidate, place"
  ryšio_targeto_parinkimas: "Viazma: llm_allowed_candidate, place"
  ryšio_paaiskinimas: "Chlepenis apibūdinamas kaip Viazmos žemės miestas, todėl atsargiai fiksuojamas priklausymo vietai ryšys."
  šaltinio_profilis: "žanras: kronika; perspektyva: neutrali_arba_neaiski; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  semantiniai_rysiai: "Chlepenis priklausė Viazma (0.80)"
  pagrindžia:
    - c-170283

## Citatos

- id: c-170283
  autorius: "Anoniminis metraštininkas"
  šaltinis: "Lietuvos metraštis, Bychovco kronika (1971 m.)"
  indeksas: "Anoniminis metraštininkas, Lietuvos metraštis, Bychovco kronika (1971 m.)."
  citata_originali: |
    * Vtazma — dabar RTFSR miestas (apie 150 km į rytus nuc
    Smolensko).
    5  Chlepenis — anuom et Vlazmos žemės miestas (apie 40 km
    į pietus nuo Rževo, arti Gžatės Ir Vazuzos upių. Volgos intakų,
    santakos).
  citata_rodoma: "5  Chlepenis — anuom et Vlazmos žemės miestas (apie 40 km \nį pietus nuo Rževo, arti Gžatės Ir Vazuzos upių. Volgos intakų, \nsantakos)."
  statusas: verified
  atnaujinta: "2026-08-11 18:54"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-001
    - t-002
