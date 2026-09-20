import fs from "node:fs"
import path from "node:path"

type CatalogEntry = { mediaId?: unknown; displayUrl?: unknown; sourceUrl?: unknown; thumbUrl?: unknown }
type CheckResult = {
  url: string
  ok: boolean
  status?: number
  contentType?: string
  error?: string
  attempts: number
  inconclusive?: boolean
}
type HttpCheckResult = CheckResult & { retryAfter?: string | null }

const full = process.argv.includes("--full")
const publicRoot = path.resolve(process.env.PUBLIC_ROOT ?? "public")
const sourcePath = fs.existsSync(path.join(publicRoot, "static/mediaCatalog.json"))
  ? path.join(publicRoot, "static/mediaCatalog.json")
  : path.resolve("quartz/static/mediaCatalogSource.json")
const outputPath = path.resolve(process.env.MEDIA_HOST_AUDIT_JSON ?? "media-host-audit.json")
const perHostLimit = full ? Number.POSITIVE_INFINITY : 1
const timeoutMs = Number(process.env.MEDIA_HOST_TIMEOUT_MS ?? "15000")
const siteOrigin = String(process.env.SITE_ORIGIN ?? "https://lietuvosistorija.eu").replace(/\/$/, "")
const firstPartyHosts = new Set<string>()
try {
  const originHost = new URL(siteOrigin).host
  firstPartyHosts.add(originHost)
  if (originHost.startsWith("www.")) firstPartyHosts.add(originHost.slice(4))
  else firstPartyHosts.add(`www.${originHost}`)
} catch {
  // Malformed SITE_ORIGIN is reported by the URL validation/build checks.
}
// Never fan out a full audit against one provider. A few archive hosts (most
// notably Wikimedia) correctly throttle clients that probe hundreds of image
// files in parallel. One orderly stream per host is both kinder and gives the
// report a meaningful signal about availability.
const minHostIntervalMs = Math.max(
  0,
  Number(process.env.MEDIA_HOST_MIN_INTERVAL_MS ?? (full ? "350" : "0")),
)
const maxRateLimitRetries = Math.max(0, Number(process.env.MEDIA_HOST_RATE_LIMIT_RETRIES ?? "3"))

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function retryAfterMs(value: string | null | undefined, attempt: number): number {
  if (value) {
    const seconds = Number(value)
    if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, 60_000)
    const date = Date.parse(value)
    if (Number.isFinite(date)) return Math.min(Math.max(0, date - Date.now()), 60_000)
  }
  return Math.min(1_000 * 2 ** attempt, 15_000)
}

function sourceUrl(entry: CatalogEntry): string {
  return String(entry.displayUrl ?? entry.sourceUrl ?? entry.thumbUrl ?? "").trim()
}

async function check(url: string): Promise<CheckResult> {
  let last: HttpCheckResult | undefined
  for (let attempt = 0; attempt <= maxRateLimitRetries; attempt++) {
    const result = await checkOnce(url, attempt + 1)
    if (result.status !== 429) return result
    last = result
    if (attempt < maxRateLimitRetries) await delay(retryAfterMs(result.retryAfter, attempt))
  }
  return {
    ...(last ?? { url, ok: false, attempts: maxRateLimitRetries + 1 }),
    error: "rate_limited",
    // A provider throttling this audit does not prove that it blocks Google.
    inconclusive: true,
  }
}

async function checkOnce(
  url: string,
  attempts: number,
): Promise<HttpCheckResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "lietuvosistorija-media-audit/1.0 (+https://lietuvosistorija.eu/)" },
    })
    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          range: "bytes=0-1023",
          "user-agent": "lietuvosistorija-media-audit/1.0 (+https://lietuvosistorija.eu/)",
        },
      })
    }
    const contentType = String(response.headers.get("content-type") ?? "").toLowerCase()
    return {
      url,
      ok: response.ok && contentType.startsWith("image/"),
      status: response.status,
      contentType,
      error: response.ok && !contentType.startsWith("image/") ? "not_an_image_response" : undefined,
      attempts,
      retryAfter: response.headers.get("retry-after"),
    }
  } catch (error) {
    return {
      url,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      attempts,
    }
  } finally {
    clearTimeout(timer)
  }
}

const payload = JSON.parse(fs.readFileSync(sourcePath, "utf8")) as CatalogEntry[] | { entries?: CatalogEntry[] }
const catalog = Array.isArray(payload) ? payload : payload.entries ?? []
const byHost = new Map<string, string[]>()
for (const entry of catalog) {
  const url = sourceUrl(entry)
  try {
    const host = new URL(url).host
    // First-party paths may be new in the current build and therefore absent
    // from the currently deployed site. Local/public asset checks validate
    // these files; this audit is specifically for third-party media hosts.
    if (firstPartyHosts.has(host)) continue
    const urls = byHost.get(host) ?? []
    if (!urls.includes(url)) urls.push(url)
    byHost.set(host, urls)
  } catch {
    // Structural build validation reports malformed catalog URLs precisely.
  }
}

const results: Array<CheckResult & { host: string }> = []
await Promise.all(
  [...byHost.entries()].map(async ([host, urls]) => {
    let previousStartedAt = 0
    for (const url of urls.slice(0, perHostLimit)) {
      const remaining = minHostIntervalMs - (Date.now() - previousStartedAt)
      if (remaining > 0) await delay(remaining)
      previousStartedAt = Date.now()
      results.push({ host, ...(await check(url)) })
    }
  }),
)

const failures = results.filter((result) => !result.ok && !result.inconclusive)
const warnings = results.filter((result) => result.inconclusive)
const report = {
  schema: "ltkb-media-host-audit/v1",
  mode: full ? "full" : "representative-per-host",
  catalogEntries: catalog.length,
  hosts: byHost.size,
  checked: results.length,
  failures,
  warnings,
  status: failures.length ? "failed" : warnings.length ? "passed_with_warnings" : "passed",
}
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report, null, 2))
if (failures.length) process.exitCode = 1
