import fs from "node:fs/promises"
import path from "node:path"
import { buildClientBundles, type ClientBundleId } from "../quartz/util/clientBundles"

// A translation-only release starts from the last verified Pages artifact.
// The workflow checks the source diff before calling this script.
const publicRoot = path.resolve(process.argv[2] || "public")
const version = process.env.GITHUB_SHA?.slice(0, 12)
if (!version) throw new Error("GITHUB_SHA is required for cache invalidation")

const bundles = await buildClientBundles(process.cwd(), path.join(publicRoot, "static/client"))
for (const file of bundles.files) {
  const destination = path.join(publicRoot, "static/client", file.relativePath)
  await fs.mkdir(path.dirname(destination), { recursive: true })
  await fs.writeFile(destination, file.contents)
}

const postscriptPath = path.join(publicRoot, "postscript.js")
const postscript = await fs.readFile(postscriptPath, "utf8")
const replaced = new Set<ClientBundleId>()
const nextPostscript = postscript.replace(
  /\/static\/client\/(graph-explorer|exhibition|translation|gallery|graph|search)-[A-Z0-9]+\.js/g,
  (_, id: ClientBundleId) => {
    replaced.add(id)
    return bundles.manifest[id]
  },
)
if (replaced.size !== Object.keys(bundles.manifest).length) {
  throw new Error("Published artifact does not have the expected client bundle manifest")
}
await fs.writeFile(postscriptPath, nextPostscript)

let pages = 0
let controls = 0
let scripts = 0
async function updatePages(directory: string): Promise<void> {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      await updatePages(filename)
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      const html = await fs.readFile(filename, "utf8")
      const updated = html
        .replace(/<option value="be">BY - Беларуская<\/option>/g, () => {
          controls += 1
          return '<option value="by">BY - Беларуская</option>'
        })
        .replace(/postscript\.js\?v=[^"'&<>\s]+/g, () => {
          scripts += 1
          return `postscript.js?v=${version}`
        })
      if (updated !== html) await fs.writeFile(filename, updated)
      pages += 1
    }
  }
}
await updatePages(publicRoot)
if (!controls || !scripts) throw new Error("No translation controls or script URLs were updated")
console.log(JSON.stringify({ pages, controls, scripts, manifest: bundles.manifest }))
