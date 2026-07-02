---
tipas: asmuo
pavadinimas: 'Albrechtas (Rudolfo sūnus)'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - karalius
  - karas
---
# Albrechtas (Rudolfo sūnus)

## Santrauka

Dusburgietis teigia, kad apie Rudolfo, Romos karaliaus, pergalę prieš Otokarą, Čekijos karalių Tuo metu Rudolfas, Romos karalius, nukovė kare Otokarą, Čekijos karalių, atidavė Austrijos kunigaikštystę savo sūnui Albrechtui, kuris vėliau tapo Romos karaliumi, o savo dukterį atidavė.

## Teiginiai

<a id="claim-t-60231"></a>
- t-001
  global_id: t-60231
  teiginys: 'Rudolfas, nukovęs Čekijos karalių Otokarą, Austrijos kunigaikštystę atidavė savo sūnui Albrechtui.'
  sudarymo_pagrindimas: 'Teiginys aiškiai nurodo Albrechtui perduotą Austrijos kunigaikštystę ir yra paremtas citata.'
  susije_objektai: 'mentioned_place: Austrija; mentioned_place: Čekija; llm_object: Austrija'
  semantiniai_rysiai: '[[objektai/asmenys/Albrechtas (Rudolfo sūnus)|Albrechtas (Rudolfo sūnus)]] valdė Austrija'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 716578-716900; hash=fad42dc315a276de1303990fb63c4eac0a984d890cd3d5a1b847ac76f480b06b; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: valde -> Austrija: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Albrechtas (Rudolfo sūnus): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Austrija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Austrijos kunigaikštystė buvo atiduota Albrechtui, todėl pagrįstas jo valdymo ryšys su Austrija.

<a id="claim-t-184044"></a>
- t-002
  global_id: t-184044
  teiginys: 'Rudolfo sūnus Albrechtas vėliau tapo Romos karaliumi.'
  teiginio_tipas: 'saltinio_teiginys'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Citata pagrindžia trumpą faktą, o pradinis teiginys yra nutrūkęs.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Albrechtas|Albrechtas]]; mentioned_place: Austrija; mentioned_place: Čekija'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 716578-716900; hash=fad42dc315a276de1303990fb63c4eac0a984d890cd3d5a1b847ac76f480b06b; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Albrechtas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Albrechtas (Rudolfo sūnus): owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Albrechtas: mention_match, person, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Albrechtas (Rudolfo sūnus)" parinktas kaip owner_note_path. Targetas "Albrechtas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie Rudolfo, Romos karaliaus, pergalę prieš Otokarą, Čekijos karalių

      Tuo metu Rudolfas, Romos karalius, nukovė kare Otokarą, Čekijos karalių, atidavė
    Austrijos kunigaikštystę savo sūnui Albrechtui, kuris vėliau tapo Romos karaliumi, o
    savo dukterį atidavė nukauto Čekijos karaliaus sūnui (Ptol. 23, 25).



            64.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-001
    - t-002

## Ryšiai
- Albrechtas (Rudolfo sūnus) valde [[objektai/vietos/Austrija]]
