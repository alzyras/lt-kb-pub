type SiteLanguage = "lt" | "en"

const TRANSLATE_STORAGE_KEY = "li-language"
const TRANSLATE_SCRIPT_ID = "google-translate-script"
const TRANSLATE_SCRIPT_URL =
  "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
const RETRY_DELAYS = [0, 100, 250, 500, 1000, 2000]

function translateRoot() {
  return document.querySelector<HTMLElement>("[data-google-translate]")
}

function preferredLanguage(): SiteLanguage {
  const urlLanguage = new URLSearchParams(window.location.search).get("lang")
  if (urlLanguage === "en") return "en"

  try {
    return localStorage.getItem(TRANSLATE_STORAGE_KEY) === "en" ? "en" : "lt"
  } catch {
    return "lt"
  }
}

function syncLanguageUrl(language: SiteLanguage) {
  const url = new URL(window.location.href)
  if (language === "en") {
    url.searchParams.set("lang", "en")
  } else {
    url.searchParams.delete("lang")
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (nextUrl !== currentUrl) {
    window.history.replaceState(window.history.state, "", nextUrl)
  }
}

function rememberLanguage(language: SiteLanguage) {
  try {
    localStorage.setItem(TRANSLATE_STORAGE_KEY, language)
  } catch {
    // Translation still works for this page when storage is unavailable.
  }
}

function setTranslationCookie(language: SiteLanguage) {
  if (language === "en") {
    document.cookie = "googtrans=/lt/en; path=/; SameSite=Lax"
    return
  }

  const expired = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
  document.cookie = expired
  if (window.location.hostname) {
    document.cookie = `${expired}; domain=${window.location.hostname}`
  }
}

function updateControls(language: SiteLanguage, unavailable = false) {
  const root = translateRoot()
  if (!root) return

  root.dataset.language = language
  root.classList.toggle("is-unavailable", unavailable)
  root.querySelectorAll<HTMLButtonElement>("[data-translate-language]").forEach((button) => {
    const active = button.dataset.translateLanguage === language
    button.classList.toggle("is-active", active)
    button.setAttribute("aria-pressed", active ? "true" : "false")
    button.disabled = unavailable && button.dataset.translateLanguage === "en"
  })

  const status = root.querySelector<HTMLElement>("[data-translate-status]")
  if (status) {
    status.textContent = unavailable
      ? "Vertimas šiuo metu nepasiekiamas"
      : language === "en"
        ? "Puslapis verčiamas į anglų kalbą"
        : "Puslapis rodomas lietuvių kalba"
  }
}

function widgetSelect() {
  return document.querySelector<HTMLSelectElement>(".goog-te-combo")
}

function applyLanguage(language: SiteLanguage, attempt = 0) {
  updateControls(language)
  document.documentElement.lang = language
  setTranslationCookie(language)
  syncLanguageUrl(language)

  const select = widgetSelect()
  if (select) {
    const targetValue = language === "en" ? "en" : ""
    if (select.value !== targetValue || language === "en") {
      select.value = targetValue
      select.dispatchEvent(new Event("change", { bubbles: true }))
    }
    return
  }

  const nextDelay = RETRY_DELAYS[attempt]
  if (nextDelay !== undefined) {
    window.setTimeout(() => applyLanguage(language, attempt + 1), nextDelay)
  }
}

function selectLanguage(language: SiteLanguage) {
  rememberLanguage(language)

  if (language === "lt" && widgetSelect()?.value === "en") {
    updateControls("lt")
    document.documentElement.lang = "lt"
    setTranslationCookie("lt")
    syncLanguageUrl("lt")
    window.location.reload()
    return
  }

  applyLanguage(language)
}

function initializeGoogleWidget() {
  const root = translateRoot()
  if (!root || root.dataset.widgetReady === "true") return

  const googleApi = (
    window as typeof window & {
      google?: {
        translate?: {
          TranslateElement?: new (
            options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
            elementId: string,
          ) => unknown
        }
      }
    }
  ).google
  const TranslateElement = googleApi?.translate?.TranslateElement
  if (!TranslateElement) return

  new TranslateElement(
    { pageLanguage: "lt", includedLanguages: "en", autoDisplay: false },
    "google_translate_element",
  )
  root.dataset.widgetReady = "true"
  applyLanguage(preferredLanguage())
}

function loadGoogleTranslate() {
  const callbackWindow = window as typeof window & {
    googleTranslateElementInit?: () => void
  }
  callbackWindow.googleTranslateElementInit = initializeGoogleWidget

  if (document.getElementById(TRANSLATE_SCRIPT_ID)) {
    initializeGoogleWidget()
    return
  }

  const script = document.createElement("script")
  script.id = TRANSLATE_SCRIPT_ID
  script.src = TRANSLATE_SCRIPT_URL
  script.async = true
  script.addEventListener("error", () => updateControls("lt", true))
  document.head.appendChild(script)
}

function setupGoogleTranslate() {
  const root = translateRoot()
  if (!root) return

  const language = preferredLanguage()
  updateControls(language)

  if (!document.documentElement.dataset.translateControlsBound) {
    document.documentElement.dataset.translateControlsBound = "true"
    document.addEventListener("click", (event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const button = target.closest<HTMLButtonElement>("[data-translate-language]")
      if (!button) return

      const selected = button.dataset.translateLanguage === "en" ? "en" : "lt"
      selectLanguage(selected)
    })
  }

  loadGoogleTranslate()
  applyLanguage(language)
}

document.addEventListener("DOMContentLoaded", setupGoogleTranslate)
document.addEventListener("nav", () => window.setTimeout(setupGoogleTranslate, 0))
