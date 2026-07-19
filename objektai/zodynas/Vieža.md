---
tipas: zodyno_irasas
pavadinimas: 'vieža'
saltiniai:
  - 'Simonas Daukantas, Būdas senovės lietuvių, kalnėnų ir žemaičių'
sukurta: ''
atnaujinta: ''
tags:
  - teisinis-terminas
  - sąvoka
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
# vieža

## Santrauka

Duobė ar kalėjimo tipo vieta, kurioje kaltininkai būdavo uždaromi. Terminas aiškiai apibūdinamas kaip iškasta, kartais išmūryta duobė, kurioje kaltininkai turėdavo išsėdėti nustatytą laiką.

## Žodis ir formos

Pagrindinė forma: `vieža`.
Vartojamos formos: `viežą`, `viežos`.

## Pastabos

- Tiksli teisinė ir institucine forma gali skirtis, bet kalinimo funkcija tekste aiški.

## Teiginiai

<a id="claim-t-07713"></a>
- t-001
  global_id: t-07713
  teiginys: "Vieža buvo bausmės duobė, iš kurios vėlesniais laikais buvo galima išsipirkti pinigais."
  atnaujinta: "2026-06-13 17:10"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/08_extract_vocabulary_notes.md"
  šaltinio_profilis: "žanras: istorinis_tekstas; perspektyva: neutrali_arba_neaiski; šališkumas: medium; atribucija: required_for_interpretation; atribucijos vardas: Simonas Daukantas"
  pagrindžia:
    - c-09641

<a id="claim-t-07714"></a>
- t-002
  global_id: t-07714
  teiginys: "Vieža Daukanto tekste buvo žemėje iškasta, kartais išmūryta duobė kaltininkams nustatytą laiką kalinti."
  atnaujinta: "2026-06-13 17:10"
  sprendimo_priezastis: "final::darbas/prompts/03_extraction/08_extract_vocabulary_notes.md"
  ryšio_patikimumas: "susije_su -> S. Daukantas: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "vieža: owner_note_path, thing, gap=0"
  ryšio_targeto_parinkimas: "S. Daukantas: mention_match, author, gap=6"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"vieža\" parinktas kaip owner_note_path. Targetas \"S. Daukantas\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  šaltinio_profilis: "žanras: istorinis_tekstas; perspektyva: neutrali_arba_neaiski; šališkumas: medium; atribucija: required_for_interpretation; atribucijos vardas: Simonas Daukantas"
  pagrindžia:
    - c-09641
- susijęs iš [[objektai/daiktai/Dybas.md#claim-t-08289|Dybas]]: Kaltininkus pririšdavo prie dybo ir plakdavo.
## Citatos

- id: c-09641
  autorius: "Simonas Daukantas"
  šaltinis: "Simonas Daukantas, Būdas senovės lietuvių, kalnėnų ir žemaičių"
  indeksas: "Simonas Daukantas, Būdas senovės lietuvių, kalnėnų ir žemaičių."
  citata_originali: |
    Kaltininkus taip kankino: vienus korė į sausą medį, kaip šiandien dar tariama yra į paiką žmogų:
        „Tas, – sako, – pašoks į sausą medį“ arba: „Tas sulauks sausos šakos“; kitus dybavojo^1126 , prie dybo^1127
        pririšę, kitus į viežą^1128 sodino; vieža buvo duobė, per 3 ar 4 sieksnius žemėj iškasta, kartais
        išmūravota^1129 , kur kaltininkus sodino nuspręstą laiką išsėdėti, kurios didžiai nekentė ir paskesniuose
        laikuose galėjo išsipirkti nuo tos viežos pinigais. Vadinos vieža nuo to, jog kaltininkas tenai kaip
        vėžys pakerėj turėjo lindoti. Tuos, kurie svetimas bites kieme ar girioj bartis^1130 išlaužė, prikalus
        bambą prie aulio ar drevės, varė apsukui pliekdami, lig žarnos neišėjo.
  citata_rodoma: |
    Kaltininkus taip kankino: vienus korė į sausą medį, kaip šiandien dar tariama yra į paiką žmogų: „Tas, – sako, – pašoks į sausą medį“ arba: „Tas sulauks sausos šakos“; kitus dybavojo^1126 , prie dybo^1127 pririšę, kitus į viežą^1128 sodino; vieža buvo duobė, per 3 ar 4 sieksnius žemėj iškasta, kartais išmūravota^1129 , kur kaltininkus sodino nuspręstą laiką išsėdėti, kurios didžiai nekentė ir paskesniuose laikuose galėjo išsipirkti nuo tos viežos pinigais. Vadinos vieža nuo to, jog kaltininkas tenai kaip vėžys pakerėj turėjo lindoti.
  statusas: verified
  atnaujinta: "2026-07-10 10:39"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-07713
    - t-07714