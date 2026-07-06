---
tipas: vieta
pavadinimas: 'Krasnyj Gorod'
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
# Krasnyj Gorod

## Santrauka

Vytautas paėmė Pskovo miestą Krasnyj Gorod. Komentare Krasnyj gorod tapatinamas su Krasnogorodskoje.

## Teiginiai

<a id="claim-t-187241"></a>
- t-002
  global_id: t-187241
  teiginys: "Krasnyj Gorod tapatinamas su Krasnogorodskoje, esančiu 30 km į šiaurės vakarus nuo Opočkos."
  teiginio_tipas: "faktas"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  saltinio_vieta: "479817-480003; hash=dc057428eac20b397a21652262ab72c8c58147a18f714a8401d24fcd76e135b4; match=exact"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/09_extract_places_notes.md"
  ryšio_patikimumas: "susije_su -> Opočka: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Krasnyj Gorod: owner_note_path, place, gap=0"
  ryšio_targeto_parinkimas: "Opočka: mention_match, place, gap=83"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Krasnyj Gorod\" parinktas kaip owner_note_path. Targetas \"Opočka\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  vertinimo_atnaujinta: "2026-06-16T16:17:40Z"
  vertinimo_autorius: "rewrite_source_claims / rewrite"
  pagrindžia:
    - c-170304

<a id="claim-t-187242"></a>
- t-001
  global_id: t-187242
  teiginys: "Komentare Krasnyj gorod tapatinamas su Krasnogorodskoje."
  teiginio_tipas: "faktas"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  saltinio_vieta: "479817-480003; hash=dc057428eac20b397a21652262ab72c8c58147a18f714a8401d24fcd76e135b4; match=exact"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/09_extract_places_notes.md"
  ryšio_patikimumas: "susije_su -> Krasnogorodskoje: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Krasnyj Gorod: owner_note_path, place, gap=0"
  ryšio_targeto_parinkimas: "Krasnogorodskoje: mention_match, place, gap=29"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Krasnyj Gorod\" parinktas kaip owner_note_path. Targetas \"Krasnogorodskoje\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  pagrindžia:
    - c-170304

<a id="claim-t-187587"></a>
- t-003
  global_id: t-187587
  teiginys: "Vytautas per žygį prieš Pskovą paėmė Pskovo miestus Veližą ir Krasnyj Gorod."
  teiginio_tipas: "faktas"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  semantiniai_rysiai: "Vytautas (Lietuvos valdovas, XIV–XV a.) užėmė Veližas (0.90); Vytautas (Lietuvos valdovas, XIV–XV a.) užėmė Krasnyj Gorod (0.90); Vytautas (Lietuvos valdovas, XIV–XV a.) surengė žygį į Pskovas (0.86)"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  saltinio_vieta: "181196-181980; hash=43fc6f15a4bd7a15edefd444255452f790575c1bd4273d670bb31f4b8985b56a; match=whitespace_regex"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "uzeme -> Krasnyj Gorod: 0.90"
  ryšio_patikimumo_lygis: "aukstas"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person"
  ryšio_targeto_parinkimas: "Krasnyj Gorod: llm_allowed_candidate, place"
  ryšio_paaiskinimas: "Citata tiesiogiai nurodo, kad Vytautas paėmė Krasnyj Gorod."
  vertinimo_atnaujinta: "2026-06-16T16:17:40Z"
  vertinimo_autorius: "rewrite_source_claims / rewrite"
  pagrindžia:
    - c-170534
- susijęs iš Veližas: Vytautas išsirengė prieš Pskovą ir paėmė Pskovo miestus Veližą bei Krasnyj Gorod.
- susijęs iš Krasnogorodskoje: Krasnogorodskoje lokalizuojamas 30 km į šiaurės vakarus nuo Opočkos.
- susijęs iš Krasnogorodskoje: Krasnyj gorod komentare tapatinamas su Krasnogorodskoje.
- susijęs iš Opočka: Krasnogorodskoje lokalizuojama 30 km į šiaurės vakarus nuo Opočkos.
- susijęs iš Opočka: Krasnogorodskoje lokalizuojama į šiaurės vakarus nuo Opočkos.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    7 Krasnyj gorod — tai Krasnogorodskoje, 30 km į šiaurės va­
    karus nuo Opočkos (RTFR. Veiikije Lukų sr.). Rusų metraščiai mi­
    ni kitus LDK kariuomenės pultus Pskovo miestus (žr. past. 5).
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
    - t-001

- c-002
  santrauka: 'Vytautas per žygį prieš Pskovą paėmė Pskovo miestus Veližą ir Krasnyj Gorod.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Didysis kunigaikštis Vytautas, sutelkęs visas savo
    pajėgas, ištraukė į Naugardo žemę2 , prastovėjo šešis
    mėnesius prie Porchovo miesto3  ir, nepaėmęs miesto,
    nuėjo per Naugardo ir Pskovo žemę niokodamas, de­
    gindamas ir imdamas nelaisvėn * .
    Sekančiais metais didysis kunigaikštis Vytautas išsi­
    rengė prieš Pskovo miestą5  ir paėmė Pskovo miestus
    Veližą6  ir Krasnyj Gorod7 . Pskoviečiai, nebenorėdami,
    kad jis toliau niokotų jų žemę, atsiuntė savo pasiunti­
    nius pas didįjį kunigaikštį Vytautą, kad jis būtų jų
    valdovu, žadėjo jo klausyti ir kasmet mokėti jam duok­
    lę bei įsileisti jo vietininką, ir didysis kunigaikštis
    (07

    ## Puslapis 103

    pasodino pas juos vietininku Pinsko kunigaikštį Juri­
    jų, pramintą Nosimi8 , o pats su visomis pajėgomis nu­
    žygiavo prieš Naugardą.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: aukstas
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003

## Citatos

- id: c-170304
  autorius: "Anoniminis metraštininkas"
  šaltinis: "Lietuvos metraštis, Bychovco kronika (1971 m.)"
  citata_originali: |
    7 Krasnyj gorod — tai Krasnogorodskoje, 30 km į šiaurės va­
    karus nuo Opočkos (RTFR. Veiikije Lukų sr.). Rusų metraščiai mi­
    ni kitus LDK kariuomenės pultus Pskovo miestus (žr. past. 5).
  citata_rodoma: "7 Krasnyj gorod — tai Krasnogorodskoje, 30 km į šiaurės va­\nkarus nuo Opočkos (RTFR. Veiikije Lukų sr.). Rusų metraščiai mi­\nni kitus LDK kariuomenės pultus Pskovo miestus (žr. past. 5)."
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-187242
    - t-187241

- id: c-170534
  autorius: "Anoniminis metraštininkas"
  šaltinis: "Lietuvos metraštis, Bychovco kronika (1971 m.)"
  citata_originali: |
    Didysis kunigaikštis Vytautas, sutelkęs visas savo
    pajėgas, ištraukė į Naugardo žemę2 , prastovėjo šešis
    mėnesius prie Porchovo miesto3  ir, nepaėmęs miesto,
    nuėjo per Naugardo ir Pskovo žemę niokodamas, de­
    gindamas ir imdamas nelaisvėn * .
    Sekančiais metais didysis kunigaikštis Vytautas išsi­
    rengė prieš Pskovo miestą5  ir paėmė Pskovo miestus
    Veližą6  ir Krasnyj Gorod7 . Pskoviečiai, nebenorėdami,
    kad jis toliau niokotų jų žemę, atsiuntė savo pasiunti­
    nius pas didįjį kunigaikštį Vytautą, kad jis būtų jų
    valdovu, žadėjo jo klausyti ir kasmet mokėti jam duok­
    lę bei įsileisti jo vietininką, ir didysis kunigaikštis
    (07

    ## Puslapis 103

    pasodino pas juos vietininku Pinsko kunigaikštį Juri­
    jų, pramintą Nosimi8 , o pats su visomis pajėgomis nu­
    žygiavo prieš Naugardą.
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-187587

## Ryšiai
- Užėmė Krasnyj Gorod: [[objektai/asmenys/Vytautas|Vytautas (Lietuvos valdovas, XIV–XV a.)]]
