import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { parseEvidenceSections } from "./citationFilter"
import { INTENTIONAL_IGNORED_OBJECT_PAGES } from "./contentPaths"
import { FilePath, FullSlug, simplifySlug, slugTag } from "./path"

export type RelationTargetMap = Record<string, FullSlug | null>

const TARGET_KIND_TO_TYPE: Record<string, string> = {
  place: "vieta",
  person: "asmuo",
  group: "grupe",
  thing: "daiktas",
  author: "autorius",
  event: "ivykis",
  phrase: "posakis",
}

export type RelationDocument = {
  filePath: FilePath
  slug: FullSlug
  markdown: string
}

export type CanonicalRelation = {
  sourceSlug: FullSlug
  targetSlug: FullSlug
  directCount: number
  claimIds: string[]
}

function cleanLabel(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .trim()
}

export function normalizeRelationLabel(value: string): string {
  return slugTag(cleanLabel(value).replace(/\.md$/i, "")).toLowerCase()
}

function normalizeExactRelationLabel(value: string): string {
  return cleanLabel(value).replace(/\.md$/i, "").normalize("NFC").toLocaleLowerCase("lt-LT")
}

function basenameSlug(slug: FullSlug): string {
  return simplifySlug(slug).split("/").filter(Boolean).at(-1) ?? ""
}

type RelationTargetCandidate = {
  slug: FullSlug | null
  priority: number
}

function addLabel(
  index: Map<string, RelationTargetCandidate>,
  label: string,
  slug: FullSlug,
  type = "",
  priority = 1,
): void {
  for (const key of [relationTargetExactKey(label, type), relationTargetKey(label, type)]) {
    if (!key) continue
    const existing = index.get(key)
    if (existing === undefined) {
      index.set(key, { slug, priority })
    } else if (priority > existing.priority) {
      index.set(key, { slug, priority })
    } else if (priority === existing.priority && existing.slug !== slug) {
      index.set(key, { slug: null, priority })
    }
  }
}

function addAlias(
  index: Map<string, RelationTargetCandidate>,
  rawAlias: string,
  slug: FullSlug,
  type = "",
): void {
  const alias = cleanLabel(rawAlias)
  if (!alias) return
  addLabel(index, alias, slug, type, 2)
  if (alias.includes("/")) {
    addLabel(index, alias.split("/").filter(Boolean).at(-1) ?? alias, slug, type, 2)
  }
}

function asStrings(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(cleanLabel).filter(Boolean)
  if (typeof value === "string") return value.split(",").map(cleanLabel).filter(Boolean)
  return []
}

export function buildRelationTargetMap(documents: RelationDocument[]): RelationTargetMap {
  const index = new Map<string, RelationTargetCandidate>()

  for (const document of documents) {
    if (!document.filePath.startsWith("objektai/") || document.filePath.startsWith("objektai/saltiniai/")) {
      continue
    }

    const parsed = matter(document.markdown).data as Record<string, unknown>
    const slug = document.slug
    addLabel(index, basenameSlug(slug), slug, "", 1)
    addLabel(index, simplifySlug(slug), slug, "", 4)
    const type = cleanLabel(parsed.tipas)
    addLabel(index, basenameSlug(slug), slug, type, 1)
    addLabel(index, simplifySlug(slug), slug, type, 4)
    addLabel(index, parsed.pavadinimas as string, slug, type, 3)
    // Relation metadata often carries a broad kind (for example `thing`)
    // while the canonical note uses a more specific content type such as
    // `zodyno_irasas`. Keep an untyped index for that case as well.
    addLabel(index, parsed.pavadinimas as string, slug, "", 3)
    addLabel(index, parsed.title as string, slug, type, 3)
    addLabel(index, parsed.title as string, slug, "", 3)
    for (const alias of [...asStrings(parsed.aliases), ...asStrings(parsed.alias)]) {
      addAlias(index, alias, slug, type)
      addAlias(index, alias, slug)
    }
    for (const variant of asStrings(parsed.variantai)) {
      addLabel(index, variant, slug, type, 2)
      addLabel(index, variant, slug, "", 2)
    }
  }

  return Object.fromEntries([...index].map(([key, candidate]) => [key, candidate.slug]))
}

export function readRelationDocuments(
  rootDir: string,
  filePaths: FilePath[],
  slugMap: Record<string, FullSlug>,
): RelationDocument[] {
  return filePaths
    .filter((filePath) => filePath.endsWith(".md"))
    .filter((filePath) => !INTENTIONAL_IGNORED_OBJECT_PAGES.includes(filePath as (typeof INTENTIONAL_IGNORED_OBJECT_PAGES)[number]))
    .map((filePath) => {
      const absolutePath = path.resolve(rootDir, filePath)
      if (!fs.existsSync(absolutePath)) return null
      const slug = slugMap[filePath]
      if (!slug) return null
      return {
        filePath,
        slug,
        markdown: fs.readFileSync(absolutePath, "utf8"),
      }
    })
    .filter((document): document is RelationDocument => Boolean(document))
}

export function relationTargetFromValue(value: string): string {
  const raw = cleanLabel(value).split(":", 1)[0]?.trim() ?? ""
  if (raw.startsWith("/objektai/")) {
    try {
      return decodeURIComponent(raw).replace(/^\//, "")
    } catch {
      return raw.replace(/^\//, "")
    }
  }
  return raw
}

export function relationTargetKindFromValue(value: string): string {
  const parts = cleanLabel(value)
    .split(":")
    .slice(1)
    .join(":")
    .split(",")
    .map((part) => cleanLabel(part).split("=", 1)[0]?.trim().toLowerCase() ?? "")
  return parts.map((part) => TARGET_KIND_TO_TYPE[part] ?? part).find((part) =>
    Object.values(TARGET_KIND_TO_TYPE).includes(part),
  ) ?? ""
}

export function relationTargetKey(label: string, type = ""): string {
  const normalized = normalizeRelationLabel(label)
  return type && normalized ? `${type}|${normalized}` : normalized
}

export function relationTargetExactKey(label: string, type = ""): string {
  const normalized = normalizeExactRelationLabel(label)
  return type && normalized ? `exact|${type}|${normalized}` : normalized ? `exact|${normalized}` : ""
}

export function relationTargetLookupKeys(value: string): string[] {
  const label = relationTargetFromValue(value)
  const type = relationTargetKindFromValue(value)
  return [
    relationTargetExactKey(label, type),
    relationTargetExactKey(label),
    relationTargetKey(label, type),
    relationTargetKey(label),
  ].filter((key, index, keys) => Boolean(key) && keys.indexOf(key) === index)
}

export function relationTargetSlug(
  target: string,
  relationTargetMap: RelationTargetMap,
): FullSlug | null | undefined {
  for (const key of relationTargetLookupKeys(target)) {
    if (Object.prototype.hasOwnProperty.call(relationTargetMap, key)) {
      return relationTargetMap[key]
    }
  }
  return undefined
}

export function relationMapEntries(map: RelationTargetMap): Array<[string, FullSlug | null]> {
  return Object.entries(map) as Array<[string, FullSlug | null]>
}

function globalClaimIds(markdown: string): string[] {
  const heading = markdown.search(/^##\s+Teiginiai\s*$/m)
  if (heading < 0) return []
  const bodyStart = markdown.indexOf("\n", heading) + 1
  const body = markdown.slice(bodyStart)
  const nextHeading = body.search(/^##\s+/m)
  const section = nextHeading >= 0 ? body.slice(0, nextHeading) : body
  const ids: string[] = []
  let pending = ""
  for (const line of section.split(/\r?\n/)) {
    const anchor = line.match(/^\s*<a\s+id=["']claim-(t-\d+)["']\s*><\/a>\s*$/i)
    if (anchor) {
      pending = anchor[1]
      continue
    }
    const claim = line.match(/^\s*-\s+(?:id:\s*)?(t-\d+)\s*$/i)
    if (claim) {
      ids.push(pending)
      pending = ""
    }
  }
  return ids
}

export function relationTargetWikilinks(markdown: string): string[] {
  const heading = markdown.search(/^##\s+Ryšiai\s*$/m)
  if (heading < 0) return []
  const bodyStart = markdown.indexOf("\n", heading) + 1
  const body = markdown.slice(bodyStart)
  const nextHeading = body.search(/^##\s+/m)
  const section = nextHeading >= 0 ? body.slice(0, nextHeading) : body
  const targets = [
    ...section.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g),
  ].map((match) => match[1].trim())
  for (const match of section.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
    targets.push(match[1].trim())
  }
  return targets
}

export function buildCanonicalRelationIndex(
  documents: RelationDocument[],
  relationTargetMap: RelationTargetMap,
): CanonicalRelation[] {
  const byPair = new Map<string, CanonicalRelation>()
  for (const document of documents) {
    const add = (targetSlug: FullSlug, claimId?: string) => {
      const key = `${simplifySlug(document.slug)}\t${simplifySlug(targetSlug)}`
      const existing = byPair.get(key) ?? {
        sourceSlug: document.slug,
        targetSlug,
        directCount: 0,
        claimIds: [],
      }
      if (claimId) {
        if (!existing.claimIds.includes(claimId)) existing.claimIds.push(claimId)
      } else {
        existing.directCount += 1
      }
      byPair.set(key, existing)
    }

    for (const rawTarget of relationTargetWikilinks(document.markdown)) {
      const targetSlug = relationTargetSlug(rawTarget, relationTargetMap)
      if (targetSlug) add(targetSlug)
    }

    const claims = (parseEvidenceSections(document.markdown).get("Teiginiai") ?? []).filter((entry) =>
      entry.id.startsWith("t-"),
    )
    const globals = globalClaimIds(document.markdown)
    claims.forEach((claim, index) => {
      const rawTarget = claim.fields.get("ryšio_targeto_parinkimas")?.trim() ?? ""
      const targetSlug = relationTargetSlug(rawTarget, relationTargetMap)
      if (!rawTarget || !targetSlug) return
      add(targetSlug, claim.fields.get("global_id")?.trim() || globals[index] || claim.id)
    })
  }
  return [...byPair.values()]
}
