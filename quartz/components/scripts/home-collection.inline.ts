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

function setupCollectionTabs() {
  for (const root of document.querySelectorAll<HTMLElement>(".collection-browse")) {
    if (root.dataset.tabsBound === "true") {
      continue
    }
    root.dataset.tabsBound = "true"
    root.classList.add("collection-tabs-ready")

    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-collection-tab]"))
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-collection-tab-panel]"))

    const activate = (nextIndex: number, focus = false) => {
      const safeIndex = Math.max(0, Math.min(nextIndex, tabs.length - 1))
      tabs.forEach((tab, index) => {
        const active = index === safeIndex
        tab.classList.toggle("is-active", active)
        tab.setAttribute("aria-selected", active ? "true" : "false")
        tab.tabIndex = active ? 0 : -1
      })
      panels.forEach((panel, index) => {
        const active = index === safeIndex
        panel.classList.toggle("is-active", active)
        panel.hidden = !active
      })
      if (focus) {
        tabs[safeIndex]?.focus()
      }
    }

    tabs.forEach((tab, index) => {
      const onClick = () => activate(index)
      const onKeyDown = (event: KeyboardEvent) => {
        const currentIndex = tabs.indexOf(tab)
        if (event.key === "ArrowRight") {
          event.preventDefault()
          activate((currentIndex + 1) % tabs.length, true)
        } else if (event.key === "ArrowLeft") {
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
      tab.addEventListener("click", onClick)
      tab.addEventListener("keydown", onKeyDown)
      window.addCleanup(() => {
        tab.removeEventListener("click", onClick)
        tab.removeEventListener("keydown", onKeyDown)
      })
    })

    activate(0)
  }
}

function setupCollectionCopyLink() {
  for (const trigger of document.querySelectorAll<HTMLButtonElement>(
    "[data-collection-copy-link]",
  )) {
    const onClick = async () => {
      try {
        await navigator.clipboard?.writeText(window.location.href)
        trigger.textContent = "Nuoroda nukopijuota"
        window.setTimeout(() => {
          trigger.textContent = "Kopijuoti nuorodą"
        }, 1800)
      } catch {
        trigger.textContent = "Nepavyko kopijuoti"
        window.setTimeout(() => {
          trigger.textContent = "Kopijuoti nuorodą"
        }, 1800)
      }
    }
    trigger.addEventListener("click", onClick)
    window.addCleanup(() => trigger.removeEventListener("click", onClick))
  }
}

document.addEventListener("nav", () => {
  setupCollectionObjectSearch()
  setupCollectionSearch()
  setupCollectionTabs()
  setupCollectionCopyLink()
})
