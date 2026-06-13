import FlexSearch, { DefaultDocumentSearchResults } from "flexsearch"
import { SearchIndexDetails } from "../../plugins/emitters/contentIndex"
import { registerEscapeHandler, removeAllChildren } from "./util"
import { FullSlug, normalizeRelativeURLs, resolveRelative } from "../../util/path"

type ContentIndex = Record<FullSlug, SearchIndexDetails>

interface Item {
  id: number
  slug: FullSlug
  title: string
  content: string
  tags: string[]
  [key: string]: any
}

type SearchOptionsState = {
  minClaimCount: number
  sourceSelectionMode: "all" | "custom"
  selectedSourceIds: string[]
}

// Can be expanded with things like "term" in the future
type SearchType = "basic" | "tags"
let searchType: SearchType = "basic"
let currentSearchTerm: string = ""
let idDataMap: FullSlug[] = []
const OPTIONS_STORAGE_KEY = "ltkb-options-v4"
const DEFAULT_SEARCH_OPTIONS_STATE: SearchOptionsState = {
  minClaimCount: 5,
  sourceSelectionMode: "all",
  selectedSourceIds: [],
}

const isCJKCodePoint = (code: number) =>
  (code >= 0x3040 && code <= 0x309f) ||
  (code >= 0x30a0 && code <= 0x30ff) ||
  (code >= 0x4e00 && code <= 0x9fff) ||
  (code >= 0xac00 && code <= 0xd7af) ||
  (code >= 0x20000 && code <= 0x2a6df)

const normalizeSearchText = (str: string): string =>
  [...str.toLowerCase()]
    .map((char) => {
      const code = char.codePointAt(0)!
      return isCJKCodePoint(code) ? char : char.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    })
    .join("")

const encoder = (str: string): string[] => {
  const tokens: string[] = []
  let bufferStart = -1
  let bufferEnd = -1
  const lower = normalizeSearchText(str)

  let i = 0
  for (const char of lower) {
    const code = char.codePointAt(0)!

    const isCJK = isCJKCodePoint(code)

    const isWhitespace = code === 32 || code === 9 || code === 10 || code === 13

    if (isCJK) {
      if (bufferStart !== -1) {
        tokens.push(lower.slice(bufferStart, bufferEnd))
        bufferStart = -1
      }
      tokens.push(char)
    } else if (isWhitespace) {
      if (bufferStart !== -1) {
        tokens.push(lower.slice(bufferStart, bufferEnd))
        bufferStart = -1
      }
    } else {
      if (bufferStart === -1) bufferStart = i
      bufferEnd = i + char.length
    }

    i += char.length
  }

  if (bufferStart !== -1) {
    tokens.push(lower.slice(bufferStart))
  }

  return tokens
}

let index = new FlexSearch.Document<Item>({
  encode: encoder,
  document: {
    id: "id",
    tag: "tags",
    index: [
      {
        field: "title",
        tokenize: "forward",
      },
      {
        field: "content",
        tokenize: "forward",
      },
      {
        field: "tags",
        tokenize: "forward",
      },
    ],
  },
})

const p = new DOMParser()
const fetchContentCache: Map<FullSlug, Element[]> = new Map()
const contextWindowWords = 30
const numSearchResults = 12
const searchCandidateLimit = 80
const numTagResults = 5
const searchRuntime = globalThis as typeof globalThis & {
  loadSearchIndex?: () => Promise<ContentIndex>
}

let searchDataPromise: Promise<ContentIndex> | undefined
let searchData: ContentIndex | undefined

function loadSearchData(): Promise<ContentIndex> {
  if (!searchDataPromise) {
    searchDataPromise = (
      searchRuntime.loadSearchIndex?.() ?? Promise.resolve({} as ContentIndex)
    ).then(async (payload) => {
      searchData = payload
      await fillDocument(payload)
      return payload
    })
  }
  return searchDataPromise
}

const tokenizeTerm = (term: string) => {
  const tokens = term.split(/\s+/).filter((t) => t.trim() !== "")
  const tokenLen = tokens.length
  if (tokenLen > 1) {
    for (let i = 1; i < tokenLen; i++) {
      tokens.push(tokens.slice(0, i + 1).join(" "))
    }
  }

  return tokens.sort((a, b) => b.length - a.length) // always highlight longest terms first
}

function readSearchOptionsState(): SearchOptionsState {
  const stored = localStorage.getItem(OPTIONS_STORAGE_KEY)
  if (!stored) {
    return { ...DEFAULT_SEARCH_OPTIONS_STATE }
  }
  try {
    const parsed = JSON.parse(stored) as Partial<SearchOptionsState>
    const selectedSourceIds = Array.isArray(parsed.selectedSourceIds)
      ? parsed.selectedSourceIds.filter((value): value is string => typeof value === "string")
      : []
    return {
      minClaimCount: Number.isFinite(parsed.minClaimCount)
        ? Math.max(0, Number(parsed.minClaimCount))
        : DEFAULT_SEARCH_OPTIONS_STATE.minClaimCount,
      sourceSelectionMode: parsed.sourceSelectionMode === "custom" ? "custom" : "all",
      selectedSourceIds,
    }
  } catch {
    return { ...DEFAULT_SEARCH_OPTIONS_STATE }
  }
}

function searchOptionFiltersActive(options: SearchOptionsState): boolean {
  return options.minClaimCount > 0 || options.sourceSelectionMode === "custom"
}

function searchOptionsMatchPage(
  page: SearchIndexDetails | undefined,
  options: SearchOptionsState,
): boolean {
  if (!searchOptionFiltersActive(options)) {
    return true
  }
  if (!page?.citationFilterable) {
    return false
  }

  const claimCount = Number(page.claimCount ?? 0)
  if (claimCount < options.minClaimCount) {
    return false
  }

  if (options.sourceSelectionMode === "all") {
    return true
  }

  const selected = new Set(options.selectedSourceIds)
  const sourceIds = Array.isArray(page.citationSourceIds)
    ? page.citationSourceIds.filter((value): value is string => typeof value === "string")
    : []
  return sourceIds.some((sourceId) => selected.has(sourceId))
}

function highlight(searchTerm: string, text: string, trim?: boolean) {
  const tokenizedTerms = tokenizeTerm(searchTerm)
  let tokenizedText = text.split(/\s+/).filter((t) => t !== "")

  let startIndex = 0
  let endIndex = tokenizedText.length - 1
  if (trim) {
    const includesCheck = (tok: string) =>
      tokenizedTerms.some((term) => tok.toLowerCase().startsWith(term.toLowerCase()))
    const occurrencesIndices = tokenizedText.map(includesCheck)

    let bestSum = 0
    let bestIndex = 0
    for (let i = 0; i < Math.max(tokenizedText.length - contextWindowWords, 0); i++) {
      const window = occurrencesIndices.slice(i, i + contextWindowWords)
      const windowSum = window.reduce((total, cur) => total + (cur ? 1 : 0), 0)
      if (windowSum >= bestSum) {
        bestSum = windowSum
        bestIndex = i
      }
    }

    startIndex = Math.max(bestIndex - contextWindowWords, 0)
    endIndex = Math.min(startIndex + 2 * contextWindowWords, tokenizedText.length - 1)
    tokenizedText = tokenizedText.slice(startIndex, endIndex)
  }

  const slice = tokenizedText
    .map((tok) => {
      // see if this tok is prefixed by any search terms
      for (const searchTok of tokenizedTerms) {
        if (tok.toLowerCase().includes(searchTok.toLowerCase())) {
          const regex = new RegExp(searchTok.toLowerCase(), "gi")
          return tok.replace(regex, `<span class="highlight">$&</span>`)
        }
      }
      return tok
    })
    .join(" ")

  return `${startIndex === 0 ? "" : "..."}${slice}${
    endIndex === tokenizedText.length - 1 ? "" : "..."
  }`
}

function highlightHTML(searchTerm: string, el: HTMLElement) {
  const p = new DOMParser()
  const tokenizedTerms = tokenizeTerm(searchTerm)
  const html = p.parseFromString(el.innerHTML, "text/html")

  const createHighlightSpan = (text: string) => {
    const span = document.createElement("span")
    span.className = "highlight"
    span.textContent = text
    return span
  }

  const highlightTextNodes = (node: Node, term: string) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const nodeText = node.nodeValue ?? ""
      const regex = new RegExp(term.toLowerCase(), "gi")
      const matches = nodeText.match(regex)
      if (!matches || matches.length === 0) return
      const spanContainer = document.createElement("span")
      let lastIndex = 0
      for (const match of matches) {
        const matchIndex = nodeText.indexOf(match, lastIndex)
        spanContainer.appendChild(document.createTextNode(nodeText.slice(lastIndex, matchIndex)))
        spanContainer.appendChild(createHighlightSpan(match))
        lastIndex = matchIndex + match.length
      }
      spanContainer.appendChild(document.createTextNode(nodeText.slice(lastIndex)))
      node.parentNode?.replaceChild(spanContainer, node)
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if ((node as HTMLElement).classList.contains("highlight")) return
      Array.from(node.childNodes).forEach((child) => highlightTextNodes(child, term))
    }
  }

  for (const term of tokenizedTerms) {
    highlightTextNodes(html.body, term)
  }

  return html.body
}

async function setupSearch(searchElement: Element, currentSlug: FullSlug) {
  const container = searchElement.querySelector(".search-container") as HTMLElement
  if (!container) return

  const sidebar = container.closest(".sidebar") as HTMLElement | null

  const searchButton = searchElement.querySelector(".search-button") as HTMLButtonElement
  if (!searchButton) return

  const searchBar = searchElement.querySelector(".search-bar") as HTMLInputElement
  if (!searchBar) return

  const searchLayout = searchElement.querySelector(".search-layout") as HTMLElement
  if (!searchLayout) return

  const appendLayout = (el: HTMLElement) => {
    searchLayout.appendChild(el)
  }

  const enablePreview =
    searchLayout.dataset.preview === "true" && window.matchMedia("(min-width: 900px)").matches
  let preview: HTMLDivElement | undefined = undefined
  let previewInner: HTMLDivElement | undefined = undefined
  const results = document.createElement("div")
  results.className = "results-container"
  appendLayout(results)

  if (enablePreview) {
    preview = document.createElement("div")
    preview.className = "preview-container"
    appendLayout(preview)
  }

  function hideSearch() {
    container.classList.remove("active")
    searchBar.value = "" // clear the input when we dismiss the search
    if (sidebar) sidebar.style.zIndex = ""
    removeAllChildren(results)
    if (preview) {
      removeAllChildren(preview)
    }
    searchLayout.classList.remove("display-results")
    searchType = "basic" // reset search type after closing
    searchButton.focus()
  }

  function showSearch(searchTypeNew: SearchType) {
    searchType = searchTypeNew
    if (sidebar) sidebar.style.zIndex = "1"
    container.classList.add("active")
    searchBar.focus()
    void loadSearchData()
  }

  let currentHover: HTMLInputElement | null = null
  async function shortcutHandler(e: HTMLElementEventMap["keydown"]) {
    if (e.key === "k" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
      e.preventDefault()
      const searchBarOpen = container.classList.contains("active")
      searchBarOpen ? hideSearch() : showSearch("basic")
      return
    } else if (e.shiftKey && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      // Hotkey to open tag search
      e.preventDefault()
      const searchBarOpen = container.classList.contains("active")
      searchBarOpen ? hideSearch() : showSearch("tags")

      // add "#" prefix for tag search
      searchBar.value = "#"
      return
    }

    if (currentHover) {
      currentHover.classList.remove("focus")
    }

    // If search is active, then we will render the first result and display accordingly
    if (!container.classList.contains("active")) return
    if (e.key === "Enter" && !e.isComposing) {
      // If result has focus, navigate to that one, otherwise pick first result
      if (results.contains(document.activeElement)) {
        const active = document.activeElement as HTMLInputElement
        if (active.classList.contains("no-match")) return
        await displayPreview(active)
        active.click()
      } else {
        const anchor = document.getElementsByClassName("result-card")[0] as HTMLInputElement | null
        if (!anchor || anchor.classList.contains("no-match")) return
        await displayPreview(anchor)
        anchor.click()
      }
    } else if (e.key === "ArrowUp" || (e.shiftKey && e.key === "Tab")) {
      e.preventDefault()
      if (results.contains(document.activeElement)) {
        // If an element in results-container already has focus, focus previous one
        const currentResult = currentHover
          ? currentHover
          : (document.activeElement as HTMLInputElement | null)
        const prevResult = currentResult?.previousElementSibling as HTMLInputElement | null
        currentResult?.classList.remove("focus")
        prevResult?.focus()
        if (prevResult) currentHover = prevResult
        await displayPreview(prevResult)
      }
    } else if (e.key === "ArrowDown" || e.key === "Tab") {
      e.preventDefault()
      // The results should already been focused, so we need to find the next one.
      // The activeElement is the search bar, so we need to find the first result and focus it.
      if (document.activeElement === searchBar || currentHover !== null) {
        const firstResult = currentHover
          ? currentHover
          : (document.getElementsByClassName("result-card")[0] as HTMLInputElement | null)
        const secondResult = firstResult?.nextElementSibling as HTMLInputElement | null
        firstResult?.classList.remove("focus")
        secondResult?.focus()
        if (secondResult) currentHover = secondResult
        await displayPreview(secondResult)
      }
    }
  }

  const formatForDisplay = (term: string, id: number) => {
    const slug = idDataMap[id]
    const page = searchData?.[slug]
    return {
      id,
      slug,
      title: searchType === "tags" ? (page?.title ?? "") : highlight(term, page?.title ?? ""),
      content: highlight(term, page?.content ?? "", true),
      tags: highlightTags(term.substring(1), page?.tags ?? []),
    }
  }

  const basename = (slug: FullSlug) => String(slug).split("/").pop() ?? String(slug)

  const resultContainsQuery = (term: string, id: number) => {
    const queryTokens = normalizeSearchText(term.trim())
      .split(/\s+/)
      .filter(Boolean)
    if (queryTokens.length === 0) return true

    const slug = idDataMap[id]
    const page = searchData?.[slug]
    const haystack = normalizeSearchText(
      [page?.title ?? "", page?.content ?? "", ...(page?.tags ?? []), String(slug).replaceAll("/", " ")]
        .join(" ")
        .replaceAll("-", " "),
    )
    return queryTokens.every((token) => haystack.includes(token))
  }

  const rankResult = (term: string, id: number) => {
    const slug = idDataMap[id]
    const page = searchData?.[slug]
    const query = normalizeSearchText(term.trim())
    const title = normalizeSearchText(page?.title ?? "")
    const slugName = normalizeSearchText(basename(slug).replaceAll("-", " "))
    const path = normalizeSearchText(String(slug).replaceAll("/", " "))
    const quoteCount = Number(page?.quoteCount ?? 0)
    const claimCount = Number(page?.claimCount ?? 0)

    if (!query) return 0
    if (title === query) return 1_000_000 + quoteCount * 10 + claimCount
    if (slugName === query) return 950_000 + quoteCount * 10 + claimCount
    if (title.startsWith(`${query} `)) return 900_000 + quoteCount * 10 + claimCount
    if (slugName.startsWith(`${query} `)) return 850_000 + quoteCount * 10 + claimCount
    if (title.split(/\s+/).includes(query)) return 800_000 + quoteCount * 10 + claimCount
    if (path.split(/\s+/).includes(query)) return 750_000 + quoteCount * 10 + claimCount
    if (title.includes(query)) return 700_000 + quoteCount * 10 + claimCount
    if (path.includes(query)) return 650_000 + quoteCount * 10 + claimCount
    return quoteCount * 10 + claimCount
  }

  function highlightTags(term: string, tags: string[]) {
    if (!tags || searchType !== "tags") {
      return []
    }

    return tags
      .map((tag) => {
        if (tag.toLowerCase().includes(term.toLowerCase())) {
          return `<li><p class="match-tag">#${tag}</p></li>`
        } else {
          return `<li><p>#${tag}</p></li>`
        }
      })
      .slice(0, numTagResults)
  }

  function resolveUrl(slug: FullSlug): URL {
    return new URL(resolveRelative(currentSlug, slug), location.toString())
  }

  const resultToHTML = ({ slug, title, content, tags }: Item) => {
    const htmlTags = tags.length > 0 ? `<ul class="tags">${tags.join("")}</ul>` : ``
    const itemTile = document.createElement("a")
    itemTile.classList.add("result-card")
    itemTile.id = slug
    itemTile.href = resolveUrl(slug).toString()
    itemTile.innerHTML = `
      <h3 class="card-title">${title}</h3>
      ${htmlTags}
      <p class="card-description">${content}</p>
    `
    itemTile.addEventListener("click", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      hideSearch()
    })

    const handler = (event: MouseEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      hideSearch()
    }

    async function onMouseEnter(ev: MouseEvent) {
      if (!ev.target) return
      const target = ev.target as HTMLInputElement
      await displayPreview(target)
    }

    itemTile.addEventListener("mouseenter", onMouseEnter)
    window.addCleanup(() => itemTile.removeEventListener("mouseenter", onMouseEnter))
    itemTile.addEventListener("click", handler)
    window.addCleanup(() => itemTile.removeEventListener("click", handler))

    return itemTile
  }

  function writeSearchOptionsState(options: SearchOptionsState) {
    localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options))
    const event: CustomEventMap["quartz-options-change"] = new CustomEvent("quartz-options-change", {
      detail: {},
    })
    document.dispatchEvent(event)
  }

  async function displayResults(
    finalResults: Item[],
    filteredResultCount: number,
    options: SearchOptionsState,
  ) {
    removeAllChildren(results)
    const createFilteredCard = () => {
      const card = document.createElement("button")
      card.type = "button"
      card.className = "result-card no-match filtered-match"
      card.innerHTML = `
        <h3>Rezultatai paslėpti filtro</h3>
        <p>Rasta ${filteredResultCount}, bet dabartinis filtras rodo tik objektus su bent ${options.minClaimCount} teiginiais.</p>
        <p class="filter-hint">Spausk čia, kad šiai paieškai sumažintum minimumą iki 0.</p>
      `
      card.addEventListener("click", () => {
        writeSearchOptionsState({ ...options, minClaimCount: 0 })
        searchBar.dispatchEvent(new Event("input", { bubbles: true }))
      })
      return card
    }

    if (finalResults.length === 0) {
      if (filteredResultCount > 0) {
        results.append(createFilteredCard())
      } else {
        results.innerHTML = `<a class="result-card no-match">
            <h3>No results.</h3>
            <p>Try another search term?</p>
        </a>`
      }
    } else {
      results.append(...finalResults.map(resultToHTML))
    }

    if (finalResults.length === 0 && preview) {
      // no results, clear previous preview
      removeAllChildren(preview)
    } else {
      // focus on first result, then also dispatch preview immediately
      const firstChild = results.firstElementChild as HTMLElement
      firstChild.classList.add("focus")
      currentHover = firstChild as HTMLInputElement
      await displayPreview(firstChild)
    }
  }

  async function fetchContent(slug: FullSlug): Promise<Element[]> {
    if (fetchContentCache.has(slug)) {
      return fetchContentCache.get(slug) as Element[]
    }

    const targetUrl = resolveUrl(slug).toString()
    const contents = await fetch(targetUrl)
      .then((res) => res.text())
      .then((contents) => {
        if (contents === undefined) {
          throw new Error(`Could not fetch ${targetUrl}`)
        }
        const html = p.parseFromString(contents ?? "", "text/html")
        normalizeRelativeURLs(html, targetUrl)
        return [...html.getElementsByClassName("popover-hint")]
      })

    fetchContentCache.set(slug, contents)
    return contents
  }

  async function displayPreview(el: HTMLElement | null) {
    if (!searchLayout || !enablePreview || !el || !preview) return
    const slug = el.id as FullSlug
    const innerDiv = await fetchContent(slug).then((contents) =>
      contents.flatMap((el) => [...highlightHTML(currentSearchTerm, el as HTMLElement).children]),
    )
    previewInner = document.createElement("div")
    previewInner.classList.add("preview-inner")
    previewInner.append(...innerDiv)
    preview.replaceChildren(previewInner)

    // scroll to longest
    const highlights = [...preview.getElementsByClassName("highlight")].sort(
      (a, b) => b.innerHTML.length - a.innerHTML.length,
    )
    highlights[0]?.scrollIntoView({ block: "start" })
  }

  async function onType(e: HTMLElementEventMap["input"]) {
    if (!searchLayout || !index) return
    await loadSearchData()
    currentSearchTerm = (e.target as HTMLInputElement).value
    searchLayout.classList.toggle("display-results", currentSearchTerm !== "")
    searchType = currentSearchTerm.startsWith("#") ? "tags" : "basic"

    let searchResults: DefaultDocumentSearchResults<Item>
    if (searchType === "tags") {
      currentSearchTerm = currentSearchTerm.substring(1).trim()
      const separatorIndex = currentSearchTerm.indexOf(" ")
      if (separatorIndex != -1) {
        // search by title and content index and then filter by tag (implemented in flexsearch)
        const tag = currentSearchTerm.substring(0, separatorIndex)
        const query = currentSearchTerm.substring(separatorIndex + 1).trim()
        searchResults = await index.searchAsync({
          query: query,
          // return at least 10000 documents, so it is enough to filter them by tag (implemented in flexsearch)
          limit: Math.max(numSearchResults, 10000),
          index: ["title", "content"],
          tag: { tags: tag },
        })
        for (let searchResult of searchResults) {
          searchResult.result = searchResult.result.slice(0, numSearchResults)
        }
        // set search type to basic and remove tag from term for proper highlightning and scroll
        searchType = "basic"
        currentSearchTerm = query
      } else {
        // default search by tags index
        searchResults = await index.searchAsync({
          query: currentSearchTerm,
          limit: searchCandidateLimit,
          index: ["tags"],
        })
      }
    } else if (searchType === "basic") {
      searchResults = await index.searchAsync({
        query: currentSearchTerm,
        limit: searchCandidateLimit,
        index: ["title", "content"],
      })
    }

    const getByField = (field: string): number[] => {
      const results = searchResults.filter((x) => x.field === field)
      return results.length === 0 ? [] : ([...results[0].result] as number[])
    }

    // order titles ahead of content
    const allIds: Set<number> = new Set([
      ...getByField("title"),
      ...getByField("content"),
      ...getByField("tags"),
    ])
    const options = readSearchOptionsState()
    const candidateIds = [...allIds].filter((id) => resultContainsQuery(currentSearchTerm, id))
    const visibleIds = candidateIds.filter((id) =>
      searchOptionsMatchPage(searchData?.[idDataMap[id]], options),
    )
    const finalResults = visibleIds
      .sort((a, b) => rankResult(currentSearchTerm, b) - rankResult(currentSearchTerm, a))
      .slice(0, numSearchResults)
      .map((id) => formatForDisplay(currentSearchTerm, id))
    await displayResults(finalResults, Math.max(0, candidateIds.length - visibleIds.length), options)
  }

  document.addEventListener("keydown", shortcutHandler)
  window.addCleanup(() => document.removeEventListener("keydown", shortcutHandler))
  searchButton.addEventListener("click", () => showSearch("basic"))
  window.addCleanup(() => searchButton.removeEventListener("click", () => showSearch("basic")))
  searchBar.addEventListener("input", onType)
  window.addCleanup(() => searchBar.removeEventListener("input", onType))
  const onOptionsChange = () => {
    if (!container.classList.contains("active") || !searchBar.value) {
      return
    }
    searchBar.dispatchEvent(new Event("input", { bubbles: true }))
  }
  document.addEventListener("quartz-options-change", onOptionsChange)
  window.addCleanup(() => document.removeEventListener("quartz-options-change", onOptionsChange))

  registerEscapeHandler(container, hideSearch)
}

/**
 * Fills flexsearch document with data
 * @param index index to fill
 * @param data data to fill index with
 */
let indexPopulated = false
async function fillDocument(data: ContentIndex) {
  if (indexPopulated) return
  let id = 0
  const promises: Array<Promise<unknown>> = []
  idDataMap = Object.keys(data) as FullSlug[]
  for (const [slug, fileData] of Object.entries<SearchIndexDetails>(data)) {
    const itemId = id++
    promises.push(
      index.addAsync(itemId, {
        id: itemId,
        slug: slug as FullSlug,
        title: fileData.title,
        content: fileData.content,
        tags: fileData.tags,
      }),
    )
  }

  await Promise.all(promises)
  indexPopulated = true
}

document.addEventListener("nav", async (e: CustomEventMap["nav"]) => {
  const currentSlug = e.detail.url
  const searchElement = document.getElementsByClassName("search")
  for (const element of searchElement) {
    await setupSearch(element, currentSlug)
  }
})
