import fs from "node:fs"
import path from "node:path"
import {
  CITATION_SECTION_TITLES,
  parseEvidenceSections,
} from "../quartz/util/citationFilter"
import { evidenceSupportsClaim, evidenceTextOverlapScore } from "../quartz/util/evidenceIntegrity"

const objectRoot = path.resolve(process.env.CORPUS_ROOT ?? "objektai")

function listMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdownFiles(filePath)
    return entry.isFile() && entry.name.endsWith(".md") ? [filePath] : []
  })
}

function citationText(fields: Map<string, string>): string {
  return ["citata_originali", "citata_rodoma", "citata"]
    .map((key) => fields.get(key)?.trim() ?? "")
    .filter(Boolean)
    .filter((text, index, values) => values.indexOf(text) === index)
    .join("\n")
}

function documentContext(markdown: string): string {
  const frontmatterTitle = markdown.match(/^pavadinimas:\s*["']?(.+?)["']?\s*$/m)?.[1]
  if (frontmatterTitle) return frontmatterTitle.trim()
  return markdown.match(/^#\s+(.+?)\s*$/m)?.[1]?.trim() ?? ""
}

const counts = new Map<number, number>()
let unsupportedReferences = 0
let indexOnlyReferences = 0
let textMismatchReferences = 0
const examples: Array<Record<string, string | number | undefined>> = []
let references = 0

for (const file of listMarkdownFiles(objectRoot)) {
  const markdown = fs.readFileSync(file, "utf8")
  const sections = parseEvidenceSections(markdown)
  const claims = (sections.get("Teiginiai") ?? []).filter((entry) => entry.id.startsWith("t-"))
  const citations = [...sections.entries()]
    .filter(([title]) => CITATION_SECTION_TITLES.has(title))
    .flatMap(([, entries]) => entries)
    .filter((entry) => entry.id.startsWith("c-"))
  const citationById = new Map(citations.map((citation) => [citation.id, citation]))
  const context = documentContext(markdown)

  for (const claim of claims) {
    const claimText = claim.fields.get("teiginys") ?? ""
    const refs = claim.lists.get("pagrindžia") ?? claim.lists.get("pagrindzia") ?? []
    for (const rawRef of refs) {
      const citation = citationById.get(rawRef.trim())
      if (!citation) continue
      references++
      const isIndexOnly =
        citation.fields.get("citatos_rezimas")?.trim() === "indeksas" &&
        Boolean(citation.fields.get("indeksas")?.trim())
      if (isIndexOnly) {
        indexOnlyReferences++
        continue
      }
      const score = evidenceTextOverlapScore(claimText, citationText(citation.fields), context)
      const supports = evidenceSupportsClaim(claimText, citationText(citation.fields), context)
      counts.set(score, (counts.get(score) ?? 0) + 1)
      if (!supports) {
        unsupportedReferences++
        textMismatchReferences++
      }
      if (!supports && examples.length < 100) {
        const quote = citationText(citation.fields).replace(/\s+/g, " ")
        examples.push({
          file: path.relative(process.cwd(), file),
          claim: claim.id,
          globalId: claim.fields.get("global_id")?.trim(),
          citation: citation.id,
          score,
          supports: String(supports),
          claimText: claimText.slice(0, 220),
          quote: quote.slice(0, 260),
        })
      }
    }
  }
}

console.log(
  JSON.stringify(
    {
      files: listMarkdownFiles(objectRoot).length,
      references,
      unsupportedReferences,
      indexOnlyReferences,
      textMismatchReferences,
      scoreCounts: Object.fromEntries([...counts].sort(([a], [b]) => a - b)),
      weakExamples: examples,
    },
    null,
    2,
  ),
)

if (unsupportedReferences > 0 || textMismatchReferences > 0) {
  process.exitCode = 1
}
