type PeriodFilterRefs = {
  control: HTMLElement
  list: HTMLUListElement
  minInput: HTMLInputElement
  maxInput: HTMLInputElement
  unknownInput: HTMLInputElement
  rangeFill: HTMLElement
  startValue: HTMLElement
  endValue: HTMLElement
  summary: HTMLElement
}

const initialized = new WeakSet<HTMLElement>()

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getRefs(control: HTMLElement): PeriodFilterRefs | undefined {
  const list = control.parentElement?.querySelector<HTMLUListElement>(
    'ul.section-ul[data-period-filter-enabled="true"]',
  )
  const minInput = control.querySelector<HTMLInputElement>('input[data-period-input="start"]')
  const maxInput = control.querySelector<HTMLInputElement>('input[data-period-input="end"]')
  const unknownInput = control.querySelector<HTMLInputElement>('input[data-period-input="unknown"]')
  const rangeFill = control.querySelector<HTMLElement>("[data-period-range-fill]")
  const startValue = control.querySelector<HTMLElement>('[data-period-value="start"]')
  const endValue = control.querySelector<HTMLElement>('[data-period-value="end"]')
  const summary = control.querySelector<HTMLElement>("[data-period-summary]")

  if (
    !list ||
    !minInput ||
    !maxInput ||
    !unknownInput ||
    !rangeFill ||
    !startValue ||
    !endValue ||
    !summary
  ) {
    return undefined
  }

  return {
    control,
    list,
    minInput,
    maxInput,
    unknownInput,
    rangeFill,
    startValue,
    endValue,
    summary,
  }
}

function updateFilter(refs: PeriodFilterRefs, changed: "start" | "end") {
  const min = Number(refs.minInput.min || 0)
  const max = Number(refs.minInput.max || 2000)
  let selectedStart = clampValue(Number(refs.minInput.value), min, max)
  let selectedEnd = clampValue(Number(refs.maxInput.value), min, max)

  if (selectedStart > selectedEnd) {
    if (changed === "start") {
      selectedEnd = selectedStart
      refs.maxInput.value = `${selectedEnd}`
    } else {
      selectedStart = selectedEnd
      refs.minInput.value = `${selectedStart}`
    }
  }

  refs.startValue.textContent = `${selectedStart}`
  refs.endValue.textContent = `${selectedEnd}`

  const range = Math.max(max - min, 1)
  const left = ((selectedStart - min) / range) * 100
  const right = 100 - ((selectedEnd - min) / range) * 100
  refs.rangeFill.style.left = `${left}%`
  refs.rangeFill.style.right = `${right}%`

  const entries = refs.list.querySelectorAll<HTMLLIElement>("li.section-li")
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
        keep = refs.unknownInput.checked
      }
    }

    entry.hidden = !keep
    if (keep) {
      visible += 1
    }
  })

  refs.summary.textContent = `Rodoma ${visible} iš ${entries.length}`
}

function initPeriodFilters() {
  const controls = document.querySelectorAll<HTMLElement>(
    '.period-filter-controls[data-period-filter-controls="true"]',
  )

  controls.forEach((control) => {
    if (initialized.has(control)) {
      return
    }

    const refs = getRefs(control)
    if (!refs) {
      return
    }

    initialized.add(control)

    const onStart = () => updateFilter(refs, "start")
    const onEnd = () => updateFilter(refs, "end")
    const onUnknown = () => updateFilter(refs, "end")

    refs.minInput.addEventListener("input", onStart)
    refs.maxInput.addEventListener("input", onEnd)
    refs.unknownInput.addEventListener("change", onUnknown)
    if (typeof window.addCleanup === "function") {
      window.addCleanup(() => refs.minInput.removeEventListener("input", onStart))
      window.addCleanup(() => refs.maxInput.removeEventListener("input", onEnd))
      window.addCleanup(() => refs.unknownInput.removeEventListener("change", onUnknown))
    }

    updateFilter(refs, "end")
  })
}

initPeriodFilters()
document.addEventListener("nav", initPeriodFilters)
