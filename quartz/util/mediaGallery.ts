import FlexSearch from "flexsearch"
import type { MediaEntry } from "./objectMedia"
import { cleanText, relationLabel } from "./objectMedia"
import { mediaLicenseDefinition } from "./mediaAttribution"

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
  const definition = mediaLicenseDefinition(license)
  if (definition?.id === "PDM-1.0") return "Viešoji sritis"
  if (definition) return definition.label
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

export const mediaPeriodLabel = (value: string): string =>
  ({
    "before-1800": "Iki 1800",
    "1800-1918": "1800–1918",
    "1919-1990": "1919–1990",
    "1991-now": "Nuo 1991",
    unknown: "Data nežinoma",
  })[value] ?? value

const directnessLabel = (value: string): string =>
  value === "direct" ? "Tiesioginiai" : value === "contextual" ? "Kontekstiniai" : value

function valuesForFacet(entry: MediaEntry, key: MediaFacetKey): string[] {
  switch (key) {
    case "directness":
      return [cleanText(entry.directness)].filter(Boolean)
    case "types":
      return [cleanText(entry.relationType)].filter(Boolean)
    case "objects":
      return (entry.relatedObjects ?? [])
        .map((object) => cleanText(object.notePath))
        .filter(Boolean)
    case "objectTypes":
      return (entry.relatedObjects ?? [])
        .map((object) => cleanText(object.itemType))
        .filter(Boolean)
    case "tags":
      return (entry.tags ?? []).map((tag) => cleanText(tag.code)).filter(Boolean)
    case "periods":
      return [mediaPeriod(entry)]
    case "providers":
      return [cleanText(entry.provider)].filter(Boolean)
    case "institutions":
      return [cleanText(entry.institution)].filter(Boolean)
    case "licenses":
      return [cleanText(entry.license)].filter(Boolean)
  }
}

function labelForFacet(entries: MediaEntry[], key: MediaFacetKey, value: string): string {
  if (key === "directness") return directnessLabel(value)
  if (key === "types") return relationLabel(value)
  if (key === "periods") return mediaPeriodLabel(value)
  if (key === "licenses") return mediaLicenseLabel(value)
  if (key === "objects")
    return (
      entries
        .flatMap((entry) => entry.relatedObjects ?? [])
        .find((object) => object.notePath === value)?.title ?? value
    )
  if (key === "tags")
    return (
      entries.flatMap((entry) => entry.tags ?? []).find((tag) => tag.code === value)?.label ?? value
    )
  return value
}

const FACET_KEYS: MediaFacetKey[] = [
  "directness",
  "types",
  "objects",
  "objectTypes",
  "tags",
  "periods",
  "providers",
  "institutions",
  "licenses",
]

export function computeFacetSummary(entries: MediaEntry[]): MediaFacetSummary {
  return Object.fromEntries(
    FACET_KEYS.map((key) => {
      const counts = new Map<string, number>()
      entries.forEach((entry) =>
        new Set(valuesForFacet(entry, key)).forEach((value) =>
          counts.set(value, (counts.get(value) ?? 0) + 1),
        ),
      )
      const options = [...counts]
        .map(([value, count]) => ({ value, count, label: labelForFacet(entries, key, value) }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "lt"))
      return [key, options]
    }),
  ) as MediaFacetSummary
}

function mediaSearchText(entry: MediaEntry): string {
  return normalizeMediaSearch(
    [
      entry.caption,
      entry.originalTitle,
      entry.title,
      entry.creator,
      entry.dateDisplay,
      entry.institution,
      entry.collection,
      entry.providerLabel,
      entry.provider,
      ...(entry.tags ?? []).flatMap((tag) => [tag.code, tag.label]),
      ...(entry.relatedObjects ?? []).flatMap((object) => [
        object.title,
        object.notePath,
        object.itemType,
      ]),
    ]
      .map(cleanText)
      .filter(Boolean)
      .join(" "),
  )
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0))
}

function normalizedEntryConfidence(entry: MediaEntry): number {
  const numeric = Number(entry.confidence)
  if (Number.isFinite(numeric) && numeric > 0) return clamp01(numeric > 1 ? numeric / 100 : numeric)
  const level = normalizeMediaSearch(entry.confidenceLevel)
  return level === "high" ? 0.9 : level === "medium" ? 0.65 : level === "low" ? 0.35 : 0.45
}

function queryRelevance(entry: MediaEntry, query: string): number {
  const tokens = [...new Set(normalizeMediaSearch(query).split(/\s+/).filter(Boolean))]
  if (!tokens.length) return 0
  const fields: Array<[unknown, number]> = [
    [entry.caption, 1],
    [entry.originalTitle || entry.title, 0.7],
    [entry.creator, 0.65],
    [entry.institution, 0.6],
    [entry.providerLabel || entry.provider, 0.35],
    [(entry.relatedObjects ?? []).map((object) => object.title).join(" "), 0.95],
    [(entry.tags ?? []).flatMap((tag) => [tag.code, tag.label]).join(" "), 0.75],
  ]
  let score = 0
  for (const token of tokens) {
    let tokenScore = 0
    for (const [value, weight] of fields) {
      const normalized = normalizeMediaSearch(value)
      if (!normalized) continue
      if (normalized === token) tokenScore = Math.max(tokenScore, weight)
      else if (normalized.split(/\s+/).some((part) => part === token)) {
        tokenScore = Math.max(tokenScore, weight * 0.95)
      } else if (normalized.includes(token)) tokenScore = Math.max(tokenScore, weight * 0.75)
    }
    score += tokenScore
  }
  return clamp01(score / tokens.length)
}

function entityRelevance(entry: MediaEntry): number {
  const directness = cleanText(entry.directness).toLowerCase()
  const relation = cleanText(entry.relationType).toLowerCase()
  const direct = directness === "direct" ? 1 : directness === "contextual" ? 0.28 : 0.45
  const primary = Number(entry.isPrimary ?? 0) === 1 ? 1 : 0
  const depiction =
    /(?:portrait|painting|statue|seal|coin_depiction|map|manuscript_depiction)_of/.test(relation)
      ? 1
      : relation
        ? 0.55
        : 0.35
  return clamp01(direct * 0.55 + primary * 0.25 + depiction * 0.2)
}

function technicalQuality(entry: MediaEntry): number {
  const width = Number(entry.width)
  const height = Number(entry.height)
  const pixels = width > 0 && height > 0 ? width * height : 0
  const resolution = pixels ? clamp01(Math.log2(Math.max(pixels, 1)) / Math.log2(12_000_000)) : 0.2
  const ratio = width > 0 && height > 0 ? width / height : 0
  const usableRatio = ratio >= 0.2 && ratio <= 5 ? 1 : ratio ? 0.25 : 0.5
  const urls =
    Number(Boolean(cleanText(entry.sourceUrl))) + Number(Boolean(cleanText(entry.thumbUrl)))
  return clamp01(resolution * 0.65 + usableRatio * 0.2 + (urls / 2) * 0.15)
}

function metadataCompleteness(entry: MediaEntry): number {
  const fields = [
    entry.caption || entry.title,
    entry.creator,
    entry.dateDisplay || entry.dateStart || entry.dateEnd,
    entry.institution || entry.providerLabel,
    entry.canonicalUrl,
    entry.license,
    entry.licenseUrl,
    entry.width && entry.height,
  ]
  return fields.filter((value) => Boolean(cleanText(value))).length / fields.length
}

function sourceAuthority(entry: MediaEntry): number {
  const provider = normalizeMediaSearch(entry.provider)
  const hasInstitution = Boolean(cleanText(entry.institution) || cleanText(entry.providerLabel))
  const canonicalRecord = Boolean(cleanText(entry.canonicalUrl))
  const recognizedAggregator = provider === "commons" || provider === "europeana"
  return clamp01(
    Number(hasInstitution) * 0.45 +
      Number(canonicalRecord) * 0.35 +
      Number(recognizedAggregator) * 0.2,
  )
}

function chronologicalRelevance(entry: MediaEntry, query: string): number {
  const entryYear = Number(
    entry.dateStart ?? entry.dateEnd ?? cleanText(entry.dateDisplay).match(/-?\d{3,4}/)?.[0] ?? 0,
  )
  if (!entryYear) return 0.2
  const queryYear = Number(normalizeMediaSearch(query).match(/-?\d{3,4}/)?.[0] ?? 0)
  if (!queryYear) return 0.8
  return clamp01(1 - Math.abs(queryYear - entryYear) / 250)
}

export type MediaRankingSignals = {
  queryRelevance: number
  entityRelevance: number
  evidenceConfidence: number
  technicalQuality: number
  metadataCompleteness: number
  sourceAuthority: number
  chronologicalRelevance: number
}

export function mediaRankingSignals(entry: MediaEntry, query = ""): MediaRankingSignals {
  return {
    queryRelevance: queryRelevance(entry, query),
    entityRelevance: entityRelevance(entry),
    evidenceConfidence: normalizedEntryConfidence(entry),
    technicalQuality: technicalQuality(entry),
    metadataCompleteness: metadataCompleteness(entry),
    sourceAuthority: sourceAuthority(entry),
    chronologicalRelevance: chronologicalRelevance(entry, query),
  }
}

export function recommendedMediaScore(entry: MediaEntry, query = ""): number {
  const signals = mediaRankingSignals(entry, query)
  const queryWeight = cleanText(query) ? 0.24 : 0
  const weighted =
    signals.queryRelevance * queryWeight +
    signals.entityRelevance * 0.24 +
    signals.evidenceConfidence * 0.17 +
    signals.technicalQuality * 0.13 +
    signals.metadataCompleteness * 0.1 +
    signals.sourceAuthority * 0.07 +
    signals.chronologicalRelevance * 0.05
  const denominator = 0.76 + queryWeight
  const accepted = cleanText(entry.reviewStatus).toLowerCase()
  const reviewMultiplier = accepted === "rejected" ? 0.05 : accepted === "accepted" ? 1 : 0.85
  return clamp01(weighted / denominator) * reviewMultiplier
}

function objectKeys(entry: MediaEntry): string[] {
  const keys = (entry.relatedObjects ?? [])
    .map((object) => normalizeMediaSearch(object.notePath))
    .filter(Boolean)
  return keys.length ? [...new Set(keys)] : [`media:${cleanText(entry.mediaId)}`]
}

function typeKey(entry: MediaEntry): string {
  return cleanText(entry.relationType) || "unknown"
}

function providerKey(entry: MediaEntry): string {
  return normalizeMediaSearch(entry.provider || entry.providerLabel) || "unknown"
}

const IMAGE_TRANSFORM_QUERY_PARAMETERS = new Set([
  "auto",
  "dpr",
  "fit",
  "fm",
  "format",
  "h",
  "height",
  "q",
  "quality",
  "size",
  "w",
  "width",
])

function normalizedCommonsFileTitle(url: URL): string {
  const pathname = decodeURIComponent(url.pathname).normalize("NFC")
  if (url.hostname.toLowerCase() === "upload.wikimedia.org") {
    const match = pathname.match(
      /\/wikipedia\/commons\/(?:thumb\/)?[a-f0-9]\/[a-f0-9]{2}\/([^/]+)/i,
    )
    if (match?.[1])
      return cleanText(match[1])
        .normalize("NFC")
        .replace(/[\s_]+/g, "_")
  }
  if (/(?:^|\.)commons\.wikimedia\.org$/i.test(url.hostname)) {
    const pathMatch = pathname.match(/\/wiki\/File:(.+)$/i)
    const queryTitle = url.searchParams.get("title")?.match(/^File:(.+)$/i)?.[1]
    const title = pathMatch?.[1] || queryTitle
    if (title)
      return cleanText(title)
        .normalize("NFC")
        .replace(/[\s_]+/g, "_")
  }
  return ""
}

function normalizedImageKey(value: unknown): string {
  const raw = cleanText(value)
  if (!raw) return ""
  try {
    const url = new URL(raw)
    const commonsTitle = normalizedCommonsFileTitle(url)
    if (commonsTitle) return `commons-file:${commonsTitle}`

    // Europeana's thumbnail endpoint identifies the underlying resource in the
    // `uri` query parameter. Ignoring the query collapses every Europeana
    // thumbnail into one false duplicate.
    if (
      url.hostname.toLowerCase() === "api.europeana.eu" &&
      /\/thumbnail\/v2\/url\.json$/i.test(url.pathname)
    ) {
      const embeddedUri = cleanText(url.searchParams.get("uri"))
      if (embeddedUri) return `europeana-thumbnail:${normalizedImageKey(embeddedUri)}`
    }

    const hostname = url.hostname.toLocaleLowerCase("en").replace(/^www\./, "")
    const pathname = decodeURIComponent(url.pathname).normalize("NFC").replace(/\/+$/, "") || "/"
    const identityQuery = [...url.searchParams.entries()]
      .filter(([key]) => !IMAGE_TRANSFORM_QUERY_PARAMETERS.has(key.toLowerCase()))
      .sort(
        ([leftKey, leftValue], [rightKey, rightValue]) =>
          leftKey.localeCompare(rightKey) || leftValue.localeCompare(rightValue),
      )
      .map(([key, value]) => `${key.normalize("NFC")}=${value.normalize("NFC")}`)
      .join("&")
    return `url:${hostname}${pathname}${identityQuery ? `?${identityQuery}` : ""}`
  } catch {
    return `text-url:${normalizeMediaSearch(raw)}`
  }
}

function normalizedCommonsDerivativeKey(entry: MediaEntry, value: unknown): string {
  const raw = cleanText(value)
  const creator = normalizeMediaSearch(entry.creator)
  if (!raw || !creator) return ""
  try {
    const title = normalizedCommonsFileTitle(new URL(raw))
    const match = title.match(/^(.+)\.(?:jpe?g|png|webp|tiff?|gif)$/i)
    return match?.[1] ? `commons-raster-derivative:${match[1]}|${creator}` : ""
  } catch {
    return ""
  }
}

function captionCreatorKey(entry: MediaEntry): string {
  const caption = normalizeMediaSearch(entry.caption || entry.title)
  const creator = normalizeMediaSearch(entry.creator)
  const provider = providerKey(entry)
  const date = normalizeMediaSearch(entry.dateDisplay || entry.dateStart || entry.dateEnd)
  const width = Number(entry.width)
  const height = Number(entry.height)
  const dimensions =
    Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0
      ? `${width}x${height}`
      : ""
  return caption && creator && provider && date && dimensions
    ? `metadata:${provider}|${caption}|${creator}|${date}|${dimensions}`
    : ""
}

function hammingDistance(left: string, right: string): number {
  if (!left || left.length !== right.length || !/^[a-f0-9]+$/i.test(left + right)) return Infinity
  let distance = 0
  for (let index = 0; index < left.length; index++) {
    let xor = Number.parseInt(left[index], 16) ^ Number.parseInt(right[index], 16)
    while (xor) {
      distance += xor & 1
      xor >>= 1
    }
  }
  return distance
}

export function mediaDuplicateFingerprints(entry: MediaEntry): string[] {
  const urls = [entry.canonicalUrl, entry.sourceUrl, entry.displayUrl, entry.thumbUrl]
  const urlFingerprints = urls
    .flatMap((url) => [normalizedImageKey(url), normalizedCommonsDerivativeKey(entry, url)])
    .filter(Boolean)
  // Metadata-only matching is deliberately a fallback. Equal captions and
  // creators commonly describe distinct views in museum series; treating them
  // as duplicates when provider URLs are present hides legitimate images.
  if (!urlFingerprints.length) {
    const metadata = captionCreatorKey(entry)
    if (metadata) urlFingerprints.push(metadata)
  }
  return [...new Set(urlFingerprints)]
}

export function areNearDuplicateMedia(left: MediaEntry, right: MediaEntry): boolean {
  const leftHash = cleanText(left.perceptualHash).toLowerCase()
  const rightHash = cleanText(right.perceptualHash).toLowerCase()
  if (leftHash && rightHash && hammingDistance(leftHash, rightHash) <= 6) return true
  const leftFingerprints = new Set(mediaDuplicateFingerprints(left))
  return mediaDuplicateFingerprints(right).some((fingerprint) => leftFingerprints.has(fingerprint))
}

export type MediaRankingOptions = {
  lockedObject?: string
  firstPageSize?: number
  maxPerObject?: number
  maxProviderShare?: number
  diversify?: boolean
}

function hasActiveFacets(state: GalleryState): boolean {
  return FACET_KEYS.some((key) => stateValues(state, key).length > 0)
}

export function rankMediaEntries(
  entries: MediaEntry[],
  state: GalleryState,
  options: MediaRankingOptions = {},
): MediaEntry[] {
  const decorated = entries.map((entry, index) => ({
    entry,
    index,
    score: recommendedMediaScore(entry, state.q),
    objects: objectKeys(entry),
    provider: providerKey(entry),
    relationType: typeKey(entry),
    period: mediaPeriod(entry),
    duplicateFingerprints: mediaDuplicateFingerprints(entry),
    perceptualHash: cleanText(entry.perceptualHash).toLowerCase(),
  }))
  decorated.sort(
    (left, right) =>
      right.score - left.score ||
      left.index - right.index ||
      cleanText(left.entry.mediaId).localeCompare(cleanText(right.entry.mediaId)),
  )
  const base = decorated.map(({ entry }) => entry)
  if (options.diversify === false || base.length < 2) return base

  const pageSize = Math.min(options.firstPageSize ?? MEDIA_GALLERY_PAGE_SIZE, base.length)
  const enforceGlobalObjectCap =
    !cleanText(options.lockedObject) && !cleanText(state.q) && !hasActiveFacets(state)
  const maxPerObject = Math.max(1, options.maxPerObject ?? 2)
  const providerLimit = Math.max(1, Math.ceil(pageSize * clamp01(options.maxProviderShare ?? 0.75)))
  const selected: typeof decorated = []
  const remaining = [...decorated]
  const objectCounts = new Map<string, number>()
  const providerCounts = new Map<string, number>()
  const typeCounts = new Map<string, number>()
  const periodCounts = new Map<string, number>()
  const selectedDuplicateFingerprints = new Set<string>()
  const selectedPerceptualHashes: string[] = []

  while (selected.length < pageSize && remaining.length) {
    let bestIndex = -1
    let bestScore = -Infinity
    const eligibleProviders = new Set(
      remaining
        .filter(
          (candidate) =>
            !enforceGlobalObjectCap ||
            !candidate.objects.some((object) => (objectCounts.get(object) ?? 0) >= maxPerObject),
        )
        .map((candidate) => candidate.provider),
    )
    for (let index = 0; index < remaining.length; index++) {
      const candidate = remaining[index]
      const { objects, provider, relationType, period } = candidate
      if (
        enforceGlobalObjectCap &&
        objects.some((object) => (objectCounts.get(object) ?? 0) >= maxPerObject)
      ) {
        continue
      }
      if (
        enforceGlobalObjectCap &&
        (providerCounts.get(provider) ?? 0) >= providerLimit &&
        eligibleProviders.size > 1
      ) {
        continue
      }

      const duplicate =
        Boolean(
          candidate.duplicateFingerprints.some((fingerprint) =>
            selectedDuplicateFingerprints.has(fingerprint),
          ),
        ) ||
        Boolean(
          candidate.perceptualHash &&
          selectedPerceptualHashes.some(
            (hash) => hammingDistance(hash, candidate.perceptualHash) <= 6,
          ),
        )
      const newObject = objects.some((object) => !objectCounts.has(object))
      const diversityAdjustment =
        (newObject ? 0.08 : 0) +
        (providerCounts.has(provider) ? 0 : 0.06) +
        (typeCounts.has(relationType) ? 0 : 0.05) +
        (periodCounts.has(period) ? 0 : 0.03) -
        (providerCounts.get(provider) ?? 0) * 0.012 -
        Math.max(0, ...objects.map((object) => objectCounts.get(object) ?? 0)) * 0.05 -
        (duplicate ? 0.5 : 0)
      const score = candidate.score + diversityAdjustment
      if (score > bestScore) {
        bestScore = score
        bestIndex = index
      }
    }
    if (bestIndex < 0) break
    const [candidate] = remaining.splice(bestIndex, 1)
    selected.push(candidate)
    for (const object of candidate.objects)
      objectCounts.set(object, (objectCounts.get(object) ?? 0) + 1)
    const { provider, relationType, period } = candidate
    providerCounts.set(provider, (providerCounts.get(provider) ?? 0) + 1)
    typeCounts.set(relationType, (typeCounts.get(relationType) ?? 0) + 1)
    periodCounts.set(period, (periodCounts.get(period) ?? 0) + 1)
    for (const fingerprint of candidate.duplicateFingerprints) {
      selectedDuplicateFingerprints.add(fingerprint)
    }
    if (candidate.perceptualHash) selectedPerceptualHashes.push(candidate.perceptualHash)
  }

  const selectedEntries = selected.map((candidate) => candidate.entry)
  const selectedIds = new Set(selectedEntries)
  return [
    ...selectedEntries,
    ...decorated.map(({ entry }) => entry).filter((entry) => !selectedIds.has(entry)),
  ]
}

export type GalleryRankingEvaluation = {
  ndcgAt12: number
  firstPageUniqueObjectCount: number
  nearDuplicateRate: number
  providerDiversity: number
  uniqueProviderCount: number
  imageOpenRate: number | null
}

export function evaluateGalleryRanking(
  rankedEntries: MediaEntry[],
  options: {
    relevance?: ReadonlyMap<string, number> | Record<string, number>
    openedMediaIds?: ReadonlySet<string>
    cutoff?: number
    firstPageSize?: number
  } = {},
): GalleryRankingEvaluation {
  const cutoff = Math.max(1, options.cutoff ?? 12)
  const firstPage = rankedEntries.slice(0, options.firstPageSize ?? MEDIA_GALLERY_PAGE_SIZE)
  const relevanceFor = (entry: MediaEntry): number => {
    const id = cleanText(entry.mediaId)
    const relevance = options.relevance
    if (relevance && typeof (relevance as ReadonlyMap<string, number>).get === "function") {
      return Math.max(0, Number((relevance as ReadonlyMap<string, number>).get(id) ?? 0))
    }
    if (relevance) return Math.max(0, Number((relevance as Record<string, number>)[id] ?? 0))
    return recommendedMediaScore(entry) * 3
  }
  const dcg = (relevances: number[]) =>
    relevances.reduce(
      (sum, relevance, index) => sum + (2 ** relevance - 1) / Math.log2(index + 2),
      0,
    )
  const actual = rankedEntries.slice(0, cutoff).map(relevanceFor)
  const ideal = rankedEntries
    .map(relevanceFor)
    .sort((a, b) => b - a)
    .slice(0, cutoff)
  const idealDcg = dcg(ideal)
  const objectCount = new Set(
    firstPage
      .map((entry) => normalizeMediaSearch(entry.relatedObjects?.[0]?.notePath))
      .filter(Boolean),
  ).size
  let duplicateCount = 0
  firstPage.forEach((entry, index) => {
    if (firstPage.slice(0, index).some((candidate) => areNearDuplicateMedia(candidate, entry))) {
      duplicateCount += 1
    }
  })
  const providers = new Map<string, number>()
  firstPage.forEach((entry) => {
    const provider = providerKey(entry)
    providers.set(provider, (providers.get(provider) ?? 0) + 1)
  })
  const pairs = firstPage.length * Math.max(0, firstPage.length - 1)
  const sameProviderPairs = [...providers.values()].reduce(
    (sum, count) => sum + count * Math.max(0, count - 1),
    0,
  )
  const opened = options.openedMediaIds
    ? firstPage.filter((entry) => options.openedMediaIds?.has(cleanText(entry.mediaId))).length
    : undefined
  return {
    ndcgAt12: idealDcg ? dcg(actual) / idealDcg : 0,
    firstPageUniqueObjectCount: objectCount,
    nearDuplicateRate: firstPage.length ? duplicateCount / firstPage.length : 0,
    providerDiversity: pairs ? 1 - sameProviderPairs / pairs : 0,
    uniqueProviderCount: providers.size,
    imageOpenRate: opened === undefined ? null : firstPage.length ? opened / firstPage.length : 0,
  }
}

export type MediaSearchIndex = { search: (query: string) => Set<string> }

export function buildMediaSearchIndex(entries: MediaEntry[]): MediaSearchIndex {
  const index = new FlexSearch.Index({ tokenize: "forward", cache: 100, resolution: 9 })
  entries.forEach((entry, position) =>
    index.add(cleanText(entry.mediaId) || position, mediaSearchText(entry)),
  )
  return {
    search(query) {
      const tokens = [...new Set(normalizeMediaSearch(query).split(" ").filter(Boolean))]
      if (!tokens.length)
        return new Set(
          entries.map((entry, position) => cleanText(entry.mediaId) || String(position)),
        )
      const tokenResults = tokens.map(
        (token) =>
          new Set(
            index
              .search(token, { limit: Math.max(entries.length, 100), suggest: true })
              .map(String),
          ),
      )
      return new Set(
        [...tokenResults[0]].filter((id) => tokenResults.every((result) => result.has(id))),
      )
    },
  }
}

function stateValues(state: GalleryState, key: MediaFacetKey): string[] {
  return key === "types"
    ? state.types
    : key === "objects"
      ? state.objects
      : key === "objectTypes"
        ? state.objectTypes
        : key === "periods"
          ? state.periods
          : key === "providers"
            ? state.providers
            : key === "institutions"
              ? state.institutions
              : key === "licenses"
                ? state.licenses
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
  options: {
    excludeFacet?: MediaFacetKey
    lockedObject?: string
    providerAllowed?: (entry: MediaEntry) => boolean
  } = {},
): MediaEntry[] {
  const searchIds = state.q && searchIndex ? searchIndex.search(state.q) : undefined
  const filtered = entries.filter((entry, position) => {
    const id = cleanText(entry.mediaId) || String(position)
    if (options.providerAllowed && !options.providerAllowed(entry)) return false
    if (
      options.lockedObject &&
      !(entry.relatedObjects ?? []).some((object) => object.notePath === options.lockedObject)
    )
      return false
    if (searchIds && !searchIds.has(id)) return false
    return FACET_KEYS.every(
      (key) => key === options.excludeFacet || matchesFacet(entry, stateValues(state, key), key),
    )
  })
  if (state.sort === "recommended") {
    return rankMediaEntries(filtered, state, { lockedObject: options.lockedObject })
  }
  return filtered.sort((a, b) => {
    if (state.sort === "date-asc")
      return Number(a.dateStart ?? 999999) - Number(b.dateStart ?? 999999)
    if (state.sort === "date-desc")
      return Number(b.dateStart ?? -999999) - Number(a.dateStart ?? -999999)
    if (state.sort === "collected-desc")
      return cleanText(b.firstDiscoveredAt).localeCompare(cleanText(a.firstDiscoveredAt))
    return 0
  })
}

export function computeDynamicFacetCounts(
  entries: MediaEntry[],
  state: GalleryState,
  searchIndex?: MediaSearchIndex,
  lockedObject = "",
  providerAllowed?: (entry: MediaEntry) => boolean,
): MediaFacetSummary {
  return Object.fromEntries(
    FACET_KEYS.map((key) => {
      const base = filterMediaEntries(entries, state, searchIndex, {
        excludeFacet: key,
        lockedObject,
        providerAllowed,
      })
      return [key, computeFacetSummary(base)[key]]
    }),
  ) as MediaFacetSummary
}

export function parseGalleryState(search: string, lockedObject = ""): GalleryState {
  const params = new URLSearchParams(search)
  const list = (key: string) =>
    (params.get(key) ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  return {
    q: params.get("q") ?? "",
    directness: list("directness"),
    types: list("types"),
    objects: lockedObject ? [] : list("objects"),
    objectTypes: list("objectTypes"),
    tags: list("tags"),
    periods: list("periods"),
    providers: list("providers"),
    institutions: list("institutions"),
    licenses: list("licenses"),
    sort: (["date-asc", "date-desc", "collected-desc"].includes(params.get("sort") ?? "")
      ? params.get("sort")
      : "recommended") as GalleryState["sort"],
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
