---
tipas: saltinis
pavadinimas: 'Lietuvos kariuomenės pertvarkymo įstatymas'
saltiniai:
  - 'Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - saltinis
---
# Lietuvos kariuomenės pertvarkymo įstatymas

## Santrauka

Liepos 3 dieną priimtas Lietuvos kariuomenės pertvarkymo įstatymas, ji tapo Liaudies kariuomene (vėliau – Raudonosios armijos 29-uoju šaulių korpusu).

## Teiginiai

<a id="claim-t-21170"></a>
- t-001
  global_id: t-21170
  teiginys: 'Liepos 3 d. priimtu Lietuvos kariuomenės pertvarkymo įstatymu kariuomenė tapo Liaudies kariuomene.'
  sudarymo_pagrindimas: 'Teiginys pagrįstas, bet sutrumpintas ir pataisyta gramatika.'
  susije_objektai: 'mentioned_place: Lietuva; mentioned_place: Maskva; mentioned_place: SSRS; mentioned_place: Švedija; mentioned_place: Šveicarija'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=449edc54911905e6e5aa6a4f2be9d9dfd9ded918241ae0ecc7cd9c946284f87b; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Lietuva: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Lietuvos kariuomenės pertvarkymo įstatymas: owner_note_path, source, gap=0
  ryšio_targeto_parinkimas: Lietuva: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Lietuvos kariuomenės pertvarkymo įstatymas" parinktas kaip owner_note_path. Targetas "Lietuva" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-183371"></a>
- t-002
  global_id: t-183371
  teiginys: 'Liepos 3 d. priimtu Lietuvos kariuomenės pertvarkymo įstatymu Lietuvos kariuomenė tapo Liaudies kariuomene.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Perrašyta pašalinant dviprasmį įvardį ir paliekant aiškų faktą apie įstatymo rezultatą.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lietuvos kariuomenė|Lietuvos kariuomenė]]; mentioned_place: Lietuva; mentioned_place: Maskva; mentioned_place: SSRS; llm_object: Lietuva'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 386391-386731; hash=de4f7e5d5ec1ebf3acae258584df2bdd9505c52c4160322cc9714b71bb54d633; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: priklause -> Lietuva: 0.74
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Lietuvos kariuomenė: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Lietuva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Pavadinimas tiesiogiai sieja kariuomenę su Lietuva kaip priklausomybės objektu.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)
  citata_originali: |
    Tačiau pasisavintas tik Švedijos ir Šveicarijos bankuose saugomas auksas.
    Maskva diegė SSRS valdymo modelį administracijoje, policijoje, teis-
    muose, pradėta kurti liaudies milicija. Liepos 3 dieną priimtas Lietuvos
    kariuomenės pertvarkymo įstatymas, ji tapo Liaudies kariuomene (vė-
    liau – Raudonosios armijos 29-uoju šaulių korpusu).
  citata_rodoma: ''
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-001

- c-002
  santrauka: 'Liepos 3 d. priimtu Lietuvos kariuomenės pertvarkymo įstatymu Lietuvos kariuomenė tapo Liaudies kariuomene.'
  šaltinis: Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)
  citata_originali: |
    Maskva diegė SSRS valdymo modelį administracijoje, policijoje, teis-
    muose, pradėta kurti liaudies milicija. Liepos 3 dieną priimtas Lietuvos
    kariuomenės pertvarkymo įstatymas, ji tapo Liaudies kariuomene (vė-
    liau – Raudonosios armijos 29-uoju šaulių korpusu). Liepos 11 dieną su-
    stabdyta Lietuvos šaulių sąjungos veikla, ji nuginkluota.
  citata_rodoma: ''
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-002
