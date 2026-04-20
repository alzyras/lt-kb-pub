import { QuartzTransformerPlugin } from "../types"

const TARGET_SECTIONS = new Set([
  "Teiginiai",
  "Reikšmingi paminėjimai",
  "Šaltiniai ir įrodymai",
  "Bibliografiniai įrodymai",
])
const ADVANCED_KEYS = new Set([
  "teiginio_tipas",
  "patikimumo_lygis",
  "patikimumo_saltinis",
  "patikimumo_pagrindimas",
  "ai_siulomas_patikimumas",
  "ai_siulymo_pagrindimas",
  "vertinimo_atnaujinta",
  "vertinimo_autorius",
  "pagrindžia",
])
const QUOTE_DISPLAY_KEY = "citata_rodoma"
const QUOTE_ORIGINAL_KEY = "citata_originali"

interface EvidenceEntry {
  id: string
  fields: Map<string, string>
  lists: Map<string, string[]>
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
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

function normalizeEvidenceId(id: string): string {
  return id.replace(/^q-(\d{3,})$/i, "c-$1")
}

function pill(id: string): string {
  const normalized = normalizeEvidenceId(id)
  const kind = normalized.startsWith("t-") ? "claim" : "quote"
  return `<span class="evidence-pill evidence-pill-${kind}">${escapeHtml(normalized)}</span>`
}

function markdownCell(text: string): string {
  return escapeHtml(text)
    .replaceAll("|", "\\|")
    .replace(/\r?\n+/g, "<br>")
    .trim()
}

function markdownText(text: string): string {
  return text.replace(/\r?\n+/g, " ").trim()
}

function lineIndent(line: string): number {
  return line.match(/^\s*/)?.[0].length ?? 0
}

function keyName(line: string): string | null {
  return line.match(/^\s*([\p{L}_][\p{L}0-9_]*)\s*:\s*.*$/u)?.[1] ?? null
}

function hasTechnicalEvidenceIds(line: string): boolean {
  // Hide compact technical evidence markers in normal mode.
  return (
    /\bid\s*:\s*[tcq]-\d{3,}\b/i.test(line) ||
    /^\s*[-*]?\s*[tcq]-\d{3,}\b/i.test(line) ||
    /\b[tcq]-\d{3,}\b/i.test(line)
  )
}

function literalBlockEnd(lines: string[], startIndex: number): number {
  const baseIndent = lineIndent(lines[startIndex])
  let end = startIndex + 1
  while (end < lines.length) {
    const line = lines[end]
    if (line.trim() === "") {
      end += 1
      continue
    }
    if (lineIndent(line) <= baseIndent) {
      break
    }
    end += 1
  }
  return end
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

function displayQuoteIsNonEmpty(lines: string[], startIndex: number, endIndex: number): boolean {
  for (let i = startIndex; i < endIndex; i++) {
    const line = lines[i]
    if (keyName(line) !== QUOTE_DISPLAY_KEY) {
      continue
    }
    const scalar = line.split(":", 2)[1]?.trim() ?? ""
    if (scalar && scalar !== "|" && scalar !== '""' && scalar !== "''") {
      return true
    }
    if (scalar === "|") {
      const blockEnd = literalBlockEnd(lines, i)
      for (let j = i + 1; j < blockEnd; j++) {
        if (lines[j].trim()) {
          return true
        }
      }
    }
  }
  return false
}

function wrapLine(line: string, key: string): string {
  const indent = line.match(/^\s*/)?.[0] ?? ""
  const content = escapeHtml(line.trim())
  return `${indent}<span class="advanced-evidence-line" data-adv-key="${key}">${content}</span>`
}

function renderQuoteLabel(line: string): string {
  return line.replace(/citata_(?:originali|rodoma)/, "citata")
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

function splitClaimAndContext(entry: EvidenceEntry): { claim: string; context: string } {
  const explicitContext = entry.fields.get("kontekstas") ?? ""
  const claimText = entry.fields.get("teiginys") ?? ""
  if (explicitContext.trim()) {
    return { claim: claimText, context: explicitContext }
  }

  const match = claimText.match(/^(.*?)[;,]\s*kontekstas:\s*(.+)$/iu)
  if (!match) {
    return { claim: claimText, context: "" }
  }
  return { claim: match[1].trim(), context: match[2].trim() }
}

function renderClaimsSection(sectionLines: string[]): string[] | null {
  const entries = parseEntries(sectionLines).filter((entry) => entry.id.startsWith("t-"))
  if (entries.length === 0) {
    return null
  }

  const out = ["", "| Teiginys | Kontekstas | Pagrindžia |", "| --- | --- | --- |"]
  for (const entry of entries) {
    const { claim, context } = splitClaimAndContext(entry)
    const refs = entry.lists.get("pagrindžia") ?? []
    const refsHtml = refs.length > 0 ? refs.map(pill).join(" ") : ""
    out.push(
      `| ${pill(entry.id)} ${markdownCell(claim)} | ${markdownCell(context)} | ${refsHtml} |`,
    )
  }
  out.push("")
  return out
}

function quoteLines(text: string): string[] {
  const cleaned = text.trim()
  if (!cleaned) {
    return []
  }
  return cleaned.split(/\r?\n/).map((line) => `> ${line.trim()}`)
}

function advancedRows(entry: EvidenceEntry, displayedQuote: string): string[] {
  const rows: string[] = []
  const original = entry.fields.get(QUOTE_ORIGINAL_KEY) ?? ""
  if (original && original.trim() !== displayedQuote.trim()) {
    rows.push(`<tr><th>citata_originali</th><td><pre>${escapeHtml(original)}</pre></td></tr>`)
  }
  for (const key of [
    "teiginio_tipas",
    "patikimumo_lygis",
    "patikimumo_saltinis",
    "patikimumo_pagrindimas",
    "ai_siulomas_patikimumas",
    "ai_siulymo_pagrindimas",
    "vertinimo_atnaujinta",
    "vertinimo_autorius",
  ]) {
    const value = entry.fields.get(key)
    if (value) {
      rows.push(`<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(markdownText(value))}</td></tr>`)
    }
  }
  return rows
}

function renderMentionsSection(sectionLines: string[]): string[] | null {
  const entries = parseEntries(sectionLines).filter((entry) => entry.id.startsWith("c-"))
  if (entries.length === 0) {
    return null
  }

  const out: string[] = [""]
  for (const entry of entries) {
    const summary = entry.fields.get("santrauka") ?? ""
    const source = entry.fields.get("šaltinis") ?? entry.fields.get("saltinis") ?? ""
    const displayQuote = entry.fields.get(QUOTE_DISPLAY_KEY)?.trim()
    const originalQuote = entry.fields.get(QUOTE_ORIGINAL_KEY)?.trim() ?? ""
    const quote = displayQuote || originalQuote

    out.push(`${pill(entry.id)}`, "")
    if (summary) {
      out.push(`**Santrauka:** ${markdownText(summary)}`, "")
    }
    if (source) {
      out.push(`**Šaltinis:** ${source}`, "")
    }
    const renderedQuote = quoteLines(quote)
    if (renderedQuote.length > 0) {
      out.push("", ...renderedQuote)
    }

    const rows = advancedRows(entry, quote)
    if (rows.length > 0) {
      out.push(
        "",
        `<table class="advanced-evidence-line advanced-evidence-table" data-adv-key="technical_fields"><tbody>${rows.join("")}</tbody></table>`,
      )
    }
    out.push("")
  }
  return out
}

function renderStructuredSection(title: string, sectionLines: string[]): string[] | null {
  if (title === "Teiginiai") {
    return renderClaimsSection(sectionLines)
  }
  if (title === "Reikšmingi paminėjimai") {
    return renderMentionsSection(sectionLines)
  }
  return null
}

function transformFallbackLines(lines: string[]): string[] {
  const out: string[] = []
  let hideRefsIndent: number | null = null

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx]
    const currentLineIndent = lineIndent(line)
    if (hideRefsIndent !== null) {
      if (line.trim() === "") {
        out.push(line)
        continue
      }
      if (currentLineIndent > hideRefsIndent && /^\s*-\s*[tcq]-\d{3,}\s*$/.test(line)) {
        out.push(wrapLine(line, "pagrindzia_ref"))
        continue
      }
      hideRefsIndent = null
    }

    const key = keyName(line)
    if (key === QUOTE_ORIGINAL_KEY) {
      const nextEntryEnd = entryEnd(lines, idx)
      const hasDisplayQuote = displayQuoteIsNonEmpty(lines, idx, nextEntryEnd)
      const blockEnd = line.trim().endsWith("|") ? literalBlockEnd(lines, idx) : idx + 1
      if (hasDisplayQuote) {
        for (let j = idx; j < blockEnd; j++) {
          out.push(wrapLine(lines[j], QUOTE_ORIGINAL_KEY))
        }
      } else {
        out.push(renderQuoteLabel(line))
        for (let j = idx + 1; j < blockEnd; j++) {
          out.push(lines[j])
        }
      }
      idx = blockEnd - 1
      continue
    }

    if (key === QUOTE_DISPLAY_KEY) {
      const scalar = line.split(":", 2)[1]?.trim() ?? ""
      const blockEnd = scalar === "|" ? literalBlockEnd(lines, idx) : idx + 1
      if (displayQuoteIsNonEmpty(lines, idx, blockEnd)) {
        out.push(renderQuoteLabel(line))
        for (let j = idx + 1; j < blockEnd; j++) {
          out.push(lines[j])
        }
      } else {
        for (let j = idx; j < blockEnd; j++) {
          out.push(wrapLine(lines[j], QUOTE_DISPLAY_KEY))
        }
      }
      idx = blockEnd - 1
      continue
    }

    if (key && ADVANCED_KEYS.has(key)) {
      out.push(wrapLine(line, key))
      if (key === "pagrindžia") {
        hideRefsIndent = currentLineIndent
      }
      continue
    }

    if (hasTechnicalEvidenceIds(line)) {
      out.push(wrapLine(line, "evidence_id"))
      continue
    }

    out.push(line)
  }

  return out
}

export const AdvancedEvidence: QuartzTransformerPlugin = () => ({
  name: "AdvancedEvidence",
  textTransform(_ctx, src) {
    const lines = src.split("\n")
    const out: string[] = []

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx]
      const heading = line.match(/^##\s+(.+?)\s*$/)
      if (!heading || !TARGET_SECTIONS.has(heading[1].trim())) {
        out.push(line)
        continue
      }

      const title = heading[1].trim()
      const start = idx + 1
      let end = start
      while (end < lines.length && !lines[end].startsWith("## ")) {
        end += 1
      }

      const sectionLines = lines.slice(start, end)
      const structured = renderStructuredSection(title, sectionLines)
      out.push(line)
      out.push(...(structured ?? transformFallbackLines(sectionLines)))
      idx = end - 1
    }

    return out.join("\n")
  },
})
