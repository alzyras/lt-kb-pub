---
tipas: vieta
pavadinimas: 'Romovė Romuva'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
---
# Romovė Romuva

## Santrauka

Dusburgietis teigia, kad 204 Romovė resp. Romuva (D. Dusburgietis teigia, kad ilgainiui įsivyravo nuomonė, kad Nadruvos Romovės resp. Romuvos vieta apskritai nebeatsekama. Dusburgietis teigia, kad aprašyta Romovė resp. Romuva — autentiškas faktas.

## Teiginiai

<a id="claim-t-58475"></a>
- t-001
  global_id: t-58475
  teiginys: 'Romovė, arba Romuva, Dusburgiečio duomenimis buvo prūsų, lietuvių ir kitų baltų religinio kulto centras.'
  sudarymo_pagrindimas: 'Pašalintas OCR triukšmas ir suformuluotas pilnas sakinys apie vietą.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Baltai|Baltai]]; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_place: Romuva'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 210797-210930; hash=68813071458acfcd2d2dded4c33d6e759ccfd81e54d2caf35b7c49e29d01c8df; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Baltai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Romovė Romuva: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Baltai: mention_match, group, gap=74
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Romovė Romuva" parinktas kaip owner_note_path. Targetas "Baltai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-58476"></a>
- t-002
  global_id: t-58476
  teiginys: 'Ilgainiui įsivyravo nuomonė, kad Nadruvos Romovės, arba Romuvos, vieta apskritai nebeatsekama.'
  sudarymo_pagrindimas: 'Pašalinta klaidinanti autorystės atribucija ir suformuluotas pilnas sakinys.'
  susije_objektai: 'mentioned_place: Romuva; llm_object: Nadruva; mentioned_place: Nadruva; mentioned_place: Viena'
  semantiniai_rysiai: 'Romovė Romuva priklausė Nadruva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 212334-212519; hash=8d06a9c5800ed1f95850b011706c7dca118e088ae9a5cbd1d7242428aac5ada2; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: priklause -> Nadruva: 0.85
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Romovė Romuva: llm_allowed_candidate, place
  ryšio_targeto_parinkimas: Nadruva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Kilmininko konstrukcija tiesiogiai sieja Romovę / Romuvą su Nadruva.

<a id="claim-t-58477"></a>
- t-003
  global_id: t-58477
  teiginys: 'Aprašyta Romovė resp. Romuva — autentiškas faktas.'
  sudarymo_pagrindimas: 'claim_quality_pipeline deterministic repair'
  susije_objektai: 'mentioned_place: Romuva; mentioned_object: [[objektai/zodynas/kunigas|kunigas]]'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=07f507aec1e48523bdd04cfb96f2c1ccd767f01e1012b9d6c7ce17bc216462ec; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Romuva: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Romovė Romuva: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Romuva: mention_match, place, gap=13
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Romovė Romuva" parinktas kaip owner_note_path. Targetas "Romuva" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Ilgainiui įsivyravo nuomonė, kad Nadruvos Romovės resp. Romuvos
    vieta apskritai nebeatsekama.
      Turime pagrindo manyti, kad Nadruvoje buvusi ne viena vieta, susijusi su pagonišku
    kultu.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-002
    - t-004

- c-002
  santrauka: 'Romovė, arba Romuva, Dusburgiečio duomenimis buvo prūsų, lietuvių ir kitų baltų religinio kulto centras.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    204 Romovė resp. Romuva (D. Romow, Jer.— Rômowe), Romava, pasak Dusburgiečio,—
    prūsų, lietuvių ir kitų baltų religinio kulto centras.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-001

- c-003
  santrauka: 'Aprašyta Romovė resp. Romuva — autentiškas faktas.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Mūsų nuomone, D. aprašyta Romovė resp. Romuva — autentiškas faktas.
      205 D. Criwe, Jer. der obriste êwarte, t. y. vyriausiasis kunigas (ar teisėjas).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-003

## Ryšiai
- Romovė Romuva priklause [[objektai/vietos/Nadruva]]
