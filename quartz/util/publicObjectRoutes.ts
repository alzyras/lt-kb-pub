import fs from "node:fs"
import { createUniqueSlugMap, type FilePath } from "./path"

let publishedSlugs: Set<string> | undefined

/** Use the canonical exported corpus; never infer an identity from a similar name. */
export function hasPublishedObjectHref(href: string): boolean {
  if (!publishedSlugs) {
    const projection = JSON.parse(fs.readFileSync("public-projection-manifest.json", "utf8"))
    if (projection.source !== "postgresql:lithuanianhistory.workflow") throw new Error("Object navigation requires the canonical PostgreSQL public projection")
    const paths = Object.keys(projection.files).filter(path => path.startsWith("objektai/") && path.endsWith(".md")) as FilePath[]
    publishedSlugs = new Set([...createUniqueSlugMap(paths).values()].map(path => String(path).normalize("NFC")))
  }
  try {
    const slug = decodeURIComponent(new URL(href, "https://local.invalid").pathname).replace(/^\/|\/$/g, "").normalize("NFC")
    return publishedSlugs.has(slug)
  } catch {
    return false
  }
}

export function publicObjectHref(href: string, sources: readonly { url: string }[], fallback: string): string {
  if (!href.startsWith("/objektai/") || hasPublishedObjectHref(href)) return href
  return sources.find(source => source.url.startsWith("https://"))?.url ?? fallback
}
