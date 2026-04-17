import { QuartzTransformerPlugin } from "../types"

const TARGET_SECTIONS = new Set(["Reikšmingi paminėjimai", "Šaltiniai ir įrodymai"])
const ADVANCED_KEYS = new Set([
  "teiginio_tipas",
  "patikimumo_lygis",
  "patikimumo_saltinis",
  "patikimumo_pagrindimas",
  "ai_siulomas_patikimumas",
  "ai_siulymo_pagrindimas",
  "vertinimo_atnaujinta",
  "vertinimo_autorius",
  "pagrindžia",
])

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function wrapLine(line: string, key: string): string {
  const indent = line.match(/^\s*/)?.[0] ?? ""
  const content = escapeHtml(line.trim())
  return `${indent}<span class="advanced-evidence-line" data-adv-key="${key}">${content}</span>`
}

export const AdvancedEvidence: QuartzTransformerPlugin = () => ({
  name: "AdvancedEvidence",
  textTransform(_ctx, src) {
    const lines = src.split("\n")
    const out: string[] = []

    let inTargetSection = false
    let hideRefsIndent: number | null = null

    for (const line of lines) {
      const heading = line.match(/^##\s+(.+?)\s*$/)
      if (heading) {
        inTargetSection = TARGET_SECTIONS.has(heading[1].trim())
        hideRefsIndent = null
        out.push(line)
        continue
      }

      if (!inTargetSection) {
        out.push(line)
        continue
      }

      const lineIndent = line.match(/^\s*/)?.[0].length ?? 0
      if (hideRefsIndent !== null) {
        if (line.trim() === "") {
          out.push(line)
          continue
        }
        if (lineIndent > hideRefsIndent && /^\s*-\s*[tq]-\d{3,}\s*$/.test(line)) {
          out.push(wrapLine(line, "pagrindzia_ref"))
          continue
        }
        hideRefsIndent = null
      }

      const keyMatch = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*.*$/)
      if (keyMatch && ADVANCED_KEYS.has(keyMatch[1])) {
        out.push(wrapLine(line, keyMatch[1]))
        if (keyMatch[1] === "pagrindžia") {
          hideRefsIndent = lineIndent
        }
        continue
      }

      out.push(line)
    }

    return out.join("\n")
  },
})
