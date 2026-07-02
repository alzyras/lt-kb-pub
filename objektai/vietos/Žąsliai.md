---
tipas: vieta
pavadinimas: 'Žąsliai'
saltiniai:
  - 'Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)'
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1457 m.'
  - '1919 m.'
date_start: '1457'
date_end: '1919'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
amziai:
  - 'XV'
  - 'XX'
---
# Žąsliai

## Santrauka

Tačiau lietuvių puolimas užstrigo ir Lietuvos kariuomenei pavyko tik išvaduoti Daugus bei Žąslius.

## Teiginiai

<a id="claim-t-187198"></a>
- t-001
  global_id: t-187198
  teiginys: '1457 m. lapkričio 28 d. Kazimieras davė Žąslius Vilniaus vaivadai Jonui Goštautui.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra aiškus, gramatinis ir tiesiogiai paremtas citata.'
  susije_objektai: 'mentioned_place: Vilnius'
  temporaliniai_duomenys: 'įvykio data: 1457 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys yra aiškus, gramatinis ir tiesiogiai paremtas citata.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d73f4fa9ddc04b39ef21a9abab7bf8b65f1f735a9f832e7ff126ed7de54f7bea; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: uzeme -> Vilnius: 0.94
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Lenkai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Vilnius: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai sako, kad lenkų kariuomenė puolė ir užėmė Vilnių.

<a id="claim-t-187200"></a>
- t-003
  global_id: t-187200
  teiginys: 'Lietuvos kariuomenei pavyko išvaduoti Žąslius, nors lietuvių puolimas užstrigo.'
  teiginio_tipas: 'faktas'
  susije_objektai: 'llm_object: Vilnius; mentioned_group: [[objektai/grupes/Lenkai|Lenkai]]; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_place: Daugai; mentioned_place: Lietuva; mentioned_place: Vilnius; llm_object: Žąsliai; llm_object: Daugai'
  semantiniai_rysiai: '[[objektai/grupes/Lietuviai|Lietuviai]] užėmė Žąsliai'
  temporaliniai_duomenys: 'įvykio data: 1919 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  pagrindžia:
    - c-001
- susijęs iš Daugai: Lietuvos kariuomenei puolant Vilniaus link pavyko iš bolševikų išvaduoti tik Daugus ir Žąslius.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Lietuvos karinė vadovybė,
    atsižvelgdama į padėtį, mėgino suskubti
    pirma lenkų išvaryti bolševikus iš Vilniaus
    ir atsiimti Lietuvos sostinę. Tačiau lietu-
    vių puolimas užstrigo ir Lietuvos kariuo-
    menei pavyko tik išvaduoti Daugus bei
    Žąslius. Netrukus, 1919 m. balandžio 19 d.
    lenkų kariuomenė puolė ir užėmė Vilnių.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003
- c-002
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    1457.11.28 Kazimieras davė Žaslius Vilniaus vaivadai Jonui Goš-
    laulul (Русская историческая библиотека, т. 27, 1970. p. 34).
    3 3  Utcnls patikimuose šaltiniuose nepaliudytas.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
    - t-002

## Ryšiai
- [[objektai/grupes/Lietuviai]] uzeme Žąsliai
