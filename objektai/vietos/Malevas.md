---
tipas: vieta
pavadinimas: 'Malevas'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
---
# Malevas

## Santrauka

Malevas yra kaimas kairiajame Ušos krante. Malevas yra apie 18 km į šiaurę nuo Klecko.

## Teiginiai

<a id="claim-t-187259"></a>
- t-001
  global_id: t-187259
  teiginys: 'Malevas yra apie 18 km į šiaurę nuo Klecko.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra trumpas, gramatinis sakinys apie Malevo lokalizaciją. Sąmoningai neperkelti kiti citatoje minimi vietovardžiai, nes jie nereikalingi pagrindiniam faktui.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=25be1fa6e583586d11bd30e493e3d15d765824a7e8e21448e0f5c816d3f1e5f6; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Kaimas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Malevas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Kaimas: mention_match, place, gap=12
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Malevas" parinktas kaip owner_note_path. Targetas "Kaimas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-187260"></a>
- t-002
  global_id: t-187260
  teiginys: 'Malevas yra kaimas pietiniame, kairiajame Ušos upės krante.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra aiškus, gramatinis ir paremtas citata.'
  susije_objektai: 'mentioned_place: Kaimas'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=25be1fa6e583586d11bd30e493e3d15d765824a7e8e21448e0f5c816d3f1e5f6; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md

## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Veikiau­
    siai, čia esama sudarkyto „na[d| Lipoj". t. y. turim as galvoje upelis
    Lipa, įtekantis iš kairės į Ušų keli kilometrai aukščiau ( į pietus)
    nuo m inėtojo Aukštojo Kranto kaimo, apie 10 km į vakarus nuo
    Nesvyžiaus. Prie šio upelio kaip tik y ra kaimai Visokaja Lipa ir
    Lipa.
    8 0  M alevas — kaim as pietiniam e (kairiajame) Ušos upės krante,
    apie 5 km į pietryčius nuo Lipos, apie 18 km į šiaurę nuo Klecko.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
    - t-001