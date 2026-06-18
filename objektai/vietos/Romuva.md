---
tipas: vieta
pavadinimas: 'Romuva'
saltiniai:
  - 'Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)'
  - 'Michał Baliński, Vilniaus miesto istorija (2007 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
---
# Romuva

## Santrauka

Šio proceso ankstyvąja apraiška reikėtų laikyti šaltiniuose minimą šventyklą – Nadruvoje esančią Romuvą ir jos krivį. Romuvoje pagrindinis kulto objektas buvo ugnis.

## Teiginiai

<a id="claim-t-84715"></a>
- t-001
  global_id: t-84715
  teiginys: 'Raseinių ir Ariogalos apylinkės laikytos svarbiomis pagonims, nes čia stovėjo Romuva su Perkūno šventykla ir Krivių Krivaičio buveine.'
  sudarymo_pagrindimas: 'Citata patvirtina Romuvos reikšmę ir paskirtį, bet pradiniame tekste liko OCR laužymo.'
  susije_objektai: 'mentioned_place: Ariogala; mentioned_place: Raseiniai; mentioned_place: Vaikiai; mentioned_place: Viena; mentioned_place: Šventoji'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=de23168ae4121b5db08997e53c7f7914aaf8be62a55ca74316b418708a8b7677; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: priklause -> Nadruva: 0.92
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Romuva: llm_allowed_candidate, place
  ryšio_targeto_parinkimas: Nadruva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Frazė tiesiogiai nurodo Romuvą esant Nadruvoje.

<a id="claim-t-84716"></a>
- t-002
  global_id: t-84716
  teiginys: 'Romuva šaltiniuose minima kaip Nadruvoje esanti šventykla su kriviu.'
  susije_objektai: 'llm_object: Nadruva; mentioned_place: Nadruva; mentioned_object: [[objektai/zodynas/pagonybė|pagonybė]]'
  semantiniai_rysiai: 'Romuva priklausė Nadruva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=5936109903a48c0d84bc007e6257320ec92ede4738e899593cf503a6954748fc; match=fallback; occurrences=0
  sprendimo_priezastis: auto

<a id="claim-t-84717"></a>
- t-003
  global_id: t-84717
  teiginys: 'Romuvoje pagrindinis kulto objektas buvo ugnis.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d74a6533ff996ad5d2005f2122f331c4435808276aceb3da017719d2556225de; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Ariogala: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Romuva: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Ariogala: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Romuva" parinktas kaip owner_note_path. Targetas "Ariogala" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-84718"></a>
- t-004
  global_id: t-84718
  teiginys: 'Romuva minima kaip Perkūno šventykla ir vyriausiojo vaidilos Krivių Krivaičio pagrindinė buveinė.'
  sudarymo_pagrindimas: 'Teiginys yra gramatiškas ir tiksliai perteikia citatoje pateiktą Romuvos apibūdinimą.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Kryžiuočių ordinas|Kryžiuočių ordinas]]; mentioned_place: Ariogala; mentioned_place: Bisenė; mentioned_place: Raseiniai'
  pagrindžia:
    - c-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: 158115-158555; hash=f0d470cd9c9522c09cb930638f56814f1294737387ca9da3d2aa553e106255ec; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Ariogala: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Romuva: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Ariogala: mention_match, place, gap=66
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Romuva" parinktas kaip owner_note_path. Targetas "Ariogala" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-183626"></a>
- t-005
  global_id: t-183626
  teiginys: 'Lietuvos istorijos autoriai Nadruvoje buvusią Romuvą laiko ankstyva pagonybės virtimo institucine religija apraiška.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Citata remia interpretacinį teiginį, todėl pridėta šaltinio autorystė.'
  susije_objektai: 'llm_object: Nadruva; mentioned_place: Lietuva; mentioned_place: Nadruva'
  semantiniai_rysiai: 'Romuva priklausė Nadruva'
  pagrindžia:
    - c-005
  irodymo_stiprumas: 0.00
  saltinio_vieta: 36682-36986; hash=ed8064a9ddc8fe3dfac49ca34c40ab66158c82a1d7ae93d4ded76066df3b72eb; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: priklause -> Nadruva: 0.92
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Romuva: llm_allowed_candidate, place
  ryšio_targeto_parinkimas: Nadruva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Teiginys tiesiogiai nurodo, kad Romuva buvo Nadruvoje.
- susijęs iš [[objektai/autoriai/Dundulienė P.md#claim-t-64574|Dundulienė P]]: Dundulienės P. darbas „Medžiai“ minimas bibliografijoje apie Romovę arba Romuvą.
- susijęs iš [[objektai/autoriai/Friederici W.md#claim-t-60700|Friederici W]]: W. Friederici darbas „Über die Lage Romow’s...“ cituojamas siejant Auksinės žemupio vietovardžius Kreiwutschen ir Romanuppen su Kriviu ir Romuva.
- susijęs iš [[objektai/autoriai/Jurginis J.md#claim-t-64663|Jurginis J]]: J. Jurginio darbas „Legendos“ minimas bibliografijoje apie Romovę arba Romuvą.
- susijęs iš [[objektai/autoriai/Powierski J.md#claim-t-60512|Powierski J]]: J. Powierskio darbai nurodyti tarp literatūros apie Romovę arba Romuvą.
- susijęs iš [[objektai/autoriai/S. Grunau.md#claim-t-64836|S. Grunau]]: S. Grunau XVI a. pirmoje pusėje rašė, kad Romuvoje augo milžiniškas ąžuolas su Perkūno, Patulo ir Patrimpo stabais.
- susijęs iš [[objektai/autoriai/Voigt J.md#claim-t-64867|Voigt J]]: J. Voigtas cituojamas dėl Romuvos paieškų ir Romehnen vietovės Semboje siejimo su šventa kulto vieta.
- susijęs iš [[objektai/autoriai/Vėlius N.md#claim-t-60564|Vėlius N]]: N. Vėliaus darbas nurodytas tarp literatūros apie Romovę arba Romuvą.
- susijęs iš [[objektai/daiktai/Romuva kaip Perkūno šventykla.md#claim-t-87093|Romuva kaip Perkūno šventykla]]: Romuva buvo laikoma Perkūno šventykla ir vyriausiojo vaidilos Krivių Krivaičio pagrindine buveine.
- susijęs iš [[objektai/grupes/Kryžiuočių ordinas.md#claim-t-178892|Kryžiuočių ordinas]]: Kryžiuočiai, užėmę Prūsiją, sunaikino Romuvą.
- susijęs iš [[objektai/paprociai/Romuvos kulto institucija, ugnies garbinimas ir valdovų deginimas.md#claim-t-183333|Romuvos kulto institucija, ugnies garbinimas ir valdovų deginimas (institucija)]]: Romuvoje pagrindinis kulto objektas buvo ugnis.
- susijęs iš [[objektai/paprociai/Romuvos kulto institucija, ugnies garbinimas ir valdovų deginimas.md#claim-t-54334|Romuvos kulto institucija, ugnies garbinimas ir valdovų deginimas (institucija)]]: Romuvoje pagrindinis kulto objektas buvo ugnis.
- susijęs iš [[objektai/paprociai/Romuvos kulto institucija, ugnies garbinimas ir valdovų deginimas.md#claim-t-54335|Romuvos kulto institucija, ugnies garbinimas ir valdovų deginimas (institucija)]]: Romuva Nadruvoje ir jos krivis laikomi ankstyva pagonybės virtimo institucine religija apraiška.
- susijęs iš [[objektai/paprociai/Romuvos kulto institucija, ugnies garbinimas ir valdovų deginimas.md#claim-t-54336|Romuvos kulto institucija, ugnies garbinimas ir valdovų deginimas (institucija)]]: Nadruvoje minima Romuva ir jos krivis laikomi ankstyva pagonybės virtimo institucine religija apraiška.
- susijęs iš S. Grunau, Preussische Chronik: S. Grunau rašė, kad Romuvoje augusiame milžiniškame ąžuole stovėjo Perkūno, Patulo ir Patrimpo stabai.
- susijęs iš W. Friederici, Über die Lage Romow’s: W. Friederici darbe minimas bandymas sieti Auksinės žemupio vietovardžius Kreiwutschen ir Romanuppen su Kriviu ir Romove arba Romuva.
- susijęs iš Z. Ivinskis, Senovės lietuvių religijos bibliografija: Z. Ivinskio „Senovės lietuvių religijos bibliografija“ minima kaip literatūra apie Romovę arba Romuvą.
- susijęs iš Ariogala: Ariogalos apylinkės buvo laikomos pagonims svarbia vietove, siejama su Romuva, Perkūno šventykla ir Krivių Krivaičio buveine.
- susijęs iš Nadruva: Nadruvoje buvusi Romuva ir jos krivis šaltinyje laikomi ankstyva pagonybės virtimo institucine religija apraiška.
- susijęs iš Prūsija: Kryžiuočiai, užėmę Prūsiją, sunaikino Romuvą.
- susijęs iš Romovė Romuva: Ilgainiui įsivyravo nuomonė, kad Nadruvos Romovės, arba Romuvos, vieta apskritai nebeatsekama.
- susijęs iš Romovė Romuva: Romovė, arba Romuva, Dusburgiečio duomenimis buvo prūsų, lietuvių ir kitų baltų religinio kulto centras.
- susijęs iš Romovė Romuva: Ilgainiui įsivyravo nuomonė, kad Nadruvos Romovės, arba Romuvos, vieta apskritai nebeatsekama.
- susijęs iš Romovė Romuva: Aprašyta Romovė resp. Romuva — autentiškas faktas.
- susijęs iš [[objektai/zodynas/Alkos ir romuvos.md#claim-t-06172|Alkos ir romuvos]]: Pasakojimas apie vieną vyriausiąją Romuvą laikomas viduramžių rašytojų prasimanymu.
- susijęs iš [[objektai/zodynas/Romuva ir krivis.md#claim-t-75583|Romuva ir krivis]]: Ilgainiui įsivyravo nuomonė, kad Nadruvos Romovės, arba Romuvos, vieta nebeatsekama.
- susijęs iš [[objektai/zodynas/Romuva ir krivis.md#claim-t-75584|Romuva ir krivis]]: Šio leidimo komentare `Romovė`, `Romuva`, `Romow`, `Rômowe` ir `Romava` siejamos su prūsų, lietuvių ir kitų baltų religiniu kulto centru.
- susijęs iš [[objektai/zodynas/Romuva ir krivis.md#claim-t-75585|Romuva ir krivis]]: Romuvoje pagrindinis kulto objektas buvo ugnis.
- susijęs iš [[objektai/zodynas/Romuva ir krivis.md#claim-t-75586|Romuva ir krivis]]: Romuva Nadruvoje ir jos krivis laikomi ankstyva pagonybės virtimo institucine religija apraiška.
- susijęs iš [[objektai/zodynas/Romuva krivis.md#claim-t-77804|Romuva krivis]]: Romuva Nadruvoje ir jos krivis laikomi ankstyva pagonybės virtimo institucine religija apraiška.
- susijęs iš [[objektai/zodynas/Romuva krivis.md#claim-t-77805|Romuva krivis]]: Romuvoje pagrindinis kulto objektas buvo ugnis.
- susijęs iš [[objektai/autoriai/M. Tepenas.md#claim-t-64746|M. Tepenas]]: M. Tepenas atkreipė dėmesį į Rausvės intaką Romenę rytų Nadruvoje, į pietus nuo Pilkalnio.
- susijęs iš [[objektai/autoriai/Powierski J.md#claim-t-60509|Powierski J]]: J. Powierski cituojamas aiškinant Romovės šventojo ąžuolo ryšį su indoeuropiečių mitologiniais vaizdiniais.
- susijęs iš [[objektai/autoriai/Иванов В. В.md#claim-t-60643|Иванов В. В]]: V. V. Ivanovo ir V. N. Toporovo tyrimai siejami su aiškinimu, kad Romovės šventasis ąžuolas buvo tridalio pasaulio medžio simbolis.
- susijęs iš [[objektai/autoriai/Тоерреn M.md#claim-t-60665|Тоерреn M]]: M. Tepenas atkreipė dėmesį į Rausvės intaką Romenę rytų Nadruvoje, į pietus nuo Pilkalnio.
- susijęs iš [[objektai/daiktai/Aukuro kalnai ir akmenys.md#claim-t-77919|Aukuro kalnai ir akmenys]]: Ugnies garbinimas buvo susijęs su Lietuvoje išplitusiais Aukuro kalnais ir akmenimis.
- susijęs iš [[objektai/daiktai/Dievų trejybės stabai.md#claim-t-59681|Dievų trejybės stabai]]: S. Grunau rašė, kad Romovės ąžuolo uoksuose stovėjo dievų trejybės stabai: Perkūnas, Patulas ir Patrimpas.
- susijęs iš [[objektai/daiktai/Ginklai, skydai, šarvai ir šaudymo reikmenys.md#claim-t-86984|Ginklai, skydai, šarvai ir šaudymo reikmenys]]: Bisenės pilies įgula atrėmė vokiečius nepaisydama jų sunkiųjų ginklų.
- susijęs iš [[objektai/daiktai/Sunkieji ginklai.md#claim-t-87123|Sunkieji ginklai]]: Bisenės pilies įgula atrėmė vokiečius, nors šie naudojo sunkiuosius ginklus.
- susijęs iš [[objektai/daiktai/Šventasis ąžuolas.md#claim-t-59712|Šventasis ąžuolas]]: S. Grunau rašė, kad Romuvoje augęs milžiniškas trijų dalių šventasis ąžuolas su Perkūno, Patulo ir Patrimpo stabais.
- susijęs iš [[objektai/grupes/Baltai.md#claim-t-96076|Baltai]]: Pasak Dusburgiečio, Romovė buvo prūsų, lietuvių ir kitų baltų religinio kulto centras.
- susijęs iš [[objektai/grupes/Lietuviai.md#claim-t-179318|Lietuviai]]: Pasak Petro Dusburgiečio, Romuva buvo prūsų, lietuvių ir kitų baltų religinio kulto centras.
- susijęs iš M. Prätorius, Deliciae: M. Prätorius manė, kad baltų Romovė galėjusi būti prie Biserkiemio ant Sidabro kalnu vadintos kalvos.
- susijęs iš Ariogala: Ginkluota palyda, pasiekusi Raseinių ribas, vėliau pasiekė Ariogalos apylinkes.
- susijęs iš Raseiniai: Po Vaikių krašto nusiaubimo ginkluota palyda kitą dieną pasiekė Raseinių ribas, o vėliau ir Ariogalos apylinkes.
- susijęs iš Rausvė: M. Tepenas atkreipė dėmesį į Rausvės intaką Romenę rytų Nadruvoje, į pietus nuo Pilkalnio.
- susijęs iš Rausvė: A. Mežinskis manė, kad Romovė galėjusi būti ir prie Rausvės.
- susijęs iš Romehnen: Vėlesnė Romehnen Semboje (jos vak.
- susijęs iš [[objektai/zodynas/amfiktionija.md#claim-t-23432|amfiktionija]]: Amfiktionija buvo senovės graikų polių sąjunga, sudaryta tarpgentinėje teritorijoje esančiai šventovei ginti.
- susijęs iš [[objektai/zodynas/Šventaragio, Gabijos, Krivių Krivaičio ir Romuvų terminija.md#claim-t-86452|Šventaragio, Gabijos, Krivių Krivaičio ir Romuvų terminija]]: Romuvos buvo senovės lietuvių šventvietės šventose giriose, kur garbintas Perkūnas ir gyveno Krivių Krivaitis.
- susijęs iš [[objektai/daiktai/Šventasis ąžuolas.md#claim-t-59712|Šventasis ąžuolas]]: S. Grunau rašė, kad Romuvoje augęs milžiniškas trijų dalių šventasis ąžuolas su Perkūno, Patulo ir Patrimpo stabais.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)
  citata_originali: |
    Iš mūsų pagonių valdovų laikysenos
    galima suprasti, kad pagonybė jiems buvo lygiavertė krikščionybei. Tai-
    gi valstybė iš viršaus lyg ir turėjo bandyti paspartinti pagonybės virtimo
    institucine religija procesą. Šio proceso ankstyvąja apraiška reikėtų laikyti
    šaltiniuose minimą šventyklą – Nadruvoje esančią Romuvą ir jos krivį.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-002

- c-002
  šaltinis: Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)
  citata_originali: |
    Tai jau turėtų būti savarankiška institucija, matyt, išlaikoma iš dovanų.
    Kad būtų išlaikyta politinė pusiausvyra, žynys įsikūrė silpniausios genties
    (Nadruvos) teritorijoje; tai primena senovės graikų amfiktioniją – polių
    sąjungą, sudarytą tarpgentinėje teritorijoje esančiai šventovei ginti. Ro-
    muvoje pagrindinis kulto objektas buvo ugnis.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=5936109903a48c0d84bc007e6257320ec92ede4738e899593cf503a6954748fc; match=fallback; occurrences=0
  sprendimo_priezastis: auto
    - t-003

- c-003
  santrauka: 'Raseinių ir Ariogalos apylinkės laikytos svarbiomis pagonims, nes čia stovėjo Romuva su Perkūno šventykla ir Krivių Krivaičio buveine.'
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Vaikių krašte buvo šventoji giria, ku­
    ri kartu su netoliese stovėjusia pilimi ir aplinkiniais pasta­
    tais vieną naktį buvo sudeginta iki pamatų, visi gyventojai
    išžudyti. Baigusi kruvinus darbus, ginkluota palyda kitą die­
    ną pasiekė Raseinių ribas, o vėliau ir Ariogalos apylinkes.
    Abi tos vietovės pagonims buvo labai svarbios, juk čia sto­
    vėjo Romuva (Perkūno šventykla ir vyriausiojo vaidilos Kri­
    vių Krivaičio pagrindinė buveinė).
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d74a6533ff996ad5d2005f2122f331c4435808276aceb3da017719d2556225de; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Ariogala: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Romuva: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Ariogala: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Romuva" parinktas kaip owner_note_path. Targetas "Ariogala" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-001

- c-004
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Baigusi kruvinus darbus, ginkluota palyda kitą die­
    ną pasiekė Raseinių ribas, o vėliau ir Ariogalos apylinkes.
    Abi tos vietovės pagonims buvo labai svarbios, juk čia sto­
    vėjo Romuva (Perkūno šventykla ir vyriausiojo vaidilos Kri­
    vių Krivaičio pagrindinė buveinė). Pakeliui viską versdama
    pelenais, kryžiuočių kariauna puolėsi Bisenės pilies link, pa­
    siryžusi užimti ją šturmu, ir jau vėlų vakarą imta pulti.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=de23168ae4121b5db08997e53c7f7914aaf8be62a55ca74316b418708a8b7677; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: priklause -> Nadruva: 0.92
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Romuva: llm_allowed_candidate, place
  ryšio_targeto_parinkimas: Nadruva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Frazė tiesiogiai nurodo Romuvą esant Nadruvoje.
    - t-004

- c-005
  santrauka: 'Lietuvos istorijos autoriai Nadruvoje buvusią Romuvą laiko ankstyva pagonybės virtimo institucine religija apraiška.'
  šaltinis: Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)
  citata_originali: |
    Tai-
    gi valstybė iš viršaus lyg ir turėjo bandyti paspartinti pagonybės virtimo
    institucine religija procesą. Šio proceso ankstyvąja apraiška reikėtų laikyti
    šaltiniuose minimą šventyklą – Nadruvoje esančią Romuvą ir jos krivį.
    Tai jau turėtų būti savarankiška institucija, matyt, išlaikoma iš dovanų.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: 158115-158555; hash=f0d470cd9c9522c09cb930638f56814f1294737387ca9da3d2aa553e106255ec; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Ariogala: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Romuva: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Ariogala: mention_match, place, gap=66
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Romuva" parinktas kaip owner_note_path. Targetas "Ariogala" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-005

- c-006
  santrauka: 'Romuvoje pagrindinis kulto objektas buvo ugnis.'
  šaltinis: Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)
  citata_originali: |
    Kad būtų išlaikyta politinė pusiausvyra, žynys įsikūrė silpniausios genties
    (Nadruvos) teritorijoje; tai primena senovės graikų amfiktioniją – polių
    sąjungą, sudarytą tarpgentinėje teritorijoje esančiai šventovei ginti. Ro-
    muvoje pagrindinis kulto objektas buvo ugnis. Jos garbinimas susijęs su
    Lietuvoje išplitusiais Aukuro kalnais ir akmenimis.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: 36682-36986; hash=ed8064a9ddc8fe3dfac49ca34c40ab66158c82a1d7ae93d4ded76066df3b72eb; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: priklause -> Nadruva: 0.92
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Romuva: llm_allowed_candidate, place
  ryšio_targeto_parinkimas: Nadruva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Teiginys tiesiogiai nurodo, kad Romuva buvo Nadruvoje.
    - t-006
  irodymo_stiprumas: 0.00
  saltinio_vieta: 36988-37338; hash=bd3ed4d5893afd434d32ff294066bafc36fb390911e43460b1a5d904f41bda59; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Aukuras: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Romuva: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Aukuras: mention_match, thing
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Romuva" parinktas kaip owner_note_path. Targetas "Aukuras" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

## Ryšiai
- Romuva priklause [[objektai/vietos/Nadruva]]
- [[objektai/daiktai/Šventasis ąžuolas]] priklause Romuva
- Romuva priklause [[objektai/grupes/Baltai]]
