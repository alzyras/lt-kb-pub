---
tipas: vieta
pavadinimas: 'Bielskas'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1971 m.'
date_start: '1971'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - vieta
amziai:
  - 'XX'
---
# Bielskas

## Santrauka

Bielskas apibūdinamas kaip Palenkės miestas. Bielskas lokalizuojamas prie Baltosios, Narevo intako, į pietus nuo Balstogės.

## Teiginiai

<a id="claim-t-187170"></a>
- t-001
  global_id: t-187170
  teiginys: 'Bielskas lokalizuojamas prie Baltosios, Narevo intako, į pietus nuo Balstogės.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra aiškus sakinys apie Bielsko padėtį ir remiasi ta pačia geografine pastaba. Nepridėta nieko už citatos ribų.'
  susije_objektai: 'mentioned_place: Balstogė; mentioned_place: Narevas; mentioned_place: Branskas; mentioned_place: Lenkija'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=1a8e6267f6dded387ee1d4803dc51399d07dbbc7aa22783767dbac2503827f29; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Lenkija: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Bielskas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Lenkija: mention_match, place, gap=72
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Bielskas" parinktas kaip owner_note_path. Targetas "Lenkija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-187172"></a>
- t-003
  global_id: t-187172
  teiginys: 'Bielskas buvo Palenkės miestas, 1971 m. leidimo komentare tapatintas su Lenkijos Bielsku Podlaskiu.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Patikslinta, kad dabartinė lokalizacija yra leidimo komentaro teiginys.'
  susije_objektai: 'mentioned_place: Lenkija; mentioned_place: Palenkė; mentioned_place: Balstogė; mentioned_place: Branskas; mentioned_place: Narevas'
  temporaliniai_duomenys: 'įvykio data: 1971 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Patikslinta, kad dabartinė lokalizacija yra leidimo komentaro teiginys.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=1a8e6267f6dded387ee1d4803dc51399d07dbbc7aa22783767dbac2503827f29; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Lenkija: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Bielskas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Lenkija: mention_match, place, gap=72
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Bielskas" parinktas kaip owner_note_path. Targetas "Lenkija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-187565"></a>
- t-005
  global_id: t-187565
  teiginys: 'Bielskas buvo Palenkės miestas prie Baltosios, Narevo intako, į pietus nuo Balstogės.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Teiginys išskleidžia Bielsko kaip Palenkės miesto padėtį ir yra paremtas citata. OCR triukšmas bei puslapio žymos į teiginį neperkeltos.'
  susije_objektai: 'mentioned_place: Balstogė; mentioned_place: Narevas; mentioned_place: Palenkė; mentioned_place: Lenkija'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 555325-555555; hash=7df61703e712aa2e2a2ca2b83a9c29d2f3a2d13b4d9eeeaecf6632b642c0f3c3; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Balstogė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Bielskas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Balstogė: mention_match, place, gap=75
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Bielskas" parinktas kaip owner_note_path. Targetas "Balstogė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
- susijęs iš [[objektai/zodynas/Magdeburgo teisės.md#claim-t-113649|Magdeburgo teisės]]: Vytautas Magdeburgo teises suteikė Brastai ir Kaunui 1408 m., Tykocinui 1426 m., Drachočynui 1429 m. ir Bielskui 1430 m.
- susijęs iš [[objektai/zodynas/Magdeburgo teisės.md#claim-t-113656|Magdeburgo teisės]]: Vytautas Magdeburgo teises suteikė Brastai ir Kaunui 1408 m., Tykocinui 1426 m., Drachočynui 1429 m. ir Bielskui 1430 m.
- susijęs iš [[objektai/grupes/Miestelėnų luomas.md#claim-t-34347|Miestelėnų luomas]]: Vytauto laikais miestelėnų luomo pagrindai buvo padėti miestams suteikiant pirmąsias savivaldybes, vadintas magdeburgijomis.
- susijęs iš [[objektai/grupes/Vokiečiai.md#claim-t-117316|Vokiečiai]]: Vytautas valstybiniais ir ūkiniais sumetimais leido vokiečiams keltis į miestus.
- susijęs iš Branskas: Branskas lokalizuojamas prie Nureco, Vakarų Bugo intako.
- susijęs iš Branskas: Branskas buvo Palenkės miestas, 1971 m. leidimo komentare priskirtas Lenkijos Balstogės vaivadijai.
- susijęs iš [[objektai/zodynas/Magdeburgo teisės vokiečių teisė.md#claim-t-86535|Magdeburgo teisės vokiečių teisė]]: Vilnius 1321 m. turėjo Gedimino Rygos pavyzdžiu suteiktą vokiečių teisę, o 1387 m. iš Jogailos gavo Magdeburgo teisę.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Bielskas — kalbamu m elu Palenkės, o dabar Lenkijos Bielsk-
    Podlaski miestas (prie Baltosios, Narevo intako, | pietus nuo Bal­
    stogės).
    ! Branskas — Palenkės, dabar Lenkijos Balstogės vaivadijos mies­
    tas (prie Vakarų Bugo intako Nureco).
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-004
    - t-002
    - t-003
    - t-001
- c-002
  santrauka: 'Bielskas buvo Palenkės miestas prie Baltosios, Narevo intako, į pietus nuo Balstogės.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    M atyt, jis parašytas paties BK autoriaus iš įvairių
    šaltinių.
    293

    ## Puslapis 286

    47
    1  Bielskas — kalbamu m elu Palenkės, o dabar Lenkijos Bielsk-
    Podlaski miestas (prie Baltosios, Narevo intako, | pietus nuo Bal­
    stogės).
    !
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-005