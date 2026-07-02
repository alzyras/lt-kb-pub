---
tipas: vieta
pavadinimas: 'Tamovas'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1498 m.'
date_start: '1498'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - vieta
amziai:
  - 'XV'
---
# Tamovas

## Santrauka

Stepono kariuomenė pasiekė net Tamovą. Tamovas šiame gabale apibrėžia puolimo gylį Lenkijos žemėje.

## Teiginiai

<a id="claim-t-187350"></a>
- t-001
  global_id: t-187350
  teiginys: 'Tamovas kronikoje žymi tolimiausią Stepono ir Malkočo karo žygio Lenkijos žemėje ribą prie Krokuvos.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Neaiški interpretacija perrašyta į konkretų teiginį apie Tamovą.'
  susije_objektai: 'mentioned_place: Krokuva; mentioned_place: Lenkija; mentioned_object: [[objektai/zodynas/didysis kunigaikštis|didysis kunigaikštis]]; mentioned_object: [[objektai/zodynas/vaivada|vaivada]]; mentioned_person: [[objektai/asmenys/Aleksandras|Aleksandras]]; mentioned_person: [[objektai/asmenys/Aleksandras Jogailaitis|Aleksandras Jogailaitis]]; mentioned_place: Kamenecas; mentioned_place: Lietuva; mentioned_place: Moldavija'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=396b6b744fe3f5b7ed9ed455a9b03432da34f9ed8a75bbbafbe77a5b97ae6dd0; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: surenge_zygi_i -> Tamovas: 0.80
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Steponas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Tamovas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Tekstas rodo Stepono karo žygio judėjimą iki Tamovo.

<a id="claim-t-187351"></a>
- t-002
  global_id: t-187351
  teiginys: 'Moldavijos vaivada Steponas su Malkoču kariavo Lenkijos žemėje iki Tamovo, esančio už dešimties mylių nuo Krokuvos.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Išplėstas subjektas ir pridėta citatoje nurodyta vietos reikšmė.'
  susije_objektai: 'mentioned_place: Krokuva; mentioned_object: [[objektai/zodynas/didysis kunigaikštis|didysis kunigaikštis]]; mentioned_object: [[objektai/zodynas/vaivada|vaivada]]; mentioned_person: [[objektai/asmenys/Aleksandras|Aleksandras]]; mentioned_person: [[objektai/asmenys/Aleksandras Jogailaitis|Aleksandras Jogailaitis]]; mentioned_person: [[objektai/asmenys/Steponas|Steponas]]; mentioned_place: Kamenecas; mentioned_place: Lenkija; mentioned_place: Lietuva; mentioned_place: Moldavija; llm_object: Tamovas'
  semantiniai_rysiai: '[[objektai/asmenys/Steponas|Steponas]] surengė žygį į Tamovas'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=396b6b744fe3f5b7ed9ed455a9b03432da34f9ed8a75bbbafbe77a5b97ae6dd0; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Krokuva: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Tamovas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Krokuva: mention_match, place, gap=91
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Tamovas" parinktas kaip owner_note_path. Targetas "Krokuva" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-187658"></a>
- t-005
  global_id: t-187658
  teiginys: 'Moldavijos vaivada Steponas su Malkoču kariavo Lenkijos žemėje nuo Kameneco per Lvovą iki Tamovo.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Teiginys patikslintas pagal citatos eigą ir sutrumpintas.'
  susije_objektai: 'mentioned_object: [[objektai/zodynas/didysis kunigaikštis|didysis kunigaikštis]]; mentioned_object: [[objektai/zodynas/vaivada|vaivada]]; mentioned_person: [[objektai/asmenys/Aleksandras|Aleksandras]]; mentioned_person: [[objektai/asmenys/Aleksandras Jogailaitis|Aleksandras Jogailaitis]]; mentioned_person: [[objektai/asmenys/Steponas|Steponas]]; mentioned_place: Kamenecas; mentioned_place: Lenkija; mentioned_place: Lietuva; mentioned_place: Lvovas; mentioned_place: Moldavija; llm_object: Tamovas; llm_object: Kamenecas; llm_object: Lvovas'
  semantiniai_rysiai: '[[objektai/asmenys/Steponas|Steponas]] surengė žygį į Tamovas'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=396b6b744fe3f5b7ed9ed455a9b03432da34f9ed8a75bbbafbe77a5b97ae6dd0; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: surenge_zygi_i -> Tamovas: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Steponas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Tamovas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Tamovas nurodytas kaip karo žygio pasiekta riba.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    O pas­
    kui didysis kunigaikštis Aleksandras sugrįžo į Lietu­
    vą 3 9 .
    Tais pačiais metais Lietuvos žemę ištiko baisus ba­
    das, ir paplito žmonėse prancūziškos ligos4 0 . Paskui,
    sekančių metų vasarą bei rudenį4 I, atėjo Moldavijos
    vaivada Steponas, o su juo — turkų sultono didysis pa­
    ša, vardu Malkočas 4 2 , vedinas daugeliu žmonių, ir ka­
    riavo po Lenkijos žemę, Kamenecu pradedant, ir ligi
    Lvovo, ir net ligi Tamovo, už dešimties mylių nuo Kro­
    kuvos 4 3 .
  citata_rodoma: ''
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-003
    - t-004
    - t-002
    - t-001
    - t-005

## Ryšiai
- [[objektai/asmenys/Steponas]] surenge_zygi_i Tamovas
