import {
  loadSourceCatalog,
  readSettingsState,
  sourceMatchesSelection,
  type SourceCatalogEntry,
} from "../../util/sourceSettings"
import type { ContentMetaDetails } from "../../plugins/emitters/contentIndex"

type ObjectListControlsWindow = Window &
  typeof globalThis & {
    applyQuartzOptionFilters?: () => void
    applyObjectListPagination?: () => void
    loadContentMeta?: () => Promise<Record<string, ContentMetaDetails>>
  }

const objectListWindow = window as ObjectListControlsWindow
const initialized = new WeakSet<HTMLElement>()
const virtualEntries = new WeakMap<HTMLElement, Array<[string, ContentMetaDetails]>>()
let sourceCatalog: SourceCatalogEntry[] = []
const PAGE_SIZE = 50
const typeLabels: Record<string, string> = {
  asmuo: "Asmenys",
  autorius: "Autoriai",
  ivykis: "Įvykiai",
  vieta: "Vietos",
  grupe: "Grupės",
  daiktas: "Daiktai",
  paprotys: "Papročiai",
  posakis: "Posakiai",
  zodyno_irasas: "Sąvokos",
  saltinis: "Šaltiniai",
}

const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>\"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char] ?? char,
  )
const normalizeTitle = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Mark}/gu, "")
    .toLocaleLowerCase("lt")
    .trim()
const hrefFor = (slug: string) => `/${slug.split("/").map(encodeURIComponent).join("/")}`

const decodeTags = (value: string | undefined): string[] =>
  (value ?? "")
    .split("|")
    .map((tag) => {
      try {
        return decodeURIComponent(tag)
      } catch {
        return tag
      }
    })
    .map((tag) => tag.trim())
    .filter(Boolean)

const rootFor = (control: HTMLElement) => control.parentElement ?? document.body
const entriesFor = (control: HTMLElement): HTMLLIElement[] => [
  ...rootFor(control).querySelectorAll<HTMLLIElement>(
    'ul.section-ul[data-object-list-sortable="true"] > li.section-li',
  ),
]
const urlParams = () => new URLSearchParams(location.search)

function updateUrl(update: (value: URLSearchParams) => void) {
  const url = new URL(location.href)
  update(url.searchParams)
  history.replaceState({}, "", url)
}

function selectedTags(control: HTMLElement): string[] {
  return [...control.querySelectorAll<HTMLElement>("[data-object-list-tag-pill]")]
    .map((pill) => String(pill.dataset.tag ?? ""))
    .filter(Boolean)
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
  const mode =
    control.querySelector<HTMLSelectElement>("[data-object-list-sort]")?.value ?? "claims-desc"
  rootFor(control)
    .querySelectorAll<HTMLUListElement>('ul.section-ul[data-object-list-sortable="true"]')
    .forEach((list) => {
      const items = [...list.children].filter(
        (item): item is HTMLLIElement => item instanceof HTMLLIElement,
      )
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
  button.addEventListener("click", () => {
    button.remove()
    applyFilters(control, true)
  })
  container.append(button)
  if (apply) applyFilters(control, true)
}

function createEntry(slug: string, entry: ContentMetaDetails, index: number): HTMLLIElement {
  const item = document.createElement("li")
  item.className = "section-li"
  item.dataset.listSlug = slug
  item.dataset.originalIndex = String(index)
  item.dataset.sortTitle = normalizeTitle(entry.title)
  item.dataset.periodFilterable = "true"
  if (entry.dateStart !== undefined) item.dataset.periodStart = String(entry.dateStart)
  if (entry.dateEnd !== undefined) item.dataset.periodEnd = String(entry.dateEnd)
  const from = Number(urlParams().get("from") ?? "0")
  const to = Number(urlParams().get("to") ?? "2000")
  const hasRange = Number.isFinite(entry.dateStart) && Number.isFinite(entry.dateEnd)
  item.dataset.periodMatch = hasRange
    ? Number(entry.dateStart) <= to && Number(entry.dateEnd) >= from
      ? "true"
      : "false"
    : urlParams().get("unknown") === "0"
      ? "false"
      : "true"
  item.dataset.objectTagMatch = "true"
  item.dataset.optionsMatch = "true"
  item.dataset.listTags = (entry.tags ?? []).map(encodeURIComponent).join("|")
  item.dataset.citationFilterable = entry.citationFilterable ? "true" : "false"
  item.dataset.quoteCount = String(entry.quoteCount ?? 0)
  item.dataset.claimCount = String(entry.claimCount ?? 0)
  item.dataset.citationSources = (entry.citationSourceIds ?? []).join("|")
  const tags = (entry.tags ?? [])
    .map(
      (tag) =>
        `<li><a class="internal tag-link" href="/tags/${encodeURIComponent(tag)}">${escapeHtml(tag)}</a></li>`,
    )
    .join("")
  const period = hasRange
    ? `<span class="period-chip period-chip-date">${escapeHtml(entry.dateStart)}–${escapeHtml(entry.dateEnd)}</span>`
    : ""
  item.innerHTML = `<div class="section"><div class="listing-card-body">
    <div class="listing-card-meta-row"><span class="type-chip">${escapeHtml(typeLabels[entry.itemType ?? ""] ?? entry.itemType ?? "Objektas")}</span><div class="meta-box">${period}</div></div>
    <h3 class="title-row"><a href="${hrefFor(slug)}" class="internal">${escapeHtml(entry.title)}</a></h3>
    ${tags ? `<ul class="tags inline-tags">${tags}</ul>` : ""}
    <p class="listing-evidence-meta">${Number(entry.claimCount ?? 0).toLocaleString("lt-LT")} teig. / ${Number(entry.quoteCount ?? 0).toLocaleString("lt-LT")} cit.</p>
  </div></div>`
  return item
}

async function hydrateEntries(control: HTMLElement) {
  const load = objectListWindow.loadContentMeta
  const prefix = control.dataset.objectListPrefix?.replace(/\/$/, "")
  const list = rootFor(control).querySelector<HTMLUListElement>(
    'ul.section-ul[data-object-list-sortable="true"]',
  )
  if (!load || !prefix || !list || control.dataset.objectListHydrated === "true") return
  control.dataset.objectListHydrated = "loading"
  try {
    const index = await load()
    const candidates = Object.entries(index).filter(
      ([slug]) =>
        slug.startsWith(`${prefix}/`) && slug.split("/").length === prefix.split("/").length + 1,
    )
    virtualEntries.set(control, candidates)
    control.dataset.objectListHydrated = "true"
  } catch {
    control.dataset.objectListHydrated = "error"
  }
}

function eligible(entry: HTMLLIElement): boolean {
  return (
    entry.dataset.periodMatch !== "false" &&
    entry.dataset.optionsMatch !== "false" &&
    entry.dataset.objectTagMatch !== "false"
  )
}

function pageHref(page: number): string {
  const url = new URL(location.href)
  page <= 1 ? url.searchParams.delete("page") : url.searchParams.set("page", String(page))
  return `${url.pathname}${url.search}`
}

function virtualSourceMatch(entry: ContentMetaDetails): boolean {
  const settings = readSettingsState()
  if (settings.textSources.mode === "all" && settings.textSources.rules.length === 0) return true
  return (entry.citationSourceIds ?? []).some((id) => {
    const source = sourceCatalog.find((candidate) => candidate.id === id) ?? {
      id,
      title: id,
      channel: "text" as const,
      kind: "book" as const,
      objectCount: 0,
      claimCount: 0,
      quoteCount: 0,
      mediaCount: 0,
    }
    return sourceMatchesSelection(source, settings.textSources)
  })
}

function virtualCompare(
  mode: string,
  a: [string, ContentMetaDetails],
  b: [string, ContentMetaDetails],
  order: Map<string, number>,
): number {
  const titleA = normalizeTitle(a[1].title)
  const titleB = normalizeTitle(b[1].title)
  const titleCompare = titleA.localeCompare(titleB, "lt", { sensitivity: "base" })
  const original = (order.get(a[0]) ?? 0) - (order.get(b[0]) ?? 0)
  if (mode === "title-asc") return titleCompare || original
  if (mode === "title-desc") return -titleCompare || original
  if (mode === "claims-asc")
    return Number(a[1].claimCount ?? 0) - Number(b[1].claimCount ?? 0) || titleCompare || original
  if (mode === "current") return original
  return Number(b[1].claimCount ?? 0) - Number(a[1].claimCount ?? 0) || titleCompare || original
}

function renderVirtualPage(control: HTMLElement, virtual: Array<[string, ContentMetaDetails]>) {
  const query = normalizeTitle(
    control.querySelector<HTMLInputElement>("[data-object-list-query]")?.value ?? "",
  )
  const tags = selectedTags(control)
  const settings = readSettingsState()
  const currentParams = urlParams()
  const from = Number(currentParams.get("from") ?? "0")
  const to = Number(currentParams.get("to") ?? "2000")
  const includeUnknown = currentParams.get("unknown") !== "0"
  const mode =
    control.querySelector<HTMLSelectElement>("[data-object-list-sort]")?.value ?? "claims-desc"
  const order = new Map(virtual.map(([slug], index) => [slug, index]))
  const filtered = virtual
    .filter(([, entry]) => {
      const hasQuery = !query || normalizeTitle(entry.title).includes(query)
      const hasTags = tags.every((tag) => (entry.tags ?? []).includes(tag))
      const hasPeriod =
        Number.isFinite(entry.dateStart) && Number.isFinite(entry.dateEnd)
          ? Number(entry.dateStart) <= to && Number(entry.dateEnd) >= from
          : includeUnknown
      return (
        hasQuery &&
        hasTags &&
        hasPeriod &&
        Number(entry.claimCount ?? 0) >= settings.minClaimCount &&
        virtualSourceMatch(entry)
      )
    })
    .sort((a, b) => virtualCompare(mode, a, b, order))
  const requested = Math.max(1, Number(currentParams.get("page") ?? "1") || 1)
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(requested, pages)
  const start = (page - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)
  const list = rootFor(control).querySelector<HTMLUListElement>(
    'ul.section-ul[data-object-list-sortable="true"]',
  )
  list?.replaceChildren(
    ...visible.map(([slug, entry], index) => createEntry(slug, entry, start + index)),
  )
  const summary = control.querySelector<HTMLElement>("[data-object-list-summary]")
  const first = filtered.length ? start + 1 : 0
  const last = Math.min(start + PAGE_SIZE, filtered.length)
  if (summary)
    summary.textContent = `Rodoma ${first}–${last} iš ${filtered.length} (iš viso ${virtual.length})`
  const periodSummary = rootFor(control).querySelector<HTMLElement>("[data-period-summary]")
  if (periodSummary) periodSummary.textContent = `Atitinka ${filtered.length} iš ${virtual.length}`
  const previous = control.querySelector<HTMLAnchorElement>("[data-object-list-previous]")
  const next = control.querySelector<HTMLAnchorElement>("[data-object-list-next]")
  const label = control.querySelector<HTMLElement>("[data-object-list-page-label]")
  if (previous) {
    previous.href = pageHref(page - 1)
    previous.setAttribute("aria-disabled", String(page <= 1))
  }
  if (next) {
    next.href = pageHref(page + 1)
    next.setAttribute("aria-disabled", String(page >= pages))
  }
  if (label) label.textContent = `${page} / ${pages}`
}

function paginate(control: HTMLElement) {
  const virtual = virtualEntries.get(control)
  if (virtual) {
    renderVirtualPage(control, virtual)
    return
  }
  const all = entriesFor(control)
  const matches = all.filter(eligible)
  const requested = Math.max(1, Number(urlParams().get("page") ?? "1") || 1)
  const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE))
  const page = Math.min(requested, pages)
  const start = (page - 1) * PAGE_SIZE
  const shown = new Set(matches.slice(start, start + PAGE_SIZE))
  all.forEach((entry) => {
    entry.hidden = !shown.has(entry)
  })

  const summary = control.querySelector<HTMLElement>("[data-object-list-summary]")
  const first = matches.length ? start + 1 : 0
  const last = Math.min(start + PAGE_SIZE, matches.length)
  if (summary)
    summary.textContent = `Rodoma ${first}–${last} iš ${matches.length} (iš viso ${all.length})`
  const previous = control.querySelector<HTMLAnchorElement>("[data-object-list-previous]")
  const next = control.querySelector<HTMLAnchorElement>("[data-object-list-next]")
  const label = control.querySelector<HTMLElement>("[data-object-list-page-label]")
  if (previous) {
    previous.href = pageHref(page - 1)
    previous.setAttribute("aria-disabled", String(page <= 1))
  }
  if (next) {
    next.href = pageHref(page + 1)
    next.setAttribute("aria-disabled", String(page >= pages))
  }
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
    control
      .querySelector<HTMLElement>(
        `[data-object-list-tag-pill][data-tag="${CSS.escape(key.slice(4))}"]`,
      )
      ?.remove()
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
  const query =
    control.querySelector<HTMLInputElement>("[data-object-list-query]")?.value.trim() ?? ""
  const sort = control.querySelector<HTMLSelectElement>("[data-object-list-sort]")
  if (query) active.push(["q", `Paieška: ${query}`])
  if (sort?.value && sort.value !== "claims-desc")
    active.push(["sort", `Rikiavimas: ${sort.selectedOptions[0]?.textContent ?? sort.value}`])
  selectedTags(control).forEach((tag) => active.push([`tag:${tag}`, `#${tag}`]))
  const currentParams = urlParams()
  if (currentParams.has("from")) active.push(["from", `Nuo ${currentParams.get("from")}`])
  if (currentParams.has("to")) active.push(["to", `Iki ${currentParams.get("to")}`])
  if (currentParams.get("unknown") === "0") active.push(["unknown", "Tik su laikotarpiu"])
  const settings = readSettingsState()
  if (settings.minClaimCount > 0)
    active.push(["minClaims", `Nuo ${settings.minClaimCount} teiginių`])
  if (settings.textSources.mode === "custom" || settings.textSources.rules.length > 0)
    active.push(["sources", "Pasirinkti šaltiniai"])
  pills.replaceChildren(
    ...active.map(([key, label]) => {
      const button = document.createElement("button")
      button.type = "button"
      button.textContent = `${label} ×`
      button.addEventListener("click", () => removeFilter(control, key))
      return button
    }),
  )
  wrapper.hidden = active.length === 0
}

function applyFilters(control: HTMLElement, writeUrl = false) {
  const query = normalizeTitle(
    control.querySelector<HTMLInputElement>("[data-object-list-query]")?.value ?? "",
  )
  const tags = selectedTags(control)
  entriesFor(control).forEach((entry) => {
    const hasTags = tags.every((tag) => decodeTags(entry.dataset.listTags).includes(tag))
    const hasQuery = !query || String(entry.dataset.sortTitle ?? "").includes(query)
    entry.dataset.objectTagMatch = hasTags && hasQuery ? "true" : "false"
  })
  sortEntries(control)
  if (writeUrl)
    updateUrl((value) => {
      query ? value.set("q", query) : value.delete("q")
      tags.length ? value.set("tags", tags.join(",")) : value.delete("tags")
      const mode =
        control.querySelector<HTMLSelectElement>("[data-object-list-sort]")?.value ?? "claims-desc"
      mode === "claims-desc" ? value.delete("sort") : value.set("sort", mode)
      value.delete("page")
    })
  renderActiveFilters(control)
  const virtual = virtualEntries.get(control)
  if (virtual) {
    renderVirtualPage(control, virtual)
    return
  }
  if (objectListWindow.applyQuartzOptionFilters) objectListWindow.applyQuartzOptionFilters()
  else paginate(control)
}

function init() {
  document
    .querySelectorAll<HTMLElement>('[data-object-list-controls="true"]')
    .forEach((control) => {
      if (initialized.has(control)) return
      initialized.add(control)
      const url = urlParams()
      const query = control.querySelector<HTMLInputElement>("[data-object-list-query]")
      const sort = control.querySelector<HTMLSelectElement>("[data-object-list-sort]")
      const tagSelect = control.querySelector<HTMLSelectElement>("[data-object-list-tag-select]")
      if (query) query.value = url.get("q") ?? ""
      if (sort) sort.value = url.get("sort") ?? "claims-desc"
      ;(url.get("tags") ?? "")
        .split(",")
        .filter(Boolean)
        .forEach((tag) => addTagPill(control, tag, false))
      query?.addEventListener("input", () => applyFilters(control, true))
      sort?.addEventListener("change", () => applyFilters(control, true))
      tagSelect?.addEventListener("change", () => {
        addTagPill(control, tagSelect.value)
        tagSelect.value = ""
      })
      control
        .querySelector<HTMLButtonElement>("[data-object-list-reset]")
        ?.addEventListener("click", () => {
          if (query) query.value = ""
          if (sort) sort.value = "claims-desc"
          control.querySelector<HTMLElement>("[data-object-list-tag-pills]")?.replaceChildren()
          updateUrl((value) => {
            ;["from", "to", "unknown", "page"].forEach((key) => value.delete(key))
          })
          document.querySelector<HTMLButtonElement>("[data-options-reset]")?.click()
          applyFilters(control, true)
        })
      control
        .querySelectorAll<HTMLAnchorElement>("[data-object-list-pagination] a")
        .forEach((link) =>
          link.addEventListener("click", (event) => {
            if (link.getAttribute("aria-disabled") === "true") event.preventDefault()
          }),
        )
      applyFilters(control)
      void hydrateEntries(control).then(() => applyFilters(control))
    })
}

objectListWindow.applyObjectListPagination = () =>
  document.querySelectorAll<HTMLElement>('[data-object-list-controls="true"]').forEach(paginate)

init()
void loadSourceCatalog().then((catalog) => {
  sourceCatalog = catalog
  objectListWindow.applyObjectListPagination?.()
})
document.addEventListener("nav", init)
document.addEventListener("periodfilterchange", () => {
  document
    .querySelectorAll<HTMLElement>('[data-object-list-controls="true"]')
    .forEach((control) => {
      renderActiveFilters(control)
      paginate(control)
    })
})
document.addEventListener("quartz-settings-change", () => {
  document
    .querySelectorAll<HTMLElement>('[data-object-list-controls="true"]')
    .forEach((control) => {
      renderActiveFilters(control)
      paginate(control)
    })
})
