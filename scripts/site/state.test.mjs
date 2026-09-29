import assert from "node:assert/strict"
import { mkdtemp, mkdir, rename, rm, symlink, utimes, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"

import { collectInputFingerprints, fingerprintTree, fingerprintTreeMetadata } from "./state.mjs"

test("input fingerprint follows content symlinks and catches same-size byte edits", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "site-input-fingerprint-"))
  const root = path.join(parent, "repo")
  const content = path.join(root, "content")
  const external = path.join(root, "objects")
  await mkdir(content, { recursive: true })
  await mkdir(external, { recursive: true })
  await writeFile(path.join(content, "index.md"), "# Home\n")
  await writeFile(path.join(external, "entry.md"), "aaa\n")
  await symlink("../objects", path.join(content, "objects"), "dir")
  t.after(() => rm(parent, { recursive: true, force: true }))

  const first = await collectInputFingerprints(root, { SITE_ORIGIN: "https://example.invalid" })
  const target = path.join(external, "entry.md")
  const old = await (await import("node:fs/promises")).stat(target)
  await writeFile(target, "bbb\n")
  await utimes(target, old.atime, old.mtime)
  const second = await collectInputFingerprints(root, { SITE_ORIGIN: "https://example.invalid" })

  assert.notEqual(first.inputFingerprint, second.inputFingerprint)
  assert.equal(
    second.inputDescriptor.inputs.some((entry) => entry.path === "content/objects/entry.md"),
    true,
  )
})

test("broken input symlinks are fingerprinted and target appearance invalidates the build", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "site-broken-input-symlink-"))
  const root = path.join(parent, "repo")
  const content = path.join(root, "content")
  await mkdir(content, { recursive: true })
  await writeFile(path.join(content, "index.md"), "# Home\n")
  await symlink("../optional-media", path.join(content, "media"), "dir")
  t.after(() => rm(parent, { recursive: true, force: true }))

  const first = await collectInputFingerprints(root, {})
  assert.deepEqual(first.brokenSymlinks, [{ path: "content/media", target: "../optional-media" }])

  await mkdir(path.join(root, "optional-media"))
  await writeFile(path.join(root, "optional-media", "image.md"), "# Media note\n")
  const second = await collectInputFingerprints(root, {})

  assert.deepEqual(second.brokenSymlinks, [])
  assert.notEqual(first.inputFingerprint, second.inputFingerprint)
  assert.equal(
    second.inputDescriptor.inputs.some((entry) => entry.path === "content/media/image.md"),
    true,
  )
})

test("style changes affect the build key without invalidating code-check inputs", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "site-code-fingerprint-"))
  const root = path.join(parent, "repo")
  const content = path.join(root, "content")
  const quartz = path.join(root, "quartz")
  await mkdir(content, { recursive: true })
  await mkdir(quartz, { recursive: true })
  await writeFile(path.join(content, "index.md"), "# Home\n")
  const style = path.join(quartz, "site.scss")
  await writeFile(style, "body{color:red}\n")
  t.after(() => rm(parent, { recursive: true, force: true }))

  const first = await collectInputFingerprints(root, {})
  await writeFile(style, "body{color:blue}\n")
  const second = await collectInputFingerprints(root, {})

  assert.notEqual(first.inputFingerprint, second.inputFingerprint)
  assert.equal(first.codeFingerprint, second.codeFingerprint)
  assert.equal(first.parserFingerprint, second.parserFingerprint)
})

test("graph projection data and its manifest invalidate output without invalidating code checks", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "site-graph-data-fingerprint-"))
  const root = path.join(parent, "repo")
  const content = path.join(root, "content")
  const graphData = path.join(root, "quartz", "static", "graph-data", "nodes")
  await mkdir(content, { recursive: true })
  await mkdir(graphData, { recursive: true })
  await writeFile(path.join(content, "index.md"), "# Home\n")
  const graphFile = path.join(graphData, "00.json")
  const manifest = path.join(root, "public-projection-manifest.json")
  await writeFile(graphFile, '{"nodes":[]}\n')
  await writeFile(manifest, '{"revision":1}\n')
  t.after(() => rm(parent, { recursive: true, force: true }))

  const first = await collectInputFingerprints(root, {})
  await writeFile(graphFile, '{"nodes":["new"]}\n')
  await writeFile(manifest, '{"revision":2}\n')
  const second = await collectInputFingerprints(root, {})

  assert.notEqual(first.inputFingerprint, second.inputFingerprint)
  assert.equal(first.codeFingerprint, second.codeFingerprint)
  assert.equal(first.parserFingerprint, second.parserFingerprint)
  assert.ok(
    second.inputDescriptor.inputs.some(
      (entry) => entry.path === "quartz/static/graph-data/nodes/00.json",
    ),
  )
  assert.ok(
    second.inputDescriptor.inputs.some((entry) => entry.path === "public-projection-manifest.json"),
  )
})

test("a note body edit invalidates output but keeps the parser's global context", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "site-note-input-fingerprint-"))
  const root = path.join(parent, "repo")
  const content = path.join(root, "content")
  await mkdir(content, { recursive: true })
  const note = path.join(content, "note.md")
  await writeFile(note, "first body\n")
  t.after(() => rm(parent, { recursive: true, force: true }))

  const first = await collectInputFingerprints(root, {})
  await writeFile(note, "other body\n")
  const second = await collectInputFingerprints(root, {})

  assert.notEqual(first.inputFingerprint, second.inputFingerprint)
  assert.equal(first.parserFingerprint, second.parserFingerprint)
  assert.equal(first.assetFingerprint, second.assetFingerprint)
})

test("the asset fingerprint tracks emitted resources, not corpus or graph data", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "site-asset-fingerprint-"))
  const root = path.join(parent, "repo")
  const note = path.join(root, "content", "object.md")
  const graph = path.join(root, "quartz", "static", "graph-data", "nodes", "object.json")
  const style = path.join(root, "quartz", "components", "styles", "custom.scss")
  await mkdir(path.dirname(note), { recursive: true })
  await mkdir(path.dirname(graph), { recursive: true })
  await mkdir(path.dirname(style), { recursive: true })
  await writeFile(note, "# Object\n")
  await writeFile(graph, '{"nodes":[]}\n')
  await writeFile(style, ".page { color: black; }\n")
  t.after(() => rm(parent, { recursive: true, force: true }))

  const initial = await collectInputFingerprints(root, {})
  await writeFile(note, "# Object\n\nNew claim.\n")
  await writeFile(graph, '{"nodes":["object"]}\n')
  const contentChanged = await collectInputFingerprints(root, {})
  assert.notEqual(initial.inputFingerprint, contentChanged.inputFingerprint)
  assert.equal(initial.assetFingerprint, contentChanged.assetFingerprint)

  await writeFile(style, ".page { color: navy; }\n")
  const assetChanged = await collectInputFingerprints(root, {})
  assert.notEqual(contentChanged.assetFingerprint, assetChanged.assetFingerprint)
})

test("note additions, removals, and renames change the route input fingerprint", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "site-route-set-fingerprint-"))
  const root = path.join(parent, "repo")
  const content = path.join(root, "content")
  await mkdir(content, { recursive: true })
  const firstNote = path.join(content, "first.md")
  const secondNote = path.join(content, "second.md")
  const renamedNote = path.join(content, "renamed.md")
  await writeFile(firstNote, "# First\n")
  t.after(() => rm(parent, { recursive: true, force: true }))

  const initial = await collectInputFingerprints(root, {})
  await writeFile(secondNote, "# Second\n")
  const added = await collectInputFingerprints(root, {})
  await rename(secondNote, renamedNote)
  const renamed = await collectInputFingerprints(root, {})
  await rm(firstNote)
  const removed = await collectInputFingerprints(root, {})

  assert.notEqual(initial.inputFingerprint, added.inputFingerprint)
  assert.notEqual(added.inputFingerprint, renamed.inputFingerprint)
  assert.notEqual(renamed.inputFingerprint, removed.inputFingerprint)
  assert.equal(
    renamed.inputDescriptor.inputs.some((entry) => entry.path === "content/renamed.md"),
    true,
  )
  assert.equal(
    renamed.inputDescriptor.inputs.some((entry) => entry.path === "content/second.md"),
    false,
  )
  assert.equal(
    removed.inputDescriptor.inputs.some((entry) => entry.path === "content/first.md"),
    false,
  )
})

test("Quartz transpilation cache files do not become build inputs", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "site-quartz-cache-input-"))
  const root = path.join(parent, "repo")
  const content = path.join(root, "content")
  const quartzCache = path.join(root, "quartz", ".quartz-cache")
  await mkdir(content, { recursive: true })
  await mkdir(quartzCache, { recursive: true })
  await writeFile(path.join(content, "index.md"), "# Home\n")
  const generated = path.join(quartzCache, "transpiled-worker.mjs")
  await writeFile(generated, "generated one\n")
  t.after(() => rm(parent, { recursive: true, force: true }))

  const first = await collectInputFingerprints(root, {})
  await writeFile(generated, "generated two\n")
  const second = await collectInputFingerprints(root, {})

  assert.equal(first.inputFingerprint, second.inputFingerprint)
})

test("output integrity hashes file contents rather than only size and timestamps", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "site-output-fingerprint-"))
  const output = path.join(parent, "public")
  await mkdir(output)
  const file = path.join(output, "index.html")
  await writeFile(file, "aaa")
  t.after(() => rm(parent, { recursive: true, force: true }))

  const before = await fingerprintTree(output)
  const fileInfo = await (await import("node:fs/promises")).stat(file)
  await writeFile(file, "bbb")
  await utimes(file, fileInfo.atime, fileInfo.mtime)
  const after = await fingerprintTree(output)

  assert.notEqual(before.fingerprint, after.fingerprint)
})

test("output metadata detects same-size edits even when mtime is restored", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "site-output-metadata-"))
  const output = path.join(parent, "public")
  await mkdir(output)
  const file = path.join(output, "index.html")
  await writeFile(file, "aaa")
  t.after(() => rm(parent, { recursive: true, force: true }))

  const before = await fingerprintTreeMetadata(output)
  const fileInfo = await (await import("node:fs/promises")).stat(file)
  await writeFile(file, "bbb")
  await utimes(file, fileInfo.atime, fileInfo.mtime)
  const after = await fingerprintTreeMetadata(output)

  assert.equal(before.supported, true)
  assert.equal(after.supported, true)
  assert.notEqual(before.fingerprint, after.fingerprint)
})
