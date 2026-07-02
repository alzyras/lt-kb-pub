---
tipas: asmuo
pavadinimas: 'Karolis (didysis magistras)'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
datos:
  - '1252 m.'
  - '1328 m.'
date_start: '1252'
date_end: '1328'
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - pilis
amziai:
  - 'XIII'
  - 'XIV'
periodo_grupes:
  - 'LDK'
---
# Karolis (didysis magistras)

## Santrauka

Dusburgietis teigia, kad spalio 12 Tuo tarpu brolis Karolis, didysis magistras, rūpindamasis savo žmonių gyvybe ir sielodamasis dėl minėtosios pilies apgulos, subūrė didelę kariuomenę, ketindamas ją išvaduoti. Dusburgietis teigia, kad be to, švento Petro grandinėse dieną (rugpjūčio 1) buvo apleista Kristmemelio pilis, pastatyta brolio Karolio, magistro.

## Teiginiai

<a id="claim-t-89880"></a>
- t-001
  global_id: t-89880
  teiginys: 'Kristmemelio pilis buvo pastatyta magistro Karolio.'
  sudarymo_pagrindimas: 'Citata aiškiai pagrindžia trumpą faktą apie Karolio vaidmenį.'
  susije_objektai: 'llm_object: Kristmemelis; mentioned_place: Kristmemelis; mentioned_place: Livonija; mentioned_place: Prūsija'
  semantiniai_rysiai: '[[objektai/asmenys/Karolis (didysis magistras)|Karolis (didysis magistras)]] pastatė Kristmemelis'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=920db58fb0831e33d3bcb86a87c835b627b52981a1d1958d0ab0d6003c1595b0; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: keliavo_i -> Kristmemelis: 0.88
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Karolis (didysis magistras): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Kristmemelis: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad po veiksmų Junigedoje jie nuvyko į Kristmemelio pilį.

<a id="claim-t-89881"></a>
- t-002
  global_id: t-89881
  teiginys: '1315 m. spalio 12 d. didysis magistras Karolis subūrė kariuomenę Junigedos piliai vaduoti.'
  sudarymo_pagrindimas: 'Teiginys yra aiškus, susietas su asmeniu ir paremtas citata bei antrašte.'
  susije_objektai: 'llm_object: Junigeda; mentioned_person: [[objektai/asmenys/Karolis|Karolis]]; mentioned_place: Junigeda; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_object: [[objektai/zodynas/didysis magistras|didysis magistras]]; mentioned_object: [[objektai/zodynas/magistras|magistras]]; mentioned_place: Kristmemelis'
  semantiniai_rysiai: '[[objektai/asmenys/Karolis (didysis magistras)|Karolis (didysis magistras)]] gynė Junigeda'
  temporaliniai_duomenys: 'įvykio data: 1315 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys yra aiškus, susietas su asmeniu ir paremtas citata bei antrašte.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 745436-745773; hash=f9c657ebb0f941a45d14e457025e8e4475e1b5e37c23032711d07a754aca4478; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: pastate -> Kristmemelis: 0.95
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Karolis (didysis magistras): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Kristmemelis: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai teigia, kad Kristmemelio pilis buvo pastatyta brolio Karolio.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie Kristmemelio pilies sugriovimą

      1328 metais Prūsijos broliams buvo perduota Klaipėdos pilis, kurią Livonijos broliai
    pastatė 1252 viešpaties metais ir kuri jų valdžioje buvo po šiai dienai. Be to, švento
    Petro grandinėse dieną (rugpjūčio 1) buvo apleista Kristmemelio pilis, pastatyta brolio
    Karolio, magistro.




                 4.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-001
    - t-004

- c-002
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie Junigedos papilio sudeginimą 1315 m. spalio 12

      Tuo tarpu brolis Karolis, didysis magistras, rūpindamasis savo žmonių gyvybe  ir
    sielodamasis dėl minėtosios pilies apgulos, subūrė didelę kariuomenę, ketindamas ją
    išvaduoti. Kelyje sužinojęs, kad šie jau nutraukė apgulą, paleido kariuomenę, išskyrus
    šešis tūkstančius vyrų, su kuriais naktį nuplaukė prie Junigedos pilies ir, įsiveržęs į jos
    papilį, nukovė daug žmonių, 78 paėmė  į nelaisvę, o jį sudegino ligi pamatų. Po to jie
    nuvyko į Kristmemelio pilį ir atstatė viską, ką ten lietuviai buvo sugriovę.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-003
    - t-002

## Ryšiai
- Karolis (didysis magistras) pastate [[objektai/vietos/Kristmemelis]]
- Karolis (didysis magistras) keliavo_i [[objektai/vietos/Kristmemelis]]
- Karolis (didysis magistras) gyne [[objektai/vietos/Junigeda]]
- Karolis (didysis magistras) puole [[objektai/vietos/Junigeda]]
