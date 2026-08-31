import type { ObjectDetailEvidence } from "./objectDetail"
import { cleanText } from "./objectMedia"

export type ObjectPageCounts = {
  claims: number
  citations: number
  mentions: number
  relations: number
  gallery: number
  sources: number
}

export type ObjectPageViewModelV2 = {
  version: 2
  counts: ObjectPageCounts
  featuredClaimIds: string[]
  relationRows: ObjectRelationRow[]
  timeline: ObjectTimelineEntry[]
}

export type ObjectRelationRow = {
  predicate: string
  direction?: "outbound" | "inbound"
  target: string
  label?: string
  claimId?: string
}

export type ObjectTimelineEntry = { date: string; label: string; claimId: string }

function parse(value: unknown): Record<string, unknown> {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {}
  } catch {
    return {}
  }
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(cleanText).filter(Boolean) : []
}

function number(value: unknown, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback
}

export function externalReadingCount(frontmatter: Record<string, unknown>): number {
  try {
    const links =
      typeof frontmatter.external_sources_json === "string"
        ? JSON.parse(frontmatter.external_sources_json)
        : frontmatter.external_sources_json
    if (!Array.isArray(links)) return 0
    return new Set(
      links.map((entry) => cleanText(entry?.url || entry?.canonical_url)).filter(Boolean),
    ).size
  } catch {
    return 0
  }
}

/**
 * Public pages may be rendered before an object has passed through the
 * finisher.  The fallback therefore derives exactly the same conservative
 * counts from the public Markdown; a finisher projection simply makes these
 * values stable and supplies richer modules.
 */
export function objectPageViewModel(
  frontmatter: Record<string, unknown>,
  evidence: ObjectDetailEvidence,
  options: { gallery?: number; relationRows?: ObjectRelationRow[] } = {},
): ObjectPageViewModelV2 {
  const raw = parse(frontmatter.object_page_view_json || frontmatter.object_page_counts_json)
  const counts = parse(raw.counts)
  const projectedRelations = Array.isArray(raw.relations)
    ? raw.relations.filter((row): row is ObjectRelationRow =>
        Boolean(row && typeof row === "object" && cleanText((row as ObjectRelationRow).target)),
      )
    : []
  const relationRows = options.relationRows ?? projectedRelations
  const citationRecords = evidence.citationRecords
  const mentions = citationRecords.filter((row) => row.significantMention).length
  const citations = citationRecords.filter((row) => !row.significantMention).length
  const fallbackRelations = relationRows.length || evidence.relations.length
  const fallbackSources =
    new Set(
      [...evidence.sourceTitles, ...strings(frontmatter.saltiniai)].map(cleanText).filter(Boolean),
    ).size + externalReadingCount(frontmatter)
  return {
    version: 2,
    counts: {
      claims: number(counts.claims, evidence.claims.length),
      citations: number(counts.citations, citations),
      mentions: number(counts.mentions, mentions),
      relations: number(counts.relations, fallbackRelations),
      gallery: number(counts.gallery, options.gallery ?? 0),
      sources: number(counts.sources, fallbackSources),
    },
    featuredClaimIds: strings(raw.featured_claim_ids).slice(0, 6),
    relationRows,
    timeline: Array.isArray(raw.timeline)
      ? raw.timeline.filter((row): row is ObjectTimelineEntry =>
          Boolean(
            row && typeof row === "object" && cleanText((row as ObjectTimelineEntry).claimId),
          ),
        )
      : [],
  }
}
