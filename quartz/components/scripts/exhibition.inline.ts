import PhotoSwipe from "photoswipe"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import type { MediaEntry } from "../../util/objectMedia"
import { cleanText, displayCaption } from "../../util/objectMedia"
import { mediaLicenseLabel } from "../../util/mediaGallery"

type Cleanup = () => void

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
  const setActive = (id: string) => {
    if (!id || id === activeId) return
    activeId = id
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
    if (link?.dataset.exhibitionChapter) setActive(link.dataset.exhibitionChapter)
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

function viewerDetails(entry: MediaEntry, item: ExhibitionViewerItem): string {
  const fact = (label: string, value: unknown) => {
    const clean = text(value)
    return clean ? `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(clean)}</dd></div>` : ""
  }
  const creator = text(item.creatorDisplay || entry.creator)
  const date = viewerDate(item.dateDisplay || entry.dateDisplay)
  const provider = text(entry.institution || entry.providerLabel || entry.provider)
  const license = mediaLicenseLabel(entry.license) || "Teisės nenurodytos"
  return `<div class="media-viewer-panel-inner is-exhibition-context">
    <header class="media-viewer-heading">
      <p class="media-viewer-kicker">${escapeHtml(item.sectionTitle || "Parodos eksponatas")}</p>
      <h2>${escapeHtml(item.titleLt || displayCaption(entry))}</h2>
      ${date ? `<p class="media-viewer-exhibition-date">${escapeHtml(date)}</p>` : ""}
      <p class="media-viewer-exhibition-description">${escapeHtml(item.descriptionLt)}</p>
    </header>
    <details class="media-viewer-exhibition-metadata">
      <summary>Rodyti metaduomenis</summary>
      <dl class="media-viewer-facts">${fact("Kūrėjas", creator)}${fact("Data", date)}${fact("Šaltinis", provider)}</dl>
      <section class="media-viewer-section media-viewer-rights"><h3>Naudojimo teisės</h3><p><strong>${escapeHtml(license)}</strong>${entry.attribution ? `<br>${escapeHtml(entry.attribution)}` : ""}</p></section>
      ${entry.canonicalUrl ? `<div class="pswp__media-links"><a href="${escapeHtml(entry.canonicalUrl)}" target="_blank" rel="noreferrer noopener">Atidaryti originalą</a></div>` : ""}
    </details>
  </div>`
}

function initExhibitionViewer() {
  const page = document.querySelector<HTMLElement>(".exhibition-page[data-exhibition-id]")
  if (!page) return
  const exhibitionId = page.dataset.exhibitionId || ""
  if (!exhibitionId) return

  let lightbox: PhotoSwipeLightbox | undefined
  let sequence: MediaEntry[] = []
  let contextItems: ExhibitionViewerItem[] = []
  let loadPromise: Promise<void> | undefined
  let details: HTMLElement | undefined

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
      contextItems = context.items.filter((item) => mediaById.has(item.mediaId))
      sequence = contextItems.map((item) => mediaById.get(item.mediaId)!)
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
      lightbox = new PhotoSwipeLightbox({
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
      lightbox.on("uiRegister", () => {
        lightbox?.pswp?.ui?.registerElement({
          name: "media-details",
          order: 20,
          appendTo: "root",
          onInit: (element, pswp) => {
            details = element
            element.className = "pswp__media-details"
            const update = () => {
              const entry = sequence[pswp.currIndex]
              const item = contextItems[pswp.currIndex]
              if (entry && item) element.innerHTML = viewerDetails(entry, item)
            }
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
      })
      lightbox.on("afterInit", () => {
        const header = document.querySelector<HTMLElement>(".li-header-shell")
        const headerHeight = Math.ceil(header?.getBoundingClientRect().height ?? 0)
        lightbox?.pswp?.element?.style.setProperty(
          "--media-viewer-header-height",
          `${headerHeight}px`,
        )
        document.body.classList.add("media-viewer-open")
      })
      lightbox.on("close", () => document.body.classList.remove("media-viewer-open"))
      lightbox.on("contentLoadImage", ({ content }) => {
        const image = content.element
        if (!(image instanceof HTMLImageElement)) return
        const syncFromImage = () => {
          const width = image.naturalWidth
          const height = image.naturalHeight
          if (!width || !height) return
          const index = lightbox?.pswp?.currIndex ?? 0
          const entry = sequence[index]
          if (!entry) return
          entry.width = width
          entry.height = height
          if (lightbox) lightbox.options.dataSource = dataSource()
          syncSlideDimensions(index, { width, height })
        }
        if (image.complete) syncFromImage()
        else image.addEventListener("load", syncFromImage, { once: true })
        image.addEventListener(
          "error",
          () => {
            details?.insertAdjacentHTML(
              "afterbegin",
              '<p class="media-viewer-error">Vaizdo nepavyko užkrauti.</p>',
            )
          },
          { once: true },
        )
      })
      lightbox.init()
    })
    return loadPromise
  }

  const onClick = (event: MouseEvent) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
      "[data-exhibition-media]",
    )
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
  void load()

  cleanups.add(() => {
    page.removeEventListener("click", onClick)
    lightbox?.destroy()
    document.body.classList.remove("media-viewer-open")
  })
}

function initExhibitionPage() {
  initExhibitionNavigation()
  initExhibitionViewer()
}

document.addEventListener("nav", initExhibitionPage)
initExhibitionPage()
