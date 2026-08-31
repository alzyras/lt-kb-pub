import fs from "node:fs"
import { parseEvidenceSections, type EvidenceEntry } from "./citationFilter"

export type ObjectDetailTier = "t0" | "t1" | "t2" | "t3"

export type ObjectEvidenceClaim = {
  id: string
  text: string
  citationIds: string[]
  citations: EvidenceEntry[]
  sourceTitles: string[]
  reliability: string
}

export type ObjectEvidenceCitation = {
  id: string
  entry: EvidenceEntry
  section: string
  linkedClaimIds: string[]
  standalone: boolean
  significantMention: boolean
}

export type ObjectDetailEvidence = {
  summary: string
  claims: ObjectEvidenceClaim[]
  citations: Map<string, EvidenceEntry>
  citationRecords: ObjectEvidenceCitation[]
  sourceTitles: string[]
  relations: Array<{ label: string; target: string; display: string }>
}

export type ObjectEvidenceDisplayItem =
  | { kind: "claim"; value: ObjectEvidenceClaim }
  | { kind: "citation"; value: ObjectEvidenceCitation }

const OBJECT_TYPE_FOLDERS = new Set([
  "asmenys",
  "autoriai",
  "daiktai",
  "grupes",
  "ivykiai",
  "paprociai",
  "posakiai",
  "saltiniai",
  "vietos",
  "zodynas",
])

const evidenceFileCache = new Map<
  string,
  { mtimeMs: number; size: number; evidence: ObjectDetailEvidence }
>()

const EMPTY_VALUE = /^(?:nenurodyta|nepateikta|nėra|nežinoma|unknown|null|undefined|-)$/iu
const INTERNAL_PATH = /(?:^|\s)(?:darbas|tmp|private)\//iu

function clean(value: unknown): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
}

export function isMeaningfulObjectText(value: unknown): boolean {
  const text = clean(value)
  return Boolean(text && !EMPTY_VALUE.test(text) && !INTERNAL_PATH.test(text))
}

function field(entry: EvidenceEntry, ...keys: string[]): string {
  for (const key of keys) {
    const value = clean(entry.fields.get(key))
    if (isMeaningfulObjectText(value)) return value
  }
  return ""
}

function citationIds(entry: EvidenceEntry): string[] {
  return [...(entry.lists.get("pagrindžia") ?? entry.lists.get("pagrindzia") ?? [])]
    .map((id) => id.replace(/^q-/i, "c-"))
    .filter(Boolean)
}

function summaryFromMarkdown(markdown: string): string {
  // `(\s*$)` is not an EOF test in multiline mode: it can end the lazy
  // match at the first line break.  Use an explicit impossible-next-character
  // EOF assertion, so sections with blank lines stay intact.
  const match = markdown.match(/^##\s+Santrauka\s*\n([\s\S]*?)(?=^##\s+|(?![\s\S]))/mu)
  if (!match) return ""
  return clean(match[1])
}

function relationsFromMarkdown(markdown: string): Array<{ label: string; target: string; display: string }> {
  const match = markdown.match(/^##\s+Ryšiai\s*\n([\s\S]*?)(?=^##\s+|(?![\s\S]))/mu)
  if (!match) return []
  const relations: Array<{ label: string; target: string; display: string }> = []
  for (const line of match[1].split(/\r?\n/)) {
    const linkStart = line.indexOf("[[")
    if (!/^\s*-\s+/u.test(line) || linkStart < 0) continue
    // Older projections use `Santykis: [[…]]`; newer canonical relations
    // also use natural-language predicates without a colon, e.g.
    // `Vytautas valdė [[Lietuva]]`.  The first wikilink is the stable split.
    const label = clean(line.slice(0, linkStart).replace(/^\s*-\s+/u, "").replace(/:\s*$/u, ""))
    for (const link of line.slice(linkStart).matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/gu)) {
      const target = clean(link[1])
      if (target.startsWith("objektai/")) {
        relations.push({ label, target, display: clean(link[2]) })
      }
    }
  }
  return relations
}

export function objectDetailEvidence(markdown: string): ObjectDetailEvidence {
  const sections = parseEvidenceSections(markdown)
  const citationSections = [
    "Citatos",
    "Reikšmingi paminėjimai",
    "Šaltiniai ir įrodymai",
    "Bibliografiniai įrodymai",
  ]
  const citations = new Map<string, EvidenceEntry>()
  for (const sectionName of citationSections) {
    for (const entry of sections.get(sectionName) ?? []) {
      if (entry.id.startsWith("c-") && !citations.has(entry.id)) citations.set(entry.id, entry)
    }
  }

  const claims = (sections.get("Teiginiai") ?? [])
    .filter((entry) => entry.id.startsWith("t-"))
    .map((entry, order) => {
      const refs = citationIds(entry)
      const linkedCitations = refs
        .map((id) => citations.get(id))
        .filter((citation): citation is EvidenceEntry => Boolean(citation))
      const text = field(entry, "teiginys")
      const sourceTitles = [
        ...new Set(
          linkedCitations
            .map((citation) => field(citation, "šaltinis", "saltinis"))
            .filter(Boolean),
        ),
      ]
      return {
        id: entry.id,
        text,
        citationIds: refs,
        citations: linkedCitations,
        sourceTitles,
        reliability: field(entry, "patikimumo_lygis", "ryšio_patikimumo_lygis"),
        order,
      }
    })
    .filter((claim) => Boolean(claim.text))
    .sort((left, right) => {
      const reliability = (value: string) =>
        /aukšt|aukst/iu.test(value) ? 3 : /vidutin/iu.test(value) ? 2 : 1
      return (
        reliability(right.reliability) - reliability(left.reliability) ||
        right.citations.length - left.citations.length ||
        right.sourceTitles.length - left.sourceTitles.length ||
        left.order - right.order
      )
    })
    .map(({ order: _order, ...claim }) => claim)

  const claimIdsByCitation = new Map<string, string[]>()
  for (const claim of claims) {
    for (const citationId of claim.citationIds) {
      const linked = claimIdsByCitation.get(citationId) ?? []
      if (!linked.includes(claim.id)) linked.push(claim.id)
      claimIdsByCitation.set(citationId, linked)
    }
  }
  const citationRecords = citationSections.flatMap((section) =>
    (sections.get(section) ?? [])
      .filter(
        (entry) =>
          entry.id.startsWith("c-") ||
          (section === "Reikšmingi paminėjimai" && entry.id.startsWith("t-")),
      )
      .map((entry) => {
        const linkedClaimIds = entry.id.startsWith("t-")
          ? claims.some((claim) => claim.id === entry.id)
            ? [entry.id]
            : []
          : (claimIdsByCitation.get(entry.id) ?? [])
        return {
          id: entry.id,
          entry,
          section,
          linkedClaimIds,
          standalone: entry.id.startsWith("c-") && linkedClaimIds.length === 0,
          significantMention: section === "Reikšmingi paminėjimai",
        }
      }),
  )

  return {
    summary: isMeaningfulObjectText(summaryFromMarkdown(markdown))
      ? summaryFromMarkdown(markdown)
      : "",
    claims,
    citations,
    citationRecords,
    sourceTitles: [...new Set(claims.flatMap((claim) => claim.sourceTitles))],
    relations: relationsFromMarkdown(markdown),
  }
}

export function objectDetailEvidenceFromFile(filePath: string | undefined): ObjectDetailEvidence {
  const path = String(filePath ?? "")
  if (!path || !fs.existsSync(path)) return objectDetailEvidence("")
  const stat = fs.statSync(path)
  const cached = evidenceFileCache.get(path)
  if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) return cached.evidence
  const evidence = objectDetailEvidence(fs.readFileSync(path, "utf8"))
  evidenceFileCache.set(path, { mtimeMs: stat.mtimeMs, size: stat.size, evidence })
  return evidence
}

export function objectEvidenceDisplayItems(evidence: ObjectDetailEvidence): ObjectEvidenceDisplayItem[] {
  return [
    ...evidence.claims.map((value) => ({ kind: "claim" as const, value })),
    ...evidence.citationRecords
      .filter((record) => record.standalone || record.significantMention)
      .map((value) => ({ kind: "citation" as const, value })),
  ]
}

export function objectEvidenceIndexFile(slug: string): string {
  let hash = 2166136261
  for (const byte of new TextEncoder().encode(`evidence:${slug}`)) {
    hash ^= byte
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, "0")
}

export function objectDetailTier(
  evidence: ObjectDetailEvidence,
  options: { directMediaCount?: number; relationCount?: number } = {},
): ObjectDetailTier {
  const factCount = evidence.claims.filter((claim) => claim.citations.length > 0).length
  const sourceCount = evidence.sourceTitles.length
  const richSignal =
    Number(options.directMediaCount ?? 0) > 0 || Number(options.relationCount ?? 0) >= 5
  if (factCount === 0) return "t0"
  if (factCount >= 10 || (factCount >= 5 && sourceCount >= 2 && richSignal)) return "t3"
  if (factCount >= 3 || sourceCount >= 2) return "t2"
  return "t1"
}

export function objectTierLabel(tier: ObjectDetailTier): string {
  return {
    t0: "Tapatybės įrašas",
    t1: "Trumpas įrašas",
    t2: "Išplėstas įrašas",
    t3: "Išsamus įrašas",
  }[tier]
}

export function isObjectDetailSlug(slug: string | undefined): boolean {
  const parts = String(slug ?? "")
    .replace(/^\/+|\/+$/g, "")
    .split("/")
  return (
    parts.length === 3 &&
    parts[0] === "objektai" &&
    OBJECT_TYPE_FOLDERS.has(parts[1]) &&
    Boolean(parts[2])
  )
}

export function objectPageIndexable(
  evidence: ObjectDetailEvidence,
  options: { directMediaCount?: number; relationCount?: number } = {},
): boolean {
  const tier = objectDetailTier(evidence, options)
  if (tier === "t0") return false
  if (tier === "t1") {
    const supportedClaims = evidence.claims.filter((claim) => claim.citations.length > 0)
    return (
      supportedClaims.length >= 2 ||
      supportedClaims.some(
        (claim) =>
          claim.sourceTitles.length > 0 &&
          claim.citations.some((citation) => Boolean(citationQuote(citation, 1))),
      )
    )
  }
  return true
}

export function citationQuote(citation: EvidenceEntry, limit = 320): string {
  const quote = field(citation, "citata_rodoma", "citata_originali", "citata")
  if (!quote) return ""
  if (quote.length <= limit) return quote
  const segment = quote.slice(0, limit - 1)
  const boundary = segment.lastIndexOf(" ")
  return `${(boundary > limit * 0.65 ? segment.slice(0, boundary) : segment).trim()}…`
}
