---
tipas: vieta
pavadinimas: 'Voložinas'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
---
# Voložinas

## Santrauka

Jonas Goštautas užsuko pas Voložino kunigaikščius. Voložine Goštautą pasiekė žinia apie Žygimanto mirtį.

## Teiginiai

<a id="claim-t-187387"></a>
- t-001
  global_id: t-187387
  teiginys: 'Voložine Goštautą pasiekė žinia apie Žygimanto mirtį.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys glaustas, faktinis ir tiesiogiai paremtas citata.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Goštautas|Goštautas]]; mentioned_object: [[objektai/zodynas/didysis kunigaikštis|didysis kunigaikštis]]; mentioned_object: [[objektai/zodynas/seniūnas|seniūnas]]; mentioned_place: Smolenskas'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=42f4abe3636f3c1139dc960fac0d36a102fa4a0afafd08c28a2241dd6567759a; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: keliavo_i -> Voložinas: 0.86
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Goštautas (vyskupas, XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Voložinas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Goštautas pakeliui užsuko pas Voložino kunigaikščius, todėl vieta tiesiogiai susieta su jo kelione.

<a id="claim-t-187388"></a>
- t-002
  global_id: t-187388
  teiginys: 'Kelyje pas kunigaikštį Žygimantą Jonas Goštautas užsuko pasisvečiuoti pas Voložino kunigaikščius.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra aiškus faktinis sakinys apie Jono Goštauto sustojimą pas Voložino kunigaikščius. Citatoje minimos vėlesnės žinios ir kelionė toliau sąmoningai nepridėtos.'
  susije_objektai: 'llm_object: Voložinas; mentioned_object: [[objektai/zodynas/didysis kunigaikštis|didysis kunigaikštis]]; mentioned_object: [[objektai/zodynas/seniūnas|seniūnas]]; mentioned_person: [[objektai/asmenys/Goštautas|Goštautas]]; mentioned_place: Smolenskas; llm_object: Smolenskas'
  semantiniai_rysiai: '[[objektai/asmenys/Goštautas|Goštautas]] keliavo į Voložinas'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=42f4abe3636f3c1139dc960fac0d36a102fa4a0afafd08c28a2241dd6567759a; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Goštautas (vyskupas, XV a.): 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Voložinas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Goštautas (vyskupas, XV a.): mention_match, person, gap=9
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Voložinas" parinktas kaip owner_note_path. Targetas "Goštautas (vyskupas, XV a.)" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
- susijęs iš Alšėnai: Voložine išgirdęs apie Žygimanto mirtį, Jonas Goštautas išskubėjo į Alšėnus pas Jurgį Simonaitį Alšėniškį.
- susijęs iš Želvos ežerai: Rytinė Lietuvos teritorijos linija buvo vedama per Drivietų, Želvos ir Oziraičių ežerus.
- susijęs iš Želvos ežerai: Lietuvos rytinė teritorijos linija buvo vedama per Želvos ežerus.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Ir jų dar nebuvo
    suvažiavusių, nes kai kurie buvo tolimuose Didžiosios
    Kunigaikštystės miestuose, srityse: 2emaičių seniūnas
    Kęsgailą2  Žemaitijoje, Jonas Goštautas3  Smolenske,
    nes jis tuo metu buvo Smolensko vietininku. Didysis
    kunigaikštis Žygimantas rašė ir jam, kad skirtu laiku
    atvažiuotų pas didįjį kunigaikštį Žygimantą, o į Smo­
    lenską jo vieton nusiuntė Andrių Sakavičių * . Kelyje
    pas kunigaikštį Žygimantą Jonas Goštautas užsuko pa­
    sisvečiuoti pas Voložino kunigaikščius, ir Voložine at­
    ėjo žinia apie didžiojo kunigaikščio Žygimanto mirtį,
    ir Goštautas išskubėjo j Alšėnus6  pas kunigaikštį Jurgį
    Simonaitį Alšėniškį7 .
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
    - t-001
    - t-004
    - t-003

## Ryšiai
- [[objektai/asmenys/Goštautas|Goštautas (vyskupas, XV a.)]] keliavo_i Voložinas
