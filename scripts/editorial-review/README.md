# Redakcinės peržiūros medžiaga

Rezultatai ir aprėpties ribos aprašyti `2026-09-27.md`, patikrų santrauka – `verification.json`.

`identity-corrections.json`, `evidence-corrections.json` ir `semantic-corrections.json` saugo konkrečias pataisas, ankstesnį tekstą, šaltinių ištraukas arba sprendimo pagrindą. Atitinkami `repair_*.py` skriptai naudoja backend `workflow_state`, DB transakcijas ir senos reikšmės tikrinimą. Be `--apply` pakeitimai atšaukiami. Nauji ir pakeisti faktiniai teiginiai paliekami nepriklausomai patikrai; šie skriptai jos neatlieka.

`repair_quote_display.py` atkuria tik rodymo ištraukas pagal nepakitusias tikslias vietas šaltinyje. `finalize_projection_inputs.py` atnaujina redaguotų puslapių teiginių ir citatų blokus, išlaikydamas globalius identifikatorius. `sync_editorial_catalog.py` sinchronizuoja esamų DB katalogo įrašų tekstus, nekeisdamas senesnių skyrių į neegzistuojančius.

Po kanoninio DB eksporto `project_reviewed_ruler.mjs` prideda Lietuvos valdovo Daumanto patikrintą enciklopedinį sluoksnį ir atvaizdą iš `scripts/museum/curated-input.json`, pažymėdamas redakcinę projekciją manifeste.

Prieš pakartotinį taikymą būtina pasirinkti tinkamą `DB_PATH` ir peržiūrėti išsaugotus planus. Šios konkretaus duomenų rinkinio pataisos nėra bendras turinio generavimo procesas.
