function clickFirst(selector: string) {
  const element = document.querySelector<HTMLElement>(selector)
  if (element) {
    element.click()
    return true
  }
  return false
}

function setupLIHeader() {
  const search = document.querySelector<HTMLButtonElement>("[data-li-search]")
  const menus = document.querySelectorAll<HTMLElement>("[data-li-menu]")

  if (search && !search.dataset.bound) {
    search.dataset.bound = "true"
    search.addEventListener("click", () => clickFirst(".search .search-button"))
  }

  menus.forEach((menu) => {
    if (menu.dataset.bound) return
    menu.dataset.bound = "true"
    const trigger = menu.querySelector<HTMLElement>("[data-li-menu-trigger]")
    const panel = menu.querySelector<HTMLElement>("[data-li-menu-panel]")
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

document.addEventListener("nav", setupLIHeader)
document.addEventListener("DOMContentLoaded", setupLIHeader)
