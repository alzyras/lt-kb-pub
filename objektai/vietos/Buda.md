---
tipas: vieta
pavadinimas: 'Buda'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
  - 'Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)'
datos:
  - '1227 m.'
  - '1307 m.'
  - '1385 m.'
date_start: '1227'
date_end: '1385'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
amziai:
  - 'XIII'
  - 'XIV'
---
# Buda

## Santrauka

Nuo tada Jogaila veikė skubiai, ir jau 1385 m. sausio mėn. iš Vilniaus nuvyko ofi­ ciali, Skirgailos vadovaujama, delegacija. Krokuvoje ir Budoje ji galutinai sutarė, kas vėliau Kriavo akte (1385.VIII.14) buvo pa­ žadėta.

## Teiginiai

<a id="claim-t-67760"></a>
- t-001
  global_id: t-67760
  teiginys: '1385 m. sausį Skirgailos vadovaujama delegacija Krokuvoje ir Budoje sutarė dėl vėliau Kriavo akte pažadėtų sąlygų.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Skirgaila|Skirgaila]]; mentioned_place: Krokuva; mentioned_person: [[objektai/asmenys/Jogaila|Jogaila]]; mentioned_place: Vilnius; llm_object: Buda; llm_object: Krokuva'
  semantiniai_rysiai: '[[objektai/asmenys/Skirgaila|Skirgaila]] keliavo į Buda'
  temporaliniai_duomenys: 'įvykio data: 1385 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d10a92b2a7fe5ff4aaf41f6c1ba20e2b1084e64e3095f052dba938212c5c5008; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: keliavo_i -> Buda: 0.78
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Skirgaila: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Buda: llm_allowed_candidate, place
  ryšio_paaiskinimas: Delegacija buvo vadovaujama Skirgailos ir veikė Budoje, todėl atsargiai fiksuojamas jo kelionės ryšys.

<a id="claim-t-67761"></a>
- t-002
  global_id: t-67761
  teiginys: '1307 m. mirus Čekijos karaliui Vaclovui, jo sūnus buvo vainikuotas karaliumi Budoje.'
  sudarymo_pagrindimas: 'Pradinis teiginys sulipdytas su antrašte ir pašalinėmis detalėmis; paliktas Budą pagrindžiantis faktas.'
  susije_objektai: 'mentioned_object: [[objektai/zodynas/Romos karalius|Romos karalius]]; mentioned_place: Čekija; mentioned_person: [[objektai/asmenys/Albrechtas|Albrechtas]]'
  temporaliniai_duomenys: 'įvykio data: 1307 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Pradinis teiginys sulipdytas su antrašte ir pašalinėmis detalėmis; paliktas Budą pagrindžiantis faktas.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=5dc9fb2f76a91b76f38088522f5305d715a787bf595f2217bbb19bc4a51dc91c; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Romos karalius: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Buda: owner_note_path, place
  ryšio_targeto_parinkimas: Romos karalius: mention_match, thing, gap=23
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Buda" parinktas kaip owner_note_path. Targetas "Romos karalius" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
- susijęs iš [[objektai/asmenys/Šakjamunis.md#claim-t-190224|Šakjamunis]]: Narbutas Šakjamunį apibūdino kaip tautos mokytoją, išminčių ir įstatymų leidėją, kuriame įsikūnijo indų Buda.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)
  citata_originali: |
    Nuo tada Jogaila
    veikė skubiai, ir jau 1385 m. sausio mėn. iš Vilniaus nuvyko ofi­
    ciali, Skirgailos vadovaujama, delegacija. Krokuvoje ir Budoje ji
    galutinai sutarė, kas vėliau Kriavo akte (1385.VIII.14) buvo pa­
    žadėta.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-002
  santrauka: '1307 m. mirus Čekijos karaliui Vaclovui, jo sūnus buvo vainikuotas karaliumi Budoje.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    102. Apie Vaclovo, Čekijos karaliaus, mirtį ir jo sosto atitekimą svetimiesiems

      1307 viešpaties metais mirė Vaclovas, Čekijos karalius, o jo sūnus buvo vainikuotas
    karaliumi Budoje, tačiau tais pačiais metais jį nužudė vienas jo riteris (Ptol. p. 1227),
    šitaip Čekijos sostas, kuris neturėjo įpėdinių, atiteko svetimiesiems, nes Romos karalius
    Albrechtas į minėtąjį sostą pakėlė savo sūnų.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002

## Ryšiai
- [[objektai/asmenys/Skirgaila]] keliavo_i Buda
