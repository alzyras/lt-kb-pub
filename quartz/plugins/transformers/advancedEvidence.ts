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

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function wrapLine(line: string, key: string): string {
  const indent = line.match(/^\s*/)?.[0] ?? ""
  const content = escapeHtml(line.trim())
  return `${indent}<span class="advanced-evidence-line" data-adv-key="${key}">${content}</span>`
}

function lineIndent(line: string): number {
  return line.match(/^\s*/)?.[0].length ?? 0
}

function keyName(line: string): string | null {
  return line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*.*$/)?.[1] ?? null
}

function hasTechnicalEvidenceIds(line: string): boolean {
  // Hide compact technical evidence markers in normal mode.
  // Examples:
  // - id: t-001 ...
  // - q-001 šaltinis: ...
  // - t-001
  return (
    /\bid\s*:\s*[tq]-\d{3,}\b/i.test(line) ||
    /^\s*[-*]?\s*[tq]-\d{3,}\b/i.test(line) ||
    /\b[tq]-\d{3,}\b/i.test(line)
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

function renderQuoteLabel(line: string): string {
  return line.replace(/citata_(?:originali|rodoma)/, "citata")
}

export const AdvancedEvidence: QuartzTransformerPlugin = () => ({
  name: "AdvancedEvidence",
  textTransform(_ctx, src) {
    const lines = src.split("\n")
    const out: string[] = []

    let inTargetSection = false
    let hideRefsIndent: number | null = null

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx]
      const heading = line.match(/^##\s+(.+?)\s*$/)
      if (heading) {
        inTargetSection = TARGET_SECTIONS.has(heading[1].trim())
        hideRefsIndent = null
        out.push(line)
        continue
      }

      if (!inTargetSection) {
        out.push(line)
        continue
      }

      const currentLineIndent = lineIndent(line)
      if (hideRefsIndent !== null) {
        if (line.trim() === "") {
          out.push(line)
          continue
        }
        if (currentLineIndent > hideRefsIndent && /^\s*-\s*[tq]-\d{3,}\s*$/.test(line)) {
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

    return out.join("\n")
  },
})
