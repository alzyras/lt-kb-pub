---
tipas: ivykis
pavadinimas: 'Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
---
# Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa

## Santrauka

Lietuvos metraštis pasakoja, kad žemaičiai išžudė Prūsijos vokiečių vietininkus nebenorėdami būti vokiečių valdžioje. Lietuvos metraštis pasakoja, kad Prūsijos ir Livonijos vokiečiai telkė kariuomenę Palangoje, bet žemaičiai nuo kopų ją akmenimis išmušė.

## Laikotarpis ir datos

- laikotarpis: sekančią vasarą
- datos:
  - sekančią vasarą

## Dalyviai ir vaidmenys

Nenurodyta

## Eiga

Nenurodyta

## Rezultatas

Nenurodyta

## Teiginiai

<a id="claim-t-186611"></a>
- t-001
  global_id: t-186611
  teiginys: 'Lietuvos metraštis pasakoja, kad žemaičiai išžudė Prūsijos vokiečių vietininkus, nebenorėdami likti vokiečių valdžioje.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Priešiškas konfliktinis pasakojimas turi likti šaltinio atribucijoje.'
  susije_objektai: 'llm_object: [[objektai/grupes/Vokiečiai|Vokiečiai]]; mentioned_group: [[objektai/grupes/Vokiečiai|Vokiečiai]]; mentioned_place: Prūsija; mentioned_group: [[objektai/grupes/Žemaičiai|Žemaičiai]]; mentioned_object: [[objektai/zodynas/metraštis|metraštis]]; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Lietuva; mentioned_place: Livonija'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=41071e413db8f0e94f04801244a6bffcb31b9f4e64b2d3c79a968923e671e61d; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: puole -> Vokiečiai: 0.86
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Žemaičiai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Vokiečiai: llm_allowed_candidate, group
  ryšio_paaiskinimas: Teiginys tiesiogiai nurodo, kad žemaičiai išžudė Prūsijos vokiečių vietininkus.

<a id="claim-t-186612"></a>
- t-002
  global_id: t-186612
  teiginys: 'Lietuvos metraštis pasakoja, kad vokiečiai priminė Vytautui turint grąžinti tris šimtus auksinų už užstatytą Žemaitiją.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Įtrauktas citatoje esantis konkretus mokėjimo dydis.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_group: [[objektai/grupes/Vokiečiai|Vokiečiai]]; mentioned_group: [[objektai/grupes/Žemaičiai|Žemaičiai]]; mentioned_object: [[objektai/zodynas/didysis kunigaikštis|didysis kunigaikštis]]; mentioned_object: [[objektai/zodynas/metraštis|metraštis]]; mentioned_place: Lietuva; mentioned_place: Varniai'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=41071e413db8f0e94f04801244a6bffcb31b9f4e64b2d3c79a968923e671e61d; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Livonija: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Livonija: mention_match, place, gap=3
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa" parinktas kaip owner_note_path. Targetas "Livonija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-186613"></a>
- t-003
  global_id: t-186613
  teiginys: 'Lietuvos metraštis pasakoja, kad Vytautas priėmė žemaičius savo globon po jų pasiuntinių prašymo valdyti Žemaičius.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Sakinys sustiprintas kontekstu, kurį tiesiogiai palaiko citata.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Žemaičiai|Žemaičiai]]; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_group: [[objektai/grupes/Vokiečiai|Vokiečiai]]; mentioned_object: [[objektai/zodynas/metraštis|metraštis]]; mentioned_place: Lietuva; mentioned_place: Livonija; mentioned_place: Prūsija; llm_object: [[objektai/grupes/Žemaičiai|Žemaičiai]]'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=41071e413db8f0e94f04801244a6bffcb31b9f4e64b2d3c79a968923e671e61d; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Vytautas (Lietuvos valdovas, XIV–XV a.): 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): mention_match, person, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa" parinktas kaip owner_note_path. Targetas "Vytautas (Lietuvos valdovas, XIV–XV a.)" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-186614"></a>
- t-004
  global_id: t-186614
  teiginys: 'Lietuvos metraštis vaizduoja Prūsijos ir Livonijos vokiečius telkus kariuomenę Palangoje, o žemaičius nuo kopų akmenimis ją išmušus.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Priešo motyvo ir konflikto vaizdavimas turi likti atribuuotas.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Vokiečiai|Vokiečiai]]; mentioned_group: [[objektai/grupes/Žemaičiai|Žemaičiai]]; mentioned_place: Livonija; mentioned_object: [[objektai/zodynas/metraštis|metraštis]]; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Lietuva; mentioned_place: Prūsija'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=41071e413db8f0e94f04801244a6bffcb31b9f4e64b2d3c79a968923e671e61d; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: gyne -> Žemaičiai: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Žemaičiai: llm_allowed_candidate, group
  ryšio_paaiskinimas: Priėmimas globon tiesiogiai reiškia Vytauto apsaugą žemaičiams.

<a id="claim-t-186615"></a>
- t-005
  global_id: t-186615
  teiginys: 'Lietuvos metraštis pasakoja, kad Vytautas surinko ir nusiuntė vokiečiams visą auksinų sumą, o šie po to Žemaitijos nebepuolė.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Reikia aiškesnio objekto ir atribucijos šaltinio pasakojimui.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Vokiečiai|Vokiečiai]]; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_group: [[objektai/grupes/Žemaičiai|Žemaičiai]]; mentioned_object: [[objektai/zodynas/didysis kunigaikštis|didysis kunigaikštis]]; mentioned_object: [[objektai/zodynas/metraštis|metraštis]]; mentioned_place: Lietuva; mentioned_place: Varniai'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=77c5cf58a49e21dca54c3892635ca28ad7dec971c40bf6c8339a5c3b09c895d7; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Vytautas (Lietuvos valdovas, XIV–XV a.): 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): mention_match, person, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa" parinktas kaip owner_note_path. Targetas "Vytautas (Lietuvos valdovas, XIV–XV a.)" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-186616"></a>
- t-006
  global_id: t-186616
  teiginys: 'Lietuvos metraštis pasakoja, kad po pergalės žemaičiai siuntė pasiuntinius pas Vytautą ir prašė jį valdyti Žemaičius jų nebeužstatinėjant.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Reikia tikslesnio veiksmo ir šaltinio atribucijos.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_group: [[objektai/grupes/Vokiečiai|Vokiečiai]]; mentioned_group: [[objektai/grupes/Žemaičiai|Žemaičiai]]; mentioned_object: [[objektai/zodynas/metraštis|metraštis]]; mentioned_place: Lietuva; mentioned_place: Livonija; mentioned_place: Prūsija'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=77c5cf58a49e21dca54c3892635ca28ad7dec971c40bf6c8339a5c3b09c895d7; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Vokiečiai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Vokiečiai: mention_match, group, gap=29
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa" parinktas kaip owner_note_path. Targetas "Vokiečiai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    O paskui vokiečiai atsiuntė pas didjjį kunigaikštį
    Vytautą savo pasiuntinius, primindami jam, kad jis tu­
    rįs grąžinti tuos tris šimtus auksinų, už kuriuos buvo
    užstatyta Žemaitija7 . Didysis kunigaikštis Vytautas
    atsakė: „Kaip aš jums Žemaitiją užstačiau, taip ir da­
    bar iš jūsų neatimu: žiūrėkite sau sveiki į Žemaitiją,
    o pinigų jums atiduoti neturiu."
    Bet netrukus Vytautas ėmė rinkti pinigus ir surin­
    kęs nusiuntė jiems visą auksinų sumą. Paėmę auksą,
    jie daugiau Žemaitijos nebeužpuldinėjo, paliko ją ra­
    mybėje, nes buvo Jogailos, ir Vytauto, ir žemaičių su­
    mušti bei nuniokoti 8 ,
    Tais pačiais metais Vytautas įsteigė Žemaičių vys­
    kupiją ir pastatė švento Petro bažnyčią Medininkuose,
    kuriuos žemaičiai dabar Varniais vadina; paskyrė ka­
    nauninkus, apdovanojo bažnyčią turtais9  ir įsakė visą
    Žemaitiją iš stabmeldžių tikėjimo perkrikštyti į krikš­
    čionių, apkrikštijo visą Užnerio žemę ir įkūrė daug
    bažnyčiųl0 , todėl Vytautas pramintas antruoju dievo
    apaštalu", kadangi jis pačius atkakliausius stabmel­
    džius atvertė į krikščionių tikėjimą.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=41071e413db8f0e94f04801244a6bffcb31b9f4e64b2d3c79a968923e671e61d; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Livonija: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Livonija: mention_match, place, gap=3
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa" parinktas kaip owner_note_path. Targetas "Livonija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-005

- c-002
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Sekančią vasarą žemaičiai išžudė Prūsijos vokiečių
    vietininkus, nebenorėdami daugiau būti vokiečių val­
    džioje ,a. Prūsijos ir Livonijos vokiečiai ėmė telkti prieš
    juos kariuomenę Palangoje, norėdami vėl juos pavergti,
    bet susibūrę žemaičiai ten pat nuo kopų akmenimis iš­
    mušė tą vokiečių kariuomenę5 . Ir kai nuo kopų vo­
    kiečius sumušė, atsiuntė pas Vytautą pasiuntinius: jei­
    gu jis norįs valdyti Žemaičius, tai tegu daugiau jų nie­
    kam nebeužstatinėjąs, o tevaldąs pats ir tebūnąs jų
    valdovu. Ir Vytautas juos priėmė savo globon 6 .
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=77c5cf58a49e21dca54c3892635ca28ad7dec971c40bf6c8339a5c3b09c895d7; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Vytautas (Lietuvos valdovas, XIV–XV a.): 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): mention_match, person, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa" parinktas kaip owner_note_path. Targetas "Vytautas (Lietuvos valdovas, XIV–XV a.)" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=41071e413db8f0e94f04801244a6bffcb31b9f4e64b2d3c79a968923e671e61d; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: puole -> Vokiečiai: 0.86
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Žemaičiai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Vokiečiai: llm_allowed_candidate, group
  ryšio_paaiskinimas: Teiginys tiesiogiai nurodo, kad žemaičiai išžudė Prūsijos vokiečių vietininkus.
    - t-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=41071e413db8f0e94f04801244a6bffcb31b9f4e64b2d3c79a968923e671e61d; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: gyne -> Žemaičiai: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Žemaičiai: llm_allowed_candidate, group
  ryšio_paaiskinimas: Priėmimas globon tiesiogiai reiškia Vytauto apsaugą žemaičiams.
    - t-006
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=77c5cf58a49e21dca54c3892635ca28ad7dec971c40bf6c8339a5c3b09c895d7; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Vokiečiai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Vokiečiai: mention_match, group, gap=29
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa" parinktas kaip owner_note_path. Targetas "Vokiečiai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=41071e413db8f0e94f04801244a6bffcb31b9f4e64b2d3c79a968923e671e61d; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Vytautas (Lietuvos valdovas, XIV–XV a.): 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): mention_match, person, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Žemaičių išsivadavimas iš vokiečių valdžios ir Vytauto globa" parinktas kaip owner_note_path. Targetas "Vytautas (Lietuvos valdovas, XIV–XV a.)" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
