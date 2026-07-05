import { FileTrieNode } from "../../util/fileTrie"
import { FullSlug, getFullSlug, resolveRelative, simplifySlug } from "../../util/path"
import { ContentMetaDetails } from "../../plugins/emitters/contentIndex"

type MaybeHTMLElement = HTMLElement | undefined

interface ParsedOptions {
  folderClickBehavior: "collapse" | "link"
  folderDefaultState: "collapsed" | "open"
  useSavedState: boolean
  sortFn: (a: FileTrieNode<ContentMetaDetails>, b: FileTrieNode<ContentMetaDetails>) => number
  filterFn: (node: FileTrieNode<ContentMetaDetails>) => boolean
  mapFn: (node: FileTrieNode<ContentMetaDetails>) => void
  order: "sort" | "filter" | "map"[]
}

type ExplorerWindow = Window &
  typeof globalThis & {
    applyQuartzOptionFilters?: () => void
    loadContentMeta?: () => Promise<Record<FullSlug, ContentMetaDetails>>
  }

type FolderState = {
  path: string
  collapsed: boolean
}

type LazyFolderChildren = {
  currentSlug: FullSlug
  node: FileTrieNode<ContentMetaDetails>
  opts: ParsedOptions
}

type ExplorerToggleButton = HTMLElement & {
  dataset: HTMLElement["dataset"] & {
    explorerToggleBound?: string
  }
}

let currentExplorerState: Array<FolderState>
const explorerWindow = window as ExplorerWindow
const lazyFolderChildren = new WeakMap<HTMLElement, LazyFolderChildren>()

function isElementVisible(element: Element): boolean {
  const htmlElement = element as HTMLElement
  const style = window.getComputedStyle(htmlElement)
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0" &&
    htmlElement.getClientRects().length > 0
  )
}

function toggleExplorer(this: HTMLElement) {
  const nearestExplorer = this.closest(".explorer") as HTMLElement
  if (!nearestExplorer) return
  const explorerCollapsed = nearestExplorer.classList.toggle("collapsed")
  nearestExplorer.setAttribute(
    "aria-expanded",
    nearestExplorer.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )

  if (!explorerCollapsed) {
    // Stop <html> from being scrollable when mobile explorer is open
    document.documentElement.classList.add("mobile-no-scroll")
  } else {
    document.documentElement.classList.remove("mobile-no-scroll")
  }
}

function bindExplorerToggle(
  button: HTMLElement,
  handler: (this: HTMLElement) => void | Promise<void>,
) {
  const toggle = button as ExplorerToggleButton
  if (toggle.dataset.explorerToggleBound === "true") {
    return
  }
  toggle.dataset.explorerToggleBound = "true"
  toggle.addEventListener("click", handler)
  window.addCleanup(() => toggle.removeEventListener("click", handler))
}

function toggleFolder(evt: MouseEvent) {
  evt.stopPropagation()
  const target = evt.target as MaybeHTMLElement
  if (!target) return

  // Check if target was svg icon or button
  const isSvg = target.nodeName === "svg"

  // corresponding <ul> element relative to clicked button/folder
  const folderContainer = (
    isSvg
      ? // svg -> div.folder-container
        target.parentElement
      : // button.folder-button -> div -> div.folder-container
        target.parentElement?.parentElement
  ) as MaybeHTMLElement
  if (!folderContainer) return
  const childFolderContainer = folderContainer.nextElementSibling as MaybeHTMLElement
  if (!childFolderContainer) return

  if (!childFolderContainer.classList.contains("open")) {
    hydrateLazyFolderChildren(childFolderContainer)
  }

  childFolderContainer.classList.toggle("open")

  // Collapse folder container
  const isCollapsed = !childFolderContainer.classList.contains("open")
  setFolderState(childFolderContainer, isCollapsed)

  const currentFolderState = currentExplorerState.find(
    (item) => item.path === folderContainer.dataset.folderpath,
  )
  if (currentFolderState) {
    currentFolderState.collapsed = isCollapsed
  } else {
    currentExplorerState.push({
      path: folderContainer.dataset.folderpath as FullSlug,
      collapsed: isCollapsed,
    })
  }

  const stringifiedFileTree = JSON.stringify(currentExplorerState)
  localStorage.setItem("fileTree", stringifiedFileTree)
}

function bindFolderToggleControls(root: ParentNode) {
  const controls = [
    ...(root instanceof Element && root.matches(".folder-button, .folder-icon") ? [root] : []),
    ...root.querySelectorAll(".folder-button, .folder-icon"),
  ] as HTMLElement[]

  for (const control of controls) {
    if (control.dataset.folderToggleBound === "true") continue
    control.dataset.folderToggleBound = "true"
    control.addEventListener("click", toggleFolder)
    window.addCleanup(() => control.removeEventListener("click", toggleFolder))
  }
}

function appendFolderChildren(
  currentSlug: FullSlug,
  node: FileTrieNode<ContentMetaDetails>,
  opts: ParsedOptions,
  ul: HTMLUListElement,
) {
  const fragment = document.createDocumentFragment()
  for (const child of node.children) {
    if (node.slug === "objektai" && !child.isFolder) {
      continue
    }
    const childNode = child.isFolder
      ? createFolderNode(currentSlug, child, opts)
      : createFileNode(currentSlug, child)
    fragment.appendChild(childNode)
  }
  ul.appendChild(fragment)
  bindFolderToggleControls(ul)
}

function hydrateLazyFolderChildren(folderOuter: HTMLElement) {
  if (folderOuter.dataset.childrenLoaded === "true") return
  const lazyChildren = lazyFolderChildren.get(folderOuter)
  if (!lazyChildren) return
  const ul = folderOuter.querySelector("ul")
  if (!ul) return
  appendFolderChildren(lazyChildren.currentSlug, lazyChildren.node, lazyChildren.opts, ul)
  folderOuter.dataset.childrenLoaded = "true"
  lazyFolderChildren.delete(folderOuter)
}

function createFileNode(
  currentSlug: FullSlug,
  node: FileTrieNode<ContentMetaDetails>,
): HTMLLIElement {
  const template = document.getElementById("template-file") as HTMLTemplateElement
  const clone = template.content.cloneNode(true) as DocumentFragment
  const li = clone.querySelector("li") as HTMLLIElement
  const a = li.querySelector("a") as HTMLAnchorElement
  const quoteCount = Number(node.data?.quoteCount ?? 0)
  const claimCount = Number(node.data?.claimCount ?? 0)
  const citationSourceIds = Array.isArray(node.data?.citationSourceIds)
    ? node.data.citationSourceIds.filter((value): value is string => typeof value === "string")
    : []
  const slugParts = node.slug.split("/")
  const isObjectPage = slugParts[0] === "objektai" && slugParts.length >= 3
  a.href = resolveRelative(currentSlug, node.slug)
  a.dataset.for = node.slug
  const title = document.createElement("span")
  title.className = "explorer-file-title"
  title.textContent = node.displayName
  a.appendChild(title)

  if (isObjectPage && Number.isFinite(claimCount)) {
    const claimLabel =
      claimCount % 10 === 1 && claimCount % 100 !== 11
        ? `${claimCount} teiginys`
        : claimCount % 10 >= 2 && claimCount % 10 <= 9 && (claimCount % 100 < 10 || claimCount % 100 >= 20)
          ? `${claimCount} teiginiai`
          : `${claimCount} teiginių`
    const badge = document.createElement("span")
    badge.className = "explorer-claim-badge"
    badge.textContent = `${claimCount}`
    badge.title = claimLabel
    badge.setAttribute("aria-label", claimLabel)
    a.appendChild(badge)
  }

  li.dataset.citationFilterable = node.data?.citationFilterable ? "true" : "false"
  li.dataset.quoteCount = `${quoteCount}`
  li.dataset.claimCount = `${claimCount}`
  li.dataset.citationSources = citationSourceIds.join("|")
  li.dataset.explorerNode = "file"
  li.dataset.explorerSlug = node.slug

  if (currentSlug === node.slug) {
    a.classList.add("active")
  }

  return li
}

function createFolderNode(
  currentSlug: FullSlug,
  node: FileTrieNode<ContentMetaDetails>,
  opts: ParsedOptions,
): HTMLLIElement {
  const template = document.getElementById("template-folder") as HTMLTemplateElement
  const clone = template.content.cloneNode(true) as DocumentFragment
  const li = clone.querySelector("li") as HTMLLIElement
  const folderContainer = li.querySelector(".folder-container") as HTMLElement
  const titleContainer = folderContainer.querySelector("div") as HTMLElement
  const folderOuter = li.querySelector(".folder-outer") as HTMLElement
  const ul = folderOuter.querySelector("ul") as HTMLUListElement

  const folderPath = node.slug
  folderContainer.dataset.folderpath = folderPath
  li.dataset.explorerNode = "folder"
  li.dataset.explorerSlug = folderPath

  if (currentSlug === folderPath) {
    folderContainer.classList.add("active")
  }

  if (opts.folderClickBehavior === "link") {
    // Replace button with link for link behavior
    const button = titleContainer.querySelector(".folder-button") as HTMLElement
    const a = document.createElement("a")
    a.href = resolveRelative(currentSlug, folderPath)
    a.dataset.for = folderPath
    a.className = "folder-title"
    a.textContent = node.displayName
    button.replaceWith(a)
  } else {
    const span = titleContainer.querySelector(".folder-title") as HTMLElement
    span.textContent = node.displayName
  }

  // if the saved state is collapsed or the default state is collapsed
  const isCollapsed =
    currentExplorerState.find((item) => item.path === folderPath)?.collapsed ??
    opts.folderDefaultState === "collapsed"

  // if this folder is a prefix of the current path we
  // want to open it anyways
  const simpleFolderPath = simplifySlug(folderPath)
  const folderIsPrefixOfCurrentSlug =
    simpleFolderPath === currentSlug.slice(0, simpleFolderPath.length)

  if (!isCollapsed || folderIsPrefixOfCurrentSlug) {
    folderOuter.classList.add("open")
  }

  if (!isCollapsed || folderIsPrefixOfCurrentSlug) {
    appendFolderChildren(currentSlug, node, opts, ul)
    folderOuter.dataset.childrenLoaded = "true"
  } else {
    folderOuter.dataset.childrenLoaded = "false"
    lazyFolderChildren.set(folderOuter, { currentSlug, node, opts })
  }

  return li
}

async function setupExplorer(currentSlug: FullSlug, targetExplorer?: HTMLElement) {
  const allExplorers = targetExplorer
    ? [targetExplorer]
    : ([...document.querySelectorAll("div.explorer")] as HTMLElement[])

  for (const explorer of allExplorers) {
    if (explorer.dataset.explorerBuilt === "true") {
      continue
    }
    const dataFns = JSON.parse(explorer.dataset.dataFns || "{}")
    const opts: ParsedOptions = {
      folderClickBehavior: (explorer.dataset.behavior || "collapse") as "collapse" | "link",
      folderDefaultState: (explorer.dataset.collapsed || "collapsed") as "collapsed" | "open",
      useSavedState: explorer.dataset.savestate === "true",
      order: dataFns.order || ["filter", "map", "sort"],
      sortFn: new Function("return " + (dataFns.sortFn || "undefined"))(),
      filterFn: new Function("return " + (dataFns.filterFn || "undefined"))(),
      mapFn: new Function("return " + (dataFns.mapFn || "undefined"))(),
    }

    // Get folder state from local storage
    const storageTree = localStorage.getItem("fileTree")
    const serializedExplorerState = storageTree && opts.useSavedState ? JSON.parse(storageTree) : []
    const oldIndex = new Map<string, boolean>(
      serializedExplorerState.map((entry: FolderState) => [entry.path, entry.collapsed]),
    )

    const data = await (explorerWindow.loadContentMeta?.() ?? Promise.resolve({}))
    const entries = [...Object.entries(data)] as [FullSlug, ContentMetaDetails][]
    const trie = FileTrieNode.fromEntries(entries)

    // Apply functions in order
    for (const fn of opts.order) {
      switch (fn) {
        case "filter":
          if (opts.filterFn) trie.filter(opts.filterFn)
          break
        case "map":
          if (opts.mapFn) trie.map(opts.mapFn)
          break
        case "sort":
          if (opts.sortFn) trie.sort(opts.sortFn)
          break
      }
    }

    // Get folder paths for state management
    const folderPaths = trie.getFolderPaths()
    currentExplorerState = folderPaths.map((path) => {
      const previousState = oldIndex.get(path)
      return {
        path,
        collapsed:
          previousState === undefined ? opts.folderDefaultState === "collapsed" : previousState,
      }
    })

    const explorerUl = explorer.querySelector(".explorer-ul")
    if (!explorerUl) continue
    explorer.dataset.explorerBuilt = "true"
    explorerUl
      .querySelectorAll("[data-explorer-fallback='true']")
      .forEach((fallbackNode) => fallbackNode.remove())

    // Create and insert new content
    const fragment = document.createDocumentFragment()
    for (const child of trie.children) {
      const node = child.isFolder
        ? createFolderNode(currentSlug, child, opts)
        : createFileNode(currentSlug, child)

      fragment.appendChild(node)
    }
    explorerUl.insertBefore(fragment, explorerUl.firstChild)

    // restore explorer scrollTop position if it exists
    const scrollTop = sessionStorage.getItem("explorerScrollTop")
    if (scrollTop) {
      explorerUl.scrollTop = parseInt(scrollTop)
    } else {
      // try to scroll to the active element if it exists
      const activeElement = explorerUl.querySelector(".active")
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth" })
      }
    }

    // Set up event handlers
    const explorerButtons = explorer.getElementsByClassName(
      "explorer-toggle",
    ) as HTMLCollectionOf<HTMLElement>
    for (const button of explorerButtons) {
      bindExplorerToggle(button, toggleExplorer)
    }

    bindFolderToggleControls(explorer)
  }

  explorerWindow.applyQuartzOptionFilters?.()
}

function setupExplorerShell(explorer: HTMLElement, currentSlug: FullSlug) {
  const explorerButtons = explorer.getElementsByClassName(
    "explorer-toggle",
  ) as HTMLCollectionOf<HTMLElement>
  for (const button of explorerButtons) {
    bindExplorerToggle(button, async function (this: HTMLElement) {
      const wasBuilt = explorer.dataset.explorerBuilt === "true"
      if (!wasBuilt) {
        await setupExplorer(currentSlug, explorer)
      }
      const isMobileToggle = this.dataset.mobile === "true"
      if (!isMobileToggle && !wasBuilt && !explorer.classList.contains("collapsed")) {
        return
      }
      toggleExplorer.call(this)
    })
  }
}

document.addEventListener("prenav", async () => {
  // save explorer scrollTop position
  const explorer = document.querySelector(".explorer-ul")
  if (!explorer) return
  sessionStorage.setItem("explorerScrollTop", explorer.scrollTop.toString())
})

async function setupExplorersForSlug(currentSlug: FullSlug) {
  // if mobile hamburger is visible, collapse by default
  for (const explorer of document.getElementsByClassName("explorer")) {
    const mobileExplorer = explorer.querySelector(".mobile-explorer")
    if (!mobileExplorer) {
      await setupExplorer(currentSlug, explorer as HTMLElement)
      continue
    }

    if (isElementVisible(mobileExplorer)) {
      explorer.classList.add("collapsed")
      explorer.setAttribute("aria-expanded", "false")
      setupExplorerShell(explorer as HTMLElement, currentSlug)

      // Allow <html> to be scrollable when mobile explorer is collapsed
      document.documentElement.classList.remove("mobile-no-scroll")
    } else {
      await setupExplorer(currentSlug, explorer as HTMLElement)
      setupExplorerShell(explorer as HTMLElement, currentSlug)
    }

    mobileExplorer.classList.remove("hide-until-loaded")
  }
}

document.addEventListener("nav", async (e: CustomEventMap["nav"]) => {
  await setupExplorersForSlug(e.detail.url)
})

const setupInitialExplorers = () => void setupExplorersForSlug(getFullSlug(window))

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupInitialExplorers, { once: true })
} else {
  setupInitialExplorers()
}

window.addEventListener("resize", function () {
  // Desktop explorer opens by default, and it stays open when the window is resized
  // to mobile screen size. Applies `no-scroll` to <html> in this edge case.
  const explorer = document.querySelector(".explorer")
  if (explorer && !explorer.classList.contains("collapsed")) {
    document.documentElement.classList.add("mobile-no-scroll")
    return
  }
})

function setFolderState(folderElement: HTMLElement, collapsed: boolean) {
  return collapsed ? folderElement.classList.remove("open") : folderElement.classList.add("open")
}
