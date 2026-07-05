import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug, joinSegments } from "./path"

export type MediaEntry = {
  mediaId?: string
  title?: string
  caption?: string
  creator?: string
  provider?: string
  providerLabel?: string
  license?: string
  rightsNote?: string
  dateDisplay?: string
  canonicalUrl?: string
  thumbUrl?: string
  relationType?: string
  directness?: string
  reviewStatus?: string
  confidence?: number
  sourceMethod?: string
  judgeModel?: string
  judgeReason?: string
  isPrimary?: number
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

export function objectGallerySlug(objectSlug: FullSlug): FullSlug {
  return joinSegments(objectSlug, "galerija") as FullSlug
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
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as MediaEntry) : undefined
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
  return String(value ?? "").replace(/\s+/g, " ").trim()
}

export function displayCaption(entry: MediaEntry): string {
  return cleanText(entry.caption) || cleanText(entry.title) || "Atvaizdas"
}

export function displayMeta(entry: MediaEntry): string {
  const parts = [cleanText(entry.creator), cleanText(entry.dateDisplay), cleanText(entry.providerLabel || entry.provider)]
    .filter(Boolean)
  return parts.join(" • ")
}
