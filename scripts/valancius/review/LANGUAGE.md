# 2026-09-20 kalbos redakcija

Vartotojo patvirtinti keturi pavadinimai įrašyti į H1, SEO, sąrašus ir ciklo nuorodas:

- [Valančius ir caro valdžia](http://127.0.0.1:8098/straipsniai/motiejus-valancius-ir-rusijos-imperija/).
- [Valančiaus laiškai ir draudžiamos knygos](http://127.0.0.1:8098/parodos/valancius-laiskai-imperijos-seselyje/).
- [Kodėl kaimas gėrė ir kaip Valančius ragino negerti](http://127.0.0.1:8098/straipsniai/kaip-valancius-keite-kasdienybe/).
- [Valančiaus blaivybės brolijos](http://127.0.0.1:8098/parodos/valancius-nuo-sakyklos-iki-skaitytojo/).

Peržiūrėti abu straipsniai, jų antraštės ir perėjimai. Perrašytos visų devynių parodų skyrių įžangos bei visų šešiolikos eksponatų aprašymai. Sutrumpinti teksto komentarai apie patį pasakojimą, pasikartojančios metodologinės išlygos ir abstrakčios išvados. Būtinos ribos paliktos: šaltinio autorius ir adresatas, konkretus laikas bei vieta, gamybos ir vartojimo skirtumas, pažado turinys, vėlesnių atvaizdų datos. Naujos scenos ir dialogai nekurti.

Šio redagavimo tikslas — sklandesnis skaitymas, todėl ankstesnių apimties ribų nebebandyta užpildyti pasikartojimais. A straipsnyje dabar apie 2 161, B — 2 747 pagrindinio teksto žodžiai, neįskaičiuojant įrodymų kortelių ir bibliografijos. Skaitymo laikas atnaujintas. Iliustracijų liko atitinkamai 4 ir 8; kiekvienoje parodoje tebėra 8 eksponatai. Skyrių įžangos tebėra 60–100, eksponatų aprašymai — 70–120 žodžių.

`curation.json` ir `b-article.md` išlaikyti kaip redakciniai šaltiniai. `sync_editorial.mjs` vienodą parodų tekstą perkelia į esamus parodos, galerijos ir eksponatų registro įrašus, nekeisdamas identifikatorių. Pataisyti ankstesni atkūrimo scenarijai, kad sena A kopija ar seni ciklo nuorodų tekstai neperrašytų dabartinės redakcijos. Pagrindinė ir izoliuota darbo bazės šiame kalbos redagavime nekeistos.

Patikros:

- 231 testas ir TypeScript patikra praėjo. Šeši nauji testai tikrina pavadinimus, teksto kopijų sutapimą ir apsaugotų duomenų išsaugojimą.
- Straipsnių `href` ir `src` sekos liko identiškos ankstesnei redakcijai. Visas įrodymų registras, parodų teiginiai, citatos, autorių ir datų laukai patikrinti pagal ankstesnės versijos kontrolines sumas.
- Sėkmingai surinkta vietinė 50 Markdown failų ciklo peržiūra. Patikrinti keturi skirtingi title, aprašymai, canonical ir bendrinimo vaizdai, struktūriniai duomenys, paieška ir juodraščių nebuvimas RSS bei sitemap. Ciklo nuorodų patikra praėjo.
- Keturių puslapių antraštės patikrintos 390, 768 ir 1440 px pločiais abiem temomis. A parodos antraštės kortelei telefone pridėtas `border-box`, kad jos vidiniai tarpai nebeišstumtų teksto už kortelės.
- Abiejų parodų Enter, rodyklės, Tab ir Escape valdymas bei grįžimas iš galerijos patikrinti 390 ir 1440 px pločiais.
- Peržiūros pradžios vaizdai saugomi vietiniame `.cache/valancius-language/screenshots/` kataloge. Jie nėra publikuojami ar įtraukiami į medijos rinkinį.

Tai **vietinė ciklo peržiūra, ne visos svetainės surinkimo rezultatas**. Ankstesni development eksporto neatitikimai šiuo kalbos redagavimu netaisyti. Istorinės suvestinės ir archyvai palikti su to meto pavadinimais. Kūrinių adresai, sukūrimo datos, juodraščio būsena ir `noindex` išsaugoti. Šio etapo pakeitimai necommitinti, nepushinti ir nepublikuoti.
