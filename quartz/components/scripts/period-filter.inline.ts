function updateFilter(control: HTMLElement, list: HTMLUListElement, changed: "start" | "end") {
  const startInput = control.querySelector<HTMLInputElement>('input[data-period-input="start"]')
  const endInput = control.querySelector<HTMLInputElement>('input[data-period-input="end"]')
  const unknownInput = control.querySelector<HTMLInputElement>('input[data-period-input="unknown"]')
  const startValue = control.querySelector<HTMLElement>('[data-period-value="start"]')
  const endValue = control.querySelector<HTMLElement>('[data-period-value="end"]')
  const summary = control.querySelector<HTMLElement>("[data-period-summary]")

  if (!startInput || !endInput || !unknownInput || !startValue || !endValue || !summary) {
    return
  }

  let selectedStart = Number(startInput.value)
  let selectedEnd = Number(endInput.value)
  if (selectedStart > selectedEnd) {
    if (changed === "start") {
      selectedEnd = selectedStart
      endInput.value = `${selectedEnd}`
    } else {
      selectedStart = selectedEnd
      startInput.value = `${selectedStart}`
    }
  }

  startValue.textContent = `${selectedStart}`
  endValue.textContent = `${selectedEnd}`

  const entries = list.querySelectorAll<HTMLLIElement>("li.section-li")
  let visible = 0
  entries.forEach((entry) => {
    const isFilterable = entry.dataset.periodFilterable === "true"
    const start = Number(entry.dataset.periodStart)
    const end = Number(entry.dataset.periodEnd)
    const hasRange = Number.isFinite(start) && Number.isFinite(end)

    let keep = true
    if (isFilterable) {
      if (hasRange) {
        keep = start <= selectedEnd && end >= selectedStart
      } else {
        keep = unknownInput.checked
      }
    }

    entry.hidden = !keep
    if (keep) {
      visible += 1
    }
  })

  summary.textContent = `Rodoma ${visible} iš ${entries.length}`
}

document.addEventListener("nav", () => {
  const controls = document.querySelectorAll<HTMLElement>(
    '.period-filter-controls[data-period-filter-controls="true"]',
  )
  controls.forEach((control) => {
    const list = control.parentElement?.querySelector<HTMLUListElement>(
      'ul.section-ul[data-period-filter-enabled="true"]',
    )
    if (!list) {
      return
    }

    const startInput = control.querySelector<HTMLInputElement>('input[data-period-input="start"]')
    const endInput = control.querySelector<HTMLInputElement>('input[data-period-input="end"]')
    const unknownInput = control.querySelector<HTMLInputElement>(
      'input[data-period-input="unknown"]',
    )
    if (!startInput || !endInput || !unknownInput) {
      return
    }

    const onStart = () => updateFilter(control, list, "start")
    const onEnd = () => updateFilter(control, list, "end")
    const onUnknown = () => updateFilter(control, list, "end")

    startInput.addEventListener("input", onStart)
    endInput.addEventListener("input", onEnd)
    unknownInput.addEventListener("change", onUnknown)
    window.addCleanup(() => startInput.removeEventListener("input", onStart))
    window.addCleanup(() => endInput.removeEventListener("input", onEnd))
    window.addCleanup(() => unknownInput.removeEventListener("change", onUnknown))

    updateFilter(control, list, "end")
  })
})
