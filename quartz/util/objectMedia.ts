import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug, joinSegments } from "./path"

export type MediaEntry = {
  mediaId?: string
  detailUrl?: string
  title?: string
  caption?: string
  originalTitle?: string
  creator?: string
  provider?: string
  providerLabel?: string
  license?: string
  rightsNote?: string
  licenseUrl?: string
  attribution?: string
  dateDisplay?: string
  dateStart?: number
  dateEnd?: number
  width?: number
  height?: number
  canonicalUrl?: string
  sourceUrl?: string
  thumbUrl?: string
  institution?: string
  collection?: string
  country?: string
  language?: string
  tags?: MediaTag[]
  relatedObjects?: RelatedMediaObject[]
  firstDiscoveredAt?: string
  reviewedAt?: string
  visualReviewVersion?: string
  visualEvidence?: string
  metadataEvidence?: string
  confidenceLevel?: string
  relationType?: string
  directness?: string
  reviewStatus?: string
  confidence?: number
  sourceMethod?: string
  judgeModel?: string
  judgeReason?: string
  isPrimary?: number
}

export type MediaTag = {
  code: string
  label: string
  facetKind?: string
  confidence?: number
}

export type RelatedMediaObject = {
  notePath: string
  title: string
  itemType?: string
  relationType?: string
  directness?: string
}

export type ObjectMediaSet = {
  direct: MediaEntry[]
  contextual: MediaEntry[]
  all: MediaEntry[]
  primary?: MediaEntry
  fallbackPrimary?: MediaEntry
  totalCount: number
}

export function isObjectPage(slug: string | undefined): boolean {
  return Boolean(slug?.startsWith("objektai/") && slug.split("/").length >= 3)
}

export function isObjectGalleryPage(slug: string | undefined): boolean {
  return Boolean(slug?.startsWith("objektai/") && slug.endsWith("/galerija"))
}

export function isMediaGalleryPage(slug: string | undefined): boolean {
  return slug === "galerija" || isObjectGalleryPage(slug)
}

export function mergeMediaEntries(entries: MediaEntry[]): MediaEntry[] {
  const merged = new Map<string, MediaEntry>()
  for (const entry of entries) {
    const mediaId = cleanText(entry.mediaId)
    if (!mediaId) continue
    const current = merged.get(mediaId)
    if (!current) {
      merged.set(mediaId, {
        ...entry,
        tags: [...(entry.tags ?? [])],
        relatedObjects: [...(entry.relatedObjects ?? [])],
      })
      continue
    }
    const tags = new Map((current.tags ?? []).map((tag) => [tag.code, tag]))
    for (const tag of entry.tags ?? []) tags.set(tag.code, tag)
    const objects = new Map(
      (current.relatedObjects ?? []).map((object) => [object.notePath, object]),
    )
    for (const object of entry.relatedObjects ?? []) objects.set(object.notePath, object)
    current.tags = [...tags.values()]
    current.relatedObjects = [...objects.values()]
    current.isPrimary = Math.max(Number(current.isPrimary ?? 0), Number(entry.isPrimary ?? 0))
    current.confidence = Math.max(Number(current.confidence ?? 0), Number(entry.confidence ?? 0))
  }
  return [...merged.values()]
}

export function objectGallerySlug(objectSlug: FullSlug): FullSlug {
  return joinSegments(objectSlug, "galerija") as FullSlug
}

export function mediaTitleSlug(value: unknown, maxLength = 96): string {
  const normalized = cleanText(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("lt")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  if (!normalized) return "vaizdas"
  const shortened = normalized.slice(0, Math.max(1, maxLength)).replace(/-+$/g, "")
  return shortened || "vaizdas"
}

export function mediaDetailSlug(entry: MediaEntry): FullSlug {
  const mediaId = cleanText(entry.mediaId).replace(/[^a-zA-Z0-9_-]+/g, "-") || "media"
  return joinSegments(
    "galerija",
    `${mediaTitleSlug(displayCaption(entry))}--${mediaId}`,
  ) as FullSlug
}

export function mediaDetailUrl(entry: MediaEntry): string {
  return `/${entry.detailUrl?.replace(/^\/+/, "") || mediaDetailSlug(entry)}`
}

export function withMediaDetailUrl(entry: MediaEntry): MediaEntry {
  return { ...entry, detailUrl: `/${mediaDetailSlug(entry)}` }
}

export function parseMediaEntries(value: unknown): MediaEntry[] {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is MediaEntry => Boolean(entry && typeof entry === "object"))
  }
  const text = String(value ?? "").trim()
  if (!text) return []
  try {
    const parsed = JSON.parse(text)
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is MediaEntry => Boolean(entry && typeof entry === "object"))
      : []
  } catch {
    return []
  }
}

export function parseMediaEntry(value: unknown): MediaEntry | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as MediaEntry
  }
  const text = String(value ?? "").trim()
  if (!text) return undefined
  try {
    const parsed = JSON.parse(text)
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as MediaEntry)
      : undefined
  } catch {
    return undefined
  }
}

export function objectMediaSet(frontmatter: QuartzPluginData["frontmatter"]): ObjectMediaSet {
  const direct = parseMediaEntries(frontmatter?.media_direct_json)
  const contextual = parseMediaEntries(frontmatter?.media_contextual_json)
  const all = parseMediaEntries(frontmatter?.media_all_json)
  const primary = parseMediaEntry(frontmatter?.media_primary_json)
  const fallbackPrimary = primary ?? direct[0] ?? contextual[0] ?? all[0]
  const totalCount = Number(frontmatter?.media_total_count ?? all.length) || all.length

  return { direct, contextual, all, primary, fallbackPrimary, totalCount }
}

export function relationLabel(relationType: string | undefined): string {
  switch (String(relationType ?? "")) {
    case "portrait_of":
      return "Portretas"
    case "painting_of":
      return "Paveikslas"
    case "statue_of":
      return "Skulptūra"
    case "seal_of":
      return "Antspaudas"
    case "coin_depiction_of":
      return "Moneta"
    case "map_of":
      return "Žemėlapis"
    case "manuscript_depiction_of":
      return "Rankraštis"
    case "associated_symbol_of":
      return "Simbolis"
    case "commemoration_of":
      return "Minėjimas"
    case "event_documentation_of":
      return "Įvykio vaizdas"
    case "edition_image_of":
      return "Leidinio vaizdas"
    default:
      return "Vaizdas"
  }
}

export function directnessLabel(directness: string | undefined): string {
  switch (String(directness ?? "")) {
    case "direct":
      return "Tiesioginis"
    case "contextual":
      return "Susijęs"
    default:
      return "Kitas"
  }
}

export function cleanText(value: unknown): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
}

export function displayCaption(entry: MediaEntry): string {
  return cleanText(entry.caption) || cleanText(entry.title) || "Atvaizdas"
}

export function displayCreator(value: unknown): string {
  return cleanText(value).replace(/^w:/i, "").trim()
}

export function displayDate(value: unknown): string {
  return cleanText(value)
    .replace(/\s+date\s+QS:.*$/i, "")
    .trim()
}

export function displayMeta(entry: MediaEntry): string {
  const parts = [
    displayCreator(entry.creator),
    displayDate(entry.dateDisplay),
    cleanText(entry.providerLabel || entry.provider),
  ].filter(Boolean)
  return parts.join(" • ")
}
