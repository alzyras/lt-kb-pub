import { readFileSync, statSync, readdirSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { relationsFromMarkdown } from "./objectDetail"

let completeTopology: any

/** Shared build input for the explorer, cards and full relationship lists. */
export function loadObjectTopology(): any {
  if (completeTopology) return completeTopology
  const topology = JSON.parse(
    readFileSync(resolve("quartz/static/graph-data/topology.json"), "utf8"),
  )
  const nodes = new Map<string, any>(topology.nodes.map((node: any) => [node.slug, node]))
  const seen = new Set<string>()
  const key = (source: string, target: string, label: string) =>
    JSON.stringify([source, target, label.replaceAll("_", " ").toLocaleLowerCase("lt").trim()])
  for (const edge of topology.edges) {
    const kind = topology.relationKinds[edge.kind]
    seen.add(key(edge.from, edge.to, kind?.label || edge.kind))
    seen.add(key(edge.to, edge.from, kind?.inverseLabel || edge.kind))
  }
  const root = resolve("objektai")
  if (existsSync(root))
    for (const folder of readdirSync(root, { withFileTypes: true })) {
      if (!folder.isDirectory()) continue
      for (const name of readdirSync(resolve(root, folder.name))) {
        if (!name.endsWith(".md")) continue
        const source = `objektai/${folder.name}/${name.slice(0, -3)}`
        const markdown = readFileSync(resolve(root, folder.name, name), "utf8")
        for (const row of relationsFromMarkdown(markdown)) {
          const target = row.target.replace(/\.md$/u, "")
          if (source === target || !target.startsWith("objektai/")) continue
          const id = key(source, target, row.label)
          if (seen.has(id)) continue
          seen.add(id)
          for (const slug of [source, target])
            if (!nodes.has(slug)) {
              const node = {
                slug,
                title: slug.split("/").at(-1),
                type:
                  (
                    {
                      asmenys: "asmuo",
                      autoriai: "autorius",
                      vietos: "vieta",
                      grupes: "grupe",
                      ivykiai: "ivykis",
                      daiktai: "daiktas",
                      paprociai: "paprotys",
                      posakiai: "posakis",
                      zodynas: "zodyno_irasas",
                      saltiniai: "saltinis",
                    } as Record<string, string>
                  )[slug.split("/")[1]] || "asmuo",
                claimCount: 0,
                quoteCount: 0,
                sourceIds: [],
                sourceTitles: [],
                relationCounts: {},
                degree: 0,
              }
              nodes.set(slug, node)
              topology.nodes.push(node)
            }
          const kind = `authored:${row.label}`
          topology.relationKinds[kind] ??= {
            label: row.label,
            inverseLabel: `${row.label} ←`,
            group: "authored",
            groupLabel: "Objektų ryšiai",
            defaultOn: true,
            directional: true,
            symmetric: false,
            edgeCount: 0,
            evidenceCount: 0,
          }
          topology.relationKinds[kind].edgeCount++
          topology.edges.push({
            id: `authored:${id}`,
            from: source,
            to: target,
            kind,
            layer: "semantic",
            confidence: 1,
            evidenceCount: 0,
            sourceIds: [],
            sourceTitles: [],
            claimIds: [],
            quoteIds: [],
          })
        }
      }
    }
  topology.relationKindCodes = Object.keys(topology.relationKinds)
  completeTopology = topology
  return topology
}

export type ObjectGraphRelation = {
  id: string
  label: string
  target: string
  display: string
  kind: string
  direction: "inbound" | "outbound"
}

let cache: { stamp: string; rows: Map<string, ObjectGraphRelation[]> } | undefined

/** One uncapped public neighbourhood, shared by object tabs and their canvas. */
export function objectGraphRelations(slug = ""): ObjectGraphRelation[] {
  const path = resolve("quartz/static/graph-data/topology.json")
  try {
    const stat = statSync(path)
    const stamp = `${stat.mtimeMs}:${stat.size}`
    if (cache?.stamp !== stamp) {
      const topology = loadObjectTopology()
      const rows = new Map<string, ObjectGraphRelation[]>()
      const titles = new Map<string, string>(
        (topology.nodes ?? []).map((node: any) => [node.slug, node.title]),
      )
      for (const edge of topology.edges ?? []) {
        const kind = topology.relationKinds?.[edge.kind]
        // Optional co-mention layers are not factual relationships. Explicit
        // page links remain available, clearly labelled as page links.
        if (
          kind?.defaultOn === false ||
          !edge.from.startsWith("objektai/") ||
          !edge.to.startsWith("objektai/") ||
          edge.from === edge.to
        )
          continue
        for (const [source, target, direction] of [
          [edge.from, edge.to, "outbound"],
          [edge.to, edge.from, "inbound"],
        ] as const) {
          const list = rows.get(source) ?? []
          list.push({
            id: edge.id || JSON.stringify([edge.from, edge.to, edge.kind]),
            label:
              edge.kind === "explicit_wikilink"
                ? "Puslapio nuorodos"
                : (direction === "inbound" ? kind?.inverseLabel : kind?.label) ||
                  edge.kind.replaceAll("_", " "),
            target,
            display: titles.get(target) || target.split("/").at(-1) || target,
            kind: edge.kind,
            direction,
          })
          rows.set(source, list)
        }
      }
      cache = { stamp, rows }
    }
    return cache.rows.get(slug.replace(/\.md$|\/index$/u, "")) ?? []
  } catch {
    return []
  }
}
