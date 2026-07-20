import fs from "node:fs"
import path from "node:path"
import { CITATION_SECTION_TITLES, parseEvidenceSections } from "../quartz/util/citationFilter"

const objectRoot = path.resolve(process.env.CORPUS_ROOT ?? "objektai")
const publicRoot = path.resolve(process.env.PUBLIC_ROOT ?? "public")

function listMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdownFiles(entryPath)
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : []
  })
}

function readJson<T>(relativePath: string): T {
  const filePath = path.join(publicRoot, relativePath)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing generated build asset: ${relativePath}`)
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T
  } catch (error) {
    throw new Error(`Invalid generated JSON asset: ${relativePath}`, { cause: error })
  }
}

function citationCount(markdown: string): number {
  const sections = parseEvidenceSections(markdown)
  return [...sections.entries()]
    .filter(([title]) => CITATION_SECTION_TITLES.has(title))
    .flatMap(([, entries]) => entries)
    .filter((entry) => entry.id.startsWith("c-")).length
}

const failures: string[] = []
const requiredFiles = [
  "index.html",
  "static/citationSources.json",
  "static/sourceCatalog.json",
  "static/randomClaims.json",
  "static/contentIndex.json",
  "static/searchIndex.json",
  "static/exhibitionMediaContext.json",
]

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(publicRoot, relativePath))) {
    failures.push(`missing ${relativePath}`)
  }
}

if (fs.existsSync(path.join(publicRoot, "static/exhibitionMediaContext.json"))) {
  const contexts = readJson<
    Record<
      string,
      {
        exhibitionId?: string
        items?: Array<{
          mediaId?: string
          descriptionLt?: string
          sectionSlug?: string
          featured?: boolean
        }>
      }
    >
  >("static/exhibitionMediaContext.json")
  const expectedCounts: Record<string, number> = {
    "vytautas-didysis-tarp-istorijos-ir-atvaizdo": 32,
    "vytauto-atminties-kultas-tarpukariu": 20,
  }
  const expectedFeaturedCounts: Record<string, number> = {
    "vytautas-didysis-tarp-istorijos-ir-atvaizdo": 24,
    "vytauto-atminties-kultas-tarpukariu": 18,
  }
  for (const [exhibitionId, expectedCount] of Object.entries(expectedCounts)) {
    const context = contexts[exhibitionId]
    if (!context) {
      failures.push(`missing gallery context for ${exhibitionId}`)
      continue
    }
    if (context.items?.length !== expectedCount) {
      failures.push(
        `${exhibitionId} gallery context has ${context.items?.length ?? 0} items; expected ${expectedCount}`,
      )
    }
    if (context.items?.some((item) => !item.mediaId || !item.descriptionLt)) {
      failures.push(`${exhibitionId} gallery context contains an incomplete item`)
    }
    const mediaIds = context.items?.map((item) => String(item.mediaId ?? "")) ?? []
    if (new Set(mediaIds).size !== mediaIds.length) {
      failures.push(`${exhibitionId} gallery context contains duplicate media IDs`)
    }
    if (context.items?.some((item) => !item.sectionSlug || typeof item.featured !== "boolean")) {
      failures.push(`${exhibitionId} gallery context contains incomplete slideshow fields`)
    }
    const featuredCount = context.items?.filter((item) => item.featured).length ?? 0
    if (featuredCount !== expectedFeaturedCounts[exhibitionId]) {
      failures.push(
        `${exhibitionId} slideshow context has ${featuredCount} featured items; expected ${expectedFeaturedCounts[exhibitionId]}`,
      )
    }
    const pagePath = path.join(publicRoot, "parodos", exhibitionId, "index.html")
    const pageHtml = fs.existsSync(pagePath) ? fs.readFileSync(pagePath, "utf8") : ""
    if (!pageHtml.includes("data-exhibition-slideshow") || !pageHtml.includes("mode=slideshow")) {
      failures.push(`${exhibitionId} page is missing the slideshow launch link`)
    }
  }
}

if (fs.existsSync(objectRoot)) {
  const sourceFiles = listMarkdownFiles(objectRoot)
  const expectedQuotes = sourceFiles.reduce(
    (count, filePath) => count + citationCount(fs.readFileSync(filePath, "utf8")),
    0,
  )

  if (expectedQuotes > 0) {
    const citationSources = readJson<Array<{ quoteCount?: number; count?: number }>>(
      "static/citationSources.json",
    )
    const sourceCatalog = readJson<Array<{ channel?: string }>>("static/sourceCatalog.json")
    const randomClaims = readJson<Record<string, unknown>>("static/randomClaims.json")
    const contentIndex = readJson<Record<string, unknown>>("static/contentIndex.json")
    const searchIndex = readJson<Record<string, unknown>>("static/searchIndex.json")

    const renderedQuoteCount = citationSources.reduce(
      (count, source) => count + Number(source.quoteCount ?? source.count ?? 0),
      0,
    )
    if (citationSources.length === 0 || renderedQuoteCount === 0) {
      failures.push(
        `static/citationSources.json is empty although the corpus contains ${expectedQuotes} citations`,
      )
    }
    if (!sourceCatalog.some((source) => source.channel === "text")) {
      failures.push("static/sourceCatalog.json has no text citation sources")
    }
    if (Object.keys(randomClaims).length === 0) failures.push("static/randomClaims.json is empty")
    if (Object.keys(contentIndex).length === 0) failures.push("static/contentIndex.json is empty")
    if (Object.keys(searchIndex).length === 0) failures.push("static/searchIndex.json is empty")
  }
} else {
  failures.push(`missing corpus directory ${path.relative(process.cwd(), objectRoot)}`)
}

console.log(JSON.stringify({ publicRoot, objectRoot, failures }, null, 2))
if (failures.length > 0) process.exitCode = 1
