---
tipas: ivykis
pavadinimas: 'Vytauto ir Julijonos santuoka'
saltiniai:
  - 'Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)'
sukurta: ''
atnaujinta: ''
---
# Vytauto ir Julijonos santuoka

## Santrauka

Trakuose, mirus žmonai Onai, Vytautas nutarė vesti Julijoną, Alšėnų kunigaikščio Algimantaičio dukrą. Kojelavičius vaizduoja Vilniaus vyskupą Petrą kaip atkakliai prieštaravusį Vytauto ir Julijonos santuokai, nes ji esą pažeidė Dievo ir žmonių įstatymus.

## Laikotarpis ir datos
Nenurodyta

## Dalyviai ir vaidmenys
Nenurodyta

## Eiga
Nenurodyta

## Rezultatas
Nenurodyta

## Teiginiai

<a id="claim-t-185786"></a>
- t-001
  global_id: t-185786
  teiginys: 'Trakuose, mirus žmonai Onai, Vytautas nutarė vesti Julijoną, Alšėnų kunigaikščio Algimantaičio dukrą.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Pašalinta perteklinė atributinė pradžia ir išlaikytas šaltinio faktas.'
  susije_objektai: 'llm_object: Trakai; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Alšėnai; mentioned_place: Trakai; mentioned_place: Vilnius'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 691203-691526; hash=d1c92085445ab5f510eeccb6eb5711a723e300eb10469150cd7792aa6f0c9ba6; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: keliavo_i -> Trakai: 0.87
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Trakai: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai sako, kad Vytautas patraukė į Trakus.

<a id="claim-t-185787"></a>
- t-002
  global_id: t-185787
  teiginys: 'Kojelavičius vaizduoja Vilniaus vyskupą Petrą kaip atkakliai prieštaravusį Vytauto ir Julijonos santuokai, nes ji esą pažeidė Dievo ir žmonių įstatymus.'
  teiginio_tipas: 'saltinio_teiginys'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Atribucija palikta tik šaltinio vertinimui / formulei; claimas perrašytas be OCR triukšmo.'
  susije_objektai: 'mentioned_place: Kujavija; mentioned_place: Vilnius'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 691401-691913; hash=30cbaf34dacab5210561902b851aee4a5f1eb4a129d9c71e2d19e14984b38ca4; match=ocr_normalized_gapped
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Kujavija: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Vytauto ir Julijonos santuoka: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Kujavija: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Vytauto ir Julijonos santuoka" parinktas kaip owner_note_path. Targetas "Kujavija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Trakuose, mirus žmonai Onai, Vytautas nutarė vesti Julijoną, Alšėnų kunigaikščio Algimantaičio dukrą.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Nutaręs sutelkti
    didesnę kariuomenę, Vytautas patraukė į Trakus ir čia,
    mirus jo žmonai Onai, nutarė tuoktis su Julijona, Al-
    šėnų kunigaikščio Algimantaičio dukra. Julijona mi-
    rusiajai buvo teta. Todėl Petras, Vilniaus vyskupas,
    labai atkakliai priešinosi šiai santuokai, kad nebūtų pa­
    žeisti dievo bei žmonių įstatymai.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-001

- c-002
  santrauka: 'Vilniaus vyskupas Petras atkakliai priešinosi Vytauto ir Julijonos santuokai, laikydamas ją dievo ir žmonių įstatymų pažeidimu.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Todėl Petras, Vilniaus vyskupas,
    labai atkakliai priešinosi šiai santuokai, kad nebūtų pa­
    žeisti dievo bei žmonių įstatymai. Galbūt atkakliu ne­
    pritarimu ir būtų privertęs
    V y ta u ta s  v e d a
    Vytautą atsisakyti šio suma­
    nymo, jeigu nebūtų parėmęs
    Jonas Kropidlas, Kujavijos vyskupas, su karaliumi at­
    vykęs į Lietuvą. Pataikūniškai aiškindamas įstatymus
    pagal valdovo norus, jis pareiškė, jog santuoka būsian­
    ti teisėta, ir surišo sutuoktinius, kaip to reikalauja Ro-
    3 9 6

    ## Puslapis 395

    mos bažnyčia.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-002
