---
tipas: vieta
pavadinimas: 'Geranainys'
saltiniai:
  - 'A. Šapoka (red.), Lietuvos istorija (1936 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
---
# Geranainys

## Santrauka

Pijarų mokyklos — vienur pilnos kolegijos, kitur žemesniosios mokyklos — buvo įkurtos šiose vietose: Vilniuje, Geranainyse, Dambravicoje, Blotnoje, Naujajam Dolske, Ščucine, Panevėžy, Verenavoj, Ukmergėje, Raseiniuose, Valeranavoj, Vitebske, Želviuose ir dar.

## Teiginiai

<a id="claim-t-02452"></a>
- t-001
  global_id: t-02452
  teiginys: 'Geranainyse buvo įkurta pijarų mokykla.'
  sudarymo_pagrindimas: 'Teiginys yra aiškus sakinys apie vietą ir paremtas vietovių sąrašu citatoje.'
  susije_objektai: 'mentioned_place: Želviai'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=182928735167e0c15844642f4db1122934a71f940475c4265611acaa62c3ba8f; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Želviai: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Geranainys: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Želviai: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Geranainys" parinktas kaip owner_note_path. Targetas "Želviai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-183018"></a>
- t-002
  global_id: t-183018
  teiginys: 'Geranainyse veikė viena iš pijarų įkurtų mokyklų.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Pradinis teiginys yra per ilgas sąrašas ir baigiasi nutrūkusia fraze.'
  susije_objektai: 'mentioned_place: Viena; mentioned_place: Želviai'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=182928735167e0c15844642f4db1122934a71f940475c4265611acaa62c3ba8f; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Viena: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Geranainys: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Viena: mention_match, place, gap=18
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Geranainys" parinktas kaip owner_note_path. Targetas "Viena" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: A. Šapoka (red.), Lietuvos istorija (1936 m.)
  citata_originali: |
    Pijarai, kaip ir jėzuitai, steigė savo mokyklas iš atskirų didžiū-
    nų ir bajorijos fundacijų. Pijarai, niekuo daugiau neužsiimdami,
    kaip tik mokymu, gyveno tik ten, kur buvo jų mokyklų, o jėzui-
    tai stengėsi visur apsigyventi. Pijarų mokyklos — vienur pilnos
    kolegijos, kitur žemesniosios mokyklos — buvo įkurtos šiose vie-
    tose: Vilniuje, Geranainyse, Dambravicoje, Blotnoje, Naujajam
    Dolske, Ščucine, Panevėžy, Verenavoj, Ukmergėje, Raseiniuose, Va-
    leranavoj, Vitebske, Želviuose ir dar vienur kitur.
  citata_rodoma: ''
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-001
    - t-002
