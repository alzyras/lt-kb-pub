import fs from "node:fs"
import { QuartzPluginData } from "../plugins/vfile"
import { FilePath, slugifyFilePath } from "./path"

export const collectionCategories = [
  ["asmenys", "Asmenys", "Žmonės, jų gyvenimai ir istorijoje palikti pėdsakai."],
  ["ivykiai", "Įvykiai", "Mūšiai, sutartys, atradimai ir Lietuvos istorijos lūžiai."],
  ["vietos", "Vietos", "Miestai, pilys, kraštai ir erdvės, kuriose vyko istorija."],
  ["grupes", "Grupės", "Giminės, bendruomenės ir institucijos."],
  ["daiktai", "Daiktai", "Praeitį liudijantys daiktai, dokumentai ir ženklai."],
  ["autoriai", "Autoriai", "Metraštininkai, istorikai ir kiti praeities pasakotojai."],
  ["paprociai", "Papročiai", "Apeigos, tradicijos ir kasdienio gyvenimo praktikos."],
  ["posakiai", "Posakiai", "Atmintyje išlikę žodžiai ir jų kontekstai."],
  ["zodynas", "Sąvokos", "Istorijos kalba, reikšmės ir paaiškinimai."],
  ["saltiniai", "Šaltiniai", "Leidiniai ir dokumentai, kuriais remiasi mūsų pasakojimas."],
] as const

/** Membership comes from the published hub, never a guessed date or a truncated preview. */
export function collectionMemberSlugs(markdown: string): Set<string> {
  return new Set(
    [...markdown.matchAll(/\[\[(objektai\/[^\]|#]+)(?:[^\]]*)\]\]/gu)].map((match) =>
      slugifyFilePath(`${match[1].replace(/\.md$/, "")}.md` as FilePath),
    ),
  )
}

export function collectionMembers(page: QuartzPluginData, allFiles: QuartzPluginData[]) {
  const slugs =
    page.filePath && fs.existsSync(page.filePath)
      ? collectionMemberSlugs(fs.readFileSync(page.filePath, "utf8"))
      : new Set((page.links ?? []).map(String))
  return [
    ...new Map(
      allFiles.filter((file) => file.slug && slugs.has(file.slug)).map((file) => [file.slug, file]),
    ).values(),
  ]
}

export function collectionPeriods(allFiles: QuartzPluginData[]) {
  return [
    ...new Map(
      allFiles
        .filter((file) => file.frontmatter?.tipas === "laikotarpis")
        .map((file) => [file.slug, file]),
    ).values(),
  ].sort(
    (a, b) =>
      Number(a.frontmatter?.periodo_pradzia) - Number(b.frontmatter?.periodo_pradzia) ||
      Number(a.frontmatter?.periodo_pabaiga) - Number(b.frontmatter?.periodo_pabaiga),
  )
}
