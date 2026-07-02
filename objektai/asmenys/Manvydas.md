---
tipas: asmuo
pavadinimas: 'Manvydas'
saltiniai:
  - 'Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)'
  - 'Michał Baliński, Vilniaus miesto istorija (2007 m.)'
  - 'Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)'
datos:
  - '1276 m.'
  - '1396 m.'
date_start: '1276'
date_end: '1396'
sukurta: ''
atnaujinta: ''
amziai:
  - 'XIII'
  - 'XIV'
periodo_grupes:
  - 'LDK'
tags:
  - asmuo
  - didikas
  - karalius
  - kunigaikštis
---
# Manvydas

## Santrauka

O pilies kalno pietų pusėje, tarp jo ir Vilnelės upės, stovėjo didžiuliai vieno gar­ siausių Lietuvos didikų Manvydo rūmai, o kalno papėdėje, palei Viliją, driekėsi Žemutinė pilis, vadinta Kreivąja. Šlaito nuošliaužos užslinko ant vaivados Manvydo rūmų, stovėjusių pakalnėje, užgriuvo jo tarnus ir turtus. Dalyvaujant garbingiems ir narsiems vyrams Mingailai, Goš­ tautui; Vilniaus vaivadai Manvydui bei mūsų dvaro maršalkoms Čupurvai ir Milonui bei daugeliui kitų, ver­ tų pasitikėjimo].

## Teiginiai
<a id="claim-t-87374"></a>
- t-001
  global_id: t-87374
  teiginys: 'Manvydas buvo vienas garsiausių Lietuvos didikų, kurio didžiuliai rūmai stovėjo Vilniuje pilies kalno pietų pusėje, tarp kalno ir Vilnelės.'
  sudarymo_pagrindimas: 'Reikia aiškiau susieti faktą su asmeniu ir pašalinti vien tik rūmų aprašymo pobūdį.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_place: Lietuva; mentioned_place: Vilnelė; mentioned_place: Vilnius; mentioned_person: [[objektai/asmenys/Gediminas|Gediminas]]; mentioned_person: [[objektai/asmenys/Šventaragis|Šventaragis]]; mentioned_place: Vilija; llm_object: Vilnius'
  semantiniai_rysiai: '[[objektai/asmenys/Manvydas|Manvydas]] gyveno Vilnius'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 232960-233604; hash=351794eb85b2f7515b99ce23fbe9901011718338ba777ee34f6aa070db8f192f; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: gyveno -> Vilnius: 0.52
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Manvydas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Vilnius: llm_allowed_candidate, place
  ryšio_paaiskinimas: Manvydo rūmai stovėjo Vilniuje, bet gyvenimas juose nėra pasakytas tiesiogiai, todėl pasitikėjimas ribotas.

<a id="claim-t-87375"></a>
- t-002
  global_id: t-87375
  teiginys: '1396 m. Vilniuje Manvydas minėtas kaip Vilniaus vaivada tarp dokumento liudytojų.'
  sudarymo_pagrindimas: 'Pašalintas lotyniško akto ir vertimo fragmentiškumas.'
  susije_objektai: 'mentioned_object: [[objektai/zodynas/vaivada|vaivada]]; mentioned_place: Cudzeniškiai; mentioned_place: Lenkija; mentioned_place: Viena; mentioned_place: Vilnius'
  temporaliniai_duomenys: 'įvykio data: 1396 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Pašalintas lotyniško akto ir vertimo fragmentiškumas.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=a6e48f61f2703a4b1de6bfe67118c8afede9099f19f0a4cf87bd73c851f437d9; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Vilnius: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Manvydas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Vilnius: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Manvydas" parinktas kaip owner_note_path. Targetas "Vilnius" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-87376"></a>
- t-003
  global_id: t-87376
  teiginys: 'Trakų vaivada Manvydas įspėjo Švitrigailą, todėl šis, lydimas kelių totorių vadų, išsigelbėjo pabėgdamas.'
  sudarymo_pagrindimas: 'Pašalintas OCR triukšmas, suformuluotas citatos paremtas Manvydo veiksmas.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Totoriai|Totoriai]]; mentioned_person: [[objektai/asmenys/Švitrigaila|Švitrigaila]]; mentioned_object: [[objektai/zodynas/vaivada|vaivada]]; mentioned_person: [[objektai/asmenys/Tomas (Hertvigo iš Pokarvių sūnus)|Tomas (Hertvigo iš Pokarvių sūnus)]]; mentioned_place: Trakai; mentioned_place: Vilnius'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: 311231-312192; hash=9a889761a81080ad220a25bd4158d382232a81dfa0c65fcb064acc97f74f9035; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> vaivada: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Manvydas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: vaivada: mention_match, thing, gap=31
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Manvydas" parinktas kaip owner_note_path. Targetas "vaivada" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-87377"></a>
- t-004
  global_id: t-87377
  teiginys: 'Šlaito nuošliaužos užslinko ant vaivados Manvydo rūmų, stovėjusių pakalnėje, užgriuvo jo tarnus ir turtus.'
  sudarymo_pagrindimas: 'Teiginys yra pilnas sakinys ir tiksliai perteikia citatos faktą apie Manvydo rūmus.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Švitrigaila|Švitrigaila]]; mentioned_place: Vilnius'
  pagrindžia:
    - c-005
  irodymo_stiprumas: 0.00
  saltinio_vieta: 437556-438095; hash=28c2c162913141496293f76f2426c47f7129f36cc1c5c52ceb6c037b1dd138fb; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Totoriai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Manvydas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Totoriai: mention_match, group, gap=54
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Manvydas" parinktas kaip owner_note_path. Targetas "Totoriai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-87378"></a>
- t-005
  global_id: t-87378
  teiginys: 'Trakų vaivada Manvydas buvo sučiuptas ir Žygimanto įsakymu nukirsdintas.'
  sudarymo_pagrindimas: 'Teiginys aiškus, gramatiškas ir pagrįstas citata apie Manvydo suėmimą bei nukirsdinimą.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Žygimantas|Žygimantas]]; mentioned_object: [[objektai/zodynas/vaivada|vaivada]]; mentioned_person: [[objektai/asmenys/Švitrigaila|Švitrigaila]]; mentioned_place: Trakai'
  pagrindžia:
    - c-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: 444703-445150; hash=2cc00e1410b005d2f55a568b6bf2bffdf3ce103bb5e594a362b9f558fda387b7; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Žygimantas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Manvydas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Žygimantas: mention_match, person, gap=27
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Manvydas" parinktas kaip owner_note_path. Targetas "Žygimantas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-184780"></a>
- t-006
  global_id: t-184780
  teiginys: 'Manvydas susitarė su Goštautu ir Astiku paskelbti valdovu karalių Vladislovą pagal senąjį susitarimą su lenkais.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Pašalintas boilerplate ir sutvarkytos OCR klaidos.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lenkai|Lenkai]]; mentioned_person: [[objektai/asmenys/Astikas|Astikas]]; mentioned_place: Vengrija; llm_object: [[objektai/asmenys/Astikas|Astikas]]'
  semantiniai_rysiai: '[[objektai/asmenys/Manvydas|Manvydas]] buvo sąjungininkas su [[objektai/asmenys/Astikas|Astikas]]'
  pagrindžia:
    - c-006
  irodymo_stiprumas: 0.00
  saltinio_vieta: 818368-818899; hash=bb7e2b19c0aa3ecceecb969fcf43eab1011006de5166449c076bc512ac810ccf; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: buvo_sajungininkas_su -> Astikas: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Manvydas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Astikas: llm_allowed_candidate, person
  ryšio_paaiskinimas: Susitarimas su Astiku tiesiogiai rodo politinį bendradarbiavimą.

<a id="claim-t-188582"></a>
- t-007
  global_id: t-188582
  teiginys: 'Narbutas Manvydą laiko Gedimino ir Vidos sūnumi, gimusiu 1276 metais, o jo vardą aiškina kaip „Vidos pasaulis“.'
  pagrindžia:
    - c-007
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
  statusas: patvirtinta
  irodymo_stiprumas: 0.00
  saltinio_vieta: 363961-364296; hash=bf79869d138938eeb1a9cf3f8af61244872fe8ed201677c8b1d19ebe0a3ca10e; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: buvo_sunus -> Gediminas: 0.78
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Manvydas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Gediminas: llm_allowed_candidate, person
  ryšio_paaiskinimas: Toliau tame pačiame sakinyje Manvydas nurodomas kaip vienas iš sūnų, todėl ryšys su Gediminu pagrįstas kontekstu.
- susijęs iš Manvydo rūmai: Šlaito nuošliaužos užslinko ant vaivados Manvydo rūmų, stovėjusių pakalnėje, užgriuvo jo tarnus ir turtus.
- susijęs iš Manvydo rūmai: Kalno griūtis užslinko ant Manvydo rūmų, pridarė daug nuostolių, užpylė jo tarnus ir užvertė brangenybes.
- susijęs iš Vilnelė: Pilies kalno pietų pusėje tarp kalno ir Vilnelės stovėjo didžiuliai Manvydo rūmai.
- susijęs iš [[objektai/asmenys/Astikas.md#claim-t-186182|Astikas]]: Astikas su Manvydu ir Goštautu susitarė valdovu paskelbti karalių Vladislovą, laikydamiesi senojo susitarimo su lenkais.
- susijęs iš [[objektai/daiktai/Manvydo rūmai ir Aukštutinės pilies mūrai.md#claim-t-87083|Manvydo rūmai ir Aukštutinės pilies mūrai]]: 1396 metais pilies kalno nuošliaužos užslinko ant Manvydo rūmų, o Aukštutinės pilies mūrai nuostolių nepatyrė.
- susijęs iš Karalystės archyve saugomas dokumentas apie Zigmanto klastingumo įrodymą: Karalystės archyve saugomas dokumentas buvo patvirtintas Vytauto, Vilniaus vyskupo Mikalojaus, Alberto Manvydo ir Jono Nemyros parašais.
- susijęs iš Manvydo rūmai: Kalno griūtis užslinko ant Manvydo rūmų, pridarė daug nuostolių, užpylė jo tarnus ir užvertė brangenybes.
- susijęs iš Manvydo rūmai: Šlaito nuošliaužos užslinko ant vaivados Manvydo rūmų, stovėjusių pakalnėje, užgriuvo jo tarnus ir turtus.
- susijęs iš Pilies kalnas (sujungti pirminiai pavadinimai Pilies kalnas; Vilniaus pilies kalnas): Vilniaus Aukštutinės pilies kalnas užslinko ant Manvydo namo ir pridarė daug nuostolių.
- susijęs iš Pilies kalnas (sujungti pirminiai pavadinimai Pilies kalnas; Vilniaus pilies kalnas): 1396 m. Vilniaus Pilies kalną ištiko smarki griūtis, kurios nuošliaužos užslinko ant vaivados Manvydo rūmų.
- susijęs iš Vilnelė: Pilies kalno pietų pusėje tarp kalno ir Vilnelės stovėjo didžiuliai Manvydo rūmai.
- susijęs iš Vilniaus Aukštutinė pilis (sujungti pirminiai pavadinimai Vilniaus Aukštutinė pilis; Aukštutinė pilis): Kalno, ant kurio stovėjo Aukštutinė pilis, griūtis užslinko ant Manvydo rūmo ir pridarė daug nuostolių.
- susijęs iš Vilniaus Aukštutinė pilis: Kalno, ant kurio stovėjo Aukštutinė pilis, griūtis užslinko ant Manvydo rūmo ir pridarė daug nuostolių.
- susijęs iš Vilniaus pilies kalnas: 1396 m. Vilniaus pilies kalną ištiko smarki griūtis, kurios nuošliaužos užslinko ant vaivados Manvydo rūmų.
- susijęs iš Vilniaus pilies kalnas: Vilniaus pilies kalnas nuslinko ant Manvydo rūmo ir pridarė daug nuostolių.
- susijęs iš Vilnius: 1396 m. Vilniuje pilies kalno nuošliaužos užslinko ant vaivados Manvydo rūmų, bet Aukštutinės pilies mūrai nenukentėjo.
- susijęs iš [[objektai/asmenys/Gediminas.md#claim-t-176382|Gediminas (Lietuvos didysis kunigaikštis, XIV a.)]]: Gediminas Vilniuje pastatydino mūro tvirtovę, saugomą aukštų sienų ir trijų bokštų.
- susijęs iš [[objektai/asmenys/Milonas.md#claim-t-87791|Milonas]]: Milonas buvo dvaro maršalka, dalyvavęs 1396 m. Vilniuje aktuotame dokumente.
- susijęs iš [[objektai/asmenys/Mingaila.md#claim-t-87792|Mingaila]]: 1396 m. Vilniuje duotame akte Mingaila dalyvavo tarp garbingų ir patikimų vyrų.
- susijęs iš [[objektai/asmenys/Olelka.md#claim-t-87809|Olelka]]: Kopylę valdęs Olelka, Algirdo palikuonis, buvo įkalintas prieš diduomenei nutariant gelbėtis Žygimanto gyvybės kaina.
- susijęs iš [[objektai/asmenys/Čupurva.md#claim-t-87897|Čupurva]]: 1396 m. Vilniuje Čupurva minėtas kaip viena iš dvaro maršalkų, dalyvavusių akto sudaryme.
- susijęs iš [[objektai/grupes/Lenkai.md#claim-t-184526|Lenkai]]: Lietuvos didikų ginče nugalėjo ryšių su Jogailos gimine ir sąjungos su lenkais šalininkai.
- susijęs iš [[objektai/grupes/Totoriai.md#claim-t-171395|Totoriai]]: Vilniuje ir jo apylinkėse įsikūrė nemaža į nelaisvę paimtų totorių.
- susijęs iš [[objektai/ivykiai/Kazimiero Jogailaičio išrinkimas Lietuvos didžiuoju kunigaikščiu ir kvietimas į Brestą (1440 m.).md#claim-t-185586|Kazimiero Jogailaičio išrinkimas Lietuvos didžiuoju kunigaikščiu ir kvietimas į Brestą (1440 m.)]]: Po ginčų daugelis Lietuvos didikų nutarė valdovu rinkti karaliaus Vladislovo brolį Kazimierą.
- susijęs iš Dinaburgo komtūro laiškas Livonijos magistrui apie Švitrigailą ir Pilies kalno griūtį: Petras pranešė Dinaburgo komtūrui, kad Švitrigaila su gausia kariauna ir paramos pulkais patraukė toliau.
- susijęs iš Imperatoriaus Zigmanto raštas Jogailai dėl Galičo ir dalies Podolės: Imperatorius Zigmantas raštu pripažino Jogailai teisę į Galičą ir dalį Podolės, o pasiuntiniams įsakė kurstyti Vytautą pažadais.
- susijęs iš Vilniaus miesto planas Jogailos laikais: Vilniaus miesto planas Jogailos laikais žymėjo Aukštutinę pilį, Kreivąją pilį, Perkūno šventyklą, kelius, bažnyčias ir vienuolynus.
- susijęs iš Krivių Krivaičio bokštas: Krivių Krivaičio, vyriausiojo kunigo, bokštas.
- susijęs iš Neris Vilija (sujungti pirminiai pavadinimai Neris; Vilija; Neris Vilija; Vilijos upė): Gedimino pastatydinta mūro tvirtovė stovėjo ant kalno ties vieta, kur Vilnelė įteka į Viliją.
- susijęs iš Trakai: Trakuose Žygimanto sušauktas seimas paspartino susidorojimą, o 1440 m. balandį Žygimantas buvo nužudytas Trakų pilyje.
- susijęs iš Trakai: Vytautas būdamas Trakuose nerimavo dėl išdavystės ir norėjo ten pasilikti dar dvylika savaičių.
- susijęs iš Vilija: Gedimino pastatydinta mūro tvirtovė stovėjo prie Vilnelės žiočių į Viliją.
- susijęs iš Vilnelė: Ten, kur Vilnelė įteka į Viliją, stovėjo Gedimino pastatydinta mūro tvirtovė.
- susijęs iš Vilnelė: Šventaragio slėnis buvo lanka tarp Vilijos ir Vilnelės, kur degė lietuvių garbinama amžinoji ugnis Gabija.
- susijęs iš Vilnelė: Gedimino pastatydinta mūro tvirtovė stovėjo prie Vilnelės žiočių į Viliją.
- susijęs iš Vilnia Vilnelė (sujungti pirminiai pavadinimai Vilnia; Vilnelė): Vilnia tekėjo kalnų apsupta vaga ir įtekėjo į Viliją ties Gedimino pastatyta mūro tvirtove.
- susijęs iš Vilnia Vilnelė (sujungti pirminiai pavadinimai Vilnia; Vilnelė): Tarp Vilijos ir Vilnelės plytėjo Šventaragio slėnio lanka, nuo seno apaugusi ąžuolais.
- susijęs iš Vilniaus Žemutinė Kreivoji pilis (sujungti pirminiai pavadinimai Žemutinė pilis Kreivoji pilis; Žemutinė pilis; Kreivoji pilis; Žemutinė Kre: Žemutinė pilis, vadinta Kreivąja, driekėsi pilies kalno papėdėje palei Viliją.
- susijęs iš Vilnius: Atvykusiems lenkams anuometinis Vilnius pasirodė niūrokas, bet išsiskyrė gražiu kraštovaizdžiu.
- susijęs iš Šventaragio slėnis: Šventaragio slėnis buvo laikomas reikšmingiausia Žemutinės pilies dalimi, kur degė lietuvių garbinta Gabija.
- susijęs iš Žemutinė pilis Kreivoji pilis (pilis): Žemutinė pilis, vadinta Kreivąja, driekėsi pilies kalno papėdėje palei Viliją.
- susijęs iš [[objektai/zodynas/pataurininkis rykūnė.md#claim-t-86605|pataurininkis rykūnė]]: Aukštutinės pilies kalno griūtis užpylė Manvydo pataurininkį ir rykūnes, o nuošliaužos užvertė jo brangenybes.
- susijęs iš [[objektai/asmenys/Astikas.md#claim-t-186182|Astikas]]: Astikas su Manvydu ir Goštautu susitarė valdovu paskelbti karalių Vladislovą, laikydamiesi senojo susitarimo su lenkais.
- susijęs iš [[objektai/daiktai/Manvydo rūmai ir Aukštutinės pilies mūrai.md#claim-t-87083|Manvydo rūmai ir Aukštutinės pilies mūrai]]: 1396 metais pilies kalno nuošliaužos užslinko ant Manvydo rūmų, o Aukštutinės pilies mūrai nuostolių nepatyrė.
## Reikšmingi paminėjimai
- c-001
  santrauka: '1396 m. Vilniuje Manvydas minėtas kaip Vilniaus vaivada tarp dokumento liudytojų.'
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Actum et datum in Wilno, ipšo die pu­
    rificationis Mariae Virginis gloriosae.
    A. D . 1396. Presentibus nobilibus ac
    Strenuis viris D-nis Minigalone Gas-
    toldo Monividone Palatino Viln. nec
    non Czupurua et Milone Marschalcis
    curiae nostrae, et aliis quam pluribus
    fide dignis [šviesiausiojo valdovo ku­
    nigaikščio Lenkijos karaliaus Vla­
    dislovo, mūsų mylimiausio brolio,
    pavedimu ir sutikimu duodame de­
    šimtinę nuo ariamos žemės mūsų
    Cudzeniškių kaimo, esančio ties Me­
    dininkais, ir kasmet vieną medaus
    saiką, kuris vadinamas medaus
    duokle, iš mūsų dvaro ir mūsų kai­
    mus su žmonėmis - Corzen, Hono-
    bičiai ir Volča, esančius Choreckovo
    valsčiuje, paskiriame ir 1.1. Aktuota
    ir duota Vilniuje, Švč. Mergelės Ma­
    rijos Apsivalymo dienoje, Viešp. me­
    tais 1396. Dalyvaujant garbingiems
    ir narsiems vyrams Mingailai, Goš­
    tautui; Vilniaus vaivadai Manvydui
    bei mūsų dvaro maršalkoms Čupur-
    vai ir Milonui bei daugeliui kitų, ver­
    tų pasitikėjimo].
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
- c-002
  santrauka: 'Manvydas buvo vienas garsiausių Lietuvos didikų, kurio didžiuliai rūmai stovėjo Vilniuje pilies kalno pietų pusėje, tarp kalno ir Vilnelės.'
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Iš žalio slėnio gilumos, ant paskutiniojo iš kal­
    nų, supančių Vilnelės upės vagą, ir ten, kur ji įteka į Viliją,
    buvo iškilusi mūro tvirtovė, galingojo Gedimino pastatydin­
    ta, saugoma aukštų sienų ir trijų bokštų. O pilies kalno pietų
    pusėje, tarp jo ir Vilnelės upės, stovėjo didžiuliai vieno gar­
    siausių Lietuvos didikų Manvydo rūmai, o kalno papėdėje,
    palei Viliją, driekėsi Žemutinė pilis, vadinta Kreivąja. Reikš­
    mingiausia jos dalis buvo šventasis Šventaragio slėnis,' rėpian­
    tis pleištu įsiterpusią lanką tarp Vilijos ir Vilnelės, nuo senų
    senovės apaugęs ąžuolais; ten degė amžinoji ugnis - Gabija,
    didžiai garbinama lietuvių.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-003
  santrauka: 'Trakų vaivada Manvydas įspėjo Švitrigailą, todėl šis, lydimas kelių totorių vadų, išsigelbėjo pabėgdamas.'
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Švitrigailos dvaras stovėjo
    kaip tik toje vietoje, kur ir dabarti­
    nis dvaras.
    —  • —
    215

    ## Puslapis 232

    VILNIAUS MIESTO ISTORIJA// TOMAS
    priekyje skubiai ir slapčiomis nužygiavęs į Ašmeną, apie
    rugpjūčio 28-ą įžūliai įsiveržė į Švitrigailos dvarą15, bet ten
    jo jau nerado, nes šis, ką tik įspėtas Trakų vaivados Manvy-
    do, lydimas kelių totorių vadų, išsigelbėjo pabėgdamas. Žy­
    gimantas tučtuojau užėmė Vilnių ir Trakus16, taigi Vilnius
    dėl šių staigių permainų ir abipusių karinių gaudynių, atro­
    do, bus vėl patyręs nesėkmių.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003
- c-004
  santrauka: 'Trakų vaivada Manvydas buvo sučiuptas ir Žygimanto įsakymu nukirsdintas.'
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Savo ruožtu, Žygimantas, toks pat žiaurus ir nesantū­
    rus, tenkindamas savo kerštą, kai jam buvo išduoti pas ka­
    ralių Vladislovą Jogailą vykstantys Švitrigailos pasiuntiniai,
    atkeršijo įsakydamas juos pa valkioti gatvėmis, o paskui pa­
    skandinti. O Manvydas, Trakų vaivada, buvo sučiuptas ir,
    Žygimanto įsakymu, nukirsdintas20. Vėl įsiliepsnojo kelerius
    metus trukęs karas tarp rusų, vadovaujamų Švitrigailos, ir
    Lietuvos, valdomos Žygimanto.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-005
- c-005
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Vytautas, sutelkęs Smo­
    lenske pulkus, apsupo tą miestą ir po keturias savaites
    užsitęsusio puolimo užėmė Vitebską, o Švitrigailą paėmė į
    nelaisvę. Kitais metais jis buvo išvaduotas dviejų jam palan­
    kių kunigaikščių ir vėl patraukė į mūšio lauką56.1396-ieji me­
    tai Vilniui atmintini dar ir dėl pilies kalno smarkios griūties
    bei alpių karščių. Šlaito nuošliaužos užslinko ant vaivados
    Manvydo rūmų, stovėjusių pakalnėje, užgriuvo jo tarnus ir
    turtus.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-004
- c-006
  santrauka: 'Manvydas susitarė su Goštautu ir Astiku paskelbti valdovu karalių Vladislovą pagal senąjį susitarimą su lenkais.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Nugalėjo vis dėlto tie, kurie stojo už ryšius su Jogailos
    gimine ir sąjungą su lenkais. Manvydas susitarė su
    Goštautu bei Astiku, laikantis senojo susitarimo su len­
    kais, paskelbti valdovu patį karalių Vladislovą. Kiti
    manė, kad karaliaus išrinkimas didžiuoju kunigaikščiu
    gali atnešti daugiau žalos nei naudos, nes, neseniai pa­
    keltas į Vengrijos karaliaus sostą ir atskirtas nuo Lietu­
    vos tokių didelių nuotolių, negalėsiąs laiku nei žinios
    apie pavojų gauti, nei ką padėti, todėl griežtai prieši­
    nosi karaliaus kandidatūrai.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-006
- c-007
  santrauka: 'Narbutas Manvydą laiko Gedimino ir Vidos sūnumi, gimusiu 1276 metais, o jo vardą aiškina kaip „Vidos pasaulis“.'
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
  citata_originali: |
    Gediminas taip pat turėjo tris žmonas: Vidą, Olgą ir
    Jaunę, o su jomis -  septynis sūnus3. Vida buvo švedų kilmės
    bartininko Vidmanto iš Kuršo duktė. Iš jos sūnūs: Manvydas
    (Montwid, tai reiškia: Vidos pasaulis) gimė 1276 metais ir Na­
    rimantas (Narimund, tai reiškia: Pasaulio pabaiga, nes Vida
    mirė tuoj po jo gimimo) -  1277 metais.
  citata_rodoma: ""
  teiginio_tipas: faktas
  patikimumo_lygis: aukstas
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: ""
  pagrindžia:
    - t-007

## Ryšiai
- [[objektai/vietos/Manvydo rūmai]] priklause Manvydas
- Manvydas buvo_sajungininkas_su [[objektai/asmenys/Astikas]]
- [[objektai/asmenys/Astikas]] sudare_sutarti_su Manvydas
- Manvydas buvo_sunus [[objektai/asmenys/Gediminas|Gediminas (Lietuvos didysis kunigaikštis, XIV a.)]]
- [[objektai/daiktai/Manvydo rūmai ir Aukštutinės pilies mūrai]] priklause Manvydas
- Manvydas gyveno [[objektai/vietos/Vilnius]]
