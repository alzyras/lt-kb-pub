---
tipas: grupe
pavadinimas: 'Kazokai'
saltiniai:
  - 'Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)'
  - 'Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)'
datos:
  - '1621 m.'
  - '1893 m.'
  - '1906 m.'
  - '2026 m.'
date_start: '1621'
date_end: '2026'
sukurta: ''
atnaujinta: ''
tags:
  - grupe
  - miestas
amziai:
  - 'XVII'
  - 'XXI'
---
# Kazokai

## Santrauka

1893 m. po visą Europą nuskambėjo Kražių įvykiai – raiti kazokai šturmavo Kražių bažnyčią, kurią nuo uždarymo gynė susirinkę miestelio gyventojai. Tačiau, slūgstant revoliucijos bangai, caro valdžia 1906 m. pavasarį kazokų ir kariuomenės pastangomis savo kiek pakoreguotą tvarką atkūrė.

## Teiginiai

<a id="claim-t-65304"></a>
- t-001
  global_id: t-65304
  teiginys: 'Kazokai vijosi bėgantį priešą, įsiveržė į turkų artilerijos baterijų pozicijas, išžudė jų tarnybas ir sugadino pabūklus.'
  sudarymo_pagrindimas: 'Sakinys sutrumpintas ir pašalintas neaiškus pradinis kontekstas.'
  susije_objektai: 'mentioned_object: [[objektai/daiktai/Artilerija|Artilerija]]; mentioned_object: [[objektai/daiktai/Vytis|Vytis]]'
  pagrindžia:
    - c-006
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=e2c4b8462b12c859d34f828c5a6513e25ff1d98e81bef0937e19bec78e58efca; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Kražiai: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Kazokai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Kražiai: llm_allowed_candidate, place
  ryšio_paaiskinimas: Teiginys tiesiogiai sako, kad kazokai šturmavo Kražių bažnyčią.

<a id="claim-t-65305"></a>
- t-002
  global_id: t-65305
  teiginys: 'Lietuvos totoriai ir kazokai buvo vertinami dėl manevringumo persekiojant bėgantį priešą.'
  sudarymo_pagrindimas: 'Originalas buvo fragmentiškas sąrašo elementas, todėl performuluotas į pilną sakinį.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lietuvos totoriai|Lietuvos totoriai]]; mentioned_group: [[objektai/grupes/Totoriai|Totoriai]]; mentioned_group: [[objektai/grupes/Švedai|Švedai]]; mentioned_place: Dauguva; mentioned_place: Lietuva; llm_object: [[objektai/grupes/Švedai|Švedai]]'
  semantiniai_rysiai: '[[objektai/grupes/Kazokai|Kazokai]] puolė [[objektai/grupes/Švedai|Švedai]]'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=f4b4952b488c9dbbfbdc2170d00b222346bcb0e1d50ea62af6e26fef7f26ae42; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Kaimas: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Kazokai: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Kaimas: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Kazokai" parinktas kaip owner_note_path. Targetas "Kaimas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-65306"></a>
- t-003
  global_id: t-65306
  teiginys: 'Ukrainos kazokų stovyklą pirmiausia atakavo janičarai, o po jų puolė turkų kavalerija.'
  sudarymo_pagrindimas: 'Perrašyta glaudžiau ir pašalinta perteklinė skliaustinė detalė.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Janičarai|Janičarai]]; llm_object: [[objektai/grupes/Kazokai|Kazokai]]; mentioned_object: [[objektai/zodynas/etmonas|etmonas]]; mentioned_place: Ukraina'
  semantiniai_rysiai: '[[objektai/grupes/Janičarai|Janičarai]] puolė [[objektai/grupes/Kazokai|Kazokai]]'
  pagrindžia:
    - c-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=eed62762cb00045bb04c59ce4a871e775c62cb960f0227fa351c587183a37afd; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Švedai: 0.52
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Lietuvos totoriai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Švedai: llm_allowed_candidate, group
  ryšio_paaiskinimas: Lietuvos totoriai minimi tame pačiame sparne, kurio uždavinys buvo nublokšti švedus.

<a id="claim-t-65307"></a>
- t-004
  global_id: t-65307
  teiginys: '1906 m. pavasarį caro valdžia kazokų ir kariuomenės pastangomis atkūrė savo kiek pakoreguotą tvarką.'
  sudarymo_pagrindimas: 'Teiginys aiškiai nusako caro valdžios veiksmą pasitelkiant kazokus ir kariuomenę.'
  susije_objektai: 'mentioned_place: Kaimas; mentioned_place: Lietuva'
  temporaliniai_duomenys: 'įvykio data: 1906 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys aiškiai nusako caro valdžios veiksmą pasitelkiant kazokus ir kariuomenę.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9e1f5b56b0936af7dfd89ac4008d05b8b279059da4b3b0e759489d2d2d44b8d2; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Kazokai: 0.84
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Janičarai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Kazokai: llm_allowed_candidate, group
  ryšio_paaiskinimas: Citata tiesiogiai sako, kad janičarai atakavo Ukrainos kazokų stovyklą.

<a id="claim-t-65308"></a>
- t-005
  global_id: t-65308
  teiginys: '1893 m. po visą Europą nuskambėjo Kražių įvykiai – raiti kazokai šturmavo Kražių bažnyčią, kurią nuo uždarymo gynė susirinkę miestelio gyventojai.'
  sudarymo_pagrindimas: 'Teiginys yra pilnas faktinis sakinys apie kazokų veiksmus Kražiuose.'
  susije_objektai: 'llm_object: Kražiai; llm_object: [[objektai/ivykiai/Kražių įvykiai|Kražių įvykiai]]; mentioned_event: [[objektai/ivykiai/Kražių įvykiai|Kražių įvykiai]]; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_object: [[objektai/posakiai/„Kražių skerdynėmis“|„Kražių skerdynėmis“]]; mentioned_place: Europa; mentioned_place: Kražiai'
  semantiniai_rysiai: '[[objektai/grupes/Kazokai|Kazokai]] puolė Kražiai; [[objektai/grupes/Kazokai|Kazokai]] dalyvavo mūšyje [[objektai/ivykiai/Kražių įvykiai|Kražių įvykiai]]'
  temporaliniai_duomenys: 'įvykio data: 1893 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys yra pilnas faktinis sakinys apie kazokų veiksmus Kražiuose.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 470657-471353; hash=2ddf7b1cea85edcb194188ea2878ae1b5ce686b7bf30bfec86cf72c50ad5dca4; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> husarai: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Kazokai: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: husarai: mention_match, thing, gap=61
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Kazokai" parinktas kaip owner_note_path. Targetas "husarai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-65309"></a>
- t-006
  global_id: t-65309
  teiginys: 'Kazokai buvo lengvoji raitija, kurios paskirtis buvo paremti husarus mūšyje ir naikinti jų sumuštus eskadronus.'
  sudarymo_pagrindimas: 'Citata tiesiogiai apibūdina kazokų rūšį ir karinę paskirtį.'
  susije_objektai: 'mentioned_object: [[objektai/zodynas/husarai|husarai]]; mentioned_group: [[objektai/grupes/Bajorai|Bajorai]]; mentioned_object: [[objektai/daiktai/Ginklai|Ginklai]]; mentioned_object: [[objektai/daiktai/Strėlės|Strėlės]]'
  temporaliniai_duomenys: 'įvykio data: 1621 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Citata tiesiogiai apibūdina kazokų rūšį ir karinę paskirtį.'
  pagrindžia:
    - c-005
  irodymo_stiprumas: 0.00
  saltinio_vieta: 472143-472406; hash=cca16cb29e90de828da53ccee48cd015ea392da603884db16ee175947f7874fb; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Artilerija: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Kazokai: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Artilerija: mention_match, thing, gap=48
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Kazokai" parinktas kaip owner_note_path. Targetas "Artilerija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
- susijęs iš Vilnius: 1655 m. liepą rusai ir jų sąjungininkai kazokai, sumušę lietuvius prie Ašmenos, priartėjo prie Vilniaus.
- susijęs iš Ašmena: 1655 m. liepą rusai ir jų sąjungininkai kazokai sumušė lietuvius prie Ašmenos ir priartėjo prie Vilniaus.
- susijęs iš Ašmena: 1655 m. liepą rusai ir jų sąjungininkai kazokai sumušė lietuvius prie Ašmenos ir priartėjo prie Vilniaus.
- susijęs iš Ašmena: 1655 m. liepą rusai ir jų sąjungininkai kazokai sumušė lietuvius prie Ašmenos ir priartėjo prie Vilniaus.
- susijęs iš [[objektai/grupes/Janičarai.md#claim-t-40893|Janičarai]]: Pirmiausiai janičarai (turkų pėstininkai), o po to ir turkų kavalerija atakavo atskirai įsikūrusių Ukrainos kazokų stovyklą.
- susijęs iš [[objektai/ivykiai/Rusijos ir Lenkijos-Lietuvos karas (1654–1667 m.).md#claim-t-41353|Rusijos ir Lenkijos-Lietuvos karas (1654–1667 m.)]]: 1654 m. Rusija pasiuntė gausią kariuomenę į Lietuvą.
- susijęs iš Vilnius: 1655 m. liepą rusai ir jų sąjungininkai kazokai, sumušę lietuvius prie Ašmenos, priartėjo prie Vilniaus.
- susijęs iš Salaspilio mūšis: Apie 1619 m. Pieterio Snayerso paveiksle „Salaspilio mūšis“ Lietuvos husarai vaizduojami naikinantys švedų pėstininkų batalioną.
- susijęs iš [[objektai/asmenys/Antoine Gramont.md#claim-t-40035|Antoine Gramont]]: Prancūzijos grafas Antoine Gramont 1663-1664 m. pasakojo apie kazokus, tarnavusius Lenkijos-Lietuvos kariuomenėse.
- susijęs iš [[objektai/asmenys/Fulvio Ruggieri.md#claim-t-78983|Fulvio Ruggieri]]: Fulvio Ruggieri 1572 m. aprašė kazokų ginkluotę ir kariavimo būdą.
- susijęs iš [[objektai/asmenys/Leontijus Bennigsenas.md#claim-t-40305|Leontijus Bennigsenas]]: Gen. mjr. Leontijus Bennigsenas trimis kavalerijos pulkais ir kazokų pulko parama atakavo M. Frankovskio vadovaujamus lietuvių įtvirtinimus.
- susijęs iš [[objektai/asmenys/Merlinas.md#claim-t-39605|Merlinas]]: Mjr. Merlinas buvo pasiųstas per Viešintas Šimonių link su pusantros kuopos pėstininkų ir 70 kazokų.
- susijęs iš [[objektai/asmenys/Petro Sahaidačnij.md#claim-t-40394|Petro Sahaidačnij]]: Petro Sahaidačnij vadovavo apie 25 tūkst. Ukrainos kazokų, prisijungusių prie J. K. Chodkevičiaus pajėgų.
- susijęs iš [[objektai/asmenys/Piotr Kunasowicz Sahaidaczny.md#claim-t-190198|Piotr Kunasowicz Sahaidaczny]]: Narbutas Piotrą Kunasowiczių Sahaidaczny mini kaip kazokų atamaną, kurio tėvas turėjo ukrainiečių slavų krikšto vardą Kūnas.
- susijęs iš [[objektai/grupes/Dono kazokų pulkas.md#claim-t-78166|Dono kazokų pulkas]]: 1794 m. balandžio 23 d. lietuviams puolant Vilnių, Dono kazokų pulkas buvo rusų įgulos dalis.
- susijęs iš [[objektai/grupes/Dono kazokų pulkas.md#claim-t-78167|Dono kazokų pulkas]]: 1794 m. balandžio 23 d. lietuviams puolant Vilnių, Dono kazokų pulkas buvo rusų įgulos dalis.
- susijęs iš [[objektai/grupes/Janičarai.md#claim-t-40893|Janičarai]]: Pirmiausiai janičarai (turkų pėstininkai), o po to ir turkų kavalerija atakavo atskirai įsikūrusių Ukrainos kazokų stovyklą.
- susijęs iš [[objektai/grupes/Leibgvardijos kazokų pulkas.md#claim-t-183658|Leibgvardijos kazokų pulkas]]: Leibgvardijos kazokų pulkas sudarė kautynėms paruoštos Rusijos kariuomenės pagrindo dalį.
- susijęs iš [[objektai/grupes/Leibgvardijos kazokų pulkas.md#claim-t-40982|Leibgvardijos kazokų pulkas]]: Leibgvardijos kazokų pulkas buvo įtrauktas į kautynėms paruoštos Rusijos kariuomenės pagrindą.
- susijęs iš [[objektai/ivykiai/Bogdano Chmelnickio vadovaujamas Ukrainos kazokų sukilimas (1648–1651 m.).md#claim-t-39099|Bogdano Chmelnickio vadovaujamas Ukrainos kazokų sukilimas (1648–1651 m.)]]: 1648 m. vasarą sukilę kazokai veržėsi į LDK pietrytines sritis ir siautėjo Pinsko, Starodubo bei Mozyriaus apylinkėse.
- susijęs iš [[objektai/ivykiai/Bogdano Chmelnickio vadovaujamas Ukrainos kazokų sukilimas (1648–1651 m.).md#claim-t-39100|Bogdano Chmelnickio vadovaujamas Ukrainos kazokų sukilimas (1648–1651 m.)]]: Prie Lojevo priartėjusios Kijevo, Černobylio ir Ovručo kazokų pajėgos buvo triskart gausesnės už LDK kariuomenę.
- susijęs iš [[objektai/ivykiai/Lietuvos Brastos mūšis (1792 m. liepos 23 d.).md#claim-t-66686|Lietuvos Brastos mūšis (1792 m. liepos 23 d.)]]: Lietuvos Brastos mūšis prasidėjo 1792 m. liepos 23 d. auštant, kai prie lietuvių pozicijų priartėjo rusų kazokų priešakiniai daliniai.
- susijęs iš [[objektai/ivykiai/Lojevo mūšis (1649 m. liepos 31 d.).md#claim-t-49172|Lojevo mūšis (1649 m. liepos 31 d.)]]: 1649 m. liepos 21 d. J. Radvila atvedė kariuomenę prie Lojevo, kur buvo numatyta pasitikti artėjančius kazokus.
- susijęs iš [[objektai/ivykiai/Lojevo mūšis (1649 m. liepos 31 d.).md#claim-t-49173|Lojevo mūšis (1649 m. liepos 31 d.)]]: Lojevo mūšyje kazokų kariuomenė buvo perskelta į dvi dalis, jos kairysis sparnas sumuštas, o M. Kričevskio kariai atsitraukė į mišką.
- susijęs iš [[objektai/ivykiai/Vilniaus užėmimas (1655 m. rugpjūčio 7 d.).md#claim-t-41382|Vilniaus užėmimas (1655 m. rugpjūčio 7 d.)]]: 1655 m. rugpjūčio 7 d. po aršių kautynių Rusijos kariuomenė ir jos sąjungininkai kazokai užėmė Lietuvos sostinę Vilnių.
- susijęs iš [[objektai/posakiai/gimti Mickūnuose, jei ne tų prakeiktųjų jėgerių ir kazokų užpuolimas.md#claim-t-86855|gimti Mickūnuose, jei ne tų prakeiktųjų jėgerių ir kazokų užpuolimas]]: Michałas Balińskis atsiminimuose rašė, kad būtų gimęs Mickūnuose, jei ne jėgerių ir kazokų užpuolimas.
- susijęs iš [[objektai/posakiai/„Kražių skerdynėmis“.md#claim-t-183494|„Kražių skerdynėmis“]]: 1893 m. Kražių bažnyčios gynimą nuo uždarymo ir kazokų šturmą liaudis pavadino „Kražių skerdynėmis“.
- susijęs iš Lietuvos bajorijos raštas (1700 m.): Lietuvos bajorijos rašte totoriai apibūdinti kaip lengvoji raitija, gerai aprūpinta ir ginkluota kaip kazokai.
- susijęs iš Dniestras: Totoriai per Dniestrą drįsdavo keltis tik surinkę dideles pajėgas, nes bijojo kazokų.
- susijęs iš Kražių bažnyčia: 1893 m. po visą Europą nuskambėjo Kražių įvykiai – raiti kazokai šturmavo Kražių bažnyčią, kurią nuo uždarymo gynė susirinkę miestelio gyventojai.
- susijęs iš Kražių bažnyčia: 1893 m. po visą Europą nuskambėjo Kražių įvykiai – raiti kazokai šturmavo Kražių bažnyčią, kurią nuo uždarymo gynė susirinkę miestelio gyventojai.
- susijęs iš Mickūnai: M. Balinskis atsiminimuose rašė, kad būtų gimęs Mickūnuose, jei ne jėgerių ir kazokų užpuolimas.
- susijęs iš Minskas: Nors Lietuvos kariuomenė 1654-1655 m. kiek galėdama stabdė rusų veržimąsi, 1655 m. pavasarį Rusijos kariuomenė užėmė Minską, o liepą lietuvius prie Ašmenos sumušę, rusai ir jų sąjungininkai kazokai priartėjo prie Vilniaus.
- susijęs iš Podolė: Podolei ir Rusiai kazokai buvo svarbi jėga ginantis nuo totorių, todėl valdovas jiems mokėjo nedidelį atlygį.
- susijęs iš Podolė: Podolei ir Rusiai kazokai buvo svarbi jėga ginantis nuo totorių, kurie per Dniestrą drįsdavo keltis tik sutelkę dideles pajėgas.
- susijęs iš Ukraina: 1595 m. Ukrainoje kuopai vadovavęs karys pasižymėjo malšindamas kazokų sukilimą.
- susijęs iš [[objektai/zodynas/regestrai regestriniai kazokai.md#claim-t-74035|regestrai regestriniai kazokai]]: Nugalėti kazokai iš dalies patekdavo į regestrus, o kiti turėdavo dirbti žemę arba bėgdavo į Sičę.
- susijęs iš [[objektai/asmenys/B. Zenavičius.md#claim-t-40059|B. Zenavičius]]: Etmono svainis B. Zenavičius žuvo mūšyje su turkais.
- susijęs iš [[objektai/asmenys/Eustachijus Daškevičius.md#claim-t-186199|Eustachijus Daškevičius]]: Senas kazokų vadas Eustachijus Daškevičius slaptai perbėgo į lietuvių stovyklą.
- susijęs iš [[objektai/asmenys/Ivanas Ganeckis.md#claim-t-40145|Ivanas Ganeckis]]: Ivano Ganeckio rinktinėje prieš Sierakausko sukilėlius buvo daugiau kaip 1500 karių.
- susijęs iš [[objektai/asmenys/Jokūbas Kudenekovičius Čerkaskis.md#claim-t-183743|Jokūbas Kudenekovičius Čerkaskis]]: Kunigaikštis Jokūbas Kudenekovičius Čerkaskis faktiškai vadovavo Rusijos kariuomenei, nors oficialiu vadu buvo caras Aleksejus Michailovičius.
- susijęs iš [[objektai/asmenys/Jokūbas Kudenekovičius Čerkaskis.md#claim-t-40211|Jokūbas Kudenekovičius Čerkaskis]]: Kunigaikštis Jokūbas Kudenekovičius Čerkaskis iš tikrųjų vadovavo Rusijos kariuomenei kare su Lenkijos-Lietuvos valstybe.
- susijęs iš [[objektai/asmenys/Jonas Karolis Katkevičius.md#claim-t-79042|Jonas Karolis Katkevičius]]: 1604 m. Karoliui IX tapus Švedijos karaliumi, Jonas Karolis Katkevičius Livonijoje toliau kovojo su švedais.
- susijęs iš [[objektai/asmenys/Konstantinas Ostrogiškis.md#claim-t-184757|Konstantinas Ostrogiškis]]: Užbaigęs karą su Maskva, karalius pasiuntė Konstantiną Ostrogiškį su dalimi algininkų į Volynę.
- susijęs iš [[objektai/asmenys/M. Frankovskis.md#claim-t-39778|M. Frankovskis]]: Gen. mjr. M. Frankovskis vadovavo lietuvių įtvirtinimams tarp Naujininkų, Šv. Stepono bažnyčios ir Poguliankos.
- susijęs iš [[objektai/asmenys/Steponas Batoras.md#claim-t-113985|Steponas Batoras]]: Steponas Batoras buvo sudaręs 500 raitelių vėliavą.
- susijęs iš [[objektai/asmenys/Steponas Batoras.md#claim-t-113996|Steponas Batoras]]: Po Stepono Batoro kampanijų Didieji Lukai, Zavoločė, Sebežas, Nevelis ir Voronežas buvo sugrąžinti Rusijai.
- susijęs iš [[objektai/grupes/Gediminaičių dinastija.md#claim-t-96104|Gediminaičių dinastija]]: Po Gediminaičių dinastijos išmirimo 1572 m. abiejų tautų politinė istorija vystėsi bendroje respublikoje.
- susijęs iš [[objektai/grupes/Leibgvardijos Voluinės pėstininkų pulkas.md#claim-t-78198|Leibgvardijos Voluinės pėstininkų pulkas]]: Leibgvardijos Voluinės pėstininkų pulkas sudarė kautynėms paruoštos Rusijos kariuomenės pagrindo dalį.
- susijęs iš [[objektai/grupes/Leibgvardijos Voluinės pėstininkų pulkas.md#claim-t-78199|Leibgvardijos Voluinės pėstininkų pulkas]]: Leibgvardijos Voluinės pėstininkų pulkas buvo įtrauktas į kautynėms paruoštos Rusijos kariuomenės pagrindą.
- susijęs iš [[objektai/grupes/Leibgvardijos lietuviškasis pėstininkų pulkas.md#claim-t-78196|Leibgvardijos lietuviškasis pėstininkų pulkas]]: Leibgvardijos lietuviškojo pėstininkų pulko atsarginės dalys buvo prie Vilniaus, o pagrindinė dalis slopino sukilimą Lenkijoje.
- susijęs iš [[objektai/grupes/Leibgvardijos lietuviškasis pėstininkų pulkas.md#claim-t-78197|Leibgvardijos lietuviškasis pėstininkų pulkas]]: Leibgvardijos lietuviškasis pėstininkų pulkas sudarė dalį kautynėms paruoštos Rusijos kariuomenės pagrindo.
- susijęs iš [[objektai/grupes/Lietuvos totoriai.md#claim-t-78379|Lietuvos totoriai]]: Lietuvos totoriai naudodavo rytietiškas strėlines ir buvo ginkluoti lanku, kardu bei skydu.
- susijęs iš [[objektai/grupes/Lietuvos totoriai.md#claim-t-78381|Lietuvos totoriai]]: Lietuvos totoriai naudodavo rytietiškas strėlines, kaip ir kita Lietuvos lengvoji kariuomenė.
- susijęs iš [[objektai/grupes/Lietuvos totoriai.md#claim-t-78382|Lietuvos totoriai]]: Lietuvos totoriai šiame sparne buvo vertinami dėl manevringumo persekiojant bėgantį priešą.
- susijęs iš [[objektai/grupes/Narvos muškietininkų pulkas.md#claim-t-78388|Narvos muškietininkų pulkas]]: Balandžio 23 d. lietuviams puolant Vilniuje buvusią rusų įgulą, joje buvo vienas Narvos muškietininkų pulko batalionas ir trys kuopos.
- susijęs iš [[objektai/grupes/Narvos muškietininkų pulkas.md#claim-t-78390|Narvos muškietininkų pulkas]]: Balandžio 23 d. lietuviams puolant Vilniuje buvusią rusų įgulą, joje buvo vienas Narvos muškietininkų pulko batalionas ir trys kuopos.
- susijęs iš [[objektai/grupes/Pskovo muškietininkų pulkas.md#claim-t-78425|Pskovo muškietininkų pulkas]]: Lietuviams puolant Vilnių balandžio 23 d., rusų įguloje buvo du Pskovo muškietininkų pulko batalionai.
- susijęs iš [[objektai/grupes/Pskovo muškietininkų pulkas.md#claim-t-78426|Pskovo muškietininkų pulkas]]: Vilniaus rusų įguloje buvo du Pskovo muškietininkų pulko batalionai.
- susijęs iš [[objektai/grupes/Rusijos kariuomenė.md#claim-t-66080|Rusijos kariuomenė]]: 1654 m. Rusija pasiuntė gausią kariuomenę į Lietuvą.
- susijęs iš [[objektai/grupes/Turkijos kariuomenė.md#claim-t-41184|Turkijos kariuomenė]]: Chotino link artėjusią Turkijos kariuomenę sudarė apie 100000 karių, įskaitant spahius, janičarus, totorius, moldavus ir valakus.
- susijęs iš [[objektai/ivykiai/Antrasis valstybės padalijimas.md#claim-t-86940|Antrasis valstybės padalijimas]]: Antrasis valstybės padalijimas Igną Balinskį užklupo rusų kareivių saugomame namų arešte Vitebske.
- susijęs iš [[objektai/ivykiai/Kražių įvykiai.md#claim-t-183228|Kražių įvykiai]]: 1893 m. Kražių įvykiai turėjo nemažą įtaką lietuvių tautinio sąmoningumo formavimuisi.
- susijęs iš [[objektai/ivykiai/Kražių įvykiai.md#claim-t-20232|Kražių įvykiai]]: Brutalus rusų valdžios elgesys per Kražių įvykius sukėlė dalies rusų visuomenės pasipiktinimą ir Vatikano protestą.
- susijęs iš [[objektai/ivykiai/Lietuvos Brastos mūšis (1792 m. liepos 23 d.).md#claim-t-66681|Lietuvos Brastos mūšis (1792 m. liepos 23 d.)]]: 1792 m. liepos 23 d. Lietuvos Brastos mūšis prasidėjo rusų kavalerijos ataka, kurią lietuvių kavalerija iš pradžių atmušė.
- susijęs iš [[objektai/ivykiai/Lojevo mūšis (1649 m. liepos 31 d.).md#claim-t-49171|Lojevo mūšis (1649 m. liepos 31 d.)]]: Lojevo mūšis buvo pirmoji svari kunigaikščio J. Radvilos pergalė.
- susijęs iš [[objektai/ivykiai/Lojevo mūšis (1649 m. liepos 31 d.).md#claim-t-49174|Lojevo mūšis (1649 m. liepos 31 d.)]]: Lojevo mūšis buvo pirmoji svari kunigaikščio J. Radvilos pergalė, o žinia apie ją pasklido visoje Europoje.
- susijęs iš [[objektai/ivykiai/Rusijos ir Lenkijos-Lietuvos karas (1654–1667 m.).md#claim-t-41353|Rusijos ir Lenkijos-Lietuvos karas (1654–1667 m.)]]: 1654 m. Rusija pasiuntė gausią kariuomenę į Lietuvą.
- susijęs iš [[objektai/paprociai/Husarų vėliavų „draugų“ ir palydos sistema.md#claim-t-71802|Husarų vėliavų „draugų“ ir palydos sistema]]: Husarų vėliavų branduolį sudarė turtingi bajorai - draugai.
- susijęs iš [[objektai/posakiai/„Kražių skerdynėmis“.md#claim-t-20847|„Kražių skerdynėmis“]]: Sužeidimų, žūčių ir išprievartavimų lydėtus Kražių įvykius liaudis pavadino „Kražių skerdynėmis“.
- susijęs iš Salaspilio mūšis: Apie 1619 m. Pieterio Snayerso paveiksle „Salaspilio mūšis“ Lietuvos husarai vaizduojami naikinantys švedų pėstininkų batalioną.
- susijęs iš Ašmena: 1655 m. liepą rusai ir jų sąjungininkai kazokai sumušė lietuvius prie Ašmenos ir priartėjo prie Vilniaus.
- susijęs iš Ašmena: 1655 m. liepą rusai ir jų sąjungininkai kazokai sumušė lietuvius prie Ašmenos ir priartėjo prie Vilniaus.
- susijęs iš Ašmena: 1655 m. liepą rusai ir jų sąjungininkai kazokai sumušė lietuvius prie Ašmenos ir priartėjo prie Vilniaus.
- susijęs iš Braginas: Kričevskio vadovaujami kazokai atsitraukė prie Dniepro ir įsitvirtino stovykloje netoli Bragino.
- susijęs iš Dauguva: Lietuvos kariuomenės sparnas turėjo nustumti švedus nuo Dauguvos kranto ir nublokšti juos į šiaurėje esantį pelkėtą mišką.
- susijęs iš Gardinas: XVIII a. pabaigoje Gardine mėginta gaminti šautuvus, tačiau kariuomenės vadovybė savais gamintojais nepasitikėjo.
- susijęs iš Gardinas: XVIII a. pabaigoje Gardine mėginta gaminti šautuvus, tačiau kariuomenės vadovybė savais gamintojais nepasitikėjo.
- susijęs iš Livonija: 1621 m. švedai užėmė didelę dalį Livonijos, o Rusija tuo metu grasino Lietuvai karu.
- susijęs iš Livonija: 1621 m. švedai užėmė didelę Livonijos dalį, o Rusija tuo metu grasino Lietuvai karu.
- susijęs iš Lojevka upė: Radvilos pajėgų sparnuose stovėję pėstininkai ir dragūnai gynė Lojevkos upės, juosiančios stovyklą, užtvanką.
- susijęs iš Naujininkai: Leontijaus Bennigseno kavalerija atakavo lietuvių įtvirtinimus tarp Naujininkų, Šv. Stepono bažnyčios ir Poguliankos rajonų.
- susijęs iš Podolė: Kazokai Podolei ir Rusiai buvo svarbi jėga ginantis nuo totorių, todėl valdovas jiems mokėjo nedidelį atlygį.
- susijęs iš Podolė: 1621 m. liepos 14 d. LDK kariuomenė atžygiavo į bendrą stovyklą prie Orinino, netoli Podolės Kameneco.
- susijęs iš Pogulianka: Leontijus Bennigsenas su kavalerijos ir kazokų pajėgomis puolė lietuvių įtvirtinimus ties Pogulianka.
- susijęs iš Pskovas: Lietuviams puolant Vilnių, rusų įguloje buvo du Pskovo muškietininkų pulko batalionai.
- susijęs iš Pskovas: Balandžio 23 d. Vilniuje buvusioje rusų įguloje buvo du Pskovo muškietininkų pulko batalionai.
- susijęs iš Terespolis: Michałas Balińskis gimė 1794 m. rugpjūčio 12 d. Terespolyje, netoli Vitebsko.
- susijęs iš Trakai: 1655 m. rugpjūčio 7 d. rusams ir kazokams užėmus Vilnių, netrukus buvo užimti Trakai ir Kaunas.
- susijęs iš Ukraina: Turkija siekė užvaldyti visą vidinių kovų draskomą Moldaviją ir Valakiją bei plėsti savo ekspansiją toliau į Lenkijai priklausiusios Ukrainos teritoriją.
- susijęs iš Valakija: Turkija siekė užvaldyti visą vidinių kovų draskomą Moldaviją ir Valakiją bei plėsti savo ekspansiją toliau į Lenkijai priklausiusios Ukrainos teritoriją.
- susijęs iš Vilnius: Lietuviams puolant balandžio 23 d., Vilniuje buvusią rusų įgulą sudarė 2500 pėstininkų, 300 raitelių ir 19 artilerijos pabūklų.
- susijęs iš Vilnius: Lietuviams puolant balandžio 23 d., Vilniuje buvusią rusų įgulą sudarė 2500 pėstininkų, 300 raitelių ir 19 artilerijos pabūklų.
- susijęs iš Vilnius: 1655 m. liepą rusai ir jų sąjungininkai kazokai, sumušę lietuvius prie Ašmenos, priartėjo prie Vilniaus.
- susijęs iš Vilnius: 1655 m. liepą rusai ir jų sąjungininkai kazokai, sumušę lietuvius prie Ašmenos, priartėjo prie Vilniaus.
- susijęs iš Vitebskas: Antrasis valstybės padalijimas Igną Balinskį užklupo rusų kareivių saugomame namų arešte Vitebske.
- susijęs iš Vitebskas: Antrasis valstybės padalijimas Igną Balinskį užklupo rusų kareivių saugomame namų arešte Vitebske.
- susijęs iš Vitebskas: Mykolas Balinskis gimė 1794 m. rugpjūčio 12 d. Terespolyje, netoli Vitebsko.
- susijęs iš [[objektai/zodynas/Slenkstis Slynksnis-Perlevenu.md#claim-t-189179|Slenkstis Slynksnis-Perlevenu]]: Narbutas Slynksnį-Perlevenu (Slynxnis-Perlewenu) apibūdina kaip bendrą namų dievaitį ir žemdirbio nuosavybės globėją.
- susijęs iš [[objektai/asmenys/Antoine Gramont.md#claim-t-40035|Antoine Gramont]]: Prancūzijos grafas Antoine Gramont 1663-1664 m. pasakojo apie kazokus, tarnavusius Lenkijos-Lietuvos kariuomenėse.
- susijęs iš [[objektai/autoriai/A. Vijūkas Kojelavičius.md#claim-t-187925|A. Vijūkas Kojelavičius]]: Amžininko Alberto Vijūko-Kojelavičiaus teigimu, Lenkijos kariuomenė dažnai stodavo į mūšį nepasvėrusi savo jėgų, vedina paniekos priešui.
- susijęs iš [[objektai/autoriai/A. Vijūkas Kojelavičius.md#claim-t-187930|A. Vijūkas Kojelavičius]]: Albertas Vijūkas-Kojelavičius vertino Lenkijos kariuomenės elgesį kaip dažnai nepasvertą ir vedamą paniekos priešui.
- susijęs iš Dniestras: Totoriai per Dniestrą drįsdavo keltis tik surinkę dideles pajėgas, nes bijojo kazokų.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)
  citata_originali: |
    Du įvykiai turėjo nemažą įtaką lietuvių tautinio sąmoningumo for-
    mavimuisi. 1893 m. po visą Europą nuskambėjo Kražių įvykiai – raiti
    kazokai šturmavo Kražių bažnyčią, kurią nuo uždarymo gynė susirin-
    kę miestelio gyventojai. Buvo sužeistų ir užmuštų, išprievartautų mote-
    rų – liaudis tuos įvykius pavadino „Kražių skerdynėmis“.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-005
- c-002
  šaltinis: Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)
  citata_originali: |
    Kitose rezoliucijose žmonės raginti nemokėti valdžiai mokesčių, neiti į
    kariuomenę, imtis organizuoti lokalinę savivaldą – tai paskatino Lietuvos
    kaimus ir miestelius visiškai perimti į savo rankas valsčių savivaldybes.
    Žiemą Lietuvos kaimas daug kur buvo perėjęs į vietos žmonių rankas.
    Tačiau, slūgstant revoliucijos bangai, caro valdžia 1906 m. pavasarį ka-
    zokų ir kariuomenės pastangomis savo kiek pakoreguotą tvarką atkūrė.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-004
- c-003
  santrauka: 'Lietuvos totoriai ir kazokai buvo vertinami dėl manevringumo persekiojant bėgantį priešą.'
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Šiame sparne buvo sutelktos įvairios
    kavalerijos rūšys. Šio sparno jėga - reitarų
    sutelkta ugnis, husarų geležinis smūgis,
    Lietuvos totorių ir kazokų manevringumas
    persekiojant bėgantį priešą. Sparno užda-
    vinys - apeiti priešininko dešinįjį sparną,
    nustumti jį nuo Dauguvos kranto ir bendro-
    mis jėgomis su visa Lietuvos kariuomene
    nublokšti švedus į šiaurėje esantį pelkėtą
    mišką ir ten juos sunaikinti.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
- c-004
  santrauka: 'Ukrainos kazokų stovyklą pirmiausia atakavo janičarai, o po jų puolė turkų kavalerija.'
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Pirmiausiai janičarai (turkų pėstininkai),
    o po to ir turkų kavalerija atakavo atski-
    rai įsikūrusių Ukrainos kazokų stovyklą.
    Neatlaikę puolimo, kazokai ėmė trauk-
    tis. LDK didysis etmonas pasiuntė ke-
    letą lengvosios kavalerijos - „lisovčikų“
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003
- c-005
  santrauka: 'Kazokai buvo lengvoji raitija, kurios paskirtis buvo paremti husarus mūšyje ir naikinti jų sumuštus eskadronus.'
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Gynybos linija prie Chocino buvo taip
    įrengta, kad priešas negalėtų jos apeiti,
    o jungtinės kariuomenės dalinių flanginė

    „Toliau - lengvoji raitija, šios šalies kalba vadinama kazokais. Šie irgi yra bajorai ir
    kaip husarai tarnauja vėliavose. Jų ginkluotę sudaro arba grandijų [žieduočio] marški-
    niai, arba rankas iki pusės dengiantys grandijai. Šalia to jie dar dėvi geležines pirštines,
    o galvą dengia šalmas iš žiedų (tokių pat kaip ant kūno), lenkiškai vadinamas misiurka.
    Kazokų arkliai turi būti ištvermingi, greiti ir miklūs. Jų ginklai - lankai, strėlės ir pistole-
    tai. Kazokų paskirtis - paremti husarus, šiems einant į mūšį, ir baigiant naikinti husarų
    sumuštus eskadronus.“

    1621 m.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-006
- c-006
  santrauka: 'Kazokai vijosi bėgantį priešą, įsiveržė į turkų artilerijos baterijų pozicijas, išžudė jų tarnybas ir sugadino pabūklus.'
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Bėgantį priešą pradėjo vytis ir
    kazokai, kurie, įsiveržę į turkų ar-
    tilerijos baterijų pozicijas, išžudė
    jų tarnybas ir sugadino pabūk-
    lus. Taip pat jie buvo įsiveržę ir į
    turkų stovyklą. Temstant jungti-

    nių pajėgų vadas liepė grįžti į savas | 4 rf
    pozicijas.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-007
  santrauka: 'Kazokai vijosi bėgantį priešą, įsiveržė į turkų artilerijos baterijų pozicijas, išžudė jų tarnybas ir sugadino pabūklus.'
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Staigus puolimas
    sukėlė paniką janičarų gretose.
    Bėgantį priešą pradėjo vytis ir
    kazokai, kurie, įsiveržę į turkų ar-
    tilerijos baterijų pozicijas, išžudė
    jų tarnybas ir sugadino pabūk-
    lus. Taip pat jie buvo įsiveržę ir į
    turkų stovyklą.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-007

## Ryšiai
- [[objektai/grupes/Rusai]] buvo_sajungininkas_su Kazokai
- Kazokai dalyvavo_musyje [[objektai/ivykiai/Lojevo mūšis (1649 m. liepos 31 d.)]]
- Kazokai puole [[objektai/vietos/Kražių bažnyčia]]
- Kazokai buvo_sajungininkas_su [[objektai/grupes/Rusijos kariuomenė]]
- [[objektai/grupes/Janičarai]] puole Kazokai
- Kazokai buvo_sajungininkas_su [[objektai/grupes/Rusai]]
- Kazokai kariavo_pries [[objektai/grupes/Lietuviai]]
- Kazokai puole [[objektai/vietos/Kražiai]]
- Kazokai uzeme [[objektai/vietos/Vilnius]]
- Kazokai gyne [[objektai/vietos/Podolė]]
- [[objektai/asmenys/Jonas Karolis Chodkevičius]] kariavo_pries Kazokai
- Kazokai kariavo_pries [[objektai/grupes/Totoriai]]
- Kazokai reme [[objektai/asmenys/Leontijus Bennigsenas]]
- Kazokai dalyvavo_musyje [[objektai/ivykiai/Kražių įvykiai]]
- Kazokai keliavo_i [[objektai/vietos/Dniepras]]
- Kazokai uzeme [[objektai/vietos/Kaunas]]
- Kazokai uzeme [[objektai/vietos/Trakai]]
- Kazokai surenge_zygi_i [[objektai/vietos/Mozyrius]]
- Kazokai surenge_zygi_i [[objektai/vietos/Starodubas]]
- Kazokai keliavo_i [[objektai/vietos/Lojevas]]
- [[objektai/grupes/Totoriai]] buvo_priesas Kazokai
- Kazokai puole [[objektai/grupes/Švedai]]
