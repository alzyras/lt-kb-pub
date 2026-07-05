type ContentMetaEntry = {
  slug?: string
  title?: string
  tags?: string[]
  claimCount?: number
  quoteCount?: number
}

type ContentMetaIndex = Record<string, ContentMetaEntry>

type CollectionObjectType = {
  value: string
  label: string
  prefix?: string
}

type CollectionObjectItem = {
  slug: string
  title: string
  type: string
  typeLabel: string
  tags: string[]
  claimCount: number
  quoteCount: number
  searchable: string
  originalIndex: number
}

type CollectionSpotlightClaim = {
  id: string
  text: string
  source?: string
  author?: string
}

type CollectionSpotlightObject = {
  title: string
  slug: string
  typeLabel: string
  claimCount: number
  claims: CollectionSpotlightClaim[]
}

type CollectionSpotlightSelection = {
  object: CollectionSpotlightObject
  claims: CollectionSpotlightClaim[]
}

type CollectionSearchRuntime = Window & {
  loadContentMeta?: () => Promise<ContentMetaIndex>
  spaNavigate?: (url: URL) => void
}

const collectionObjectTypes: CollectionObjectType[] = [
  { value: "all", label: "Visi", prefix: "objektai/" },
  { value: "asmenys", label: "Asmenys", prefix: "objektai/asmenys/" },
  { value: "autoriai", label: "Autoriai", prefix: "objektai/autoriai/" },
  { value: "ivykiai", label: "Įvykiai", prefix: "objektai/ivykiai/" },
  { value: "vietos", label: "Vietos", prefix: "objektai/vietos/" },
  { value: "grupes", label: "Grupės", prefix: "objektai/grupes/" },
  { value: "daiktai", label: "Daiktai", prefix: "objektai/daiktai/" },
  { value: "paprociai", label: "Papročiai", prefix: "objektai/paprociai/" },
  { value: "posakiai", label: "Posakiai", prefix: "objektai/posakiai/" },
  { value: "zodynas", label: "Žodynas", prefix: "objektai/zodynas/" },
  { value: "saltiniai", label: "Šaltiniai", prefix: "objektai/saltiniai/" },
]

const collectionObjectTypeByValue = new Map(
  collectionObjectTypes.map((type) => [type.value, type]),
)

let collectionObjectItemsPromise: Promise<CollectionObjectItem[]> | undefined
let collectionSpotlightSelection: CollectionSpotlightSelection | undefined

function normalizeCollectionSearchText(value: string): string {
  return value
    .toLocaleLowerCase("lt-LT")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
}

function collectionObjectHref(slug: string): string {
  return `/${slug.replace(/^\/+|\/+$/g, "")}/`
}

function collectionTypeForSlug(slug: string): CollectionObjectType | undefined {
  return collectionObjectTypes
    .filter((type) => type.value !== "all" && type.prefix)
    .find((type) => slug.startsWith(type.prefix!))
}

function collectionFormatNumber(value: number): string {
  return value.toLocaleString("lt-LT")
}

function loadCollectionObjectItems(): Promise<CollectionObjectItem[]> {
  if (collectionObjectItemsPromise) {
    return collectionObjectItemsPromise
  }

  collectionObjectItemsPromise = (async () => {
    const runtime = window as CollectionSearchRuntime
    const meta = (await runtime.loadContentMeta?.()) ?? {}

    return Object.entries(meta)
      .map(([slugKey, entry], originalIndex): CollectionObjectItem | undefined => {
        const slug = entry.slug ?? slugKey
        const type = collectionTypeForSlug(slug)
        const title = String(entry.title ?? "").trim()

        if (!type || !title || !/^objektai\/[^/]+\/.+/.test(slug)) {
          return undefined
        }

        const tags = Array.isArray(entry.tags) ? entry.tags.map(String).filter(Boolean) : []
        const claimCount = Number(entry.claimCount ?? 0)
        const quoteCount = Number(entry.quoteCount ?? 0)
        const searchable = normalizeCollectionSearchText([title, slug, ...tags].join(" "))

        return {
          slug,
          title,
          type: type.value,
          typeLabel: type.label,
          tags,
          claimCount: Number.isFinite(claimCount) ? claimCount : 0,
          quoteCount: Number.isFinite(quoteCount) ? quoteCount : 0,
          searchable,
          originalIndex,
        }
      })
      .filter((item): item is CollectionObjectItem => Boolean(item))
  })()

  return collectionObjectItemsPromise
}

function collectionScoreItem(item: CollectionObjectItem, query: string): number {
  if (!query) {
    return item.claimCount * 3 + item.quoteCount
  }

  const title = normalizeCollectionSearchText(item.title)
  const tokens = query.split(/\s+/).filter(Boolean)
  if (!tokens.every((token) => item.searchable.includes(token))) {
    return -1
  }

  let score = 0
  if (title === query) score += 1200
  if (title.startsWith(query)) score += 800
  if (title.includes(query)) score += 450
  for (const token of tokens) {
    if (title.startsWith(token)) score += 180
    if (title.includes(token)) score += 90
  }
  score += Math.min(item.claimCount, 100) * 2
  score += Math.min(item.quoteCount, 100)
  return score
}

function filterCollectionObjectItems(
  items: CollectionObjectItem[],
  query: string,
  typeValue: string,
): CollectionObjectItem[] {
  const type = collectionObjectTypeByValue.get(typeValue) ?? collectionObjectTypeByValue.get("all")!
  const scoped = type.value === "all" ? items : items.filter((item) => item.type === type.value)

  return scoped
    .map((item) => ({ item, score: collectionScoreItem(item, query) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.item.title.localeCompare(b.item.title, "lt")
    })
    .slice(0, 8)
    .map(({ item }) => item)
}

function navigateToCollectionObject(slug: string) {
  const target = new URL(collectionObjectHref(slug), window.location.origin)
  const runtime = window as CollectionSearchRuntime
  ;(runtime.spaNavigate ?? ((url: URL) => window.location.assign(url.href)))(target)
}

function collectionRandomIndex(length: number): number {
  if (length <= 1) {
    return 0
  }

  const cryptoApi = window.crypto
  if (cryptoApi?.getRandomValues) {
    const values = new Uint32Array(1)
    cryptoApi.getRandomValues(values)
    return values[0] % length
  }

  return Math.floor(Math.random() * length)
}

function collectionShuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = collectionRandomIndex(index + 1)
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}

function collectionClaimHref(object: CollectionSpotlightObject, claim: CollectionSpotlightClaim): string {
  return `${collectionObjectHref(object.slug)}#claim-${claim.id}`
}

function parseCollectionSpotlightData(host: HTMLElement): CollectionSpotlightObject[] {
  const data = host.querySelector<HTMLScriptElement>("[data-collection-spotlight-data]")
  if (!data?.textContent) {
    return []
  }

  try {
    const parsed = JSON.parse(data.textContent) as CollectionSpotlightObject[]
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (object) =>
        object &&
        typeof object.title === "string" &&
        typeof object.slug === "string" &&
        Array.isArray(object.claims) &&
        object.claims.length >= 10,
    )
  } catch {
    return []
  }
}

function collectionSpotlightSourceText(claim: CollectionSpotlightClaim): string {
  const source = String(claim.source ?? "").trim()
  const author = String(claim.author ?? "").trim()

  if (author && source) {
    return `${author} / ${source}`
  }
  if (source) {
    return source
  }
  if (author) {
    return author
  }
  return ""
}

function pickCollectionSpotlight(host: HTMLElement): CollectionSpotlightSelection | undefined {
  if (collectionSpotlightSelection) {
    return collectionSpotlightSelection
  }

  const objects = parseCollectionSpotlightData(host)
  const object = objects[collectionRandomIndex(objects.length)]
  if (!object) {
    return undefined
  }

  const claims = collectionShuffle(object.claims).slice(0, 10)
  if (claims.length === 0) {
    return undefined
  }

  collectionSpotlightSelection = { object, claims }
  return collectionSpotlightSelection
}

function setupCollectionClaimSpotlight() {
  for (const host of document.querySelectorAll<HTMLElement>("[data-collection-claim-spotlight]")) {
    if (host.dataset.collectionClaimSpotlightBound === "true") {
      continue
    }
    host.dataset.collectionClaimSpotlightBound = "true"

    const selection = pickCollectionSpotlight(host)
    const objectLink = host.querySelector<HTMLAnchorElement>("[data-collection-spotlight-object]")
    const claimLink = host.querySelector<HTMLAnchorElement>("[data-collection-spotlight-claim]")
    const source = host.querySelector<HTMLElement>("[data-collection-spotlight-source]")
    const dots = host.querySelector<HTMLElement>("[data-collection-spotlight-dots]")
    const type = host.querySelector<HTMLElement>("[data-collection-spotlight-type]")
    const count = host.querySelector<HTMLElement>("[data-collection-spotlight-count]")

    if (!selection || !objectLink || !claimLink || !source || !dots || !type || !count) {
      host.hidden = true
      continue
    }

    const activeSelection = selection
    const activeObjectLink = objectLink
    const activeClaimLink = claimLink
    const activeSource = source
    const activeDots = dots
    const activeType = type
    const activeCount = count
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const typingDelay = 18
    const cycleDelay = 7600
    let activeIndex = 0
    let typingTimer: number | undefined
    let cycleTimer: number | undefined
    let paused = false

    const clearTimers = () => {
      if (typingTimer !== undefined) {
        window.clearTimeout(typingTimer)
        typingTimer = undefined
      }
      if (cycleTimer !== undefined) {
        window.clearTimeout(cycleTimer)
        cycleTimer = undefined
      }
    }

    const scheduleNext = () => {
      if (paused || document.hidden) {
        return
      }
      if (cycleTimer !== undefined) {
        window.clearTimeout(cycleTimer)
      }
      cycleTimer = window.setTimeout(() => {
        showClaim((activeIndex + 1) % selection.claims.length)
      }, cycleDelay)
    }

    const typeText = (text: string) => {
      activeClaimLink.textContent = ""
      activeClaimLink.classList.add("is-typing")

      if (reducedMotion.matches) {
        activeClaimLink.textContent = text
        activeClaimLink.classList.remove("is-typing")
        scheduleNext()
        return
      }

      const chars = Array.from(text)
      let index = 0
      const tick = () => {
        index += chars[index]?.match(/\s/) ? 3 : 2
        activeClaimLink.textContent = chars.slice(0, index).join("")
        if (index < chars.length) {
          typingTimer = window.setTimeout(tick, typingDelay)
          return
        }
        activeClaimLink.classList.remove("is-typing")
        scheduleNext()
      }
      tick()
    }

    function showClaim(nextIndex: number) {
      clearTimers()
      activeIndex = (nextIndex + activeSelection.claims.length) % activeSelection.claims.length
      const claim = activeSelection.claims[activeIndex]
      const href = collectionClaimHref(activeSelection.object, claim)

      activeObjectLink.textContent = activeSelection.object.title
      activeObjectLink.href = collectionObjectHref(activeSelection.object.slug)
      activeClaimLink.href = href
      activeSource.textContent = collectionSpotlightSourceText(claim)
      activeSource.hidden = !activeSource.textContent
      activeType.textContent = activeSelection.object.typeLabel
      activeCount.textContent = `${collectionFormatNumber(activeSelection.object.claimCount)} teig.`

      activeDots.querySelectorAll<HTMLButtonElement>("button").forEach((dot, index) => {
        const active = index === activeIndex
        dot.classList.toggle("is-active", active)
        dot.setAttribute("aria-current", active ? "true" : "false")
      })

      typeText(claim.text)
    }

    activeDots.replaceChildren()
    activeSelection.claims.forEach((_, index) => {
      const dot = document.createElement("button")
      dot.type = "button"
      dot.className = "collection-spotlight-dot"
      dot.setAttribute("aria-label", `Rodyti ${index + 1} teiginį`)
      dot.addEventListener("click", () => showClaim(index))
      activeDots.append(dot)
    })

    const pause = () => {
      paused = true
      if (cycleTimer !== undefined) {
        window.clearTimeout(cycleTimer)
        cycleTimer = undefined
      }
    }
    const resume = () => {
      paused = false
      scheduleNext()
    }
    const onVisibilityChange = () => {
      if (document.hidden) {
        pause()
      } else {
        resume()
      }
    }

    host.addEventListener("pointerenter", pause)
    host.addEventListener("pointerleave", resume)
    host.addEventListener("focusin", pause)
    host.addEventListener("focusout", resume)
    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addCleanup(() => {
      clearTimers()
      host.removeEventListener("pointerenter", pause)
      host.removeEventListener("pointerleave", resume)
      host.removeEventListener("focusin", pause)
      host.removeEventListener("focusout", resume)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    })

    showClaim(0)
  }
}

function setupCollectionObjectSearch() {
  for (const form of document.querySelectorAll<HTMLFormElement>("[data-collection-object-search]")) {
    if (form.dataset.collectionObjectSearchBound === "true") {
      continue
    }
    form.dataset.collectionObjectSearchBound = "true"

    const typeSelect = form.querySelector<HTMLSelectElement>("[data-collection-search-type]")
    const input = form.querySelector<HTMLInputElement>("[data-collection-search-input]")
    const suggestions = form.querySelector<HTMLElement>("[data-collection-search-suggestions]")
    let currentItems: CollectionObjectItem[] = []
    let activeIndex = -1

    if (!typeSelect || !input || !suggestions) {
      continue
    }

    const setActive = (nextIndex: number) => {
      activeIndex = nextIndex
      suggestions
        .querySelectorAll<HTMLElement>("[data-collection-search-result]")
        .forEach((result, index) => {
          const active = index === activeIndex
          result.classList.toggle("is-active", active)
          result.setAttribute("aria-selected", active ? "true" : "false")
        })
    }

    const closeSuggestions = () => {
      suggestions.hidden = true
      suggestions.replaceChildren()
      currentItems = []
      activeIndex = -1
      input.removeAttribute("aria-activedescendant")
      input.setAttribute("aria-expanded", "false")
    }

    const renderSuggestions = async () => {
      const query = normalizeCollectionSearchText(input.value)
      if (!query) {
        closeSuggestions()
        return
      }

      const typeValue = typeSelect.value
      const items = await loadCollectionObjectItems()
      const matches = filterCollectionObjectItems(items, query, typeValue)
      const selectedType = collectionObjectTypeByValue.get(typeValue) ?? collectionObjectTypeByValue.get("all")!
      const scopedTotal =
        selectedType.value === "all"
          ? items.length
          : items.filter((item) => item.type === selectedType.value).length

      suggestions.replaceChildren()
      currentItems = matches

      const status = document.createElement("div")
      status.className = "collection-search-status"
      status.textContent = `${collectionFormatNumber(matches.length)} iš ${collectionFormatNumber(scopedTotal)} atitikm.`
      suggestions.append(status)

      if (matches.length === 0) {
        const empty = document.createElement("div")
        empty.className = "collection-search-empty"
        empty.textContent = "Nerasta objektų šiame tipe."
        suggestions.append(empty)
        suggestions.hidden = false
        return
      }

      matches.forEach((item, index) => {
        const link = document.createElement("a")
        link.className = "collection-search-result"
        link.href = collectionObjectHref(item.slug)
        link.id = `collection-search-result-${index}`
        link.setAttribute("role", "option")
        link.setAttribute("aria-selected", "false")
        link.dataset.collectionSearchResult = String(index)

        const title = document.createElement("strong")
        title.textContent = item.title

        const meta = document.createElement("span")
        meta.className = "collection-search-result-meta"
        const bits = [item.typeLabel]
        if (item.claimCount > 0) bits.push(`${collectionFormatNumber(item.claimCount)} teig.`)
        if (item.quoteCount > 0) bits.push(`${collectionFormatNumber(item.quoteCount)} cit.`)
        meta.textContent = bits.join(" / ")

        const tags = document.createElement("small")
        tags.textContent = item.tags.slice(0, 3).map((tag) => `#${tag}`).join(" ")

        link.append(title, meta)
        if (tags.textContent) {
          link.append(tags)
        }
        suggestions.append(link)
      })

      suggestions.hidden = false
      input.setAttribute("aria-expanded", "true")
      setActive(matches.length > 0 ? 0 : -1)
    }

    const onInput = () => {
      void renderSuggestions()
    }
    const onFocus = () => {
      if (normalizeCollectionSearchText(input.value)) {
        void renderSuggestions()
      }
    }
    const onDocumentPointerDown = (event: PointerEvent) => {
      if (!form.contains(event.target as Node)) {
        closeSuggestions()
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (suggestions.hidden && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        if (!normalizeCollectionSearchText(input.value)) {
          return
        }
        event.preventDefault()
        void renderSuggestions()
        return
      }

      if (event.key === "ArrowDown") {
        event.preventDefault()
        setActive(Math.min(activeIndex + 1, currentItems.length - 1))
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
        setActive(Math.max(activeIndex - 1, 0))
      } else if (event.key === "Escape") {
        closeSuggestions()
      } else if (event.key === "Enter" && activeIndex >= 0 && currentItems[activeIndex]) {
        event.preventDefault()
        navigateToCollectionObject(currentItems[activeIndex].slug)
      }
    }
    const onSubmit = async (event: SubmitEvent) => {
      event.preventDefault()
      const query = normalizeCollectionSearchText(input.value)
      const selectedType = collectionObjectTypeByValue.get(typeSelect.value) ?? collectionObjectTypeByValue.get("all")!

      if (query) {
        const items = await loadCollectionObjectItems()
        const matches = filterCollectionObjectItems(items, query, typeSelect.value)

        if (matches[0]) {
          navigateToCollectionObject(matches[0].slug)
          return
        }
      }

      const destination =
        selectedType.value === "all" ? "/objektai/" : `/${selectedType.prefix!.replace(/\/$/, "")}/`
      const runtime = window as CollectionSearchRuntime
      ;(runtime.spaNavigate ?? ((url: URL) => window.location.assign(url.href)))(
        new URL(destination, window.location.origin),
      )
    }

    input.setAttribute("role", "combobox")
    input.setAttribute("aria-expanded", "false")
    input.setAttribute("aria-autocomplete", "list")
    suggestions.setAttribute("role", "listbox")

    input.addEventListener("input", onInput)
    input.addEventListener("focus", onFocus)
    input.addEventListener("keydown", onKeyDown)
    typeSelect.addEventListener("change", onInput)
    form.addEventListener("submit", onSubmit)
    document.addEventListener("pointerdown", onDocumentPointerDown)
    window.addCleanup(() => {
      input.removeEventListener("input", onInput)
      input.removeEventListener("focus", onFocus)
      input.removeEventListener("keydown", onKeyDown)
      typeSelect.removeEventListener("change", onInput)
      form.removeEventListener("submit", onSubmit)
      document.removeEventListener("pointerdown", onDocumentPointerDown)
    })
  }
}

function setupCollectionBrowseTabs() {
  for (const host of document.querySelectorAll<HTMLElement>("[data-collection-browse-tabs]")) {
    if (host.dataset.collectionBrowseTabsBound === "true") {
      continue
    }
    host.dataset.collectionBrowseTabsBound = "true"

    const tabs = [...host.querySelectorAll<HTMLButtonElement>("[data-collection-browse-tab]")]
    const panels = [...host.querySelectorAll<HTMLElement>("[data-collection-browse-panel]")]

    if (tabs.length === 0 || panels.length === 0) {
      continue
    }

    const activate = (nextIndex: number, focus = false) => {
      const activeIndex = Math.max(0, Math.min(nextIndex, tabs.length - 1))

      tabs.forEach((tab, index) => {
        const active = index === activeIndex
        tab.setAttribute("aria-selected", active ? "true" : "false")
        tab.tabIndex = active ? 0 : -1
      })

      panels.forEach((panel, index) => {
        panel.hidden = index !== activeIndex
      })

      if (focus) {
        tabs[activeIndex]?.focus()
      }
    }

    const onClick = (event: MouseEvent) => {
      const tab = (event.currentTarget as HTMLElement | null)?.closest<HTMLButtonElement>(
        "[data-collection-browse-tab]",
      )
      if (!tab) {
        return
      }
      activate(Number(tab.dataset.collectionBrowseTab ?? 0))
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const currentIndex = tabs.findIndex((tab) => tab === document.activeElement)
      if (currentIndex < 0) {
        return
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault()
        activate((currentIndex + 1) % tabs.length, true)
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault()
        activate((currentIndex - 1 + tabs.length) % tabs.length, true)
      } else if (event.key === "Home") {
        event.preventDefault()
        activate(0, true)
      } else if (event.key === "End") {
        event.preventDefault()
        activate(tabs.length - 1, true)
      }
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", onClick)
      tab.addEventListener("keydown", onKeyDown)
    })

    const selectedIndex = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true")
    activate(selectedIndex >= 0 ? selectedIndex : 0)

    window.addCleanup(() => {
      tabs.forEach((tab) => {
        tab.removeEventListener("click", onClick)
        tab.removeEventListener("keydown", onKeyDown)
      })
    })
  }
}

function setupCollectionSearch() {
  for (const trigger of document.querySelectorAll<HTMLButtonElement>(
    "[data-collection-search-trigger]",
  )) {
    const onClick = () => {
      const input = document.querySelector<HTMLInputElement>("[data-collection-search-input]")
      if (input) {
        input.scrollIntoView({ block: "center", behavior: "smooth" })
        window.setTimeout(() => input.focus(), 250)
        return
      }
      document.querySelector<HTMLButtonElement>(".search-button")?.click()
    }
    trigger.addEventListener("click", onClick)
    window.addCleanup(() => trigger.removeEventListener("click", onClick))
  }
}

document.addEventListener("nav", () => {
  setupCollectionClaimSpotlight()
  setupCollectionBrowseTabs()
  setupCollectionObjectSearch()
  setupCollectionSearch()
})
