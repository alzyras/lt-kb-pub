---
tipas: vieta
pavadinimas: 'Kelnas'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
datos:
  - '1280 m.'
  - '1300 m.'
date_start: '1280'
date_end: '1300'
amziai:
  - 'XIII'
sukurta: ''
atnaujinta: ''
tags:
  - miestas
  - vieta
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
# Kelnas

## Santrauka

Dusburgietis teigia, kad atsisakęs Regensburgo vyskupystės, jis 18 metų triūsė Kelno mieste ir mirė, sulaukęs savo amžiaus 80-ųjų metų, 1280 viešpaties metais, o palaidotas Kelne. Dusburgietis teigia, kad apie Alberto Didžiojo mirtį Tais pačiais metais Kelne mirė Albertas Didysis (Ptol. Dusburgietis teigia, kad apie mūšį netoli Kelno, prie Vurungeno kaimo Tuo metu netoli Kelno, prie Vurungeno kaimo, kilo mūšis, kuriame Jonas, Brabanto kunigaikštis, nugalėjo Zigfridą iš Runkelės, Kelno arkivyskupą; neskaitant paprastų karių, abi šalys neteko nukautaisiais 1300.

## Teiginiai

<a id="claim-t-58448"></a>
- t-001
  global_id: t-58448
  teiginys: "Albertas Didysis mirė Kelne."
  atnaujinta: "2026-07-12 22:31"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "mire -> Kelnas: 0.97"
  ryšio_patikimumo_lygis: "aukstas"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Albertas Didysis (pamokslininkų ordino kunigas, XIII a.): llm_allowed_candidate, person"
  ryšio_targeto_parinkimas: "Kelnas: llm_allowed_candidate, place"
  ryšio_paaiskinimas: "Teiginys tiesiogiai nurodo Alberto Didžiojo mirties vietą."
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  semantiniai_rysiai: "Albertas Didysis (pamokslininkų ordino kunigas, XIII a.) mirė Kelnas (0.97)"
  pagrindžia:
    - c-59082

<a id="claim-t-58449"></a>
- t-002
  global_id: t-58449
  teiginys: "Netoli Kelno, prie Vurungeno kaimo, Brabanto kunigaikštis Jonas nugalėjo Kelno arkivyskupą Zigfridą iš Runkelės."
  atnaujinta: "2026-07-12 22:31"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "susije_su -> Kaimas: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Kelnas: owner_note_path, place, gap=0"
  ryšio_targeto_parinkimas: "Kaimas: mention_match, place, gap=22"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Kelnas\" parinktas kaip owner_note_path. Targetas \"Kaimas\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  pagrindžia:
    - c-59081

<a id="claim-t-58450"></a>
- t-003
  global_id: t-58450
  teiginys: "Albertas Didysis 18 metų triūsė Kelne, mirė 1280 m., sulaukęs 80 metų, ir buvo palaidotas Kelne."
  atnaujinta: "2026-07-12 22:31"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "buvo_palaidotas -> Kelnas: 0.96"
  ryšio_patikimumo_lygis: "aukstas"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Albertas Didysis (pamokslininkų ordino kunigas, XIII a.): llm_allowed_candidate, person"
  ryšio_targeto_parinkimas: "Kelnas: llm_allowed_candidate, place"
  ryšio_paaiskinimas: "Citatoje tiesiogiai nurodyta, kad Albertas Didysis palaidotas Kelne."
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  semantiniai_rysiai: "Albertas Didysis (pamokslininkų ordino kunigas, XIII a.) buvo palaidotas Kelnas (0.96); Albertas Didysis (pamokslininkų ordino kunigas, XIII a.) gimė Vokietija (0.91); Albertas Didysis (pamokslininkų ordino kunigas, XIII a.) mirė Kelnas (0.90)"
  temporaliniai_duomenys: "mirties data: 1280 m."
  temporalinis_paaiskinimas: "Ši data taikoma teiginyje minimai reikšmei „mirties data“, o ne visam objekto laikotarpiui."
  temporalinis_llm_pakomentavimas: "Teiginys yra pilnas faktinis sakinys apie Kelne vykusius Alberto Didžiojo gyvenimo faktus."
  pagrindžia:
    - c-59080

<a id="claim-t-194532"></a>
- t-006
  global_id: t-194532
  teiginys: "Apie Alberto Didžiojo mirtį Tais pačiais metais Kelne mirė Albertas Didysis (Ptol."
  atnaujinta: "2026-07-12 22:31"
  sprendimo_priezastis: "auto"
  teiginio_tipas: "faktas"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  pagrindžia:
    - c-59082
- susijęs iš [[objektai/asmenys/Albertas Didysis.md#claim-t-56970|Albertas Didysis (pamokslininkų ordino kunigas, XIII a.)]]: Albertas Didysis atsisakė Regensburgo vyskupystės, 18 metų triūsė Kelne ir mirė 1280 m., sulaukęs 80 metų.
- susijęs iš [[objektai/asmenys/Albertas Didysis.md#claim-t-56970|Albertas Didysis (pamokslininkų ordino kunigas, XIII a.)]]: Albertas Didysis atsisakė Regensburgo vyskupystės, 18 metų triūsė Kelne ir mirė 1280 m., sulaukęs 80 metų.
- susijęs iš [[objektai/ivykiai/Mūšis prie Vurungeno kaimo.md#claim-t-62407|Mūšis prie Vurungeno kaimo (mūšis, XIII a.)]]: Mūšyje prie Vurungeno kaimo Jonas, Brabanto kunigaikštis, nugalėjo Kelno arkivyskupą Zigfridą iš Runkelės.
- susijęs iš [[objektai/asmenys/Albertas Didysis.md#claim-t-184043|Albertas Didysis (pamokslininkų ordino kunigas, XIII a.)]]: Albertas Didysis buvo Vokietijoje gimęs pamokslininkų ordino kunigas, garsėjęs neprilygstamu išsilavinimu.
- susijęs iš [[objektai/asmenys/Albertas Didysis.md#claim-t-56968|Albertas Didysis (pamokslininkų ordino kunigas, XIII a.)]]: Albertas Didysis buvo Vokietijoje gimęs pamokslininkų ordino kunigas, garsėjęs neprilygstamu išsilavinimu.
- susijęs iš [[objektai/asmenys/Albertas Didysis.md#claim-t-56969|Albertas Didysis (pamokslininkų ordino kunigas, XIII a.)]]: Albertas Didysis buvo Vokietijoje gimęs pamokslininkų ordino kunigas, garsėjęs neprilygstamu išsilavinimu.
- susijęs iš [[objektai/asmenys/Jonas (Brabanto kunigaikštis).md#claim-t-60340|Jonas (Brabanto kunigaikštis)]]: Netoli Kelno, prie Vurungeno kaimo, Jonas, Brabanto kunigaikštis, mūšyje nugalėjo Kelno arkivyskupą Zigfridą iš Runkelės.
- susijęs iš [[objektai/asmenys/Tomas Akvinietis.md#claim-t-184134|Tomas Akvinietis]]: Tomas Akvinietis buvo Alberto mokinys, pamokslininkų ordino vienuolis ir vėliau popiežiaus Jono XXII kanonizuotas.
- susijęs iš [[objektai/asmenys/Zigfridas iš Runkelės.md#claim-t-60474|Zigfridas iš Runkelės (arkivyskupas, XIII a.)]]: Mūšyje netoli Kelno, prie Vurungeno kaimo, Brabanto kunigaikštis Jonas nugalėjo Kelno arkivyskupą Zigfridą iš Runkelės.
- susijęs iš [[objektai/grupes/Livonijos ordinas.md#claim-t-179377|Livonijos ordinas]]: 1323 m. spalio 2 d. Lietuva Vilniuje sudarė taikos sutartį su Livonijos vyskupais, Livonijos ordinu, Ryga ir Revelio danų vietininku.
- susijęs iš [[objektai/paprociai/Lietuvos diplomatinių sąjungų ir sutarčių telkimas prieš Ordiną.md#claim-t-62692|Lietuvos diplomatinių sąjungų ir sutarčių telkimas prieš Ordiną]]: Gedimino pareiškimai ir laiškai padėjo Lietuvos valstybei kuriam laikui izoliuoti ir sukompromituoti Kryžiuočių ordiną Europoje.
- susijęs iš [[objektai/posakiai/kiekvienam geros valios žmogui.md#claim-t-59115|kiekvienam geros valios žmogui]]: Gedimino laiškai Europos miestams, ordinams ir „kiekvienam geros valios žmogui“ turėjo platų tarptautinį atgarsį.
- susijęs iš Livonija: 1323 m. spalio 2 d. Lietuva Vilniuje sudarė taikos sutartį su Livonijos vyskupais, Livonijos ordinu, Ryga ir Revelio žemės danų vietininku.
- susijęs iš Ryga: 1323 m. spalio 2 d. Lietuva Vilniuje sudarė taikos sutartį su Livonijos vyskupais, Revelio žemės danų vietininku, Livonijos ordinu ir Ryga.
- susijęs iš Ryga: Po kautynių, kuriose žuvo 9 000 švedų, Ryga buvo išgelbėta.
- susijęs iš [[objektai/asmenys/Albertas Didysis.md#claim-t-56970|Albertas Didysis (pamokslininkų ordino kunigas, XIII a.)]]: Albertas Didysis atsisakė Regensburgo vyskupystės, 18 metų triūsė Kelne ir mirė 1280 m., sulaukęs 80 metų.
## Reikšmingi paminėjimai
- c-003
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie Alberto Didžiojo mirtį

       Tais pačiais metais Kelne mirė Albertas Didysis (Ptol. 22, 19).

                    67.
  citata_rodoma: ''
  statusas: verified
  teiginio_tipas: saltinio_teiginys
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
    - t-004
    - t-006

## Citatos

- id: c-59080
  autorius: "Petras Dusburgietis"
  šaltinis: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)"
  indeksas: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)."
  citata_originali: |
    Apie Albertą Didįjį ir Tomą Akvinietį

      Tuo metu gyveno Albertas Didysis, Vokietijoje gimęs pamokslininkų ordino kunigas,
    kuris neturėjo sau lygaus išsilavinimu. Atsisakęs Regensburgo vyskupystės,  jis 18
    metų triūsė Kelno mieste ir mirė, sulaukęs savo amžiaus 80-ųjų metų, 1280 viešpaties
    metais, o palaidotas Kelne. Tuo pat metu garsėjo ir brolis Tomas Akvinietis, Alberto
    mokinys bei pamokslininkų ordino vienuolis (Ptol.
  statusas: verified
  atnaujinta: "2026-07-12 22:31"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-58450

- id: c-59081
  autorius: "Petras Dusburgietis"
  šaltinis: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)"
  indeksas: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)."
  citata_originali: |
    76. Apie mūšį netoli Kelno, prie Vurungeno kaimo

      Tuo metu netoli Kelno, prie Vurungeno kaimo, kilo mūšis, kuriame Jonas, Brabanto
    kunigaikštis, nugalėjo Zigfridą  iš Runkelės, Kelno arkivyskupą; neskaitant paprastų
    karių, abi šalys neteko nukautaisiais 1300 kilmingųjų.



                             77.
  statusas: verified
  atnaujinta: "2026-07-12 22:31"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-58449

- id: c-59082
  autorius: "Petras Dusburgietis"
  šaltinis: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)"
  indeksas: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)."
  citata_originali: |
    Sis, atkeliavęs į šventąjį miestą, pamatė, jog nedorėliai
    nepagarbiai elgiasi šventose vietose, jog godotinas vyras Simeonas, miesto patriarchas,
    kartu su savo valdiniais nelyginant niekingas vergas, puolęs į visišką neviltį, kenčia
    begalinę priespaudą; būdamas doras žmogus, didžiai užjausdamas kitus ir iš visos širdies
    mylėdamas prispaustuosius, jis smarkiai nuliūdo ir apgraudo, vienas pats nerimastingai
    svarstydamas, ar negalėtų vienaip ar kitaip pagelbėti prislėgtiesiems. Kai vieną naktį
    jis meldėsi dievui bažnyčioje per viešpaties prisikėlimo šventę ir, nuo ilgo budėjimo
    pavargęs, snūstelėjo ant bažnyčios grindų, sapne jam pasirodė mūsų viešpats Jėzus
    Kristus, įpareigodamas keliauti pas jo šventenybę popiežių bei pas Vakarų valdovus
    dėl šventosios žemės išvadavimo. Padrąsintas dieviškojo apreiškimo ir užsidegęs
  citata_rodoma: "Apie Alberto Didžiojo mirtį\n\n   Tais pačiais metais Kelne mirė Albertas Didysis (Ptol. 22, 19).\n\n\n\n                67."
  statusas: verified
  atnaujinta: "2026-07-12 22:31"
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-58448
    - t-194532

- id: c-167547
  autorius: "Petras Dusburgietis"
  šaltinis: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)"
  indeksas: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)."
  citata_originali: |
    Tą dieną, kai priimamas dievo kūnas, šio kaimo klebonas jai davė nešventintą
    paplotėlį, tačiau  ji niekaip jo negalėjo nuryti, todėl,  jį atsiėmęs, davė jai pašventintą
    ostiją, kurią tuoj pat prarijo, o jis iš to suprato, jog ji medžiagiško maisto nieku būdu
    negalinti priimti.



                     76. Apie mūšį netoli Kelno, prie Vurungeno kaimo

      Tuo metu netoli Kelno, prie Vurungeno kaimo, kilo mūšis, kuriame Jonas, Brabanto
    kunigaikštis, nugalėjo Zigfridą  iš Runkelės, Kelno arkivyskupą; neskaitant paprastų
    karių, abi šalys neteko nukautaisiais 1300 kilmingųjų.
  statusas: verified
  atnaujinta: "2026-07-12 22:31"

  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai

## Ryšiai
- Mirties vieta: [[objektai/asmenys/Albertas Didysis|Albertas Didysis (pamokslininkų ordino kunigas, XIII a.)]]
- Turėjo palaidotą asmenį: [[objektai/asmenys/Albertas Didysis|Albertas Didysis (pamokslininkų ordino kunigas, XIII a.)]]
