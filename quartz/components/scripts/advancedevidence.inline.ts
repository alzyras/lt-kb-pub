import { dispatchSettingsChange, loadSourceCatalog, readSettingsState, writeSettingsState } from "../../util/sourceSettings"

const STORAGE_KEY = "advancedEvidenceMode"
const DEFAULT_MODE: "on" | "off" = "off"

function readMode(): "on" | "off" {
  const settings = readSettingsState()
  if (settings.advancedEvidence) return "on"
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === "on" ? "on" : DEFAULT_MODE
}

function applyMode(mode: "on" | "off") {
  document.documentElement.setAttribute("advanced-evidence", mode)
}

let mode: "on" | "off" = readMode()
applyMode(mode)

document.addEventListener("nav", () => {
  mode = readMode()
  applyMode(mode)

  const applyClaimHashTarget = () => {
    document
      .querySelectorAll<HTMLElement>('[data-claim-row="true"].is-targeted')
      .forEach((row) => row.classList.remove("is-targeted"))

    const hash = window.location.hash.slice(1)
    if (!hash) {
      return
    }

    let targetId = hash
    try {
      targetId = decodeURIComponent(hash)
    } catch {
      targetId = hash
    }

    const target = document.getElementById(targetId)
    if (!target?.matches('[data-claim-row="true"]')) {
      return
    }

    target.classList.add("is-targeted")
  }

  const toggleMode = () => {
    mode = mode === "on" ? "off" : "on"
    localStorage.setItem(STORAGE_KEY, mode)
    applyMode(mode)
    const settings = { ...readSettingsState(), advancedEvidence: mode === "on" }
    loadSourceCatalog().then((catalog) => {
      writeSettingsState(settings, catalog)
      dispatchSettingsChange()
    })
  }

  for (const button of document.getElementsByClassName("advanced-evidence-toggle")) {
    button.addEventListener("click", toggleMode)
    window.addCleanup(() => button.removeEventListener("click", toggleMode))
  }

  const detailForRow = (row: HTMLElement): HTMLElement | null => {
    const toggle = row.querySelector<HTMLElement>("[data-claim-toggle][aria-controls]")
    const controls = toggle?.getAttribute("aria-controls")
    if (controls) {
      const controlled = document.getElementById(controls)
      if (controlled instanceof HTMLElement) {
        return controlled
      }
    }
    const next = row.nextElementSibling
    if (next instanceof HTMLElement && next.matches("[data-claim-detail]")) {
      return next
    }
    return null
  }

  const setClaimOpen = (row: HTMLElement, open: boolean) => {
    const detail = detailForRow(row)
    if (!detail) {
      return
    }

    detail.hidden = !open
    row.classList.toggle("is-expanded", open)
    for (const toggle of row.querySelectorAll<HTMLElement>("[data-claim-toggle]")) {
      toggle.setAttribute("aria-expanded", String(open))
    }
  }

  const toggleClaim = (target: EventTarget | null) => {
    const element = target instanceof Element ? target : null
    const row = element?.closest<HTMLElement>("[data-claim-row]")
    if (!row) {
      return
    }
    const detail = detailForRow(row)
    setClaimOpen(row, Boolean(detail?.hidden))
  }

  const onClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null
    if (!target) {
      return
    }
    if (target.closest("a") && !target.closest("[data-claim-toggle]")) {
      return
    }
    if (!target.closest("[data-claim-toggle]") && !target.closest("[data-claim-row]")) {
      return
    }
    event.preventDefault()
    toggleClaim(target)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return
    }
    const target = event.target instanceof Element ? event.target : null
    if (!target?.closest("[data-claim-toggle]")) {
      return
    }
    event.preventDefault()
    toggleClaim(target)
  }

  document.addEventListener("click", onClick)
  document.addEventListener("keydown", onKeyDown)
  applyClaimHashTarget()
  window.addEventListener("hashchange", applyClaimHashTarget)
  window.addCleanup(() => {
    document.removeEventListener("click", onClick)
    document.removeEventListener("keydown", onKeyDown)
    window.removeEventListener("hashchange", applyClaimHashTarget)
  })
})
