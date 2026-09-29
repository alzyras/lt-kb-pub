# Giminių straipsnių ir parodų rengimas

## Kalba ir pasakojimas

Vartotojo pageidavimas (2026-09-20): Radvilų ir visų būsimų giminių tekstai turi skambėti natūraliai, turėti daugiau konkretaus istorinio turinio. Rašyti kaip istorijos žurnalui ar muziejaus lankytojui.

- Pradėti nuo žmogaus, įvykio, daikto ar vietos. Pavyzdžiui: „1589 m. Biržuose baigta statyti tvirtovė.“
- Rašyti, kas ką padarė, kada ir kokiomis aplinkybėmis. Pastraipa turi pridėti žinių, o ne pakartoti, kad giminė svarbi.
- Išbraukti sakinius „tai padeda suprasti“, „atveria kitą istorijos kryptį“, „kviečia pažvelgti“, „šiame skyriuje pristatome“. Istorija neturi aiškinti savo rengimo proceso.
- Nekartoti kiekviename skyriuje šaltinių tikrinimo metodikos. Palikti konkrečią svarbią pastabą, pvz., „Pomirtinis portretas, 1781 m.“ Tyrimo planus ir neatliktų darbų sąrašus laikyti darbo failuose.
- Natūralumas nereiškia išgalvotų dialogų, veikėjų minčių, emocijų ar scenų. Vaizdingą detalę imti iš eksponato arba nurodyto šaltinio.
- Ilginti tekstą naujais epizodais: santuokomis, paveldėjimu, mokyklomis, knygomis, ūkio duomenimis, ginčais. Prieš pridedant skaičių ar istoriją patikrinti šaltinį. Neromantizuoti visos giminės.
- Nepradėti visų aprašų ta pačia vardo, datų ir pareigų formule. Vienur pradėti nuo įvykio, kitur nuo paties daikto. Kaitalioti sakinių ilgį, vengti pompastikos ir vienodų trijų dalių išvardijimų.
- Ilgesnį eksponato aprašą dalyti į trumpas pastraipas, tarp jų JSON tekste palikti tuščią eilutę. `family-overview` parodos nerodo pasikartojančių „Parodos pasakojimas“ žymų ir bendro pažado apie kiekvieną teiginį; šaltinių nuorodos lieka prie eksponatų.
- Naudoti aiškias antraštes: „Statkevičius skundžiasi dėl žemės“, o ne „Žemė kaip ginčo objektas“. Pareigas ir istorinius terminus paaiškinti ten, kur jų reikia.
- Prieš įrašant į DB perskaityti tekstą vientisai: ar nėra bereikalingų atsargumo formulių, dirbtinių priešpriešų, pasikartojimų ir sakinių, kuriuos būtų galima įdėti į bet kurios giminės parodą.

## Vienos giminės rezultatas

1. Trumpas kilmės ir šakų paaiškinimas; herbas, titulas, geografinė ir chronologinė aprėptis.
2. Narių registras: kanoninis vardas, datos, šaka, tėvai, sutuoktiniai, vaikai, asmens puslapis ir šaltinis. Moterys registruojamos ir mergautine, ir santuokine pavarde. Skirtingos santuokos neištrinamos.
3. Atskirų asmenų nuopelnai ir veikla: valstybės tarnyba, karyba, raštija, menas, tikėjimas, mokslas, ekonomika; dokumentuoti konfliktai ir priklausomų žmonių padėtis.
4. Valdų lentelė: dabartinis ir istorinis vardas, vietovės puslapis, konkretus savininkas, laikotarpis, paveldėjimas / pirkimas / dovana / įkeitimas / laikinas administravimas. Seniūnija nėra automatiškai privati nuosavybė. Istorinės valdos nėra dabartinės valstybės sienos.
5. Eksponatų sąrašas: originalo katalogas, autorius, kūrinio data, asmens gyvenimo datos, institucija, inventoriaus numeris, licencija, vaizdo failas, patikros rezultatas. Vėlyvas portretas aiškiai vadinamas pomirtiniu atvaizdu. Nerastas portretas nežymimas kaip rastas ir negeneruojamas dirbtiniu intelektu.
6. Savarankiškas apžvalginis straipsnis ir vaizdinė paroda su abipusėmis nuorodomis; narių ir vietų puslapiai susiejami pagal tikrą projekto nuorodų sistemą.
7. Tyrimo užrašai: panaudoti šaltiniai, neapibrėžtumai, trūkstami nariai, kita konkreti užduotis.

## Patikimumas

Vartotojo reikalavimas (2026-09-21): istorinis tikslumas ir konkrečios šaltinių nuorodos yra būtini. Šaltinis pateikiamas prie pastraipos, eksponato ar registro žmogaus, o ne vien bendrame literatūros sąraše. Atskiro asmens puslapyje matomas jo biografijos šaltinis. Katalogo teiginys neperrašomas kaip dokumento citata, jei visas dokumentas neperskaitytas.

Enciklopedijos bendras giminės straipsnis tikrinamas pagal individualias biografijas, mokslinius tyrimus ir institucijų katalogus. Aptikus nesutarimą, užrašyti abu variantus ir pasirinkimo pagrindą. Jei sprendimo nėra, palikti apytikrę datą ar aiškų neapibrėžtumą. Pažadas apie absoliutų neklystamumą nepakeičia tokios patikros.

Pavardės sutapimas, vienas herbas ar automatinis žinių bazės ryšys savaime neįrodo giminystės. Narių failų skaičius yra inventoriaus, ne genealogijos rodiklis. Bendravardžiai atskiriami datomis ir pareigomis. Legendinė kilmė aprašoma kaip legenda su jos autoriumi.

Nuoroda į katalogo įrašą pagrindžia objekto identifikaciją; ji nepakeičia išsamios dokumento transkripcijos. Skundas liudija skundą, o ne savaime įrodo nusikaltimą ar teismo sprendimą. Enciklopedijos tekstas perfrazuojamas, ilgi tekstai nekopijuojami. Šaltinių prieštaravimai paliekami matomi.

## Darbo failai ir svetainė

`scripts/gimines/` saugo planą ir narių inventorius. Šis katalogas neįtraukiamas į viešą svetainę. Vieši straipsniai rašomi `straipsniai/`, parodos aprašomos `quartz/static/exhibitionNobleFamilies.json`, papildomos patikrintos medijos – `quartz/static/nobleFamilyMediaCatalog.json`.

Asmenų failai `objektai/` yra duomenų bazės projekcija. Jų nekeisti ranka ir nekurti dvigubų biografijų: trūkstamus asmenis bei biografijas papildyti per projekto duomenų bazės darbo eigą ir eksportuoti su manifestu. Pradinėje parodoje galima pateikti nuorodą į esamą trumpą kortelę ir atskirą patikrintą biografinį šaltinį.

`node scripts/gimines/sudaryti_registra.mjs` iš naujo sukuria automatinius inventorius ir README. Rankinius tyrimo sprendimus saugoti atskirame `*-tyrimas.md`, kad pakartotinis inventorizavimas jų neperrašytų. Dabartinė paieška yra pagal vardą, todėl giminystės patvirtinimas atliekamas atskirai.
