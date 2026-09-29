import { FullSlug, simplifySlug } from "./path"

type LinkedPage = { links: readonly string[] }

/** Find existing pages whose old or new links point to any changed page. */
export function pagesReferencingChangedSlugs<T extends LinkedPage>(
  previousPages: Record<string, T>,
  currentPages: Record<string, T>,
  changedSlugs: Iterable<string>,
): string[] {
  const changed = new Set(changedSlugs)
  if (changed.size === 0) return []

  const affected: string[] = []
  for (const [relativePath, current] of Object.entries(currentPages)) {
    const previous = previousPages[relativePath]
    if (!previous) continue
    if (
      previous.links.some((slug) => changed.has(slug)) ||
      current.links.some((slug) => changed.has(slug))
    ) {
      affected.push(relativePath)
    }
  }
  return affected
}

/** Preserve the existing first-match route behavior without rescanning all pages per link. */
export function firstPagePathBySimplifiedSlug(
  pages: Iterable<{ relativePath: string; slug: string }>,
): Map<string, string> {
  const paths = new Map<string, string>()
  for (const { relativePath, slug } of pages) {
    const key = String(simplifySlug(slug as FullSlug))
    if (!paths.has(key)) paths.set(key, relativePath)
  }
  return paths
}
