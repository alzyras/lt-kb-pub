import assert from "node:assert/strict"
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test, { type TestContext } from "node:test"
import { VFile } from "vfile"

import type { BuildCtx } from "../util/ctx"
import type { FilePath, FullSlug } from "../util/path"
import { ProcessedContentCache } from "../util/parseCache"
import { parseMarkdown, resolveProcessedFilePath } from "./parse"

function useCacheEnvironment(t: TestContext, cacheRoot: string) {
  const previousCacheDirectory = process.env.SITE_PARSE_CACHE_DIR
  const previousCodeFingerprint = process.env.SITE_PARSE_CODE_FINGERPRINT
  process.env.SITE_PARSE_CACHE_DIR = cacheRoot
  process.env.SITE_PARSE_CODE_FINGERPRINT = "parser-code-v1"
  t.after(() => {
    if (previousCacheDirectory === undefined) delete process.env.SITE_PARSE_CACHE_DIR
    else process.env.SITE_PARSE_CACHE_DIR = previousCacheDirectory
    if (previousCodeFingerprint === undefined) delete process.env.SITE_PARSE_CODE_FINGERPRINT
    else process.env.SITE_PARSE_CODE_FINGERPRINT = previousCodeFingerprint
  })
}

function hasMissingSlug(node: unknown): boolean {
  if (!node || typeof node !== "object") return false
  const value = node as { properties?: Record<string, unknown>; children?: unknown[] }
  if (typeof value.properties?.["data-missing-slug"] === "string") return true
  return (value.children ?? []).some(hasMissingSlug)
}

test("processed paths fall back to file data after worker transfer", () => {
  const file = new VFile("")
  file.data.filePath = "/tmp/quartz-worker-note.md" as FilePath
  assert.equal(resolveProcessedFilePath(file), "/tmp/quartz-worker-note.md")
})

test("a route-invalidated cache hit is refreshed and reused on the next parse", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "quartz-parse-route-refresh-"))
  const root = path.join(parent, "content")
  const cacheRoot = path.join(parent, "cache")
  await mkdir(root, { recursive: true })
  const sourcePath = path.join(root, "note.md")
  await writeFile(sourcePath, "# Original note\n")
  useCacheEnvironment(t, cacheRoot)
  t.after(() => rm(parent, { recursive: true, force: true }))

  const ctx = {
    argv: { directory: root, concurrency: 1, verbose: false },
    cfg: { plugins: { transformers: [] }, configuration: { ignorePatterns: [] } },
    allFiles: ["note.md"],
    allSlugs: ["note", "new-note"] as FullSlug[],
    slugMap: { "note.md": "note" as FullSlug },
    relationTargetMap: {},
  } as unknown as BuildCtx
  const cache = await ProcessedContentCache.create(ctx)
  assert.ok(cache)
  const first = await cache.get(sourcePath)
  const file = new VFile({ cwd: root, path: sourcePath, value: "# Original note\n" })
  file.data = {
    relativePath: "note.md" as FilePath,
    slug: "note" as FullSlug,
    relationResolutionDependencies: {},
  }
  const staleAst = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "a",
        properties: { "data-missing-slug": "new-note" },
        children: [],
      },
    ],
  }
  assert.equal(await cache.put(first.key, [staleAst as never, file]), true)

  const refreshed = await parseMarkdown(ctx, [sourcePath as FilePath])
  assert.equal(refreshed.length, 1)
  assert.equal(hasMissingSlug(refreshed[0][0]), false)

  const reused = await parseMarkdown(ctx, [sourcePath as FilePath])
  assert.equal(reused.length, 1)
  assert.equal(hasMissingSlug(reused[0][0]), false)
})
