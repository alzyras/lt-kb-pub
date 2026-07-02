---
tipas: asmuo
pavadinimas: 'Fridrichas iš Holdenštetės'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
datos:
  - '1265 m.'
date_start: '1265'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - ginklas
  - pilis
amziai:
  - 'XIII'
periodo_grupes:
  - 'LDK'
---
# Fridrichas iš Holdenštetės

## Santrauka

Dusburgietis teigia, kad tuo metu maršalu buvo brolis Fridrichas iš Holdenštetės397. Dusburgietis teigia, kad apie Brandenburgo pilies sunaikinimą Brolis Fridrichas iš Holdenštetės, Brandenburgo komtūras, su broliais bei ginklanešiais atvyko į Notangos valsčių, vardu Saldava403, buvusį netoli Kroicburgo pilies, ir jį nusiaubė, degindamas bei plėšdamas, daug žmonių.

## Teiginiai

<a id="claim-t-60119"></a>
- t-001
  global_id: t-60119
  teiginys: 'Tuo metu maršalu buvo brolis Fridrichas iš Holdenštetės397.'
  sudarymo_pagrindimas: 'claim_quality_pipeline deterministic repair'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Fridrichas|Fridrichas]]; mentioned_person: [[objektai/asmenys/Liudvikas|Liudvikas]]; mentioned_place: Prūsija'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 415709-415979; hash=7c9207f61a5b813a161a157dc61b046c159814ade3fe66a62e837a5d96d88d37; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Fridrichas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Fridrichas iš Holdenštetės: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Fridrichas: mention_match, person, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Fridrichas iš Holdenštetės" parinktas kaip owner_note_path. Targetas "Fridrichas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-60120"></a>
- t-002
  global_id: t-60120
  teiginys: 'Fridrichas iš Holdenštetės, Brandenburgo komtūras, su broliais ir ginklanešiais nusiaubė Saldavos valsčių Notangoje.'
  sudarymo_pagrindimas: 'Teiginys yra gramatiškas, konkretus ir paremtas citata.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Fridrichas|Fridrichas]]; mentioned_place: Brandenburgo pilis; mentioned_place: Notanga; mentioned_place: Kroicburgas; llm_object: Notanga'
  semantiniai_rysiai: '[[objektai/asmenys/Fridrichas iš Holdenštetės|Fridrichas iš Holdenštetės]] puolė Notanga'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d38f6339e764548d4afda15cd342e54935b77827837d4d760374a2a7b022b445; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Notanga: 0.78
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Fridrichas iš Holdenštetės: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Notanga: llm_allowed_candidate, place
  ryšio_paaiskinimas: Fridrichas su kariais atvyko į Notangos valsčių ir jį nusiaubė.

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Fridrichas iš Holdenštetės, Brandenburgo komtūras, su broliais ir ginklanešiais nusiaubė Saldavos valsčių Notangoje.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    130 (125). Apie Brandenburgo pilies sunaikinimą

       Brolis Fridrichas iš Holdenštetės, Brandenburgo komtūras, su broliais bei ginklanešiais
    atvyko į Notangos valsčių, vardu Saldava403, buvusį netoli Kroicburgo pilies, ir jį nusiaubė,
    degindamas bei plėšdamas, daug žmonių išžudydamas ar paimdamas  į nelaisvę. Kai
    traukė namo, sutiko pasiuntinį, kuris pasakė, kad Brandenburgo pilis esanti sunaikinta
    Štai šiuo būdu.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-002

- c-002
  santrauka: 'Dusburgietis teigia, kad tuo metu maršalu buvo brolis Fridrichas iš Holdenštetės397.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie brolį Liudviką, septintą Prūsijos žemės magistrą

       Brolis  Liudvikas  iš Baldensheimo,  septintas  Prūsijos  magistras, vadovavo nuo
    1265 viešpaties metų šešerius metus396. Tuo metu maršalu buvo brolis Fridrichas iš
    Holdenštetės397.




                    125 (120).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-003
    - t-001

## Ryšiai
- Fridrichas iš Holdenštetės puole [[objektai/vietos/Notanga]]
