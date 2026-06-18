---
tipas: vieta
pavadinimas: 'Birgelava'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - ginklas
  - miestas
  - mūšis
  - pilis
---
# Birgelava

## Santrauka

Dusburgietis teigia, kad likę įsibrovė į Kulmo žemę ir, neskaitant kitų piktybių, ten pridarytų, paėmė Birgelavos pilį438, pagrobdami gyvulius bei visą mantą brolių ir tų žmonių, kurie buvo subėgę į pilį. Dusburgietis teigia, kad vakarop ji priėjo Birgelavos pilį ir ten įsirengė stovyklą443.

## Teiginiai

<a id="claim-t-90326"></a>
- t-001
  global_id: t-90326
  teiginys: 'Treniota su talkininkais subūrė iki 30000 vyrų ir dalį jų pasiuntė į Kulmo žemę, kur buvo paimta Birgelavos pilis.'
  sudarymo_pagrindimas: 'Pradinis teiginys nutrūkęs; citata pagrindžia Treniotos veiksmą ir ryšį su Birgelavos pilimi.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_person: [[objektai/asmenys/Treniota|Treniota]]; mentioned_place: Kulmas; mentioned_place: Pamedė; mentioned_place: Prūsija; mentioned_place: Viena; llm_object: Birgelava'
  semantiniai_rysiai: '[[objektai/asmenys/Treniota|Treniota]] užėmė Birgelava'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 456820-457408; hash=9dce7b960cc19e623319fb6f41e664e65b305bb2b51673de594dbfa1dc1cf2b3; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: uzeme -> Birgelava: 0.72
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Lietuviai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Birgelava: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata nurodo pilies paėmimą, o puolėjai yra Treniotos vadovaujami lietuviai ir pagonys; iš kandidatų tinkamiausia grupė yra lietuviai.

<a id="claim-t-90327"></a>
- t-002
  global_id: t-90327
  teiginys: 'Į Kulmo žemę įsibrovę kariai paėmė Birgelavos pilį ir pagrobė joje buvusius gyvulius bei mantą.'
  sudarymo_pagrindimas: 'Pradinis teiginys prasideda boilerplate ir yra per ilgas; citata remia aiškų faktą apie pilies paėmimą.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_place: Kulmas; mentioned_place: Pamedė; mentioned_place: Prūsija; mentioned_place: Viena; llm_object: Birgelava'
  semantiniai_rysiai: '[[objektai/grupes/Lietuviai|Lietuviai]] užėmė Birgelava'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 461487-462016; hash=0e67afe066093abcb7fc9f15869161d4dae87e40379f107d56088521375b0c86; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Kulmas: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Birgelava: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Kulmas: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Birgelava" parinktas kaip owner_note_path. Targetas "Kulmas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-90328"></a>
- t-003
  global_id: t-90328
  teiginys: 'Vakarop ji priėjo Birgelavos pilį ir ten įsirengė stovyklą443.'
  sudarymo_pagrindimas: 'claim_quality_pipeline deterministic repair'
  susije_objektai: 'mentioned_place: Kulmas; mentioned_place: Viena'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 456820-457408; hash=9dce7b960cc19e623319fb6f41e664e65b305bb2b51673de594dbfa1dc1cf2b3; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: uzeme -> Birgelava: 0.68
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Treniota: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Birgelava: llm_allowed_candidate, place
  ryšio_paaiskinimas: Pilį paėmė Treniotos suburta kariuomenė; subjektas tekste yra Treniota su talkininkais.
- susijęs iš [[objektai/ivykiai/Treniotos žygis į Kulmo žemę ir Birgelavos pilies apiplėšimas.md#claim-t-62509|Treniotos žygis į Kulmo žemę ir Birgelavos pilies apiplėšimas (pilis)]]: Treniota subūrė iki 30 tūkst. vyrų, įsiveržė į Kulmo žemę ir paėmė Birgelavos pilį, pagrobdamas gyvulius bei mantą.
- susijęs iš [[objektai/asmenys/Treniota.md#claim-t-90060|Treniota]]: Treniota su talkininkais subūrė iki 30 000 vyrų, nusiaubė Mazoviją ir Pamedę, o jo pajėgos paėmė Birgelavos pilį.
- susijęs iš [[objektai/ivykiai/Skomanto naktinis puolimas prie Birgelavos.md#claim-t-91919|Skomanto naktinis puolimas prie Birgelavos]]: Vakarop ji priėjo Birgelavos pilį ir ten įsirengė stovyklą443.
- susijęs iš [[objektai/ivykiai/Treniotos žygis į Kulmo žemę ir Birgelavos pilies apiplėšimas.md#claim-t-62509|Treniotos žygis į Kulmo žemę ir Birgelavos pilies apiplėšimas (pilis)]]: Treniota subūrė iki 30 tūkst. vyrų, įsiveržė į Kulmo žemę ir paėmė Birgelavos pilį, pagrobdamas gyvulius bei mantą.
- susijęs iš [[objektai/ivykiai/Skomanto naktinis puolimas prie Birgelavos.md#claim-t-91919|Skomanto naktinis puolimas prie Birgelavos]]: Vakarop ji priėjo Birgelavos pilį ir ten įsirengė stovyklą443.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie Birgelavos pilies sugriovimą

       Treniota, lietuvių karaliaus sūnus436, daugelio kitų pagonių [gentibus] talkinamas,
    subūrė kovai iki trisdešimties tūkstančių vyrų ir, atžygiavęs prie Prūsijos žemės, padalijo
    juos į tris dalis437, kurių vieną nusiuntė prieš Mazoviją, kitą — prieš Pamedę ir abi šias
    žemes nusiaubė, grobdamas ir degindamas. Likę įsibrovė  į Kulmo žemę ir, neskaitant
    kitų piktybių, ten pridarytų, paėmė Birgelavos pilį438, pagrobdami gyvulius bei visą mantą
    brolių ir tų žmonių, kurie buvo subėgę į pilį. Broliai ir kiti žmonės išliko gyvi, gindamiesi
    viename kuore.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 456820-457408; hash=9dce7b960cc19e623319fb6f41e664e65b305bb2b51673de594dbfa1dc1cf2b3; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: uzeme -> Birgelava: 0.72
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Lietuviai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Birgelava: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata nurodo pilies paėmimą, o puolėjai yra Treniotos vadovaujami lietuviai ir pagonys; iš kandidatų tinkamiausia grupė yra lietuviai.
    - t-002

- c-002
  santrauka: 'Vakarop ji priėjo Birgelavos pilį ir ten įsirengė stovyklą443.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    į dvi dalis, kurių viena patraukė prieš Torunę, o kita prieš Kulmo miestą, žudydamos,
    imdamos į nelaisvę ir degindamos visa, ką sutikdavo pakelėje. Vakarop ji priėjo Birgelavos
    pilį ir ten įsirengė stovyklą443. Tą pačią naktį šios pilies broliai su savo ginklanešiais išėjo
    iš pilies; kai jie užpuolė miegančius karius, kai vienus žudė, o kitus mirtinai žeidė, kilo
    baisus triukšmas, kurį išgirdo sargybiniai, tą naktį saugoję kariuomenę, jie atskubėjo,
    pasirengę mūšiui, ir nukovė du brolius, vieną broliuką ir daug ginklanešių.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: 461487-462016; hash=0e67afe066093abcb7fc9f15869161d4dae87e40379f107d56088521375b0c86; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Kulmas: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Birgelava: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Kulmas: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Birgelava" parinktas kaip owner_note_path. Targetas "Kulmas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: 456820-457408; hash=9dce7b960cc19e623319fb6f41e664e65b305bb2b51673de594dbfa1dc1cf2b3; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: uzeme -> Birgelava: 0.68
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Treniota: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Birgelava: llm_allowed_candidate, place
  ryšio_paaiskinimas: Pilį paėmė Treniotos suburta kariuomenė; subjektas tekste yra Treniota su talkininkais.

## Ryšiai
- [[objektai/asmenys/Treniota]] uzeme Birgelava
- [[objektai/grupes/Sūduviai]] keliavo_i Birgelava
- [[objektai/grupes/Lietuviai]] uzeme Birgelava
