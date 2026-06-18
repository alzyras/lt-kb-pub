---
tipas: vieta
pavadinimas: 'Abenda'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
datos:
  - '1283 m.'
date_start: '1283'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - dokumentas
  - vieta
  - vyskupas
amziai:
  - 'XIII'
---
# Abenda

## Santrauka

Dusburgietis teigia, kad apie vienos Sembos dalies nusiaubimą 1283 viešpaties metų žiemą aštuoni šimtai raitelių iš Lietuvos per Kuršių neriją509 įsibrovė į Sembos žemę ir, degindami bei piešdami, nusiaubė du jos valsčius, būtent: Abendą ir Pabečius510; nužudę 150 krikščionių, jie. Dusburgietis teigia, kad 510 D.— duo territoria [...] Abendam et Pubetam, Jer.— Pobêtin unde Bêtin. Dusburgietis teigia, kad manoma, kad Abendos vardas galėjęs būti Betin, t.

## Teiginiai

<a id="claim-t-58424"></a>
- t-001
  global_id: t-58424
  teiginys: 'Abenda minima XIV a. vidurio Sembos vyskupo dokumentuose vakarinėje Semboje.'
  sudarymo_pagrindimas: 'Teiginys yra pilnas, gramatiškas ir tiesiogiai paremtas citata apie Abendą.'
  susije_objektai: 'mentioned_place: Semba; llm_object: Semba'
  semantiniai_rysiai: 'Abenda priklausė Semba'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=5ea5f6e1b03fbab6b930fd6b86146f436c8c0a456807fca0861debeb2df85cc9; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: surenge_zygi_i -> Semba: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Lietuviai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Semba: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai mini, kad lietuviai buvo susirengę į žygį, o ankstesniame sakinyje jo kryptis yra Sembos žemė.

<a id="claim-t-58425"></a>
- t-002
  global_id: t-58425
  teiginys: 'Manoma, kad Abendos vardas galėjęs būti Betin, t.'
  sudarymo_pagrindimas: 'claim_quality_pipeline deterministic repair'
  susije_objektai: 'mentioned_place: Pabečiai'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: 535313-535475; hash=75517e4ad5e4f73ad0f032eeaf32d242c06b44d002bf7b84d2dfe6988ad3b69c; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: priklause -> Semba: 0.67
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Abenda: llm_allowed_candidate, place
  ryšio_targeto_parinkimas: Semba: llm_allowed_candidate, place
  ryšio_paaiskinimas: Abenda minima kaip esanti vakarinėje Semboje, todėl galima vietos priklausomybė platesnei sričiai.

<a id="claim-t-58426"></a>
- t-003
  global_id: t-58426
  teiginys: '1283 m. žiemą Lietuvos raiteliai įsiveržė į Sembą ir nusiaubė Abendos bei Pabečių valsčius.'
  sudarymo_pagrindimas: 'Pirminis teiginys buvo per ilgas ir nutrūkęs, bet citata palaiko glaustą faktą apie Abendą.'
  susije_objektai: 'mentioned_place: Pabečiai; mentioned_group: [[objektai/grupes/Kuršiai|Kuršiai]]; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_object: [[objektai/daiktai/Namas|Namas]]; mentioned_object: [[objektai/zodynas/magistras|magistras]]; mentioned_place: Lietuva; mentioned_place: Semba; mentioned_place: Viena; llm_object: Semba; llm_object: Abenda; llm_object: Pabečiai'
  semantiniai_rysiai: '[[objektai/grupes/Lietuviai|Lietuviai]] puolė Abenda'
  temporaliniai_duomenys: 'įvykio data: 1283 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Pirminis teiginys buvo per ilgas ir nutrūkęs, bet citata palaiko glaustą faktą apie Abendą.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 535667-535764; hash=1ed1aca730412d6c34b8e9e9dfa309eb1e8ba99ae241f69924da8a7530a325e4; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Pabečiai: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Abenda: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Pabečiai: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Abenda" parinktas kaip owner_note_path. Targetas "Pabečiai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
- susijęs iš [[objektai/grupes/Lietuviai.md#claim-t-179301|Lietuviai]]: 1283 m. žiemą 800 raitelių iš Lietuvos per Kuršių neriją įsibrovė į Sembą ir nusiaubė Abendos bei Pabečių valsčius.
- susijęs iš [[objektai/ivykiai/1283 m. žiemos lietuvių antpuolis Sembos žemėje.md#claim-t-62736|1283 m. žiemos lietuvių antpuolis Sembos žemėje]]: 1283 m. žiemą 800 lietuvių raitelių per Kuršių neriją įsiveržė į Sembą, nusiaubė Abendos ir Pabečių valsčius, nužudė 150 krikščionių ir grįžo be pasipriešinimo.
- susijęs iš [[objektai/grupes/Lietuviai.md#claim-t-179301|Lietuviai]]: 1283 m. žiemą 800 raitelių iš Lietuvos per Kuršių neriją įsibrovė į Sembą ir nusiaubė Abendos bei Pabečių valsčius.
- susijęs iš [[objektai/ivykiai/1283 m. žiemos lietuvių antpuolis Sembos žemėje.md#claim-t-62736|1283 m. žiemos lietuvių antpuolis Sembos žemėje]]: 1283 m. žiemą 800 lietuvių raitelių per Kuršių neriją įsiveržė į Sembą, nusiaubė Abendos ir Pabečių valsčius, nužudė 150 krikščionių ir grįžo be pasipriešinimo.
- susijęs iš Aismarių nerija: Aismarių nerija šaltinio rodyklėje nurodyta pavadinimu „Neria“.
- susijęs iš Kuršių nerija: 1283 m. žiemą aštuoni šimtai raitelių iš Lietuvos per Kuršių neriją įsibrovė į Sembą ir nusiaubė du valsčius.
## Reikšmingi paminėjimai

- c-001
  santrauka: '1283 m. žiemą Lietuvos raiteliai įsiveržė į Sembą ir nusiaubė Abendos bei Pabečių valsčius.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    215 (210). Apie vienos Sembos dalies nusiaubimą

      1283 viešpaties metų žiemą aštuoni šimtai raitelių iš Lietuvos per Kuršių neriją509
    įsibrovė  į Sembos žemę ir, degindami bei piešdami, nusiaubė du jos valsčius, būtent:
    Abendą ir Pabečius510; nužudę 150 krikščionių, jie, niekur nesutikę pasipriešinimo, sveiki
    ir gyvi sugrįžo atgal. Neabejojama, jog šitai įvyko dėl to, kad magistras ir broliai, iš
    anksto žinodami, jog lietuviai susirengė  į žygį, kelias dienas jų laukė su kariuomene,
    tačiau pabodus laukti, nes šie kelyje užtruko ilgiau nei paprastai, išsisklaidę sugrįžo
    namo.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
    - t-003

- c-002
  santrauka: 'Abenda minima XIV a. vidurio Sembos vyskupo dokumentuose vakarinėje Semboje.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    510 D.— duo territoria [...] Abendam et Pubetam, Jer.— Pobêtin unde Bêtin. Abenda
    minima XIV a. vidurio Sembos vyskupo dokumentuose vakarinėje Semboje (SU, 2, Nr.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: 535667-535764; hash=1ed1aca730412d6c34b8e9e9dfa309eb1e8ba99ae241f69924da8a7530a325e4; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Pabečiai: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Abenda: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Pabečiai: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Abenda" parinktas kaip owner_note_path. Targetas "Pabečiai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-001

- c-003
  santrauka: 'Manoma, kad Abendos vardas galėjęs būti Betin, t.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Manoma, kad Abendos vardas galėjęs būti Betin, t. y. Pabečių (D.
    III, 107, 108) vertimas (GAO, p.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=5ea5f6e1b03fbab6b930fd6b86146f436c8c0a456807fca0861debeb2df85cc9; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: surenge_zygi_i -> Semba: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Lietuviai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Semba: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai mini, kad lietuviai buvo susirengę į žygį, o ankstesniame sakinyje jo kryptis yra Sembos žemė.
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 535313-535475; hash=75517e4ad5e4f73ad0f032eeaf32d242c06b44d002bf7b84d2dfe6988ad3b69c; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: priklause -> Semba: 0.67
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Abenda: llm_allowed_candidate, place
  ryšio_targeto_parinkimas: Semba: llm_allowed_candidate, place
  ryšio_paaiskinimas: Abenda minima kaip esanti vakarinėje Semboje, todėl galima vietos priklausomybė platesnei sričiai.

## Ryšiai
- [[objektai/grupes/Lietuviai]] puole Abenda
- Abenda priklause [[objektai/vietos/Semba]]
