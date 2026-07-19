import fs from "node:fs"
import path from "node:path"
import {
  CITATION_SECTION_TITLES,
  EvidenceEntry,
  normalizeEvidenceId,
  parseEvidenceSections,
} from "../quartz/util/citationFilter"
import {
  collectEvidenceIntegrityIssues,
  evidenceTextOverlapScore,
} from "../quartz/util/evidenceIntegrity"

interface EntrySpan extends EvidenceEntry {
  start: number
  end: number
  section: string
}

const writeChanges = process.argv.includes("--write")
const objectRoot = path.resolve("objektai")

function listMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdownFiles(entryPath)
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : []
  })
}

function parseEntrySpans(markdown: string): EntrySpan[] {
  const lines = markdown.split(/\r?\n/)
  const entries: EntrySpan[] = []
  let section = ""
  for (let index = 0; index < lines.length; index++) {
    const heading = lines[index].match(/^##\s+(.+?)\s*$/)
    if (heading) {
      section = heading[1].trim()
      continue
    }
    if (!/^-\s+(?:id:\s*)?[tcq]-\d{3,}\s*$/i.test(lines[index])) continue
    const start = index
    let end = index + 1
    while (end < lines.length) {
      if (lines[end].startsWith("## ")) break
      if (end > start && /^-\s+(?:id:\s*)?[tcq]-\d{3,}\s*$/i.test(lines[end])) break
      end++
    }
    const parsed = parseEvidenceSections(
      `## ${section}\n${lines.slice(start, end).join("\n")}`,
    ).get(section)?.[0]
    if (parsed) entries.push({ ...parsed, start, end, section })
    index = end - 1
  }
  return entries
}

function allCitations(markdown: string): EvidenceEntry[] {
  return [...parseEvidenceSections(markdown).entries()]
    .filter(([title]) => CITATION_SECTION_TITLES.has(title))
    .flatMap(([, entries]) => entries)
    .filter((entry) => entry.id.startsWith("c-"))
}

function citationText(citation: EvidenceEntry): string {
  return ["citata_originali", "citata_rodoma", "citata"]
    .map((key) => citation.fields.get(key)?.trim() ?? "")
    .filter(Boolean)
    .join("\n")
}

function sameSource(left: EvidenceEntry, right: EvidenceEntry): boolean {
  return (
    normalizeText(left.fields.get("šaltinis") ?? left.fields.get("saltinis") ?? "") ===
    normalizeText(right.fields.get("šaltinis") ?? right.fields.get("saltinis") ?? "")
  )
}

function replaceList(lines: string[], span: EntrySpan, values: string[]): boolean {
  const keyIndex = lines.findIndex(
    (line, index) =>
      index >= span.start && index < span.end && /^\s*(pagrindžia|pagrindzia)\s*:\s*$/.test(line),
  )
  if (keyIndex < 0) return false
  const indent = lines[keyIndex].match(/^\s*/)?.[0] ?? ""
  let end = keyIndex + 1
  while (end < span.end) {
    if (!lines[end].trim()) break
    if ((lines[end].match(/^\s*/)?.[0].length ?? 0) <= indent.length) break
    end++
  }
  lines.splice(keyIndex + 1, end - keyIndex - 1, ...values.map((value) => `${indent}  - ${value}`))
  return true
}

function normalizeText(value: string): string {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim().toLowerCase()
}

function rewriteCitationBacklinks(markdown: string): string {
  const sections = parseEvidenceSections(markdown)
  const claims = (sections.get("Teiginiai") ?? []).filter((entry) => entry.id.startsWith("t-"))
  const citations = allCitations(markdown)
  const citationIds = new Set(citations.map((citation) => citation.id))
  const backlinks = new Map<string, Set<string>>()
  for (const claim of claims) {
    const reference = claim.fields.get("global_id")?.trim() || claim.id
    for (const rawRef of claim.lists.get("pagrindžia") ?? claim.lists.get("pagrindzia") ?? []) {
      const ref = normalizeEvidenceId(rawRef)
      if (!citationIds.has(ref)) continue
      backlinks.set(ref, new Set([...(backlinks.get(ref) ?? []), reference]))
    }
  }
  const lines = markdown.split(/\r?\n/)
  const spans = parseEntrySpans(markdown)
    .filter((span) => span.id.startsWith("c-"))
    .sort((left, right) => right.start - left.start)
  for (const span of spans) {
    replaceList(lines, span, [...(backlinks.get(span.id) ?? [])])
  }
  return lines.join("\n")
}

const requestedFile = process.env.REPAIR_FILE
const dropUnresolved = process.env.REPAIR_DROP_UNRESOLVED === "1"
const files = requestedFile ? [path.resolve(requestedFile)] : listMarkdownFiles(objectRoot)
let changedFiles = 0
let repairedClaims = 0
const unresolved: Array<{ file: string; claim: string; citation: string; source: string }> = []

for (const file of files) {
  const original = fs.readFileSync(file, "utf8")
  const sections = parseEvidenceSections(original)
  const claims = (sections.get("Teiginiai") ?? []).filter((entry) => entry.id.startsWith("t-"))
  const citations = allCitations(original)
  const citationById = new Map(citations.map((citation) => [citation.id, citation]))
  const mismatchKeys = new Set(
    collectEvidenceIntegrityIssues(original)
      .filter((issue) => issue.code === "citation_text_mismatch")
      .map((issue) => `${issue.entryId}->${normalizeEvidenceId(issue.relatedId ?? "")}`),
  )
  const linkRepairs = new Map<string, string>()

  for (const claim of claims) {
    const refs = claim.lists.get("pagrindžia") ?? claim.lists.get("pagrindzia") ?? []
    for (const rawRef of refs) {
      const ref = normalizeEvidenceId(rawRef)
      if (!mismatchKeys.has(`${claim.id}->${ref}`)) continue
      const citation = citationById.get(ref)
      const sourceTitle = citation?.fields.get("šaltinis") ?? citation?.fields.get("saltinis") ?? ""
      const alternate = citations
        .filter((other) => other.id !== ref)
        .map((other) => ({
          citation: other,
          score: evidenceTextOverlapScore(claim.fields.get("teiginys") ?? "", citationText(other)),
        }))
        .filter(({ score }) => score >= 2)
        .sort((left, right) => {
          const sourceDelta =
            Number(sameSource(right.citation, citation!)) -
            Number(sameSource(left.citation, citation!))
          return sourceDelta || right.score - left.score
        })[0]
      if (alternate) {
        linkRepairs.set(`${claim.id}->${ref}`, alternate.citation.id)
        continue
      }
      unresolved.push({
        file: path.relative(process.cwd(), file),
        claim: claim.id,
        citation: ref,
        source: sourceTitle,
      })
      if (dropUnresolved) linkRepairs.set(`${claim.id}->${ref}`, "")
    }
  }

  if (linkRepairs.size === 0) continue
  const lines = original.split(/\r?\n/)
  const spans = new Map(
    parseEntrySpans(original).map((span) => [`${span.section}:${span.id}`, span]),
  )
  const replacements = new Map<string, string[]>()
  for (const claim of claims) {
    const refs = claim.lists.get("pagrindžia") ?? claim.lists.get("pagrindzia") ?? []
    const mappedRefs = refs.map((ref) => {
      return linkRepairs.get(`${claim.id}->${normalizeEvidenceId(ref)}`) ?? ref
    })
    const replacementsForClaim = mappedRefs.filter(Boolean)
    if (
      replacementsForClaim.length !== refs.length ||
      replacementsForClaim.some((ref, index) => ref !== refs[index])
    ) {
      replacements.set(claim.id, [...new Set(replacementsForClaim)])
    }
  }
  for (const claim of [...claims].sort(
    (left, right) =>
      (spans.get(`Teiginiai:${right.id}`)?.start ?? 0) -
      (spans.get(`Teiginiai:${left.id}`)?.start ?? 0),
  )) {
    const values = replacements.get(claim.id)
    const span = spans.get(`Teiginiai:${claim.id}`)
    if (values && span && replaceList(lines, span, values)) repairedClaims++
  }
  const repaired = rewriteCitationBacklinks(lines.join("\n"))
  if (repaired !== original) {
    changedFiles++
    if (writeChanges) fs.writeFileSync(file, repaired)
  }
}

console.log(
  JSON.stringify(
    {
      writeChanges,
      files: files.length,
      changedFiles,
      repairedClaims,
      unresolved: unresolved.length,
      unresolvedExamples: unresolved.slice(0, 20),
    },
    null,
    2,
  ),
)
