import createJustifiedLayout from "justified-layout"
import PhotoSwipe from "photoswipe"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import type { MediaEntry } from "../../util/objectMedia"
import { cleanText, displayCaption, relationLabel } from "../../util/objectMedia"
import {
  buildMediaSearchIndex,
  computeDynamicFacetCounts,
  computeFacetSummary,
  emptyGalleryState,
  filterMediaEntries,
  MEDIA_GALLERY_PAGE_SIZE,
  mediaLicenseLabel,
  parseGalleryState,
  serializeGalleryState,
  type GalleryState,
  type MediaFacetKey,
  type MediaFacetSummary,
  type MediaGalleryBootstrap,
  type MediaSearchIndex,
} from "../../util/mediaGallery"
import { readSettingsState, sourceMatchesSelection } from "../../util/sourceSettings"

const FACET_KEYS: MediaFacetKey[] = ["types", "directness", "objects", "tags", "periods", "objectTypes", "providers", "institutions", "licenses"]
const FACET_VISIBLE_LIMIT: Partial<Record<MediaFacetKey, number>> = { objects: 24, tags: 18 }
const facetVisibleLimit = (key: MediaFacetKey) => FACET_VISIBLE_LIMIT[key] ?? 10
const catalogRequests = new Map<string, Promise<MediaEntry[]>>()
const detailCache = new Map<string, Promise<MediaEntry>>()

const text = (value: unknown) => cleanText(value)
const displayDate = (value: unknown) => text(value).replace(/\s+date\s+QS:.*$/i, "").trim()
const escapeHtml = (value: unknown) => text(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char] ?? char)

function parseBootstrap(root: HTMLElement): MediaGalleryBootstrap {
  try {
    const raw = root.querySelector<HTMLScriptElement>("[data-media-bootstrap]")?.textContent ?? ""
    const value = JSON.parse(raw)
    if (value && Array.isArray(value.initialEntries)) return value as MediaGalleryBootstrap
  } catch {}
  return {
    initialEntries: [], totalCount: 0, facetSummary: computeFacetSummary([]),
    catalogUrl: root.dataset.catalogUrl || "/static/mediaCatalog.json", catalogVersion: root.dataset.catalogVersion || "unknown",
  }
}

function loadCatalog(url: string, retry = false): Promise<MediaEntry[]> {
  if (retry) catalogRequests.delete(url)
  let request = catalogRequests.get(url)
  if (!request) {
    request = fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`media catalog ${response.status}`)
        return response.json()
      })
      .then((value) => Array.isArray(value) ? value : [])
    catalogRequests.set(url, request)
  }
  return request
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

function providerAllowed(entry: MediaEntry): boolean {
  const settings = readSettingsState()
  return sourceMatchesSelection({
    id: `media-${text(entry.provider).toLowerCase() || "other"}`,
    title: text(entry.providerLabel || entry.provider), channel: "media", kind: "image",
    objectCount: 0, claimCount: 0, quoteCount: 0, mediaCount: 1,
  }, settings.mediaSources)
}

function objectHref(notePath: string): string {
  return `/${notePath.replace(/\.md$/i, "").split("/").map(encodeURIComponent).join("/")}`
}

function galleryUrl(state: GalleryState, mediaId = ""): string {
  return `${location.pathname}${serializeGalleryState(state, mediaId)}${location.hash}`
}

function writeUrl(state: GalleryState, mediaId = "", mode: "replace" | "push" = "replace") {
  history[mode === "push" ? "pushState" : "replaceState"]({}, "", galleryUrl(state, mediaId))
}

function stateValues(state: GalleryState, key: MediaFacetKey): string[] {
  if (key === "types") return state.types
  if (key === "objects") return state.objects
  if (key === "objectTypes") return state.objectTypes
  if (key === "periods") return state.periods
  if (key === "providers") return state.providers
  if (key === "institutions") return state.institutions
  if (key === "licenses") return state.licenses
  return state[key]
}

function setStateValues(state: GalleryState, key: MediaFacetKey, values: string[]) {
  if (key === "types") state.types = values
  else if (key === "objects") state.objects = values
  else if (key === "objectTypes") state.objectTypes = values
  else if (key === "periods") state.periods = values
  else if (key === "providers") state.providers = values
  else if (key === "institutions") state.institutions = values
  else if (key === "licenses") state.licenses = values
  else state[key] = values
}

function card(entry: MediaEntry, index: number): HTMLElement {
  const article = document.createElement("article")
  article.className = "media-gallery-card"
  article.dataset.mediaId = text(entry.mediaId)
  const caption = displayCaption(entry)
  const date = displayDate(entry.dateDisplay)
  const creator = text(entry.creator)
  const objects = (entry.relatedObjects ?? []).slice(0, 2).map((object) => object.title).join(" · ")
  article.innerHTML = `<button type="button" data-media-open="${index}" aria-label="Atidaryti: ${escapeHtml(caption)}">
    <span class="media-gallery-card-media"><img src="${escapeHtml(entry.thumbUrl || entry.sourceUrl)}" alt="${escapeHtml(caption)}" ${entry.width ? `width="${Number(entry.width)}"` : ""} ${entry.height ? `height="${Number(entry.height)}"` : ""} loading="lazy" decoding="async">
    <span class="media-gallery-card-overlay"><span class="media-gallery-card-title">${escapeHtml(caption)}</span>${date ? `<span>${escapeHtml(date)}</span>` : ""}</span>
    <span class="media-gallery-card-hover" aria-hidden="true"><span>${escapeHtml(creator)}</span><span>${escapeHtml(objects)}</span></span></span></button>`
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
    <p>${escapeHtml([mediaLicenseLabel(entry.license), entry.attribution].map(text).filter(Boolean).join(" · "))}</p>
    <div class="pswp__media-links">${entry.canonicalUrl ? `<a href="${escapeHtml(entry.canonicalUrl)}" target="_blank" rel="noreferrer noopener">Atidaryti originalą</a>` : ""}${entry.licenseUrl ? `<a href="${escapeHtml(entry.licenseUrl)}" target="_blank" rel="noreferrer noopener">Licencijos sąlygos</a>` : ""}<button type="button" data-copy-media>Kopijuoti nuorodą</button></div>
    ${tags ? `<div class="pswp__media-tags">${tags}</div>` : ""}
    <details><summary>Išplėstiniai duomenys</summary><p>Surinkta: ${escapeHtml(entry.firstDiscoveredAt || "—")} · Peržiūrėta: ${escapeHtml(entry.reviewedAt || "—")} · Patikimumas: ${escapeHtml(entry.confidenceLevel || entry.confidence || "—")}</p><p>${escapeHtml(entry.visualEvidence || "")}</p><p>${escapeHtml(entry.metadataEvidence || entry.judgeReason || "")}</p></details>`
}

function initViewer(root: HTMLElement, getEntries: () => MediaEntry[], getState: () => GalleryState, rerender: () => void) {
  let details: HTMLElement | undefined
  let openedWithPush = false
  const dataSource = () => getEntries().map((entry) => ({
    src: entry.sourceUrl || entry.thumbUrl, msrc: entry.thumbUrl || entry.sourceUrl,
    width: Number(entry.width || 1600), height: Number(entry.height || 1200),
    alt: displayCaption(entry), mediaId: entry.mediaId,
  }))
  const lightbox = new PhotoSwipeLightbox({
    dataSource: dataSource(), pswpModule: PhotoSwipe, bgOpacity: 0.98,
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
            await navigator.clipboard.writeText(new URL(galleryUrl(getState(), text(detail.mediaId)), location.origin).toString())
          })
          element.querySelectorAll<HTMLButtonElement>("[data-viewer-tag]").forEach((button) => button.addEventListener("click", () => {
            const code = button.dataset.viewerTag || ""
            const state = getState()
            if (code && !state.tags.includes(code)) state.tags.push(code)
            pswp.close(); rerender()
          }))
        }
        pswp.on("change", () => { void update(); const entry = getEntries()[pswp.currIndex]; if (entry) writeUrl(getState(), text(entry.mediaId)) })
        void update()
      },
    })
  })
  lightbox.on("afterInit", () => document.body.classList.add("media-viewer-open"))
  lightbox.on("close", () => {
    document.body.classList.remove("media-viewer-open")
    if (openedWithPush && new URLSearchParams(location.search).has("media")) { openedWithPush = false; history.back() }
    else writeUrl(getState())
  })
  lightbox.on("contentLoadImage", ({ content }) => {
    if (content.element instanceof HTMLImageElement) content.element.addEventListener("error", () => {
      details?.insertAdjacentHTML("afterbegin", '<p class="media-viewer-error">Vaizdo nepavyko užkrauti. Atidarykite originalą šaltinio svetainėje.</p>')
    }, { once: true })
  })
  lightbox.init()
  root.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("[data-media-open]")
    if (!button) return
    const index = Number(button.dataset.mediaOpen || 0)
    openedWithPush = true
    writeUrl(getState(), text(getEntries()[index]?.mediaId), "push")
    lightbox.loadAndOpen(index)
  })
  return { lightbox, refresh: () => { lightbox.options.dataSource = dataSource() } }
}

function applyJustifiedLayout(grid: HTMLElement, entries: MediaEntry[]) {
  const cards = [...grid.querySelectorAll<HTMLElement>(".media-gallery-card")]
  if (innerWidth <= 700 || !cards.length) {
    grid.classList.remove("is-justified")
    grid.style.removeProperty("height")
    cards.forEach((card) => card.removeAttribute("style"))
    return
  }
  const width = grid.clientWidth
  if (!width) return
  const ratios = entries.slice(0, cards.length).map((entry) => {
    const ratio = Number(entry.width || 4) / Number(entry.height || 3)
    return Number.isFinite(ratio) && ratio > 0 ? ratio : 4 / 3
  })
  const layout = createJustifiedLayout(ratios, {
    containerWidth: width, containerPadding: 0, boxSpacing: 10,
    targetRowHeight: innerWidth < 1050 ? 190 : 245, targetRowHeightTolerance: 0.2,
    showWidows: true, widowLayoutStyle: "left",
  })
  grid.classList.add("is-justified")
  grid.style.height = `${Math.ceil(layout.containerHeight)}px`
  cards.forEach((card, index) => {
    const box = layout.boxes[index]
    if (!box) return
    Object.assign(card.style, { left: `${box.left}px`, top: `${box.top}px`, width: `${box.width}px`, height: `${box.height}px` })
  })
}

function renderFacetOptions(root: HTMLElement, state: GalleryState, base: MediaFacetSummary, counts: MediaFacetSummary) {
  for (const key of FACET_KEYS) {
    const group = root.querySelector<HTMLElement>(`[data-facet-group="${key}"]`)
    const container = group?.querySelector<HTMLElement>("[data-facet-options]")
    if (!group || !container) continue
    const selected = stateValues(state, key)
    const countMap = new Map((counts[key] ?? []).map((option) => [option.value, option.count]))
    const options = [...(base[key] ?? [])]
    selected.forEach((value) => {
      if (!options.some((option) => option.value === value)) options.push({ value, label: value, count: 0 })
    })
    const visibleLimit = facetVisibleLimit(key)
    container.innerHTML = options.map((option, index) => `<label class="media-facet-option" data-facet-option ${index >= visibleLimit ? 'data-facet-extra="true"' : ""}>
      <input type="checkbox" value="${escapeHtml(option.value)}" data-facet-input="${key}" ${selected.includes(option.value) ? "checked" : ""}>
      <span class="media-facet-check" aria-hidden="true"></span><span class="media-facet-label">${escapeHtml(option.label)}</span><span class="media-facet-count">${countMap.get(option.value) ?? 0}</span></label>`).join("")
    const selectedCount = group.querySelector<HTMLElement>("[data-facet-selected-count]")
    if (selectedCount) selectedCount.textContent = selected.length ? String(selected.length) : ""
    group.classList.toggle("has-selection", selected.length > 0)
    const expand = group.querySelector<HTMLButtonElement>("[data-facet-expand]")
    if (expand) {
      expand.hidden = options.length <= 8
      expand.textContent = group.dataset.expanded === "true" ? "Rodyti mažiau" : `Rodyti visus (${options.length})`
    }
  }
}

function activeFilterCount(state: GalleryState): number {
  return FACET_KEYS.reduce((sum, key) => sum + stateValues(state, key).length, state.q ? 1 : 0)
}

function initGallery(root: HTMLElement) {
  if (root.dataset.ready === "true") return
  root.dataset.ready = "true"
  const bootstrap = parseBootstrap(root)
  const lockedObject = root.dataset.objectPath || bootstrap.lockedObject || ""
  let state = parseGalleryState(location.search, lockedObject)
  let catalog = bootstrap.initialEntries
  let catalogComplete = false
  let searchIndex: MediaSearchIndex = buildMediaSearchIndex(catalog)
  let baseFacets = bootstrap.facetSummary
  let visibleLimit = MEDIA_GALLERY_PAGE_SIZE
  let filtered: MediaEntry[] = []
  let refreshViewer = () => {}

  const grid = root.querySelector<HTMLElement>("[data-media-grid]")!
  const count = root.querySelector<HTMLElement>("[data-media-count]")!
  const mobileCount = root.querySelector<HTMLElement>("[data-media-mobile-count]")!
  const empty = root.querySelector<HTMLElement>("[data-media-empty]")!
  const activeFilters = root.querySelector<HTMLElement>("[data-media-active-filters]")!
  const search = root.querySelector<HTMLInputElement>("[data-media-search]")!
  const clearSearch = root.querySelector<HTMLButtonElement>("[data-media-search-clear]")!
  const sort = root.querySelector<HTMLSelectElement>("[data-media-sort]")!
  const status = root.querySelector<HTMLElement>("[data-media-status]")!
  const statusText = root.querySelector<HTMLElement>("[data-media-status-text]")!
  const sentinel = root.querySelector<HTMLElement>("[data-media-sentinel]")!
  const filterBadge = root.querySelector<HTMLElement>("[data-media-filter-badge]")!

  const showStatus = (message = "") => {
    status.hidden = !message
    statusText.textContent = message
  }

  const syncInputs = () => {
    search.value = state.q
    clearSearch.hidden = !state.q
    sort.value = state.sort
    const selected = activeFilterCount(state)
    filterBadge.hidden = selected === 0
    filterBadge.textContent = String(selected)
  }

  const labels = () => Object.fromEntries(FACET_KEYS.map((key) => [key, new Map((baseFacets[key] ?? []).map((option) => [option.value, option.label]))])) as Record<MediaFacetKey, Map<string, string>>

  const layout = () => requestAnimationFrame(() => applyJustifiedLayout(grid, filtered.slice(0, visibleLimit)))

  const render = (writeState = true) => {
    filtered = filterMediaEntries(catalog, state, searchIndex, { lockedObject, providerAllowed })
    grid.replaceChildren(...filtered.slice(0, visibleLimit).map(card))
    const shownCount = catalogComplete ? filtered.length : (activeFilterCount(state) ? filtered.length : bootstrap.totalCount)
    count.textContent = `${shownCount} ${shownCount === 1 ? "vaizdas" : "vaizdų"}`
    mobileCount.textContent = String(shownCount)
    empty.hidden = filtered.length > 0 || (!catalogComplete && bootstrap.totalCount > 0)
    sentinel.hidden = !catalogComplete || visibleLimit >= filtered.length
    const dynamicCounts = computeDynamicFacetCounts(catalog, state, searchIndex, lockedObject, providerAllowed)
    renderFacetOptions(root, state, baseFacets, dynamicCounts)
    const optionLabels = labels()
    const chips = FACET_KEYS.flatMap((key) => stateValues(state, key).map((value) => ({ key, value, label: optionLabels[key].get(value) ?? value })))
    activeFilters.innerHTML = chips.map(({ key, value, label }) => `<button type="button" class="media-filter-chip" data-remove-facet="${key}" data-remove-value="${escapeHtml(value)}">${escapeHtml(label)} <span aria-hidden="true">×</span></button>`).join("")
    syncInputs()
    refreshViewer()
    layout()
    if (writeState) writeUrl(state, new URLSearchParams(location.search).get("media") || "")
  }

  const reset = () => { state = emptyGalleryState(); visibleLimit = MEDIA_GALLERY_PAGE_SIZE; render() }
  const closeFilters = () => { root.classList.remove("filters-open"); document.body.classList.remove("media-filters-open") }

  root.addEventListener("change", (event) => {
    const input = (event.target as Element).closest<HTMLInputElement>("[data-facet-input]")
    if (!input) return
    const key = input.dataset.facetInput as MediaFacetKey
    const values = new Set(stateValues(state, key))
    input.checked ? values.add(input.value) : values.delete(input.value)
    setStateValues(state, key, [...values])
    visibleLimit = MEDIA_GALLERY_PAGE_SIZE
    render()
  })
  root.addEventListener("click", (event) => {
    const target = event.target as Element
    if (target.closest("[data-media-reset]")) { reset(); closeFilters(); return }
    if (target.closest("[data-media-filter-open]")) { root.classList.add("filters-open"); document.body.classList.add("media-filters-open"); return }
    if (target.closest("[data-media-filter-close]")) { closeFilters(); return }
    if (target.closest("[data-media-search-clear]")) { state.q = ""; visibleLimit = MEDIA_GALLERY_PAGE_SIZE; render(); search.focus(); return }
    const remove = target.closest<HTMLButtonElement>("[data-remove-facet]")
    if (remove) {
      const key = remove.dataset.removeFacet as MediaFacetKey
      setStateValues(state, key, stateValues(state, key).filter((value) => value !== remove.dataset.removeValue))
      render(); return
    }
    const expand = target.closest<HTMLButtonElement>("[data-facet-expand]")
    if (expand) {
      const group = expand.closest<HTMLElement>("[data-facet-group]")!
      group.dataset.expanded = group.dataset.expanded === "true" ? "false" : "true"
      expand.textContent = group.dataset.expanded === "true" ? "Rodyti mažiau" : `Rodyti visus (${group.querySelectorAll("[data-facet-option]").length})`
    }
  })
  root.addEventListener("input", (event) => {
    const query = (event.target as Element).closest<HTMLInputElement>("[data-media-search]")
    if (query) { state.q = query.value; visibleLimit = MEDIA_GALLERY_PAGE_SIZE; render(); return }
    const facetSearch = (event.target as Element).closest<HTMLInputElement>("[data-facet-search]")
    if (facetSearch) {
      const normalized = facetSearch.value.toLocaleLowerCase("lt")
      facetSearch.closest("[data-facet-group]")?.querySelectorAll<HTMLElement>("[data-facet-option]").forEach((option) => {
        option.hidden = !text(option.textContent).toLocaleLowerCase("lt").includes(normalized)
      })
    }
  })
  sort.addEventListener("change", () => { state.sort = sort.value as GalleryState["sort"]; render() })
  root.querySelector<HTMLButtonElement>("[data-media-retry]")?.addEventListener("click", () => void hydrate(true))

  const resizeObserver = new ResizeObserver(layout)
  resizeObserver.observe(grid)
  const intersectionObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting) && visibleLimit < filtered.length) {
      visibleLimit += MEDIA_GALLERY_PAGE_SIZE
      render(false)
    }
  }, { rootMargin: "500px 0px" })
  intersectionObserver.observe(sentinel)

  render(false)
  const viewer = initViewer(root, () => filtered, () => state, () => render())
  refreshViewer = viewer.refresh
  refreshViewer()

  async function hydrate(retry = false) {
    showStatus(retry ? "Katalogas kraunamas iš naujo…" : "")
    try {
      catalog = await loadCatalog(bootstrap.catalogUrl || root.dataset.catalogUrl || "/static/mediaCatalog.json", retry)
      catalogComplete = true
      searchIndex = buildMediaSearchIndex(catalog)
      baseFacets = computeFacetSummary(filterMediaEntries(catalog, emptyGalleryState(), undefined, { lockedObject }))
      showStatus("")
      render(false)
      const requested = new URLSearchParams(location.search).get("media")
      if (requested && !viewer.lightbox.pswp) {
        const index = filtered.findIndex((entry) => entry.mediaId === requested)
        if (index >= 0) viewer.lightbox.loadAndOpen(index)
      }
    } catch {
      catalogComplete = false
      showStatus("Nepavyko atnaujinti vaizdų katalogo. Rodomi serverio pateikti vaizdai.")
      render(false)
    }
  }

  window.addEventListener("popstate", () => {
    state = parseGalleryState(location.search, lockedObject)
    visibleLimit = MEDIA_GALLERY_PAGE_SIZE
    render(false)
    const mediaId = new URLSearchParams(location.search).get("media")
    if (!mediaId && viewer.lightbox.pswp) viewer.lightbox.pswp.close()
    else if (mediaId && !viewer.lightbox.pswp) {
      const index = filtered.findIndex((entry) => entry.mediaId === mediaId)
      if (index >= 0) viewer.lightbox.loadAndOpen(index)
    }
  })
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && root.classList.contains("filters-open")) closeFilters() })
  root.addEventListener("media-settings-refresh", () => render())
  void hydrate()
}

document.querySelectorAll<HTMLElement>("[data-media-gallery]").forEach(initGallery)
document.addEventListener("quartz-settings-change", () => document.querySelectorAll<HTMLElement>("[data-media-gallery]").forEach((root) => root.dispatchEvent(new Event("media-settings-refresh"))))
