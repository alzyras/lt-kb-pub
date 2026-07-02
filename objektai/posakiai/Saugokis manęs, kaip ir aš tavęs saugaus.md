---
tipas: posakis
pavadinimas: 'Saugokis manęs, kaip ir aš tavęs saugaus'
saltiniai:
  - 'Vytautas Didysis 1350-1430 (1930 m.)'
datos:
  - '1350 m.'
  - '1387 m.'
  - '1430 m.'
  - '1930 m.'
  - '2026 m.'
date_start: '1350'
date_end: '2026'
sukurta: ''
atnaujinta: ''
amziai:
  - 'XIV'
  - 'XXI'
---
# Saugokis manęs, kaip ir aš tavęs saugaus

## Santrauka

Formulė pateikiama kaip Skirgailos perspėjimas Vytautui, beveik prilygstantis atviram priešiškumo pareiškimui.

## Forma

- Pagrindinė forma: Saugokis manęs, kaip ir aš tavęs saugaus

## Teiginiai

<a id="claim-t-50929"></a>
- t-001
  global_id: t-50929
  teiginys: 'Skirgaila per tarną Varšą perdavė Vytautui perspėjimą: „Saugokis manęs, kaip ir aš tavęs saugaus.“'
  sudarymo_pagrindimas: 'Citata palaiko posakio perdavimo aplinkybes; sutvarkyta skyryba ir OCR lūžiai.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Skirgaila|Skirgaila]]'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=3428d1d53cf7549bad967c9e707cde49181bfecf8353c57b9d9960ccbc5c38d6; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/07_extract_sayings_notes.md

<a id="claim-t-50930"></a>
- t-002
  global_id: t-50930
  teiginys: 'Skirgaila, matydamas sau pavojų, per tarną Varšą perdavė Vytautui perspėjimą: „Saugokis manęs, kaip ir aš tavęs saugaus“.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=3428d1d53cf7549bad967c9e707cde49181bfecf8353c57b9d9960ccbc5c38d6; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/07_extract_sayings_notes.md
  ryšio_patikimumas: susije_su -> Skirgaila: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Saugokis manęs, kaip ir aš tavęs saugaus: owner_note_path, thing, gap=0
  ryšio_targeto_parinkimas: Skirgaila: mention_match, person, gap=56
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Saugokis manęs, kaip ir aš tavęs saugaus" parinktas kaip owner_note_path. Targetas "Skirgaila" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Vytautas Didysis 1350-1430 (1930 m.)
  citata_originali: |
    Vytautas, kaskart labiau įsikarš­
    čiuodamas, ėmė nebesislėpti su savo planais, kad jis norįs atgau­
    ti savo tėviškę. Skirgaila, matydamas čia sau pavojų, atsiuntė
    pas Vytautą savo tarną Varšą su formaliniu perspėjimu dėl toli­
    mesnių represijų ir tarytum su karo paskelbimu: „Saugokis ma­
    nęs, kaip ir aš tavęs saugaus”. Ir tikrai jis saugojos Vytauto,
    dažnai kreipdamas Jogailos dėmesį ir išgaudamas iš jo sutiki­
    mą padaryti atitinkamų nedviprasmiškų žingsnių.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
    - t-002