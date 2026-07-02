---
tipas: vieta
pavadinimas: 'Vakarų Bugas'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1413 m.'
  - '1424 m.'
date_start: '1413'
date_end: '1424'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
amziai:
  - 'XV'
---
# Vakarų Bugas

## Santrauka

Horodlė šiame gabale lokalizuojama prie Vakarų Bugo. Vakarų Bugas naudojamas kaip Horodlės vietos orientyras.

## Teiginiai

<a id="claim-t-187379"></a>
- t-001
  global_id: t-187379
  teiginys: 'Vakarų Bugas naudojamas kaip Horodlės vietos orientyras.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Sakinys aiškus, gramatinis ir tiesiogiai paremtas citata.'
  susije_objektai: 'mentioned_place: Horodlė; mentioned_object: [[objektai/zodynas/unija|unija]]; mentioned_person: [[objektai/asmenys/Jogaila|Jogaila]]; mentioned_place: Lenkija; mentioned_place: Lietuva; mentioned_place: Peremišlis; mentioned_place: Sanas'
  temporaliniai_duomenys: 'įvykio data: 1413 m.; įvykio data: 1424 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Sakinys aiškus, gramatinis ir tiesiogiai paremtas citata.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=8fd038e8efeb936c6dea8fa739e31ac39b8a7a920a07266b7535b825389d9152; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: priklause -> Lenkija: 0.86
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Horodlė: llm_allowed_candidate, place
  ryšio_targeto_parinkimas: Lenkija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Teiginys tiesiogiai lokalizuoja Horodlę dabartinėje Lenkijoje.

<a id="claim-t-187380"></a>
- t-002
  global_id: t-187380
  teiginys: 'Horodlė šaltinio pastaboje lokalizuojama Volynėje, dabartinėje Lenkijoje, prie Vakarų Bugo, į pietus nuo Bresto.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Perrašyta į aiškų sakinį apie Vakarų Bugą, remiantis pastaba.'
  susije_objektai: 'llm_object: Lenkija; mentioned_object: [[objektai/zodynas/unija|unija]]; mentioned_person: [[objektai/asmenys/Jogaila|Jogaila]]; mentioned_place: Horodlė; mentioned_place: Lenkija; mentioned_place: Lietuva; mentioned_place: Peremišlis; mentioned_place: Sanas'
  temporaliniai_duomenys: 'įvykio data: 1413 m.; įvykio data: 1424 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Perrašyta į aiškų sakinį apie Vakarų Bugą, remiantis pastaba.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=8fd038e8efeb936c6dea8fa739e31ac39b8a7a920a07266b7535b825389d9152; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Horodlė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Vakarų Bugas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Horodlė: mention_match, place, gap=29
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Vakarų Bugas" parinktas kaip owner_note_path. Targetas "Horodlė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    1  Peremišlis — dabar pietų Lenkijos miestas (prie Sano upės,
    arti TSRS sienos, apie 100 km j vakarus nuo Lvovo|,
    Pasakojimas apie Vytauto ir Jogailos susitikimą Peremišlyje ir
    jų susitarimą dėl savo įpėdinių žinomas tik iš BK. Kituose Lietuvos
    m etraščių nuorašuose apie šj susitikimą nėra nė užuominos. Faktiš­
    kai čia turima galvoje Horodlo unija — susitarimas tarp LDK ir
    Lenkijos feodalų Horodle (vietovė Volynėje, dabar Lenkijoje, prie
    Vakari) Bugo, j pietus nuo Bresto), sudarytas 1413 m. spalio 2 d.
    Tačiau, sprendžiant pagal kai kurias pasakojimo realijas, veiksmas
    jam e vyksta daug vėliau, nes kalbama, kad Jogaila yra vedęs jau
    ketvirtą kartą; tokia padėtis galėjo būti ne anksčiau kaip 1422.11.7
    (Jogailos vedybos su Sofija Alšėniške) Ir ne vėliau kaip 1424 m.
    lapkričio mėn.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
    - t-001