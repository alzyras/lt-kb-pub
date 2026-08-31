type EvidenceSearchItem = {
  kind: "claim" | "citation" | "mention"
  id: string
  text: string
  sources: string[]
  href: string
}

const evidenceSearchRoots = new WeakSet<HTMLElement>()
const evidenceFilterRoots = new WeakSet<HTMLElement>()
const evidenceLoadMoreRoots = new WeakSet<HTMLElement>()

function searchable(item: EvidenceSearchItem): string {
  return `${item.id} ${item.text} ${(item.sources ?? []).join(" ")}`.toLocaleLowerCase("lt")
}

function initObjectEvidenceSearch() {
  document.querySelectorAll<HTMLElement>("[data-object-evidence-search='true']").forEach((root) => {
    if (evidenceSearchRoots.has(root)) return
    evidenceSearchRoots.add(root)
    const input = root.querySelector<HTMLInputElement>("[data-object-evidence-query]")
    const results = root.querySelector<HTMLElement>("[data-object-evidence-results]")
    const indexUrl = String(root.dataset.objectEvidenceIndex ?? "")
    if (!input || !results || !indexUrl) return
    let index: EvidenceSearchItem[] = []
    let loaded = false
    let load: Promise<EvidenceSearchItem[]> | undefined
    const getIndex = () => {
      if (loaded) return Promise.resolve(index)
      if (!load) {
        load = fetch(indexUrl, { cache: "force-cache" })
          .then((response) => (response.ok ? response.json() : Promise.reject(new Error("index"))))
          .then((payload) => {
            index = Array.isArray(payload?.items) ? payload.items : []
            loaded = true
            return index
          })
      }
      return load
    }
    const render = async () => {
      const query = input.value.trim().toLocaleLowerCase("lt")
      if (query.length < 2) {
        results.replaceChildren()
        return
      }
      results.textContent = "Ieškoma…"
      try {
        const matches = (await getIndex())
          .filter((item) => searchable(item).includes(query))
          .slice(0, 100)
        results.replaceChildren()
        if (!matches.length) {
          results.textContent = "Atitikmenų nerasta."
          return
        }
        const summary = document.createElement("small")
        summary.textContent = `Rasta ${matches.length}${matches.length === 100 ? "+" : ""} įrašų visame objekte`
        results.append(summary)
        for (const item of matches) {
          const link = document.createElement("a")
          link.href = item.href
          link.textContent = `${item.id}: ${item.text}`
          results.append(link)
        }
      } catch {
        results.textContent = "Paieškos indeksas nepasiekiamas."
      }
    }
    input.addEventListener("input", () => void render())
  })
  document.querySelectorAll<HTMLElement>("[data-object-evidence-filters]").forEach((root) => {
    if (evidenceFilterRoots.has(root)) return
    evidenceFilterRoots.add(root)
    const buttons = [...root.querySelectorAll<HTMLButtonElement>("[data-evidence-filter]")]
    const page = root.closest<HTMLElement>("[data-object-evidence-page='true']")
    const applyFilter = (selected: string) => {
      for (const item of page?.querySelectorAll<HTMLElement>("[data-evidence-kind]") ?? [])
        item.hidden = selected !== "all" && item.dataset.evidenceKind !== selected
    }
    for (const button of buttons)
      button.addEventListener("click", () => {
        const selected = button.dataset.evidenceFilter || "all"
        applyFilter(selected)
        for (const item of buttons)
          item.setAttribute("aria-pressed", item === button ? "true" : "false")
      })
  })

  document
    .querySelectorAll<HTMLButtonElement>("[data-object-evidence-load-more='true']")
    .forEach((button) => {
      if (evidenceLoadMoreRoots.has(button)) return
      evidenceLoadMoreRoots.add(button)
      button
        .closest<HTMLElement>("[data-object-evidence-page='true']")
        ?.setAttribute("data-object-evidence-lazy-ready", "true")
      button.addEventListener("click", async () => {
        const page = button.closest<HTMLElement>("[data-object-evidence-page='true']")
        const list = page?.querySelector<HTMLElement>(".object-detail-claims")
        const count = page?.querySelector<HTMLElement>("[data-object-evidence-count='true']")
        const nextUrl = button.dataset.nextUrl
        if (!page || !list || !count || !nextUrl) return

        button.disabled = true
        button.textContent = "Kraunama…"
        try {
          const response = await fetch(nextUrl, { cache: "no-cache" })
          if (!response.ok) throw new Error("page")
          const nextDocument = new DOMParser().parseFromString(await response.text(), "text/html")
          const cards = [
            ...nextDocument.querySelectorAll<HTMLElement>(
              ".object-detail-claims > [data-evidence-kind]",
            ),
          ]
          if (!cards.length) throw new Error("empty")
          const selected =
            page.querySelector<HTMLButtonElement>("[data-evidence-filter][aria-pressed='true']")
              ?.dataset.evidenceFilter ?? "all"
          for (const card of cards) {
            card.hidden = selected !== "all" && card.dataset.evidenceKind !== selected
            list.append(card)
          }
          const total = Number(count.dataset.total ?? 0)
          const start = Number(count.dataset.start ?? 1)
          count.textContent = `${start}–${start + list.children.length - 1} iš ${total} rodomų įrašų`

          const nextButton = nextDocument.querySelector<HTMLButtonElement>(
            "[data-object-evidence-load-more='true']",
          )
          const followingUrl = nextButton?.dataset.nextUrl
          if (followingUrl) {
            button.dataset.nextUrl = followingUrl
            button.textContent = nextButton?.textContent || "Rodyti daugiau"
            button.disabled = false
          } else {
            button.remove()
          }
        } catch {
          button.textContent = "Nepavyko užkrauti. Bandyti dar kartą"
          button.disabled = false
        }
      })
    })
}

initObjectEvidenceSearch()
document.addEventListener("nav", initObjectEvidenceSearch)
