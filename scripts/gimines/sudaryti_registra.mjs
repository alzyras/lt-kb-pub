/** Pakartojama vardų paieška. Sutapusi pavardė dar nėra patvirtinta genealogija. */
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const root = process.cwd()
const dir = path.join(root, "scripts/gimines")
const families = [
  ["Radvilos", "Radvil", "Biržai, Dubingiai, Nesvyžius, Olyka; šakos, Reformacija, knygos ir paveldėjimas"],
  ["Sapiegos", "Sapieg", "Leonas Sapiega, Statutas, Ružanai, Vilniaus rezidencijos ir bibliotekos"],
  ["Chodkevičiai", "Chodkevi", "Karvedžiai, Kretinga, Skuodas, Bychavas ir vienuolynų fundacijos"],
  ["Pacai", "Pacas|Pacait|Pacien", "Pažaislis, Vilniaus Šv. Petro ir Povilo bažnyčia, Jieznas"],
  ["Tiškevičiai", "Tiškevi", "Kretinga, Palanga, Lentvaris, Trakų Vokė, Užutrakis; kolekcijos ir fotografija"],
  ["Oginskiai", "Oginsk|Oginskait|Oginskien", "Rietavas, Plungė, Zalesė; muzika, švietimas ir modernėjimas"],
  ["Pliateriai", "Pliater|Plater", "Zarasų kraštas, Dusetos, Stelmužė; sukilimai ir dvarų paveldas"],
  ["Goštautai", "Goštaut|Gostaut", "Geranainys, Vilnius; valstybės pareigos ir Statuto rengimas"],
  ["Kęsgailos", "Kęsgail", "Žemaitijos seniūnai, Kražiai; valdų ir pareigybių geografija"],
  ["Astikai", "Astik|Aštik", "Giminės pradžia, Horodlė, ryšys su Radvilomis; kilmės versijos"],
  ["Giedraičiai", "Giedrait", "Kunigaikščių šakos, vyskupai, švietimas ir lietuviška raštija"],
  ["Sanguškos", "Sangušk|Sanguškait", "Gediminaičių kilmė, Voluinės valdos, Slavuta ir šeimos archyvai"],
  ["Čartoriskiai", "Čartor|Cartor|Čartory", "LDK ir Lenkijos šakos, politiniai tinklai ir meno rinkiniai"],
  ["Ostrogiškiai", "Ostrog", "Oršos mūšis, Voluinė, stačiatikių mecenatystė ir knygų leidyba"],
  ["Višnioveckiai", "Višniov|Višniav", "Kunigaikščių šakos, karinės ir politinės karjeros, santuokos"],
  ["Alšėniškiai", "Alšėn", "Alšėnai, vyskupai ir dinastinės santuokos"],
  ["Olelkaičiai", "Olelk", "Slucko kunigaikščiai, paveldėjimas ir ryšiai su Radvilomis"],
  ["Druckiai", "Druck|Drutsk", "Atskirti Druckių šakas ir prievardžius; valdos ir tarnyba"],
  ["Manvydai", "Manvyd", "Ankstyvasis LDK elitas, santuokos ir valdų perėjimas"],
  ["Kiškos", "Kiška|Kiškait|Kiškien", "Kėdainiai, Reformacija, spaustuvės ir paveldėjimas"],
  ["Hlebavičiai", "Hlebavi", "LDK pareigūnai, Zaslavlis, Dubrovna ir konfesijų kaita"],
  ["Chreptavičiai", "Chreptavi", "Ščiorsai, biblioteka, švietimas ir dvaro ūkio pertvarkymas"],
  ["Valavičiai", "Valavi", "Kanceliarija, teisė, konfesijos ir bažnytinės fundacijos"],
  ["Zavišos", "Zaviš", "LDK pareigūnai, memuarai ir dvarų tinklas"],
  ["Zenavičiai", "Zenavi|Zienovi", "Smurgainys, Reformacija ir dvarų kultūra"],
  ["Naruševičiai", "Naruševi|Narusze", "Iždas, valstybės tarnyba, raštija ir istoriografija"],
  ["Vainos", "Vaina|Vainait", "Vyskupai, pareigūnai ir fundacijos; tikrinti bendravardžius"],
  ["Masalskiai", "Masalsk|Masalskait", "Vilniaus vyskupija, Verkiai, švietimas ir politiniai konfliktai"],
  ["Kosakovskiai", "Kosakovsk|Kosakausk", "Vaitkuškis, Lyduokiai; politika, fotografija ir kolekcijos"],
  ["Tyzenhauzai", "Tyzenhauz|Tiesenhauz", "Gardinas, Pastovys, Rokiškis; manufaktūros ir gamtotyra"],
  ["Bžostovskiai", "Bžostov|Bžostausk", "Pavlovo respublika, žemėvalda ir valstiečių padėtis"],
  ["Lopacinskiai", "Lopacinsk|Lopacinskait", "Kairėnai, Vilniaus rūmai, vyskupai ir korespondencija"],
  ["Römeriai", "Römer|Romer|Riomer", "Dailė, dienoraščiai, teisė, Bagdoniškis ir Tytuvėnai"],
  ["Zubovai", "Zubov|Zubovait", "Šiaulių kraštas, Ginkūnai, Bubiai; ūkis, švietimas ir dvarų kaita"],
  ["Bilevičiai", "Bilevi", "Žemaitijos bajorija, Šiluva ir politinis bei religinis gyvenimas"],
  ["Gorskiai", "Gorsk|Gorskait", "Žemaitijos dvarai, Biržuvėnai, ūkis ir archyvai"],
  ["Karpiai", "Karpis|Karpait|Karpių", "Joniškėlis, švietimo ir gydymo įstaigos, testamentai"],
  ["Šemetos", "Šemet", "Žemaitijos bajorai, dvarai, teismai ir kasdienybė"],
  ["Siesickiai", "Siesick|Siesik", "Siesikai, rezidencija ir šeimos valdų perdavimas"],
  ["Zabielos", "Zabiel", "Kauno pavietas, Labūnava, sukilimai ir tarnyba"],
  ["Nagurskiai", "Nagursk", "Kurtuvėnai, Žemaitijos dvarų ūkis ir politinė veikla"],
  ["Bielozorai", "Bieloz|Bialoz", "Upytės kraštas, dvasininkai ir moterų dienoraščiai"],
  ["Hylzenai", "Hylzen|Hilzen", "Livonija, istorijos rašymas, dvarai ir fundacijos"],
  ["Soltanai", "Soltan|Solton", "LDK tarnyba, konfesijos ir skirtingos giminės šakos"],
  ["Oskierkos", "Oskierk", "LDK pavietų bajorija, politinės karjeros ir žemėvalda"],
  ["Pšezdzieckiai", "Pšezd|Przezd|Pšezdeck", "Rokiškis ir valdos, pareigūnai, kolekcijos; pavardės variantai"],
  ["Potockiai", "Potock", "Atrinkti su LDK susijusias šakas, valdas ir santuokas"],
  ["Puttkameriai", "Puttkam|Putkam", "Vilniaus krašto dvarai, literatūrinė atmintis ir genealogija"],
]
const slugs = (s) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
const people = fs.readdirSync(path.join(root,"objektai/asmenys")).filter(n=>n.endsWith(".md"))
const rows=[]
for (const [i,[name, pattern, focus]] of families.entries()) {
  const id=slugs(name), stage=i<12?1:i<28?2:3
  const matches=people.filter(n=>new RegExp(pattern,"iu").test(n)).sort((a,b)=>a.localeCompare(b,"lt"))
  const entries=matches.map(n=>{
    const {data}=matter(fs.readFileSync(path.join(root,"objektai/asmenys",n),"utf8"))
    const view=JSON.parse(data.object_page_view_json||"{}")
    const count=Number(data.media_total_count||0)
    const portrait=view.portrait?.media_id || "—"
    const evidence=Number(data.object_page_claim_count||0)
    return `| [${n.slice(0,-3)}](<../../objektai/asmenys/${n}>) | ${evidence || "tikrinti"} | ${count} | ${portrait} | tikrinti tapatybę ir šaką |`
  })
  const status=i<2?"Parengta paroda, straipsnis ir šaltiniais paremtas narių registras; visa genealogija dar nesuderinta":"Suplanuota; surinkti vietiniai kandidatai"
  const text=`# ${name}\n\nAtnaujinta: 2026-09-21. Eilė: ${i+1}. Etapas: ${stage}.\n\n**Būsena:** ${status}.\n\n**Tyrimo kryptys:** ${focus}. Tai paieškos užduotys; konkretaus žmogaus nuosavybę, laikotarpį ir giminystę būtina patvirtinti.\n\n[Visų giminių planas](README.md) · [Vienodos rengimo taisyklės](metodika.md)\n\n## Vietinių asmenų puslapių inventorius\n\nRasta **${matches.length}** failų pagal vardų paiešką. Tai nėra tiek pat unikalių ar patvirtintų giminės narių. Įrašai be teiginių gali būti tik pradinės kortelės. Medijų skaičius nereiškia portretų skaičiaus; parodai reikia atskiros vaizdo patikros.\n\n| Puslapis | Teiginių metaduomenys | Medijų metaduomenys | Parinkto atvaizdo ID | Genealogijos būsena |\n|---|---:|---:|---|---|\n${entries.join("\n")}\n\n## Ką surinkti prieš užbaigiant parodą\n\n- [ ] Giminės kilmė, herbas, titulai ir dokumentais atskirtos šakos.\n- [ ] Visi šaltiniuose identifikuoti nariai, įskaitant dukteris, sutuoktines, anksti mirusius vaikus ir šonines šakas; kiekvienam asmens puslapis.\n- [ ] Gimimo ir mirties datos, tėvai, santuokos, vaikai; kiekvieno ryšio šaltinis.\n- [ ] Pareigos, darbai, fundacijos, nuopelnai ir dokumentuoti konfliktai.\n- [ ] Portretų autorius, sukūrimo data, saugotojas, inventoriaus numeris, teisės ir originalo nuoroda.\n- [ ] Dvarų bei žemių lentelė su savininku, įgijimo būdu ir valdymo datomis.\n- [ ] Atminties vietos, kapavietės, archyvai, knygos ir išlikę daiktai.\n- [ ] Atskirai parengtas straipsnis ir vaizdinė paroda; patikrintos asmenų ir eksponatų nuorodos.\n\n## Šaltinių paieškos pradžia\n\n- [VLE didikų giminių rodyklė](https://www.vle.lt/zymiausios-ldk-didiku-gimines/) – pradinis orientyras, ne kiekvienos šiame plane esančios šeimos įrodymas.\n- [Vietinis bajorijos šaltinių katalogas](../../../bajoru_saltiniu_katalogas.md) – tyrimai, archyvai ir ikonografijos rinkinių nuorodos.\n- Pirmiausia peržiūrėti aukščiau susietų asmenų puslapių bibliografiją. Naujų šaltinių konkrečius URL, skaitytas vietas ir patikrintus teiginius įrašyti į šios giminės tyrimo užrašus.\n`
  fs.writeFileSync(path.join(dir,`${id}.md`),text)
  rows.push(`| ${i+1} | [${name}](${id}.md) | ${stage} | ${matches.length} | ${focus} | ${i<2?"Paroda ir narių registras parengti":"Laukia tyrimo"} |`)
}
fs.writeFileSync(path.join(dir,"README.md"),`# Lietuvos ir LDK bajorų giminių parodų planas\n\nAtnaujinta: 2026-09-21. **${families.length} giminių darbo sąrašas.**\n\nAprėptis: su istorine Lietuva ir LDK susijusios didikų, kunigaikščių ir regioninės bajorijos giminės nuo viduramžių iki XX a. pradžios. LDK erdvė apima ir dabartines Baltarusiją, Ukrainą, Lenkiją bei Latviją. Sąrašas skirtas nuosekliam parodų ciklui, ne visų kada nors bajorystę turėjusių pavardžių registrui. Kunigaikščių giminės įtrauktos dėl jų dalyvavimo LDK diduomenėje; valdovų Gediminaičių ir Jogailaičių ciklas jau nagrinėjamas atskirai.\n\nKiekvienai giminei sukurtas atskiras darbo failas su rastų asmenų puslapiais. 1 etapas – pradinis parodų branduolys; 2 etapas – platesnis LDK diduomenės ratas; 3 etapas – regioninės ir vėlesnės dvarininkų istorijos. Eilė redakcinė, ne istorinės svarbos reitingas.\n\n## Eilė\n\n| Eilė | Giminė ir narių inventorius | Etapas | Rasti asmenų failai | Tyrimo kryptys | Būsena |\n|---:|---|---:|---:|---|---|\n${rows.join("\n")}\n\n## Parengtos Radvilų ir Sapiegų parodos\n\n- [Straipsnio tekstas](../../straipsniai/radvilos-gimine-valdos-ir-paveldas.md).\n- [Parodos manifestas](../../quartz/static/exhibitionNobleFamilies.json): /parodos/radvilos-gimine-valdos-ir-paveldas.\n- [Radvilų narių inventorius](radvilos.md) ir [tyrimo užrašai](radvilos-tyrimas.md).\n- [Sapiegų straipsnis](../../straipsniai/sapiegos-statutai-rumai-ir-laiskai.md) ir [tyrimo užrašai](sapiegos-tyrimas.md).\n- [58 Radvilų registro įrašai](radvilos-nariu-registras.md) ir [68 Sapiegų registro įrašai](sapiegos-nariu-registras.md), įskaitant sutuoktinius. Trijų moterų puslapiai sieja abi gimines.\n- Sukurti 89 nauji asmenų puslapiai ir papildytos devynios pradinės Radvilų biografijos; turinys saugomas kanoninėje DB.\n- Dabartinė užduotis apsiriboja šiomis dviem parodomis. Likusių giminių failai yra tyrimo planas.\n\n## Užbaigimo kriterijus\n\nGiminė baigta tik tada, kai suderintas konkrečios genealogijos narių sąrašas, visi jo žmonės turi patikrintas korteles, giminystės ryšiai ir valdos turi šaltinius, portretų tapatybė bei teisės aiškios, o straipsnis ir paroda veikia. Parengtos parodos nereiškia, kad išsamiai užbaigta kelių šimtmečių genealogija. „Visi nariai“ reiškia visus nustatytus pasirinktuose šaltiniuose ir aiškiai aprašytoje genealogijos aprėptyje; nežinomi žmonės nebus pramanyti.\n\n[Metodika ir parodos struktūra](metodika.md).\n`)
console.log(`Sudaryti ${families.length} giminių inventoriai.`)
