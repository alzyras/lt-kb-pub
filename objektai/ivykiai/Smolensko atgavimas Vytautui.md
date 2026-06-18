---
tipas: ivykis
pavadinimas: 'Smolensko atgavimas Vytautui'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
---
# Smolensko atgavimas Vytautui

## Santrauka

Lietuvos metraštis pasakoja, kad Vytautas susijungė su Jogaila ir tą patį rudenį atvyko į Smolenską. Lietuvos metraštis pasakoja, kad Jurijus Svetoslavovičius ir Riazanės kunigaikštis Olegas buvo išvyti iš Smolensko.

## Laikotarpis ir datos

- laikotarpis: tą patį rudenį
- datos:
  - tą patį rudenį

## Dalyviai ir vaidmenys

Nenurodyta

## Eiga

Nenurodyta

## Rezultatas

Nenurodyta

## Teiginiai

<a id="claim-t-186592"></a>
- t-001
  global_id: t-186592
  teiginys: 'Lietuvos metraštis pasakoja, kad Vytautas susijungė su Jogaila ir tą patį rudenį su kariuomenėmis atvyko į Smolenską.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Sakinys sutvirtintas citatoje esančia kariuomenių detale.'
  susije_objektai: 'llm_object: Smolenskas; llm_object: [[objektai/asmenys/Jogaila|Jogaila]]; mentioned_person: [[objektai/asmenys/Jogaila|Jogaila]]; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Smolenskas; mentioned_object: [[objektai/zodynas/didysis kunigaikštis|didysis kunigaikštis]]; mentioned_object: [[objektai/zodynas/metraštis|metraštis]]; mentioned_place: Lenkija; mentioned_place: Lietuva; mentioned_place: Riazanė'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=b0595259f45fc2742f488df4bb41a15ebb1597efe523aac2a9a8b5faf9510a1e; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: keliavo_i -> Smolenskas: 0.94
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Smolenskas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai sako, kad Vytautas atvyko į Smolenską.

<a id="claim-t-186593"></a>
- t-002
  global_id: t-186593
  teiginys: 'Lietuvos metraštis pasakoja, kad Vytautas išvijo Jurijų Svetoslavovičių ir Riazanės kunigaikštį Olegą iš Smolensko.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Įvardytas veikėjas, kad sakinys būtų aiškesnis ir tiesiogiai sietųsi su įvykiu.'
  susije_objektai: 'mentioned_object: [[objektai/zodynas/didysis kunigaikštis|didysis kunigaikštis]]; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Riazanė; mentioned_place: Smolenskas; mentioned_object: [[objektai/zodynas/metraštis|metraštis]]; mentioned_place: Lenkija; mentioned_place: Lietuva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=b0595259f45fc2742f488df4bb41a15ebb1597efe523aac2a9a8b5faf9510a1e; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Riazanė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Smolensko atgavimas Vytautui: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Riazanė: mention_match, place, gap=42
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Smolensko atgavimas Vytautui" parinktas kaip owner_note_path. Targetas "Riazanė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-186594"></a>
- t-003
  global_id: t-186594
  teiginys: 'Lietuvos metraštis pasakoja, kad Vytautas atgavo Smolensko miestą ir visą žemę, sutvirtino Smolensko žmones ir grįžo į Lietuvą.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Patikslinta, kad citata kalba apie žmonių sutvirtinimą, o ne aiškiai apie valdžią.'
  susije_objektai: 'llm_object: Lietuva; llm_object: Smolenskas; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Smolenskas; mentioned_object: [[objektai/zodynas/didysis kunigaikštis|didysis kunigaikštis]]; mentioned_object: [[objektai/zodynas/metraštis|metraštis]]; mentioned_place: Lenkija; mentioned_place: Lietuva; mentioned_place: Riazanė'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=b0595259f45fc2742f488df4bb41a15ebb1597efe523aac2a9a8b5faf9510a1e; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: keliavo_i -> Lietuva: 0.92
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Lietuva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai sako, kad Vytautas išvyko atgal į Lietuvą.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    kurie nenorėjo tėvonies, kunigaikščio Jurijaus, liek
    smolenskiečius, tiek brianskiečius — visus iškapojo.
    Didysis kunigaikštis Vytautas, tai išgirdęs, susijun­
    gė su savo broliu, Lenkijos karaliumi Vladislovu Jogai­
    la 4 0 , ir tą patį rudenį su visomis savo kariuomenėmis
    atvyko į Smolenską1 1 , išvijo kunigaikščius Jurijų Sve-
    toslavovičių ir Riazanės kunigaikštį Olegą iš Smolensko
    ir atgavo Smolensko miestą 1 2  bei visą žemę. Ir, patvir­
    tinę bei sustiprinę Smolenske visus žmones, išvyko at­
    gal į Lietuvą,
    34.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=b0595259f45fc2742f488df4bb41a15ebb1597efe523aac2a9a8b5faf9510a1e; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: keliavo_i -> Smolenskas: 0.94
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Smolenskas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai sako, kad Vytautas atvyko į Smolenską.
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=b0595259f45fc2742f488df4bb41a15ebb1597efe523aac2a9a8b5faf9510a1e; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Riazanė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Smolensko atgavimas Vytautui: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Riazanė: mention_match, place, gap=42
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Smolensko atgavimas Vytautui" parinktas kaip owner_note_path. Targetas "Riazanė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=b0595259f45fc2742f488df4bb41a15ebb1597efe523aac2a9a8b5faf9510a1e; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: keliavo_i -> Lietuva: 0.92
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Lietuva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai sako, kad Vytautas išvyko atgal į Lietuvą.
