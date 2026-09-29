import assert from "node:assert/strict"
import { mkdtemp, rm } from "node:fs/promises"
import os, { hostname } from "node:os"
import path from "node:path"
import test from "node:test"

import { withSiteLock } from "./lock.mjs"

test("a concurrent build for the same public repo is rejected", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "site-lock-test-"))
  t.after(() => rm(root, { recursive: true, force: true }))

  await withSiteLock(root, async () => {
    await assert.rejects(
      withSiteLock(root, async () => {}),
      /already running/,
    )
  })
})

test("a stale same-host lock is reclaimed", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "site-stale-lock-test-"))
  t.after(() => rm(root, { recursive: true, force: true }))
  const lock = path.join(root, ".cache", "site-regenerate", "runner.lock")
  await import("node:fs/promises").then(async ({ mkdir, writeFile }) => {
    await mkdir(lock, { recursive: true })
    await writeFile(
      path.join(lock, "owner.json"),
      JSON.stringify({ pid: 2147483647, host: hostname() }),
    )
  })

  let ran = false
  await withSiteLock(root, async () => {
    ran = true
  })
  assert.equal(ran, true)
})
