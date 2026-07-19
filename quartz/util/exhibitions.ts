import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import type { MediaEntry } from "./objectMedia"

export type ExhibitionClaim = {
  code: string
  text: string
  sourceTitle: string
  url: string
  label?: string
  role?: "direct" | "contextual"
}

export type ExhibitionItem = {
  exhibitionItemId: string
  mediaId: string
  titleLt: string
  descriptionLt: string
  catalogDescriptionLt: string
  featured: boolean
  claims: ExhibitionClaim[]
  media: MediaEntry
}

export type ExhibitionSection = {
  sectionId: string
  slug: string
  title: string
  lead: string
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

export type ExhibitionsSource = {
  schemaVersion: string
  exhibitions: ExhibitionManifest[]
}

type ExhibitionSupplementItem = Omit<ExhibitionItem, "media"> & {
  media?: MediaEntry
}

type ExhibitionSupplement = Omit<ExhibitionManifest, "hero" | "sections" | "imageUrls"> & {
  heroMediaId: string
  sections: Array<Omit<ExhibitionSection, "items"> & { items: ExhibitionSupplementItem[] }>
  theme?: "historical" | "interwar"
}

function readJsonFile<T>(path: string): T | undefined {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T
  } catch {
    return undefined
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

function resolveSupplement(
  supplement: ExhibitionSupplement,
  mediaById: Map<string, MediaEntry>,
): ExhibitionManifest | undefined {
  const hero = mediaById.get(supplement.heroMediaId)
  if (!hero) return undefined
  const imageUrls: string[] = []
  const sections = supplement.sections.map((section) => ({
    ...section,
    items: section.items
      .map((item) => {
        const media = item.media ?? mediaById.get(item.mediaId)
        if (!media) return undefined
        const imageUrl = media.sourceUrl || media.thumbUrl
        if (imageUrl) imageUrls.push(imageUrl)
        return { ...item, media }
      })
      .filter((item): item is ExhibitionItem => Boolean(item)),
  }))
  return {
    ...supplement,
    hero,
    sections,
    imageUrls: [...new Set(imageUrls)],
  }
}

export function loadExhibitions(): ExhibitionManifest[] {
  try {
    const path = resolve(process.cwd(), "quartz/static/exhibitionsSource.json")
    const payload = readJsonFile<ExhibitionsSource>(path)
    const exhibitions = Array.isArray(payload?.exhibitions) ? payload.exhibitions : []
    const supplementPath = resolve(process.cwd(), "quartz/static/exhibitionSupplements.json")
    const supplementPayload = readJsonFile<{ exhibitions?: ExhibitionSupplement[] }>(supplementPath)
    if (
      !Array.isArray(supplementPayload?.exhibitions) ||
      supplementPayload.exhibitions.length === 0
    ) {
      return exhibitions
    }
    const mediaById = loadMediaCatalog()
    const supplements = supplementPayload.exhibitions
      .map((supplement) => resolveSupplement(supplement, mediaById))
      .filter((exhibition): exhibition is ExhibitionManifest => Boolean(exhibition))
    return [...exhibitions, ...supplements]
  } catch {
    return []
  }
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
