---
tipas: vieta
pavadinimas: 'Toropecas'
saltiniai:
  - 'Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)'
datos:
  - '1000 m.'
  - '1581 m.'
date_start: '1000'
date_end: '1581'
sukurta: ''
atnaujinta: ''
tags:
  - ežeras
  - pilis
  - upė
  - valdovas
amziai:
  - 'X'
  - 'XVI'
---
# Toropecas

## Santrauka

Jis turėjo žygiuoti Veližo link, iš ten pulti Toropeco ir Bialos pilių apylinkes, kai pagrindinės pajėgos įsiverš į Rusijos teritoriją šiauriau. Rugpjūčio 29 d. lietuviai susikovė su į pagalbą savo valdovui skubėjusia apie 1000 karių Toropeco įgula. Rugsėjo 9 d. jie dar kartą susirėmė su Toropeco įgula, nukovė 200 rusų šaulių.

## Teiginiai

<a id="claim-t-42189"></a>
- t-001
  global_id: t-42189
  teiginys: 'Rugsėjo 9 d. lietuviai susirėmė su Toropeco įgula ir nukovė 200 rusų šaulių.'
  sudarymo_pagrindimas: 'Teiginys yra pilnas, aiškus ir tiesiogiai paremtas citata.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Rusai|Rusai]]; mentioned_object: [[objektai/zodynas/įgula|įgula]]; mentioned_event: [[objektai/ivykiai/K. Radvilos Perkūno reidas (1581 m. liepa-spalis)|K. Radvilos Perkūno reidas (1581 m. liepa-spalis)]]; mentioned_group: [[objektai/grupes/Didžiojo Naugardo respublika|Didžiojo Naugardo respublika]]; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_group: [[objektai/grupes/Radvilos|Radvilos]]; mentioned_place: Dauguva; mentioned_place: Dubnas; mentioned_place: Volga'
  temporaliniai_duomenys: 'įvykio data: 1581 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys yra pilnas, aiškus ir tiesiogiai paremtas citata.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=ee413979e76c5037192cfda72e83db071cbea52b04b115faa6cc272157d94efe; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: surenge_zygi_i -> Veližas: 0.80
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Kristupas Radvila: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Veližas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Tekstas tiesiogiai nurodo planuotą Radvilos žygį Veližo link.

<a id="claim-t-42190"></a>
- t-002
  global_id: t-42190
  teiginys: 'Rugpjūčio 29 d. lietuviai sumušė apie 1000 karių Toropeco įgulą, skubėjusią į pagalbą savo valdovui.'
  sudarymo_pagrindimas: 'Perrašyta į aiškesnį sakinį su mūšio rezultatu.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_group: [[objektai/grupes/Rusai|Rusai]]; mentioned_person: [[objektai/asmenys/Radvila|Radvila]]; mentioned_place: Pskovas; mentioned_place: Starica'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=85e819472068b2cd812444a460e556491797197179173d1d02782fb4271ab61a; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Lietuviai: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Toropecas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Lietuviai: mention_match, group, gap=33
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Toropecas" parinktas kaip owner_note_path. Targetas "Lietuviai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-42191"></a>
- t-003
  global_id: t-42191
  teiginys: 'K. Radvilos pajėgos turėjo nuo Veližo pulti Toropeco ir Bialos pilių apylinkes.'
  susije_objektai: 'mentioned_place: Biala; mentioned_group: [[objektai/grupes/Radvilos|Radvilos]]; mentioned_person: [[objektai/asmenys/Kristupas Radvila|Kristupas Radvila]]; mentioned_place: Lietuva; mentioned_place: Rusija; mentioned_place: Smolenskas; mentioned_place: Veližas; llm_object: Veližas'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=58ae88d43892c9d99bd536837bcc4edf27b8846ec2fe04052734dacacd8bc833; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Rusai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Toropecas: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Rusai: mention_match, group, gap=29
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Toropecas" parinktas kaip owner_note_path. Targetas "Rusai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
- susijęs iš [[objektai/ivykiai/K. Radvilos Perkūno reidas (1581 m. liepa-spalis).md#claim-t-78617|Kristupo Radvilos Perkūno reidas (1581 m. liepa-spalis)]]: Radvilos pajėgos nusiaubė Rževo, Toropeco ir Staricos apylinkes, o Ivanas IV buvo priverstas evakuoti savo šeimą ir dvarą.
- susijęs iš Veližas: Pagal Stepono Batoro planą Kristupas Radvila Perkūnas turėjo saugoti pasienį su Rusija ir imituoti įsiveržimą tarp Veližo ir Smolensko.
- susijęs iš Volgos upė: Rugsėjo 4 d. lietuviai pasiekė Dauguvos ir Volgos upių vandenskyrą, kur ilsėjosi ir išsižvalgė apylinkes.
## Reikšmingi paminėjimai

- c-001
  santrauka: 'Rugsėjo 9 d. lietuviai susirėmė su Toropeco įgula ir nukovė 200 rusų šaulių.'
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Rugsėjo 4 d. lietuviai pa-
    siekė Dauguvos ir Volgos upių vandens-
    kyrą, kur ilsėjosi ir išsižvalgė
    apylinkes. Rugsėjo 9 d. jie
    dar kartą susirėmė su
    Toropeco įgula, nukovė
    200 rusų šaulių. Vėliau
    Radvilos pajėgos nusiaubė
    Dubno apylinkes, užėmė
    Cholmą, iš ten, palei
    Lovatės upę, lietuviai nusi-
    gavo iki Novgorodo kunigaikš-
    tystėje, prie Ilmenio ežero esančio

    94 K. RADVILOS PERKŪNO REIDAS 1581 m. liepa-spalis
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
    Pagal S. Batoro planą Lietuvos lauko etmo-
    nas Kristupas Radvila Perkūnas, iki pagrin-
    dinėms pajėgoms pradedant žygį į Pskovą,
    turėjo saugoti pasienį su Rusija ir imituoti
    įsiveržimą į Rusijos teritoriją tarp Veližo
    ir Smolensko ir kuo ilgiau išlaikyti įtampą
    šiame ruože. Jis turėjo žygiuoti Veližo link,
    iš ten pulti Toropeco ir Bialos pilių apy-
    linkes, kai pagrindinės pajėgos įsiverš
    į Rusijos teritoriją šiauriau. K. Radvilai
    buvo duotas leidimas, susiklosčius palan-
    kioms aplinkybėms, veržtis giliau į priešo
    teritoriją.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003
- c-003
  santrauka: 'Rugpjūčio 29 d. lietuviai sumušė apie 1000 karių Toropeco įgulą, skubėjusią į pagalbą savo valdovui.'
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Nusiaubęs Staricos apylinkes,
    Radvila pasuko į vakarus Pskovo link.
    Rugpjūčio 29 d. lietuviai susikovė su į pa-
    galbą savo valdovui skubėjusia apie 1000
    karių Toropeco įgula. Rusai buvo sumušti,
    apie 300 jų žuvo.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002