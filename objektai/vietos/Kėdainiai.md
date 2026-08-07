---
tipas: vieta
pavadinimas: 'Kėdainiai'
saltiniai:
  - 'A. Šapoka (red.), Lietuvos istorija (1936 m.)'
  - 'Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)'
datos:
  - '1655 m.'
  - '1918 m.'
  - '1919 m.'
  - '2026 m.'
date_start: '1655'
date_end: '2026'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
  - miestas
amziai:
  - 'XVII'
  - 'XXI'
media_total_count: '0'
media_primary_thumb_url: ''
media_primary_canonical_url: ''
media_primary_directness: ''
media_primary_relation_type: ''
media_primary_json: ''
media_direct_json: |-
  []
media_contextual_json: |-
  []
media_all_json: |-
  []
entity_id: "ent-24e7afcbd7f90b996585a830"
canonical_name: "Kėdainiai"
entity_roles: ["place"]
entity_view_role: "place"
entity_aliases: ["Kėdainiai","Kėdainiuose","Kėdainius","Kėdainių"]
sameAs: []
canonical_biography: "Vienos centras buvo Biržai ir Kėdainiai, o kitos — Nesvyžius ir Olyka (Voluinėje). Protestantų mokyklos buvo įkurtos Vilniuje, Brastoje, Nesvyžiuje, Semetyčiuose, Šiluvoje, Biržuose, Kėdainiuose, Slucke, o pradžios mokyklų buvo beveik kiekvienoj jų parapijoj. Ypač garsėjo Kėdainių mokykla: mat, Radvilų pastangomis Kėdainiai buvo daromi protestantų kultūros centru."
place_authority: true
historical_names: []
---
# Kėdainiai

## Santrauka

Vienos centras buvo Biržai ir Kėdainiai, o kitos — Nesvyžius ir Olyka (Voluinėje). Protestantų mokyklos buvo įkurtos Vilniuje, Brastoje, Nesvyžiuje, Semetyčiuose, Šiluvoje, Biržuose, Kėdainiuose, Slucke, o pradžios mokyklų buvo beveik kiekvienoj jų parapijoj. Ypač garsėjo Kėdainių mokykla: mat, Radvilų pastangomis Kėdainiai buvo daromi protestantų kultūros centru.

## Teiginiai

<a id="claim-t-182770"></a>
- t-001
  teiginys: "1919 m. sausio 9 d. Jonas Variakojis su pirmuoju savanorių būriu paliko Panevėžį ir atvyko į Kėdainius."
  atnaujinta: "2026-07-10 10:39"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/09_extract_places_notes.md"
  ryšio_patikimumas: "keliavo_i -> Kėdainiai: 0.90"
  ryšio_patikimumo_lygis: "aukstas"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "J. Variakojis: llm_allowed_candidate, person"
  ryšio_targeto_parinkimas: "Kėdainiai: llm_allowed_candidate, place"
  ryšio_paaiskinimas: "Citata tiesiogiai nurodo J. Variakojo atvykimą į Kėdainius."
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  semantiniai_rysiai: "J. Variakojis keliavo į Kėdainiai (0.90)"
  temporaliniai_duomenys: "kelionės data: 1918 m.; kelionės data: 1919 m."
  temporalinis_paaiskinimas: "Ši data taikoma teiginyje minimai reikšmei „kelionės data“, o ne visam objekto laikotarpiui."
  temporalinis_llm_pakomentavimas: "Reikia išplėsti inicialą ir patikslinti datą pagal citatos kontekstą."
  vertinimo_atnaujinta: "2026-06-14T07:59:13Z"
  pagrindžia:
    - c-43559

<a id="claim-t-183041"></a>
- t-002
  teiginys: "Kėdainių mokykla išgarsėjo, kai Radvilos Kėdainius darė protestantų kultūros centru."
  atnaujinta: "2026-06-13 18:29"
  sprendimo_priezastis: "auto"
  teiginio_tipas: "faktas"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  ryšio_patikimumas: "susije_su -> Protestantai: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Kėdainiai: owner_note_path, place, gap=0"
  ryšio_targeto_parinkimas: "Protestantai: mention_match, group, gap=56"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Kėdainiai\" parinktas kaip owner_note_path. Targetas \"Protestantai\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  šaltinio_profilis: "žanras: istorinis_tekstas; perspektyva: kryziuociu_ordino; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: A. Šapoka (red.)"
  pagrindžia:
    - c-166433

<a id="claim-t-193200"></a>
- t-003
  teiginys: "Vienos centras buvo Biržai ir Kėdainiai, o kitos — Nesvyžius ir Olyka (Voluinėje)."
  atnaujinta: "2026-07-06 12:54"
  sprendimo_priezastis: "auto"
  teiginio_tipas: "faktas"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  šaltinio_profilis: "žanras: istorinis_tekstas; perspektyva: kryziuociu_ordino; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: A. Šapoka (red.)"
  vertinimo_atnaujinta: "2026-06-13T15:13:33Z"
  pagrindžia:
    - c-175944

## Citatos

- id: c-43559
  sudarytojas: "Karolis Zikaras"
  šaltinis: "Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)"
  puslapiai: "PDF 173"
  indeksas: "Sud. Karolis Zikaras, Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.), PDF 173."
  citata_originali: |
    ## Puslapis 173

    —————

    Dar 1918 m. gruodžio 29 d. paskir-
    tas Panevėžio srities apsaugos viršininku
    karin. J. Variakojis, nuvykęs į pasky-
    rimo vietą, energingai ėmėsi organi-
    zuoti savanorių būrį. Tačiau tų metų
    sausio 9 d. stambioms bolševikų pajė-
    goms užimant Panevėžį, J. Variakojis
    su pirmuoju savanorių būriu paliko
    miestą ir atvyko į Kėdainius.
  statusas: verified
  atnaujinta: "2026-07-10 10:39"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-001

- id: c-166433
  redaktorius: "A. Šapoka"
  šaltinis: "A. Šapoka (red.), Lietuvos istorija (1936 m.)"
  puslapiai: "PDF 357"
  indeksas: "Red. A. Šapoka, A. Šapoka (red.), Lietuvos istorija (1936 m.), PDF 357."
  citata_originali: |
    Tada pražydo protestantų Radvilų centruose
    esančios Kėdainių ir Slucko mokyklos, kurioms atiteko daugumas
    Vilniaus mokyklos turtų. Ypač garsėjo Kėdainių mokykla: mat,
    Radvilų pastangomis Kėdainiai buvo daromi protestantų kultūros
    centru. Čia net buvo įsteigta spaustuvė, kurioje buvo spausdina-
    mos religinio turinio knygos.
  statusas: verified
  atnaujinta: "2026-07-10 10:39"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-002

- id: c-175944
  redaktorius: "A. Šapoka"
  šaltinis: "A. Šapoka (red.), Lietuvos istorija (1936 m.)"
  puslapiai: "PDF 304"
  indeksas: "Red. A. Šapoka, A. Šapoka (red.), Lietuvos istorija (1936 m.), PDF 304."
  citata_originali: |
    Pats
    apsukrusis ir įtakingasis to meto Lietuvos politikos veikėjas,
    Žemaičių seniūnas ir Livonijos valdytojas Jonas Jeronimas Kat-
    kevičius, ne tik patsai metė kalvinizmą, bet taip pat ir savo
    sūnų Joną Karolį, — būsimąjį Vilniaus vaivadą, hetmoną, ge-
    nialųjį karo vadą, — atidavė auklėti jėzuitams.
    Radvilų šeimos buvo dvi šakos. Vienos centras buvo Biržai
    ir Kėdainiai, o kitos — Nesvyžius ir Olyka (Voluinėje).
  statusas: verified
  atnaujinta: "2026-07-10 10:39"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-003

## Ryšiai
- Buvo kelionės vieta: [[objektai/asmenys/J. Variakojis]]
- Gynė Kėdainiai: [[objektai/asmenys/J. Mikoliūnas]], [[objektai/asmenys/K. Dragunevičius]]
