type ObjectListControlsWindow = Window &
  typeof globalThis & {
    applyQuartzOptionFilters?: () => void
    addCleanup?: (cleanup: () => void) => void
  }

const objectListControlsWindow = window as ObjectListControlsWindow
const objectListInitialized = new WeakSet<HTMLElement>()

function parseObjectListTags(value: string | undefined): string[] {
  return (value ?? "")
    .split("|")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => {
      try {
        return decodeURIComponent(tag)
      } catch {
        return tag
      }
    })
}

function objectListControlRoot(control: HTMLElement): HTMLElement {
  return control.parentElement ?? document.body
}

function objectListEntries(control: HTMLElement): HTMLLIElement[] {
  return [
    ...objectListControlRoot(control).querySelectorAll<HTMLLIElement>(
      'ul.section-ul[data-object-list-sortable="true"] > li.section-li',
    ),
  ]
}

function objectListSelectedTags(control: HTMLElement): string[] {
  return [
    ...control.querySelectorAll<HTMLElement>("[data-object-list-tag-pill]"),
  ].map((pill) => String(pill.dataset.tag ?? ""))
}

function compareObjectListItems(mode: string, a: HTMLLIElement, b: HTMLLIElement): number {
  const titleA = String(a.dataset.sortTitle ?? "")
  const titleB = String(b.dataset.sortTitle ?? "")
  const claimsA = Number(a.dataset.claimCount ?? "0")
  const claimsB = Number(b.dataset.claimCount ?? "0")
  const originalA = Number(a.dataset.originalIndex ?? "0")
  const originalB = Number(b.dataset.originalIndex ?? "0")
  const titleCompare = titleA.localeCompare(titleB, "lt", { sensitivity: "base" })

  if (mode === "title-asc") {
    return titleCompare || originalA - originalB
  }
  if (mode === "title-desc") {
    return -titleCompare || originalA - originalB
  }
  if (mode === "claims-desc") {
    return claimsB - claimsA || titleCompare || originalA - originalB
  }
  if (mode === "claims-asc") {
    return claimsA - claimsB || titleCompare || originalA - originalB
  }
  return originalA - originalB
}

function sortObjectList(control: HTMLElement) {
  const mode = control.querySelector<HTMLSelectElement>("[data-object-list-sort]")?.value ?? "claims-desc"
  const lists = objectListControlRoot(control).querySelectorAll<HTMLUListElement>(
    'ul.section-ul[data-object-list-sortable="true"]',
  )

  lists.forEach((list) => {
    const items = [...list.children].filter(
      (item): item is HTMLLIElement => item instanceof HTMLLIElement,
    )
    items.sort((a, b) => compareObjectListItems(mode, a, b))
    items.forEach((item) => list.append(item))
  })
}

function updateObjectListPillOptions(control: HTMLElement) {
  const selected = new Set(objectListSelectedTags(control))
  const select = control.querySelector<HTMLSelectElement>("[data-object-list-tag-select]")
  if (!select) {
    return
  }
  select.querySelectorAll<HTMLOptionElement>("option").forEach((option) => {
    option.disabled = option.value !== "" && selected.has(option.value)
  })
}

function updateObjectListSummary(control: HTMLElement) {
  const summary = control.querySelector<HTMLElement>("[data-object-list-summary]")
  if (!summary) {
    return
  }
  const entries = objectListEntries(control)
  const visible = entries.filter((entry) => !entry.hidden).length
  summary.textContent = `Rodoma ${visible} iš ${entries.length}`
}

function applyObjectListTagFilter(control: HTMLElement) {
  const selectedTags = objectListSelectedTags(control)
  const entries = objectListEntries(control)

  entries.forEach((entry) => {
    const tags = parseObjectListTags(entry.dataset.listTags)
    const keep = selectedTags.every((tag) => tags.includes(tag))
    entry.dataset.objectTagMatch = keep ? "true" : "false"
  })

  if (typeof objectListControlsWindow.applyQuartzOptionFilters === "function") {
    objectListControlsWindow.applyQuartzOptionFilters()
  } else {
    entries.forEach((entry) => {
      const periodOk = entry.dataset.periodMatch !== "false"
      const optionsOk = entry.dataset.optionsMatch !== "false"
      const tagOk = entry.dataset.objectTagMatch !== "false"
      entry.hidden = !(periodOk && optionsOk && tagOk)
    })
  }

  updateObjectListPillOptions(control)
  updateObjectListSummary(control)
}

function addObjectListTagPill(control: HTMLElement, tag: string) {
  if (!tag || objectListSelectedTags(control).includes(tag)) {
    return
  }

  const container = control.querySelector<HTMLElement>("[data-object-list-tag-pills]")
  if (!container) {
    return
  }

  const button = document.createElement("button")
  button.type = "button"
  button.className = "object-list-tag-pill"
  button.dataset.objectListTagPill = "true"
  button.dataset.tag = tag
  button.textContent = `#${tag}  x`
  button.setAttribute("aria-label", `Pašalinti tagą ${tag}`)

  const onRemove = () => {
    button.remove()
    applyObjectListTagFilter(control)
  }

  button.addEventListener("click", onRemove)
  objectListControlsWindow.addCleanup?.(() => button.removeEventListener("click", onRemove))
  container.append(button)
  applyObjectListTagFilter(control)
}

function initObjectListControls() {
  document.querySelectorAll<HTMLElement>('[data-object-list-controls="true"]').forEach((control) => {
    if (objectListInitialized.has(control)) {
      return
    }
    objectListInitialized.add(control)

    const sortSelect = control.querySelector<HTMLSelectElement>("[data-object-list-sort]")
    const tagSelect = control.querySelector<HTMLSelectElement>("[data-object-list-tag-select]")

    const onSort = () => sortObjectList(control)
    const onTag = () => {
      const tag = tagSelect?.value ?? ""
      addObjectListTagPill(control, tag)
      if (tagSelect) {
        tagSelect.value = ""
      }
    }

    sortSelect?.addEventListener("change", onSort)
    tagSelect?.addEventListener("change", onTag)
    objectListControlsWindow.addCleanup?.(() => {
      sortSelect?.removeEventListener("change", onSort)
      tagSelect?.removeEventListener("change", onTag)
    })

    sortObjectList(control)
    applyObjectListTagFilter(control)
  })
}

initObjectListControls()
document.addEventListener("nav", initObjectListControls)
