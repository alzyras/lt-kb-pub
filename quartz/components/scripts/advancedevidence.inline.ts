import {
  dispatchSettingsChange,
  loadSourceCatalog,
  readSettingsState,
  writeSettingsState,
} from "../../util/sourceSettings"

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

// The page keeps the citation markup out of its initial HTML, but readers
// should not have to wait for a network request after opening a claim. Cache
// fetched details by their immutable content URL; a background queue warms the
// cache gradually once the page itself is usable.
const remoteDetailCache = new Map<string, Promise<string>>()

function decodeDetailPayload(raw: string): string {
  const decoder = document.createElement("textarea")
  decoder.innerHTML = raw
  return JSON.parse(decoder.value)
}

function fetchRemoteDetail(url: string): Promise<string> {
  const cached = remoteDetailCache.get(url)
  if (cached) return cached

  const request = fetch(url, { cache: "force-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`claim detail ${response.status}`)
      return response.text()
    })
    .then(decodeDetailPayload)
    .catch((error) => {
      // Do not cache a failed request: opening the claim later may succeed.
      remoteDetailCache.delete(url)
      throw error
    })
  remoteDetailCache.set(url, request)
  return request
}

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
    setClaimOpen(target, true)
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ block: "center", behavior: "smooth" })
    })
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
    document.dispatchEvent(
      new CustomEvent("analyticsfeature", {
        detail: { name: "evidence_mode", action: mode === "on" ? "enable" : "disable" },
      }),
    )
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

  const setClaimOpen = (row: HTMLElement, open: boolean, userInitiated = false) => {
    const detail = detailForRow(row)
    if (!detail) {
      return
    }

    const wasHidden = detail.hidden
    if (open) {
      const content = detail.querySelector<HTMLElement>("[data-claim-detail-content]")
      const payload = detail.querySelector<HTMLScriptElement>("[data-claim-detail-payload]")
      const remotePayload = detail.querySelector<HTMLElement>("[data-claim-detail-url]")
      if (content && payload) {
        try {
          content.innerHTML = decodeDetailPayload(payload.textContent ?? '""')
          payload.remove()
        } catch {
          content.textContent = "Citatos duomenų nepavyko parodyti."
        }
      } else if (content && remotePayload?.dataset.claimDetailUrl) {
        const url = remotePayload.dataset.claimDetailUrl
        content.textContent = "Kraunami citatos duomenys…"
        remotePayload.dataset.claimDetailState = "loading"
        void fetchRemoteDetail(url)
          .then((html) => {
            content.innerHTML = html
            remotePayload.remove()
          })
          .catch(() => {
            remotePayload.dataset.claimDetailState = "error"
            content.textContent = "Citatos dar nepavyko įkelti. Bandykite dar kartą."
          })
      }
    }

    detail.hidden = !open
    row.classList.toggle("is-expanded", open)
    for (const toggle of row.querySelectorAll<HTMLElement>("[data-claim-toggle]")) {
      toggle.setAttribute("aria-expanded", String(open))
    }
    if (open && wasHidden && userInitiated) {
      const citationKey = row.id || "evidence"
      document.dispatchEvent(
        new CustomEvent("citationopen", {
          detail: { citationKey, sourceKind: "embedded_evidence" },
        }),
      )
    }
  }

  const toggleClaim = (target: EventTarget | null) => {
    const element = target instanceof Element ? target : null
    const row = element?.closest<HTMLElement>("[data-claim-row]")
    if (!row) {
      return
    }
    const detail = detailForRow(row)
    setClaimOpen(row, Boolean(detail?.hidden), true)
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

  let prefetchCancelled = false
  const pendingDetailUrls = Array.from(
    document.querySelectorAll<HTMLElement>('[data-claim-detail-url]'),
    (element) => element.dataset.claimDetailUrl,
  ).filter((url): url is string => Boolean(url))
  let prefetchOffset = 0

  const warmNextDetails = () => {
    if (prefetchCancelled || prefetchOffset >= pendingDetailUrls.length) return
    const batch = pendingDetailUrls.slice(prefetchOffset, prefetchOffset + 3)
    prefetchOffset += batch.length
    void Promise.allSettled(batch.map(fetchRemoteDetail)).finally(() => {
      if (!prefetchCancelled && prefetchOffset < pendingDetailUrls.length) {
        window.setTimeout(warmNextDetails, 300)
      }
    })
  }

  // Leave the initial render and interaction handlers alone first. Three
  // small requests at a time avoid turning a large source page into a burst of
  // hundreds of simultaneous requests.
  const prefetchTimer = window.setTimeout(warmNextDetails, 900)
  window.addEventListener("hashchange", applyClaimHashTarget)
  window.addCleanup(() => {
    prefetchCancelled = true
    window.clearTimeout(prefetchTimer)
    document.removeEventListener("click", onClick)
    document.removeEventListener("keydown", onKeyDown)
    window.removeEventListener("hashchange", applyClaimHashTarget)
  })
})
