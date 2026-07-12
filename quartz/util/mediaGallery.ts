import FlexSearch from "flexsearch"
import type { MediaEntry } from "./objectMedia"
import { cleanText, relationLabel } from "./objectMedia"

export const MEDIA_GALLERY_PAGE_SIZE = 36

export type MediaFacetKey =
  | "directness"
  | "types"
  | "objects"
  | "objectTypes"
  | "tags"
  | "periods"
  | "providers"
  | "institutions"
  | "licenses"

export type GalleryState = {
  q: string
  directness: string[]
  types: string[]
  objects: string[]
  objectTypes: string[]
  tags: string[]
  periods: string[]
  providers: string[]
  institutions: string[]
  licenses: string[]
  sort: "recommended" | "date-asc" | "date-desc" | "collected-desc"
}

export type MediaFacetOption = {
  value: string
  label: string
  count: number
}

export type MediaFacetSummary = Record<MediaFacetKey, MediaFacetOption[]>

export type MediaGalleryBootstrap = {
  initialEntries: MediaEntry[]
  totalCount: number
  facetSummary: MediaFacetSummary
  catalogUrl: string
  catalogVersion: string
  lockedObject?: string
}

export const emptyGalleryState = (): GalleryState => ({
  q: "",
  directness: [],
  types: [],
  objects: [],
  objectTypes: [],
  tags: [],
  periods: [],
  providers: [],
  institutions: [],
  licenses: [],
  sort: "recommended",
})

export function normalizeMediaSearch(value: unknown): string {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("lt")
}

export function mediaLicenseLabel(value: unknown): string {
  const license = cleanText(value)
  const normalized = license.toLowerCase()
  if (!license) return ""
  if (normalized.includes("public domain") || normalized.includes("pdm")) return "Viešoji sritis"
  if (normalized.includes("cc0")) return "CC0"
  const ccMatch = normalized.match(/cc[-_ ]?(by(?:-sa|-nc|-nd|-nc-sa|-nc-nd)?)\D*([234]\.0)/i)
  if (ccMatch) return `${ccMatch[1].toUpperCase()} ${ccMatch[2]}`
  try {
    return new URL(license).hostname.replace(/^www\./, "")
  } catch {
    return license
  }
}

export function mediaPeriod(entry: MediaEntry): string {
  const fallback = cleanText(entry.dateDisplay).match(/-?\d{3,4}/)?.[0]
  const year = Number(entry.dateStart ?? entry.dateEnd ?? fallback ?? 0)
  if (!year) return "unknown"
  if (year < 1800) return "before-1800"
  if (year <= 1918) return "1800-1918"
  if (year <= 1990) return "1919-1990"
  return "1991-now"
}

export const mediaPeriodLabel = (value: string): string => ({
  "before-1800": "Iki 1800",
  "1800-1918": "1800–1918",
  "1919-1990": "1919–1990",
  "1991-now": "Nuo 1991",
  unknown: "Data nežinoma",
})[value] ?? value

const directnessLabel = (value: string): string => value === "direct" ? "Tiesioginiai" : value === "contextual" ? "Kontekstiniai" : value

function valuesForFacet(entry: MediaEntry, key: MediaFacetKey): string[] {
  switch (key) {
    case "directness": return [cleanText(entry.directness)].filter(Boolean)
    case "types": return [cleanText(entry.relationType)].filter(Boolean)
    case "objects": return (entry.relatedObjects ?? []).map((object) => cleanText(object.notePath)).filter(Boolean)
    case "objectTypes": return (entry.relatedObjects ?? []).map((object) => cleanText(object.itemType)).filter(Boolean)
    case "tags": return (entry.tags ?? []).map((tag) => cleanText(tag.code)).filter(Boolean)
    case "periods": return [mediaPeriod(entry)]
    case "providers": return [cleanText(entry.provider)].filter(Boolean)
    case "institutions": return [cleanText(entry.institution)].filter(Boolean)
    case "licenses": return [cleanText(entry.license)].filter(Boolean)
  }
}

function labelForFacet(entries: MediaEntry[], key: MediaFacetKey, value: string): string {
  if (key === "directness") return directnessLabel(value)
  if (key === "types") return relationLabel(value)
  if (key === "periods") return mediaPeriodLabel(value)
  if (key === "licenses") return mediaLicenseLabel(value)
  if (key === "objects") return entries.flatMap((entry) => entry.relatedObjects ?? []).find((object) => object.notePath === value)?.title ?? value
  if (key === "tags") return entries.flatMap((entry) => entry.tags ?? []).find((tag) => tag.code === value)?.label ?? value
  return value
}

const FACET_KEYS: MediaFacetKey[] = ["directness", "types", "objects", "objectTypes", "tags", "periods", "providers", "institutions", "licenses"]

export function computeFacetSummary(entries: MediaEntry[]): MediaFacetSummary {
  return Object.fromEntries(FACET_KEYS.map((key) => {
    const counts = new Map<string, number>()
    entries.forEach((entry) => new Set(valuesForFacet(entry, key)).forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1)))
    const options = [...counts].map(([value, count]) => ({ value, count, label: labelForFacet(entries, key, value) }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "lt"))
    return [key, options]
  })) as MediaFacetSummary
}

function mediaSearchText(entry: MediaEntry): string {
  return normalizeMediaSearch([
    entry.caption, entry.originalTitle, entry.title, entry.creator, entry.dateDisplay,
    entry.institution, entry.collection, entry.providerLabel, entry.provider,
    ...(entry.tags ?? []).flatMap((tag) => [tag.code, tag.label]),
    ...(entry.relatedObjects ?? []).flatMap((object) => [object.title, object.notePath, object.itemType]),
  ].map(cleanText).filter(Boolean).join(" "))
}

export type MediaSearchIndex = { search: (query: string) => Set<string> }

export function buildMediaSearchIndex(entries: MediaEntry[]): MediaSearchIndex {
  const index = new FlexSearch.Index({ tokenize: "forward", cache: 100, resolution: 9 })
  entries.forEach((entry, position) => index.add(cleanText(entry.mediaId) || position, mediaSearchText(entry)))
  return {
    search(query) {
      const tokens = [...new Set(normalizeMediaSearch(query).split(" ").filter(Boolean))]
      if (!tokens.length) return new Set(entries.map((entry, position) => cleanText(entry.mediaId) || String(position)))
      const tokenResults = tokens.map((token) => new Set(index.search(token, { limit: Math.max(entries.length, 100), suggest: true }).map(String)))
      return new Set([...tokenResults[0]].filter((id) => tokenResults.every((result) => result.has(id))))
    },
  }
}

function stateValues(state: GalleryState, key: MediaFacetKey): string[] {
  return key === "types" ? state.types
    : key === "objects" ? state.objects
      : key === "objectTypes" ? state.objectTypes
        : key === "periods" ? state.periods
          : key === "providers" ? state.providers
            : key === "institutions" ? state.institutions
              : key === "licenses" ? state.licenses
                : state[key]
}

function matchesFacet(entry: MediaEntry, selected: string[], key: MediaFacetKey): boolean {
  if (!selected.length) return true
  const values = valuesForFacet(entry, key)
  return selected.some((value) => values.includes(value))
}

export function filterMediaEntries(
  entries: MediaEntry[],
  state: GalleryState,
  searchIndex?: MediaSearchIndex,
  options: { excludeFacet?: MediaFacetKey; lockedObject?: string; providerAllowed?: (entry: MediaEntry) => boolean } = {},
): MediaEntry[] {
  const searchIds = state.q && searchIndex ? searchIndex.search(state.q) : undefined
  const filtered = entries.filter((entry, position) => {
    const id = cleanText(entry.mediaId) || String(position)
    if (options.providerAllowed && !options.providerAllowed(entry)) return false
    if (options.lockedObject && !(entry.relatedObjects ?? []).some((object) => object.notePath === options.lockedObject)) return false
    if (searchIds && !searchIds.has(id)) return false
    return FACET_KEYS.every((key) => key === options.excludeFacet || matchesFacet(entry, stateValues(state, key), key))
  })
  return filtered.sort((a, b) => {
    if (state.sort === "date-asc") return Number(a.dateStart ?? 999999) - Number(b.dateStart ?? 999999)
    if (state.sort === "date-desc") return Number(b.dateStart ?? -999999) - Number(a.dateStart ?? -999999)
    if (state.sort === "collected-desc") return cleanText(b.firstDiscoveredAt).localeCompare(cleanText(a.firstDiscoveredAt))
    return Number(b.isPrimary ?? 0) - Number(a.isPrimary ?? 0)
      || Number(b.confidence ?? 0) - Number(a.confidence ?? 0)
      || cleanText(a.caption).localeCompare(cleanText(b.caption), "lt")
  })
}

export function computeDynamicFacetCounts(
  entries: MediaEntry[],
  state: GalleryState,
  searchIndex?: MediaSearchIndex,
  lockedObject = "",
  providerAllowed?: (entry: MediaEntry) => boolean,
): MediaFacetSummary {
  return Object.fromEntries(FACET_KEYS.map((key) => {
    const base = filterMediaEntries(entries, state, searchIndex, { excludeFacet: key, lockedObject, providerAllowed })
    return [key, computeFacetSummary(base)[key]]
  })) as MediaFacetSummary
}

export function parseGalleryState(search: string, lockedObject = ""): GalleryState {
  const params = new URLSearchParams(search)
  const list = (key: string) => (params.get(key) ?? "").split(",").map((value) => value.trim()).filter(Boolean)
  return {
    q: params.get("q") ?? "",
    directness: list("directness"), types: list("types"), objects: lockedObject ? [] : list("objects"),
    objectTypes: list("objectTypes"), tags: list("tags"), periods: list("periods"), providers: list("providers"),
    institutions: list("institutions"), licenses: list("licenses"),
    sort: (["date-asc", "date-desc", "collected-desc"].includes(params.get("sort") ?? "") ? params.get("sort") : "recommended") as GalleryState["sort"],
  }
}

export function serializeGalleryState(state: GalleryState, mediaId = ""): string {
  const params = new URLSearchParams()
  if (state.q) params.set("q", state.q)
  for (const key of FACET_KEYS) {
    const values = stateValues(state, key)
    if (values.length) params.set(key, values.join(","))
  }
  if (state.sort !== "recommended") params.set("sort", state.sort)
  if (mediaId) params.set("media", mediaId)
  const query = params.toString()
  return query ? `?${query}` : ""
}
