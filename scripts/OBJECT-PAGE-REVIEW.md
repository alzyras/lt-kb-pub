# Objektų ir katalogų peržiūra

2026-09-17. Bendras pilnų ryšių šaltinis naudojamas objekto tabams, ryšių
grupėms, mažajam žemėlapiui, žemėlapio JSON fragmentams ir didžiajam žemėlapiui.
Pasirenkami bendro paminėjimo sluoksniai lieka atskiri nuo objekto ryšių;
puslapių nuorodos aiškiai pažymėtos. Teiginių archyvas nepraranda teiginių,
kuriems vieša citata dar nesusieta, tačiau jie netampa patvirtintais santraukos
faktais. Citatos nėra savarankiškos teiginių kortelės.

## Vietinė peržiūra

Paleisti iš svetainės checkout:

```sh
PORT=8104 OBJECT_NOTE='objektai/asmenys/Vytautas.md' node scripts/preview_object_page.mjs
```

Pasirenkamas `OBJECT_FINISHER_CONTENT_ROOT` nurodo DB projekcijos katalogą,
iš kurio tik vietinei peržiūrai paimami užbaigimo moduliai. Teiginių ir ryšių
korpusas lieka iš dabartinio checkout. Peržiūros kandidatas nėra automatiškai
publikuojamas. `OBJECT_PREVIEW_PUBLIC_ROOT` gali nurodyti pilno build katalogą
kitų puslapių nuorodoms. Peržiūra nekeičia DB ar Markdown failų.

Tiesiogiai peržiūrimi `/objektai/asmenys/Vytautas`, jo `/irodymai`, `/rysiai`,
`/galerija`, `/zemelapis`, `/straipsniai`, `/parodos` ir `/objektai`.

## Patikros

- `npx tsc --noEmit` ir `npm test`: 228 testai praeina.
- `npm run verify:relations`: 16 140 failų, 139 774 ryšių žymos, 0 problemų.
- Naršyklėje patikrinta: 376 Vytauto teiginiai, 778 ryšiai 103 grupėse,
  469 unikalūs susiję objektai mažajame žemėlapyje, 778 tiesioginiai ryšiai
  atidarytame žemėlapyje. Slinkimas ir gilioji nuoroda į paskutinį teiginį
  pasiekia visą sąrašą. Šie skaičiai yra šios korpuso versijos, ne kodo limitai.
- 4 unikalios straipsnių ir 6 parodų kortelės; įtraukti naujausi development
  Valančiaus ciklo įrašai. Patikrinti vaizdai, 390 px ir platus ekranas,
  paslėpta įžanga šaltinių tabe, uždaros citatos ir JavaScript klaidų nebuvimas.
- Esamo development DB eksporto manifestas neatitinka dalies korpuso.
  `npm run verify:db-export` nepraeina; tai ankstesnio pagrindo problema,
  kurią jau dokumentuoja Valančiaus ciklo development pastabos. Šie UI
  pakeitimai duomenų neperrašo ir publikavimo patikrų nesilpnina.

Development push nėra viešos svetainės diegimas.
