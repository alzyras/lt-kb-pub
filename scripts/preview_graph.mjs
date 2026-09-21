// Preview the current map against the last complete public data snapshot.
import { build } from "esbuild"
import { sassPlugin } from "esbuild-sass-plugin"
import fs from "node:fs/promises"
import http from "node:http"
import path from "node:path"
import handler from "serve-handler"

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
const client = await build({
  entryPoints: ["quartz/components/scripts/graph-explorer.inline.ts"],
  bundle: true,
  write: false,
  format: "esm",
  platform: "browser",
  minify: true,
})
const original = await fs.readFile("public/zemelapis/index.html", "utf8")
const html = original
  .replace(/<main class="graph-explorer"[\s\S]*?<\/main>/, component.html)
  .replace(/<script[^>]+src="[^\"]*postscript[^\"]*"[^>]*><\/script>/, "")
  .replace("</head>", `<style>${component.css}</style></head>`)
  .replace(
    "</body>",
    '<script type="module">window.addCleanup = () => {}; import {initClient} from "/__graph-preview.js"; initClient();</script></body>',
  )
http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://localhost")
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
    handler(req, res, { public: "public", cleanUrls: true })
  })
  .listen(Number(process.env.PORT || 8091), "127.0.0.1", () =>
    console.log(`Map preview: http://127.0.0.1:${process.env.PORT || 8091}/zemelapis/`),
  )
