---
tipas: vieta
pavadinimas: 'Livonijos kraštas (kraštas)'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
---
# Livonijos kraštas (kraštas)

## Santrauka

Prie Trakų Jogailos kariuomenėje buvo Livonijos ponų. Jogaila be Kęstučio žinios sudarė taiką su Livonijos kraštu.

## Teiginiai

<a id="claim-t-187257"></a>
- t-001
  global_id: t-187257
  teiginys: 'Vytauto pasakojime Jogaila be Kęstučio žinios sudarė taiką su Prūsų ir Livonijos kraštais.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Citata yra poleminis Vytauto pasakojimas apie išdavystę, todėl reikalinga atribucija.'
  susije_objektai: 'mentioned_place: Livonija; mentioned_person: [[objektai/asmenys/Jogaila|Jogaila]]; mentioned_person: [[objektai/asmenys/Kęstutis|Kęstutis]]; mentioned_place: Prūsai; mentioned_place: Vilnius'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=58cd7a5b5f2e28775ba89bcc90a1cbbe0ce3c48448dd13efe73c9a9d2d5b4f99; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: buvo_sajungininkas_su -> Jogaila (kunigaikštis, XIV–XV a.): 0.72
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Livonijos ponai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Jogaila (kunigaikštis, XIV–XV a.): llm_allowed_candidate, person
  ryšio_paaiskinimas: Livonijos ponai buvo Jogailos kariuomenėje prie Trakų, tad tiesiogiai siejami su jo puse.

<a id="claim-t-187258"></a>
- t-002
  global_id: t-187258
  teiginys: 'Prie Trakų Jogailos kariuomenėje buvo Livonijos ponų.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Sakinys aiškus ir perteikia citatoje nurodytą Livonijos ponų buvimą Jogailos kariuomenėje.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Livonijos ponai|Livonijos ponai]]; mentioned_object: [[objektai/zodynas/ponai|ponai]]; mentioned_place: Livonija; mentioned_person: [[objektai/asmenys/Jogaila|Jogaila]]; mentioned_place: Trakai; llm_object: [[objektai/asmenys/Jogaila|Jogaila]]'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d0b39ff1790902a1a51d7897b7484f5122dd7e058ad1b111a1e795dc4502235b; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Livonija: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Livonijos kraštas (kraštas): owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Livonija: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Livonijos kraštas (kraštas)" parinktas kaip owner_note_path. Targetas "Livonija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Vytauto pasakojime Jogaila be Kęstučio žinios sudarė taiką su Prūsų ir Livonijos kraštais.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    tėvas kunigaikštis Kęstutis (tada jis buvo galingas),
    jei būtų norėjęs, būtų atėmęs Vilnių ir kunigaikščiui
    Jogailai, jei būtų panoręs, būtų davęs kunigaikštystę,
    nes kunigaikštis Jogaila po savo tėvo [mirties) tebebu­
    vo visai jaunas. Mūsų tėvas šito padaryti, atimti iš jo
    Vilnių, visiškai nenorėjo dėl savo brolio, kaip vyriau­
    siojo, ir kunigaikštį Jogailą pasodino Vilniaus pilyje
    ir saugojo jį iš visų pusių, kol jis paaugo ir kol prie
    jo priprato žmonės.
    Ir paskui mūsų tėvas patyrė iš kai kurių savo drau­
    gų, kad kunigaikštis Jogaila be mūsų tėvo žinios, nu­
    slėpdamas nuo mūsų tėvo, sudarė taiką su Prūsų kraštu
    ir su Livonijos kraštu ir mūsų tėvą išdavė; tasai, kurs
    turėjo ir prižadėjo kariauti, nebenorėjo mūsų tėvui pa­
    dėti ir nuolatos galvojo tik, kaip mano tėvą ir mane
    patį sugauti ir kaip mano tėvą ir mane nužudyti ir mū­
    sų žemę pasiglemžti.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-001

- c-002
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Ir atėjo mūsų tėvas su žemaičiais prie
    Trakų, aš pats irgi buvau ten su savo tėvu kunigaikš­
    čiu Kęstučiu. Kunigaikštis Jogaila pasitiko mus su savo
    kariuomene. Su juo buvo ir Livonijos ponai [kariuo­
    menėj.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=58cd7a5b5f2e28775ba89bcc90a1cbbe0ce3c48448dd13efe73c9a9d2d5b4f99; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: buvo_sajungininkas_su -> Jogaila (kunigaikštis, XIV–XV a.): 0.72
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Livonijos ponai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Jogaila (kunigaikštis, XIV–XV a.): llm_allowed_candidate, person
  ryšio_paaiskinimas: Livonijos ponai buvo Jogailos kariuomenėje prie Trakų, tad tiesiogiai siejami su jo puse.
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d0b39ff1790902a1a51d7897b7484f5122dd7e058ad1b111a1e795dc4502235b; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Livonija: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Livonijos kraštas (kraštas): owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Livonija: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Livonijos kraštas (kraštas)" parinktas kaip owner_note_path. Targetas "Livonija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
