---
tipas: grupe
pavadinimas: 'II brigada'
saltiniai:
  - 'Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - grupe
---
# II brigada

## Santrauka

Į operaciją įsitraukė ir II brigada. Il brigada pralaužia gynybą ir 28 d. priverčia bolševikus trauktis už Dauguvos.

## Teiginiai

<a id="claim-t-40890"></a>
- t-001
  global_id: t-40890
  teiginys: 'II brigada Šiaurės Rytų Lietuvoje darniai veikdama su artilerija stūmė bolševikus iš okupuotų Lietuvos teritorijų.'
  sudarymo_pagrindimas: 'Citata leidžia tiksliau nurodyti brigados veikimo būdą ir išlaikyti sakinį be OCR triukšmo.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/brigada|brigada]]; mentioned_object: [[objektai/daiktai/Artilerija|Artilerija]]; mentioned_place: Lietuva; mentioned_place: Užpaliai; llm_object: Lietuva'
  semantiniai_rysiai: '[[objektai/grupes/II brigada|II brigada]] gynė Lietuva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=a7140bfc5fc12b4affe721c1650d87bd1435a707a454ee31a4f12e44a0bcfcbf; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: gyne -> Lietuva: 0.73
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: II brigada: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Lietuva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Brigados veiksmas apibūdintas kaip bolševikų stūmimas iš okupuotų Lietuvos teritorijų.

<a id="claim-t-40891"></a>
- t-002
  global_id: t-40891
  teiginys: 'II brigada pralaužė gynybą ir 28 d. privertė bolševikus trauktis už Dauguvos.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/brigada|brigada]]; mentioned_place: Dauguva; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_place: Daugpilis'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=a9acbc84a165ed3f17a87eff2684b49c95456c087acf82ff08cbe88a77f27919; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Dauguva: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: II brigada: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Dauguva: mention_match, place, gap=68
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "II brigada" parinktas kaip owner_note_path. Targetas "Dauguva" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  santrauka: 'II brigada Šiaurės Rytų Lietuvoje darniai veikdama su artilerija stūmė bolševikus iš okupuotų Lietuvos teritorijų.'
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    1 brigadai užėmus Zarasus,
    puolimas tęsėsi toliau. Į ope-
    raciją įsitraukė ir II brigada. Ji
    Šiaurės Rytų Lietuvoje įveik-
    dama vis dar atkaklų bolševikų
    pasipriešinimą, ypač darniai

    veikdama, gerai derindama puolančiųjų
    dalių veiksmus su artilerijos parama, stūmė
    bolševikus iš vis dar okupuotų Lietuvos

    IŠKIS SUBATĖ

    I :
    Aleksandravėlė

    II brigada

    KriaunosO
    Sartų e2s
    a Avilia
    Duse 0 —W

    Antaliėp još

    Užpaliai | I brg.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-002
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Il brigada pralaužia gynybą ir 28 d. priverčia
    bolševikus trauktis už Dauguvos.

    Iki 30 d. lietuviai priartėja iki Daugpilio.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002

## Ryšiai
- II brigada gyne [[objektai/vietos/Lietuva]]
