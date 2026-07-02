---
tipas: grupe
pavadinimas: 'Krivičiai'
saltiniai:
  - 'Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)'
  - 'Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - grupe
  - krikštas
---
# Krivičiai

## Santrauka

Artimiausieji rytų kaimynai dregovičiai (Beržūnės baseine) ir krivičiai (Dniepro ir Dauguvos aukštupiuose), nors Kijevo Rusia 988 m. priėmė Bizantijos krikštą, gyveno dar gana žemame kultūros laipsnyje.

## Teiginiai
<a id="claim-t-31222"></a>
- t-001
  global_id: t-31222
  teiginys: 'Zenono Ivinskio vertinimu, krivičiai Dniepro ir Dauguvos aukštupiuose gyveno gana žemame kultūros laipsnyje.'
  sudarymo_pagrindimas: 'Kadangi teiginys yra vertinamojo pobūdžio, pridėta aiški šaltinio atribucija.'
  susije_objektai: 'llm_object: Dauguva; llm_object: Dniepras; mentioned_place: Dauguva; mentioned_place: Dniepras; mentioned_group: [[objektai/grupes/Dregovičiai|Dregovičiai]]; mentioned_object: [[objektai/zodynas/pagonys|pagonys]]; mentioned_place: Bizantija; mentioned_place: Europa; mentioned_place: Kijevas; mentioned_place: Rusia'
  semantiniai_rysiai: '[[objektai/grupes/Krivičiai|Krivičiai]] gyveno Dniepras; [[objektai/grupes/Krivičiai|Krivičiai]] gyveno Dauguva'
  temporaliniai_duomenys: 'gyvenimo laikotarpis: 988 m'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „gyvenimo laikotarpis“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Kadangi teiginys yra vertinamojo pobūdžio, pridėta aiški šaltinio atribucija.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d77e43fa4dde08bf9bd86388ee591fb737cb94cd9d0a7059522f983f4ea5ff7d; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: gyveno -> Dauguva: 0.86
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Krivičiai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Dauguva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Krivičių gyvenamoji erdvė tiesiogiai nurodyta Dauguvos aukštupiuose.

<a id="claim-t-188206"></a>
- t-002
  global_id: t-188206
  teiginys: 'Narbutas primena, kad Livonijos kryžiuočiai kariavo su krivičiais, o Livonijos broliai lankydavosi Karaliaučiuje.'
  pagrindžia:
    - c-002
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
  statusas: patvirtinta
  irodymo_stiprumas: 0.00
  saltinio_vieta: 757427-758001; hash=cf8b3368ec02edd693a884b5e2f812517c46206e80981bd8b7dd8de559dcefc7; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: kariavo_pries -> Krivičiai: 0.96
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Kryžiuočių ordinas: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Krivičiai: llm_allowed_candidate, group
  ryšio_paaiskinimas: Citatoje tiesiogiai nurodyta, kad Livonijos kryžiuočiai kariavo su krivičiais.
<a id="claim-t-188207"></a>
- t-003
  global_id: t-188207
  teiginys: 'Narbutas spėja, kad krivičių pavadinimas galėjo sietis su kriviais ir bendrais religiniais papročiais su lietuvių gentimis.'
  pagrindžia:
    - c-003
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
  statusas: patvirtinta
  irodymo_stiprumas: 0.00
  saltinio_vieta: 775467-776070; hash=374bd074ae46d538d6dfa64ea5f68c45250ad2f7b90c4e48c261758275d20f61; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Baltija: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Krivičiai: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Baltija: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Krivičiai" parinktas kaip owner_note_path. Targetas "Baltija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
- susijęs iš [[objektai/autoriai/Zinkevičius Z.md#claim-t-60829|Zinkevičius Z]]: Z. Zinkevičiaus darbas nurodytas aiškinant Naugarduko žemės vadinimą Krivičių žeme.
- susijęs iš Z. Zinkevičius, Lietuvių kalbos kilmė: Z. Zinkevičiaus „Lietuvių kalbos kilmė“ nurodoma prie paaiškinimo, kad Dusburgietis Krivičių žeme vadino Naugarduko žemę Nemuno aukštupyje.
- susijęs iš Gardino žemė: Gardino žemė su artimiausiomis pilimis buvo pradinis Mindaugo laimikis užimant Lietuvai artimiausias krivičių sritis.
- susijęs iš Krivičių žemė: Petras Dusburgietis Krivičių žeme vadina Naugarduko žemę Nemuno aukštupyje.
- susijęs iš Krivičių žemė: 1314 m. rugsėjį maršalas Henrikas su kariuomene patraukė į Krivičių žemę ir užėmė Naugarduką.
- susijęs iš [[objektai/grupes/Dregovičiai.md#claim-t-31176|Dregovičiai]]: Dregovičiai Beržūnės baseine, nors Kijevo Rusia 988 m. priėmė Bizantijos krikštą, gyveno gana žemame kultūros laipsnyje.
- susijęs iš [[objektai/grupes/Kryžiuočių ordinas.md#claim-t-178917|Kryžiuočių ordinas]]: Medininkų žemėje buvo sudaryta vieninga gynybos prieš Kryžiuočių ordino agresiją sistema, kurios centras veikiausiai buvo Medvėgalis.
- susijęs iš [[objektai/grupes/Lietuviai.md#claim-t-179219|Lietuviai]]: XIII-XIV a. rašytiniai šaltiniai ir karai su ordino riteriais rodo, kad pagonys lietuviai buvo pasiekę palyginti aukštą kultūros lygį.
- susijęs iš [[objektai/grupes/Lietuviai.md#claim-t-179292|Lietuviai]]: XI a. rusų metraščiai tik du kartus paminėjo lietuvių ir Kijevo rusų karinius konfliktus, jei 1040 ir 1044 m. Jaroslavo žygiai nebuvo viena ekspedicija.
- susijęs iš [[objektai/ivykiai/Kijevo Jaroslavo žygis į Lietuvą ir Naugarduko įkūrimas (1044 m.).md#claim-t-05299|Kijevo Jaroslavo žygis į Lietuvą ir Naugarduko įkūrimas (1044 m.)]]: XI a. rusų metraščiai mini tik du lietuvių ir Kijevo rusų karinius konfliktus, jei 1040 ir 1044 m. Jaroslavo žygiai nebuvo viena ekspedicija.
- susijęs iš Łowmiański H., Studja: Łowmiańskio veikalas nurodomas prie nuomonės, kad Medininkų žemė susiformavo XIV a. sujungus centrinius Žemaitijos valsčius.
- susijęs iš Гуревич Ф. Д. Древности белорусского Понеманья: Tūkstantmečio 2-oje pusėje (Гуревич Ф.
- susijęs iš Aukaimis: Narbutas rašo, kad Aukaimio kaime slapstėsi vyriausiasis žynys Gintautas, miręs 1414 m. liepos 28 d., ir su juo baigėsi lietuvių stabmeldystė.
- susijęs iš Baltijos jūra: Narbutas teigė, kad Krivių Krivaičio valdžia anksčiau apėmė žemes nuo Vyslos iki Dauguvos ir nuo Baltijos jūros į Rusios gilumą.
- susijęs iš Dauguva: Narbutas Krivių Krivaičio valdžią vaizdavo kaip kadaise apėmusią žemes nuo Vyslos iki Dauguvos ir nuo Baltijos jūros į Rusios gilumą.
- susijęs iš Medininkų valsčius: Medininkai centrinėje Žemaitijoje Dusburgiečio vadinti valsčiumi, nors XIV a. pabaigos duomenys rodo ten buvus žemę iš kelių valsčių.
- susijęs iš Naugardukas: 1314 m. rugsėjį brolis Henrikas su kariuomene įžengė į Krivičių žemę ir užėmė Naugarduko miestą.
- susijęs iš Prūsija: Dusburgiečio kronikoje pabrėžiama, kad Ordino broliai apvalė „šventąją Prūsijos žemę“ nuo stabmeldystės.
- susijęs iš Prūsija: Narbutas ginkluoto atvertimo eigą sieja su tikėjimo smukimu ir vardija ją nuo Livonijos iki Prūsijos, Lietuvos ir Žemaitijos.
## Reikšmingi paminėjimai
- c-001
  santrauka: 'Zenono Ivinskio vertinimu, krivičiai Dniepro ir Dauguvos aukštupiuose gyveno gana žemame kultūros laipsnyje.'
  šaltinis: Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)
  citata_originali: |
    mezleva, roitinik, sviren, veldomy ir daug kitų), bet ir šnekamajai
    gudų kalbai. Artimiausieji rytų kaimynai dregovičiai (Beržūnės
    baseine) ir krivičiai (Dniepro ir Dauguvos aukštupiuose), nors
    Kijevo Rusia 988 m. priėmė Bizantijos krikštą, gyveno dar gana
    žemame kultūros laipsnyje. Tuo tarpu pagonys lietuviai, kaip
    patvirtina rašytieji šaltiniai (XIII-XIV amž.) ir nepaliaujamų karų
    eiga su Vakarų Europos civilizacijos atstovais — ordino riteriais,
    buvo pasiekę, palyginti, aukštą kultūros laipsnį.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-002
  santrauka: 'Narbutas primena, kad Livonijos kryžiuočiai kariavo su krivičiais, o Livonijos broliai lankydavosi Karaliaučiuje.'
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
  citata_originali: |
    Kaip mums rodo vietos tyrimai, Stenderis lat­
    vių gramatikoje šiuo klausimu šiek tiek suklydo.
    0 Betgi Livonijos kryžiuočiai patys kariavo su krivičiais; Livoni­
    jos broliai lankydavosi Karaliaučiuje, kuriame Dusburgietis rašė kro­
    niką; argi nebūtų apšvietę to, kuris taip uoliai tyrė visa, kas susiję su
    istorija?
    420

    ## Puslapis 420

    Toliau būtų galima pasakyti: Dusburgiečio žinia apie krivį
    todėl darosi labai įtartina, kad, pasak jo, vyriausiojo žynio val­
    džia apėmė ne tik Prūsiją, bet ir Lietuvą bei Latviją, nors tų
    kraštų istorijos šaltiniai to visiškai nežino7.
  citata_rodoma: ""
  teiginio_tipas: faktas
  patikimumo_lygis: aukstas
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: ""
  pagrindžia:
    - t-002
- c-003
  santrauka: 'Narbutas spėja, kad krivičių pavadinimas galėjo sietis su kriviais ir bendrais religiniais papročiais su lietuvių gentimis.'
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
  citata_originali: |
    Dabar pateiksime šį lietuvių mitologijos gabalėlį.
    Nuo vienuoliktojo amžiaus pabaigos ėmė smukti autori­
    tetas vyriausiojo žynio, Krivių Krivaičio, kurio valdžia anks­
    čiau apėmė visas lietuvių tautos gyvenamas žemes, tai yra nuo
    Vyslos iki Dauguvos, nuo Baltijos jūros į Rusios gilumą, kur
    slavų krivičių tauta taip pat buvusi pavaldi vyriausiajam žy­
    niui. Jeigu taip iš tikrųjų buvo, tai lengvai rasime tos tautos
    pavadinimo priežastį, kitaip sakant, kad ta tauta turėjo savo
    krivius, kaip ir lietuvių genties tautos, tai yra kad laikėsi religi­
    nių apeigų papročių, vienodų su jų lietuvių apeigomis.
  citata_rodoma: ""
  teiginio_tipas: faktas
  patikimumo_lygis: aukstas
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: ""
  pagrindžia:
    - t-003

## Ryšiai
- [[objektai/grupes/Kryžiuočių ordinas]] kariavo_pries Krivičiai
- Krivičiai gyveno [[objektai/vietos/Naugardukas]]
- Krivičiai gyveno [[objektai/vietos/Dauguva]]
- Krivičiai gyveno [[objektai/vietos/Dniepras]]
