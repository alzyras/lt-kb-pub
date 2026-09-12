import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FullSlug, pathToRoot } from "../../util/path"
import { sharedPageComponents } from "../../../quartz.layout"
import { GraphExplorer } from "../../components"
import { defaultProcessedContent } from "../vfile"
import { write } from "./helpers"
import { buildGraphSlugMap, withPublicObjectNodes } from "../../util/graphIdentity"
import { buildAssetVersion } from "../../util/buildVersion"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { buildCanonicalRelationIndex, readRelationDocuments } from "../../util/relations"

function relationEdgeId(source: string, target: string): string {
  let hash = 2166136261
  for (const byte of new TextEncoder().encode(`${source}\t${target}`)) {
    hash ^= byte
    hash = Math.imul(hash, 16777619)
  }
  return `canonical-${(hash >>> 0).toString(16).padStart(8, "0")}`
}

function withCanonicalRelations(
  topology: any,
  relations: ReturnType<typeof buildCanonicalRelationIndex>,
): any {
  const nodes = Array.isArray(topology.nodes) ? topology.nodes : []
  const nodeBySlug = new Map<string, any>(nodes.map((node: any) => [String(node.slug ?? ""), node]))
  const ensureNode = (slug: string) => {
    if (nodeBySlug.has(slug)) return
    const title = slug.split("/").filter(Boolean).at(-1) ?? slug
    const node = {
      slug,
      title,
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
    }
    nodes.push(node)
    nodeBySlug.set(slug, node)
  }

  const existing = new Set(
    (Array.isArray(topology.edges) ? topology.edges : []).map(
      (edge: any) => `${edge.from}\t${edge.to}\t${edge.kind}`,
    ),
  )
  const canonicalEdges = []
  for (const relation of relations) {
    const from = String(relation.sourceSlug)
    const to = String(relation.targetSlug)
    ensureNode(from)
    ensureNode(to)
    const key = `${from}\t${to}\tcanonical_relation`
    if (existing.has(key)) continue
    existing.add(key)
    canonicalEdges.push({
      id: relationEdgeId(from, to),
      from,
      to,
      kind: "canonical_relation",
      layer: "canonical",
      confidence: 1,
      evidenceCount: Math.max(1, relation.directCount + relation.claimIds.length),
      claimIds: relation.claimIds,
      quoteIds: [],
      evidencePreview: [],
      sourceTitles: [],
      sourceIds: [],
    })
  }

  const edges = [...(Array.isArray(topology.edges) ? topology.edges : []), ...canonicalEdges]
  const relationKinds = { ...(topology.relationKinds ?? {}) }
  relationKinds.canonical_relation = {
    label: "Kanoninis ryšys",
    inverseLabel: "Kanoninis ryšys",
    group: "bendri",
    edgeCount: canonicalEdges.length,
  }
  const relationKindCodes = [
    ...(Array.isArray(topology.relationKindCodes) ? topology.relationKindCodes : []),
    ...(topology.relationKindCodes?.includes("canonical_relation") ? [] : ["canonical_relation"]),
  ]
  return {
    ...topology,
    nodes,
    edges,
    relationKinds,
    relationKindCodes,
  }
}

function objectGraphShards(topology: any): Array<{ slug: string; payload: unknown }> {
  const nodes = Array.isArray(topology?.nodes) ? topology.nodes : []
  const nodeBySlug = new Map<string, any>(
    nodes.map((node: any) => [String(node.slug ?? ""), node] as [string, any]),
  )
  const linksBySlug = new Map<string, any[]>()
  for (const edge of Array.isArray(topology?.edges) ? topology.edges : []) {
    // A preview must never turn an arbitrary wikilink into a factual relation.
    // The full explorer still keeps its other layers as optional exploration aids.
    if (String(edge.layer ?? "") !== "semantic") continue
    const from = String(edge.from ?? "")
    const to = String(edge.to ?? "")
    if (!from || !to || !nodeBySlug.has(from) || !nodeBySlug.has(to)) continue
    const add = (source: string, target: string) => {
      const targetNode = nodeBySlug.get(target)
      if (!targetNode) return
      ;(linksBySlug.get(source) ?? (linksBySlug.set(source, []), linksBySlug.get(source)!)).push({
        edgeId: String(edge.id ?? ""),
        target,
        targetTitle: String(targetNode.title ?? target),
        targetType: String(targetNode.type ?? ""),
        evidenceCount: Number(edge.evidenceCount ?? 0),
        confidence: Number(edge.confidence ?? 0),
        relationKind: String(edge.kind ?? ""),
        relationGroup: String(topology.relationKinds?.[edge.kind]?.group ?? ""),
        direction: source === from ? "forward" : "inverse",
        claimIds: Array.isArray(edge.claimIds) ? edge.claimIds : [],
        quoteIds: Array.isArray(edge.quoteIds) ? edge.quoteIds : [],
      })
    }
    add(from, to)
    add(to, from)
  }

  return nodes
    .filter((node: any) => String(node.slug ?? "").startsWith("objektai/"))
    .map((node: any) => {
      const slug = String(node.slug)
      const byTarget = new Map<string, any>()
      for (const link of linksBySlug.get(slug) ?? []) {
        const existing = byTarget.get(String(link.target))
        if (!existing || Number(link.evidenceCount) > Number(existing.evidenceCount)) {
          byTarget.set(String(link.target), link)
        }
      }
      const allNeighbours = [...byTarget.values()].sort(
        (a, b) =>
          Number(b.evidenceCount) - Number(a.evidenceCount) ||
          String(a.targetTitle).localeCompare(String(b.targetTitle), "lt"),
      )
      // Object pages use this compact shard rather than loading the complete
      // graph. Keep enough neighbours for the enlarged hero preview while
      // still bounding each per-object network response.
      const links = allNeighbours.slice(0, 200)
      return {
        slug,
        payload: {
          focus: {
            slug,
            title: String(node.title ?? slug),
            type: String(node.type ?? ""),
            claimCount: Number(node.claimCount ?? 0),
            quoteCount: Number(node.quoteCount ?? 0),
          },
          neighbourCount: allNeighbours.length,
          previewLimit: 200,
          neighbours: links,
        },
      }
    })
}

function objectShardFile(slug: string): string {
  let hash = 2166136261
  for (const byte of new TextEncoder().encode(`shard:${slug}`)) {
    hash ^= byte
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, "0")
}

export const GraphExplorerPage: QuartzEmitterPlugin = () => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    pageBody: GraphExplorer(),
    beforeBody: [],
    left: [],
    right: [],
    header: [],
  }

  const { head: Head, pageBody, footer: Footer } = opts
  const Body = BodyConstructor()

  return {
    name: "GraphExplorerPage",
    getQuartzComponents() {
      // Keep the graph lifecycle listener loaded before SPA navigation reaches /zemelapis.
      return [Head, Body, pageBody, Footer]
    },
    async *emit(ctx, content, resources) {
      const cfg = ctx.cfg.configuration
      const slug = "zemelapis/index" as FullSlug
      const title = "Žemėlapis"
      const topology = JSON.parse(
        readFileSync(resolve(process.cwd(), "quartz/static/graph-data/topology.json"), "utf8"),
      )
      const documents = readRelationDocuments(ctx.argv.directory, ctx.allFiles, ctx.slugMap)
      const canonicalRelations = buildCanonicalRelationIndex(documents, ctx.relationTargetMap ?? {})
      const mergedTopology = withCanonicalRelations(topology, canonicalRelations)
      const slugMap = buildGraphSlugMap(
        content,
        buildAssetVersion,
        (mergedTopology.nodes ?? [])
          .map((node: { slug?: string }) => String(node.slug ?? ""))
          .filter(Boolean),
      )
      const completeTopology = withPublicObjectNodes(
        mergedTopology,
        Object.keys(slugMap.graphToPublic),
      )
      yield write({
        ctx,
        content: JSON.stringify(completeTopology),
        slug: "static/graph-data/topology" as FullSlug,
        ext: ".json",
      })
      for (const shard of objectGraphShards(completeTopology)) {
        yield write({
          ctx,
          content: JSON.stringify(shard.payload),
          slug: `static/graph-data/objects/${objectShardFile(shard.slug)}` as FullSlug,
          ext: ".json",
        })
      }
      yield write({
        ctx,
        content: JSON.stringify(slugMap),
        slug: "static/graphSlugMap" as FullSlug,
        ext: ".json",
      })
      const [tree, vfile] = defaultProcessedContent({
        slug,
        text: title,
        description: "Viso ekrano Lietuvos istorijos objektų ryšių žemėlapis.",
        frontmatter: { title, tags: ["zemelapis"] },
      })
      const externalResources = pageResources(pathToRoot(slug), resources)
      const componentData: QuartzComponentProps = {
        ctx,
        fileData: vfile.data,
        externalResources,
        cfg,
        children: [],
        tree,
        allFiles: [],
      }

      yield write({
        ctx,
        content: renderPage(cfg, slug, componentData, opts, externalResources),
        slug,
        ext: ".html",
      })
    },
    async *partialEmit() {},
  }
}
