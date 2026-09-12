function activateObjectPanels() {
  const root = document.querySelector<HTMLElement>("[data-object-tabs='true']")
  if (!root) return
  const keys: Record<string, string> = { "#rysiai": "rysiai", "#saltiniai": "saltiniai" }
  const key = keys[location.hash] || "apzvalga"
  root.dataset.objectTabReady = "true"
  root.querySelectorAll<HTMLElement>("[data-object-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.objectPanel !== key
  })
  const tabs: Record<string, string> = {
    overview: "apzvalga",
    relations: "rysiai",
    sources: "saltiniai",
  }
  root.querySelectorAll<HTMLAnchorElement>("[data-object-tab]").forEach((link) => {
    if (tabs[link.dataset.objectTab || ""] === key) link.setAttribute("aria-current", "page")
    else link.removeAttribute("aria-current")
  })
}

// Navigation and history belong to the SPA router; this script only renders state.
activateObjectPanels()
document.addEventListener("nav", activateObjectPanels)
window.addEventListener("hashchange", activateObjectPanels)
