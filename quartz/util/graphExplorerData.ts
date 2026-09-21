import {
  graphCoreRadius,
  type GraphTopology,
  type RuntimeNode,
  type TopologyNode,
} from "../components/scripts/graph-explorer-model"
import { objectPageModules, moduleVisible } from "./objectPageModules"
import { objectMediaSet, mediaThumbnailUrl, mediaPosition, displayCreator } from "./objectMedia"

export type Sector = { start: number; span: number }
export type Bounds = { minX: number; minY: number; maxX: number; maxY: number }
export type OuterTile = Bounds & { file: string; count: number }
export type OuterIndex = {
  version: string
  count: number
  sectors: Record<string, Sector>
  tiles: OuterTile[]
}
export type ObjectPreview = {
  summary?: string
  dates?: Array<{ label: string; value: string }>
  summaryCredit?: { label: string; url: string; license: string; licenseUrl: string }
  image?: {
    url: string
    position: string
    caption: string
    credit: string
    license?: string
    licenseUrl?: string
  }
}
export function objectShardFile(slug: string): string {
  let hash = 2166136261
  for (const byte of new TextEncoder().encode(`shard:${slug}`)) {
    hash ^= byte
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, "0")
}
export function previewText(value: unknown): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_#]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}
export function excerpt(value: unknown): string {
  const text = previewText(value)
  // Keep whole sentences, including Lithuanian initials and date abbreviations.
  const sentences = [...new Intl.Segmenter("lt", { granularity: "sentence" }).segment(text)].map(
    (s) => s.segment.trim(),
  )
  let result = ""
  for (const sentence of sentences) {
    if (result && `${result} ${sentence}`.split(/\s+/).length > 90) break
    result += `${result ? " " : ""}${sentence}`
    if (result.split(/\s+/).length >= 75) break
  }
  return result
}
export function objectPreview(frontmatter: Record<string, any>, localSummary = ""): ObjectPreview {
  const modules = objectPageModules(frontmatter)
  const wiki = modules.wiki ?? {}
  const internal = modules.internal_summary ?? {}
  const summary = excerpt(
    (moduleVisible(wiki) && wiki.intro) ||
      (moduleVisible(internal) && internal.text) ||
      (!frontmatter.museum_external_only && localSummary) ||
      "",
  )
  const primary = objectMediaSet(frontmatter as any).primary
  const url = primary && mediaThumbnailUrl(primary)
  const dates: Array<{ label: string; value: string }> = []
  if (moduleVisible(wiki))
    for (const row of Array.isArray(wiki.infobox) ? wiki.infobox : []) {
      const label = previewText(row.label),
        value = previewText(String(row.value ?? "").split("\n")[0])
      if (
        /^(Gimė|Mirė|Valdė|Įkurta|Įkurtas|Data|Pastatyta|Pastatytas|Pradžia|Pabaiga)$/i.test(
          label,
        ) &&
        /\d/.test(value) &&
        value.length < 110 &&
        !dates.some((date) => date.label === label)
      )
        dates.push({ label, value })
      if (dates.length === 3) break
    }
  const source = wiki.source
  return {
    ...(summary ? { summary } : {}),
    ...(dates.length ? { dates } : {}),
    ...(moduleVisible(wiki) && wiki.intro && source?.url
      ? {
          summaryCredit: {
            label: previewText(source.publisher || "Vikipedija"),
            url: String(source.url),
            license: previewText(source.license || "CC BY-SA"),
            licenseUrl: String(
              source.license_url || "https://creativecommons.org/licenses/by-sa/4.0/",
            ),
          },
        }
      : {}),
    ...(primary && url
      ? {
          image: {
            url,
            position: mediaPosition(primary),
            caption: previewText(primary.caption || primary.title || "Atvaizdas"),
            credit: previewText(primary.attribution || displayCreator(primary.creator))
              .replace(
                new RegExp(
                  `(?:[ ·•|]+)?${String(primary.license ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                  "i",
                ),
                "",
              )
              .trim(),
            license: primary.license,
            licenseUrl: primary.licenseUrl,
          },
        }
      : {}),
  }
}
export function compactNode(node: TopologyNode): TopologyNode {
  const directories: Record<string, string> = {
    asmenys: "asmuo",
    autoriai: "autorius",
    ivykiai: "ivykis",
    vietos: "vieta",
    grupes: "grupe",
    daiktai: "daiktas",
    paprociai: "paprotys",
    posakiai: "posakis",
    zodynas: "zodyno_irasas",
    temos: "tema",
  }
  return {
    slug: node.slug,
    title: node.title,
    type: node.type || directories[node.slug.split("/")[1]] || "tema",
    degree: node.degree,
    connected: node.connected,
    claimCount: node.claimCount || 0,
    quoteCount: node.quoteCount || 0,
    ...(node.dateStart != null ? { dateStart: node.dateStart } : {}),
    ...(node.dateEnd != null ? { dateEnd: node.dateEnd } : {}),
    sourceIds: node.sourceIds ?? [],
    sourceTitles: [],
    relationCounts: {},
  }
}
export function explorerData(topology: GraphTopology, version = topology.generatedAt) {
  const byId = new Map(topology.nodes.map((node) => [node.slug, node]))
  const seen = new Set<string>()
  const edges = topology.edges.filter((edge) => {
    if (
      seen.has(edge.id) ||
      !byId.has(edge.from) ||
      !byId.has(edge.to) ||
      topology.relationKinds[edge.kind]?.defaultOn === false
    )
      return false
    seen.add(edge.id)
    return true
  })
  const connected = new Set(edges.flatMap((e) => [e.from, e.to]))
  const nodes = topology.nodes
    .map((node) => ({ ...compactNode(node), connected: connected.has(node.slug) }))
    .sort((a, b) => a.slug.localeCompare(b.slug, "lt"))
  const counts = new Map<string, number>()
  for (const node of nodes) counts.set(node.type, (counts.get(node.type) ?? 0) + 1)
  let offset = 0
  const sectors: Record<string, Sector> = {}
  for (const [type, count] of [...counts].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "lt"),
  )) {
    sectors[type] = {
      start: (offset / nodes.length) * Math.PI * 2,
      span: (count / nodes.length) * Math.PI * 2,
    }
    offset += count
  }
  const isolated = nodes
    .filter((n) => !n.connected)
    .sort((a, b) => a.slug.localeCompare(b.slug, "lt"))
  const groups = new Map<string, TopologyNode[]>()
  for (const node of isolated) {
    const group = groups.get(node.type) ?? []
    group.push(node)
    groups.set(node.type, group)
  }
  const tiles = new Map<string, RuntimeNode[]>()
  for (const [type, group] of groups) {
    const { start, span } = sectors[type]
    group.forEach((node, i) => {
      const angle = start + span * (0.08 + ((i * 0.61803398875) % 1) * 0.84)
      const radius =
        graphCoreRadius * Math.sqrt(1.2 ** 2 + ((2.4 ** 2 - 1.2 ** 2) * (i + 0.5)) / group.length)
      const runtime = {
        ...node,
        degree: 0,
        id: node.slug,
        px: radius * Math.cos(angle),
        py: radius * Math.sin(angle),
        hop: -1,
        isolated: true,
      }
      const key = `${Math.floor(runtime.px / 300)}_${Math.floor(runtime.py / 300)}`
      const tile = tiles.get(key) ?? []
      tile.push(runtime)
      tiles.set(key, tile)
    })
  }
  const index: OuterIndex = {
    version,
    count: isolated.length,
    sectors,
    tiles: [...tiles].map(([key, nodes]) => ({
      file: `outer/${key}.json`,
      count: nodes.length,
      minX: Math.min(...nodes.map((n) => n.px)),
      maxX: Math.max(...nodes.map((n) => n.px)),
      minY: Math.min(...nodes.map((n) => n.py)),
      maxY: Math.max(...nodes.map((n) => n.py)),
    })),
  }
  const core: GraphTopology = {
    ...topology,
    generatedAt: version,
    nodes: nodes.filter((n) => n.connected),
    edges: edges.map((e) => ({ ...e, sourceTitles: [] })),
  }
  return {
    core,
    index,
    tiles,
    search: nodes.map(({ slug, title, type, connected }) => ({ slug, title, type, connected })),
  }
}
