import type { FullSlug } from "./path"
import { simplifySlug, slugifyFilePath } from "./path"
import { cleanText } from "./objectMedia"
import { objectPageViewModel, type ObjectRelationRow } from "./objectPageView"
import type { ObjectDetailEvidence } from "./objectDetail"
import { objectGraphRelations } from "./objectGraph"

export type ObjectRelationInput = {
  id?: string
  kind?: string
  direction?: string
  label: string
  target: string
  display: string
}

export type ObjectRelationTarget = {
  slug: FullSlug
  label: string
  title: string
  type: string
  linked: boolean
}

export type ObjectRelationGroup = {
  label: string
  targets: ObjectRelationTarget[]
}

export const PAGE_LINKS_GROUP_LABEL = "Puslapio nuorodos"

export type ObjectRelationFile = {
  slug?: FullSlug
  frontmatter?: Record<string, unknown>
}

export function relationDirectionLabel(label: string, direction = ""): string {
  const readable = cleanText(label).replaceAll("_", " ")
  if (!readable) return "Susijęs objektas"
  return direction === "inbound" ? `${readable} ←` : `${readable} →`
}

/**
 * A single source for the complete public relation stream.  A completed
 * projection can add semantic rows, while the Markdown relation section is
 * always retained as the conservative fallback for objects not yet enriched.
 */
export function objectRelationInputs(
  frontmatter: Record<string, unknown>,
  evidence: ObjectDetailEvidence,
): ObjectRelationInput[] {
  const view = objectPageViewModel(frontmatter, evidence)
  const graph = objectGraphRelations(evidence.objectSlug)
  if (graph.length) return graph
  const authored = [
    ...view.relationRows.map((row: ObjectRelationRow) => ({
      label: relationDirectionLabel(row.predicate, row.direction),
      target: row.target,
      display: cleanText(row.label),
    })),
    ...evidence.relations,
  ]
  const key = (row: ObjectRelationInput) =>
    `${row.target.replace(/\.md$/u, "")}\t${cleanText(row.label).replaceAll("_", " ").toLocaleLowerCase("lt")}`
  const result: ObjectRelationInput[] = [...graph]
  const seen = new Set(result.map(key))
  for (const row of authored) {
    if (seen.has(key(row))) continue
    seen.add(key(row))
    result.push(row)
  }
  return result
}

function titleParts(frontmatter: Record<string, unknown> | undefined): {
  title: string
  qualifier: string
} {
  const value = cleanText(
    frontmatter?.canonical_name || frontmatter?.pavadinimas || frontmatter?.title,
  )
  const match = value.match(/^(.+?)\s*\(([^()]{3,})\)$/u)
  return match
    ? { title: match[1].trim(), qualifier: match[2].trim() }
    : { title: value || "Istorijos objektas", qualifier: "" }
}

function targetLookup(files: ObjectRelationFile[]): Map<string, ObjectRelationFile> {
  return new Map(
    files.filter((file) => Boolean(file.slug)).map((file) => [simplifySlug(file.slug!), file]),
  )
}

function resolveTarget(
  relation: ObjectRelationInput,
  lookup: Map<string, ObjectRelationFile>,
): ObjectRelationTarget {
  const targetPath = String(relation.target || "").replace(/\.md$/u, "")
  const file = lookup.get(simplifySlug(slugifyFilePath(targetPath as any)))
  const fallbackTitle =
    targetPath.split("/").filter(Boolean).at(-1)?.replace(/[-_]+/gu, " ") || "Susijęs objektas"
  const targetSlug = (file?.slug || slugifyFilePath(targetPath as any)) as FullSlug
  const targetTitle = file
    ? titleParts(file.frontmatter as Record<string, unknown>).title
    : fallbackTitle
  return {
    slug: targetSlug,
    label: cleanText(relation.display) || targetTitle,
    title: targetTitle,
    type: cleanText(file?.frontmatter?.tipas),
    linked: Boolean(file?.slug?.startsWith("objektai/")),
  }
}

/** Resolve relations one-for-one, preserving every authored row. */
export function objectRelationEntries(
  relations: ObjectRelationInput[],
  files: ObjectRelationFile[] | Map<string, ObjectRelationFile>,
): Array<{ label: string; target: ObjectRelationTarget }> {
  const lookup = Array.isArray(files) ? targetLookup(files) : files
  return relations.map((relation) => ({
    label: cleanText(relation.label),
    target: resolveTarget(relation, lookup),
  }))
}

/**
 * Resolve every relation target against the public file index.  Relations are
 * grouped only by predicate for presentation; the target list is deduplicated
 * by its canonical slug, so the displayed count is a real count of unique
 * predicate/target pairs rather than an arbitrary featured subset.
 */
export function objectRelationGroups(
  relations: ObjectRelationInput[],
  files: ObjectRelationFile[] | Map<string, ObjectRelationFile>,
  options: { dedupe?: boolean } = {},
): ObjectRelationGroup[] {
  const lookup = Array.isArray(files) ? targetLookup(files) : files
  const dedupe = options.dedupe !== false
  const groups = new Map<string, ObjectRelationTarget[]>()
  for (const relation of relations) {
    const label = cleanText(relation.label)
    const targets = groups.get(label) ?? []
    const target = resolveTarget(relation, lookup)
    const targetSlug = target.slug
    if (!dedupe || !targets.some((target) => target.slug === targetSlug)) {
      targets.push(target)
    }
    if (targets.length) groups.set(label, targets)
  }
  return [...groups.entries()]
    .map(([label, targets]) => ({ label, targets }))
    .sort(
      (left, right) =>
        Number(left.label === PAGE_LINKS_GROUP_LABEL) -
        Number(right.label === PAGE_LINKS_GROUP_LABEL),
    )
}

export function objectRelationCount(groups: ObjectRelationGroup[]): number {
  return groups.reduce((count, group) => count + group.targets.length, 0)
}

export function objectRelationIndexFile(slug: string): string {
  let hash = 2166136261
  for (const byte of new TextEncoder().encode(`relations:${slug}`)) {
    hash ^= byte
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, "0")
}
