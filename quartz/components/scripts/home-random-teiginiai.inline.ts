type ContentIndexEntry = {
  slug?: string
  title?: string
  content?: string
  quoteCount?: number
  claimCount?: number
  claims?: string[]
}

type TeiginysEntry = {
  text: string
  slug: string
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pageHrefFromSlug(slug: string): string {
  if (slug === "index") {
    return "./"
  }
  return `./${encodeURI(slug)}`
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function uniqueByText(entries: TeiginysEntry[]): TeiginysEntry[] {
  const seen = new Set<string>()
  const result: TeiginysEntry[] = []

  for (const entry of entries) {
    const key = entry.text.trim().toLocaleLowerCase("lt")
    if (!key || seen.has(key)) {
      continue
    }
    seen.add(key)
    result.push(entry)
  }

  return result
}

function pickRandomTeiginiai(entries: TeiginysEntry[], limit: number): TeiginysEntry[] {
  const unique = uniqueByText(entries)
  const bySlug = new Map<string, TeiginysEntry[]>()

  for (const entry of unique) {
    const bucket = bySlug.get(entry.slug)
    if (bucket) {
      bucket.push(entry)
    } else {
      bySlug.set(entry.slug, [entry])
    }
  }

  const result: TeiginysEntry[] = []
  const shuffledSlugs = shuffle([...bySlug.keys()])

  for (const slug of shuffledSlugs) {
    if (result.length >= limit) {
      break
    }
    const bucket = bySlug.get(slug) ?? []
    const picked = shuffle(bucket)[0]
    if (picked) {
      result.push(picked)
    }
  }

  if (result.length < limit) {
    const remaining = unique.filter(
      (entry) => !result.some((picked) => picked.text === entry.text && picked.slug === entry.slug),
    )
    for (const entry of shuffle(remaining)) {
      if (result.length >= limit) {
        break
      }
      result.push(entry)
    }
  }

  return result.slice(0, limit)
}

async function fetchContentIndex(): Promise<Record<string, ContentIndexEntry>> {
  const candidates = [
    "./static/contentIndex.json",
    "../static/contentIndex.json",
    "/lt-kb-pub/static/contentIndex.json",
    "/static/contentIndex.json",
  ]

  for (const url of candidates) {
    try {
      const response = await fetch(url, { cache: "no-store" })
      if (!response.ok) {
        continue
      }
      const payload = (await response.json()) as Record<string, ContentIndexEntry>
      if (payload && typeof payload === "object") {
        return payload
      }
    } catch {
      // try next candidate
    }
  }

  return {}
}

function buildCandidateTeiginiai(index: Record<string, ContentIndexEntry>, minEvidence: number): TeiginysEntry[] {
  const result: TeiginysEntry[] = []

  for (const [slugKey, entry] of Object.entries(index)) {
    const slug = String(entry.slug ?? slugKey ?? "").trim()
    const claims = Array.isArray(entry.claims)
      ? entry.claims
          .filter((value): value is string => typeof value === "string")
          .map((value) => value.trim())
          .filter(Boolean)
      : []
    if (!slug || claims.length === 0) {
      continue
    }
    const claimCount = Number.isFinite(entry.claimCount) ? Number(entry.claimCount) : claims.length
    const quoteCount = Number.isFinite(entry.quoteCount) ? Number(entry.quoteCount) : 0
    const evidenceCount = Math.max(0, claimCount) + Math.max(0, quoteCount)
    if (evidenceCount < minEvidence) {
      continue
    }

    for (const text of claims) {
      result.push({ text, slug })
    }
  }

  return result
}

function renderTeiginiai(host: HTMLElement, entries: TeiginysEntry[]) {
  const list = host.querySelector<HTMLOListElement>('[data-home-random-teiginiai-list="true"]')
  if (!list) {
    return
  }

  if (entries.length === 0) {
    list.innerHTML = '<li class="home-random-teiginiai-empty">Nerasta tinkamų teiginių.</li>'
    return
  }

  const html = entries
    .map((entry) => {
      const href = pageHrefFromSlug(entry.slug)
      return `<li><a href="${href}">${escapeHtml(entry.text)}</a></li>`
    })
    .join("")

  list.innerHTML = html
}

async function initRandomTeiginiai() {
  const hosts = [...document.querySelectorAll<HTMLElement>('[data-home-random-teiginiai="true"]')]
  if (hosts.length === 0) {
    return
  }

  const index = await fetchContentIndex()

  hosts.forEach((host) => {
    const limit = Math.max(1, Number(host.dataset.limit ?? "5") || 5)
    const minEvidence = Math.max(1, Number(host.dataset.minEvidence ?? "10") || 10)
    const candidates = buildCandidateTeiginiai(index, minEvidence)
    const picked = pickRandomTeiginiai(candidates, limit)
    renderTeiginiai(host, picked)
  })
}

document.addEventListener("nav", () => {
  initRandomTeiginiai()
})

initRandomTeiginiai()
