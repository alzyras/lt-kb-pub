---
tipas: kokybes_auditas
pavadinimas: "Tuščių ir silpnų pastabų auditas - Michał Baliński, Vilniaus miesto istorija (2007 m.) - 2026-05-27"
sukurta: "2026-05-27"
variantai: []
aliases: []
saltiniai:
  - "Michał Baliński, Vilniaus miesto istorija (2007 m.)"
bukle: juodrastis
audito_tipas: empty_or_weak_notes
tags: []
---
# Auditas

## Vykdymo metaduomenys
- knyga: Michał Baliński, Vilniaus miesto istorija (2007 m.)
- source_file: `darbas/sources/Michał Baliński, Vilniaus miesto istorija (2007 m.).md`
- modelis: unknown
- data_ir_laikas: 2026-05-27 09:10 EEST
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
Balińskio šaltinio projekcija dar nepraeina tuščių ir silpnų pastabų patikros. Viešuose objektų aplankuose rasti 128 įrašai su šio šaltinio medžiaga: 11 asmenų, 16 autorių, 17 daiktų, 16 grupių, 15 įvykių, 12 papročių, 14 posakių, 9 šaltiniai, 6 vietos ir 12 žodyno įrašų. Privatų ledžerį sudaro 4060 deduplikuotų įrašų, iš jų 3669 `unused` ir 391 `unclear`, todėl vieša projekcija yra dalinė ir reikalauja papildomos atrankos prieš laikant aprėptį baigta.

Mechaninė citatų patikra aptiko 296 viešus `citata_originali` blokus, susietus su šiuo šaltiniu. 294 blokai rasti darbiniame šaltinyje po tarpų normalizavimo; du probleminiai blokai yra `objektai/zodynas/Naujasis klasikas ir prepozityvistai.md`.

## Blokuojančios problemos

### Šaltinio laukai nėra privalomos viešo šaltinio wiki nuorodos
127 objektų įrašuose nauji `šaltinis:` laukai rašomi kaip paprastas tekstas `Michał Baliński, Vilniaus miesto istorija (2007 m.)`, o ne kaip `Michał Baliński, Vilniaus miesto istorija (2007 m.)`. Tai paveikia teiginius ir citatų blokus beveik visose kategorijose; išimtis yra pats viešasis šaltinio aprašas.

Reikalingas veiksmas: atskirame remonto žingsnyje normalizuoti šio šaltinio `šaltinis` laukus į privalomą public source note nuorodą, nekeičiant `t-*` ir `c-*` ID bei neperrašant citatų.

### `Naujasis klasikas ir prepozityvistai` neatitinka claim-level formato ir turi neverifikuotas citatas
`objektai/zodynas/Naujasis klasikas ir prepozityvistai.md` turi seno formato teiginius (`- t-001: ... Pagrindžia: c-001.`) ir citatas kaip `### c-001`, o ne `- c-001` blokus. Abi Balińskio citatos nerastos darbiniame šaltinyje tiksliu arba tarpais normalizuotu tekstu: viešame įraše perrašyta formuluotė apie „M. Balinskio“ romantizmą, nors šaltinio kūne rašoma `Svarbi tyrinėtojos išvada, jog „susidaro įspūdis, kad jis niekuomet ir nebuvo „tik­rasis" romantikas - tik „naujasis klasikas"...`. Be to, `patikimumo_saltinis` reikšmė įrašyta kaip `autorinis / redakcinis kontekstas`, nors leidžiamos reikšmės yra `human` arba `ai`.

Reikalingas veiksmas: perrašyti šį įrašą į dabartinį `t-*` / `c-*` blokų formatą, pakeisti abi citatas tiksliais darbiniame šaltinyje randamais kūno fragmentais arba pašalinti nepagrįstus teiginius.

## Vidutinio svarbumo problemos

### Nekanoninės `periodas` reikšmės
24 įrašai su šiuo šaltiniu turi `periodas` reikšmes, kurios neatitinka `darbas/topics/laikotarpiu_zodynas.md` kanoninio sąrašo. Rastos nekanoninės reikšmės: `LDK laikotarpis` (13 įrašų), `XIX a. ir Rusijos imperijos laikotarpis` (2), `viduramžiai` (1), `atkurtos nepriklausomybės laikotarpis` (7), `okupacijų ir sovietmečio laikotarpis` (1).

Reikalingas veiksmas: `periodas` palikti tik kanoninėms reikšmėms (`viduramziai`, `ankstyvieji_naujieji_laikai`, `naujieji_laikai`, ir kt.), o detalesnius aprašus perkelti į `laikotarpis` arba `periodo_grupes`.

### Citatos turi puslapių ar knygos antraščių teršalų
35 įrašuose citatos prasideda arba tęsiasi su tokiais OCR / maketo fragmentais kaip `VILNIAUS MIESTO ISTORIJA I TOMAS`, `VILNIAUS MIESTO ISTORIJA / TOMAS`, `III KNYGA`, `IV KNYGA`. Pavyzdžiai: `objektai/asmenys/Elena.md`, `objektai/asmenys/Ona Jogailaitė.md`, `objektai/ivykiai/Vilniui suteikiamos Magdeburgo teisės (1387 m.).md`, `objektai/vietos/Karališkasis malūnas Vilniuje.md`, `objektai/zodynas/Cechas.md`.

Reikalingas veiksmas: jei citatos bus remontuojamos, `citata_originali` turi likti tiksli ir randama šaltinyje, bet viešam skaitymui galima pridėti švarią `citata_rodoma`; naujų citatų nebenaudoti su bėgančiomis antraštėmis kaip prasminga įrodymo dalimi.

### Draudžiamas šaltinio-prefiksinis stilius santraukose
Bent septyniuose įrašuose santrauka ar aiškinamasis tekstas vis dar naudoja `Šaltinyje`, `Šaltinis` tipo formules. Pavyzdžiai: `objektai/daiktai/Aukuras.md`, `objektai/daiktai/Martyno Paleckio stiklo gaminiai Vilniuje.md`, `objektai/ivykiai/Vilniui suteikiamos Magdeburgo teisės (1387 m.).md`, `objektai/vietos/Karališkasis malūnas Vilniuje.md`, `objektai/zodynas/Cechas.md`, `objektai/zodynas/Pilininkas.md`. `objektai/posakiai/Mes kariaujame ne su kryžium, o su vokiečiais!.md` turi tokią formuluotę `patikimumo_pagrindimas` lauke; tai mažesnė problema, bet verta suvienodinti.

Reikalingas veiksmas: perrašyti santraukas tiesioginiais faktiniais sakiniais, nekeičiant cituojamo šaltinio teksto.

### Failo vardas su pertekliniu tašku
`objektai/ivykiai/Vilniaus pranciškonų nužudymas apie 1345 m..md` turi dvigubą tašką prieš plėtinį.

Reikalingas veiksmas: pervadinti įrašą be perteklinio taško ir išlaikyti aliasą / variantą, jeigu runneriui reikia suderinamumo.

## Aprėpties rizikos
Sujungti kandidatų failai rodo gerokai platesnę galimų įrašų apimtį negu dabartinė projekcija: `people` turi 660 antraščių, `places` 487, `sources` 387, `events` 287, `groups` 168, `customs` 167, `authors` 165, `items` 110, `sayings` 91, `vocabulary` 5. Dalis jų yra silpni arba neaiškūs kandidatai, bet 3669 `unused` ledžerio įrašai negali būti laikomi padengtais vien dėl 128 viešų įrašų.

Atskiras `tyrimai/dviprasmiu-zmoniu-auditas-michal-balinski-2007-2026-05-27.md` jau fiksuoja dalį žmonių tapatybės neaiškumų. Šis auditas jo nedubliuoja; prieš kuriant naujus asmenų įrašus reikia laikytis ten nurodytų tapatybės ribų.

## Nerasta kaip atskira problema
Šiame patikrinime nerasta `Person:`, `Author:` ar `Source:` failų prefiksų. Nerasta viešų įrašų be `## Teiginiai` skyriaus, tuščio `## Teiginiai` skyriaus ar dubliuotų `citata_originali` blokų tame pačiame įraše. Taip pat nerasta nekanoninių `tags` reikšmių pagal perskaitytą žymų žodyną.

## Kiti veiksmai
1. Pirmiausia normalizuoti visų šio šaltinio teiginių ir citatų `šaltinis` laukus į `Michał Baliński, Vilniaus miesto istorija (2007 m.)`.
2. Sutvarkyti `objektai/zodynas/Naujasis klasikas ir prepozityvistai.md`: dabartinis claim-level formatas, tikslios citatos, leidžiamos patikimumo reikšmės.
3. Normalizuoti 24 nekanoninius `periodas` laukus.
4. Pervadinti `Vilniaus pranciškonų nužudymas apie 1345 m..md` ir peržiūrėti citatas su knygos / tomo antraštėmis.
5. Tik po šių remonto veiksmų tęsti aprėpties didinimą iš `darbas/tmp/evidence/Michał Baliński, Vilniaus miesto istorija (2007 m.).md` `unused` įrašų.
