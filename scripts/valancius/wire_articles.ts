/** Mechanical, repeatable linking of authored Markdown to actual exported ids. */
import { readFileSync, writeFileSync } from "node:fs"
import { globby } from "globby"
import { createUniqueSlugMap, type FilePath } from "../../quartz/util/path"
import { mediaDetailUrl } from "../../quartz/util/objectMedia"
import { linkEvidenceText } from "./article_links"
import {
  objectDetailEvidenceFromFile,
  objectEvidenceDisplayItems,
} from "../../quartz/util/objectDetail"
const root = process.cwd()
const paths = await globby(["objektai/**/*.md"])
const slugs = createUniqueSlugMap(paths as FilePath[])
const audit = JSON.parse(readFileSync("scripts/valancius/evidence-register.json", "utf8")).map(
  (row: any) => ({
    claim: { note_path: row.notePath, global_claim_code: row.claimId },
    evidence: row.evidence.map((quote: any) => ({ global_quote_code: quote.citationId })),
  }),
)
const links = new Map<string, string>()
for (const row of audit) {
  const path = row.claim.note_path
  const code = row.claim.global_claim_code
  const slug = slugs.get(path)
  if (!slug) continue
  const evidence = objectDetailEvidenceFromFile(`${root}/${path}`)
  const position = objectEvidenceDisplayItems(evidence).findIndex(
    (item) =>
      item.kind === "claim" && (item.value.id === code || item.value.globalIds?.includes(code)),
  )
  if (position < 0) continue
  const page = Math.floor(position / 50) + 1
  const href = `/${slug}/irodymai${page > 1 ? `/${page}` : ""}/#claim-${code}`
  links.set(code, href)
  for (const quote of row.evidence) links.set(quote.global_quote_code, href)
}
const selected = Object.fromEntries(
  JSON.parse(readFileSync("scripts/valancius/exhibit-register.json", "utf8")).map((row: any) => [
    row.key,
    row,
  ]),
)
const catalogue = JSON.parse(readFileSync("quartz/static/mediaCatalogSource.json", "utf8")).entries
const escape = (s: string) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;")
const configurations = [
  {
    file: "motiejus-valancius-ir-rusijos-imperija",
    hero: "portretas1854",
    figures: [
      ["portretas1854", "## Vienas parašas"],
      ["taurage", "## Veikti sistemoje"],
      ["tomasevicius", "## Po sukilimo"],
      ["dienorastis", "## Ką ši istorija"],
    ],
  },
  {
    file: "kaip-valancius-keite-kasdienybe",
    hero: "medzio-raizinys",
    figures: [
      ...["medzio-raizinys", "karcemos-paveikslas", "smilgiu-rastas", "knyga1849", "portretas1857", "brostwa", "oginskis", "medalis"].map(key => [key, `<!-- FIGURE ${key} -->`]),
    ],
  },
]
for (const config of configurations) {
  const path = `straipsniai/${config.file}.md`
  let content = readFileSync(path, "utf8")
  // Preserve prose, re-link only editorial evidence ids, removing old broken targets.
  content = linkEvidenceText(content, links)
  content = content.replace(/<figure class="valancius-figure">[\s\S]*?<\/figure>\n*/g, "")
  const hero = selected[config.hero]
  for (const field of [
    "media_primary_thumb_url",
    "media_primary_width",
    "media_primary_height",
    "media_social_alt",
  ]) {
    content = content.replace(new RegExp(`^${field}:.*\\n`, "m"), "")
  }
  content = content.replace(
    "tipas: straipsnis",
    `media_primary_thumb_url: "${hero.asset}"\nmedia_primary_width: ${hero.width}\nmedia_primary_height: ${hero.height}\nmedia_social_alt: ${JSON.stringify(hero.title)}\ntipas: straipsnis`,
  )
  config.figures.forEach(([key, prefix], index) => {
    const media = selected[key]
    const entry = catalogue.find((e: any) => e.mediaId === media.mediaId)
    if (!entry) throw new Error(`Missing catalogue entry ${key}`)
    const figure = `<figure class="valancius-figure"><a href="${mediaDetailUrl(entry)}"><img src="${media.asset}" width="${media.width}" height="${media.height}" alt="${escape(media.title)}" loading="${index ? "lazy" : "eager"}"${index ? "" : ' fetchpriority="high"'} /></a><figcaption>${escape(media.attribution)} <a href="${mediaDetailUrl(entry)}">Atverti galerijos kortelę ir kilmės duomenis</a>.</figcaption></figure>\n\n`
    if (!content.includes(prefix)) throw new Error(`Missing figure placement ${prefix}`)
    // Keep the insertion marker for repeatable regeneration of the B draft.
    content = content.replace(prefix, figure + prefix)
  })
  writeFileSync(path, content)
  const main = content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/<details[\s\S]*?<\/details>/g, "")
    .replace(/<figure[\s\S]*?<\/figure>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .split("## Šaltiniai")[0]
    .replace(/<[^>]*>/g, "")
  console.log(path, main.split(/\s+/).filter(Boolean).length, "main words")
}
