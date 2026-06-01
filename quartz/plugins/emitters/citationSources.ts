import fs from "node:fs"
import { QuartzEmitterPlugin } from "../types"
import { FullSlug } from "../../util/path"
import { write } from "./helpers"
import { ProcessedContent } from "../vfile"
import { collectCitationMetadata, isObjectPage } from "../../util/citationFilter"

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

export const CitationSourcesRegistry: QuartzEmitterPlugin = () => ({
  name: "CitationSourcesRegistry",
  async *emit(ctx, content) {
    yield write({
      ctx,
      content: JSON.stringify(buildCitationSourceRegistry(content)),
      slug: "static/citationSources" as FullSlug,
      ext: ".json",
    })
  },
})
