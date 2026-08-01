import { ProcessedContent } from "../plugins/vfile"
import { FilePath, slugifyFilePath } from "./path"

export type GraphSlugMap = {
  generatedAt: string
  publicToGraph: Record<string, string>
  graphToPublic: Record<string, string>
  collisions: Record<string, string[]>
  aliases: Record<string, string>
}

export function withPublicObjectNodes(topology: any, graphSlugs: Iterable<string>): any {
  const nodes = Array.isArray(topology?.nodes) ? [...topology.nodes] : []
  const known = new Set(nodes.map((node: any) => cleanPath(node?.slug)))
  for (const value of graphSlugs) {
    const slug = cleanPath(value)
    if (
      !slug.startsWith("objektai/") ||
      slug.startsWith("objektai/saltiniai/") ||
      known.has(slug)
    ) {
      continue
    }
    nodes.push({
      slug,
      title: slug.split("/").filter(Boolean).at(-1) ?? slug,
      type: "",
      claimCount: 0,
      quoteCount: 0,
      dateStart: null,
      dateEnd: null,
      sourceTitles: [],
      sourceIds: [],
      relationCounts: {},
      degree: 0,
      connected: false,
    })
    known.add(slug)
  }
  return { ...topology, nodes }
}

function cleanPath(value: unknown): string {
  return String(value ?? "")
    .normalize("NFC")
    .replaceAll("\\", "/")
    .replace(/^\.\//, "")
    .replace(/^content\//, "")
    .replace(/\.md$/i, "")
    .replace(/\/index$/i, "")
    .replace(/^\/+|\/+$/g, "")
}

export function graphSlugFromRelativePath(value: unknown): string {
  const cleaned = cleanPath(value)
  const objectOffset = cleaned.indexOf("objektai/")
  return objectOffset >= 0 ? cleaned.slice(objectOffset) : cleaned
}

export function buildGraphSlugMap(
  content: ProcessedContent[],
  generatedAt: string,
  topologySlugs: string[] = [],
): GraphSlugMap {
  const publicToGraph: Record<string, string> = {}
  const graphToPublic: Record<string, string> = {}
  const candidatesByPublic = new Map<string, Set<string>>()
  const aliases: Record<string, string> = {}
  const topology = new Set(topologySlugs.map(cleanPath))
  const topologyByFold = new Map<string, string[]>()
  for (const slug of topology) {
    const key = slug.toLocaleLowerCase("lt")
    topologyByFold.set(key, [...(topologyByFold.get(key) ?? []), slug])
  }

  const topologyMatch = (candidates: string[]): string | undefined => {
    if (!topology.size) return candidates[0]
    for (const candidate of candidates) if (topology.has(candidate)) return candidate
    for (const candidate of candidates) {
      const matches = topologyByFold.get(candidate.toLocaleLowerCase("lt")) ?? []
      if (matches.length === 1) return matches[0]
    }
    return undefined
  }

  for (const [, file] of content) {
    const publicSlug = cleanPath(file.data.slug)
    const relativePath = file.data.relativePath ?? file.data.filePath
    const sourceGraphSlug = graphSlugFromRelativePath(relativePath)
    if (!publicSlug.startsWith("objektai/") || publicSlug.startsWith("objektai/saltiniai/"))
      continue
    if (
      !sourceGraphSlug.startsWith("objektai/") ||
      sourceGraphSlug.startsWith("objektai/saltiniai/")
    )
      continue

    const directory = sourceGraphSlug.slice(0, sourceGraphSlug.lastIndexOf("/"))
    const rawAliases = [
      ...(Array.isArray(file.data.aliases) ? file.data.aliases : []),
      ...(Array.isArray(file.data.frontmatter?.aliases) ? file.data.frontmatter.aliases : []),
      ...(Array.isArray(file.data.frontmatter?.variantai) ? file.data.frontmatter.variantai : []),
    ]
    const graphAliasCandidates = rawAliases
      .map((value) => cleanPath(value))
      .filter(Boolean)
      .map((value) => (value.startsWith("objektai/") ? value : `${directory}/${value}`))
    const canonicalGraphSlug =
      topologyMatch([sourceGraphSlug, ...graphAliasCandidates]) ?? sourceGraphSlug

    aliases[sourceGraphSlug] = canonicalGraphSlug
    for (const graphAlias of graphAliasCandidates) aliases[graphAlias] = canonicalGraphSlug
    aliases[publicSlug] = canonicalGraphSlug

    const publicAliases = graphAliasCandidates.map((value) =>
      cleanPath(slugifyFilePath(`${value}.md` as FilePath)),
    )
    for (const publicAlias of publicAliases) {
      aliases[publicAlias] = canonicalGraphSlug
      const aliasCandidates = candidatesByPublic.get(publicAlias) ?? new Set<string>()
      aliasCandidates.add(canonicalGraphSlug)
      candidatesByPublic.set(publicAlias, aliasCandidates)
    }

    const canonicalPublicSlug = cleanPath(slugifyFilePath(`${canonicalGraphSlug}.md` as FilePath))
    graphToPublic[canonicalGraphSlug] = publicAliases.includes(canonicalPublicSlug)
      ? canonicalPublicSlug
      : publicSlug
    const candidates = candidatesByPublic.get(publicSlug) ?? new Set<string>()
    candidates.add(canonicalGraphSlug)
    candidatesByPublic.set(publicSlug, candidates)
  }

  const collisions: Record<string, string[]> = {}
  for (const [publicSlug, candidateSet] of candidatesByPublic) {
    const candidates = [...candidateSet].sort((a, b) => {
      const exactDiff = Number(b === publicSlug) - Number(a === publicSlug)
      return exactDiff || a.localeCompare(b, "lt")
    })
    publicToGraph[publicSlug] = candidates[0]
    if (candidates.length > 1) collisions[publicSlug] = candidates
  }

  return {
    generatedAt,
    publicToGraph: Object.fromEntries(
      Object.entries(publicToGraph).sort(([a], [b]) => a.localeCompare(b, "lt")),
    ),
    graphToPublic: Object.fromEntries(
      Object.entries(graphToPublic).sort(([a], [b]) => a.localeCompare(b, "lt")),
    ),
    collisions: Object.fromEntries(
      Object.entries(collisions).sort(([a], [b]) => a.localeCompare(b, "lt")),
    ),
    aliases: Object.fromEntries(
      Object.entries(aliases).sort(([a], [b]) => a.localeCompare(b, "lt")),
    ),
  }
}

export function resolveGraphSlug(value: string, slugMap?: GraphSlugMap): string {
  const slug = cleanPath(value)
  const mapped = slugMap?.publicToGraph[slug] ?? slugMap?.aliases[slug] ?? slug
  return slugMap?.aliases[mapped] ?? mapped
}

export function resolvePublicSlug(value: string, slugMap?: GraphSlugMap): string {
  const slug = cleanPath(value)
  return slugMap?.graphToPublic[slug] ?? slug
}

export function graphSlugForPageData(
  data: Record<string, any>,
  fallbackPublicSlug: string,
): string {
  const objectNotePath = data.frontmatter?.object_note_path
  const relativePath = data.relativePath ?? data.filePath
  return graphSlugFromRelativePath(objectNotePath || relativePath || fallbackPublicSlug)
}
