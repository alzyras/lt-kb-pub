type Module = Record<string, any>

function parse(value: unknown): Module {
  try {
    const decoded = typeof value === "string" ? JSON.parse(value) : value
    return decoded && typeof decoded === "object" && !Array.isArray(decoded) ? decoded : {}
  } catch {
    return {}
  }
}

// The site owner publishes populated batch results, including pending review
// modules. Missing content stays empty; explicitly withdrawn content stays out.
export function moduleVisible(module: Module): boolean {
  return !["rejected", "revoked"].includes(String(module.status ?? ""))
}

export function objectPageModules(frontmatter: Record<string, unknown>): Module {
  const modules = { ...parse(frontmatter.object_page_view_json) }
  const candidate = parse(frontmatter.object_page_internal_summary_candidate_json)
  const summary = parse(modules.internal_summary)
  if (!moduleVisible(summary)) modules.internal_summary = {}
  else if (!String(summary.text ?? "").trim() && moduleVisible(candidate) && candidate.text) {
    modules.internal_summary = { ...summary, ...candidate }
  }
  return modules
}
