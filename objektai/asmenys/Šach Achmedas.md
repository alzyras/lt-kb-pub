---
tipas: asmuo
pavadinimas: 'Šach Achmedas'
saltiniai:
  - 'Michał Baliński, Vilniaus miesto istorija (2007 m.)'
datos:
  - '1501 m.'
  - '1505 m.'
date_start: '1501'
date_end: '1505'
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - karalius
  - miestas
  - pilis
amziai:
  - 'XVI'
periodo_grupes:
  - 'LDK'
---
# Šach Achmedas

## Santrauka

Veltui Šach Achmedas, Perekopo ordos chanas, ir atkaklus Mendli Girėjaus priešas, savo pajėgomis rėmė lietuvius, - Aleksandro veiksmams stigo ryžto ir, nors buvo išrinktas Lenkijos karaliumi (1501 metais), jis vis dėlto negebėjo pa­ naudoti savo galios ir. Šach Achmedas baigė sa­ vo dienas kalėjime toje pačioje Lietuvoje. Su­ gautas ir Vilniuje pasodintas į kalėjimą Šach Achmedas pri­ darė nemažai rūpesčių karaliui ir seimui.

## Teiginiai

<a id="claim-t-87415"></a>
- t-001
  global_id: t-87415
  teiginys: 'Šach Achmedas baigė gyvenimą kalėjime Lietuvoje.'
  sudarymo_pagrindimas: 'Citata tiesiogiai palaiko teiginį apie Šach Achmedo mirtį kalėjime Lietuvoje.'
  susije_objektai: 'llm_object: Lietuva; mentioned_place: Lietuva; mentioned_group: [[objektai/grupes/Rusai|Rusai]]; mentioned_group: [[objektai/grupes/Vokiečiai|Vokiečiai]]; mentioned_person: [[objektai/asmenys/Elena|Elena]]; mentioned_person: [[objektai/asmenys/Tomas (Hertvigo iš Pokarvių sūnus)|Tomas (Hertvigo iš Pokarvių sūnus)]]; mentioned_place: Maskva; mentioned_place: Vilnius'
  semantiniai_rysiai: '[[objektai/asmenys/Šach Achmedas|Šach Achmedas]] mirė Lietuva'
  pagrindžia:
    - c-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: 469008-469649; hash=d7731ba047a3aa652378a5d9e51155b12538975506fa050c9b8bd200d952d170; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: reme -> Lietuviai: 0.92
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Šach Achmedas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Lietuviai: llm_allowed_candidate, group
  ryšio_paaiskinimas: Claim ir citata tiesiogiai sako, kad Šach Achmedas rėmė lietuvius.

<a id="claim-t-87416"></a>
- t-002
  global_id: t-87416
  teiginys: 'Sugautas ir Vilniuje įkalintas Šach Achmedas kėlė rūpesčių karaliui ir seimui.'
  sudarymo_pagrindimas: 'Citata palaiko faktą, bet reikia pašalinti OCR triukšmą.'
  susije_objektai: 'mentioned_place: Brasta; mentioned_place: Maskva; mentioned_place: Vilnius'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: 469432-470549; hash=3c08cf5d2878642b7984b2e7a4f45f8b10647713b165fb21af330ca6bc97423d; match=ocr_normalized_gapped
  sprendimo_priezastis: auto
  ryšio_patikimumas: mire -> Lietuva: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Šach Achmedas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Lietuva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad Šach Achmedas gyvenimą baigė kalėjime Lietuvoje.

<a id="claim-t-87417"></a>
- t-003
  global_id: t-87417
  teiginys: 'Šach Achmedas su savo palyda klajojo palapinėse aplink Vilnių, kol karalius tvarkė totorių reikalus.'
  sudarymo_pagrindimas: 'Citata palaiko aiškų faktą apie asmenį.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Totoriai|Totoriai]]; mentioned_place: Vilnius; mentioned_object: [[objektai/posakiai/Iki gyvos galvos|Iki gyvos galvos]]; mentioned_place: Kaunas; mentioned_place: Krymas; mentioned_place: Liublinas; llm_object: Kaunas; llm_object: Vilnius'
  semantiniai_rysiai: '[[objektai/asmenys/Šach Achmedas|Šach Achmedas]] gyveno Kaunas; [[objektai/asmenys/Šach Achmedas|Šach Achmedas]] keliavo į Vilnius'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 470681-471037; hash=89acc7b3355ee8381a008dd08860e26661b138a91221a45634fae57be6faae47; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Brasta: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Šach Achmedas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Brasta: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Šach Achmedas" parinktas kaip owner_note_path. Targetas "Brasta" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-87418"></a>
- t-004
  global_id: t-87418
  teiginys: 'Šach Achmedas, Perekopo ordos chanas ir Mendli Girėjaus priešas, savo pajėgomis rėmė lietuvius.'
  sudarymo_pagrindimas: 'Teiginys tiksliai perteikia citatoje nurodytą Šach Achmedo vaidmenį.'
  susije_objektai: 'llm_object: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_object: [[objektai/zodynas/chanas|chanas]]; mentioned_place: Perekopas; mentioned_group: [[objektai/grupes/Totoriai|Totoriai]]; mentioned_person: [[objektai/asmenys/Vasiljevičius (Maskvos valdovas)|Vasiljevičius (Maskvos valdovas)]]; mentioned_place: Krymas; mentioned_place: Lenkija; mentioned_place: Maskva; mentioned_place: Vilnius'
  semantiniai_rysiai: '[[objektai/asmenys/Šach Achmedas|Šach Achmedas]] rėmė [[objektai/grupes/Lietuviai|Lietuviai]]'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 472545-472968; hash=961da7a46edb59f8a407cf1d2301b49e85ccd3ef87a892740fbc9aa523a181f1; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: gyveno -> Kaunas: 0.72
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Šach Achmedas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Kaunas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad Šach Achmedas buvo įkalintas Kauno kalėjime; tai yra priverstinė buvimo vieta.
- susijęs iš [[objektai/asmenys/Mendli Girėjus.md#claim-t-87443|Mendli Girėjus]]: Aleksandras siekė suimti ir įbauginti Mendli Girėjų, todėl Šach Achmedas buvo iki gyvos galvos įkalintas Kaune.
- susijęs iš [[objektai/daiktai/Šach Achmedo palapinės prie Vilniaus.md#claim-t-87104|Šach Achmedo palapinės prie Vilniaus]]: Šach Achmedas su palyda palapinėse klajojo aplink Vilnių, o Krymo ir Nogajaus ordų pasiuntiniai laukė karaliaus už miesto sienų.
- susijęs iš [[objektai/grupes/Perekopo orda.md#claim-t-86767|Perekopo orda]]: Perekopo ordos chanas Šach Achmedas savo pajėgomis rėmė lietuvius prieš Mendli Girėjų.
- susijęs iš [[objektai/asmenys/Aleksandras Balinskis.md#claim-t-54931|Aleksandras Balinskis]]: Aleksandras Balinskis buvo iš Krokuvos pakviestas alchemikas, kurio gydymas nepadėjo sergančiam Aleksandrui Jogailaičiui.
- susijęs iš [[objektai/asmenys/Aleksandras Jogailaitis.md#claim-t-54940|Aleksandras Jogailaitis]]: Aleksandrą Vilniuje kamavo sunki liga ir paralyžius, o gydyti buvo pakviestas Balinskis iš Krokuvos.
- susijęs iš Brasta: 1505 m. Šach Achmedas buvo atgabentas iš Vilniaus į seimą Brastoje, o vėliau pasiųstas gyventi į Trakus.
- susijęs iš Kaunas: Šach Achmedas buvo iki gyvos galvos įkalintas Kauno kalėjime.
- susijęs iš Kaunas: Šach Achmedas buvo iki gyvos galvos įkalintas Kauno kalėjime.
- susijęs iš Lietuva: Aleksandro planai žlugo, nes totoriai netrukus su didelėmis pajėgomis įsiveržė į Lietuvą.
- susijęs iš Lietuva: Aleksandras pasiuntė į Maskvą pasiuntinius parvežti didžiosios kunigaikštytės Elenos į Lietuvą.
- susijęs iš Trakai: 1505 m. Šach Achmedas buvo atgabentas iš Vilniaus į seimą Brastoje, o paskui pasiųstas gyventi į Trakus.
## Reikšmingi paminėjimai

- c-001
  santrauka: 'Šach Achmedas, Perekopo ordos chanas ir Mendli Girėjaus priešas, savo pajėgomis rėmė lietuvius.'
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Krymo totorių
    orda, Ivano Vasiljevičiaus pakurstyta, ėmė puldinėti žemes,
    paklūstančias Aleksandro skeptrui, ir kilo grėsmė Kijevui.
    Veltui Šach Achmedas, Perekopo ordos chanas, ir atkaklus
    Mendli Girėjaus priešas, savo pajėgomis rėmė lietuvius, -
    Aleksandro veiksmams stigo ryžto ir, nors buvo išrinktas
    Lenkijos karaliumi (1501 metais), jis vis dėlto negebėjo pa­
    naudoti savo galios ir susidoroti su savo priešais. Šach Ach­
    medas, apleistas sąjungininko, Mendli Girėjaus sumuštas,
    43
    Žinome, kad Maskvoje iki šiol dar
    išlikęs priežodis: Kto w Wilnie nie by­
    wał, tot czudes nie widał [Kas Vilniuje
    nebuvo, tas stebuklų neregėjo].
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-004

- c-002
  santrauka: 'Šach Achmedas su savo palyda klajojo palapinėse aplink Vilnių, kol karalius tvarkė totorių reikalus.'
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Po tokių sostinės apsaugos priemonių karalius, į Vilnių
    atvykęs iš Liublino seimo, ėmėsi reikalų su totoriais. Aplink
    miestą su savo palyda palapinėse klajojo Šach Achmedas, o
    Krymo ir Nogajaus ordos pasiuntiniai už Vilniaus sienų lū­
    kuriavo karaliaus45. Kad įtiktų apgailėtinai politikai ir kad
    būtų suimtas bei įbaugintas Mendli Girėjus, nelaimingasis
    Šach Achmedas buvo iki gyvos galvos įkalintas Kauno ka­
    lėjime.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: 472545-472968; hash=961da7a46edb59f8a407cf1d2301b49e85ccd3ef87a892740fbc9aa523a181f1; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: gyveno -> Kaunas: 0.72
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Šach Achmedas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Kaunas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad Šach Achmedas buvo įkalintas Kauno kalėjime; tai yra priverstinė buvimo vieta.
    - t-003

- c-003
  santrauka: 'Sugautas ir Vilniuje įkalintas Šach Achmedas kėlė rūpesčių karaliui ir seimui.'
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Su­
    gautas ir Vilniuje pasodintas į kalėjimą Šach Achmedas pri­
    darė nemažai rūpesčių karaliui ir seimui. Jis buvo atgaben­
    tas iš Vilniaus į seimą Brastoje 1505 metais, po to pasiųstas
    gyventi į Trakus. Jo reikalu ne kartą į Vilnių buvo atvažia­
    vę Nogajaus ordos pasiuntiniai ir Maskvos bojarinai, ir Vil­
    niaus pilyje tuomet kildavęs didelis sujudimas.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: 470681-471037; hash=89acc7b3355ee8381a008dd08860e26661b138a91221a45634fae57be6faae47; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Brasta: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Šach Achmedas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Brasta: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Šach Achmedas" parinktas kaip owner_note_path. Targetas "Brasta" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-002

- c-004
  santrauka: 'Šach Achmedas baigė gyvenimą kalėjime Lietuvoje.'
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Šach Ach­
    medas, apleistas sąjungininko, Mendli Girėjaus sumuštas,
    43
    Žinome, kad Maskvoje iki šiol dar
    išlikęs priežodis: Kto w Wilnie nie by­
    wał, tot czudes nie widał [Kas Vilniuje
    nebuvo, tas stebuklų neregėjo]. At­
    rodo, kad šią nuomonę išplatino tie,
    kurie didžiąją kunigaikštytę Eleną
    atlydėjo į Vilnių ir buvo sužavėti
    nuostabaus priėmimo.
    44
    Svečių namams skirta privilegija yra:
    D u b i ń s k i, 1.18. Ją skaitant atro­
    do, kad Aleksandras, leisdamas sta­
    tyti tokius namus, turėjo omenyje ne
    tik miesto ir muito pelną, bet ir iš­
    orinį saugumą. Mat rašo, jog svečiai,
    tai yra, rusų pirkliai, atvykstantys su
    savo prekėmis į Vilnių, apsistoja
    įvairiuose namuose mieste, kur no­
    ri, be jokio prisistatymo, o paskui,
    prekiaudami su vokiečiais ir kitais
    svetimšaliais pirkliais, niekam ne­
    pranešę, išvažiuoja iš miesto; ir kad
    tarp jų gali būti nepatikimų ir no­
    rinčių pakenkti, todėl įsako ir leidžia
    miestui statyti užeigą ir t t.
    231

    ## Puslapis 248

    VILNIAUS MIESTO ISTORIJA II TOMAS
    norėjo išduoti Lietuvą, bet ir tai jam nepavyko, jis baigė sa­
    vo dienas kalėjime toje pačioje Lietuvoje.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: 469432-470549; hash=3c08cf5d2878642b7984b2e7a4f45f8b10647713b165fb21af330ca6bc97423d; match=ocr_normalized_gapped
  sprendimo_priezastis: auto
  ryšio_patikimumas: mire -> Lietuva: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Šach Achmedas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Lietuva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad Šach Achmedas gyvenimą baigė kalėjime Lietuvoje.
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 469008-469649; hash=d7731ba047a3aa652378a5d9e51155b12538975506fa050c9b8bd200d952d170; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: reme -> Lietuviai: 0.92
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Šach Achmedas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Lietuviai: llm_allowed_candidate, group
  ryšio_paaiskinimas: Claim ir citata tiesiogiai sako, kad Šach Achmedas rėmė lietuvius.

## Ryšiai
- Šach Achmedas reme [[objektai/grupes/Lietuviai]]
- Šach Achmedas gyveno [[objektai/vietos/Trakai]]
- Šach Achmedas keliavo_i [[objektai/vietos/Brasta]]
- Šach Achmedas mire [[objektai/vietos/Lietuva]]
- Šach Achmedas gyveno [[objektai/vietos/Kaunas]]
- Šach Achmedas keliavo_i [[objektai/vietos/Vilnius]]
- Šach Achmedas gyveno [[objektai/vietos/Vilnius]]
