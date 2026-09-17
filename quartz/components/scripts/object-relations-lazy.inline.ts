type RelationIndexItem = {
  html?: string
}

type RelationIndex = {
  version: number
  relationCount: number
  items: RelationIndexItem[]
}

const relationRoots = new WeakSet<HTMLElement>()
const BATCH_SIZE = 50

function appendRenderedItems(list: HTMLElement, items: RelationIndexItem[]) {
  const fragment = document.createDocumentFragment()
  for (const item of items) {
    if (!item.html) continue
    const parsed = new DOMParser().parseFromString(item.html, "text/html")
    fragment.append(...parsed.body.childNodes)
  }
  list.append(fragment)
}

function initObjectRelationsLazyLoading() {
  const page = document.querySelector<HTMLElement>("[data-object-relations-page='true']")
  if (!page || relationRoots.has(page)) return
  relationRoots.add(page)

  const list = page.querySelector<HTMLElement>(".object-relations-list")
  const more = page.querySelector<HTMLButtonElement>("[data-object-relations-load-more]")
  const count = page.querySelector<HTMLElement>("[data-object-relations-count='true']")
  const indexUrl = page.dataset.objectRelationsIndex
  if (!list || !more || !indexUrl) return

  let index: RelationIndex | undefined
  let loaded = Number(page.dataset.objectRelationsLoaded ?? "0") || 0
  let loading = false
  let finished = false

  const updateControl = () => {
    if (!index) return
    const remaining = Math.max(0, index.items.length - loaded)
    finished = remaining === 0
    more.hidden = finished
    more.disabled = loading
    more.textContent = loading ? "Įkeliama…" : `Rodyti daugiau grupių (dar ${remaining})`
    page.dataset.objectRelationsLoaded = String(loaded)
    if (count) {
      count.textContent = `Iš viso ${index.relationCount} ryšiai · ${index.items.length} grupių`
    }
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
      if (!response.ok) throw new Error("relations index")
      return response.json() as Promise<RelationIndex>
    })
    .then((payload) => {
      if (
        !page.isConnected ||
        payload.version !== 2 ||
        !Number.isFinite(payload.relationCount) ||
        !Array.isArray(payload.items)
      )
        return
      index = payload
      page.dataset.objectRelationsLazyReady = "true"
      updateControl()
      if (more.getBoundingClientRect().top < innerHeight + 700) loadNext()
    })
    .catch(() => {
      more.hidden = false
      more.disabled = false
      more.textContent = "Rodyti kitą puslapį"
    })
}

initObjectRelationsLazyLoading()
document.addEventListener("nav", initObjectRelationsLazyLoading)

export {}
