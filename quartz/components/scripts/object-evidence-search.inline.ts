import {
  filterEvidence,
  type EvidenceIndexItem,
  type EvidenceFilters,
} from "../../util/objectEvidenceFilter"

const evidenceRoots = new WeakSet<HTMLElement>()
function initObjectEvidenceSearch() {
  const page = document.querySelector<HTMLElement>("[data-object-evidence-page='true']")
  if (!page || evidenceRoots.has(page)) return
  evidenceRoots.add(page)
  const root = page.querySelector<HTMLElement>("[data-object-evidence-search]")!
  const list = page.querySelector<HTMLElement>(".object-detail-claims")
  if (!root || !list) return
  const input = root.querySelector<HTMLInputElement>("[data-object-evidence-query]")!
  const source = root.querySelector<HTMLSelectElement>("[data-evidence-source]")!
  const topics = root.querySelector<HTMLSelectElement>("[data-evidence-topics]")!
  const origin = root.querySelector<HTMLSelectElement>("[data-evidence-origin]")!
  const sort = root.querySelector<HTMLSelectElement>("[data-evidence-sort]")!
  const status = root.querySelector<HTMLElement>("[data-object-evidence-results]")!
  const buttons = [...page.querySelectorAll<HTMLButtonElement>("[data-evidence-filter]")]
  let more = page.querySelector<HTMLButtonElement>("[data-object-evidence-load-more]")
  if (!more) {
    more = document.createElement("button")
    more.type = "button"
    more.className = "object-evidence-load-more"
    list.after(more)
  }
  let index: EvidenceIndexItem[] = []
  let kind = "claim"
  let limit = 50
  let ready = false
  const filters = (): EvidenceFilters => ({
    query: input.value,
    kind,
    source: source.value,
    topics: [...topics.selectedOptions].map((o) => o.value),
    origin: origin.value,
    sort: sort.value,
  })
  function restore() {
    const query = new URLSearchParams(location.search)
    input.value = query.get("q") || ""
    kind = query.get("kind") || (location.hash.startsWith("#citation-") ? "all" : "claim")
    source.value = query.get("source") || ""
    origin.value = query.get("origin") || ""
    sort.value = query.get("sort") || "number"
    for (const option of topics.options)
      option.selected = query.getAll("topic").includes(option.value)
  }
  function render(updateUrl = false) {
    if (!ready) return
    if (updateUrl) {
      const url = new URL(location.href)
      for (const key of ["q", "kind", "source", "origin", "sort", "topic"])
        url.searchParams.delete(key)
      const f = filters()
      for (const key of ["q", "kind", "source", "origin", "sort"] as const) {
        const value = key === "q" ? f.query : f[key]
        if (
          value &&
          !(key === "kind" && value === "claim") &&
          !(key === "sort" && value === "number")
        )
          url.searchParams.set(key, value)
      }
      for (const topic of f.topics) url.searchParams.append("topic", topic)
      history.replaceState({ ...history.state, scrollY }, "", url)
    }
    const matches = filterEvidence(index, filters())
    const fragment = document.createDocumentFragment()
    for (const item of matches.slice(0, limit)) {
      if (item.html) {
        // HTML is escaped by the server-side Preact renderer, never supplied by AI.
        const doc = new DOMParser().parseFromString(item.html, "text/html")
        fragment.append(...doc.body.children)
      } else {
        const a = document.createElement("a")
        a.href = item.href
        a.textContent = `${item.id}: ${item.text}`
        fragment.append(a)
      }
    }
    list!.replaceChildren(fragment)
    status.textContent = matches.length
      ? `Rodoma ${Math.min(limit, matches.length)} iš ${matches.length} įrašų`
      : "Atitikmenų nėra. Pakeiskite arba išvalykite filtrus."
    for (const button of buttons)
      button.setAttribute("aria-pressed", String(button.dataset.evidenceFilter === kind))
    more!.hidden = limit >= matches.length
    more!.textContent = `Rodyti daugiau (${Math.max(0, matches.length - limit)})`
  }
  const changed = () => {
    limit = 50
    render(true)
  }
  input.addEventListener("input", changed)
  for (const select of [source, topics, origin, sort]) select.addEventListener("change", changed)
  for (const button of buttons)
    button.addEventListener("click", () => {
      kind = button.dataset.evidenceFilter || "claim"
      changed()
    })
  root.querySelector("[data-evidence-clear]")?.addEventListener("click", () => {
    input.value = source.value = origin.value = ""
    sort.value = "number"
    kind = "claim"
    for (const option of topics.options) option.selected = false
    changed()
  })
  more.addEventListener("click", () => {
    limit += 50
    render()
  })
  const observer = new IntersectionObserver(
    (entries) => {
      if (ready && entries.some((entry) => entry.isIntersecting) && !more!.hidden) {
        limit += 50
        render()
      }
    },
    { rootMargin: "100px" },
  )
  observer.observe(more)
  window.addCleanup?.(() => observer.disconnect())
  const onNav = () => {
    if (page.isConnected) {
      restore()
      render()
    }
  }
  document.addEventListener("nav", onNav)
  window.addCleanup?.(() => document.removeEventListener("nav", onNav))
  fetch(root.dataset.objectEvidenceIndex || "")
    .then((response) => {
      if (!response.ok) throw new Error("index")
      return response.json()
    })
    .then((payload) => {
      if (!page.isConnected || payload.version !== 2) return
      index = payload.items
      const sourceOptions = new Map<string, string>()
      for (const item of index)
        item.sources.forEach((title, i) => sourceOptions.set(item.sourceIds?.[i] || title, title))
      for (const [id, title] of [...sourceOptions].sort((a, b) => a[1].localeCompare(b[1], "lt")))
        source.add(new Option(title, id))
      for (const value of [...new Set(index.flatMap((item) => item.topics || []))].sort())
        topics.add(new Option(value.replaceAll("-", " "), value))
      ready = true
      restore()
      const anchor = decodeURIComponent(location.hash.slice(1))
      const target = filterEvidence(index, filters()).findIndex((item) =>
        item.html?.includes(`id="${anchor}"`),
      )
      if (anchor && target >= 0) limit = Math.ceil((target + 1) / 50) * 50
      page.querySelector<HTMLElement>("[data-object-evidence-count]")?.setAttribute("hidden", "")
      render()
      if (anchor) document.getElementById(anchor)?.scrollIntoView()
    })
    .catch(() => {
      status.textContent =
        "Filtrų indeksas nepasiekiamas. Visi įrašai pasiekiami puslapių nuorodomis."
    })
}
initObjectEvidenceSearch()
document.addEventListener("nav", initObjectEvidenceSearch)
