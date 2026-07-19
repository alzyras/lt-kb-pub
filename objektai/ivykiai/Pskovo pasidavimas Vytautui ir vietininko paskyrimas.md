---
tipas: ivykis
pavadinimas: 'Pskovo pasidavimas Vytautui ir vietininko paskyrimas'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - politinis-sprendimas
  - ivykis
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
---
# Pskovo pasidavimas Vytautui ir vietininko paskyrimas

## Santrauka

Lietuvos metraštis pasakoja, kad kitais metais Vytautas išsirengė prieš Pskovą ir paėmė Veližą bei Krasnyj Gorodą. Lietuvos metraštis pasakoja, kad Vytautas pasodino Pskove vietininku Pinsko kunigaikštį Jurijų, pramintą Nosimi. Lietuvos metraštis pasakoja, kad pskoviečiai pasiuntė pas Vytautą pasiuntinius, pažadėjo jo klausyti, mokėti duoklę ir įsileisti vietininką.

## Laikotarpis ir datos

- laikotarpis: sekančiais metais
- datos:
  - sekančiais metais

## Dalyviai ir vaidmenys

Nenurodyta

## Eiga

Nenurodyta

## Rezultatas

Nenurodyta

## Teiginiai

<a id="claim-t-186598"></a>
- t-001
  global_id: t-186598
  teiginys: "Lietuvos metraštis pasakoja, kad kitais metais Vytautas išsirengė prieš Pskovą ir paėmė Veližą bei Krasnyj Gorodą."
  atnaujinta: "2026-07-12 22:30"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/04_extract_events_notes.md"
  teiginio_tipas: "saltinio_teiginys"
  ryšio_patikimumas: "uzeme -> Veližas: 0.95"
  ryšio_patikimumo_lygis: "aukstas"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person"
  ryšio_targeto_parinkimas: "Veližas: llm_allowed_candidate, place"
  ryšio_paaiskinimas: "Citata tiesiogiai sako, kad Vytautas paėmė Veližą."
  šaltinio_profilis: "žanras: kronika; perspektyva: neutrali_arba_neaiski; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  pagrindžia:
    - c-169891

<a id="claim-t-186599"></a>
- t-002
  global_id: t-186599
  teiginys: "Lietuvos metraštis pasakoja, kad Vytautas pasodino Pskove vietininku Pinsko kunigaikštį Jurijų, pramintą Nosimi."
  atnaujinta: "2026-07-12 22:30"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/04_extract_events_notes.md"
  teiginio_tipas: "saltinio_teiginys"
  ryšio_patikimumas: "susije_su -> Pinskas: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Pskovo pasidavimas Vytautui ir vietininko paskyrimas: owner_note_path, event, gap=0"
  ryšio_targeto_parinkimas: "Pinskas: mention_match, place, gap=36"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Pskovo pasidavimas Vytautui ir vietininko paskyrimas\" parinktas kaip owner_note_path. Targetas \"Pinskas\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  šaltinio_profilis: "žanras: kronika; perspektyva: neutrali_arba_neaiski; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  pagrindžia:
    - c-169891

<a id="claim-t-186600"></a>
- t-003
  global_id: t-186600
  teiginys: "Lietuvos metraštis pasakoja, kad pskoviečiai pasiuntė pas Vytautą pasiuntinius, pažadėjo jo klausyti, mokėti duoklę ir įsileisti vietininką."
  atnaujinta: "2026-07-12 22:30"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/04_extract_events_notes.md"
  teiginio_tipas: "saltinio_teiginys"
  ryšio_patikimumas: "buvo_valdovas -> Pskoviečiai: 0.90"
  ryšio_patikimumo_lygis: "aukstas"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person"
  ryšio_targeto_parinkimas: "Pskoviečiai: llm_allowed_candidate, group"
  ryšio_paaiskinimas: "Citata tiesiogiai sako, kad pskoviečiai norėjo Vytauto kaip valdovo."
  šaltinio_profilis: "žanras: kronika; perspektyva: neutrali_arba_neaiski; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  vertinimo_atnaujinta: "2026-06-16T21:06:50Z"
  pagrindžia:
    - c-169891

## Citatos

- id: c-169891
  autorius: "Anoniminis metraštininkas"
  šaltinis: "Lietuvos metraštis, Bychovco kronika (1971 m.)"
  indeksas: "Anoniminis metraštininkas, Lietuvos metraštis, Bychovco kronika (1971 m.)."
  citata_originali: |
    Numatė vokie­
    čiai, kad lenkai ir lietuviai su tokia daugybe kariuo­
    menės niekur kitur negalės išsirikiuoti, kaip tik šiame
    lauke, ir todėl prikasė duobių ir pridengė velėnomis,
    kad žirgai ir žmonės į jas įgriūtų3.
    Karalius Jogaila ir didysis kunigaikštis Vytautas, su
    savo kariuomenėmis perėję per miškus, priėjo tuos
    Dubrovnos laukus. Tuo metu Jogailos kariuomenėje
    didžiuoju etmonu buvo ponas Sokolas Čekas \ o kiemo
    etmonu 5 — ponas Spytka Spytkovičius 6. O Vytauto ka­
    riuomenėje didžiuoju etmonu buvo kunigaikštis Jonas
    2adivydas7, Jogailos ir Vytauto brolis8, o kiemo et­
    monu — ponas Jonas Goštautas9.
    Kai tie anksčiau minėti etmonai pradėjo rikiuoti
    žmones, apie tas duobes, kurias jiems vokiečiai iškasė.

    nieko nežinojo, taigi, kariuomenę berikiuodami, di­
    dieji etmonai — kunigaikštis Jonas Zadivydas ir ponas
    Sokolas — įkrito į duobes ir nulūžo kojas, labai susi­
    žeidė ir nuo to mirė; ir ne vien tik etmonai, bet ir dau­
    gelis karių dėl tų duobių labai nukentėjo.
  citata_rodoma: "Sekančiais metais didysis kunigaikštis Vytautas išsi­\nrengė prieš Pskovo miestą5  ir paėmė Pskovo miestus \nVeližą6  ir Krasnyj Gorod7 . Pskoviečiai, nebenorėdami, \nkad jis toliau niokotų jų žemę, atsiuntė savo pasiunti­\nnius pas didįjį kunigaikštį Vytautą, kad jis būtų jų \nvaldovu, žadėjo jo klausyti ir kasmet mokėti jam duok­\nlę bei įsileisti jo vietininką, ir didysis kunigaikštis\n\npasodino pas juos vietininku Pinsko kunigaikštį Juri­\njų, pramintą Nosimi8 , o pats su visomis pajėgomis nu­\nžygiavo prieš Naugardą."
  statusas: verified
  atnaujinta: "2026-07-12 22:57"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-186598
    - t-186599
    - t-186600