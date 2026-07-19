import {
  ANALYTICS_EVENT_NAMES,
  ANALYTICS_MAP_ACTIONS,
  ANALYTICS_SCHEMA_VERSION,
  AnalyticsEventName,
  AnalyticsParams,
  ExplorationState,
  advanceExploration,
  analyticsDedupeKey,
  createGtagCommandQueue,
  emptyExplorationState,
  normalizeSearchTerm,
  searchTermContainsPotentialPii,
} from "../../util/analytics"

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
const MAP_ACTION_ALLOWLIST = new Set<string>(ANALYTICS_MAP_ACTIONS)
const FEATURE_PARAM_ALLOWLIST = new Set([
  "feature_value",
  "media_action",
  "media_filter",
  "media_sort",
  "settings_area",
  "settings_action",
  "translation_language",
  "translation_status",
  "list_action",
  "filter_name",
  "filter_value",
  "result_count",
  "term_length",
])
const MAP_PARAM_ALLOWLIST = new Set([
  "map_view",
  "map_object_type",
  "map_relation_type",
  "map_filter_name",
  "map_filter_value",
  "map_panel_mode",
  "map_zoom_bucket",
  "result_count",
  "input_method",
])

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

function normalizeAnalyticsParams(
  params: AnalyticsParams | undefined,
  allowlist: Set<string>,
): AnalyticsParams {
  const normalized: AnalyticsParams = {}
  for (const [key, value] of Object.entries(params ?? {})) {
    if (!allowlist.has(key)) continue
    if (typeof value === "string") {
      const text = normalizeSearchTerm(value).slice(0, 64)
      if (!text || searchTermContainsPotentialPii(text)) continue
      normalized[key] = text
    } else if (typeof value === "number" || typeof value === "boolean") {
      normalized[key] = value
    }
  }
  return normalized
}

function safeFeatureValue(name: string, value: string | undefined): string | undefined {
  if (!value) return undefined
  if (name === "graph" || name === "popover_preview") return "object"
  const normalized = normalizeSearchTerm(value).slice(0, 64)
  return normalized && !searchTermContainsPotentialPii(normalized) ? normalized : undefined
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
  const featureTimers = new Map<string, number>()
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

  const trackMap = (
    action: string,
    params: AnalyticsParams = {},
    options: { dedupeScope?: DedupeScope; dedupeKey?: string } = {},
  ) => {
    if (!MAP_ACTION_ALLOWLIST.has(action)) return
    track(
      "map_interaction",
      {
        ...commonParams("map"),
        map_action: action,
        ...normalizeAnalyticsParams(params, MAP_PARAM_ALLOWLIST),
      },
      options,
    )
    if (action === "open" || action === "map_preview_open") {
      const mapView = params.map_view || (action === "map_preview_open" ? "preview" : "full")
      track(
        "map_open",
        {
          ...commonParams("map"),
          map_view: mapView,
        },
        {
          dedupeScope: options.dedupeScope ?? "page",
          dedupeKey:
            options.dedupeKey ?? analyticsDedupeKey([pageMetadata().content_id, "map", mapView]),
        },
      )
    }
  }

  const trackFeature = (
    name: string,
    action: string,
    params: AnalyticsParams = {},
    options: { dedupeScope?: DedupeScope; dedupeKey?: string } = {},
    value?: string,
  ) => {
    const featureValue = safeFeatureValue(name, value)
    const normalizedParams = normalizeAnalyticsParams(params, FEATURE_PARAM_ALLOWLIST)
    const dedupeKey =
      options.dedupeKey ??
      analyticsDedupeKey([pageMetadata().content_id, name, action, featureValue])
    track(
      "feature_use",
      {
        ...commonParams(name),
        feature_name: name,
        feature_action: action,
        ...(featureValue ? { feature_value: featureValue } : {}),
        ...normalizedParams,
      },
      { dedupeScope: options.dedupeScope ?? "page", dedupeKey },
    )
  }

  const scheduleFeature = (key: string, callback: () => void, delay = 750) => {
    const previous = featureTimers.get(key)
    if (previous) window.clearTimeout(previous)
    featureTimers.set(
      key,
      window.setTimeout(() => {
        featureTimers.delete(key)
        callback()
      }, delay),
    )
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
    const detail = (
      event as CustomEvent<{
        name?: string
        action?: string
        value?: string
        params?: AnalyticsParams
        dedupeScope?: DedupeScope
        dedupeKey?: string
      }>
    ).detail
    if (!detail?.name || !detail.action) return
    if (detail.name === "media_gallery" && detail.action === "open") {
      track(
        "gallery_open",
        { ...commonParams("gallery"), media_action: "open" },
        {
          dedupeScope: detail.dedupeScope ?? "page",
          dedupeKey:
            detail.dedupeKey ?? analyticsDedupeKey([pageMetadata().content_id, "gallery"]),
        },
      )
    }
    trackFeature(
      detail.name,
      detail.action,
      detail.params,
      { dedupeScope: detail.dedupeScope, dedupeKey: detail.dedupeKey },
      detail.value,
    )
  })

  document.addEventListener("analyticsmap", (event) => {
    const detail = (
      event as CustomEvent<{
        action?: string
        params?: AnalyticsParams
        dedupeScope?: DedupeScope
        dedupeKey?: string
      }>
    ).detail
    if (!detail?.action) return
    trackMap(detail.action, detail.params, {
      dedupeScope: detail.dedupeScope,
      dedupeKey: detail.dedupeKey,
    })
  })

  document.addEventListener("input", (event) => {
    const input = (event.target as Element | null)?.closest<HTMLInputElement>(
      "[data-media-search], [data-object-list-query], [data-collection-search-input]",
    )
    if (!input) return
    const feature = input.matches("[data-media-search]")
      ? "media_gallery"
      : input.matches("[data-object-list-query]")
        ? "object_list"
        : "home_collection"
    const action = feature === "media_gallery" ? "search" : "search"
    scheduleFeature(`${feature}|search`, () => {
      const normalized = normalizeSearchTerm(input.value)
      if (normalized.length < 2) return
      trackFeature(feature, action, { term_length: normalized.length }, {}, normalized)
    })
  })

  document.addEventListener("change", (event) => {
    const target = event.target as Element | null
    if (!target) return
    const control = target.closest<HTMLInputElement | HTMLSelectElement>("input, select")
    if (!control) return

    const translate = control.closest("[data-google-translate]")
    if (translate && control.matches("[data-translate-language]")) {
      trackFeature("translation", "language_change", {
        translation_language: control.value || "lt",
      })
      return
    }

    const settings = control.closest("[data-settings-page]")
    if (settings) {
      const settingsArea =
        control.dataset.settingsChannel ||
        control.dataset.settingsRuleScope ||
        control.dataset.settingsTab ||
        (control.matches("[data-settings-person-parentheticals]")
          ? "person_parentheticals"
          : control.matches("[data-settings-advanced-evidence]")
            ? "advanced_evidence"
            : control.dataset.settingsMinClaimsRange !== undefined ||
                control.dataset.settingsMinClaimsNumber !== undefined
              ? "minimum_claims"
              : "display")
      trackFeature("settings", "change", {
        settings_area: settingsArea,
        settings_action:
          control instanceof HTMLInputElement ? (control.checked ? "enable" : "disable") : "set",
      })
      return
    }

    const options = control.closest("[data-options-root]")
    if (options) {
      const settingsArea = control.matches(
        "[data-options-quote-range], [data-options-quote-number]",
      )
        ? "minimum_quotes"
        : control.matches("[data-options-person-parentheticals]")
          ? "person_parentheticals"
          : "source_filter"
      trackFeature("options_panel", "change", { settings_area: settingsArea })
      return
    }

    const media = control.closest("[data-media-gallery]")
    if (media) {
      if (control.matches("[data-facet-input]")) {
        trackFeature("media_gallery", "filter_change", {
          media_action: "filter_change",
          media_filter: control.getAttribute("data-facet-input") || "facet",
        })
      } else if (control.matches("[data-media-sort]")) {
        trackFeature("media_gallery", "sort_change", {
          media_action: "sort_change",
          media_sort: control.value,
        })
      }
      return
    }

    const list = control.closest('[data-object-list-controls="true"]')
    if (list) {
      if (control.matches("[data-object-list-sort]")) {
        trackFeature("object_list", "sort_change", { list_action: control.value })
      } else if (control.matches("[data-object-list-tag-select]")) {
        trackFeature("object_list", "tag_add", { list_action: "tag" })
      }
    }
  })

  document.addEventListener("click", (event) => {
    const target = event.target as Element | null
    if (!target) return
    const button = target.closest<HTMLElement>("button, [role='tab'], a")
    if (!button) return

    if (button.matches("[data-options-toggle]")) trackFeature("options_panel", "open")
    else if (button.matches("[data-options-close]")) trackFeature("options_panel", "close")
    else if (button.matches("[data-options-reset]")) trackFeature("options_panel", "reset")
    else if (button.matches("[data-options-research]"))
      trackFeature("options_panel", "research_mode")
    else if (button.matches("[data-settings-tab]")) {
      trackFeature("settings", "tab_change", {
        settings_area: button.dataset.settingsTab || "unknown",
      })
    } else if (button.matches("[data-settings-select-all]")) {
      trackFeature("settings", "select_all", {
        settings_area: button.dataset.settingsSelectAll || "unknown",
      })
    } else if (button.matches("[data-settings-select-none]")) {
      trackFeature("settings", "select_none", {
        settings_area: button.dataset.settingsSelectNone || "unknown",
      })
    } else if (button.matches("[data-settings-reset]")) trackFeature("settings", "reset")
    else if (button.matches("[data-media-filter-open]"))
      trackFeature("media_gallery", "filters_open")
    else if (button.matches("[data-media-filter-close]"))
      trackFeature("media_gallery", "filters_close")
    else if (button.matches("[data-media-reset]")) trackFeature("media_gallery", "reset")
    else if (button.matches("[data-media-search-clear]"))
      trackFeature("media_gallery", "search_clear")
    else if (button.matches("[data-facet-expand]")) trackFeature("media_gallery", "facet_expand")
    else if (button.matches("[data-remove-facet]")) trackFeature("media_gallery", "filter_remove")
    else if (button.matches("[data-media-retry]")) trackFeature("media_gallery", "retry")
    else if (button.matches("[data-object-list-reset]")) trackFeature("object_list", "reset")
    else if (button.matches("[data-object-list-tag-pill]"))
      trackFeature("object_list", "tag_remove")
    else if (button.matches("[data-object-list-pagination] a"))
      trackFeature("object_list", "page_change")
    else if (button.matches(".folder-button, .folder-icon"))
      trackFeature("explorer", "folder_toggle")
    else if (button.matches(".toc .toc-header, .toc > summary")) trackFeature("toc", "toggle")
    else if (button.matches("[data-collection-browse-tab]")) {
      trackFeature("home_collection", "tab_change", {
        feature_value: button.dataset.collectionBrowseTab || "unknown",
      })
    } else if (button.matches(".collection-spotlight-dot"))
      trackFeature("home_collection", "claim_change")
    else if (button.matches("[data-collection-search-trigger]"))
      trackFeature("home_collection", "search_open")
    else if (button.matches("[data-collection-search-result]"))
      trackFeature("home_collection", "result_select")
    else if (button.matches(".settings-source-link")) trackFeature("settings", "source_open")
    else if (button.matches(".pswp__media-links a")) {
      const action = /licenc/i.test(button.textContent || "") ? "license_open" : "original_open"
      trackFeature("media_gallery", action, { media_action: action })
    }
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
    if (url.pathname.endsWith("/index.xml") || url.pathname.endsWith(".rss")) {
      track(
        "rss_click",
        { ...commonParams("rss"), destination_type: "rss" },
        {
          dedupeScope: "page",
          dedupeKey: analyticsDedupeKey([pageMetadata().content_id, "rss"]),
        },
      )
    }
    if (url.origin !== location.origin) {
      if (link.dataset.analyticsResource === "true") {
        track("outbound_source_click", {
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
      const mapView = link.closest("[data-object-map-cta]")
        ? "preview"
        : link.closest("[data-graph-explorer], .graph-explorer")
          ? "full"
          : "local"
      trackMap(mapView === "preview" ? "map_preview_open" : "open", { map_view: mapView })
    }
  })

  document.addEventListener("submit", (event) => {
    const form = (event.target as Element | null)?.closest<HTMLFormElement>(
      "form[data-newsletter-signup], form[data-analytics-newsletter], form[action*='subscribe']",
    )
    if (!form) return
    track(
      "newsletter_signup",
      {
        ...commonParams("newsletter"),
        destination_type: form.dataset.newsletterProvider || "newsletter",
      },
      {
        dedupeScope: "session",
        dedupeKey: analyticsDedupeKey([pageMetadata().content_id, "newsletter_signup"]),
      },
    )
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
          : details.closest(".media-viewer-advanced")
            ? "media_gallery"
            : details.closest(".settings-series, .settings-kind")
              ? "settings"
              : ""
      if (!name) return
      const action =
        name === "media_gallery"
          ? "advanced_data_open"
          : name === "settings"
            ? "group_open"
            : "expand"
      document.dispatchEvent(new CustomEvent("analyticsfeature", { detail: { name, action } }))
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
