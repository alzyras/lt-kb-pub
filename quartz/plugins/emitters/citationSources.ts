import fs from "node:fs"
import { QuartzEmitterPlugin } from "../types"
import { FullSlug } from "../../util/path"
import { write } from "./helpers"
import { ProcessedContent } from "../vfile"
import { collectCitationMetadata, isObjectPage } from "../../util/citationFilter"

export type CitationSourceRegistryEntry = {
  id: string
  title: string
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
        existing.count += source.count
      } else {
        registry.set(source.id, {
          id: source.id,
          title: source.title,
          count: source.count,
        })
      }
    }
  }

  return [...registry.values()].sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count
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
