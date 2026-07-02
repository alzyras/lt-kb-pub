---
tipas: asmuo
pavadinimas: 'Miligedas'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - pilis
---
# Miligedas

## Santrauka

Dusburgietis teigia, kad mat Bartenšteino pilyje buvo vienas vyras, vardu Miligedas, toks drąsus, kad prūsams rodėsi, jog, jį nukovus, pusė pilies įgulos būtų buvusi sunaikinta. Dusburgietis teigia, kad sitai girdėdamas, Miligedas, paprašęs brolių leidimo ir jį gavęs, išėjo ir pradėjo šį bėgantį vytis.

## Teiginiai

<a id="claim-t-60173"></a>
- t-001
  global_id: t-60173
  teiginys: 'Miligedas nukovė savo iššaukėją, paspruko į mišką ir slaptais keliais sugrįžo į Bartenšteino pilį.'
  sudarymo_pagrindimas: 'Pradinis teiginys netiksliai perteikia veiksmą; citata remia aiškesnę formuluotę.'
  susije_objektai: 'llm_object: Bartenšteinas; mentioned_place: Bartenšteinas'
  semantiniai_rysiai: '[[objektai/asmenys/Miligedas|Miligedas]] keliavo į Bartenšteinas'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=3e56e010de90a65e0cd84994b24cd6a205f952a8d588d1bf23cafd6bd1dcd5ad; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Bartenšteinas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Miligedas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Bartenšteinas: mention_match, place, gap=15
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Miligedas" parinktas kaip owner_note_path. Targetas "Bartenšteinas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-60174"></a>
- t-002
  global_id: t-60174
  teiginys: 'Miligedas buvo Bartenšteino pilies vyras, kurį prūsai laikė itin svarbiu pilies įgulai.'
  sudarymo_pagrindimas: 'Citata palaiko asmens ryšį su Bartenšteinu ir jo reikšmę.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Prūsai|Prūsai]]; mentioned_place: Bartenšteinas'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 409780-410135; hash=5216b5ac4d26834174dbe8acdf38e50535206e55930cbfa4723991a0f5d95536; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: keliavo_i -> Bartenšteinas: 0.93
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Miligedas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Bartenšteinas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Tekstas tiesiogiai nurodo, kad Miligedas sugrįžo į Bartenšteino pilį.

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Miligedas nukovė savo iššaukėją, paspruko į mišką ir slaptais keliais sugrįžo į Bartenšteino pilį.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Sitai girdėdamas,
    Miligedas, paprašęs brolių leidimo ir jį gavęs, išėjo ir pradėjo šį bėgantį vytis. Pastebėjęs
    didelį priešų būrį, staiga iššokusį iš pasalų, jis nukovė savo iššaukėją, paspruko į mišką
    ir slaptais keliais sugrįžo į Bartenšteino pilį. Šitokiais bei panašiais būdais [prūsai] jį ilgai
    viliojo  į dvikovą, kol galop, nutykoję progą, nužudė.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-002
  santrauka: 'Miligedas buvo Bartenšteino pilies vyras, kurį prūsai laikė itin svarbiu pilies įgulai.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    broliai padarė daug nuostabių darbų. Mat Bartenšteino pilyje buvo vienas vyras, vardu
    Miligedas, toks drąsus, kad prūsams rodėsi, jog,  jį nukovus, pusė pilies įgulos būtų
    buvusi sunaikinta. Dėl to jie nutarė klasta jį išvilioti ir nužudyti; išmėginę daug visokių
    priemonių, galop ėmėsi štai šio būdo.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002

## Ryšiai
- Miligedas keliavo_i [[objektai/vietos/Bartenšteinas]]
