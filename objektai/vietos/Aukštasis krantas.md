---
tipas: vieta
pavadinimas: 'Aukštasis krantas'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
---
# Aukštasis krantas

## Santrauka

Aukštasis krantas yra kaimas dešiniame Ušos krante. Aukštasis krantas yra apie 25 km į šiaurę ar šiaurės vakarus nuo Klecko.

## Teiginiai

<a id="claim-t-187162"></a>
- t-001
  global_id: t-187162
  teiginys: 'Aukštasis krantas yra apie 25 km į šiaurę ar šiaurės vakarus nuo Klecko.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys aiškiai nurodo Aukštojo kranto padėtį Klecko atžvilgiu ir yra paremtas citata. Nieko papildomai nepridėta.'
  susije_objektai: 'mentioned_place: Kaimas; mentioned_place: Nemunas; mentioned_place: Nesvyžius; mentioned_place: Polonka'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=039ac4515aa5afbb12ae929bd27ac36e7b204a284bf4ebee169d2e3682f54588; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Kaimas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Aukštasis krantas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Kaimas: mention_match, place, gap=22
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Aukštasis krantas" parinktas kaip owner_note_path. Targetas "Kaimas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-187163"></a>
- t-002
  global_id: t-187163
  teiginys: 'Aukštasis krantas yra kaimas dešiniame Ušos krante.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra aiškus, gramatinis sakinys apie Aukštąjį krantą ir tiesiogiai remiasi geografine pastaba. Papildomų interpretacijų ar atribucijos nereikia.'
  susije_objektai: 'mentioned_place: Kaimas; mentioned_place: Nemunas; mentioned_place: Nesvyžius; mentioned_place: Polonka'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=039ac4515aa5afbb12ae929bd27ac36e7b204a284bf4ebee169d2e3682f54588; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Kaimas: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Aukštasis krantas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Kaimas: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Aukštasis krantas" parinktas kaip owner_note_path. Targetas "Kaimas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    1 5  Iškoldis — kaimas (apie 8 km j rytus nuo Polonkos (Polo-
    nečkos), keli km  į pietus nuo Ušos upės).
    "  Uša — Nemuno aukštupio pietinis (kairysis) Intakas, išteka
    apie 20 km j šiaurę nuo Klecko, teka pro Nesvyžių šiaurės vaka­
    rų kryptimi.
    1 7  Aukštasis krantas (Krūty Bierah) — kaimas (už 15 km į piet­
    ryčius nuo Iškoldies. dešiniame, priešingame Ušos krante, apie
    25 km j šiaurę (šiaurės vakarus) nuo Klecko).
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
    - t-001