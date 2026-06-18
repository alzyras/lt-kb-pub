---
tipas: zodyno_irasas
pavadinimas: 'etmonas'
saltiniai:
  - 'Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)'
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - sąvoka
---
# etmonas

## Santrauka

Greta didžiojo etmono M.

## Teiginiai

<a id="claim-t-42451"></a>
- t-001
  global_id: t-42451
  teiginys: 'Kristupas Radvila vėliau tapo didžiuoju etmonu ir buvo vadinamas Perkūnu.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Chodkevičiai|Chodkevičiai]]; mentioned_group: [[objektai/grupes/Radvilos|Radvilos]]; mentioned_person: [[objektai/asmenys/Augustas|Augustas]]; mentioned_person: [[objektai/asmenys/Jonas Chodkevičius|Jonas Chodkevičius]]; mentioned_person: [[objektai/asmenys/Kristupas Radvila|Kristupas Radvila]]; mentioned_person: [[objektai/asmenys/Radvila|Radvila]]; mentioned_place: Livonija; llm_object: [[objektai/asmenys/Radvila|Radvila]]'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=0c20f3859f2a4927e191007ea8627fb8cdbdba6983c8216843e81db7d9ea0da6; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: buvo_sunus -> Radvila: 0.67
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Kristupas Radvila: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Radvila: llm_allowed_candidate, person
  ryšio_paaiskinimas: Citata Kristupą Radvilą įvardija M. Radvilos sūnumi, nors kandidato „Radvila“ pastaba nėra visiškai specifinė.

<a id="claim-t-187521"></a>
- t-002
  global_id: t-187521
  teiginys: 'Aleksandras, pasitaręs su ponu Petru, etmono vietą perdavė Konstantinui Ostrogiškiui.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Pradinis teiginys buvo citatos fragmentas su OCR triukšmu; citata aiškiai pagrindžia glaustą faktą.'
  susije_objektai: 'mentioned_object: [[objektai/zodynas/didysis kunigaikštis|didysis kunigaikštis]]; mentioned_place: Trakai; mentioned_place: Volynė'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 260792-261102; hash=39718f094e1628a5883656bd5e243166f0ac8188ac85e2cd8da38606bd6df06f; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Trakai: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: etmonas: owner_note_path, thing, gap=0
  ryšio_targeto_parinkimas: Trakai: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "etmonas" parinktas kaip owner_note_path. Targetas "Trakai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-187522"></a>
- t-003
  global_id: t-187522
  teiginys: 'Lietuvos metraštyje Žemaičių seniūnas ir LDK etmonas čeką Joną Cerniną su svetimšaliais pasiuntė į Polocką kaip įgulą.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Pareigybės ir titulai suformuluoti kaip šaltinio vartosena. Nepridėtas ankstesnis Mstislavlio epizodas ar Olbrachto mirtis.'
  susije_objektai: 'mentioned_place: Polockas; mentioned_object: [[objektai/zodynas/seniūnas|seniūnas]]; mentioned_person: [[objektai/asmenys/Vladislovas Lokietka|Vladislovas Lokietka]]; mentioned_place: Lenkija; mentioned_place: Lietuva; mentioned_place: Mstislavlis'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: 278279-278805; hash=5d09c7252dee32c6d3bfdabc7f9c8f1df7b5c869dc81933b996549fc0a7b3907; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Polockas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: etmonas: owner_note_path, thing, gap=0
  ryšio_targeto_parinkimas: Polockas: mention_match, place, gap=54
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "etmonas" parinktas kaip owner_note_path. Targetas "Polockas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
- susijęs iš [[objektai/asmenys/Avigenas.md#claim-t-186096|Avigenas]]: Kolonijos Agripinos arkivyskupas Avigenas su kariuomene patraukė į žygį ir jai vadovavo lyg etmonas.
- susijęs iš [[objektai/asmenys/Jonas Chodkevičius.md#claim-t-63715|Jonas Chodkevičius]]: Jonas Chodkevičius buvo tarp geriausių tuo metu surinktų karių ir vėliau tapo Livonijos etmonu.
- susijęs iš [[objektai/asmenys/Jurgis Radvila.md#claim-t-103053|Jurgis Radvila (vyskupas, XVI a.)]]: Jurgis Radvila paveikslo „Oršos mūšis“ fragmente vaizduojamas kaip buože užsimojęs lauko etmonas.
- susijęs iš [[objektai/asmenys/Kristupas Radvila Perkūnas.md#claim-t-79095|Kristupas Radvila Perkūnas]]: Šešiolikmetis Kristupas Radvila Perkūnas buvo tarp karių greta didžiojo etmono Mikalojaus Radvilos.
- susijęs iš [[objektai/asmenys/Romanas Sanguška.md#claim-t-40405|Romanas Sanguška]]: Romanas Sanguška buvo tarp geriausių tuo metu surinktų karių ir vėliau tapo lauko etmonu.
- susijęs iš [[objektai/asmenys/S. Kosakovskis.md#claim-t-40407|S. Kosakovskis]]: S. Kosakovskis buvo paskutinysis LDK didysis etmonas ir generolas, suimtas Milerio name Vilniuje.
- susijęs iš [[objektai/grupes/Lenkijos kariuomenė.md#claim-t-78202|Lenkijos kariuomenė]]: Lenkijos kariuomenė buvo sunaikinta mūšyje prie Cecoros, kur žuvo didysis karūnos etmonas Stanislovas Žolkievskis.
- susijęs iš [[objektai/grupes/Lietuvos kariuomenė.md#claim-t-182743|Lietuvos kariuomenė]]: Kristupas Radvila Perkūnas 1589–1603 m. vadovavo Lietuvos kariuomenei kaip LDK kariuomenės didysis etmonas.
- susijęs iš [[objektai/ivykiai/Klecko mūšis.md#claim-t-186542|Klecko mūšis (mūšis, XVI a.)]]: Lietuvos metraštis pasakoja, kad prieš Klecko mūšį etmonas Stanislovas Petravičius Kiška sunkiai susirgo ir nebegalėjo laikytis balne.
- susijęs iš [[objektai/ivykiai/Klecko mūšis.md#claim-t-186547|Klecko mūšis (mūšis, XVI a.)]]: Lietuvos metraštis pasakoja, kad prieš Klecko mūšį dėl Stanislovo Petravičiaus Kiškos ligos etmono pareigos buvo pavestos Mykolui Glinskiui.
- susijęs iš [[objektai/ivykiai/Ulos (Čašnikų) mūšis (1564 m. sausio 23 d.).md#claim-t-09885|Ulos (Čašnikų) mūšis (1564 m. sausio 23 d.)]]: Per Ulos (Čašnikų) mūšį Lietuvos didysis etmonas sutelkė smūgį prieš maskvėnų artileriją ir šaulius, o išmušus juos iš pozicijų kilo sumaištis.
- susijęs iš [[objektai/ivykiai/Šklovo mūšis (1654 m. rugpjūčio 12 d.).md#claim-t-41393|Šklovo mūšis (1654 m. rugpjūčio 12 d.)]]: Šklovo mūšyje LDK kariuomenei vadovavo didysis etmonas kunigaikštis Jonušas Radvila.
- susijęs iš [[objektai/asmenys/Aleksandras Gonsevskis.md#claim-t-39999|Aleksandras Gonsevskis]]: Smolensko vaivada Aleksandras Gonsevskis su 6 tūkst. apylinkėse veikusių karių organizavo apsiaustųjų pajėgų aprūpinimą.
- susijęs iš [[objektai/asmenys/Antoine Gramont.md#claim-t-40035|Antoine Gramont]]: Prancūzijos grafas Antoine Gramont 1663-1664 m. pasakojo apie kazokus, tarnavusius Lenkijos-Lietuvos kariuomenėse.
- susijęs iš [[objektai/asmenys/Augustinas Rotundas.md#claim-t-60086|Augustinas Rotundas]]: Jonas Chodkevičius XVI a. antrojoje pusėje perdavė Dusburgiečio kroniką Vilniaus vaitui Augustinui Rotundui.
- susijęs iš [[objektai/asmenys/Fridrichas Ketleris.md#claim-t-40110|Fridrichas Ketleris]]: Lietuvos kariuomenės vadovybės vaizde Fridrichas Ketleris nurodytas J. K. Chodkevičiui iš kairės.
- susijęs iš [[objektai/asmenys/Grigalius Chodkevičius.md#claim-t-40125|Grigalius Chodkevičius]]: Lauko etmonas Grigalius Chodkevičius buvo tarp geriausių tuo metu surinktų karių.
- susijęs iš [[objektai/asmenys/Ignotas Masalskis.md#claim-t-75847|Ignotas Masalskis]]: 1792 m. birželio 25 d. Vilniaus konfederacijai, pritarusiai Targovicos konfederacijai, vadovavo ir Vilniaus vyskupas Ignotas Masalskis.
- susijęs iš [[objektai/asmenys/J. Radvila.md#claim-t-40164|J. Radvila]]: Caro kariuomenė prie Smolensko vengė šturmuoti tvirtovę, kol netoliese buvo J. Radvilos pajėgos.
- susijęs iš [[objektai/asmenys/Jonas Chodkevičius.md#claim-t-63716|Jonas Chodkevičius]]: XVI a. antrojoje pusėje Jonas Chodkevičius Roneburgo pilies bažnyčioje rado Petro iš Dusburgo kronikos nuorašą ir perdavė jį Augustinui Rotundui.
- susijęs iš [[objektai/asmenys/Jonas Sicinskis.md#claim-t-40228|Jonas Sicinskis]]: Birželio 2–3 d. Kristupas Radvila Perkūnas pasiuntė rotmistrą Joną Sicinskį su daliniu smogti K. Carlsono Gyllenhielmo kariams.
- susijęs iš [[objektai/asmenys/Juozapas Kosakovskis.md#claim-t-19013|Juozapas Kosakovskis (vyskupas)]]: Juozapas Kosakovskis, Livonijos vyskupas, 1792 m. vadovavo Vilniaus konfederacijai kartu su Simonu Kosakovskiu ir I. Masalskiu.
- susijęs iš [[objektai/asmenys/Jurgis Radvila.md#claim-t-103044|Jurgis Radvila (vyskupas, XVI a.)]]: Paveikslo „Oršos mūšis“ fragmente matyti buože užsimojęs lauko etmonas Jurgis Radvila.
- susijęs iš [[objektai/asmenys/Kristupas II Radvila.md#claim-t-49421|Kristupas II Radvila]]: 1633 m. žiemą tuometinis Lietuvos lauko etmonas Kristupas II Radvila atskubėjo į pagalbą.
- susijęs iš [[objektai/asmenys/Kristupas II Radvila.md#claim-t-49422|Kristupas II Radvila]]: 1633 m. žiemą tuometinis Lietuvos lauko etmonas Kristupas II Radvila atskubėjo į pagalbą.
- susijęs iš [[objektai/asmenys/Kristupas Radvila Perkūnas.md#claim-t-79097|Kristupas Radvila Perkūnas]]: Birželio 2-3 d. LDK didysis etmonas Kristupas Radvila Perkūnas pasiuntė Jono Sicinskio dalinį prieš K. Carlsono Gyllenhielmo karius.
- susijęs iš [[objektai/asmenys/Kunzas Lochneris.md#claim-t-80737|Kunzas Lochneris]]: Kunzas Lochneris XVI a. 6 dešimtmetyje Niurnberge pagamino Žygimanto Augusto paradinius šarvus.
- susijęs iš [[objektai/asmenys/Mikalojus Radvila Rudasis.md#claim-t-113890|Mikalojus Radvila Rudasis]]: Mikalojus Radvila Rudasis, žvalgų informuotas apie P. Šuiskio žygį, įsakė nedelsiant užkirsti kelią jo kariuomenei.
- susijęs iš [[objektai/asmenys/Mikalojus Radvila Rudasis.md#claim-t-113891|Mikalojus Radvila Rudasis]]: Mikalojus Radvila Rudasis žvalgų buvo greitai informuotas, kad P. Šuiskis sausio 23 d. su kariuomene pajudėjo iš Polocko.
- susijęs iš [[objektai/asmenys/Mikalojus Radvila Rudasis.md#claim-t-113892|Mikalojus Radvila Rudasis]]: Mikalojus Radvila Rudasis žvalgų buvo greitai informuotas apie P. Šuiskio žygį iš Polocko ir tuo metu buvo Lukomlyje.
- susijęs iš [[objektai/asmenys/Mykolas Borisovičius Šeina.md#claim-t-40355|Mykolas Borisovičius Šeina]]: Rusų kariuomenės vado Mykolo Borisovičiaus Šeinos štabas prie Smolensko pasidavė ATR valdovui Vladislovui Vazai.
- susijęs iš [[objektai/asmenys/Petras Šuiskis.md#claim-t-40392|Petras Šuiskis]]: Kunigaikštis Petras Šuiskis su savo kariuomene iš Polocko pajudėjo sausio 23 d.
- susijęs iš [[objektai/asmenys/Petro Sahaidačnij.md#claim-t-40394|Petro Sahaidačnij]]: Petro Sahaidačnij vadovavo apie 25 tūkst. Ukrainos kazokų, prisijungusių prie J. K. Chodkevičiaus pajėgų.
- susijęs iš [[objektai/asmenys/Simonas Kosakovskis.md#claim-t-19229|Simonas Kosakovskis]]: Simonas Kosakovskis 1792 m. vadovavo Vilniaus konfederacijai, pritarusiai Targovicos konfederacijai.
- susijęs iš [[objektai/asmenys/Stanislovas Kiška.md#claim-t-79163|Stanislovas Kiška]]: Rugpjūčio 5 d. paryčiais etmonas Stanislovas Kiška dėl žygio vargų nebegalėjo vadovauti ir pageidavo toliau važiuoti vežimu.
- susijęs iš [[objektai/asmenys/Vladislovas Vaza.md#claim-t-79225|Vladislovas Vaza]]: 1633 m. rugsėjį Vladislovas Vaza atvyko į frontą su 15 tūkst. kariuomene.
- susijęs iš [[objektai/daiktai/Didysis Lietuvos antspaudas.md#claim-t-19514|Didysis Lietuvos antspaudas]]: Po Liublino unijos LDK išlaikė atskirą iždą, kariuomenę, teismus ir Trečiojo Lietuvos Statuto įformintą teisinę sistemą.
- susijęs iš [[objektai/grupes/Abiejų Tautų konfederacija.md#claim-t-19623|Abiejų Tautų konfederacija]]: 1792 m. rugsėjo 11 d. Targovicos ir Vilniaus konfederacijos Brastoje susijungė į Abiejų Tautų konfederaciją.
- susijęs iš [[objektai/grupes/Janičarai.md#claim-t-40893|Janičarai]]: Pirmiausiai janičarai (turkų pėstininkai), o po to ir turkų kavalerija atakavo atskirai įsikūrusių Ukrainos kazokų stovyklą.
- susijęs iš [[objektai/grupes/Kazokai.md#claim-t-65306|Kazokai]]: Ukrainos kazokų stovyklą pirmiausia atakavo janičarai, o po jų puolė turkų kavalerija.
- susijęs iš [[objektai/grupes/Kuršiai.md#claim-t-184514|Kuršiai]]: Staiga kilusi grėsmė išjudino daug kuršių, žemaičių ir lietuvių priešintis priešui, kurio pavojų rodė pavergtos Latvijos likimas.
- susijęs iš [[objektai/grupes/Livonijos kunigaikštystė.md#claim-t-78383|Livonijos kunigaikštystė]]: Po Liublino unijos Livonijos ir Kuršo kunigaikštystės pripažintos bendromis Lenkijos ir LDK valdomis.
- susijęs iš [[objektai/grupes/Livonijos kunigaikštystė.md#claim-t-78385|Livonijos kunigaikštystė]]: Steponas Batoras ir Mikalojus Radvila Rudasis laikė būtina atkirsti Livonijos teritoriją nuo Rusijos ir perkelti karo veiksmus.
- susijęs iš [[objektai/grupes/Targovicos konfederacija.md#claim-t-182713|Targovicos konfederacija]]: 1792 m. rugsėjo 11 d. Targovicos ir Vilniaus konfederacijos Brastoje susijungė į Abiejų Tautų konfederaciją ir centru paskelbė Gardiną.
- susijęs iš [[objektai/grupes/Totoriai.md#claim-t-187750|Totoriai]]: Prie Klecko už Lanės upės stovėjo mūšiui pasirengę totorių pulkai.
- susijęs iš [[objektai/grupes/Vilniaus konfederacija.md#claim-t-20071|Vilniaus konfederacija]]: Vilniaus konfederacija 1792 m. birželio 25 d. pritarė Targovicos konfederacijai.
- susijęs iš [[objektai/grupes/Žemaičiai.md#claim-t-184592|Žemaičiai]]: Staigi grėsmė išjudino kuršius, žemaičius ir lietuvius, kurie pirmajame susidūrime sutriuškino krikščionių karius.
- susijęs iš [[objektai/ivykiai/Kuoknesės mūšis (1601 m. birželio 23 d.).md#claim-t-49165|Kuoknesės mūšis (1601 m. birželio 23 d.)]]: 1601 m. birželio 23 d. prie Kuoknesės pagrindinė Lietuvos kariuomenė stojo prieš švedų pajėgas.
- susijęs iš [[objektai/ivykiai/Kuoknesės mūšis (1601 m. birželio 23 d.).md#claim-t-49166|Kuoknesės mūšis (1601 m. birželio 23 d.)]]: Prieš Kuoknesės mūšį Kristupas Radvila Perkūnas birželio 2-3 d. pasiuntė Joną Sicinskį smogti K. Carlsono Gyllenhielmo kariams.
- susijęs iš [[objektai/ivykiai/Kėdainių unija (1655 m. spalio 20 d.).md#claim-t-80673|Kėdainių unija (1655 m. spalio 20 d.)]]: Jonušo Radvilos pastangomis Kėdainių unija su Švedija buvo sudaryta 1655 m. spalio 20 d.
- susijęs iš [[objektai/ivykiai/Kėdainių unija (1655 m. spalio 20 d.).md#claim-t-80675|Kėdainių unija (1655 m. spalio 20 d.)]]: Jonušas Radvila siekė nutraukti LDK uniją su Lenkija ir sudaryti naują uniją su Švedija.
- susijęs iš [[objektai/ivykiai/Rusijos ir Lenkijos-Lietuvos karas (1654–1667 m.).md#claim-t-41353|Rusijos ir Lenkijos-Lietuvos karas (1654–1667 m.)]]: 1654 m. Rusija pasiuntė gausią kariuomenę į Lietuvą.
- susijęs iš [[objektai/ivykiai/Smolensko apgultis (1632–1634 m.).md#claim-t-09880|Smolensko apgultis (1632–1634 m.)]]: 1634 m. sausio 24 d. Vladislovo Vazos vadovaujama lietuvių ir lenkų kariuomenė privertė rusų pajėgas kapituliuoti prie Smolensko.
- susijęs iš [[objektai/ivykiai/Targovicos ir Vilniaus konfederacijų susijungimas Brastoje.md#claim-t-20514|Targovicos ir Vilniaus konfederacijų susijungimas Brastoje]]: 1792 m. rugsėjo 11 d. Targovicos ir Vilniaus konfederacijos Brastoje susijungė į Abiejų Tautų konfederaciją.
- susijęs iš [[objektai/ivykiai/Vilniaus konfederacijos pritarimas Targovicos konfederacijai.md#claim-t-20537|Vilniaus konfederacijos pritarimas Targovicos konfederacijai]]: 1792 m. birželio 25 d. Vilniaus, arba Lietuvos, konfederacija pritarė Targovicos konfederacijai.
- susijęs iš [[objektai/ivykiai/Vilniaus užėmimas (1655 m. rugpjūčio 7 d.).md#claim-t-41382|Vilniaus užėmimas (1655 m. rugpjūčio 7 d.)]]: 1655 m. rugpjūčio 7 d. po aršių kautynių Rusijos kariuomenė ir jos sąjungininkai kazokai užėmė Lietuvos sostinę Vilnių.
- susijęs iš [[objektai/paprociai/Bajoriškoji demokratija, seimavimai ir liberum veto praktika.md#claim-t-77932|Bajoriškoji demokratija, seimavimai ir liberum veto praktika]]: Prieš vykdami į bendrus seimus Lietuvos atstovai rengdavo seimavimus bendrai pozicijai aptarti.
- susijęs iš [[objektai/posakiai/„įžen-gus į šalį svetimai kariuomenei į kraštą Respublikos kariuomenę rinkti“.md#claim-t-41494|„įžen-gus į šalį svetimai kariuomenei į kraštą Respublikos kariuomenę rinkti“ (kraštas)]]: Lietuvos didysis etmonas Mykolas Kazimieras Oginskis atsakė, kad įgyvendina seną etmonų teisę įžengus svetimai kariuomenei rinkti Respublikos kariuomenę.
- susijęs iš Roneburgo pilies bažnyčios Dusburgiečio kronikos nuorašas: Petro iš Dusburgo kronikos nuorašas buvo Livonijoje, Roneburgo pilies bažnyčioje, kur jį XVI a. antroje pusėje rado Jonas Chodkevičius.
- susijęs iš Salaspilio mūšis: Apie 1619 m. Pieterio Snayerso paveiksle „Salaspilio mūšis“ Lietuvos husarai vaizduojami naikinantys švedų pėstininkų batalioną.
- susijęs iš Trečiasis Lietuvos Statutas (1588 m.): Trečiasis Lietuvos Statutas 1588 m. įformino atskirą LDK teisinę sistemą.
- susijęs iš Dauguva: Lietuvos kariuomenės sparnas turėjo nustumti švedus nuo Dauguvos kranto ir nublokšti juos į šiaurėje esantį pelkėtą mišką.
- susijęs iš Didžiųjų Lukų tvirtovė: Į Didžiųjų Lukų tvirtovę buvo nurodyta suvežti atsargas, kurių kariuomenei turėjo pakakti pusei metų.
- susijęs iš Gardinas: 1792 m. rugsėjo 11 d. Targovicos ir Vilniaus konfederacijos Brastoje susijungė į Abiejų Tautų konfederaciją ir centru paskelbė Gardiną.
- susijęs iš Krokuva: Seime Lietuva turėjo tik trečdalį vietų, nes buvo prilyginta vienai Lenkijos provincijai greta Didžiosios Lenkijos su Poznane ir Mažosios Lenkijos su Krokuva.
- susijęs iš Leipūnai: Sapiegų daliniai sustojo prie Lieponių, arba Leipūnų, smuklės už maždaug 7 km nuo respublikonų stovyklos Valkininkuose.
- susijęs iš Leipūnai: Sapiegų daliniai sustojo prie Lieponių, arba Leipūnų, smuklės už maždaug 7 km nuo respublikonų stovyklos Valkininkuose.
- susijęs iš Leipūnai: ." Kiti minėjo Leipūnų laukuose žuvusius sūnus, tėvus ir kitus gimines.
- susijęs iš Lukomlys: Mykolas Radvila Rudasis buvo Lukomlyje, apie 100 km nuo Polocko, kai žvalgai jį informavo apie maskvėnų pajėgas.
- susijęs iš Piarnu: 1609 m. kovo 14 d. Jono Karolio Chodkevičiaus vadovaujama LDK kariuomenė pasiekė Piarnu, bet netikėtas antpuolis nepavyko.
- susijęs iš Salacgryva: Jonas Karolis Chodkevičius prie Salacgryvos žygiavo tiesiai per miškus, siekdamas užklupti priešą nepasiruošusį.
- susijęs iš Salacgryva: Jonas Karolis Chodkevičius Salacgryvos uosto prieigose slapta parengė du branderius - padegamuosius laivus.
- susijęs iš Salacgryva: Jonas Karolis Chodkevičius prie Salacgryvos žygiavo tiesiai per miškus, siekdamas užklupti priešą nepasiruošusį.
- susijęs iš Vilnius: XVI a. antrojoje pusėje Jonas Chodkevičius Petro Dusburgiečio kroniką perdavė Vilniaus vaitui Augustinui Rotundui.
- susijęs iš [[objektai/zodynas/federacija federacinė valstybė.md#claim-t-101586|federacija federacinė valstybė]]: Po unijos LDK išlaikė atskirą valstybės titulą, teritoriją, vykdomąją valdžią, iždą, kariuomenę, teismus ir teisinę sistemą.
- susijęs iš [[objektai/zodynas/federacija konfederacinė valstybė unitarinė valstybė.md#claim-t-22144|federacija konfederacinė valstybė unitarinė valstybė]]: LDK turėjo atskirą valstybės titulą, teritoriją, vykdomąją valdžią, iždą, kariuomenę, teismus ir teisinę sistemą.
- susijęs iš [[objektai/zodynas/jakobinizmas jakobinų klubas.md#claim-t-22172|jakobinizmas jakobinų klubas]]: Prūsiją gąsdino galimas valstybės sustiprėjimas dėl reformų, o Jekaterina II nerimavo dėl Prancūzijos jakobinizmo prie Rusijos sienų.
- susijęs iš [[objektai/zodynas/jakobinizmas.md#claim-t-22173|jakobinizmas]]: Prūsiją gąsdino galimas valstybės sustiprėjimas dėl reformų, o Jekaterina II nerimavo dėl Prancūzijos jakobinizmo prie Rusijos sienų.
- susijęs iš [[objektai/zodynas/ratukinė-kibirkštinė spyna.md#claim-t-42502|ratukinė-kibirkštinė spyna]]: XVI a. pradžioje sukurta ratukinė-kibirkštinė spyna veikė be rusenančios dagties.
- susijęs iš [[objektai/zodynas/rotmistras.md#claim-t-70312|rotmistras]]: Usviatų seniūnas ir rotmistras Jonas Petras Sapiega greičiausiai vadovavo kairiojo sparno kavalerijai.
- susijęs iš [[objektai/zodynas/rotmistras.md#claim-t-70314|rotmistras]]: Rotmistras Jonas Petras Sapiega greičiausiai vadovavo kairiajame sparne išdėstytiems kavalerijos daliniams.
- susijęs iš [[objektai/zodynas/sarmatai Sarmatija sarmatizmas.md#claim-t-185368|sarmatai Sarmatija sarmatizmas]]: Lenkijos šlėktos kildino save iš sarmatų ir tuo rėmė pažiūrą apie savo protėvių įtaką Europos tautų istorijai.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    buvo geriausi kariai, kuriuos tuo metu
    buvo galima surinkti. Greta didžiojo
    etmono M. Radvilos buvo jo šešio-
    likmetis sūnus Kristupas Radvila,
    vėliau tapęs didžiuoju etmonu ir
    vadintas Perkūnu, lauko etmo-
    nas Grigalius Chodkevičius,
    būsimasis lauko etmonas
    Romanas Sanguška, būsima-
    sis Livonijos etmonas Jonas
    Chodkevičius ir daugelis kitų.

    Žygimanto Augusto
    paradiniai šarvai, pa-

    gaminti Niunberge meistro
    Kunzo Lochnerio, XVI a.
    6 dešimtmetyje
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-001

- c-002
  santrauka: 'Aleksandras, pasitaręs su ponu Petru, etmono vietą perdavė Konstantinui Ostrogiškiui.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Ir didysis kunigaikštis Aleksandras, maty­
    damas jį nebetvirtą esant, tarėsi su juo, kam po jo mir­
    ties perduoti etmono vietą. Ponas Petras patarė per­
    duoti Volynės kunigaikščiui Konstantinui Ostrogiš-
    kiui2 4 . Ir pagal tą Trakų vaivados patarimą karalius
    davė etmono vietą kunigaikščiui Konstantinui2 5 .
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=0c20f3859f2a4927e191007ea8627fb8cdbdba6983c8216843e81db7d9ea0da6; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: buvo_sunus -> Radvila: 0.67
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Kristupas Radvila: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Radvila: llm_allowed_candidate, person
  ryšio_paaiskinimas: Citata Kristupą Radvilą įvardija M. Radvilos sūnumi, nors kandidato „Radvila“ pastaba nėra visiškai specifinė.
    - t-002

- c-003
  santrauka: 'Lietuvos metraštyje Žemaičių seniūnas ir LDK etmonas čeką Joną Cerniną su svetimšaliais pasiuntė į Polocką kaip įgulą.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Ir, apsupę Mstislavlio miestą, ilgokai stovėjo ir,
    pridarę aplink miestą daug žalos, sugrįžo atgal5 8 .
    Ponas Žemaičių seniūnas ir visos Lietuvos Didžio­
    sios Kunigaikštystės etmonas ilgokai stovyklavo kalnuo­
    se ir paskui nužygiavo į Lietuvą, čeką Joną Cerniną su
    visais svetimšaliais nusiuntė į Polocką kaip įgulą5 9 .
    Septyni tūkstančiai dešimtaisiais, o nuo Kristaus gi­
    mimo tūkstantis penki šimtai pirmaisiais metais Toru-
    nės mieste, Prūsijoje, mirė Lenkijos karalius Olbrach-
    tas 6 0 , karaliaus Aleksandro brolis.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: 260792-261102; hash=39718f094e1628a5883656bd5e243166f0ac8188ac85e2cd8da38606bd6df06f; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Trakai: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: etmonas: owner_note_path, thing, gap=0
  ryšio_targeto_parinkimas: Trakai: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "etmonas" parinktas kaip owner_note_path. Targetas "Trakai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: 278279-278805; hash=5d09c7252dee32c6d3bfdabc7f9c8f1df7b5c869dc81933b996549fc0a7b3907; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Polockas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: etmonas: owner_note_path, thing, gap=0
  ryšio_targeto_parinkimas: Polockas: mention_match, place, gap=54
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "etmonas" parinktas kaip owner_note_path. Targetas "Polockas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
