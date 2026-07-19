import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import {
  CITATION_SECTION_TITLES,
  EvidenceEntry,
  parseEvidenceSections,
} from "../quartz/util/citationFilter"

interface EvidenceLinkRow {
  note_path: string
  quote_id: string
  global_quote_code: string
  quote_hash: string
  quote_text: string
  quote_text_original_md: string | null
  quote_text_returned: string | null
  public_status: string
}

interface QuoteEvidenceRow {
  note_path: string
  quote_id: string
  quote_hash: string
  quote_text: string
  quote_text_original_md: string | null
  quote_text_returned: string | null
  status: string
}

interface CitationSpan extends EvidenceEntry {
  start: number
  end: number
}

const root = path.resolve(process.cwd())
const objectRoot = path.join(root, "objektai")
const databasePath = "/Users/tomas/Documents/important/lt/lt-kb/darbas/state/workflow.sqlite3"
const writeChanges = process.argv.includes("--write")
const requestedFile = process.env.RESTORE_FILE

function listMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdownFiles(entryPath)
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : []
  })
}

function query<T>(sql: string): T[] {
  const output = execFileSync("sqlite3", ["-json", databasePath, sql], {
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
  }).trim()
  return output ? (JSON.parse(output) as T[]) : []
}

function entryEnd(lines: string[], startIndex: number): number {
  const startIndent = lines[startIndex].match(/^\s*/)?.[0].length ?? 0
  let end = startIndex + 1
  while (end < lines.length) {
    const line = lines[end]
    if (line.startsWith("## ")) break
    if (
      end > startIndex &&
      line.trim() !== "" &&
      (line.match(/^\s*/)?.[0].length ?? 0) <= startIndent &&
      /^-\s+/.test(line)
    ) {
      break
    }
    end++
  }
  return end
}

function citationSpans(markdown: string): CitationSpan[] {
  const lines = markdown.split(/\r?\n/)
  const spans: CitationSpan[] = []
  let section = ""
  for (let index = 0; index < lines.length; index++) {
    const heading = lines[index].match(/^##\s+(.+?)\s*$/)
    if (heading) {
      section = heading[1].trim()
      continue
    }
    if (!CITATION_SECTION_TITLES.has(section)) continue
    if (!/^-\s+(?:id:\s*)?c-\d{3,}\s*$/i.test(lines[index])) continue
    const end = entryEnd(lines, index)
    const parsed = parseEvidenceSections(
      `## ${section}\n${lines.slice(index, end).join("\n")}`,
    ).get(section)?.[0]
    if (parsed) spans.push({ ...parsed, start: index, end })
    index = end - 1
  }
  return spans
}

function replaceBlockField(
  lines: string[],
  span: CitationSpan,
  key: string,
  value: string,
): number {
  const fieldIndex = lines.findIndex(
    (line, index) =>
      index >= span.start && index < span.end && new RegExp(`^\\s*${key}:\\s*`).test(line),
  )
  if (fieldIndex < 0) return 0
  const indent = lines[fieldIndex].match(/^\s*/)?.[0] ?? ""
  let end = fieldIndex + 1
  while (end < span.end) {
    if (lines[end].trim() !== "" && (lines[end].match(/^\s*/)?.[0].length ?? 0) <= indent.length)
      break
    end++
  }
  const block = [
    `${indent}${key}: |`,
    ...value
      .replace(/\r/g, "")
      .split("\n")
      .map((line) => `${indent}  ${line}`),
  ]
  const removed = end - fieldIndex
  lines.splice(fieldIndex, removed, ...block)
  return block.length - removed
}

function quoteMaps(): {
  globalText: Map<string, { original: string; display: string }>
} {
  const links = query<EvidenceLinkRow>(
    "select note_path, quote_id, global_quote_code, quote_hash, quote_text, quote_text_original_md, quote_text_returned, public_status from evidence_links where global_quote_code like 'c-%' and quote_id like 'c-%' order by updated_at desc",
  )
  const evidence = query<QuoteEvidenceRow>(
    "select note_path, quote_id, quote_text, quote_text_original_md, quote_text_returned, status from quote_evidence where quote_id like 'c-%'",
  )
  const evidenceByLocal = new Map<string, QuoteEvidenceRow[]>()
  for (const row of evidence) {
    const key = `${row.note_path}\u0000${row.quote_id}`
    evidenceByLocal.set(key, [...(evidenceByLocal.get(key) ?? []), row])
  }
  const globalText = new Map<string, { original: string; display: string }>()
  for (const row of links) {
    const key = `${row.note_path}\u0000${row.global_quote_code}`
    if (globalText.has(key) || row.public_status !== "accepted") continue
    const candidates = evidenceByLocal.get(`${row.note_path}\u0000${row.quote_id}`) ?? []
    const exact = candidates.filter((candidate) => candidate.quote_hash === row.quote_hash)
    const selected = exact.length === 1 ? exact[0] : candidates.length === 1 ? candidates[0] : null
    // Accepted evidence_links rows are the publication source of truth. The
    // quote_evidence table can contain intermediate extraction variants.
    const original =
      row.quote_text_original_md?.trim() ||
      row.quote_text.trim() ||
      selected?.quote_text_original_md?.trim() ||
      selected?.quote_text.trim()
    if (!original) continue
    globalText.set(key, {
      original,
      display:
        row.quote_text_returned?.trim() ||
        row.quote_text.trim() ||
        selected?.quote_text_returned?.trim() ||
        selected?.quote_text.trim() ||
        original,
    })
  }
  return { globalText }
}

const { globalText } = quoteMaps()
const files = requestedFile ? [path.resolve(requestedFile)] : listMarkdownFiles(objectRoot)
let changedFiles = 0
let restoredCitations = 0
let missingMappings = 0
const missingExamples: Array<{ file: string; citation: string }> = []

for (const file of files) {
  const relativePath = path.relative(root, file)
  const original = fs.readFileSync(file, "utf8")
  const lines = original.split(/\r?\n/)
  const spans = citationSpans(original).sort((left, right) => right.start - left.start)
  let changed = false
  for (const span of spans) {
    const text = globalText.get(`${relativePath}\u0000${span.id}`)
    if (!text) {
      missingMappings++
      if (missingExamples.length < 20)
        missingExamples.push({ file: relativePath, citation: span.id })
      continue
    }
    const originalDelta = replaceBlockField(lines, span, "citata_originali", text.original)
    span.end += originalDelta
    const displayDelta = replaceBlockField(lines, span, "citata_rodoma", text.display)
    span.end += displayDelta
    if (originalDelta !== 0 || displayDelta !== 0) {
      changed = true
      restoredCitations++
    }
  }
  const repaired = lines.join("\n")
  if (changed && repaired !== original) {
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
      restoredCitations,
      missingMappings,
      missingExamples,
    },
    null,
    2,
  ),
)
