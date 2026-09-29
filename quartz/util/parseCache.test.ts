import assert from "node:assert/strict"
import { mkdtemp, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test, { type TestContext } from "node:test"
import { VFile } from "vfile"

import type { BuildCtx } from "./ctx"
import { ProcessedContentCache } from "./parseCache"

function useCacheEnvironment(t: TestContext, cacheRoot: string, maxBytes?: number) {
  const previousCacheDirectory = process.env.SITE_PARSE_CACHE_DIR
  const previousCodeFingerprint = process.env.SITE_PARSE_CODE_FINGERPRINT
  const previousMaximumBytes = process.env.SITE_PARSE_CACHE_MAX_BYTES
  process.env.SITE_PARSE_CACHE_DIR = cacheRoot
  process.env.SITE_PARSE_CODE_FINGERPRINT = "parser-code-v1"
  if (maxBytes !== undefined) process.env.SITE_PARSE_CACHE_MAX_BYTES = String(maxBytes)
  t.after(() => {
    if (previousCacheDirectory === undefined) delete process.env.SITE_PARSE_CACHE_DIR
    else process.env.SITE_PARSE_CACHE_DIR = previousCacheDirectory
    if (previousCodeFingerprint === undefined) delete process.env.SITE_PARSE_CODE_FINGERPRINT
    else process.env.SITE_PARSE_CODE_FINGERPRINT = previousCodeFingerprint
    if (previousMaximumBytes === undefined) delete process.env.SITE_PARSE_CACHE_MAX_BYTES
    else process.env.SITE_PARSE_CACHE_MAX_BYTES = previousMaximumBytes
  })
}

function makeContext(root: string): BuildCtx {
  return {
    argv: { directory: root },
    allFiles: ["note.md"],
    slugMap: { "note.md": "note" },
    relationTargetMap: { "note.md": ["other.md"] },
  } as unknown as BuildCtx
}

test("processed AST and VFile metadata round-trip typed values", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "quartz-parse-cache-"))
  const root = path.join(parent, "content")
  const cacheRoot = path.join(parent, "cache")
  await mkdir(root, { recursive: true })
  const sourcePath = path.join(root, "note.md")
  await writeFile(sourcePath, "# Test\n")
  useCacheEnvironment(t, cacheRoot)
  t.after(async () => {
    await rm(parent, { recursive: true, force: true })
  })

  const file = new VFile({ cwd: root, path: sourcePath, value: "# Test\n" })
  file.data = {
    relativePath: "note.md",
    dates: { created: new Date("1420-01-02T00:00:00.000Z") },
    labels: new Set(["asmuo", "LDK"]),
    lookup: new Map([["id", { page: "note.md" }]]),
    payload: Buffer.from("metadata"),
  } as unknown as VFile["data"]
  const ast = {
    type: "root",
    children: [
      { type: "text", value: "Test", position: { start: { line: 1, column: 3, offset: 2 } } },
    ],
  } as const

  const cache = await ProcessedContentCache.create(makeContext(root))
  assert.ok(cache)
  const first = await cache.get(sourcePath)
  assert.equal(first.content, undefined)
  assert.equal(await cache.put(first.key, [ast as never, file]), true)

  const restored = await cache.get(sourcePath)
  assert.ok(restored.content)
  const [restoredAst, restoredFile] = restored.content
  const restoredData = restoredFile.data as unknown as {
    dates: { created: Date }
    labels: Set<string>
    lookup: Map<string, { page: string }>
    payload: Buffer
  }
  assert.deepEqual(restoredAst, ast)
  assert.equal(restoredFile instanceof VFile, true)
  assert.equal(restoredData.dates.created instanceof Date, true)
  assert.equal(restoredData.dates.created.getTime(), new Date("1420-01-02T00:00:00.000Z").getTime())
  assert.deepEqual([...restoredData.labels], ["asmuo", "LDK"])
  assert.deepEqual([...restoredData.lookup], [["id", { page: "note.md" }]])
  assert.equal(Buffer.isBuffer(restoredData.payload), true)
  assert.deepEqual(restoredData.payload, Buffer.from("metadata"))
})

test("a corrupt parse entry becomes a safe cache miss", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "quartz-corrupt-parse-cache-"))
  const root = path.join(parent, "content")
  const cacheRoot = path.join(parent, "cache")
  await mkdir(root, { recursive: true })
  const sourcePath = path.join(root, "note.md")
  await writeFile(sourcePath, "# Test\n")
  useCacheEnvironment(t, cacheRoot)
  t.after(() => rm(parent, { recursive: true, force: true }))

  const cache = await ProcessedContentCache.create(makeContext(root))
  assert.ok(cache)
  const first = await cache.get(sourcePath)
  const contextDirectory = (await readdir(cacheRoot))[0]
  const cacheFile = path.join(cacheRoot, contextDirectory, `${first.key}.json.gz`)
  await writeFile(cacheFile, "not gzip")
  const second = await cache.get(sourcePath)
  assert.equal(second.key, first.key)
  assert.equal(second.content, undefined)
})

test("replacing a stale cache hit reuses its existing quota", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "quartz-parse-cache-replace-"))
  const root = path.join(parent, "content")
  const cacheRoot = path.join(parent, "cache")
  await mkdir(root, { recursive: true })
  const sourcePath = path.join(root, "note.md")
  await writeFile(sourcePath, "# Test\n")
  useCacheEnvironment(t, cacheRoot, 1024)
  t.after(() => rm(parent, { recursive: true, force: true }))

  const cache = await ProcessedContentCache.create(makeContext(root))
  assert.ok(cache)
  const first = await cache.get(sourcePath)
  const originalFile = new VFile({ path: sourcePath, value: "# Test\n" })
  const originalAst = {
    type: "root",
    children: [{ type: "text", value: "version-0" }],
  }
  assert.equal(await cache.put(first.key, [originalAst as never, originalFile]), true)
  const contextDirectory = (await readdir(cacheRoot))[0]
  const cacheFile = path.join(cacheRoot, contextDirectory, `${first.key}.json.gz`)
  const originalBytes = Number((await stat(cacheFile)).size)

  for (let version = 1; version <= 12; version++) {
    const hit = await cache.get(sourcePath)
    assert.ok(hit.content)
    const updatedAst = {
      type: "root",
      children: [{ type: "text", value: `version-${version}` }],
    }
    assert.equal(await cache.put(hit.key, [updatedAst as never, hit.content[1]]), true)
  }

  const finalHit = await cache.get(sourcePath)
  assert.ok(finalHit.content)
  assert.equal(
    (finalHit.content[0] as { children: Array<{ value: string }> }).children[0].value,
    "version-12",
  )
  assert.ok(Number((await stat(cacheFile)).size) < originalBytes + 1024)
})

test("content-independent cache keys stay stable as global relation context changes", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "quartz-parse-context-"))
  const root = path.join(parent, "content")
  const cacheRoot = path.join(parent, "cache")
  await mkdir(root, { recursive: true })
  const sourcePath = path.join(root, "note.md")
  await writeFile(sourcePath, "# Test\n")
  useCacheEnvironment(t, cacheRoot)
  t.after(() => rm(parent, { recursive: true, force: true }))

  const firstCache = await ProcessedContentCache.create(makeContext(root))
  assert.ok(firstCache)
  const first = await firstCache.get(sourcePath)
  const changedContext = makeContext(root)
  ;(
    changedContext as unknown as { relationTargetMap: Record<string, string[]> }
  ).relationTargetMap = {
    "note.md": ["another.md"],
  }
  const secondCache = await ProcessedContentCache.create(changedContext)
  assert.ok(secondCache)
  const second = await secondCache.get(sourcePath)
  assert.equal(first.key, second.key)
  assert.equal(second.content, undefined)
})
