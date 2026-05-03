export const CITATION_SECTION_TITLES = new Set([
  "Reikšmingi paminėjimai",
  "Šaltiniai ir įrodymai",
  "Bibliografiniai įrodymai",
])

const QUOTE_SOURCE_KEYS = ["šaltinis", "saltinis"]

export interface EvidenceEntry {
  id: string
  fields: Map<string, string>
  lists: Map<string, string[]>
}

export interface CitationSourceCount {
  id: string
  title: string
  count: number
}

export interface CitationMetadata {
  quoteCount: number
  sourceTitles: string[]
  sourceIds: string[]
  sources: CitationSourceCount[]
}

function stripOuterQuotes(text: string): string {
  const trimmed = text.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

export function normalizeEvidenceId(id: string): string {
  return id.replace(/^q-(\d{3,})$/i, "c-$1")
}

function lineIndent(line: string): number {
  return line.match(/^\s*/)?.[0].length ?? 0
}

function entryEnd(lines: string[], startIndex: number): number {
  const startIndent = lineIndent(lines[startIndex])
  let end = startIndex + 1
  while (end < lines.length) {
    const line = lines[end]
    if (line.startsWith("## ")) {
      break
    }
    if (
      end > startIndex &&
      line.trim() !== "" &&
      lineIndent(line) <= startIndent &&
      /^\s*-\s+/.test(line)
    ) {
      break
    }
    end += 1
  }
  return end
}

function parseEntry(lines: string[]): EvidenceEntry | null {
  const first = lines[0] ?? ""
  const idMatch = first.match(/^\s*-\s+(?:id:\s*)?([tcq]-\d{3,})\s*$/i)
  if (!idMatch) {
    return null
  }

  const entry: EvidenceEntry = {
    id: normalizeEvidenceId(idMatch[1]),
    fields: new Map(),
    lists: new Map(),
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(/^\s*([\p{L}_][\p{L}0-9_]*)\s*:\s*(.*)$/u)
    if (!match) {
      continue
    }

    const key = match[1]
    const value = match[2].trim()
    if (value === "|") {
      const blockIndent = lineIndent(line)
      const blockLines: string[] = []
      i += 1
      while (i < lines.length) {
        const next = lines[i]
        if (next.trim() !== "" && lineIndent(next) <= blockIndent) {
          i -= 1
          break
        }
        blockLines.push(next.replace(/^\s{4}/, ""))
        i += 1
      }
      entry.fields.set(key, blockLines.join("\n").trim())
      continue
    }

    if (value === "") {
      const items: string[] = []
      const blockIndent = lineIndent(line)
      let consumedList = false
      i += 1
      while (i < lines.length) {
        const next = lines[i]
        if (next.trim() === "") {
          i += 1
          continue
        }
        if (lineIndent(next) <= blockIndent) {
          i -= 1
          break
        }
        const item = next.match(/^\s*-\s+(.+?)\s*$/)
        if (!item) {
          i -= 1
          break
        }
        consumedList = true
        items.push(normalizeEvidenceId(stripOuterQuotes(item[1])))
        i += 1
      }
      if (consumedList) {
        entry.lists.set(key, items)
      } else {
        entry.fields.set(key, "")
      }
      continue
    }

    entry.fields.set(key, stripOuterQuotes(value))
  }

  return entry
}

function parseEntries(sectionLines: string[]): EvidenceEntry[] {
  const entries: EvidenceEntry[] = []
  for (let idx = 0; idx < sectionLines.length; idx++) {
    if (!/^\s*-\s+(?:id:\s*)?[tcq]-\d{3,}\s*$/i.test(sectionLines[idx])) {
      continue
    }
    const end = entryEnd(sectionLines, idx)
    const entry = parseEntry(sectionLines.slice(idx, end))
    if (entry) {
      entries.push(entry)
    }
    idx = end - 1
  }
  return entries
}

export function parseEvidenceSections(markdown: string): Map<string, EvidenceEntry[]> {
  const lines = markdown.split(/\r?\n/)
  const sections = new Map<string, EvidenceEntry[]>()

  for (let idx = 0; idx < lines.length; idx++) {
    const heading = lines[idx].match(/^##\s+(.+?)\s*$/)
    if (!heading) {
      continue
    }
    const title = heading[1].trim()
    const start = idx + 1
    let end = start
    while (end < lines.length && !lines[end].startsWith("## ")) {
      end += 1
    }
    sections.set(title, parseEntries(lines.slice(start, end)))
    idx = end - 1
  }

  return sections
}

export function normalizeCitationSourceId(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function collectCitationMetadata(markdown: string): CitationMetadata {
  const sections = parseEvidenceSections(markdown)
  const counts = new Map<string, CitationSourceCount>()
  let quoteCount = 0

  for (const [title, entries] of sections.entries()) {
    if (!CITATION_SECTION_TITLES.has(title)) {
      continue
    }
    for (const entry of entries) {
      if (!entry.id.startsWith("c-")) {
        continue
      }
      quoteCount += 1
      const sourceTitle = QUOTE_SOURCE_KEYS.map((key) => entry.fields.get(key) ?? "").find(
        (value) => value.trim().length > 0,
      )
      if (!sourceTitle) {
        continue
      }
      const normalizedTitle = sourceTitle.trim()
      const id = normalizeCitationSourceId(normalizedTitle)
      if (!id) {
        continue
      }
      const existing = counts.get(id)
      if (existing) {
        existing.count += 1
      } else {
        counts.set(id, { id, title: normalizedTitle, count: 1 })
      }
    }
  }

  const sources = [...counts.values()].sort((a, b) =>
    a.title.localeCompare(b.title, "lt", { sensitivity: "base" }),
  )
  return {
    quoteCount,
    sourceTitles: sources.map((entry) => entry.title),
    sourceIds: sources.map((entry) => entry.id),
    sources,
  }
}

export function isObjectPage(relativePath: string): boolean {
  return relativePath.startsWith("objektai/") && relativePath.endsWith(".md")
}
