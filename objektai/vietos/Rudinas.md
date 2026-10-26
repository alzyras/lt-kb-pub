---
tipas: vieta
pavadinimas: 'Rudinas'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - miestas
  - pilis
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
entity_id: "ent-cfb0c5e1f1ac95faf0caf94c"
canonical_name: "Rudinas"
entity_roles: ["place"]
entity_view_role: "place"
entity_aliases: ["Rudinas"]
sameAs: []
canonical_biography: "Dusburgietis teigia, kad rudino miestas buvęs du kartus užkariautas, o visi jame buvę žmonės arba paimti į nelaisvę, arba išžudyti. Dusburgietis teigia, kad kai galop visi krikščionys ir prūsai jau gulėjo nukauti, sargybinis, kuris buvo pririštas prie medžio, sutraukė raiščius, nuėjo į kovos vietą, surado čia Martyną, smarkiai sužeistą, bet dar gyvą, įkėlė jį į vežimą ir nuvežė į Rudino pilį, vesdamasis drauge."
place_authority: true
historical_names: []
---
# Rudinas

## Santrauka

Dusburgietis teigia, kad rudino miestas buvęs du kartus užkariautas, o visi jame buvę žmonės arba paimti į nelaisvę, arba išžudyti. Dusburgietis teigia, kad kai galop visi krikščionys ir prūsai jau gulėjo nukauti, sargybinis, kuris buvo pririštas prie medžio, sutraukė raiščius, nuėjo į kovos vietą, surado čia Martyną, smarkiai sužeistą, bet dar gyvą, įkėlė jį į vežimą ir nuvežė į Rudino pilį, vesdamasis drauge.

## Teiginiai

<a id="claim-t-91359"></a>
- t-001
  teiginys: "Sargybinis rado sužeistą Martyną kovos vietoje ir nuvežė jį į Rudino pilį."
  atnaujinta: "2026-07-19 18:48"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "keliavo_i -> Rudinas: 0.78"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Martynas iš Golino: llm_allowed_candidate, person"
  ryšio_targeto_parinkimas: "Rudinas: llm_allowed_candidate, place"
  ryšio_paaiskinimas: "Martynas buvo nugabentas į Rudino pilį, todėl kryptinė kelionės sąsaja yra tiesiogiai paremta tekstu."
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  semantiniai_rysiai: "Martynas iš Golino keliavo į Rudinas (0.78)"
  pagrindžia:
    - c-87075

<a id="claim-t-91360"></a>
- t-002
  teiginys: "Antrosios atskalūnybės metais Rudino broliai ir miestiečiai gynė krikščionių tikėjimą nuo prūsų."
  atnaujinta: "2026-07-19 17:58"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "susije_su -> Prūsai: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; prusai_group_context; same_sentence_locality; single_candidate_actor; single_candidate_target; target_after_predicate"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Rudinas: owner_note_path, place, gap=0"
  ryšio_targeto_parinkimas: "Prūsai: mention_match, place, gap=60"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Rudinas\" parinktas kaip owner_note_path. Targetas \"Prūsai\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  pagrindžia:
    - c-87074

<a id="claim-t-91361"></a>
- t-003
  teiginys: "Pasak kai kurių žmonių, Rudino miestas buvo du kartus užkariautas, o jo gyventojai paimti į nelaisvę arba išžudyti."
  atnaujinta: "2026-07-19 17:58"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "susije_su -> pasak kai kurių: 0.83"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Rudinas: owner_note_path, place, gap=0"
  ryšio_targeto_parinkimas: "pasak kai kurių: mention_match, thing, gap=24"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Rudinas\" parinktas kaip owner_note_path. Targetas \"pasak kai kurių\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality."
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  pagrindžia:
    - c-87076

## Citatos

- id: c-87074
  autorius: "Petras Dusburgietis"
  šaltinis: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)"
  puslapiai: "PDF 142"
  indeksas: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.), PDF 142."
  citata_originali: |
    Apie Rudino brolių kovą ir tenykščio miesto sugriovimą

      Vargu ar kas stengtų išsamiai aprašyti bei papasakoti, kiek vargų antrosios atskalūnybės
    metais patyrė Rudino broliai bei miestiečiai, gindami krikščionių tikėjimą nuo prūsų, nes
    šiomis vietomis prūsai nuolatos braudavosi į Kulmo žemę ir iš jos traukdavo atgal. Pasak
    kai kurių žmonių. Rudino miestas buvęs du kartus užkariautas, o visi jame buvę žmonės
    arba paimti į nelaisvę, arba išžudyti.
  citata_rodoma: "Apie Rudino brolių kovą ir tenykščio miesto sugriovimą\n\n  Vargu ar kas stengtų išsamiai aprašyti bei papasakoti, kiek vargų antrosios atskalūnybės\nmetais patyrė Rudino broliai bei miestiečiai, gindami krikščionių tikėjimą nuo prūsų, nes\nšiomis vietomis prūsai nuolatos braudavosi į Kulmo žemę ir iš jos traukdavo atgal. Pasak\nkai kurių žmonių. Rudino miestas buvęs du kartus užkariautas, o visi jame buvę žmonės\narba paimti į nelaisvę, arba išžudyti."
  statusas: verified
  atnaujinta: "2026-07-12 22:31"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-002

- id: c-87075
  autorius: "Petras Dusburgietis"
  šaltinis: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)"
  puslapiai: "PDF 142"
  indeksas: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.), PDF 142."
  citata_originali: |
    Prusai jį
    taip siaubingai kapojo, taip žeidė, kad daugelyje vietų nuo jo kūno tiesiog karojo dideli
    mėsos gabalai. Vieni ir kiti šitaip įnirtingai grūmėsi, kad, abiem šalims pavargus, susitarė
    pailsėti, o ilsėjosi jie net tris kartus ir tiek pat kartų, atgavę jėgas, vėl stojo į kovą. Kai
    galop visi krikščionys ir prūsai jau gulėjo nukauti, sargybinis, kuris buvo pririštas prie
    medžio, sutraukė raiščius, nuėjo į kovos vietą, surado čia Martyną, smarkiai sužeistą,
    bet dar gyvą, įkėlė jį į vežimą ir nuvežė į Rudino pilį, vesdamasis drauge prūsų arklius ir
    gabendamasis jų ginklus bei kitus daiktus.
  citata_rodoma: "Kai\ngalop visi krikščionys ir prūsai jau gulėjo nukauti, sargybinis, kuris buvo pririštas prie\nmedžio, sutraukė raiščius, nuėjo  į kovos vietą, surado čia Martyną, smarkiai sužeistą,\nbet dar gyvą, įkėlė jį į vežimą ir nuvežė į Rudino pilį, vesdamasis drauge prūsų arklius ir\ngabendamasis jų ginklus bei kitus daiktus."
  statusas: verified
  atnaujinta: "2026-07-12 22:31"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-001

- id: c-87076
  autorius: "Petras Dusburgietis"
  šaltinis: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)"
  puslapiai: "PDF 142"
  indeksas: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.), PDF 142."
  citata_originali: |
    Pasak
    kai kurių žmonių. Rudino miestas buvęs du kartus užkariautas, o visi jame buvę žmonės
    arba paimti į nelaisvę, arba išžudyti.




                     156 (151).
  citata_rodoma: "Pasak\nkai kurių žmonių. Rudino miestas buvęs du kartus užkariautas, o visi jame buvę žmonės\narba paimti į nelaisvę, arba išžudyti.\n\n\n\n\n                 156 (151)."
  statusas: verified
  atnaujinta: "2026-07-12 22:31"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-003

## Ryšiai
- Buvo kelionės vieta: [[objektai/asmenys/Martynas iš Golino]]
