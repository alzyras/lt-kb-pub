import {
  ANALYTICS_EVENT_NAMES,
  ANALYTICS_SCHEMA_VERSION,
  AnalyticsEventName,
  ExplorationState,
  advanceExploration,
  analyticsDedupeKey,
  createGtagCommandQueue,
  emptyExplorationState,
  normalizeSearchTerm,
  searchTermContainsPotentialPii,
} from "../../util/analytics"

type AnalyticsParams = Record<string, string | number | boolean>
type DedupeScope = "none" | "page" | "session"

type AnalyticsRuntime = {
  track: (
    name: AnalyticsEventName,
    params?: AnalyticsParams,
    options?: { dedupeScope?: DedupeScope; dedupeKey?: string },
  ) => void
  pageView: () => void
}

type AnalyticsWindow = Window & {
  liAnalytics?: AnalyticsRuntime
  dataLayer?: unknown[]
}

const analyticsWindow = window as AnalyticsWindow
const TAG_ID = "__LI_GA4_TAG_ID__"
const DISABLED_KEY = "li.analytics.disabled"
const EXPLORATION_KEY = `li.analytics.exploration.${ANALYTICS_SCHEMA_VERSION}`
const SESSION_DEDUPE_KEY = `li.analytics.dedupe.${ANALYTICS_SCHEMA_VERSION}`
const PRODUCTION_HOSTS = new Set(["lietuvosistorija.eu", "www.lietuvosistorija.eu"])
const EVENT_ALLOWLIST = new Set<string>(ANALYTICS_EVENT_NAMES)

function analyticsEnabled(): boolean {
  if (!PRODUCTION_HOSTS.has(location.hostname) || navigator.webdriver) return false
  try {
    return localStorage.getItem(DISABLED_KEY) !== "1"
  } catch {
    return true
  }
}

function siteLanguage(): string {
  const language = new URLSearchParams(location.search).get("lang") || document.documentElement.lang
  return (language || "lt").toLowerCase().slice(0, 8)
}

function pageMetadata() {
  return {
    content_id: document.body.dataset.contentId || "index",
    content_type: document.body.dataset.contentType || "none",
    page_type: document.body.dataset.pageType || "folder",
  }
}

function commonParams(interactionContext: string): AnalyticsParams {
  return {
    tracking_schema_version: ANALYTICS_SCHEMA_VERSION,
    ...pageMetadata(),
    interaction_context: interactionContext,
    site_language: siteLanguage(),
  }
}

function readStringSet(key: string): Set<string> {
  try {
    const value = JSON.parse(sessionStorage.getItem(key) || "[]")
    return new Set(Array.isArray(value) ? value.filter((item) => typeof item === "string") : [])
  } catch {
    return new Set()
  }
}

function writeStringSet(key: string, values: Set<string>) {
  try {
    sessionStorage.setItem(key, JSON.stringify([...values].slice(-1000)))
  } catch {
    // Analytics storage must never affect navigation.
  }
}

function readExploration(): ExplorationState {
  try {
    const value = JSON.parse(sessionStorage.getItem(EXPLORATION_KEY) || "{}")
    return {
      objectIds: Array.isArray(value.objectIds)
        ? value.objectIds.filter((item: unknown) => typeof item === "string")
        : [],
      citationKeys: Array.isArray(value.citationKeys)
        ? value.citationKeys.filter((item: unknown) => typeof item === "string")
        : [],
      sent: value.sent === true,
    }
  } catch {
    return emptyExplorationState()
  }
}

function writeExploration(value: ExplorationState) {
  try {
    sessionStorage.setItem(EXPLORATION_KEY, JSON.stringify(value))
  } catch {
    // Analytics storage must never affect navigation.
  }
}

function destinationType(href: string): string {
  try {
    const url = new URL(href, location.href)
    const parts = url.pathname.split("/").filter(Boolean)
    if (parts[0] === "objektai") return parts[1] || "objects"
    if (parts[0] === "tags") return "tag"
    if (parts[0] === "laikotarpiai") return "period"
    if (parts[0] === "tyrimai") return "research"
    return parts[0] || "home"
  } catch {
    return "unknown"
  }
}

function navigationMethod(link: HTMLAnchorElement): string {
  if (link.closest(".breadcrumb-container, [aria-label='breadcrumbs']")) return "breadcrumb"
  if (link.closest(".tags")) return "tag"
  if (link.closest(".explorer")) return "explorer"
  if (link.closest(".backlinks")) return "backlink"
  if (link.closest(".recent-notes")) return "recent"
  if (link.closest(".toc, .toc-content")) return "toc"
  if (link.closest("[data-graph-explorer], .graph-explorer, [data-object-map-cta]")) return "graph"
  if (link.closest("li.section-li, .section-ul")) return "list"
  return "article"
}

function installAnalytics() {
  if (analyticsWindow.liAnalytics || !analyticsEnabled()) return

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || []
  const gtag = createGtagCommandQueue(analyticsWindow.dataLayer)
  const sessionKeys = readStringSet(SESSION_DEDUPE_KEY)
  let pageKeys = new Set<string>()
  let lastPageLocation = ""
  let previousLocation = ""
  let searchTimer = 0
  let lastSearch = { query: "", outcome: "", resultCount: 0, followedZero: false }
  let popoverTimer = 0

  const track: AnalyticsRuntime["track"] = (name, params = {}, options = {}) => {
    if (!EVENT_ALLOWLIST.has(name)) return
    const scope = options.dedupeScope ?? "none"
    const key = options.dedupeKey ? `${name}|${options.dedupeKey}` : ""
    if (key && scope === "page" && pageKeys.has(key)) return
    if (key && scope === "session" && sessionKeys.has(key)) return
    if (key && scope === "page") pageKeys.add(key)
    if (key && scope === "session") {
      sessionKeys.add(key)
      writeStringSet(SESSION_DEDUPE_KEY, sessionKeys)
    }
    gtag("event", name, params)
  }

  const updateExploration = (update: { objectId?: string; citationKey?: string }) => {
    const result = advanceExploration(readExploration(), update)
    writeExploration(result.state)
    if (!result.qualified) return
    track(
      "deep_exploration",
      {
        ...commonParams("session"),
        object_count: result.state.objectIds.length,
        citation_count: result.state.citationKeys.length,
      },
      { dedupeScope: "session", dedupeKey: "qualified" },
    )
  }

  const pageView = () => {
    const pageLocation = location.href.split("#")[0]
    if (pageLocation === lastPageLocation) return
    pageKeys = new Set()
    const params: AnalyticsParams = {
      page_title: document.title,
      page_location: pageLocation,
      ...commonParams("page"),
    }
    if (previousLocation) params.page_referrer = previousLocation
    track("page_view", params)
    const metadata = pageMetadata()
    if (metadata.page_type === "object") {
      track("object_view", { ...commonParams("page") })
      updateExploration({ objectId: metadata.content_id })
    }
    previousLocation = pageLocation
    lastPageLocation = pageLocation
  }

  const trackCitation = (citationKey: string, params: AnalyticsParams) => {
    const origin = pageMetadata().content_id
    const dedupeKey = analyticsDedupeKey([origin, citationKey])
    track(
      "citation_open",
      { ...commonParams("evidence"), ...params },
      { dedupeScope: "session", dedupeKey },
    )
    updateExploration({ citationKey: dedupeKey })
  }

  analyticsWindow.liAnalytics = { track, pageView }
  gtag("js", new Date())
  gtag("config", TAG_ID, { send_page_view: false })
  pageView()
  document.addEventListener("nav", pageView)

  document.addEventListener("input", (event) => {
    const input = (event.target as Element | null)?.closest<HTMLInputElement>(".search-bar")
    if (!input) return
    window.clearTimeout(searchTimer)
    const query = normalizeSearchTerm(input.value)
    if (query.length < 2) return
    searchTimer = window.setTimeout(() => {
      const resultCount = document.querySelectorAll(
        ".results-container a.result-card:not(.no-match)",
      ).length
      const outcome = resultCount > 0 ? "results" : "zero_results"
      const followedZero = lastSearch.outcome === "zero_results" && lastSearch.query !== query
      const signature = analyticsDedupeKey([pageMetadata().content_id, query, outcome])
      const params: AnalyticsParams = {
        ...commonParams("search"),
        search_outcome: outcome,
        result_count: resultCount,
        term_length: query.length,
      }
      if (!searchTermContainsPotentialPii(query)) params.search_term = query.slice(0, 100)
      track("search", params, { dedupeScope: "page", dedupeKey: signature })
      lastSearch = { query, outcome, resultCount, followedZero }
    }, 750)
  })

  document.addEventListener("citationopen", (event) => {
    const detail = (event as CustomEvent<{ citationKey?: string; sourceKind?: string }>).detail
    if (!detail?.citationKey) return
    trackCitation(detail.citationKey, {
      source_kind: detail.sourceKind || "embedded_evidence",
      destination_type: "evidence_detail",
    })
  })

  document.addEventListener("analyticsfeature", (event) => {
    const detail = (event as CustomEvent<{ name?: string; action?: string; value?: string }>).detail
    if (!detail?.name || !detail.action) return
    const dedupeKey = analyticsDedupeKey([
      pageMetadata().content_id,
      detail.name,
      detail.action,
      detail.value,
    ])
    track(
      "feature_use",
      {
        ...commonParams(detail.name),
        feature_name: detail.name,
        feature_action: detail.action,
        ...(detail.value ? { feature_value: detail.value.slice(0, 100) } : {}),
      },
      { dedupeScope: "page", dedupeKey },
    )
  })

  document.addEventListener("themechange", (event) => {
    const theme = (event as CustomEvent<{ theme: string }>).detail?.theme || "unknown"
    document.dispatchEvent(
      new CustomEvent("analyticsfeature", {
        detail: { name: "dark_mode", action: theme === "dark" ? "enable" : "disable" },
      }),
    )
  })
  document.addEventListener("readermodechange", (event) => {
    const mode = (event as CustomEvent<{ mode: string }>).detail?.mode || "off"
    document.dispatchEvent(
      new CustomEvent("analyticsfeature", {
        detail: { name: "reader_mode", action: mode === "on" ? "enable" : "disable" },
      }),
    )
  })

  document.addEventListener("click", (event) => {
    const target = event.target as Element | null
    if (!target) return

    const diagramExpand = target.closest<HTMLElement>(".expand-button")
    const diagramContainer = diagramExpand?.closest("pre, .mermaid, [data-diagram]")
    if (
      diagramContainer &&
      (diagramContainer.matches(".mermaid, [data-diagram]") ||
        diagramContainer.querySelector("code.mermaid"))
    ) {
      document.dispatchEvent(
        new CustomEvent("analyticsfeature", {
          detail: { name: "diagram", action: "expand" },
        }),
      )
    }

    const result = target.closest<HTMLAnchorElement>(".results-container a.result-card[href]")
    if (result) {
      const cards = [...document.querySelectorAll(".results-container a.result-card[href]")]
      track("search_result_select", {
        ...commonParams("search"),
        destination_type: destinationType(result.href),
        result_position: Math.max(1, cards.indexOf(result) + 1),
        followed_zero_result_reformulation: lastSearch.followedZero,
      })
      return
    }

    const evidence = target.closest<HTMLAnchorElement>(
      "a[data-analytics-evidence='true'], .claim-citation-card a.external",
    )
    if (evidence) {
      trackCitation(evidence.href || evidence.hash, {
        source_kind:
          evidence.dataset.sourceKind ||
          (evidence.classList.contains("external") ? "external_evidence" : "internal_source"),
        destination_type: evidence.dataset.destinationType || destinationType(evidence.href),
      })
      return
    }

    const link = target.closest<HTMLAnchorElement>("a[href]")
    if (!link) return
    const url = new URL(link.href, location.href)
    if (url.origin !== location.origin) {
      if (link.dataset.analyticsResource === "true") {
        track("outbound_source_open", {
          ...commonParams("outbound"),
          destination_domain: url.hostname.toLowerCase().slice(0, 100),
        })
      }
      return
    }

    const method = navigationMethod(link)
    track(
      "knowledge_navigation",
      {
        ...commonParams(method),
        navigation_method: method,
        destination_type: destinationType(link.href),
      },
      {
        dedupeScope: "page",
        dedupeKey: analyticsDedupeKey([
          pageMetadata().content_id,
          url.pathname,
          url.search,
          url.hash,
        ]),
      },
    )
    if (method === "graph") {
      document.dispatchEvent(
        new CustomEvent("analyticsfeature", {
          detail: { name: "graph", action: "open" },
        }),
      )
    }
  })

  document.addEventListener(
    "toggle",
    (event) => {
      const details = event.target instanceof HTMLDetailsElement ? event.target : null
      if (!details?.open) return
      const name = details.closest(".callout")
        ? "callout"
        : details.closest(".mermaid, [data-diagram]")
          ? "diagram"
          : ""
      if (!name) return
      document.dispatchEvent(
        new CustomEvent("analyticsfeature", { detail: { name, action: "expand" } }),
      )
    },
    true,
  )

  document.addEventListener("pointerover", (event) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a.internal")
    if (!link || link.dataset.noPopover === "true") return
    window.clearTimeout(popoverTimer)
    popoverTimer = window.setTimeout(() => {
      const active = document.querySelector(".popover.active-popover")
      if (!active || !link.matches(":hover")) return
      document.dispatchEvent(
        new CustomEvent("analyticsfeature", {
          detail: { name: "popover_preview", action: "view", value: link.dataset.slug || "" },
        }),
      )
    }, 1000)
  })

  const script = document.createElement("script")
  script.src = `https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`
  script.async = true
  document.head.appendChild(script)
}

installAnalytics()
