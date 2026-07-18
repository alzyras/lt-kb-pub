import { FullSlug } from "./path"

const PLACEHOLDER = /^(?:santrauka|aprašymas|description)\s*(?:[-:–—]\s*)?(?:nenurodyta|nepateikta|nėra|nežinoma|unknown)?\.?$/i
const POOR_DESCRIPTION = /\b(?:santrauka|aprašymas)\s+(?:nenurodyta|nepateikta|nėra)\b/i

export type SeoInput = {
  slug?: string
  title?: unknown
  description?: unknown
  text?: unknown
  itemType?: unknown
  noindex?: unknown
}

export function seoText(value: unknown): string {
  return String(value ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function itemTypeLabel(value: unknown): string {
  const type = seoText(value).toLocaleLowerCase("lt")
  return (
    {
      asmuo: "asmuo",
      vieta: "vieta",
      ivykis: "istorinis įvykis",
      grupė: "istorinė grupė",
      grupe: "istorinė grupė",
      daiktas: "istorinis objektas",
      saltinis: "istorinis šaltinis",
      šaltinis: "istorinis šaltinis",
      savoka: "istorinė sąvoka",
      sąvoka: "istorinė sąvoka",
    }[type] ?? "Lietuvos istorijos įrašas"
  )
}

function trimAtWord(value: string, limit: number): string {
  if (value.length <= limit) return value
  const segment = value.slice(0, Math.max(1, limit - 1))
  const boundary = segment.lastIndexOf(" ")
  return `${(boundary > Math.floor(limit * 0.55) ? segment.slice(0, boundary) : segment).trim()}…`
}

export function seoDescription(input: SeoInput, maxLength = 158): string {
  const title = seoText(input.title) || "Lietuvos istorija"
  const raw = seoText(input.description) || seoText(input.text)
  const fallback = `${title} – ${itemTypeLabel(input.itemType)} Lietuvos istorijos žinyno įrašas su šaltiniais ir kontekstu.`
  if (!raw || PLACEHOLDER.test(raw) || POOR_DESCRIPTION.test(raw)) return trimAtWord(fallback, maxLength)

  const firstSentence = raw.match(/^(.{45,}?[.!?])(?:\s|$)/)?.[1] ?? raw
  const description = trimAtWord(firstSentence, maxLength)
  return description.length >= 50 ? description : trimAtWord(`${description} ${fallback}`, maxLength)
}

export function seoTitle(
  input: SeoInput,
  siteTitle: string,
  suffix: string,
  maxLength = 60,
): string {
  const base = seoText(input.title) || siteTitle
  if (base === siteTitle) return trimAtWord(base, maxLength)
  return `${trimAtWord(base, Math.max(18, maxLength - suffix.length))}${suffix}`
}

export function isPoorSeoPage(input: SeoInput): boolean {
  if (input.noindex === true || input.noindex === "true") return true
  const title = seoText(input.title)
  const description = seoText(input.description)
  // A large primary-source page can legitimately contain noisy OCR fragments.
  // Indexing is decided from the page's own search summary, not its entire
  // evidence corpus, so a valuable object is never hidden by one bad quote.
  const summary = description || seoText(input.text).slice(0, 400)
  if (!title || PLACEHOLDER.test(title) || PLACEHOLDER.test(description) || POOR_DESCRIPTION.test(description)) {
    return true
  }
  if (/\uFFFD/.test(summary) || /(?:\b\p{L}\s+){9,}/u.test(summary)) return true
  const tokens = summary.split(/\s+/).filter(Boolean)
  return tokens.length >= 30 && tokens.filter((token) => [...token].length === 1).length / tokens.length > 0.45
}

function absoluteUrl(baseUrl: string, slug: string): string {
  const path = slug === "index" ? "" : `/${slug}`
  return new URL(path || "/", `https://${baseUrl}`).toString()
}

function breadcrumbLabel(segment: string): string {
  return (
    {
      objektai: "Objektai",
      asmenys: "Asmenys",
      vietos: "Vietos",
      ivykiai: "Įvykiai",
      grupes: "Grupės",
      daiktai: "Daiktai",
      saltiniai: "Šaltiniai",
      zodynas: "Sąvokos",
      parodos: "Parodos",
      galerija: "Galerija",
      temos: "Temos",
      laikotarpiai: "Laikotarpiai",
    }[segment] ?? segment.replace(/-/g, " ")
  )
}

export function pageStructuredData(input: SeoInput & {
  baseUrl: string
  canonicalUrl: string
  mediaUrl?: string
  mediaWidth?: number
  mediaHeight?: number
}): Record<string, unknown> {
  const slug = String(input.slug ?? "index")
  const title = seoText(input.title) || "Lietuvos istorija"
  const description = seoDescription(input)
  const segments = slug === "index" ? [] : slug.split("/").filter(Boolean)
  const breadcrumbs = ["index", ...segments].map((segment, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: index === 0 ? "Pradžia" : index === segments.length ? title : breadcrumbLabel(segment),
    item: absoluteUrl(input.baseUrl, index === 0 ? "index" : segments.slice(0, index).join("/")),
  }))
  const type = seoText(input.itemType).toLocaleLowerCase("lt")
  const entityType = type === "asmuo" ? "Person" : type === "vieta" ? "Place" : type === "ivykis" ? "Event" : type === "saltinis" || type === "šaltinis" ? "CreativeWork" : "Article"
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": input.canonicalUrl,
      url: input.canonicalUrl,
      name: title,
      description,
      inLanguage: "lt",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs,
    },
    {
      "@type": entityType,
      "@id": `${input.canonicalUrl}#entity`,
      name: title,
      description,
      mainEntityOfPage: { "@id": input.canonicalUrl },
    },
  ]
  if (input.mediaUrl) {
    graph.push({
      "@type": "ImageObject",
      "@id": `${input.canonicalUrl}#primary-image`,
      contentUrl: input.mediaUrl,
      thumbnailUrl: input.mediaUrl,
      caption: title,
      width: input.mediaWidth || undefined,
      height: input.mediaHeight || undefined,
      representativeOfPage: true,
    })
    ;(graph[0] as Record<string, unknown>).primaryImageOfPage = { "@id": `${input.canonicalUrl}#primary-image` }
  }
  return { "@context": "https://schema.org", "@graph": graph }
}

export function canonicalSeoSlug(slug: string): FullSlug {
  return slug as FullSlug
}
