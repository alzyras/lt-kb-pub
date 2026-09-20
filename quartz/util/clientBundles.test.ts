import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import {
  buildClientBundles,
  clientBundleEntries,
  clientBundleLoaderScript,
  type ClientBundleManifest,
} from "./clientBundles"

function importedChunks(source: string): Set<string> {
  return new Set(
    [...source.matchAll(/from\s*["']\.\/((?:media|graph)-vendor-[^"']+\.js)["']/g)].map(
      (match) => match[1],
    ),
  )
}

test("builds feature entries with shared graph and PhotoSwipe chunks", async () => {
  const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "ltkb-client-bundles-"))
  try {
    const result = await buildClientBundles(process.cwd(), outputDirectory)
    assert.deepEqual(Object.keys(result.manifest).sort(), Object.keys(clientBundleEntries).sort())
    assert.equal(
      result.files.some((file) => file.relativePath.endsWith(".map")),
      false,
    )
    assert.equal(
      result.files.some((file) => Buffer.from(file.contents).includes("sourceMappingURL")),
      false,
    )

    const sourceFor = (name: keyof typeof clientBundleEntries) => {
      const fileName = result.manifest[name].split("/").at(-1)!
      const file = result.files.find((candidate) => candidate.relativePath === fileName)
      assert.ok(file, `missing output file for ${name}`)
      return Buffer.from(file.contents).toString()
    }
    for (const name of Object.keys(clientBundleEntries) as Array<
      keyof typeof clientBundleEntries
    >) {
      assert.match(sourceFor(name), /initClient/, `${name} must expose the loader entry point`)
    }
    const shared = (left: string, right: string) =>
      [...importedChunks(left)].filter((chunk) => importedChunks(right).has(chunk))

    const sharedGraphChunks = shared(sourceFor("graph"), sourceFor("graph-explorer"))
    const sharedMediaChunks = shared(sourceFor("gallery"), sourceFor("exhibition"))
    const fileSize = (name: string) =>
      result.files.find((candidate) => candidate.relativePath === name)?.contents.byteLength ?? 0
    assert.ok(
      sharedGraphChunks.some((chunk) => fileSize(chunk) > 50_000),
      "graph entries should reuse a substantial D3/Pixi vendor chunk",
    )
    assert.ok(
      sharedMediaChunks.some((chunk) => fileSize(chunk) > 50_000),
      "gallery entries should reuse the PhotoSwipe vendor chunk",
    )
  } finally {
    fs.rmSync(outputDirectory, { recursive: true, force: true })
  }
})

test("feature components do not put their client entry points back in the global bundle", () => {
  const components = [
    "ExhibitionPage.tsx",
    "GoogleTranslate.tsx",
    "Graph.tsx",
    "GraphExplorer.tsx",
    "ObjectMediaGallery.tsx",
    "Search.tsx",
  ]
  for (const component of components) {
    const source = fs.readFileSync(
      path.join(process.cwd(), "quartz", "components", component),
      "utf8",
    )
    assert.doesNotMatch(
      source,
      /scripts\/(?:exhibition|google-translate|graph(?:-explorer)?|object-media-gallery|search)\.inline/,
    )
  }
})

test("loader keeps route features separate and interaction features deferred", () => {
  const manifest = Object.fromEntries(
    Object.keys(clientBundleEntries).map((name) => [name, `/static/client/${name}-test.js?v=test`]),
  ) as ClientBundleManifest
  const loader = clientBundleLoaderScript(manifest)

  assert.match(loader, /querySelector\("\[data-media-gallery\]"\)/)
  assert.match(loader, /querySelector\("\[data-graph-explorer\]"\)/)
  assert.match(loader, /querySelector\("\.exhibition-page"\)/)
  assert.match(loader, /\[data-li-search\], \.search-button/)
  assert.match(loader, /\[data-translate-language\]/)
  assert.doesNotMatch(loader, /ltkbInitClientModule\("search"\)\s*$/m)
})
