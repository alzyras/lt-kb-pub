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
import { loadObjectTopology } from "../../util/objectGraph"
import {
  explorerData,
  objectPreview,
  objectShardFile,
  type ObjectPreview,
} from "../../util/graphExplorerData"
import { objectDetailEvidenceFromFile } from "../../util/objectDetail"

function objectGraphShards(
  topology: any,
  previews: Map<string, ObjectPreview>,
): Array<{ slug: string; payload: unknown }> {
  const nodes = Array.isArray(topology?.nodes) ? topology.nodes : []
  const nodeBySlug = new Map<string, any>(
    nodes.map((node: any) => [String(node.slug ?? ""), node] as [string, any]),
  )
  const linksBySlug = new Map<string, any[]>()
  for (const edge of Array.isArray(topology?.edges) ? topology.edges : []) {
    // A preview must never turn an arbitrary wikilink into a factual relation.
    // The full explorer still keeps its other layers as optional exploration aids.
    if (topology.relationKinds?.[edge.kind]?.defaultOn === false) continue
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
      const links = linksBySlug.get(slug) ?? []
      return {
        slug,
        payload: {
          ...(previews.has(slug) ? { preview: previews.get(slug) } : {}),
          focus: {
            slug,
            title: String(node.title ?? slug),
            type: String(node.type ?? ""),
            claimCount: Number(node.claimCount ?? 0),
            quoteCount: Number(node.quoteCount ?? 0),
          },
          neighbourCount: allNeighbours.length,
          relationCount: links.length,
          neighbours: links,
        },
      }
    })
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
      const topology = loadObjectTopology()
      const mergedTopology = topology
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
      const previews = new Map<string, ObjectPreview>()
      for (const [, file] of content) {
        const publicSlug = String(file.data.slug ?? "")
        const graphSlug = slugMap.publicToGraph[publicSlug]
        if (!graphSlug || !publicSlug.startsWith("objektai/")) continue
        const frontmatter = file.data.frontmatter ?? {}
        const preview = objectPreview(
          frontmatter,
          objectDetailEvidenceFromFile(file.data.filePath).summary,
        )
        previews.set(graphSlug, preview)
      }
      for (const shard of objectGraphShards(completeTopology, previews)) {
        yield write({
          ctx,
          content: JSON.stringify(shard.payload),
          slug: `static/graph-data/objects/${objectShardFile(shard.slug)}` as FullSlug,
          ext: ".json",
        })
      }
      const explorer = explorerData(completeTopology, buildAssetVersion)
      for (const [name, payload] of [
        ["core", explorer.core],
        ["index", explorer.index],
        ["search", explorer.search],
        ...[...explorer.tiles].map(([key, nodes]) => [`outer/${key}`, nodes]),
      ] as Array<[string, unknown]>) {
        yield write({
          ctx,
          content: JSON.stringify(payload),
          slug: `static/graph-data/explorer/${name}` as FullSlug,
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
