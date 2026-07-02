---
tipas: vieta
pavadinimas: 'Smotričius'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1240 m.'
  - '1375 m.'
date_start: '1240'
date_end: '1375'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
amziai:
  - 'XIII'
  - 'XIV'
---
# Smotričius

## Santrauka

Smotričius yra sena Podolės gyvenvietė, minima jau XII a. 1240 m. ją sunaikino totoriai.

## Teiginiai

<a id="claim-t-187328"></a>
- t-001
  global_id: t-187328
  teiginys: 'XIV a. antrojoje pusėje Smotričius priklausė Jurgiui Karijotaičiui, o po jo mirties 1375 m. - Aleksandrui Karijotaičiui.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Citata teigia priklausymą, todėl „valdė“ pakeista tikslesne formuluote.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Totoriai|Totoriai]]; mentioned_place: Podolė'
  temporaliniai_duomenys: 'priklausymo laikotarpis: 1240 m.; priklausymo laikotarpis: 1375 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „priklausymo laikotarpis“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Citata teigia priklausymą, todėl „valdė“ pakeista tikslesne formuluote.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=512f382979554a2a198eaca5f5964858de6b6fca884be8f1e2f2ea257b7b0d4c; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Podolė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Smotričius: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Podolė: mention_match, place, gap=20
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Smotričius" parinktas kaip owner_note_path. Targetas "Podolė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-187329"></a>
- t-002
  global_id: t-187329
  teiginys: 'Smotričių 1240 m. sunaikino totoriai.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys aiškiai įvardija subjektą, datą ir veiksmą. Citata tiesiogiai nurodo 1240 m. totorių sunaikinimą, todėl papildomos atribucijos čia nereikia.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Totoriai|Totoriai]]; mentioned_place: Podolė; llm_object: Smotričius'
  semantiniai_rysiai: '[[objektai/grupes/Totoriai|Totoriai]] puolė Smotričius'
  temporaliniai_duomenys: 'įvykio data: 1240 m.; įvykio data: 1375 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys aiškiai įvardija subjektą, datą ir veiksmą. Citata tiesiogiai nurodo 1240 m. totorių sunaikinimą, todėl papildomos atribucijos čia nereikia.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=512f382979554a2a198eaca5f5964858de6b6fca884be8f1e2f2ea257b7b0d4c; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: puole -> Smotričius: 0.78
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Totoriai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Smotričius: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai sako, kad Smotričių sunaikino totoriai; „puolė“ yra artimiausias leidžiamas karinis santykis, nors ne toks tikslus kaip „sunaikino“.

<a id="claim-t-187330"></a>
- t-003
  global_id: t-187330
  teiginys: 'Smotričius yra sena Podolės gyvenvietė, minima jau XII a.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys jau yra pilnas lietuviškas sakinys apie Smotričių. Jis remiasi citatos informacija apie Podolę ir XII a. paminėjimą, nepridedant papildomų faktų.'
  susije_objektai: 'mentioned_place: Podolė; mentioned_group: [[objektai/grupes/Totoriai|Totoriai]]'
  temporaliniai_duomenys: 'įvykio data: 1240 m.; įvykio data: 1375 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys jau yra pilnas lietuviškas sakinys apie Smotričių. Jis remiasi citatos informacija apie Podolę ir XII a. paminėjimą, nepridedant papildomų faktų.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=512f382979554a2a198eaca5f5964858de6b6fca884be8f1e2f2ea257b7b0d4c; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Podolė: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Smotričius: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Podolė: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Smotričius" parinktas kaip owner_note_path. Targetas "Podolė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-187656"></a>
- t-004
  global_id: t-187656
  teiginys: 'Smotričius yra sena Podolės gyvenvietė, minima jau XII a., o 1240 m. ją sunaikino totoriai.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Teiginys yra gramatiškas ir sujungia dvi citatoje tiesiogiai pateiktas žinias apie Smotričių. Nepridėta informacijos už citatos ribų.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Totoriai|Totoriai]]; mentioned_place: Podolė; llm_object: Smotričius'
  semantiniai_rysiai: '[[objektai/grupes/Totoriai|Totoriai]] puolė Smotričius'
  temporaliniai_duomenys: 'įvykio data: 1240 m.; įvykio data: 1375 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys yra gramatiškas ir sujungia dvi citatoje tiesiogiai pateiktas žinias apie Smotričių. Nepridėta informacijos už citatos ribų.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=512f382979554a2a198eaca5f5964858de6b6fca884be8f1e2f2ea257b7b0d4c; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Smotričius: 0.78
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Totoriai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Smotričius: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo totorių sunaikinimą; leidžiamas predikatas „puolė“ perteikia karinį veiksmą, nors nėra visiškai tapatus „sunaikino“.
- susijęs iš [[objektai/ivykiai/Podolės patekimas lietuvių Karijotaičių valdžion.md#claim-t-186697|Podolės patekimas lietuvių Karijotaičių valdžion]]: Podolės patekimas lietuvių Karijotaičių valdžion 1971 m. komentare pateikiamas kaip nedatuojamas vieningai: minimi 1349, 1350–1351 ir 1362 m.
- susijęs iš [[objektai/ivykiai/Podolės patekimas lietuvių Karijotaičių valdžion.md#claim-t-186699|Podolės patekimas lietuvių Karijotaičių valdžion]]: Redakcinė pastaba teigia, kad Podolės patekimo lietuvių Karijotaičių valdžion data istoriografijoje nėra vieningai nustatyta.
- susijęs iš Smotričė: Smotričė yra kairysis Dnestro intakas.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Smotričius — sena Podolės gyvenvietė, minima jau  XII a.,
    totorių sunaikinta 1240 m. Dabar UTSR Chmelnickio (buvusios Ka-
    menec-PodoIsko) sr. miestelis. XIV a. antrojoje pusėje buvo Jurgio
    Karijotaičio, o  po jo mirties (1375 m.) jo brolio Aleksandro Kari-
    jotaičio.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003
    - t-002
    - t-001
    - t-004

## Ryšiai
- [[objektai/grupes/Totoriai]] puole Smotričius
