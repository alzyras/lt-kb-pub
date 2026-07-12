type PeriodFilterRefs = {
  control: HTMLElement
  lists: HTMLUListElement[]
  minInput: HTMLInputElement
  maxInput: HTMLInputElement
  unknownInput: HTMLInputElement
  rangeFill: HTMLElement
  startValue: HTMLElement
  endValue: HTMLElement
  summary: HTMLElement
}

type PeriodFilterWindow = Window &
  typeof globalThis & {
    applyQuartzOptionFilters?: () => void
  }

const periodFilterWindow = window as PeriodFilterWindow

const initializedPeriodFilters = new WeakSet<HTMLElement>()

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getRefs(control: HTMLElement): PeriodFilterRefs | undefined {
  const lists = [
    ...(control.parentElement?.querySelectorAll<HTMLUListElement>(
      'ul.section-ul[data-period-filter-enabled="true"]',
    ) ?? []),
  ]
  const minInput = control.querySelector<HTMLInputElement>('input[data-period-input="start"]')
  const maxInput = control.querySelector<HTMLInputElement>('input[data-period-input="end"]')
  const unknownInput = control.querySelector<HTMLInputElement>('input[data-period-input="unknown"]')
  const rangeFill = control.querySelector<HTMLElement>("[data-period-range-fill]")
  const startValue = control.querySelector<HTMLElement>('[data-period-value="start"]')
  const endValue = control.querySelector<HTMLElement>('[data-period-value="end"]')
  const summary = control.querySelector<HTMLElement>("[data-period-summary]")

  if (
    lists.length === 0 ||
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
    lists,
    minInput,
    maxInput,
    unknownInput,
    rangeFill,
    startValue,
    endValue,
    summary,
  }
}

function updateFilter(refs: PeriodFilterRefs, changed: "start" | "end", writeUrl = false) {
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
  refs.rangeFill.style.left = `calc(${left}% + var(--period-thumb-size, 0px) / 2)`
  refs.rangeFill.style.right = `calc(${right}% + var(--period-thumb-size, 0px) / 2)`

  if (writeUrl) {
    const url = new URL(location.href)
    selectedStart === min
      ? url.searchParams.delete("from")
      : url.searchParams.set("from", String(selectedStart))
    selectedEnd === max
      ? url.searchParams.delete("to")
      : url.searchParams.set("to", String(selectedEnd))
    refs.unknownInput.checked
      ? url.searchParams.delete("unknown")
      : url.searchParams.set("unknown", "0")
    url.searchParams.delete("page")
    history.replaceState({}, "", url)
  }

  const entries = refs.lists.flatMap((list) => [
    ...list.querySelectorAll<HTMLLIElement>("li.section-li"),
  ])
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

    entry.dataset.periodMatch = keep ? "true" : "false"
  })

  if (typeof periodFilterWindow.applyQuartzOptionFilters === "function") {
    periodFilterWindow.applyQuartzOptionFilters()
  } else {
    const visible = entries.filter((entry) => entry.dataset.periodMatch !== "false").length
    entries.forEach((entry) => {
      entry.hidden = entry.dataset.periodMatch === "false"
    })
    refs.summary.textContent = `Rodoma ${visible} iš ${entries.length}`
  }
  document.dispatchEvent(new CustomEvent<{}>("periodfilterchange", { detail: {} }))
}

function initPeriodFilters() {
  const controls = document.querySelectorAll<HTMLElement>(
    '.period-filter-controls[data-period-filter-controls="true"]',
  )

  controls.forEach((control) => {
    if (initializedPeriodFilters.has(control)) {
      return
    }

    const refs = getRefs(control)
    if (!refs) {
      return
    }

    initializedPeriodFilters.add(control)

    const params = new URLSearchParams(location.search)
    if (params.has("from")) refs.minInput.value = params.get("from") ?? refs.minInput.value
    if (params.has("to")) refs.maxInput.value = params.get("to") ?? refs.maxInput.value
    refs.unknownInput.checked = params.get("unknown") !== "0"

    const onStart = () => updateFilter(refs, "start", true)
    const onEnd = () => updateFilter(refs, "end", true)
    const commit = () => {
      document.dispatchEvent(
        new CustomEvent("periodfiltercommit", {
          detail: {
            start: Number(refs.minInput.value),
            end: Number(refs.maxInput.value),
            includeUnknown: refs.unknownInput.checked,
          },
        }),
      )
      document.dispatchEvent(
        new CustomEvent("analyticsfeature", {
          detail: {
            name: "period_filter",
            action: "commit",
            value: `${refs.minInput.value}-${refs.maxInput.value}-${refs.unknownInput.checked ? "with_unknown" : "dated_only"}`,
          },
        }),
      )
    }
    const onUnknown = () => {
      updateFilter(refs, "end", true)
      commit()
    }

    refs.minInput.addEventListener("input", onStart)
    refs.maxInput.addEventListener("input", onEnd)
    refs.minInput.addEventListener("change", commit)
    refs.maxInput.addEventListener("change", commit)
    refs.unknownInput.addEventListener("change", onUnknown)
    if (typeof window.addCleanup === "function") {
      window.addCleanup(() => refs.minInput.removeEventListener("input", onStart))
      window.addCleanup(() => refs.maxInput.removeEventListener("input", onEnd))
      window.addCleanup(() => refs.minInput.removeEventListener("change", commit))
      window.addCleanup(() => refs.maxInput.removeEventListener("change", commit))
      window.addCleanup(() => refs.unknownInput.removeEventListener("change", onUnknown))
    }

    updateFilter(refs, "end")
  })
}

initPeriodFilters()
document.addEventListener("nav", initPeriodFilters)
