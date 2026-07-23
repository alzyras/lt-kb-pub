import fs from "node:fs"
import path from "node:path"
import { createUniqueSlugMap, FilePath, FullSlug, simplifySlug } from "../quartz/util/path"
import {
  buildRelationTargetMap,
  readRelationDocuments,
  relationTargetSlug,
  relationTargetWikilinks,
} from "../quartz/util/relations"

type RelationIssue = {
  code: string
  filePath: string
  target?: string
  claimId?: string
  message: string
}

type ExpectedRelation = {
  targetSlug: FullSlug
}

const projectRoot = path.resolve(process.env.PROJECT_ROOT ?? ".")
const publicRoot = path.resolve(process.env.PUBLIC_ROOT ?? path.join(projectRoot, "public"))

function listMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdownFiles(entryPath)
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : []
  })
}

function expectedRelations(
  markdown: string,
  relationTargetMap: Record<string, FullSlug | null>,
): Map<string, ExpectedRelation> {
  const result = new Map<string, ExpectedRelation>()
  const add = (targetSlug: FullSlug) => {
    const key = simplifySlug(targetSlug)
    result.set(key, result.get(key) ?? { targetSlug })
  }

  for (const rawTarget of relationTargetWikilinks(markdown)) {
    const targetSlug = relationTargetSlug(rawTarget, relationTargetMap)
    if (targetSlug) add(targetSlug)
  }

  return result
}

function htmlPathForSlug(slug: FullSlug): string | null {
  const relative = String(simplifySlug(slug)).replace(/^\/+|\/+$/g, "")
  const candidates = [path.join(publicRoot, `${relative}.html`), path.join(publicRoot, relative, "index.html")]
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null
}

function relationsSectionHtml(html: string): string {
  const start = html.search(/<h2[^>]+id=["']ryšiai["'][^>]*>/i)
  if (start < 0) return ""
  const endCandidates = [html.indexOf("<h2 ", start + 5), html.indexOf("</article>", start)].filter((value) => value >= 0)
  const end = endCandidates.length ? Math.min(...endCandidates) : html.length
  return html.slice(start, end)
}

function hrefTargetSlug(href: string, sourceSlug: FullSlug): string {
  if (!href || href.startsWith("#")) return ""
  const pagePath = `/${String(simplifySlug(sourceSlug)).replace(/^\/+|\/+$/g, "")}/index.html`
  let pathname = ""
  try {
    pathname = decodeURI(new URL(href, `https://relations-audit.invalid${pagePath}`).pathname)
  } catch {
    return ""
  }
  return pathname
    .replace(/^\/+/, "")
    .replace(/\/index\.html$/i, "")
    .replace(/\.html$/i, "")
}

function graphEdges(publicPath: string): Array<{ from?: string; to?: string }> {
  const topologyPath = path.join(publicPath, "static/graph-data/topology.json")
  if (!fs.existsSync(topologyPath)) return []
  const topology = JSON.parse(fs.readFileSync(topologyPath, "utf8")) as { edges?: Array<{ from?: string; to?: string }> }
  return topology.edges ?? []
}

const absoluteFiles = listMarkdownFiles(path.join(projectRoot, "objektai"))
const relativeFiles = absoluteFiles.map((file) => path.relative(projectRoot, file) as FilePath)
const slugMap = Object.fromEntries(createUniqueSlugMap(relativeFiles)) as Record<string, FullSlug>
const documents = readRelationDocuments(projectRoot, relativeFiles, slugMap)
const relationTargetMap = buildRelationTargetMap(documents)
const topologyEdges = graphEdges(publicRoot)
const topologyPairs = new Set(topologyEdges.map((edge) => `${edge.from}\t${edge.to}`))
const issues: RelationIssue[] = []

for (const document of documents) {
  const expected = expectedRelations(document.markdown, relationTargetMap)
  if (expected.size === 0) continue
  const htmlPath = htmlPathForSlug(document.slug)
  if (!htmlPath) {
    issues.push({
      code: "missing_rendered_page",
      filePath: document.filePath,
      message: `No public HTML page for ${document.slug}`,
    })
    continue
  }
  const html = fs.readFileSync(htmlPath, "utf8")
  const section = relationsSectionHtml(html)
  if (!section) {
    issues.push({
      code: "missing_rendered_relations_section",
      filePath: document.filePath,
      message: `Rendered page has no Ryšiai section`,
    })
    continue
  }

  const renderedTargets = new Set<string>()
  for (const match of section.matchAll(/<a\b([^>]*)>/gi)) {
    const attributes = match[1]
    const dataSlug = attributes.match(/\bdata-slug=["']([^"']+)["']/i)?.[1]
    const href = attributes.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? ""
    // Relation links carry the canonical source slug explicitly. Prefer it
    // over reconstructing a URL from a rendered relative href: the latter is
    // affected by whether the static page is served as /page or /page/.
    const target = dataSlug
      ? String(simplifySlug(decodeURI(dataSlug) as FullSlug))
      : hrefTargetSlug(href, document.slug)
    if (target) renderedTargets.add(target)
  }

  for (const [targetKey, relation] of expected) {
    if (!renderedTargets.has(targetKey)) {
      issues.push({
        code: "missing_rendered_relation_link",
        filePath: document.filePath,
        target: relation.targetSlug,
        message: `Ryšiai section does not link to ${relation.targetSlug}`,
      })
    }
    if (!topologyPairs.has(`${document.slug}\t${relation.targetSlug}`)) {
      issues.push({
        code: "missing_graph_relation",
        filePath: document.filePath,
        target: relation.targetSlug,
        message: `Graph topology does not contain ${document.slug} -> ${relation.targetSlug}`,
      })
    }
  }

  for (const target of renderedTargets) {
    if (!expected.has(target)) {
      issues.push({
        code: "unexpected_rendered_relation",
        filePath: document.filePath,
        target,
        message: `Rendered Ryšiai section contains an unexpected target ${target}`,
      })
    }
  }

  if (/\bt-\d{3,}\b/i.test(section)) {
    issues.push({
      code: "technical_global_claim_id_in_rendered_relations",
      filePath: document.filePath,
      message: "Rendered Ryšiai section exposes a global claim id outside Advanced mode",
    })
  }
}

console.log(
  JSON.stringify(
    {
      schema: "ltkb-rendered-relation-integrity/v1",
      pages: documents.length,
      graphEdges: topologyEdges.length,
      issues: issues.length,
      counts: Object.fromEntries(
        [...new Set(issues.map((issue) => issue.code))].map((code) => [
          code,
          issues.filter((issue) => issue.code === code).length,
        ]),
      ),
      examples: issues.slice(0, 50),
    },
    null,
    2,
  ),
)

if (issues.length > 0) process.exitCode = 1
