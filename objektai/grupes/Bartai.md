---
tipas: grupe
pavadinimas: 'Bartai'
saltiniai:
  - 'Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)'
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
  - 'Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)'
datos:
  - '1246 m.'
  - '1251 m.'
  - '1260 m.'
  - '1263 m.'
  - '1265 m.'
  - '1274 m.'
date_start: '1246'
date_end: '1274'
sukurta: ''
atnaujinta: ''
tags:
  - grupe
amziai:
  - 'XIII'
---
# Bartai

## Santrauka

Apie kiltinį susiskirstymą pas vakarinius baltus (prusus) jau galima kalbėti žymiai anksčiau, ir ten žinomi Lietuvos Užnemunėje sūduviai, Rytprūsiuose sembai, galindai, bartai, nadruviai, skalviai ir kt.

## Teiginiai

<a id="claim-t-88523"></a>
- t-001
  global_id: t-88523
  teiginys: 'Sūduviai sugriovė Bartenšteino pilį, kurioje, broliams pasitraukus, buvo įsikūrę bartai.'
  sudarymo_pagrindimas: 'Teiginys tiesiogiai paremtas citata apie Bartenšteino pilies sugriovimą.'
  susije_objektai: 'llm_object: Bartenšteinas; mentioned_place: Bartenšteinas; mentioned_group: [[objektai/grupes/Sūduviai|Sūduviai]]; mentioned_person: [[objektai/asmenys/Divanas|Divanas]]; mentioned_person: [[objektai/asmenys/Linkas|Linkas]]; mentioned_place: Kristburgas; mentioned_place: Kulmas; mentioned_place: Pilaitė'
  semantiniai_rysiai: '[[objektai/grupes/Bartai|Bartai]] gyveno Bartenšteinas'
  temporaliniai_duomenys: 'įvykio data: 1265 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys tiesiogiai paremtas citata apie Bartenšteino pilies sugriovimą.'
  pagrindžia:
    - c-001
    - c-003
    - c-006
    - c-007
    - c-014
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=58af4b122bd3bfec63bb207fc4bf2e541bb651f003f2d871473e57b983073b60; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: priklause -> Baltai: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Bartai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Baltai: llm_allowed_candidate, group
  ryšio_paaiskinimas: Teiginys tiesiogiai priskiria bartus vakariniams baltams.

<a id="claim-t-88524"></a>
- t-002
  global_id: t-88524
  teiginys: 'Bartų vadas Divanas, pravarde Klokinis, ir pagudėnas Linkas su didele kariuomene įsibrovė į Kulmo žemę.'
  sudarymo_pagrindimas: 'Teiginys aiškiai įvardija veikėjus, veiksmą ir vietą, kaip nurodyta citatoje.'
  susije_objektai: 'llm_object: Kulmas; mentioned_person: [[objektai/asmenys/Divanas|Divanas]]; mentioned_person: [[objektai/asmenys/Linkas|Linkas]]; mentioned_place: Kulmas; mentioned_place: Kristburgas; mentioned_place: Pilaitė'
  temporaliniai_duomenys: 'įvykio data: 1265 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys aiškiai įvardija veikėjus, veiksmą ir vietą, kaip nurodyta citatoje.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=8ae269b455176fd01d8718b376b04348d54f3173b55b5d816df57dd695244e88; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Barta: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Bartai: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Barta: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Bartai" parinktas kaip owner_note_path. Targetas "Barta" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-88525"></a>
- t-003
  global_id: t-88525
  teiginys: '1274 m. bartai kartu su pagudėnais, varmiais, notangais ir sembais grįžo į Bažnyčios bendruomenę ir davė įkaitų.'
  sudarymo_pagrindimas: 'Citata remia faktą apie bartų paklusimą ir įkaitus.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Notangai|Notangai]]; mentioned_group: [[objektai/grupes/Sembai|Sembai]]; mentioned_group: [[objektai/grupes/Nadruviai|Nadruviai]]; mentioned_object: [[objektai/daiktai/Ginklai|Ginklai]]; mentioned_object: [[objektai/zodynas/magistras|magistras]]; mentioned_person: [[objektai/asmenys/Maudelis|Maudelis]]; mentioned_place: Nadruva; mentioned_place: Vėluva'
  temporaliniai_duomenys: 'įvykio data: 1274 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Citata remia faktą apie bartų paklusimą ir įkaitus.'
  pagrindžia:
    - c-012
  irodymo_stiprumas: 0.00
  saltinio_vieta: 204694-205059; hash=c6c275a49a180bce2994f4d3e81b356c3e6d6cf72be37dd98a2b37734c668ddb; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: gyveno -> Barta: 0.93
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Bartai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Barta: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai sako, kad Bartoje gyveno bartai.

<a id="claim-t-88526"></a>
- t-004
  global_id: t-88526
  teiginys: 'Bartų vadas Divanas su aštuoniais šimtais vyrų apsiautė Senenzės pilį.'
  sudarymo_pagrindimas: 'Teiginys yra pilnas ir tiksliai perteikia citatoje aprašytą Divano veiksmą.'
  susije_objektai: 'llm_object: Senenzė; mentioned_person: [[objektai/asmenys/Divanas|Divanas]]; mentioned_place: Senenzė'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=ee6bc5da96362944caaf7e2d631c52968336a9f4219112d9b36e968f49e6c742; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Henrikas iš Svarcburgo: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Bartai: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Henrikas iš Svarcburgo: mention_match, person, gap=49
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Bartai" parinktas kaip owner_note_path. Targetas "Henrikas iš Svarcburgo" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-88527"></a>
- t-005
  global_id: t-88527
  teiginys: '1251 m. dokumente — Barta major et minor Didžiąja ir Mažąja Barta ir kurioje gyveno bartai, arba bartėnai.'
  sudarymo_pagrindimas: 'claim_quality_pipeline deterministic repair'
  susije_objektai: 'llm_object: Barta; mentioned_place: Barta'
  semantiniai_rysiai: '[[objektai/grupes/Bartai|Bartai]] gyveno Barta'
  temporaliniai_duomenys: 'gyvenimo laikotarpis: 1251 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „gyvenimo laikotarpis“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'claim_quality_pipeline deterministic repair'
  pagrindžia:
    - c-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=163b7d2001444dfd4d0bd75d5f9a360958a667441748506bc2f305c13c2c6ea2; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: paskyre -> Divanas: 0.86
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Bartai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Divanas: llm_allowed_candidate, person
  ryšio_paaiskinimas: Citatoje bartai nurodomi kaip išsirinkę Divaną savo vadu.

<a id="claim-t-88528"></a>
- t-006
  global_id: t-88528
  teiginys: 'Didžiojoje ir Mažojoje Bartoje gyveno bartai, dar vadinti bartėnais.'
  sudarymo_pagrindimas: 'Teiginys yra gramatiškas ir tiesiogiai paremtas citata apie Bartą ir bartus.'
  susije_objektai: 'llm_object: Barta; mentioned_place: Barta'
  semantiniai_rysiai: '[[objektai/grupes/Bartai|Bartai]] gyveno Barta'
  pagrindžia:
    - c-004
    - c-008
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=41805736afbafee5ed2298f5db71f69fec9703f1af5d77814f2544a56d460b00; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Divanas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Bartai: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Divanas: mention_match, person, gap=12
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Bartai" parinktas kaip owner_note_path. Targetas "Divanas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-88529"></a>
- t-007
  global_id: t-88529
  teiginys: 'Bartų vadas Divanas sutelkė stiprią kariuomenę ir dar kartą apiplėšė Kristburgo bei Marienburgo apylinkes.'
  sudarymo_pagrindimas: 'Citata remia aiškų teiginį apie Divano veiksmus.'
  susije_objektai: 'llm_object: Kristburgas; llm_object: Marienburgas; mentioned_person: [[objektai/asmenys/Divanas|Divanas]]; mentioned_place: Kristburgas; mentioned_place: Marienburgas; mentioned_place: Prūsų žemė'
  pagrindžia:
    - c-005
    - c-011
  irodymo_stiprumas: 0.00
  saltinio_vieta: 436799-437541; hash=a87e87e28df0b1b42e00b650839f8db7a073e1b4be612c0af8a252bc7867a47d; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Kulmas: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Linkas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Kulmas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo Linko įsiveržimą į Kulmo žemę.

<a id="claim-t-88530"></a>
- t-008
  global_id: t-88530
  teiginys: 'Per pilies puolimą brolis Arnoldas Krofas arbaleto strėle peršovė bartų vadui Divanui kaklą, o po Divano žūties kiti pasitraukė.'
  sudarymo_pagrindimas: 'Citata remia Divano sužeidimą ir puolimo baigtį.'
  susije_objektai: 'llm_object: [[objektai/asmenys/Divanas|Divanas]]; mentioned_person: [[objektai/asmenys/Divanas|Divanas]]; mentioned_object: [[objektai/daiktai/Arbaletas|Arbaletas]]; mentioned_person: [[objektai/asmenys/Arnoldas Krofas|Arnoldas Krofas]]; mentioned_place: Viena'
  pagrindžia:
    - c-015
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=b4136096bc044e09aad737f32fe6d53bb599190b08f18210a9fd5c8e4cebd176; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Kristburgas: 0.86
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Divanas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Kristburgas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata nurodo, kad Divanas apiplėšė Kristburgo apylinkes.

<a id="claim-t-88531"></a>
- t-009
  global_id: t-88531
  teiginys: 'Pamedėnai, pagudėnai, varmiai, notangai ir bartai grįžo į tikėjimą, davė broliams įkaitų ir iš naujo pasidavė.'
  sudarymo_pagrindimas: 'Pašalinta religinė ir autorinė įžanga, paliktas citata paremtas faktinis turinys.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Henrikas iš Svarcburgo|Henrikas iš Svarcburgo]]; mentioned_group: [[objektai/grupes/Notangai|Notangai]]; mentioned_person: [[objektai/asmenys/Henrikas Botelis|Henrikas Botelis]]; mentioned_place: Pomeranija; mentioned_place: Prūsija'
  temporaliniai_duomenys: 'įvykio data: po 1246 m.; įvykio data: 1246 m.; įvykio data: 1260 m.'
  temporalinis_paaiskinimas: 'Ši data interpretuojama kaip įvykio data su riba „after“, o ne kaip tiksli pilna data. Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Pašalinta religinė ir autorinė įžanga, paliktas citata paremtas faktinis turinys.'
  pagrindžia:
    - c-009
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=6cda43e9d9e109780b4e471a8ee5ffb13d3e7c6c14ebe164e214a110d9080fef; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: apgule -> Senenzė: 0.95
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Divanas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Senenzė: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad Divanas apsiautė Senenzės pilį.

<a id="claim-t-88532"></a>
- t-010
  global_id: t-88532
  teiginys: '1263 m. bartų vadas Divanas vijosi iš pilies pasitraukusius brolius ir su trylika vyrų juos užpuolė.'
  sudarymo_pagrindimas: 'Pradinis sakinys per ilgas ir nutrūkęs; citata remia glaustą faktą apie Divano veiksmą.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Divanas|Divanas]]; mentioned_place: Mazovija'
  temporaliniai_duomenys: 'įvykio data: 1263 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Pradinis sakinys per ilgas ir nutrūkęs; citata remia glaustą faktą apie Divano veiksmą.'
  pagrindžia:
    - c-013
  irodymo_stiprumas: 0.00
  saltinio_vieta: 462550-463132; hash=32e4fa402305aa2fe8109a4a3ac26a0b898942f5509cc1d381fa9c4224d51e1e; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Divanas: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Arnoldas Krofas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Divanas: llm_allowed_candidate, person
  ryšio_paaiskinimas: Citata tiesiogiai aprašo Arnoldo Krofo smūgį Divanui.

<a id="claim-t-88533"></a>
- t-011
  global_id: t-88533
  teiginys: 'Bartai buvo viena iš vakarinių baltų, arba prūsų, genčių, žinomų Rytprūsiuose.'
  susije_objektai: 'llm_object: [[objektai/grupes/Baltai|Baltai]]; mentioned_group: [[objektai/grupes/Baltai|Baltai]]; mentioned_place: Rytprūsiai; mentioned_place: Viena; mentioned_group: [[objektai/grupes/Skalviai|Skalviai]]; mentioned_place: Dauguva; mentioned_place: Latvija; mentioned_place: Lietuva; mentioned_place: Upytė; mentioned_place: Užnemunė; mentioned_place: Šiauliai'
  semantiniai_rysiai: '[[objektai/grupes/Bartai|Bartai]] priklausė [[objektai/grupes/Baltai|Baltai]]'
  pagrindžia:
    - c-010
  irodymo_stiprumas: 0.00
  saltinio_vieta: 436799-437541; hash=a87e87e28df0b1b42e00b650839f8db7a073e1b4be612c0af8a252bc7867a47d; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: gyveno -> Bartenšteinas: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Bartai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Bartenšteinas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Teiginys tiesiogiai nurodo, kad bartai buvo įsikūrę Bartenšteino pilyje.

<a id="claim-t-88534"></a>
- t-012
  global_id: t-88534
  teiginys: '1251 m. dokumente Barta minima kaip didžioji ir mažoji Barta.'
  sudarymo_pagrindimas: 'Citata remia trumpą faktą apie Bartos pavadinimą dokumente.'
  susije_objektai: 'mentioned_place: Barta'
  temporaliniai_duomenys: 'įvykio data: 1251 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Citata remia trumpą faktą apie Bartos pavadinimą dokumente.'
  pagrindžia:
    - c-008
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=59ae49fc8df63793e58690ed42c1e745c531dd4dceccaa7766cdf4fe865b7438; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Notangai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Bartai: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Notangai: mention_match, group, gap=38
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Bartai" parinktas kaip owner_note_path. Targetas "Notangai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-88535"></a>
- t-013
  global_id: t-88535
  teiginys: 'Po prūsų atkritimo nuo krikščionių tikėjimo bartai savo kariuomenės vadu išsirinko Divaną.'
  sudarymo_pagrindimas: 'Citata tiesiogiai nurodo bartų vado išrinkimą.'
  susije_objektai: 'llm_object: [[objektai/asmenys/Divanas|Divanas]]; mentioned_person: [[objektai/asmenys/Divanas|Divanas]]; mentioned_group: [[objektai/grupes/Notangai|Notangai]]; mentioned_group: [[objektai/grupes/Pagudėnai|Pagudėnai]]; mentioned_group: [[objektai/grupes/Prūsai|Prūsai]]; mentioned_group: [[objektai/grupes/Sembai|Sembai]]; mentioned_group: [[objektai/grupes/Varmiai|Varmiai]]; mentioned_object: [[objektai/daiktai/Ginklai|Ginklai]]; mentioned_person: [[objektai/asmenys/Herkus Mantas|Herkus Mantas]]'
  semantiniai_rysiai: '[[objektai/grupes/Bartai|Bartai]] paskyrė [[objektai/asmenys/Divanas|Divanas]]'
  pagrindžia:
    - c-014
  irodymo_stiprumas: 0.00
  saltinio_vieta: 204694-205059; hash=c6c275a49a180bce2994f4d3e81b356c3e6d6cf72be37dd98a2b37734c668ddb; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: gyveno -> Barta: 0.96
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Bartai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Barta: llm_allowed_candidate, place
  ryšio_paaiskinimas: Teiginyje tiesiogiai sakoma, kad Bartoje gyveno bartai.

<a id="claim-t-184473"></a>
- t-014
  global_id: t-184473
  teiginys: 'Bartai Numa ir Derska, pabėgę iš Prūsijos į Lietuvą, išdavė lietuvių būrius, tikėdamiesi kryžiuočių atleidimo.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Citata pagrindžia bartų Numos ir Derskos vaidmenį, o teiginys turi OCR klaidų ir neaiškių įvardžių.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Kryžiuočių ordinas|Kryžiuočių ordinas]]; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_person: [[objektai/asmenys/Numa|Numa]]; mentioned_place: Prūsija; mentioned_place: Prūsų žemė; mentioned_place: Lenkija'
  pagrindžia:
    - c-016
  irodymo_stiprumas: 0.00
  saltinio_vieta: 267638-268137; hash=d7e99f28fd8df7282b460fc03d25bd39cf6825bdd8206eefe3c57da936bcdf73; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Kryžiuočių ordinas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Bartai: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Kryžiuočių ordinas: mention_match, group, gap=89
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Bartai" parinktas kaip owner_note_path. Targetas "Kryžiuočių ordinas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
- susijęs iš [[objektai/asmenys/Derska.md#claim-t-60100|Derska]]: Derska su Numa tarpininkavo bartams, kad broliai grąžintų į nelaisvę paimtas jų žmonas ir vaikus.
- susijęs iš [[objektai/asmenys/Ditrichas (Sembos fogtas).md#claim-t-59840|Ditrichas (Sembos fogtas)]]: Sembos fogtui Ditrichui nepatiko, kad broliai bartams grąžino į nelaisvę paimtas žmonas ir vaikus.
- susijęs iš [[objektai/asmenys/Divanas.md#claim-t-184055|Divanas]]: 1263 m. Divanas, bartų vadas, vijosi iš pilies pasitraukusius brolius, bet buvo sunkiai sužeistas ir liovėsi kariavęs.
- susijęs iš [[objektai/asmenys/Divanas.md#claim-t-59910|Divanas]]: Divanas, pravarde Klokinis, buvo bartų vadas ir su pagudėnu Linku bei didele kariuomene įsibrovė į Kulmo žemę.
- susijęs iš [[objektai/asmenys/Divanas.md#claim-t-59911|Divanas]]: 1263 m. Divanas, bartų vadas, vijosi iš pilies pasitraukusius brolius, bet buvo sunkiai sužeistas ir liovėsi kariavęs.
- susijęs iš [[objektai/asmenys/Divanas.md#claim-t-59913|Divanas]]: Divanas, bartų vadas, su 800 vyrų apsiautė Senenzės pilį ir reikalavo ją atiduoti.
- susijęs iš [[objektai/asmenys/Linkas.md#claim-t-60375|Linkas]]: Pagudėnas Linkas su bartų vadu Divanu ir didele kariuomene įsibrovė į Kulmo žemę.
- susijęs iš [[objektai/asmenys/Numa.md#claim-t-60185|Numa]]: Numa ir Derska tarpininkavo bartams, kad broliai grąžintų į nelaisvę paimtas jų žmonas ir vaikus.
- susijęs iš [[objektai/grupes/Notangai.md#claim-t-78405|Notangai]]: 1274 m. notangai kartu su pagudėnais, varmiais, bartais ir sembais grįžo į Bažnyčios visuotinybę ir davė įkaitų.
- susijęs iš [[objektai/grupes/Notangai.md#claim-t-78407|Notangai]]: Pamedėnai, pagudėnai, varmiai, notangai ir bartai sugrįžo į tikėjimą, davė broliams įkaitų ir iš naujo pasidavė.
- susijęs iš [[objektai/grupes/Pagudėnai.md#claim-t-89157|Pagudėnai]]: 1274 m. pagudėnai kartu su varmiais, notangais, bartais ir sembais grįžo į Bažnyčios visuotinybę ir davė įkaitų.
- susijęs iš [[objektai/grupes/Pagudėnai.md#claim-t-89169|Pagudėnai]]: Pamedėnai, pagudėnai, varmiai, notangai ir bartai sugrįžo į tikėjimą, davė broliams įkaitų ir iš naujo pasidavė.
- susijęs iš [[objektai/grupes/Pagudėnai.md#claim-t-89171|Pagudėnai]]: Pagudėnas Linkas su bartų vadu Divanu ir didele kariuomene įsibrovė į Kulmo žemę.
- susijęs iš [[objektai/grupes/Pamedėnai.md#claim-t-78424|Pamedėnai]]: Pamedėnai, pagudėnai, varmiai, notangai ir bartai sugrįžo į tikėjimą, davė broliams įkaitų ir iš naujo pasidavė.
- susijęs iš [[objektai/grupes/Sembai.md#claim-t-175091|Sembai]]: 1274 m. sembai kartu su pagudėnais, varmiais, notangais ir bartais grįžo į Bažnyčios visuotinybę ir davė įkaitų.
- susijęs iš [[objektai/grupes/Varmiai.md#claim-t-78535|Varmiai]]: 1274 m. varmiai kartu su pagudėnais, notangais, bartais ir sembais grįžo į Bažnyčios vienybę ir davė įkaitų.
- susijęs iš [[objektai/grupes/Varmiai.md#claim-t-78540|Varmiai]]: Varmės, Notangos ir Bartos prūsai, nusilpninti brolių ir kunigaikščio, davė įkaitų ir pasidavė tikėjimui bei broliams.
- susijęs iš [[objektai/grupes/Varmiai.md#claim-t-78547|Varmiai]]: Pamedėnai, pagudėnai, varmiai, notangai ir bartai sugrįžo į tikėjimą, davė broliams įkaitų ir iš naujo pasidavė.
- susijęs iš [[objektai/ivykiai/Antrojo prūsų sukilimo pradžia ir krikščionių žudynės (1260 m.).md#claim-t-66455|Antrojo prūsų sukilimo pradžia ir krikščionių žudynės (1260 m.)]]: 1260 m. prūsai vėl atkrito nuo krikščionių tikėjimo, o sembai, notangai, varmiai, pagudėnai ir bartai išsirinko savo vadus.
- susijęs iš [[objektai/ivykiai/Bartų sugrįžimas pas brolius ir lietuvių išžudymas.md#claim-t-66483|Bartų sugrįžimas pas brolius ir lietuvių išžudymas]]: Kai broliai rengėsi pulti Gardino pilį, iš Pagudės pabėgę bartai su lietuviais surengė žygį prieš Lenkiją.
- susijęs iš [[objektai/ivykiai/Ketvirtosios atskalūnybės sąmokslas.md#claim-t-183930|Ketvirtosios atskalūnybės sąmokslas]]: Ketvirtosios atskalūnybės sąmokslas buvo susektas statant Ragainės pilį, o kaltinami bartai ir pagudėnai buvo nubausti.
- susijęs iš [[objektai/ivykiai/Ketvirtosios atskalūnybės sąmokslas.md#claim-t-62823|Ketvirtosios atskalūnybės sąmokslas]]: Ketvirtosios atskalūnybės sąmokslas buvo susektas statant Ragainės pilį, o kaltinami bartai ir pagudėnai buvo nubausti.
- susijęs iš [[objektai/ivykiai/Varmių, notangų ir bartų pasidavimas ir kelių pilių pastatymas (1241 m.).md#claim-t-66944|Varmių, notangų ir bartų pasidavimas ir kelių pilių pastatymas (1241 m.)]]: 1241 m. Varmės, Notangos ir Bartos prūsai pasidavė tikėjimui ir Ordino broliams, o broliai pastatė Kroicburgo, Bartenšteino, Vizenburgo ir Rezlio pilis.
- susijęs iš [[objektai/ivykiai/Žygis prieš varmius, notangus ir bartus ir brolių žūtis prie būsimos Baigos.md#claim-t-67028|Žygis prieš varmius, notangus ir bartus ir brolių žūtis prie būsimos Baigos]]: Žygyje prieš varmius, notangus ir bartus broliai prie būsimos Baigos apiplėšė kaimus, o prūsai juos užpuolė ir išžudė.
- susijęs iš Barta: 1251 m. dokumente Barta minima kaip Didžioji ir Mažoji Barta, kurioje gyveno bartai arba bartėnai.
- susijęs iš [[objektai/asmenys/Auktumas.md#claim-t-60242|Auktumas]]: Prūsams atkritus nuo tikėjimo, pagudėnai savo kariuomenės vadu ir vyresniuoju išsirinko Auktumą.
- susijęs iš [[objektai/asmenys/Derska.md#claim-t-184690|Derska]]: Prūsų didikas Derska, pabėgęs iš Prūsijos, gyveno Lietuvoje ir tikėjosi kryžiuočių atleidimo už naują išdavystę.
- susijęs iš [[objektai/asmenys/Divanas.md#claim-t-59914|Divanas]]: Prūsams atkritus nuo tikėjimo, bartai savo kariuomenės vadu ir vyresniuoju išsirinko Divaną.
- susijęs iš [[objektai/asmenys/Glanda.md#claim-t-60294|Glanda]]: Prūsams vėl atkritus nuo tikėjimo, sembai išsirinko Glandą savo kariuomenės vadu ir vyresniuoju.
- susijęs iš [[objektai/asmenys/Glapas.md#claim-t-89793|Glapas]]: Prūsams vėl atkritus nuo tikėjimo, varmiai išsirinko Glapą savo kariuomenės vadu ir vyresniuoju.
- susijęs iš [[objektai/asmenys/Herkus Mantas.md#claim-t-175187|Herkus Mantas]]: Notangai Herkų Mantą išsirinko savo kariuomenės vadu ir vyresniuoju po prūsų atkritimo nuo tikėjimo.
- susijęs iš [[objektai/asmenys/Kaltis.md#claim-t-60152|Kaltis]]: Kaltis buvo paskirtas pėstininkų, paliktų Traupeino pilies apgulai, vadu.
- susijęs iš [[objektai/asmenys/Maudelis.md#claim-t-60386|Maudelis]]: Maudelis buvo Vėluvos pilininko Tirsko sūnus.
- susijęs iš [[objektai/asmenys/Tirskas.md#claim-t-60069|Tirskas]]: Tirskas, Maudelio tėvas ir Vėluvos pilininkas, su visais artimaisiais pasidavė tikėjimui ir Ordino broliams.
- susijęs iš [[objektai/grupes/Elbingo miestiečiai.md#claim-t-183880|Elbingo miestiečiai]]: Kai Elbingo miestiečiai per daug nutolo nuo miesto, pagudėnai iš pasalos atkirto jiems kelią atgal.
- susijęs iš [[objektai/grupes/Elbingo miestiečiai.md#claim-t-62994|Elbingo miestiečiai]]: Pagudėnų persekiojami Elbingo miestiečiai pasitraukė į Liefardo malūną, kuris buvo įtvirtintas tarsi pilis.
- susijęs iš [[objektai/grupes/Elbingo miestiečiai.md#claim-t-62995|Elbingo miestiečiai]]: 1273 m. Elbingo miestiečiai vijosi prie miesto pasirodžiusius pagudėnų raitelius ir vieną kitą nukovė.
- susijęs iš [[objektai/grupes/Kryžiuočių ordinas.md#claim-t-178959|Kryžiuočių ordinas]]: Varmės, Notangos ir Bartos prūsams pasidavus, Kryžiuočių ordino broliai pastatė Kroicburgo, Bartenšteino, Vizenburgo ir Rezlio pilis.
- susijęs iš [[objektai/grupes/Nadruviai.md#claim-t-65942|Nadruviai]]: Po Tirsko pasidavimo daug kilmingų Nadruvos vyrų su šeimynomis atėjo pas brolius, priėmė krikštą ir išsižadėjo stabų.
- susijęs iš [[objektai/grupes/Notangai.md#claim-t-78409|Notangai]]: Prūsams vėl atkritus nuo tikėjimo, notangai savo kariuomenės vadu ir vyresniuoju išsirinko Herkų Mantą.
- susijęs iš [[objektai/grupes/Pagudėnai.md#claim-t-89159|Pagudėnai]]: 1273 m. pagudėnai paslėpė kariuomenę miške prie Elbingo ir iš pasalos atkirto miestiečiams kelią į miestą.
- susijęs iš [[objektai/grupes/Pagudėnai.md#claim-t-89162|Pagudėnai]]: Prūsams vėl atkritus nuo tikėjimo, pagudėnai savo kariuomenės vadu ir vyresniuoju išsirinko Auktumą.
- susijęs iš [[objektai/grupes/Sembai.md#claim-t-175082|Sembai]]: Sembai priklausė sembų-notangų kultūrinei grupei, kurioje išskiriamos sembų, varmių, notangų, pagudėnų ir pamedėnų gentinės teritorijos.
- susijęs iš [[objektai/grupes/Sembai.md#claim-t-175104|Sembai]]: Prūsams vėl atkritus nuo tikėjimo, sembai savo kariuomenės vadu ir vyresniuoju išsirinko Glandą.
- susijęs iš [[objektai/grupes/Varmiai.md#claim-t-78541|Varmiai]]: Po prūsų atkritimo nuo tikėjimo varmiai savo kariuomenės vadu ir vyresniuoju išsirinko Glapą.
- susijęs iš [[objektai/ivykiai/Bartų sugrįžimas pas brolius ir lietuvių išžudymas.md#claim-t-66482|Bartų sugrįžimas pas brolius ir lietuvių išžudymas]]: Numa ir Derska pelnė brolių palankumą, pasitiko lietuvių kariuomenę, išžudė lietuvius ir grobį išsigabeno į Pagudę.
- susijęs iš [[objektai/ivykiai/Divano ir Linko žygis prie Traupeino, mūšis prie Pagansčių ir Kristburgo sunaikinimas.md#claim-t-66520|Divano ir Linko žygis prie Traupeino, mūšis prie Pagansčių ir Kristburgo sunaikinimas]]: Divano ir Linko puolimas Kulmo žemėje datuojamas 1271 m.
- susijęs iš [[objektai/ivykiai/Divano ir Linko žygis prie Traupeino, mūšis prie Pagansčių ir Kristburgo sunaikinimas.md#claim-t-66522|Divano ir Linko žygis prie Traupeino, mūšis prie Pagansčių ir Kristburgo sunaikinimas]]: Divanas Klokinis ir Linkas su didele kariuomene įsibrovė į Kulmo žemę, o jų pajėgos patraukė prie Traupeino pilies.
- susijęs iš [[objektai/ivykiai/Gedimino kariuomenės mėginimas likviduoti Bajerburgą (1337 m.).md#claim-t-62787|Gedimino kariuomenės mėginimas likviduoti Bajerburgą (1337 m.)]]: 1337 m. Gedimino kariuomenė siekė likviduoti Bajerburgą, Ordino agresijos židinį prie Nemuno šalia Veliuonos.
- susijęs iš [[objektai/ivykiai/Liefardo malūno paėmimas ir Elbingo miestiečių žūtis.md#claim-t-62856|Liefardo malūno paėmimas ir Elbingo miestiečių žūtis]]: 1273 m. pagudėnai surengė pasalą prie Elbingo ir privertė miestiečius pasitraukti į įtvirtintą Liefardo malūną.
- susijęs iš [[objektai/ivykiai/Nadruvos karo pradžia ir kilmingųjų Nadruvos vyrų atsivertimas.md#claim-t-62882|Nadruvos karo pradžia ir kilmingųjų Nadruvos vyrų atsivertimas]]: 1274 m. magistras ir broliai, siekdami praplėsti krikščionių žemių ribas, nukreipė ginklus prieš nadruvius.
- susijęs iš [[objektai/ivykiai/Senenzės pilies apgula ir Divano žūtis.md#claim-t-66894|Senenzės pilies apgula ir Divano žūtis]]: Bartų vadas Divanas su aštuoniais šimtais vyrų apsiautė Senenzės pilį, bet brolis Arnoldas Krofas jį mirtinai peršovė arbaletu.
- susijęs iš [[objektai/ivykiai/Senenzės pilies apgula ir Divano žūtis.md#claim-t-66895|Senenzės pilies apgula ir Divano žūtis]]: Bartų puolimas prieš Senenzės pilį įvyko apie 1272 m.
- susijęs iš [[objektai/ivykiai/Skomanto 9 dienų žygis, Nineriko išdavystė ir Eimsučio bei Cipelio pilių sunaikinimas.md#claim-t-66896|Skomanto 9 dienų žygis, Nineriko išdavystė ir Eimsučio bei Cipelio pilių sunaikinimas]]: Kronikos komentare spėjama, kad su Skomanto sūduviais žygiavo Gardino ar Naugarduko žemių kariai, pavaldūs Lietuvai.
- susijęs iš [[objektai/ivykiai/Vizenburgo pilies kautynės ir apleidimas (1263 m.).md#claim-t-62951|Vizenburgo pilies kautynės ir apleidimas (1263 m.)]]: 1263 m. Vizenburgo pilies gynėjai, pristigę maisto, su ginklanešiais paliko pilį ir slapta pasitraukė Mazovijos link.
- susijęs iš [[objektai/paprociai/Baltų jungtiniai karo veiksmai prieš Kryžiuočių ordiną.md#claim-t-59727|Baltų jungtiniai karo veiksmai prieš Kryžiuočių ordiną]]: Dalis nadruvių, pagudėnų, sūduvių ir bartų pasitraukė į Lietuvos valstybę ir dalyvavo kovoje prieš Ordino bei Aukso ordos agresiją.
- susijęs iš [[objektai/paprociai/Elbingo miestiečių nuolatinis ginklų laikymas prie savęs.md#claim-t-62674|Elbingo miestiečių nuolatinis ginklų laikymas prie savęs]]: 1273 m. Elbingo miestiečiai nuolat laikė prie savęs kovai parengtus ginklus ir vijosi prie miesto pasirodžiusius pagudėnų raitelius.
- susijęs iš [[objektai/posakiai/krikšto prikelti naujam gyvenimui.md#claim-t-184035|krikšto prikelti naujam gyvenimui (krikštas, XIII a.)]]: 1274 m. daug galingų ir kilmingų Nadruvos vyrų su šeimomis atėjo pas brolius, priėmė krikštą ir išsižadėjo stabų.
- susijęs iš [[objektai/posakiai/krikšto prikelti naujam gyvenimui.md#claim-t-59118|krikšto prikelti naujam gyvenimui (krikštas, XIII a.)]]: 1274 m. daug galingų ir kilmingų Nadruvos vyrų su šeimomis atėjo pas brolius, priėmė krikštą ir išsižadėjo stabų.
- susijęs iš Baiga: 1260 m. nuo tikėjimo atsimetę varmiai, notangai ir bartai kelis kartus puolė Baigą ir grobė brolių arklius bei gyvulius.
- susijęs iš Bartenšteinas: Bartos žemėje Vokiečių ordino broliai pastatė Bartenšteino, Vizenburgo ir Rezlio pilis.
- susijęs iš Bartenšteinas: Bartos žemėje Vokiečių ordino broliai pastatė Bartenšteino, Vizenburgo ir Rezlio pilis.
- susijęs iš Eimsutis: Skomantas pasuko link Eimsučio pilies ir po veržlaus antpuolio ją užėmė, nukaudamas 40 jos sargybinių.
- susijęs iš Elbingas: 1273 m. pagudėnai paslėpė kariuomenę miške netoli Elbingo ir pasala atkirto miestiečiams kelią į miestą.
- susijęs iš Kulmo žemė: Divanas Klokinis ir pagudėnas Linkas su didele kariuomene įsibrovė į Kulmo žemę.
- susijęs iš Nadruva: 1274 m. Ordino magistras ir broliai nukreipė ginklus prieš nadruvius, o daug kilmingų Nadruvos vyrų priėmė krikštą.
- susijęs iš Nadruva: Po Tirsko pasidavimo daug galingų ir kilmingų Nadruvos vyrų su šeimynomis perėjo pas brolius ir buvo pakrikštyti.
- susijęs iš Nadruva: 1274 m. magistras ir broliai nukreipė savo ginklus prieš nadruvius.
- susijęs iš Rezlis: Ordino broliai Bartos žemėje pastatė tris pilis: Bartenšteino, Vizenburgo ir Rezlio.
- susijęs iš Rezlis: Ordino broliai Bartos žemėje pastatė tris pilis: Bartenšteino, Vizenburgo ir Rezlio.
- susijęs iš Senenzė: Bartų vadas Divanas su 800 vyrų apsiautė Senenzės pilį ir reikalavo ją atiduoti.
- susijęs iš Traupeinas: Traupeino pilis buvo tarp Kristburgo ir Marienburgo, o pagudėnai ją apgulė Divano žygio metu.
- susijęs iš Vizenburgas: Broliai Bartos žemėje pastatė tris pilis: Bartenšteino, Vizenburgo ir Rezlio.
- susijęs iš Vizenburgas: 1263 metais Vizenburgo pilį paliko maisto pristigę broliai su ginklanešiais, pasitraukę Mazovijos kunigaikštystės link.
- susijęs iš Vizenburgas: Vizenburgo pilis beveik trejus metus buvo prūsų apsupta ir kasdien puolama trimis apgulos mašinomis.
- susijęs iš Vizenburgas: Broliai Bartos žemėje pastatė tris pilis: Bartenšteino, Vizenburgo ir Rezlio.
- susijęs iš [[objektai/zodynas/bažnyčios visuotinybė.md#claim-t-58895|bažnyčios visuotinybė]]: 1274 m. pagudėnai, varmiai, notangai, bartai ir sembai grįžo į šventosios motinos bažnyčios visuotinybę.
- susijęs iš [[objektai/asmenys/Derska.md#claim-t-60100|Derska]]: Derska su Numa tarpininkavo bartams, kad broliai grąžintų į nelaisvę paimtas jų žmonas ir vaikus.
## Reikšmingi paminėjimai

- c-001
  santrauka: 'Bartų vadas Divanas, pravarde Klokinis, ir pagudėnas Linkas su didele kariuomene įsibrovė į Kulmo žemę.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie dvylikos brolių ir penkių šimtų vyrų žūtį, apie Kristburgo miesto, pa­
         medėnų pilaitės ir brolių papilio sunaikinimą bei daugybės krikščionių žūtį

      Divanas, pravarde Klokinis418, bartų vadas, ir pagudėnas Linkas su didele kariuomene
    įsibrovė  į Kulmo žemę; kai dėl šios kariuomenės triukšmo Kristburgo broliai bei kiti
    susibūrė Kulmo žemėje, pagudėnai, laikydamiesi ankstesnio Divano įsakymo, su stipria
    raitelių bei pėstininkų kariuomene patraukė prie pilies, vardu Traupeinas419, buvusios
    tarp Kristburgo ir Marienburgo420; jos apgulai paliko čia pėstininkus ir jų vadu paskyrė
    kažkokį  Kaltį, o  raiteliai nužygiavo  ligi valsčiaus, vardu Aliamas421, kuriame dabar
      416  Ditrichas iš Rodės Kristburgo komtūru buvo 1262—1265 m.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
    - t-001
- c-002
  santrauka: 'Bartų vadas Divanas su aštuoniais šimtais vyrų apsiautė Senenzės pilį.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    165 (160). Apie Senenzės pilies puolimą ir ir bartų vado Divano žūtį

      Tuo tarpu Divanas, bartų vadas, su aštuoniais šimtais vyrų apsiautė Senenzės pilį444 ir
    prisiekė savo dievų galybe, kad iškarsiąs brolius bei jų ginklanešius ties pilies vartais, jeigu
    jie bematant neatiduosią jam pilies. Šioje pilyje tebuvo trys broliai ir keletas ginklanešių,
    pastaruosius broliai apvilko savo vienuoliškais apsiaustais ir įteikė jiems savo skydelius,
    tikėdamiesi įvarysią priešams baimės, kai atrodys, jog pilyje daugiau brolių.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-004
- c-003
  santrauka: 'Sūduviai sugriovė Bartenšteino pilį, kurioje, broliams pasitraukus, buvo įsikūrę bartai.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    173 (168). Apie antrąjį Bartenšteino pilies sugriovimą

      Sūduviai, išgirdę, kad bartai, varmiai bei kiti prūsai vėl pakluso tikėjimui ir broliams,
    labai įtūžo ir, atžygiavę su didele kariuomene, staiga apsiautė Bartenšteino pilį, kurioje,
    broliams iš jos pasitraukus, buvo įsikūrę bartai; jie sugriovė ją, išžudę ar išsivarę  į
    nelaisvę visus gyventojus, ir net pelenais pavertė.




          174 (169).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-004
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    dokumente — Barta major et minor

    Didžiąja ir Mažąja Barta ir kurioje gyveno bartai, arba bartėnai. Vargu ar kuri šių giminių
    buvo tokia nedidelė, kad karui negalėtų sutelkti dviejų tūkstančių raitųjų vyrų ir daug
    tūkstančių karių. Semba, turtingiausia  ir tirščiausiai gyvenama žemė, galėjo sutelkti
    keturis tūkstančius raitelių ir keturiasdešimt tūkstančių karių.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-006
    - t-005
- c-005
  santrauka: 'Bartų vadas Divanas sutelkė stiprią kariuomenę ir dar kartą apiplėšė Kristburgo bei Marienburgo apylinkes.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    144 (139). Apie daugybės prūsų žūtį

      Mūsų jau minėtas Divanas, po senovei ištroškęs krikščionių kraujo, sutelkė stiprią
    kariuomenę ir iš naujo apiplėšė Kristburgo bei Marienburgo apylinkes, manydamas, kad
    ir dabar jam taip seksis kaip anksčiau. Mat, tiek brolių bei kitų krikščionių išžudęs arba
    paėmęs  į nelaisvę, manė, jog nebeliko tose žemėse nieko, kas galėtų jam priešintis.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-007
- c-006
  santrauka: 'Sūduviai sugriovė Bartenšteino pilį, kurioje, broliams pasitraukus, buvo įsikūrę bartai.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie šią skaudžią nelaimę, dievo lemtą broliams bei jų žmonėms, išgirdo Vokietijos
    kunigaikščiai, kurie pajuto jiems begalinį palankumą. Įvyko šitaip todėl, kad pats Kristus,
    kuris ir plaka, ir gydo, savo dvasios malonėmis sujaudino kai kuriems kunigaikščiams
    širdis, tad  į Prūsijos žemę įsiveržė Brandenburgo markgrafas 1251 viešpaties metais
    ir Merzeburgo vyskupas310 bei grafas Henrikas iš Svarcburgo kitais metais su daugybe
    karių, o šių paskiri būriai niokodami žygiavo per minėtųjų atsimetėlių žemes, degindami ir
    grobstydami, žudydami ir imdami į nelaisvę, kol šie taip buvo nukamuoti, kad nebegalėjo
    nė atsikvėpti. Nuo tol pamedėnai, pagudėnai, varmiai, notangai ir bartai311, šitaip viską
    patvarkius viešpačiui Jėzui Kristui, kurio rankose aukščiausia visų karalysčių valdžia ir
    teisė, sugrįžo į tikėjimą ir, davę broliams įkaitų, iš naujo pasidavė.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-007
  santrauka: 'Sūduviai sugriovė Bartenšteino pilį, kurioje, broliams pasitraukus, buvo įsikūrę bartai.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Tuo tarpu Divanas, bartų vadas, su aštuoniais šimtais vyrų apsiautė Senenzės pilį444 ir
    prisiekė savo dievų galybe, kad iškarsiąs brolius bei jų ginklanešius ties pilies vartais, jeigu
    jie bematant neatiduosią jam pilies. Šioje pilyje tebuvo trys broliai ir keletas ginklanešių,
    pastaruosius broliai apvilko savo vienuoliškais apsiaustais ir įteikė jiems savo skydelius,
    tikėdamiesi įvarysią priešams baimės, kai atrodys, jog pilyje daugiau brolių. Kai šitai
    padarė, kai viena šalis parengė visa, kas reikalinga piliai pulti, o kita — kas reikalinga
    gynybai, prasidėjo puolimas; krito daug priešų, sužeistų ir nukautų, o brolis Arnoldas
    Krofas, leisdamas strėles iš arbaleto, peršovė minėtajam Divanui kaklą.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-008
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    201 D.— Barta et Plicka Bartha, que nunc major et minor Bartka dicitur, Jer.— Bartin,
    Plicke Bartin, grôz Bartin unde kleine. 1251 m. dokumente — Barta major et minor
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-012
    - t-006
- c-009
  santrauka: 'Pamedėnai, pagudėnai, varmiai, notangai ir bartai grįžo į tikėjimą, davė broliams įkaitų ir iš naujo pasidavė.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Įvyko šitaip todėl, kad pats Kristus,
    kuris ir plaka, ir gydo, savo dvasios malonėmis sujaudino kai kuriems kunigaikščiams
    širdis, tad  į Prūsijos žemę įsiveržė Brandenburgo markgrafas 1251 viešpaties metais
    ir Merzeburgo vyskupas310 bei grafas Henrikas iš Svarcburgo kitais metais su daugybe
    karių, o šių paskiri būriai niokodami žygiavo per minėtųjų atsimetėlių žemes, degindami ir
    grobstydami, žudydami ir imdami į nelaisvę, kol šie taip buvo nukamuoti, kad nebegalėjo
    nė atsikvėpti. Nuo tol pamedėnai, pagudėnai, varmiai, notangai ir bartai311, šitaip viską
    patvarkius viešpačiui Jėzui Kristui, kurio rankose aukščiausia visų karalysčių valdžia ir
    teisė, sugrįžo į tikėjimą ir, davę broliams įkaitų, iš naujo pasidavė. Tuo pat metu ir dėl
    tos pačios priežasties ir Sventopelkas, Pomeranijos kunigaikštis, pavargęs nuo pastangų
      307 Henrikas Botelis Prūsijoje (Elbinge) žinomas nuo 1246 m., žuvo 1260 m.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-009
- c-010
  šaltinis: Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)
  citata_originali: |
    Latviją). Iškilo dar didesnė kilčių diferenciacija.
    Apie kiltinį susiskirstymą pas vakarinius baltus (prusus) jau
    galima kalbėti žymiai anksčiau, ir ten žinomi Lietuvos Užnemunėje
    sūduviai, Rytprūsiuose sembai, galindai, bartai, nadruviai, skalviai
    ir kt.
    Lietuvos ir Latvijos teritorijoje rytiniai baltai ilgiau sudarė
    vieną kamieną, bet ir čia nuo V-VI amž. po Kr. ryškiau vienos
    nuo kitų atsiskiria tokios kiltys : lietuviai, žiemgaliai, kurie vėliau
    (XIII amž.) randami kairiajame Dauguvos deltos krante, pietuose
    nusitęsę iki Šiaulių - Upytės.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-011
- c-011
  santrauka: 'Bartų vadas Divanas sutelkė stiprią kariuomenę ir dar kartą apiplėšė Kristburgo bei Marienburgo apylinkes.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Mūsų jau minėtas Divanas, po senovei ištroškęs krikščionių kraujo, sutelkė stiprią
    kariuomenę ir iš naujo apiplėšė Kristburgo bei Marienburgo apylinkes, manydamas, kad
    ir dabar jam taip seksis kaip anksčiau. Mat, tiek brolių bei kitų krikščionių išžudęs arba
    paėmęs  į nelaisvę, manė, jog nebeliko tose žemėse nieko, kas galėtų jam priešintis.
    Todėl išsiuntė į priekį savo kariuomenę su grobiu, o pats nusekė iš paskos su nedideliu
    pulkeliu.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-007
- c-012
  santrauka: '1274 m. bartai kartu su pagudėnais, varmiais, notangais ir sembais grįžo į Bažnyčios bendruomenę ir davė įkaitų.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    175 (170). Apie nadruvių karą ir daugybės šios žemės žmonių atsivertimą

      1274 viešpaties metais, grįžus į šventosios motinos bažnyčios visuotinybę pagudėnams,
    varmiams, notangams, bartams bei sembams, davus jiems įkaitų  ir šitaip laidavus,
    kad jie ateityje niekada nemėginsią imtis tokių baisingų veiksmų, bet būsią nuolankiai
    paklusnūs tikėjimui ir brolių valdžiai, magistras ir broliai, susirūpinę krikščionių [žemių]
    ribų praplėtimu, nukreipė savo ginklus prieš nadruvius. Po to, kai mūsų aukščiau minėtas
    Tirskas, Maudelio tėvas ir Vėluvos pilininkas, su visais savo artimaisiais pasidavė tikėjimui
    bei broliams, daug galingų ir kilmingų Nadruvos vyrų vienas po kito atėjo pas brolius su
    visomis savo šeimynomis ir, krikšto prikelti naujam gyvenimui bei išsižadėję stabų, ėmė
    tarnauti gyvajam dievui Jėzui Kristui.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003
- c-013
  santrauka: '1263 m. bartų vadas Divanas vijosi iš pilies pasitraukusius brolius ir su trylika vyrų juos užpuolė.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Neilgai trukus broliai, pristigę
    maisto, paliko su savo ginklanešiais pilį 1263 viešpaties metais ir slapta pasitraukė pasukę
    link Mazovijos kunigaikštystės. Šitai sužinojęs, Di-vanas, tuometinis bartų vadas, vijosi
    juos su daugybe karių, bet nestengė pasivyti, nes jų pailsinti arkliai pristojo; tada jis,
    pasiėmęs trylika vyrų, jojusių eiklesniais žirgais, pralenkė kitus ir, priartėjęs prie brolių,
    bado nualintų ir dėl nuovargio nepajėgiančių kovoti, narsiai juos užpuolė, o pirmajame
    susidūrime tris nukovė. Kiti, pradėję priešintis, sunkiai sužeidė minėtąjį Divaną, kuris
    tada liovėsi kariavęs, o broliai su savaisiais ramiai atsitraukė.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-010
- c-014
  santrauka: 'Po prūsų atkritimo nuo krikščionių tikėjimo bartai savo kariuomenės vadu išsirinko Divaną.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    [dienos) išvakarėse, prūsai, matydami, jog broliai šiame mūšyje prarado daug jėgų,
    netekę brolių, ginklanešių, žirgų, ginklų ir visa kita, kas reikalinga karui, patyrę daug
    sunkių nelaimių ir aitrių nuoskaudų, vėl atkrito nuo tikėjimo ir tikinčiųjų, sugrįžo prie
    pirmykščių paklydimų, o savo kariuomenės vadais bei vyresniaisiais sembai išsirinko
    Glandą357, notangai — Herkų Mantą358, varmiai — Glapą359, pagudėnai — Auktumą360,
    bartai — Divaną361.




                   90 (85). Apie didelį krikščionių kraujo praliejimą
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-013
    - t-001
- c-015
  santrauka: 'Per pilies puolimą brolis Arnoldas Krofas arbaleto strėle peršovė bartų vadui Divanui kaklą, o po Divano žūties kiti pasitraukė.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Kai šitai
    padarė, kai viena šalis parengė visa, kas reikalinga piliai pulti, o kita — kas reikalinga
    gynybai, prasidėjo puolimas; krito daug priešų, sužeistų ir nukautų, o brolis Arnoldas
    Krofas, leisdamas strėles iš arbaleto, peršovė minėtajam Divanui kaklą. Šiam žuvus,
    kiti pasitraukė nebaigę reikalo. Piktžodžiautojui Divanui nutiko taip kaip tam Heliodorui,
    kuris, mėgindamas apiplėšti viešpaties šventyklos iždinę, krito dievo nutrenktas žemėn
    negyvas; įėjęs  į šventyklą su daugybe žygūnų ir padėjėjų, jis nesusilaukė nė iš vieno
    pagalbos, tik neštuvais buvo išneštas laukan.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-008
- c-016
  santrauka: 'Bartai Numa ir Derska, pabėgę iš Prūsijos į Lietuvą, išdavė lietuvių būrius, tikėdamiesi kryžiuočių atleidimo.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Tuo tarpu keletas kitų lietuvių būrių
    niokojo Lenkijos pasienius, grįždami jie pateko į prie­
    šų pasalas, ir tuo metu, kai namai, regis, buvo ranka
    pasiekiami, šie juos išžudė. Tą pralaimėjimą jie pa­
    tyrė dėl dviejų prūsų didikų, bartų Numos ir Derskos,
    kurie tup metu, pabėgę iš Prūsijos, gyveno Lietuvoje,
    vildamiesi, jog už naują išdavystę kryžiuočiai jiems
    atleis jų ankstesnį nusikaltimą. Kitų metų pradžioje
    lietuvių reikalai nė trupučio nepagerėjo, nors ir nebu­
    vo tokie blogi kaip anuomet.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-014

## Ryšiai
- Bartai gyveno [[objektai/vietos/Barta]]
- Bartai gyveno [[objektai/vietos/Bartenšteinas]]
- Bartai paskyre [[objektai/asmenys/Divanas]]
- Bartai priklause [[objektai/grupes/Baltai]]
- Bartai puole [[objektai/vietos/Baiga]]
- Bartai puole [[objektai/vietos/Senenzė]]
- Bartai apgule [[objektai/vietos/Senenzė]]
- Bartai kariavo_pries [[objektai/grupes/Kryžiuočių ordinas]]
- Bartai kariavo_pries [[objektai/grupes/Auksinė Orda]]
- Bartai keliavo_i [[objektai/vietos/Lietuva]]
- [[objektai/asmenys/Derska]] reme Bartai
- [[objektai/asmenys/Numa]] reme Bartai
