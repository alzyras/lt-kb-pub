---
tipas: vieta
pavadinimas: 'Naujasis Gardinas'
saltiniai:
  - 'Vytautas Didysis 1350-1430 (1930 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - ordinas
  - pilis
  - vieta
---
# Naujasis Gardinas

## Santrauka

Dar vasarą tam reikalui magistras įsakė netoli Gardino pastatyti dvi pilis: Naująjį Gardiną ir Metenburgą (Meteną), kame buvo pa­ talpintos kryžiuočių įgulos. Po to skubiai atvyko prie Gardino, jį labai sustiprino ir tuojau atsigrę­ žė prieš Neu-Gardiną ir Meteną.

## Teiginiai

<a id="claim-t-36430"></a>
- t-001
  global_id: t-36430
  teiginys: 'Magistras įsakė netoli Gardino pastatyti Naująjį Gardiną ir Metenburgą, kuriuose buvo įkurdintos kryžiuočių įgulos.'
  sudarymo_pagrindimas: 'Teiginys aiškiai nurodo Naujojo Gardino pastatymą ir įgulos įkurdinimą.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Kryžiuočių ordinas|Kryžiuočių ordinas]]; mentioned_place: Gardinas; mentioned_place: Metenburgas; mentioned_object: [[objektai/zodynas/magistras|magistras]]; mentioned_place: Lietuva'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=ffa19db56ab5e4499db56997c0203488fde10597e398c3a617626c39e1f1c7bb; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Gardinas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Naujasis Gardinas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Gardinas: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Naujasis Gardinas" parinktas kaip owner_note_path. Targetas "Gardinas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-36431"></a>
- t-002
  global_id: t-36431
  teiginys: 'Vytautas atsigręžė prieš Naująjį Gardiną ir Meteną, o šios pilys buvo sunaikintos iki pamatų.'
  sudarymo_pagrindimas: 'Teiginys yra pilnas, faktinis ir tiesiogiai paremtas citata.'
  susije_objektai: 'mentioned_object: [[objektai/daiktai/Pilys|Pilys]]; mentioned_place: Gardinas; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; llm_object: Naujasis Gardinas'
  semantiniai_rysiai: '[[objektai/asmenys/Vytautas|Vytautas]] puolė Naujasis Gardinas'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 137123-137363; hash=739b45473ddf7a431aea23681345b916079ad3855559210e6909c28d80cc6007; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Naujasis Gardinas: 0.78
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Naujasis Gardinas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Formuluotė rodo Vytauto karo veiksmą prieš Naująjį Gardiną.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Vytautas Didysis 1350-1430 (1930 m.)
  citata_originali: |
    Po to
    skubiai atvyko prie Gardino, jį labai sustiprino ir tuojau atsigrę­
    žė prieš Neu-Gardiną ir Meteną. Tos pilys taip pat buvo visiš­
    kai ligi pamatų sunaikintos. Tose pilyse buvusius Ordino ka­
    rius ir pirklius Vytautas paėmė nelaisvėn.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-002

- c-002
  šaltinis: Vytautas Didysis 1350-1430 (1930 m.)
  citata_originali: |
    Matydamas Vytauto pastangas neinant veltui, Ordinas ma­
    tė reikalą taip pat išplėsti Lietuvos pasienyje akciją. Dar
    vasarą tam reikalui magistras įsakė netoli Gardino pastatyti dvi
    pilis: Naująjį Gardiną ir Metenburgą (Meteną), kame buvo pa­
    talpintos kryžiuočių įgulos.
    Iš čia aišku, kad Vytautas, nežiūrint Jogailos didelių
    pasiūlymų, palaikė dar gana gerus santykius su Ordinu dėl to,
    kad jam, matyti, dar nebuvo atėjęs laikas veikti.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: 137123-137363; hash=739b45473ddf7a431aea23681345b916079ad3855559210e6909c28d80cc6007; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Naujasis Gardinas: 0.78
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Naujasis Gardinas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Formuluotė rodo Vytauto karo veiksmą prieš Naująjį Gardiną.
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=ffa19db56ab5e4499db56997c0203488fde10597e398c3a617626c39e1f1c7bb; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Gardinas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Naujasis Gardinas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Gardinas: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Naujasis Gardinas" parinktas kaip owner_note_path. Targetas "Gardinas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Ryšiai
- [[objektai/asmenys/Vytautas|Vytautas (Lietuvos valdovas, XIV–XV a.)]] puole Naujasis Gardinas
