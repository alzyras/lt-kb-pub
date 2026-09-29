#!/usr/bin/env node
import { execFile, spawn } from "node:child_process"
import { lstat, mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { performance } from "node:perf_hooks"
import { createHash, randomUUID } from "node:crypto"
import { promisify } from "node:util"

import { withSiteLock } from "./lock.mjs"
import {
  collectInputFingerprints,
  contentFingerprint,
  fingerprintTree,
  fingerprintTreeMetadata,
  fingerprintRecords,
  STATE_SCHEMA_VERSION,
} from "./state.mjs"

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
export const repositoryRoot = path.dirname(path.dirname(scriptDirectory))
const reportSchemaVersion = 1
const execFileAsync = promisify(execFile)

export function parseArguments(argv) {
  const options = { mode: "auto", output: "public", json: false, help: false, lockHeld: false }
  let modeArgument
  let fullRequested = false
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === "--help" || argument === "-h") {
      options.help = true
    } else if (argument === "--json") {
      options.json = true
    } else if (argument === "--full") {
      fullRequested = true
    } else if (argument === "--lock-held") {
      options.lockHeld = true
    } else if (argument === "--mode") {
      const requestedMode = argv[++index]
      if (requestedMode === undefined) throw new Error("--mode requires auto or full")
      modeArgument = requestedMode
    } else if (argument.startsWith("--mode=")) {
      modeArgument = argument.slice("--mode=".length)
    } else if (argument === "--output") {
      options.output = argv[++index]
    } else if (argument.startsWith("--output=")) {
      options.output = argument.slice("--output=".length)
    } else {
      throw new Error(`Unknown site build argument: ${argument}`)
    }
  }
  if (fullRequested && modeArgument === "auto") {
    throw new Error("Conflicting build modes: --full cannot be combined with --mode auto")
  }
  options.mode = fullRequested ? "full" : (modeArgument ?? "auto")
  if (!["auto", "full"].includes(options.mode)) {
    throw new Error(`Invalid --mode ${String(options.mode)}; expected auto or full`)
  }
  if (!options.output) throw new Error("--output requires a directory")
  return options
}

async function runStep(step, { root, env, json }) {
  const started = performance.now()
  const child = spawn(step.command, step.args, {
    cwd: root,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  })
  const stdout = json ? process.stderr : process.stdout
  child.stdout.pipe(stdout)
  child.stderr.pipe(process.stderr)
  const exitCode = await new Promise((resolve, reject) => {
    child.once("error", reject)
    child.once("close", (code, signal) => {
      if (code !== null) resolve(code)
      else reject(new Error(`${step.name} terminated by ${signal ?? "unknown signal"}`))
    })
  })
  return {
    name: step.name,
    status: exitCode === 0 ? "success" : "failed",
    durationMs: Math.round(performance.now() - started),
    exitCode,
  }
}

async function writeJsonAtomic(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true })
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`
  try {
    await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8")
    await rename(temporaryPath, filePath)
  } finally {
    await rm(temporaryPath, { force: true })
  }
}

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"))
  } catch {
    return undefined
  }
}

async function exists(filePath) {
  try {
    await stat(filePath)
    return true
  } catch (error) {
    if (error?.code === "ENOENT") return false
    throw error
  }
}

export async function recoverInterruptedSwap({ outputRoot, targetCache, statePath }) {
  const journalPath = path.join(targetCache, "swap-journal.json")
  const journal = await readJson(journalPath)
  if (!journal) {
    if (await exists(journalPath)) {
      throw new Error(`Interrupted output swap journal is unreadable: ${journalPath}`)
    }
    return ""
  }
  const outputParent = path.dirname(outputRoot)
  const prefix = `.${path.basename(outputRoot)}.site-regenerate-`
  for (const candidate of [journal.stagingPath, journal.backupPath]) {
    if (
      typeof candidate !== "string" ||
      path.dirname(path.resolve(candidate)) !== outputParent ||
      !path.basename(candidate).startsWith(prefix)
    ) {
      throw new Error(`Interrupted output swap journal contains an unsafe path: ${journalPath}`)
    }
  }
  if (path.resolve(journal.outputRoot) !== outputRoot) {
    throw new Error(`Interrupted output swap journal targets another output root: ${journalPath}`)
  }

  const previousState = await readJson(statePath)
  const outputTree = await fingerprintTree(outputRoot)
  const newOutputCommitted =
    previousState?.schemaVersion === STATE_SCHEMA_VERSION &&
    previousState.inputFingerprint === journal.inputFingerprint &&
    previousState.outputFingerprint === journal.outputFingerprint &&
    outputTree?.fingerprint === journal.outputFingerprint
  if (newOutputCommitted) {
    await rm(journal.backupPath, { recursive: true, force: true })
    await rm(journal.stagingPath, { recursive: true, force: true })
    await rm(journalPath, { force: true })
    return "completed the previously validated output swap"
  }

  const backupExists = await exists(journal.backupPath)
  if (backupExists) {
    await rm(outputRoot, { recursive: true, force: true })
    await rename(journal.backupPath, outputRoot)
  } else if (!journal.previousOutputExisted && (await exists(outputRoot))) {
    await rm(outputRoot, { recursive: true, force: true })
  } else if (journal.previousOutputExisted && !(await exists(outputRoot))) {
    throw new Error(
      `Cannot recover last good output; both output and backup are missing for ${outputRoot}`,
    )
  }
  await rm(journal.stagingPath, { recursive: true, force: true })
  await rm(journalPath, { force: true })
  return "restored the previous output after an interrupted swap"
}

async function cleanupOrphanedArtifacts(outputRoot) {
  const parent = path.dirname(outputRoot)
  const prefix = `.${path.basename(outputRoot)}.site-regenerate-`
  const entries = await readdir(parent, { withFileTypes: true })
  for (const entry of entries) {
    if (
      !entry.name.startsWith(prefix) ||
      (!entry.name.includes("-staging-") && !entry.name.includes("-backup-"))
    ) {
      continue
    }
    await rm(path.join(parent, entry.name), { recursive: true, force: true })
  }
}

function toolPaths(root) {
  return {
    tsx: path.join(root, "node_modules", "tsx", "dist", "cli.mjs"),
    tsc: path.join(root, "node_modules", "typescript", "bin", "tsc"),
  }
}

function makeChecks(root, outputRoot, env, reportDirectory, evidenceAuditScope) {
  const { tsx, tsc } = toolPaths(root)
  const scripts = (names) =>
    names.map((name) => ({ name, command: process.execPath, args: [tsx, `scripts/${name}.ts`] }))
  const evidenceAudit = scripts(["audit_evidence_matches"])[0]
  if (evidenceAuditScope) {
    evidenceAudit.scope = {
      mode:
        evidenceAuditScope.files.length > 0 ? "changed-object-files" : "reused-previous-success",
      fileCount: evidenceAuditScope.files.length,
    }
    if (evidenceAuditScope.files.length > 0) {
      evidenceAudit.env = {
        ...env,
        EVIDENCE_AUDIT_FILES: JSON.stringify(evidenceAuditScope.files),
      }
    } else {
      evidenceAudit.skipReason =
        "No object Markdown source changed; the previous successful source audit remains valid."
    }
  }
  const prebuild = [
    ...scripts(["verify_db_export_manifest"]),
    evidenceAudit,
    { name: "unit-tests", command: "npm", args: ["test"] },
    { name: "typescript", command: process.execPath, args: [tsc, "--noEmit"] },
    ...scripts(["verify_relations_integrity"]),
  ]
  const publicEnv = { ...env, PUBLIC_ROOT: outputRoot }
  const postbuild = scripts([
    "verify_graph_explorer",
    "verify_rendered_relations",
    "verify_corpus_integrity",
    "verify_public_assets",
    "verify_rendered_media_seo",
    "verify_rendered_articles_seo",
    "verify_build_integrity",
    "verify_rendered_evidence",
  ]).map((step) => ({ ...step, env: publicEnv }))
  const scopedAuditEnv =
    evidenceAuditScope?.files.length > 0
      ? { ...env, EVIDENCE_AUDIT_FILES: JSON.stringify(evidenceAuditScope.files) }
      : undefined
  const sourceAudits = [
    ["kupiskio-partizanai", "Kupiškio krašto partizanai"],
    ["lituanistika-kupiskis", "Lituanistika-65087-kupiskis-naujausi-moksliniai-lokaliniai-tyrimai"],
  ].map(([name, sourceId]) => ({
    name: `audit_evidence_matches-${name}`,
    command: process.execPath,
    args: [tsx, "scripts/audit_evidence_matches.ts", "--source-id", sourceId, "--fail"],
    ...(scopedAuditEnv ? { env: scopedAuditEnv } : {}),
    ...(evidenceAuditScope && evidenceAuditScope.files.length === 0
      ? {
          skipReason:
            "No object Markdown source changed; the previous successful source audit remains valid.",
        }
      : {}),
  }))
  postbuild.push(...sourceAudits)
  postbuild.push({
    name: "public-build-audit",
    command: env.PYTHON ?? "python3",
    args: [
      "scripts/audit_public_build.py",
      "--public",
      outputRoot,
      "--content",
      root,
      "--fail",
      "--status-json",
      path.join(reportDirectory, "public-build-audit.json"),
    ],
    env: publicEnv,
  })
  return { prebuild, postbuild }
}

async function executeStage(step, { root, env, json, executor, report }) {
  const started = performance.now()
  try {
    const result = await executor(step, { root, env: step.env ?? env, json })
    const recordedResult = step.scope ? { ...result, scope: step.scope } : result
    report.stages.push(recordedResult)
    return recordedResult
  } catch (error) {
    const result = {
      name: step.name,
      status: "failed",
      durationMs: Math.round(performance.now() - started),
      error: error instanceof Error ? error.message : String(error),
      exitCode: 1,
      ...(step.scope ? { scope: step.scope } : {}),
    }
    report.stages.push(result)
    report.status = "failed"
    report.error = `${step.name} failed: ${result.error}`
    return result
  }
}

function skippedStage(name, reason, durationMs = 0) {
  return { name, status: "skipped", reason, durationMs }
}

function changedInputPaths(previous, current) {
  const previousInputs = new Map(
    (previous.inputDescriptor?.inputs ?? []).map((input) => [input.path, JSON.stringify(input)]),
  )
  const currentInputs = new Map(
    (current.inputDescriptor?.inputs ?? []).map((input) => [input.path, JSON.stringify(input)]),
  )
  const changed = [...new Set([...previousInputs.keys(), ...currentInputs.keys()])]
    .filter((inputPath) => previousInputs.get(inputPath) !== currentInputs.get(inputPath))
    .sort()
  const descriptorChanged =
    JSON.stringify(previous.inputDescriptor?.git) !==
      JSON.stringify(current.inputDescriptor?.git) ||
    JSON.stringify(previous.inputDescriptor?.runtime) !==
      JSON.stringify(current.inputDescriptor?.runtime) ||
    JSON.stringify(previous.inputDescriptor?.environment) !==
      JSON.stringify(current.inputDescriptor?.environment)
  if (descriptorChanged && changed.length === 0)
    changed.push("build environment, runtime, or git state")
  return changed
}

function reusableEvidenceAuditScope({
  root,
  env,
  mode,
  priorState,
  stateValid,
  canReuseCodeChecks,
  changedFiles,
}) {
  if (
    mode !== "auto" ||
    !stateValid ||
    priorState?.allChecksPassed !== true ||
    !canReuseCodeChecks
  ) {
    return undefined
  }

  const objectRoot = path.resolve(env.CORPUS_ROOT ?? path.join(root, "objektai"))
  const expectedObjectRoot = path.resolve(root, "objektai")
  if (objectRoot !== expectedObjectRoot) return undefined

  const objectPrefix = "content/objektai/"
  const files = []
  for (const change of changedFiles) {
    if (change.path === "content/objektai") return undefined
    if (!change.path.startsWith(objectPrefix)) continue
    const relativePath = change.path.slice(objectPrefix.length)
    if (!relativePath || (change.type !== "delete" && !/\.md$/i.test(relativePath))) {
      return undefined
    }
    if (change.type !== "delete") {
      files.push(path.resolve(objectRoot, ...relativePath.split("/")))
    }
  }
  return { files: [...new Set(files)].sort() }
}

function changedInputRecords(previous, current) {
  const previousInputs = new Map(
    (previous?.inputDescriptor?.inputs ?? []).map((input) => [input.path, input]),
  )
  const currentInputs = new Map(
    (current?.inputDescriptor?.inputs ?? []).map((input) => [input.path, input]),
  )
  const changes = []
  for (const inputPath of [
    ...new Set([...previousInputs.keys(), ...currentInputs.keys()]),
  ].sort()) {
    const oldInput = previousInputs.get(inputPath)
    const newInput = currentInputs.get(inputPath)
    if (JSON.stringify(oldInput) === JSON.stringify(newInput)) continue
    changes.push({
      path: inputPath,
      type: !oldInput ? "add" : !newInput ? "delete" : "change",
      previousHash: oldInput?.sha256,
      currentHash: newInput?.sha256,
    })
  }
  return changes
}

function incrementalRebuildBlocker(previous, current, changedFiles, outputVerified) {
  if (!outputVerified) return "the existing output did not pass metadata verification"
  if (!Array.isArray(previous?.outputRecords)) return "the previous output file manifest is missing"
  if (!previous?.contentMetadataPath || !previous?.contentMetadataFingerprint)
    return "the previous Quartz content metadata is missing"
  if (previous.parserFingerprint !== current.parserFingerprint)
    return "the Markdown parser fingerprint changed"
  if (
    JSON.stringify(previous.inputDescriptor?.runtime) !==
    JSON.stringify(current.inputDescriptor?.runtime)
  )
    return "the build runtime changed"
  if (
    JSON.stringify(previous.inputDescriptor?.environment) !==
    JSON.stringify(current.inputDescriptor?.environment)
  )
    return "the build environment changed"
  if (changedFiles.length === 0) return "no individual Markdown input changes were found"
  const unsupported = changedFiles.find(
    (change) =>
      (!/^content\/.+\.md$/i.test(change.path) &&
        !/^quartz\/static\/graph-data\/.+$/i.test(change.path) &&
        !(change.path === "public-projection-manifest.json" && change.type === "change")) ||
      (change.type === "delete" && !/^quartz\/static\/graph-data\/.+$/i.test(change.path)),
  )
  if (unsupported) return `${unsupported.type} input ${unsupported.path} needs a full build`
  return undefined
}

async function seedStagingFromPreviousOutput(source, destination) {
  await mkdir(destination, { recursive: true })
  const probePath = path.join(destination, `.site-regenerate-clone-probe-${randomUUID()}`)
  let copyOnWriteAvailable = false
  try {
    await execFileAsync("cp", ["-c", path.join(source, "index.html"), probePath])
    copyOnWriteAvailable = true
  } catch {
    // `cp -c` is available on APFS. Other filesystems use the hardlink path.
  } finally {
    await rm(probePath, { force: true })
  }

  if (copyOnWriteAvailable) {
    try {
      await execFileAsync("cp", ["-cR", `${source}${path.sep}.`, destination])
      return "copy-on-write"
    } catch {
      await rm(destination, { recursive: true, force: true })
      await mkdir(destination, { recursive: true })
    }
  }

  await execFileAsync("cp", ["-al", `${source}${path.sep}.`, destination])
  return "hardlinks"
}

async function fingerprintIncrementalOutput(outputRoot, previousRecords, emittedManifest) {
  if (!Array.isArray(previousRecords) || !emittedManifest) {
    throw new Error("Incremental output validation needs the last file manifest and emitted paths.")
  }
  const records = new Map(previousRecords.map((record) => [record.path, record]))
  for (const absolutePath of emittedManifest.deleted ?? []) {
    const relativePath = path
      .relative(outputRoot, path.resolve(absolutePath))
      .split(path.sep)
      .join("/")
    if (relativePath.startsWith("../") || path.isAbsolute(relativePath)) {
      throw new Error(`Incremental output deletion escaped the site root: ${absolutePath}`)
    }
    records.delete(relativePath)
  }
  for (const absolutePath of emittedManifest.written ?? []) {
    const resolvedPath = path.resolve(absolutePath)
    const relativePath = path.relative(outputRoot, resolvedPath).split(path.sep).join("/")
    if (relativePath.startsWith("../") || path.isAbsolute(relativePath)) {
      throw new Error(`Incremental output write escaped the site root: ${absolutePath}`)
    }
    const info = await lstat(resolvedPath)
    if (!info.isFile()) throw new Error(`Expected a generated file at ${resolvedPath}`)
    const bytes = await readFile(resolvedPath)
    records.set(relativePath, {
      path: relativePath,
      type: "file",
      size: bytes.byteLength,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    })
  }

  const outputMetadata = await fingerprintTreeMetadata(outputRoot)
  if (!outputMetadata?.supported) {
    throw new Error("This filesystem cannot safely verify the incrementally reused output tree.")
  }
  const sortedRecords = [...records.values()].sort((left, right) =>
    left.path < right.path ? -1 : left.path > right.path ? 1 : 0,
  )
  const expectedPaths = sortedRecords.map((record) => record.path)
  if (
    expectedPaths.length !== outputMetadata.paths.length ||
    expectedPaths.some((outputPath, index) => outputPath !== outputMetadata.paths[index])
  ) {
    throw new Error("Incremental emitter paths do not match the files present in staging.")
  }
  return {
    fingerprint: fingerprintRecords(sortedRecords),
    metadataFingerprint: outputMetadata.fingerprint,
    metadataSupported: outputMetadata.supported,
    fileCount: sortedRecords.length,
    records: sortedRecords,
  }
}

async function runBuild(
  options,
  root = repositoryRoot,
  env = process.env,
  executor = runStep,
  fingerprintInputs = collectInputFingerprints,
  fingerprintOutput = fingerprintTree,
) {
  const started = performance.now()
  const outputRoot = path.resolve(root, options.output)
  const targetCache = path.join(
    root,
    ".cache",
    "site-regenerate",
    "targets",
    contentFingerprint(outputRoot).slice(0, 24),
  )
  const statePath = path.join(targetCache, "state.json")
  const reportPath = path.join(targetCache, "latest-build.json")
  const report = {
    schemaVersion: reportSchemaVersion,
    mode: options.mode,
    status: "running",
    result: "rebuilt",
    outputRoot,
    stages: [],
    fallbackReasons: [],
  }

  try {
    const outputInfo = await lstat(outputRoot)
    if (outputInfo.isSymbolicLink() || !outputInfo.isDirectory()) {
      throw new Error(`Build output must be a real directory (or absent): ${outputRoot}`)
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error
  }

  await mkdir(targetCache, { recursive: true })
  const recovered = await recoverInterruptedSwap({ outputRoot, targetCache, statePath })
  if (recovered) report.recovery = recovered
  await mkdir(path.dirname(outputRoot), { recursive: true })
  await cleanupOrphanedArtifacts(outputRoot)

  const fingerprintStarted = performance.now()
  let fingerprints
  try {
    fingerprints = await fingerprintInputs(root, env)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    report.stages.push({
      name: "input-fingerprint",
      status: "failed",
      durationMs: Math.round(performance.now() - fingerprintStarted),
      error: message,
      exitCode: 1,
    })
    report.status = "failed"
    report.result = "failed"
    report.error = `input-fingerprint failed: ${message}`
    report.totalDurationMs = Math.round(performance.now() - started)
    report.finishedAt = new Date().toISOString()
    report.reportPath = reportPath
    await writeJsonAtomic(reportPath, report)
    return report
  }
  report.stages.push({
    name: "input-fingerprint",
    status: "success",
    durationMs: Math.round(performance.now() - fingerprintStarted),
    inputCount: fingerprints.inputCount,
  })
  report.inputFingerprint = fingerprints.inputFingerprint
  report.brokenInputSymlinks = fingerprints.brokenSymlinks

  const priorState = await readJson(statePath)
  const stateValid = priorState?.schemaVersion === STATE_SCHEMA_VERSION
  let previousOutputVerified = false
  if (options.mode === "auto" && !stateValid) {
    report.fallbackReasons.push("A successful build cache is missing or has an unknown version.")
  }

  if (
    options.mode === "auto" &&
    stateValid &&
    priorState.inputFingerprint === fingerprints.inputFingerprint
  ) {
    const outputStarted = performance.now()
    const outputMetadata = await fingerprintTreeMetadata(outputRoot)
    let outputTree
    let outputMatches = Boolean(
      outputMetadata?.supported &&
      priorState.outputMetadataFingerprint &&
      outputMetadata.fingerprint === priorState.outputMetadataFingerprint,
    )
    let verificationMode = outputMatches ? "metadata-cache" : "content-hash-fallback"
    if (!outputMatches) {
      outputTree = await fingerprintOutput(outputRoot)
      outputMatches = Boolean(outputTree && outputTree.fingerprint === priorState.outputFingerprint)
      if (outputMatches) {
        const refreshedState = { ...priorState }
        if (outputTree.metadataSupported) {
          refreshedState.outputMetadataFingerprint = outputTree.metadataFingerprint
        } else {
          delete refreshedState.outputMetadataFingerprint
        }
        await writeJsonAtomic(statePath, refreshedState)
      }
      if (!outputMetadata?.supported) verificationMode = "content-hash-only"
    }
    report.stages.push({
      name: "output-integrity",
      status: outputMatches ? "success" : "changed",
      durationMs: Math.round(performance.now() - outputStarted),
      fileCount: outputTree?.fileCount ?? outputMetadata?.fileCount ?? 0,
      verificationMode,
      reason: outputMatches
        ? verificationMode === "metadata-cache"
          ? "File identities, sizes, and timestamps match the last fully hashed output."
          : "Metadata changed, so all output bytes were hashed and still match the last successful build."
        : "The output is missing or its bytes differ from the last successful build.",
    })
    previousOutputVerified = outputMatches
    if (outputMatches) {
      const consistencyStarted = performance.now()
      const latestFingerprints = await fingerprintInputs(root, env)
      const changedInputs = changedInputPaths(fingerprints, latestFingerprints)
      const inputsUnchanged = latestFingerprints.inputFingerprint === fingerprints.inputFingerprint
      report.stages.push({
        name: "input-consistency",
        status: inputsUnchanged ? "success" : "changed",
        durationMs: Math.round(performance.now() - consistencyStarted),
        changedInputs,
        reason: inputsUnchanged
          ? undefined
          : "Inputs changed during the no-op check; the site will be rebuilt from the latest fingerprint.",
      })
      if (inputsUnchanged) {
        report.status = "success"
        report.result = "no-op"
        report.outputFingerprint = priorState.outputFingerprint
        report.stages.push(
          skippedStage(
            "site-checks",
            "Input fingerprint and verified output match the last successful run.",
          ),
        )
        report.stages.push(skippedStage("quartz-build", "No input or output changes."))
        report.stages.push(skippedStage("postbuild-audits", "No input or output changes."))
        report.totalDurationMs = Math.round(performance.now() - started)
        report.finishedAt = new Date().toISOString()
        report.reportPath = reportPath
        await writeJsonAtomic(reportPath, report)
        return report
      }
      fingerprints = latestFingerprints
      report.inputFingerprint = latestFingerprints.inputFingerprint
      report.brokenInputSymlinks = latestFingerprints.brokenSymlinks
      report.fallbackReasons.push(
        "Inputs changed during the no-op check, so the site is rebuilt from the latest fingerprint.",
      )
    }
    if (!outputMatches) {
      report.fallbackReasons.push(
        "The output is missing or its bytes differ from the last verified build.",
      )
    }
  } else if (options.mode === "auto" && stateValid) {
    const outputStarted = performance.now()
    const outputMetadata = await fingerprintTreeMetadata(outputRoot)
    previousOutputVerified = Boolean(
      outputMetadata?.supported &&
      priorState.outputMetadataFingerprint &&
      outputMetadata.fingerprint === priorState.outputMetadataFingerprint,
    )
    report.stages.push({
      name: "output-integrity",
      status: previousOutputVerified ? "success" : "changed",
      durationMs: Math.round(performance.now() - outputStarted),
      fileCount: outputMetadata?.fileCount ?? 0,
      verificationMode: "metadata-cache",
      reason: previousOutputVerified
        ? "The last successful output matches its stored file metadata and can be reused safely."
        : "The last output changed or its metadata cache is unavailable; auto mode will use a full build.",
    })
    if (!previousOutputVerified) {
      report.fallbackReasons.push(
        "The existing output could not be verified for safe incremental reuse.",
      )
    }
  } else {
    report.stages.push(
      skippedStage(
        "output-integrity",
        "Output is checked after a build because there is no reusable auto-build state.",
      ),
    )
  }

  const runId = randomUUID()
  const outputParent = path.dirname(outputRoot)
  const outputName = path.basename(outputRoot)
  const stagingRoot = path.join(outputParent, `.${outputName}.site-regenerate-staging-${runId}`)
  const backupRoot = path.join(outputParent, `.${outputName}.site-regenerate-backup-${runId}`)
  const journalPath = path.join(targetCache, "swap-journal.json")
  const buildMetadataPath = path.join(targetCache, `build-metadata-${runId}.json`)
  const emittedFilesPath = path.join(targetCache, `emitted-files-${runId}.json`)
  const incrementalPlanPath = path.join(targetCache, `incremental-plan-${runId}.json`)
  const incrementalFallbackPath = path.join(targetCache, `incremental-fallback-${runId}.json`)
  const changedFiles = changedInputRecords(priorState, fingerprints)
  const canReuseCodeChecks =
    options.mode === "auto" &&
    stateValid &&
    priorState.codeFingerprint === fingerprints.codeFingerprint
  const evidenceAuditScope = reusableEvidenceAuditScope({
    root,
    env,
    mode: options.mode,
    priorState,
    stateValid,
    canReuseCodeChecks,
    changedFiles,
  })
  const incrementalBlocker = canReuseCodeChecks
    ? incrementalRebuildBlocker(priorState, fingerprints, changedFiles, previousOutputVerified)
    : "the build code changed since the previous successful run"
  let incrementalBuild = canReuseCodeChecks && !incrementalBlocker
  let incrementalBuildUsed = false
  if (incrementalBuild) {
    try {
      const previousMetadata = await readFile(priorState.contentMetadataPath)
      incrementalBuild =
        contentFingerprint(previousMetadata) === priorState.contentMetadataFingerprint
    } catch {
      incrementalBuild = false
    }
  }
  if (options.mode === "auto" && changedFiles.length > 0 && !incrementalBuild) {
    report.fallbackReasons.push(
      `Auto mode will use a full build because ${incrementalBlocker ?? "the saved metadata is unavailable"}.`,
    )
  }
  await mkdir(outputParent, { recursive: true })
  await rm(stagingRoot, { recursive: true, force: true })
  let stagingSeedMethod
  if (incrementalBuild) {
    stagingSeedMethod = await seedStagingFromPreviousOutput(outputRoot, stagingRoot)
    const plan = {
      schemaVersion: 1,
      previousMetadataPath: priorState.contentMetadataPath,
      changes: changedFiles
        .filter(
          (change) =>
            /^content\/.+\.md$/i.test(change.path) ||
            /^quartz\/static\/graph-data\/.+$/i.test(change.path),
        )
        .map(({ path: inputPath, type }) => ({ path: inputPath, type })),
    }
    await writeJsonAtomic(incrementalPlanPath, plan)
    await rm(incrementalFallbackPath, { force: true })
    report.incrementalPlan = {
      inputChanges: plan.changes.length,
      otherSafeInputChanges: changedFiles.length - plan.changes.length,
      added: plan.changes.filter((change) => change.type === "add").length,
      changed: plan.changes.filter((change) => change.type === "change").length,
      seed: stagingSeedMethod,
    }
  } else {
    await mkdir(stagingRoot, { recursive: true })
  }

  const quartzEnv = {
    ...env,
    SITE_ASSET_VERSION: fingerprints.assetFingerprint,
    SITE_DATA_VERSION: fingerprints.inputFingerprint,
    SITE_PARSE_CODE_FINGERPRINT: fingerprints.parserFingerprint,
    PUBLIC_ROOT: stagingRoot,
    SITE_BUILD_METADATA_PATH: buildMetadataPath,
    SITE_EMITTED_FILES_PATH: emittedFilesPath,
  }
  if (incrementalBuild) {
    quartzEnv.SITE_INCREMENTAL_BUILD = "1"
    quartzEnv.SITE_INCREMENTAL_PLAN_PATH = incrementalPlanPath
    quartzEnv.SITE_INCREMENTAL_FALLBACK_PATH = incrementalFallbackPath
  } else {
    delete quartzEnv.SITE_INCREMENTAL_BUILD
    delete quartzEnv.SITE_INCREMENTAL_PLAN_PATH
    delete quartzEnv.SITE_INCREMENTAL_FALLBACK_PATH
  }
  if (options.mode === "auto") {
    quartzEnv.SITE_PARSE_CACHE_DIR = path.join(root, ".cache", "site-regenerate", "parse-cache")
  } else {
    delete quartzEnv.SITE_PARSE_CACHE_DIR
  }
  quartzEnv.NODE_OPTIONS ||= "--max-old-space-size=16384"
  const concurrency = String(env.SITE_BUILD_CONCURRENCY ?? "4")
  if (!/^[1-9]\d*$/.test(concurrency))
    throw new Error(`Invalid SITE_BUILD_CONCURRENCY: ${concurrency}`)
  const quartz = {
    name: incrementalBuild ? "quartz-incremental-build" : "quartz-build",
    command: process.execPath,
    args: [
      "--no-deprecation",
      "./quartz/bootstrap-cli.mjs",
      "build",
      `--concurrency=${concurrency}`,
      "--output",
      stagingRoot,
    ],
    env: quartzEnv,
  }
  const { prebuild, postbuild } = makeChecks(
    root,
    stagingRoot,
    env,
    targetCache,
    evidenceAuditScope,
  )
  const testCheckNames = new Set(["unit-tests", "typescript"])
  const stageGroups = [
    {
      name: "site-checks",
      steps: prebuild,
      shouldSkip: (step) =>
        (canReuseCodeChecks && testCheckNames.has(step.name)) || Boolean(step.skipReason),
      skipReason:
        "The test, TypeScript, config and dependency fingerprints match the last successful build.",
    },
    { name: "quartz-build", steps: [quartz] },
    { name: "postbuild-audits", steps: postbuild },
  ]

  try {
    let failed = false
    for (const group of stageGroups) {
      for (const step of group.steps) {
        if (group.shouldSkip?.(step)) {
          report.stages.push({
            ...skippedStage(step.name, step.skipReason ?? group.skipReason),
            ...(step.scope ? { scope: step.scope } : {}),
          })
          continue
        }
        let result = await executeStage(step, { root, env, json: options.json, executor, report })
        if (result.status === "success" && step.name === "quartz-incremental-build") {
          const fallback = await readJson(incrementalFallbackPath)
          if (fallback?.reason) {
            const incrementalStage = report.stages.at(-1)
            if (incrementalStage) {
              incrementalStage.status = "skipped"
              incrementalStage.reason = fallback.reason
              delete incrementalStage.exitCode
            }
            report.fallbackReasons.push(fallback.reason)
            await rm(stagingRoot, { recursive: true, force: true })
            await mkdir(stagingRoot, { recursive: true })
            const fullEnv = { ...quartzEnv }
            delete fullEnv.SITE_INCREMENTAL_BUILD
            delete fullEnv.SITE_INCREMENTAL_PLAN_PATH
            delete fullEnv.SITE_INCREMENTAL_FALLBACK_PATH
            result = await executeStage(
              { ...quartz, name: "quartz-build", env: fullEnv },
              { root, env, json: options.json, executor, report },
            )
          } else {
            incrementalBuildUsed = true
          }
        }
        if (result.status !== "success") {
          report.status = "failed"
          report.result = "failed"
          report.error ??= `${result.name} failed with exit code ${result.exitCode ?? 1}`
          failed = true
          break
        }
      }
      if (!failed && group.name === "quartz-build") {
        const startedCleanup = performance.now()
        const accidentalRedirect = path.join(stagingRoot, ".html")
        const hadAccidentalRedirect = await exists(accidentalRedirect)
        await rm(accidentalRedirect, { force: true })
        if (incrementalBuildUsed && hadAccidentalRedirect) {
          const emitted = await readJson(emittedFilesPath)
          if (emitted) {
            const redirectPath = path.resolve(accidentalRedirect)
            emitted.written = (emitted.written ?? []).filter(
              (filePath) => path.resolve(filePath) !== redirectPath,
            )
            emitted.deleted = [...new Set([...(emitted.deleted ?? []), redirectPath])]
            await writeJsonAtomic(emittedFilesPath, emitted)
          }
        }
        report.stages.push({
          name: "sanitize-root-redirect",
          status: hadAccidentalRedirect ? "success" : "skipped",
          reason: hadAccidentalRedirect ? undefined : "No root redirect artifact was emitted.",
          durationMs: Math.round(performance.now() - startedCleanup),
        })
      }
      if (failed) break
    }

    if (!failed) {
      const consistencyStarted = performance.now()
      const latestFingerprints = await fingerprintInputs(root, env)
      const changedInputs = changedInputPaths(fingerprints, latestFingerprints)
      const inputsUnchanged = latestFingerprints.inputFingerprint === fingerprints.inputFingerprint
      report.stages.push({
        name: "input-consistency",
        status: inputsUnchanged ? "success" : "failed",
        durationMs: Math.round(performance.now() - consistencyStarted),
        changedInputs,
        reason: inputsUnchanged
          ? undefined
          : "Build inputs changed while the site was being generated; staging was discarded.",
      })
      if (!inputsUnchanged) {
        report.status = "failed"
        report.result = "failed"
        report.error = "Build inputs changed while the site was being generated."
        report.fallbackReasons.push(
          "Rerun after the concurrent input changes stop so the output reflects one stable input state.",
        )
        failed = true
      }
    }

    if (!failed) {
      const stagingTree = incrementalBuildUsed
        ? await fingerprintIncrementalOutput(
            stagingRoot,
            priorState.outputRecords,
            await readJson(emittedFilesPath),
          )
        : await fingerprintOutput(stagingRoot)
      if (!stagingTree || stagingTree.fileCount === 0) {
        report.status = "failed"
        report.result = "failed"
        report.error = "Quartz completed without producing any output files."
        report.stages.push({ name: "staging-output", status: "failed", durationMs: 0, exitCode: 1 })
        failed = true
      } else {
        report.stages.push({
          name: "staging-output",
          status: "success",
          durationMs: 0,
          fileCount: stagingTree.fileCount,
        })
        report.outputFingerprint = stagingTree.fingerprint
        let contentMetadataState = {}
        if (await exists(buildMetadataPath)) {
          const metadataBytes = await readFile(buildMetadataPath)
          const metadataFingerprint = contentFingerprint(metadataBytes)
          const stableMetadataPath = path.join(
            targetCache,
            `content-metadata-${metadataFingerprint}.json`,
          )
          if (await exists(stableMetadataPath)) await rm(buildMetadataPath, { force: true })
          else await rename(buildMetadataPath, stableMetadataPath)
          contentMetadataState = {
            contentMetadataFingerprint: metadataFingerprint,
            contentMetadataPath: stableMetadataPath,
          }
        }
        const previousOutputExisted = await exists(outputRoot)
        const journal = {
          schemaVersion: 1,
          outputRoot,
          stagingPath: stagingRoot,
          backupPath: backupRoot,
          previousOutputExisted,
          inputFingerprint: fingerprints.inputFingerprint,
          outputFingerprint: stagingTree.fingerprint,
          phase: "prepared",
        }
        await writeJsonAtomic(journalPath, journal)
        if (previousOutputExisted) await rename(outputRoot, backupRoot)
        journal.phase = "old-output-moved"
        await writeJsonAtomic(journalPath, journal)
        await rename(stagingRoot, outputRoot)
        await writeJsonAtomic(statePath, {
          schemaVersion: STATE_SCHEMA_VERSION,
          inputFingerprint: fingerprints.inputFingerprint,
          inputDescriptor: fingerprints.inputDescriptor,
          codeFingerprint: fingerprints.codeFingerprint,
          parserFingerprint: fingerprints.parserFingerprint,
          outputFingerprint: stagingTree.fingerprint,
          ...(stagingTree.metadataSupported
            ? { outputMetadataFingerprint: stagingTree.metadataFingerprint }
            : {}),
          ...(Array.isArray(stagingTree.records) ? { outputRecords: stagingTree.records } : {}),
          ...contentMetadataState,
          outputPath: outputRoot,
          fileCount: stagingTree.fileCount,
          completedAt: new Date().toISOString(),
          allChecksPassed: true,
        })
        await rm(backupRoot, { recursive: true, force: true })
        await rm(journalPath, { force: true })
        report.status = "success"
      }
    }
  } catch (error) {
    report.status = "failed"
    report.result = "failed"
    report.error = error instanceof Error ? error.message : String(error)
    try {
      const recovery = await recoverInterruptedSwap({ outputRoot, targetCache, statePath })
      if (recovery) report.recovery = recovery
    } catch (recoveryError) {
      report.recoveryError =
        recoveryError instanceof Error ? recoveryError.message : String(recoveryError)
    }
  } finally {
    await rm(stagingRoot, { recursive: true, force: true })
  }

  report.totalDurationMs = Math.round(performance.now() - started)
  report.finishedAt = new Date().toISOString()
  report.reportPath = reportPath
  await writeJsonAtomic(reportPath, report)
  return report
}

export async function buildSite(
  options,
  root = repositoryRoot,
  env = process.env,
  executor = runStep,
  fingerprintInputs = collectInputFingerprints,
  fingerprintOutput = fingerprintTree,
) {
  const execute = () => runBuild(options, root, env, executor, fingerprintInputs, fingerprintOutput)
  return options.lockHeld ? execute() : withSiteLock(root, execute)
}

function usage() {
  return "Usage: node scripts/site/regenerate.mjs [--full] [--output PATH] [--json] (default: auto; --mode auto|full is also supported)"
}

async function main(argv) {
  let options
  try {
    options = parseArguments(argv)
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    console.error(usage())
    return 2
  }
  if (options.help) {
    console.log(usage())
    return 0
  }
  let report
  try {
    report = await buildSite(options)
  } catch (error) {
    report = {
      schemaVersion: reportSchemaVersion,
      mode: options.mode,
      status: "failed",
      result: "failed",
      outputRoot: path.resolve(repositoryRoot, options.output),
      error: error instanceof Error ? error.message : String(error),
      stages: [],
    }
  }
  if (options.json) console.log(JSON.stringify(report))
  else if (report.status === "success") {
    const label = report.result === "no-op" ? "Site is current" : "Site build succeeded"
    console.log(`${label} (${report.mode}): ${report.outputRoot}`)
    console.log(`Report: ${report.reportPath}`)
  } else {
    console.error(`Site build failed (${report.mode}): ${report.error ?? "see failed stage"}`)
    console.error(`Report: ${report.reportPath}`)
  }
  return report.status === "success" ? 0 : 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main(process.argv.slice(2))
}
