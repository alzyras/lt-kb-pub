import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
import { lstat, readFile, readlink, readdir, realpath, stat } from "node:fs/promises"
import path from "node:path"

export const STATE_SCHEMA_VERSION = 4
export const INPUTS_SCHEMA_VERSION = 1

const INPUT_DIRECTORIES = ["content", "quartz"]
const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".mts", ".cts", ".mjs", ".js", ".cjs", ".json"])
const ASSET_EXTENSIONS = new Set([
  ...CODE_EXTENSIONS,
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
])
const PACKAGE_INPUTS = ["package.json", "package-lock.json", "npm-shrinkwrap.json", "tsconfig.json"]
const OTHER_INPUTS = ["public-projection-manifest.json"]
const TEST_DIRECTORY_NAMES = new Set(["test", "tests", "__tests__", "fixtures"])
const EXCLUDED_INPUT_PARTS = new Set([
  ".git",
  "node_modules",
  "public",
  ".cache",
  ".quartz-cache",
  ".valancius-state",
])
const ENV_INPUTS = [
  "SITE_ORIGIN",
  "MIN_REQUIRED_GALLERY_IMAGES",
  "CORPUS_ROOT",
  "PROJECT_ROOT",
  "SITE_BUILD_CONCURRENCY",
  "NODE_OPTIONS",
  "NODE_ENV",
  "CI",
  "TZ",
  "SOURCE_DATE_EPOCH",
]

function isBuildCodeInput(record) {
  // The projection manifest and graph JSON are build data. They invalidate
  // rendered output, but changing them does not change the code checked by
  // TypeScript/tests or the Markdown parser itself.
  return (
    record.path !== "public-projection-manifest.json" &&
    !record.path.startsWith("quartz/static/graph-data/")
  )
}

function isAssetVersionInput(record) {
  if (["quartz.config.ts", "quartz.layout.ts", ...PACKAGE_INPUTS].includes(record.path)) return true
  if (!record.path.startsWith("quartz/") || record.path.startsWith("quartz/static/")) return false
  return ASSET_EXTENSIONS.has(path.extname(record.path).toLowerCase())
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex")
}

function comparePaths(left, right) {
  return left < right ? -1 : left > right ? 1 : 0
}

function ignoredInputPath(relativePath) {
  return relativePath.split(path.sep).some((part) => EXCLUDED_INPUT_PARTS.has(part))
}

async function fileRecord(
  logicalPath,
  absolutePath,
  seenNames,
  { codeOnly = false, includeDates = false, includeIdentity = false, hashContent = true } = {},
) {
  const normalizedPath = logicalPath.normalize("NFC").replaceAll(path.sep, "/")
  const previous = seenNames.get(normalizedPath)
  if (previous && previous !== logicalPath) {
    throw new Error(
      `Input paths collide after Unicode NFC normalization: ${previous} and ${logicalPath}`,
    )
  }
  seenNames.set(normalizedPath, logicalPath)

  const info = await lstat(absolutePath)
  if (info.isSymbolicLink()) {
    const linkTarget = await readlink(absolutePath)
    let targetPath
    try {
      targetPath = await realpath(absolutePath)
    } catch (error) {
      if (error?.code === "ENOENT") {
        const record = {
          path: normalizedPath,
          type: "broken-symlink",
          target: linkTarget.normalize("NFC"),
        }
        const linkInfo = includeIdentity ? await lstat(absolutePath, { bigint: true }) : undefined
        const metadataRecord = linkInfo
          ? { ...record, ...fileIdentity(linkInfo), link: fileIdentity(linkInfo) }
          : undefined
        return {
          record: hashContent ? record : (metadataRecord ?? record),
          metadataRecord,
        }
      }
      throw error
    }
    const targetInfo = await lstat(targetPath)
    const record = {
      path: normalizedPath,
      type: "symlink",
      target: linkTarget.normalize("NFC"),
    }
    let metadataRecord
    if (includeIdentity) {
      const targetIdentity = fileIdentity(await stat(targetPath, { bigint: true }))
      const linkIdentity = fileIdentity(await lstat(absolutePath, { bigint: true }))
      metadataRecord = {
        ...record,
        ...targetIdentity,
        link: linkIdentity,
      }
    }
    if (
      targetInfo.isFile() &&
      (!codeOnly || CODE_EXTENSIONS.has(path.extname(targetPath).toLowerCase()))
    ) {
      if (hashContent) {
        const bytes = await readFile(targetPath)
        record.sha256 = digest(bytes)
        record.size = bytes.byteLength
      } else {
        record.size = Number(targetInfo.size)
      }
      if (includeDates || includeIdentity) {
        const dates = await stat(targetPath, { bigint: true })
        if (includeDates) {
          record.birthtimeNs = dates.birthtimeNs.toString()
          record.mtimeNs = dates.mtimeNs.toString()
        }
        if (includeIdentity) {
          metadataRecord = {
            path: normalizedPath,
            type: "symlink",
            target: linkTarget.normalize("NFC"),
            ...fileIdentity(dates),
            link: metadataRecord.link,
          }
        }
      }
    }
    return {
      record: hashContent ? record : (metadataRecord ?? record),
      metadataRecord,
      directory: targetInfo.isDirectory() ? targetPath : undefined,
    }
  }
  if (!info.isFile())
    return { record: undefined, directory: info.isDirectory() ? absolutePath : undefined }
  if (codeOnly && !CODE_EXTENSIONS.has(path.extname(absolutePath).toLowerCase())) {
    return { record: undefined }
  }
  const record = { path: normalizedPath, type: "file" }
  const dates =
    includeDates || includeIdentity ? await stat(absolutePath, { bigint: true }) : undefined
  if (hashContent) {
    const bytes = await readFile(absolutePath)
    record.size = bytes.byteLength
    record.sha256 = digest(bytes)
  } else {
    record.size = Number(info.size)
  }
  if (includeDates && dates) {
    record.birthtimeNs = dates.birthtimeNs.toString()
    record.mtimeNs = dates.mtimeNs.toString()
  }
  const metadataRecord = includeIdentity
    ? { path: normalizedPath, type: "file", ...fileIdentity(dates) }
    : undefined
  return { record: hashContent ? record : metadataRecord, metadataRecord }
}

function fileIdentity(info) {
  return {
    size: Number(info.size),
    birthtimeNs: info.birthtimeNs.toString(),
    mtimeNs: info.mtimeNs.toString(),
    ctimeNs: info.ctimeNs.toString(),
    ino: info.ino.toString(),
  }
}

async function walkResolvedDirectory(
  root,
  logicalDirectory,
  absoluteDirectory,
  output,
  seenNames,
  options,
  realPathStack,
  metadataOutput,
) {
  const realDirectory = await realpath(absoluteDirectory)
  if (realPathStack.has(realDirectory))
    throw new Error(`Symlink cycle while fingerprinting ${logicalDirectory}`)
  const nextStack = new Set(realPathStack)
  nextStack.add(realDirectory)
  const entries = await readdir(absoluteDirectory, { withFileTypes: true })
  entries.sort((left, right) => comparePaths(left.name, right.name))
  for (const entry of entries) {
    const relativePath = path.join(logicalDirectory, entry.name)
    if (ignoredInputPath(relativePath)) continue
    const absolutePath = path.join(absoluteDirectory, entry.name)
    const result = await fileRecord(relativePath, absolutePath, seenNames, options)
    if (result.record) output.push(result.record)
    if (metadataOutput && result.metadataRecord) metadataOutput.push(result.metadataRecord)
    if (result.directory) {
      const targetRealPath = await realpath(result.directory)
      if (nextStack.has(targetRealPath))
        throw new Error(`Symlink cycle while fingerprinting ${relativePath}`)
      await walkResolvedDirectory(
        root,
        relativePath,
        result.directory,
        output,
        seenNames,
        options,
        nextStack,
        metadataOutput,
      )
    }
  }
}

async function walkInputRoot(root, relativePath, output, seenNames, options) {
  const absolutePath = path.join(root, relativePath)
  try {
    await lstat(absolutePath)
  } catch (error) {
    if (error?.code === "ENOENT") return
    throw error
  }
  const result = await fileRecord(relativePath, absolutePath, seenNames, options)
  if (result.record) output.push(result.record)
  if (result.directory) {
    await walkResolvedDirectory(
      root,
      relativePath,
      result.directory,
      output,
      seenNames,
      options,
      new Set(),
    )
  }
}

function gitInputs(root) {
  try {
    const head = execFileSync("git", ["-C", root, "rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim()
    const status = execFileSync(
      "git",
      [
        "-C",
        root,
        "status",
        "--porcelain=v1",
        "--untracked-files=all",
        "--",
        "content",
        "objektai",
        "tyrimai",
        "paveikslėliai",
        "paveiksleliai",
        "temos",
        "laikotarpiai",
        "quartz",
        "quartz.config.ts",
        "quartz.layout.ts",
        "scripts",
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "public-projection-manifest.json",
      ],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    )
    return { head, status: status.trimEnd() }
  } catch {
    return { head: "no-git-metadata", status: "" }
  }
}

export async function collectInputFingerprints(root, env = process.env) {
  const inputs = []
  const code = []
  const parser = []
  const seenInputNames = new Map()
  const seenCodeNames = new Map()
  const seenParserNames = new Map()
  for (const directory of INPUT_DIRECTORIES) {
    await walkInputRoot(root, directory, inputs, seenInputNames, {
      includeDates: directory === "content",
    })
  }
  await walkInputRoot(root, "quartz", code, seenCodeNames, { codeOnly: true })
  await walkInputRoot(root, "quartz", parser, seenParserNames, { codeOnly: true })
  for (const relativePath of ["quartz.config.ts", "quartz.layout.ts", ...PACKAGE_INPUTS]) {
    const item = []
    await walkInputRoot(root, relativePath, item, seenCodeNames, { codeOnly: true })
    inputs.push(...item)
    code.push(...item)
    const parserItem = []
    await walkInputRoot(root, relativePath, parserItem, seenParserNames, { codeOnly: true })
    parser.push(...parserItem)
  }
  for (const relativePath of OTHER_INPUTS) {
    await walkInputRoot(root, relativePath, inputs, seenInputNames, {})
    await walkInputRoot(root, relativePath, code, seenCodeNames, { codeOnly: true })
  }
  await walkInputRoot(root, "scripts", inputs, seenInputNames, { codeOnly: true })
  await walkInputRoot(root, "scripts", code, seenCodeNames, { codeOnly: true })

  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || !TEST_DIRECTORY_NAMES.has(entry.name)) continue
    await walkInputRoot(root, entry.name, inputs, seenInputNames, {})
    await walkInputRoot(root, entry.name, code, seenCodeNames, {})
  }

  const envValues = Object.fromEntries(ENV_INPUTS.map((name) => [name, env[name] ?? null]))
  const git = gitInputs(root)
  let python = "unavailable"
  try {
    python = execFileSync(env.PYTHON ?? "python3", ["--version"], { encoding: "utf8" }).trim()
  } catch {
    // The configured executable is also used by the Python build audit; its
    // absence will be reported by that required build stage.
  }
  let npm = "unavailable"
  try {
    npm = execFileSync("npm", ["--version"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim()
  } catch {
    // npm is required for the unit-test stage, which will report a missing executable.
  }
  const runtime = {
    node: process.version,
    npm,
    python,
    platform: process.platform,
    arch: process.arch,
  }
  const buildDescriptor = {
    schemaVersion: INPUTS_SCHEMA_VERSION,
    inputs: inputs.sort((left, right) => comparePaths(left.path, right.path)),
    git,
    runtime,
    environment: envValues,
  }
  const codeDescriptor = {
    schemaVersion: INPUTS_SCHEMA_VERSION,
    files: code.filter(isBuildCodeInput).sort((left, right) => comparePaths(left.path, right.path)),
    runtime,
    environment: envValues,
  }
  const parserDescriptor = {
    schemaVersion: INPUTS_SCHEMA_VERSION,
    files: parser
      .filter(isBuildCodeInput)
      .sort((left, right) => comparePaths(left.path, right.path)),
    gitHead: git.head,
    runtime,
    environment: envValues,
  }
  const assetDescriptor = {
    schemaVersion: INPUTS_SCHEMA_VERSION,
    files: buildDescriptor.inputs
      .filter(isAssetVersionInput)
      .sort((left, right) => comparePaths(left.path, right.path)),
    runtime,
    environment: envValues,
  }
  return {
    inputFingerprint: digest(JSON.stringify(buildDescriptor)),
    codeFingerprint: digest(JSON.stringify(codeDescriptor)),
    parserFingerprint: digest(JSON.stringify(parserDescriptor)),
    assetFingerprint: digest(JSON.stringify(assetDescriptor)),
    inputCount: buildDescriptor.inputs.length,
    brokenSymlinks: buildDescriptor.inputs
      .filter((entry) => entry.type === "broken-symlink")
      .map(({ path: inputPath, target }) => ({ path: inputPath, target })),
    inputDescriptor: buildDescriptor,
  }
}

export async function fingerprintTree(directory) {
  const records = []
  const metadataRecords = []
  const seenNames = new Map()
  try {
    await lstat(directory)
  } catch (error) {
    if (error?.code === "ENOENT") return undefined
    throw error
  }
  await walkResolvedDirectory(
    directory,
    "",
    directory,
    records,
    seenNames,
    { includeIdentity: true },
    new Set(),
    metadataRecords,
  )
  records.sort((left, right) => comparePaths(left.path, right.path))
  metadataRecords.sort((left, right) => comparePaths(left.path, right.path))
  return {
    fingerprint: digest(JSON.stringify(records)),
    metadataFingerprint: digest(JSON.stringify(metadataRecords)),
    metadataSupported: metadataRecords.every(hasStableFileIdentity),
    fileCount: records.length,
    records,
  }
}

export function fingerprintRecords(records) {
  const sorted = [...records].sort((left, right) => comparePaths(left.path, right.path))
  return digest(JSON.stringify(sorted))
}

export async function fingerprintTreeMetadata(directory) {
  const records = []
  const seenNames = new Map()
  try {
    await lstat(directory)
  } catch (error) {
    if (error?.code === "ENOENT") return undefined
    throw error
  }
  await walkResolvedDirectory(
    directory,
    "",
    directory,
    records,
    seenNames,
    { includeIdentity: true, hashContent: false },
    new Set(),
  )
  records.sort((left, right) => comparePaths(left.path, right.path))
  return {
    fingerprint: digest(JSON.stringify(records)),
    supported: records.every(hasStableFileIdentity),
    fileCount: records.length,
    paths: records.map((record) => record.path),
  }
}

function hasStableFileIdentity(record) {
  if (record.type === "broken-symlink") {
    return (
      record.link?.ino &&
      record.link.ino !== "0" &&
      record.link.ctimeNs &&
      record.link.ctimeNs !== "0"
    )
  }
  return record.ino && record.ino !== "0" && record.ctimeNs && record.ctimeNs !== "0"
}

export function contentFingerprint(value) {
  return digest(value)
}

export function normalizeRelativePath(value) {
  return value.normalize("NFC").replaceAll(path.sep, "/")
}
