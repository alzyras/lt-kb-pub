const tabRoots = new WeakSet<HTMLElement>()

function initObjectDetailTabs() {
  document.querySelectorAll<HTMLElement>("[data-object-tabs='true']").forEach((root) => {
    if (tabRoots.has(root)) return
    tabRoots.add(root)
    const links = [...root.querySelectorAll<HTMLAnchorElement>("[data-object-tab]")]
    const panels = [...root.querySelectorAll<HTMLElement>("[data-object-panel]")]
    if (!links.length || !panels.length) return

    const activate = () => {
      const requested = decodeURIComponent(window.location.hash.replace(/^#/, ""))
      const active = panels.some((panel) => panel.id === requested) ? requested : "apzvalga"
      root.dataset.objectTabReady = "true"
      for (const panel of panels) panel.hidden = panel.id !== active
      for (const link of links) {
        const key = link.dataset.objectTab === "overview" ? "apzvalga" : link.dataset.objectTab
        const selected = key === active
        link.setAttribute("aria-current", selected ? "page" : "false")
      }
    }

    for (const link of links) {
      link.addEventListener("click", (event) => {
        // Overview, relations and sources are real URL fragments, but switching them
        // should keep the reader at the tab strip instead of letting the browser jump
        // down to the hidden section in the document.
        if (!link.hash) return
        event.preventDefault()
        const next = `${window.location.pathname}${window.location.search}${link.hash}`
        window.history.pushState(null, "", next)
        activate()
        window.scrollTo({ top: 0, behavior: "auto" })
      })
    }
    window.addEventListener("hashchange", activate)
    window.addEventListener("popstate", activate)
    activate()
  })
}

initObjectDetailTabs()
document.addEventListener("nav", initObjectDetailTabs)
