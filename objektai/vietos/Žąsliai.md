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
amziai:
  - 'XV'
  - 'XX'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
  - miestelis
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
---
# Žąsliai

## Santrauka

Tačiau lietuvių puolimas užstrigo ir Lietuvos kariuomenei pavyko tik išvaduoti Daugus bei Žąslius.

## Teiginiai

<a id="claim-t-187198"></a>
- t-001
  global_id: t-187198
  teiginys: "1457 m. lapkričio 28 d. Kazimieras davė Žąslius Vilniaus vaivadai Jonui Goštautui."
  atnaujinta: "2026-07-12 22:30"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/09_extract_places_notes.md"
  teiginio_tipas: "faktas"
  ryšio_patikimumas: "susije_su -> Vilnius: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Žąsliai: owner_note_path, place, gap=0"
  ryšio_targeto_parinkimas: "Vilnius: mention_match, place, gap=8"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Žąsliai\" parinktas kaip owner_note_path. Targetas \"Vilnius\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  šaltinio_profilis: "žanras: kronika; perspektyva: neutrali_arba_neaiski; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  temporaliniai_duomenys: "įvykio data: 1457 m."
  temporalinis_paaiskinimas: "Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui."
  temporalinis_llm_pakomentavimas: "Teiginys yra aiškus, gramatinis ir tiesiogiai paremtas citata."
  pagrindžia:
    - c-170275

<a id="claim-t-187200"></a>
- t-002
  global_id: t-187200
  teiginys: "Lietuvos kariuomenei pavyko išvaduoti Žąslius, nors lietuvių puolimas užstrigo."
  atnaujinta: "2026-07-10 10:39"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/09_extract_places_notes.md"
  teiginio_tipas: "faktas"
  ryšio_patikimumas: "uzeme -> Vilnius: 0.94"
  ryšio_patikimumo_lygis: "aukstas"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Lenkai: llm_allowed_candidate, group"
  ryšio_targeto_parinkimas: "Vilnius: llm_allowed_candidate, place"
  ryšio_paaiskinimas: "Citata tiesiogiai sako, kad lenkų kariuomenė puolė ir užėmė Vilnių."
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  semantiniai_rysiai: "Lenkai užėmė Vilnius (0.94); Lietuviai užėmė Žąsliai (0.78); Lietuviai užėmė Daugai (0.76)"
  temporaliniai_duomenys: "įvykio data: 1919 m."
  temporalinis_paaiskinimas: "Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui."
  pagrindžia:
    - c-170274
- susijęs iš Daugai: Lietuvos kariuomenei puolant Vilniaus link pavyko iš bolševikų išvaduoti tik Daugus ir Žąslius.
## Reikšmingi paminėjimai
- c-002
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    1457.11.28 Kazimieras davė Žaslius Vilniaus vaivadai Jonui Goš-
    laulul (Русская историческая библиотека, т. 27, 1970. p. 34).
    3 3  Utcnls patikimuose šaltiniuose nepaliudytas.
  citata_rodoma: ''
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: aukstas
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
    - t-002

## Citatos

- id: c-170274
  sudarytojas: "Karolis Zikaras"
  šaltinis: "Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)"
  indeksas: "Sud. Karolis Zikaras, Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)."
  citata_originali: |
    Lietuvos karinė vadovybė,
    atsižvelgdama į padėtį, mėgino suskubti
    pirma lenkų išvaryti bolševikus iš Vilniaus
    ir atsiimti Lietuvos sostinę. Tačiau lietu-
    vių puolimas užstrigo ir Lietuvos kariuo-
    menei pavyko tik išvaduoti Daugus bei
    Žąslius. Netrukus, 1919 m. balandžio 19 d.
    lenkų kariuomenė puolė ir užėmė Vilnių.
  citata_rodoma: "Lietuvos karinė vadovybė,\natsižvelgdama į padėtį, mėgino suskubti\npirma lenkų išvaryti bolševikus iš Vilniaus\nir atsiimti Lietuvos sostinę. Tačiau lietu-\nvių puolimas užstrigo ir Lietuvos kariuo-\nmenei pavyko tik išvaduoti Daugus bei\nŽąslius. Netrukus, 1919 m. balandžio 19 d.\nlenkų kariuomenė puolė ir užėmė Vilnių."
  statusas: verified
  atnaujinta: "2026-07-10 10:39"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-187200

- id: c-170275
  autorius: "Anoniminis metraštininkas"
  šaltinis: "Lietuvos metraštis, Bychovco kronika (1971 m.)"
  indeksas: "Anoniminis metraštininkas, Lietuvos metraštis, Bychovco kronika (1971 m.)."
  citata_originali: |
    10 Volkovyskas — BTSR miestas (prie aukštutinio Nemuno in­
    tako
    Volkovljos. apie 170 km Į pietus nuo Vilniaus, buvusioje
    jotvingių žemėje).
    XII a. buvo rusų Naugarduko kunigaikštystės
    sudėtyje ir drauge su ja Mindaugo įjungtas | Lietuvos valstybę.
    Minimas čia Volkovysko puolimas buvo 1249 ar 1250 m.
    11 Slonimas — BTSR miestas (| pietus nuo aukštutinio Nemuno,
    prie Nemuno intako Sčaros. apie 60 km j rytus nuo Volkovysko).
  citata_rodoma: "1457.11.28 Kazimieras davė Žaslius Vilniaus vaivadai Jonui Goš- \nlaulul (Русская историческая библиотека, т. 27, 1970. p. 34).\n3 3  Utcnls patikimuose šaltiniuose nepaliudytas."
  statusas: verified
  atnaujinta: "2026-07-12 22:57"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-187198
