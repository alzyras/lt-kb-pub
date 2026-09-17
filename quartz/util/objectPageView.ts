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
  featuredQuote?: { text: string; source: string; claimId: string; evidenceId: string }
  relationRows: ObjectRelationRow[]
  timeline: ObjectTimelineEntry[]
  portraitMediaId?: string
  featuredGalleryIds: string[]
  relatedContent: {
    articles: Array<{ slug: string; title: string }>
    exhibitions: Array<{ slug: string; title: string; matchedItems?: string }>
  }
}

export type ObjectRelationRow = {
  predicate: string
  direction?: "outbound" | "inbound"
  target: string
  label?: string
  claimId?: string
  confidence?: number
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
  const portrait = parse(raw.portrait)
  const featuredGallery = Array.isArray(raw.featured_gallery)
    ? raw.featured_gallery
        .map((entry) => cleanText(parse(entry).media_id))
        .filter(Boolean)
        .slice(0, 5)
    : []
  const related = parse(raw.related_content)
  const relatedRows = (value: unknown) =>
    Array.isArray(value)
      ? value
          .map(parse)
          .map((row) => ({
            slug: cleanText(row.slug),
            title: cleanText(row.title),
            matchedItems: cleanText(row.matched_items),
          }))
          .filter((row) => row.slug && row.title)
          .slice(0, 12)
      : []
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
      // The Markdown body is the list the visitor can actually open.  Keep a
      // stale frontmatter count from hiding newly projected public claims.
      claims: evidence.claims.length,
      citations: number(counts.citations, citations),
      mentions: number(counts.mentions, mentions),
      relations: Math.max(number(counts.relations, 0), fallbackRelations),
      gallery: number(counts.gallery, options.gallery ?? 0),
      sources: number(counts.sources, fallbackSources),
    },
    featuredClaimIds: strings(raw.featured_claim_ids).slice(0, 7),
    featuredQuote: (() => {
      const quote = parse(raw.featured_quote)
      const claim = evidence.claims.find(
        (row) => row.id === quote.claim_id || row.globalIds?.includes(String(quote.claim_id)),
      )
      const citation = claim?.citations.find((row) => row.id === quote.evidence_id)
      return quote.origin === "internal" && citation && cleanText(quote.text)
        ? {
            text: cleanText(quote.text),
            source: cleanText(citation.fields.get("šaltinis") || citation.fields.get("saltinis")),
            claimId: claim!.id,
            evidenceId: citation.id,
          }
        : undefined
    })(),
    relationRows,
    portraitMediaId:
      cleanText(frontmatter.object_page_primary_media_id) ||
      cleanText(portrait.media_id) ||
      undefined,
    featuredGalleryIds: featuredGallery,
    relatedContent: {
      articles: relatedRows(related.articles),
      exhibitions: relatedRows(related.exhibitions),
    },
    timeline: Array.isArray(raw.timeline)
      ? raw.timeline.filter((row): row is ObjectTimelineEntry =>
          Boolean(
            row && typeof row === "object" && cleanText((row as ObjectTimelineEntry).claimId),
          ),
        )
      : [],
  }
}
