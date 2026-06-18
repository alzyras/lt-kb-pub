---
tipas: vieta
pavadinimas: 'Sučiava'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1485 m.'
  - '1497 m.'
date_start: '1485'
date_end: '1497'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
amziai:
  - 'XV'
---
# Sučiava

## Santrauka

Olbrachtas pasitraukė nuo Sučiavos miesto. Sučiava čia lieka nepaimta po nesėkmingos apgulties.

## Teiginiai

<a id="claim-t-187339"></a>
- t-001
  global_id: t-187339
  teiginys: 'Karalius Olbrachtas kelias dienas stovėjo prie Sučiavos, bet suprato miesto nepaimsiąs ir nuo jo pasitraukė.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys aiškiai apibendrina Olbrachto veiksmus prie Sučiavos.'
  susije_objektai: 'mentioned_object: [[objektai/zodynas/vaivada|vaivada]]; mentioned_person: [[objektai/asmenys/Steponas|Steponas]]; mentioned_place: Moldavija'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=4b6a2e2cea0b30ab3195ea930d709dae2a2742aebe8cf5a691161a66a6a8e4a1; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Moldavija: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Sučiava: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Moldavija: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Sučiava" parinktas kaip owner_note_path. Targetas "Moldavija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-187340"></a>
- t-002
  global_id: t-187340
  teiginys: '1485 m. rugsėjo 19–20 d. Ali-pašos vadovaujama Turkijos kariuomenė puolė Moldavijos sostinę Sučiavą.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Citata palaiko tikslesnį sakinį su kariuomenės vadu ir vietos statusu.'
  susije_objektai: 'llm_object: Sučiava; mentioned_group: [[objektai/grupes/Turkijos kariuomenė|Turkijos kariuomenė]]; mentioned_object: [[objektai/zodynas/vietininkas|vietininkas]]; mentioned_place: Moldavija; mentioned_place: Turkija'
  semantiniai_rysiai: '[[objektai/grupes/Turkijos kariuomenė|Turkijos kariuomenė]] puolė Sučiava'
  temporaliniai_duomenys: 'įvykio data: 1485 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Citata palaiko tikslesnį sakinį su kariuomenės vadu ir vietos statusu.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=4b6a2e2cea0b30ab3195ea930d709dae2a2742aebe8cf5a691161a66a6a8e4a1; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Moldavija: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Sučiava: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Moldavija: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Sučiava" parinktas kaip owner_note_path. Targetas "Moldavija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-187341"></a>
- t-003
  global_id: t-187341
  teiginys: 'Moldavijos vaivada Steponas sustiprino savo sostinę Sučiavos pilį ir kitus miestus, palikdamas juose įgulas.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Citata leidžia aiškiau nurodyti veikėją, objektą ir rezultatą.'
  susije_objektai: 'llm_object: Moldavija; mentioned_object: [[objektai/zodynas/vaivada|vaivada]]; mentioned_person: [[objektai/asmenys/Steponas|Steponas]]; mentioned_place: Moldavija; mentioned_place: Trakai'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=01c98413802b1cc0aed2aa46aadcd5aac8de3d6cb2311dae77d706fb485a0a19; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: buvo_valdovas -> Moldavija: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Steponas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Moldavija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Steponas tiesiogiai įvardytas Moldavijos vaivada.

<a id="claim-t-187342"></a>
- t-004
  global_id: t-187342
  teiginys: 'Sučiavos pilis šiame pasakojime įvardijama kaip Moldavijos vaivados Stepono sostinė.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Kadangi kalbama apie šaltinio įvardijimą, reikia atribucijos formos.'
  susije_objektai: 'mentioned_object: [[objektai/zodynas/vaivada|vaivada]]; mentioned_person: [[objektai/asmenys/Steponas|Steponas]]; mentioned_place: Moldavija; mentioned_place: Trakai'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=01c98413802b1cc0aed2aa46aadcd5aac8de3d6cb2311dae77d706fb485a0a19; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Moldavija: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Sučiava: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Moldavija: mention_match, place, gap=48
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Sučiava" parinktas kaip owner_note_path. Targetas "Moldavija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-187343"></a>
- t-005
  global_id: t-187343
  teiginys: '1485 m. rugsėjo 19–20 d. puolimo pastaboje Sučiava įvardijama kaip Moldavijos sostinė.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginį reikia susieti su konkrečiu citatos kontekstu.'
  susije_objektai: 'mentioned_place: Moldavija; mentioned_object: [[objektai/zodynas/vietininkas|vietininkas]]; mentioned_place: Turkija'
  temporaliniai_duomenys: 'įvykio data: 1485 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginį reikia susieti su konkrečiu citatos kontekstu.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=c6e2bcfce6e6f8f7fd9c18f7c196e933fc7fc63f9eaf2b10603a4f9acec73439; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Moldavija: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Sučiava: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Moldavija: mention_match, place, gap=24
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Sučiava" parinktas kaip owner_note_path. Targetas "Moldavija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-187344"></a>
- t-006
  global_id: t-187344
  teiginys: 'Olbrachtas pasitraukė nuo Sučiavos miesto.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra pilnas faktinis sakinys apie veiksmą prie Sučiavos. Jis sąmoningai neperima citatoje esančio motyvo apie troškimą kautis.'
  susije_objektai: 'mentioned_object: [[objektai/zodynas/vaivada|vaivada]]; mentioned_person: [[objektai/asmenys/Steponas|Steponas]]; mentioned_place: Moldavija'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=c6e2bcfce6e6f8f7fd9c18f7c196e933fc7fc63f9eaf2b10603a4f9acec73439; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: puole -> Sučiava: 0.93
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Turkijos kariuomenė: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Sučiava: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo Turkijos kariuomenės puolimą prieš Sučiavą.
- susijęs iš [[objektai/ivykiai/Ali-pašos įsiveržimas į Moldaviją ir Sučiavos puolimas.md#claim-t-186767|Ali-pašos įsiveržimas į Moldaviją ir Sučiavos puolimas]]: Redakcinė pastaba nurodo, kad 1485 m. rugsėjo 19–20 d. buvo puolama Moldavijos sostinė Sučiava.
- susijęs iš [[objektai/ivykiai/Jono Olbrachto žygis į Moldaviją ir Sučiavos apgultis.md#claim-t-186652|Jono Olbrachto žygis į Moldaviją ir Sučiavos apgultis]]: Olbrachtas pasitraukė nuo Sučiavos ir žygiavo gilyn į Moldaviją.
- susijęs iš [[objektai/ivykiai/Jono Olbrachto žygis į Moldaviją ir Sučiavos apgultis.md#claim-t-186654|Jono Olbrachto žygis į Moldaviją ir Sučiavos apgultis]]: Olbrachtas kelias dienas stovėjo prie Sučiavos, bet suprato, kad miesto nepaims.
- susijęs iš [[objektai/ivykiai/Jono Olbrachto žygis į Moldaviją ir Sučiavos apgultis.md#claim-t-186656|Jono Olbrachto žygis į Moldaviją ir Sučiavos apgultis]]: Sučiavos gynėjai paragino Olbrachtą kautis su Steponu lauke.
- susijęs iš Moldavija: Lietuvos metraštis pasakoja, kad Olbrachtui įsiveržus į Moldaviją vaivada Steponas sustiprino Sučiavą ir pasitraukė į kalnų tarpeklius.
- susijęs iš [[objektai/asmenys/Aleksandras.md#claim-t-184656|Aleksandras]]: Po Jurgio ir Teodoro pasitraukimo visa Podolė liko kunigaikščių Aleksandro ir Konstantino valdžioje.
- susijęs iš [[objektai/ivykiai/Jono Olbrachto žygis į Moldaviją ir Sučiavos apgultis.md#claim-t-186653|Jono Olbrachto žygis į Moldaviją ir Sučiavos apgultis]]: Lietuvos metraštis pasakoja, kad Moldavijos vaivada Steponas pasiuntė pasiuntinius pas Olbrachtą ir sudarė su juo taiką.
- susijęs iš [[objektai/ivykiai/Jono Olbrachto žygis į Moldaviją ir Sučiavos apgultis.md#claim-t-186655|Jono Olbrachto žygis į Moldaviją ir Sučiavos apgultis]]: Lietuvos metraštis teigia, kad Moldavijos vaivada Steponas su Olbrachtu sudarė taiką, sutiko duoti vasalo ištikimybės priesaiką ir surašė raštus.
- susijęs iš Bukovina: Lietuvos metraštyje Bukovina vaizduojama kaip akmeninga, uolėta ir sunkiai pereinama vietovė Lenkijos sienos link.
- susijęs iš Bukovina: Po sutarties su Moldavijos vaivada Olbrachtas traukė per Bukoviną ir kalnus Lenkijos sienos link.
- susijęs iš Moldavija: Lietuvos metraštis pasakoja, kad Olbrachtui įsiveržus į Moldaviją vaivada Steponas sustiprino Sučiavą ir pasitraukė į kalnų tarpeklius.
- susijęs iš [[objektai/ivykiai/Jono Olbrachto žygis į Moldaviją ir Sučiavos apgultis.md#claim-t-186656|Jono Olbrachto žygis į Moldaviją ir Sučiavos apgultis]]: Sučiavos gynėjai paragino Olbrachtą kautis su Steponu lauke.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Ir pagal tą Trakų vaivados patarimą karalius
    davė etmono vietą kunigaikščiui Konstantinui2 5 .
    O tuomet Olbrachtas jau buvo įžengęs į Moldavi­
    jos žemę2 6 . Patikimai sužinojęs, kad karalius Olbrach­
    tas, pykčiu degdamas, su neapsakoma galybe įsiveržė
    į jo žemę, Moldavijos vaivada Steponas sutraukė visą
    savo kariuomenę, gerai sustiprino savo sostinę — Su-
    čiavos2 7  pilį bei visus kitus savo miestus ir, palikęs
    ten savo įgulas, pats su visa kariuomene išėjo į kalnus,
    į siaurus ir nepereinamus tarpeklius, kur buvo jo mėgs-
    /52
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=01c98413802b1cc0aed2aa46aadcd5aac8de3d6cb2311dae77d706fb485a0a19; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: buvo_valdovas -> Moldavija: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Steponas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Moldavija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Steponas tiesiogiai įvardytas Moldavijos vaivada.
    - t-004

- c-002
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Hermano perkulabo kronika (O. Gorka, Kroni­
    ka czasow Stefana W ielkiego Moldawskiego, Krakow. 1931, p. 110)
    patvirtina, kad m oldavams talkininkavo karaliaus Kazimiero sūnus
    Olbrachtas.
    ”  Iš tikrųjų ne pats sultonas, o jo vietininkas Balkanuose
    All-paša, kurio vadovaujam a Turkijos kariuomenė, M oldavijos vai­
    vadai Steponui būnant Kolomyjoje. giliai įsiveržė j M oldavija Ir
    1485 m. rugsėjo 1 9 -2 0  d. puolė pačių Moldavijos sostine — Su-
    čiavų.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=01c98413802b1cc0aed2aa46aadcd5aac8de3d6cb2311dae77d706fb485a0a19; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Moldavija: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Sučiava: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Moldavija: mention_match, place, gap=48
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Sučiava" parinktas kaip owner_note_path. Targetas "Moldavija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-005
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=c6e2bcfce6e6f8f7fd9c18f7c196e933fc7fc63f9eaf2b10603a4f9acec73439; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Moldavija: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Sučiava: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Moldavija: mention_match, place, gap=24
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Sučiava" parinktas kaip owner_note_path. Targetas "Moldavija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-002

- c-003
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    O karalius Olbrachtas, pasiekęs Sučiavą ir prastovėjęs
    prie jos kelias dienasM , suprato, kad miestui nieko
    nepadarys; visi moldavai, apgulti mieste, davė jam to­
    kį atsakymą: „2inok neabejodamas, kad mes nebūsi­
    me savo valdovo ir jo miesto išdavikais. Mūsų valdo­
    vas vaivada Steponas su savo kariuomene yra lauke:
    jei nori — eik ir nugalėk jj, ir tuomet jo miestai ir visa
    žemė iš karto atsidurs tavo rankose."
    Karalius Olbrachtas pasitraukė nuo Sučiavos mies­
    to ir žygiuoja gilyn, iš visos širdies trokšdamas susi­
    kauti su juo 3 I. O Moldavijos vaivada, matydamas, kad
    negalės jam atsispirti, pasiuntė pas jį savo pasiuntinius
    ir sudarė su juo taiką, teikėsi su savo žeme duoti jam
    vasalo ištikimybės priesaiką, kaip buvo prisiekęs jo
    tėvui, karaliui Kazimierui, ir surašė raštus, prisiekė
    griežtai to prisilaikysiąs3 2 .
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=4b6a2e2cea0b30ab3195ea930d709dae2a2742aebe8cf5a691161a66a6a8e4a1; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Moldavija: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Sučiava: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Moldavija: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Sučiava" parinktas kaip owner_note_path. Targetas "Moldavija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-006
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=c6e2bcfce6e6f8f7fd9c18f7c196e933fc7fc63f9eaf2b10603a4f9acec73439; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: puole -> Sučiava: 0.93
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Turkijos kariuomenė: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Sučiava: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo Turkijos kariuomenės puolimą prieš Sučiavą.
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=4b6a2e2cea0b30ab3195ea930d709dae2a2742aebe8cf5a691161a66a6a8e4a1; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Moldavija: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Sučiava: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Moldavija: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Sučiava" parinktas kaip owner_note_path. Targetas "Moldavija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

## Ryšiai
- [[objektai/grupes/Turkijos kariuomenė]] puole Sučiava
- [[objektai/asmenys/Steponas]] gyne Sučiava
