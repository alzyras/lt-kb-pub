import micromorph from "micromorph"
import { FullSlug, RelativeURL, getFullSlug, normalizeRelativeURLs } from "../../util/path"
import { fetchCanonical } from "./util"

// adapted from `micromorph`
// https://github.com/natemoo-re/micromorph
const NODE_TYPE_ELEMENT = 1
let announcer = document.createElement("route-announcer")
const isElement = (target: EventTarget | null): target is Element =>
  (target as Node)?.nodeType === NODE_TYPE_ELEMENT
const isLocalUrl = (href: string) => {
  try {
    const url = new URL(href)
    if (window.location.origin === url.origin) {
      return true
    }
  } catch (e) {}
  return false
}

const isSamePage = (url: URL): boolean => {
  const sameOrigin = url.origin === window.location.origin
  const samePath = url.pathname === window.location.pathname
  return sameOrigin && samePath
}

const getOpts = ({ target }: Event): { url: URL; scroll?: boolean } | undefined => {
  if (!isElement(target)) return
  const a = target.closest("a")
  if (!a) return
  if (a.target === "_blank" || a.hasAttribute("download")) return
  if ("routerIgnore" in a.dataset) return
  const { href } = a
  if (!isLocalUrl(href)) return
  return { url: new URL(href), scroll: "routerNoscroll" in a.dataset ? false : undefined }
}

function notifyNav(url: FullSlug) {
  const event: CustomEventMap["nav"] = new CustomEvent("nav", { detail: { url } })
  document.dispatchEvent(event)
}

function startLoading() {
  const loadingBar = document.createElement("div")
  loadingBar.className = "navigation-progress"
  loadingBar.style.width = "0"
  if (!document.body.contains(loadingBar)) {
    document.body.appendChild(loadingBar)
  }

  setTimeout(() => {
    loadingBar.style.width = "80%"
  }, 100)
}

let isNavigating = false
let objectTabScroll: number | undefined
let objectTabAnchor: { scrollY: number; viewportTop: number } | undefined
let renderedPath = location.pathname
function currentScrollTop() {
  return Math.max(
    0,
    window.scrollY || 0,
    document.scrollingElement?.scrollTop || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0,
  )
}
const rememberScroll = () =>
  history.replaceState({ ...history.state, scrollY: currentScrollTop() }, "")
function scrollToInstant(top: number) {
  // `behavior: "auto"` still follows Quartz's global `scroll-behavior: smooth`
  // rule in some browsers. Temporarily override that rule and use the legacy
  // two-argument form so tab changes never animate through the page.
  const root = document.documentElement
  const previous = root.style.scrollBehavior
  const next = Math.max(0, top)
  root.style.scrollBehavior = "auto"
  if (document.scrollingElement) document.scrollingElement.scrollTop = next
  root.scrollTop = next
  document.body.scrollTop = next
  window.scrollTo(0, next)
  root.style.scrollBehavior = previous
}
function tabScrollPosition() {
  const strip = document.querySelector<HTMLElement>(".object-detail-tabs")
  const box = strip?.getBoundingClientRect()
  if (!box) return undefined
  // A gallery route has a different content workspace, so preserving only
  // document.scrollY makes the tab strip drift. Anchor its actual viewport
  // coordinate and restore that coordinate after the DOM morph instead.
  const currentScrollY = currentScrollTop()
  objectTabAnchor = { scrollY: currentScrollY, viewportTop: box.top }
  return currentScrollY
}

function restoreObjectTabPosition(fallback: number) {
  const strip = document.querySelector<HTMLElement>(".object-detail-tabs")
  const nextTop = strip?.getBoundingClientRect().top
  const top =
    objectTabAnchor && typeof nextTop === "number" && Number.isFinite(nextTop)
      ? Math.max(0, objectTabAnchor.scrollY + nextTop - objectTabAnchor.viewportTop)
      : fallback
  // Quartz globally enables smooth scrolling for in-page anchors. A tab is a
  // content switch, not an anchor jump: restoring the tab strip must happen
  // in one frame so the page never visibly travels from the top or bottom.
  scrollToInstant(top)
}
let p: DOMParser
async function _navigate(url: URL, isBack: boolean = false) {
  isNavigating = true
  startLoading()
  p = p || new DOMParser()
  const contents = await fetchCanonical(url)
    .then((res) => {
      const contentType = res.headers.get("content-type")
      if (contentType?.startsWith("text/html")) {
        return res.text()
      } else {
        window.location.assign(url)
      }
    })
    .catch(() => {
      window.location.assign(url)
    })

  if (!contents) return

  // notify about to nav
  const event: CustomEventMap["prenav"] = new CustomEvent("prenav", { detail: {} })
  document.dispatchEvent(event)

  const html = p.parseFromString(contents, "text/html")
  normalizeRelativeURLs(html, url)

  let title = html.querySelector("title")?.textContent
  if (title) {
    document.title = title
  } else {
    const h1 = document.querySelector("h1")
    title = h1?.innerText ?? h1?.textContent ?? url.pathname
  }
  if (announcer.textContent !== title) {
    announcer.textContent = title
  }
  announcer.dataset.persist = ""
  html.body.appendChild(announcer)

  // morph body
  await micromorph(document.body, html.body)

  // now, patch head, re-executing scripts
  const elementsToRemove = document.head.querySelectorAll(":not([data-persist])")
  elementsToRemove.forEach((el) => el.remove())
  const elementsToAdd = html.head.querySelectorAll(":not([data-persist])")
  elementsToAdd.forEach((el) => document.head.appendChild(el))

  // delay setting the url until now
  // at this point everything is loaded so changing the url should resolve to the correct addresses
  if (!isBack) {
    history.pushState({}, "", url)
  }

  notifyNav(getFullSlug(window))
  renderedPath = url.pathname
  if (isBack) scrollToInstant(Number(history.state?.scrollY || 0))
  else if (objectTabScroll !== undefined) restoreObjectTabPosition(objectTabScroll)
  else if (url.hash)
    document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView()
  else scrollToInstant(0)
  objectTabScroll = undefined
  objectTabAnchor = undefined
  delete announcer.dataset.persist
}

async function navigate(url: URL, isBack: boolean = false) {
  if (isNavigating) return
  isNavigating = true
  try {
    await _navigate(url, isBack)
  } catch (e) {
    console.error(e)
    window.location.assign(url)
  } finally {
    isNavigating = false
  }
}

window.spaNavigate = navigate

function createRouter() {
  if (typeof window !== "undefined") {
    // Browser history should not perform its own animated restoration while a
    // tab route is being morphed into the current document.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual"
    window.addEventListener("click", async (event) => {
      const { url } = getOpts(event) ?? {}
      // dont hijack behaviour, just let browser act normally
      if (
        event.defaultPrevented ||
        !url ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return
      event.preventDefault()
      rememberScroll()
      const tab = isElement(event.target) && event.target.closest("[data-object-tab]")
      objectTabScroll = tab ? tabScrollPosition() : undefined

      if (isSamePage(url) && url.search === location.search && (url.hash || tab)) {
        if (url.href === location.href) {
          // Clicking the active tab is a no-op; do not leak its temporary
          // anchor into the next real navigation.
          objectTabScroll = undefined
          objectTabAnchor = undefined
          return
        }
        history.pushState({}, "", url)
        notifyNav(getFullSlug(window))
        if (tab) restoreObjectTabPosition(objectTabScroll ?? scrollY)
        else document.getElementById(decodeURIComponent(url.hash.substring(1)))?.scrollIntoView()
        objectTabScroll = undefined
        objectTabAnchor = undefined
        return
      }

      navigate(url, false)
    })

    window.addEventListener("popstate", (event) => {
      if (location.pathname === renderedPath) {
        notifyNav(getFullSlug(window))
        scrollToInstant(Number(event.state?.scrollY || 0))
        return
      }
      navigate(new URL(window.location.toString()), true)
      return
    })
  }

  return new (class Router {
    go(pathname: RelativeURL) {
      const url = new URL(pathname, window.location.toString())
      return navigate(url, false)
    }

    back() {
      return window.history.back()
    }

    forward() {
      return window.history.forward()
    }
  })()
}

createRouter()
notifyNav(getFullSlug(window))

if (!customElements.get("route-announcer")) {
  const attrs = {
    "aria-live": "assertive",
    "aria-atomic": "true",
    style:
      "position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px",
  }

  customElements.define(
    "route-announcer",
    class RouteAnnouncer extends HTMLElement {
      constructor() {
        super()
      }
      connectedCallback() {
        for (const [key, value] of Object.entries(attrs)) {
          this.setAttribute(key, value)
        }
      }
    },
  )
}
