import assert from "node:assert/strict"
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { VFile } from "vfile"

import type { BuildCtx } from "../../util/ctx"
import type { FilePath, FullSlug } from "../../util/path"
import type { ProcessedContent } from "../vfile"
import { AliasRedirects } from "./aliases"

function page(slug: string): ProcessedContent {
  const relativePath = slug + ".md"
  const file = new VFile({ path: relativePath })
  file.data = {
    slug: slug as FullSlug,
    relativePath: relativePath as FilePath,
    aliases: [],
    frontmatter: { title: slug },
  } as VFile["data"]
  return [{ type: "root", children: [] } as never, file]
}

function context(output: string, slugs: string[]): BuildCtx {
  return {
    argv: { output },
    cfg: { configuration: { baseUrl: "example.test" } },
    allSlugs: slugs,
    emittedFiles: new Set<FilePath>(),
    deletedFiles: new Set<FilePath>(),
  } as unknown as BuildCtx
}

async function runIncremental(
  ctx: BuildCtx,
  content: ProcessedContent[],
  added: ProcessedContent,
): Promise<FilePath[]> {
  const instance = AliasRedirects()
  assert.ok(instance.incrementalEmit)
  const file = added[1]
  const emitted: FilePath[] = []
  const outputs = instance.incrementalEmit(ctx, content, {} as never, [
    { type: "add", path: file.data.relativePath as FilePath, file },
  ]) as AsyncGenerator<FilePath>
  for await (const outputPath of outputs) {
    emitted.push(outputPath)
  }
  return emitted
}

test("incremental aliases remove a formerly safe redirect after a new alias collision", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "quartz-alias-incremental-"))
  const output = path.join(parent, "public")
  const staleAlias = path.join(output, "objektai", "asmenys", "A", "index.html")
  await mkdir(path.dirname(staleAlias), { recursive: true })
  await writeFile(staleAlias, "stale redirect")
  t.after(() => rm(parent, { recursive: true, force: true }))

  const oldPage = page("objektai/asmenys/A-(senas)")
  const addedPage = page("objektai/asmenys/A-(naujas)")
  const ctx = context(output, [oldPage[1].data.slug as string, addedPage[1].data.slug as string])
  const emitted = await runIncremental(ctx, [oldPage, addedPage], addedPage)

  await assert.rejects(stat(staleAlias), { code: "ENOENT" })
  assert.ok((ctx.deletedFiles as Set<string>).has(staleAlias))
  assert.deepEqual(emitted, [])
})

test("incremental aliases emit a new unambiguous generated redirect", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "quartz-alias-incremental-"))
  const output = path.join(parent, "public")
  t.after(() => rm(parent, { recursive: true, force: true }))

  const existingPage = page("objektai/asmenys/Esamas")
  const addedPage = page("objektai/asmenys/Unikalus-(bandymas)")
  const ctx = context(output, [
    existingPage[1].data.slug as string,
    addedPage[1].data.slug as string,
  ])
  const emitted = await runIncremental(ctx, [existingPage, addedPage], addedPage)
  const redirectPath = path.join(output, "objektai", "asmenys", "Unikalus", "index.html")

  assert.deepEqual(emitted, [redirectPath])
  assert.match(await readFile(redirectPath, "utf8"), /Unikalus-\(bandymas\)/)
})
