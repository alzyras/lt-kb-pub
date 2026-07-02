---
tipas: zodyno_irasas
pavadinimas: 'Romos tikėjimas'
saltiniai:
  - 'Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)'
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
---
# Romos tikėjimas

## Santrauka

Maskvos valdovas kaltino Aleksandrą įsakius Vaitiekui Taborui ir Juozapui Soltanui raginti Eleną pereiti į Romos tikėjimą. Lietuvos metraštis vaizduoja, kad Algirdo laikais Lietuvoje Romos tikėjimo jau nebuvo, liko vien rusų tikėjimas.

## Teiginiai

<a id="claim-t-185409"></a>
- t-001
  global_id: t-185409
  teiginys: 'Maskvos valdovas kaltino Aleksandrą įsakius Vaitiekui Taborui ir Juozapui Soltanui raginti Eleną pereiti į Romos tikėjimą.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Citata pateikia kaltinimą, todėl reikia nurodyti pranešamą poziciją.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Rusai|Rusai]]; mentioned_person: [[objektai/asmenys/Elena|Elena]]; mentioned_place: Maskva; mentioned_place: Smolenskas; mentioned_place: Vilnius; llm_object: Maskva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 985697-986391; hash=bdf6c62e2deb98941e81ec9e7ef7138fb6fa3ba5d9833ffffcd1ff7b0decccef; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: keliavo_i -> Maskva: 0.78
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Rusai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Maskva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai sako, kad kai kurie rusai ieškojo prieglobsčio Maskvoje.

<a id="claim-t-187526"></a>
- t-002
  global_id: t-187526
  teiginys: 'Lietuvos metraštis vaizduoja, kad Algirdo laikais Lietuvoje Romos tikėjimo jau nebuvo, liko vien rusų tikėjimas.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Religinis vertinimas pagal profilį turi likti priskirtas metraščiui.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Rusai|Rusai]]; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_group: [[objektai/grupes/Pranciškonų ordinas|Pranciškonų ordinas]]; mentioned_object: [[objektai/zodynas/metraštis|metraštis]]; mentioned_person: [[objektai/asmenys/Algirdas|Algirdas]]; mentioned_place: Kamenecas; mentioned_place: Lietuva; mentioned_place: Podolė; mentioned_place: Vilnius; mentioned_place: Vitebskas'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 127192-127614; hash=64b7a2049504eb7f346fb3a6344dca855a2f923b60aede5dfaf623c3d7e50c31; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Rusai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Romos tikėjimas: owner_note_path, thing, gap=0
  ryšio_targeto_parinkimas: Rusai: mention_match, group, gap=37
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Romos tikėjimas" parinktas kaip owner_note_path. Targetas "Rusai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Maskvos valdovas kaltino Aleksandrą įsakius Vaitiekui Taborui ir Juozapui Soltanui raginti Eleną pereiti į Romos tikėjimą.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Šis, labiau
    geisdamas plėsti savo valdas, nei paisyti duoto žodžio
    bei giminystės, ryžosi galop viešai įpilti pasiuntiniams
    taurę nuodų, kuriuos ligi šiol virino, puoselėdamas šir­
    dyje slaptus kėslus. Be reikalo, tarė, minimos čia su­
    tartys, kurios, tiek kartų Aleksandro sulaužytos, seniai
    neturinčios jokios vertės. Juk jis įsakęs Vilniaus vys­
    kupui Vaitiekui Taborui ir
    P a sk elb ia
    A le k sa n d -
    Smolensko
    Juozapui Solta-
    rui karą
    nui ne kartą raginti Eleną
    pereiti į Romos tikėjimą; li­
    gi šiol rūmuose nesanti pastatyta Elenos reikalams
    koplyčia; rusai verčiami atsisakyti prosenelių tikėjimo
    ir todėl kai kurie, norėdami išvengti šitokios nuodė­
    mės, ieškosi prieglobsčio Maskvoje.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-001

- c-002
  santrauka: 'Lietuvos metraštis vaizduoja, kad Algirdo laikais Lietuvoje Romos tikėjimo jau nebuvo, liko vien rusų tikėjimas.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    76

    ## Puslapis 72

    22. APIE PODOLĖS KAMENECO SENIŪNĄ PETRĄ GOŠTAUTĄ,
    PIRMĄJĮ LIETUVĮ KATALIKĄ, IR APIE VIENUOLIŲ
    PRANCIŠKONŲ ĮSIKŪRIMĄ VILNIUJE
    Kunigaikštis Algirdas, vedęs Vitebsko kunigaikšty­
    tę Julijoną, dėl jos priėmė krikštą ir rusų tikėjimą,
    o visi lietuvių didikai pasiliko pagonys. Didysis kuni­
    gaikštis Algirdas jų varu nevarė ir į savo tikėjimą ne­
    vertė, o Romos tikėjimo Lietuvoje jau nebuvo, vien
    rusų.
  citata_rodoma: ''
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: "Automatinis legacy citatos patikimumo metaduomenų backfill."
  statusas: verified
  pagrindžia:
    - t-002
