---
tipas: posakis
pavadinimas: 'Širvintų stebuklas'
saltiniai:
  - 'Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)'
datos:
  - '2013 m.'
  - '2026 m.'
date_start: '2013'
date_end: '2026'
sukurta: ''
atnaujinta: ''
tags:
  - posakis
amziai:
  - 'XXI'
---
# Širvintų stebuklas

## Santrauka

Ši formulė yra visuomenėje prigijęs Širvintų pergalės pavadinimas.

## Forma

- Pagrindinė forma: Širvintų stebuklas

## Teiginiai

<a id="claim-t-41478"></a>
- t-001
  global_id: t-41478
  teiginys: 'Širvintų pergalė visuomenėje buvo praminta „Širvintų stebuklu“.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lenkai|Lenkai]]; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_object: [[objektai/daiktai/Balnas|Balnas]]; mentioned_place: Gardinas; mentioned_place: Lietuva'
  pagrindžia:
    - c-001

<a id="claim-t-41479"></a>
- t-002
  global_id: t-41479
  teiginys: 'Balno reidas į Gardino pulko užnugarį visuomenėje buvo pramintas „Širvintų stebuklu“.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lenkai|Lenkai]]; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_object: [[objektai/daiktai/Balnas|Balnas]]; mentioned_place: Gardinas; mentioned_place: Lietuva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=3d9d6e2c59466395da1f301dd1ccd382b764324995dd3db6701243ebcddccdfd; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/07_extract_sayings_notes.md::validation_repair
  ryšio_patikimumas: susije_su -> Balnas: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Širvintų stebuklas: owner_note_path, thing, gap=0
  ryšio_targeto_parinkimas: Balnas: mention_match, thing
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Širvintų stebuklas" parinktas kaip owner_note_path. Targetas "Balnas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    T. Balno reidas į Gardino pulko užnugarį

    visuomenei ir buvo pramintas „Širvintų ste-
    buklu“. Ši pergalė leido lietuviams perimti
    iniciatyvą. Jei lenkams būtų pavykę sėkmin-
    gai įvykdyti suplanuotą puolimą ir priar-
    tėti prie Kauno, būtų iškilęs didelis pavojus
    Lietuvos valstybingumui.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
    - t-001