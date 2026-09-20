import fs from "node:fs"
import path from "node:path"
import { MediaEntry } from "./objectMedia"

export type RulerEra = "ldk" | "atr"
export type RulerSource = { title: string; url: string; revision?: number }
export type Ruler = {
  id: string
  name: string
  objectSlug: string
  notePath: string
  years: string
  reigns: { start: number; end: number }[]
  eras: RulerEra[]
  notice: string
  media: MediaEntry
  imageNote: string
  contextualImage?: boolean
  sources: RulerSource[]
}
export const rulerExhibitionSlug = "parodos/lietuvos-ir-atr-valdovai"
export const rulerEras: { id: RulerEra; title: string; dates: string; introduction: string }[] = [
  { id: "ldk", title: "Lietuvos Didžioji Kunigaikštystė", dates: "XIII a. – 1569 m.", introduction: "Nuo Mindaugo karalystės iki Jogailaičių dvaro. Ankstyvieji valdovai jungė žemes, kūrė sąjungas ir gynė valstybę, kurios politinis bei kultūrinis pasaulis ilgainiui aprėpė didelę Vidurio ir Rytų Europos dalį. Valdžios paveldėjimas nebuvo tiesi linija: ją keitė dinastiniai konfliktai, susitarimai ir skirtingos valdovo autoriteto sampratos." },
  { id: "atr", title: "Abiejų Tautų Respublika", dates: "1569–1795 m.", introduction: "Liublino unija sujungė Lietuvos Didžiąją Kunigaikštystę ir Lenkijos Karalystę į bendrą valstybę su renkamu valdovu bei Seimu. Lietuva išsaugojo atskiras institucijas, teisę ir kariuomenę. Šio laikotarpio valdovų istorija — ir jų santykio su bajorų politine bendruomene, ir karų, reformų bei kaimyninių valstybių įtakos istorija." },
]
let catalogue: Ruler[] | undefined
export function loadRulers(): Ruler[] {
  if (!catalogue) catalogue = JSON.parse(fs.readFileSync(path.resolve("quartz/static/rulersSource.json"), "utf8")).rulers
  return catalogue!
}
export function rulersForEra(era: RulerEra): Ruler[] {
  return loadRulers().filter((ruler) => ruler.eras.includes(era))
}

export const museumPlaces = [
  ["Vilnius", "Valdovo miestas, diplomatiniai laiškai ir daugiakultūrė sostinės atmintis."],
  ["Trakai", "Salos pilis ir Lietuvos didžiųjų kunigaikščių rezidencijų kraštovaizdis."],
  ["Kernavė", "Ankstyvosios valstybės centras, kurio istoriją liudija piliakalniai ir archeologija."],
  ["Kaunas", "Nemuno ir Neries santaka, gynyba bei prekybos keliai."],
  ["Gardinas", "Valdovų rezidencijos ir vienas svarbių Lietuvos Didžiosios Kunigaikštystės centrų."],
  ["Naugardukas", "Rusėniškųjų žemių ir ankstyvosios Lietuvos politinių ryšių sankirta."],
  ["Krėva", "Pilis, dinastinių konfliktų ir 1385 metų susitarimo atmintis."],
  ["Nesvyžius", "Radvilų rezidencija, bibliotekos ir didikų kultūros paveldas."],
] as const
