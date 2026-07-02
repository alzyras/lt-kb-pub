---
tipas: asmuo
pavadinimas: 'Petras Atsiskyrėlis'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - karalius
  - popiežius
  - valdovas
---
# Petras Atsiskyrėlis

## Santrauka

Dusburgietis teigia, kad prancūzijos karalystės vieną vargšą bei dievotą žmogų, kuris gyveno Amjeno vyskupystėje nuo visų atsiskyręs, todėl jį vadino Petru Atsiskyrėliu, ragindamas jį aplankyti viešpaties kapą bei kitas šventąsias vietas. Dusburgietis teigia, kad petras Atsiskyrėlis smarkiai nuliūdo ir apgraudo, vienas pats nerimastingai svarstydamas, ar negalėtų vienaip ar kitaip pagelbėti prislėgtiesiems. Dusburgietis teigia, kad petras Atsiskyrėlis su anksčiau minėtojo patriarcho Simeono bei kitų tikinčiųjų, gyvenančių Jeruzalėje, laiškais pirmiausia leidosi pas jo šventenybę popiežių Urboną II, kuris jį maloniai priėmė, pervažiavo Italiją ir persikėlė per Alpes, uoliai ragindamas ir visaip skatindamas (mat šitai būta išmintingo žmogaus, gebančio ir veikti, ir kalbėti) tiek Rytų, tiek Vakarų valdovus, tiek žemesnių luomų žmones aliai vieną drąsiai ryžtis sunkiai maldininkų kelionei į Jeruzalę, talkinant viešpačiui, o jo pasiuntiniui savo kalbomis teikiant [kryžininkams] visokeriopų malonių.

## Teiginiai

<a id="claim-t-90005"></a>
- t-001
  global_id: t-90005
  teiginys: 'Petras Atsiskyrėlis smarkiai nuliūdo ir apgraudo, vienas pats nerimastingai svarstydamas, ar negalėtų vienaip ar kitaip pagelbėti prislėgtiesiems.'
  sudarymo_pagrindimas: 'claim_quality_pipeline deterministic repair'
  susije_objektai: 'mentioned_place: Viena; mentioned_place: Prancūzija'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 723052-723860; hash=e4cfc8289ef487dc6df535260fa1ddac875be9326339b03b25610203ca670f57; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: gyveno -> Prancūzija: 0.78
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Petras Atsiskyrėlis: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Prancūzija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Petras apibūdintas kaip žmogus iš Prancūzijos karalystės, todėl vietos ryšys tiesiogiai palaikomas.

<a id="claim-t-90006"></a>
- t-002
  global_id: t-90006
  teiginys: 'Petras Atsiskyrėlis su Jeruzalės patriarcho Simeono laiškais vyko pas popiežių Urboną II ir ragino leistis į kelionę į Jeruzalę.'
  sudarymo_pagrindimas: 'Pirminis teiginys per ilgas; citata palaiko glaustą sakinį apie Petro Atsiskyrėlio veiksmus.'
  susije_objektai: 'llm_object: Italija; mentioned_person: [[objektai/asmenys/Simeonas|Simeonas]]; mentioned_place: Jeruzalė; mentioned_place: Italija; mentioned_place: Viena; llm_object: Jeruzalė'
  semantiniai_rysiai: '[[objektai/asmenys/Petras Atsiskyrėlis|Petras Atsiskyrėlis]] keliavo į Italija; [[objektai/asmenys/Petras Atsiskyrėlis|Petras Atsiskyrėlis]] keliavo į Jeruzalė'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=0159d9ed81282646381521ab6aef9795dc0df20fb80c79af0159c313aafcf80e; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Viena: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Petras Atsiskyrėlis: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Viena: mention_match, place, gap=50
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Petras Atsiskyrėlis" parinktas kaip owner_note_path. Targetas "Viena" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-90007"></a>
- t-003
  global_id: t-90007
  teiginys: 'Pasak Dusburgiečio, Petrui Atsiskyrėliui sapne pasirodęs Jėzus Kristus įpareigojo jį kreiptis į popiežių ir Vakarų valdovus dėl Šventosios Žemės išvadavimo.'
  sudarymo_pagrindimas: 'Reikia šaltinio atribucijos, nes teiginys apie regėjimą; pradinė formuluotė per ilga.'
  susije_objektai: 'llm_object: Italija; mentioned_person: [[objektai/asmenys/Jėzus Kristus|Jėzus Kristus]]; mentioned_person: [[objektai/asmenys/Simeonas|Simeonas]]; mentioned_place: Italija; mentioned_place: Viena'
  semantiniai_rysiai: '[[objektai/asmenys/Petras Atsiskyrėlis|Petras Atsiskyrėlis]] keliavo į Italija'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: 723861-724793; hash=64c7e33e68f62ac43575e272e8eb6a2179954d73cc5c31bf9bbb0d7d085781f6; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: keliavo_i -> Italija: 0.88
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Petras Atsiskyrėlis: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Italija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata aiškiai sako, kad Petras pervažiavo Italiją.

<a id="claim-t-90008"></a>
- t-004
  global_id: t-90008
  teiginys: 'Petras Atsiskyrėlis buvo vargšas ir dievotas žmogus iš Prancūzijos karalystės, gyvenęs atsiskyręs Amjeno vyskupystėje.'
  sudarymo_pagrindimas: 'Citata pagrindžia aiškų biografinį faktą apie Petrą Atsiskyrėlį.'
  susije_objektai: 'mentioned_place: Prancūzija; mentioned_place: Viena; llm_object: Prancūzija'
  semantiniai_rysiai: '[[objektai/asmenys/Petras Atsiskyrėlis|Petras Atsiskyrėlis]] gyveno Prancūzija'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 723861-724793; hash=64c7e33e68f62ac43575e272e8eb6a2179954d73cc5c31bf9bbb0d7d085781f6; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: keliavo_i -> Italija: 0.86
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Petras Atsiskyrėlis: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Italija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo Petro judėjimą per Italiją.
- susijęs iš [[objektai/zodynas/Ordino brolis.md#claim-t-58861|Ordino brolis]]: Petras Dusburgietis buvo Ordino brolis kunigas ir Prūsijos žemės kronikos autorius.
## Reikšmingi paminėjimai

- c-001
  santrauka: 'Petras Atsiskyrėlis buvo vargšas ir dievotas žmogus iš Prancūzijos karalystės, gyvenęs atsiskyręs Amjeno vyskupystėje.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Galop valdovas, ilgokai rūstinamas,
    pajuto širdyje užuojautą, matydamas savo Žmonių sielvartą, ir pakvietė iš. Prancūzijos
    karalystės vieną vargšą bei dievotą žmogų, kuris gyveno Amjeno vyskupystėje nuo visų
    atsiskyręs, todėl  jį vadino Petru Atsiskyrėliu, ragindamas  jį aplankyti viešpaties kapą
    bei kitas šventąsias vietas. Sis, atkeliavęs  į šventąjį miestą, pamatė, jog nedorėliai
    nepagarbiai elgiasi šventose vietose, jog godotinas vyras Simeonas, miesto patriarchas,
    kartu su savo valdiniais nelyginant niekingas vergas, puolęs  į visišką neviltį, kenčia
    begalinę priespaudą; būdamas doras žmogus, didžiai užjausdamas kitus ir iš visos širdies
    mylėdamas prispaustuosius, jis smarkiai nuliūdo ir apgraudo, vienas pats nerimastingai
    svarstydamas, ar negalėtų vienaip ar kitaip pagelbėti prislėgtiesiems.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-004
- c-002
  santrauka: 'Petras Atsiskyrėlis smarkiai nuliūdo ir apgraudo, vienas pats nerimastingai svarstydamas, ar negalėtų vienaip ar kitaip pagelbėti prislėgtiesiems.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Prancūzijos
    karalystės vieną vargšą bei dievotą žmogų, kuris gyveno Amjeno vyskupystėje nuo visų
    atsiskyręs, todėl  jį vadino Petru Atsiskyrėliu, ragindamas  jį aplankyti viešpaties kapą
    bei kitas šventąsias vietas. Sis, atkeliavęs  į šventąjį miestą, pamatė, jog nedorėliai
    nepagarbiai elgiasi šventose vietose, jog godotinas vyras Simeonas, miesto patriarchas,
    kartu su savo valdiniais nelyginant niekingas vergas, puolęs  į visišką neviltį, kenčia
    begalinę priespaudą; būdamas doras žmogus, didžiai užjausdamas kitus ir iš visos širdies
    mylėdamas prispaustuosius, jis smarkiai nuliūdo ir apgraudo, vienas pats nerimastingai
    svarstydamas, ar negalėtų vienaip ar kitaip pagelbėti prislėgtiesiems. Kai vieną naktį
    jis meldėsi dievui bažnyčioje per viešpaties prisikėlimo šventę  ir, nuo ilgo budėjimo
    pavargęs, snūstelėjo ant bažnyčios grindų, sapne jam pasirodė mūsų viešpats Jėzus
    Kristus, įpareigodamas keliauti pas jo šventenybę popiežių bei pas Vakarų valdovus
    dėl šventosios žemės išvadavimo.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-003
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Kai vieną naktį
    jis meldėsi dievui bažnyčioje per viešpaties prisikėlimo šventę  ir, nuo ilgo budėjimo
    pavargęs, snūstelėjo ant bažnyčios grindų, sapne jam pasirodė mūsų viešpats Jėzus
    Kristus, įpareigodamas keliauti pas jo šventenybę popiežių bei pas Vakarų valdovus
    dėl šventosios žemės išvadavimo. Padrąsintas  dieviškojo apreiškimo  ir užsidegęs

    karšta tikėjimo meile, jis su anksčiau minėtojo patriarcho Simeono bei kitų tikinčiųjų,
    gyvenančių Jeruzalėje, laiškais pirmiausia leidosi pas jo šventenybę popiežių Urboną
    II, kuris jį maloniai priėmė, pervažiavo Italiją ir persikėlė per Alpes, uoliai ragindamas
    ir visaip skatindamas (mat šitai būta išmintingo žmogaus, gebančio ir veikti, ir kalbėti)
    tiek Rytų, tiek Vakarų valdovus, tiek žemesnių luomų žmones aliai vieną drąsiai ryžtis
    sunkiai maldininkų kelionei   į Jeruzalę, talkinant viešpačiui, o jo pasiuntiniui savo
    kalbomis teikiant [kryžininkams] visokeriopų malonių.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003
    - t-002
- c-004
  santrauka: 'Petras Atsiskyrėlis buvo vargšas ir dievotas žmogus iš Prancūzijos karalystės, gyvenęs atsiskyręs Amjeno vyskupystėje.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Apie šventosios žemės reikalus

       Neilgai trukus po to, kai imperatorius Heraklijus pasitraukė iš šventosios žemės,
    vienas arabų kunigaikštis, vardu Omaras, trečias Mahometo karalystės paveldėtojas,
    žiauriai įsiveržė  į Šventąją žemę bei ją visą užėmė,  ir šitaip krikščionis, gyvenusius
    Šventajame Jeruzalės mieste bei gretimose žemėse, 490 metų užgulė kankinamai
    sunkus netikėlių  ir žiauruolių valdžios jungas. Galop valdovas, ilgokai rūstinamas,
    pajuto širdyje užuojautą, matydamas savo Žmonių sielvartą, ir pakvietė iš. Prancūzijos
    karalystės vieną vargšą bei dievotą žmogų, kuris gyveno Amjeno vyskupystėje nuo visų
    atsiskyręs, todėl  jį vadino Petru Atsiskyrėliu, ragindamas  jį aplankyti viešpaties kapą
    bei kitas šventąsias vietas.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-005

## Ryšiai
- Petras Atsiskyrėlis keliavo_i [[objektai/vietos/Italija]]
- Petras Atsiskyrėlis gyveno [[objektai/vietos/Prancūzija]]
- Petras Atsiskyrėlis keliavo_i [[objektai/vietos/Jeruzalė]]
