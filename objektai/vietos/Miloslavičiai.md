---
tipas: vieta
pavadinimas: 'Miloslavičiai'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - vieta
---
# Miloslavičiai

## Santrauka

Skirgaila nujojęs į Miloslavičius ten susirgo.

## Teiginiai

<a id="claim-t-187261"></a>
- t-001
  global_id: t-187261
  teiginys: 'Po puotos Skirgaila nujojo už Dnepro į Miloslavičius, ten susirgo ir, grįžęs į Kijevą, septintą dieną mirė.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Pradinis teiginys per siauras; citata remia išsamesnį vieno sakinio faktą.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Foma|Foma]]; mentioned_person: [[objektai/asmenys/Skirgaila|Skirgaila]]; mentioned_place: Dnepras'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=b0c05ade54d4d89d0d1275fb5aecbcd6bf704925d8c12c65a5a7967c4da98b6c; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Dnepras: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Miloslavičiai: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Dnepras: mention_match, place, gap=9
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Miloslavičiai" parinktas kaip owner_note_path. Targetas "Dnepras" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-187615"></a>
- t-002
  global_id: t-187615
  teiginys: 'Po puotos kunigaikštis Skirgaila nujojo už Dnepro į Miloslavičius, ten susirgo ir, grįžęs į Kijevą, septintą dieną mirė.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Teiginys yra aiškus, gramatinis ir paremtas citata.'
  susije_objektai: 'mentioned_place: Kijevas; mentioned_person: [[objektai/asmenys/Foma|Foma]]; mentioned_person: [[objektai/asmenys/Skirgaila|Skirgaila]]; mentioned_place: Dnepras'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 168877-169375; hash=b44b8447aeaabb039197247b5b96529806d8507e5ecf1f7872821bea54bb97d7; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Kijevas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Miloslavičiai: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Kijevas: mention_match, place, gap=40
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Miloslavičiai" parinktas kaip owner_note_path. Targetas "Kijevas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
- susijęs iš Kijevas: Skirgaila po puotos susirgo Miloslavičiuose ir, grįžęs į Kijevą, septintą dieną mirė.
## Reikšmingi paminėjimai

- c-001
  santrauka: 'Po puotos Skirgaila nujojo už Dnepro į Miloslavičius, ten susirgo ir, grįžęs į Kijevą, septintą dieną mirė.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Kai
    kunigaikštis Skirgaila panoro joti už Dnepro medžioti,
    tasai Foma pakvietė jį puoton į metropolito rūmus. O
    kunigaikščiui Skirgailai puotaujant, kaip kiti sako, tas
    Foma davęs kunigaikščiui Skirgailai išgerti nuodų. Ir
    po puotos kunigaikštis Skirgaila jojo už Dnepro, į Mi-
    loslavičius, ten susirgo ir, parvykęs į Kijevą, septintą
    dieną mirė ,8.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-001

- c-002
  santrauka: 'Po puotos kunigaikštis Skirgaila nujojo už Dnepro į Miloslavičius, ten susirgo ir, grįžęs į Kijevą, septintą dieną mirė.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    O
    kunigaikščiui Skirgailai puotaujant, kaip kiti sako, tas
    Foma davęs kunigaikščiui Skirgailai išgerti nuodų. Ir
    po puotos kunigaikštis Skirgaila jojo už Dnepro, į Mi-
    loslavičius, ten susirgo ir, parvykęs į Kijevą, septintą
    dieną mirė ,8. Šventikai su žvakėmis, giedodami laido­
    tuvių giesmes, nunešė jį, užsidėję ant galvų, iš Kijevo
    miesto į šventąjį dievo motinos katakombų vienuolyną,
    ir paguldė gerąjį, palaimintąjį kunigaikštį Skirgailą ša­
    lia šventojo Pečeros Teodozijaus1 9  grabo.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=b0c05ade54d4d89d0d1275fb5aecbcd6bf704925d8c12c65a5a7967c4da98b6c; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Dnepras: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Miloslavičiai: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Dnepras: mention_match, place, gap=9
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Miloslavičiai" parinktas kaip owner_note_path. Targetas "Dnepras" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 168877-169375; hash=b44b8447aeaabb039197247b5b96529806d8507e5ecf1f7872821bea54bb97d7; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Kijevas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Miloslavičiai: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Kijevas: mention_match, place, gap=40
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Miloslavičiai" parinktas kaip owner_note_path. Targetas "Kijevas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
