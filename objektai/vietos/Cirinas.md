---
tipas: vieta
pavadinimas: 'Cirinas'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
---
# Cirinas

## Santrauka

Cirinas yra kaimas prie Servečio upės, 5 km į pietus nuo Ostašino. LDK kariuomenė žygiuodama į Klecką paliko Ciriną po dešinei.

## Teiginiai

<a id="claim-t-187215"></a>
- t-001
  global_id: t-187215
  teiginys: 'LDK kariuomenė žygiuodama į Klecką paliko Ciriną po dešinei.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra pilnas sakinys apie Cirino padėtį LDK kariuomenės žygio atžvilgiu.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lietuvos kariuomenė|Lietuvos kariuomenė]]; mentioned_place: Kaimas; mentioned_place: Nesvyžius'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=41c332a9442769df84f45064e5004c299fcd9d5d880adf1fdaadf904977fcf65; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Kaimas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Cirinas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Kaimas: mention_match, place, gap=12
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Cirinas" parinktas kaip owner_note_path. Targetas "Kaimas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-187216"></a>
- t-002
  global_id: t-187216
  teiginys: 'Cirinas yra kaimas prie Servečio upės, 5 km į pietus nuo Ostašino.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys aiškiai nusako Cirino vietą prie Servečio upės ir atstumą nuo Ostašino. Nepridėta informacijos apie LDK kariuomenės žygį.'
  susije_objektai: 'mentioned_place: Kaimas; mentioned_place: Nesvyžius'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=41c332a9442769df84f45064e5004c299fcd9d5d880adf1fdaadf904977fcf65; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Kaimas: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Cirinas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Kaimas: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Cirinas" parinktas kaip owner_note_path. Targetas "Kaimas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
- susijęs iš Polonka: Polonka, dabar vadinama Polonečka, yra kaimas apie 10 km į pietryčius nuo Cirino, prie Dviejos upės.
- susijęs iš Polonka: 1971 m. leidimo paaiškinime Polonka, dabar Polonečka, nurodoma kaip kaimas prie Dviejos upės.
- susijęs iš Polonka: Polonka yra prie Dviejos upės, kuri nurodyta kaip Ušos intakas.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    1 8  Ostašinas — BTSR kaimas (apie 20 km ( pietryčius nuo Nau­
    garduko, Nesvyžiaus link). Ostašino ir kelių kitų vietovių pam inėji­
    mas žemiau rodo. kad LDK kariuom enė žygiavo iš N augarduko j
    Kleckę beveik lygiagrečiai dabartiniam  N augarduko—Kareličlų—
    Miro—Nesvyžiaus—Klecko plentui, keliais km piečiau nuo šio
    plento
    1 3 Cirinas — BTSR kaimas (prie Servečio upės, už 5 km ( pietus
    nuo Ostašino). LDK kariuom enė žygiavo i Klecką, palikdama Ciriną
    po dešinei.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
    - t-001