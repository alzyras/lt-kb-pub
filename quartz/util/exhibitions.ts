import { readdirSync, readFileSync } from "node:fs"
import { relative, resolve, sep } from "node:path"
import {
  evidenceDocumentContext,
  evidenceCitationQuoteForClaim,
  evidenceSupportsClaim,
} from "./evidenceIntegrity"
import {
  CITATION_SECTION_TITLES,
  parseEvidenceSections,
  type EvidenceEntry,
} from "./citationFilter"
import { mediaImageUrl, type MediaEntry } from "./objectMedia"
import { createUniqueSlugMap, type FilePath } from "./path"

export type ExhibitionClaimRef = {
  claimId: `t-${number}`
  citationId: `c-${number}`
  label?: string
  role?: "direct" | "contextual"
}

export type ExhibitionClaim = ExhibitionClaimRef & {
  text: string
  sourceTitle: string
  url: string
  quote: string
}

export type ExhibitionItemRelation = {
  kind: "variant_of" | "alternate_view_of" | "reproduction_of" | "same_event_as"
  targetItemId: string
}

export type ExhibitionItem = {
  exhibitionItemId: string
  mediaId: string
  titleLt: string
  descriptionLt: string
  catalogDescriptionLt: string
  /** Curated display values may correct a provider's scan/upload metadata. */
  creatorDisplay?: string
  dateDisplay?: string
  evidenceNoteLt?: string
  relation?: ExhibitionItemRelation
  featured: boolean
  claimRefs: ExhibitionClaimRef[]
  claims: ExhibitionClaim[]
  media: MediaEntry
}

export type ExhibitionSection = {
  sectionId: string
  slug: string
  title: string
  lead: string
  evidenceNoteLt?: string
  navMediaId: string
  navImagePosition?: string
  claimRefs: ExhibitionClaimRef[]
  claims: ExhibitionClaim[]
  navMedia: MediaEntry
  items: ExhibitionItem[]
}

export type ExhibitionManifest = {
  exhibitionId: string
  slug: string
  legacySlugs?: string[]
  title: string
  subtitle: string
  description: string
  heroMediaId: string
  hero: MediaEntry
  sections: ExhibitionSection[]
  imageUrls: string[]
  updatedAt: string
  theme?: "historical" | "interwar" | "symbols"
  relatedObject?: {
    href: string
    label: string
  }
}

type ExhibitionSourceItem = Omit<ExhibitionItem, "claims" | "media"> & {
  media?: MediaEntry
}

type ExhibitionSourceSection = Omit<ExhibitionSection, "claims" | "items" | "navMedia"> & {
  items: ExhibitionSourceItem[]
}

type ExhibitionSourceManifest = Omit<ExhibitionManifest, "hero" | "sections" | "imageUrls"> & {
  hero?: MediaEntry
  sections: ExhibitionSourceSection[]
}

type ExhibitionsSource = {
  schemaVersion?: string
  exhibitions?: ExhibitionSourceManifest[]
}

type ClaimRegistryEntry = {
  claim: EvidenceEntry
  citations: Map<string, EvidenceEntry>
  pageTitle: string
  urlPath: string
}

function normalizedVerbatimExcerpt(value: string): string {
  return value
    .replaceAll("\\n", "\n")
    .replace(/[-\u00ad]\s*\n\s*(?=\p{L})/gu, "")
    .normalize("NFKC")
    .replace(/\s+/gu, " ")
    .trim()
}

function readJsonFile<T>(path: string): T | undefined {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T
  } catch {
    return undefined
  }
}

function listMarkdownFiles(dir: string): string[] {
  try {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = resolve(dir, entry.name)
      if (entry.isDirectory()) return listMarkdownFiles(path)
      return entry.isFile() && entry.name.endsWith(".md") ? [path] : []
    })
  } catch {
    return []
  }
}

function loadMediaCatalog(): Map<string, MediaEntry> {
  const path = resolve(process.cwd(), "quartz/static/mediaCatalogSource.json")
  const payload = readJsonFile<{ entries?: MediaEntry[] }>(path)
  const mediaById = new Map<string, MediaEntry>()
  for (const entry of payload?.entries ?? []) {
    if (entry && typeof entry.mediaId === "string") mediaById.set(entry.mediaId, entry)
  }
  return mediaById
}

function citationEntries(sections: Map<string, EvidenceEntry[]>): EvidenceEntry[] {
  return [...sections.entries()]
    .filter(([title]) => CITATION_SECTION_TITLES.has(title))
    .flatMap(([, entries]) => entries)
    .filter((entry) => entry.id.startsWith("c-"))
}

function loadClaimRegistry(): Map<string, ClaimRegistryEntry> {
  const root = resolve(process.cwd(), "objektai")
  const filePaths = listMarkdownFiles(root)
  const relativePaths = filePaths.map(
    (filePath) => relative(process.cwd(), filePath).replaceAll(sep, "/") as FilePath,
  )
  const slugMap = createUniqueSlugMap(relativePaths)
  const registry = new Map<string, ClaimRegistryEntry>()
  for (const [index, filePath] of filePaths.entries()) {
    const markdown = readFileSync(filePath, "utf8")
    const anchoredGlobalIds = new Map(
      [...markdown.matchAll(/<a id="claim-(t-\d+)"><\/a>\s*-\s*(t-\d+)/g)].map((match) => [
        match[2],
        match[1],
      ]),
    )
    const sections = parseEvidenceSections(markdown)
    const citations = new Map(citationEntries(sections).map((entry) => [entry.id, entry]))
    const pageTitle = evidenceDocumentContext(markdown)
    const slug = slugMap.get(relativePaths[index]) ?? relativePaths[index].replace(/\.md$/i, "")
    const urlPath = `/${slug.split("/").map(encodeURIComponent).join("/")}`
    for (const claim of sections.get("Teiginiai") ?? []) {
      if (!claim.id.startsWith("t-")) continue
      const globalId = claim.fields.get("global_id")?.trim() || anchoredGlobalIds.get(claim.id)
      if (!globalId?.startsWith("t-") || registry.has(globalId)) continue
      registry.set(globalId, { claim, citations, pageTitle, urlPath })
    }
  }
  return registry
}

function resolveClaim(
  ref: ExhibitionClaimRef,
  registry: Map<string, ClaimRegistryEntry>,
  context: string,
): ExhibitionClaim {
  const entry = registry.get(ref.claimId)
  if (!entry) throw new Error(`${context}: global claim ${ref.claimId} was not found`)
  const citation = entry.citations.get(ref.citationId)
  if (!citation) {
    throw new Error(`${context}: citation ${ref.citationId} was not found for ${ref.claimId}`)
  }
  const text = entry.claim.fields.get("teiginys")?.trim() ?? ""
  const quote = evidenceCitationQuoteForClaim(citation, text, entry.pageTitle, true)
  const sourceTitle =
    citation.fields.get("šaltinis")?.trim() ||
    citation.fields.get("saltinis")?.trim() ||
    entry.pageTitle
  if (!text || !quote || !sourceTitle) {
    throw new Error(`${context}: ${ref.claimId}/${ref.citationId} has incomplete evidence`)
  }
  const forwardLinks =
    entry.claim.lists.get("pagrindžia") ?? entry.claim.lists.get("pagrindzia") ?? []
  if (!forwardLinks.includes(ref.citationId)) {
    throw new Error(`${context}: ${ref.claimId} does not reference ${ref.citationId}`)
  }
  const backlinks = citation.lists.get("pagrindžia") ?? citation.lists.get("pagrindzia") ?? []
  if (!backlinks.includes(entry.claim.id) && !backlinks.includes(ref.claimId)) {
    throw new Error(`${context}: ${ref.citationId} does not backlink ${ref.claimId}`)
  }
  if (!evidenceSupportsClaim(text, quote, entry.pageTitle)) {
    throw new Error(`${context}: ${ref.citationId} does not support ${ref.claimId}`)
  }
  const originalQuote = citation.fields.get("citata_originali")?.trim() ?? ""
  const displayQuote = citation.fields.get("citata_rodoma")?.trim() ?? ""
  if (
    originalQuote &&
    displayQuote &&
    !normalizedVerbatimExcerpt(originalQuote).includes(normalizedVerbatimExcerpt(displayQuote))
  ) {
    throw new Error(`${context}: ${ref.citationId} display quote is not a verbatim excerpt`)
  }
  return {
    ...ref,
    text,
    quote,
    sourceTitle,
    url: `${entry.urlPath}#claim-${ref.claimId}`,
  }
}

function sourcePayload(path: string): ExhibitionSourceManifest[] {
  const payload = readJsonFile<ExhibitionsSource>(path)
  if (!Array.isArray(payload?.exhibitions)) {
    throw new Error(`Exhibition source is missing or invalid: ${path}`)
  }
  return payload.exhibitions
}

function resolveExhibition(
  source: ExhibitionSourceManifest,
  mediaById: Map<string, MediaEntry>,
  claimsById: Map<string, ClaimRegistryEntry>,
): ExhibitionManifest {
  const hero = source.hero ?? mediaById.get(source.heroMediaId)
  if (!hero)
    throw new Error(`${source.exhibitionId}: hero media ${source.heroMediaId} was not found`)
  const imageUrls: string[] = []
  const sections: ExhibitionSection[] = []
  for (const section of source.sections) {
    const navMedia = mediaById.get(section.navMediaId)
    if (!navMedia) {
      throw new Error(
        `${source.exhibitionId}/${section.sectionId}: navigation media ${section.navMediaId} was not found`,
      )
    }
    const sectionClaims = (section.claimRefs ?? []).map((ref) =>
      resolveClaim(ref, claimsById, `${source.exhibitionId}/${section.sectionId}`),
    )
    const items = section.items.map((item): ExhibitionItem => {
      const media = item.media ?? mediaById.get(item.mediaId)
      if (!media) {
        throw new Error(
          `${source.exhibitionId}/${section.sectionId}/${item.exhibitionItemId}: media ${item.mediaId} was not found`,
        )
      }
      const imageUrl = mediaImageUrl(media)
      if (imageUrl) imageUrls.push(imageUrl)
      const claims = (item.claimRefs ?? []).map((ref) =>
        resolveClaim(
          ref,
          claimsById,
          `${source.exhibitionId}/${section.sectionId}/${item.exhibitionItemId}`,
        ),
      )
      return { ...item, media, claims }
    })
    if (!items.some((item) => item.mediaId === section.navMediaId)) {
      throw new Error(
        `${source.exhibitionId}/${section.sectionId}: navigation media is not one of its exhibits`,
      )
    }
    sections.push({ ...section, navMedia, claims: sectionClaims, items })
  }
  const exhibition: ExhibitionManifest = {
    ...source,
    hero,
    sections,
    imageUrls: [...new Set(imageUrls)],
  }
  const items = sections.flatMap((section) => section.items)
  const itemIds = new Set(items.map((item) => item.exhibitionItemId))
  for (const item of items) {
    if (!item.relation) continue
    if (item.relation.targetItemId === item.exhibitionItemId) {
      throw new Error(`${source.exhibitionId}/${item.exhibitionItemId}: relation targets itself`)
    }
    if (!itemIds.has(item.relation.targetItemId)) {
      throw new Error(
        `${source.exhibitionId}/${item.exhibitionItemId}: relation target ${item.relation.targetItemId} was not found`,
      )
    }
  }
  return exhibition
}

export function loadExhibitions(): ExhibitionManifest[] {
  const mediaById = loadMediaCatalog()
  const claimsById = loadClaimRegistry()
  const sourcePaths = [
    "quartz/static/exhibitionsSource.json",
    "quartz/static/exhibitionSupplements.json",
    "quartz/static/exhibitionStateSymbols.json",
  ].map((path) => resolve(process.cwd(), path))
  const exhibitions = sourcePaths
    .flatMap((path) => sourcePayload(path))
    .map((source) => resolveExhibition(source, mediaById, claimsById))
  const seenExhibitionIds = new Set<string>()
  const seenExhibitionSlugs = new Set<string>()
  const seenMediaIds = new Set<string>()
  const seenItemIds = new Set<string>()
  const seenCanonicalUrls = new Set<string>()
  const seenSourceUrls = new Set<string>()
  const seenDescriptions = new Set<string>()
  for (const exhibition of exhibitions) {
    if (seenExhibitionIds.has(exhibition.exhibitionId)) {
      throw new Error(`Duplicate exhibition ID: ${exhibition.exhibitionId}`)
    }
    seenExhibitionIds.add(exhibition.exhibitionId)
    for (const slug of [exhibition.slug, ...(exhibition.legacySlugs ?? [])]) {
      if (!slug.startsWith("parodos/") || slug.endsWith("/") || slug.includes("..")) {
        throw new Error(`${exhibition.exhibitionId}: invalid exhibition slug ${slug}`)
      }
      if (seenExhibitionSlugs.has(slug)) {
        throw new Error(`Duplicate exhibition slug or legacy slug: ${slug}`)
      }
      seenExhibitionSlugs.add(slug)
    }
    const seenClaimIds = new Set<string>()
    for (const claim of exhibition.sections.flatMap((section) => [
      ...section.claims,
      ...section.items.flatMap((item) => item.claims),
    ])) {
      if (seenClaimIds.has(claim.claimId)) {
        throw new Error(`${claim.claimId} repeats within ${exhibition.exhibitionId}`)
      }
      seenClaimIds.add(claim.claimId)
    }
    for (const item of exhibition.sections.flatMap((section) => section.items)) {
      if (seenMediaIds.has(item.mediaId)) {
        throw new Error(`Media ${item.mediaId} repeats across exhibitions`)
      }
      seenMediaIds.add(item.mediaId)
      if (seenItemIds.has(item.exhibitionItemId)) {
        throw new Error(`Duplicate exhibition item ID: ${item.exhibitionItemId}`)
      }
      seenItemIds.add(item.exhibitionItemId)
      for (const [value, seen, label] of [
        [item.media.canonicalUrl, seenCanonicalUrls, "canonical URL"],
        [item.media.sourceUrl, seenSourceUrls, "source URL"],
      ] as const) {
        const normalizedValue = value?.trim()
        if (!normalizedValue) continue
        if (seen.has(normalizedValue)) {
          throw new Error(`Duplicate exhibition ${label}: ${normalizedValue}`)
        }
        seen.add(normalizedValue)
      }
      const description = item.descriptionLt.trim().toLocaleLowerCase("lt").replace(/\s+/g, " ")
      if (seenDescriptions.has(description)) {
        throw new Error(`Duplicate exhibition description: ${item.exhibitionItemId}`)
      }
      seenDescriptions.add(description)
    }
  }
  return exhibitions
}

export function exhibitionItemCount(exhibition: ExhibitionManifest): number {
  return exhibition.sections.reduce((total, section) => total + section.items.length, 0)
}

export function exhibitionFeaturedCount(exhibition: ExhibitionManifest): number {
  return exhibition.sections.reduce(
    (total, section) => total + section.items.filter((item) => item.featured).length,
    0,
  )
}
