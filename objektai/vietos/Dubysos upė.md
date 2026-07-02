---
tipas: vieta
pavadinimas: 'Dubysos upė'
saltiniai:
  - 'Vytautas Didysis 1350-1430 (1930 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - kraštas
  - ordinas
  - pilis
  - upė
---
# Dubysos upė

## Santrauka

Keliavo jie Nemunu iš Merkinės į Kauną kartu su būriu kuni­ gijos ir daug diduomenės, o iš čia Nemunu iki Dubysos upės ir ja iki Aukokalnio, buvusio ties dabartine Betygala. Vytautas, norėdamas geriau juose įsigalėti ir atstatyti Ordino nualintą kraštą, liepė atnaujin­ ti Dubysos ir Nemuno krantuose pilis ir atstatyti sudegintą Ve­ liuoną, kuri vėliau buvo mėgiamiausia Vytauto ir Ordino pa­ sitarimų vieta po Kauno arba Trakų.

## Teiginiai

<a id="claim-t-36216"></a>
- t-001
  global_id: t-36216
  teiginys: 'Kelionė iš Kauno tęsėsi Nemunu iki Dubysos upės, o Dubysa - iki Aukokalnio ties dabartine Betygala.'
  susije_objektai: 'mentioned_place: Aukokalnis; mentioned_place: Betygala; mentioned_place: Dubysa; mentioned_object: [[objektai/zodynas/unija|unija]]; mentioned_person: [[objektai/asmenys/Jogaila|Jogaila]]; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Kaunas; mentioned_place: Merkinė; mentioned_place: Nemunas; llm_object: Aukokalnis; llm_object: Kaunas'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d0b02269bff649abbd1e7c96d66f223660e274aa723c85a257b251cf58b7037a; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: keliavo_i -> Aukokalnis: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Jogaila (kunigaikštis, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Aukokalnis: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai aprašo kelionę Dubysa iki Aukokalnio, o Jogaila yra vienas iš keliaujančiųjų.

<a id="claim-t-36217"></a>
- t-002
  global_id: t-36217
  teiginys: 'Vytautas liepė atnaujinti Dubysos ir Nemuno krantuose buvusias pilis ir atstatyti sudegintą Veliuoną.'
  sudarymo_pagrindimas: 'Teiginys yra aiškus ir tiesiogiai atitinka citatos informaciją.'
  susije_objektai: 'mentioned_place: Dubysa; mentioned_place: Nemunas; mentioned_place: Veliuona; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Kaunas; mentioned_place: Lietuva; llm_object: Veliuona'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=eedc10485a61dfac5ef75da70d938663bf82f895d39e32cbda962c105a35ad45; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: pastate -> Veliuona: 0.79
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Veliuona: llm_allowed_candidate, place
  ryšio_paaiskinimas: Vytautas liepė atstatyti Veliuoną; relation_kind pastate artimiausiai atitinka atstatymo veiksmą.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Vytautas Didysis 1350-1430 (1930 m.)
  citata_originali: |
    Tačiau Vytautas dar dvejus metus už­
    truko su kitais reikalais (Horodlės unija ir Makro lankymasis)
    ir tiktai 1413 metų rudenį kartu su Jogaila atvyko į Žemaitiją.
    Keliavo jie Nemunu iš Merkinės į Kauną kartu su būriu kuni­
    gijos ir daug diduomenės, o iš čia Nemunu iki Dubysos upės ir
    ja iki Aukokalnio, buvusio ties dabartine Betygala. Nuo šios
    vietos ir buvo pradėtas apaštalavimo darbas Žemaitijoje.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-002
  šaltinis: Vytautas Didysis 1350-1430 (1930 m.)
  citata_originali: |
    taip pat atsikvėpė po ilgų kovų dėl laisvės, nes po Žalgirio
    karo buvo prijungti prie Lietuvos. Vytautas, norėdamas geriau
    juose įsigalėti ir atstatyti Ordino nualintą kraštą, liepė atnaujin­
    ti Dubysos ir Nemuno krantuose pilis ir atstatyti sudegintą Ve­
    liuoną, kuri vėliau buvo mėgiamiausia Vytauto ir Ordino pa­
    sitarimų vieta po Kauno arba Trakų. Taigi Lietuvos ribos bu­
    vo praplėstos toliau į vakarus, apimdamos didesnius tikrų lie­
    tuviškų žemių plotus, kuriose vis didėjo Vytauto valdžia ir
    autoritetas.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002