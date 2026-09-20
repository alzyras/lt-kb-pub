# DB saugojimas ir renderinimas

Kanoninė darbo DB: `lt-kb/darbas/state/workflow.sqlite3`.

- Abi parodos saugomos esamose `exhibitions`, `exhibition_sections`, `exhibition_items` lentelėse. Eksponatai nurodo jau DB esančius, priimtus `media_items` ir `media_refs` įrašus.
- Dviejų straipsnių Markdown, 48 giminių inventoriai, metodika ir tyrimo užrašai saugomi `editorial_documents`. Ten pat saugomi biografijų įvesties JSON ir vardų sutapatinimo registras. Ten pat laikoma atrinktų medijų pateikimo versija su atribucija, datomis ir originalių failų nuorodomis.
- `editorial_exhibition_exports` susieja kolekciją su eksportuojamu manifestu ir medijų katalogu.
- Vaizdų failai laikomi projekto statiniuose ištekliuose; jų katalogai ir istoriniai aprašai yra DB. Bendri objektų, teiginių ir citatų įrašai šiuo importu neperrašomi.

## Pakartojamos komandos

Leisti iš `lt-kb` katalogo:

```bash
# Tik patikrinti parodos įvestį prieš įrašymą.
uv run python ../lt-kb-pub-development/scripts/gimines/sync_to_db.py

# Įrašyti paruoštą turinį į DB ir patikrinti atkūrimą į tuščią katalogą.
uv run python ../lt-kb-pub-development/scripts/gimines/sync_to_db.py --apply

# Atkurti straipsnį, registrus, medijų katalogą ir parodą iš DB.
uv run python -m lt_kb_app.tools.editorial_documents \
  --output ../lt-kb-pub-development --collection bajoru-gimines
```

Visos viešos projekcijos `render_public_projection` pabaigoje įjungtas ir redakcinio turinio eksportas. Tiksliniai kitų objektų renderinimai šios kolekcijos nekeičia. Po eksporto svetainės build paima straipsnį iš `straipsniai/`, o parodų įskiepis – iš `exhibitionNobleFamilies.json`. Abu turiniai patenka į esamus straipsnių ir parodų katalogus.

DB įrašymas ir vietinis renderinimas dar nėra serverio diegimas. Naujam svetainės leidimui reikia perduoti ir vaizdų failus iš `quartz/static/gimines/radvilos/` bei `quartz/static/gimines/sapiegos/`, kartu su šios šakos parodų ir katalogo integracija.

Importas saugo ankstesnius šios kolekcijos DB įrašus į `.cache/gimines/before-*.json`, o įrašymo bei atkūrimo rezultatą – į `.cache/gimines/receipt.json`. Atkūrimo patikra lygina tikslų Markdown ir visas esmines parodos reikšmes; tai nėra vien įvesties failų egzistavimo patikra.

Asmenų biografijos kuriamos `sukurti_asmenis.py` pagal patikrintas įvestis: `items`, kanoninės tapatybės ir įprasta DB projekcija. Nepriklausomame straipsnių importe biografijos neperrašomos. Šaltinių sąrašai ir šeimos nuorodos renderinami asmens puslapyje; tai nėra pramanytos citatos ar automatiškai patvirtinti pirminių dokumentų teiginiai.
