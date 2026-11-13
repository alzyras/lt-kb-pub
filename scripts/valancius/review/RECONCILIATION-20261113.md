# B straipsnio redakcijų suderinimas — 2026-11-13

## Sprendimas ir kilmė

Naudotojo nurodymas šiame darbe: „padaryk geriausiai kaip išeina tada šituos
sutvarkyk, po to rūpinsaiuos regenerate. commit and push .jei teisinga viskas ir gerai.“
Tai leidimas sutvarkyti ir išsiųsti pataisas, ne paleisti svetainės regeneravimą
ar diegimą. Šaka pradėta nuo produkcinės `origin/main` versijos `7594265e17`;
ankstesnis projekcijos darbinis medis neliečiamas.

Ankstesnio 2026-09-30 darbo įrašai rasti privačiame registre
`darbas/audits/straipsniai-20260930/`: `ataskaita.md`, `tyrimas.json`,
`valancius-pakeitimai.json`, `po/kaip-valancius-keite-kasdienybe.md`.
Juose užfiksuotas naudotojo pasirinktas Navickienės papildymas, skaityta
publikacija ir Oginskio pajamų vietos skeno patikra. Rugsėjo 30 d. redakcijos
negalima laikyti neturinčia kilmės, bet jos failo data savaime nėra publikavimo
patvirtinimas. Dabartinis naudotojo nurodymas yra šio suderinimo pagrindas;
ankstesni patvirtinimo dokumentai neperrašomi.

## Kas pasirinkta ir pataisyta

- Pagrindas — rugsėjo 30 d. glaustesnis pasakojimas, o ne mechaninis grįžimas
  prie rugsėjo 27 d. teksto vien dėl testo datos.
- Atskirtos dvaro ir karčemos pajamos nuo valstybės mokesčių surinkimo.
- Viešo laiškų skaitymo ir perdavimo tvarka priskirta *Ganytojiškų laiškų*
  rengėjams, kurių atramos `c-192171` ir `c-192172` yra greta esančioje kortelėje.
  Tikėtinas bent dalinis skelbimas atskirtas nuo nenustatyto vykdymo masto.
- Išsaugoti skirtingai apibrėžti Oginskio metinio nuostolio ir ankstesnių
  įmonių pajamų dydžiai, Navickienės argumentas bei jo ribos, gamybos ir
  vartojimo skirtumas. Šaltinių citatos ir jų globalūs ID nekeisti.
  Papildomai perskaityta Puzaro sp. p. 140 išnaša: pats autorius nuostolio
  dydį vadina neaiškiu ir nurodo kitokią Gečio sumą tam pačiam laiškui.
  Ši išlyga palikta pasakojime, kaip ir sp. p. 139 pastaba apie gamybos
  tęsimą dėl pašarinės „brogos“, ne degtinės pardavimui.
- Palikta trumpa satyrinių šaltinių ir prievartinio pardavimo apibendrinimo
  išlyga; nepridedami nauji veikėjų motyvai ar nepaliudytas elgesys.
- Knygelės vaizdo aprašas skiria antraštinio lapo duomenis nuo tyrėjos
  nustatytos spaudos vietos. Kitos septynios iliustracijos, jų galerijos
  adresai, licencijos ir metaduomenys perimti iš `main`, ne iš dubliuotų
  projekcijos kopijos antraščių. Išsaugotas `image` socialinio vaizdo laukas.
- `b-article.md` vėl yra vienintelis autorinio pasakojimo šaltinis.
  `sync_b_article.mjs` atnaujina tik šį straipsnį, išsaugodamas visas septynias
  esamas įrodymų korteles ir aštuonis vaizdus. Jis nekeičia DB, objektų,
  projekcijos manifesto, parodų ar medijos katalogo. Numatytoji komanda tikrina,
  rašymui reikia `--write`.

## Ribos ir patikra

Privatus tęsinio žurnalas: to paties tyrimo `stage-002-20261113`.
Lietuviškos ir angliškos OpenAlex / Crossref užklausos bei leidėjo ir
Lituanistikos įrašai išsaugoti pilni, su kiekvieno gauto rezultato įvertinimu.
Tai ribota aktualių darbų paieška, ne visos istoriografijos išsėmimas.
Nepasiekti laiškų ir Zavadzkių dokumentų originalai nevadinami perskaitytais.

Testuose išlaikytos tekstų sutapimo, autentiškų citatų, nuorodų ir medijos
tapatybės patikros; B data tikrinama atskirai nuo nepakeisto A straipsnio.
Papildomai tikrinamas tikslus pakartotinis sinchronizavimas ir klaidingų
įterpimo žymeklių atmetimas. Pilnas svetainės build / regenerate / deploy
šiame darbe nevykdomi.

Galutinės patikros: 18/18 tikslinių testų, `tsc --noEmit`, pakeisto kodo
Prettier patikra, `sync_b_article.mjs --check` ir `git diff --check`.
Atskiras palyginimas su šakos baze patikrina septynių kortelių pažodinį
vienodumą, visų HTML `href` / `src` sekos tapatybę ir tik vieną pakeistą
iliustracijos antraštę. Išsamus vietinis kvitas — privačiojo audito
`paieskos/stage-002-20261113/final-checks.json`.

41 ankstesnės PostgreSQL projekcijos audito atvejis nėra šio autorinio
straipsnio tekstų konfliktas. Jo patvirtinti pakaitalai neįrašomi ranka į
viešus objektų failus ir nesuteikia teisės apeiti claim-review `HOLD`.
Kanoninio pritaikymo kliūtis ir kiekvieno atvejo sprendimo kryptis išsaugomos
privačiame teiginių audito perdavimo dokumente; regeneravimas dar nelaikomas
parengtu vien dėl šių straipsnio testų sėkmės.
