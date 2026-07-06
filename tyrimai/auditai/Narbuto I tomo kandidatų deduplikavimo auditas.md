---
tipas: tyrimas
pavadinimas: 'Narbuto I tomo kandidatų deduplikavimo auditas'
saltiniai:
  - 'Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)'
sukurta: ''
atnaujinta: ''
media_total_count: '0'
media_primary_thumb_url: ''
media_primary_canonical_url: ''
media_primary_directness: ''
media_primary_relation_type: ''
media_primary_json: ''
media_direct_json: |-
  []
media_contextual_json: |-
  []
media_all_json: |-
  []
---
# Narbuto I tomo kandidatų deduplikavimo auditas

## Santrauka

Patikrinti sujungti kandidatų sąrašai ir esamas viešų įrašų registras. Saugiai šalintini tik tie dubletai, kurių tapatybė yra aiški pagal tą pačią kategoriją, tą patį pavadinimą arba tą patį pagrindinį citatos bloką.

## Siūlomi saugūs sujungimai

- `objektai/posakiai/bemeilijo žūti ugny, negu pasiduoti vokiečiams.md` -> `objektai/posakiai/Bemeilijo žūti ugny, negu pasiduoti vokiečiams.md`; turinys byte-identical.
- `objektai/posakiai/iki gyvos Vytauto ir Jogailos galvos.md` -> `objektai/posakiai/Iki gyvos Vytauto ir Jogailos galvos.md`; turinys byte-identical.
- `objektai/posakiai/jam patinkąs mažiau iškalbingas, bet užtatai tiesakalbis..md` -> `objektai/posakiai/jam patinkąs mažiau iškalbingas, bet užtatai tiesakalbis.md`; pavadinimas tas pats, o papildomas `c-002` yra persidengianti citata su neegzistuojančia `t-002` nuoroda.
- `objektai/posakiai/piktuoju iš manęs dar niekas nieko nelaimėjo.md` -> `objektai/posakiai/Piktuoju iš manęs dar niekas nieko nelaimėjo.md`; turinys byte-identical.
- `objektai/posakiai/skelbia nepriklausomos Lietuvos valstybės atstatymą su sostine Vilnium.md` -> `objektai/posakiai/Skelbia nepriklausomos Lietuvos valstybės atstatymą su sostine Vilnium.md`; turinys byte-identical.
- `objektai/posakiai/vyresniuosius jis laikąs tėvais, lygius — broliais, o jaunesniuosius — savo vaikais.md` -> `objektai/posakiai/Vyresniuosius jis laikąs tėvais, lygius — broliais, o jaunesniuosius — savo vaikais.md`; turinys byte-identical.

## Neautomatinio audito eilė

- Asmenų ir autorių kandidatų persidengimai, pvz., `Teodoras Narbutas`, `Adomas Honorijus Kirkoras`, `Adomas Bremenietis`, `Petras Dusburgietis`, laikytini kategorijos ribos klausimu. Jei asmuo šaltinyje veikia kaip teksto autorius, pirmenybė teiktina `objektai/autoriai/`, bet esamų asmens įrašų trinti negalima be rankinio ryšių ir citatų patikrinimo.
- `Kijevo Rusia`, `Litvinai`, `Kaukai`, `Lygašonys ir tulisonys`, `Markopoliai` ir panašūs atvejai persidengia tarp grupių ir žodyno. Pagal ribų taisykles kanoninis kolektyvinio veikėjo įrašas turėtų būti grupė, o žodyno įrašas gali likti kaip leksinis terminas, jeigu turi atskirą terminologinę citatą.
- `Kilimas`, `Budstikken`, `Liutaurai` ir panašūs daiktų / žodyno atvejai neturi būti sujungti vien pagal pavadinimą; reikia tikrinti, ar citata aprašo materialų objektą, ar terminą.
- `Pajauta` tarp asmens ir šaltinio, taip pat `Šventaragis` tarp asmens ir vietos, paliekami auditui dėl kategorijos ir tapatybės neaiškumo.
- Registro įrašai be fizinio projekcijos failo, pvz., `Karaliaucius.md`, `Klaipeda.md`, `Zemaitija.md`, šiame payload'e netrinami; juos reikia spręsti DB/projekcijos sinchronizacijos patikroje.
