---
tipas: kokybės auditas
pavadinimas: 'Tuščių ir silpnų pastabų auditas - Lietuvos istorija (2013 m.) - 2026-05-14'
saltiniai:
  - 'Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)'
sukurta: ''
atnaujinta: ''
---
# Tuščių ir silpnų pastabų auditas - Lietuvos istorija (2013 m.) - 2026-05-14

## Vykdymo metaduomenys

- knyga: Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)
- source_file: `darbas/sources/Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.).md`
- modelis: unknown
- data_ir_laikas: 2026-05-14 05:32 EEST
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

## Bendras verdiktas

Šaltinio projekcija nepraeina tuščių ir silpnų pastabų patikros. Viešuose objektų įrašuose rasta 56 pastabos su šio šaltinio medžiaga, tačiau privatų ledžerį sudaro 3553 deduplikuoti įrašai, iš jų 2584 `unused` ir 969 `unclear`. Tai reiškia, kad dabartinė projekcija yra tik dalinė aprėptis, o silpniausia vieta yra ne vien trūkstama aprėptis, bet ir kelių jau sukurtų pastabų claim-level schema.

Ankstesnis aprėpties auditas `tyrimai/auditai/Aprėpties spragų auditas - Lietuvos istorija (2013 m.) - 2026-05-14.md` lieka aktualus: žmonių kategorijoje viešų pastabų su šiuo šaltiniu nerasta, įvykių kategorijoje padengta tik `Mindaugo karūnacija (1253 m.)`, o kandidatų failuose yra šimtai nepanaudotų kūno teksto įrodymų.

## Blokuojančios problemos

### Devyni zodyno įrašai neturi `t-*` teiginių
Šie įrašai turi `## Teiginiai` antraštę, bet neturi claim-level teiginių; jų `c-001` blokai nurodo `pagrindžia: []`. Tai pažeidžia claim-level evidence taisyklę, nes santrauka ir reikšmės laukai pateikia faktus be `t-*` atramos.

- `objektai/zodynas/alodas alodinė nuosavybė.md` — tuščias `## Teiginiai`, `c-001` nepagrindžia jokio teiginio; citata taip pat nukirsta: `alodas (individualus valstiečių`.
- `objektai/zodynas/ješiva.md` — tuščias `## Teiginiai`, `c-001` nepagrindžia jokio teiginio.
- `objektai/zodynas/jarlykas.md` — tuščias `## Teiginiai`, `c-001` nepagrindžia jokio teiginio.
- `objektai/zodynas/tripartitio christiana.md` — tuščias `## Teiginiai`, `c-001` nepagrindžia jokio teiginio; citata nukirsta sakinio viduryje.
- `objektai/zodynas/tuteišiai.md` — tuščias `## Teiginiai`, `c-001` nepagrindžia jokio teiginio.
- `objektai/zodynas/istorinė Lietuva.md` — tuščias `## Teiginiai`, `c-001` nepagrindžia jokio teiginio.
- `objektai/zodynas/leičiai liečiai leišiai.md` — tuščias `## Teiginiai`, `c-001` nepagrindžia jokio teiginio; citata per trumpa savarankiškai pagrįsti santrauką.
- `objektai/zodynas/amfiktionija.md` — tuščias `## Teiginiai`, `c-001` nepagrindžia jokio teiginio; citata nukirsta sakinio viduryje.
- `objektai/zodynas/abdikacija.md` — tuščias `## Teiginiai`, `c-001` nepagrindžia jokio teiginio.

Reikalingas veiksmas: kiekvienam įrašui pridėti bent vieną `t-*` teiginį, susietą su pilna kūno teksto citata, arba nukirstas / per silpnas citatas atmesti ir įrašą palikti privačiai peržiūrai.

### Šaltinio nuorodos nėra wiki nuorodos
56 objektų pastabose citatų laukas `šaltinis:` naudoja paprastą tekstą, o ne privalomą `Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)` nuorodą. Tai paveikia autorių, grupių, šaltinių, įvykių, žodyno, papročių, vietų, daiktų ir posakių įrašus.

Reikalingas veiksmas: atskirame remonto žingsnyje pakeisti naujo šaltinio claim/evidence `šaltinis` laukus į wiki nuorodas, nekeisti `t-*` ir `c-*` ID bei neperrašyti citatų.

## Tuščios sekcijos

Tuščios sekcijos rastos ne kaip pavienės klaidos, o kaip pasikartojantis šablono likutis. Dažniausiai tai tuščias `## Šaltiniai ir įrodymai`, kai visos citatos jau yra `Reikšmingi paminėjimai` ar kitoje konkretesnėje sekcijoje.

- Grupės: `Lietuvos Persitvarkymo Sąjūdis.md`, `Lietuvių aktyvistų frontas.md`, `NKVD.md`, `Lietuvos laisvės kovos sąjūdis.md` turi tuščią `## Šaltiniai ir įrodymai`.
- Papročiai: `Tautinių bendrijų kalbos, kultūros ir papročių puoselėjimas.md`, `Rugsėjo 8-osios Tautos šventės ceremonijos.md`, `Seimo vienbalsiškumo ir liberum veto norma.md`, `Pagoniškų elementų integravimas į krikščioniškas praktikas.md`, `Pirmosios dainų šventės tradicija.md`, `Rusiškų mokyklų boikotas ir daraktorinės mokyklėlės.md` turi tuščią `## Šaltiniai ir įrodymai`.
- Vietos: `Kauno Lietuva.md`, `Minsko Lietuva.md`, `Lietauka.md`, `Europos geografinis centras.md`, `Vidurinė Lietuva.md` turi tuščią `## Šaltiniai ir įrodymai` ir tuščią `## Pastabos`.
- Daiktai: `Šakutė.md`, `Partizanų bunkeriai.md`, `Lietuvos trispalvė.md`, `Daugiapakopės raketos.md`, `Baltijos kelio gedulo kaspinai ir žvakutės.md`, `Bomba.md`, `ANBO lėktuvai.md`, `Sovietų tankai ir šarvuočiai.md` turi tuščią `## Šaltiniai ir įrodymai`.

Reikalingas veiksmas: pašalinti tuščias sekcijas arba papildyti jas tik unikalia, claim-level susieta citata. Nekopijuoti jau esančių citatų antrą kartą.

## Nukirstos arba per silpnos citatos

Šios citatos yra per trumpos arba nukirstos taip, kad nepakankamai pagrindžia viešos pastabos santrauką ir struktūrinius laukus:

- `objektai/posakiai/Jei Šveicarijai būdinga aukšti kalnai.md` — citata prasideda fragmentu `„Jei Šveicarijai būdinga` ir neturi pilno sakinio.
- `objektai/autoriai/Antanas Kulakauskas.md` — bibliografinė citata `Vilnius, 1996.` yra per siaura savarankiškai pagrįsti autoriaus įrašo faktus.
- `objektai/autoriai/Mindaugas Tamošaitis.md` — bibliografinė citata `Vilnius, 2009.` yra per siaura savarankiškai pagrįsti autoriaus įrašo faktus.
- `objektai/zodynas/alodas alodinė nuosavybė.md` — citata nukirsta po `individualus valstiečių`.
- `objektai/zodynas/tripartitio christiana.md` — citata nukirsta po `visuomenės skirstymas į`.
- `objektai/zodynas/amfiktionija.md` — citata nukirsta po `amfiktioniją – polių`.
- `objektai/zodynas/leičiai liečiai leišiai.md` — citata `vadinami „leičiais“` per siaura pagrįsti platesnę sąvokos santrauką.
- `objektai/paprociai/Rusiškų mokyklų boikotas ir daraktorinės mokyklėlės.md` — citata `buvo poreikis, susiformavo tradicija.` yra per trumpa be platesnio sakinio konteksto.
- `objektai/daiktai/ANBO lėktuvai.md` — citata `ANBO ir krepšinis.` yra antraštinė / fragmentinė ir neturėtų būti savarankiškas claim-level įrodymas.

Reikalingas veiksmas: pakeisti kiekvieną silpną citatą pilnu kūno teksto sakiniu arba perkelti į privatų auditą, jei pilno tikslaus šaltinio fragmento nepavyksta saugiai pririšti.

## Stiliaus ir santraukų problemos

Kai kurios pastabos teiginio arba santraukos prozoje vis dar naudoja draudžiamą šaltinio-prefiksinį stilių.

- `objektai/ivykiai/Mindaugo karūnacija (1253 m.).md` — `## Eiga` prasideda `Šaltinyje karūnos tikslas...`; citatų santraukos taip pat kartoja `Šaltinyje nurodoma...`.
- `objektai/grupes/Lietuvių aktyvistų frontas.md` — santraukoje yra sakinys `Šaltinis ją sieja...`.
- `objektai/daiktai/Šakutė.md` — santraukoje ir vartojimo lauke yra `Šaltinis...` formulės.
- `objektai/daiktai/Daugiapakopės raketos.md` — santraukoje yra `Šaltinis teigia...` formulė.
- Keli žodyno įrašai citatų santraukose prasideda `Šaltinyje...`; tai taisytina kartu su claim-level remontu.

Reikalingas veiksmas: perrašyti prozą tiesioginiais faktiniais sakiniais, nepakeičiant citatų teksto ir neperrašant istorinio turinio.

## Aprėpties rizikos

Pagal kandidatų failus ir ledžerį dabartinė projekcija aiškiai per siaura:

- `authors`: kandidatų faile 161 skyriaus antraštė, viešai su šiuo šaltiniu yra 4 autorių pastabos.
- `people`: kandidatų faile 398 kandidatai, viešų `asmenys` pastabų su šiuo šaltiniu nerasta.
- `events`: kandidatų faile 327 kandidatai, viešai padengtas tik `Mindaugo karūnacija (1253 m.)`.
- `places`: kandidatų faile 324 kandidatai, viešai padengtos 5 vietos.
- `groups`: kandidatų faile 272 kandidatai, viešai padengtos 4 grupės.
- `sources`: kandidatų faile 293 kandidatai, viešai padengti 6 šaltinių įrašai.
- `customs`: kandidatų faile 185 antraštės, viešai padengtos 7 papročių / praktikų pastabos.
- `vocabulary`: kandidatų faile 215 antraščių, viešai padengta 10 žodyno pastabų, iš kurių 9 turi claim-level trūkumų.

Prioritetiniai nepanaudoti kūno įrodymai iš ledžerio, kurių negalima laikyti padengtais vien dėl silpnų ar kitų kategorijų įrašų:

- `mikalojus-akelaitis-0030` — reikalingas asmens / autoriaus aprėpties sprendimas Mikalojui Akelaičiui ir Juzefui Ignacui Kraševskiui.
- `brunono-bonifacijaus-misija-ir-netimero-krikstas-1009` — reikalingas įvykio įrašas arba esamo įvykio praturtinimas apie Brunono Bonifacijaus misiją, Netimero krikštą ir žūtį.
- `zalgirio-musis-1410-c026-c029` — reikalingas Žalgirio / Griunvaldo / Tanenbergo aliasų šeimos ir kūno įrodymų remontas.
- `kristijonas-livonijos-ordino-kunigas` — negalima jungti prie esamo vienvardžio `Kristijonas.md`, kol neišspręsta tapatybės riba.

## Nerasta kaip atskira problema

Mechaninė patikra šiame šaltinio pjūvyje nerado `Author:`, `Source:` ar `Person:` failų prefiksų. Tikslių pasikartojančių `citata_originali` blokų tame pačiame šaltinio pjūvyje šio greito audito metu taip pat nerasta, tačiau keli ledžerio įrašai vis dar pažymi dublikuotą titulinio bloko / turinio lokatorių medžiagą kaip privatų aprėpties klausimą.

## Kiti veiksmai

1. Pirmiausia sutvarkyti devynis žodyno įrašus be `t-*` teiginių ir su `pagrindžia: []`.
2. Tada normalizuoti visų šio šaltinio citatų `šaltinis` laukus į wiki nuorodą, išsaugant esamus ID.
3. Pašalinti tuščias `## Šaltiniai ir įrodymai` ir `## Pastabos` sekcijas, jei jos neturi unikalaus turinio.
4. Pakeisti nukirstas citatas pilnais, šaltinyje randamais kūno teksto sakiniais arba perkelti į privatų auditą.
5. Tik po šių remonto veiksmų tęsti didelės aprėpties integraciją iš `unused` ledžerio įrašų.
