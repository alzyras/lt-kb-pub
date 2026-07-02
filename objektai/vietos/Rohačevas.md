---
tipas: vieta
pavadinimas: 'Rohačevas'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1492 m.'
date_start: '1492'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - vieta
amziai:
  - 'XV'
---
# Rohačevas

## Santrauka

Rohačevas minimas Aleksandro 1492.IX.27 instrukcijoje. Rohačevas lokalizuojamas prie Chlepenio į pietus nuo Rževo.

## Teiginiai

<a id="claim-t-187309"></a>
- t-001
  global_id: t-187309
  teiginys: 'Rohačevas lokalizuojamas prie Chlepenio į pietus nuo Rževo.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra aiškus lokalizacijos sakinys ir tiesiogiai paremtas citata.'
  susije_objektai: 'mentioned_place: Chlepenis; mentioned_place: Rževas; mentioned_group: [[objektai/grupes/Maskvėnai|Maskvėnai]]; mentioned_place: Kaluga; mentioned_place: Mosalskas; mentioned_place: Serpeiskas; mentioned_place: Smolenskas'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d4f427dd82b40a788e5e33d02f1b86a2e315483ada6014e010748d22b3837767; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: uzeme -> Rohačevas: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Maskvėnai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Rohačevas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Teiginys tiesiogiai sako, kad Rohačevas buvo maskvėnų užimtas.

<a id="claim-t-187310"></a>
- t-002
  global_id: t-187310
  teiginys: 'Rohačevas nurodytas Aleksandro 1492 m. rugsėjo 27 d. instrukcijoje kaip maskvėnų užimtas LDK rytų pasienio miestas.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra pilnas faktinis sakinys apie Rohačevą ir tiksliai remiasi redakcine pastaba. Nepridėta papildomos informacijos apie kitus miestus.'
  susije_objektai: 'llm_object: Rohačevas; mentioned_group: [[objektai/grupes/Maskvėnai|Maskvėnai]]; mentioned_place: Chlepenis; mentioned_place: Kaluga; mentioned_place: Mosalskas; mentioned_place: Rževas; mentioned_place: Serpeiskas; mentioned_place: Smolenskas'
  semantiniai_rysiai: '[[objektai/grupes/Maskvėnai|Maskvėnai]] užėmė Rohačevas'
  temporaliniai_duomenys: 'įvykio data: 1492 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys yra pilnas faktinis sakinys apie Rohačevą ir tiksliai remiasi redakcine pastaba. Nepridėta papildomos informacijos apie kitus miestus.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d4f427dd82b40a788e5e33d02f1b86a2e315483ada6014e010748d22b3837767; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Chlepenis: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Rohačevas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Chlepenis: mention_match, place, gap=30
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Rohačevas" parinktas kaip owner_note_path. Targetas "Chlepenis" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
- susijęs iš [[objektai/ivykiai/Karo tarp Lietuvos Didžiosios Kunigaikštystės ir Maskvos pradžia.md#claim-t-186774|Karo tarp Lietuvos Didžiosios Kunigaikštystės ir Maskvos pradžia]]: 1493 m. pavasarį Lietuvos Didžiosios Kunigaikštystės ir Maskvos karo veiksmai nutrūko.
- susijęs iš Mosalskas: Mosalskas minimas Aleksandro 1492.IX.27 instrukcijoje tarp papildomai nurodytų vietų.
- susijęs iš Mosalskas: Mosalskas lokalizuojamas apie 100 km į vakarus nuo Kalugos.
- susijęs iš Viazma: Šaltinio pastaboje Viazmos užėmimas siejamas su vėlesniu laiku, 1493 m. žiema iki vasario vidurio.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    6 Serpeiskas — Smolensko žemės miestas (apie 200 km | ry­
    tus nuo Smolensko, dabar RTFSR Kalugos srities miestas), seniau
    priklausęs Meščovsko apskričiai.
    Išskyrus ViaznuĮ. visi aukščiau išvardytieji LDK rytų pasienio
    miestai, kaip maskvėnų užimti, y ra minimi Aleksandro 1492.IX 27
    rašte (instrukcijoje); papildomai ten dar nurodytas Mosalskas (apie
    100 km | vakarus nuo Kalugos) ir Rohačevas (prie Chlepenio Į pie­
    tus nuo Rževo).
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
    - t-001

## Ryšiai
- [[objektai/grupes/Maskvėnai]] uzeme Rohačevas
