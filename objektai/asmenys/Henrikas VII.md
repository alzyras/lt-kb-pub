---
tipas: asmuo
pavadinimas: 'Henrikas VII'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
datos:
  - '1230 m.'
  - '1311 m.'
date_start: '1230'
date_end: '1311'
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - karalius
  - valdovas
amziai:
  - 'XIII'
  - 'XIV'
periodo_grupes:
  - 'viduramžiai'
---
# Henrikas VII

## Santrauka

Dusburgietis teigia, kad apie Henriko, Liuksemburgo grafo, išrinkimą Romos karaliumi Tais pačiais metais, šventos Kotrynos dieną (lapkričio 25), Vokietijos valdovai elektoriai vieningai išrinko Henriką, Liuksemburgo grafą, Romos karaliumi (Mart. Dusburgietis teigia, kad apie jo vainikavimą prie Milano 1311 viešpaties metais, per tris karalius sausio 6 dieną, Henriką, Romos karalių, vainikavo prie Milano geležiniu vainiku (Ptol. Dusburgietis teigia, kad apie karaliaus Henriko vainikavimą imperatoriumi Tais metais Henrikas VII, Romos karalius, buvo vainikuotas Romoje, Laterano bažnyčioje, imperatoriumi po 62 metų nuo imperatoriaus Fridricho II mirties (Mart.

## Teiginiai

<a id="claim-t-59976"></a>
- t-001
  global_id: t-59976
  teiginys: 'Baltramiejaus dieną Henrikas VII mirė Sienos grafystėje ir buvo palaidotas Pizoje.'
  sudarymo_pagrindimas: 'Pradinis teiginys turi nereikalingą šaltinio formuluotę; citata pagrindžia mirtį ir palaidojimą.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9c083d1d9f1a73a4073c1a204299400d45f44cdd03a84a5926245efd1dab5e66; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: paskyre -> Henrikas VII: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vokietijos valdovai elektoriai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Henrikas VII: llm_allowed_candidate, person
  ryšio_paaiskinimas: Elektoriai tiesiogiai išrinko Henriką VII Romos karaliumi; artimiausia leistina semantika yra paskyrimas.

<a id="claim-t-59977"></a>
- t-002
  global_id: t-59977
  teiginys: 'Henrikas VII Romoje, Laterano bažnyčioje, buvo vainikuotas imperatoriumi po 62 metų nuo Fridricho II mirties.'
  sudarymo_pagrindimas: 'Teiginys aiškiai nurodo Henriko VII vainikavimo vietą, titulą ir chronologinį kontekstą pagal citatą.'
  pagrindžia:
    - c-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=e85ae99953b0c3cf5cc9805f166eddec1d653c0b01a6ccb11bffaabc256fa6c2; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Milanas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Henrikas VII: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Milanas: mention_match, place, gap=18
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Henrikas VII" parinktas kaip owner_note_path. Targetas "Milanas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-59978"></a>
- t-003
  global_id: t-59978
  teiginys: '1311 m. sausio 6 d. Henrikas VII prie Milano buvo vainikuotas geležiniu vainiku.'
  sudarymo_pagrindimas: 'Pradinis teiginys turi OCR ir antraštės triukšmo; citata pagrindžia glaustą sakinį.'
  susije_objektai: 'mentioned_place: Milanas'
  temporaliniai_duomenys: 'įvykio data: 1311 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Pradinis teiginys turi OCR ir antraštės triukšmo; citata pagrindžia glaustą sakinį.'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9aad0eabcb591a133ff65ffbc4fc1bcc6148e57f8b0a2c788964207ba379556e; match=fallback; occurrences=0
  sprendimo_priezastis: auto

<a id="claim-t-59979"></a>
- t-004
  global_id: t-59979
  teiginys: 'Šv. Kotrynos dieną Vokietijos valdovai elektoriai vieningai išrinko Henriką VII Romos karaliumi.'
  sudarymo_pagrindimas: 'Teiginys yra pilnas faktinis sakinys apie Henriko išrinkimą ir paremtas citata.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Vokietijos valdovai elektoriai|Vokietijos valdovai elektoriai]]; mentioned_object: [[objektai/zodynas/elektoriai|elektoriai]]; mentioned_place: Vokietija; llm_object: [[objektai/asmenys/Henrikas VII|Henrikas VII]]'
  semantiniai_rysiai: '[[objektai/grupes/Vokietijos valdovai elektoriai|Vokietijos valdovai elektoriai]] paskyrė [[objektai/asmenys/Henrikas VII|Henrikas VII]]'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=ae6db43c6007ce66581cde040606d00027c7ec7676cf5905f7e0819640cc1c13; match=fallback; occurrences=0
  sprendimo_priezastis: auto

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Baltramiejaus dieną Henrikas VII mirė Sienos grafystėje ir buvo palaidotas Pizoje.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    113. Apie Henriko, imperatoriaus, mirtį

       Tais pačiais metais, Baltramiejaus dieną (rugpjūčio 24), Sienos grafystėje mirė
    imperatorius Henrikas, o palaidojo  jį Pizoje. 10 dienų, kada rodėsi kometa, reiškė 10
    dienų, kuriomis imperatorius negalavo prieš savo mirtį (Ptol. p. 1240; Mart. p. 449).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
    - t-001

- c-002
  santrauka: 'Šv. Kotrynos dieną Vokietijos valdovai elektoriai vieningai išrinko Henriką VII Romos karaliumi.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    105. Apie Henriko, Liuksemburgo grafo, išrinkimą Romos karaliumi

       Tais pačiais metais, šventos Kotrynos dieną (lapkričio 25), Vokietijos valdovai elektoriai
    vieningai išrinko Henriką, Liuksemburgo grafą, Romos karaliumi (Mart. p. 444; Ptol. p.
    1230).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9c083d1d9f1a73a4073c1a204299400d45f44cdd03a84a5926245efd1dab5e66; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: paskyre -> Henrikas VII: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vokietijos valdovai elektoriai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Henrikas VII: llm_allowed_candidate, person
  ryšio_paaiskinimas: Elektoriai tiesiogiai išrinko Henriką VII Romos karaliumi; artimiausia leistina semantika yra paskyrimas.
    - t-004

- c-003
  santrauka: '1311 m. sausio 6 d. Henrikas VII prie Milano buvo vainikuotas geležiniu vainiku.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    107. Apie jo vainikavimą prie Milano

      1311 viešpaties metais, per tris karalius sausio 6 dieną, Henriką, Romos karalių,
    vainikavo prie Milano geležiniu vainiku (Ptol. p. 1234; Mart. p. 446).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=ae6db43c6007ce66581cde040606d00027c7ec7676cf5905f7e0819640cc1c13; match=fallback; occurrences=0
  sprendimo_priezastis: auto
    - t-003

- c-004
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    110. Apie karaliaus Henriko vainikavimą imperatoriumi

       Tais metais Henrikas  VII, Romos  karalius, buvo vainikuotas Romoje, Laterano
    bažnyčioje, imperatoriumi po 62 metų nuo imperatoriaus Fridricho II mirties (Mart. p.

    447; Ptol. p. 1238).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9aad0eabcb591a133ff65ffbc4fc1bcc6148e57f8b0a2c788964207ba379556e; match=fallback; occurrences=0
  sprendimo_priezastis: auto
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=e85ae99953b0c3cf5cc9805f166eddec1d653c0b01a6ccb11bffaabc256fa6c2; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Milanas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Henrikas VII: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Milanas: mention_match, place, gap=18
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Henrikas VII" parinktas kaip owner_note_path. Targetas "Milanas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-005
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9aad0eabcb591a133ff65ffbc4fc1bcc6148e57f8b0a2c788964207ba379556e; match=fallback; occurrences=0
  sprendimo_priezastis: auto

## Ryšiai
- [[objektai/grupes/Vokietijos valdovai elektoriai]] paskyre Henrikas VII
