---
tipas: daiktas
pavadinimas: 'Šernų amuletai'
saltiniai:
  - 'Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)'
datos:
  - '1978 m.'
  - '2026 m.'
date_start: '1978'
date_end: '2026'
sukurta: ''
atnaujinta: ''
tags:
  - daiktas
  - papuošalas
amziai:
  - 'XX'
  - 'XXI'
---
# Šernų amuletai

## Santrauka

Aestii, anot Tacito, nešiojo šernų amuletus.

## Pavadinimai šaltiniuose

Nenurodyta

## Laikotarpis ir datos

Nenurodyta

## Kas tai

Nenurodyta

## Naudojimas

Nenurodyta

## Kontekstas

Nenurodyta

## Teiginiai

<a id="claim-t-47838"></a>
- t-001
  global_id: t-47838
  teiginys: 'Anot Tacito, prie Svebų jūros gyvenę Aestii garbino dievų motiną, nešiojo šernų amuletus, augino javus ir rinko gintarą.'
  sudarymo_pagrindimas: 'Ilgas teiginys sutrumpintas, paliekant citatos remiamus faktus apie šernų amuletus.'
  susije_objektai: 'mentioned_object: [[objektai/daiktai/Gintaras|Gintaras]]; mentioned_group: [[objektai/grupes/Aisčiai|Aisčiai]]; mentioned_group: [[objektai/grupes/Aušrėnai|Aušrėnai]]; mentioned_group: [[objektai/grupes/Baltai|Baltai]]; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_group: [[objektai/grupes/Svebai|Svebai]]; mentioned_object: [[objektai/posakiai/Jie « papročiais ir savo išore yra kaip svebai »|Jie « papročiais ir savo išore yra kaip svebai »]]; mentioned_object: [[objektai/zodynas/glesum|glesum]]'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=997e6c12707b31560f8a05271b0484350b410be2f285a340f51c59d9b917fa79; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/05_extract_items_notes.md
  ryšio_patikimumas: gyveno -> Baltija: 0.80
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Aušrėnai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Baltija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Tekstas tiesiogiai nurodo, kad Aestii gyveno prie Baltijos jūros kranto.

<a id="claim-t-47839"></a>
- t-002
  global_id: t-47839
  teiginys: 'Tacitas rašė, kad prie Baltijos jūros gyvenę Aestii garbino dievų motiną ir nešiojo šernų amuletus.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Aisčiai|Aisčiai]]; mentioned_group: [[objektai/grupes/Aušrėnai|Aušrėnai]]; mentioned_group: [[objektai/grupes/Baltai|Baltai]]; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_group: [[objektai/grupes/Svebai|Svebai]]; mentioned_object: [[objektai/posakiai/Jie « papročiais ir savo išore yra kaip svebai »|Jie « papročiais ir savo išore yra kaip svebai »]]; mentioned_object: [[objektai/zodynas/glesum|glesum]]; mentioned_place: Baltija; llm_object: Baltija'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=997e6c12707b31560f8a05271b0484350b410be2f285a340f51c59d9b917fa79; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/05_extract_items_notes.md
  ryšio_patikimumas: susije_su -> Gintaras: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Šernų amuletai: owner_note_path, thing, gap=0
  ryšio_targeto_parinkimas: Gintaras: mention_match, thing, gap=38
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Šernų amuletai" parinktas kaip owner_note_path. Targetas "Gintaras" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)
  citata_originali: |
    Lietuviai prieš I pasaulinį karą visai
    baltų tautų grupei buvo davę aisčių vardą (K. Būga). Anot Tacito,
    Svebų (Baltijos) jūros dešiniajame krante gyveną Aestii garbiną
    dievų motiną, nešioją šernų amuletus, javus ir kitus žemės vaisius
    rūpestingiau auginą, negu germanai: jūros pakraščiais ir krante jie
    renką gintarą, kurį vadiną « glesum ». Jie « papročiais ir savo išore
    yra kaip svebai ».
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=997e6c12707b31560f8a05271b0484350b410be2f285a340f51c59d9b917fa79; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/05_extract_items_notes.md
  ryšio_patikimumas: gyveno -> Baltija: 0.80
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Aušrėnai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Baltija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Tekstas tiesiogiai nurodo, kad Aestii gyveno prie Baltijos jūros kranto.
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=997e6c12707b31560f8a05271b0484350b410be2f285a340f51c59d9b917fa79; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/05_extract_items_notes.md
  ryšio_patikimumas: susije_su -> Gintaras: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Šernų amuletai: owner_note_path, thing, gap=0
  ryšio_targeto_parinkimas: Gintaras: mention_match, thing, gap=38
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Šernų amuletai" parinktas kaip owner_note_path. Targetas "Gintaras" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
