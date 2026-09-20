import { build } from "esbuild"
import path from "node:path"

export const clientBundleEntries = {
  exhibition: "quartz/components/scripts/exhibition.inline.ts",
  gallery: "quartz/components/scripts/object-media-gallery.inline.ts",
  graph: "quartz/components/scripts/graph.inline.ts",
  "graph-explorer": "quartz/components/scripts/graph-explorer.inline.ts",
  search: "quartz/components/scripts/search.inline.ts",
  translation: "quartz/components/scripts/google-translate.inline.ts",
} as const

export type ClientBundleId = keyof typeof clientBundleEntries
export type ClientBundleManifest = Record<ClientBundleId, string>

// Split only within feature families. Cross-family splitting creates many tiny
// utility chunks without reducing what any one interaction needs to download.
const clientBundleGroups: Array<{
  chunkPrefix: string
  entries: ClientBundleId[]
}> = [
  { chunkPrefix: "media-vendor", entries: ["exhibition", "gallery"] },
  { chunkPrefix: "graph-vendor", entries: ["graph", "graph-explorer"] },
  { chunkPrefix: "search-vendor", entries: ["search"] },
  { chunkPrefix: "translation-vendor", entries: ["translation"] },
]

export type ClientBundleFile = {
  relativePath: string
  contents: Uint8Array
}

export type ClientBundleBuild = {
  files: ClientBundleFile[]
  manifest: ClientBundleManifest
}

export async function buildClientBundles(
  projectRoot: string,
  outputDirectory: string,
): Promise<ClientBundleBuild> {
  const results = await Promise.all(
    clientBundleGroups.map(async (group) => {
      const entryPoints = Object.fromEntries(
        group.entries.map((name) => [name, path.resolve(projectRoot, clientBundleEntries[name])]),
      )
      return build({
        absWorkingDir: projectRoot,
        entryPoints,
        outdir: outputDirectory,
        bundle: true,
        splitting: group.entries.length > 1,
        format: "esm",
        platform: "browser",
        target: ["safari15.6", "ios15.6", "edge115", "firefox102", "chrome109"],
        minify: true,
        treeShaking: true,
        legalComments: "none",
        sourcemap: false,
        entryNames: "[name]-[hash]",
        chunkNames: `${group.chunkPrefix}-[hash]`,
        write: false,
        metafile: true,
        logLevel: "silent",
      })
    }),
  )

  const files = results.flatMap((result) =>
    result.outputFiles.map((file) => {
      const relativePath = path.relative(outputDirectory, file.path)
      if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
        throw new Error(`Client bundle escaped output directory: ${file.path}`)
      }
      return { relativePath: relativePath.split(path.sep).join("/"), contents: file.contents }
    }),
  )

  const manifestEntries = Object.entries(clientBundleEntries).map(([name, entry]) => {
    const absoluteEntry = path.resolve(projectRoot, entry)
    for (const result of results) {
      const output = Object.entries(result.metafile!.outputs).find(([, metadata]) => {
        if (!metadata.entryPoint) return false
        return path.resolve(projectRoot, metadata.entryPoint) === absoluteEntry
      })
      if (!output) continue
      const relativePath = path
        .relative(outputDirectory, path.resolve(projectRoot, output[0]))
        .split(path.sep)
        .join("/")
      return [name, `/static/client/${relativePath}`]
    }
    throw new Error(`Missing client bundle output for ${name}`)
  })

  return {
    files,
    manifest: Object.fromEntries(manifestEntries) as ClientBundleManifest,
  }
}

export function clientBundleLoaderScript(manifest: ClientBundleManifest): string {
  const serializedManifest = JSON.stringify(manifest).replaceAll("<", "\\u003c")
  return `
const ltkbClientManifest = ${serializedManifest}
const ltkbClientModules = new Map()
const ltkbClientReady = new Set()
const ltkbClientInitializers = new Map()
const ltkbLoadClientModule = (id) => {
  if (!ltkbClientModules.has(id)) {
    ltkbClientModules.set(id, import(ltkbClientManifest[id]))
  }
  return ltkbClientModules.get(id)
}
const ltkbInitClientModule = (id) => {
  if (!ltkbClientInitializers.has(id)) {
    const initializer = ltkbLoadClientModule(id)
      .then(async (module) => {
        await module.initClient?.()
        ltkbClientReady.add(id)
        return module
      })
      .catch((error) => {
        ltkbClientModules.delete(id)
        ltkbClientReady.delete(id)
        console.error("Nepavyko įkelti kliento modulio " + id + ".", error)
        return undefined
      })
      .finally(() => ltkbClientInitializers.delete(id))
    ltkbClientInitializers.set(id, initializer)
  }
  return ltkbClientInitializers.get(id)
}
const ltkbInteractionBundle = (target) => {
  if (!(target instanceof Element)) return undefined
  if (target.closest("[data-li-search], .search-button")) return "search"
  if (target.closest("[data-translate-language]")) return "translation"
  if (target.closest(".graph-load-button, .global-graph-icon")) return "graph"
  return undefined
}
const ltkbReplayInteraction = (id, target) => {
  if (!(target instanceof Element) || !target.isConnected) return
  target.click()
}
const ltkbPrepareInteraction = (event) => {
  const id = ltkbInteractionBundle(event.target)
  if (id) void ltkbInitClientModule(id)
}
document.addEventListener("pointerdown", ltkbPrepareInteraction, true)
document.addEventListener("focusin", ltkbPrepareInteraction, true)
document.addEventListener("click", (event) => {
  const id = ltkbInteractionBundle(event.target)
  if (!id || id === "translation" || ltkbClientReady.has(id)) return
  event.preventDefault()
  event.stopImmediatePropagation()
  const target = event.target
  const graph = target instanceof Element ? target.closest(".graph") : undefined
  const graphSelector = target instanceof Element && target.closest(".global-graph-icon")
    ? ".global-graph-icon"
    : ".graph-load-button"
  void ltkbInitClientModule(id).then((module) => {
    if (!module) return
    if (id === "graph") graph?.querySelector(graphSelector)?.click()
    else ltkbReplayInteraction(id, target)
  })
}, true)
document.addEventListener("change", (event) => {
  const target = event.target
  if (!(target instanceof HTMLSelectElement) || !target.matches("[data-translate-language]")) return
  if (ltkbClientReady.has("translation")) return
  event.stopImmediatePropagation()
  const value = target.value
  void ltkbInitClientModule("translation").then((module) => {
    if (!module) return
    target.value = value
    target.dispatchEvent(new Event("change", { bubbles: true }))
  })
}, true)
document.addEventListener("keydown", (event) => {
  if (!(event.ctrlKey || event.metaKey) || event.shiftKey) return
  const key = event.key.toLowerCase()
  const id = key === "k" ? "search" : key === "g" && document.querySelector(".graph") ? "graph" : undefined
  if (!id || ltkbClientReady.has(id)) return
  event.preventDefault()
  event.stopImmediatePropagation()
  void ltkbInitClientModule(id).then((module) => {
    if (!module) return
    document.dispatchEvent(new KeyboardEvent("keydown", {
      key: event.key,
      code: event.code,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      bubbles: true,
    }))
  })
}, true)
const ltkbInitRouteClients = () => {
  ltkbClientReady.delete("search")
  ltkbClientReady.delete("translation")
  ltkbClientReady.delete("graph")
  if (document.querySelector("[data-media-gallery]")) void ltkbInitClientModule("gallery")
  if (document.querySelector("[data-graph-explorer]")) void ltkbInitClientModule("graph-explorer")
  if (document.querySelector(".exhibition-page")) void ltkbInitClientModule("exhibition")
  const language = new URLSearchParams(location.search).get("lang")
  if (language && language !== "lt") void ltkbInitClientModule("translation")
}
document.addEventListener("nav", ltkbInitRouteClients)
`
}
