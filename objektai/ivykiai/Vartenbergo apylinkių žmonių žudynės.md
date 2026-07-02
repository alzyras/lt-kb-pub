---
tipas: ivykis
pavadinimas: 'Vartenbergo apylinkių žmonių žudynės'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - ežeras
  - ginklas
  - ivykis
  - pilis
---
# Vartenbergo apylinkių žmonių žudynės

## Santrauka

Dusburgietis teigia, kad apie brolių kovą Vartenbergo pilyje ir daugybės krikščionių žūtį Kulmo žemėje buvo pilis ant kalno, vardu Vartenbergas435, buvusiame viduryje ežero, pavadinto to pat kalno vardu; joje gyveno broliai su gražiu būreliu ginklanešių.

## Laikotarpis ir datos

Nenurodyta

## Dalyviai ir vaidmenys

Nenurodyta

## Eiga

Nenurodyta

## Rezultatas

Nenurodyta

## Teiginiai

<a id="claim-t-62521"></a>
- t-001
  global_id: t-62521
  teiginys: 'Vartenbergo pilis stovėjo Kulmo žemėje ant kalno ežero viduryje, o joje gyveno Ordino broliai su ginklanešiais.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Teiginys gramatiškas ir pagrįstas citatoje pateiktu Vartenbergo aprašymu.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Kryžiuočių ordinas|Kryžiuočių ordinas]]; mentioned_place: Kulmas; mentioned_place: Vartenbergas; llm_object: Kulmas; mentioned_group: [[objektai/grupes/Sūduviai|Sūduviai]]; mentioned_place: Sūduva; mentioned_place: Viena; llm_object: Vartenbergas'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=28b142357d57847edc2edb68c4912201459919a42ca30979e216aeb3d3653fb0; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: priklause -> Kulmas: 0.84
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vartenbergas: llm_allowed_candidate, place
  ryšio_targeto_parinkimas: Kulmas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Vartenbergo pilis lokalizuojama Kulmo žemėje, todėl siejama priklausymo vietovei ryšiu.

<a id="claim-t-183973"></a>
- t-002
  global_id: t-183973
  teiginys: 'Vieną sekmadienį iš Sūduvos atvykusi kariuomenė išžudė Vartenbergo apylinkių kaimų žmones, o moteris ir vaikus išsivarė į nelaisvę.'
  teiginio_tipas: 'saltinio_teiginys'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Teiginys tiksliai apibendrina citatoje aprašytas žudynes.'
  susije_objektai: 'mentioned_place: Vartenbergas; mentioned_group: [[objektai/grupes/Kryžiuočių ordinas|Kryžiuočių ordinas]]; mentioned_group: [[objektai/grupes/Sūduviai|Sūduviai]]; mentioned_place: Kulmas; mentioned_place: Sūduva; mentioned_place: Viena'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=28b142357d57847edc2edb68c4912201459919a42ca30979e216aeb3d3653fb0; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Vartenbergas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Vartenbergo apylinkių žmonių žudynės: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Vartenbergas: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Vartenbergo apylinkių žmonių žudynės" parinktas kaip owner_note_path. Targetas "Vartenbergas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie brolių kovą Vartenbergo pilyje ir daugybės krikščionių žūtį

      Kulmo žemėje buvo pilis ant kalno, vardu Vartenbergas435, buvusiame viduryje ežero,
    pavadinto to pat kalno vardu; joje gyveno broliai su gražiu būreliu ginklanešių. Vieną
    sekmadienį, kai aplinkinių kaimų žmonės linksminosi ir šoko, iš Sūduvos juos netikėtai
    užgriuvo kariuomenė, kuri visus šiuos žmones išžudė, o moteris  ir vaikus išsivarė  į
    nelaisvę.

      435  Vartenbergo  pilies,  sūduvių  sudegintos  ir  iki  pat  kronikos rašymo metų
    neatstatytos (III, 159), ieškoma Kulmo žemės šiaurės rytuose, kur XIII a. 2-oje pusėje
    tebuvo žinomas vienas kryžiuočių centras Vonė (Wonne) Osos aukštupyje (dab.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-001
    - t-002
