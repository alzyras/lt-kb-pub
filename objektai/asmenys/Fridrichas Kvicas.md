---
tipas: asmuo
pavadinimas: 'Fridrichas Kvicas'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
datos:
  - '1252 m.'
  - '1323 m.'
date_start: '1252'
date_end: '1323'
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - krikštas
  - miestas
  - ordinas
amziai:
  - 'XIII'
  - 'XIV'
periodo_grupes:
  - 'LDK'
---
# Fridrichas Kvicas

## Santrauka

Dusburgietis teigia, kad apie Bisenės pilies sudeginimą 1316 metais Tais pačiais metais, švento Ambraziejaus dieną (balandžo 4), brolis Ditrichas iš Altenburgo, brolis Fridrichas Kvicas ir dar vienas brolis patraukė su trimis Ragainės ginklanešiais link Bisenės pilies irgi tuo laiku. Dusburgietis teigia, kad apie Gedimino pilies papilio sudeginimą ir kitką 1317 metais Tų pačių metų vasarą, apie šventą Joną Krikštytoją (birželio 24), tas pats maršalas su broliais ir Sembos vyrais nužygiavo link Pagraudės valsčiaus ir padalijo savo kariuomenę į keturias dalis. Dusburgietis teigia, kad juos persekioti leidosi su būreliu karių brolis Ulrichas iš Drinlevės, Tepliavos komtūras, ir brolis Fridrichas Kvicas, jo padėjėjas; iš pradžių išardę tiltą, kuriuo lietuviai turėjo pereiti, jie nukovė 55 jų vyrus ir atsiėmė iš jų visą grobį, kurį šie.

## Teiginiai

<a id="claim-t-59957"></a>
- t-001
  global_id: t-59957
  teiginys: '1316 m. balandžio 4 d. Fridrichas Kvicas su Ditrichu iš Altenburgo, dar vienu broliu ir trimis Ragainės ginklanešiais patraukė link Bisenės pilies.'
  sudarymo_pagrindimas: 'Pradinis teiginys yra per ilgas ir turi antraštės triukšmo.'
  susije_objektai: 'mentioned_object: [[objektai/daiktai/Ginklai|Ginklai]]; mentioned_place: Bisenė; mentioned_place: Ragainė; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; llm_object: Bisenė'
  semantiniai_rysiai: '[[objektai/asmenys/Fridrichas Kvicas|Fridrichas Kvicas]] surengė žygį į Bisenė'
  temporaliniai_duomenys: 'įvykio data: 1316 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Pradinis teiginys yra per ilgas ir turi antraštės triukšmo.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=68d31121c351a5387582d984f40ec3e415c0ebe60a8502c0931e18db784947fb; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: surenge_zygi_i -> Bisenė: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Fridrichas Kvicas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Bisenė: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo Fridricho Kvico žygį link Bisenės pilies.

<a id="claim-t-59958"></a>
- t-002
  global_id: t-59958
  teiginys: '1319 m. Ulrichas iš Drinlevės ir Fridrichas Kvicas persekiojo Dovydo iš Gardino vyrus, nukovė 55 lietuvius ir atsiėmė jų grobį.'
  sudarymo_pagrindimas: 'Pradinis teiginys nutrūksta ir turi neaiškių įvardžių.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_place: Gardinas; mentioned_object: [[objektai/daiktai/Namas|Namas]]; mentioned_person: [[objektai/asmenys/Ulrichas iš Drinlevės|Ulrichas iš Drinlevės]]; mentioned_place: Prūsija; mentioned_place: Tepliava; llm_object: [[objektai/grupes/Lietuviai|Lietuviai]]'
  semantiniai_rysiai: '[[objektai/asmenys/Fridrichas Kvicas|Fridrichas Kvicas]] kariavo prieš [[objektai/grupes/Lietuviai|Lietuviai]]'
  temporaliniai_duomenys: 'įvykio data: 1319 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Pradinis teiginys nutrūksta ir turi neaiškių įvardžių.'
  pagrindžia:
    - c-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=45088ca7186321129bfa4c3c70dce2615336e85535ca4ced53319cac3720676c; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Pagraudė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Fridrichas Kvicas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Pagraudė: mention_match, place, gap=44
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Fridrichas Kvicas" parinktas kaip owner_note_path. Targetas "Pagraudė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-59959"></a>
- t-003
  global_id: t-59959
  teiginys: '1323 metais Vėluvos valsčiuje lietuviai nužudė brolį Fridrichą Kvicą, vadintą drąsiu ir narsiu kariu.'
  sudarymo_pagrindimas: 'Citata remia Fridricho Kvico žūtį ir apibūdinimą; pašalintas išnašų triukšmas.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_place: Nemunas; mentioned_place: Semba; mentioned_place: Vėluva; mentioned_place: Šiauliai; llm_object: Vėluva; llm_object: [[objektai/asmenys/Fridrichas Kvicas|Fridrichas Kvicas]]'
  semantiniai_rysiai: '[[objektai/grupes/Lietuviai|Lietuviai]] kariavo prieš [[objektai/asmenys/Fridrichas Kvicas|Fridrichas Kvicas]]'
  temporaliniai_duomenys: 'įvykio data: 1291 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Citata remia Fridricho Kvico žūtį ir apibūdinimą; pašalintas išnašų triukšmas.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 664016-664825; hash=646b5499244280ae33cb655ebfd9c9453690212e55968ea12d450cf427aeb79d; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: kariavo_pries -> Lietuviai: 0.78
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Fridrichas Kvicas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Lietuviai: llm_allowed_candidate, group
  ryšio_paaiskinimas: Fridrichas Kvicas kartu su Ulrichu persekiojo lietuvius ir nukovė jų vyrus.

<a id="claim-t-59960"></a>
- t-004
  global_id: t-59960
  teiginys: 'Broliai Hartmanas ir Fridrichas Kvicas su 60 vyrų turėjo užpulti Pagraudės valsčiaus kaimus, bet pasiklydo ir nieko nenuveikė.'
  sudarymo_pagrindimas: 'Teiginys yra pilnas ir tiksliai paremtas citata.'
  susije_objektai: 'mentioned_place: Pagraudė; mentioned_object: [[objektai/zodynas/maršalas|maršalas]]; mentioned_person: [[objektai/asmenys/Gediminas|Gediminas]]; mentioned_person: [[objektai/asmenys/Hartmanas|Hartmanas]]; mentioned_place: Pilėnai; mentioned_place: Ragainė; mentioned_place: Semba'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: 669831-672231; hash=d99b5f3c5ff1750a17a5f523c0bf7220c670ac827079f79d6063df1de47c460b; match=ocr_normalized_gapped
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Vėluva: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Lietuviai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Vėluva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo lietuvių veiksmus Vėluvos valsčiuje.
- susijęs iš [[objektai/asmenys/Ditrichas iš Altenburgo.md#claim-t-59950|Ditrichas iš Altenburgo]]: 1316 m. balandžio 4 d. Ditrichas iš Altenburgo su Fridrichu Kvicu ir kitais vyrais patraukė link Bisenės pilies.
- susijęs iš [[objektai/asmenys/Fridrichas iš Libencelės.md#claim-t-59955|Fridrichas iš Libencelės (vyskupas, XIV a.)]]: Fridrichas iš Libencelės, Ragainės komtūras, su 150 vyrų mėgino slapta paimti Gedimino pilį, tačiau pilėnai ją apgynė.
- susijęs iš [[objektai/asmenys/Hartmanas.md#claim-t-60299|Hartmanas]]: 1317 m. brolis Hartmanas su Fridrichu Kvicu ir 60 vyrų turėjo užpulti Pagraudės valsčiaus kaimus, bet pasiklydo ir nieko nenuveikė.
- susijęs iš [[objektai/asmenys/Ulrichas iš Drinlevės.md#claim-t-184135|Ulrichas iš Drinlevės]]: 1319 m. Ulrichas iš Drinlevės ir Fridrichas Kvicas persekiojo Dovydo karius, nukovė 55 lietuvius ir atsiėmė visą grobį.
- susijęs iš [[objektai/asmenys/Ulrichas iš Drinlevės.md#claim-t-60450|Ulrichas iš Drinlevės]]: 1319 m. Ulrichas iš Drinlevės ir Fridrichas Kvicas persekiojo Dovydo karius, nukovė 55 lietuvius ir atsiėmė visą grobį.
- susijęs iš [[objektai/grupes/Lietuviai.md#claim-t-179282|Lietuviai]]: 1316 m. prie Bisenės pilies Ordino broliai nukovė šešis lietuvių pamaininės saugos vyrus, turėjusius trauktis iš pilies.
- susijęs iš [[objektai/grupes/Lietuviai.md#claim-t-187717|Lietuviai]]: Žygimantas iš Vilniaus atžygiavo su septynių tūkstančių lietuvių pajėgomis prieš gruodžio 8 d. prasidėjusį mūšį.
- susijęs iš [[objektai/ivykiai/Bisenos sunaikinimas (1316 m.).md#claim-t-97014|Bisenos sunaikinimas (1316 m.)]]: 1316 m. balandžio 4 d. Ditrichas iš Altenburgo ir Fridrichas Kvicas, užklupę Bisenės sargybos kaitą, įėjo į tuščią pilį ir ją sudegino.
- susijęs iš [[objektai/ivykiai/Bisenės pilies sudeginimas (1316 m. balandžio 4 d.).md#claim-t-59490|Bisenės pilies sudeginimas (1316 m. balandžio 4 d.)]]: 1316 m. balandžio 4 d. Ditrichas iš Altenburgo, Fridrichas Kvicas ir jų palyda įėjo į tuščią Bisenės pilį ir ją sudegino.
- susijęs iš [[objektai/ivykiai/Pagraudės valsčiaus žygis ir Gedimino pilies papilio sudeginimas (1317 m. apie birželio 24 d.).md#claim-t-183951|Pagraudės valsčiaus žygis ir Gedimino pilies papilio sudeginimas (1317 m. apie birželio 24 d.)]]: 1317 m. apie birželio 24 d. maršalas su broliais ir Sembos vyrais žygiavo link Pagraudės valsčiaus ir padalijo kariuomenę į keturias dalis.
- susijęs iš [[objektai/ivykiai/Pagraudės valsčiaus žygis ir Gedimino pilies papilio sudeginimas (1317 m. apie birželio 24 d.).md#claim-t-56681|Pagraudės valsčiaus žygis ir Gedimino pilies papilio sudeginimas (1317 m. apie birželio 24 d.)]]: 1317 m. apie birželio 24 d. viena Ordino kariuomenės dalis nesėkmingai mėgino paimti Gedimino pilį, bet sudegino jos papilį.
- susijęs iš [[objektai/ivykiai/Pagraudės valsčiaus žygis ir Gedimino pilies papilio sudeginimas (1317 m. apie birželio 24 d.).md#claim-t-56683|Pagraudės valsčiaus žygis ir Gedimino pilies papilio sudeginimas (1317 m. apie birželio 24 d.)]]: 1317 m. apie birželio 24 d. Fridrichas iš Libencelės su 150 vyrų turėjo slapta paimti Gedimino pilį, bet pilėnai ją apgynė, o papilys sudegė.
- susijęs iš Bisenė: 1316 m. balandžio 4 d. Ditrichas iš Altenburgo, Fridrichas Kvicas ir dar vienas brolis su Ragainės ginklanešiais sudegino tuščią Bisenės pilį iki pamatų.
- susijęs iš Gedimino pilis (pilis): 1317 m. vasarą Gedimino pilies pilėnai apgynė pilį, nors Ordino broliams pavyko visiškai sudeginti papilį.
- susijęs iš Gedimino pilis (pilis): Fridrichas iš Libencelės su 150 vyrų slapta priėjo prie Gedimino pilies, bet įspėti pilėnai pilį apgynė.
- susijęs iš Pagraudė: 1317 m. vasarą apie birželio 24 d. maršalas su broliais ir Sembos vyrais nužygiavo link Pagraudės valsčiaus ir padalijo kariuomenę į keturias dalis.
- susijęs iš [[objektai/zodynas/papilys.md#claim-t-184013|papilys]]: 1317 m. Ordino broliams nepavyko paimti Gedimino pilies, tačiau jie visiškai sudegino jos papilį.
- susijęs iš [[objektai/zodynas/papilys.md#claim-t-58779|papilys]]: 1317 m. Fridrichas iš Libencelės nesėkmingai bandė paimti Gedimino pilį, tačiau Ordino broliams pavyko sudeginti jos papilį.
## Reikšmingi paminėjimai

- c-001
  santrauka: '1316 m. balandžio 4 d. Fridrichas Kvicas su Ditrichu iš Altenburgo, dar vienu broliu ir trimis Ragainės ginklanešiais patraukė link Bisenės pilies.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    329 (322). Apie Bisenės pilies sudeginimą 1316 metais

       Tais pačiais metais, švento Ambraziejaus dieną (balandžo 4), brolis Ditrichas  iš
    Altenburgo, brolis Fridrichas Kvicas  ir dar vienas brolis patraukė su trimis Ragainės
    ginklanešiais link Bisenės pilies irgi tuo laiku, kai lietuvių pamaininė sauga, išbudėjusi
    čia jiems skirtą laiką, turėjo iš pilies pasitraukti, ir nukovė šešis jų vyrus. Kiti šeši, išvydę
    du ginklanešius, kuriems buvo įsakyta saugoti kelią, pabėgo metę šalin ginklus.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-002
  santrauka: '1323 metais Vėluvos valsčiuje lietuviai nužudė brolį Fridrichą Kvicą, vadintą drąsiu ir narsiu kariu.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie brolio Fridricho Kvico žūtį bei Vėluvos valsčiaus nusiaubimą 1323 me­
                                                   tais

       Tais pačiais metais, švento Petro grandinėse išvakarėse (rugpjūčio 2), lietuviai įsibrovė
    į Sembos žemę ir Vėluvos valsčiuje sudegino šešis kaimus, be to, nužudė brolį Fridrichą,
    vadinamą Kvicu, drąsų bei narsų karį, ir 36 vyrus, o moteris ir vaikus su visokiu grobiu
      580 Klaipėdos pilis statyta — kur suteka Nemunas ir Danė (1252.VII.29 dokumentas
    — LUB, 1, Nr. 236, plg. D. III, 2; apie pirmosios ir antrosios Ordino pilies bei seniausią
    miesto vietą — Zulkus V., Klaipėdos..., p. 28—29). Kronikininkas prie Klaipėdos mini tris
    gretimas naujakrikščių pilis (D.— castra neophitorum, Jer.— vlîhûsir drî).
       XIII a. dokumentuose (1253, 1258, 1291 m.) prie Klaipėdos minimos pilys, pilių
    apygardos: Mutina, Poys, Ackete, Sarden (LUB, 1, Nr. 249, 253, 329, 540). Žardės pilis
    lokalizuojama pietiniame Klaipėdos pakraštyje, prie Smeltalės upelio, kur yra Žardės
    piliakalnis (Bielenstein A., Die Grenzen..., p. 252; SZM. p. 184; LAA, 2, Nr. 846). Ackete
    — Eketės piliakalnyje Danės ir Eketės santakoje (Bielenstein A., Die Grenzen..., p. 252;
    SZM, p. 183; LAA, 2, Nr. 174).
      Mutina lokalizuojama prie Tauralaukio (Sembritzki J., Geschichte..., p. 5; SZM, p.
    183—184); čia ryškesnių piliakalnio pėdsakų nebėra (plg. LAA, 2, p. 167); atkreiptinas
    dėmesys  į aikštelę Danės kair. krante tarp dviejų griovų (senosios kapinės), netoli
    mitologinio „velnio akmens” (plg. Remeika J., Kai dar amžina ugnis.., p. 137).
      Poys tapatinama su buv. Pöszen arba  Šiauliais Danės žemupio  kair. krante  ir
    lokalizuojama į rytus nuo Klaipėdos (Bielenstein A., Die Grenzen..., p. 253; Sembritzki
    J., Geschichte..., p. 5; HGAPW, 2; netoliese, Kalniškiuose, būta pylimo — Remeika J.,
    Ką kalneliai pasakoja, p. 84, 86; LAA, 2, p. 78). Ieškoma jos ir į šiaurę nuo Klaipėdos,
    žemiau Eketės (SZM, p. 184). Šiame plote prie dab. Klaipėdos miesto šiaurės rytų ribos,
    deš. Danės krante, yra Purmalių piliakalnis (LAA, 2, Nr. 615), kurį, atrodo, galima būtų
    sieti su minėta pilimi.
      Archeologiniai tyrinėjimai Eketės piliakalnyje (LAA, 2, Nr. 174), prie Žardės Laistuose
    (Žulkus V., Laistų gyvenvietės..., p. 41—43) rodo, kad rašytiniuose šaltiniuose minimų
    Eketės, Žardės ir greičiausiai kitų pilių bei gyvenviečių pradžia siekia žymiai ankstesnį,
    ikikryžiuotišką laikotarpį.

    išsivarė su savimi.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003
- c-003
  santrauka: 'Broliai Hartmanas ir Fridrichas Kvicas su 60 vyrų turėjo užpulti Pagraudės valsčiaus kaimus, bet pasiklydo ir nieko nenuveikė.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    332 (325). Apie Gedimino pilies papilio sudeginimą ir kitką 1317 metais

      Tų pačių metų vasarą, apie šventą Joną Krikštytoją (birželio 24), tas pats maršalas su
    broliais ir Sembos vyrais nužygiavo link Pagraudės valsčiaus ir padalijo savo kariuomenę
    į keturias dalis; brolis Hartmanas ir brolis Fridrichas Kvicas su 60 vyrų turėjo užpulti
    kai kuriuos šio valsčiaus kaimus, bet žygiuodami pasiklydo ir nieko nenuveikė. Antra
    kariuomenės dalis, būtent brolis Fridrichas iš Libencelės, Ragainės komtūras, turėjo su 150
    vyrų prieiti slapta prie Gedimino pilies ir ją paimti, tačiau pilėnai — nežinia, kuriuo būdu
    apie tai iš anksto įspėti,— pilį apgynė, nors papilį broliams ir pavyko visiškai sudeginti.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-004
- c-004
  santrauka: 'Dusburgietis teigia, kad juos persekioti leidosi su būreliu karių brolis Ulrichas iš Drinlevės, Tepliavos komtūras, ir brolis Fridrichas Kvicas, jo padėjėjas; iš pradžių išardę tiltą, kuriuo lietuviai turėjo pereiti, jie nukovė 55 jų vyrus ir atsiėmė iš jų visą grobį, kurį šie.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie 55 lietuvių žūtį 1319 metais

       Tais pačiais metais, kai dykrose smarkiai ištvino vandenys, Dovydas, Gardino pilininkas,
    su aštuoniais šimtais vyrų patraukė  į karą  ir, išdėstęs savo karius pasalose, pats su
    80 vyrų įsibrovė  į Prūsijos žemės valsčių, vardu Unzatrapis, iš kur, sudeginęs keletą
    namų, išsivarė daug nelaisvėn paimtų žmonių  ir išsigabeno galybę pagrobtų daiktų.
    Juos persekioti leidosi su būreliu karių brolis Ulrichas iš Drinlevės, Tepliavos komtūras,
    ir brolis Fridrichas Kvicas, jo padėjėjas; iš pradžių išardę tiltą, kuriuo lietuviai turėjo
    pereiti, jie nukovė 55 jų vyrus ir atsiėmė iš jų visą grobį, kurį šie gabenosi. Kiti bėgdami
    pakliuvo į jų pasalas, ir visi, apimti baimės, iš karto pasitraukė, tačiau kelyje patyrė tiek
    pavojų, kad retas kuris namo sugrįžo sveikas ir gyvas.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-005
    - t-002

## Ryšiai
- Fridrichas Kvicas surenge_zygi_i [[objektai/vietos/Bisenė]]
- Fridrichas Kvicas kariavo_pries [[objektai/grupes/Lietuviai]]
- Fridrichas Kvicas uzeme [[objektai/vietos/Bisenė]]
- Fridrichas Kvicas puole [[objektai/vietos/Bisenė]]
- [[objektai/grupes/Lietuviai]] kariavo_pries Fridrichas Kvicas
- Fridrichas Kvicas puole [[objektai/grupes/Lietuviai]]
- Fridrichas Kvicas puole [[objektai/vietos/Pagraudė]]
