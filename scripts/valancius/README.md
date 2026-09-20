# Motiejaus Valančiaus ciklas: redakcinė peržiūra

**Aktuali 2026-09-20 kalbos redakcija:** [Keturių kūrinių pavadinimai ir teksto redagavimas](review/LANGUAGE.md). Abiejų straipsnių ir parodų tekstai peržiūrėti vartotojo prašymu. Ankstesnės patikros ir pavadinimai žemiau yra istorinis darbo žurnalas, ne naujos redakcijos būsenos aprašymas.

**2026-09-14 B redakcija:** [B poros suvestinė, vaizdai ir tuometinės patikros](review/B-STATUS.md). Joje aprašytas tuometis sėkmingas pilnas surinkimas ir postbuild. Žemiau paliktas 2026-09-13 žurnalas aprašo dar ankstesnę B redakciją.

2026-09-13. **Vietinis, neindeksuojamas peržiūros variantas. Viešai nepaskelbta.**

## Kūriniai

| Kūrinys | Kelias | Apimtis |
| --- | --- | --- |
| Motiejus Valančius ir Rusijos imperija: tarp lojalumo ir pasipriešinimo | `/straipsniai/motiejus-valancius-ir-rusijos-imperija/` | 2 553 pagrindinio teksto žodžiai, 4 iliustracijos |
| Kaip Motiejus Valančius keitė kasdienybę: blaivybė, mokykla ir knyga | `/straipsniai/kaip-valancius-keite-kasdienybe/` | 2 525 pagrindinio teksto žodžiai, 4 iliustracijos |
| Motiejus Valančius: laiškai imperijos šešėlyje | `/parodos/valancius-laiskai-imperijos-seselyje/` | 4 skyriai, 8 eksponatai |
| Motiejus Valančius: nuo sakyklos iki skaitytojo | `/parodos/valancius-nuo-sakyklos-iki-skaitytojo/` | 4 skyriai, 8 eksponatai |

Straipsniuose neįskaičiuojamos įrodymų kortelės, bibliografija ir navigacija. Parodoms panaudota plane leidžiama mažesnės, dokumentiškai pagrindžiamos atrankos apimtis. Straipsnių ir parodų tekstai savarankiški; A aiškina valdžios ribojimus ir atsaką, B – mokymo, skaitymo ir bendruomenės veikimą.

## Šaltiniai ir patikra

Darbo pagrindas: Petro Puzaro „Vyskupo Motiejaus Valančiaus pastoracinė veikla“, Egidijaus Aleksandravičiaus „Blaivybė Lietuvoje XIX amžiuje“, „Ganytojiški laiškai“ (rengė Vytautas Merkys ir Birutė Vanagienė), Vytauto Merkio „Motiejus Valančius. Tarp katalikiškojo universalizmo ir tautiškumo“. Konkrečių teiginių atramos ir puslapiai pateikti straipsnių kortelėse bei registre; bibliografijos įrašas savaime nelaikomas kiekvienos pastraipos įrodymu.

`evidence-register.json` apima 42 tikrintus kandidatus, iš jų 31 naudojamas kūriniuose. Registre išsaugotos originalios citatos, realūs globalūs `t-…` / `c-…` kodai, PDF puslapiai ir naudojimo vietos. Dokumento tekstas atskirtas nuo leidinio rengėjo komentaro ir vėlesnio istoriko išvados. Puslapiuose vartojamas žymėjimas „PDF p.“, kai spaudinio puslapio numeris nepatvirtintas.

Į izoliuotą bazę per esamą tikrinimo vartą priimti 35 anksčiau tikrinti teiginiai. Eksportuotos tik 24 susijusios objektų kortelės; 16 273 bazinio leidimo failų liko identiški. Originali darbo bazė nekeista. Eksporto sutarties pažeidimų nerasta.

Nenaudoti abejotini kandidatai:

- `t-208765`: sekmadienio ir šventės sutapatinimas.
- `t-209548`: nepakankamai aiški šventimų / konsekracijos datos interpretacija.
- `t-208788`: galimas romėniško mėnesio skaitmens OCR perskaitymas kaip „11“.
- `t-209460`: klaidingas imperatoriaus vardas / OCR.
- `t-209541`, `t-209569`: nutrūkę skaitmenys ar sakiniai.
- `t-209566`: neaktyvus susijusio asmens taikinys.

Šis darbas netvarko visos Valančiaus kolekcijos ir neteigia išsprendęs visų biografinių datų. Nepatikrintos tikslios datos į pasakojimą neįtrauktos. Valdžios dokumentų faksimilės, kurių pirminė kilmė nepatvirtinta, neatrinktos; paroda A jų neturi pakeistų tariamomis iliustracijomis.

## Eksponatai ir likusi publikavimo sąlyga

16 atskirų istorinių vaizdų: VU bibliotekos laiškai, rankraščiai ir spaudiniai, muziejų portretai, leidinių antraštiniai lapai, 1861 m. medžio raižinys, vėlesnis atminimo medalis ir 1898 m. albumo atvaizdas. Parodų tarpusavio ir esamų parodų dubliavimo testai praeina. Generuotų rekonstrukcijų nėra. Vėlesni atvaizdai pažymėti; medalio sukūrimas nesutapatintas su jo legendoje minima data.

**Prieš publikavimą būtina išspręsti vieną eksponato kilmės spragą:** „Senas auksa altorius“ (1864) reprodukcija iš Giedriaus Subačiaus pristatymo per Wikimedia Commons neturi patvirtinto dabartinio originalaus egzemplioriaus saugotojo ir pirminio katalogo įrašo. Kortelėje ir šaltinio metaduomenyse išsaugota `publication-hold` pastaba. Ji pateikta tik peržiūrai; jos negalima paskelbti kaip visiškai patikrinto kataloginio eksponato. Sprendimas – nustatyti konkretaus egzemplioriaus kilmę arba pakeisti jį patikimai identifikuotu leidiniu. Rodoma knyga nevadinama Antaninai Radavičienei priklausiusiu egzemplioriumi.

Išsamūs eksponatų kilmės, datavimo, licencijų, raiškos ir katalogų duomenys: `exhibit-register.json`. Autorystė / datos / pasakojimai saugomi `curation.json`. CC BY atvaizdai turi atribuciją, viešosios srities žyma nesutapatinta su autorystės nežinojimu. VU biblioteka prašo pranešti apie vaizdų naudojimą; šiame darbe jokio laiško nesiųsta.

## Įgyvendinimas ir atkuriamumas

Izoliuota darbo kopija: `lt-kb-pub-valancius`, bazė `94e47be52d27f383c64b7f7f19112cb8a2af4bff`. Naudojami esami Markdown, galerijos, parodų, paieškos ir eksporto mechanizmai. Papildyti pasirenkami `seo_title`, `relatedContent` ir juodraščio metaduomenų perdavimas. Esamiems puslapiams išlieka ankstesnės numatytosios reikšmės.

Backend pataisos yra gretimame `lt-kb`: `media/exhibitions.py`, `media/importer.py`, siaura `core/workflow_state.py` papildymo pataisa ir atitinkami testai. `workflow_state.py` jau turėjo vartotojo pakeitimų; jų neperrašyti. Pataisa atskiria stabilų globalų teiginio kodą nuo iš naujo numeruojamo vietinio kodo, kad papildant projekciją neprapultų nauji teiginiai. Frontend citatų skaitymas iškoduoja JSON kabutes ir eilučių lūžius, išlaikydamas originalią citatą.

Pradinė izoliuota bazė buvo suspausta ir patikrinta baitų tikslumu; tik tada pašalinta jos nesuspausta kopija. Vėliau vykstant darbui išnyko visas `.cache` katalogas, įskaitant archyvą. Originali bazė nepakeista; straipsniai, eksportuotos kortelės, medijos failai, abu registrai ir autorinė parodų atranka išliko už laikino katalogo ribų. Nauji patikrų failai saugomi `review/`.

**Izoliuota būsena atkurta į `.valancius-state/workflow.sqlite3`.** `restore_preview_state.py` saugiai klonavo nekintantį šaltinį, per esamą `promote_verified_claims` vartą vėl priėmė tuos pačius 35 kodus ir per esamus medijos bei parodų importuotojus atkūrė 16 eksponatų ir dvi juodraštines parodas. Kvitas: `review/restored-state.json`. Ši bazė nėra įtraukta į Git ar svetainės turinį. Negalima perrašyti aktualios bazės šia pilna kopija: po turinio patvirtinimo atranką reikia pritaikyti tuomet aktualiai bazei per tą patį tikrinimo ir eksporto procesą.

Atkuriama peržiūros seka: `restore_preview_state.py` → `check_restored_projection.py` → `wire_articles.ts` → svetainės surinkimas. Palyginimo skriptas iš naujo eksportuoja 24 korteles į atskirą katalogą, palygina jas baitų tikslumu ir tik sutapus susieja manifestą su atkurtos bazės `render_state`; peržiūros Markdown neperrašo. `register_exhibits.ts` atkuria eksponatų registrą iš autorinės atrankos ir medijos eksporto. Pirminio surinkimo `build_preview.py`, `render_evidence.py`, `scoped_manifest.py` ir katalogų paieškos skriptai palikti kaip darbo receptai, tačiau jiems reikia atkurto katalogų darbo rinkinio. Šie skriptai nėra savavališko publikavimo komanda.

## SEO ir publikavimas

Keturi savi canonical, atskiri trumpi SEO pavadinimai, aprašymai ir bendrinimo vaizdai. Straipsniuose `Article` su redakcijos autoryste; parodose `CollectionPage` / `ItemList`. Panaudotos [Google Article](https://developers.google.com/search/docs/appearance/structured-data/article) ir [vaizdų SEO](https://developers.google.com/search/docs/appearance/google-images) gairės. Lankomumo ar reitingų pažadų nėra.

Peržiūros puslapiai sąmoningai turi `noindex`, todėl į viešą sitemap ir RSS neįtraukiami; vidinėje peržiūros paieškoje ir sąrašuose jie pasiekiami. Tik patvirtinus turinį ir išsprendus eksponato spragą galima pakeisti publikavimo būsenas, nustatyti faktines publikavimo datas, pakartoti testus ir taikyti esamą svetainės publikavimo procesą. Po publikavimo reikės patikrinti tikrus viešus adresus, canonical, vaizdus ir sitemap. Naujo sekimo ar automatinių pranešimų nepridėta.

## Patikrų žurnalas

- 220 frontend testų, 37 testų grupės: praeina.
- TypeScript `tsc --noEmit`: praeina.
- 7 tiksliniai backend testai: praeina.
- DB projekcijos manifestas: praeina, 16 297 failai.
- Šaltinių ryšių patikra: praeina, 16 134 objektų failai ir 139 716 ryšių žymų.
- Ciklo surinkimas esamu Quartz varikliu iš 41 pasirinkto Markdown failo: praeina; sugeneruoti 16 588 failai, įskaitant bendrą medijos katalogą. Tai dalinė peržiūra, ne viso korpuso surinkimas.
- Keturių puslapių SEO, ciklo navigacija, sąrašai, paieška, juodraščių nebuvimas sitemap/RSS ir 117 įrodymų / galerijos nuorodų: praeina (`review/preview-verification.json`).
- Ciklo įrodymų puslapių patikra: 0 problemų (`review/scoped-evidence.log`).
- Sugeneruoto medijos katalogo SEO: 1 679 įrašai, 0 problemų (`review/scoped-media-seo.log`).
- 24 naršyklės atvejai: 390 / 768 / 1440 px, šviesi ir tamsi temos, keturi puslapiai. Vaizdai įkeliami, antraštės ir eksponatų blokai telpa (`review/browser-qa-scoped.json`).
- Peržiūros langas: keturi klaviatūros atvejai, veikia Enter, rodyklė, Tab ir Escape; uždarius išlieka slinktis (`review/viewer-qa.json`).
- Grįžimas iš abiejų parodų galerijos kortelių: HTTP 200, grįžtama prie konkretaus eksponato (`review/gallery-return-qa.json`).
- Ankstesnių dviejų straipsnių ir keturių parodų vaizdinė regresija: 12 atvejų be antraščių ir eksponatų išsikišimo (`review/regression-qa.json`).
- **Pilno svetainės surinkimo ir viso postbuild patikrų rinkinio vartas neužbaigtas.** Du paskutiniai pilni bandymai baigėsi SIGTERM (143), be programos klaidos žurnale. Kas nutraukė procesus, nenustatyta. Siauresnės patikros šio vartų rinkinio nepakeičia.

Pirmas pilnas surinkimas pasiekė numatytąjį Node atminties limitą; kitas sustojo dėl vietos diske trūkumo. Vėliau du procesai nutraukti SIGTERM. Vietinis macOS/APFS pagalbinis `compact-preview-runtime.mjs` skaidriai suspaudžia tik šios kopijos `public/` generuojamus failus ir patikrina kiekvieno kopijavimo baitų tapatumą. Tai nekeičia HTML, serverio ar testų reikalavimų ir nėra publikavimo funkcija. Pilno surinkimo komanda: `NODE_OPTIONS='--max-old-space-size=12288 --import /Users/tomas/Documents/important/lt/lt-kb-pub-valancius/scripts/valancius/compact-preview-runtime.mjs' node quartz/bootstrap-cli.mjs build --concurrency=4`. Turinys imamas iš esamo `content` katalogo, ne visos repozitorijos šaknies. `public/` po nutraukimo yra nepilnas ir nėra perduodama peržiūra.

## Veikianti dalinė peržiūra

Atidaryti [peržiūros suvestinę](review/STATUS.md). Serveris `http://127.0.0.1:8098` rodo `.valancius-state/preview-public`. Keturi ciklo puslapiai, naudojami įrodymai ir galerijos kortelės patikrinti; kitų visos svetainės sričių ši kopija neatkuria. Nieko nekelti į produkcinę aplinką iš šio katalogo.

Pakartojimas: `node scripts/valancius/prepare_scoped_preview.mjs`, tada `NODE_OPTIONS=--max-old-space-size=8192 node quartz/bootstrap-cli.mjs build -d valancius-preview-input -o .valancius-state/preview-public --concurrency=2`, tada `PUBLIC_ROOT=.valancius-state/preview-public npx tsx scripts/valancius/verify_preview.ts`. Tai tie patys komponentai ir emitavimo mechanizmai, o ne atskiras parodų variklis. Įvesties kopijų negalima įtraukti į Git; baigus jos perkeltos į `.valancius-state/scoped-input-final`. Naujas pasiruošimo vykdymas sukuria šviežią kopiją.

Paskutinėje HTML patikroje sutvarkyta nutrūkusi A metaaprašo mintis ties „1863 m.“, nuorodų į generuojamus įrodymų / parodų puslapius pašalinimas ir pakartotinio citatų susiejimo kuriamos įdėtinės nuorodos. Parodų įrodymai dabar naudoja tą patį puslapiavimo nuorodų mechanizmą kaip objektų kortelės.
