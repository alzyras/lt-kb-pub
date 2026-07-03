import { QuartzTransformerPlugin } from "../types"
import { normalizeCitationSourceId } from "../../util/citationFilter"
import { BuildCtx } from "../../util/ctx"
import { FullSlug, simplifySlug, slugTag } from "../../util/path"

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
  "sudarymo_pagrindimas",
  "temporaliniai_duomenys",
  "temporalinis_paaiskinimas",
  "temporalinis_llm_pakomentavimas",
  "ryšio_patikimumas",
  "ryšio_patikimumo_lygis",
  "ryšio_patikimumo_priezastys",
  "ryšio_sprendimo_taisykle",
  "ryšio_subjekto_parinkimas",
  "ryšio_targeto_parinkimas",
  "ryšio_slopinti_kandidatai",
  "ryšio_paaiskinimas",
  "ai_siulomas_patikimumas",
  "ai_siulymo_pagrindimas",
  "vertinimo_atnaujinta",
  "vertinimo_autorius",
  "pagrindžia",
  "global_id",
])
const QUOTE_DISPLAY_KEY = "citata_rodoma"
const QUOTE_ORIGINAL_KEY = "citata_originali"
const QUOTE_LEGACY_DISPLAY_KEY = "citata"
const ADVANCED_RESOLVE_STOPWORDS = new Set(["tame"])

interface EvidenceEntry {
  id: string
  fields: Map<string, string>
  lists: Map<string, string[]>
}

type SlugResolveIndex = Map<string, FullSlug | null>
type CitationMap = Map<string, EvidenceEntry>

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

function claimAnchorId(globalId: string): string {
  const code = globalId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return code ? `claim-${code}` : ""
}

function claimDeeplinkPill(localId: string, anchorId: string): string {
  if (!anchorId) {
    return pill(localId)
  }
  return `<a class="claim-deeplink" href="#${escapeHtml(anchorId)}" data-no-popover="true" aria-label="Nuoroda į teiginį ${escapeHtml(localId)}">${pill(localId)}</a>`
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

function advancedCell(text: string): string {
  return escapeHtml(text).replace(/\r?\n/g, "<br>")
}

function normalizeLabelKey(label: string): string {
  return slugTag(markdownText(label)).toLowerCase()
}

function buildSlugResolveIndex(ctx: BuildCtx): SlugResolveIndex {
  const index: SlugResolveIndex = new Map()
  for (const rawSlug of (ctx.allSlugs ?? []) as FullSlug[]) {
    const basename = simplifySlug(rawSlug).split("/").filter(Boolean).at(-1)
    if (!basename) {
      continue
    }
    const key = normalizeLabelKey(basename)
    if (!key) {
      continue
    }
    const existing = index.get(key)
    if (existing === undefined) {
      index.set(key, rawSlug)
    } else if (existing !== rawSlug) {
      index.set(key, null)
    }
  }
  return index
}

function resolveCanonicalSlug(label: string, resolveIndex: SlugResolveIndex): FullSlug | null {
  const key = normalizeLabelKey(label)
  if (!key || ADVANCED_RESOLVE_STOPWORDS.has(key)) {
    return null
  }
  return resolveIndex.get(key) ?? null
}

function internalLinkHtml(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}">${escapeHtml(markdownText(label))}</a>`
}

function renderWikilinkHtml(
  rawTarget: string,
  rawAnchor: string | undefined,
  rawAlias: string | undefined,
): string {
  const target = rawTarget.trim()
  const anchor = rawAnchor?.trim() ?? ""
  const alias = rawAlias?.trim() || target.split("/").filter(Boolean).at(-1) || target
  return internalLinkHtml(`${target}${anchor}`, alias)
}

function renderResolvableToken(token: string, resolveIndex: SlugResolveIndex): string {
  const match = token.match(/^(\s*)(.*?)(\s*)$/s)
  const leading = match?.[1] ?? ""
  const core = match?.[2] ?? token
  const trailing = match?.[3] ?? ""
  const resolved = resolveCanonicalSlug(core, resolveIndex)
  if (!resolved) {
    return `${escapeHtml(leading)}${escapeHtml(core)}${escapeHtml(trailing)}`
  }
  return `${escapeHtml(leading)}${internalLinkHtml(resolved, core)}${escapeHtml(trailing)}`
}

function renderPlainAdvancedChunk(text: string, resolveIndex: SlugResolveIndex): string {
  return text
    .split(/\r?\n/)
    .map((line) =>
      line
        .split(/(;\s*)/)
        .map((segment, segmentIndex) => {
          if (segmentIndex % 2 === 1) {
            return escapeHtml(segment)
          }
          const colon = segment.indexOf(":")
          if (colon >= 0) {
            const prefix = segment.slice(0, colon + 1)
            const suffix = segment.slice(colon + 1)
            return `${escapeHtml(prefix)}${suffix
              .split(/(,\s*)/)
              .map((part, partIndex) =>
                partIndex % 2 === 1 ? escapeHtml(part) : renderResolvableToken(part, resolveIndex),
              )
              .join("")}`
          }
          return renderResolvableToken(segment, resolveIndex)
        })
        .join(""),
    )
    .join("<br>")
}

function renderLinkifiedAdvancedCell(text: string, resolveIndex: SlugResolveIndex): string {
  const wikilinkRegex = /\[\[([^\]|#]+)(#[^\]|]+)?(?:\|([^\]]+))?\]\]/g
  let out = ""
  let lastIndex = 0
  for (const match of text.matchAll(wikilinkRegex)) {
    const start = match.index ?? 0
    out += renderPlainAdvancedChunk(text.slice(lastIndex, start), resolveIndex)
    out += renderWikilinkHtml(match[1], match[2], match[3])
    lastIndex = start + match[0].length
  }
  out += renderPlainAdvancedChunk(text.slice(lastIndex), resolveIndex)
  return out
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

function renderClaimsSection(
  sectionLines: string[],
  resolveIndex: SlugResolveIndex,
  citationsById: CitationMap,
): string[] | null {
  const entries = parseEntries(sectionLines).filter((entry) => entry.id.startsWith("t-"))
  if (entries.length === 0) {
    return null
  }

  const out = [
    "",
    `<div class="claims-section" data-claims-section="true">`,
    `<table class="advanced-claims-table" data-claims-table="true"><thead><tr><th>Teiginys</th><th>Kontekstas</th><th>Pagrindžia</th></tr></thead><tbody>`,
  ]
  for (const entry of entries) {
    const { claim, context } = splitClaimAndContext(entry)
    const refs = entry.lists.get("pagrindžia") ?? []
    const refsHtml =
      refs.length > 0
        ? refs.map((ref) => `<button class="evidence-pill-button" type="button" data-claim-toggle="true">${pill(ref)}</button>`).join(" ")
        : ""
    const globalId = entry.fields.get("global_id") ?? ""
    const anchorId = claimAnchorId(globalId)
    const globalAttrs = globalId ? ` data-global-claim-id="${escapeHtml(globalId)}"` : ""
    const anchorAttr = anchorId ? ` id="${escapeHtml(anchorId)}"` : ""
    const claimPill = claimDeeplinkPill(entry.id, anchorId)
    const advanced = claimAdvancedRows(entry, resolveIndex)
    const detailId = `claim-evidence-${entry.id}`
    const toggle = `<button class="claim-evidence-toggle-button" type="button" data-claim-toggle="true" aria-expanded="false" aria-controls="${escapeHtml(detailId)}"><span class="claim-evidence-toggle-icon" aria-hidden="true">▸</span><span class="sr-only">Rodyti citatas</span></button>`
    const claimCell =
      advanced.length > 0
        ? `${toggle}${claimPill} ${markdownCell(claim)}<table class="advanced-evidence-line advanced-evidence-table" data-adv-key="claim_technical_fields"><tbody>${advanced.join("")}</tbody></table>`
        : `${toggle}${claimPill} ${markdownCell(claim)}`
    out.push(
      `<tr${anchorAttr} data-claim-row="true" data-claim-id="${escapeHtml(entry.id)}"${globalAttrs} data-supporting-ids="${escapeHtml(refs.join("|"))}"><td>${claimCell}</td><td>${markdownCell(context)}</td><td>${refsHtml}</td></tr>`,
      renderClaimEvidenceDetailRow(entry, detailId, refs, citationsById, resolveIndex),
    )
  }
  out.push(
    `</tbody></table>`,
    `<p class="options-filter-empty" data-claims-empty-state hidden>Nėra teiginių pagal pasirinktus filtrus.</p>`,
    `</div>`,
    "",
    "",
  )
  return out
}

function claimAdvancedRows(entry: EvidenceEntry, resolveIndex: SlugResolveIndex): string[] {
  const rows: string[] = []
  const globalId = entry.fields.get("global_id")
  if (globalId) {
    rows.push(`<tr><th>global_id</th><td>${escapeHtml(markdownText(globalId))}</td></tr>`)
  }
  for (const key of [
    "teiginio_tipas",
    "patikimumo_lygis",
    "patikimumo_saltinis",
    "patikimumo_pagrindimas",
    "sudarymo_pagrindimas",
    "susije_objektai",
    "semantiniai_rysiai",
    "temporaliniai_duomenys",
    "temporalinis_paaiskinimas",
    "temporalinis_llm_pakomentavimas",
    "ryšio_patikimumas",
    "ryšio_patikimumo_lygis",
    "ryšio_patikimumo_priezastys",
    "ryšio_sprendimo_taisykle",
    "ryšio_subjekto_parinkimas",
    "ryšio_targeto_parinkimas",
    "ryšio_slopinti_kandidatai",
    "ryšio_paaiskinimas",
    "ai_siulomas_patikimumas",
    "ai_siulymo_pagrindimas",
    "vertinimo_atnaujinta",
    "vertinimo_autorius",
  ]) {
    const value = entry.fields.get(key)
    if (value) {
      const rendered =
        key === "susije_objektai" || key === "semantiniai_rysiai" || key === "temporaliniai_duomenys"
          ? renderLinkifiedAdvancedCell(value, resolveIndex)
          : advancedCell(value)
      rows.push(`<tr><th>${escapeHtml(key)}</th><td>${rendered}</td></tr>`)
    }
  }
  return rows
}

function citationQuote(entry: EvidenceEntry): string {
  const displayQuote = entry.fields.get(QUOTE_DISPLAY_KEY)?.trim()
  const legacyDisplayQuote = entry.fields.get(QUOTE_LEGACY_DISPLAY_KEY)?.trim()
  const originalQuote = entry.fields.get(QUOTE_ORIGINAL_KEY)?.trim() ?? ""
  return displayQuote || legacyDisplayQuote || originalQuote
}

function firstField(entries: EvidenceEntry[], keys: string[]): string {
  for (const entry of entries) {
    for (const key of keys) {
      const value = entry.fields.get(key)?.trim()
      if (value) {
        return value
      }
    }
  }
  return ""
}

function reliabilityClass(value: string): string {
  const normalized = slugTag(markdownText(value)).toLowerCase()
  if (normalized.includes("aukst")) {
    return "high"
  }
  if (normalized.includes("zem") || normalized.includes("zema")) {
    return "low"
  }
  return "medium"
}

function renderEvidenceSummary(
  claimEntry: EvidenceEntry,
  citationEntry: EvidenceEntry,
  resolveIndex: SlugResolveIndex,
): string {
  const entries = [claimEntry, citationEntry]
  const reliability = firstField(entries, ["patikimumo_lygis", "ryšio_patikimumo_lygis"])
  const reason = firstField(entries, ["patikimumo_pagrindimas", "sudarymo_pagrindimas"])
  const relations = firstField(entries, ["semantiniai_rysiai", "susije_objektai"])
  const time = firstField(entries, ["temporaliniai_duomenys"])
  const rows: string[] = []

  if (reliability) {
    rows.push(
      `<div class="claim-evidence-summary-item claim-evidence-summary-reliability"><span class="claim-evidence-summary-label">Patikimumas</span><span class="claim-evidence-reliability-badge claim-evidence-reliability-${reliabilityClass(reliability)}">${escapeHtml(markdownText(reliability))}</span></div>`,
    )
  }
  if (reason) {
    rows.push(
      `<div class="claim-evidence-summary-item"><span class="claim-evidence-summary-label">Kodėl</span><span>${advancedCell(reason)}</span></div>`,
    )
  }
  if (relations) {
    rows.push(
      `<div class="claim-evidence-summary-item"><span class="claim-evidence-summary-label">Ryšiai iš šios citatos</span><span>${renderLinkifiedAdvancedCell(relations, resolveIndex)}</span></div>`,
    )
  }
  if (time) {
    rows.push(
      `<div class="claim-evidence-summary-item"><span class="claim-evidence-summary-label">Laikotarpis</span><span>${renderLinkifiedAdvancedCell(time, resolveIndex)}</span></div>`,
    )
  }

  if (rows.length === 0) {
    return ""
  }
  return `<div class="claim-evidence-summary" data-claim-evidence-summary="true">${rows.join("")}</div>`
}

function renderCitationCard(
  claimEntry: EvidenceEntry,
  citationEntry: EvidenceEntry,
  resolveIndex: SlugResolveIndex,
): string {
  const source = citationEntry.fields.get("šaltinis") ?? citationEntry.fields.get("saltinis") ?? ""
  const quote = citationQuote(citationEntry)
  const rows = advancedRows(citationEntry, quote, resolveIndex)
  const summaryHtml = renderEvidenceSummary(claimEntry, citationEntry, resolveIndex)
  const sourceHtml = source
    ? `<div class="claim-citation-source"><strong>Šaltinis:</strong> ${markdownCell(source)}</div>`
    : `<div class="claim-citation-source claim-citation-source-missing">Šaltinis nenurodytas</div>`
  const quoteHtml = quote
    ? `<blockquote class="claim-citation-quote"><p>${advancedCell(quote)}</p></blockquote>`
    : `<p class="claim-citation-missing">Citatos tekstas nerastas.</p>`
  const advancedHtml =
    rows.length > 0
      ? `<table class="advanced-evidence-line advanced-evidence-table" data-adv-key="technical_fields"><tbody>${rows.join("")}</tbody></table>`
      : ""

  return `<article class="claim-citation-card" data-claim-citation-id="${escapeHtml(citationEntry.id)}">${pill(citationEntry.id)}${sourceHtml}${summaryHtml}${quoteHtml}${advancedHtml}</article>`
}

function renderClaimEvidenceDetailRow(
  claimEntry: EvidenceEntry,
  detailId: string,
  refs: string[],
  citationsById: CitationMap,
  resolveIndex: SlugResolveIndex,
): string {
  const cards = refs
    .map((ref) => citationsById.get(normalizeEvidenceId(ref)))
    .filter((entry): entry is EvidenceEntry => Boolean(entry))
    .map((entry) => renderCitationCard(claimEntry, entry, resolveIndex))
  const content =
    cards.length > 0
      ? cards.join("")
      : `<p class="claim-citation-missing">Citata nerasta.</p>`
  return `<tr class="claim-evidence-detail-row" id="${escapeHtml(detailId)}" data-claim-detail="${escapeHtml(claimEntry.id)}" hidden><td colspan="3"><div class="claim-evidence-detail">${content}</div></td></tr>`
}

function advancedRows(
  entry: EvidenceEntry,
  displayedQuote: string,
  resolveIndex: SlugResolveIndex,
): string[] {
  const rows: string[] = []
  const original = entry.fields.get(QUOTE_ORIGINAL_KEY) ?? ""
  if (original && original.trim() !== displayedQuote.trim()) {
    rows.push(`<tr><th>citata_originali</th><td>${advancedCell(original)}</td></tr>`)
  }
  for (const key of [
    "teiginio_tipas",
    "patikimumo_lygis",
    "patikimumo_saltinis",
    "patikimumo_pagrindimas",
    "sudarymo_pagrindimas",
    "susije_objektai",
    "semantiniai_rysiai",
    "temporaliniai_duomenys",
    "temporalinis_paaiskinimas",
    "temporalinis_llm_pakomentavimas",
    "ryšio_patikimumas",
    "ryšio_patikimumo_lygis",
    "ryšio_patikimumo_priezastys",
    "ryšio_sprendimo_taisykle",
    "ryšio_subjekto_parinkimas",
    "ryšio_targeto_parinkimas",
    "ryšio_slopinti_kandidatai",
    "ryšio_paaiskinimas",
    "ai_siulomas_patikimumas",
    "ai_siulymo_pagrindimas",
    "vertinimo_atnaujinta",
    "vertinimo_autorius",
  ]) {
    const value = entry.fields.get(key)
    if (value) {
      const rendered =
        key === "susije_objektai" || key === "semantiniai_rysiai" || key === "temporaliniai_duomenys"
          ? renderLinkifiedAdvancedCell(value, resolveIndex)
          : escapeHtml(markdownText(value))
      rows.push(`<tr><th>${escapeHtml(key)}</th><td>${rendered}</td></tr>`)
    }
  }
  return rows
}

function renderMentionsSection(
  sectionLines: string[],
): string[] | null {
  const entries = parseEntries(sectionLines).filter((entry) => entry.id.startsWith("c-"))
  if (entries.length === 0) {
    return null
  }

  const out: string[] = [
    "",
    `<div class="citations-section citation-evidence-store" data-citation-section="true" data-citation-store="true" hidden aria-hidden="true">`,
  ]
  for (const entry of entries) {
    const source = entry.fields.get("šaltinis") ?? entry.fields.get("saltinis") ?? ""
    const sourceId = source ? normalizeCitationSourceId(source) : ""

    out.push(
      `<section class="citation-entry" data-citation-entry="true" data-citation-id="${escapeHtml(entry.id)}" data-citation-source-id="${escapeHtml(sourceId)}" data-citation-source-title="${escapeHtml(source)}"></section>`,
    )
  }
  out.push(
    `<p class="options-filter-empty" data-citation-empty-state hidden>Nėra citatų pagal pasirinktus filtrus.</p>`,
    `</div>`,
    "",
  )
  return out
}

function renderStructuredSection(
  title: string,
  sectionLines: string[],
  resolveIndex: SlugResolveIndex,
  citationsById: CitationMap,
): string[] | null {
  if (title === "Teiginiai") {
    return renderClaimsSection(sectionLines, resolveIndex, citationsById)
  }
  if (
    title === "Reikšmingi paminėjimai" ||
    title === "Šaltiniai ir įrodymai" ||
    title === "Bibliografiniai įrodymai"
  ) {
    return renderMentionsSection(sectionLines)
  }
  return null
}

function isEvidenceStoreSection(title: string): boolean {
  return (
    title === "Reikšmingi paminėjimai" ||
    title === "Šaltiniai ir įrodymai" ||
    title === "Bibliografiniai įrodymai"
  )
}

function collectCitationEntries(lines: string[]): CitationMap {
  const citationsById: CitationMap = new Map()
  for (let idx = 0; idx < lines.length; idx++) {
    const heading = lines[idx].match(/^##\s+(.+?)\s*$/)
    if (!heading) {
      continue
    }
    const title = heading[1].trim()
    if (!isEvidenceStoreSection(title)) {
      continue
    }
    const start = idx + 1
    let end = start
    while (end < lines.length && !lines[end].startsWith("## ")) {
      end += 1
    }
    for (const entry of parseEntries(lines.slice(start, end))) {
      if (entry.id.startsWith("c-")) {
        citationsById.set(entry.id, entry)
      }
    }
    idx = end - 1
  }
  return citationsById
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
  textTransform(ctx, src) {
    const resolveIndex = buildSlugResolveIndex(ctx)
    const lines = src.replace(/^((?:---\n[\s\S]*?\n---\n)?\s*)#\s+.+(?:\n|$)/, "$1").split("\n")
    const citationsById = collectCitationEntries(lines)
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
      const structured = renderStructuredSection(title, sectionLines, resolveIndex, citationsById)
      if (title === "Teiginiai") {
        out.push(line)
      }
      if (structured) {
        out.push(...structured)
      } else if (!isEvidenceStoreSection(title)) {
        out.push(...transformFallbackLines(sectionLines))
      }
      idx = end - 1
    }

    return out.join("\n")
  },
})
