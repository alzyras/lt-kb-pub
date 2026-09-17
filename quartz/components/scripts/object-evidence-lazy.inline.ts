type EvidenceIndexItem = {
  kind: "claim" | "citation" | "mention"
  html?: string
}

type EvidenceIndex = {
  version: number
  items: EvidenceIndexItem[]
}

const evidenceRoots = new WeakSet<HTMLElement>()
const BATCH_SIZE = 50

function appendRenderedItems(list: HTMLElement, items: EvidenceIndexItem[]) {
  const fragment = document.createDocumentFragment()
  for (const item of items) {
    if (!item.html) continue
    const documentFragment = new DOMParser().parseFromString(item.html, "text/html")
    fragment.append(...documentFragment.body.childNodes)
  }
  list.append(fragment)
}

function initObjectEvidenceLazyLoading() {
  const page = document.querySelector<HTMLElement>("[data-object-evidence-page='true']")
  if (!page || evidenceRoots.has(page)) return
  evidenceRoots.add(page)

  const list = page.querySelector<HTMLElement>(".object-detail-claims")
  const more = page.querySelector<HTMLButtonElement>("[data-object-evidence-load-more]")
  const indexUrl = page.dataset.objectEvidenceIndex
  if (!list || !more || !indexUrl) return

  let index: EvidenceIndex | undefined
  let loaded = Number(page.dataset.objectEvidenceLoaded ?? "0") || 0
  let loading = false
  let finished = false

  const updateControl = () => {
    if (!index) return
    const remaining = Math.max(0, index.items.length - loaded)
    finished = remaining === 0
    more.hidden = finished
    more.disabled = loading
    more.textContent = loading ? "Įkeliama…" : `Rodyti daugiau (dar ${remaining})`
    page.dataset.objectEvidenceLoaded = String(loaded)
    const count = page.querySelector<HTMLElement>("[data-object-evidence-count]")
    const start = Number(page.dataset.objectEvidenceStart || 0) + 1
    if (count) count.textContent = `${start}–${loaded} iš ${index.items.length} teiginių`
  }

  const loadNext = () => {
    if (!index || loading || finished) return
    loading = true
    updateControl()
    const next = index.items.slice(loaded, loaded + BATCH_SIZE)
    appendRenderedItems(list, next)
    loaded += next.length
    loading = false
    updateControl()
  }

  more.addEventListener("click", () => {
    if (index) loadNext()
    else if (more.dataset.nextUrl) location.assign(more.dataset.nextUrl)
  })
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadNext()
    },
    { rootMargin: "700px 0px" },
  )
  observer.observe(more)
  window.addCleanup?.(() => observer.disconnect())

  fetch(indexUrl)
    .then((response) => {
      if (!response.ok) throw new Error("evidence index")
      return response.json() as Promise<EvidenceIndex>
    })
    .then((payload) => {
      if (!page.isConnected || payload.version !== 2 || !Array.isArray(payload.items)) return
      index = payload
      page.dataset.objectEvidenceLazyReady = "true"
      updateControl()
      const anchor = decodeURIComponent(location.hash.slice(1))
      if (anchor.startsWith("claim-")) {
        while (!document.getElementById(anchor) && !finished) loadNext()
        document.getElementById(anchor)?.scrollIntoView({ block: "center" })
      } else if (more.getBoundingClientRect().top < innerHeight + 700) loadNext()
    })
    .catch(() => {
      // The server-rendered page and its regular pagination remain usable when
      // the optional client-side index cannot be loaded.
      more.hidden = false
      more.disabled = false
      more.textContent = "Rodyti kitą puslapį"
    })
}

initObjectEvidenceLazyLoading()
document.addEventListener("nav", initObjectEvidenceLazyLoading)

export {}
