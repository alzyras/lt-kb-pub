import {
  isSiteLanguage,
  localizedUrl,
  resolvePreferredLanguage,
  type SiteLanguage,
} from "./google-translate-state"

const LANGUAGE_NAMES: Record<SiteLanguage, string> = {
  lt: "lietuvių",
  en: "anglų",
  pl: "lenkų",
  lv: "latvių",
  et: "estų",
  be: "baltarusių",
  ru: "rusų",
  uk: "ukrainiečių",
  de: "vokiečių",
  yi: "jidiš",
  he: "hebrajų",
}

const TRANSLATE_STORAGE_KEY = "li-language"
const TRANSLATE_SCRIPT_ID = "google-translate-script"
const TRANSLATE_SCRIPT_URL =
  "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
const RETRY_DELAYS = [0, 100, 250, 500, 1000, 2000]
let activeApplyRequest = 0
let activeLanguage: SiteLanguage = "lt"

function translateRoot() {
  return document.querySelector<HTMLElement>("[data-google-translate]")
}

function widgetLanguage(language: SiteLanguage): string {
  return language === "he" ? "iw" : language
}

function storedLanguage(): string | null {
  try {
    return localStorage.getItem(TRANSLATE_STORAGE_KEY)
  } catch {
    return null
  }
}

function preferredLanguage() {
  return resolvePreferredLanguage(window.location.search, storedLanguage())
}

function syncLanguageUrl(language: SiteLanguage) {
  const nextUrl = localizedUrl(window.location.href, language)
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
  const domainCookie =
    window.location.hostname === "lietuvosistorija.eu" ||
    window.location.hostname.endsWith(".lietuvosistorija.eu")

  if (language !== "lt") {
    const cookie = `googtrans=/lt/${widgetLanguage(language)}; path=/; SameSite=Lax`
    document.cookie = cookie
    if (domainCookie) document.cookie = `${cookie}; domain=.lietuvosistorija.eu`
    return
  }

  const expired = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
  document.cookie = expired
  if (domainCookie) document.cookie = `${expired}; domain=.lietuvosistorija.eu`
}

function updateControls(language: SiteLanguage, unavailable = false) {
  const root = translateRoot()
  if (!root) return

  root.dataset.language = language
  root.classList.toggle("is-unavailable", unavailable)
  const control = root.querySelector<HTMLSelectElement>("[data-translate-language]")
  if (control) {
    control.value = language
    control.disabled = unavailable
  }

  const status = root.querySelector<HTMLElement>("[data-translate-status]")
  if (status) {
    status.textContent = unavailable
      ? "Vertimas šiuo metu nepasiekiamas"
      : language !== "lt"
        ? `Puslapis verčiamas į ${LANGUAGE_NAMES[language]} kalbą`
        : "Puslapis rodomas lietuvių kalba"
  }
}

function widgetSelect() {
  return document.querySelector<HTMLSelectElement>(".goog-te-combo")
}

function applyLanguage(language: SiteLanguage, attempt = 0, request = activeApplyRequest) {
  if (request !== activeApplyRequest) return

  updateControls(language)
  document.documentElement.lang = language
  setTranslationCookie(language)
  syncLanguageUrl(language)

  const select = widgetSelect()
  if (select) {
    const targetValue = language === "lt" ? "" : widgetLanguage(language)
    if (select.value !== targetValue || language !== "lt") {
      select.value = targetValue
      select.dispatchEvent(new Event("change", { bubbles: true }))
    }
    return
  }

  const nextDelay = RETRY_DELAYS[attempt]
  if (nextDelay !== undefined) {
    window.setTimeout(() => applyLanguage(language, attempt + 1, request), nextDelay)
  }
}

function requestLanguage(language: SiteLanguage) {
  activeLanguage = language
  activeApplyRequest += 1
  applyLanguage(language, 0, activeApplyRequest)
}

function selectLanguage(language: SiteLanguage) {
  rememberLanguage(language)

  if (language === "lt" && widgetSelect()?.value) {
    updateControls("lt")
    document.documentElement.lang = "lt"
    setTranslationCookie("lt")
    syncLanguageUrl("lt")
    window.location.reload()
    return
  }

  requestLanguage(language)
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
    {
      pageLanguage: "lt",
      includedLanguages: "en,pl,lv,et,be,ru,uk,de,yi,iw",
      autoDisplay: false,
    },
    "google_translate_element",
  )
  root.dataset.widgetReady = "true"
  requestLanguage(activeLanguage)
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

  const preference = preferredLanguage()
  const language = preference.language
  if (preference.fromUrl) rememberLanguage(language)
  updateControls(language)

  if (!document.documentElement.dataset.translateControlsBound) {
    document.documentElement.dataset.translateControlsBound = "true"
    document.addEventListener("change", (event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const control = target.closest<HTMLSelectElement>("[data-translate-language]")
      if (!control || !isSiteLanguage(control.value)) return

      selectLanguage(control.value)
    })
  }

  loadGoogleTranslate()
  requestLanguage(language)
}

document.addEventListener("DOMContentLoaded", setupGoogleTranslate)
document.addEventListener("nav", () => window.setTimeout(setupGoogleTranslate, 0))
