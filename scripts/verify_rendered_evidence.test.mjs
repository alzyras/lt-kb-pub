import test from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

test("rendered evidence audit maps native nested paths to canonical URL routes", async (t) => {
  const repository = fileURLToPath(new URL("../", import.meta.url))
  const root = await mkdtemp(path.join(tmpdir(), "rendered-evidence-routes-"))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(path.join(root, "objektai/vietos"), { recursive: true })
  await writeFile(path.join(root, "objektai/vietos/Testas.md"), "# Testas\n\n## Teiginiai\n\n- t-000001\n  teiginys: Miestas minimas šaltinyje.\n")
  const output = path.join(root, "public/objektai/vietos/Testas/irodymai")
  await mkdir(output, { recursive: true })
  await writeFile(path.join(output, "index.html"), '<div data-object-evidence-page="true"><article data-evidence-kind="claim" id="claim-t-000001">Miestas minimas šaltinyje.</article></div>')
  const run = () => spawnSync(process.execPath, [path.join(repository, "node_modules/tsx/dist/cli.mjs"), path.join(repository, "scripts/verify_rendered_evidence.ts")], { cwd: root, encoding: "utf8", env: { ...process.env, CORPUS_ROOT: path.join(root, "objektai"), PUBLIC_ROOT: path.join(root, "public") } })
  const valid = run()
  assert.equal(valid.status, 0, valid.stdout + valid.stderr)
  await rm(path.join(output, "index.html"))
  const missing = run()
  assert.equal(missing.status, 1)
  assert.match(missing.stdout, /Missing rendered evidence pages/)
})
