---
tipas: ivykis
pavadinimas: 'Mstislavlio apgultis ir mūšis prie Vechros (mūšis, XIV a.)'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1386 m.'
date_start: '1386'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - mūšis
amziai:
  - 'XIV'
---
# Mstislavlio apgultis ir mūšis prie Vechros (mūšis, XIV a.)

## Santrauka

Komentare nurodoma, kad Svetoslavas išžygiavo link Vitebsko ir Oršos 1386 m. kovo 22 d. Komentare nurodoma, kad Svetoslavas apgulė Mstislavlį 1386 m. balandžio 18 d.

## Laikotarpis ir datos

- laikotarpis: 1386 m. kovo 22 d.; 1386 m. balandžio 18 d.; 1386 m. balandžio 29 d.
- datos:
  - 1386 m. kovo 22 d.; 1386 m. balandžio 18 d.; 1386 m. balandžio 29 d.
- amziai:
  - XIV
- date_start: 1386
- date_end: 1386

## Dalyviai ir vaidmenys

Nenurodyta

## Eiga

Nenurodyta

## Rezultatas

Nenurodyta

## Teiginiai

<a id="claim-t-186725"></a>
- t-001
  global_id: t-186725
  teiginys: 'Mstislavlio apgulties metu mūšis įvyko prie Sožo intako Vechros, prie kurios stovi Mstislavlis.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra aiškus, gramatiškas ir atitinka citatos informaciją.'
  susije_objektai: 'mentioned_place: Mstislavlis; mentioned_group: [[objektai/grupes/Lietuvos kariuomenė|Lietuvos kariuomenė]]'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=b59bf0f2fa8c8a3b773fc466b7f60d7cb5c7586bc529aad428f22bb8a1e80ddf; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: keliavo_i -> Mstislavlis: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Lietuvos kariuomenė: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Mstislavlis: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo LDK kariuomenės atžygiavimą prie Mstislavlio.

<a id="claim-t-186726"></a>
- t-002
  global_id: t-186726
  teiginys: 'LDK kariuomenė prie Mstislavlio atžygiavo 1386 m. balandžio 29 d.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Pašalinta nereikalinga nuoroda į komentarą, nes citata tiesiogiai pateikia faktą.'
  susije_objektai: 'llm_object: Mstislavlis; mentioned_place: Mstislavlis; mentioned_group: [[objektai/grupes/Lietuvos kariuomenė|Lietuvos kariuomenė]]'
  temporaliniai_duomenys: 'įvykio data: 1386 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Pašalinta nereikalinga nuoroda į komentarą, nes citata tiesiogiai pateikia faktą.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=b59bf0f2fa8c8a3b773fc466b7f60d7cb5c7586bc529aad428f22bb8a1e80ddf; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Mstislavlis: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Mstislavlio apgultis ir mūšis prie Vechros (mūšis, XIV a.): owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Mstislavlis: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Mstislavlio apgultis ir mūšis prie Vechros (mūšis, XIV a.)" parinktas kaip owner_note_path. Targetas "Mstislavlis" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    1 1 LDK kariuomenė atžygiavo prie M stislavlio 1386.1V.29.
    1 J Mūšis įvyko prie Sožo intako Vechros, prie kurios stovi
    Mstislavlis.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
    - t-001