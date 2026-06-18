---
tipas: grupe
pavadinimas: 'Krymo chanatas'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
  - 'Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)'
datos:
  - '1468 m.'
  - '1478 m.'
  - '1502 m.'
  - '1515 m.'
date_start: '1468'
date_end: '1515'
sukurta: ''
atnaujinta: ''
tags:
  - grupe
amziai:
  - 'XV'
  - 'XVI'
---
# Krymo chanatas

## Santrauka

Krymo chanatas šiame šaltinyje rodomas kaip Maskvos sąjungininkas prieš Lietuvą ir kaip nuo 1478 m. Turkijos vasalu tapęs totorių politinis darinys.

## Teiginiai

<a id="claim-t-05262"></a>
- t-001
  global_id: t-05262
  teiginys: 'Didysis Maskvos kunigaikštis Jonas III sudarė prieš Lietuvą sąjungą su Krymo chanatu.'
  teiginio_tipas: 'faktas'
  susije_objektai: 'mentioned_place: Krymas; mentioned_place: Dniepras; mentioned_place: Lietuva; mentioned_place: Maskva; mentioned_place: Turkija; mentioned_place: Viena'
  temporaliniai_duomenys: 'įvykio data: po 1478 m.; įvykio data: 1478 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma santykiui „Krymo chanatas susiję su Maskva“, o ne visam objekto laikotarpiui.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=83eb2cdd1770f4d97b876cc2585d4c74dd26ec5447fe46f166bce50a8bce3ca8; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/10_extract_groups_notes.md
  ryšio_patikimumas: susije_su -> Krymas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Krymo chanatas: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Krymas: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Krymo chanatas" parinktas kaip owner_note_path. Targetas "Krymas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-05263"></a>
- t-002
  global_id: t-05263
  teiginys: 'Nuo 1478 m. Krymo chanatas buvo Turkijos vasalas.'
  teiginio_tipas: 'faktas'
  susije_objektai: 'mentioned_place: Krymas; mentioned_place: Turkija; mentioned_place: Dniepras; mentioned_place: Lietuva; mentioned_place: Maskva; mentioned_place: Viena; llm_object: Turkija'
  semantiniai_rysiai: '[[objektai/grupes/Krymo chanatas|Krymo chanatas]] priklausė Turkija'
  temporaliniai_duomenys: 'įvykio data: po 1478 m.; įvykio data: 1478 m.'
  temporalinis_paaiskinimas: 'Ši data interpretuojama kaip įvykio data su riba „after“, o ne kaip tiksli pilna data. Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=83eb2cdd1770f4d97b876cc2585d4c74dd26ec5447fe46f166bce50a8bce3ca8; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/10_extract_groups_notes.md
  ryšio_patikimumas: priklause -> Turkija: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Krymo chanatas: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Turkija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Vasaliteto formuluotė tiesiogiai rodo Krymo chanato priklausomybę Turkijai.

<a id="claim-t-187448"></a>
- t-003
  global_id: t-187448
  teiginys: 'Nuo 1502 m. Krymo totoriai niokojo Naugarduko ir Vilniaus vaivadijas į šiaurę nuo Pripetės pelkių ir pasiekdavo LDK centrą.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra pilnas sakinys apie Krymo totorių žygių kryptį ir mastą nuo 1502 m. Nepridėta autoriaus dėmesio kovoms interpretacija.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Krymo totoriai|Krymo totoriai]]; mentioned_group: [[objektai/grupes/Totoriai|Totoriai]]; mentioned_place: Krymas; mentioned_place: Naugardukas; mentioned_place: Pripetė; mentioned_place: Vilnius; mentioned_place: Podolė; llm_object: Naugardukas; llm_object: Vilnius; llm_object: Podolė'
  temporaliniai_duomenys: 'įvykio data: iki 1502 m.; įvykio data: po 1502 m.; įvykio data: 1502 m.'
  temporalinis_paaiskinimas: 'Ši data interpretuojama kaip įvykio data su riba „before“, o ne kaip tiksli pilna data. Ši data interpretuojama kaip įvykio data su riba „after“, o ne kaip tiksli pilna data. Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys yra pilnas sakinys apie Krymo totorių žygių kryptį ir mastą nuo 1502 m. Nepridėta autoriaus dėmesio kovoms interpretacija.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=51d203404f0c1f59bde4837dd7c95bd6cf189ce9d22fad2902c3fb870cbd98a3; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/10_extract_groups_notes.md
  ryšio_patikimumas: susije_su -> Krymas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Krymo chanatas: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Krymas: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Krymo chanatas" parinktas kaip owner_note_path. Targetas "Krymas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-187449"></a>
- t-004
  global_id: t-187449
  teiginys: 'Ač-Girėjaus valdymo metais Krymo totorių sostinė buvo Solchatas, arba Senasis Krymas, prie Kafos.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Išskleistas vietovės paaiškinimas iš citatos ir sakinys paliktas apie Krymo chanato politinį centrą. Nepridėta dabartinės Feodosijos detalė.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Totoriai|Totoriai]]; mentioned_place: Krymas; mentioned_place: Solchatas'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=39d58346abbabd93cacf7101c272f2f75bbe7724ab209eb01bc23cc2e7dd29ba; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/10_extract_groups_notes.md
  ryšio_patikimumas: puole -> Naugardukas: 0.76
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Krymo totoriai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Naugardukas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Niokojimas Naugarduko vaivadijoje laikytinas tiesioginiu puolimu prieš šią vietovę.

<a id="claim-t-187710"></a>
- t-006
  global_id: t-187710
  teiginys: 'Perekopas buvo slaviškas sąsmaukos, jungiančios Krymo pusiasalį su žemynu, pavadinimas.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Teiginys yra pilnas sakinys apie Perekopo pavadinimą Krymo chanato geografiniame kontekste. Nepridėta etimologijos ar miesto tvirtovės istorijos.'
  susije_objektai: 'mentioned_place: Krymas; mentioned_group: [[objektai/grupes/Perekopo orda|Perekopo orda]]; mentioned_object: [[objektai/zodynas/chanas|chanas]]; mentioned_place: Isteris; mentioned_place: Kaukazas; mentioned_place: Perekopas; llm_object: [[objektai/grupes/Krymo chanatas|Krymo chanatas]]'
  semantiniai_rysiai: '[[objektai/grupes/Perekopo orda|Perekopo orda]] priklausė [[objektai/grupes/Krymo chanatas|Krymo chanatas]]'
  temporaliniai_duomenys: 'įvykio data: 1515 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys yra pilnas sakinys apie Perekopo pavadinimą Krymo chanato geografiniame kontekste. Nepridėta etimologijos ar miesto tvirtovės istorijos.'
  pagrindžia:
    - c-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: 564259-564807; hash=ed76e58ee137cac2b1d45d4de1c94ebcc4d708c0c8b758169ff7774b1fcc75fe; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: priklause -> Krymo chanatas: 0.80
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Perekopo orda: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Krymo chanatas: llm_allowed_candidate, group
  ryšio_paaiskinimas: Perekopo orda apibūdinama kaip Krymo chanato totoriai, todėl priklausomybės ryšys tiesiogiai pagrįstas.
- susijęs iš [[objektai/grupes/Auksinė Orda.md#claim-t-187704|Auksinė Orda]]: Aukso ordoje ulanais vadinosi chano giminės nariai iš tų linijų, kurių atstovams neteko sėdėti chanų soste.
- susijęs iš [[objektai/zodynas/ulan.md#claim-t-187552|ulan]]: Ulanas buvo feodalinis titulas, kuriuo vadinosi žymiausi chanų giminės totorių feodalai, turėję ulusus ir teisę dalyvauti chanų rinkimuose.
- susijęs iš [[objektai/zodynas/ulusas.md#claim-t-187531|ulusas]]: Ulusai buvo savos žemės valdos, kurias turėjo žymiausi chanų giminės totorių feodalai, vadinti ulanais.
## Reikšmingi paminėjimai

- c-001
  santrauka: 'Nuo 1502 m. Krymo totoriai niokojo Naugarduko ir Vilniaus vaivadijas į šiaurę nuo Pripetės pelkių ir pasiekdavo LDK centrą.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    BK autoriaus ypatingas dėmesys kovoms su Krymo totoriais,
    pradedant 1502 m., paaiškinamas, be kitko, tuo, kad iki 1502 m.
    Krymo totoriai tenkinosi pietinių LDK sričių — Podolės ir Voly­
    nės — niokojimu, o  nuo 1502 m. persim etė | šiaurę nuo Pripetės
    pelkių. ) dar nepažeistas ir palyginti tankiau gyvenam as Naugar­
    duko ir Vilniaus vaivadijas, pasiekdami pat| valstybės centrą.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-003

- c-002
  šaltinis: Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)
  citata_originali: |
    Vytauto pasirodymas Dniepro žemupio plotuose, užvaldymas
    anos klajoklių bei nomadų tautų (vengrų, pečeniegų, chazarų, po­
    lovcų-kumanų, pagaliau mongolų-totorių), viena po kitos šimtmečių
    bėgyje teriotos ar laikinai apgyventos stepės, turėjo atnešti čia
    pastovesnius santykius. Vytauto «arklių girdymas» Juodojoje
    jūroje ilgai pasiliko žmonių atminime. Gal būtų dar ir Kazimierui
    Jogailaičiui pasisekę pastoviau išlaikyti energingojo dėdės laimėji­
    mus prie Juodosios jūros, jeigu didysis Maskvos kunigaikštis (Jonas
    III) nebūtų sudaręs prieš Lietuvą sąjungos su Krymo chanato
    piktais totoriais, kurie nuo 1478 m. dar pasidarė ir Turkijos va­
    salais.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=51d203404f0c1f59bde4837dd7c95bd6cf189ce9d22fad2902c3fb870cbd98a3; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/10_extract_groups_notes.md
  ryšio_patikimumas: susije_su -> Krymas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Krymo chanatas: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Krymas: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Krymo chanatas" parinktas kaip owner_note_path. Targetas "Krymas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=83eb2cdd1770f4d97b876cc2585d4c74dd26ec5447fe46f166bce50a8bce3ca8; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/10_extract_groups_notes.md
  ryšio_patikimumas: susije_su -> Krymas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Krymo chanatas: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Krymas: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Krymo chanatas" parinktas kaip owner_note_path. Targetas "Krymas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-002

- c-003
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    44, past. 9.
    33 Ač-Girėjaus valdym o metais Krymo totorių sostinė buvo ne
    Perekopas. o Solchatas (Senasis Krymas) prie Kafos (dabartinės
    Feodosijos).
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=83eb2cdd1770f4d97b876cc2585d4c74dd26ec5447fe46f166bce50a8bce3ca8; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/10_extract_groups_notes.md
  ryšio_patikimumas: priklause -> Turkija: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Krymo chanatas: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Turkija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Vasaliteto formuluotė tiesiogiai rodo Krymo chanato priklausomybę Turkijai.
    - t-005
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=51d203404f0c1f59bde4837dd7c95bd6cf189ce9d22fad2902c3fb870cbd98a3; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/10_extract_groups_notes.md
  ryšio_patikimumas: susije_su -> Krymas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Krymo chanatas: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Krymas: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Krymo chanatas" parinktas kaip owner_note_path. Targetas "Krymas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-004

- c-004
  santrauka: 'Perekopas buvo slaviškas sąsmaukos, jungiančios Krymo pusiasalį su žemynu, pavadinimas.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    27 Perckopas — slaviškas pavadinimas sąsmaukos, jungiančios
    Krymo pusiasalį su žemynu. Dar senovėje gynybos tikslais ši są­
    smauka siauriausioje vietoje perkasta grioviu (iš to ir Perekopo
    vardas). Perekopu vadinamas taip  pat miestas siauriausioje sąsm au­
    kos vietoje, atsiradęs iš tvirtovės Ferch-Kermen arba Or-Kapl (tur­
    kiškai — Aukso vartai), kurią atnaujino Krymo chanas Mengll-Girė-
    ju s (1468— 1515 m.). BK Perekopo orda vadinami Krymo chanato
    totoriai, kurių kontroliuojam a teritorija siekė nuo Dunojaus žiočių
    110 Siaurės Kaukazo.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=39d58346abbabd93cacf7101c272f2f75bbe7724ab209eb01bc23cc2e7dd29ba; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/10_extract_groups_notes.md
  ryšio_patikimumas: puole -> Naugardukas: 0.76
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Krymo totoriai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Naugardukas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Niokojimas Naugarduko vaivadijoje laikytinas tiesioginiu puolimu prieš šią vietovę.
    - t-006
  irodymo_stiprumas: 0.00
  saltinio_vieta: 564259-564807; hash=ed76e58ee137cac2b1d45d4de1c94ebcc4d708c0c8b758169ff7774b1fcc75fe; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: priklause -> Krymo chanatas: 0.80
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Perekopo orda: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Krymo chanatas: llm_allowed_candidate, group
  ryšio_paaiskinimas: Perekopo orda apibūdinama kaip Krymo chanato totoriai, todėl priklausomybės ryšys tiesiogiai pagrįstas.

## Ryšiai
- Krymo chanatas priklause [[objektai/vietos/Turkija]]
- [[objektai/grupes/Perekopo orda]] priklause Krymo chanatas
