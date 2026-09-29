import { readFile, rm } from "node:fs/promises"
import path from "node:path"
import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FilePath, FullSlug, pathToRoot } from "../../util/path"
import { sharedPageComponents } from "../../../quartz.layout"
import { GraphExplorer } from "../../components"
import { defaultProcessedContent } from "../vfile"
import { write } from "./helpers"
import { buildGraphSlugMap, withPublicObjectNodes } from "../../util/graphIdentity"
import { buildDataVersion } from "../../util/buildVersion"
import { loadObjectTopology } from "../../util/objectGraph"
import { changedObjectGraphShardSlugs } from "../../util/graphShardChanges"
import { BuildCtx } from "../../util/ctx"
import { ProcessedContent } from "../vfile"
import { StaticResources } from "../../util/resources"

function objectGraphShards(
  topology: any,
  selectedSlugs?: ReadonlySet<string>,
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
    .filter(
      (node: any) =>
        String(node.slug ?? "").startsWith("objektai/") &&
        (!selectedSlugs || selectedSlugs.has(String(node.slug))),
    )
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

function objectShardFile(slug: string): string {
  let hash = 2166136261
  for (const byte of new TextEncoder().encode(`shard:${slug}`)) {
    hash ^= byte
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, "0")
}

async function* emitGraphExplorer(
  ctx: BuildCtx,
  content: ProcessedContent[],
  resources: StaticResources,
  opts: FullPageLayout,
  incremental: boolean,
) {
  const cfg = ctx.cfg.configuration
  const slug = "zemelapis/index" as FullSlug
  const title = "Žemėlapis"
  const topology = loadObjectTopology(path.resolve(ctx.argv.directory, "objektai"))
  const slugMap = buildGraphSlugMap(
    content,
    buildDataVersion,
    (topology.nodes ?? [])
      .map((node: { slug?: string }) => String(node.slug ?? ""))
      .filter(Boolean),
  )
  const completeTopology = withPublicObjectNodes(topology, Object.keys(slugMap.graphToPublic))
  let selectedSlugs: Set<string> | undefined
  let previousTopology: any
  if (incremental) {
    try {
      previousTopology = JSON.parse(
        await readFile(path.join(ctx.argv.output, "static/graph-data/topology.json"), "utf8"),
      )
      selectedSlugs = changedObjectGraphShardSlugs(previousTopology, completeTopology)
    } catch {
      // Without a valid old graph, regenerating every shard is the safe path.
    }
  }

  yield write({
    ctx,
    content: JSON.stringify(completeTopology),
    slug: "static/graph-data/topology" as FullSlug,
    ext: ".json",
  })
  for (const shard of objectGraphShards(completeTopology, selectedSlugs)) {
    yield write({
      ctx,
      content: JSON.stringify(shard.payload),
      slug: `static/graph-data/objects/${objectShardFile(shard.slug)}` as FullSlug,
      ext: ".json",
    })
  }

  if (selectedSlugs && previousTopology) {
    const currentSlugs = new Set(
      (completeTopology.nodes ?? [])
        .map((node: { slug?: string }) => String(node.slug ?? ""))
        .filter((nodeSlug: string) => nodeSlug.startsWith("objektai/")),
    )
    for (const previousNode of previousTopology.nodes ?? []) {
      const previousSlug = String(previousNode.slug ?? "")
      if (!previousSlug.startsWith("objektai/") || currentSlugs.has(previousSlug)) continue
      const removedPath = path.join(
        ctx.argv.output,
        "static/graph-data/objects",
        `${objectShardFile(previousSlug)}.json`,
      )
      await rm(removedPath, { force: true })
      ctx.deletedFiles?.add(removedPath as FilePath)
    }
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
      yield* emitGraphExplorer(ctx, content, resources, opts, false)
    },
    async *incrementalEmit(ctx, content, resources) {
      yield* emitGraphExplorer(ctx, content, resources, opts, true)
    },
    async *partialEmit() {},
  }
}
