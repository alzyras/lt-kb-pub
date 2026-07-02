---
tipas: paprotys
pavadinimas: 'Žirgų plauko spalvos tabu iš pagarbos dievams'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - paprotys
---
# Žirgų plauko spalvos tabu iš pagarbos dievams

## Santrauka

Dusburgietis teigia, kad žiūrint kas kaip įsitikinęs galėsiąs įsiteikti savo dievams. Dusburgietis teigia, kad apie vieną stebuklą Sembos žemėje, Žiokos valsčiuje216, gyveno vienas prūsas, vardu Dargis, kuris nepakentė baltų žirgų; brolis Ditrichas, Sembos fogtas217, norėdamas jį atpratinti nuo prietaro, nupirko jam baltą arklį ir, nors tas ir prieštaravo, pastatė jį.

## Laikotarpis ir datos

Nenurodyta

## Kas tai

Nenurodyta

## Atlikimas

Nenurodyta

## Paskirtis

Nenurodyta

## Kontekstas

Nenurodyta

## Teiginiai

<a id="claim-t-62179"></a>
- t-001
  global_id: t-62179
  teiginys: 'Žiūrint kas kaip įsitikinęs galėsiąs įsiteikti savo dievams.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'claim_quality_pipeline deterministic repair'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 236736-236953; hash=7e8dd863d4cda804a41289e5a9d33b977ad8d3385084944db91f0b9e2c780961; match=exact
  sprendimo_priezastis: auto

<a id="claim-t-62180"></a>
- t-002
  global_id: t-62180
  teiginys: 'Žiokos valsčiuje gyvenęs prūsas Dargis nepakentė baltų žirgų, o Sembos fogtas Ditrichas mėgino jį atpratinti nuo šio prietaro.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Citata remia aiškų faktą, bet pirminis teiginys buvo per ilgas ir fragmentiškas.'
  susije_objektai: 'llm_object: Semba; mentioned_object: [[objektai/zodynas/fogtas|fogtas]]; mentioned_place: Semba; mentioned_group: [[objektai/grupes/Baltai|Baltai]]; mentioned_group: [[objektai/grupes/Rytas|Rytas]]; mentioned_person: [[objektai/asmenys/Dargis|Dargis]]; mentioned_place: Viena'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9af1ce0d2d4fcf5dfa2ee2cfcf6f698a1a18855f2d8083fafee6f328c92b2117; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: gyveno -> Semba: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Dargis: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Semba: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad Dargis gyveno Sembos žemėje.

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Žiokos valsčiuje gyvenęs prūsas Dargis nepakentė baltų žirgų, o Sembos fogtas Ditrichas mėgino jį atpratinti nuo šio prietaro.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    6. Apie vieną stebuklą

      Sembos žemėje, Žiokos  valsčiuje216, gyveno vienas prūsas, vardu Dargis, kuris
    nepakentė baltų žirgų; brolis Ditrichas, Sembos fogtas217, norėdamas jį atpratinti nuo
    prietaro, nupirko jam baltą arklį ir, nors tas ir prieštaravo, pastatė jį vienai nakčiai jo
    tvarte; ryto metą žmogelis rado šį žirgą nudurtą, o visus savo gyvulius padvėsusius. Tris
    kartus jis padarė šitokį bandymą ir kiekvieną kartą susilaukė tos pačios baigties.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
- c-002
  santrauka: 'Žiūrint kas kaip įsitikinęs galėsiąs įsiteikti savo dievams.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    žiūrint kas kaip įsitikinęs galėsiąs įsiteikti savo dievams. Vieni iš pagarbos saviesiems
    dievams nedrįso jodinėti juodžiais, kiti — balčiais215, treti — kitokio plauko žirgais.




                                     6.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001