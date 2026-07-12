import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug, slugTag } from "./path"

export type ThemeEntry = {
  title: string
  slug: FullSlug
  category: string
  categoryLabel: string
  description: string
  graphRole: string
  objectCount: number
}

const objectTypeRoutes: Record<string, FullSlug> = {
  asmuo: "objektai/asmenys" as FullSlug,
  autorius: "objektai/autoriai" as FullSlug,
  daiktas: "objektai/daiktai" as FullSlug,
  grupe: "objektai/grupes" as FullSlug,
  grupė: "objektai/grupes" as FullSlug,
  ivykis: "objektai/ivykiai" as FullSlug,
  įvykis: "objektai/ivykiai" as FullSlug,
  paprotys: "objektai/paprociai" as FullSlug,
  posakis: "objektai/posakiai" as FullSlug,
  saltinis: "objektai/saltiniai" as FullSlug,
  šaltinis: "objektai/saltiniai" as FullSlug,
  vieta: "objektai/vietos" as FullSlug,
  sąvoka: "objektai/zodynas" as FullSlug,
  zodyno_irasas: "objektai/zodynas" as FullSlug,
}

function truthy(value: unknown): boolean {
  return value === true || String(value ?? "").toLowerCase() === "true"
}

function count(value: unknown): number {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

export function themeEntries(allFiles: QuartzPluginData[]): ThemeEntry[] {
  return allFiles
    .filter(
      (page) =>
        page.slug?.startsWith("temos/") &&
        page.frontmatter?.tipas === "tema" &&
        truthy(page.frontmatter?.kanonine_tema),
    )
    .map((page) => ({
      title: String(page.frontmatter?.pavadinimas ?? page.frontmatter?.title ?? page.slug ?? ""),
      slug: page.slug as FullSlug,
      category: String(page.frontmatter?.tema_kategorija ?? ""),
      categoryLabel: String(page.frontmatter?.tema_kategorijos_pavadinimas ?? ""),
      description: String(page.frontmatter?.tema_aprasymas ?? ""),
      graphRole: String(page.frontmatter?.tema_graph_role ?? "off"),
      objectCount: count(page.frontmatter?.tema_objektu_skaicius),
    }))
    .filter((theme) => theme.title && theme.objectCount > 0)
    .sort((a, b) => b.objectCount - a.objectCount || a.title.localeCompare(b.title, "lt-LT"))
}

export function selectTopThemes(
  allFiles: QuartzPluginData[],
  limit = 12,
  categoryLimit = 2,
): ThemeEntry[] {
  const ranked = themeEntries(allFiles).filter((theme) => theme.graphRole === "core")
  const selected: ThemeEntry[] = []
  const selectedSlugs = new Set<string>()
  const categoryCounts = new Map<string, number>()

  for (const theme of ranked) {
    const categoryCount = categoryCounts.get(theme.category) ?? 0
    if (categoryCount >= categoryLimit) continue
    selected.push(theme)
    selectedSlugs.add(theme.slug)
    categoryCounts.set(theme.category, categoryCount + 1)
    if (selected.length >= limit) return selected
  }

  for (const theme of ranked) {
    if (selectedSlugs.has(theme.slug)) continue
    selected.push(theme)
    if (selected.length >= limit) break
  }
  return selected
}

export function tagDestination(tag: string): FullSlug {
  const normalized = tag.trim().toLocaleLowerCase("lt-LT")
  const objectRoute = objectTypeRoutes[normalized]
  if (objectRoute) return objectRoute
  if (/^(x|v|i)+$/i.test(tag) || normalized.includes("amžius") || normalized.includes("viduramž")) {
    return slugTag(`laikotarpiai/${tag}`) as FullSlug
  }
  return slugTag(`temos/${tag}`) as FullSlug
}

export function legacyTagDestination(tag: string): FullSlug {
  if (tag === "index") return "temos" as FullSlug
  return tagDestination(tag)
}
