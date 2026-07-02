---
tipas: asmuo
pavadinimas: 'Muka'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
datos:
  - '1324 m.'
date_start: '1324'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - vyskupas
amziai:
  - 'XIV'
periodo_grupes:
  - 'LDK'
---
# Muka

## Santrauka

Dusburgietis teigia, kad apie 45 lietuvių žūtį 1324 metais Tais pačiais metais ir tuo pat laiku vienas Varmės vyskupystės vyras, vardu Muka, su 19 plėšikautojų patraukė link Lietuvos, aptiko dykrose 45 lietuvių raitelius, sumaniai juos apsupo ir visus nukovė. Dusburgietis teigia, kad dar apie tą patį Kitą kartą tas pats Muka patraukė su būriu plėšikautojų prieš netikėlius ir, atvykęs į dykras, išvydo daugybę Lietuvos raitelių; pabūgęs tokios gausybės bei galybės, numetė į šalį valgį bei gėrimą ir visa kita, kas galėjo trukdyti, ir su savo.

## Teiginiai

<a id="claim-t-60177"></a>
- t-001
  global_id: t-60177
  teiginys: '1324 m. Varmės vyskupystės vyras Muka su 19 plėšikautojų dykrose apsupo ir nukovė 45 lietuvių raitelius.'
  sudarymo_pagrindimas: 'Teiginys yra pilnas, gramatiškas ir tiesiogiai paremtas citata.'
  susije_objektai: 'llm_object: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_place: Varmė'
  semantiniai_rysiai: '[[objektai/asmenys/Muka|Muka]] puolė [[objektai/grupes/Lietuviai|Lietuviai]]'
  temporaliniai_duomenys: 'įvykio data: 1324 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys yra pilnas, gramatiškas ir tiesiogiai paremtas citata.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=1ac41f32562b636011495e067163fb7020f29225ab6f24bdba4fd4e7facebad8; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Lietuviai: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Muka: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Lietuviai: llm_allowed_candidate, group
  ryšio_paaiskinimas: Teiginys tiesiogiai aprašo Mukos smurtinį veiksmą prieš lietuvių raitelius.

<a id="claim-t-60178"></a>
- t-002
  global_id: t-60178
  teiginys: 'Muka su savo bendrais paspruko nuo gausių Lietuvos raitelių, numetęs maistą, gėrimą ir kitus trukdančius daiktus.'
  sudarymo_pagrindimas: 'Pradinis teiginys nutrūkęs ir negramatiškas, citata leidžia suformuluoti užbaigtą sakinį.'
  susije_objektai: 'mentioned_place: Lietuva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 677625-678175; hash=f6a280d17aae1a71e573e9a04cbdfb47a5bbbaba3e37c79b076d32b2df34ce6e; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Lietuva: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Muka: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Lietuva: mention_match, place, gap=42
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Muka" parinktas kaip owner_note_path. Targetas "Lietuva" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Muka su savo bendrais paspruko nuo gausių Lietuvos raitelių, numetęs maistą, gėrimą ir kitus trukdančius daiktus.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Dar apie tą patį

       Kitą kartą tas pats Muka patraukė su būriu plėšikautojų prieš netikėlius ir, atvykęs į
    dykras, išvydo daugybę Lietuvos raitelių; pabūgęs tokios gausybės bei galybės, numetė
    į šalį valgį bei gėrimą ir visa kita, kas galėjo trukdyti, ir su savo bendrais paspruko bei
    išvengė mirties. Neilgai trukus tas pats Muka susirūpinęs po ilgų svarstymų tarė savo
    bendrams: „Mums prisieis mirti badu, nes neturime maisto. Dėl to patariu bent garbingai
    numirti. Sėlinkime paskui mūsų priešus ir žiūrėkime, ar nepavyks šio ar to iš jų laimėti“.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
- c-002
  santrauka: '1324 m. Varmės vyskupystės vyras Muka su 19 plėšikautojų dykrose apsupo ir nukovė 45 lietuvių raitelius.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    352 (345). Apie 45 lietuvių žūtį 1324 metais

       Tais pačiais metais ir tuo pat laiku vienas Varmės vyskupystės vyras, vardu Muka,
    su 19 plėšikautojų patraukė link Lietuvos, aptiko dykrose 45 lietuvių raitelius, sumaniai
    juos apsupo ir visus nukovė.




                            353 (346).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001

## Ryšiai
- Muka puole [[objektai/grupes/Lietuviai]]
