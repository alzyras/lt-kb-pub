---
tipas: vieta
pavadinimas: 'Dnepras'
saltiniai:
  - 'Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)'
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
  - 'Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)'
sukurta: ''
atnaujinta: ''
---
# Dnepras

## Santrauka

Kaidanas persikėlė per Dneprą, siekdamas ginklu paremti savo tikslus ir jėga priversti paklusti jo valdžiai. Lietuviams nugalėjus, daug bėgančių priešų žuvo nuo kalavijų arba prigėrė Dnepro ir Pripetės duburiuose. Netoli Dnepro atsitraukiantį Glinskį pasitiko šešiasdešimt tūkstančių maskvėnų.

## Teiginiai
<a id="claim-t-185234"></a>
- t-001
  global_id: t-185234
  teiginys: 'Kaidanas persikėlė per Dneprą, siekdamas ginklu paremti savo tikslus ir jėga priversti paklusti jo valdžiai.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Sutvarkytas ilgas sakinys ir paliktas aiškus faktas apie persikėlimą per Dneprą.'
  susije_objektai: 'llm_object: Dnepras; mentioned_person: [[objektai/asmenys/Kaidanas|Kaidanas]]; mentioned_place: Pripetė'
  semantiniai_rysiai: '[[objektai/asmenys/Kaidanas|Kaidanas]] keliavo į Dnepras'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 131540-131889; hash=e4f8757a88e93f5fd587876f740fcf7341498d16a1c50815a25a08f32cda545b; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: keliavo_i -> Dnepras: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Kaidanas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Dnepras: llm_allowed_candidate, place
  ryšio_paaiskinimas: Kaidano judėjimas per Dneprą tiesiogiai aprašytas tekste.

<a id="claim-t-185235"></a>
- t-002
  global_id: t-185235
  teiginys: 'Lietuviams nugalėjus, daug bėgančių priešų žuvo nuo kalavijų arba prigėrė Dnepro ir Pripetės duburiuose.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Pašalintas perteklinis kontekstas, paliktas citata paremtas faktas apie Dneprą.'
  susije_objektai: 'mentioned_place: Pripetė; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_object: [[objektai/daiktai/Kalavijai|Kalavijai]]'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 132582-133064; hash=489783c16e53f617813c7208d4654f2668c813150ec7d873fbc68f1654d6eadc; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Pripetė: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Dnepras: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Pripetė: mention_match, place, gap=10
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Dnepras" parinktas kaip owner_note_path. Targetas "Pripetė" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-185236"></a>
- t-003
  global_id: t-185236
  teiginys: 'Netoli Dnepro atsitraukiantį Glinskį pasitiko šešiasdešimt tūkstančių maskvėnų.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Teiginys yra pilnas faktinis sakinys su aiškiu vietos ryšiu.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Maskvėnai|Maskvėnai]]; mentioned_place: Minskas'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: 1069037-1069393; hash=a406c889170e1eadd1d43de709d985b067dc93b172dd374142e477f3571f858f; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Maskvėnai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Dnepras: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Maskvėnai: mention_match, group, gap=63
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Dnepras" parinktas kaip owner_note_path. Targetas "Maskvėnai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-187571"></a>
- t-004
  global_id: t-187571
  teiginys: 'Mindaugas pasiuntė visą savo kariuomenę už Dnepro prieš Romaną, Briansko kunigaikštį.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Teiginys yra pilnas sakinys, kuriame Dnepras susietas su Mindaugo kariuomenės žygio kryptimi. Nepridėta motyvų ar vertinimų.'
  susije_objektai: 'mentioned_place: Brianskas; mentioned_person: [[objektai/asmenys/Mindaugas|Mindaugas]]; mentioned_person: [[objektai/asmenys/Treniota|Treniota]]'
  pagrindžia:
    - c-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: 94640-94788; hash=bb75e4e290df782336538785403bb03f80cbb8e69af683858683bfc86c4a45de; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Brianskas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Dnepras: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Brianskas: mention_match, place, gap=21
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Dnepras" parinktas kaip owner_note_path. Targetas "Brianskas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-188686"></a>
- t-005
  global_id: t-188686
  teiginys: 'Narbutas Dnepro pakrantėse tarp Mogiliovo ir Rogačiovo mini daugybę milžinkapių ir juos sieja su skitais.'
  pagrindžia:
    - c-005
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
  statusas: patvirtinta
  irodymo_stiprumas: 0.00
  saltinio_vieta: 657224-657630; hash=26556589ffa330a64ab550fd47653d4142aaa0ae59d98048342565387dee70e4; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Mogiliovas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Dnepras: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Mogiliovas: mention_match, place, gap=23
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Dnepras" parinktas kaip owner_note_path. Targetas "Mogiliovas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
- susijęs iš [[objektai/grupes/Lietuviai.md#claim-t-184541|Lietuviai]]: Lietuviai išvijo priešus iš stovyklos, o daug bėgančiųjų žuvo nuo kalavijų arba prigėrė Dnepro ir Pripetės duburiuose.
- susijęs iš [[objektai/ivykiai/Dnepro perėjimas ir maskvėnų pabėgimas iš stovyklos.md#claim-t-185561|Dnepro perėjimas ir maskvėnų pabėgimas iš stovyklos]]: Keli tūkstančiai raitelių apie vidudienį perėjo Dneprą ir netikėtai užpuolė besitvirtinančių maskvėnų stovyklą.
- susijęs iš [[objektai/ivykiai/Erdvilo puolimas prieš Kaidano stovyklą prie Pripetės žiočių.md#claim-t-185566|Erdvilo puolimas prieš Kaidano stovyklą prie Pripetės žiočių]]: Lietuviai išvijo Kaidano karius iš stovyklos, daug jų nukovė mūšyje ir persekiojo bėgančius prie Dnepro bei Pripetės.
- susijęs iš [[objektai/ivykiai/Švitrigailos Vitebsko žemės užėmimas.md#claim-t-185681|Švitrigailos Vitebsko žemės užėmimas]]: Švitrigaila be didelio vargo užėmė Vitebsko miestą, dvi pilis, Oršą ir visą kraštą tarp Dnepro ir Dauguvos.
- susijęs iš Lojevas: Lojevas buvo BTSR miestas vakariniame Dnepro krante ties Sožo ir Dnepro santaka, apie 160 km į šiaurę nuo Kijevo.
- susijęs iš Mogiliovas: Narbutas tarp Mogiliovo ir Rogačiovo minimus Dnepro pakrančių kapus aiškino kaip skitų supiltus milžinkapius.
- susijęs iš Rosė: Narbutas Rosės (Ross) upę, įtekančią į Dneprą dešiniajame krante, laikė vardą gavusia iš lietuvių genties tautų.
- susijęs iš Vorksla: Vorksla apibūdinta kaip upė, tekanti pro Poltavą ir iš kairės pusės įtekanti į Dneprą apie 300 km žemiau Kijevo.
- susijęs iš [[objektai/asmenys/Daumantas.md#claim-t-184685|Daumantas (kunigaikštis, XV a.)]]: Mindaugui įsakius žygiuoti prieš Briansko kunigaikštį, Daumantas paragino Treniotą pasinaudoti kariuomene.
- susijęs iš [[objektai/asmenys/Filimeras.md#claim-t-190149|Filimeras]]: Narbutas spėjo, kad Rosės upės vardas siejosi su lietuvių genties tautomis, išėjusiomis į rytus valdant Filimerui arba kiek vėliau.
- susijęs iš [[objektai/asmenys/Jogaila.md#claim-t-184726|Jogaila (kunigaikštis, XIV–XV a.)]]: Sužinojęs apie Švitrigailos veiksmus Vitebske, Jogaila paliepė Vytautui kariauti, kol šis atsiims žemes ir sutriuškins Švitrigailą.
- susijęs iš [[objektai/asmenys/Treniota.md#claim-t-184848|Treniota]]: Treniota sutartą dieną slaptai atvedė kariuomenę iš Žemaitijos ir kartu su Daumantu naktį įsiveržė į Mindaugo rūmus.
- susijęs iš [[objektai/grupes/Gotai.md#claim-t-188191|Gotai]]: Narbutas Rosės upės vardą Kijevo gubernijoje siejo su lietuvių gentimis, kurios esą išėjo į rytus su gotais Filimero valdymo metu ar kiek vėliau.
- susijęs iš [[objektai/grupes/Lietuviai.md#claim-t-179225|Lietuviai]]: 1897 m. surašymo duomenimis, dabartinės Lietuvos ribose be Klaipėdos krašto gyveno apie 2,7 mln. žmonių.
- susijęs iš [[objektai/grupes/Lietuviai.md#claim-t-188279|Lietuviai]]: Narbutas spėjo, kad Rusos upės vardą Naugardo gubernijoje galėjo duoti variagų atgabenta lietuvių tautos kolonija.
- susijęs iš [[objektai/grupes/Prūsai.md#claim-t-188298|Prūsai]]: Narbutas spėja, kad Naugardo gubernijos Rusos, arba Russ, upės vardą galėjo duoti lietuvių tautos kolonija, siejama su prūsų kolonistais Naugarde.
- susijęs iš [[objektai/grupes/Skitai.md#claim-t-189482|Skitai]]: Narbutas Dnepro pakrančių milžinkapių pylėjus tapatina su skitais, kurie virš mirusiųjų supildavo kalnelius.
- susijęs iš [[objektai/grupes/Ukrainiečiai.md#claim-t-188356|Ukrainiečiai]]: Narbutas aiškino, kad ukrainiečių Rosės upės vardas kilo iš kadaise ten gyvenusių lietuvių genties tautų.
- susijęs iš [[objektai/ivykiai/Lojevo mūšis (1649 m. liepos 31 d.).md#claim-t-49172|Lojevo mūšis (1649 m. liepos 31 d.)]]: 1649 m. liepos 21 d. J. Radvila atvedė kariuomenę prie Lojevo, kur buvo numatyta pasitikti artėjančius kazokus.
- susijęs iš Dubrovna: Čeliadninas atitraukė jėgas už Dnepro ir apsistojo prie Kropivnos upės, tarp Oršos ir Dubrovnos.
- susijęs iš Kropivnos upė: Čeliadninas atitraukė visas jėgas už upės ir apsistojo Kropivnos upės pakrantėse tarp Oršos ir Dubrovnos.
- susijęs iš Miloslavičiai: Po puotos Skirgaila nujojo už Dnepro į Miloslavičius, ten susirgo ir, grįžęs į Kijevą, septintą dieną mirė.
- susijęs iš Miloslavičiai: Po puotos kunigaikštis Skirgaila nujojo už Dnepro į Miloslavičius, ten susirgo ir, grįžęs į Kijevą, septintą dieną mirė.
- susijęs iš Naugardas: Narbutas spėjo, kad Naugardo gubernijos Rusos, arba Russ, upės vardą galėjo duoti variagų atgabenta lietuvių kolonija.
- susijęs iš Naugardas: Senyvo amžiaus Vytautas kariavo su Pskovu ir Naugardu, siekdamas atkeršyti už Lietuvai patirtas skriaudas.
- susijęs iš Naugardas: 1427 m. Vytauto žygiai prieš Pskovą ir Naugardą baigėsi sėkmingai.
- susijęs iš Padnepris: Narbutas rašė, kad senieji Padneprio ir Pavyslio gyventojai pildavo milžinkapius.
- susijęs iš Pavyslis: Narbutas rašo, kad Pavyslio ir Padneprio senieji gyventojai pildavo milžinkapius.
- susijęs iš Pripetė: Lietuviams laimėjus mūšį, daug priešų žuvo bėgdami Dnepro ir Pripetės duburiuose.
- susijęs iš Rogačiovas: Narbutas Dnepro pakrantėse tarp Mogiliovo ir Rogačiovo mini daugybę milžinkapių, kuriuos priskiria skitams.
- susijęs iš Rosė (Ross) upė Kijevo gubernijoje: Narbutas Rosės (Ross) upės Kijevo gubernijoje vardą aiškino kaip paveldėtą iš ten kadaise gyvenusių lietuvių genties tautų.
- susijęs iš Rusa (Russ) upė Naugardo gubernijoje: Narbutas spėjo, kad Naugardo gubernijos Rusos, arba Russ, upei vardą davė variagų atgabenta lietuvių tautos kolonija.
- susijęs iš [[objektai/zodynas/duoklė.md#claim-t-185382|duoklė]]: Erdvilas atsisakė skitams mokėti duoklę, paskelbė karą ir jų kunigaikščiui įteikė dvi strėles.
- susijęs iš Lojevas: Lojevas buvo BTSR miestas vakariniame Dnepro krante ties Sožo ir Dnepro santaka, apie 160 km į šiaurę nuo Kijevo.
## Reikšmingi paminėjimai
- c-001
  santrauka: 'Kaidanas persikėlė per Dneprą, siekdamas ginklu paremti savo tikslus ir jėga priversti paklusti jo valdžiai.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Valdingai pasi-
    keliais nuvesti iki sienos. Kaidanas, pasiuntiniams per
    ilgai užsibuvus, įtarė, jog nesumani pasiuntinybė ap­
    gaudinėjama atidėliojant reikalą ir persikėlė per Dnep-
    rą, norėdamas savo siekius paremti ginklu ir jėga pri­
    versti paklusti jo valdžiai. Pripetės žiotyse įrengęs ka­
    ro stovyklą, jis išsiuntė galybę būrių krašto niokoti.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-002
  santrauka: 'Lietuviams nugalėjus, daug bėgančių priešų žuvo nuo kalavijų arba prigėrė Dnepro ir Pripetės duburiuose.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Tiesa, kai buvę toliau
    nuo pavojaus po kurio laiko atgavo drąsą, užvirė kru­
    vina kova. Galop nugalėję lietuviai išvijo barbarus iš
    stovyklos: galybė priešų krito mūšyje, kur kas dau­
    giau krito bėgančiųjų, žuvusių nuo kalavijų arba pri­
    gėrusių Dnepro ir Pripetės duburiuose. Ši pergalė buvo
    D u o k lės p ra ša n tiem s
    sk ita m s E rd vila s siu n ­
    čia  d v i strė le s
    šaukęs pasiuntinius, jis atsi­
    sakė duoklės, paskelbė karą
    ir įteikė jų kunigaikščiui do­
    vaną— dvi strėles.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
- c-003
  santrauka: 'Netoli Dnepro atsitraukiantį Glinskį pasitiko šešiasdešimt tūkstančių maskvėnų.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Glinskis, nutraukęs Minsko apgulą gal dėl sąžinės
    priekaištų, gal iš pagarbos karaliui, pirmiausia su savo
    kariais nužygiavo į Borisovą, o iš ten į Oršą, nedrįs­
    damas stoti į atvirą kovą veikiausiai dėl to, kad turė­
    jo per mažai karių. Jį atsitraukiantį atkakliai perse­
    kiojo karalius. Netoli Dnepro Glinskį pasitiko šešios
    dešimtys tūkstančių maskvėnų.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003
- c-004
  santrauka: 'Mindaugas pasiuntė visą savo kariuomenę už Dnepro prieš Romaną, Briansko kunigaikštį.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    O Treniota
    tuomet buvo Žemaičiuose.
    6771 metai1 2 . Mindaugas buvo visą savo kariuome­
    nę pasiuntęs už Dnepro prieš Romaną, Briansko kuni­
    gaikštį.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-004
- c-005
  santrauka: 'Narbutas Dnepro pakrantėse tarp Mogiliovo ir Rogačiovo mini daugybę milžinkapių ir juos sieja su skitais.'
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
  citata_originali: |
    Kad Pavyslio, Padneprio senieji gyventojai
    ir kiti pildavo milžinkapius, dar ir Šiandien kiekvieną įtikina jų
    vaizdas. Išilgai Dnepro krantų, tarp Mogiliovo ir Rogačiovo,
    esama begalės šitokių kapų; atrodo, tarytum tas kraštas būtų
    buvęs kažkokios milžiniškos tautos amžinos kapinės. Be abe­
    jo, tai buvo skitai, milžinkapių pylėjai, kurie virš savo mirusių­
    jų, neužkąsdami jų žemėje, supildavo kalnelius.
  citata_rodoma: ""
  teiginio_tipas: faktas
  patikimumo_lygis: aukstas
  patikimumo_saltinis: ai
  patikimumo_pagrindimas: ""
  pagrindžia:
    - t-005

## Ryšiai
- [[objektai/asmenys/Kaidanas]] keliavo_i Dnepras
- [[objektai/vietos/Lojevas]] priklause Dnepras
