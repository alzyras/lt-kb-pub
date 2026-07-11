export const SITE_LANGUAGES = [
  "lt",
  "en",
  "pl",
  "lv",
  "et",
  "be",
  "ru",
  "uk",
  "de",
  "yi",
  "he",
] as const

export type SiteLanguage = (typeof SITE_LANGUAGES)[number]

export function isSiteLanguage(language: string | null): language is SiteLanguage {
  return SITE_LANGUAGES.includes(language as SiteLanguage)
}

export function resolvePreferredLanguage(search: string, storedLanguage: string | null) {
  const urlLanguage = new URLSearchParams(search).get("lang")
  if (isSiteLanguage(urlLanguage)) {
    return { language: urlLanguage, fromUrl: true }
  }

  return {
    language: isSiteLanguage(storedLanguage) ? storedLanguage : "lt",
    fromUrl: false,
  } satisfies { language: SiteLanguage; fromUrl: boolean }
}

export function localizedUrl(href: string, language: SiteLanguage): string {
  const url = new URL(href)
  if (language === "lt") {
    url.searchParams.delete("lang")
  } else {
    url.searchParams.set("lang", language)
  }

  return `${url.pathname}${url.search}${url.hash}`
}
