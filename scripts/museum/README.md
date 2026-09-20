# Muziejinė peržiūra ir turinio atnaujinimas

Ši šaka skirta vietinei peržiūrai. Valdovų paroda lieka backend juodraštis;
publikuojama `main` šaka nekeičiama.

## Vienas valdovų registras

`quartz/static/rulersSource.json` naudoja pradinis puslapis ir chronologinė paroda.
33 biografinės sekcijos apima pakartotinius ir ginčijamus valdymus; Žygimantas
Augustas turi vieną objekto puslapį ir vieną biografiją abiejų epochų sandūroje.
Pasakojimų šaltinis yra `narratives.md`, atvaizdų dokumentai – `reviewed-media/`.
Portretų datos nurodo kūrinio sukūrimą, ne vaizduojamo žmogaus gyvenimą.

`build_curated_input.py` surenka peržiūrėtą turinį. Backend
`lt_kb_app.tools.museum_curated` įrašo kanoninius objektus, mediją ir parodos
juodraštį. `project_curated.mjs EXPORT_DIRECTORY` projektuoja šį išrašą,
išsaugodamas vietinio įrodymų korpuso turinį.

## Vikipedija visuose objektuose

Vikipedijos įžanga yra visas pirmas tikras straipsnio paragrafas originalo kalba.
Ji nėra parodos pasakojimas ar vietiniais šaltiniais paremta santrauka.
Pirmenybė teikiama lietuviškai versijai; užsienio kalba lieka aiškiai pažymėta.
VLE gali papildyti šaltinius, tačiau nepakeičia Vikipedijos citatos jos vardu.

Backend `wikipedia_snapshot.py` iš atvaizduoto straipsnio ištraukia pagrindinės
infobox lentelės tekstines eilutes, antraštes, kelių pareigybių blokus ir
langelių jungimą. Laukų sąrašas neribojamas iš anksto. Atvaizdai tikrinami
atskiru medijos procesu. Lentelės neturintis straipsnis pažymimas
`absent_in_source`; nepavykusi užklausa negali būti paskelbta kaip pilnas įrašas.

Visi nauji ar atnaujinami moduliai reikalauja `wikipedia-rendered-v2`, tikros
įžangos ir revizijos identifikatoriaus. Senos dalinės lentelės reikalauja
atnaujinimo. `wikipedia-snapshots.json` saugo 41 valdovų ir vietų tikslų momentinį
įrašą, kad parodos perrinkimas negrąžintų ankstesnių sutrumpintų santraukų.

Jau susietiems objektams atnaujinti:

```sh
# Backend aplanke; inventory: [{"notePath":"objektai/...md","url":"https://lt.wikipedia.org/wiki/..."}]
uv run python -m lt_kb_app.tools.wikipedia_backfill inventory.json \
  --cache SNAPSHOT_CACHE --output wikipedia-backfill.json \
  --database darbas/state/workflow.sqlite3 --apply

# Svetainės aplanke
node scripts/museum/project_wikipedia.mjs PATH_TO/wikipedia-backfill.json
```

Inventoriuje naudojamos patikrintos objektų tapatybės, ne spėjamos nuorodos pagal
vardą. Užklausos ribojamos, pakartotinis paleidimas naudoja revizijų podėlį.
Atnaujinimas neliečia vietinių teiginių ir jų citatų. 2026-09-20 patikrintas
522 susieti objektas: 171 straipsnis turi pagrindinę lentelę, 351 jos neturi.
Tai nėra teiginys, kad kiekvienam iš viso korpuso objektų jau rastas straipsnis.

## Dizaino patikros

Hero geometriją rezervuoja nematomas viso ciklo teksto matavimo sluoksnis.
Ryšių snaigė rodo visus unikalius tikrus kaimynus, stabiliai sugrupuotus pagal
tipą ir bendro registro spalvas. Judesys valdomas vienu animation frame ir
išjungiamas telefone bei su `prefers-reduced-motion`. Fokusas išryškina žemėlapį.

Prieš integravimą: `npm run prebuild`, `npm run build` (su postbuild auditais),
backend objektų / Vikipedijos / parodų testai ir naršyklės peržiūra.
Atkuriami ankstesnių kopijų taškai: `checkpoint/museum-*` Git refs ir
gretimas `lt-kb-checkpoints/museum-20260920` aplankas.
