---
tipas: ivykis
pavadinimas: 'Jono Olbrachto išrinkimas Lenkijos karaliumi'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1492 m.'
date_start: '1492'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - elekcija
amziai:
  - 'XV'
---
# Jono Olbrachto išrinkimas Lenkijos karaliumi

## Santrauka

Redakcinė pastaba nurodo, kad Jonas Olbrachtas Petrakavo seime buvo išrinktas Lenkijos karaliumi 1492 m. liepos 27 d. Redakcinė pastaba nurodo, kad Jonas Olbrachtas buvo vainikuotas Krokuvoje 1492 m. rugsėjo 23 d.

## Laikotarpis ir datos

- laikotarpis: 1492.VII.27; 1492.IX.23
- datos:
  - 1492.07.27
- amziai:
  - XV
- date_start: 1492
- date_end: 1492

## Dalyviai ir vaidmenys

Nenurodyta

## Eiga

Nenurodyta

## Rezultatas

Nenurodyta

## Teiginiai

<a id="claim-t-186770"></a>
- t-001
  global_id: t-186770
  teiginys: 'Jonas Olbrachtas Petrakavo seime buvo išrinktas Lenkijos karaliumi 1492 m. liepos 27 d.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Pašalinta perteklinė nuoroda į redakcinę pastabą.'
  susije_objektai: 'mentioned_place: Lenkija; mentioned_place: Petrakavas; mentioned_person: [[objektai/asmenys/Jonas Olbrachtas|Jonas Olbrachtas]]; mentioned_place: Krokuva'
  temporaliniai_duomenys: 'įvykio data: 1492 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Pašalinta perteklinė nuoroda į redakcinę pastabą.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=360e09bd81464cef0985550d79e05ac1ea0038a9546896a6cd3821d76a544605; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: susije_su -> Lenkija: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Jono Olbrachto išrinkimas Lenkijos karaliumi: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Lenkija: mention_match, place, gap=42
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Jono Olbrachto išrinkimas Lenkijos karaliumi" parinktas kaip owner_note_path. Targetas "Lenkija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-186771"></a>
- t-002
  global_id: t-186771
  teiginys: 'Jonas Olbrachtas buvo vainikuotas Krokuvoje 1492 m. rugsėjo 23 d.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra pilnas faktinis sakinys apie Jono Olbrachto vainikavimą. Citata tiesiogiai nurodo vietą ir datą, papildomų faktų nepridėta.'
  susije_objektai: 'mentioned_place: Krokuva; mentioned_person: [[objektai/asmenys/Jonas Olbrachtas|Jonas Olbrachtas]]; mentioned_place: Lenkija; llm_object: Krokuva'
  temporaliniai_duomenys: 'įvykio data: 1492 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys yra pilnas faktinis sakinys apie Jono Olbrachto vainikavimą. Citata tiesiogiai nurodo vietą ir datą, papildomų faktų nepridėta.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=360e09bd81464cef0985550d79e05ac1ea0038a9546896a6cd3821d76a544605; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: keliavo_i -> Krokuva: 0.58
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Jonas Olbrachtas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Krokuva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Vainikavimas Krokuvoje leidžia atsargiai sieti Joną Olbrachtą su buvimu Krokuvoje, nors kelionės veiksmas nėra tiesiogiai pasakytas.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    1  Jonas Olbrachtas buvo išrinktas Lenkijos karaliumi Petraka-
    vo seime, 1492.V1I.27, vainikuotas Krokuvoje 1492.IX.23.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
    - t-002