import type { QuartzPluginData } from "../plugins/vfile"
import type { ObjectDetailEvidence } from "./objectDetail"
import { cleanText } from "./objectMedia"
const normalize = (value: unknown) =>
  cleanText(value)
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("lt")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
const indexes = new WeakMap<QuartzPluginData[], Map<string, QuartzPluginData | null>>()
export function objectBibliography(files: QuartzPluginData[], evidence: ObjectDetailEvidence) {
  let index = indexes.get(files)
  if (!index) {
    index = new Map()
    for (const file of files) {
      if (!/^objektai\/saltiniai\/[^/]+$/.test(file.slug || "")) continue
      for (const label of [
        file.frontmatter?.title,
        file.frontmatter?.pavadinimas,
        file.slug?.split("/").at(-1),
      ]) {
        const key = normalize(label)
        if (!key) continue
        if (!index.has(key)) index.set(key, file)
        else if (index.get(key)?.slug !== file.slug) index.set(key, null)
      }
    }
    indexes.set(files, index)
  }
  const groups = new Map<
    string,
    {
      id: string
      title: string
      slug?: QuartzPluginData["slug"]
      author: string
      year: string
      aliases: string[]
      claimIds: Set<string>
      citationIds: Set<string>
    }
  >()
  for (const title of evidence.sourceTitles) {
    const candidates = [title, ...title.split(" — ")]
      .map((value) => index!.get(normalize(value)))
      .filter(Boolean) as QuartzPluginData[]
    const source =
      new Set(candidates.map((file) => file.slug)).size === 1 ? candidates[0] : undefined
    const id = source?.slug || `title:${normalize(title)}`
    let row = groups.get(id)
    if (!row) {
      row = {
        id,
        title: cleanText(source?.frontmatter?.title || source?.frontmatter?.pavadinimas) || title,
        slug: source?.slug,
        author: cleanText(source?.frontmatter?.autorius || source?.frontmatter?.author),
        year: cleanText(source?.frontmatter?.metai || source?.frontmatter?.year),
        aliases: [],
        claimIds: new Set(),
        citationIds: new Set(),
      }
      groups.set(id, row)
    }
    row.aliases.push(title)
    for (const claim of evidence.claims)
      if (claim.sourceTitles.includes(title)) row.claimIds.add(claim.id)
    for (const citation of evidence.citationRecords)
      if (
        cleanText(
          citation.entry.fields.get("šaltinis") || citation.entry.fields.get("saltinis"),
        ) === title
      )
        row.citationIds.add(`${citation.section}:${citation.id}`)
  }
  return [...groups.values()].sort(
    (a, b) => b.claimIds.size - a.claimIds.size || a.title.localeCompare(b.title, "lt"),
  )
}
