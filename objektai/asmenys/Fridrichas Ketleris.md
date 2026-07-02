---
tipas: asmuo
pavadinimas: 'Fridrichas Ketleris'
saltiniai:
  - 'Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - kunigaikštis
  - upė
---
# Fridrichas Ketleris

## Santrauka

Kairiajame Dauguvos krante buvęs Kuršo kunigaikštis Fridrichas Ketleris, matydamas besirikiuojančius lietuvius, savo 300 raitelių įsakė persikelti į dešinįjį krantą. Jam iš kairės Kuršo kunigaištis Fridrichas Ketleris.

## Teiginiai

<a id="claim-t-40109"></a>
- t-001
  global_id: t-40109
  teiginys: 'Kairiajame Dauguvos krante buvęs Kuršo kunigaikštis Fridrichas Ketleris, matydamas besirikiuojančius lietuvius, savo 300 raitelių įsakė persikelti į dešinįjį krantą.'
  sudarymo_pagrindimas: 'Teiginys yra tikslus, gramatinis ir tiesiogiai atitinka citatos informaciją.'
  susije_objektai: 'llm_object: Kuršas; mentioned_place: Lietuva; mentioned_place: Dauguva; mentioned_place: Kuršas'
  semantiniai_rysiai: '[[objektai/asmenys/Fridrichas Ketleris|Fridrichas Ketleris]] buvo valdovas Kuršas'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=4e84c51e0afb687dd0a3c1babde19a6a1d91d567c0bea8ef5190088b61f4cf0c; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: buvo_valdovas -> Kuršas: 0.86
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Fridrichas Ketleris: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Kuršas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Teiginys tiesiogiai vadina Fridrichą Ketlerį Kuršo kunigaikščiu.

<a id="claim-t-40110"></a>
- t-002
  global_id: t-40110
  teiginys: 'Lietuvos kariuomenės vadovybės vaizde Fridrichas Ketleris nurodytas J. K. Chodkevičiui iš kairės.'
  susije_objektai: 'mentioned_object: [[objektai/zodynas/etmonas|etmonas]]; mentioned_place: Kuršas; mentioned_place: Lietuva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 443195-443340; hash=927255f8f86c217ee17bc12d8aef0b7160bce220e446989f673d72b45e037ac4; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Kuršas: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Fridrichas Ketleris: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Kuršas: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Fridrichas Ketleris" parinktas kaip owner_note_path. Targetas "Kuršas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Lietuvos kariuomenės vadovybė. Priekyje ant
    balto žirgo, didysis etmonas J. K. Chodkevičius.
    Jam iš kairės Kuršo kunigaištis Fridrichas Ketleris.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
- c-002
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Kairiajame Dauguvos krante buvęs
    Kuršo kunigaikštis Fridrichas Ketleris, ma-
    tydamas besirikiuojančius lietuvius, savo
    300 raitelių įsakė persikelti į dešinįjį krantą.
    Kuršiečiai, kartu su kunigaikščiu, sėkmin-
    gai perplaukė upę ir prisistatė didžiajam
    etmonui. Ši akimirka labai pakėlė Lietuvos
    karių nuotaiką.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001

## Ryšiai
- Fridrichas Ketleris buvo_valdovas [[objektai/vietos/Kuršas]]
