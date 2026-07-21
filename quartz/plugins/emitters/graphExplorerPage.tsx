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
import { buildGraphSlugMap } from "../../util/graphIdentity"
import { buildAssetVersion } from "../../util/buildVersion"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import {
  buildCanonicalRelationIndex,
  readRelationDocuments,
} from "../../util/relations"

function relationEdgeId(source: string, target: string): string {
  let hash = 2166136261
  for (const byte of new TextEncoder().encode(`${source}\t${target}`)) {
    hash ^= byte
    hash = Math.imul(hash, 16777619)
  }
  return `canonical-${(hash >>> 0).toString(16).padStart(8, "0")}`
}

function withCanonicalRelations(topology: any, relations: ReturnType<typeof buildCanonicalRelationIndex>): any {
  const nodes = Array.isArray(topology.nodes) ? topology.nodes : []
  const nodeBySlug = new Map(nodes.map((node: any) => [String(node.slug ?? ""), node]))
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
      const canonicalRelations = buildCanonicalRelationIndex(
        documents,
        ctx.relationTargetMap ?? {},
      )
      const mergedTopology = withCanonicalRelations(topology, canonicalRelations)
      const slugMap = buildGraphSlugMap(
        content,
        buildAssetVersion,
        (mergedTopology.nodes ?? []).map((node: { slug?: string }) => String(node.slug ?? "")).filter(Boolean),
      )
      yield write({
        ctx,
        content: JSON.stringify(mergedTopology),
        slug: "static/graph-data/topology" as FullSlug,
        ext: ".json",
      })
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
