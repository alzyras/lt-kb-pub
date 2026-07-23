import fs from "node:fs"
import path from "node:path"

type CatalogEntry = { mediaId?: unknown; displayUrl?: unknown; sourceUrl?: unknown; thumbUrl?: unknown }
type CheckResult = { url: string; ok: boolean; status?: number; contentType?: string; error?: string }

const full = process.argv.includes("--full")
const publicRoot = path.resolve(process.env.PUBLIC_ROOT ?? "public")
const sourcePath = fs.existsSync(path.join(publicRoot, "static/mediaCatalog.json"))
  ? path.join(publicRoot, "static/mediaCatalog.json")
  : path.resolve("quartz/static/mediaCatalogSource.json")
const outputPath = path.resolve(process.env.MEDIA_HOST_AUDIT_JSON ?? "media-host-audit.json")
const perHostLimit = full ? Number.POSITIVE_INFINITY : 1
const timeoutMs = Number(process.env.MEDIA_HOST_TIMEOUT_MS ?? "15000")
const concurrency = Math.max(1, Number(process.env.MEDIA_HOST_CONCURRENCY ?? "3"))

function sourceUrl(entry: CatalogEntry): string {
  return String(entry.displayUrl ?? entry.sourceUrl ?? entry.thumbUrl ?? "").trim()
}

async function check(url: string): Promise<CheckResult> {
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
    }
  } catch (error) {
    return { url, ok: false, error: error instanceof Error ? error.message : String(error) }
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
    const urls = byHost.get(host) ?? []
    if (!urls.includes(url)) urls.push(url)
    byHost.set(host, urls)
  } catch {
    // Structural build validation reports malformed catalog URLs precisely.
  }
}

const targets = [...byHost.entries()].flatMap(([host, urls]) =>
  urls.slice(0, perHostLimit).map((url) => ({ host, url })),
)
const results: Array<CheckResult & { host: string }> = []
let cursor = 0
await Promise.all(
  Array.from({ length: Math.min(concurrency, targets.length) }, async () => {
    while (cursor < targets.length) {
      const target = targets[cursor++]
      results.push({ host: target.host, ...(await check(target.url)) })
    }
  }),
)

const failures = results.filter((result) => !result.ok)
const report = {
  schema: "ltkb-media-host-audit/v1",
  mode: full ? "full" : "representative-per-host",
  catalogEntries: catalog.length,
  hosts: byHost.size,
  checked: results.length,
  failures,
  status: failures.length ? "failed" : "passed",
}
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report, null, 2))
if (failures.length) process.exitCode = 1
