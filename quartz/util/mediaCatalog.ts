import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { QuartzPluginData } from "../plugins/vfile"
import {
  cleanText,
  applyObjectPagePrimary,
  isObjectPage,
  MediaEntry,
  mergeMediaEntries,
  type ObjectMediaSet,
  objectMediaSet,
  withMediaDetailUrl,
} from "./objectMedia"
import { assertPublishableMediaAttribution, normalizeMediaAttribution } from "./mediaAttribution"
import { emptyGalleryState, rankMediaEntries } from "./mediaGallery"

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

function loadMediaCatalogFile(fileName: string, required = false): MediaEntry[] {
  const path = resolve(process.cwd(), "quartz/static", fileName)
  let payload: { entries?: unknown }
  try { payload = JSON.parse(readFileSync(path, "utf8")) }
  catch (error) {
    if (required) throw new Error(`Unable to read canonical media catalogue at ${path}`, { cause: error })
    return []
  }
  if (!Array.isArray(payload.entries)) throw new Error(`Invalid media catalogue: ${path}`)
  const entries = payload.entries.filter((entry): entry is MediaEntry => Boolean(entry && typeof entry === "object"))
    .map(normalizeMediaAttribution).map(withMediaDetailUrl)
  assertPublishableMediaAttribution(entries)
  return entries
}
export function loadCanonicalMediaCatalog(): MediaEntry[] {
  return mergeMediaEntries([
    ...loadMediaCatalogFile("mediaCatalogSource.json", true),
    ...loadMediaCatalogFile("articleMediaCatalog.json"),
  ])
}

export function buildMediaCatalog(files: MediaCatalogFile[]): MediaEntry[] {
  const canonical = mergeMediaEntries(loadCanonicalMediaCatalog())
  return canonicalizeMediaObjectPaths(canonical, files).map(withMediaDetailUrl)
}

function entryForObject(
  entry: MediaEntry,
  relation: NonNullable<MediaEntry["relatedObjects"]>[number],
) {
  return {
    ...entry,
    directness: cleanText(relation.directness) || entry.directness,
    relationType: cleanText(relation.relationType) || entry.relationType,
  }
}

function mediaSetFromEntries(entries: MediaEntry[], objectPath: string): ObjectMediaSet {
  const all = rankMediaEntries(mergeMediaEntries(entries), emptyGalleryState(), {
    lockedObject: objectPath,
  })
  const direct = all.filter((entry) => cleanText(entry.directness).toLowerCase() === "direct")
  const contextual = all.filter(
    (entry) => cleanText(entry.directness).toLowerCase() === "contextual",
  )
  const primary =
    direct.find((entry) => Number(entry.isPrimary ?? 0) === 1) ??
    all.find((entry) => Number(entry.isPrimary ?? 0) === 1)
  const fallbackPrimary = primary ?? direct[0] ?? contextual[0] ?? all[0]
  return { direct, contextual, all, primary, fallbackPrimary, totalCount: all.length }
}

export type ObjectMediaIndex = Map<string, ObjectMediaSet>

export function buildObjectMediaIndex(catalog: MediaEntry[]): ObjectMediaIndex {
  const entries = new Map<string, MediaEntry[]>()
  for (const entry of catalog) {
    for (const object of entry.relatedObjects ?? []) {
      const notePath = normalizedObjectPath(object.notePath)
      if (!notePath) continue
      entries.set(notePath, [...(entries.get(notePath) ?? []), entryForObject(entry, object)])
    }
  }
  return new Map(
    [...entries].map(([notePath, related]) => [notePath, mediaSetFromEntries(related, notePath)]),
  )
}

export function mediaSetForObject(
  index: ReadonlyMap<string, ObjectMediaSet>,
  ...candidates: unknown[]
): ObjectMediaSet {
  for (const candidate of candidates) {
    const normalized = normalizedObjectPath(candidate)
    if (!normalized) continue
    const exact = index.get(normalized)
    if (exact) return exact
    const key = pathKey(normalized)
    const matched = [...index].find(([notePath]) => pathKey(notePath) === key)?.[1]
    if (matched) return matched
  }
  return { direct: [], contextual: [], all: [], totalCount: 0 }
}

export function mediaSetForFile(
  index: ReadonlyMap<string, ObjectMediaSet>,
  file: MediaCatalogFile,
): ObjectMediaSet {
  return mediaSetForObject(
    index,
    file.relativePath,
    file.filePath,
    file.slug ? `${file.slug}.md` : "",
    file.slug,
  )
}

export function canonicalMediaFrontmatter(set: ObjectMediaSet): Record<string, unknown> {
  const primary = set.primary ?? set.fallbackPrimary
  return {
    media_total_count: set.totalCount,
    media_primary_thumb_url: cleanText(
      primary?.thumbUrl || primary?.displayUrl || primary?.sourceUrl,
    ),
    media_primary_canonical_url: cleanText(primary?.canonicalUrl),
    media_primary_directness: cleanText(primary?.directness),
    media_primary_relation_type: cleanText(primary?.relationType),
    media_primary_width: primary?.width,
    media_primary_height: primary?.height,
    media_primary_json: primary ? JSON.stringify(primary) : "",
    media_direct_json: JSON.stringify(set.direct),
    media_contextual_json: JSON.stringify(set.contextual),
    media_all_json: JSON.stringify(set.all),
  }
}

export function hydrateCanonicalObjectMedia(
  file: MediaCatalogFile,
  index: ReadonlyMap<string, ObjectMediaSet>,
): ObjectMediaSet {
  const set = applyObjectPagePrimary(mediaSetForFile(index, file), file.frontmatter)
  file.frontmatter ??= { title: "" }
  Object.assign(file.frontmatter, canonicalMediaFrontmatter(set))
  return set
}

function mediaIds(entries: MediaEntry[]): string[] {
  return entries
    .map((entry) => cleanText(entry.mediaId))
    .filter(Boolean)
    .sort()
}

function orderedMediaIds(entries: MediaEntry[]): string[] {
  return entries.map((entry) => cleanText(entry.mediaId)).filter(Boolean)
}

function mediaSetSignature(set: ObjectMediaSet) {
  return {
    all: mediaIds(set.all),
    direct: mediaIds(set.direct),
    contextual: mediaIds(set.contextual),
    primary: cleanText((set.primary ?? set.fallbackPrimary)?.mediaId),
    totalCount: set.totalCount,
  }
}

export function assertObjectMediaIndexEquality(
  files: MediaCatalogFile[],
  index: ReadonlyMap<string, ObjectMediaSet>,
): void {
  const failures: string[] = []
  for (const file of files) {
    const slug = cleanText(file.slug)
    if (!isObjectPage(slug) || slug.endsWith("/galerija")) continue
    // The canonical catalogue chooses a default primary, but an object page
    // may explicitly select another image after its identity/visual gate.
    // Compare against that same page-level decision so the build validates the
    // effective public projection rather than the raw catalogue default.
    const expected = mediaSetSignature(
      applyObjectPagePrimary(mediaSetForFile(index, file), file.frontmatter),
    )
    const actual = mediaSetSignature(objectMediaSet(file.frontmatter))
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      failures.push(
        `${slug}: page=${actual.totalCount}/${actual.primary || "-"} index=${expected.totalCount}/${expected.primary || "-"}`,
      )
    }
  }
  if (!failures.length) return
  throw new Error(
    `Canonical object→media equality check failed (${failures.length} objects): ${failures
      .slice(0, 20)
      .join("; ")}${failures.length > 20 ? `; and ${failures.length - 20} more` : ""}`,
  )
}

export function objectMediaIndexSnapshot(
  index: ReadonlyMap<string, ObjectMediaSet>,
): Record<
  string,
  { all: string[]; direct: string[]; contextual: string[]; primary: string; totalCount: number }
> {
  return Object.fromEntries(
    [...index].map(([notePath, set]) => [
      notePath,
      {
        all: orderedMediaIds(set.all),
        direct: orderedMediaIds(set.direct),
        contextual: orderedMediaIds(set.contextual),
        primary: cleanText((set.primary ?? set.fallbackPrimary)?.mediaId),
        totalCount: set.totalCount,
      },
    ]),
  )
}

/** Shared canonical catalogue grouping used by homepage media selections. */
export function mediaEntriesByObject(catalog: MediaEntry[]): Map<string, MediaEntry[]> {
  return new Map([...buildObjectMediaIndex(catalog)].map(([path, set]) => [path, set.all]))
}
