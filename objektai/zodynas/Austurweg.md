---
tipas: zodyno_irasas
pavadinimas: 'Austurweg'
saltiniai:
  - 'Michał Baliński, Vilniaus miesto istorija (2007 m.)'
sukurta: ''
atnaujinta: ''
---
# Austurweg

## Santrauka

`Austurweg` pateikiamas kaip normanų vartotas Baltijos jūros pakrantės ruožo vardas. Jis taikomas pakrantei nuo Vyslos žiočių iki Suomijos įlankos.

## Žodis ir formos

- pagrindinė forma: Austurweg
- šaltinyje vizualiai perskirta forma: A ust u rweg

## Reikšmė iš konteksto

Kontekste tai normanų piratų vartotas geografinis pavadinimas rytiniam Baltijos pakrantės keliui ar ruožui.

## Vartojimas

Vartojama normanų žygių Baltijos regione aptarime.

## Teiginiai

<a id="claim-t-54799"></a>
- t-001
  global_id: t-54799
  teiginys: 'Austurweg pavadinimas buvo taikomas Baltijos jūros pakrantei nuo Vyslos žiočių iki Suomijos įlankos.'
  sudarymo_pagrindimas: 'Manual fix after rewrite gate.'
  susije_objektai: 'mentioned_place: Baltija; mentioned_place: Suomija; mentioned_place: Vysla; mentioned_group: [[objektai/grupes/Normanai|Normanai]]; mentioned_group: [[objektai/grupes/Skandinavai|Skandinavai]]; mentioned_place: Europa'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 53544-54207; hash=47fd04fcc0a9f8c7ced3c4edf43edd530ea4547be9699d585ebc24da1af5d4ff; match=whitespace_regex
  sprendimo_priezastis: gap::vocabulary
  ryšio_patikimumas: keliavo_i -> Baltija: 0.67
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Normanai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Baltija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata sako, kad normanų piratai lankė Baltijos pakrantės kraštą, todėl galima fiksuoti jų keliavimą į Baltijos erdvę.

<a id="claim-t-54800"></a>
- t-002
  global_id: t-54800
  teiginys: 'Austurweg buvo normanų vartotas Baltijos jūros pakrantės nuo Vyslos žiočių iki Suomijos įlankos pavadinimas.'
  sudarymo_pagrindimas: 'Reikia pašalinti boilerplate formuluotę ir aiškiau pateikti faktą.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Normanai|Normanai]]; mentioned_place: Baltija; mentioned_place: Suomija; mentioned_place: Vysla; mentioned_group: [[objektai/grupes/Skandinavai|Skandinavai]]; mentioned_place: Europa; llm_object: Baltija'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 53544-54207; hash=47fd04fcc0a9f8c7ced3c4edf43edd530ea4547be9699d585ebc24da1af5d4ff; match=whitespace_regex
  sprendimo_priezastis: gap::vocabulary
  ryšio_patikimumas: susije_su -> Baltija: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Austurweg: owner_note_path, thing, gap=0
  ryšio_targeto_parinkimas: Baltija: mention_match, place, gap=36
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Austurweg" parinktas kaip owner_note_path. Targetas "Baltija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Kraštas, lankytas normanų piratų iš
    Švedijos, Norvegijos ir Danijos, už­
    ėmė visą Baltijos jūros pakrantę nuo
    Vyslos žiočių iki pat Suomijos įlan­
    kos ir buvo jų vadinamas A ust u rweg.
    Atšiaurus klimatas, nenaši, uolėta
    žemė, pagaliau tvarkos stoka ir tar­
    pusavio nesantaika atgrasaus barba­
    riškumo laikais vertė skandinavus
    traukti į tas jūros keliones, o kartais
    į didesnes išvykas, į kitą Baltijos pu­
    sę. Nors jau V amžiaus pabaigoje,
    tuoj po Romos valstybės žlugimo,
    Europos Šiaurės kraštai kentėjo nuo
    normanų puldinėjimų, bet jie nebu­
    vo tokie reikšmingi ir grėsmingi,
    kaip prasidėjusieji sulig didelės Ka­
    rolio Didžiojo monarchijos žlugimu.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
    - t-001