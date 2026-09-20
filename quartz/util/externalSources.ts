export type ExternalSourceLink = {
  title: string
  url: string
  publisher: string
  kind: string
}

const ALLOWED_EXTERNAL_HOSTS = new Set([
  "lt.wikipedia.org",
  "en.wikipedia.org",
  "pl.wikipedia.org",
  "de.wikipedia.org",
  "ru.wikipedia.org",
  "www.wikidata.org",
  "www.vle.lt",
  "vle.lt",
  "www.lnb.lt",
  "lnb.lt",
  "www.epaveldas.lt",
  "epaveldas.lt",
  "www.limis.lt",
  "limis.lt",
  "eais.archyvai.lt",
  "www.archyvai.lt",
  "archyvai.lt",
  "www.lituanistika.lt",
  "lituanistika.lt",
])

export function isAllowedExternalSourceUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false
  try {
    const url = new URL(value)
    return (
      url.protocol === "https:" &&
      ALLOWED_EXTERNAL_HOSTS.has(url.hostname) &&
      (!url.port || url.port === "443") &&
      !url.username &&
      !url.password
    )
  } catch {
    return false
  }
}

function decodeJsonValue(value: unknown): unknown {
  if (typeof value !== "string") return value
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function parseExternalSources(value: unknown): ExternalSourceLink[] {
  const decoded = decodeJsonValue(value)
  if (!Array.isArray(decoded)) return []

  const seen = new Set<string>()
  const sources: ExternalSourceLink[] = []
  for (const raw of decoded) {
    if (!raw || typeof raw !== "object") continue
    const row = raw as Record<string, unknown>
    if (row.status !== undefined && String(row.status) !== "published") continue
    const url = typeof row.url === "string" ? row.url.trim() : ""
    if (!isAllowedExternalSourceUrl(url) || seen.has(url)) continue
    if (String(row.kind ?? "") === "identity") continue
    const title = String(row.title ?? "").trim() || url
    const publisher = String(row.publisher ?? "").trim() || new URL(url).hostname
    sources.push({
      title,
      url,
      publisher,
      kind: String(row.kind ?? "reference").trim() || "reference",
    })
    seen.add(url)
  }
  return sources
}

export function externalSourceGroup(source: ExternalSourceLink): string {
  const publisher = source.publisher.toLocaleLowerCase("lt-LT")
  if (publisher.includes("vikip") || source.url.includes("wikipedia.org")) {
    return "Vikipedija"
  }
  if (publisher.includes("vle") || publisher.includes("enciklopedija")) {
    return "Visuotinė lietuvių enciklopedija"
  }
  return "Instituciniai šaltiniai"
}
