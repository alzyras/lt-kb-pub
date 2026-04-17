const STORAGE_KEY = "advancedEvidenceMode"
const DEFAULT_MODE: "on" | "off" = "off"

function readMode(): "on" | "off" {
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

  const toggleMode = () => {
    mode = mode === "on" ? "off" : "on"
    localStorage.setItem(STORAGE_KEY, mode)
    applyMode(mode)
  }

  for (const button of document.getElementsByClassName("advanced-evidence-toggle")) {
    button.addEventListener("click", toggleMode)
    window.addCleanup(() => button.removeEventListener("click", toggleMode))
  }
})
