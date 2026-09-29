# Svetainės build runneris

`npm run build` yra standartinis public build kelias: pagal nutylėjimą jis
naudoja `auto`, o priverstinį pilną build atlieka `npm run build -- --full`.
Šis public repo runneris naudoja jau eksportuotus failus ir neprijungia
privačios SQLite duomenų bazės. End-to-end projekciją iš DB pradėkite viena
komanda iš `lt-kb` repo:

```sh
uv run lt-kb site regenerate
uv run lt-kb site regenerate --full
uv run lt-kb site regenerate --dry-run --json
```

Auto režimas sugretina DB projekcijos watermarką, manifesto baitus, Quartz
įvesties fingerprintą ir paskutinio sėkmingo output SHA-256 medį. Įvesties
fingerprintas seka `content` symlink tikslus, jų Markdown baitus ir failų datas,
Quartz kodą, konfigūraciją, statinius duomenis, package lockfile, Git reviziją,
aktyvią Node/Python aplinką ir build reikšmingus aplinkos kintamuosius. `.git`,
`node_modules`, `public`, `.cache` ir Quartz transpiliavimo cache neįtraukiami.
Nutrūkę symlink’ai taip pat įtraukiami į fingerprintą su savo taikiniu ir
parodomi JSON ataskaitoje; atsiradus jų taikiniui įvesties fingerprintas
pasikeičia.

Kai DB, įvestys ir visas ankstesnis output sutampa, auto režimas praleidžia
Quartz ir visas brangias patikras. Pasikeitus įvesčiai jis iš naujo patikrina
manifestą ir ryšius. Testus bei TypeScript galima praleisti, jei jų atskiras
kodo, testų, konfigūracijos ir priklausomybių fingerprintas sutampa. Quartz
Jei pasikeitė tik palaikomi Markdown failai ir `quartz/static/graph-data/**`,
maršrutai nesikeitė ir ankstesnė išvestis patikrinta, Quartz naudoja dalinį
emit: perrašo paveiktus puslapius, jų priklausomybes ir globalius indeksus, o
grafiko puslapiams — tik pakitusių objektų shard'us. Nepasikeitus media
katalogui, objektų galerijų emitteris jų iš naujo nerašo. Saugaus dalinio
plano neturint, pakeitus slug'us, tag'us, alias'us, parodos/temų/medijų
įvestis ar build kodą, vykdomas pilnas Quartz kelias.

CSS ir JavaScript URL versija priklauso nuo šiuos išteklius kuriančio kodo,
stilių, konfigūracijos ir priklausomybių, todėl vien Markdown ar grafiko JSON
pakeitimas jos nekeičia. Bendri statiniai JSON duomenys (`contentMeta`, paieška,
grafas ir kiti indeksai) palieka stabilų URL; naršyklė juos užklausia su
`cache: "no-cache"`, kad serveris patikrintų, ar turinys pasikeitė. Taip auto
build'ui nereikia perrašyti visų HTML vien tam, kad pakeistų bendrą versijos
parametrą. Media katalogo puslapiai išlaiko savo turinio SHA-256 versiją.

Kai parserio kodas, visas failų rinkinys, slug žemėlapis ir globalus ryšių
žemėlapis sutampa, tarp paleidimų pakartotinai naudojami suspausti perdirbti
Markdown AST ir VFile duomenys. Pridėjus maršrutus ar pasikeitus jų globaliam
parse kontekstui, cache gali tapti miss ir Markdown bus išparsintas iš naujo.
Turinio baitai ir datos tikrinami atskirai kiekvienam failui. Cache schema,
typed reikšmės, datos ir sugadintų įrašų miss kelias tikrinami testais; cache
talpa pagal nutylėjimą ribojama iki 768 MiB. `SITE_PARSE_CACHE_MAX_BYTES` gali
ją pakeisti. Nepalaikomas VFile duomuo priverčia tą puslapį išparsinti.

`npm run build -- --full` / `uv run lt-kb site regenerate --full` visada
pergeneruoja svetainę ir patikras be ankstesnės Quartz output išvesties
naudojimo. `auto` dalinio build'o metu staging užpildomas ankstesnio patikrinto
output kietosiomis nuorodomis, o pakeisti failai įrašomi atominiu pervadinimu;
todėl paruošimo laikas priklauso nuo output failų kiekio ir failų sistemos.

`public` atnaujinamas tik kai Quartz ir visos patikros pavyksta staging
kataloge. Runneris užrakina vieną public repo; proceso nutraukimo metu likęs
užraktas atpažįstamas pagal PID, o perjungimo žurnalas kitą kartą arba atkuria
seną gerą `public`, arba užbaigia jau patikrintą perjungimą. Nepatikimas cache,
trūkstamas output ar pasikeitusi schema reiškia saugų rebuild. Prieš pažymėdamas
warm no-op arba perjungdamas naują output, runneris dar kartą patikrina įvesties
fingerprintą. Jei įvestis pasikeitė vykstant build'ui, staging atmetamas, senas
`public` paliekamas, o ataskaitoje nurodomi pasikeitę keliai.

Cache galima išvalyti nekeičiant dabartinės svetainės:

```sh
rm -rf .cache/site-regenerate
```

Kitas auto paleidimas tada viską patikrins ir sugeneruos iš naujo. Cache ir
reportai yra ignoruojami Git. CI vykdo `npm run build` be privačios DB; kasdienė
media-host patikra vykdoma atskirame schedule job.
