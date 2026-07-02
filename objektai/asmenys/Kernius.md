---
tipas: asmuo
pavadinimas: 'Kernius'
saltiniai:
  - 'Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)'
  - 'Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)'
datos:
  - '1089 m.'
date_start: '1089'
date_end: ''
sukurta: ''
atnaujinta: ''
amziai:
  - 'XI'
periodo_grupes:
  - 'viduramžiai'
---
# Kernius

## Santrauka

Kernius gavo valdyti Lietuvos žemes tarp Neries, Nevėžio ir Dauguvos. Kernius, neturėdamas sūnaus įpėdinio, įsūnijo Živinbudą, jam atidavė dukterį Pajautą ir pridėjo Lietuvos kunigaikštystę kraičiui. Narbutas Kernių vaizduoja kaip Vidurio, arba Užnerio, Lietuvos kunigaikštį, kurio sostinė buvo Kernavė.

## Teiginiai
<a id="claim-t-186005"></a>
- t-001
  global_id: t-186005
  teiginys: 'Kernius gavo valdyti Lietuvos žemes tarp Neries, Nevėžio ir Dauguvos.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Citata palaiko faktą apie Kernių; pašalinta perteklinė informacija apie Gimbutą.'
  susije_objektai: 'llm_object: Lietuva; mentioned_place: Dauguva; mentioned_place: Lietuva; mentioned_place: Nevėžis'
  semantiniai_rysiai: '[[objektai/asmenys/Kernius|Kernius]] valdė Lietuva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 101058-101385; hash=7e1b35b7a823dbb8c35b682078c035060099f8c518435d35276e6c41595ffaa8; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: valde -> Lietuva: 0.86
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Kernius: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Lietuva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Tekstas tiesiogiai sako, kad Kerniui buvo atiduotos valdyti Lietuvos žemės.

<a id="claim-t-186006"></a>
- t-002
  global_id: t-186006
  teiginys: 'Kernius, neturėdamas sūnaus įpėdinio, įsūnijo Živinbudą, jam atidavė dukterį Pajautą ir pridėjo Lietuvos kunigaikštystę kraičiui.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Perrašyta, kad būtų įtrauktas citatoje svarbus paveldėjimo sprendimo rezultatas.'
  susije_objektai: 'llm_object: [[objektai/asmenys/Kernius|Kernius]]; llm_object: Deltuva; mentioned_person: [[objektai/asmenys/Pajauta|Pajauta]]; mentioned_place: Lietuva; mentioned_place: Deltuva; mentioned_place: Viena'
  semantiniai_rysiai: '[[objektai/asmenys/Pajauta|Pajauta]] buvo duktė [[objektai/asmenys/Kernius|Kernius]]; [[objektai/asmenys/Kernius|Kernius]] buvo palaidotas Deltuva'
  temporaliniai_duomenys: 'įvykio data: 1089 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Perrašyta, kad būtų įtrauktas citatoje svarbus paveldėjimo sprendimo rezultatas.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 108476-109002; hash=bf7711a8269242a986d085b1075f4f515d64d5dc5d85f00ccf0ea8f2db7f640f; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: buvo_dukte -> Kernius: 0.96
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Pajauta: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Kernius: llm_allowed_candidate, person
  ryšio_paaiskinimas: Frazė tiesiogiai nurodo Pajautą kaip Kerniaus dukterį.

<a id="claim-t-188564"></a>
- t-003
  global_id: t-188564
  teiginys: 'Narbutas Kernių vaizduoja kaip Vidurio, arba Užnerio, Lietuvos kunigaikštį, kurio sostinė buvo Kernavė.'
  pagrindžia:
    - c-003
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
  statusas: patvirtinta
  irodymo_stiprumas: 0.00
  saltinio_vieta: 267224-267630; hash=966493f836b3fb549f8ce80df5eddbfc89048f5a35247ca20ed943707614640b; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Kernavė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Kernius: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Kernavė: mention_match, place, gap=86
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Kernius" parinktas kaip owner_note_path. Targetas "Kernavė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
<a id="claim-t-188565"></a>
- t-004
  global_id: t-188565
  teiginys: 'Pasak Narbuto perteikiamo Hartknocho, ant Kukovaičio kalno nuo seno degė Kerniaus užkurta Amžinoji ugnis.'
  pagrindžia:
    - c-004
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
  statusas: patvirtinta
  irodymo_stiprumas: 0.00
  saltinio_vieta: 377344-377660; hash=011ad82e82271cefc45295b68aeae74dc0af1298e0c91a45157a4cdf04024a9f; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Kaimas: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Kernius: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Kaimas: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Kernius" parinktas kaip owner_note_path. Targetas "Kaimas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
- susijęs iš [[objektai/asmenys/Kūnas.md#claim-t-186135|Kūnas]]: Kūnas gyvas būdamas padalijo valdžią Kerniui ir Gimbutui, kad sūnums nepaliktų paveldimos neapykantos šaltinio.
- susijęs iš [[objektai/asmenys/Pajauta.md#claim-t-188600|Pajauta]]: Narbutas Pajautą aprašo kaip Kerniaus dukterį, ištekėjusią už Ukmergės srities kunigaikščio Živinbudo.
- susijęs iš [[objektai/asmenys/Zivinbudas.md#claim-t-190222|Zivinbudas]]: Narbuto pasakojime Dausprungų giminės Zivinbudas, Ukmergės srities kunigaikštis, vedė Kerniaus dukterį Pajautą.
- susijęs iš [[objektai/autoriai/K. Hartknochas.md#claim-t-188427|Kristupas Hartknochas]]: Narbutas rašo, kad Hartknochas, remdamasis savo tyrimais, ant Kukovaičio kalno lokalizavo Kerniaus užkurtą Amžinąją ugnį.
- susijęs iš Ukmergės sritis: Narbutas Zivinbudą vadino Dausprungų giminės Ukmergės srities kunigaikščiu, vedusiu Kerniaus dukterį Pajautą.
- susijęs iš [[objektai/asmenys/Sekalys.md#claim-t-186251|Sekalys]]: Kunigaikščio Sekalio vedami polovcai keliais iš eilės antpuoliais smarkiai nusiaubė Rusią.
- susijęs iš [[objektai/asmenys/Živinbudas.md#claim-t-184902|Živinbudas]]: Po Kerniaus mirties valdovu paskelbtas Živinbudas valstybės sostinę iš Deltuvos perkėlė į Kernavę.
- susijęs iš Kernavė: Kernavė buvo įkurta prie upės kranto kaip nausėdija ir pilis, kadaise buvusi Lietuvos sostinė.
- susijęs iš Kukovaičio kalnas: Narbutas rašo, kad ant Kukovaičio kalno nebebuvo šventyklos ar stabo pėdsakų, o atminimas tebegyvavo kaimo pasakojimuose.
- susijęs iš Latgala: Lietuvos metraštis pasakoja, kad Gimbutas, radęs nuniokotą Žemaitiją, nužygiavo į Latgalą, ją sunaikino ir parsivarė belaisvių.
- susijęs iš [[objektai/zodynas/tėvonija.md#claim-t-187530|tėvonija]]: Lietuvos metraštis pasakoja, kad Kernius ir Gimbutas, geisdami praplėsti tėvonijas, sutelkė Lietuvos ir Žemaičių pajėgas žygiui į Rusią.
- susijęs iš [[objektai/asmenys/Pajauta.md#claim-t-188600|Pajauta]]: Narbutas Pajautą aprašo kaip Kerniaus dukterį, ištekėjusią už Ukmergės srities kunigaikščio Živinbudo.
## Reikšmingi paminėjimai
- c-001
  santrauka: 'Kernius gavo valdyti Lietuvos žemes tarp Neries, Nevėžio ir Dauguvos.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Kokius jis nuveikė paminėtinus darbus,
    vėlesnės kartos nežino. Gyvas būdamas, nusprendė ne­
    palikti po mirties sūnums paveldimo neapykantos šal­
    tinio, todėl pasistengė laiku padalyti valdžią. Kernu-
    sijui, arba Kerniui, atidavė valdyti Lietuvos žemes
    tarp Neries, Nevėžio ir Dauguvos, o jaunėliui Gimbu­
    tui paskyrė Žemaitiją.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-002
  santrauka: 'Kernius, neturėdamas sūnaus įpėdinio, įsūnijo Živinbudą, jam atidavė dukterį Pajautą ir pridėjo Lietuvos kunigaikštystę kraičiui.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Galbūt šitaip ir bū­
    tų atsitikę, jeigu, jam mirus,
    1089 m eta i
    būtų prasidėjęs tarpuvaldis:
    mat neturėjo jis sūnaus —
    savo įpėdinio. Todėl, sukvietęs didikus ir paaiškinęs
    jiems didžiulį pavojų, jis įsūnijo Živinbudą, vieną iš
    Julijono Dausprungo palikuonių, pajėgų valdyti jauni­
    kaitį, netrukus jam į žmonas atidavė vienturtę dukterį
    Pajautą, o kraičio pridėjo Lietuvos kunigaikštystę. Kai
    pasitraukė iš gyvenimo, jis buvo iškilmingai pašarvo­
    tas (kaip tais laikais derėjo) ir ant aukštos kalvos prie
    Deltuvos palaidotas.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
- c-003
  santrauka: 'Narbutas Kernių vaizduoja kaip Vidurio, arba Užnerio, Lietuvos kunigaikštį, kurio sostinė buvo Kernavė.'
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
  citata_originali: |
    Nereikia tapatinti Medziojnos
    su Medžiojma, kurią laikėme medžiotojų deive, vadinama
    Laima.
    154

    ## Puslapis 154

    Pajauta (Pojata)
    Lietuvių kunigaikščio Kerniaus, viešpatavusio Vidurio, ar­
    ba Užnerio, Lietuvoje, kurios sostinė buvo Kernavė, duktė.
    Ta kunigaikštytė buvo ištekėjusi už Dausprungų giminės Zi-
    vinbudo, Ukmergės srities kunigaikščio, kuriam kraičio atne­
    šė paveldimą Kernavės kunigaikštystę.
  citata_rodoma: ""
  teiginio_tipas: faktas
  patikimumo_lygis: aukstas
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: ""
  pagrindžia:
    - t-003
- c-004
  santrauka: 'Pasak Narbuto perteikiamo Hartknocho, ant Kukovaičio kalno nuo seno degė Kerniaus užkurta Amžinoji ugnis.'
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
  citata_originali: |
    Tai liudija Strijkovskis. Ant
    Kukovaičio kalno jau nebėra nei šventyklos, nei stabo pėdsa­
    kų; liūdną ir niūrų žemės kampą atgaivina tik atminimas, te­
    begyvuojantis kaimo žmonių pasakojimuose. Hartknochas,
    remdamasis savo tyrimais, pasakoja, kad ant to paties kalno
    nuo seno degusi Kerniaus užkurta Amžinoji ugnis .
  citata_rodoma: ""
  teiginio_tipas: faktas
  patikimumo_lygis: aukstas
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: ""
  pagrindžia:
    - t-004

## Ryšiai
- [[objektai/asmenys/Pajauta]] buvo_dukte Kernius
- Kernius buvo_palaidotas [[objektai/vietos/Deltuva]]
- Kernius valde [[objektai/vietos/Lietuva]]
- Kernius surenge_zygi_i [[objektai/vietos/Breslauja]]
