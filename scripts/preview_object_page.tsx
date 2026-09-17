/** Targeted, read-only renderer: current components over real projected Markdown. */
import fs from "node:fs"
import path from "node:path"
import http from "node:http"
import matter from "gray-matter"
// @ts-expect-error serve-handler does not publish TypeScript declarations.
import handler from "serve-handler"
import { renderToString } from "preact-render-to-string"
import Detail from "../quartz/components/ObjectDetailPage"
import Evidence, { Claim } from "../quartz/components/ObjectEvidencePage"
import Relations, { RelationGroupCard } from "../quartz/components/ObjectRelationsPage"
import Gallery from "../quartz/components/ObjectMediaGallery"
import Header from "../quartz/components/LIHeader"
import GraphExplorer from "../quartz/components/GraphExplorer"
import FolderContent from "../quartz/components/pages/FolderContent"
import { EditorialCatalog, editorialCatalogStyle } from "../quartz/components/EditorialCatalog"
import { loadObjectTopology } from "../quartz/util/objectGraph"
import { graphVisualRegistry } from "../quartz/util/graphVisualRegistry"
import { loadExhibitionCatalog } from "../quartz/util/exhibitions"
import { mediaImageUrl } from "../quartz/util/objectMedia"
import config from "../quartz.config"
import {
  objectDetailEvidenceFromFile,
  objectEvidenceClaimItems,
  objectClaimHref,
} from "../quartz/util/objectDetail"
import { claimTopics } from "../quartz/util/objectEvidenceFilter"
import { objectRelationGroupItems } from "../quartz/components/ObjectRelationsPage"
import { objectBibliography } from "../quartz/util/objectBibliography"
import { objectMediaSet } from "../quartz/util/objectMedia"
import { objectPageViewModel } from "../quartz/util/objectPageView"
import { computeFacetSummary } from "../quartz/util/mediaGallery"
import { slugifyFilePath } from "../quartz/util/path"
import { joinStyles } from "../quartz/util/theme"
// @ts-ignore The preview bundler compiles the Sass entrypoint to CSS text.
import globalStyle from "../quartz/styles/custom.scss"
// @ts-ignore
import spa from "../quartz/components/scripts/spa.inline"

const note = process.env.OBJECT_NOTE || "objektai/asmenys/Vytautas.md"
const root = process.cwd()
const filePath = path.join(root, note)
const finisherRoot = process.env.OBJECT_FINISHER_CONTENT_ROOT || ""
const fm = matter(fs.readFileSync(filePath, "utf8")).data
fm.object_page_preview = true
// The canonical DB projection and the development checkout can be at
// different corpus revisions. For a local UI review, overlay only the fields
// produced by the finisher instead of copying a whole generated note and
// accidentally hiding the development evidence corpus. The view model is
// copied as a whole because its published modules (wiki, traits, featured
// claims, portrait, and source buttons) are one versioned projection. Picking
// only a few fields here makes a real enrichment look empty in the preview.
if (finisherRoot) {
  const projectedPath = path.join(finisherRoot, note)
  if (fs.existsSync(projectedPath)) {
    const projected = matter(fs.readFileSync(projectedPath, "utf8")).data
    for (const key of [
      "external_sources_json",
      "object_page_finisher",
      "object_page_finisher_hash",
      "object_page_internal_summary_candidate_json",
    ])
      if (projected[key] !== undefined) fm[key] = projected[key]
    try {
      const view = JSON.parse(String(projected.object_page_view_json || "{}"))
      if (view && typeof view === "object" && !Array.isArray(view)) {
        fm.object_page_view_json = JSON.stringify(view)
      }
    } catch {
      // A malformed generated value should never make a preview unusable.
    }
  }
}
fm.title ||= fm.pavadinimas || "Istorijos objektas"
const slug = slugifyFilePath(note as any)
const file = { slug, frontmatter: fm, filePath }
const evidence = objectDetailEvidenceFromFile(filePath)
const files: any[] = [file]
const topology = loadObjectTopology()
for (const node of topology.nodes) {
  if (node.slug === evidence.objectSlug) continue
  const notePath = path.join(root, `${node.slug}.md`)
  files.push({
    slug: slugifyFilePath(`${node.slug}.md` as any),
    filePath: fs.existsSync(notePath) ? notePath : undefined,
    frontmatter: { title: node.title, tipas: node.type },
  })
}
for (const name of fs.readdirSync(path.join(root, "straipsniai"))) {
  if (!name.endsWith(".md")) continue
  const fp = path.join(root, "straipsniai", name)
  files.push({
    slug: slugifyFilePath(`straipsniai/${name}` as any),
    filePath: fp,
    frontmatter: matter(fs.readFileSync(fp, "utf8")).data,
  })
}
const projectedView = objectPageViewModel(fm, evidence)
const paths = new Set([
  ...evidence.relations.map((row) => `${row.target}.md`),
  ...projectedView.relationRows.map((row) => `${row.target}.md`),
])
for (const name of fs.readdirSync(path.join(root, "objektai/saltiniai")))
  if (name.endsWith(".md")) paths.add(`objektai/saltiniai/${name}`)
for (const name of paths) {
  const fp = path.join(root, name)
  if (fs.existsSync(fp))
    files.push({
      slug: slugifyFilePath(name as any),
      frontmatter: matter(fs.readFileSync(fp, "utf8")).data,
      filePath: fp,
    })
}
const entries = objectMediaSet(fm as any).all
const displayItems = objectEvidenceClaimItems(evidence)
const sources = new Map(
  objectBibliography(files, evidence).flatMap((row) =>
    row.aliases.map((alias) => [alias, row.id] as const),
  ),
)
const index = {
  version: 2,
  items: displayItems.map(({ value: claim }) => ({
    kind: "claim",
    id: claim.id,
    text: claim.text,
    sources: claim.sourceTitles,
    topics: claimTopics(fm, claim.id),
    origin: "internal",
    href: objectClaimHref(slug, evidence, claim.id),
    html: renderToString(<Claim claim={claim} topics={claimTopics(fm, claim.id)} />),
  })),
}
const relationGroups = objectRelationGroupItems(fm, evidence, files)
const relationIndex = {
  version: 2,
  relationCount: relationGroups.reduce((count, group) => count + group.targets.length, 0),
  items: relationGroups.map((group) => ({
    id: group.id,
    label: group.label,
    relationCount: group.targets.length,
    html: renderToString(<RelationGroupCard group={group} />),
  })),
}
for (const row of index.items)
  Object.assign(row, { sourceIds: row.sources.map((title) => sources.get(title) || title) })
const components = [
  Detail(),
  Evidence(),
  Gallery(),
  Header(),
  Relations(),
  GraphExplorer(),
  FolderContent(),
]
const css = joinStyles(
  config.configuration.theme,
  ...components.flatMap((component) => component.css || []),
  globalStyle,
  editorialCatalogStyle,
)
const scripts = [
  `globalThis.__ltkbGraphVisualRegistry = ${JSON.stringify(graphVisualRegistry)};`,
  ...new Set(components.flatMap((component) => component.afterDOMLoaded || [])),
].join("\n")
function previewBody(props: any, body: any) {
  return renderToString(
    <div id="quartz-root" class="page">
      <div id="quartz-body">
        <div class="left sidebar" />
        <div class="center">
          <div class="page-header">
            <header>{components[3](props)}</header>
            <div class="popover-hint" />
          </div>
          {body}
        </div>
        <div class="right sidebar" />
      </div>
    </div>,
  )
}
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost")
  if (url.pathname === "/static/graph-data/topology.json") {
    res.setHeader("Content-Type", "application/json")
    return res.end(JSON.stringify(topology))
  }
  if (url.pathname === "/static/graphSlugMap.json") {
    const graphToPublic = Object.fromEntries(
      topology.nodes.map((node: any) => [node.slug, slugifyFilePath(`${node.slug}.md` as any)]),
    )
    res.setHeader("Content-Type", "application/json")
    return res.end(
      JSON.stringify({
        graphToPublic,
        publicToGraph: Object.fromEntries(Object.entries(graphToPublic).map(([a, b]) => [b, a])),
        aliases: {},
      }),
    )
  }
  if (url.pathname === "/__object-evidence.json") {
    res.setHeader("Content-Type", "application/json")
    return res.end(JSON.stringify(index))
  }
  if (url.pathname === "/__object-relations.json") {
    res.setHeader("Content-Type", "application/json")
    return res.end(JSON.stringify(relationIndex))
  }
  const route = decodeURIComponent(url.pathname).replace(/^\/|\/$/g, "")
  if (
    ["zemelapis", "straipsniai", "parodos", "objektai"].includes(route) ||
    /^objektai\/[^/]+$/u.test(route)
  ) {
    const props: any = {
      fileData: { slug: `${route}/index`, frontmatter: { title: route } },
      allFiles: files,
      cfg: config.configuration,
      ctx: { cfg: config },
      tree: { type: "root", children: [] },
      children: [],
      externalResources: { css: [], js: [] },
    }
    const body =
      route === "parodos" ? (
        <EditorialCatalog
          title="Parodos"
          lead="Susitikimai su praeitimi. Atrasti eksponatai, jų istorijos ir skirtingi žvilgsniai į Lietuvos atmintį."
          entries={loadExhibitionCatalog().map((entry) => ({
            ...entry,
            image: entry.hero ? mediaImageUrl(entry.hero) : "",
            kicker: entry.subtitle,
          }))}
        />
      ) : (
        (route === "zemelapis" ? components[5] : components[6])(props)
      )
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader("Cache-Control", "no-store")
    return res.end(
      `<!doctype html><html lang="lt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${route}</title><style>${css}</style><script>window.addCleanup=()=>{};</script></head><body data-slug="${route}/index">${previewBody(props, body)}<script type="module">${scripts}\n${spa}</script></body></html>`,
    )
  }
  if (route === slug || route.startsWith(`${slug}/`)) {
    const isEvidence = route.includes("/irodymai")
    const isRelations = route.includes("/rysiai")
    const isGallery = route.endsWith("/galerija")
    const Component = isEvidence
      ? components[1]
      : isRelations
        ? components[4]
        : isGallery
          ? components[2]
          : components[0]
    const page = Number(route.split("/").at(-1)) || 1
    const pageFm = {
      ...fm,
      object_slug: slug,
      object_title: fm.title,
      object_note_path: note,
      object_source_path: filePath,
      object_evidence_page: Math.min(page, Math.ceil(displayItems.length / 50)),
      object_evidence_index: "/__object-evidence.json",
      object_relations_page: Math.min(page, Math.ceil(relationGroups.length / 50)),
      object_relations_index: "/__object-relations.json",
      media_gallery_page: true,
      media_gallery_bootstrap_json: JSON.stringify({
        initialEntries: entries.slice(0, 50),
        totalCount: entries.length,
        facetSummary: computeFacetSummary(entries),
        catalogUrl: "/static/mediaCatalog.json",
        catalogVersion: "preview",
        lockedObject: note,
      }),
    }
    const props: any = {
      fileData: { ...file, slug: route, frontmatter: route === slug ? fm : pageFm },
      allFiles: files,
      cfg: config.configuration,
      ctx: { cfg: config },
      tree: { type: "root", children: [] },
      children: [],
      externalResources: { css: [], js: [] },
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader("Cache-Control", "no-store")
    return res.end(
      `<!doctype html><html lang="lt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${String(fm.title).replaceAll("<", "&lt;")}</title><style>${css}</style><script>window.addCleanup=()=>{};</script></head><body data-slug="${route}">${previewBody(props, Component(props))}<script type="module">${scripts}\n${spa}</script></body></html>`,
    )
  }
  if (url.pathname.startsWith("/static/"))
    return handler(req, res, { public: path.join(root, "quartz"), cleanUrls: true })
  await handler(req, res, {
    public: process.env.OBJECT_PREVIEW_PUBLIC_ROOT || path.join(root, "public"),
    cleanUrls: true,
  })
})
server.listen(Number(process.env.PORT || 8090), "127.0.0.1", () =>
  console.log(`Object preview: http://127.0.0.1:${process.env.PORT || 8090}/${slug}`),
)
