---
tipas: kokybės auditas
pavadinimas: 'Dviprasmių žmonių auditas - Petras Dusburgietis, Prūsijos žemės kronika (1985 m.) - 2026-05-29'
statusas: reikia patikrinti
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
---
# Dviprasmių žmonių auditas

## Vykdymo metaduomenys
- knyga: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
- source_file: `darbas/sources/Petras Dusburgietis, Prūsijos žemės kronika (1985 m.).md`
- modelis: unknown
- data_ir_laikas: 2026-05-29 13:47 EEST
- paskutinis_promptas: `darbas/prompts/05_quality_control/05_audit_ambiguous_people.md`
- ivykdyti_promptai:
  - `darbas/prompts/00_common/01_rules.md`
  - `darbas/prompts/00_common/03_naming_and_note_style.md`
  - `darbas/prompts/00_common/04_citation_policy.md`
  - `darbas/prompts/00_common/05_linking_rules.md`
  - `darbas/prompts/00_common/06_quality_criteria.md`
  - `darbas/prompts/00_common/07_deduplication.md`
  - `darbas/prompts/00_common/08_person_identity.md`
  - `darbas/prompts/00_common/09_evidence_ledger.md`
  - `darbas/prompts/00_common/10_scale_and_registry.md`
  - `darbas/prompts/00_common/11_claim_level_evidence.md`
  - `darbas/prompts/05_quality_control/05_audit_ambiguous_people.md`

## Įrašas arba kandidatas
- failas: `darbas/tmp/candidates/people/Petras Dusburgietis, Prūsijos žemės kronika (1985 m.).md` — Bernardas / Domininkas / Pranciškus / Augustinas
- problema: Visi keturi kandidatai remiasi vien tik vienvardžiu šventųjų sąrašu stebuklingo regėjimo epizode. Šaltinis nepasako, kuris Bernardas, kuris Augustinas ar kuris Pranciškus turimas galvoje, todėl tai per silpna viešiems asmenų įrašams ar prijungimui prie esamų vienvardžių pastabų.
- citata:
  > Šitaip sugalvojęs, pamatė sapne šventuosius Bernardą, Domininką, Pranciškų ir
  > Augustiną, žingsniuojančius jo brolių priekyje.
- sprendimas: Nekurti atskirų viešų asmenų pastabų ir neprijungti prie esamų vienvardžių įrašų. Laikyti tik kaip neaiškų atradimo signalą.
- būsena: palikti kandidatu

## Įrašas arba kandidatas
- failas: `darbas/tmp/candidates/people/Petras Dusburgietis, Prūsijos žemės kronika (1985 m.).md` — Agota / Boleslovas / Kazimieras / Zemovitas
- problema: Tapatybė čia laikosi tik ant vienos giminystės formulės apie Konrado žmoną ir sūnus. Nė vienas iš šių vardų šiame šaltinio fragmente negauna savarankiško identifikatoriaus, todėl jų kėlimas į viešus įrašus sukurtų labai miglotas vienvardes pastabas.
- citata:
  > Juos išklausęs, minėtasis valdovas Konradas, Lenkijos
  > kunigaikštis, kaip jau esame sakę, nuodugniai visą reikalą apsvarstęs, be to, patartas
  > savo žmonos Agotos bei sūnų Boleslovo, Kazimiero ir Zemovito171, kurie sutartinai viskam
  > pritarė ir vieningai viską palaikė, atidavė Teutonų namų ordino broliams.
- sprendimas: Nepromotuoti į viešas asmenų pastabas, kol neatsiras antras nepriklausomas identifikatorius tame pačiame ar kitame šio šaltinio kūno tekste. Jei kada nors būtų keliama, antraštė turi būti disambigiuota pačiu šaltinio kontekstu, o ne vien vardu.
- būsena: palikti kandidatu

## Įrašas arba kandidatas
- failas: `darbas/tmp/candidates/people/Petras Dusburgietis, Prūsijos žemės kronika (1985 m.).md` — Boguslavas (vyresnysis Dirsovijos grafas) / Boguslavas (jaunesnysis Dirsovijos grafas)
- problema: Abu bendravardžiai pasirodo tik viename liudytojų sąraše ir atskiriami vien formula „vyresnysis / jaunesnysis“. To pakanka atradimo lygiui, bet nepakanka saugiai viešai tapatybei, nes jokio kito individualizuojančio konteksto šaltinis šioje vietoje neduoda.
- citata:
  > Šitai padaryta apie 1226 (1230)
  > viešpaties metus173, dalyvaujant pasirašiusiems liudytojams, būtent: Mazovijos vyskupui
  > Giunteriui, Kujavijos — Mykolui  ir Prūsijos — Kristijonui, abatui Gernuldui, dekanui
  > Vilhelmui, Dirsovijos grafams — vyresniajam ir jaunesniajam Boguslavams.
- sprendimas: Palikti kandidatais ir nekrauti į viešas asmenų pastabas, kol neatsiras savarankiškas kūno-teksto epizodas, kuris bent vieną iš jų identifikuotų ne vien santykiniu amžiaus skirtumu.
- būsena: palikti kandidatu

## Įrašas arba kandidatas
- failas: `darbas/tmp/candidates/people/Petras Dusburgietis, Prūsijos žemės kronika (1985 m.).md` — Karolis (Prancūzijos karaliaus brolis) / Vaclovas (Čekijos karalius)
- problema: Abu kandidatai turi titulą ar ryšį, bet šio šaltinio vietinis tekstas vis tiek neleidžia tiksliai nustatyti, kuris konkretus Karolis ir kuris konkretus Vaclovas turimas galvoje. Tokie atvejai rizikingi, nes iš išorės žinomų identitetų čia naudoti negalima.
- citata:
  > Karolis, Prancūzijos karaliaus brolis, buvo smarkiai sužeistas, nukentėjo ir pats popiežius.
  > Mat jo žirgas suklupo, jį užvertė akmenys, o jam nuo galvos nulėkė vainikas, iš kurio
  > iškrito ir pradingo brangakmenis rubinas, įtaisytas vainiko viršuje ir kainavęs galybę
  > pinigo, o šitai parodė, kokia būsianti jo ateitis (Mart. p. 441; Ptol. p. 1226).
  >
  > 1307 viešpaties metais mirė Vaclovas, Čekijos karalius, o jo sūnus buvo vainikuotas
  > karaliumi Budoje, tačiau tais pačiais metais jį nužudė vienas jo riteris (Ptol. p. 1227),
  > šitaip Čekijos sostas, kuris neturėjo įpėdinių, atiteko svetimiesiems, nes Romos karalius
  > Albrechtas į minėtąjį sostą pakėlė savo sūnų.
- sprendimas: Nelaikyti pakankamai stabiliais viešų asmenų įrašų kūrimui. Palikti kandidatų ar audito lygyje iki aiškesnio paties šaltinio identifikatoriaus.
- būsena: palikti kandidatu

## Įrašas arba kandidatas
- failas: `../lt-kb-pub/objektai/asmenys/Konradas.md`
- problema: Viešas vienvardis įrašas dubliuoja registre jau esantį `Konradas (Mozūrijos kunigaikštis)` ir yra pavojingas šiam šaltiniui, nes čia tas pats asmuo keliskart įvardijamas su aiškiu kunigaikščio titulu. Tolimesnis pildymas į bendrinį `Konradas.md` skatintų neteisingą įvairių Konradų suliejimą.
- citata:
  > Juos išklausęs, minėtasis valdovas Konradas, Lenkijos
  > kunigaikštis, kaip jau esame sakę, nuodugniai visą reikalą apsvarstęs, be to, patartas
  > savo žmonos Agotos bei sūnų Boleslovo, Kazimiero ir Zemovito171, kurie sutartinai viskam
  > pritarė ir vieningai viską palaikė, atidavė Teutonų namų ordino broliams.
- sprendimas: Nepildyti `Konradas.md` šio šaltinio citatomis. Reikia atskiro remonto žingsnio: arba pervadinti šį įrašą į aiškiai disambigiuotą formą, arba sulieti su `Konradas (Mozūrijos kunigaikštis).md`, išlaikant senus `t-*` ir `c-*` identifikatorius.
- būsena: pervadinti

## Įrašas arba kandidatas
- failas: `../lt-kb-pub/objektai/asmenys/Aleksandras.md`; dabartinis kandidatas `Aleksandras`
- problema: Viešas vienvardis įrašas jau žymi kitą Aleksandrą, o dabartinis šaltinis pateikia dar vieną vien vardu minimą 1365 m. žygio dalyvį. Tokia vardinė kolizija ypač pavojinga, nes būtų labai lengva neteisingai prijungti naują citatą prie esamo įrašo vien dėl pirmojo vardo sutapimo.
- citata:
  > 1365 m. Kęstutis,
  > Algirdas, Patrikas ir Aleksandras įsiveržė į Ordino valdas, jas nuniokojo ir po sėkmingo
  > žygio ugnyje dievams paaukojo (sacrificantes diis [...] in ignem proiciunt) vieną vokietį
  > belaisvį.
- sprendimas: Neprijungti šios citatos prie `../lt-kb-pub/objektai/asmenys/Aleksandras.md`. Dabartinį kandidatą palikti nepromotuotą, kol pats šaltinis pateiks antrą identifikatorių; kartu reikia peržiūrėti, ar viešo vienvardžio `Aleksandras.md` pavadinimas pakankamai tikslus.
- būsena: reikia patikrinti

## Įrašas arba kandidatas
- failas: `darbas/tmp/candidates/people/Petras Dusburgietis, Prūsijos žemės kronika (1985 m.).md` — Petras Dusburgietis; `../lt-kb-pub/objektai/autoriai/Petras Dusburgietis.md`; `../lt-kb-pub/objektai/autoriai/Dusburgas.md`
- problema: Tas pats autorius viešajame sluoksnyje jau modeliuojamas dviem skirtingais autoriaus įrašais, o people kandidatas dar papildomai temptų jį į atskirą asmens modelį. Tai tiesiogiai atitinka riziką „person note duplicated as an author without explicit reason“.
- citata:
  > Siekdamas pagrįsti kryžiuočių
  > užkariavimus Prūsijoje  ir jau kuris metas vedamą karą prieš Lietuvą, parodyti
  > Ordino „nuopelnus“, 1326 m. Ordino brolis kunigas Petras iš Dusburgo užbaigė savo
  > kroniką ir įteikė magistrui (ji pratęsta iki 1330 m.). Tai oficialus Kryžiuočių ordino
  > valstybės kūrinys.
- sprendimas: Nekurti viešo `asmuo` įrašo Petrui Dusburgiečiui šiame žingsnyje. Pirma reikia stabilizuoti autoriaus sluoksnį: palikti vieną kanoninį autoriaus įrašą, kitą paversti aliasu ar sulieti, ir tik tada spręsti, ar apskritai reikia atskiro ne-autoriaus asmens modelio.
- būsena: pervadinti
