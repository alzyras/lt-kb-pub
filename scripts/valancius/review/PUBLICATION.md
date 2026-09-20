# Valančiaus ciklo publikavimas · 2026-09-20

Vartotojas patvirtino publikavimą: „tai publikuok į viešą svetainę“.
Ši suvestinė pakeičia ankstesnių peržiūros žurnalų publikavimo būseną.

Publikuojama rugsėjo 20 d. kalbos redakcija: „Valančius ir caro valdžia“,
„Valančiaus laiškai ir draudžiamos knygos“, „Kodėl kaimas gėrė ir kaip
Valančius ragino negerti“, „Valančiaus blaivybės brolijos“. Nuolatiniai adresai
nesikeičia. Parodose — po 8 eksponatus; straipsniuose — 4 ir 8 iliustracijos.
Pašalintos juodraščio žymos, leidžiamas indeksavimas. Straipsnių publikavimo
data — 2026-09-20; darbo sukūrimo data 2026-09-13 išsaugota atskirai.

## Integracija su dabartine svetaine

Izoliuota `lt-kb-pub-valancius-release` kopija pradėta nuo viešos `main`
versijos `b691c5af465ccdabac95d0cfce4a7e6341dfcd92`. Neperkeliami nesusiję
`development` ar pagrindinės darbo kopijos necommitinti pakeitimai.

`merge_release_evidence.mjs` sujungia tik 33 ciklui reikalingas korteles.
Abiejų įvesčių kontrolinės sumos turi sutapti su jų projekcijų manifestais.
Išsaugomi visi dabartinio leidimo globalūs teiginių ir citatų identifikatoriai,
naujesni objektų moduliai, santraukos bei kitas kortelių turinys. Perskaičiuojami
tik puslapių vietiniai numeriai ir citatų atgalinės nuorodos; nauji globalūs
identifikatoriai neskiriami. Manifestas saugo abiejų įvesčių kilmės kontrolines
sumas pagal esamą sudėtinių `authored_object_page` projekcijų modelį.
Detalus kvitas: `release-evidence-merge.json`. Regresijos testai tikrina ir
senų įrodymų išsaugojimą, ir visų naudojamų redakcinių citatų tapatumą.

Pagrindinė `workflow.sqlite3` neperrašyta. `publish_source.py` į atskirą
APFS klonuotą leidimo bazę per esamą parodų importuotoją įrašo patvirtintus
tekstus ir publikavimo metaduomenis. Įprastas eksportuotojas patvirtina jų
išsaugojimą; tikrinami ir originalių šaltinių poslinkiai. Visos senos bazės
negalima kelti ant aktualios. Autoriniai šaltiniai tebėra `curation.json`,
`b-article.md` ir peržiūrėtas įrodymų registras. `sync_editorial.mjs` dabar
išsaugo ir aiškiai patvirtintą publikavimo būseną. Istoriniai peržiūros
atkūrimo įrankiai savaime netapo leidimu publikuoti.

## Leidimo vartai

Prieš produkcinį diegimą būtinas visas įprastas `prebuild`, pilnas Quartz
surinkimas ir `postbuild`. GitHub Pages diegia tik po sėkmingo build darbo.
Po diegimo tikrinami keturi vieši adresai, vaizdai, canonical, indeksavimas
ir sitemap. Šio dokumento parengimas pats savaime nereiškia, kad diegimas
jau įvyko; galutinis rezultatas patvirtinamas diegimo kvitu ir viešais puslapiais.
