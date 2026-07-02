---
tipas: vieta
pavadinimas: 'Vorotinskas'
saltiniai:
  - 'Vytautas Didysis 1350-1430 (1930 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - karas
  - kunigaikštis
  - vieta
---
# Vorotinskas

## Santrauka

Čia jam pasidavė Liubutsko, Mcensko, Novosielsko, Peremišlio, Vorotinsko, Odojevo ir kit. Tos ke­ lionės metu jam prisiekė ištikimybę bei pagalbą Maskvos hege­ monijoj buvę Tveriaus, Rezanės, Pskovo, Vorotinsko ir kit.

## Teiginiai

<a id="claim-t-36709"></a>
- t-001
  global_id: t-36709
  teiginys: 'Vorotinsko kunigaikščiai prisiekė Vytautui ištikimybę ir pažadėjo karo paramą.'
  susije_objektai: 'mentioned_object: [[objektai/zodynas/kunigaikščiai|kunigaikščiai]]; mentioned_place: Maskva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=457a2ebb0f663d913b43c7d0acd6e73da0771a7b840930f5332e257241b16f8f; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: uzeme -> Smolenskas: 0.94
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Smolenskas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai sako, kad Vytautas užėmė Smolenską.

<a id="claim-t-36710"></a>
- t-002
  global_id: t-36710
  teiginys: 'Vorotinsko kunigaikštija pasidavė Vytautui, kai jis plėtė valdžią Okos aukštupio kunigaikštystėse.'
  susije_objektai: 'llm_object: Smolenskas; mentioned_object: [[objektai/zodynas/kunigaikštija|kunigaikštija]]; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Odojevas; mentioned_place: Smolenskas'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=46b3d5c39f802b5e55e1a2125cc97a87a0e8cc2814cd35d2b5c2d3cc0e4923e1; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> kunigaikščiai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Vorotinskas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: kunigaikščiai: mention_match, thing, gap=11
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Vorotinskas" parinktas kaip owner_note_path. Targetas "kunigaikščiai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
- susijęs iš [[objektai/asmenys/Hennė (Ordino agentas).md#claim-t-35089|Hennė (Ordino agentas)]]: Hennė pranešė apie 1427 m. Vytauto kelionę per rytinį valstybės pakraštį.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Vytautas Didysis 1350-1430 (1930 m.)
  citata_originali: |
    Sako
    jis buvęs nukeliavęs 100 mylių į rytus nuo Smolensko. Tos ke­
    lionės metu jam prisiekė ištikimybę bei pagalbą Maskvos hege­
    monijoj buvę Tveriaus, Rezanės, Pskovo, Vorotinsko ir kit.
    kunigaikščiai. Jie pasižadėjo duoti karo paramos net prieš bu­
    vusį savo protektorių Didž.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-002
  šaltinis: Vytautas Didysis 1350-1430 (1930 m.)
  citata_originali: |
    Vytautas užėmė Smolenską antrąsyk
    ir galutinai^1 ). Tuo pat metu jis praplėtė savo valdžią Okos
    aukštupio kunigaikštėlių tarpe. Čia jam pasidavė Liubutsko,
    Mcensko, Novosielsko, Peremišlio, Vorotinsko, Odojevo ir kit.
    kunigaikštijos^2 ).
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002