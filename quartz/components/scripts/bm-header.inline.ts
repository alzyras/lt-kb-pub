function clickFirst(selector: string) {
  const element = document.querySelector<HTMLElement>(selector)
  if (element) {
    element.click()
    return true
  }
  return false
}

function setupBMHeader() {
  const search = document.querySelector<HTMLButtonElement>("[data-bm-search]")
  const reader = document.querySelector<HTMLButtonElement>("[data-bm-reader]")
  const theme = document.querySelector<HTMLButtonElement>("[data-bm-theme]")
  const adv = document.querySelector<HTMLButtonElement>("[data-bm-adv]")
  const menus = document.querySelectorAll<HTMLElement>("[data-bm-menu]")

  if (search && !search.dataset.bound) {
    search.dataset.bound = "true"
    search.addEventListener("click", () => clickFirst(".search .search-button"))
  }

  if (reader && !reader.dataset.bound) {
    reader.dataset.bound = "true"
    reader.addEventListener("click", () => clickFirst(".readermode"))
  }

  if (theme && !theme.dataset.bound) {
    theme.dataset.bound = "true"
    theme.addEventListener("click", () => clickFirst(".darkmode"))
  }

  if (adv && !adv.dataset.bound) {
    adv.dataset.bound = "true"
    adv.addEventListener("click", () => clickFirst(".advanced-evidence-toggle"))
  }

  menus.forEach((menu) => {
    if (menu.dataset.bound) return
    menu.dataset.bound = "true"
    const trigger = menu.querySelector<HTMLElement>("[data-bm-menu-trigger]")
    const panel = menu.querySelector<HTMLElement>("[data-bm-menu-panel]")
    if (!trigger || !panel) return

    const setOpen = (open: boolean) => {
      menu.classList.toggle("is-open", open)
      trigger.setAttribute("aria-expanded", open ? "true" : "false")
    }

    trigger.addEventListener("click", (event) => {
      if (
        window.matchMedia("(hover: none), (pointer: coarse)").matches &&
        !menu.classList.contains("is-open")
      ) {
        event.preventDefault()
        setOpen(true)
      }
    })

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        setOpen(true)
        panel.querySelector<HTMLElement>("a")?.focus()
      }
      if (event.key === "Escape") {
        setOpen(false)
        trigger.focus()
      }
    })

    menu.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (!menu.contains(document.activeElement)) setOpen(false)
      }, 0)
    })

    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target as Node)) setOpen(false)
    })
  })
}

document.addEventListener("nav", setupBMHeader)
document.addEventListener("DOMContentLoaded", setupBMHeader)
