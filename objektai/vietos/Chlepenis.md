---
tipas: vieta
pavadinimas: 'Chlepenis'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1492 m.'
  - '1494 m.'
date_start: '1492'
date_end: '1494'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
amziai:
  - 'XV'
---
# Chlepenis

## Santrauka

Pagal 1494.II.5 sutartį Chlepenis buvo pripažintas Maskvos Didžiajai Kunigaikštystei. Chlepenis aiškinamas kaip anuometinis Viazmos žemės miestas.

## Teiginiai

<a id="claim-t-187213"></a>
- t-001
  global_id: t-187213
  teiginys: 'Chlepenis lokalizuojamas apie 40 km į pietus nuo Rževo, prie Gžatės ir Vazuzos upių santakos.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra pilnas sakinys apie Chlepenio lokalizaciją. Citatos duomenys nepapildyti platesniu kontekstu.'
  susije_objektai: 'mentioned_place: Volga'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=fa560c6c74017b27dbcdfc2a5336abb38b66278c9b29773b8e1e9f49297cae97; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: priklause -> Viazma: 0.80
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Chlepenis: llm_allowed_candidate, place
  ryšio_targeto_parinkimas: Viazma: llm_allowed_candidate, place
  ryšio_paaiskinimas: Chlepenis apibūdinamas kaip Viazmos žemės miestas, todėl atsargiai fiksuojamas priklausymo vietai ryšys.

<a id="claim-t-187214"></a>
- t-002
  global_id: t-187214
  teiginys: 'Chlepenis aiškinamas kaip anuometinis Viazmos žemės miestas.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys tiksliai perteikia komentaro lokalizacinę informaciją.'
  susije_objektai: 'mentioned_place: Viazma; mentioned_place: Volga; llm_object: Viazma'
  semantiniai_rysiai: 'Chlepenis priklausė Viazma'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=fa560c6c74017b27dbcdfc2a5336abb38b66278c9b29773b8e1e9f49297cae97; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Volga: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Chlepenis: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Volga: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Chlepenis" parinktas kaip owner_note_path. Targetas "Volga" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
- susijęs iš Rohačevas: Rohačevas lokalizuojamas prie Chlepenio į pietus nuo Rževo.
- susijęs iš [[objektai/ivykiai/Karo tarp Lietuvos Didžiosios Kunigaikštystės ir Maskvos pradžia.md#claim-t-186774|Karo tarp Lietuvos Didžiosios Kunigaikštystės ir Maskvos pradžia]]: 1493 m. pavasarį Lietuvos Didžiosios Kunigaikštystės ir Maskvos karo veiksmai nutrūko.
- susijęs iš Liubuckas: Pagal 1494.II.5 sutarties rezultatą Liubuckas paliko LDK.
- susijęs iš Mosalskas: Mosalskas minimas Aleksandro 1492.IX.27 instrukcijoje tarp papildomai nurodytų vietų.
- susijęs iš Mosalskas: Mosalskas lokalizuojamas apie 100 km į vakarus nuo Kalugos.
- susijęs iš Rohačevas: Rohačevas nurodytas Aleksandro 1492 m. rugsėjo 27 d. instrukcijoje kaip maskvėnų užimtas LDK rytų pasienio miestas.
- susijęs iš Serpeiskas: Po 1494.II.5 sutarties Serpeiskas paliko LDK.
- susijęs iš Viazma: Šaltinio pastaboje Viazmos užėmimas siejamas su vėlesniu laiku, 1493 m. žiema iki vasario vidurio.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    * Vtazma — dabar RTFSR miestas (apie 150 km į rytus nuc
    Smolensko).
    5  Chlepenis — anuom et Vlazmos žemės miestas (apie 40 km
    į pietus nuo Rževo, arti Gžatės Ir Vazuzos upių. Volgos intakų,
    santakos).
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=fa560c6c74017b27dbcdfc2a5336abb38b66278c9b29773b8e1e9f49297cae97; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Volga: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Chlepenis: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Volga: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Chlepenis" parinktas kaip owner_note_path. Targetas "Volga" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=fa560c6c74017b27dbcdfc2a5336abb38b66278c9b29773b8e1e9f49297cae97; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: priklause -> Viazma: 0.80
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Chlepenis: llm_allowed_candidate, place
  ryšio_targeto_parinkimas: Viazma: llm_allowed_candidate, place
  ryšio_paaiskinimas: Chlepenis apibūdinamas kaip Viazmos žemės miestas, todėl atsargiai fiksuojamas priklausymo vietai ryšys.

## Ryšiai
- Chlepenis priklause [[objektai/vietos/Viazma]]
