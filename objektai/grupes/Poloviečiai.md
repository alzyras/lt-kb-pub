---
tipas: grupe
pavadinimas: 'Poloviečiai'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
  - 'Teodoras Narbutas, Lietuvių tautos istorija, t. 2 (1995 m.)'
sukurta: ''
atnaujinta: ''
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
# Poloviečiai

## Santrauka

Danielius išsiuntė Tautvilą, o jam į pagalbą pasiuntė rusus ir poloviečius, kurie ilgai kariavo su vokiečiais. Prieš vokiečius rusai ir poloviečiai jodinėjo su strėlėmis, o jotvingiai buvo ginkluoti trumpomis ietimis. Pasak Nestoro, poloviečiai visą vasarą laikė apgulę Giurgevo tvirtovę, bet jos neįveikė ir, sudarę taiką su Sventopelku, nesikėlė per Rosės upę.

## Teiginiai

<a id="claim-t-187773"></a>
- t-001
  global_id: t-187773
  teiginys: "Danielius išsiuntė Tautvilą, o jam į pagalbą pasiuntė rusus ir poloviečius, kurie ilgai kariavo su vokiečiais."
  teiginio_tipas: "faktas"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  semantiniai_rysiai: "Rusai rėmė Tautvila (0.90); Poloviečiai rėmė Tautvila (0.86); Rusai kariavo prieš Vokiečiai (0.74); Poloviečiai kariavo prieš Vokiečiai (0.74)"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  saltinio_vieta: "89552-89804; hash=46a05ed050d529df420576bd2bcec289825dacb1e5d0cbbfea1680f78922649c; match=whitespace_regex"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "reme -> Tautvila: 0.90"
  ryšio_patikimumo_lygis: "aukstas"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Rusai: llm_allowed_candidate, group"
  ryšio_targeto_parinkimas: "Tautvila: llm_allowed_candidate, person"
  ryšio_paaiskinimas: "Rusai buvo pasiųsti Tautvilai į pagalbą."
  vertinimo_atnaujinta: "2026-06-16T21:06:50Z"
  vertinimo_autorius: "rewrite_source_claims / rewrite"
  pagrindžia:
    - c-170712

<a id="claim-t-187774"></a>
- t-002
  global_id: t-187774
  teiginys: "Prieš vokiečius rusai ir poloviečiai jodinėjo su strėlėmis, o jotvingiai buvo ginkluoti trumpomis ietimis."
  teiginio_tipas: "faktas"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Lietuvos metraštis"
  saltinio_vieta: "91663-92052; hash=334f479b01a820f8d98a913eb644dbb99eede081020e44c0230d503a548c920a; match=whitespace_regex"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "susije_su -> Jotvingiai: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Poloviečiai: owner_note_path, group, gap=0"
  ryšio_targeto_parinkimas: "Jotvingiai: mention_match, group, gap=37"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Poloviečiai\" parinktas kaip owner_note_path. Targetas \"Jotvingiai\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  vertinimo_atnaujinta: "2026-06-16T21:06:50Z"
  vertinimo_autorius: "rewrite_source_claims / rewrite"
  pagrindžia:
    - c-170713

<a id="claim-t-192441"></a>
- t-003
  global_id: t-192441
  teiginys: "Pasak Nestoro, poloviečiai visą vasarą laikė apgulę Giurgevo tvirtovę, bet jos neįveikė ir, sudarę taiką su Sventopelku, nesikėlė per Rosės upę."
  teiginio_tipas: "faktas"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  šaltinio_profilis: "žanras: kronika; perspektyva: neutrali_arba_neaiski; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Teodoras Narbutas"
  saltinio_vieta: "130566-130923; hash=52eeb22bc48ef25ca72543b2ba96d5f1ed87417c5b6972cfa1d33aafc91f4167; match=exact"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "susije_su -> Slavai: 0.83"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Poloviečiai: owner_note_path, group, gap=0"
  ryšio_targeto_parinkimas: "Slavai: mention_match, group"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Poloviečiai\" parinktas kaip owner_note_path. Targetas \"Slavai\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality."
  vertinimo_atnaujinta: "2026-07-06T03:41:44Z"
  vertinimo_autorius: "rewrite_source_claims / rewrite"
  pagrindžia:
    - c-175235

<a id="claim-t-192442"></a>
- t-004
  global_id: t-192442
  teiginys: "Karamzinas Nestoro žodžius apie poloviečius siejo su jų veiksmais dešiniajame Dnepro krante prie Jurjevo ir Rosės upės."
  teiginio_tipas: "faktas"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  šaltinio_profilis: "žanras: kronika; perspektyva: neutrali_arba_neaiski; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Teodoras Narbutas"
  saltinio_vieta: "130974-131528; hash=6f2540f1575b72961704273d483fa10a1ff5e289e230dce057a07fb6fc9a703d; match=ocr_normalized"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "susije_su -> Dnepras: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Poloviečiai: owner_note_path, group, gap=0"
  ryšio_targeto_parinkimas: "Dnepras: mention_match, place, gap=46"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Poloviečiai\" parinktas kaip owner_note_path. Targetas \"Dnepras\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  vertinimo_atnaujinta: "2026-07-06T03:41:44Z"
  vertinimo_autorius: "rewrite_source_claims / rewrite"
  pagrindžia:
    - c-175236

<a id="claim-t-192443"></a>
- t-005
  global_id: t-192443
  teiginys: "Teodoras Narbutas rašo, kad Ksaveras Bogušas, remdamasis Kojalavičiaus prielaidomis, poloviečius priskyrė lietuvių genties tautoms."
  teiginio_tipas: "faktas"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  šaltinio_profilis: "žanras: kronika; perspektyva: neutrali_arba_neaiski; šališkumas: high; atribucija: required_for_interpretation; atribucijos vardas: Teodoras Narbutas"
  saltinio_vieta: "186386-186911; hash=7d7b82b937c2835554264fb902d198851c48940a0b090d626ed83902191b4577; match=exact"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "susije_su -> Rusai: 0.83"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Poloviečiai: owner_note_path, group, gap=0"
  ryšio_targeto_parinkimas: "Rusai: mention_match, group"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Poloviečiai\" parinktas kaip owner_note_path. Targetas \"Rusai\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality."
  vertinimo_atnaujinta: "2026-07-06T03:41:44Z"
  vertinimo_autorius: "rewrite_source_claims / rewrite"
  pagrindžia:
    - c-175237
- susijęs iš [[objektai/asmenys/Albertas Vijūkas-Kojalavičius.md#claim-t-190839|Albertas Vijūkas-Kojalavičius]]: Ksaveras Bogušas poloviečius priskyrė lietuvių genties tautoms, remdamasis panašiomis Kojalavičiaus prielaidomis.
- susijęs iš [[objektai/asmenys/Albertas Vijūkas-Kojalavičius.md#claim-t-190840|Albertas Vijūkas-Kojalavičius]]: Narbutas rašo, kad Kojalavičius poloviečius laikė turinčiais lietuvių kalbą ir siejo juos su Mamajaus sugriauta Beloserkos sostine.
- susijęs iš [[objektai/asmenys/Jonas Komninas.md#claim-t-191285|Jonas Komninas]]: Pasak Narbuto, Jonui Komninui 1121 m. nugalėjus pečenegus, hiriai išsikėlė į kairįjį Dnepro krantą pas poloviečius.
- susijęs iš [[objektai/asmenys/Karamzinas.md#claim-t-191246|Karamzinas]]: Karamzinas, Narbuto perteikimu, Jurjevą prie Rosės siejo su poloviečių veiksmais ir teigė, kad miestas atstatytas XII a. pradžioje po to, kai poloviečiai jį sunaikino.
- susijęs iš [[objektai/asmenys/Karamzinas.md#claim-t-191248|Karamzinas]]: Karamzinas, Narbuto nurodymu, įrodinėjo, kad poloviečiai patys save vadino Kipczak.
- susijęs iš [[objektai/asmenys/Ksaveras Bogušas.md#claim-t-190915|Ksaveras Bogušas]]: Ksaveras Bogušas, pasak Teodoro Narbuto, remdamasis Kojalavičiaus prielaidomis, poloviečius priskyrė lietuvių genties tautoms.
- susijęs iš [[objektai/asmenys/Nikolajus Karamzinas.md#claim-t-191142|Nikolajus Karamzinas]]: Teodoro Narbuto perteikimu, Nikolajus Karamzinas teigė, kad Jurjevas XII a. pradžioje buvo atstatytas po poloviečių sunaikinimo.
- susijęs iš [[objektai/asmenys/Nikolajus Karamzinas.md#claim-t-191144|Nikolajus Karamzinas]]: Teodoras Narbutas remiasi Karamzinu teigdamas, kad poloviečiai patys save vadino Kipczak.
- susijęs iš [[objektai/asmenys/Vasilka.md#claim-t-190996|Vasilka]]: Narbutas nurodė: Mūšyje su jotvingiais Vasilka liko su Ziemovitu, o Lozorius su poloviečiais laukė rezerve, kuris vėliau atvyko į jų kariuomenę.
- susijęs iš [[objektai/autoriai/Adomas Stanislovas Naruševičius.md#claim-t-190676|Adomas Stanislovas Naruševičius]]: Naruševičius, Narbuto teigimu, pateikė žinių, rėmusių nuomonę, kad poloviečiai buvo rusų kaimynai iš rytų ir vakarų.
- susijęs iš [[objektai/autoriai/Albertas Vijūkas-Kojalavičius.md#claim-t-190687|Albertas Vijūkas-Kojalavičius]]: Kojalavičiaus prielaidomis, Narbuto teigimu, rėmęsis Ksaveras Bogušas poloviečius priskyrė lietuvių genties tautoms.
- susijęs iš [[objektai/autoriai/Albertas Vijūkas-Kojalavičius.md#claim-t-190688|Albertas Vijūkas-Kojalavičius]]: Kojalavičius, Narbuto perteikimu, teigė, kad poloviečiai turėjo lietuvių kalbą, ir rėmėsi pasakojimu apie Mamajaus sugriautą Beloserką.
- susijęs iš [[objektai/autoriai/Ksaveras Bogušas.md#claim-t-190754|Ksaveras Bogušas (kunigas, XIX a.)]]: Ksaveras Bogušas poloviečius priskyrė lietuvių genties tautoms, remdamasis Kojalavičiaus prielaidomis.
- susijęs iš [[objektai/autoriai/Nikolajus Karamzinas.md#claim-t-190771|Nikolajus Karamzinas]]: Narbutas Karamzinu rėmė teiginį, kad poloviečiai patys save vadino Kipczak.
- susijęs iš [[objektai/ivykiai/Čingischano vadų karas su alanais.md#claim-t-191078|Čingischano vadų karas su alanais]]: Narbutas rašo, kad 1223 m. Čingischano vadai kariavo toje pačioje pusėje su alanais, kuriems su poloviečiais priklausė Dagestanas.
- susijęs iš [[objektai/ivykiai/Čingischano vadų žygis į Samachą ir Derbentą 1223 m.md#claim-t-192016|Čingischano vadų žygis į Samachą ir Derbentą 1223 m]]: Narbutas pasakoja, kad prie Samachos ir Derbento apsupti Čingischano vadai susitarė su poloviečiais, kad šie paliktų alanus.
- susijęs iš Adomas Stanislovas Naruševičius, Historia narodu polskiego: Narbutas rašo, kad Naruševičiaus žinios, rodos, rėmė nuomonę, jog poloviečiai buvę rusų kaimynai iš rytų ir vakarų.
- susijęs iš Albertas Vijūkas-Kojalavičius, Historiae Lituanae: Narbutas rašo, kad Ksaveras Bogušas poloviečius priskyrė lietuvių genties tautoms, remdamasis Kojalavičiaus prielaidomis.
- susijęs iš Ksaveras Bogušas, Rozprawa: Ksaveras Bogušas, Narbuto vertinimu, poloviečius priskyrė lietuvių genties tautoms, remdamasis Kojalavičiaus prielaidomis.
- susijęs iš Martynas Kromeris, De situ, populis, moribus, magistratibus: Teodoras Narbutas nurodo, kad Kromeris veikale „De situ, populis, moribus, magistratibus“ poloviečius vadina gotais ir šios nuomonės nelaiko visai nepagrįsta.
- susijęs iš [[objektai/ivykiai/Čingischano vadų žygis į Samachą ir Derbentą 1223 m.md#claim-t-192016|Čingischano vadų žygis į Samachą ir Derbentą 1223 m]]: Narbutas pasakoja, kad prie Samachos ir Derbento apsupti Čingischano vadai susitarė su poloviečiais, kad šie paliktų alanus.
- susijęs iš [[objektai/asmenys/Balušas.md#claim-t-191373|Balušas]]: 1055 m. poloviečių vadas Balušas kovojo su Rusia, bet po nesėkmingų kautynių sudarė paliaubas su kunigaikščiu Vsevolodu.
- susijęs iš [[objektai/asmenys/Jonas Komninas.md#claim-t-191284|Jonas Komninas]]: Pasak Narbuto, 1121 m. graikų imperatorius Jonas Komninas galutinai nugalėjo pečenegus, ir nuo tada prasidėjo jų vardo smukimas.
- susijęs iš [[objektai/asmenys/Karpinas.md#claim-t-191428|Karpinas]]: Karpinas ir Rubrikvis, Narbuto perteikimu, XIII a. kelionėse į mongolų ordą aprašė Kaukazo alanus, vadintus Jassi, Asses ir Aries.
- susijęs iš [[objektai/asmenys/Konstantinas Purpurinis.md#claim-t-191434|Konstantinas Purpurinis]]: Narbutas Konstantiną Purpurinį vadina istoriku ir juo remiasi aiškindamas aptariamos tautos padalijimą į dvi puses.
- susijęs iš [[objektai/asmenys/Konstantinas VII Purpurinis.md#claim-t-191352|Konstantinas VII Purpurinis]]: Narbutas Konstantiną VII Purpurinį vadina istoriku ir juo remiasi aiškindamas aptariamos tautos padalijimą į dvi puses.
- susijęs iš [[objektai/asmenys/Rusbergas Rubrikvis.md#claim-t-191978|Rusbergas Rubrikvis]]: Narbutas rašo, kad XIII a. Rusbergas, arba Rubrikvis, su Karpinu keliavo per Rytus į mongolų ordą ir kalbėjo apie Kaukazo alanus.
- susijęs iš [[objektai/asmenys/Rusbergas.md#claim-t-191977|Rusbergas]]: Narbutas rašo, kad XIII a. Rusbergas, arba Rubrikvis, su Karpinu keliavo per Rytus į mongolų ordą ir kalbėjo apie Kaukazo alanus.
- susijęs iš [[objektai/asmenys/Sekalas.md#claim-t-191463|Sekalas]]: Poloviečių vadas Sekalas po šešerių metų užpuolė rusų kraštus, nugalėjo Vsevolodą ir išsigabeno didžiulį grobį.
- susijęs iš [[objektai/asmenys/Sventopelkas.md#claim-t-190973|Sventopelkas]]: Pasak Nestoro, poloviečiai visą vasarą laikė apgulę Giurgevo tvirtovę, bet sudarė taiką su Sventopelku.
- susijęs iš [[objektai/asmenys/Sventopelkas.md#claim-t-190974|Sventopelkas]]: Teodoras Narbutas aiškino, kad Giurgevo tvirtovė nebuvo paimta, nes kunigaikštis Sventopelkas sudarė taiką.
- susijęs iš [[objektai/asmenys/Vsevolodas.md#claim-t-191485|Vsevolodas]]: 1055 m. poloviečių vadas Balušas po nesėkmingų kautynių sudarė paliaubas su kunigaikščiu Vsevolodu.
- susijęs iš [[objektai/autoriai/Konstantinas Purpurinis.md#claim-t-191584|Konstantinas Purpurinis]]: Pasak Konstantino Purpurinio, pečenegai buvo pasidaliję į dvi puses, kurių kiekvieną sudarė keturios ordos.
- susijęs iš [[objektai/daiktai/Arbaletai.md#claim-t-186830|Arbaletai]]: Lietuvos metraštyje pasakojama, kad prieš vokiečius išjoję Mindaugo kariai buvo ginkluoti arbaletais.
- susijęs iš [[objektai/daiktai/Strėlės.md#claim-t-186831|Strėlės]]: Lietuvos metraštyje pasakojama, kad lietuvos metraštis pasakoja, kad rusai ir poloviečiai šiame susirėmime jodinėjo su strėlėmis; Šiame gabale strėlės minimos kaip atskira kovinė priemonė.
- susijęs iš [[objektai/daiktai/Trumpos ietys.md#claim-t-186832|Trumpos ietys]]: Lietuvos metraščio pasakojime jotvingiai susirėmime prieš vokiečius jodinėjo su trumpomis ietimis.
- susijęs iš [[objektai/daiktai/Vėliavos.md#claim-t-192507|Vėliavos]]: Narbuto pasakojime jotvingiai smarkiai puolė Lozoriaus rezerve buvusius poloviečius ir atėmė vado vėliavą.
- susijęs iš [[objektai/grupes/Jotvingiai.md#claim-t-178767|Jotvingiai]]: Ivinskis jotvingių sunykimą siejo su badmečių, marų ir žiaurių to meto karų poveikiu.
- susijęs iš [[objektai/grupes/Jotvingiai.md#claim-t-187709|Jotvingiai]]: Lietuvos metraštyje Mindaugo svainis po Mindaugo pasitraukimo į Vorutos pilį naktį išvaikė rusus ir jotvingius.
- susijęs iš [[objektai/grupes/Pečenegai.md#claim-t-192989|Pečenegai]]: Teodoras Narbutas aiškina, kad poloviečiai nebuvo atskira tauta, o pečenegų palikuonys ar dalis, susiformavusi iš hunams giminingų genčių likučių.
- susijęs iš [[objektai/ivykiai/Tautvilos ir sąjungininkų žygis prieš Mindaugą bei Vorutos apgultis.md#claim-t-187498|Tautvilos ir sąjungininkų žygis prieš Mindaugą bei Vorutos apgultis]]: Pasak šaltinio, po susirėmimo Tautvilas sugrįžo namo į Žemaitiją.
- susijęs iš [[objektai/ivykiai/Tautvilos ir sąjungininkų žygis prieš Mindaugą bei Vorutos apgultis.md#claim-t-187500|Tautvilos ir sąjungininkų žygis prieš Mindaugą bei Vorutos apgultis]]: Lietuvos metraštis pasakoja, kad prie Vorutos Mindaugo kariai su arbaletais išjojo prieš vokiečius, o rusai, polovcai ir jotvingiai vaikėsi po lauką.
- susijęs iš [[objektai/ivykiai/Čingischano vadų žygis į Samachą ir Derbentą 1223 m.md#claim-t-192490|Čingischano vadų žygis į Samachą ir Derbentą 1223 m]]: Erbelotas minėjo alanų karaliuką, valdžiusį savo genties ordą, kuri klajojo į šiaurę nuo Derbento.
- susijęs iš Johanno Voigto Prūsijos istorija: Narbutas rašė, kad kryžiuočiai į Polesę įsiveržė laikydami ją senąja Prūsijos provincija ir kaltindami Kujavijos kunigaikštį sulaužius sutartį.
- susijęs iš Belaja Cerkovė: Karamzinas Jurjevą siejo su vieta prie Rosės upės, tekančios pro Belają Cerkovę Kijevo gubernijoje.
- susijęs iš Giurgevo tvirtovė: Giurgevo tvirtovės vieta, Narbuto teigimu, rusų istorikams buvo nesutariamas klausimas.
- susijęs iš Rosė (Ross) upė Kijevo gubernijoje: Karamzinas Jurjevą siejo su Rosės upe prie Belaja Cerkovės Kijevo gubernijoje ir Nestoro žodžius taikė dešiniajam Dnepro krantui.
- susijęs iš Vizna: Kunigaikštis Danielius nuėjo prie Viznos, persikėlė per Narevo upę ir iš nelaisvės išvadavo daug krikščionių.
- susijęs iš Volga: Narbutas pasakoja, kad po kelių pralaimėjimų poloviečiai apie 1127 m. buvo priversti pasitraukti už Volgos.
- susijęs iš [[objektai/asmenys/Sventopelkas.md#claim-t-190974|Sventopelkas]]: Teodoras Narbutas aiškino, kad Giurgevo tvirtovė nebuvo paimta, nes kunigaikštis Sventopelkas sudarė taiką.
- susijęs iš [[objektai/autoriai/Albertas Vijūkas-Kojalavičius.md#claim-t-190688|Albertas Vijūkas-Kojalavičius]]: Kojalavičius, Narbuto perteikimu, teigė, kad poloviečiai turėjo lietuvių kalbą, ir rėmėsi pasakojimu apie Mamajaus sugriautą Beloserką.
## Reikšmingi paminėjimai

- c-001
  santrauka: 'Danielius išsiuntė Tautvilą, o jam į pagalbą pasiuntė rusus ir poloviečius, kurie ilgai kariavo su vokiečiais.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Paėmė jie daug miestų ir pargrįžo namo l3 .
    O paskui atsiuntė žinią Vykintas, pranešdamas, kad
    vokiečiai norį stoti Tautvilai į pagalbą. Danielius iš­
    siuntė Tautvilą ", ir jam į pagalbą— rusus bei polovie-
    čius, ir jie ilgai kariavo vieni su kitais.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001

- c-002
  santrauka: 'Prieš vokiečius rusai ir poloviečiai jodinėjo su strėlėmis, o jotvingiai buvo ginkluoti trumpomis ietimis.'
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    Užsidarė pilyje-vorutoje2 3 , ir
    55

    ## Puslapis 51

    (naktį) 2A išsiuntė savo svainį2 5 , ir tas išvaikė ir rusus,
    ir jotvingius. O rytojaus metą prieš vokiečius išjojo
    [Mindaugo kariai), ginkluoti arbaletais; ir jodinėjo ru­
    sai bei poloviečiai su strėlėmis, o jotvingiai su trumpo­
    mis ietimis, ir vaikėsi po lauką, tarytum turnyre. Ir iš
    ten (Tautvilą) sugrįžo namo į Žemaitiją 2 6 .
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002

- c-003
  santrauka: 'Pasak Nestoro, poloviečiai visą vasarą laikė apgulę Giurgevo tvirtovę, bet jos neįveikė ir, sudarę taiką su Sventopelku, nesikėlė per Rosės upę.'
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 2 (1995 m.)
  citata_originali: |
    Turbūt toks
    pavadinimas atsirado iš kažkokio šios upės vandens sko­
    nio ar spalvos panašumo, pastebėto pirmųjų slavų kolo­
    nistų. Panagrinėkime, kaip buvo sakoma senovėje. Ne­
    storas teigia, kad poloviečiai atėjo prie G i urge v o tvirto­
    vės, laikė ją apgulę visą vasarą, bet, negalėdami jos
    įveikti, nesikėlė per Rosés upę, sudarę taiką su Sventopel-
    ku2.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003

- c-004
  santrauka: 'Karamzinas Nestoro žodžius apie poloviečius siejo su jų veiksmais dešiniajame Dnepro krante prie Jurjevo ir Rosės upės.'
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 2 (1995 m.)
  citata_originali: |
    Ka­
    ramzinas, radęs kažkokį Jurjevą prie Rosės upės, tekan­
    čios pro Belaja Cerkovę, Kijevo gubernijoje, šiuos Nes­
    toro žodžius priskiria poloviečių veiksmams dešiniojoje
    Dnepro pakrantėje. Jis net teigia, kad Jurjevas buvo at­
    statytas XII amžiaus pradžioje po to, kai jį sunaikino
    poloviečiai. Tačiau jis prieštarauja sau ir savo tiksliai
    išdėstytoms istorinėms tiesoms, nes ir poloviečių puoli­
    mai iki XII amžiaus pradžios, ir Giurgevo apgultis, pa­
    imti iš Nestoro veikalo, liečia tų barbarų veiksmus kai­
    riojoje Dnepro pakrantėje, į rytus nuo jo.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-004

- c-005
  santrauka: 'Teodoras Narbutas rašo, kad Ksaveras Bogušas, remdamasis Kojalavičiaus prielaidomis, poloviečius priskyrė lietuvių genties tautoms.'
  šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 2 (1995 m.)
  citata_originali: |
    95
    Pastabos. Mūsų mokslininkas, lietuvių istorijos tyri­
    nėtojas Ksaveras Bogušas priskiria lietuvių genties tau­
    toms iš kitur pažįstamus poloviečius', remdamasis tokio­
    mis pat Kojalavičiaus prielaidomis1 2. Naruševičius patei­
    kia žinių, kurios, rodos, taip pat remia šią nuomonę, kad
    poloviečiai buvę rusų kaimynai nuo saulės patekėjimo ir
    nusileidimo pusių3. Šie teiginiai įpareigoja mus patyri­
    nėti istorinius faktus, kurie geriau paaiškintų tai ir at­
    skleistų tikrą ar spėjamą giminystę, kurią mini mūsų pirm­
    takai.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-005

## Citatos

- id: c-170712
  autorius: "Anoniminis metraštininkas"
  šaltinis: "Lietuvos metraštis, Bychovco kronika (1971 m.)"
  citata_originali: |
    Paėmė jie daug miestų ir pargrįžo namo l3 .
    O paskui atsiuntė žinią Vykintas, pranešdamas, kad
    vokiečiai norį stoti Tautvilai į pagalbą. Danielius iš­
    siuntė Tautvilą ", ir jam į pagalbą— rusus bei polovie-
    čius, ir jie ilgai kariavo vieni su kitais.
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-187773

- id: c-170713
  autorius: "Anoniminis metraštininkas"
  šaltinis: "Lietuvos metraštis, Bychovco kronika (1971 m.)"
  citata_originali: |
    Užsidarė pilyje-vorutoje2 3 , ir
    55

    ## Puslapis 51

    (naktį) 2A išsiuntė savo svainį2 5 , ir tas išvaikė ir rusus,
    ir jotvingius. O rytojaus metą prieš vokiečius išjojo
    [Mindaugo kariai), ginkluoti arbaletais; ir jodinėjo ru­
    sai bei poloviečiai su strėlėmis, o jotvingiai su trumpo­
    mis ietimis, ir vaikėsi po lauką, tarytum turnyre. Ir iš
    ten (Tautvilą) sugrįžo namo į Žemaitiją 2 6 .
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-187774

- id: c-175235
  autorius: "Teodoras Narbutas"
  šaltinis: "Teodoras Narbutas, Lietuvių tautos istorija, t. 2 (1995 m.)"
  citata_originali: |
    Turbūt toks
    pavadinimas atsirado iš kažkokio šios upės vandens sko­
    nio ar spalvos panašumo, pastebėto pirmųjų slavų kolo­
    nistų. Panagrinėkime, kaip buvo sakoma senovėje. Ne­
    storas teigia, kad poloviečiai atėjo prie G i urge v o tvirto­
    vės, laikė ją apgulę visą vasarą, bet, negalėdami jos
    įveikti, nesikėlė per Rosés upę, sudarę taiką su Sventopel-
    ku2.
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-192441

- id: c-175236
  autorius: "Teodoras Narbutas"
  šaltinis: "Teodoras Narbutas, Lietuvių tautos istorija, t. 2 (1995 m.)"
  citata_originali: |
    Ka­
    ramzinas, radęs kažkokį Jurjevą prie Rosės upės, tekan­
    čios pro Belaja Cerkovę, Kijevo gubernijoje, šiuos Nes­
    toro žodžius priskiria poloviečių veiksmams dešiniojoje
    Dnepro pakrantėje. Jis net teigia, kad Jurjevas buvo at­
    statytas XII amžiaus pradžioje po to, kai jį sunaikino
    poloviečiai. Tačiau jis prieštarauja sau ir savo tiksliai
    išdėstytoms istorinėms tiesoms, nes ir poloviečių puoli­
    mai iki XII amžiaus pradžios, ir Giurgevo apgultis, pa­
    imti iš Nestoro veikalo, liečia tų barbarų veiksmus kai­
    riojoje Dnepro pakrantėje, į rytus nuo jo.
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-192442

- id: c-175237
  autorius: "Teodoras Narbutas"
  šaltinis: "Teodoras Narbutas, Lietuvių tautos istorija, t. 2 (1995 m.)"
  citata_originali: |
    95
    Pastabos. Mūsų mokslininkas, lietuvių istorijos tyri­
    nėtojas Ksaveras Bogušas priskiria lietuvių genties tau­
    toms iš kitur pažįstamus poloviečius', remdamasis tokio­
    mis pat Kojalavičiaus prielaidomis1 2. Naruševičius patei­
    kia žinių, kurios, rodos, taip pat remia šią nuomonę, kad
    poloviečiai buvę rusų kaimynai nuo saulės patekėjimo ir
    nusileidimo pusių3. Šie teiginiai įpareigoja mus patyri­
    nėti istorinius faktus, kurie geriau paaiškintų tai ir at­
    skleistų tikrą ar spėjamą giminystę, kurią mini mūsų pirm­
    takai.
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-192443

## Ryšiai
- Puolė Poloviečiai: [[objektai/asmenys/Mamajus]]
- Sudarė sutartį su: [[objektai/asmenys/Sventopelkas]]
- Poloviečiai keliavo į [[objektai/vietos/Volga]]
- Poloviečiai apgulė [[objektai/vietos/Giurgevo tvirtovė]]
- Poloviečiai kariavo prieš [[objektai/grupes/Vokiečiai]]
- Poloviečiai rėmė [[objektai/asmenys/Tautvila]]
