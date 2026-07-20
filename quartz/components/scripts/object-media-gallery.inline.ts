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
import { emitAnalyticsFeature } from "../../util/analytics-client"
import { readSettingsState, sourceMatchesSelection } from "../../util/sourceSettings"

const FACET_KEYS: MediaFacetKey[] = [
  "types",
  "directness",
  "objects",
  "tags",
  "periods",
  "objectTypes",
  "providers",
  "institutions",
  "licenses",
]
const FACET_VISIBLE_LIMIT: Partial<Record<MediaFacetKey, number>> = { objects: 24, tags: 18 }
const facetVisibleLimit = (key: MediaFacetKey) => FACET_VISIBLE_LIMIT[key] ?? 10
const catalogRequests = new Map<string, Promise<MediaEntry[]>>()
const detailCache = new Map<string, Promise<MediaEntry>>()
let exhibitionContextsRequest: Promise<Record<string, ExhibitionViewerContext>> | undefined
const naturalSizeCache = new Map<string, Promise<{ width: number; height: number } | null>>()
const knownNaturalDimensions = new Map<string, { width: number; height: number }>()

type ExhibitionViewerItem = {
  mediaId: string
  titleLt: string
  descriptionLt: string
  creatorDisplay: string
  dateDisplay: string
  sectionTitle: string
}

type ExhibitionViewerContext = {
  exhibitionId: string
  slug: string
  title: string
  items: ExhibitionViewerItem[]
}

const text = (value: unknown) => cleanText(value)
const displayDate = (value: unknown) =>
  text(value)
    .replace(/\s+date\s+QS:.*$/i, "")
    .trim()
const escapeHtml = (value: unknown) =>
  text(value).replace(
    /[&<>"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char] ?? char,
  )

function readDimension(value: unknown): number | null {
  const dimension = Number(value)
  return Number.isFinite(dimension) && dimension > 0 ? dimension : null
}

function normalizedDimensions(entry: MediaEntry): { width: number; height: number } {
  const width = readDimension(entry.width)
  const height = readDimension(entry.height)
  if (!width || !height) return { width: 1600, height: 1200 }
  const ratio = width / height
  if (ratio < 0.1 || ratio > 10) return { width: 1600, height: 1200 }
  return { width, height }
}

function mediaIdentity(entry: MediaEntry): string {
  return text(entry.mediaId) || text(entry.sourceUrl) || text(entry.thumbUrl)
}

function applyResolvedDimensions(
  entry: MediaEntry,
  dimensions: { width: number; height: number } | null | undefined,
) {
  if (!dimensions?.width || !dimensions?.height) return
  knownNaturalDimensions.set(mediaIdentity(entry), dimensions)
  entry.width = dimensions.width
  entry.height = dimensions.height
}

function loadNaturalDimensions(
  entry: MediaEntry,
): Promise<{ width: number; height: number } | null> {
  const key = mediaIdentity(entry)
  if (!key) return Promise.resolve(null)
  let request = naturalSizeCache.get(key)
  if (!request) {
    request = new Promise((resolve) => {
      const src = text(entry.sourceUrl || entry.thumbUrl)
      if (!src) return resolve(null)
      const image = new Image()
      image.decoding = "async"
      image.onload = () =>
        resolve(
          image.naturalWidth > 0 && image.naturalHeight > 0
            ? { width: image.naturalWidth, height: image.naturalHeight }
            : null,
        )
      image.onerror = () => resolve(null)
      image.src = src
    })
    naturalSizeCache.set(key, request)
  }
  return request
}

function parseBootstrap(root: HTMLElement): MediaGalleryBootstrap {
  try {
    const raw = root.querySelector<HTMLScriptElement>("[data-media-bootstrap]")?.textContent ?? ""
    const value = JSON.parse(raw)
    if (value && Array.isArray(value.initialEntries)) return value as MediaGalleryBootstrap
  } catch {}
  return {
    initialEntries: [],
    totalCount: 0,
    facetSummary: computeFacetSummary([]),
    catalogUrl: root.dataset.catalogUrl || "/static/mediaCatalog.json",
    catalogVersion: root.dataset.catalogVersion || "unknown",
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
      .then((value) => (Array.isArray(value) ? value : []))
    catalogRequests.set(url, request)
  }
  return request
}

function loadExhibitionContexts(): Promise<Record<string, ExhibitionViewerContext>> {
  exhibitionContextsRequest ??= fetch("/static/exhibitionMediaContext.json")
    .then((response) => {
      if (!response.ok) throw new Error(`exhibition context ${response.status}`)
      return response.json()
    })
    .then((value) => (value && typeof value === "object" ? value : {}))
  return exhibitionContextsRequest
}

function loadDetail(entry: MediaEntry): Promise<MediaEntry> {
  const mediaId = text(entry.mediaId)
  if (!mediaId) return Promise.resolve(entry)
  let request = detailCache.get(mediaId)
  if (!request) {
    request = fetch(`/static/media/${encodeURIComponent(mediaId)}.json`)
      .then((response) => (response.ok ? response.json() : entry))
      .catch(() => entry)
    detailCache.set(mediaId, request)
  }
  return request
}

function providerAllowed(entry: MediaEntry): boolean {
  const settings = readSettingsState()
  return sourceMatchesSelection(
    {
      id: `media-${text(entry.provider).toLowerCase() || "other"}`,
      title: text(entry.providerLabel || entry.provider),
      channel: "media",
      kind: "image",
      objectCount: 0,
      claimCount: 0,
      quoteCount: 0,
      mediaCount: 1,
    },
    settings.mediaSources,
  )
}

function objectHref(notePath: string): string {
  return `/${notePath.replace(/\.md$/i, "").split("/").map(encodeURIComponent).join("/")}`
}

function galleryUrl(state: GalleryState, mediaId = ""): string {
  const query = new URLSearchParams(serializeGalleryState(state, mediaId).replace(/^\?/, ""))
  const exhibition = new URLSearchParams(location.search).get("exhibition")
  if (mediaId && exhibition) query.set("exhibition", exhibition)
  const serialized = query.toString()
  return `${location.pathname}${serialized ? `?${serialized}` : ""}${location.hash}`
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

function card(entry: MediaEntry, index: number, onImageDimensions?: () => void): HTMLElement {
  const article = document.createElement("article")
  article.className = "media-gallery-card"
  article.dataset.mediaId = text(entry.mediaId)
  const caption = displayCaption(entry)
  const date = displayDate(entry.dateDisplay)
  const creator = text(entry.creator)
  const objects = (entry.relatedObjects ?? [])
    .slice(0, 2)
    .map((object) => object.title)
    .join(" · ")
  const href = galleryUrl(emptyGalleryState(), text(entry.mediaId))
  const width = Number(entry.width)
  const height = Number(entry.height)
  const intrinsicSize =
    Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0
      ? ` width="${width}" height="${height}"`
      : ""
  article.innerHTML = `<a href="${escapeHtml(href)}" data-media-open="${index}" aria-label="Atidaryti: ${escapeHtml(caption)}">
    <span class="media-gallery-card-media"><img src="${escapeHtml(entry.thumbUrl || entry.sourceUrl)}" alt="${escapeHtml(caption)}"${intrinsicSize} loading="${index < 8 ? "eager" : "lazy"}" decoding="async">
    <span class="media-gallery-card-overlay"><span class="media-gallery-card-title">${escapeHtml(caption)}</span>${date ? `<span>${escapeHtml(date)}</span>` : ""}</span>
    <span class="media-gallery-card-hover" aria-hidden="true"><span>${escapeHtml(creator)}</span><span>${escapeHtml(objects)}</span></span></span></a>`
  const image = article.querySelector<HTMLImageElement>("img")
  const syncNaturalDimensions = () => {
    if (!image?.naturalWidth || !image.naturalHeight) return
    const dimensions = { width: image.naturalWidth, height: image.naturalHeight }
    const changed = entry.width !== dimensions.width || entry.height !== dimensions.height
    applyResolvedDimensions(entry, dimensions)
    if (changed) onImageDimensions?.()
  }
  if (image?.complete) syncNaturalDimensions()
  else image?.addEventListener("load", syncNaturalDimensions, { once: true })
  return article
}

function detailsSkeleton(entry: MediaEntry): string {
  return `<div class="media-viewer-panel-inner is-loading" aria-live="polite">
    <p class="media-viewer-kicker">Vaizdo informacija</p>
    <h2>${escapeHtml(displayCaption(entry))}</h2>
    <div class="media-viewer-skeleton"><span></span><span></span><span></span></div>
  </div>`
}

function detailsHtml(entry: MediaEntry, exhibitionItem?: ExhibitionViewerItem): string {
  const objects = (entry.relatedObjects ?? [])
    .map(
      (object) =>
        `<a href="${escapeHtml(objectHref(object.notePath))}">${escapeHtml(object.title)}</a>`,
    )
    .join("")
  const uniqueTags = [
    ...new Map((entry.tags ?? []).map((tag) => [tag.code || tag.label, tag])).values(),
  ]
  const tags = uniqueTags
    .map(
      (tag) =>
        `<button type="button" data-viewer-tag="${escapeHtml(tag.code)}">#${escapeHtml(tag.label)}</button>`,
    )
    .join("")
  const originalTitle = text(entry.originalTitle || entry.title)
  const creator = text(exhibitionItem?.creatorDisplay || entry.creator)
  const date = displayDate(exhibitionItem?.dateDisplay || entry.dateDisplay)
  const imageType = relationLabel(entry.relationType)
  const institution = text(entry.institution)
  const provider = text(entry.providerLabel || entry.provider)
  const collection = text(entry.collection)
  const license = mediaLicenseLabel(entry.license)
  const fact = (label: string, value: string) =>
    value ? `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>` : ""
  const metadata = `<dl class="media-viewer-facts">${fact("Kūrėjas", creator)}${fact("Data", date)}${fact("Tipas", imageType)}</dl>
    ${objects ? `<section class="media-viewer-section"><h3>Susiję objektai</h3><div class="pswp__media-objects">${objects}</div></section>` : ""}
    ${tags ? `<section class="media-viewer-section"><h3>Temos</h3><div class="pswp__media-tags">${tags}</div></section>` : ""}
    <section class="media-viewer-section media-viewer-provenance"><h3>Šaltinis</h3><dl>${fact("Institucija", institution)}${fact("Rinkinys", collection)}${fact("Tiekėjas", provider)}</dl></section>
    <section class="media-viewer-section media-viewer-rights"><h3>Naudojimo teisės</h3><p><strong>${escapeHtml(license || "Nenurodyta")}</strong>${entry.attribution ? `<br>${escapeHtml(entry.attribution)}` : ""}</p></section>
    <div class="pswp__media-links">${entry.canonicalUrl ? `<a href="${escapeHtml(entry.canonicalUrl)}" target="_blank" rel="noreferrer noopener">Atidaryti originalą</a>` : ""}${entry.licenseUrl ? `<a href="${escapeHtml(entry.licenseUrl)}" target="_blank" rel="noreferrer noopener">Licencijos sąlygos</a>` : ""}<button type="button" data-copy-media>Kopijuoti nuorodą</button></div>
    <details class="media-viewer-advanced"><summary>Išplėstiniai duomenys</summary><dl>${fact("Surinkta", text(entry.firstDiscoveredAt || "—"))}${fact("Peržiūrėta", text(entry.reviewedAt || "—"))}${fact("Patikimumas", text(entry.confidenceLevel || entry.confidence || "—"))}</dl>${entry.visualEvidence ? `<p>${escapeHtml(entry.visualEvidence)}</p>` : ""}${entry.metadataEvidence || entry.judgeReason ? `<p>${escapeHtml(entry.metadataEvidence || entry.judgeReason)}</p>` : ""}</details>`
  const title = text(exhibitionItem?.titleLt) || displayCaption(entry)
  const exhibitionDate =
    exhibitionItem?.dateDisplay || date
      ? `<p class="media-viewer-exhibition-date">${escapeHtml(date)}</p>`
      : ""
  const exhibitionDescription = exhibitionItem?.descriptionLt
    ? `<p class="media-viewer-exhibition-description">${escapeHtml(exhibitionItem.descriptionLt)}</p>`
    : ""
  return `<div class="media-viewer-panel-inner ${exhibitionItem ? "is-exhibition-context" : ""}">
    <header class="media-viewer-heading">
      <p class="media-viewer-kicker">${exhibitionItem ? "Parodos eksponatas" : "Vaizdo informacija"}</p>
      <h2>${escapeHtml(title)}</h2>
      ${exhibitionDate}${exhibitionDescription}
      ${!exhibitionItem && originalTitle && originalTitle !== displayCaption(entry) ? `<p class="media-viewer-original-title">${escapeHtml(originalTitle)}</p>` : ""}
    </header>
    ${exhibitionItem ? `<details class="media-viewer-exhibition-metadata"><summary>Rodyti metaduomenis</summary>${metadata}</details>` : metadata}
  </div>`
}

function initViewer(
  root: HTMLElement,
  getEntries: () => MediaEntry[],
  getState: () => GalleryState,
  rerender: () => void,
  getExhibitionItem: (mediaId: string) => ExhibitionViewerItem | undefined = () => undefined,
) {
  let details: HTMLElement | undefined
  let openedWithPush = false
  let openedScrollY = 0
  const currentEntry = (index: number) => getEntries()[index]
  const dataSource = () =>
    getEntries().map((entry) => ({
      src: entry.sourceUrl || entry.thumbUrl,
      msrc: entry.thumbUrl || entry.sourceUrl,
      ...normalizedDimensions(entry),
      alt: displayCaption(entry),
      mediaId: entry.mediaId,
    }))
  const syncSlideDimensions = (index: number, dimensions: { width: number; height: number }) => {
    const pswp = lightbox.pswp as
      | (PhotoSwipe & {
          currSlide?: {
            data?: { width?: number; height?: number }
            width?: number
            height?: number
            updateContentSize?: (force?: boolean) => void
          }
        })
      | undefined
    if (!pswp || pswp.currIndex !== index) return
    const slide = pswp.currSlide
    if (!slide) return
    if (slide.data) {
      slide.data.width = dimensions.width
      slide.data.height = dimensions.height
    }
    slide.width = dimensions.width
    slide.height = dimensions.height
    slide.updateContentSize?.(true)
    pswp.updateSize(true)
  }
  const hydrateEntry = async (index: number) => {
    const entry = currentEntry(index)
    if (!entry) return
    const [detail, natural] = await Promise.all([loadDetail(entry), loadNaturalDimensions(entry)])
    if (currentEntry(index)?.mediaId !== entry.mediaId) return
    if (detail && detail !== entry) Object.assign(entry, detail)
    applyResolvedDimensions(entry, natural)
    const resolved = normalizedDimensions(entry)
    applyResolvedDimensions(entry, resolved)
    lightbox.options.dataSource = dataSource()
    syncSlideDimensions(index, resolved)
  }
  const lightbox = new PhotoSwipeLightbox({
    dataSource: dataSource(),
    pswpModule: PhotoSwipe,
    bgOpacity: 0.985,
    closeTitle: "Uždaryti",
    zoomTitle: "Didinti",
    arrowPrevTitle: "Ankstesnis vaizdas",
    arrowNextTitle: "Kitas vaizdas",
    paddingFn: () => {
      const header = document.querySelector<HTMLElement>(".li-header-shell")
      const mobileBrand = header?.querySelector<HTMLElement>(".li-header-brand")
      const top = Math.ceil(
        (innerWidth <= 900 ? mobileBrand : header)?.getBoundingClientRect().height ?? 0,
      )
      if (innerWidth <= 900) {
        const bottom = Math.ceil(Math.min(innerHeight * 0.46, 390))
        return { top: top + 8, right: 8, bottom: bottom + 8, left: 8 }
      }
      const right = Math.ceil(Math.min(420, Math.max(360, innerWidth * 0.29)))
      return { top: top + 16, right: right + 16, bottom: 16, left: 16 }
    },
  })
  let previousViewerIndex = -1
  lightbox.on("uiRegister", () => {
    lightbox.pswp?.ui?.registerElement({
      name: "media-details",
      order: 20,
      appendTo: "root",
      onInit: (element, pswp) => {
        details = element
        element.className = "pswp__media-details"
        const update = async () => {
          const entry = getEntries()[pswp.currIndex]
          if (!entry) return
          const requestedId = entry.mediaId
          element.innerHTML = detailsSkeleton(entry)
          await hydrateEntry(pswp.currIndex)
          const detail = getEntries()[pswp.currIndex] ?? entry
          if (getEntries()[pswp.currIndex]?.mediaId !== requestedId) return
          element.innerHTML = detailsHtml(detail, getExhibitionItem(text(detail.mediaId)))
          element
            .querySelector<HTMLButtonElement>("[data-copy-media]")
            ?.addEventListener("click", async () => {
              emitAnalyticsFeature({ name: "media_gallery", action: "copy_link" })
              const copy = element.querySelector<HTMLButtonElement>("[data-copy-media]")!
              try {
                await navigator.clipboard.writeText(
                  new URL(galleryUrl(getState(), text(detail.mediaId)), location.origin).toString(),
                )
                copy.textContent = "Nukopijuota"
                copy.classList.add("is-copied")
                window.setTimeout(() => {
                  copy.textContent = "Kopijuoti nuorodą"
                  copy.classList.remove("is-copied")
                }, 1800)
              } catch {
                copy.textContent = "Nepavyko nukopijuoti"
              }
            })
          element.querySelectorAll<HTMLButtonElement>("[data-viewer-tag]").forEach((button) =>
            button.addEventListener("click", () => {
              emitAnalyticsFeature({ name: "media_gallery", action: "tag_select" })
              const code = button.dataset.viewerTag || ""
              const state = getState()
              if (code && !state.tags.includes(code)) state.tags.push(code)
              openedWithPush = false
              pswp.close()
              rerender()
            }),
          )
        }
        pswp.on("change", () => {
          if (previousViewerIndex >= 0 && pswp.currIndex !== previousViewerIndex) {
            emitAnalyticsFeature({
              name: "media_gallery",
              action: pswp.currIndex > previousViewerIndex ? "next" : "previous",
              dedupeScope: "none",
            })
          }
          previousViewerIndex = pswp.currIndex
          void update()
          const entry = getEntries()[pswp.currIndex]
          if (entry) writeUrl(getState(), text(entry.mediaId))
        })
        void update()
      },
    })
    lightbox.pswp?.ui?.registerElement({
      name: "media-position",
      order: 8,
      appendTo: "bar",
      onInit: (element, pswp) => {
        element.className = "pswp__media-position"
        const update = () => {
          element.textContent = `${pswp.currIndex + 1} / ${getEntries().length}`
        }
        pswp.on("change", update)
        update()
      },
    })
  })
  lightbox.on("afterInit", () => {
    const header = document.querySelector<HTMLElement>(".li-header-shell")
    const headerHeight = Math.ceil(header?.getBoundingClientRect().height ?? 0)
    lightbox.pswp?.element?.style.setProperty("--media-viewer-header-height", `${headerHeight}px`)
    document.body.classList.add("media-viewer-open")
    emitAnalyticsFeature({ name: "media_gallery", action: "open" })
  })
  lightbox.on("close", () => {
    emitAnalyticsFeature({ name: "media_gallery", action: "close" })
    previousViewerIndex = -1
    document.body.classList.remove("media-viewer-open")
    if (openedWithPush && new URLSearchParams(location.search).has("media")) {
      openedWithPush = false
      history.back()
      requestAnimationFrame(() => scrollTo({ top: openedScrollY }))
    } else writeUrl(getState())
  })
  lightbox.on("contentLoadImage", ({ content }) => {
    const imageElement = content.element
    if (!(imageElement instanceof HTMLImageElement)) return
    const syncFromImage = () => {
      const width = imageElement.naturalWidth
      const height = imageElement.naturalHeight
      if (!width || !height) return
      const index = lightbox.pswp?.currIndex ?? 0
      const entry = getEntries()[index]
      if (!entry) return
      const dimensions = { width, height }
      applyResolvedDimensions(entry, dimensions)
      lightbox.options.dataSource = dataSource()
      syncSlideDimensions(index, dimensions)
    }
    if (imageElement.complete) syncFromImage()
    else imageElement.addEventListener("load", syncFromImage, { once: true })
    imageElement.addEventListener(
      "error",
      () => {
        const entry = getEntries()[lightbox.pswp?.currIndex ?? 0]
        const original = entry?.canonicalUrl
          ? ` <a href="${escapeHtml(entry.canonicalUrl)}" target="_blank" rel="noreferrer noopener">Atidaryti originalą</a>`
          : ""
        details?.insertAdjacentHTML(
          "afterbegin",
          `<p class="media-viewer-error">Vaizdo nepavyko užkrauti.${original}</p>`,
        )
      },
      { once: true },
    )
  })
  lightbox.init()
  const open = async (index: number, push = false) => {
    if (index < 0 || index >= getEntries().length) return false
    openedWithPush = push
    previousViewerIndex = index
    openedScrollY = scrollY
    if (push) writeUrl(getState(), text(getEntries()[index]?.mediaId), "push")
    await hydrateEntry(index)
    lightbox.loadAndOpen(index)
    return true
  }
  const onRootClick = (event: MouseEvent) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>("[data-media-open]")
    if (
      !link ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    const mediaId = link.closest<HTMLElement>("[data-media-id]")?.dataset.mediaId || ""
    const index = getEntries().findIndex((entry) => text(entry.mediaId) === mediaId)
    if (index < 0) return
    event.preventDefault()
    event.stopPropagation()
    void open(index, true)
  }
  root.addEventListener("click", onRootClick)
  return {
    lightbox,
    open,
    refresh: () => {
      lightbox.options.dataSource = dataSource()
    },
    destroy: () => {
      openedWithPush = false
      root.removeEventListener("click", onRootClick)
      lightbox.destroy()
      document.body.classList.remove("media-viewer-open")
    },
  }
}

function applyJustifiedLayout(grid: HTMLElement, entries: MediaEntry[]) {
  const cards = [...grid.querySelectorAll<HTMLElement>(".media-gallery-card")]
  if (innerWidth < 600 || !cards.length) {
    grid.classList.remove("is-justified")
    grid.style.removeProperty("height")
    cards.forEach((card) => card.removeAttribute("style"))
    return
  }
  const width = grid.clientWidth
  if (!width) return
  const ratios = entries.slice(0, cards.length).map((entry) => {
    const dimensions = knownNaturalDimensions.get(mediaIdentity(entry))
    const ratio = dimensions ? dimensions.width / dimensions.height : 4 / 3
    return Number.isFinite(ratio) && ratio > 0 ? ratio : 4 / 3
  })
  const layout = createJustifiedLayout(ratios, {
    containerWidth: width,
    containerPadding: 0,
    boxSpacing: 10,
    targetRowHeight: innerWidth < 1050 ? 190 : 245,
    targetRowHeightTolerance: 0.2,
    showWidows: true,
    widowLayoutStyle: "left",
  })
  grid.classList.add("is-justified")
  grid.style.height = `${Math.ceil(layout.containerHeight)}px`
  cards.forEach((card, index) => {
    const box = layout.boxes[index]
    if (!box) return
    Object.assign(card.style, {
      left: `${box.left}px`,
      top: `${box.top}px`,
      width: `${box.width}px`,
      height: `${box.height}px`,
    })
  })
}

function renderFacetOptions(
  root: HTMLElement,
  state: GalleryState,
  base: MediaFacetSummary,
  counts: MediaFacetSummary,
) {
  for (const key of FACET_KEYS) {
    const group = root.querySelector<HTMLElement>(`[data-facet-group="${key}"]`)
    const container = group?.querySelector<HTMLElement>("[data-facet-options]")
    if (!group || !container) continue
    const selected = stateValues(state, key)
    const countMap = new Map((counts[key] ?? []).map((option) => [option.value, option.count]))
    const options = [...(base[key] ?? [])]
    selected.forEach((value) => {
      if (!options.some((option) => option.value === value))
        options.push({ value, label: value, count: 0 })
    })
    const visibleLimit = facetVisibleLimit(key)
    container.innerHTML = options
      .map(
        (
          option,
          index,
        ) => `<label class="media-facet-option" data-facet-option ${index >= visibleLimit ? 'data-facet-extra="true"' : ""}>
      <input type="checkbox" value="${escapeHtml(option.value)}" data-facet-input="${key}" ${selected.includes(option.value) ? "checked" : ""}>
      <span class="media-facet-check" aria-hidden="true"></span><span class="media-facet-label">${escapeHtml(option.label)}</span><span class="media-facet-count">${countMap.get(option.value) ?? 0}</span></label>`,
      )
      .join("")
    const selectedCount = group.querySelector<HTMLElement>("[data-facet-selected-count]")
    if (selectedCount) selectedCount.textContent = selected.length ? String(selected.length) : ""
    group.classList.toggle("has-selection", selected.length > 0)
    const expand = group.querySelector<HTMLButtonElement>("[data-facet-expand]")
    if (expand) {
      expand.hidden = options.length <= 8
      expand.textContent =
        group.dataset.expanded === "true" ? "Rodyti mažiau" : `Rodyti visus (${options.length})`
    }
  }
}

function activeFilterCount(state: GalleryState): number {
  return FACET_KEYS.reduce((sum, key) => sum + stateValues(state, key).length, state.q ? 1 : 0)
}

function initGallery(root: HTMLElement) {
  if (root.dataset.galleryInitialized === "true") return
  root.dataset.galleryInitialized = "true"
  const bootstrap = parseBootstrap(root)
  const lockedObject = root.dataset.objectPath || bootstrap.lockedObject || ""
  const requestedExhibitionId = new URLSearchParams(location.search).get("exhibition") || ""
  let state = parseGalleryState(location.search, lockedObject)
  let catalog = bootstrap.initialEntries
  let catalogComplete = false
  let searchIndex: MediaSearchIndex = buildMediaSearchIndex(catalog)
  let baseFacets = bootstrap.facetSummary
  let visibleLimit = MEDIA_GALLERY_PAGE_SIZE
  let filtered: MediaEntry[] = []
  let exhibitionSequence: MediaEntry[] = []
  let exhibitionItems = new Map<string, ExhibitionViewerItem>()
  let exhibitionContextReady = !requestedExhibitionId
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

  const labels = () =>
    Object.fromEntries(
      FACET_KEYS.map((key) => [
        key,
        new Map((baseFacets[key] ?? []).map((option) => [option.value, option.label])),
      ]),
    ) as Record<MediaFacetKey, Map<string, string>>

  const layout = () =>
    requestAnimationFrame(() => applyJustifiedLayout(grid, filtered.slice(0, visibleLimit)))

  const render = (writeState = true) => {
    filtered = filterMediaEntries(catalog, state, searchIndex, { lockedObject, providerAllowed })
    grid.replaceChildren(
      ...filtered.slice(0, visibleLimit).map((entry, index) => card(entry, index, () => layout())),
    )
    const shownCount = catalogComplete
      ? filtered.length
      : activeFilterCount(state)
        ? filtered.length
        : bootstrap.totalCount
    count.textContent = `${shownCount} ${shownCount === 1 ? "vaizdas" : "vaizdų"}`
    mobileCount.textContent = String(shownCount)
    empty.hidden = filtered.length > 0 || (!catalogComplete && bootstrap.totalCount > 0)
    sentinel.hidden = !catalogComplete || visibleLimit >= filtered.length
    const dynamicCounts = computeDynamicFacetCounts(
      catalog,
      state,
      searchIndex,
      lockedObject,
      providerAllowed,
    )
    renderFacetOptions(root, state, baseFacets, dynamicCounts)
    const optionLabels = labels()
    const chips = FACET_KEYS.flatMap((key) =>
      stateValues(state, key).map((value) => ({
        key,
        value,
        label: optionLabels[key].get(value) ?? value,
      })),
    )
    activeFilters.innerHTML = chips
      .map(
        ({ key, value, label }) =>
          `<button type="button" class="media-filter-chip" data-remove-facet="${key}" data-remove-value="${escapeHtml(value)}">${escapeHtml(label)} <span aria-hidden="true">×</span></button>`,
      )
      .join("")
    syncInputs()
    refreshViewer()
    layout()
    if (writeState) writeUrl(state, new URLSearchParams(location.search).get("media") || "")
  }

  const reset = () => {
    state = emptyGalleryState()
    visibleLimit = MEDIA_GALLERY_PAGE_SIZE
    render()
  }
  const closeFilters = () => {
    root.classList.remove("filters-open")
    document.body.classList.remove("media-filters-open")
  }

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
    if (target.closest("[data-media-reset]")) {
      reset()
      closeFilters()
      return
    }
    if (target.closest("[data-media-filter-open]")) {
      root.classList.add("filters-open")
      document.body.classList.add("media-filters-open")
      return
    }
    if (target.closest("[data-media-filter-close]")) {
      closeFilters()
      return
    }
    if (target.closest("[data-media-search-clear]")) {
      state.q = ""
      visibleLimit = MEDIA_GALLERY_PAGE_SIZE
      render()
      search.focus()
      return
    }
    const remove = target.closest<HTMLButtonElement>("[data-remove-facet]")
    if (remove) {
      const key = remove.dataset.removeFacet as MediaFacetKey
      setStateValues(
        state,
        key,
        stateValues(state, key).filter((value) => value !== remove.dataset.removeValue),
      )
      render()
      return
    }
    const expand = target.closest<HTMLButtonElement>("[data-facet-expand]")
    if (expand) {
      const group = expand.closest<HTMLElement>("[data-facet-group]")!
      group.dataset.expanded = group.dataset.expanded === "true" ? "false" : "true"
      expand.textContent =
        group.dataset.expanded === "true"
          ? "Rodyti mažiau"
          : `Rodyti visus (${group.querySelectorAll("[data-facet-option]").length})`
    }
  })
  root.addEventListener("input", (event) => {
    const query = (event.target as Element).closest<HTMLInputElement>("[data-media-search]")
    if (query) {
      state.q = query.value
      visibleLimit = MEDIA_GALLERY_PAGE_SIZE
      render()
      return
    }
    const facetSearch = (event.target as Element).closest<HTMLInputElement>("[data-facet-search]")
    if (facetSearch) {
      const normalized = facetSearch.value.toLocaleLowerCase("lt")
      facetSearch
        .closest("[data-facet-group]")
        ?.querySelectorAll<HTMLElement>("[data-facet-option]")
        .forEach((option) => {
          option.hidden = !text(option.textContent).toLocaleLowerCase("lt").includes(normalized)
        })
    }
  })
  sort.addEventListener("change", () => {
    state.sort = sort.value as GalleryState["sort"]
    render()
  })
  root
    .querySelector<HTMLButtonElement>("[data-media-retry]")
    ?.addEventListener("click", () => void hydrate(true))

  const resizeObserver = new ResizeObserver(layout)
  resizeObserver.observe(grid)
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting) && visibleLimit < filtered.length) {
        visibleLimit += MEDIA_GALLERY_PAGE_SIZE
        render(false)
      }
    },
    { rootMargin: "500px 0px" },
  )
  intersectionObserver.observe(sentinel)

  render(false)
  const viewer = initViewer(
    root,
    () =>
      new URLSearchParams(location.search).has("exhibition") && exhibitionSequence.length
        ? exhibitionSequence
        : filtered,
    () => state,
    () => render(),
    (mediaId) =>
      new URLSearchParams(location.search).has("exhibition")
        ? exhibitionItems.get(mediaId)
        : undefined,
  )
  refreshViewer = viewer.refresh
  refreshViewer()

  const openRequestedMedia = () => {
    const requested = new URLSearchParams(location.search).get("media")
    if (!requested || viewer.lightbox.pswp || !exhibitionContextReady) return
    const entries =
      new URLSearchParams(location.search).has("exhibition") && exhibitionSequence.length
        ? exhibitionSequence
        : filtered
    void viewer.open(
      entries.findIndex((entry) => entry.mediaId === requested),
      false,
    )
  }
  openRequestedMedia()

  async function hydrate(retry = false) {
    showStatus(retry ? "Katalogas kraunamas iš naujo…" : "")
    try {
      const [loadedCatalog, contexts] = await Promise.all([
        loadCatalog(
          bootstrap.catalogUrl || root.dataset.catalogUrl || "/static/mediaCatalog.json",
          retry,
        ),
        requestedExhibitionId
          ? loadExhibitionContexts()
          : Promise.resolve<Record<string, ExhibitionViewerContext>>({}),
      ])
      catalog = loadedCatalog
      if (requestedExhibitionId) {
        const context = contexts[requestedExhibitionId]
        exhibitionItems = new Map((context?.items ?? []).map((item) => [item.mediaId, item]))
        const byId = new Map(catalog.map((entry) => [text(entry.mediaId), entry]))
        exhibitionSequence = (context?.items ?? [])
          .map((item) => byId.get(item.mediaId))
          .filter((entry): entry is MediaEntry => Boolean(entry))
        exhibitionContextReady = true
      }
      catalogComplete = true
      searchIndex = buildMediaSearchIndex(catalog)
      baseFacets = computeFacetSummary(
        filterMediaEntries(catalog, emptyGalleryState(), undefined, { lockedObject }),
      )
      showStatus("")
      render(false)
      openRequestedMedia()
    } catch {
      catalogComplete = false
      exhibitionContextReady = true
      showStatus("Nepavyko atnaujinti vaizdų katalogo. Rodomi serverio pateikti vaizdai.")
      render(false)
      openRequestedMedia()
    }
  }

  const onPopState = () => {
    state = parseGalleryState(location.search, lockedObject)
    visibleLimit = MEDIA_GALLERY_PAGE_SIZE
    render(false)
    const mediaId = new URLSearchParams(location.search).get("media")
    if (!mediaId && viewer.lightbox.pswp) viewer.lightbox.pswp.close()
    else if (mediaId && !viewer.lightbox.pswp) openRequestedMedia()
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && root.classList.contains("filters-open")) closeFilters()
  }
  const onSettingsRefresh = () => render()
  window.addEventListener("popstate", onPopState)
  document.addEventListener("keydown", onKeyDown)
  root.addEventListener("media-settings-refresh", onSettingsRefresh)
  window.addCleanup(() => {
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    viewer.destroy()
    window.removeEventListener("popstate", onPopState)
    document.removeEventListener("keydown", onKeyDown)
    root.removeEventListener("media-settings-refresh", onSettingsRefresh)
    delete root.dataset.galleryInitialized
    document.body.classList.remove("media-filters-open")
  })
  void hydrate()
}

function initGalleries() {
  document.querySelectorAll<HTMLElement>("[data-media-gallery]").forEach(initGallery)
}

initGalleries()
document.addEventListener("nav", initGalleries)
document.addEventListener("quartz-settings-change", () =>
  document
    .querySelectorAll<HTMLElement>("[data-media-gallery]")
    .forEach((root) => root.dispatchEvent(new Event("media-settings-refresh"))),
)
