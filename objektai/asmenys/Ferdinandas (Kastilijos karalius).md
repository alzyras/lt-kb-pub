---
tipas: asmuo
pavadinimas: 'Ferdinandas (Kastilijos karalius)'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
datos:
  - '1241 m.'
date_start: '1241'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - karalius
amziai:
  - 'XIII'
periodo_grupes:
  - 'viduramžiai'
---
# Ferdinandas (Kastilijos karalius)

## Santrauka

Dusburgietis teigia, kad kaip Ferdinandas, Kastilijos karalius, nugalėjo Granados karalių Tuo pat metu Ferdinandas, Kastilijos karalius, nunugalėjo Granados saracėnų karalių, 596 1241 m. įvykiai. Dusburgietis teigia, kad be to, ten buvo parašyta, kad Ferdinando laikais ji ir turi būti surasta (Mart.

## Teiginiai

<a id="claim-t-60113"></a>
- t-001
  global_id: t-60113
  teiginys: 'Be to, ten buvo parašyta, kad Ferdinando laikais ji ir turi būti surasta (Mart.'
  sudarymo_pagrindimas: 'claim_quality_pipeline deterministic repair'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=3797f1f78e65a9b836f9d5855f8004e6023977d2ef9542ebce5aea22bfc45653; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Saracėnai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Ferdinandas (Kastilijos karalius): owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Saracėnai: mention_match, group, gap=52
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Ferdinandas (Kastilijos karalius)" parinktas kaip owner_note_path. Targetas "Saracėnai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-60114"></a>
- t-002
  global_id: t-60114
  teiginys: 'Ferdinandas, Kastilijos karalius, nugalėjo Granados saracėnų karalių, kuris vėliau mokėjo jam duoklę.'
  sudarymo_pagrindimas: 'Teiginys tiksliai perteikia citatos faktą.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Saracėnai|Saracėnai]]'
  temporaliniai_duomenys: 'įvykio data: 1241 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys tiksliai perteikia citatos faktą.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=58e906efa97e0004f9347d0ee7bb4c4844f97afa45baeb2ea5f29b0be31dc21a; match=fallback; occurrences=0
  sprendimo_priezastis: auto

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Be to, ten buvo parašyta, kad Ferdinando laikais ji ir turi būti surasta (Mart.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Žydas, šitai perskaitęs, su visa šeimyna priėmė krikštą. Be to, ten buvo
    parašyta, kad Ferdinando laikais ji ir turi būti surasta (Mart. p. 400; Ptol. 21,34).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-002
  santrauka: 'Ferdinandas, Kastilijos karalius, nugalėjo Granados saracėnų karalių, kuris vėliau mokėjo jam duoklę.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    23. Kaip Ferdinandas, Kastilijos karalius, nugalėjo Granados karalių

      Tuo pat metu Ferdinandas, Kastilijos karalius, nunugalėjo Granados saracėnų karalių,
      596 1241 m. įvykiai.

    kuris netgi turėjo ilgai jam mokėti duoklę po 1000 aukso marobortinų  į dieną (Ptol.
    21,33).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002