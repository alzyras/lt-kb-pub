/** Public names and introductions shared by collection and object pages. */
export const objectTypes = [
  {
    folder: "asmenys",
    type: "asmuo",
    title: "Asmenys",
    singular: "Asmuo",
    description:
      "Žmonės, kurių gyvenimai susipina su Lietuvos istorija. Atraskite jų darbus, pasirinkimus ir paliktus pėdsakus.",
  },
  {
    folder: "autoriai",
    type: "autorius",
    title: "Autoriai",
    singular: "Autorius",
    description:
      "Istoriją užrašę ir tyrinėję žmonės. Nuo kronikininkų iki istorikų — jų balsai, tekstai ir liudijimai.",
  },
  {
    folder: "ivykiai",
    type: "ivykis",
    title: "Įvykiai",
    singular: "Istorinis įvykis",
    description:
      "Lūžiai ir kasdienybės akimirkos, keitusios Lietuvos gyvenimą. Tyrinėkite įvykius ir juos siejančias istorijas.",
  },
  {
    folder: "vietos",
    type: "vieta",
    title: "Vietos",
    singular: "Vieta",
    description:
      "Miestai, kraštai ir vietovės, kuriose skleidėsi istorija. Pažinkite vietas per jų žmones ir įvykius.",
  },
  {
    folder: "grupes",
    type: "grupe",
    title: "Grupės",
    singular: "Grupė",
    description:
      "Bendruomenės, organizacijos ir judėjimai. Žmones telkusios idėjos, bendri tikslai ir veikla.",
  },
  {
    folder: "daiktai",
    type: "daiktas",
    title: "Daiktai",
    singular: "Istorinis objektas",
    description:
      "Materialūs praeities pėdsakai — nuo kasdienybės daiktų iki istorinių simbolių. Atraskite jų paskirtį ir istorijas.",
  },
  {
    folder: "paprociai",
    type: "paprotys",
    title: "Papročiai",
    singular: "Paprotys",
    description:
      "Tradicijos, apeigos ir gyvenimo būdas. Pažinkite tai, kas jungė bendruomenes ir keliavo iš kartos į kartą.",
  },
  {
    folder: "posakiai",
    type: "posakis",
    title: "Posakiai",
    singular: "Posakis",
    description:
      "Žodžiai, išlikę istorijoje. Posakiai, citatos ir šūkiai — kartu su aplinkybėmis, kuriomis jie buvo ištarti ar užrašyti.",
  },
  {
    folder: "zodynas",
    type: "zodyno_irasas",
    title: "Žodynas",
    singular: "Sąvoka",
    description:
      "Sąvokos, padedančios skaityti praeitį. Istoriniai terminai, jų reikšmės ir vartojimo kontekstas.",
  },
  {
    folder: "saltiniai",
    type: "saltinis",
    title: "Šaltiniai",
    singular: "Šaltinis",
    description:
      "Leidiniai, dokumentai ir liudijimai, kuriais remiasi kolekcija. Atraskite, iš kur pažįstame Lietuvos praeitį.",
  },
] as const

export function objectCountLabel(
  count: number,
  kind: "claims" | "quotes" | "entries" | "relations",
) {
  const forms = {
    claims: ["teiginys", "teiginiai", "teiginių"],
    quotes: ["citata", "citatos", "citatų"],
    entries: ["įrašas", "įrašai", "įrašų"],
    relations: ["ryšys", "ryšiai", "ryšių"],
  }[kind]
  const last = Math.abs(count) % 10
  const tens = Math.abs(count) % 100
  return forms[(tens >= 11 && tens <= 19) || last === 0 ? 2 : last === 1 ? 0 : 1]
}

export function objectCardTags(tags: string[], type: string) {
  return tags.filter((tag) => tag !== type).slice(0, 4)
}
