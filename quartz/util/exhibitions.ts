import { readdirSync, readFileSync } from "node:fs"
import { relative, resolve, sep } from "node:path"
import { evidenceDocumentContext, evidenceCitationQuoteForClaim } from "./evidenceIntegrity"
import {
  CITATION_SECTION_TITLES,
  parseEvidenceSections,
  type EvidenceEntry,
} from "./citationFilter"
import type { MediaEntry } from "./objectMedia"

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

export type ExhibitionItem = {
  exhibitionItemId: string
  mediaId: string
  titleLt: string
  descriptionLt: string
  catalogDescriptionLt: string
  evidenceNoteLt?: string
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
  title: string
  subtitle: string
  description: string
  heroMediaId: string
  hero: MediaEntry
  sections: ExhibitionSection[]
  imageUrls: string[]
  updatedAt: string
  theme?: "historical" | "interwar"
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
  const registry = new Map<string, ClaimRegistryEntry>()
  for (const filePath of listMarkdownFiles(root)) {
    const markdown = readFileSync(filePath, "utf8")
    const sections = parseEvidenceSections(markdown)
    const citations = new Map(citationEntries(sections).map((entry) => [entry.id, entry]))
    const pageTitle = evidenceDocumentContext(markdown)
    const urlPath = `/${relative(process.cwd(), filePath)
      .replaceAll(sep, "/")
      .replace(/\.md$/i, "")
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`
    for (const claim of sections.get("Teiginiai") ?? []) {
      if (!claim.id.startsWith("t-")) continue
      const globalId = claim.fields.get("global_id")?.trim()
      if (!globalId?.startsWith("t-") || registry.has(globalId)) continue
      registry.set(globalId, { claim, citations, pageTitle, urlPath })
    }
  }
  return registry
}

function resolveClaim(
  ref: ExhibitionClaimRef,
  registry: Map<string, ClaimRegistryEntry>,
): ExhibitionClaim | undefined {
  const entry = registry.get(ref.claimId)
  if (!entry) return undefined
  const citation = entry.citations.get(ref.citationId)
  if (!citation) return undefined
  const text = entry.claim.fields.get("teiginys")?.trim() ?? ""
  const quote = evidenceCitationQuoteForClaim(citation, text, entry.pageTitle)
  const sourceTitle =
    citation.fields.get("šaltinis")?.trim() ||
    citation.fields.get("saltinis")?.trim() ||
    entry.pageTitle
  if (!text || !quote || !sourceTitle) return undefined
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
  return Array.isArray(payload?.exhibitions) ? payload.exhibitions : []
}

function resolveExhibition(
  source: ExhibitionSourceManifest,
  mediaById: Map<string, MediaEntry>,
  claimsById: Map<string, ClaimRegistryEntry>,
): ExhibitionManifest | undefined {
  const hero = source.hero ?? mediaById.get(source.heroMediaId)
  if (!hero) return undefined
  const imageUrls: string[] = []
  const sections: ExhibitionSection[] = []
  for (const section of source.sections) {
    const navMedia = mediaById.get(section.navMediaId)
    if (!navMedia) continue
    const sectionClaims = (section.claimRefs ?? [])
      .map((ref) => resolveClaim(ref, claimsById))
      .filter((claim): claim is ExhibitionClaim => Boolean(claim))
    const items = section.items
      .map((item): ExhibitionItem | undefined => {
        const media = item.media ?? mediaById.get(item.mediaId)
        if (!media) return undefined
        const imageUrl = media.sourceUrl || media.thumbUrl
        if (imageUrl) imageUrls.push(imageUrl)
        const claims = (item.claimRefs ?? [])
          .map((ref) => resolveClaim(ref, claimsById))
          .filter((claim): claim is ExhibitionClaim => Boolean(claim))
        return { ...item, media, claims }
      })
      .filter((item): item is ExhibitionItem => Boolean(item))
    sections.push({ ...section, navMedia, claims: sectionClaims, items })
  }
  return {
    ...source,
    hero,
    sections,
    imageUrls: [...new Set(imageUrls)],
  }
}

export function loadExhibitions(): ExhibitionManifest[] {
  const mediaById = loadMediaCatalog()
  const claimsById = loadClaimRegistry()
  const sourcePath = resolve(process.cwd(), "quartz/static/exhibitionsSource.json")
  const supplementsPath = resolve(process.cwd(), "quartz/static/exhibitionSupplements.json")
  return [...sourcePayload(sourcePath), ...sourcePayload(supplementsPath)]
    .map((source) => resolveExhibition(source, mediaById, claimsById))
    .filter((exhibition): exhibition is ExhibitionManifest => Boolean(exhibition))
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
