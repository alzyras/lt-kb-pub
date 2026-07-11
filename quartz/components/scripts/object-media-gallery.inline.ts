import PhotoSwipe from "photoswipe"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import type { MediaEntry } from "../../util/objectMedia"
import { displayCaption, displayMeta, relationLabel } from "../../util/objectMedia"
import { readSettingsState, sourceMatchesSelection } from "../../util/sourceSettings"

type GalleryState = {
  q: string
  directness: string
  type: string
  tags: string[]
  object: string
  objectType: string
  period: string
  provider: string
  institution: string
  license: string
  sort: string
}

const PAGE_SIZE = 60
let catalogPromise: Promise<MediaEntry[]> | undefined
const detailCache = new Map<string, Promise<MediaEntry>>()

const text = (value: unknown) => String(value ?? "").replace(/\s+/g, " ").trim()
const displayDate = (value: unknown) => text(value).replace(/\s+date\s+QS:.*$/i, "").trim()
const escapeHtml = (value: unknown) =>
  text(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char] ?? char)

function licenseLabel(value: unknown): string {
  const license = text(value)
  const normalized = license.toLowerCase()
  if (!license) return ""
  if (normalized.includes("public domain") || normalized.includes("pdm")) return "Viešoji sritis"
  if (normalized.includes("cc0")) return "CC0"
  const ccMatch = normalized.match(/cc[-_ ]?(by(?:-sa|-nc|-nd|-nc-sa|-nc-nd)?)\D*([234]\.0)/i)
  if (ccMatch) return `${ccMatch[1].toUpperCase()} ${ccMatch[2]}`
  try {
    const url = new URL(license)
    return url.hostname.replace(/^www\./, "")
  } catch {
    return license
  }
}

function objectHref(notePath: string): string {
  return `/${notePath.replace(/\.md$/i, "").split("/").map(encodeURIComponent).join("/")}`
}

function loadCatalog(): Promise<MediaEntry[]> {
  catalogPromise ??= fetch("/static/mediaCatalog.json")
    .then((response) => {
      if (!response.ok) throw new Error(`media catalog ${response.status}`)
      return response.json()
    })
    .then((value) => (Array.isArray(value) ? value : []))
  return catalogPromise
}

function loadDetail(entry: MediaEntry): Promise<MediaEntry> {
  const mediaId = text(entry.mediaId)
  if (!mediaId) return Promise.resolve(entry)
  let request = detailCache.get(mediaId)
  if (!request) {
    request = fetch(`/static/media/${encodeURIComponent(mediaId)}.json`)
      .then((response) => response.ok ? response.json() : entry)
      .catch(() => entry)
    detailCache.set(mediaId, request)
  }
  return request
}

function stateFromUrl(root: HTMLElement): GalleryState {
  const params = new URLSearchParams(location.search)
  return {
    q: params.get("q") ?? "",
    directness: params.get("directness") ?? "",
    type: params.get("type") ?? "",
    tags: (params.get("tags") ?? "").split(",").filter(Boolean),
    object: root.dataset.objectPath || params.get("object") || "",
    objectType: params.get("objectType") ?? "",
    period: params.get("period") ?? "",
    provider: params.get("provider") ?? "",
    institution: params.get("institution") ?? "",
    license: params.get("license") ?? "",
    sort: params.get("sort") ?? "recommended",
  }
}

function writeUrl(state: GalleryState, mediaId = "", mode: "replace" | "push" = "replace") {
  const url = new URL(location.href)
  const pairs: Array<[string, string]> = [
    ["q", state.q], ["directness", state.directness], ["type", state.type],
    ["tags", state.tags.join(",")], ["object", state.object], ["objectType", state.objectType],
    ["period", state.period], ["provider", state.provider], ["institution", state.institution],
    ["license", state.license], ["sort", state.sort === "recommended" ? "" : state.sort], ["media", mediaId],
  ]
  for (const [key, value] of pairs) value ? url.searchParams.set(key, value) : url.searchParams.delete(key)
  history[mode === "push" ? "pushState" : "replaceState"]({}, "", url)
}

function optionValues(entries: MediaEntry[], getter: (entry: MediaEntry) => string[]): string[] {
  return [...new Set(entries.flatMap(getter).map(text).filter(Boolean))].sort((a, b) => a.localeCompare(b, "lt"))
}

function fillSelect(select: HTMLSelectElement | null, values: string[], label?: (value: string) => string) {
  if (!select) return
  for (const value of values) {
    const option = document.createElement("option")
    option.value = value
    option.textContent = label?.(value) ?? value
    select.append(option)
  }
}

function searchable(entry: MediaEntry): string {
  return [
    entry.caption, entry.originalTitle, entry.title, entry.creator, entry.dateDisplay, entry.institution,
    entry.collection, entry.providerLabel, entry.provider,
    ...(entry.tags ?? []).flatMap((tag) => [tag.code, tag.label]),
    ...(entry.relatedObjects ?? []).flatMap((object) => [object.title, object.notePath, object.itemType]),
  ].map(text).join(" ").toLocaleLowerCase("lt")
}

function providerAllowed(entry: MediaEntry): boolean {
  const settings = readSettingsState()
  return sourceMatchesSelection(
    {
      id: `media-${text(entry.provider).toLowerCase() || "other"}`,
      title: text(entry.providerLabel || entry.provider),
      channel: "media",
      kind: "image",
      objectCount: 0, claimCount: 0, quoteCount: 0, mediaCount: 1,
    },
    settings.mediaSources,
  )
}

function filterEntries(entries: MediaEntry[], state: GalleryState): MediaEntry[] {
  const query = state.q.toLocaleLowerCase("lt").trim()
  const filtered = entries.filter((entry) => {
    const objects = entry.relatedObjects ?? []
    const tags = entry.tags ?? []
    const date = Number(entry.dateStart ?? entry.dateEnd ?? String(entry.dateDisplay ?? "").match(/-?\d{3,4}/)?.[0] ?? 0)
    const periodMatch = !state.period || (state.period === "before-1800" ? date > 0 && date < 1800 : state.period === "1800-1918" ? date >= 1800 && date <= 1918 : state.period === "1919-1990" ? date >= 1919 && date <= 1990 : date >= 1991)
    return providerAllowed(entry)
      && (!query || searchable(entry).includes(query))
      && (!state.directness || entry.directness === state.directness)
      && (!state.type || entry.relationType === state.type)
      && (!state.tags.length || state.tags.every((selected) => tags.some((tag) => tag.code === selected)))
      && (!state.object || objects.some((object) => object.notePath === state.object))
      && (!state.objectType || objects.some((object) => object.itemType === state.objectType))
      && periodMatch
      && (!state.provider || entry.provider === state.provider)
      && (!state.institution || entry.institution === state.institution)
      && (!state.license || entry.license === state.license)
  })
  return filtered.sort((a, b) => {
    if (state.sort === "date-asc") return Number(a.dateStart ?? 999999) - Number(b.dateStart ?? 999999)
    if (state.sort === "date-desc") return Number(b.dateStart ?? -999999) - Number(a.dateStart ?? -999999)
    if (state.sort === "collected-desc") return text(b.firstDiscoveredAt).localeCompare(text(a.firstDiscoveredAt))
    return Number(b.isPrimary ?? 0) - Number(a.isPrimary ?? 0) || Number(b.confidence ?? 0) - Number(a.confidence ?? 0) || displayCaption(a).localeCompare(displayCaption(b), "lt")
  })
}

function card(entry: MediaEntry, index: number): HTMLElement {
  const article = document.createElement("article")
  article.className = "media-gallery-card"
  const tags = (entry.tags ?? []).slice(0, 2)
  article.innerHTML = `<button type="button" data-media-open="${index}" aria-label="Atidaryti: ${escapeHtml(displayCaption(entry))}">
    <span class="media-gallery-card-media"><img src="${escapeHtml(entry.thumbUrl || entry.sourceUrl)}" alt="${escapeHtml(displayCaption(entry))}" loading="lazy" decoding="async"></span>
    <span class="media-gallery-card-copy"><span class="media-card-tags">${tags.map((tag) => `<span class="media-card-tag">${escapeHtml(tag.label)}</span>`).join("")}</span>
    <h2>${escapeHtml(displayCaption(entry))}</h2><span class="media-gallery-card-meta">${escapeHtml(displayMeta(entry))}</span></span>
  </button>`
  return article
}

function detailsHtml(entry: MediaEntry): string {
  const objects = (entry.relatedObjects ?? []).map((object) => `<a href="${objectHref(object.notePath)}">${escapeHtml(object.title)}</a>`).join("")
  const uniqueTags = [...new Map((entry.tags ?? []).map((tag) => [tag.code || tag.label, tag])).values()]
  const tags = uniqueTags.map((tag) => `<button type="button" data-viewer-tag="${escapeHtml(tag.code)}">#${escapeHtml(tag.label)}</button>`).join("")
  const originalTitle = text(entry.originalTitle || entry.title)
  const provenance = [entry.institution, entry.providerLabel || entry.provider, entry.collection].map(text).filter(Boolean).join(" · ")
  return `<h2>${escapeHtml(displayCaption(entry))}</h2>
    ${originalTitle && originalTitle !== displayCaption(entry) ? `<p>${escapeHtml(originalTitle)}</p>` : ""}
    <p>${escapeHtml([entry.creator, displayDate(entry.dateDisplay), relationLabel(entry.relationType)].map(text).filter(Boolean).join(" · "))}</p>
    ${objects ? `<div class="pswp__media-objects">${objects}</div>` : ""}
    ${provenance ? `<p>${escapeHtml(provenance)}</p>` : ""}
    <p>${escapeHtml([licenseLabel(entry.license), entry.attribution].map(text).filter(Boolean).join(" · "))}</p>
    <div class="pswp__media-links">${entry.canonicalUrl ? `<a href="${escapeHtml(entry.canonicalUrl)}" target="_blank" rel="noreferrer noopener">Atidaryti originalą</a>` : ""}${entry.licenseUrl ? `<a href="${escapeHtml(entry.licenseUrl)}" target="_blank" rel="noreferrer noopener">Licencijos sąlygos</a>` : ""}<button type="button" data-copy-media>Kopijuoti nuorodą</button></div>
    ${tags ? `<div class="pswp__media-tags">${tags}</div>` : ""}
    <details><summary>Išplėstiniai duomenys</summary><p>Surinkta: ${escapeHtml(entry.firstDiscoveredAt || "—")} · Peržiūrėta: ${escapeHtml(entry.reviewedAt || "—")} · Patikimumas: ${escapeHtml(entry.confidenceLevel || entry.confidence || "—")}</p><p>${escapeHtml(entry.visualEvidence || "")}</p><p>${escapeHtml(entry.metadataEvidence || entry.judgeReason || "")}</p></details>`
}

function initViewer(root: HTMLElement, getEntries: () => MediaEntry[], state: GalleryState, rerender: () => void) {
  let details: HTMLElement | undefined
  let openedWithPush = false
  const dataSource = () => getEntries().map((entry) => ({
    src: entry.sourceUrl || entry.thumbUrl,
    msrc: entry.thumbUrl || entry.sourceUrl,
    width: Number(entry.width || 1600), height: Number(entry.height || 1200),
    alt: displayCaption(entry), mediaId: entry.mediaId,
  }))
  const lightbox = new PhotoSwipeLightbox({
    dataSource: dataSource(),
    pswpModule: PhotoSwipe,
    bgOpacity: 0.98,
    paddingFn: () => {
      const header = document.querySelector<HTMLElement>(".li-header-shell")
      const mobileBrand = header?.querySelector<HTMLElement>(".li-header-brand")
      const top = Math.ceil((innerWidth <= 700 ? mobileBrand : header)?.getBoundingClientRect().height ?? 0)
      const bottom = Math.ceil(Math.min(innerHeight * (innerWidth <= 700 ? 0.46 : 0.38), innerWidth <= 700 ? 390 : 384))
      return { top, right: 0, bottom, left: 0 }
    },
  })
  lightbox.on("uiRegister", () => {
    lightbox.pswp?.ui?.registerElement({
      name: "media-details", order: 20, appendTo: "root",
      onInit: (element, pswp) => {
        details = element
        element.className = "pswp__media-details"
        const update = async () => {
          const entry = getEntries()[pswp.currIndex]
          if (!entry) return
          const requestedId = entry.mediaId
          element.innerHTML = detailsHtml(entry)
          const detail = await loadDetail(entry)
          if (getEntries()[pswp.currIndex]?.mediaId !== requestedId) return
          element.innerHTML = detailsHtml(detail)
          element.querySelector<HTMLButtonElement>("[data-copy-media]")?.addEventListener("click", async () => {
            const url = new URL(location.href); url.searchParams.set("media", text(detail.mediaId)); await navigator.clipboard.writeText(url.toString())
          })
          element.querySelectorAll<HTMLButtonElement>("[data-viewer-tag]").forEach((button) => button.addEventListener("click", () => {
            const code = button.dataset.viewerTag || ""
            if (code && !state.tags.includes(code)) state.tags.push(code)
            pswp.close(); rerender()
          }))
        }
        pswp.on("change", () => { void update(); const entry = getEntries()[pswp.currIndex]; if (entry) writeUrl(state, text(entry.mediaId)) })
        void update()
      },
    })
  })
  lightbox.on("afterInit", () => {
    document.body.classList.add("media-viewer-open")
  })
  lightbox.on("close", () => {
    document.body.classList.remove("media-viewer-open")
    if (openedWithPush && new URLSearchParams(location.search).has("media")) {
      openedWithPush = false
      history.back()
    } else {
      writeUrl(state)
    }
  })
  lightbox.on("contentLoadImage", ({ content }) => {
    if (content.element instanceof HTMLImageElement) content.element.addEventListener("error", () => {
      if (details) details.insertAdjacentHTML("afterbegin", '<p>Vaizdo nepavyko užkrauti. Naudokite nuorodą „Atidaryti originalą“.</p>')
    }, { once: true })
  })
  lightbox.init()
  root.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("[data-media-open]")
    if (!button) return
    const index = Number(button.dataset.mediaOpen || 0)
    const entry = getEntries()[index]
    openedWithPush = true
    writeUrl(state, text(entry?.mediaId), "push")
    lightbox.loadAndOpen(index)
  })
  window.addEventListener("popstate", () => {
    const mediaId = new URLSearchParams(location.search).get("media")
    if (!mediaId && lightbox.pswp) {
      openedWithPush = false
      lightbox.pswp.close()
      return
    }
    if (mediaId && !lightbox.pswp) {
      const index = getEntries().findIndex((entry) => entry.mediaId === mediaId)
      if (index >= 0) lightbox.loadAndOpen(index)
    }
  })
  return {
    lightbox,
    refresh: () => { lightbox.options.dataSource = dataSource() },
  }
}

async function initGallery(root: HTMLElement) {
  if (root.dataset.ready === "true") return
  root.dataset.ready = "true"
  const catalog = await loadCatalog()
  const state = stateFromUrl(root)
  let visibleLimit = PAGE_SIZE
  let filtered: MediaEntry[] = []
  let refreshViewer = () => {}
  const grid = root.querySelector<HTMLElement>("[data-media-grid]")!
  const count = root.querySelector<HTMLElement>("[data-media-count]")!
  const empty = root.querySelector<HTMLElement>("[data-media-empty]")!
  const loadMore = root.querySelector<HTMLButtonElement>("[data-media-load-more]")!
  const activeFilters = root.querySelector<HTMLElement>("[data-media-active-filters]")!
  const inputs = {
    q: root.querySelector<HTMLInputElement>("[data-media-search]"), directness: root.querySelector<HTMLSelectElement>("[data-media-directness]"),
    type: root.querySelector<HTMLSelectElement>("[data-media-type]"), provider: root.querySelector<HTMLSelectElement>("[data-media-provider]"), sort: root.querySelector<HTMLSelectElement>("[data-media-sort]"),
    tag: root.querySelector<HTMLSelectElement>("[data-media-tag]"), object: root.querySelector<HTMLSelectElement>("[data-media-object]"), objectType: root.querySelector<HTMLSelectElement>("[data-media-object-type]"),
    period: root.querySelector<HTMLSelectElement>("[data-media-period]"), institution: root.querySelector<HTMLSelectElement>("[data-media-institution]"), license: root.querySelector<HTMLSelectElement>("[data-media-license]"),
  }
  fillSelect(inputs.type, optionValues(catalog, (entry) => [text(entry.relationType)]), relationLabel)
  fillSelect(inputs.provider, optionValues(catalog, (entry) => [text(entry.provider)]))
  fillSelect(inputs.tag, optionValues(catalog, (entry) => (entry.tags ?? []).map((tag) => tag.code)), (code) => catalog.flatMap((entry) => entry.tags ?? []).find((tag) => tag.code === code)?.label ?? code)
  fillSelect(inputs.object, optionValues(catalog, (entry) => (entry.relatedObjects ?? []).map((object) => object.notePath)), (path) => catalog.flatMap((entry) => entry.relatedObjects ?? []).find((object) => object.notePath === path)?.title ?? path)
  fillSelect(inputs.objectType, optionValues(catalog, (entry) => (entry.relatedObjects ?? []).map((object) => text(object.itemType))))
  fillSelect(inputs.period, ["before-1800", "1800-1918", "1919-1990", "1991-now"], (value) => ({"before-1800":"Iki 1800", "1800-1918":"1800–1918", "1919-1990":"1919–1990", "1991-now":"Nuo 1991"})[value] ?? value)
  fillSelect(inputs.institution, optionValues(catalog, (entry) => [text(entry.institution)]))
  fillSelect(inputs.license, optionValues(catalog, (entry) => [text(entry.license)]), licenseLabel)
  if (inputs.q) inputs.q.value = state.q
  for (const [key, input] of Object.entries(inputs)) if (input && key !== "q" && key !== "tag") input.value = String(state[key as keyof GalleryState] ?? "")

  const render = () => {
    filtered = filterEntries(catalog, state)
    grid.replaceChildren(...filtered.slice(0, visibleLimit).map(card))
    count.textContent = `${filtered.length} ${filtered.length === 1 ? "vaizdas" : "vaizdų"}`
    empty.hidden = filtered.length > 0
    loadMore.hidden = filtered.length <= visibleLimit
    const chips: Array<[string, string]> = state.tags.map((tag) => [`tag:${tag}`, catalog.flatMap((entry) => entry.tags ?? []).find((entry) => entry.code === tag)?.label ?? tag])
    activeFilters.innerHTML = chips.map(([key, label]) => `<button class="media-filter-chip" data-remove-filter="${escapeHtml(key)}">${escapeHtml(label)} ×</button>`).join("")
    activeFilters.querySelectorAll<HTMLButtonElement>("[data-remove-filter]").forEach((button) => button.addEventListener("click", () => { state.tags = state.tags.filter((tag) => `tag:${tag}` !== button.dataset.removeFilter); render() }))
    writeUrl(state, new URLSearchParams(location.search).get("media") || "")
    refreshViewer()
  }
  const update = (key: keyof GalleryState, value: string) => { (state[key] as string) = value; visibleLimit = PAGE_SIZE; render() }
  inputs.q?.addEventListener("input", () => update("q", inputs.q?.value ?? ""))
  for (const key of ["directness", "type", "provider", "sort", "object", "objectType", "period", "institution", "license"] as const) inputs[key]?.addEventListener("change", () => update(key, inputs[key]?.value ?? ""))
  inputs.tag?.addEventListener("change", () => { const value = inputs.tag?.value ?? ""; if (value && !state.tags.includes(value)) state.tags.push(value); if (inputs.tag) inputs.tag.value = ""; render() })
  root.querySelector<HTMLButtonElement>("[data-media-reset]")?.addEventListener("click", () => { Object.assign(state, { q:"",directness:"",type:"",tags:[],object:root.dataset.objectPath || "",objectType:"",period:"",provider:"",institution:"",license:"",sort:"recommended" }); location.search = state.object && !root.dataset.objectPath ? `?object=${encodeURIComponent(state.object)}` : "" })
  loadMore.addEventListener("click", () => { visibleLimit += PAGE_SIZE; render() })
  root.addEventListener("media-settings-refresh", render)
  render()
  const viewer = initViewer(root, () => filtered, state, render)
  refreshViewer = viewer.refresh
  refreshViewer()
  const requested = new URLSearchParams(location.search).get("media")
  if (requested) { const index = filtered.findIndex((entry) => entry.mediaId === requested); if (index >= 0) viewer.lightbox.loadAndOpen(index) }
}

document.querySelectorAll<HTMLElement>("[data-media-gallery]").forEach((root) => void initGallery(root))
document.addEventListener("quartz-settings-change", () => document.querySelectorAll<HTMLElement>("[data-media-gallery]").forEach((root) => root.dispatchEvent(new Event("media-settings-refresh"))))
