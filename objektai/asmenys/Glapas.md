---
tipas: asmuo
pavadinimas: 'Glapas'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
datos:
  - '1267 m.'
  - '1273 m.'
date_start: '1267'
date_end: '1273'
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - mūšis
  - pilis
  - tikėjimas
amziai:
  - 'XIII'
periodo_grupes:
  - 'LDK'
---
# Glapas

## Santrauka

Dusburgietis teigia, kad [dienos) išvakarėse, prūsai, matydami, jog broliai šiame mūšyje prarado daug jėgų, netekę brolių, ginklanešių, žirgų, ginklų ir visa kita, kas reikalinga karui, patyrę daug sunkių nelaimių ir aitrių nuoskaudų, vėl atkrito nuo tikėjimo ir tikinčiųjų, sugrįžo. Dusburgietis teigia, kad viena prūsė, vergų luomo ir Belialo duktė, pabėgo iš šios pilies ir pranešė Varmių vadui Glapui, kad broliai esą iš čia išvykę. Dusburgietis teigia, kad apie Glapo, varmių vado, mirtį ir varmių bei notangų pavergimą Glapas, varmių vadas, turėjo tokį valdinį, vardu Steinavas, kurį labai mėgo.

## Teiginiai

<a id="claim-t-89789"></a>
- t-001
  global_id: t-89789
  teiginys: 'Glapas buvo nuvarytas į Karaliaučių ir pakartas ant kalvos, kuri vėliau vadinta Glapo kalva.'
  sudarymo_pagrindimas: 'Teiginys perrašytas be neaiškaus įvardžio ir boilerplate.'
  susije_objektai: 'mentioned_place: Glapo kalva; mentioned_group: [[objektai/grupes/Notangai|Notangai]]; mentioned_group: [[objektai/grupes/Varmiai|Varmiai]]; llm_object: Glapo kalva'
  semantiniai_rysiai: '[[objektai/asmenys/Glapas|Glapas]] mirė Glapo kalva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 374656-375104; hash=42be6f24112930926628752664efd060f0cd19cb5bd44aa813103f05952d828b; match=ocr_normalized_gapped
  sprendimo_priezastis: auto
  ryšio_patikimumas: paskyre -> Glapas: 0.95
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Varmiai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Glapas: llm_allowed_candidate, person
  ryšio_paaiskinimas: Varmiai išsirinko Glapą savo vadu ir vyresniuoju.

<a id="claim-t-89790"></a>
- t-002
  global_id: t-89790
  teiginys: 'Glapas su kariuomene buvo užkluptas apgulęs pilį ir netikėtai užpultas brolių bei ginklanešių.'
  sudarymo_pagrindimas: 'Citata palaiko tik glaustą faktą apie Glapo padėtį ir užpuolimą.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Notangai|Notangai]]; mentioned_group: [[objektai/grupes/Varmiai|Varmiai]]'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 421698-422147; hash=48d02294d9d5bc0a487adc03fe222f374f1f66b648837f6297d2931c5fc164f9; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Prūsų žemė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; prusai_place_context; same_sentence_locality; single_candidate_actor; single_candidate_target; target_after_predicate
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Glapas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Prūsai: mention_match, place, gap=25
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Glapas" parinktas kaip owner_note_path. Targetas "Prūsai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-89791"></a>
- t-003
  global_id: t-89791
  teiginys: 'Glapas, Varmių vadas, turėjo valdinį Steinavą, kurį labai mėgo ir daug kartų gelbėjo iš mirtino pavojaus.'
  sudarymo_pagrindimas: 'Teiginys yra pilnas, gramatiškas ir tiksliai paremtas citata.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Varmiai|Varmiai]]; mentioned_group: [[objektai/grupes/Notangai|Notangai]]; mentioned_object: [[objektai/zodynas/magistras|magistras]]; mentioned_place: Kulmas; mentioned_place: Prūsija; mentioned_place: Semba; mentioned_place: Viena'
  temporaliniai_duomenys: 'įvykio data: 1267 m.; įvykio data: po 1273 m.; įvykio data: 1273 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui. Ši data interpretuojama kaip įvykio data su riba „after“, o ne kaip tiksli pilna data.'
  temporalinis_llm_pakomentavimas: 'Teiginys yra pilnas, gramatiškas ir tiksliai paremtas citata.'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=78eef6961714a3bcb89a04d82c9318fb8c5e2eb43b3fcd7cd82491a5cbe8440f; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Varmiai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Glapas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Varmiai: mention_match, group, gap=8
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Glapas" parinktas kaip owner_note_path. Targetas "Varmiai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-89792"></a>
- t-004
  global_id: t-89792
  teiginys: 'Varmių vadas Glapas, gavęs pabėgusios prūsės pranešimą, su daugybe karių atvyko ir užėmė pilį.'
  sudarymo_pagrindimas: 'Perrašyta taip, kad teiginio veikėjas būtų Glapas ir sakinys būtų enciklopedinis.'
  susije_objektai: 'mentioned_place: Prūsų žemė; mentioned_group: [[objektai/grupes/Varmiai|Varmiai]]; mentioned_object: [[objektai/daiktai/Laivai|Laivai]]; mentioned_object: [[objektai/zodynas/komtūras|komtūras]]; mentioned_place: Viena'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 429952-430349; hash=8054b6f296a90e2123f981b7dcf6531be72f5a9ae4ec1ce0909b671e10e12b59; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: mire -> Glapo kalva: 0.80
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Glapas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Glapo kalva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Glapas buvo pakartas ant kalvos, vėliau vadintos Glapo kalva.

<a id="claim-t-89793"></a>
- t-005
  global_id: t-89793
  teiginys: 'Prūsams vėl atkritus nuo tikėjimo, varmiai išsirinko Glapą savo kariuomenės vadu ir vyresniuoju.'
  sudarymo_pagrindimas: 'Citata tiesiogiai nurodo Glapo išrinkimą, bet pradinis teiginys jo nepateikia kaip objekto.'
  susije_objektai: 'llm_object: [[objektai/asmenys/Glapas|Glapas]]; mentioned_group: [[objektai/grupes/Bartai|Bartai]]; mentioned_group: [[objektai/grupes/Notangai|Notangai]]; mentioned_group: [[objektai/grupes/Pagudėnai|Pagudėnai]]; mentioned_group: [[objektai/grupes/Prūsai|Prūsai]]; mentioned_group: [[objektai/grupes/Sembai|Sembai]]; mentioned_group: [[objektai/grupes/Varmiai|Varmiai]]; mentioned_object: [[objektai/daiktai/Ginklai|Ginklai]]; mentioned_person: [[objektai/asmenys/Herkus Mantas|Herkus Mantas]]'
  semantiniai_rysiai: '[[objektai/grupes/Varmiai|Varmiai]] paskyrė [[objektai/asmenys/Glapas|Glapas]]'
  pagrindžia:
    - c-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: 429952-430349; hash=8054b6f296a90e2123f981b7dcf6531be72f5a9ae4ec1ce0909b671e10e12b59; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Notangai: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Glapas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Notangai: mention_match, group
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Glapas" parinktas kaip owner_note_path. Targetas "Notangai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-184072"></a>
- t-006
  global_id: t-184072
  teiginys: 'Varmių vadas Glapas, sužinojęs apie brolių išvykimą iš Brandenburgo pilies, su daugybe karių ją užėmė.'
  teiginio_tipas: 'saltinio_teiginys'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Perrašyta į aiškų sakinį apie Glapo veiksmą ir pašalinta šalutinė detalė.'
  susije_objektai: 'llm_object: Brandenburgo pilis; mentioned_place: Brandenburgo pilis; mentioned_group: [[objektai/grupes/Varmiai|Varmiai]]; mentioned_place: Viena'
  semantiniai_rysiai: '[[objektai/asmenys/Glapas|Glapas]] užėmė Brandenburgo pilis'
  pagrindžia:
    - c-005
  irodymo_stiprumas: 0.00
  saltinio_vieta: 421591-421868; hash=24df58e0208340b67824667dd52864178f628c63fbdd3479131dea4ba5588cc3; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: uzeme -> Brandenburgo pilis: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Glapas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Brandenburgo pilis: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citatoje nurodyta, kad Glapas su kariais atvyko ir užėmė pilį.
- susijęs iš [[objektai/asmenys/Steinavas.md#claim-t-184128|Steinavas]]: Steinavas nuvyko pas Karaliaučiaus komtūrą, išdavė Glapo paslaptį ir patarė komtūrui žygiuoti drauge su juo.
- susijęs iš [[objektai/asmenys/Steinavas.md#claim-t-60208|Steinavas]]: Steinavas buvo Glapo mėgtas valdinys, kurį varmių vadas daug kartų buvo išgelbėjęs iš mirtino pavojaus.
- susijęs iš [[objektai/asmenys/Steinavas.md#claim-t-60209|Steinavas]]: Steinavas nuvyko pas Karaliaučiaus komtūrą, išdavė Glapo paslaptį ir patarė komtūrui žygiuoti drauge su juo.
- susijęs iš [[objektai/grupes/Varmiai.md#claim-t-78541|Varmiai]]: Po prūsų atkritimo nuo tikėjimo varmiai savo kariuomenės vadu ir vyresniuoju išsirinko Glapą.
- susijęs iš [[objektai/ivykiai/Glapo išdavystė, suėmimas ir varmių bei notangų pasidavimas.md#claim-t-66552|Glapo išdavystė, suėmimas ir varmių bei notangų pasidavimas]]: Glapo valdinys Steinavas išdavė Karaliaučiaus komtūrui Glapo planą pulti pilį Sembos žemėje prie Gėlavandenių marių.
- susijęs iš [[objektai/ivykiai/Glapo išdavystė, suėmimas ir varmių bei notangų pasidavimas.md#claim-t-66554|Glapo išdavystė, suėmimas ir varmių bei notangų pasidavimas]]: Užkluptas prie apgultos pilies Glapas buvo nuvarytas į Karaliaučių ir pakartas ant kalvos, vadintos Glapo kalva.
- susijęs iš Glapo kalva: Glapas buvo nuvestas į Karaliaučių ir pakartas ant kalvos, kuri vadinta Glapo kalva.
- susijęs iš Glapo kalva: Glapo kalva, vėliau vadinta Rollbergu, buvo į vakarus nuo pilies, dabartinės Kaliningrado centrinės aikštės vakaruose.
- susijęs iš [[objektai/grupes/Notangai.md#claim-t-78398|Notangai]]: Išžudžius karo vadus, notangai ir varmiai vėl pasidavė tikėjimui ir broliams.
- susijęs iš [[objektai/grupes/Varmiai.md#claim-t-78536|Varmiai]]: Išžudžius karo vadus, notangai ir varmiai vėl pasidavė tikėjimui ir Ordino broliams.
- susijęs iš [[objektai/ivykiai/Brandenburgo pilies sunaikinimas ir atstatymas.md#claim-t-62751|Brandenburgo pilies sunaikinimas ir atstatymas (pilis)]]: Varmių vadas Glapas užėmė Brandenburgo pilį, kai sužinojo, kad broliai iš jos buvo išvykę.
- susijęs iš [[objektai/ivykiai/Glapo išdavystė, suėmimas ir varmių bei notangų pasidavimas.md#claim-t-66553|Glapo išdavystė, suėmimas ir varmių bei notangų pasidavimas]]: Išžudžius karo vadus, notangai ir varmiai vėl pasidavė tikėjimui ir Teutonų ordino broliams.
- susijęs iš [[objektai/posakiai/atsiteisė blogu už gera ir neapykanta už meilę.md#claim-t-59080|atsiteisė blogu už gera ir neapykanta už meilę]]: Dusburgietis rašė, kad Glapo mėgtas valdinys Steinavas už patirtas malones atsiteisė blogu už gera ir neapykanta už meilę.
- susijęs iš Karaliaučius: Glapas buvo nugabentas į Karaliaučių ir pakartas ant kalvos, kuri, pasak Dusburgiečio, vadinta Glapo kalva.
- susijęs iš [[objektai/asmenys/Steinavas.md#claim-t-184128|Steinavas]]: Steinavas nuvyko pas Karaliaučiaus komtūrą, išdavė Glapo paslaptį ir patarė komtūrui žygiuoti drauge su juo.
- susijęs iš [[objektai/asmenys/Steinavas.md#claim-t-60209|Steinavas]]: Steinavas nuvyko pas Karaliaučiaus komtūrą, išdavė Glapo paslaptį ir patarė komtūrui žygiuoti drauge su juo.
- susijęs iš [[objektai/ivykiai/Glapo išdavystė, suėmimas ir varmių bei notangų pasidavimas.md#claim-t-66552|Glapo išdavystė, suėmimas ir varmių bei notangų pasidavimas]]: Glapo valdinys Steinavas išdavė Karaliaučiaus komtūrui Glapo planą pulti pilį Sembos žemėje prie Gėlavandenių marių.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Šis, paklausęs patarimo, susikvietė daug brolių bei
    ginklanešių, nuvyko ten, užklupo Glapą, su kariuomene apgulusį minėtąją pilį, staiga
    juos užpuolė ir visus išžudė. Tačiau Glapą nusivarė su savimi į Karaliaučių ir pakorė ant
    kalvos, kuri nuo jo vardo po šiai dienai tebevadinama Glapo kalva413. Išžudžius vadus ir
    kitus vadovavusius karui, notangai ir varmiai vėl pasidavė tikėjimui ir broliams.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
    - t-001
- c-002
  santrauka: 'Varmių vadas Glapas, gavęs pabėgusios prūsės pranešimą, su daugybe karių atvyko ir užėmė pilį.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Viena prūsė, vergų luomo ir Belialo duktė, pabėgo iš šios pilies ir pranešė
    Varmių vadui Glapui, kad broliai esą iš čia išvykę. Šis su daugybe karių atvyko ir užėmė
    pilį. Šitai išgirdęs, komtūras susirūpino  ir patraukė su saviškiais link Karaliaučiaus,
    o parplaukęs laivais  į Brandenburgą, čia išvadavo nuo prūsų brolius  ir kitus iš savo
    šeimynos, nuolat puldinėjamus, kurie gynėsi šios pilies mediniame kuore, ir juos sveikus
    išsivedė su savimi.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-004
- c-003
  santrauka: 'Glapas, Varmių vadas, turėjo valdinį Steinavą, kurį labai mėgo ir daug kartų gelbėjo iš mirtino pavojaus.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie Glapo, varmių vado, mirtį ir varmių bei notangų pavergimą

      Glapas, varmių vadas, turėjo tokį valdinį, vardu Steinavas, kurį labai mėgo. Daug
    kartų jį buvo gelbėjęs iš mirtino pavojaus. Tačiau tas vyras, užmiršęs patirtas malones,
    atsiteisė blogu už gera ir neapykanta už meilę. Jis sugalvojo būdą, kaip  jį pribaigti,
    ir, norėdamas savo sumanymą įgyvendinti, pakvietė  jį pulti vienos pilies, stovėjusios
    Sembos žemėje, Gėlavandenių marių pakrantėje, beveik prieš Brandenburgo  pilį412,

      409 Konradas Vyresnysis  iš Tirbergo (Frankonija), 1267 m.— Santyro, vėliau —
    Kristburgo, Kulmo komtūras, nuo 1273 m.— Prūsijos krašto magistras.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003
- c-004
  santrauka: 'Prūsams vėl atkritus nuo tikėjimo, varmiai išsirinko Glapą savo kariuomenės vadu ir vyresniuoju.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    [dienos) išvakarėse, prūsai, matydami, jog broliai šiame mūšyje prarado daug jėgų,
    netekę brolių, ginklanešių, žirgų, ginklų ir visa kita, kas reikalinga karui, patyrę daug
    sunkių nelaimių ir aitrių nuoskaudų, vėl atkrito nuo tikėjimo ir tikinčiųjų, sugrįžo prie
    pirmykščių paklydimų, o savo kariuomenės vadais bei vyresniaisiais sembai išsirinko
    Glandą357, notangai — Herkų Mantą358, varmiai — Glapą359, pagudėnai — Auktumą360,
    bartai — Divaną361.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-005
- c-005
  santrauka: 'Varmių vadas Glapas, sužinojęs apie brolių išvykimą iš Brandenburgo pilies, su daugybe karių ją užėmė.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Kai
    traukė namo, sutiko pasiuntinį, kuris pasakė, kad Brandenburgo pilis esanti sunaikinta
    Štai šiuo būdu. Viena prūsė, vergų luomo ir Belialo duktė, pabėgo iš šios pilies ir pranešė
    Varmių vadui Glapui, kad broliai esą iš čia išvykę. Šis su daugybe karių atvyko ir užėmė
    pilį.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-006

## Ryšiai
- [[objektai/grupes/Varmiai]] paskyre Glapas
- Glapas uzeme [[objektai/vietos/Brandenburgo pilis]]
- Glapas mire [[objektai/vietos/Glapo kalva]]
- Glapas mire [[objektai/vietos/Karaliaučius]]
- [[objektai/asmenys/Steinavas]] buvo_priesas Glapas
- Glapas puole [[objektai/vietos/Semba]]
