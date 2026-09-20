import { cleanText, type MediaEntry } from "./objectMedia"

export type MediaLicenseDefinition = {
  id: string
  label: string
  url: string
  attributionRequired: boolean
}

const license = (
  id: string,
  label: string,
  url: string,
  attributionRequired: boolean,
): MediaLicenseDefinition => ({ id, label, url, attributionRequired })

export const MEDIA_LICENSE_VOCABULARY = {
  "PDM-1.0": license(
    "PDM-1.0",
    "Public Domain Mark 1.0",
    "https://creativecommons.org/publicdomain/mark/1.0/",
    false,
  ),
  "CC0-1.0": license(
    "CC0-1.0",
    "CC0 1.0",
    "https://creativecommons.org/publicdomain/zero/1.0/",
    false,
  ),
  "CC-BY-2.0": license(
    "CC-BY-2.0",
    "CC BY 2.0",
    "https://creativecommons.org/licenses/by/2.0/",
    true,
  ),
  "CC-BY-2.5": license(
    "CC-BY-2.5",
    "CC BY 2.5",
    "https://creativecommons.org/licenses/by/2.5/",
    true,
  ),
  "CC-BY-3.0": license(
    "CC-BY-3.0",
    "CC BY 3.0",
    "https://creativecommons.org/licenses/by/3.0/",
    true,
  ),
  "CC-BY-4.0": license(
    "CC-BY-4.0",
    "CC BY 4.0",
    "https://creativecommons.org/licenses/by/4.0/",
    true,
  ),
  "CC-BY-SA-2.0": license(
    "CC-BY-SA-2.0",
    "CC BY-SA 2.0",
    "https://creativecommons.org/licenses/by-sa/2.0/",
    true,
  ),
  "CC-BY-SA-2.5": license(
    "CC-BY-SA-2.5",
    "CC BY-SA 2.5",
    "https://creativecommons.org/licenses/by-sa/2.5/",
    true,
  ),
  "CC-BY-SA-3.0": license(
    "CC-BY-SA-3.0",
    "CC BY-SA 3.0",
    "https://creativecommons.org/licenses/by-sa/3.0/",
    true,
  ),
  "CC-BY-SA-3.0-PL": license(
    "CC-BY-SA-3.0-PL",
    "CC BY-SA 3.0 PL",
    "https://creativecommons.org/licenses/by-sa/3.0/pl/",
    true,
  ),
  "CC-BY-SA-4.0": license(
    "CC-BY-SA-4.0",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
    true,
  ),
  "CC-BY": license("CC-BY", "CC BY", "https://creativecommons.org/licenses/by/4.0/", true),
  "CC-BY-NC": license(
    "CC-BY-NC",
    "CC BY-NC",
    "https://creativecommons.org/licenses/by-nc/4.0/",
    true,
  ),
  "CC-BY-ND": license(
    "CC-BY-ND",
    "CC BY-ND",
    "https://creativecommons.org/licenses/by-nd/4.0/",
    true,
  ),
  "CC-BY-NC-SA": license(
    "CC-BY-NC-SA",
    "CC BY-NC-SA",
    "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    true,
  ),
  "CC-BY-NC-ND": license(
    "CC-BY-NC-ND",
    "CC BY-NC-ND",
    "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    true,
  ),
  "InC-1.0": license(
    "InC-1.0",
    "In Copyright 1.0",
    "https://rightsstatements.org/vocab/InC/1.0/",
    false,
  ),
  "InC-EDU-1.0": license(
    "InC-EDU-1.0",
    "In Copyright - Educational Use Permitted 1.0",
    "https://rightsstatements.org/vocab/InC-EDU/1.0/",
    false,
  ),
  "NoC-NC-1.0": license(
    "NoC-NC-1.0",
    "No Copyright - Non-Commercial Use Only 1.0",
    "https://rightsstatements.org/vocab/NoC-NC/1.0/",
    false,
  ),
} as const satisfies Record<string, MediaLicenseDefinition>

function normalizedLicenseEvidence(
  entry: Pick<MediaEntry, "license" | "licenseUrl" | "rightsNote">,
) {
  return normalizeMediaText([entry.license, entry.licenseUrl, entry.rightsNote].join(" "))
}

function normalizeMediaText(value: unknown): string {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en")
}

export function mediaLicenseDefinition(
  entryOrValue: Pick<MediaEntry, "license" | "licenseUrl" | "rightsNote"> | string | undefined,
): MediaLicenseDefinition | undefined {
  const entry =
    typeof entryOrValue === "object" && entryOrValue !== null
      ? entryOrValue
      : { license: entryOrValue }
  const evidence = normalizedLicenseEvidence(entry)
  if (!evidence) return undefined

  if (/publicdomain\/mark\/1\.0|\bpublic domain\b|\bpdm(?:\s|-)?1\.0\b|\bpd\b/.test(evidence)) {
    return MEDIA_LICENSE_VOCABULARY["PDM-1.0"]
  }
  if (/publicdomain\/zero\/1\.0|\bcc\s*0\b|\bcc0\b/.test(evidence)) {
    return MEDIA_LICENSE_VOCABULARY["CC0-1.0"]
  }

  const rightsStatement = evidence.match(/rightsstatements\.org\/vocab\/(inc-edu|inc|noc-nc)\/1\.0/)
  if (rightsStatement) {
    const id =
      rightsStatement[1] === "inc-edu"
        ? "InC-EDU-1.0"
        : rightsStatement[1] === "inc"
          ? "InC-1.0"
          : "NoC-NC-1.0"
    return MEDIA_LICENSE_VOCABULARY[id]
  }
  // Some institutional exports carry the controlled rights statement only as
  // a compact label (without the rightsstatements.org URL). Normalize those
  // labels to the same vocabulary so the gallery can always expose the
  // canonical terms link.
  if (/\binc-edu\b/.test(evidence)) return MEDIA_LICENSE_VOCABULARY["InC-EDU-1.0"]
  if (/\bnoc-nc\b/.test(evidence)) return MEDIA_LICENSE_VOCABULARY["NoC-NC-1.0"]
  if (/\binc\b/.test(evidence)) return MEDIA_LICENSE_VOCABULARY["InC-1.0"]
  const ccPath = evidence.match(
    /(?:creativecommons\.org\/licenses\/)?by(?:-([a-z]+(?:-[a-z]+)*))?(?:\/|\s|$)/,
  )
  const compactFlavor = evidence.match(/\bccby(ncnd|ncsa|nc|nd|sa)?(?:\b|$)/)?.[1] || ""
  const ccVersion =
    evidence.match(/licenses\/by(?:-[a-z-]+)?\/([234]\.[05])/)?.[1] ??
    evidence.match(
      /(?:cc[-_ ]*)?by(?:[-_ ]*(?:sa|nc|nd)(?:[-_ ]*(?:sa|nd))?)[-_ ]*([234]\.[05])/,
    )?.[1] ??
    (ccPath ? "4.0" : "")
  const flavor = (ccPath?.[1] || compactFlavor.replace(/(nc)(nd|sa)?/, "$1-$2") || "")
    .replace(/-$/, "")
    .toUpperCase()
  if (flavor && !["SA", "NC", "ND", "NC-SA", "NC-ND"].includes(flavor)) return undefined
  if (flavor && ["NC", "ND", "NC-SA", "NC-ND"].includes(flavor)) {
    const suffix = flavor ? `-${flavor}` : ""
    const label = `CC BY${suffix} ${ccVersion || "4.0"}`
    return license(
      `CC-BY${suffix}`,
      label,
      `https://creativecommons.org/licenses/by${suffix.toLowerCase()}/${ccVersion || "4.0"}/`,
      true,
    )
  }
  const family = /by(?:-|_|\s*)sa|licenses\/by-sa\//.test(evidence) ? "CC-BY-SA" : "CC-BY"
  const version =
    evidence.match(/licenses\/(?:by|by-sa)\/([234]\.[05])/)?.[1] ??
    evidence.match(/(?:cc[-_ ]*)?by(?:[-_ ]*sa)?[-_ ]*([234]\.[05])/)?.[1]
  if (!version && family === "CC-BY" && (ccPath || /\bcc\s*by\b/.test(evidence))) {
    return MEDIA_LICENSE_VOCABULARY["CC-BY"]
  }
  if (!version || !/(?:\bby\b|licenses\/by)/.test(evidence)) return undefined
  const localizedPolish =
    family === "CC-BY-SA" && version === "3.0" && /(?:\bpl\b|\/pl\/?)/.test(evidence)
  const id = `${family}-${version}${localizedPolish ? "-PL" : ""}`
  return MEDIA_LICENSE_VOCABULARY[id as keyof typeof MEDIA_LICENSE_VOCABULARY]
}

export function normalizeMediaUrl(value: unknown): string {
  const raw = cleanText(value)
  if (!raw) return ""
  try {
    const url = new URL(raw)
    if (url.protocol !== "http:" && url.protocol !== "https:") return ""
    url.hash = ""
    if (url.hostname === "creativecommons.org" || url.hostname.endsWith(".creativecommons.org")) {
      url.protocol = "https:"
    }
    return url.toString()
  } catch {
    return ""
  }
}

function meaningfulCredit(value: unknown): string {
  const text = cleanText(value)
  return /^(?:own work|savo darbas|unknown|unknown author|nežinomas|n\/a)[.!]?$/i.test(text)
    ? ""
    : text
}

function uniqueParts(parts: unknown[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const value of parts) {
    const part = cleanText(value)
    const key = normalizeMediaText(part)
    if (!part || seen.has(key)) continue
    seen.add(key)
    result.push(part)
  }
  return result
}

function providerCredit(value: unknown): string {
  const provider = cleanText(value)
  const normalized = normalizeMediaText(provider)
  if (normalized === "commons") return "Wikimedia Commons"
  if (normalized === "europeana") return "Europeana"
  return provider
}

export function constructMediaCredit(entry: MediaEntry): string {
  const definition = mediaLicenseDefinition(entry)
  const licenseText = definition
    ? `${definition.label} (${definition.url})`
    : cleanText(entry.licenseUrl)
      ? `${cleanText(entry.license)} (${cleanText(entry.licenseUrl)})`
      : cleanText(entry.license)
  return uniqueParts([
    meaningfulCredit(entry.creator) || meaningfulCredit(entry.attribution),
    entry.institution,
    entry.providerLabel,
    providerCredit(entry.provider),
    entry.canonicalUrl,
    licenseText,
  ]).join(" · ")
}

export function normalizeMediaAttribution(entry: MediaEntry): MediaEntry {
  const definition = mediaLicenseDefinition(entry)
  const normalized: MediaEntry = {
    ...entry,
    canonicalUrl: normalizeMediaUrl(entry.canonicalUrl),
    sourceUrl: normalizeMediaUrl(entry.sourceUrl),
    thumbUrl: normalizeMediaUrl(entry.thumbUrl),
    displayUrl: normalizeMediaUrl(entry.displayUrl),
    license: definition?.label ?? cleanText(entry.license),
    licenseUrl: definition?.url ?? normalizeMediaUrl(entry.licenseUrl),
  }
  normalized.attribution = constructMediaCredit(normalized)
  return normalized
}

export type MediaAttributionIssue = {
  mediaId: string
  missing: Array<
    "controlledLicense" | "attribution" | "licenseUrl" | "canonicalUrl" | "creditParty"
  >
}

export function collectMediaAttributionIssues(entries: MediaEntry[]): MediaAttributionIssue[] {
  const issues: MediaAttributionIssue[] = []
  for (const entry of entries) {
    const definition = mediaLicenseDefinition(entry)
    const evidence = normalizedLicenseEvidence(entry)
    const attributionRequired =
      Boolean(definition?.attributionRequired) ||
      /creativecommons\.org\/licenses\/|\bcc[-_ ]*by(?:\b|[-_ ])/.test(evidence)
    if (!attributionRequired) continue
    const missing: MediaAttributionIssue["missing"] = []
    if (!definition) missing.push("controlledLicense")
    if (!cleanText(entry.attribution)) missing.push("attribution")
    if (!normalizeMediaUrl(entry.licenseUrl)) missing.push("licenseUrl")
    if (!normalizeMediaUrl(entry.canonicalUrl)) missing.push("canonicalUrl")
    if (
      !meaningfulCredit(entry.creator) &&
      !meaningfulCredit(entry.institution) &&
      !meaningfulCredit(entry.providerLabel) &&
      !meaningfulCredit(entry.provider)
    ) {
      missing.push("creditParty")
    }
    if (missing.length) {
      issues.push({ mediaId: cleanText(entry.mediaId) || "(missing mediaId)", missing })
    }
  }
  return issues
}

export function assertPublishableMediaAttribution(entries: MediaEntry[]): void {
  const issues = collectMediaAttributionIssues(entries)
  if (!issues.length) return
  const details = issues
    .slice(0, 12)
    .map((issue) => `${issue.mediaId}: ${issue.missing.join(", ")}`)
    .join("; ")
  const remainder = issues.length > 12 ? `; and ${issues.length - 12} more` : ""
  throw new Error(
    `Media attribution integrity failed (${issues.length} assets): ${details}${remainder}`,
  )
}
