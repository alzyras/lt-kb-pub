import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { QuartzPluginData } from "../plugins/vfile"
import {
  cleanText,
  isObjectPage,
  MediaEntry,
  mergeMediaEntries,
  objectMediaSet,
  withMediaDetailUrl,
} from "./objectMedia"

export type MediaCatalogFile = Pick<
  QuartzPluginData,
  "slug" | "filePath" | "relativePath" | "aliases" | "frontmatter"
>

function normalizedObjectPath(value: unknown): string {
  return cleanText(value)
    .normalize("NFC")
    .replaceAll("\\", "/")
    .replace(/^\.?\/?content\//, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.md$/i, "")
}

function pathKey(value: unknown): string {
  return normalizedObjectPath(value).toLocaleLowerCase("lt")
}

function publicObjectPaths(files: MediaCatalogFile[]): Map<string, string> {
  const paths = new Map<string, string>()
  for (const file of files) {
    const publicSlug = normalizedObjectPath(file.slug)
    if (!isObjectPage(publicSlug)) continue
    const sourcePath = normalizedObjectPath(file.relativePath || file.filePath || publicSlug)
    const directory = sourcePath.slice(0, sourcePath.lastIndexOf("/"))
    const rawAliases = [
      ...(Array.isArray(file.aliases) ? file.aliases : []),
      ...(Array.isArray(file.frontmatter?.aliases) ? file.frontmatter.aliases : []),
      ...(Array.isArray(file.frontmatter?.variantai) ? file.frontmatter.variantai : []),
      file.frontmatter?.title,
    ]
      .map(normalizedObjectPath)
      .filter(Boolean)
      .map((alias) => (alias.startsWith("objektai/") ? alias : `${directory}/${alias}`))

    for (const candidate of [publicSlug, sourcePath, ...rawAliases]) {
      const key = pathKey(candidate)
      if (key && !paths.has(key)) paths.set(key, publicSlug)
    }
  }
  return paths
}

export function canonicalizeMediaObjectPaths(
  entries: MediaEntry[],
  files: MediaCatalogFile[],
): MediaEntry[] {
  const paths = publicObjectPaths(files)
  return entries.map((entry) => ({
    ...entry,
    relatedObjects: (entry.relatedObjects ?? []).map((object) => {
      const publicSlug = paths.get(pathKey(object.notePath))
      return publicSlug ? { ...object, notePath: `${publicSlug}.md` } : object
    }),
  }))
}

export function loadCanonicalMediaCatalog(): MediaEntry[] {
  try {
    const path = resolve(process.cwd(), "quartz/static/mediaCatalogSource.json")
    const payload = JSON.parse(readFileSync(path, "utf8")) as { entries?: unknown }
    return Array.isArray(payload.entries)
      ? payload.entries.filter((entry): entry is MediaEntry =>
          Boolean(entry && typeof entry === "object"),
        )
      : []
  } catch {
    return []
  }
}

export function buildMediaCatalog(files: MediaCatalogFile[]): MediaEntry[] {
  const embeddedEntries: MediaEntry[] = []
  for (const file of files) {
    const slug = file.slug
    if (!slug || !isObjectPage(slug) || slug.endsWith("/galerija")) continue
    embeddedEntries.push(...objectMediaSet(file.frontmatter).all)
  }

  const merged = mergeMediaEntries([...loadCanonicalMediaCatalog(), ...embeddedEntries])
  return canonicalizeMediaObjectPaths(merged, files).map(withMediaDetailUrl)
}

export function mediaEntriesByObject(catalog: MediaEntry[]): Map<string, MediaEntry[]> {
  const entries = new Map<string, MediaEntry[]>()
  for (const entry of catalog) {
    for (const object of entry.relatedObjects ?? []) {
      const notePath = cleanText(object.notePath)
      if (!notePath) continue
      entries.set(notePath, [...(entries.get(notePath) ?? []), entry])
    }
  }
  return entries
}
