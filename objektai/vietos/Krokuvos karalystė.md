---
tipas: vieta
pavadinimas: 'Krokuvos karalystė'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
---
# Krokuvos karalystė

## Santrauka

Krokuvos karalystė priėmė Jogailą.

## Teiginiai

<a id="claim-t-187245"></a>
- t-001
  global_id: t-187245
  teiginys: 'Lietuvos metraštis Krokuvos karalyste vadina politinę erdvę, kuri, Jogailai atsisėdus Krokuvoje, jį paėmė.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Pavadinimo vartosena ir kronikos formuluotė reikalauja atribucijos.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Jogaila|Jogaila]]; mentioned_place: Krokuva; mentioned_group: [[objektai/grupes/Rusai|Rusai]]; mentioned_object: [[objektai/zodynas/metraštis|metraštis]]; mentioned_place: Lietuva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=e48fb62c92a3ae7cc32317fa90a6f81c1629dbeabb2c27c2b1e84e6bc754fa33; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Jogaila (kunigaikštis, XIV–XV a.): 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Krokuvos karalystė: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Jogaila (kunigaikštis, XIV–XV a.): mention_match, person, gap=48
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Krokuvos karalystė" parinktas kaip owner_note_path. Targetas "Jogaila (kunigaikštis, XIV–XV a.)" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-187590"></a>
- t-002
  global_id: t-187590
  teiginys: 'Jogailai atsisėdus Krokuvoje ir Krokuvos karalystei jį paėmus, Lietuvos metraščio pasakotojas sako vėl pareiškęs savo tikėjimą.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Religinis pasakotojo liudijimas perrašytas su šaltinio atribucija.'
  susije_objektai: 'mentioned_place: Krokuva; mentioned_place: Lietuva; mentioned_group: [[objektai/grupes/Rusai|Rusai]]; mentioned_person: [[objektai/asmenys/Jogaila|Jogaila]]'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 306887-307271; hash=76635cc10f0131902f352a45cc775707e73b70e70e7e6d651624558e67bb1a98; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Krokuva: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Krokuvos karalystė: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Krokuva: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Krokuvos karalystė" parinktas kaip owner_note_path. Targetas "Krokuva" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Lietuvos metraštis Krokuvos karalyste vadina politinę erdvę, kuri, Jogailai atsisėdus Krokuvoje, jį paėmė.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Tačiau jie vertė ir
    mane priimti rusų tikėjimų, kad pasidaryčiau visų žmo­
    nių nekenčiamas4 . Ir aš prieš savo norą, jų valią vyk­
    dydamas, tariau: aš priėmiau rusų tikėjimą ir pareiš­
    kiau tai viešai žmonėms, o sykiu slaptai laikiausi savo
    tikėjimo, kurj pirma buvau priėmęs, krikščionių tikė­
    jimo. Ir kai kunigaikštis Jogaila atsisėdo Krokuvoje ir
    Krokuvos karalystė 5  jį paėmė, tada aš vėl pareiškiau
    savo tikėjimą.
  citata_rodoma: ''
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-001

- c-002
  santrauka: 'Jogailai atsisėdus Krokuvoje ir Krokuvos karalystei jį paėmus, Lietuvos metraščio pasakotojas sako vėl pareiškęs savo tikėjimą.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Ir aš prieš savo norą, jų valią vyk­
    dydamas, tariau: aš priėmiau rusų tikėjimą ir pareiš­
    kiau tai viešai žmonėms, o sykiu slaptai laikiausi savo
    tikėjimo, kurj pirma buvau priėmęs, krikščionių tikė­
    jimo. Ir kai kunigaikštis Jogaila atsisėdo Krokuvoje ir
    Krokuvos karalystė 5  jį paėmė, tada aš vėl pareiškiau
    savo tikėjimą. Ir taip aš ir šiandien laikausi krikščionių
    tikėjimo.
  citata_rodoma: ''
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-002
