import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import type { MediaEntry } from "./objectMedia"

export type ExhibitionClaim = {
  code: string
  text: string
  sourceTitle: string
  url: string
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
}

export type ExhibitionsSource = {
  schemaVersion: string
  exhibitions: ExhibitionManifest[]
}

export function loadExhibitions(): ExhibitionManifest[] {
  try {
    const path = resolve(process.cwd(), "quartz/static/exhibitionsSource.json")
    const payload = JSON.parse(readFileSync(path, "utf8")) as ExhibitionsSource
    return Array.isArray(payload.exhibitions) ? payload.exhibitions : []
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
