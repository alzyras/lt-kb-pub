/** Targeted, read-only renderer: current components over real projected Markdown. */
import fs from "node:fs"
import path from "node:path"
import http from "node:http"
import matter from "gray-matter"
// @ts-expect-error serve-handler does not publish TypeScript declarations.
import handler from "serve-handler"
import { renderToString } from "preact-render-to-string"
import Detail from "../quartz/components/ObjectDetailPage"
import Evidence, { Claim, CitationRecord } from "../quartz/components/ObjectEvidencePage"
import Gallery from "../quartz/components/ObjectMediaGallery"
import Header from "../quartz/components/LIHeader"
import config from "../quartz.config"
import styles from "../quartz/styles/custom.scss"
import { joinStyles } from "../quartz/util/theme"
import {
  objectDetailEvidenceFromFile,
  objectEvidenceDisplayItems,
  objectClaimHref,
} from "../quartz/util/objectDetail"
import { claimTopics } from "../quartz/util/objectEvidenceFilter"
import { objectBibliography } from "../quartz/util/objectBibliography"
import { objectMediaSet, cleanText } from "../quartz/util/objectMedia"
import { computeFacetSummary } from "../quartz/util/mediaGallery"
import { slugifyFilePath } from "../quartz/util/path"
// @ts-ignore
import spa from "../quartz/components/scripts/spa.inline"

const note = process.env.OBJECT_NOTE || "objektai/asmenys/Vytautas.md"
const root = process.cwd()
const filePath = path.join(root, note)
const finisherRoot = process.env.OBJECT_FINISHER_CONTENT_ROOT || ""
const fm = matter(fs.readFileSync(filePath, "utf8")).data
// The canonical DB projection and the development checkout can be at
// different corpus revisions. For a local UI review, overlay only the fields
// produced by the finisher instead of copying a whole generated note and
// accidentally hiding the development evidence corpus.
if (finisherRoot) {
  const projectedPath = path.join(finisherRoot, note)
  if (fs.existsSync(projectedPath)) {
    const projected = matter(fs.readFileSync(projectedPath, "utf8")).data
    for (const key of [
      "external_sources_json",
      "object_page_finisher",
      "object_page_finisher_hash",
    ])
      if (projected[key] !== undefined) fm[key] = projected[key]
    try {
      const view = JSON.parse(String(projected.object_page_view_json || "{}"))
      fm.object_page_view_json = JSON.stringify(view)
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
const paths = new Set(evidence.relations.map((row) => `${row.target}.md`))
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
const displayItems = objectEvidenceDisplayItems(evidence)
const sources = new Map(
  objectBibliography(files, evidence).flatMap((row) =>
    row.aliases.map((alias) => [alias, row.id] as const),
  ),
)
const index = {
  version: 2,
  items: [
    ...evidence.claims.map((claim) => ({
      kind: "claim",
      id: claim.id,
      text: claim.text,
      sources: claim.sourceTitles,
      topics: claimTopics(fm, claim.id),
      origin: "internal",
      href: objectClaimHref(slug, evidence, claim.id),
      html: renderToString(<Claim claim={claim} topics={claimTopics(fm, claim.id)} />),
    })),
    ...evidence.citationRecords.map((record) => ({
      kind: record.significantMention ? "mention" : "citation",
      id: record.id,
      text: [...record.entry.fields.values()].join(" "),
      sources: [
        cleanText(record.entry.fields.get("šaltinis") || record.entry.fields.get("saltinis")),
      ],
      standalone: record.standalone,
      origin: "internal",
      href: `/${slug}/irodymai`,
      html: renderToString(<CitationRecord record={record} />),
    })),
  ],
}
for (const row of index.items)
  Object.assign(row, { sourceIds: row.sources.map((title) => sources.get(title) || title) })
const components = [Detail(), Evidence(), Gallery(), Header()]
const css = joinStyles(
  config.configuration.theme,
  ...components.flatMap((component) => component.css || []),
  styles,
)
const scripts = [
  ...new Set(components.flatMap((component) => component.afterDOMLoaded || [])),
].join("\n")
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost")
  if (url.pathname === "/__object-evidence.json") {
    res.setHeader("Content-Type", "application/json")
    return res.end(JSON.stringify(index))
  }
  const route = decodeURIComponent(url.pathname).replace(/^\/|\/$/g, "")
  if (route === slug || route.startsWith(`${slug}/`)) {
    const isEvidence = route.includes("/irodymai")
    const isGallery = route.endsWith("/galerija")
    const Component = isEvidence ? components[1] : isGallery ? components[2] : components[0]
    const page = Number(route.split("/").at(-1)) || 1
    const pageFm = {
      ...fm,
      object_slug: slug,
      object_title: fm.title,
      object_note_path: note,
      object_source_path: filePath,
      object_evidence_page: Math.min(page, Math.ceil(displayItems.length / 50)),
      object_evidence_index: "/__object-evidence.json",
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
      `<!doctype html><html lang="lt" saved-theme="${url.searchParams.get("theme") === "dark" ? "dark" : "light"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${String(fm.title).replaceAll("<", "&lt;")}</title><link rel="stylesheet" href="/index.css"><style>${css}</style><script>window.addCleanup=()=>{};</script></head><body data-slug="${route}">${renderToString(components[3](props) as any)}${renderToString(Component(props) as any)}<script type="module">${scripts}\n${spa}</script></body></html>`,
    )
  }
  await handler(req, res, { public: path.join(root, "public"), cleanUrls: true })
})
server.listen(Number(process.env.PORT || 8090), "127.0.0.1", () =>
  console.log(`Object preview: http://127.0.0.1:${process.env.PORT || 8090}/${slug}`),
)
