---
tipas: tyrimas
pavadinimas: "Tuščių ar silpnų pastabų auditas - A. Šapoka (red.), Lietuvos istorija (1936 m.)"
saltiniai:
  - "A. Šapoka (red.), Lietuvos istorija (1936 m.)"
---
# Auditas

## Vykdymo metaduomenys
- knyga: A. Šapoka (red.), Lietuvos istorija (1936 m.)
- source_file: `darbas/sources/A. Šapoka (red.), Lietuvos istorija (1936 m.).md`
- modelis: unknown
- data_ir_laikas: 2026-04-25 11:03
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

## Kritiniai radiniai

### 1. Vietų lapai palikti senuoju teiginių formatu ir su nukirsta citata
- `objektai/vietos/Dancigas.md`
- `objektai/vietos/Karaliaučius.md`
- Abu lapai dar naudoja bracket formą `[t-001]` / `[c-001]` vietoje dabartinių `t-*` ir `c-*` blokų su `teiginio_tipas`, `patikimumo_lygis` ir `patikimumo_saltinis`.
- Abiejuose lapuose paskutinė citata baigiasi fragmentu `Daugiausia buvo išvežama šulų bo-`, todėl ji nėra pilna sakinio riba ir negali būti laikoma tvarkingu viešu įrodymu.
- Veiksmas: perrašyti abu lapus į dabartinį formatą, užbaigti paskutinę citatą pagal kūno tekstą ir pašalinti nukirstą OCR eilutės galą.

### 2. Įrodymais naudojami antraštiniai ar iliustraciniai fragmentai
- `objektai/autoriai/A. Šapoka.md` naudoja `c-001` iš tituliniame lape esančio įrašo `R E D. A. Š A P О K А`.
- `objektai/autoriai/Jonas Šliūpas.md` naudoja `c-004` iš iliustracijos ar antraštės pobūdžio teksto `„Lietuviškojo Balso" pirmojo numerio antraštė. (Laikraštis ėjo 1885—1889 m.).`
- Tokie fragmentai gali likti bibliografiniame ar iliustraciniame kontekste, bet jie yra silpni kaip pagrindiniai autoriniai ar biografiniai įrodymai.
- Veiksmas: pakeisti juos kūno teksto citatomis; jei kūno citatos nėra, atitinkamą teiginį perkelti į silpno pagrindo auditą.

### 3. Autorių kategorijoje suversti biografiniai asmenų teiginiai
- `objektai/autoriai/P. Klimas.md` kaupia ne tik autorystę, bet ir politinius vaidmenis: `Vykdomojo Komiteto biuro narys`, `Lietuvos Tarybos narys`.
- `objektai/autoriai/Jonas Basanavičius.md`, `objektai/autoriai/Jonas Šliūpas.md` ir `objektai/autoriai/Motiejus Valančius.md` aprašo pirmiausia viešą veiklą, politinį ar visuomeninį vaidmenį, o ne vien bibliografinę autorystę.
- Kanoninių `objektai/asmenys/P. Klimas.md`, `objektai/asmenys/Jonas Basanavičius.md`, `objektai/asmenys/Jonas Šliūpas.md`, `objektai/asmenys/Motiejus Valančius.md` lapų šiuo metu nėra.
- Veiksmas: biografinius teiginius perkelti arba lygiagrečiai iškelti į asmenų lapus; `autoriai` kategorijoje palikti tik autorystės, redagavimo ar leidybos teiginius.

### 4. To paties šaltinio pasažas dubliuojamas tame pačiame lape
- `objektai/autoriai/Motiejus Valančius.md`
- `c-003` jau apima 1867—1869 m. Valančiaus knygutes ir jų reikšmę, o `c-008` pakartoja to paties pasažo pradžią apie tas pačias knygutes.
- Tai silpnina citatų unikalumą ir pažeidžia taisyklę nelaikyti to paties pasažo keliomis viešomis citatomis be naujos informacijos.
- Veiksmas: palikti vieną stipresnę citatą ir abi tezės nuorodas suvesti į ją arba antrą citatą pakeisti kitu nepersidengiančiu pasažu.

## Vidutinio svarbumo radiniai

### 5. Nukirstas ir nekanoninis failo vardas
- `objektai/posakiai/Daug imperatorių, karalių ir įvairių kunigaikščių....md`
- Pavadinimas bei failo vardas baigiasi pertekliniais daugtaškiais ir atrodo kaip nukirsta pradžios frazė, o ne suredaguotas kanoninis vardas.
- Veiksmas: palikti švaresnį kanoninį vardą be perteklinių taškų, o ilgesnę formą perkelti į `variantai`.

### 6. Boilerplate stilius dar likęs santraukose ir teiginiuose
- Pavyzdžiai: `objektai/autoriai/A. Šapoka.md`, `objektai/autoriai/J. Jakštas.md`, `objektai/autoriai/Z. Ivinskis.md`, `objektai/autoriai/P. Šležas.md`, `objektai/vietos/Dancigas.md`, daug `objektai/posakiai/*.md`.
- Kartojamos formuluotės `šiame šaltinyje minimas kaip` ir `Formuluotė šiame pasakojime pateikiama kaip`, nors taisyklės reikalauja tiesioginių teiginių be šaltinio-prefikso.
- Veiksmas: perrašyti `Santrauka` ir `teiginys` laukus į tiesiogines faktines formuluotes, nekeičiant pačių citatų.

### 7. Kai kurie vieši lapai tebėra juodraščio būsenos
- Pavyzdžiai: `objektai/asmenys/J. Tonkūnas.md`, `objektai/asmenys/K. Masiliūnas.md`, keli `objektai/posakiai/*.md`.
- `bukle: juodrastis` savaime nėra klaida, bet rodo, kad lapai dar neperėjo pilno publikavimo sutvarkymo ir stiliaus peržiūros.
- Veiksmas: po kritinių taisymų pakartoti kokybės ciklą ir tik tada kelti į galutinę būseną.

## Kiti veiksmai
- Pirmiausia sutvarkyti `Dancigas` ir `Karaliaučius`, nes ten vienu metu yra ir senasis formatas, ir nukirsta vieša citata.
- Tada pakeisti antraštinius bei iliustracinius pseudo-įrodymus kūno teksto citatomis.
- Po to iškelti biografinius teiginius iš `autoriai` kategorijos į atskirus `asmenys` lapus ir panaikinti vidinius citatų dublius.
- Galiausiai suvienodinti kanoninius pavadinimus ir pašalinti boilerplate stilių juodraštiniuose lapuose.
