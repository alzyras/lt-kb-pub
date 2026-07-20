import PhotoSwipe from "photoswipe"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import { emitAnalyticsExhibition } from "../../util/analytics-client"
import type { MediaEntry } from "../../util/objectMedia"
import { cleanText, displayCaption } from "../../util/objectMedia"
import { mediaLicenseLabel } from "../../util/mediaGallery"
import {
  exhibitionSlideshowDurationMs,
  exhibitionSlideshowIsRtl,
  exhibitionSlideshowLabels,
  exhibitionSlideshowNextIndex,
  exhibitionSlideshowSequence,
} from "../../util/exhibitionSlideshow"

type Cleanup = () => void

type ExhibitionViewerItem = {
  mediaId: string
  titleLt: string
  descriptionLt: string
  creatorDisplay: string
  dateDisplay: string
  sectionTitle: string
  sectionSlug: string
  featured: boolean
}

type ExhibitionViewerContext = {
  exhibitionId: string
  slug: string
  title: string
  items: ExhibitionViewerItem[]
}

const cleanups = new Set<Cleanup>()

function initExhibitionNavigation() {
  for (const cleanup of cleanups) cleanup()
  cleanups.clear()

  const page = document.querySelector<HTMLElement>(".exhibition-page")
  const nav = page?.querySelector<HTMLElement>(".exhibition-chapters")
  if (!page || !nav) return

  const links = [...nav.querySelectorAll<HTMLAnchorElement>("[data-exhibition-chapter]")]
  const sections = links
    .map((link) => {
      const id = link.dataset.exhibitionChapter || ""
      const section = document.getElementById(id)
      return section ? { id, link, section } : undefined
    })
    .filter((value): value is { id: string; link: HTMLAnchorElement; section: HTMLElement } =>
      Boolean(value),
    )
  if (!sections.length) return

  let frame = 0
  let activeId = ""
  let hashTimers: number[] = []
  const viewedSections = new Set<string>()
  const setActive = (id: string) => {
    if (!id || id === activeId) return
    activeId = id
    if (!viewedSections.has(id)) {
      viewedSections.add(id)
      emitAnalyticsExhibition({
        action: "chapter_view",
        exhibitionId: page.dataset.exhibitionId || "unknown",
        mode: "page",
        section: id,
      })
    }
    for (const entry of sections) {
      const active = entry.id === id
      entry.link.toggleAttribute("data-active", active)
      if (active) entry.link.setAttribute("aria-current", "location")
      else entry.link.removeAttribute("aria-current")
    }
  }
  const update = () => {
    frame = 0
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) {
      setActive(sections[sections.length - 1].id)
      return
    }
    const probe = nav.getBoundingClientRect().bottom + Math.min(120, innerHeight * 0.18)
    let current = sections[0]
    for (const entry of sections) {
      if (entry.section.getBoundingClientRect().top <= probe) current = entry
      else break
    }
    setActive(current.id)
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }
  const observer = new IntersectionObserver(schedule, {
    rootMargin: "-10% 0px -70% 0px",
    threshold: [0, 0.01, 0.5],
  })
  const clearHashTimers = () => {
    for (const timer of hashTimers) clearTimeout(timer)
    hashTimers = []
  }
  const activateHash = () => {
    const id = decodeURIComponent(location.hash.slice(1))
    const entry = sections.find((candidate) => candidate.id === id)
    if (!entry) return false
    clearHashTimers()
    setActive(entry.id)
    for (const delay of [0, 200, 700, 1600]) {
      hashTimers.push(
        window.setTimeout(() => {
          entry.section.scrollIntoView({ block: "start" })
          setActive(entry.id)
          requestAnimationFrame(update)
        }, delay),
      )
    }
    return true
  }
  const handleNavClick = (event: MouseEvent) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
      "[data-exhibition-chapter]",
    )
    if (link?.dataset.exhibitionChapter) {
      const section = link.dataset.exhibitionChapter
      setActive(section)
      emitAnalyticsExhibition({
        action: "chapter_click",
        exhibitionId: page.dataset.exhibitionId || "unknown",
        mode: "page",
        section,
      })
    }
  }
  for (const entry of sections) observer.observe(entry.section)
  addEventListener("scroll", schedule, { passive: true })
  addEventListener("resize", schedule, { passive: true })
  addEventListener("hashchange", activateHash)
  addEventListener("wheel", clearHashTimers, { passive: true })
  addEventListener("touchstart", clearHashTimers, { passive: true })
  addEventListener("pointerdown", clearHashTimers, { passive: true })
  addEventListener("keydown", clearHashTimers)
  nav.addEventListener("click", handleNavClick)
  if (!activateHash()) update()

  cleanups.add(() => {
    observer.disconnect()
    removeEventListener("scroll", schedule)
    removeEventListener("resize", schedule)
    removeEventListener("hashchange", activateHash)
    removeEventListener("wheel", clearHashTimers)
    removeEventListener("touchstart", clearHashTimers)
    removeEventListener("pointerdown", clearHashTimers)
    removeEventListener("keydown", clearHashTimers)
    nav.removeEventListener("click", handleNavClick)
    clearHashTimers()
    if (frame) cancelAnimationFrame(frame)
  })
}

const text = (value: unknown) => cleanText(value)
const escapeHtml = (value: unknown) =>
  text(value).replace(
    /[&<>"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] ?? character,
  )

function viewerDate(value: unknown): string {
  return text(value)
    .replace(/\s+date\s+QS:.*$/i, "")
    .replace(/^The coin was minted (?:between |in )?/i, "")
    .replace(/\(or earlier\)/i, "(arba anksčiau)")
    .replace(/\.$/, "")
    .trim()
}

function viewerDimensions(entry: MediaEntry): { width: number; height: number } {
  const width = Number(entry.width)
  const height = Number(entry.height)
  if (width > 0 && height > 0 && width / height > 0.1 && width / height < 10) {
    return { width, height }
  }
  return { width: 1600, height: 1200 }
}

function currentLanguage(): string {
  return new URLSearchParams(location.search).get("lang") || document.documentElement.lang || "lt"
}

function viewerDetails(
  entry: MediaEntry,
  item: ExhibitionViewerItem,
  slideshow = false,
  page?: HTMLElement,
): string {
  const labels = exhibitionSlideshowLabels(currentLanguage())
  const localized = page ? localizedViewerItem(page, item) : item
  const fact = (label: string, value: unknown) => {
    const clean = text(value)
    return clean ? `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(clean)}</dd></div>` : ""
  }
  const creator = text(localized.creatorDisplay || entry.creator)
  const date = viewerDate(localized.dateDisplay || entry.dateDisplay)
  const provider = text(entry.institution || entry.providerLabel || entry.provider)
  const license = mediaLicenseLabel(entry.license) || "Teisės nenurodytos"
  if (slideshow) {
    return `<div class="media-viewer-panel-inner is-exhibition-context is-slideshow-context">
      <header class="media-viewer-heading">
        <p class="media-viewer-kicker">${escapeHtml(localized.sectionTitle || labels.exhibit)}</p>
        <h2>${escapeHtml(localized.titleLt || displayCaption(entry))}</h2>
        ${date ? `<p class="media-viewer-exhibition-date">${escapeHtml(date)}</p>` : ""}
        <p class="media-viewer-exhibition-description">${escapeHtml(localized.descriptionLt)}</p>
      </header>
    </div>`
  }
  return `<div class="media-viewer-panel-inner is-exhibition-context">
    <header class="media-viewer-heading">
      <p class="media-viewer-kicker">${escapeHtml(localized.sectionTitle || "Parodos eksponatas")}</p>
      <h2>${escapeHtml(localized.titleLt || displayCaption(entry))}</h2>
      ${date ? `<p class="media-viewer-exhibition-date">${escapeHtml(date)}</p>` : ""}
      <p class="media-viewer-exhibition-description">${escapeHtml(localized.descriptionLt)}</p>
    </header>
    <details class="media-viewer-exhibition-metadata">
      <summary>Rodyti metaduomenis</summary>
      <dl class="media-viewer-facts">${fact("Kūrėjas", creator)}${fact("Data", date)}${fact("Šaltinis", provider)}</dl>
      <section class="media-viewer-section media-viewer-rights"><h3>Naudojimo teisės</h3><p><strong>${escapeHtml(license)}</strong>${entry.attribution ? `<br>${escapeHtml(entry.attribution)}` : ""}</p></section>
      ${entry.canonicalUrl ? `<div class="pswp__media-links"><a href="${escapeHtml(entry.canonicalUrl)}" target="_blank" rel="noreferrer noopener">Atidaryti originalą</a></div>` : ""}
    </details>
  </div>`
}

function localizedViewerItem(page: HTMLElement, item: ExhibitionViewerItem): ExhibitionViewerItem {
  const link = [...page.querySelectorAll<HTMLAnchorElement>("[data-exhibition-media]")].find(
    (candidate) => candidate.dataset.exhibitionMedia === item.mediaId,
  )
  const card = link?.closest<HTMLElement>("article")
  if (!card) return item
  const title = text(card.querySelector("h3")?.textContent)
  const description = text(
    card.querySelector(".exhibition-item-description")?.textContent ||
      [...card.querySelectorAll("p")].find(
        (candidate) => !candidate.classList.contains("exhibition-item-meta"),
      )?.textContent,
  )
  const date = text(card.querySelector("[data-exhibition-date='true']")?.textContent)
  const section = [...page.querySelectorAll<HTMLElement>("[data-exhibition-chapter]")].find(
    (candidate) => candidate.dataset.exhibitionChapter === item.sectionSlug,
  )
  return {
    ...item,
    titleLt: title || item.titleLt,
    descriptionLt: description || item.descriptionLt,
    dateDisplay: date || item.dateDisplay,
    sectionTitle:
      text(section?.querySelector(".exhibition-chapter-title")?.textContent) || item.sectionTitle,
  }
}

function initExhibitionViewer() {
  const page = document.querySelector<HTMLElement>(".exhibition-page[data-exhibition-id]")
  if (!page) return
  const exhibitionId = page.dataset.exhibitionId || ""
  if (!exhibitionId) return

  let lightbox: PhotoSwipeLightbox | undefined
  let allSequence: MediaEntry[] = []
  let allContextItems: ExhibitionViewerItem[] = []
  let sequence: MediaEntry[] = []
  let contextItems: ExhibitionViewerItem[] = []
  let loadPromise: Promise<void> | undefined
  let details: HTMLElement | undefined
  let progress: HTMLElement | undefined
  let toggle: HTMLElement | undefined
  let fullscreen: HTMLElement | undefined
  let slideshowMode = false
  let slideshowPaused = false
  let slideshowTimer: number | undefined
  let slideshowDuration = 10_000
  let imageReady = new Set<number>()
  let imageFailureReported = new Set<number>()
  let viewedSlideshowSlides = new Set<number>()
  let translationObserver: MutationObserver | undefined
  let isCleaningUp = false
  const trackExhibition = (
    action: string,
    index = lightbox?.pswp?.currIndex ?? 0,
    mode: "viewer" | "slideshow" = slideshowMode ? "slideshow" : "viewer",
  ) => {
    const item = contextItems[index]
    emitAnalyticsExhibition({
      action,
      exhibitionId,
      mode,
      mediaId: item?.mediaId,
      section: item?.sectionSlug,
      position: sequence.length ? index + 1 : undefined,
      total: sequence.length || undefined,
    })
  }

  const labels = () => exhibitionSlideshowLabels(currentLanguage())
  const clearSlideshowTimer = () => {
    if (slideshowTimer !== undefined) window.clearTimeout(slideshowTimer)
    slideshowTimer = undefined
    progress?.classList.remove("is-running")
  }
  const updateFullscreenControl = () => {
    if (!fullscreen) return
    const current = Boolean(document.fullscreenElement)
    const next = labels()
    fullscreen.setAttribute("aria-label", current ? next.exitFullscreen : next.fullscreen)
    fullscreen.setAttribute("title", current ? next.exitFullscreen : next.fullscreen)
    fullscreen.textContent = current ? "↙" : "⛶"
  }
  const updateSlideshowControl = () => {
    if (!toggle) return
    const next = labels()
    toggle.setAttribute("aria-label", slideshowPaused ? next.play : next.pause)
    toggle.setAttribute("title", slideshowPaused ? next.play : next.pause)
    toggle.textContent = slideshowPaused ? "▶" : "Ⅱ"
    toggle.classList.toggle("is-paused", slideshowPaused)
  }
  const updateViewerLabels = () => {
    const next = labels()
    const root = lightbox?.pswp?.element
    if (!root) return
    const setLabel = (selector: string, value: string) => {
      const element = root.querySelector<HTMLElement>(selector)
      if (!element) return
      element.setAttribute("aria-label", value)
      element.setAttribute("title", value)
    }
    setLabel(".pswp__button--close", next.close)
    setLabel(".pswp__button--arrow--prev", next.previous)
    setLabel(".pswp__button--arrow--next", next.next)
    updateSlideshowControl()
    updateFullscreenControl()
    root.dir = exhibitionSlideshowIsRtl(currentLanguage()) ? "rtl" : "ltr"
  }
  const updateProgress = (running: boolean) => {
    if (!progress) return
    progress.setAttribute("aria-label", labels().progress)
    progress.setAttribute("aria-valuemin", "0")
    progress.setAttribute("aria-valuemax", "100")
    progress.setAttribute("aria-valuenow", running ? "0" : "100")
    progress.style.setProperty("--slideshow-duration", `${slideshowDuration}ms`)
    progress.classList.toggle("is-running", running)
  }
  const localizedCurrentItem = (index: number) => {
    const item = contextItems[index]
    return item ? localizedViewerItem(page, item) : undefined
  }
  const preloadNext = (index: number) => {
    if (!slideshowMode || !sequence.length) return
    const next = sequence[exhibitionSlideshowNextIndex(index, sequence.length)]
    const src = text(next?.sourceUrl || next?.thumbUrl)
    if (!src) return
    const image = new Image()
    image.decoding = "async"
    image.src = src
  }
  const scheduleSlideshow = (index: number, failed = false) => {
    clearSlideshowTimer()
    if (!slideshowMode || slideshowPaused || !sequence[index]) return
    if (!viewedSlideshowSlides.has(index)) {
      viewedSlideshowSlides.add(index)
      trackExhibition("slideshow_slide_view", index, "slideshow")
    }
    const item = localizedCurrentItem(index)
    slideshowDuration = failed ? 3_000 : exhibitionSlideshowDurationMs(item?.descriptionLt || "")
    updateProgress(true)
    slideshowTimer = window.setTimeout(() => {
      const current = lightbox?.pswp?.currIndex ?? index
      const next = exhibitionSlideshowNextIndex(current, sequence.length)
      if (next === 0 && current !== 0) trackExhibition("slideshow_loop", current, "slideshow")
      lightbox?.pswp?.goTo(next)
    }, slideshowDuration)
    preloadNext(index)
  }
  const updateDetails = (element: HTMLElement, index: number) => {
    const entry = sequence[index]
    const item = contextItems[index]
    if (!entry || !item) return
    element.innerHTML = viewerDetails(entry, item, slideshowMode, page)
    if (slideshowMode) {
      const localized = localizedCurrentItem(index) || item
      slideshowDuration = exhibitionSlideshowDurationMs(localized.descriptionLt)
    }
    updateViewerLabels()
  }
  const configureSequence = (slideshow: boolean) => {
    const pairs = allContextItems
      .map((item, index) => ({ item, entry: allSequence[index] }))
      .filter((pair): pair is { item: ExhibitionViewerItem; entry: MediaEntry } =>
        Boolean(pair.entry),
      )
    const selected = slideshow
      ? exhibitionSlideshowSequence(pairs.map((pair) => pair.item)).map(
          (item) => pairs.find((pair) => pair.item.mediaId === item.mediaId)!,
        )
      : pairs
    contextItems = selected.map((pair) => pair.item)
    sequence = selected.map((pair) => pair.entry)
    if (lightbox) lightbox.options.dataSource = dataSource()
  }
  const dataSource = () =>
    sequence.map((entry) => ({
      src: entry.sourceUrl || entry.thumbUrl,
      msrc: entry.thumbUrl || entry.sourceUrl,
      ...viewerDimensions(entry),
      alt: displayCaption(entry),
    }))
  const syncSlideDimensions = (index: number, dimensions: { width: number; height: number }) => {
    const pswp = lightbox?.pswp as
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
  const togglePause = () => {
    const index = lightbox?.pswp?.currIndex ?? 0
    slideshowPaused = !slideshowPaused
    trackExhibition(slideshowPaused ? "slideshow_pause" : "slideshow_resume", index, "slideshow")
    updateSlideshowControl()
    if (slideshowPaused) clearSlideshowTimer()
    else if (imageReady.has(index)) scheduleSlideshow(index)
    else updateProgress(false)
  }
  const toggleFullscreen = async () => {
    const entering = !document.fullscreenElement
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen?.()
      trackExhibition(entering ? "slideshow_fullscreen_enter" : "slideshow_fullscreen_exit")
    } catch {
      // Fullscreen is an enhancement; the overlay remains usable when denied.
    }
    updateFullscreenControl()
  }
  const updateModeUrl = (active: boolean) => {
    const url = new URL(location.href)
    if (active) url.searchParams.set("mode", "slideshow")
    else url.searchParams.delete("mode")
    history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`)
  }
  const enterSlideshow = (index = 0) => {
    configureSequence(true)
    if (!sequence.length || !lightbox) return
    slideshowMode = true
    slideshowPaused = false
    imageReady = new Set<number>()
    imageFailureReported = new Set<number>()
    viewedSlideshowSlides = new Set<number>()
    trackExhibition("slideshow_start", index, "slideshow")
    updateModeUrl(true)
    document.body.classList.add("media-viewer-exhibition-slideshow")
    lightbox.options.bgOpacity = 1
    lightbox.options.dataSource = dataSource()
    lightbox.loadAndOpen(Math.max(0, Math.min(index, sequence.length - 1)))
  }
  const leaveSlideshow = () => {
    clearSlideshowTimer()
    slideshowMode = false
    slideshowPaused = false
    document.body.classList.remove("media-viewer-exhibition-slideshow")
    lightbox?.options && (lightbox.options.bgOpacity = 0.985)
    if (!isCleaningUp) updateModeUrl(false)
  }

  const load = () => {
    loadPromise ??= Promise.all([
      fetch("/static/exhibitionMediaContext.json").then((response) => {
        if (!response.ok) throw new Error(`exhibition context ${response.status}`)
        return response.json() as Promise<Record<string, ExhibitionViewerContext>>
      }),
      fetch("/static/mediaCatalog.json").then((response) => {
        if (!response.ok) throw new Error(`media catalog ${response.status}`)
        return response.json() as Promise<MediaEntry[]>
      }),
    ]).then(([contexts, catalog]) => {
      const context = contexts[exhibitionId]
      if (!context?.items?.length) throw new Error(`missing exhibition ${exhibitionId}`)
      const mediaById = new Map(catalog.map((entry) => [text(entry.mediaId), entry]))
      allContextItems = context.items
        .map((item) => ({
          ...item,
          sectionSlug: item.sectionSlug || "",
          featured: item.featured !== false,
        }))
        .filter((item) => mediaById.has(item.mediaId))
      allSequence = allContextItems.map((item) => mediaById.get(item.mediaId)!)
      configureSequence(false)
      lightbox = new PhotoSwipeLightbox({
        dataSource: dataSource(),
        pswpModule: PhotoSwipe,
        loop: true,
        bgOpacity: 0.985,
        closeTitle: labels().close,
        zoomTitle: "Didinti",
        arrowPrevTitle: labels().previous,
        arrowNextTitle: labels().next,
        paddingFn: () => {
          if (slideshowMode) {
            if (innerWidth <= 900) {
              return { top: 8, right: 8, bottom: Math.min(innerHeight * 0.4, 320) + 8, left: 8 }
            }
            const right = Math.ceil(Math.min(460, Math.max(360, innerWidth * 0.31)))
            return { top: 16, right: right + 16, bottom: 8, left: 8 }
          }
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
      lightbox.on("uiRegister", () => {
        lightbox?.pswp?.ui?.registerElement({
          name: "media-details",
          order: 20,
          appendTo: "root",
          onInit: (element, pswp) => {
            details = element
            element.className = "pswp__media-details"
            const update = () => updateDetails(element, pswp.currIndex)
            pswp.on("change", update)
            update()
          },
        })
        lightbox?.pswp?.ui?.registerElement({
          name: "media-position",
          order: 8,
          appendTo: "bar",
          onInit: (element, pswp) => {
            element.className = "pswp__media-position"
            const update = () => {
              element.textContent = `${pswp.currIndex + 1} / ${sequence.length}`
            }
            pswp.on("change", update)
            update()
          },
        })
        lightbox?.pswp?.ui?.registerElement({
          name: "slideshow-progress",
          order: 5,
          tagName: "div",
          appendTo: "root",
          onInit: (element) => {
            progress = element
            element.className = "pswp__slideshow-progress"
            element.innerHTML = "<span></span>"
            updateProgress(false)
          },
        })
        lightbox?.pswp?.ui?.registerElement({
          name: "slideshow-toggle",
          order: 6,
          isButton: true,
          appendTo: "bar",
          onInit: (element) => {
            toggle = element
            element.className = "pswp__button pswp__button--slideshow-toggle"
            element.addEventListener("click", togglePause)
            updateSlideshowControl()
          },
        })
        lightbox?.pswp?.ui?.registerElement({
          name: "slideshow-fullscreen",
          order: 7,
          isButton: true,
          appendTo: "bar",
          onInit: (element) => {
            fullscreen = element
            element.className = "pswp__button pswp__button--slideshow-fullscreen"
            element.addEventListener("click", () => void toggleFullscreen())
            updateFullscreenControl()
          },
        })
      })
      lightbox.on("afterInit", () => {
        const header = document.querySelector<HTMLElement>(".li-header-shell")
        const headerHeight = slideshowMode
          ? 0
          : Math.ceil(header?.getBoundingClientRect().height ?? 0)
        lightbox?.pswp?.element?.style.setProperty(
          "--media-viewer-header-height",
          `${headerHeight}px`,
        )
        document.body.classList.add("media-viewer-open")
        updateViewerLabels()
        const index = lightbox?.pswp?.currIndex ?? 0
        if (!slideshowMode) trackExhibition("viewer_open", index, "viewer")
        const root = lightbox?.pswp?.element
        const bindArrow = (selector: string, action: string) => {
          root?.querySelector<HTMLElement>(selector)?.addEventListener("click", () => {
            trackExhibition(slideshowMode ? `slideshow_${action}` : `viewer_${action}`)
          })
        }
        bindArrow(".pswp__button--arrow--next", "next")
        bindArrow(".pswp__button--arrow--prev", "previous")
        if (slideshowMode && imageReady.has(index)) scheduleSlideshow(index)
      })
      lightbox.on("change", () => {
        const index = lightbox?.pswp?.currIndex ?? 0
        if (!slideshowMode) return
        clearSlideshowTimer()
        updateProgress(false)
        if (imageReady.has(index)) scheduleSlideshow(index)
        preloadNext(index)
      })
      lightbox.on("close", () => {
        if (!isCleaningUp) trackExhibition(slideshowMode ? "slideshow_close" : "viewer_close")
        leaveSlideshow()
        document.body.classList.remove("media-viewer-open")
      })
      lightbox.on("contentLoadImage", ({ content }) => {
        const image = content.element
        if (!(image instanceof HTMLImageElement)) return
        const index = content.index
        let settled = false
        const markReady = (failed = false) => {
          if (settled) return
          settled = true
          imageReady.add(index)
          if (failed) {
            const isCurrent = lightbox?.pswp?.currIndex === index
            if (isCurrent && !imageFailureReported.has(index)) {
              imageFailureReported.add(index)
              details?.insertAdjacentHTML(
                "afterbegin",
                '<p class="media-viewer-error">Vaizdo nepavyko užkrauti.</p>',
              )
            }
          } else {
            imageFailureReported.delete(index)
            details?.querySelectorAll<HTMLElement>(".media-viewer-error").forEach((error) => {
              error.remove()
            })
            const width = image.naturalWidth
            const height = image.naturalHeight
            const entry = sequence[index]
            if (width && height && entry) {
              entry.width = width
              entry.height = height
              lightbox!.options.dataSource = dataSource()
              syncSlideDimensions(index, { width, height })
            }
          }
          if (slideshowMode && lightbox?.pswp?.currIndex === index) scheduleSlideshow(index, failed)
        }
        if (image.complete) markReady(image.naturalWidth <= 0 || image.naturalHeight <= 0)
        else image.addEventListener("load", () => markReady(), { once: true })
        image.addEventListener("error", () => markReady(true), { once: true })
      })
      lightbox.init()
      translationObserver = new MutationObserver(() => {
        if (!slideshowMode || !details || !lightbox?.pswp?.isOpen) return
        updateDetails(details, lightbox.pswp.currIndex)
      })
      translationObserver.observe(page, { subtree: true, childList: true, characterData: true })
    })
    return loadPromise
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (!slideshowMode || event.defaultPrevented) return
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      trackExhibition(event.key === "ArrowRight" ? "slideshow_next" : "slideshow_previous")
      return
    }
    if (event.key === " " && !(event.target instanceof HTMLInputElement)) {
      event.preventDefault()
      togglePause()
    }
  }
  const onFullscreenChange = () => updateFullscreenControl()
  const onClick = (event: MouseEvent) => {
    const target = event.target as Element | null
    const slideshowLink = target?.closest<HTMLAnchorElement>("[data-exhibition-slideshow]")
    if (
      slideshowLink &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault()
      event.stopPropagation()
      void load()
        .then(() => enterSlideshow(0))
        .catch((error) => {
          console.error("Nepavyko paleisti parodos peržiūros.", error)
          location.href = slideshowLink.href
        })
      return
    }
    const link = target?.closest<HTMLAnchorElement>("[data-exhibition-media]")
    if (
      !link ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    event.preventDefault()
    event.stopPropagation()
    const mediaId = link.dataset.exhibitionMedia || ""
    void load()
      .then(() => {
        configureSequence(false)
        lightbox!.options.bgOpacity = 0.985
        const index = contextItems.findIndex((item) => item.mediaId === mediaId)
        if (index < 0 || !lightbox) throw new Error(`missing media ${mediaId}`)
        lightbox.loadAndOpen(index)
      })
      .catch((error) => {
        console.error("Nepavyko atverti parodos peržiūros.", error)
        location.href = link.href
      })
  }
  page.addEventListener("click", onClick)
  addEventListener("keydown", onKeydown)
  addEventListener("fullscreenchange", onFullscreenChange)
  void load().then(() => {
    if (new URLSearchParams(location.search).get("mode") === "slideshow") enterSlideshow(0)
  })

  cleanups.add(() => {
    isCleaningUp = true
    page.removeEventListener("click", onClick)
    removeEventListener("keydown", onKeydown)
    removeEventListener("fullscreenchange", onFullscreenChange)
    translationObserver?.disconnect()
    leaveSlideshow()
    lightbox?.destroy()
    document.body.classList.remove("media-viewer-open")
    isCleaningUp = false
  })
}

function initExhibitionPage() {
  initExhibitionNavigation()
  initExhibitionViewer()
}

document.addEventListener("nav", initExhibitionPage)
initExhibitionPage()
