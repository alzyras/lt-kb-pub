export const ANALYTICS_SCHEMA_VERSION = "ga4_events_v1"

export type GtagCommand = (...args: unknown[]) => void

export function createGtagCommandQueue(dataLayer: unknown[]): GtagCommand {
  return function gtag() {
    dataLayer.push(arguments)
  }
}

export const ANALYTICS_EVENT_NAMES = [
  "page_view",
  "object_view",
  "citation_open",
  "deep_exploration",
  "search",
  "search_result_select",
  "knowledge_navigation",
  "feature_use",
  "outbound_source_open",
] as const

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number]
export type AnalyticsPageType = "object" | "home" | "folder" | "tag" | "research" | "not_found"

export const RECOGNIZED_OBJECT_TYPES = new Set([
  "asmuo",
  "autorius",
  "ivykis",
  "grupe",
  "vieta",
  "daiktas",
  "paprotys",
  "posakis",
  "zodyno_irasas",
  "saltinis",
])

export type AnalyticsPageMetadata = {
  contentId: string
  contentType: string
  pageType: AnalyticsPageType
}

export type ExplorationState = {
  objectIds: string[]
  citationKeys: string[]
  sent: boolean
}

export function classifyAnalyticsPage(
  slug: string,
  contentType: unknown,
  notFound = false,
): AnalyticsPageMetadata {
  const normalizedSlug = String(slug || "index").replace(/^\/+|\/+$/g, "") || "index"
  const normalizedType = String(contentType || "")
    .trim()
    .toLowerCase()
  let pageType: AnalyticsPageType
  if (notFound || normalizedSlug === "404") pageType = "not_found"
  else if (normalizedSlug === "index") pageType = "home"
  else if (normalizedSlug.startsWith("tags/")) pageType = "tag"
  else if (normalizedSlug === "tyrimai" || normalizedSlug.startsWith("tyrimai/"))
    pageType = "research"
  else if (normalizedSlug.startsWith("objektai/") && RECOGNIZED_OBJECT_TYPES.has(normalizedType)) {
    pageType = "object"
  } else pageType = "folder"

  return {
    contentId: normalizedSlug,
    contentType: RECOGNIZED_OBJECT_TYPES.has(normalizedType) ? normalizedType : "none",
    pageType,
  }
}

export function emptyExplorationState(): ExplorationState {
  return { objectIds: [], citationKeys: [], sent: false }
}

export function advanceExploration(
  current: ExplorationState,
  update: { objectId?: string; citationKey?: string },
): { state: ExplorationState; qualified: boolean } {
  const state: ExplorationState = {
    objectIds: [...new Set(current.objectIds.filter(Boolean))],
    citationKeys: [...new Set(current.citationKeys.filter(Boolean))],
    sent: current.sent,
  }
  if (update.objectId && !state.objectIds.includes(update.objectId))
    state.objectIds.push(update.objectId)
  if (update.citationKey && !state.citationKeys.includes(update.citationKey)) {
    state.citationKeys.push(update.citationKey)
  }
  const qualified =
    !state.sent &&
    (state.objectIds.length >= 3 || (state.objectIds.length >= 2 && state.citationKeys.length >= 1))
  if (qualified) state.sent = true
  return { state, qualified }
}

export function normalizeSearchTerm(value: string): string {
  return value.trim().replace(/\s+/g, " ")
}

export function searchTermContainsPotentialPii(value: string): boolean {
  const term = normalizeSearchTerm(value)
  if (!term) return false
  if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(term)) return true
  if (/(?:https?:\/\/|www\.)\S+/i.test(term)) return true
  if (/\b(?:password|passwd|token|secret|api[_ -]?key|auth(?:orization)?)\s*[:=]/i.test(term)) {
    return true
  }
  if (
    /\b(?:account|user|client|customer)[_ -]?(?:id|number)\s*[:=#]?\s*[A-Z0-9-]{4,}\b/i.test(term)
  ) {
    return true
  }
  const phoneDigits = term.replace(/[^0-9]/g, "")
  return phoneDigits.length >= 7 && /(?:\+?\d[\d ().-]{5,}\d)/.test(term)
}

export function analyticsDedupeKey(parts: Array<string | number | boolean | undefined>): string {
  return parts
    .map((part) =>
      String(part ?? "")
        .trim()
        .toLowerCase(),
    )
    .join("|")
}
