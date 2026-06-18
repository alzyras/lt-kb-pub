---
tipas: vieta
pavadinimas: 'Branskas'
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
# Branskas

## Santrauka

Branskas apibūdinamas kaip Palenkės miestas. Branskas lokalizuojamas prie Nureco, Vakarų Bugo intako.

## Teiginiai

<a id="claim-t-187174"></a>
- t-001
  global_id: t-187174
  teiginys: 'Branskas lokalizuojamas prie Nureco, Vakarų Bugo intako.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys yra pilnas faktinis sakinys apie Bransko lokalizaciją. Jis neperima perteklinio konteksto apie Bielską.'
  susije_objektai: 'mentioned_place: Balstogė; mentioned_place: Bielskas; mentioned_place: Lenkija; mentioned_place: Narevas'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=ed4ab1b11b233849b85a002f08a175b203c4ebe72b0767cb27f7910323dbe396; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Balstogė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Branskas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Balstogė: mention_match, place, gap=78
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Branskas" parinktas kaip owner_note_path. Targetas "Balstogė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-187175"></a>
- t-002
  global_id: t-187175
  teiginys: 'Branskas buvo Palenkės miestas, 1971 m. leidimo komentare priskirtas Lenkijos Balstogės vaivadijai.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Patikslinta, kad administracinė lokalizacija yra leidimo komentaro teiginys.'
  susije_objektai: 'mentioned_place: Balstogė; mentioned_place: Lenkija; mentioned_place: Palenkė; mentioned_place: Bielskas; mentioned_place: Narevas'
  temporaliniai_duomenys: 'įvykio data: 1971 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Patikslinta, kad administracinė lokalizacija yra leidimo komentaro teiginys.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=ed4ab1b11b233849b85a002f08a175b203c4ebe72b0767cb27f7910323dbe396; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Balstogė: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Branskas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Balstogė: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Branskas" parinktas kaip owner_note_path. Targetas "Balstogė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
- susijęs iš Bielskas: Bielskas lokalizuojamas prie Baltosios, Narevo intako, į pietus nuo Balstogės.
- susijęs iš Bielskas: Bielskas lokalizuojamas prie Baltosios, Narevo intako, į pietus nuo Balstogės.
- susijęs iš Bielskas: Bielskas buvo Palenkės miestas, 1971 m. leidimo komentare tapatintas su Lenkijos Bielsku Podlaskiu.
- susijęs iš Bielskas: Bielskas buvo Palenkės miestas, 1971 m. leidimo komentare tapatintas su Lenkijos Bielsku Podlaskiu.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    1  Bielskas — kalbamu m elu Palenkės, o dabar Lenkijos Bielsk-
    Podlaski miestas (prie Baltosios, Narevo intako, | pietus nuo Bal­
    stogės).
    ! Branskas — Palenkės, dabar Lenkijos Balstogės vaivadijos mies­
    tas (prie Vakarų Bugo intako Nureco).
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=ed4ab1b11b233849b85a002f08a175b203c4ebe72b0767cb27f7910323dbe396; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Balstogė: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Branskas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Balstogė: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Branskas" parinktas kaip owner_note_path. Targetas "Balstogė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=ed4ab1b11b233849b85a002f08a175b203c4ebe72b0767cb27f7910323dbe396; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Balstogė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Branskas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Balstogė: mention_match, place, gap=78
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Branskas" parinktas kaip owner_note_path. Targetas "Balstogė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
