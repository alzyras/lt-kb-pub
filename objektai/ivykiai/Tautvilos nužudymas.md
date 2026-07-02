---
tipas: ivykis
pavadinimas: 'Tautvilos nužudymas'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
---
# Tautvilos nužudymas

## Santrauka

Lietuvos metraštis teigia, kad po Mindaugo nužudymo Treniota pasiuntė pasiuntinius į Polocką kviesti Tautvilos. Lietuvos metraštis pasakoja, kad Tautvilą nužudė Treniota, sužinojęs apie jo kėslus.

## Laikotarpis ir datos

- laikotarpis:

## Dalyviai ir vaidmenys

Nenurodyta

## Eiga

Nenurodyta

## Rezultatas

Nenurodyta

## Teiginiai

<a id="claim-t-186565"></a>
- t-001
  global_id: t-186565
  teiginys: 'Lietuvos metraščio pasakojimu, po Mindaugo nužudymo Treniota pasiuntė pasiuntinius į Polocką kviesti Tautvilos dalytis Mindaugo žeme ir turtu.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Pridėtas citatoje nurodytas kvietimo tikslas.'
  susije_objektai: 'llm_object: Polockas; mentioned_person: [[objektai/asmenys/Treniota|Treniota]]; mentioned_place: Polockas; mentioned_person: [[objektai/asmenys/Mindaugas|Mindaugas]]; mentioned_place: Lietuva; llm_object: Lietuva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=2b8955ebfa3a52bb4553f507bbd71a92fb906e3198b997309956c9198fd6dd9c; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: siunte_i -> Polockas: 0.95
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Treniota: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Polockas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Treniota tiesiogiai siunčia pasiuntinius į Polocką.

<a id="claim-t-186566"></a>
- t-002
  global_id: t-186566
  teiginys: 'Lietuvos metraščio pasakojimu, Prakapui išdavus Tautvilos kėslą, Treniota užbėgo Tautvilai už akių, jį nužudė ir liko kunigaikščiauti vienas.'
  teiginio_tipas: 'saltinio_teiginys'
  sudarymo_pagrindimas: 'Kėslai ir pasekmė yra metraštinė interpretacija, todėl priskirta šaltiniui.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Treniota|Treniota]]; mentioned_person: [[objektai/asmenys/Mindaugas|Mindaugas]]; mentioned_place: Lietuva; mentioned_place: Polockas; llm_object: Lietuva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=2b8955ebfa3a52bb4553f507bbd71a92fb906e3198b997309956c9198fd6dd9c; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/04_extract_events_notes.md
  ryšio_patikimumas: valde -> Lietuva: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Treniota: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Lietuva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata nurodo, kad Treniota kunigaikščiavo Lietuvos žemėje.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    O Treniota
    pradėjo kunigaikščiauti visoje Lietuvos ir Žemaičių že­
    m ėje^
    Ir 1 5  Treniota nusiuntė pasiuntinius į Polocką pas
    savo brolį Tautvilą, tarydamas: „Atvažiuok, brolau, ši-
    čion, pasidalysime Mindaugo žemę ir turtą." Tajam
    pas jį atvažiavus, Tautvilą ir ėmė galvoti, kaip Trenio­
    tą nužudyti, o Treniota tą patį galvojo apie Tautvilą.
    Tautvilos bajoras, polockietis Prakapas, išdavė jo kės­
    lą. Treniota užbėgo Tautvilai už akių ir nužudė Taut­
    vilą 1 6  ir ėmė pats vienas kunigaikščiauti.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
    - t-002