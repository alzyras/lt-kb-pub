// Preview the current map against the last complete public data snapshot.
import { build } from "esbuild"
import { sassPlugin } from "esbuild-sass-plugin"
import fs from "node:fs/promises"
import http from "node:http"
import path from "node:path"
import handler from "serve-handler"
import matter from "gray-matter"
import { setTimeout as delay } from "node:timers/promises"
const snapshot = process.env.GRAPH_PREVIEW_PUBLIC || "public"
const faults = JSON.parse(process.env.GRAPH_PREVIEW_FAULTS || "{}")

const output = path.resolve(".quartz-cache/graph-preview-component.mjs")
await build({
  stdin: {
    contents:
      'import Graph from "./quartz/components/GraphExplorer"; import {render} from "preact-render-to-string"; const Component = Graph(); export const html = render(Component({})); export const css = Component.css;',
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  outfile: output,
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  jsx: "automatic",
  jsxImportSource: "preact",
  plugins: [sassPlugin({ type: "css-text" })],
})
const component = await import(output + `?v=${Date.now()}`)
const dataModule = path.resolve(".quartz-cache/graph-preview-data.mjs")
await build({
  entryPoints: ["quartz/util/graphExplorerData.ts"],
  outfile: dataModule,
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
})
const { explorerData, objectPreview, objectShardFile } = await import(
  dataModule + `?v=${Date.now()}`
)
const topology = JSON.parse(
  await fs.readFile(path.join(snapshot, "static/graph-data/topology.json"), "utf8"),
)
const graphSlugMap = JSON.parse(
  await fs.readFile(path.join(snapshot, "static/graphSlugMap.json"), "utf8"),
)
const dataset = explorerData(
  topology,
  `preview-${Date.now()}`,
  Object.keys(graphSlugMap.graphToPublic),
)
const artifacts = new Map([
  ["core.json", dataset.core],
  ["index.json", dataset.index],
  ["search.json", dataset.search],
  ...[...dataset.tiles].map(([key, nodes]) => [`outer/${key}.json`, nodes]),
])
const byShard = new Map(topology.nodes.map((node) => [objectShardFile(node.slug), node.slug]))
const client = await build({
  entryPoints: ["quartz/components/scripts/graph-explorer.inline.ts"],
  bundle: true,
  write: false,
  format: "esm",
  platform: "browser",
  minify: true,
})
const original = await fs.readFile(path.join(snapshot, "zemelapis/index.html"), "utf8")
const html = original
  .replace(/<main class="graph-explorer"[\s\S]*?<\/main>/, component.html)
  .replace(/<script[^>]+src="[^\"]*postscript[^\"]*"[^>]*><\/script>/, "")
  .replace("</head>", `<style>${component.css}</style></head>`)
  .replace(
    "</body>",
    '<script type="module">window.addCleanup = () => {}; import {initClient} from "/__graph-preview.js"; initClient();</script></body>',
  )
http
  .createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost")
    const fault =
      faults[url.pathname] ??
      Object.entries(faults).find(
        ([prefix]) => prefix.endsWith("/") && url.pathname.startsWith(prefix),
      )?.[1]
    if (fault?.delay) await delay(fault.delay)
    if (fault?.failures > 0) {
      fault.failures--
      res.writeHead(503, { "Cache-Control": "no-store" })
      res.end("Preview test: temporary failure")
      return
    }
    const artifact = artifacts.get(url.pathname.replace("/static/graph-data/explorer/", ""))
    if (artifact) {
      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify(artifact))
      return
    }
    const shard = url.pathname.match(/^\/static\/graph-data\/objects\/([a-f0-9]+)\.json$/)
    if (shard && byShard.has(shard[1])) {
      try {
        const object = JSON.parse(await fs.readFile(path.join(snapshot, url.pathname), "utf8"))
        const source = await fs.readFile(
          path.join("content", byShard.get(shard[1]) + ".md"),
          "utf8",
        )
        const parsed = matter(source)
        const summary =
          parsed.content.match(/^##\s+Santrauka\s*\n([\s\S]*?)(?=^##\s+|(?![\s\S]))/mu)?.[1] ?? ""
        object.preview = objectPreview(parsed.data, summary)
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(object))
        return
      } catch {}
    }
    if (url.pathname === "/__graph-preview.js") {
      res.setHeader("Content-Type", "text/javascript")
      res.end(client.outputFiles[0].text)
      return
    }
    if (/^\/zemelapis\/?$/.test(url.pathname)) {
      res.setHeader("Content-Type", "text/html; charset=utf-8")
      res.setHeader("Cache-Control", "no-store")
      res.end(
        html.replace(
          "<html",
          `<html saved-theme="${url.searchParams.get("theme") === "dark" ? "dark" : "light"}"`,
        ),
      )
      return
    }
    const root = path.resolve(snapshot)
    const indexFile = path.resolve(root, `.${decodeURIComponent(url.pathname)}`, "index.html")
    if (indexFile.startsWith(root + path.sep)) {
      try {
        const page = await fs.readFile(indexFile, "utf8")
        res.setHeader("Content-Type", "text/html; charset=utf-8")
        res.end(page)
        return
      } catch {}
    }
    handler(req, res, { public: root, cleanUrls: true, trailingSlash: false })
  })
  .listen(Number(process.env.PORT || 8091), "127.0.0.1", () =>
    console.log(`Map preview: http://127.0.0.1:${process.env.PORT || 8091}/zemelapis/`),
  )
