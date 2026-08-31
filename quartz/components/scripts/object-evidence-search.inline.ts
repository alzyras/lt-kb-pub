type EvidenceSearchItem = {
  kind: "claim" | "citation" | "mention"
  id: string
  text: string
  sources: string[]
  href: string
}

const evidenceSearchRoots = new WeakSet<HTMLElement>()

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
    if (evidenceSearchRoots.has(root)) return
    evidenceSearchRoots.add(root)
    const buttons = [...root.querySelectorAll<HTMLButtonElement>("[data-evidence-filter]")]
    const cards = [...document.querySelectorAll<HTMLElement>("[data-evidence-kind]")]
    for (const button of buttons)
      button.addEventListener("click", () => {
        const selected = button.dataset.evidenceFilter || "all"
        for (const item of cards)
          item.hidden = selected !== "all" && item.dataset.evidenceKind !== selected
        for (const item of buttons)
          item.setAttribute("aria-pressed", item === button ? "true" : "false")
      })
  })
}

initObjectEvidenceSearch()
document.addEventListener("nav", initObjectEvidenceSearch)
