---
tipas: ivykis
pavadinimas: 'Sūduvių žygis į Notangą ir jų išblaškymas'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - ginklas
  - ivykis
---
# Sūduvių žygis į Notangą ir jų išblaškymas

## Santrauka

Dusburgietis teigia, kad apie sūduvių pabėgimą Tuo pat metu sūduviai, norėdami atkeršyti už tai, kas aukščiau minėta, įsibrovė su palyginti nedidele kariuomene į Notangos žemę ir, apiplėšę nežymią jos dalį, pasitraukė.

## Laikotarpis ir datos

Nenurodyta

## Dalyviai ir vaidmenys

Nenurodyta

## Eiga

Nenurodyta

## Rezultatas

Nenurodyta

## Teiginiai

<a id="claim-t-62495"></a>
- t-001
  global_id: t-62495
  teiginys: 'Sūduviai su palyginti nedidele kariuomene įsiveržė į Notangą, apiplėšė nedidelę jos dalį ir pasitraukė.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Pradinis teiginys turi antraštės ir konteksto triukšmo, bet faktas paremtas citata.'
  susije_objektai: 'llm_object: Notanga; mentioned_place: Notanga; mentioned_group: [[objektai/grupes/Sūduviai|Sūduviai]]'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 517215-517546; hash=c8d64ae92a2c0738660706b6d63fd6b22c124e4e7b88b5bc803f708136b2a814; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Notanga: 0.91
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Sūduviai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Notanga: llm_allowed_candidate, place
  ryšio_paaiskinimas: Sūduvių įsiveržimas į Notangos žemę tiesiogiai rodo puolimą.

<a id="claim-t-183966"></a>
- t-002
  global_id: t-183966
  teiginys: 'Ordino broliai su ginklanešiais persekiojo iš Notangos pasitraukusius sūduvius, daug jų nukovė arba mirtinai sužeidė.'
  teiginio_tipas: 'saltinio_teiginys'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Citata pagrindžia papildomą įvykio rezultatą, tinkamą enciklopediniam sakiniui.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Sūduviai|Sūduviai]]; mentioned_place: Notanga'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 517215-517546; hash=c8d64ae92a2c0738660706b6d63fd6b22c124e4e7b88b5bc803f708136b2a814; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Notanga: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Sūduvių žygis į Notangą ir jų išblaškymas: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Notanga: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Sūduvių žygis į Notangą ir jų išblaškymas" parinktas kaip owner_note_path. Targetas "Notanga" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie sūduvių pabėgimą

      Tuo pat metu sūduviai, norėdami atkeršyti už tai, kas aukščiau minėta, įsibrovė su
    palyginti nedidele kariuomene į Notangos žemę ir, apiplėšę nežymią jos dalį, pasitraukė.
    Broliai, smarkiai juos persekioję su savo ginklanešiais, daug jų nukovė ar mirtinai
    sužeidė, o kiti gėdingai pabėgo.




       201 (196).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-001
    - t-002
