/** Sync only the authored B article. No database, object exports or exhibitions. */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"

export const articlePath = "straipsniai/kaip-valancius-keite-kasdienybe.md"
export const sourcePath = "scripts/valancius/b-article.md"

const groups = [
  ["pradzia", "Laiškas Nazimovui ir jo adresatas"],
  ["karcema", "Papročiai ir amžininkų aiškinimai"],
  ["pajamos", "Dvaro ūkis, nuoma ir mokesčių atpirkimas"],
  ["kvietimas", "Ankstesnės iniciatyvos, raštas ir balsas"],
  ["pazadas", "Brolijos pareigos, religinė praktika ir prievartos riba"],
  ["permaina", "Gamyba, dvarininkas ir nesutarianti valdžia"],
  ["pabaiga", "Neužbaigta permaina ir Salantų liudijimas"],
]
const figureKeys = [
  "medzio-raizinys",
  "karcemos-paveikslas",
  "smilgiu-rastas",
  "knyga1849",
  "portretas1857",
  "brostwa",
  "oginskis",
  "medalis",
]
const escape = (text) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

function replaceOnce(text, marker, value) {
  if (text.split(marker).length !== 2) throw new Error(`Expected one marker: ${marker}`)
  return text.replace(marker, () => value)
}

export function renderBArticle(authored, existing) {
  let result = authored
  const cards = [
    ...existing.matchAll(/<details class="article-evidence">[\s\S]*?<\/details>/g),
  ].map((m) => m[0])
  if (cards.length !== groups.length) throw new Error("Expected seven existing evidence cards")
  for (const [key, title] of groups) {
    const matches = cards.filter((card) => card.includes(`<strong>${title}</strong>`))
    if (matches.length !== 1) throw new Error(`Missing or ambiguous evidence card: ${title}`)
    result = replaceOnce(result, `<!-- EVIDENCE ${key} -->`, matches[0])
  }
  const figures = [
    ...existing.matchAll(
      /(<figure class="valancius-figure">[\s\S]*?<\/figure>)\s*<!-- FIGURE ([\w-]+) -->/g,
    ),
  ]
  if (figures.length !== figureKeys.length)
    throw new Error("Expected eight existing marked illustrations")
  for (const key of figureKeys) {
    const matches = figures.filter((match) => match[2] === key)
    if (matches.length !== 1) throw new Error(`Missing or ambiguous illustration: ${key}`)
    let figure = matches[0][1]
    const captions = [...authored.matchAll(new RegExp(`<!-- CAPTION ${key}: ([^\\n]+) -->`, "g"))]
    if (captions.length > 1) throw new Error(`Ambiguous caption: ${key}`)
    if (captions.length) {
      // The authored caption changes neither the image nor its gallery URL.
      if (!/(<figcaption>)[\s\S]*?( <a href=)/.test(figure)) {
        throw new Error(`Missing replaceable caption: ${key}`)
      }
      figure = figure.replace(
        /(<figcaption>)[\s\S]*?( <a href=)/,
        (_match, open, link) => `${open}${escape(captions[0][1])}${link}`,
      )
    }
    result = replaceOnce(result, `<!-- FIGURE ${key} -->`, `${figure}\n\n<!-- FIGURE ${key} -->`)
  }
  if (/<!-- EVIDENCE /.test(result)) throw new Error("Unresolved evidence marker")
  for (const match of authored.matchAll(/<!-- (FIGURE|CAPTION) ([\w-]+)/g)) {
    if (!figureKeys.includes(match[2])) throw new Error(`Unknown illustration marker: ${match[2]}`)
  }
  const data = matter(existing).data
  const metadata = [
    "media_primary_thumb_url",
    "image",
    "media_primary_width",
    "media_primary_height",
    "media_social_alt",
  ]
    .map((field) => {
      if (data[field] === undefined) throw new Error(`Missing existing social metadata: ${field}`)
      return `${field}: ${JSON.stringify(data[field])}`
    })
    .join("\n")
  result = replaceOnce(result, "\ntipas: straipsnis\n", `\n${metadata}\ntipas: straipsnis\n`)
  return result
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  if (args.length > 1 || (args.length && !["--check", "--write"].includes(args[0]))) {
    throw new Error("Usage: node scripts/valancius/sync_b_article.mjs [--check|--write]")
  }
  const existing = fs.readFileSync(articlePath, "utf8")
  const rendered = renderBArticle(fs.readFileSync(sourcePath, "utf8"), existing)
  if (args[0] === "--write") fs.writeFileSync(articlePath, rendered)
  else if (rendered !== existing)
    throw new Error("B article differs from its authored source; run sync_b_article.mjs --write")
}
