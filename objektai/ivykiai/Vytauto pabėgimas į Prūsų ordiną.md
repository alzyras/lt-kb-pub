---
tipas: ivykis
pavadinimas: 'Vytauto pabėgimas į Prūsų ordiną'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
---
# Vytauto pabėgimas į Prūsų ordiną

## Santrauka

Lietuvos metraštis pasakoja, kad po Kęstučio nužudymo Vytautas pabėgo iš nelaisvės. Lietuvos metraštis pasakoja, kad Vytautas nubėgo pas Prūsų Ordino didįjį magistrą.

## Laikotarpis ir datos

- laikotarpis: po Kęstučio nužudymo
- datos:
  - po Kęstučio nužudymo

## Dalyviai ir vaidmenys

Nenurodyta

## Eiga

Nenurodyta

## Rezultatas

Nenurodyta

## Teiginiai

<a id="claim-t-186677"></a>
- t-001
  global_id: t-186677
  teiginys: 'Lietuvos metraštis pasakoja, kad po Kęstučio ir Vytauto motinos nužudymo Vytautas pabėgo iš nelaisvės pas Prūsų Ordino didįjį magistrą.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Sakinys sutrumpintas, pašalinta perteklinė įvardžių grandinė.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Prūsai; mentioned_object: [[objektai/zodynas/metraštis|metraštis]]; mentioned_person: [[objektai/asmenys/Kęstutis|Kęstutis]]; mentioned_place: Lietuva; llm_object: Prūsai'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=a51945b858f1a96ae53d923bc557dac3a7e76292fe52b2affafb0983dbf2cfa5; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: keliavo_i -> Prūsai: 0.78
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Prūsai: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citatoje Vytautas pasakoja nubėgęs pas Prūsų Ordino atstovus; leistinas objektas yra Prūsai.

<a id="claim-t-186678"></a>
- t-002
  global_id: t-186678
  teiginys: 'Lietuvos metraštis pasakoja, kad Vytautas, pabėgęs iš nelaisvės, nubėgo pas Prūsų Ordino didįjį magistrą.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Pridėtas būtinas kontekstas apie pabėgimą iš nelaisvės.'
  susije_objektai: 'mentioned_place: Prūsai; mentioned_object: [[objektai/zodynas/metraštis|metraštis]]; mentioned_place: Lietuva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=a51945b858f1a96ae53d923bc557dac3a7e76292fe52b2affafb0983dbf2cfa5; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Prūsai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Vytauto pabėgimas į Prūsų ordiną: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Prūsai: mention_match, place, gap=43
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Vytauto pabėgimas į Prūsų ordiną" parinktas kaip owner_note_path. Targetas "Prūsai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-186679"></a>
- t-003
  global_id: t-186679
  teiginys: 'Lietuvos metraštis pasakoja, kad pas Prūsų Ordiną Vytautas priėmė krikščionių tikėjimą ir prisiekė paklusnumą popiežiui.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Religinis teiginys paliktas aiškiai atribūtuotas šaltiniui.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Kryžiuočių ordinas|Kryžiuočių ordinas]]; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Prūsai; mentioned_object: [[objektai/zodynas/metraštis|metraštis]]; mentioned_place: Lietuva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=a51945b858f1a96ae53d923bc557dac3a7e76292fe52b2affafb0983dbf2cfa5; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Kryžiuočių ordinas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Vytauto pabėgimas į Prūsų ordiną: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Kryžiuočių ordinas: mention_match, group, gap=6
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Vytauto pabėgimas į Prūsų ordiną" parinktas kaip owner_note_path. Targetas "Kryžiuočių ordinas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Ir po duo­
    to žodžio suėmė jie mūsų tėvą ir jį nužudė. Ir mano
    motiną taip pat nužudė, o ir mane patį jie paėmė į ne­
    laisvę. Tada mane išgelbėjo dievas, ir aš nuo jų pabė­
    gau ir nubėgau pas prakilnius žmones, Prūsų Ordino
    didįjį magistrą, priėmiau šventąjį krikščionių tikėjimą
    ir [prisiekiau) paklusnumą šventajam tėvui popiežiui.
    O tenai pas juos palikau savo brolį, savo seserį, savo
    žmoną ir savo vaikus. Visus juos palikau jo nelaisvėje.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=a51945b858f1a96ae53d923bc557dac3a7e76292fe52b2affafb0983dbf2cfa5; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: keliavo_i -> Prūsai: 0.78
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Prūsai: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citatoje Vytautas pasakoja nubėgęs pas Prūsų Ordino atstovus; leistinas objektas yra Prūsai.
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=a51945b858f1a96ae53d923bc557dac3a7e76292fe52b2affafb0983dbf2cfa5; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Prūsai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Vytauto pabėgimas į Prūsų ordiną: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Prūsai: mention_match, place, gap=43
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Vytauto pabėgimas į Prūsų ordiną" parinktas kaip owner_note_path. Targetas "Prūsai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=a51945b858f1a96ae53d923bc557dac3a7e76292fe52b2affafb0983dbf2cfa5; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Kryžiuočių ordinas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Vytauto pabėgimas į Prūsų ordiną: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Kryžiuočių ordinas: mention_match, group, gap=6
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Vytauto pabėgimas į Prūsų ordiną" parinktas kaip owner_note_path. Targetas "Kryžiuočių ordinas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
