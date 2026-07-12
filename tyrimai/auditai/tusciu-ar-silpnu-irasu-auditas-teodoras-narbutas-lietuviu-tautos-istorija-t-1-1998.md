---
tipas: kokybes_auditas
pavadinimas: 'Tuščių ar silpnų įrašų auditas: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)'
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
# Tuščių ar silpnų įrašų auditas: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)

## Vykdymo metaduomenys

- knyga: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)
- source_file: `neprojektuojama; privatus kelias pateiktas DB lauke item.source_rel`
- modelis: unknown
- data_ir_laikas: 2026-07-02 11:27
- paskutinis_promptas: `darbas/prompts/05_quality_control/04_audit_empty_or_weak_notes.md`
- ivykdyti_promptai:
  - `darbas/prompts/00_common/01_rules.md`
  - `darbas/prompts/00_common/03_naming_and_note_style.md`
  - `darbas/prompts/00_common/04_citation_policy.md`
  - `darbas/prompts/00_common/05_linking_rules.md`
  - `darbas/prompts/00_common/06_quality_criteria.md`
  - `darbas/prompts/00_common/07_deduplication.md`
  - `darbas/prompts/00_common/09_evidence_ledger.md`
  - `darbas/prompts/00_common/10_scale_and_registry.md`
  - `darbas/prompts/00_common/11_claim_level_evidence.md`
  - `darbas/prompts/05_quality_control/04_audit_empty_or_weak_notes.md`

## Patikrinta apimtis

- Patikrinti vieši įrašai, kuriuose minima `Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)`: 91 projekcijos failas, iš jų 89 po `objektai/` ir 2 po `tyrimai/auditai/`.
- Kandidatų sluoksnyje patikrinta `darbas/tmp/candidate_ledger_index.md` ir `darbas/tmp/evidence/Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.).md` santrauka.
- Mechaninis kandidato indeksas rodo 4248 verified eilučių ir 752 neišspręstas užuominas (`no_quote`, `quote_not_found`, `ambiguous`, `weak_context`). Neišspręstos užuominos nelaikytinos galutine aprėptimi.

## Neaptikta kritinių tuštumo klaidų

- Viešuose `objektai/` įrašuose, kuriuose cituojamas šis šaltinis, nerasta įrašų be jokio `citata_originali` bloko.
- Nerasta šio šaltinio entity įrašų be `## Teiginiai` skyriaus.
- Vienos citatos įrašai nėra savaime klaida; jie laikytini žemos aprėpties įrašais tik tada, kai kandidatų / ledger sluoksnyje yra papildomų skirtingų verified citatų tam pačiam objektui.

## Blokuojančios struktūros klaidos

### A. Vijūkas Kojelavičius
- failas: `objektai/autoriai/A. Vijūkas Kojelavičius.md`
- problema: sujungti claim ir quote blokai; keli `c-*` įrašai įsiliejo į ankstesnio lauko tekstą, todėl mechaninė `t-*` / `c-*` sąsaja nesaugi.
- požymiai:
  - `- t-006- c-002`
  - `- t-001- c-003`
  - `- t-003- c-004`
- papildoma problema: yra keli galimi to paties autoriaus įrašai (`A. Vijūkas Kojelavičius`, `Albertas Vijūkas-Kojelavičius`, `Albertas Vijūkas-Kojalavičius`, `Kojałowicz Kojelavičius`).
- siūlomas veiksmas: pirma atlikti deduplikavimo sprendimą, tada append-only sutvarkyti sugadintus blokų atskyrimus, nepernumeruojant stabilių ID be DB migracijos.

### Adomas Stanislovas Naruševičius
- failas: `objektai/autoriai/Adomas Stanislovas Naruševičius.md`
- problema: vienas citatos blokas prijungtas prie ankstesnio `sprendimo_priezastis` lauko.
- požymis: `sprendimo_priezastis: gap::authors::validation_repair- c-005`
- siūlomas veiksmas: atskirti `c-005` į savarankišką citatos bloką ir patikrinti, ar `t-005`, `t-006`, `t-007` teiginiai remiasi egzistuojančiais quote ID.

### Šubravcų draugija
- failas: `objektai/grupes/Šubravcų draugija.md`
- problema: keli `c-*` blokai mechaniškai prilipę prie ankstesnių `pagrindžia` sąrašo eilučių.
- požymiai:
  - `- t-005- c-002`
  - `- t-003- c-003`
  - `- t-004- c-004`
- siūlomas veiksmas: atskirti `c-002`, `c-003`, `c-004`; patikrinti, kad Narbuto šaltinio citata liktų šaltiniui priskirtas, o Balińskio medžiaga nebūtų perrašyta.

### Lietuvos bajorija
- failas: `objektai/grupes/Lietuvos bajorija.md`
- problema: didelis append-only suliejimo pažeidimas; aptikta bent 10 sujungtų `t-*` ir `c-*` fragmentų.
- požymiai:
  - `- t-007- c-004`
  - `- t-012- c-005`
  - `- t-011- c-006`
  - `- t-002- c-007`
  - `- t-013- c-008`
- papildoma problema: frontmatter turi abejotiną datą `2026 m.` ir `date_end: '2026'`, kurios šiame istoriniame grupės įraše atrodo kaip workflow artefaktas, ne šaltinio data.
- siūlomas veiksmas: pirma atkurti blokų struktūrą; tada atskirai patikrinti `datos` / `date_end` kilmę ir, jei nėra šaltinio atramos, parengti DB korekciją.

## Citavimo higienos klaidos

- Dauguma šio šaltinio entity įrašų naudoja `šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)` kaip paprastą tekstą.
- Pagal citavimo taisykles quote evidence blokuose turi būti viešo šaltinio nuoroda: `šaltinis: Teodoras Narbutas, Lietuvių tautos istorija, t. 1 (1998 m.)` arba kanoninė projekcijos nuoroda į `objektai/saltiniai/`.
- Siūlomas veiksmas: taisyti paketiniu DB atnaujinimu kartu su blokų struktūros remontu, kad citatos nebūtų perrašytos ar dubliuotos.

## Deduplikavimo rizikos

### Kojelavičiaus / Kojalavičiaus autoriaus šeima
- įrašai:
  - `objektai/autoriai/A. Vijūkas Kojelavičius.md`
  - `objektai/autoriai/Albertas Vijūkas-Kojelavičius.md`
  - `objektai/autoriai/Albertas Vijūkas-Kojalavičius.md`
  - `objektai/autoriai/Kojałowicz Kojelavičius.md`
- problema: pavadinimai ir variantai rodo tikėtiną vienos autoriaus tapatybės susiskaidymą, bet kai kurie įrašai turi skirtingų šaltinių ir skirtingai suformuotus claim / quote blokus.
- siūlomas veiksmas: nedaryti automatinio merge; parengti atskirą deduplikavimo paketą su alias šeima, pasirenkant vieną kanoninį įrašą ir išsaugant visus `t-*` / `c-*` ID per DB migraciją.

## Public / private ribos klaidos

- `tyrimai/auditai/coverage_gap_Teodoras_Narbutas_Lietuviu_tautos_istorija_t_1_1998.md` turi privačius workflow kelius (`darbas/sources/...`, `darbas/tmp/...`, `../lt-kb-pub/...`) viešame turinyje.
- `tyrimai/auditai/dviprasmiai-zmones-teodoras-narbutas-lietuviu-tautos-istorija-t-1-1998.md` turi `source_file` su privačiu working-source keliu.
- Siūlomas veiksmas: jeigu `tyrimai/auditai` yra viešai projektuojama zona, privačius kelius perkelti į DB metaduomenis arba `darbas/tmp/audits/`, o viešame tekste palikti tik viešą šaltinio nuorodą.

## Coverage pastabos

- Ankstesnis coverage gap auditas jau pažymėjo nepadengtą svarbią medžiagą apie Teodorą Narbutą, Lietuvos Statutą, Lietuvos bajoriją, biografinius įvykius ir masonų simbolius.
- Šio žingsnio metu tos spragos neremontuotos, nes promptas yra tuščių / silpnų įrašų auditas, o ne final extraction pataisų paketas.
- Kitas veiksmas: pirma remontuoti keturis struktūriškai sugadintus įrašus, tada kartoti coverage gap uždarymą pagal unikalius quote hash / offset vienetus.
