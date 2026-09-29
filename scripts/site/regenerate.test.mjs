import assert from "node:assert/strict"
import {
  mkdtemp,
  mkdir,
  readFile,
  rename,
  rm,
  stat,
  symlink,
  utimes,
  writeFile,
} from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { buildSite, parseArguments, recoverInterruptedSwap, repositoryRoot } from "./regenerate.mjs"
import { collectInputFingerprints } from "./state.mjs"

async function makeFixture(t) {
  const parent = await mkdtemp(path.join(os.tmpdir(), "site-regenerate-test-"))
  const root = path.join(parent, "public-repo")
  for (const directory of ["content", "quartz", "scripts"]) {
    await mkdir(path.join(root, directory), { recursive: true })
  }
  await writeFile(path.join(root, "content", "index.md"), "# Test page\n")
  await writeFile(path.join(root, "quartz", "test.scss"), ".site { color: red; }\n")
  await writeFile(path.join(root, "package.json"), '{"scripts":{"test":"tsx --test"}}\n')
  await writeFile(path.join(root, "package-lock.json"), "{}\n")
  await writeFile(path.join(root, "tsconfig.json"), "{}\n")
  t.after(() => rm(parent, { recursive: true, force: true }))
  return { root, output: path.join(root, "public") }
}

function fixtureExecutor(calls, { failAt = "", afterStep } = {}) {
  return async (step, { env }) => {
    calls.push({ name: step.name, env, args: step.args })
    if (step.name.startsWith("quartz-")) {
      const outputIndex = step.args.indexOf("--output")
      const output = step.args[outputIndex + 1]
      await mkdir(output, { recursive: true })
      const indexPath = path.join(output, "index.html")
      const temporaryIndexPath = `${indexPath}.tmp`
      await writeFile(temporaryIndexPath, `${env.SITE_DATA_VERSION}\n`)
      await rename(temporaryIndexPath, indexPath)
      await writeFile(path.join(output, ".html"), "root redirect\n")
      if (env.SITE_BUILD_METADATA_PATH) {
        await writeFile(
          env.SITE_BUILD_METADATA_PATH,
          JSON.stringify({ schemaVersion: 1, files: {} }),
        )
      }
      if (env.SITE_EMITTED_FILES_PATH) {
        await writeFile(
          env.SITE_EMITTED_FILES_PATH,
          JSON.stringify({
            written: [indexPath, path.join(output, ".html")],
            deleted: [],
          }),
        )
      }
    }
    if (step.name === "verify_rendered_relations") {
      await assert.rejects(stat(path.join(env.PUBLIC_ROOT, ".html")))
    }
    const result = {
      name: step.name,
      status: step.name === failAt ? "failed" : "success",
      durationMs: 1,
      exitCode: step.name === failAt ? 1 : 0,
    }
    if (afterStep) await afterStep(step)
    return result
  }
}

test("build runner defaults to a full checked build of public/", () => {
  assert.deepEqual(parseArguments([]), {
    mode: "full",
    output: "public",
    json: false,
    help: false,
    lockHeld: false,
  })
})

test("build runner accepts auto mode, an explicit output, and JSON reporting", () => {
  assert.deepEqual(parseArguments(["--mode=auto", "--output", ".cache/staging", "--json"]), {
    mode: "auto",
    output: ".cache/staging",
    json: true,
    help: false,
    lockHeld: false,
  })
})

test("build runner rejects unknown modes, missing values, and unknown flags", () => {
  assert.throws(() => parseArguments(["--mode", "fast"]), /expected auto or full/)
  assert.throws(() => parseArguments(["--output"]), /requires a directory/)
  assert.throws(() => parseArguments(["--skip-tests"]), /Unknown site build argument/)
})

test("build runner is rooted at the public repository", async () => {
  await stat(path.join(repositoryRoot, "package.json"))
  await stat(path.join(repositoryRoot, "quartz"))
})

test("a broken optional input symlink is reported without preventing a site build", async (t) => {
  const { root } = await makeFixture(t)
  await symlink("../missing", path.join(root, "content", "missing"), "dir")
  const calls = []

  const built = await buildSite(
    { mode: "full", output: "public", json: true, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor(calls),
  )

  assert.equal(built.status, "success")
  assert.equal(built.result, "rebuilt")
  assert.deepEqual(built.brokenInputSymlinks, [{ path: "content/missing", target: "../missing" }])
  assert.equal(
    calls.some((call) => call.name === "quartz-build"),
    true,
  )
  assert.equal(JSON.parse(await readFile(built.reportPath, "utf8")).status, "success")
})

test("full build checks a staging tree and a warm auto run is a verified no-op", async (t) => {
  const { root, output } = await makeFixture(t)
  const firstCalls = []
  const full = await buildSite(
    { mode: "full", output: "public", json: true, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor(firstCalls),
  )
  assert.equal(full.status, "success")
  assert.equal(
    await readFile(path.join(output, "index.html"), "utf8"),
    `${full.inputFingerprint}\n`,
  )
  assert.equal(
    firstCalls
      .find((call) => call.name === "verify_public_assets")
      .env.PUBLIC_ROOT.includes("staging-"),
    true,
  )
  assert.equal(
    firstCalls.find((call) => call.name === "public-build-audit").args.includes(output),
    false,
  )
  assert.equal(
    full.stages.some((stage) => stage.name === "sanitize-root-redirect"),
    true,
  )

  const autoCalls = []
  const warm = await buildSite(
    { mode: "auto", output: "public", json: true, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor(autoCalls),
  )
  assert.equal(warm.status, "success")
  assert.equal(warm.result, "no-op")
  assert.equal(
    warm.stages.find((stage) => stage.name === "output-integrity").verificationMode,
    "metadata-cache",
  )
  assert.equal(warm.stages.find((stage) => stage.name === "input-consistency").status, "success")
  assert.equal(autoCalls.length, 0)
})

test("auto selects incremental mode for 50 new Markdown files and 20 edits", async (t) => {
  const { root, output } = await makeFixture(t)
  const graphNodesPath = path.join(root, "quartz", "static", "graph-data", "nodes", "00.json")
  await mkdir(path.dirname(graphNodesPath), { recursive: true })
  await writeFile(graphNodesPath, '{"nodes":[] }\n')
  for (let index = 0; index < 20; index++) {
    await writeFile(path.join(root, "content", `note-${index}.md`), `Initial ${index}\n`)
  }
  const baselineCalls = []
  const baseline = await buildSite(
    { mode: "full", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor(baselineCalls),
  )
  assert.equal(baseline.status, "success")

  for (let index = 0; index < 50; index++) {
    await writeFile(
      path.join(root, "content", `new-${index}.md`),
      `# Synthetic object ${index}\n\n## Teiginiai\n\n- t-${String(900000 + index)}\n  teiginys: "Synthetic QA claim on a newly added object ${index}."\n`,
    )
  }
  for (let index = 0; index < 20; index++) {
    await writeFile(
      path.join(root, "content", `note-${index}.md`),
      `Initial ${index}\n\n## Teiginiai\n\n- t-${String(910000 + index)}\n  teiginys: "Synthetic QA claim added to existing object ${index}."\n`,
    )
  }
  await writeFile(graphNodesPath, '{"nodes":["synthetic-change"]}\n')

  const calls = []
  const incremental = await buildSite(
    { mode: "auto", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor(calls),
  )
  assert.equal(incremental.status, "success")
  assert.ok(
    incremental.incrementalPlan,
    JSON.stringify({ reasons: incremental.fallbackReasons, stages: incremental.stages }),
  )
  assert.deepEqual(incremental.incrementalPlan, {
    inputChanges: 71,
    otherSafeInputChanges: 0,
    added: 50,
    changed: 21,
    seed: incremental.incrementalPlan.seed,
  })
  assert.match(incremental.incrementalPlan.seed, /^(copy-on-write|hardlinks)$/)
  const incrementalCall = calls.find((call) => call.name === "quartz-incremental-build")
  assert.equal(incrementalCall.env.SITE_INCREMENTAL_BUILD, "1")
  const baselineCall = baselineCalls.find((call) => call.name === "quartz-build")
  assert.equal(incrementalCall.env.SITE_ASSET_VERSION, baselineCall.env.SITE_ASSET_VERSION)
  assert.notEqual(incrementalCall.env.SITE_DATA_VERSION, baselineCall.env.SITE_DATA_VERSION)
  const plan = JSON.parse(await readFile(incrementalCall.env.SITE_INCREMENTAL_PLAN_PATH, "utf8"))
  assert.ok(
    plan.changes.some(
      (change) =>
        change.path === "quartz/static/graph-data/nodes/00.json" && change.type === "change",
    ),
  )
  assert.equal(
    await readFile(path.join(output, "index.html"), "utf8"),
    `${incremental.inputFingerprint}\n`,
  )
})

test("auto rehashes changed metadata once, then uses the verified metadata cache", async (t) => {
  const { root, output } = await makeFixture(t)
  await buildSite(
    { mode: "full", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor([]),
  )

  const outputPath = path.join(output, "index.html")
  const originalStats = await stat(outputPath)
  await utimes(outputPath, originalStats.atime, new Date(originalStats.mtime.getTime() + 2000))

  const fallbackCalls = []
  const fallback = await buildSite(
    { mode: "auto", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor(fallbackCalls),
  )
  assert.equal(fallback.status, "success")
  assert.equal(fallback.result, "no-op")
  assert.equal(
    fallback.stages.find((stage) => stage.name === "output-integrity").verificationMode,
    "content-hash-fallback",
  )
  assert.equal(fallbackCalls.length, 0)

  let contentHashCalls = 0
  const warm = await buildSite(
    { mode: "auto", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor([]),
    undefined,
    async () => {
      contentHashCalls += 1
      throw new Error("The metadata fast path should not hash file contents.")
    },
  )
  assert.equal(warm.status, "success")
  assert.equal(warm.result, "no-op")
  assert.equal(
    warm.stages.find((stage) => stage.name === "output-integrity").verificationMode,
    "metadata-cache",
  )
  assert.equal(contentHashCalls, 0)
})

test("auto rebuilds when inputs change during the no-op verification", async (t) => {
  const { root, output } = await makeFixture(t)
  await buildSite(
    { mode: "full", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor([]),
  )
  let fingerprintCalls = 0
  const fingerprintInputs = async (fingerprintRoot, env) => {
    fingerprintCalls += 1
    if (fingerprintCalls === 2) {
      await writeFile(path.join(root, "content", "index.md"), "# Changed during no-op check\n")
    }
    return collectInputFingerprints(fingerprintRoot, env)
  }
  const calls = []
  const rebuilt = await buildSite(
    { mode: "auto", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor(calls),
    fingerprintInputs,
  )

  assert.equal(rebuilt.status, "success")
  assert.equal(rebuilt.result, "rebuilt")
  assert.equal(rebuilt.stages.find((stage) => stage.name === "input-consistency").status, "changed")
  assert.equal(
    calls.some((call) => ["quartz-build", "quartz-incremental-build"].includes(call.name)),
    true,
  )
  assert.equal(
    (await readFile(path.join(output, "index.html"), "utf8")).trim(),
    rebuilt.inputFingerprint,
  )
})

test("auto rebuild reuses unchanged test checks for a style-only change", async (t) => {
  const { root, output } = await makeFixture(t)
  await buildSite(
    { mode: "full", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor([]),
  )
  await writeFile(path.join(root, "quartz", "test.scss"), ".site { color: blue; }\n")
  const calls = []
  const rebuilt = await buildSite(
    { mode: "auto", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor(calls),
  )
  assert.equal(rebuilt.status, "success")
  assert.equal(rebuilt.result, "rebuilt")
  assert.equal(
    calls.some((call) => call.name === "unit-tests"),
    false,
  )
  assert.equal(
    calls.some((call) => call.name === "typescript"),
    false,
  )
  assert.equal(
    calls.some((call) => call.name === "quartz-build"),
    true,
  )
  assert.equal(
    (await readFile(path.join(output, "index.html"), "utf8")).trim(),
    rebuilt.inputFingerprint,
  )
})

test("a missing public output is rebuilt instead of reported as a no-op", async (t) => {
  const { root, output } = await makeFixture(t)
  await buildSite(
    { mode: "full", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor([]),
  )
  await rm(output, { recursive: true, force: true })
  const calls = []
  const rebuilt = await buildSite(
    { mode: "auto", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor(calls),
  )

  assert.equal(rebuilt.status, "success")
  assert.equal(rebuilt.result, "rebuilt")
  assert.equal(rebuilt.stages.find((stage) => stage.name === "output-integrity").status, "changed")
  assert.equal(
    calls.some((call) => call.name === "quartz-build"),
    true,
  )
  assert.equal(
    await readFile(path.join(output, "index.html"), "utf8"),
    `${rebuilt.inputFingerprint}\n`,
  )
})

test("corrupt output bytes with unchanged size and mtime trigger a rebuild", async (t) => {
  const { root, output } = await makeFixture(t)
  await buildSite(
    { mode: "full", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor([]),
  )
  const outputPath = path.join(output, "index.html")
  const originalStats = await stat(outputPath)
  const originalContent = await readFile(outputPath, "utf8")
  await writeFile(outputPath, "x".repeat(Buffer.byteLength(originalContent)))
  await utimes(outputPath, originalStats.atime, originalStats.mtime)
  const calls = []
  const rebuilt = await buildSite(
    { mode: "auto", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor(calls),
  )

  assert.equal(rebuilt.status, "success")
  assert.equal(rebuilt.result, "rebuilt")
  assert.equal(rebuilt.stages.find((stage) => stage.name === "output-integrity").status, "changed")
  assert.equal(
    calls.some((call) => call.name === "quartz-build"),
    true,
  )
  assert.equal(await readFile(outputPath, "utf8"), `${rebuilt.inputFingerprint}\n`)
})

test("an unknown build-state schema runs a full safe rebuild", async (t) => {
  const { root, output } = await makeFixture(t)
  const full = await buildSite(
    { mode: "full", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor([]),
  )
  await writeFile(path.join(path.dirname(full.reportPath), "state.json"), '{"schemaVersion":999}\n')
  const calls = []
  const rebuilt = await buildSite(
    { mode: "auto", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor(calls),
  )

  assert.equal(rebuilt.status, "success")
  assert.equal(rebuilt.result, "rebuilt")
  assert.ok(rebuilt.fallbackReasons.some((reason) => reason.includes("unknown version")))
  assert.equal(
    calls.some((call) => call.name === "unit-tests"),
    true,
  )
  assert.equal(
    calls.some((call) => call.name === "typescript"),
    true,
  )
  assert.equal(
    calls.some((call) => call.name === "quartz-build"),
    true,
  )
  assert.equal(
    await readFile(path.join(output, "index.html"), "utf8"),
    `${rebuilt.inputFingerprint}\n`,
  )
})

test("a failed staging audit leaves the last good output in place", async (t) => {
  const { root, output } = await makeFixture(t)
  await buildSite(
    { mode: "full", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor([]),
  )
  const previous = await readFile(path.join(output, "index.html"), "utf8")
  await writeFile(path.join(root, "content", "index.md"), "# Updated test page\n")
  const failed = await buildSite(
    { mode: "full", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor([], { failAt: "public-build-audit" }),
  )
  assert.equal(failed.status, "failed")
  assert.equal(failed.result, "failed")
  assert.equal(await readFile(path.join(output, "index.html"), "utf8"), previous)
})

for (const failedStage of ["verify_db_export_manifest", "quartz-build"]) {
  test(`a failed ${failedStage} stage preserves the last good output`, async (t) => {
    const { root, output } = await makeFixture(t)
    await buildSite(
      { mode: "full", output: "public", json: false, lockHeld: false },
      root,
      { PATH: process.env.PATH },
      fixtureExecutor([]),
    )
    const previous = await readFile(path.join(output, "index.html"), "utf8")
    await writeFile(path.join(root, "content", "index.md"), "# Requires a fresh site build\n")
    const failed = await buildSite(
      { mode: "full", output: "public", json: false, lockHeld: false },
      root,
      { PATH: process.env.PATH },
      fixtureExecutor([], { failAt: failedStage }),
    )

    assert.equal(failed.status, "failed")
    assert.equal(failed.stages.find((stage) => stage.name === failedStage).status, "failed")
    assert.equal(await readFile(path.join(output, "index.html"), "utf8"), previous)
  })
}

test("inputs changed during a build discard staging and preserve the last good output", async (t) => {
  const { root, output } = await makeFixture(t)
  await buildSite(
    { mode: "full", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor([]),
  )
  const previous = await readFile(path.join(output, "index.html"), "utf8")
  const changed = await buildSite(
    { mode: "full", output: "public", json: false, lockHeld: false },
    root,
    { PATH: process.env.PATH },
    fixtureExecutor([], {
      afterStep: async (step) => {
        if (step.name === "quartz-build") {
          await writeFile(path.join(root, "content", "index.md"), "# Changed during build\n")
        }
      },
    }),
  )

  assert.equal(changed.status, "failed")
  assert.equal(changed.result, "failed")
  assert.equal(changed.stages.find((stage) => stage.name === "input-consistency").status, "failed")
  assert.deepEqual(
    changed.stages.find((stage) => stage.name === "input-consistency").changedInputs,
    ["content/index.md"],
  )
  assert.equal(await readFile(path.join(output, "index.html"), "utf8"), previous)
})

test("an interrupted output swap restores the last good public tree", async (t) => {
  const { root, output } = await makeFixture(t)
  const targetCache = path.join(root, ".cache", "site-regenerate", "targets", "test")
  const backup = path.join(root, ".public.site-regenerate-backup-crash")
  const staging = path.join(root, ".public.site-regenerate-staging-crash")
  await mkdir(targetCache, { recursive: true })
  await mkdir(backup, { recursive: true })
  await mkdir(staging, { recursive: true })
  await writeFile(path.join(backup, "index.html"), "last-good\n")
  await writeFile(path.join(staging, "index.html"), "uncommitted-new\n")
  await writeFile(
    path.join(targetCache, "swap-journal.json"),
    `${JSON.stringify({
      schemaVersion: 1,
      outputRoot: output,
      stagingPath: staging,
      backupPath: backup,
      previousOutputExisted: true,
      inputFingerprint: "pending-input",
      outputFingerprint: "pending-output",
      phase: "old-output-moved",
    })}\n`,
  )

  const statePath = path.join(targetCache, "state.json")
  await recoverInterruptedSwap({ outputRoot: output, targetCache, statePath })

  assert.equal(await readFile(path.join(output, "index.html"), "utf8"), "last-good\n")
  await assert.rejects(stat(staging))
  await assert.rejects(stat(backup))
  await assert.rejects(stat(path.join(targetCache, "swap-journal.json")))
})
