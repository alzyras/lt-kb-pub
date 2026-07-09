---
tipas: ivykis
pavadinimas: 'Vaistotpilio kovos ir pilies apleidimas (pilis)'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - ivykis
  - pilis
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
# Vaistotpilio kovos ir pilies apleidimas (pilis)

## Santrauka

Dusburgietis teigia, kad šios pilies broliai vieną dieną persekiojo prūsų kariuomenę, apiplėšusią ten du kaimus. Dusburgietis teigia, kad apie tai, kaip buvo palikta Vaistotpilio pilis Nesitenkindami broliams padarytais nuostoliais, prūsai subūrė didžiulę kariuomenę ir apsupo Vaistotpilio pilį; jie smarkiai puolė ją nuo aušros iki sutemų, o broliai narsiai gynėsi.

## Laikotarpis ir datos

Nenurodyta

## Dalyviai ir vaidmenys

Nenurodyta

## Eiga

Nenurodyta

## Rezultatas

Nenurodyta

## Teiginiai

<a id="claim-t-89412"></a>
- t-003
  global_id: t-89412
  teiginys: "Bartos žemėje, Gubros pakrantėje, broliai turėjo pilį, vadintą Vaistotpiliu."
  semantiniai_rysiai: "Vaistotpilis priklausė Barta (0.80)"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  saltinio_vieta: "403892-404257; hash=4c9afe15644d3f68fc571ccb75e1d97e59b2ae42423be1d5bd299ce97dfab1b7; match=exact"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "priklause -> Barta: 0.80"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Vaistotpilis: llm_allowed_candidate, place"
  ryšio_targeto_parinkimas: "Barta: llm_allowed_candidate, place"
  ryšio_paaiskinimas: "Vaistotpilis lokalizuojamas Bartos žemėje, todėl ryšys traktuojamas kaip priklausymas vietovei."
  pagrindžia:
    - c-85373

<a id="claim-t-89413"></a>
- t-001
  global_id: t-89413
  teiginys: "Vaistotpilio pilies broliai persekiojo prūsų kariuomenę, apiplėšusią du kaimus prie pilies."
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  saltinio_vieta: "404066-404285; hash=6ebc4d27fcf99aea6ff96006416595d78d7127387240cb0f2daff2544efa0f77; match=exact"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "susije_su -> Prūsai: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; prusai_group_context; same_sentence_locality; single_candidate_actor; single_candidate_target; target_after_predicate"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Vaistotpilio kovos ir pilies apleidimas (pilis): owner_note_path, event, gap=0"
  ryšio_targeto_parinkimas: "Prūsai: mention_match, place, gap=39"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Vaistotpilio kovos ir pilies apleidimas (pilis)\" parinktas kaip owner_note_path. Targetas \"Prūsai\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  pagrindžia:
    - c-85372
    - c-85373

<a id="claim-t-89414"></a>
- t-002
  global_id: t-89414
  teiginys: "Prūsai apsupo Vaistotpilio pilį ir puolė ją nuo aušros iki sutemų, o broliai narsiai gynėsi."
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  saltinio_vieta: "404286-404740; hash=4b36c9810bbd2df150288a9b81e093566971e7485840629a7fce3ccad79852a3; match=exact"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "susije_su -> Vaistotpilis: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Vaistotpilio kovos ir pilies apleidimas (pilis): owner_note_path, event, gap=0"
  ryšio_targeto_parinkimas: "Vaistotpilis: mention_match, place, gap=0"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Vaistotpilio kovos ir pilies apleidimas (pilis)\" parinktas kaip owner_note_path. Targetas \"Vaistotpilis\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  pagrindžia:
    - c-85375

<a id="claim-t-183972"></a>
- t-004
  global_id: t-183972
  teiginys: "Kai prūsai pasitraukė, broliai sudegino nepakankamai sutvirtintą Vaistotpilio pilį ir slapta pasitraukė."
  teiginio_tipas: "saltinio_teiginys"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  saltinio_vieta: "404286-404740; hash=4b36c9810bbd2df150288a9b81e093566971e7485840629a7fce3ccad79852a3; match=exact"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "susije_su -> Vaistotpilis: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Vaistotpilio kovos ir pilies apleidimas (pilis): owner_note_path, event, gap=0"
  ryšio_targeto_parinkimas: "Vaistotpilis: mention_match, place, gap=0"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Vaistotpilio kovos ir pilies apleidimas (pilis)\" parinktas kaip owner_note_path. Targetas \"Vaistotpilis\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  pagrindžia:
    - c-85375

<a id="claim-t-194429"></a>
- t-005
  global_id: t-194429
  teiginys: "Apie tai, kaip buvo palikta Vaistotpilio pilis Nesitenkindami broliams padarytais nuostoliais, prūsai subūrė didžiulę kariuomenę ir apsupo Vaistotpilio pilį; jie smarkiai puolė ją nuo aušros iki sutemų, o broliai narsiai gynėsi."
  teiginio_tipas: "faktas"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  saltinio_vieta: "404286-404740; hash=4b36c9810bbd2df150288a9b81e093566971e7485840629a7fce3ccad79852a3; match=exact"
  sprendimo_priezastis: "auto"
  pagrindžia:
    - c-85375
## Reikšmingi paminėjimai

- c-001
  santrauka: 'Vaistotpilio pilies broliai persekiojo prūsų kariuomenę, apiplėšusią du kaimus prie pilies.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Šios pilies broliai vieną dieną persekiojo prūsų kariuomenę, apiplėšusią
    ten du kaimus. Vis dėlto prūsai, pasprukę nuo jiems ten paspęstų spąstų, nužudė šešis
    brolius bei daugybę krikščionių.




                 115 (110).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002

- c-002
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie 6 brolių ir daugybės krikščionių žūtį Vaistotpilio pilyje

      Toje pačioje Bartos žemėje, Gubros pakrantėje, pasak kai kurių, broliai turėjo pilį, vardu
    Vaistotpilis389. Šios pilies broliai vieną dieną persekiojo prūsų kariuomenę, apiplėšusią
    ten du kaimus. Vis dėlto prūsai, pasprukę nuo jiems ten paspęstų spąstų, nužudė šešis
    brolius bei daugybę krikščionių.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
    - t-002

- c-003
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie tai, kaip buvo palikta Vaistotpilio pilis

      Nesitenkindami broliams padarytais nuostoliais, prūsai subūrė didžiulę kariuomenę
    ir apsupo Vaistotpilio pilį; jie smarkiai puolė ją nuo aušros iki sutemų, o broliai narsiai
    gynėsi. Kai prūsai, nepasiekę tikslo, pasitraukė, broliai, turėdami galvoje, kad pilis nesanti
    deramai sutvirtinta ir ateityje nestengsianti atremti tokių stiprių antpuolių, sudegino pilį
    ir slapta pasitraukė.




          116 (111).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003
    - t-004
    - t-005

## Citatos

- id: c-85372
  autorius: "Petras Dusburgietis"
  šaltinis: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)"
  indeksas: "Petras Dusburgietis, Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)."
  citata_originali: |
    Šios pilies broliai vieną dieną persekiojo prūsų kariuomenę, apiplėšusią
    ten du kaimus. Vis dėlto prūsai, pasprukę nuo jiems ten paspęstų spąstų, nužudė šešis
    brolius bei daugybę krikščionių.




                 115 (110).
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-89413

- id: c-85373
  autorius: "Petras Dusburgietis"
  šaltinis: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)"
  indeksas: "Petras Dusburgietis, Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)."
  citata_originali: |
    Apie 6 brolių ir daugybės krikščionių žūtį Vaistotpilio pilyje

      Toje pačioje Bartos žemėje, Gubros pakrantėje, pasak kai kurių, broliai turėjo pilį, vardu
    Vaistotpilis389. Šios pilies broliai vieną dieną persekiojo prūsų kariuomenę, apiplėšusią
    ten du kaimus. Vis dėlto prūsai, pasprukę nuo jiems ten paspęstų spąstų, nužudė šešis
    brolius bei daugybę krikščionių.
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-89412
    - t-89413

- id: c-85375
  autorius: "Petras Dusburgietis"
  šaltinis: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)"
  indeksas: "Petras Dusburgietis, Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)."
  citata_originali: |
    Apie tai, kaip buvo palikta Vaistotpilio pilis

      Nesitenkindami broliams padarytais nuostoliais, prūsai subūrė didžiulę kariuomenę
    ir apsupo Vaistotpilio pilį; jie smarkiai puolė ją nuo aušros iki sutemų, o broliai narsiai
    gynėsi. Kai prūsai, nepasiekę tikslo, pasitraukė, broliai, turėdami galvoje, kad pilis nesanti
    deramai sutvirtinta ir ateityje nestengsianti atremti tokių stiprių antpuolių, sudegino pilį
    ir slapta pasitraukė.




          116 (111).
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-89414
    - t-183972
    - t-194429
