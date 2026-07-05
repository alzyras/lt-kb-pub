function applyMediaFilters(root: HTMLElement) {
  const cards = [...root.querySelectorAll<HTMLElement>("[data-media-card]")]
  const buttons = [...root.querySelectorAll<HTMLButtonElement>("[data-media-view-button]")]
  const select = root.querySelector<HTMLSelectElement>("[data-media-relation-filter]")
  const status = root.querySelector<HTMLElement>("[data-media-status]")
  const currentView =
    buttons.find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.mediaView ||
    root.dataset.defaultView ||
    "all"
  const relation = select?.value || "all"

  let visible = 0
  for (const card of cards) {
    const directness = card.dataset.mediaDirectness || "weak"
    const relationType = card.dataset.mediaRelation || ""
    const viewMatch = currentView === "all" || directness === currentView
    const relationMatch = relation === "all" || relationType === relation
    const shouldShow = viewMatch && relationMatch
    card.hidden = !shouldShow
    if (shouldShow) visible += 1
  }

  if (status) {
    const total = cards.length
    status.textContent = `${visible} iš ${total} rodoma`
  }
}

function initMediaGallery(root: HTMLElement) {
  if (root.dataset.mediaGalleryReady === "true") return
  root.dataset.mediaGalleryReady = "true"

  const buttons = [...root.querySelectorAll<HTMLButtonElement>("[data-media-view-button]")]
  const defaultView = root.dataset.defaultView || "all"
  const availableDirect = root.querySelector('[data-media-directness="direct"]')
  const availableContextual = root.querySelector('[data-media-directness="contextual"]')

  for (const button of buttons) {
    const view = button.dataset.mediaView || "all"
    const disabled = (view === "direct" && !availableDirect) || (view === "contextual" && !availableContextual)
    button.disabled = disabled
    button.setAttribute("aria-pressed", view === defaultView ? "true" : "false")
    button.addEventListener("click", () => {
      if (button.disabled) return
      for (const candidate of buttons) {
        candidate.setAttribute("aria-pressed", candidate === button ? "true" : "false")
      }
      applyMediaFilters(root)
    })
  }

  const select = root.querySelector<HTMLSelectElement>("[data-media-relation-filter]")
  select?.addEventListener("change", () => applyMediaFilters(root))

  if (!buttons.some((button) => button.getAttribute("aria-pressed") === "true" && !button.disabled)) {
    const fallback = buttons.find((button) => !button.disabled)
    if (fallback) {
      for (const button of buttons) {
        button.setAttribute("aria-pressed", button === fallback ? "true" : "false")
      }
    }
  }

  applyMediaFilters(root)
}

for (const root of document.querySelectorAll<HTMLElement>("[data-media-gallery]")) {
  initMediaGallery(root)
}
