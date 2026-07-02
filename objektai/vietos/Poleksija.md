---
tipas: vieta
pavadinimas: 'Poleksija'
saltiniai:
  - 'Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)'
datos:
  - '1383 m.'
date_start: '1383'
date_end: ''
sukurta: ''
atnaujinta: ''
amziai:
  - 'XIV'
---
# Poleksija

## Santrauka

Poleksiją, lietuviams priklausiusį kraštą, nusiaubė Mazovijos ir Kujavijos kariai. Goštautui išvykus į Tikociną Palenkėje, arba Poleksijoje, Vilniuje minia nužudė krikščionių tikėjimo skelbėjus. Jogaila siekė išvyti Jonušą iš Poleksijos, kurią šis buvo neseniai atėmęs iš lietuvių.

## Teiginiai

<a id="claim-t-185245"></a>
- t-001
  global_id: t-185245
  teiginys: 'Poleksiją, lietuviams priklausiusį kraštą, nusiaubė Mazovijos ir Kujavijos kariai.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Pašalintas vertinamasis kontekstas ir paliktas faktas apie Poleksiją.'
  susije_objektai: 'llm_object: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_place: Kujavija; mentioned_place: Mazovija; mentioned_group: [[objektai/grupes/Kryžiuočių ordinas|Kryžiuočių ordinas]]; mentioned_place: Liublinas; mentioned_place: Prūsų žemė'
  semantiniai_rysiai: 'Poleksija priklausė [[objektai/grupes/Lietuviai|Lietuviai]]'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 219023-219760; hash=cd112634477f9e062bc85d476058f3cd55e11d58ead41ab33d8e577b333493d7; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: priklause -> Lietuviai: 0.91
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Poleksija: llm_allowed_candidate, place
  ryšio_targeto_parinkimas: Lietuviai: llm_allowed_candidate, group
  ryšio_paaiskinimas: Teiginys tiesiogiai pasako, kad Poleksija buvo lietuviams priklausęs kraštas.

<a id="claim-t-185246"></a>
- t-002
  global_id: t-185246
  teiginys: 'Goštautui išvykus į Tikociną Palenkėje, arba Poleksijoje, Vilniuje minia nužudė krikščionių tikėjimo skelbėjus.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Išplėstas įvardis ir suformuluotas pilnas faktinis sakinys.'
  susije_objektai: 'llm_object: Tikocinas; mentioned_place: Vilnius; llm_object: Vilnius; mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_object: [[objektai/daiktai/Kryžius|Kryžius]]; mentioned_person: [[objektai/asmenys/Algirdas|Algirdas]]; mentioned_person: [[objektai/asmenys/Goštautas|Goštautas]]; mentioned_place: Tikocinas'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 392108-392931; hash=dea7789dbac3a4c331af3f3bdb4846e3dfa1fce26b75ff693f8fb60c03170242; match=ocr_normalized
  sprendimo_priezastis: auto
  ryšio_patikimumas: keliavo_i -> Tikocinas: 0.89
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Goštautas (vyskupas, XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Tikocinas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo Goštauto išvykimą į Tikociną.

<a id="claim-t-185247"></a>
- t-003
  global_id: t-185247
  teiginys: 'Jogaila siekė išvyti Jonušą iš Poleksijos, kurią šis buvo neseniai atėmęs iš lietuvių.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Pašalinti pertekliniai kontekstiniai intarpai, išlaikytas faktas apie Poleksiją.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Lietuviai|Lietuviai]]; mentioned_place: Lietuva; mentioned_group: [[objektai/grupes/Bajorai|Bajorai]]; mentioned_place: Mazovija'
  temporaliniai_duomenys: 'įvykio data: 1383 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Pašalinti pertekliniai kontekstiniai intarpai, išlaikytas faktas apie Poleksiją.'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: 478492-479424; hash=8768e0046d182828d35d90a03f7c7a16b269d39376bb87d96a9c76b5d7d9a48d; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Lietuva: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Poleksija: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Lietuva: mention_match, place, gap=46
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Poleksija" parinktas kaip owner_note_path. Targetas "Lietuva" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-185248"></a>
- t-004
  global_id: t-185248
  teiginys: 'Atgavus Poleksiją, didesni rūpesčiai paskatino kariuomenę skubėti į tėvynę.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Sakinys pataisytas nuo OCR klaidų ir padarytas gramatiškas.'
  susije_objektai: 'mentioned_place: Kamenecas'
  pagrindžia:
    - c-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: 479741-479993; hash=853325913ed73c113facbfadb06ec2bb5918daf4f5fd56b9f0e62b25f2ce6969; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Kamenecas: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Poleksija: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Kamenecas: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Poleksija" parinktas kaip owner_note_path. Targetas "Kamenecas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
- susijęs iš [[objektai/asmenys/Jonušas (Mazovijos kunigaikštis).md#claim-t-185986|Jonušas (Mazovijos kunigaikštis)]]: Jonušas atsisakė suteikti pagalbą, sulaužė sutartį ir, įsiveržęs į Poleksiją, užėmė Drohičiną, Melniką, Suražą bei Kamenecą.
- susijęs iš [[objektai/asmenys/Jonušas (Mazovijos kunigaikštis).md#claim-t-185986|Jonušas (Mazovijos kunigaikštis)]]: Jonušas atsisakė suteikti pagalbą, sulaužė sutartį ir, įsiveržęs į Poleksiją, užėmė Drohičiną, Melniką, Suražą bei Kamenecą.
- susijęs iš [[objektai/grupes/Lietuviai.md#claim-t-184543|Lietuviai]]: Lietuviams sulaužius sutartį, jiems priklausanti Poleksija buvo nusiaubta Mazovijos ir Kujavijos karių.
- susijęs iš [[objektai/ivykiai/Jonušo antpuolis į Poleksiją ir pasienio pilių užėmimas.md#claim-t-185708|Jonušo antpuolis į Poleksiją ir pasienio pilių užėmimas]]: Jonušas nesuteikė Kęstučiui pagalbos, užpuolė Poleksiją ir staigiu įsiveržimu užėmė Drohičiną, Melniką, Suražą bei Kamenecą.
- susijęs iš Tikocinas: Goštautas kartą išvyko į Tikociną Palenkėje, arba Poleksijoje.
- susijęs iš [[objektai/asmenys/Jogaila.md#claim-t-184721|Jogaila (kunigaikštis, XIV–XV a.)]]: Sulaukęs paramos iš Livonijos ir Prūsijos, Jogaila su kariuomene traukė iš Vilniaus.
- susijęs iš Livonija: Jogaila, gavęs paramą iš Livonijos ir Prūsijos, su kariuomene traukė iš Vilniaus.
- susijęs iš Vilnius: Jogaila, gavęs paramos iš Livonijos ir Prūsijos, su kariuomene traukė iš Vilniaus.
## Reikšmingi paminėjimai

- c-001
  santrauka: 'Poleksiją, lietuviams priklausiusį kraštą, nusiaubė Mazovijos ir Kujavijos kariai.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Lietuvių kariaunos, pakviestos iš sodybų, nesutik-
    damos pasipriešinimo, niokojo Liublino kraštą, nes
    bajorija, valdovo sutriuškinta prie Bogucino, arba iš tie­
    sų negalėjo priešintis, arba dėjosi negalinti, norėdama
    savo nuostoliais sukelti dar didesnę valdovo neapykan­
    tą. Tačiau ir lietuviai, sulaužę sutartį, gavo tinkamą
    atlygį už šią piktadarybę: apie tą patį laiką Poleksija,
    jiems priklausąs kraštas, buvo nusiaubta karių iš Ma­
    zovijos ir Kujavijos. Be to, jie paėmė nemažą grobį ir
    Prūsijoje, tačiau prūsų padėtis po kelių sėkmingų žy­
    gių prieš kryžiuočius gerokai sustiprėjo: jie menkai pa­
    juto nuostolius, juo labiau kad sunkesnių plėšikiškų
    antpuolių atveju čia pat stovėjo pasirengę padėti lie­
    tuvių ir žemaičių būriai.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-002
  santrauka: 'Goštautui išvykus į Tikociną Palenkėje, arba Poleksijoje, Vilniuje minia nužudė krikščionių tikėjimo skelbėjus.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Mat Goštautas buvo la-
    Š v e n to
    P ra n cišk a u s
    bai įtakingas ir galingas Lie-
    o id in o  b ro lia i n u kan -
    tuvoje: kai Algirdas kur iš-
    k in a m i V iln iu je
    vykdavo, jis valdydavo val­
    stybę. Kol jis pats gyveno
    Vilniuje, krikščionių tikėjimo skelbėjai buvo saugūs,
    tačiau, jam išvykus (kartą iškeliavo į Tikociną Palen­
    kėję, arba Poleksijoje), minia, kažin kieno sukursty­
    ta, žiauriai su jais susidorojo. Vienas būrelis iš sep­
    tynių vienuolių buvo prievarta išvilktas iš namų į aikš­
    tę, kur jie, miniai piktažodžiaujant, buvo nukirsdinti,
    tuo būdu pašventindami savo krauju lietuvių žemes
    Kristaus mokslo sėjai; kitas būrelis, taip pat iš septy­
    nių vienuolių, buvo nutemptas į kalną, kurį žmonės
    vadina Plikuoju, čia juos prie kryžių pririšo ir nuo
    stataus kalno šlaito nustūmė į papėdėje tekančią Vil­
    nią.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
- c-003
  santrauka: 'Jogaila siekė išvyti Jonušą iš Poleksijos, kurią šis buvo neseniai atėmęs iš lietuvių.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Todėl neilgai jis
    dangstė veidą atšiaurumo kauke: netrukus, pažadėjęs
    pagalbą, paskyrė Vytautui būstą Marienburge, ypač
    paakintas to, kad iš Žemaitijos bei tų Lietuvos žemių,
    kurios priklausė Kęstučiui,
    1383 m e ta i
    traukė pas Vytautą žymūs
    bajorai ir, aukodami savo
    turtus, baudėsi sukurstyti karą prieš Jogailą. Tuo tar­
    pu Jogaila, užkirtęs, kaip jis manė, kelią vidaus ne­
    santarvei, nukreipė jėgas prieš išorinį priešą, norėda­
    mas jį išvyti iš Poleksijos, kurią Jonušas, Mazovijos
    kunigaikštis, kilus nesutarimams tarp Lietuvos valdo­
    vų, buvo neseniai atėmęs iš lietuvių. Iš pradžių nuve­
    dė kariuomenę prie Drohičino; sutikęs čia stiprų pasi­
    priešinimą, ėmė veržliais ant-
    Jo g a ila
    atsiim a
    iš
    puoliais
    kamuoti
    gynėjus,
    M a z o v ijo s  P o lek siją
    ypač po to, kai Sašinas, ku­
    nigaikščio
    rūmų
    maršalas,
    prasiskynė kelią per užpuolėjų eiles ir su šimtine rai­
    telių, ginkluotų ietimis bei arbaletais, prasiveržė į pilį.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003
- c-004
  santrauka: 'Atgavus Poleksiją, didesni rūpesčiai paskatino kariuomenę skubėti į tėvynę.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Praėjus kelioms
    dienoms, pasidavė Suražas, vėliau po staigaus antpuolio
    275

    ## Puslapis 274

    užėmė Melniką. Kamenecą atėmė iš priešo po as­
    tuonių apsiausties dienų. Sėkmingai atgavus Poleksi-
    ją, kur kas didesni rūpesčiai paragino skubėti į tėvy­
    nę.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-004

## Ryšiai
- [[objektai/asmenys/Jonušas (Mazovijos kunigaikštis)]] puole Poleksija
- Poleksija priklause [[objektai/grupes/Lietuviai]]
