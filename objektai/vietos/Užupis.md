---
tipas: vieta
pavadinimas: 'Užupis'
saltiniai:
  - 'Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)'
  - 'Michał Baliński, Vilniaus miesto istorija (2007 m.)'
  - 'Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)'
datos:
  - '1493 m.'
  - '1748 m.'
  - '1749 m.'
  - '1794 m.'
date_start: '1493'
date_end: '1794'
sukurta: ''
atnaujinta: ''
amziai:
  - 'XV'
  - 'XVIII'
tags:
  - ginklas
  - vieta
---
# Užupis

## Santrauka

Keli rusų jėgerių batalionai patyrė nuostolių ir išsibėgiojo, tačiau daliai pavyko prasiveržti ir užimti Paupį bei Užupį, pastarasis buvo padegtas.

## Teiginiai
<a id="claim-t-85023"></a>
- t-001
  global_id: t-85023
  teiginys: 'Maksimui Vasiljevičiui buvo dovanota šienaujama pieva prie kelio iš miesto į Užupį, už Vilnelės.'
  susije_objektai: 'mentioned_place: Vilnelė; mentioned_object: [[objektai/daiktai/Malūnas|Malūnas]]; mentioned_person: [[objektai/asmenys/Vasiljevičius (Maskvos valdovas)|Vasiljevičius (Maskvos valdovas)]]; mentioned_place: Vilnius'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 618399-618825; hash=e22eddbd3c88b0fa872c7cf997bffe3a25f5ed56ffb679c41e1678099fba3968; match=ocr_normalized_gapped
  sprendimo_priezastis: auto
  ryšio_patikimumas: uzeme -> Užupis: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Rusai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Užupis: llm_allowed_candidate, place
  ryšio_paaiskinimas: Tekstas tiesiogiai nurodo, kad rusų jėgeriams pavyko užimti Užupį.

<a id="claim-t-85024"></a>
- t-002
  global_id: t-85024
  teiginys: '1493 m. Aleksandras Jogailaitis dovanojo Vilniaus miestiečiui Maksimui Vasiljevičiui pievą Užupyje.'
  sudarymo_pagrindimas: 'Citatos antraštė palaiko faktą apie dovanojimą Užupyje.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Slavai|Slavai]]; mentioned_person: [[objektai/asmenys/Aleksandras Jogailaitis|Aleksandras Jogailaitis]]; mentioned_place: Vilnius'
  temporaliniai_duomenys: 'įvykio data: 1493 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Citatos antraštė palaiko faktą apie dovanojimą Užupyje.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=6bd03bf89523c6b96a775d56016a75d57190246fab3ef103d2da455de1e391fd; match=fallback; occurrences=0
  sprendimo_priezastis: auto

<a id="claim-t-85025"></a>
- t-003
  global_id: t-85025
  teiginys: 'Nuo sklypų Užupyje buvo skaičiuojami 168 auksinai.'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=6d940ed6a8e6e9705539f748ff690de7ea7a62e5f3ee359e1ae5ca912bd45b10; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Aleksandras Jogailaitis: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Užupis: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Aleksandras Jogailaitis: mention_match, person, gap=83
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Užupis" parinktas kaip owner_note_path. Targetas "Aleksandras Jogailaitis" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-85026"></a>
- t-004
  global_id: t-85026
  teiginys: 'Aleksandras dovanojo Maksimui Vasiljevičiui pievą prie kelio iš Vilniaus į Užupį už Vilnelės.'
  sudarymo_pagrindimas: 'Dokumento formuluotė perrašyta į enciklopedinį sakinį apie Užupį.'
  susije_objektai: 'mentioned_place: Vilnelė; mentioned_object: [[objektai/daiktai/Malūnas|Malūnas]]; mentioned_person: [[objektai/asmenys/Vasiljevičius (Maskvos valdovas)|Vasiljevičius (Maskvos valdovas)]]; mentioned_place: Vilnius'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 693900-694245; hash=8c612950a853081791fa46b280eff28b7d7a5dc94e439cbac19301cc39f32987; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Vilnelė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Užupis: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Vilnelė: mention_match, place, gap=10
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Užupis" parinktas kaip owner_note_path. Targetas "Vilnelė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-85028"></a>
- t-006
  global_id: t-85028
  teiginys: '1794 m. liepos 19 d. dalis rusų jėgerių batalionų prasiveržė į Paupį ir Užupį, o Užupis buvo padegtas.'
  sudarymo_pagrindimas: 'Pašalintas perteklinis kontekstas ir aiškiai susietas padegimas su Užupiu.'
  susije_objektai: 'llm_object: Užupis; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_group: [[objektai/grupes/Rusai|Rusai]]; mentioned_object: [[objektai/daiktai/Patrankos|Patrankos]]; mentioned_place: Vilnius'
  semantiniai_rysiai: '[[objektai/grupes/Rusai|Rusai]] užėmė Užupis'
  temporaliniai_duomenys: 'įvykio data: 1794 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Pašalintas perteklinis kontekstas ir aiškiai susietas padegimas su Užupiu.'
  pagrindžia:
    - c-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: 693900-694245; hash=8c612950a853081791fa46b280eff28b7d7a5dc94e439cbac19301cc39f32987; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Vilnelė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Užupis: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Vilnelė: mention_match, place, gap=9
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Užupis" parinktas kaip owner_note_path. Targetas "Vilnelė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-188846"></a>
- t-007
  global_id: t-188846
  teiginys: 'Narbuto cituojamame kūrinio pavadinime 1748 m. birželio 11 d. Vilniaus gaisras priskirtas Rubino kaltei ir alaus daryklai Užupyje.'
  pagrindžia:
    - c-005
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
  statusas: patvirtinta
  irodymo_stiprumas: 0.00
  saltinio_vieta: 259845-260562; hash=88a79231cd3613cbca69cf90fd1a59b3b09162f72e013c4678d87cf7beb321cc; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Gregoravičius: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Užupis: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Gregoravičius: mention_match, person
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Užupis" parinktas kaip owner_note_path. Targetas "Gregoravičius" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
- susijęs iš Paupys: 1794 m. liepos 19 d. dalis rusų pajėgų prasiveržė ir užėmė Paupį bei Užupį.
- susijęs iš [[objektai/asmenys/Aleksandras Jogailaitis.md#claim-t-82171|Aleksandras Jogailaitis]]: Aleksandras Jogailaitis dovanojo Vilniaus miestiečiui Maksimui Vasiljevičiui šienaujamą pievą prie kelio į Užupį.
- susijęs iš [[objektai/asmenys/Gediminas.md#claim-t-188532|Gediminas (Lietuvos didysis kunigaikštis, XIV a.)]]: Narbutas rašo, kad Gedimino kapas esąs prie Vilniaus, dešiniajame Vilnios krante, į kairę nuo kelio iš Užupio į Antakalnį.
- susijęs iš [[objektai/asmenys/M. Dejevas.md#claim-t-40311|M. Dejevas]]: Plk. M. Dejevas žuvo per ataką, kurioje Užupio gyventojai iš apdegusių pastatų apšaudė besitraukiantį priešą.
- susijęs iš [[objektai/ivykiai/Kazimiero ir Mykolo Vežbickių turto skyrimas bibliotekai (1746 m.).md#claim-t-86951|Kazimiero ir Mykolo Vežbickių turto skyrimas bibliotekai (1746 m.)]]: 1746 m. Kazimieras ir Mykolas Vežbickiai skyrė bibliotekai lėšas iš mūrinių namų ir Užupio sklypų pelno knygoms gausinti.
- susijęs iš Aleksandro Jogailaičio dovanojimas Maksimui Vasiljevičiui dėl pievos Užupyje (1493 m. sausio 13 d.): 1493 m. sausio 13 d. Aleksandras Jogailaitis Vilniuje dovanojo Vilniaus miestiečiui Maksimui Vasiljevičiui šienaujamą pievą Užupyje už Vilnelės.
- susijęs iš Paupys: 1794 m. liepos 19 d. dalis rusų pajėgų prasiveržė ir užėmė Paupį bei Užupį.
- susijęs iš Vaivados malūnas Užupyje: 1493 m. Aleksandro Jogailaičio dovanojimo akte minima pieva ties Vaivados malūnu Užupyje.
- susijęs iš Vaivados malūnas Užupyje: Aleksandras dovanojo Maksimui Vasiljevičiui šienaujamą pievą prie Vilniaus vaivados Mikalojaus Radvilos malūno Užupyje.
- susijęs iš Vilnelė: Aleksandras dovanojo Maksimui Vasiljevičiui šienaujamą pievą už Vilnelės prie kelio iš miesto į Užupį.
- susijęs iš Vilnia Vilnelė (sujungti pirminiai pavadinimai Vilnia; Vilnelė): Didysis kunigaikštis Aleksandras dovanojo Maksimui Vasiljevičiui šienaujamą pievą už Vilnelės prie kelio į Užupį.
- susijęs iš Vilnius: Aleksandras dovanojo Vilniaus miestiečiui Maksimui Vasiljevičiui šienaujamą pievą prie kelio į Užupį.
- susijęs iš Vilnius: Narbutas Gedimino kapą lokalizavo prie Vilniaus, dešiniajame Vilnios krante, į kairę nuo kelio iš Užupio į Antakalnį.
- susijęs iš [[objektai/grupes/Kauno jėzuitų kolegija.md#claim-t-86798|Kauno jėzuitų kolegija]]: 1746 m. Kazimieras ir Mykolas Vežbickiai nupirko sklypus Užupyje su Kauno jėzuitų kolegijos pastatais.
- susijęs iš [[objektai/paprociai/Bibliotekos knygų gausinimas fundacinėmis pajamomis ir knygų dovanomis.md#claim-t-87159|Bibliotekos knygų gausinimas fundacinėmis pajamomis ir knygų dovanomis]]: Leonas Sapiega, vyskupas Bžostovskis, kanauninkas Vaišnarovičius ir kiti dovanotomis bei užrašytomis knygomis praturtino biblioteką.
- susijęs iš Radvilų archyvo dekretų ir laiškų originalai: Radvilų archyvo dekretų ir laiškų originalų faksimilėse pateiktas Aleksandro Jogailaičio dovanojimas Vilniaus miestiečiui Maksimui.
- susijęs iš Stepono Batoro 1576 m. gruodžio 20 d. laiškas: Stepono Batoro parašo faksimilė paimta iš jo 1576 m. gruodžio 20 d. rašyto laiško.
- susijęs iš Stepono Batoro privilegija Gabrieliui Bekešui dėl Alantos dvaro: Privilegijoje Bekešui dėl Alantos dvaro buvo Stepono Batoro ir Jono Hlebavičiaus parašai.
- susijęs iš Tygodnik Wilenski: Narbutas mini, kad straipsnį apie aptariamą klausimą buvo paskelbęs viename buvusio „Tygodnik Wilenski“ numeryje.
## Reikšmingi paminėjimai
- c-001
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Teodoras Sku­
    minas, LDK iždininkas.
    Šiame laiške po parašais yra penki antspaudai.
    356

    ## Puslapis 373

    IV KNYGA
    ALEKSANDRO JOGAILAIČIO DOVANOJIMAS
    VILNIAUS MIESTIEČIUI MAKSIMUI VASILJEVIČIUI
    PIEVOS TIES VAIVADOS MALŪNU, UŽUPYJE, VILNIUJE
    1493 METAIS
    (Iš originalo, esančio Vilniuje, Radvilų archyve, Kardinali joje)
    Šis aktas, surašytas gryna slavų kalba, ant popieriaus in
    4to, puikiausiai išsilaikęs.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-005
    - t-002
- c-002
  santrauka: 'Aleksandras dovanojo Maksimui Vasiljevičiui pievą prie kelio iš Vilniaus į Užupį už Vilnelės.'
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    PATS ALEKSANDRAS,
    DIEVO MALONE DIDYSIS LIETUVOS,
    RUSIOS, ŽEMAIČIŲ IR KITŲ
    KUNIGAIKŠTIS
    Vilniaus vaivadai mūsų kancleriui ponui Mikalojui Rad­
    vilai. Dovanojame Vilniaus miestiečiui Maksimui Vasiljevi-
    čiui šienaujamą pievą palei tavo malūną prie kelio, vedan­
    čio iš miesto į Užupį, už Vilnelės. Tai davėme jam ir jo
    vaikams visiems laikams.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-004
    - t-001
- c-003
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Nuo mūrinių pastatų iš gyventojų - 200 auks.
    Nuo sklypų Užupyje - 168 auks.
    Summa facit [suma sudaro] -468 auks.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003
- c-004
  santrauka: '1794 m. liepos 19 d. dalis rusų jėgerių batalionų prasiveržė į Paupį ir Užupį, o Užupis buvo padegtas.'
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Gen. ltn. B. Knorringas, norėdamas ap-
    eiti lietuvių įtvirtinimus, pasiuntė kelis

    150 KOVOS DĖL VILNIAUS 1794 m. balandis-liep

    iaus priemiesčiuose 1794 m. liepos 19 d.

    batalionus, vadovaujamus plk. M. Dejevo,
    į Paupį. Ties Rasomis lietuvių patrankos
    atidengė ugnį kartečėmis. Keli rusų jėgerių
    batalionai patyrė nuostolių ir išsibėgiojo,
    tačiau daliai pavyko prasiveržti ir užimti
    Paupį bei Užupį, pastarasis buvo padegtas.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-006
- c-005
  santrauka: 'Narbuto cituojamame kūrinio pavadinime 1748 m. birželio 11 d. Vilniaus gaisras priskirtas Rubino kaltei ir alaus daryklai Užupyje.'
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
  citata_originali: |
    Niech twoja Neris (a) i bogam oznami,
    Pod ktorych wladzą są morskie zamęty,
    Cierpienia moję i žal nieujęty.
    Powiedz przešliczne boztwo Wiliej rzeki
    Nimfom (b) twym siostrom, boginiom podwodnym:
    25 Štai šio nedidelio kūrinėlio pavadinimas: „Ašaringas vaizdas
    baisybių, su širdies skausmu apdainuotas elegiškomis eilėmis apie jo
    Karališkosios Malonybės Vilniaus miesto dukartinį sudeginimą. Pir­
    mą kartą dėl nekrikšto žydo Rubino kaltės 1748 metų birželio 11
    dieną, tarytum iš pragaro gilumos išsiveržus liepsnai iš alaus daryk­
    los Užupyje; antrą kartą 1749 metų birželio 8 dieną iš Subačiaus prie­
    miesčio, iš pono Gregoravičiaus dvarelio, virtusio pelenais, nuo žie­
    žirbos iš nepaprasta liepsna užsidegusio kamino.
  citata_rodoma: ""
  teiginio_tipas: faktas
  patikimumo_lygis: aukstas
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: ""
  pagrindžia:
    - t-007

## Ryšiai
- [[objektai/grupes/Rusai]] uzeme Užupis
