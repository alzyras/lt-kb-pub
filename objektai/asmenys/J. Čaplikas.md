---
tipas: asmuo
pavadinimas: 'J. Čaplikas'
saltiniai:
  - 'Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
---
# J. Čaplikas

## Santrauka

Čapliko pagrindinės pajėgos vakare priartėja iki Augustavo. Čaplikas puola Jestšembną, tai sustabdo lenkus ir jis gali atsitraukti į Gruškų-Liepynės liniją.

## Teiginiai

<a id="claim-t-40170"></a>
- t-001
  global_id: t-40170
  teiginys: 'J. Čaplikas puolė Jestšembną, sustabdė lenkus ir galėjo atsitraukti į Gruškų-Liepynės liniją.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lenkai|Lenkai]]; mentioned_place: Suvalkai'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 813434-813612; hash=316fa47e16ed2bd9985ee23b5af2cdc07fddbcb5d31adc65978ac5898736056e; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: keliavo_i -> Augustavas: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: J. Čaplikas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Augustavas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai rodo Čapliko pajėgų judėjimą iki Augustavo.

<a id="claim-t-40171"></a>
- t-002
  global_id: t-40171
  teiginys: 'J. Čapliko pagrindinės pajėgos vakare priartėjo prie Augustavo.'
  sudarymo_pagrindimas: 'Teiginys yra gramatiškas sakinys apie J. Čapliko pajėgų judėjimą ir atitinka citatą.'
  susije_objektai: 'mentioned_place: Augustavas; llm_object: Augustavas'
  semantiniai_rysiai: '[[objektai/asmenys/J. Čaplikas|J. Čaplikas]] keliavo į Augustavas'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=44772e6013bfb7e232ab9596739d2fb2d5c1732e2cbe446c734d438ec7c2dcee; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Lenkai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: J. Čaplikas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Lenkai: mention_match, group, gap=39
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "J. Čaplikas" parinktas kaip owner_note_path. Targetas "Lenkai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Viduriniosios kolonos 2-asis pėst. p. II bn. užima Skerskilą.
    Sutemus vidurinioji kolona pasiekia Augustavo apylinkes.
    Čapliko pagrindinės pajėgos vakare priartėja iki Augustavo.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
- c-002
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Čaplikas puola Jestšembną, tai sustabdo len-
    kus ir jis gali atsitraukti į Gruškų-Liepynės liniją.

    Rugsėjo 5 d., dar nežinant apie viduriniosios kolonos su-
    naikinimą, Škirpos ir Jakaičio vadovaujamoms pajėgos
    tęsia nevaisingą Suvalkų puolimą.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001

## Ryšiai
- J. Čaplikas keliavo_i [[objektai/vietos/Augustavas]]
