import fs from "node:fs"
import { QuartzEmitterPlugin } from "../types"
import { FullSlug } from "../../util/path"
import { write } from "./helpers"
import { ProcessedContent } from "../vfile"
import {
  CITATION_SECTION_TITLES,
  collectCitationMetadata,
  isObjectPage,
  normalizeCitationSourceId,
  parseEvidenceSections,
} from "../../util/citationFilter"
import { objectMediaSet } from "../../util/objectMedia"
import { SourceCatalogEntry } from "../../util/sourceSettings"

export type CitationSourceRegistryEntry = {
  id: string
  title: string
  objectCount: number
  quoteCount: number
  /** Backward-compatible quote count for older clients. */
  count: number
}

export function buildCitationSourceRegistry(content: ProcessedContent[]): CitationSourceRegistryEntry[] {
  const registry = new Map<string, CitationSourceRegistryEntry>()

  for (const [, file] of content) {
    const relativePath = String(file.data.relativePath ?? file.data.filePath ?? "")
    const filePath = String(file.data.filePath ?? "")
    if (!isObjectPage(relativePath) || !filePath) {
      continue
    }
    const markdown = fs.readFileSync(filePath, "utf8")
    const metadata = collectCitationMetadata(markdown)
    for (const source of metadata.sources) {
      const existing = registry.get(source.id)
      if (existing) {
        existing.objectCount += 1
        existing.quoteCount += source.count
        existing.count = existing.quoteCount
      } else {
        registry.set(source.id, {
          id: source.id,
          title: source.title,
          objectCount: 1,
          quoteCount: source.count,
          count: source.count,
        })
      }
    }
  }

  return [...registry.values()].sort((a, b) => {
    if (b.objectCount !== a.objectCount) {
      return b.objectCount - a.objectCount
    }
    if (b.quoteCount !== a.quoteCount) {
      return b.quoteCount - a.quoteCount
    }
    return a.title.localeCompare(b.title, "lt", { sensitivity: "base" })
  })
}

function narbutSeries(title: string): Pick<SourceCatalogEntry, "seriesId" | "seriesTitle" | "volumeLabel"> {
  const match = title.match(/Teodoras Narbutas, Lietuvių tautos istorija,\s*t\.\s*(\d+)/i)
  if (!match) return {}
  return {
    seriesId: "teodoras-narbutas-lietuviu-tautos-istorija",
    seriesTitle: "Teodoro Narbuto „Lietuvių tautos istorija“",
    volumeLabel: `t. ${match[1]}`,
  }
}

function claimCountsBySource(markdown: string): Map<string, number> {
  const sections = parseEvidenceSections(markdown)
  const quoteSources = new Map<string, string>()
  for (const [title, entries] of sections) {
    if (!CITATION_SECTION_TITLES.has(title)) continue
    for (const entry of entries) {
      const source = entry.fields.get("šaltinis") ?? entry.fields.get("saltinis") ?? ""
      const sourceId = normalizeCitationSourceId(source)
      if (entry.id.startsWith("c-") && sourceId) quoteSources.set(entry.id, sourceId)
    }
  }
  const counts = new Map<string, number>()
  for (const claim of sections.get("Teiginiai") ?? []) {
    const quoteIds = claim.lists.get("pagrindžia") ?? claim.lists.get("pagrindzia") ?? []
    const sourceIds = new Set(quoteIds.map((id) => quoteSources.get(id)).filter(Boolean) as string[])
    for (const sourceId of sourceIds) counts.set(sourceId, (counts.get(sourceId) ?? 0) + 1)
  }
  return counts
}

export function buildSourceCatalog(content: ProcessedContent[]): SourceCatalogEntry[] {
  const citationRegistry = buildCitationSourceRegistry(content)
  const publicSlugs = new Map<string, string>()
  const claimCounts = new Map<string, number>()
  const media = new Map<string, SourceCatalogEntry & { objectSlugs: Set<string>; mediaIds: Set<string> }>()

  for (const [, file] of content) {
    const slug = String(file.data.slug ?? "")
    const title = String(file.data.frontmatter?.pavadinimas ?? file.data.frontmatter?.title ?? "").trim()
    if (slug.startsWith("objektai/saltiniai/") && title) {
      publicSlugs.set(normalizeCitationSourceId(title), slug)
    }
    const filePath = String(file.data.filePath ?? "")
    const relativePath = String(file.data.relativePath ?? file.data.filePath ?? "")
    if (isObjectPage(relativePath) && filePath) {
      const markdown = fs.readFileSync(filePath, "utf8")
      for (const [sourceId, count] of claimCountsBySource(markdown)) {
        claimCounts.set(sourceId, (claimCounts.get(sourceId) ?? 0) + count)
      }
    }
    if (!slug.startsWith("objektai/") || slug.endsWith("/galerija")) continue
    for (const entry of objectMediaSet(file.data.frontmatter).all) {
      const provider = String(entry.provider ?? "other").trim().toLowerCase() || "other"
      const id = `media-${provider}`
      const existing = media.get(id) ?? {
        id,
        title: String(entry.providerLabel || entry.provider || "Kiti vaizdų šaltiniai").trim(),
        channel: "media" as const,
        kind: String(entry.relationType ?? "").includes("map") ? "map" as const : "image" as const,
        provider,
        searchText: `${entry.providerLabel ?? ""} ${entry.provider ?? ""}`.trim(),
        objectCount: 0,
        claimCount: 0,
        quoteCount: 0,
        mediaCount: 0,
        objectSlugs: new Set<string>(),
        mediaIds: new Set<string>(),
      }
      existing.objectSlugs.add(slug)
      existing.mediaIds.add(String(entry.mediaId ?? entry.canonicalUrl ?? entry.thumbUrl ?? `${slug}:${existing.mediaIds.size}`))
      media.set(id, existing)
    }
  }

  const textEntries: SourceCatalogEntry[] = citationRegistry.map((source) => ({
    id: source.id,
    title: source.title,
    channel: "text",
    kind: "book",
    ...narbutSeries(source.title),
    publicSlug: publicSlugs.get(source.id),
    searchText: source.title,
    objectCount: source.objectCount,
    claimCount: claimCounts.get(source.id) ?? 0,
    quoteCount: source.quoteCount,
    mediaCount: 0,
  }))
  const mediaEntries = [...media.values()].map(({ objectSlugs, mediaIds, ...entry }) => ({
    ...entry,
    objectCount: objectSlugs.size,
    mediaCount: mediaIds.size,
  }))
  return [...textEntries, ...mediaEntries].sort((a, b) => {
    if (a.channel !== b.channel) return a.channel.localeCompare(b.channel)
    if (a.kind !== b.kind) return a.kind.localeCompare(b.kind)
    return a.title.localeCompare(b.title, "lt", { sensitivity: "base" })
  })
}

export const CitationSourcesRegistry: QuartzEmitterPlugin = () => ({
  name: "CitationSourcesRegistry",
  async *emit(ctx, content) {
    yield write({
      ctx,
      content: JSON.stringify(buildCitationSourceRegistry(content)),
      slug: "static/citationSources" as FullSlug,
      ext: ".json",
    })
    yield write({
      ctx,
      content: JSON.stringify(buildSourceCatalog(content)),
      slug: "static/sourceCatalog" as FullSlug,
      ext: ".json",
    })
  },
})
