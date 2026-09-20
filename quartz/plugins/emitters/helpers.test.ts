import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import type { BuildCtx } from "../../util/ctx"
import type { FullSlug } from "../../util/path"
import { write } from "./helpers"

function context(output: string): BuildCtx {
  return { argv: { output } } as BuildCtx
}

test("writes content HTML only to its clean index route", async () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), "ltkb-pretty-routes-"))
  try {
    const written = await write({
      ctx: context(output),
      slug: "objektai/asmenys/vytautas" as FullSlug,
      ext: ".html",
      content: '<link href="../../index.css"><script src="../../postscript.js"></script>',
    })

    assert.equal(written, path.join(output, "objektai/asmenys/vytautas/index.html"))
    assert.equal(fs.existsSync(path.join(output, "objektai/asmenys/vytautas.html")), false)
    assert.equal(
      fs.readFileSync(written, "utf8"),
      '<link href="../../../index.css"><script src="../../../postscript.js"></script>',
    )
  } finally {
    fs.rmSync(output, { recursive: true, force: true })
  }
})

test("preserves root, explicit index, and 404 compatibility paths", async () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), "ltkb-special-routes-"))
  try {
    const ctx = context(output)
    const root = await write({
      ctx,
      slug: "index" as FullSlug,
      ext: ".html",
      content: "root",
    })
    const folder = await write({
      ctx,
      slug: "objektai/index" as FullSlug,
      ext: ".html",
      content: "folder",
    })
    const notFound = await write({
      ctx,
      slug: "404" as FullSlug,
      ext: ".html",
      content: "missing",
    })

    assert.equal(root, path.join(output, "index.html"))
    assert.equal(folder, path.join(output, "objektai/index.html"))
    assert.equal(notFound, path.join(output, "404.html"))
  } finally {
    fs.rmSync(output, { recursive: true, force: true })
  }
})
