function setupCollectionSearch() {
  for (const trigger of document.querySelectorAll<HTMLButtonElement>(
    "[data-collection-search-trigger]",
  )) {
    const onClick = () => {
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
  setupCollectionSearch()
  setupCollectionTabs()
  setupCollectionCopyLink()
})
