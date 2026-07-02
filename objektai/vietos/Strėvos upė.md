---
tipas: vieta
pavadinimas: 'Strėvos upė'
saltiniai:
  - 'Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)'
datos:
  - '1348 m.'
date_start: '1348'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - mūšis
  - ordinas
  - upė
  - vieta
amziai:
  - 'XIV'
---
# Strėvos upė

## Santrauka

Atgal grįžtantį priešą prie Strėvos upės pavijo Lietuvos kariuomenė. J, kad vienu metu [suėję] prie Strėvos upės susiremia mirtiname mūšyje.

## Teiginiai

<a id="claim-t-42168"></a>
- t-001
  global_id: t-42168
  teiginys: 'Prie Strėvos upės Lietuvos kariuomenė pavijo atgal grįžtantį priešą.'
  sudarymo_pagrindimas: 'Perrašyta į sklandesnį sakinį su aiškesne sakinio sandara.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lietuvos kariuomenė|Lietuvos kariuomenė]]; mentioned_place: Lietuva; mentioned_place: Strėva; mentioned_group: [[objektai/grupes/Rusėnai|Rusėnai]]; mentioned_person: [[objektai/asmenys/Algirdas|Algirdas]]; mentioned_person: [[objektai/asmenys/Kęstutis|Kęstutis]]; mentioned_place: Polockas; mentioned_place: Trakai; llm_object: Strėvos upė'
  semantiniai_rysiai: '[[objektai/grupes/Lietuvos kariuomenė|Lietuvos kariuomenė]] keliavo į Strėvos upė'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=1f86f14a796c54601ccb61714b762eb33ce183d06ca64f81c39b22a94d353c37; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: keliavo_i -> Strėvos upė: 0.64
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Lietuvos kariuomenė: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Strėvos upė: llm_allowed_candidate, place
  ryšio_paaiskinimas: Tekstas tiesiogiai nurodo Lietuvos kariuomenės veiksmą prie Strėvos upės, nors tai nėra kelionės tikslas siaurąja prasme.

<a id="claim-t-42169"></a>
- t-002
  global_id: t-42169
  teiginys: 'Prie Strėvos upės susirėmė stabmeldžių ir krikščionių pajėgos.'
  susije_objektai: 'mentioned_object: [[objektai/zodynas/stabmeldžiai|stabmeldžiai]]; mentioned_place: Strėva; mentioned_group: [[objektai/grupes/Rusai|Rusai]]; mentioned_object: [[objektai/daiktai/Lankai|Lankai]]; mentioned_object: [[objektai/daiktai/Žirgai|Žirgai]]; mentioned_place: Semba; mentioned_place: Smolenskas'
  temporaliniai_duomenys: 'įvykio data: 1348 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=605723e3d898fea703e0295d451cf5c00979983480841bd9c52821add869b342; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Strėva: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Strėvos upė: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Strėva: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Strėvos upė" parinktas kaip owner_note_path. Targetas "Strėva" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Prie Strėvos upės Lietuvos kariuomenė pavijo atgal grįžtantį priešą.'
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Niokotos galbūt plačiosios
    Semeliškių, Aukštadvario, artimesnės Trakų
    ir kt. apylinkės. Atgal grįžtantį priešą prie
    Strėvos upės pavijo Lietuvos kariuomenė.

    Lietuvos pajėgos

    Pagrindinių Lietuvos žemių, Algirdo ir
    Kęstučio jėgos bei rytinių Lietuvos valdų,
    rusėnų Vladimiro (Voluinės), Brastos,
    Vitebsko, Smolensko, Polocko daliniai, su-
    telkti greičiausiai anksčiau suplanuotam
    Ordino puolimui.
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
    O [lietuvių] karalius sušaukė didelę kariuomenę, kurioje dalyvauti
    buvo pašaukti rusai iš Vladimiro, iš Brastos, iš Vitebsko, iš Smolensko ir Polocko, ir t. t.
    Jie vejasi grįžtantį maršalą. Ir atsitiko Marijos Įvesdinimo dieną [1348 m. vasario 2 d.
    J, kad vienu metu [suėję] prie Strėvos upės susiremia mirtiname mūšyje. Stabmeldžiai
    mėtė į krikščionis savo ietis, rusai iš lankų ir t.t. daug vyrų ir žirgų strėlėmis sužeidė ir
    t. t. O [Ordino] broliai priešinasi jiems vyriškai, ir daugeliui buvo atimta gyvybė, būtent
    Gdansko komtūrui ir tokiam Sembos vyskupo teisėjui Jonui Lonei, su kuriuo prie vėlia-
    vos penkios dešimtys nukauta.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002

## Ryšiai
- [[objektai/grupes/Lietuvos kariuomenė]] keliavo_i Strėvos upė
