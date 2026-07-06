---
tipas: zodyno_irasas
pavadinimas: 'patricijus'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
  - 'Teodoras Narbutas, Lietuvių tautos istorija, t. 2 (1995 m.)'
sukurta: ''
atnaujinta: ''
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
# patricijus

## Santrauka

Bychovco kronikos pasakojime su kunigaikščiu Apolonu pabėgo penki šimtai Romos patricijų, tarp jų keturių patricijų giminių atstovai.

## Teiginiai

<a id="claim-t-192240"></a>
- t-002
  global_id: t-192240
  teiginys: "Pasak Teodoro Narbuto, imperatorius Julijus Nepas po Odoakro pergalės paskyrė Odoakrą patricijumi."
  teiginio_tipas: "saltinio_teiginys"
  semantiniai_rysiai: "Julijus Nepas paskyrė Odoakras (0.91)"
  šaltinio_profilis: "žanras: kronika; perspektyva: neutrali_arba_neaiski; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Teodoras Narbutas"
  saltinio_vieta: "563388-563999; hash=3e3cef46055fc08855a5f5a4d08a1e830780007b2d17da56a54cfa4641b4b69c; match=ocr_normalized"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/08_extract_vocabulary_notes.md"
  ryšio_patikimumas: "paskyre -> Odoakras: 0.91"
  ryšio_patikimumo_lygis: "aukstas"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Julijus Nepas: llm_allowed_candidate, person"
  ryšio_targeto_parinkimas: "Odoakras: llm_allowed_candidate, person"
  ryšio_paaiskinimas: "Teiginys tiesiogiai nurodo, kad Julijus Nepas paskyrė Odoakrą; patricijus yra tik paskyrimo titulas, ne atskiras ryšio objektas."
  vertinimo_atnaujinta: "2026-07-06T03:41:45Z"
  vertinimo_autorius: "rewrite_source_claims / rewrite"
  pagrindžia:
    - c-175084

<a id="claim-t-192241"></a>
- t-003
  global_id: t-192241
  teiginys: "Teodoras Narbutas patricijų aiškina kaip imperatoriaus vietininką."
  teiginio_tipas: "saltinio_teiginys"
  šaltinio_profilis: "žanras: kronika; perspektyva: neutrali_arba_neaiski; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Teodoras Narbutas"
  saltinio_vieta: "563388-563999; hash=3e3cef46055fc08855a5f5a4d08a1e830780007b2d17da56a54cfa4641b4b69c; match=ocr_normalized"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/08_extract_vocabulary_notes.md"
  ryšio_patikimumas: "susije_su -> Italija: 0.83"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "patricijus: owner_note_path, thing, gap=0"
  ryšio_targeto_parinkimas: "Italija: mention_match, place"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"patricijus\" parinktas kaip owner_note_path. Targetas \"Italija\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality."
  vertinimo_atnaujinta: "2026-07-06T03:41:45Z"
  vertinimo_autorius: "rewrite_source_claims / rewrite"
  pagrindžia:
    - c-175084

<a id="claim-t-192242"></a>
- t-001
  global_id: t-192242
  teiginys: "Bychovco kronikos pasakojime su kunigaikščiu Apolonu pabėgo penki šimtai Romos patricijų, tarp jų keturių patricijų giminių atstovai."
  teiginio_tipas: "faktas"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  sudarymo_pagrindimas: "Legendinis kilmės pasakojimas tinkamai atribuotinas kronikai ir gali būti kiek informatyvesnis."
  susije_objektai: "mentioned_object: [[objektai/daiktai/Herbas|Herbas]]; mentioned_object: [[objektai/daiktai/Kentauras|Kentauras]]"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  saltinio_vieta: "72134-72548; hash=3b13cdd122de6b1f58b51c4e160d3a9b59873ba0a9631942203820ce086d98d8; match=whitespace_regex"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/08_extract_vocabulary_notes.md"
  ryšio_patikimumas: "susije_su -> Herbas: 0.83"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "patricijus: owner_note_path, thing, gap=0"
  ryšio_targeto_parinkimas: "Herbas: mention_match, thing"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"patricijus\" parinktas kaip owner_note_path. Targetas \"Herbas\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality."
  vertinimo_atnaujinta: "2026-06-16T21:06:50Z"
  vertinimo_autorius: "rewrite_source_claims / rewrite"
  pagrindžia:
    - c-175083
## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    APIE ROMOS KUNIGAIKŠTI PALEMONĄ
    IR KAIP JIS ĮSIKORĖ ŽEMAITIJOJE
    Kunigaikštis, vardu Apolonas taip pat buvęs ta­
    me mieste, [bėgo su jais), viską pasiėmęs, o su juo —
    penki šimtai vien Romos patricijų. Jų tarpe saloje pa­
    sirodė beesančios keturios Romos patricijų giminės:
    Kentauro herbo7  — Dausprungas3 , §tulpų herbo 4  —
    Prosperas Cezarinas 5 . Meškos herbo6  — Julijonas, o
    Rožės herbo 7  — Hektoras 8 .
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003

- c-002
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 2 (1995 m.)
  citata_originali: |
    Tarsi pats likimas pa­
    noro, kad šis jaunuolis sujungtų anų įžymių Romos im­
    perijos įkūrėjų vardus ir būtų paskutinis jų vadų ir ti­
    tulų paveldėtojas. Savo kariuomenės paskelbtas karaliu­
    mi, Odoakras galėjo priimti titulus ir sosto papuošalus,
    bet iš kuklumo ar politinių sumetimų skatinamas, o gal
    vengdamas įžeisti senatą, neliepė vadinti save nei im­
    peratoriumi, nei Italijos karaliumi. Tuo tarpu anksčiau
    Oresto nuverstas impera(orius Julijus Nepas, neturėjęs
    prieglaudos Dalmatijoje, tuojau po Odoakro pergalės at­
    siuntė iškilmingą sveikinimą ir paskyrė jį patricijumi,
    t. y. imperatoriaus vietininku.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
    - t-002

## Citatos

- id: c-175083
  autorius: "Anoniminis metraštininkas"
  šaltinis: "Lietuvos metraštis, Bychovco kronika (1971 m.)"
  citata_originali: |
    APIE ROMOS KUNIGAIKŠTI PALEMONĄ
    IR KAIP JIS ĮSIKORĖ ŽEMAITIJOJE
    Kunigaikštis, vardu Apolonas taip pat buvęs ta­
    me mieste, [bėgo su jais), viską pasiėmęs, o su juo —
    penki šimtai vien Romos patricijų. Jų tarpe saloje pa­
    sirodė beesančios keturios Romos patricijų giminės:
    Kentauro herbo7  — Dausprungas3 , §tulpų herbo 4  —
    Prosperas Cezarinas 5 . Meškos herbo6  — Julijonas, o
    Rožės herbo 7  — Hektoras 8 .
  citata_rodoma: "APIE ROMOS KUNIGAIKŠTI PALEMONĄ \nIR KAIP JIS ĮSIKORĖ ŽEMAITIJOJE\nKunigaikštis, vardu Apolonas taip pat buvęs ta­\nme mieste, [bėgo su jais), viską pasiėmęs, o su juo — \npenki šimtai vien Romos patricijų. Jų tarpe saloje pa­\nsirodė beesančios keturios Romos patricijų giminės: \nKentauro herbo7  — Dausprungas3 , §tulpų herbo 4  —  \nProsperas Cezarinas 5 . Meškos herbo6  — Julijonas, o \nRožės herbo 7  — Hektoras 8 ."
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-192242

- id: c-175084
  autorius: "Teodoras Narbutas"
  šaltinis: "Teodoras Narbutas, Lietuvių tautos istorija, t. 2 (1995 m.)"
  citata_originali: |
    Tarsi pats likimas pa­
    noro, kad šis jaunuolis sujungtų anų įžymių Romos im­
    perijos įkūrėjų vardus ir būtų paskutinis jų vadų ir ti­
    tulų paveldėtojas. Savo kariuomenės paskelbtas karaliu­
    mi, Odoakras galėjo priimti titulus ir sosto papuošalus,
    bet iš kuklumo ar politinių sumetimų skatinamas, o gal
    vengdamas įžeisti senatą, neliepė vadinti save nei im­
    peratoriumi, nei Italijos karaliumi. Tuo tarpu anksčiau
    Oresto nuverstas impera(orius Julijus Nepas, neturėjęs
    prieglaudos Dalmatijoje, tuojau po Odoakro pergalės at­
    siuntė iškilmingą sveikinimą ir paskyrė jį patricijumi,
    t. y. imperatoriaus vietininku.
  citata_rodoma: "Oresto nuverstas impera(orius Julijus Nepas, neturėjęs\nprieglaudos Dalmatijoje, tuojau po Odoakro pergalės at-\nsiuntė iškilmingą sveikinimą ir paskyrė jį patricijumi,\nt. y. imperatoriaus vietininku."
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-192240
    - t-192241
