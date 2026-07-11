type AnalyticsParams = Record<string, string | number | boolean>

type AnalyticsRuntime = {
  track: (name: string, params?: AnalyticsParams) => void
  pageView: () => void
}

type AnalyticsWindow = Window & {
  liAnalytics?: AnalyticsRuntime
  dataLayer?: unknown[][]
}

const analyticsWindow = window as AnalyticsWindow

const TAG_ID = "__LI_GA4_TAG_ID__"
const DISABLED_KEY = "li.analytics.disabled"
const EXPLORATION_KEY = "li.analytics.exploration"
const PRODUCTION_HOSTS = new Set(["lietuvosistorija.eu", "www.lietuvosistorija.eu"])

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

function contentType(pathname = location.pathname): string {
  const parts = pathname.split("/").filter(Boolean)
  if (parts[0] !== "objektai") return parts[0] || "home"
  return parts[1] || "objects"
}

function interactionContext(surface: string): AnalyticsParams {
  return {
    content_type: contentType(),
    site_language: siteLanguage(),
    interaction_surface: surface,
  }
}

function readExploration(): { paths: string[]; interacted: boolean; sent: boolean } {
  try {
    const value = JSON.parse(sessionStorage.getItem(EXPLORATION_KEY) || "{}")
    return {
      paths: Array.isArray(value.paths)
        ? value.paths.filter((item: unknown) => typeof item === "string")
        : [],
      interacted: value.interacted === true,
      sent: value.sent === true,
    }
  } catch {
    return { paths: [], interacted: false, sent: false }
  }
}

function writeExploration(value: { paths: string[]; interacted: boolean; sent: boolean }) {
  try {
    sessionStorage.setItem(EXPLORATION_KEY, JSON.stringify(value))
  } catch {
    // Analytics must never interfere with site behavior.
  }
}

function markExploration(track: AnalyticsRuntime["track"], interacted = false) {
  const state = readExploration()
  if (location.pathname.startsWith("/objektai/") && !state.paths.includes(location.pathname)) {
    state.paths.push(location.pathname)
  }
  state.interacted ||= interacted
  if (!state.sent && state.paths.length >= 3 && state.interacted) {
    state.sent = true
    track("deep_exploration", {
      ...interactionContext("session"),
      object_pages: state.paths.length,
    })
  }
  writeExploration(state)
}

function queryFingerprint(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0
  }
  return hash
}

function installAnalytics() {
  if (analyticsWindow.liAnalytics || !analyticsEnabled()) return

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || []
  const gtag = (...args: unknown[]) => analyticsWindow.dataLayer!.push(args)
  let previousLocation = ""
  let lastPageLocation = ""

  const track: AnalyticsRuntime["track"] = (name, params = {}) => {
    gtag("event", name, params)
  }

  const pageView = () => {
    const pageLocation = location.href.split("#")[0]
    if (pageLocation === lastPageLocation) return
    const params: AnalyticsParams = {
      page_title: document.title,
      page_location: pageLocation,
      ...interactionContext("page"),
    }
    if (previousLocation) params.page_referrer = previousLocation
    track("page_view", params)
    if (location.pathname.startsWith("/objektai/")) {
      track("object_view", interactionContext("page"))
    }
    previousLocation = pageLocation
    lastPageLocation = pageLocation
    markExploration(track)
  }

  analyticsWindow.liAnalytics = { track, pageView }
  gtag("js", new Date())
  gtag("config", TAG_ID, { send_page_view: false })
  pageView()
  document.addEventListener("nav", pageView)

  let searchTimer = 0
  let lastSearchSignature = ""
  document.addEventListener("input", (event) => {
    const input = (event.target as Element | null)?.closest<HTMLInputElement>(".search-bar")
    if (!input) return
    window.clearTimeout(searchTimer)
    const value = input.value.trim()
    if (value.length < 2) return
    searchTimer = window.setTimeout(() => {
      const resultCount = document.querySelectorAll(
        ".results-container .result-card:not(.no-match)",
      ).length
      const signature = `${location.pathname}:${queryFingerprint(value)}:${resultCount}`
      if (signature === lastSearchSignature) return
      lastSearchSignature = signature
      track("search", {
        ...interactionContext("search"),
        term_length: value.length,
        result_count: resultCount,
      })
    }, 700)
  })

  document.addEventListener("click", (event) => {
    const target = event.target as Element | null
    if (!target) return

    const result = target.closest<HTMLAnchorElement>(".results-container .result-card[href]")
    if (result) {
      const cards = [...document.querySelectorAll(".results-container .result-card[href]")]
      track("select_content", {
        ...interactionContext("search"),
        content_type: "search_result",
        result_rank: Math.max(1, cards.indexOf(result) + 1),
      })
      return
    }

    const citation = target.closest("[data-citation-entry], [data-claim-row] a, a[href^='#c-']")
    if (citation) {
      track("citation_open", interactionContext("evidence"))
      markExploration(track, true)
      return
    }

    const media = target.closest("[data-media-id], .media-gallery-card, [data-media-card]")
    if (media) {
      track("media_view", interactionContext("gallery"))
      markExploration(track, true)
      return
    }

    const graph = target.closest("[data-graph-explorer], .graph-explorer")
    if (graph) {
      track("graph_explore", interactionContext("graph"))
      markExploration(track, true)
    }
  })

  document.addEventListener("change", (event) => {
    const select = (event.target as Element | null)?.closest<HTMLSelectElement>(
      "[data-translate-language]",
    )
    if (!select) return
    track("language_change", {
      ...interactionContext("language"),
      selected_language: select.value.slice(0, 8),
    })
  })

  const script = document.createElement("script")
  script.src = `https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`
  script.async = true
  document.head.appendChild(script)
}

installAnalytics()
