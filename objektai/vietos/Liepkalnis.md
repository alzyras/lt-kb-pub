---
tipas: vieta
pavadinimas: 'Liepkalnis'
saltiniai:
  - 'Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)'
datos:
  - '1000 m.'
date_start: '1000'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - miestas
  - vieta
amziai:
  - 'X'
---
# Liepkalnis

## Santrauka

Divizija turėjo 6 pabūklus, kurių dauguma buvo išdėstyta įtvirtinimuose Liepkalnyje. Mejeno karių įtvirtinimus Liepkalnyje.

## Teiginiai

<a id="claim-t-41863"></a>
- t-001
  global_id: t-41863
  teiginys: 'Gen. mjr. N. Zubovo divizija atakavo gen. J. Mejeno karių įtvirtinimus Liepkalnyje.'
  sudarymo_pagrindimas: 'Teiginys yra pilnas faktinis sakinys ir tiksliai paremtas citata.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Zubovas|Zubovas]]; llm_object: Liepkalnis'
  semantiniai_rysiai: '[[objektai/asmenys/Zubovas|Zubovas]] puolė Liepkalnis'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=7d0fb57c9cbc85e8e8a78bc5e9b9800ea5ff2facb426e5197b33806055fae2d3; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Artilerija: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Liepkalnis: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Artilerija: mention_match, thing
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Liepkalnis" parinktas kaip owner_note_path. Targetas "Artilerija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-41864"></a>
- t-002
  global_id: t-41864
  teiginys: 'Dauguma divizijos turėtų šešių pabūklų buvo išdėstyta Liepkalnio įtvirtinimuose.'
  susije_objektai: 'mentioned_object: [[objektai/daiktai/Artilerija|Artilerija]]; mentioned_place: Vilnius'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 618294-618398; hash=1dbf9fba2f5a38e73025096855a800bda6ad9a1f6a2e68a9712be9985f452fb3; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Liepkalnis: 0.73
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Zubovas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Liepkalnis: llm_allowed_candidate, place
  ryšio_paaiskinimas: Zubovo divizija atakavo įtvirtinimus Liepkalnyje; leistinas subjektas yra Zubovas.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Gen. mjr. N. Zubovo divizija
    atakavo gen. J. Mejeno karių įtvirtini-
    mus Liepkalnyje. Kautynės užsitęsė.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-002
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Iš viso divizijoje buvo 876 pés-
    tininkai ir 591 raitelis (1467 kariai). Divizija
    turėjo 6 pabūklus, kurių dauguma buvo iš-
    dėstyta įtvirtinimuose Liepkalnyje. Vilniaus
    miesto įgulą sudarė nedideli 4-ojo ir 8-ojo
    pėstininkų regimentų ir raitelių atsarginiai
    padaliniai - apie 1000 karių, tik 420 tu-
    réjo šautuvus, taip pat 7 artilerijos pabū-
    klus.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002

## Ryšiai
- [[objektai/asmenys/Zubovas]] puole Liepkalnis
