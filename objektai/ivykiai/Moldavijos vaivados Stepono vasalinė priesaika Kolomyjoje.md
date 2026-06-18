---
tipas: ivykis
pavadinimas: 'Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1485 m.'
date_start: '1485'
date_end: ''
sukurta: ''
atnaujinta: ''
amziai:
  - 'XV'
---
# Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje

## Santrauka

Redakcinė pastaba nurodo, kad Moldavijos vaivada Steponas į Kolomyją atvyko tarp 1485 m. rugsėjo 6 ir 12 d. Redakcinė pastaba nurodo, kad Stepono vasalinė priesaika įvyko Kolomyjoje 1485 m. rugsėjo 15 d.

## Laikotarpis ir datos

- laikotarpis: 1485 m. rugsėjo 6–15 d.
- datos:
  - 1485.09.15
- amziai:
  - XV
- date_start: 1485
- date_end: 1485

## Dalyviai ir vaidmenys

Nenurodyta

## Eiga

Nenurodyta

## Rezultatas

Nenurodyta

## Teiginiai

<a id="claim-t-186761"></a>
- t-001
  global_id: t-186761
  teiginys: 'Per vasalinės priesaikos ceremoniją Kolomyjoje Stepono palydovų ant žemės suguldytos vėliavėlės simbolizavo jų moldaviškąsias valdas.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra pilnas, gramatiškas ir tiesiogiai paremtas citata.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Steponas|Steponas]]; mentioned_place: Kolomyja; mentioned_author: [[objektai/autoriai/M. Strijkovskis|M. Strijkovskis]]; mentioned_object: [[objektai/zodynas/vaivada|vaivada]]; mentioned_place: Moldavija; mentioned_place: Sniatinas'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=5d09c564db7d16d5ff4f0134f97234adb3a7d3089f676d28c2eb959540d8da67; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: keliavo_i -> Kolomyja: 0.94
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Steponas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Kolomyja: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo Stepono atvykimą į Kolomyją.

<a id="claim-t-186762"></a>
- t-002
  global_id: t-186762
  teiginys: 'Per priesaikos ceremoniją vaivada Steponas perdavė karaliui Kazimierui didelę šilkinę vėliavą su Moldavijos herbu.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Cituota pastaba tiesiogiai palaiko aiškų faktinį sakinį.'
  susije_objektai: 'mentioned_object: [[objektai/daiktai/Herbas|Herbas]]; mentioned_object: [[objektai/zodynas/vaivada|vaivada]]; mentioned_person: [[objektai/asmenys/Steponas|Steponas]]; mentioned_place: Moldavija; mentioned_author: [[objektai/autoriai/M. Strijkovskis|M. Strijkovskis]]; mentioned_place: Sniatinas'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=5d09c564db7d16d5ff4f0134f97234adb3a7d3089f676d28c2eb959540d8da67; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Kolomyja: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Kolomyja: mention_match, place, gap=47
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje" parinktas kaip owner_note_path. Targetas "Kolomyja" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-186763"></a>
- t-003
  global_id: t-186763
  teiginys: 'Redakcinėje pastaboje Moldavijos vaivados Stepono atvykimas į Kolomyją datuojamas 1485 m. rugsėjo 6-12 d.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Sakinys sutrumpintas ir išvalytas nuo perteklinio veiksmažodžio.'
  susije_objektai: 'llm_object: Kolomyja; mentioned_object: [[objektai/zodynas/vaivada|vaivada]]; mentioned_person: [[objektai/asmenys/Steponas|Steponas]]; mentioned_place: Kolomyja; mentioned_place: Moldavija; mentioned_person: [[objektai/asmenys/Vladislovas Lokietka|Vladislovas Lokietka]]; mentioned_place: Lenkija; mentioned_place: Prutas; mentioned_place: Ukraina'
  temporaliniai_duomenys: 'įvykio data: 1485 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Sakinys sutrumpintas ir išvalytas nuo perteklinio veiksmažodžio.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=edbb5d8c5127ec97db7a33664a0957a4299ad8d7322dae36473cc779694e35cb; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Herbas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Herbas: mention_match, thing, gap=104
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje" parinktas kaip owner_note_path. Targetas "Herbas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-186764"></a>
- t-004
  global_id: t-186764
  teiginys: 'Redakcinėje pastaboje Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje datuojama 1485 m. rugsėjo 15 d.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Sakinys padarytas glaustesnis ir aiškiau susietas su įvykiu.'
  susije_objektai: 'mentioned_object: [[objektai/zodynas/vaivada|vaivada]]; mentioned_person: [[objektai/asmenys/Steponas|Steponas]]; mentioned_place: Kolomyja; mentioned_place: Moldavija; mentioned_person: [[objektai/asmenys/Vladislovas Lokietka|Vladislovas Lokietka]]; mentioned_place: Lenkija; mentioned_place: Prutas; mentioned_place: Ukraina'
  temporaliniai_duomenys: 'įvykio data: 1485 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Sakinys padarytas glaustesnis ir aiškiau susietas su įvykiu.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=edbb5d8c5127ec97db7a33664a0957a4299ad8d7322dae36473cc779694e35cb; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Kolomyja: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Kolomyja: mention_match, place, gap=32
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje" parinktas kaip owner_note_path. Targetas "Kolomyja" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    1 3  Kolomyja — dabar Ukrainos TSR Ivano Franko sr. miestas
    (prie Pruto upės, apie 160 km j pietryčius nuo Lvovo). Lenkijos
    karalius Kazimieras atvyko į Kolomyją 1485 m. rugpiūčio 24 d
    ir išbuvo ten  Ugi rugsėjo 18 d. (F. Papėe, Polska i Litwa, I, p. 198,
    389).
    IS  Moldavijos vaivada Steponas atvyko j Kolomyją 1485 m.
    tarp rugsėjo 6 ir 12 d.
    310

    ## Puslapis 303

    n  M oldavijos vaivados Stepono vasalinė priesaika ivyko Ko-
    lom yjoje 1485 m. rugsėjo 15 d. (M. Mlechovlta, p. 324).
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=edbb5d8c5127ec97db7a33664a0957a4299ad8d7322dae36473cc779694e35cb; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Herbas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Herbas: mention_match, thing, gap=104
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje" parinktas kaip owner_note_path. Targetas "Herbas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-004

- c-002
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    ”  Vaivada Steponas perdavė karaliui Kazimierui didele Sil­
    kine valiavę su Moldavijos herbu, o jo  palydovai suguldė an t ic-
    mės vėliavėles, simbolizuojančias jų moldaviškųsias valdas (F. Pa-
    pee, Polska i Litwa, I, p. 200). Priesaikos cerem onija tiksliau ir
    vaizdžiau aprašyta M. Strijkovskio (Kronika, p. 037). Be to, M. Strij­
    kovskis nusako priesaikos sųlygas, kurių nėra BK.
    a  A pie rugsėjo 24 d., palydėjęs M oldavijos vaivadų Steponų
    ligi Sniatino (j rytus nuo Kolomyjos), Kazimieras davė jam  3000
    algininkų daliuj.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=edbb5d8c5127ec97db7a33664a0957a4299ad8d7322dae36473cc779694e35cb; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Kolomyja: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Kolomyja: mention_match, place, gap=32
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje" parinktas kaip owner_note_path. Targetas "Kolomyja" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=5d09c564db7d16d5ff4f0134f97234adb3a7d3089f676d28c2eb959540d8da67; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Kolomyja: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Kolomyja: mention_match, place, gap=47
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Moldavijos vaivados Stepono vasalinė priesaika Kolomyjoje" parinktas kaip owner_note_path. Targetas "Kolomyja" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=5d09c564db7d16d5ff4f0134f97234adb3a7d3089f676d28c2eb959540d8da67; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: keliavo_i -> Kolomyja: 0.94
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Steponas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Kolomyja: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo Stepono atvykimą į Kolomyją.
