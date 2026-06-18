---
tipas: vieta
pavadinimas: 'Davidgorodokas'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
---
# Davidgorodokas

## Santrauka

Gorodokas veikiausiai tapatinamas su Davidgorodoku. Davidgorodokas lokalizuojamas apie 120 km į pietus nuo Slucko ir apie 12 km į pietus nuo Pripetės.

## Teiginiai

<a id="claim-t-187218"></a>
- t-001
  global_id: t-187218
  teiginys: 'Gorodokas veikiausiai tapatinamas su Davidgorodoku.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys aiškiai perteikia komentare pateiktą tapatinimą.'
  susije_objektai: 'mentioned_place: Gričino pelkės; mentioned_place: Pripetė'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9bff91ad0f5672411ddadaa596bfe46d1c517fce137594c10b699be4ebfa199e; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Gričino pelkės: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Davidgorodokas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Gričino pelkės: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Davidgorodokas" parinktas kaip owner_note_path. Targetas "Gričino pelkės" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-187219"></a>
- t-002
  global_id: t-187219
  teiginys: 'Davidgorodokas lokalizuojamas apie 120 km į pietus nuo Slucko ir apie 12 km į pietus nuo Pripetės.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra konkretus, gramatiškas ir paremtas citatos lokalizacija.'
  susije_objektai: 'mentioned_place: Pripetė; mentioned_place: Sluckas; mentioned_place: Gričino pelkės'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9bff91ad0f5672411ddadaa596bfe46d1c517fce137594c10b699be4ebfa199e; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Pripetė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Davidgorodokas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Pripetė: mention_match, place, gap=89
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Davidgorodokas" parinktas kaip owner_note_path. Targetas "Pripetė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-187569"></a>
- t-003
  global_id: t-187569
  teiginys: 'Gorodokas komentare veikiausiai tapatinamas su Davidgorodoku, esančiu apie 120 km į pietus nuo Slucko.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Teiginys tiksliai sujungia komentaro tapatinimą ir lokalizaciją.'
  susije_objektai: 'mentioned_place: Sluckas; mentioned_place: Gričino pelkės; mentioned_place: Pripetė'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9bff91ad0f5672411ddadaa596bfe46d1c517fce137594c10b699be4ebfa199e; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Sluckas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Davidgorodokas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Sluckas: mention_match, place, gap=48
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Davidgorodokas" parinktas kaip owner_note_path. Targetas "Sluckas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    27 Ir 28).
    7 1  Gričino pelkės — didžiuliai pelkių plotai j pietus nuo Slucko.
    7 7  Gorodokas — veikiausiai, Davidgorodokas, BTSR miestas (apie
    120 km | pietus nuo Slucko, apie 12 km j pietus nuo Pripetės
    upės).
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9bff91ad0f5672411ddadaa596bfe46d1c517fce137594c10b699be4ebfa199e; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Gričino pelkės: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Davidgorodokas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Gričino pelkės: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Davidgorodokas" parinktas kaip owner_note_path. Targetas "Gričino pelkės" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9bff91ad0f5672411ddadaa596bfe46d1c517fce137594c10b699be4ebfa199e; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Pripetė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Davidgorodokas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Pripetė: mention_match, place, gap=89
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Davidgorodokas" parinktas kaip owner_note_path. Targetas "Pripetė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9bff91ad0f5672411ddadaa596bfe46d1c517fce137594c10b699be4ebfa199e; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Sluckas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Davidgorodokas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Sluckas: mention_match, place, gap=48
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Davidgorodokas" parinktas kaip owner_note_path. Targetas "Sluckas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
