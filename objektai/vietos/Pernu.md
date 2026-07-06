---
tipas: vieta
pavadinimas: 'Pernu'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
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
# Pernu

## Santrauka

Sofijos palyda per jūrą pasiekė Pernu.

## Teiginiai

<a id="claim-t-187285"></a>
- t-001
  global_id: t-187285
  teiginys: "Kunigaikštytė Sofija su palyda iš Gdansko laivais per jūrą pasiekė Pernu ir Pskovą."
  teiginio_tipas: "faktas"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  saltinio_vieta: "161212-161834; hash=fbd2ba73d8bafe93dfb9ed5b1126c99462dd38327dd16a8193773d217397e8e6; match=exact"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/09_extract_places_notes.md"
  ryšio_patikimumas: "keliavo_i -> Pernu: 0.90"
  ryšio_patikimumo_lygis: "aukstas"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Sofija: llm_allowed_candidate, person"
  ryšio_targeto_parinkimas: "Pernu: llm_allowed_candidate, place"
  ryšio_paaiskinimas: "Sofija su palyda tiesiogiai nurodyta kaip pasiekusi Pernu."
  vertinimo_atnaujinta: "2026-06-16T21:06:50Z"
  vertinimo_autorius: "rewrite_source_claims / rewrite"
  pagrindžia:
    - c-170330

<a id="claim-t-187632"></a>
- t-002
  global_id: t-187632
  teiginys: "Vytautas išleido kunigaikštytę Sofiją iš Marienburgo, o jos palyda iš Gdansko laivais pasiekė Pernu ir Pskovą."
  teiginio_tipas: "faktas"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  saltinio_vieta: "161311-161924; hash=fab7c42513e5d59490e6ce201e347b343fced54c0f2a2e4ab0df057e65863232; match=whitespace_regex"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "susije_su -> Pskovas: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Pernu: owner_note_path, place, gap=0"
  ryšio_targeto_parinkimas: "Pskovas: mention_match, place, gap=9"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Pernu\" parinktas kaip owner_note_path. Targetas \"Pskovas\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  vertinimo_atnaujinta: "2026-06-16T16:17:40Z"
  vertinimo_autorius: "rewrite_source_claims / rewrite"
  pagrindžia:
    - c-170579
- susijęs iš [[objektai/ivykiai/Treniotos žygis į Mazoviją (1264 m.).md#claim-t-185649|Treniotos žygis į Mazoviją (1264 m.)]]: Treniota, paėmęs valdžią, pradėjo niokoti Mazoviją ir sudegino kaimus ligi pat Červinsko.
- susijęs iš Pskovas: Vytauto dukterį Sofiją lydėję asmenys iš Gdansko laivais per Pernu pasiekė Pskovą.
- susijęs iš Pskovas: Vytauto dukterį Sofiją lydėję asmenys iš Gdansko laivais per Pernu pasiekė Pskovą.
## Reikšmingi paminėjimai

- c-001
  santrauka: 'Kunigaikštytė Sofija su palyda iš Gdansko laivais per jūrą pasiekė Pernu ir Pskovą.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Didysis kunigaikštis Vytautas, paėmęs Kreivąją pi­
    lį ir nuniokojęs kraštą, sugrįžo pas vokiečius.
    Tais pačiais metais, Vytautui būnant Vokiečių že­
    mėje, į Marienburgą atvyko pasiuntiniai iš Maskvos,
    nuo didžiojo kunigaikščio Vasilijaus Dmitrijevičiaus,
    prašydami didįjį kunigaikštį Vytautą, kad [leistų] duk­
    terį už didžiojo kunigaikščio Vasilijaus Dmitrijevičiaus.
    Didysis kunigaikštis Vytautas atidavė savo dukterį ku­
    nigaikštytę Sofiją ir išleido ją iš Marienburgo, o su
    ja pasiuntė kunigaikštį Joną Algimantaitį, ir jie iš
    Gdansko miesto išplaukė laivais2 3 , per jūrą pasiekda­
    mi Pernu2 1  ir Pskovo miestą.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: aukstas
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001

- c-002
  santrauka: 'Vytautas išleido kunigaikštytę Sofiją iš Marienburgo, o jos palyda iš Gdansko laivais pasiekė Pernu ir Pskovą.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Tais pačiais metais, Vytautui būnant Vokiečių že­
    mėje, į Marienburgą atvyko pasiuntiniai iš Maskvos,
    nuo didžiojo kunigaikščio Vasilijaus Dmitrijevičiaus,
    prašydami didįjį kunigaikštį Vytautą, kad [leistų] duk­
    terį už didžiojo kunigaikščio Vasilijaus Dmitrijevičiaus.
    Didysis kunigaikštis Vytautas atidavė savo dukterį ku­
    nigaikštytę Sofiją ir išleido ją iš Marienburgo, o su
    ja pasiuntė kunigaikštį Joną Algimantaitį, ir jie iš
    Gdansko miesto išplaukė laivais2 3 , per jūrą pasiekda­
    mi Pernu2 1  ir Pskovo miestą. Pskoviečiai sutiko juos
    labai svetingai ir palydėjo pagarbiai ligi Didžiojo Nau-
    gardo.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002

## Citatos

- id: c-170330
  citata_originali: |
    Didysis kunigaikštis Vytautas, paėmęs Kreivąją pi­
    lį ir nuniokojęs kraštą, sugrįžo pas vokiečius.
    Tais pačiais metais, Vytautui būnant Vokiečių že­
    mėje, į Marienburgą atvyko pasiuntiniai iš Maskvos,
    nuo didžiojo kunigaikščio Vasilijaus Dmitrijevičiaus,
    prašydami didįjį kunigaikštį Vytautą, kad [leistų] duk­
    terį už didžiojo kunigaikščio Vasilijaus Dmitrijevičiaus.
    Didysis kunigaikštis Vytautas atidavė savo dukterį ku­
    nigaikštytę Sofiją ir išleido ją iš Marienburgo, o su
    ja pasiuntė kunigaikštį Joną Algimantaitį, ir jie iš
    Gdansko miesto išplaukė laivais2 3 , per jūrą pasiekda­
    mi Pernu2 1  ir Pskovo miestą.
  citata_rodoma: "ir jie iš \nGdansko miesto išplaukė laivais2 3 , per jūrą pasiekda­\nmi Pernu2 1  ir Pskovo miestą."
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-187285

- id: c-170579
  citata_originali: |
    Tais pačiais metais, Vytautui būnant Vokiečių že­
    mėje, į Marienburgą atvyko pasiuntiniai iš Maskvos,
    nuo didžiojo kunigaikščio Vasilijaus Dmitrijevičiaus,
    prašydami didįjį kunigaikštį Vytautą, kad [leistų] duk­
    terį už didžiojo kunigaikščio Vasilijaus Dmitrijevičiaus.
    Didysis kunigaikštis Vytautas atidavė savo dukterį ku­
    nigaikštytę Sofiją ir išleido ją iš Marienburgo, o su
    ja pasiuntė kunigaikštį Joną Algimantaitį, ir jie iš
    Gdansko miesto išplaukė laivais2 3 , per jūrą pasiekda­
    mi Pernu2 1  ir Pskovo miestą. Pskoviečiai sutiko juos
    labai svetingai ir palydėjo pagarbiai ligi Didžiojo Nau-
    gardo.
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-187632

## Ryšiai
- Buvo kelionės vieta: [[objektai/asmenys/Sofija (Vytauto duktė)]]
