---
tipas: zodyno_irasas
pavadinimas: 'šeimynykštis famulus'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - miestas
  - pilis
  - sąvoka
  - valdovas
---
# šeimynykštis famulus

## Santrauka

Dusburgietis teigia, kad vėliau brolį Liudviką iš nelaisvės išvadavo vienas minėtojo Skomanto šeimynykštis [famulus] ir sugrąžino pas brolius. Dusburgietis teigia, kad apie vieną nuostabų atsivertimą Tuo metu Marienburgo pilyje gyveno brolis Gerhardas; anksčiau, kai dar nedėvėjo vienuolio apsiausto, jis buvo šviesiausiojo valdovo Brandenburgo markgrafo šeimynykštis, garsėjęs kaip labai gabus račius ir didelis karo pabūklų.

## Teiginiai

<a id="claim-t-58885"></a>
- t-001
  global_id: t-58885
  teiginys: 'Brolis Gerhardas prieš tapdamas vienuoliu buvo Brandenburgo markgrafo šeimynykštis.'
  sudarymo_pagrindimas: 'Pradinis teiginys turi antraštės triukšmą ir nutrūkusią pabaigą.'
  susije_objektai: 'llm_object: Marienburgas; mentioned_person: [[objektai/asmenys/Gerhardas|Gerhardas]]; mentioned_place: Marienburgas; mentioned_place: Viena'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=c05e40130e90b67bfe5945f2667913ff089100e56299cf27ab9ab7c12aff745e; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Liudvikas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: šeimynykštis famulus: owner_note_path, thing, gap=0
  ryšio_targeto_parinkimas: Liudvikas: mention_match, person, gap=28
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "šeimynykštis famulus" parinktas kaip owner_note_path. Targetas "Liudvikas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-58886"></a>
- t-002
  global_id: t-58886
  teiginys: 'Skomanto šeimynykštis išvadavo brolį Liudviką iš nelaisvės ir sugrąžino pas brolius.'
  sudarymo_pagrindimas: 'Teiginys yra aiškus, faktinis ir tiksliai atitinka citatos informaciją.'
  susije_objektai: 'mentioned_object: [[objektai/zodynas/šeimynykštis|šeimynykštis]]; mentioned_person: [[objektai/asmenys/Liudvikas|Liudvikas]]; mentioned_object: [[objektai/daiktai/Kalavijas|Kalavijas]]'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9ab61137f9735df7488e35e4b0fe334f0347b2148f8d2e9b989c3d7f5b00335c; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: gyveno -> Marienburgas: 0.93
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Gerhardas (valdovas): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Marienburgas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai teigia, kad brolis Gerhardas gyveno Marienburgo pilyje.

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Brolis Gerhardas prieš tapdamas vienuoliu buvo Brandenburgo markgrafo šeimynykštis.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    245 (238). Apie vieną nuostabų atsivertimą

      Tuo metu Marienburgo pilyje gyveno brolis Gerhardas; anksčiau, kai dar nedėvėjo
    vienuolio apsiausto, jis buvo šviesiausiojo valdovo Brandenburgo markgrafo šeimynykštis,
    garsėjęs kaip labai gabus račius  ir didelis karo pabūklų meistras. Kai jis kartą, jau
    padaręs galybę tokių pabūklų, kuriais buvo sugriauta [daug] pilių bei miestų, gulėjo
    vieną naktį atmerktomis akimis lovoje, pro užsklęstas duris įėjo keturi vyrai, nešini
    keturiomis degančiomis žvakėmis, ir apkaltino jį daugybe nusikaltimų, sakydami, kad jis
    neabejotinai susilauksiąs mirties, jeigu per tam tikrą laiką nepataisysiąs savo gyvenimo
    būdo; kad šitai būtų akivaizdu, jie  jį užklojo balta marška, kaip paprastai užklojami
    numirėliai.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
    - t-001

- c-002
  santrauka: 'Skomanto šeimynykštis išvadavo brolį Liudviką iš nelaisvės ir sugrąžino pas brolius.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Šitai išgirdęs, brolis Liudvikas įsidrąsinęs
    kalaviju nukovė savo varžovą. Vėliau brolį Liudviką iš nelaisvės išvadavo vienas minėtojo
    Skomanto šeimynykštis [famulus] ir sugrąžino pas brolius.




                 211 (206).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=c05e40130e90b67bfe5945f2667913ff089100e56299cf27ab9ab7c12aff745e; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Liudvikas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: šeimynykštis famulus: owner_note_path, thing, gap=0
  ryšio_targeto_parinkimas: Liudvikas: mention_match, person, gap=28
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "šeimynykštis famulus" parinktas kaip owner_note_path. Targetas "Liudvikas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9ab61137f9735df7488e35e4b0fe334f0347b2148f8d2e9b989c3d7f5b00335c; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: gyveno -> Marienburgas: 0.93
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Gerhardas (valdovas): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Marienburgas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai teigia, kad brolis Gerhardas gyveno Marienburgo pilyje.
