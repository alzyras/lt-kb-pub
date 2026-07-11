import { readSettingsState } from "../../util/sourceSettings"

type ObjectListControlsWindow = Window & typeof globalThis & {
  applyQuartzOptionFilters?: () => void
  applyObjectListPagination?: () => void
}

const objectListWindow = window as ObjectListControlsWindow
const initialized = new WeakSet<HTMLElement>()
const PAGE_SIZE = 50

const decodeTags = (value: string | undefined): string[] =>
  (value ?? "").split("|").map((tag) => {
    try { return decodeURIComponent(tag) } catch { return tag }
  }).map((tag) => tag.trim()).filter(Boolean)

const rootFor = (control: HTMLElement) => control.parentElement ?? document.body
const entriesFor = (control: HTMLElement): HTMLLIElement[] =>
  [...rootFor(control).querySelectorAll<HTMLLIElement>('ul.section-ul[data-object-list-sortable="true"] > li.section-li')]
const urlParams = () => new URLSearchParams(location.search)

function updateUrl(update: (value: URLSearchParams) => void) {
  const url = new URL(location.href)
  update(url.searchParams)
  history.replaceState({}, "", url)
}

function selectedTags(control: HTMLElement): string[] {
  return [...control.querySelectorAll<HTMLElement>("[data-object-list-tag-pill]")]
    .map((pill) => String(pill.dataset.tag ?? "")).filter(Boolean)
}

function compare(mode: string, a: HTMLLIElement, b: HTMLLIElement): number {
  const titleA = String(a.dataset.sortTitle ?? "")
  const titleB = String(b.dataset.sortTitle ?? "")
  const claimsA = Number(a.dataset.claimCount ?? "0")
  const claimsB = Number(b.dataset.claimCount ?? "0")
  const originalA = Number(a.dataset.originalIndex ?? "0")
  const originalB = Number(b.dataset.originalIndex ?? "0")
  const titleCompare = titleA.localeCompare(titleB, "lt", { sensitivity: "base" })
  if (mode === "title-asc") return titleCompare || originalA - originalB
  if (mode === "title-desc") return -titleCompare || originalA - originalB
  if (mode === "claims-asc") return claimsA - claimsB || titleCompare || originalA - originalB
  if (mode === "current") return originalA - originalB
  return claimsB - claimsA || titleCompare || originalA - originalB
}

function sortEntries(control: HTMLElement) {
  const mode = control.querySelector<HTMLSelectElement>("[data-object-list-sort]")?.value ?? "claims-desc"
  rootFor(control).querySelectorAll<HTMLUListElement>('ul.section-ul[data-object-list-sortable="true"]').forEach((list) => {
    const items = [...list.children].filter((item): item is HTMLLIElement => item instanceof HTMLLIElement)
    items.sort((a, b) => compare(mode, a, b)).forEach((item) => list.append(item))
  })
}

function addTagPill(control: HTMLElement, tag: string, apply = true) {
  if (!tag || selectedTags(control).includes(tag)) return
  const container = control.querySelector<HTMLElement>("[data-object-list-tag-pills]")
  if (!container) return
  const button = document.createElement("button")
  button.type = "button"
  button.className = "object-list-tag-pill"
  button.dataset.objectListTagPill = "true"
  button.dataset.tag = tag
  button.textContent = `#${tag} ×`
  button.setAttribute("aria-label", `Pašalinti tagą ${tag}`)
  button.addEventListener("click", () => { button.remove(); applyFilters(control, true) })
  container.append(button)
  if (apply) applyFilters(control, true)
}

function eligible(entry: HTMLLIElement): boolean {
  return entry.dataset.periodMatch !== "false"
    && entry.dataset.optionsMatch !== "false"
    && entry.dataset.objectTagMatch !== "false"
}

function pageHref(page: number): string {
  const url = new URL(location.href)
  page <= 1 ? url.searchParams.delete("page") : url.searchParams.set("page", String(page))
  return `${url.pathname}${url.search}`
}

function paginate(control: HTMLElement) {
  const all = entriesFor(control)
  const matches = all.filter(eligible)
  const requested = Math.max(1, Number(urlParams().get("page") ?? "1") || 1)
  const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE))
  const page = Math.min(requested, pages)
  const start = (page - 1) * PAGE_SIZE
  const shown = new Set(matches.slice(start, start + PAGE_SIZE))
  all.forEach((entry) => { entry.hidden = !shown.has(entry) })

  const summary = control.querySelector<HTMLElement>("[data-object-list-summary]")
  const first = matches.length ? start + 1 : 0
  const last = Math.min(start + PAGE_SIZE, matches.length)
  if (summary) summary.textContent = `Rodoma ${first}–${last} iš ${matches.length} (iš viso ${all.length})`
  const previous = control.querySelector<HTMLAnchorElement>("[data-object-list-previous]")
  const next = control.querySelector<HTMLAnchorElement>("[data-object-list-next]")
  const label = control.querySelector<HTMLElement>("[data-object-list-page-label]")
  if (previous) { previous.href = pageHref(page - 1); previous.setAttribute("aria-disabled", String(page <= 1)) }
  if (next) { next.href = pageHref(page + 1); next.setAttribute("aria-disabled", String(page >= pages)) }
  if (label) label.textContent = `${page} / ${pages}`
}

function removeFilter(control: HTMLElement, key: string) {
  if (key === "q") {
    const input = control.querySelector<HTMLInputElement>("[data-object-list-query]")
    if (input) input.value = ""
  } else if (key === "sort") {
    const select = control.querySelector<HTMLSelectElement>("[data-object-list-sort]")
    if (select) select.value = "claims-desc"
  } else if (key.startsWith("tag:")) {
    control.querySelector<HTMLElement>(`[data-object-list-tag-pill][data-tag="${CSS.escape(key.slice(4))}"]`)?.remove()
  } else if (["from", "to", "unknown"].includes(key)) {
    updateUrl((value) => value.delete(key))
    const period = rootFor(control).querySelector<HTMLElement>("[data-period-filter-controls]")
    const start = period?.querySelector<HTMLInputElement>('[data-period-input="start"]')
    const end = period?.querySelector<HTMLInputElement>('[data-period-input="end"]')
    const unknown = period?.querySelector<HTMLInputElement>('[data-period-input="unknown"]')
    if (start) start.value = urlParams().get("from") ?? start.min
    if (end) end.value = urlParams().get("to") ?? end.max
    if (unknown) unknown.checked = urlParams().get("unknown") !== "0"
    const input = key === "from" ? start : key === "to" ? end : unknown
    input?.dispatchEvent(new Event(key === "unknown" ? "change" : "input", { bubbles: true }))
  } else if (key === "minClaims" || key === "sources") {
    document.querySelector<HTMLButtonElement>("[data-options-reset]")?.click()
  }
  applyFilters(control, true)
}

function renderActiveFilters(control: HTMLElement) {
  const wrapper = control.querySelector<HTMLElement>("[data-object-list-active-filters]")
  const pills = control.querySelector<HTMLElement>("[data-object-list-active-pills]")
  if (!wrapper || !pills) return
  const active: Array<[string, string]> = []
  const query = control.querySelector<HTMLInputElement>("[data-object-list-query]")?.value.trim() ?? ""
  const sort = control.querySelector<HTMLSelectElement>("[data-object-list-sort]")
  if (query) active.push(["q", `Paieška: ${query}`])
  if (sort?.value && sort.value !== "claims-desc") active.push(["sort", `Rikiavimas: ${sort.selectedOptions[0]?.textContent ?? sort.value}`])
  selectedTags(control).forEach((tag) => active.push([`tag:${tag}`, `#${tag}`]))
  const currentParams = urlParams()
  if (currentParams.has("from")) active.push(["from", `Nuo ${currentParams.get("from")}`])
  if (currentParams.has("to")) active.push(["to", `Iki ${currentParams.get("to")}`])
  if (currentParams.get("unknown") === "0") active.push(["unknown", "Tik su laikotarpiu"])
  const settings = readSettingsState()
  if (settings.minClaimCount > 0) active.push(["minClaims", `Nuo ${settings.minClaimCount} teiginių`])
  if (settings.textSources.mode === "custom" || settings.textSources.rules.length > 0) active.push(["sources", "Pasirinkti šaltiniai"])
  pills.replaceChildren(...active.map(([key, label]) => {
    const button = document.createElement("button")
    button.type = "button"
    button.textContent = `${label} ×`
    button.addEventListener("click", () => removeFilter(control, key))
    return button
  }))
  wrapper.hidden = active.length === 0
}

function applyFilters(control: HTMLElement, writeUrl = false) {
  const query = control.querySelector<HTMLInputElement>("[data-object-list-query]")?.value.toLocaleLowerCase("lt").trim() ?? ""
  const tags = selectedTags(control)
  entriesFor(control).forEach((entry) => {
    const hasTags = tags.every((tag) => decodeTags(entry.dataset.listTags).includes(tag))
    const hasQuery = !query || String(entry.dataset.sortTitle ?? "").includes(query)
    entry.dataset.objectTagMatch = hasTags && hasQuery ? "true" : "false"
  })
  sortEntries(control)
  if (writeUrl) updateUrl((value) => {
    query ? value.set("q", query) : value.delete("q")
    tags.length ? value.set("tags", tags.join(",")) : value.delete("tags")
    const mode = control.querySelector<HTMLSelectElement>("[data-object-list-sort]")?.value ?? "claims-desc"
    mode === "claims-desc" ? value.delete("sort") : value.set("sort", mode)
    value.delete("page")
  })
  renderActiveFilters(control)
  if (objectListWindow.applyQuartzOptionFilters) objectListWindow.applyQuartzOptionFilters()
  else paginate(control)
}

function init() {
  document.querySelectorAll<HTMLElement>('[data-object-list-controls="true"]').forEach((control) => {
    if (initialized.has(control)) return
    initialized.add(control)
    const url = urlParams()
    const query = control.querySelector<HTMLInputElement>("[data-object-list-query]")
    const sort = control.querySelector<HTMLSelectElement>("[data-object-list-sort]")
    const tagSelect = control.querySelector<HTMLSelectElement>("[data-object-list-tag-select]")
    if (query) query.value = url.get("q") ?? ""
    if (sort) sort.value = url.get("sort") ?? "claims-desc"
    ;(url.get("tags") ?? "").split(",").filter(Boolean).forEach((tag) => addTagPill(control, tag, false))
    query?.addEventListener("input", () => applyFilters(control, true))
    sort?.addEventListener("change", () => applyFilters(control, true))
    tagSelect?.addEventListener("change", () => { addTagPill(control, tagSelect.value); tagSelect.value = "" })
    control.querySelector<HTMLButtonElement>("[data-object-list-reset]")?.addEventListener("click", () => {
      if (query) query.value = ""
      if (sort) sort.value = "claims-desc"
      control.querySelector<HTMLElement>("[data-object-list-tag-pills]")?.replaceChildren()
      updateUrl((value) => { ["from", "to", "unknown", "page"].forEach((key) => value.delete(key)) })
      document.querySelector<HTMLButtonElement>("[data-options-reset]")?.click()
      applyFilters(control, true)
    })
    control.querySelectorAll<HTMLAnchorElement>("[data-object-list-pagination] a").forEach((link) => link.addEventListener("click", (event) => {
      if (link.getAttribute("aria-disabled") === "true") event.preventDefault()
    }))
    applyFilters(control)
  })
}

objectListWindow.applyObjectListPagination = () =>
  document.querySelectorAll<HTMLElement>('[data-object-list-controls="true"]').forEach(paginate)

init()
document.addEventListener("nav", init)
document.addEventListener("periodfilterchange", () => {
  document.querySelectorAll<HTMLElement>('[data-object-list-controls="true"]').forEach((control) => {
    renderActiveFilters(control)
    paginate(control)
  })
})
document.addEventListener("quartz-settings-change", () => {
  document.querySelectorAll<HTMLElement>('[data-object-list-controls="true"]').forEach((control) => {
    renderActiveFilters(control)
    paginate(control)
  })
})
