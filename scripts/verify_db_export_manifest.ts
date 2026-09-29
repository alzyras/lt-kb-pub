import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { indexNormalizedPaths } from "./site/manifestPaths"

type ManifestEntry = {
  content_hash: string
  rendered_hash: string
}

type ProjectionManifest = {
  version: number
  source: string
  contract: Record<string, number>
  files: Record<string, ManifestEntry>
}

const root = path.resolve(process.cwd())
const manifestPath = path.join(root, "public-projection-manifest.json")
const canonicalRoots = [
  "objektai",
  "tyrimai",
  "paveikslėliai",
  "paveiksleliai",
  "temos",
  "laikotarpiai",
]
const canonicalSingleFiles = ["index.md"]

function sha256(value: Buffer): string {
  return crypto.createHash("sha256").update(value).digest("hex")
}

function listMarkdownFiles(directory: string): string[] {
  const absoluteDirectory = path.join(root, directory)
  if (!fs.existsSync(absoluteDirectory)) return []
  const output: string[] = []
  const visit = (absolutePath: string) => {
    const stat = fs.statSync(absolutePath)
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(absolutePath)) visit(path.join(absolutePath, child))
      return
    }
    if (stat.isFile() && absolutePath.endsWith(".md")) {
      output.push(path.relative(root, absolutePath))
    }
  }
  visit(absoluteDirectory)
  return output
}

function readManifest(): ProjectionManifest {
  if (!fs.existsSync(manifestPath)) {
    throw new Error("Missing public-projection-manifest.json. Run the DB projection export first.")
  }
  const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Partial<ProjectionManifest>
  if (
    parsed.version !== 1 ||
    parsed.source !== "workflow.sqlite3" ||
    !parsed.files ||
    !parsed.contract
  ) {
    throw new Error("Invalid DB projection manifest schema")
  }
  return parsed as ProjectionManifest
}

const failures: string[] = []
let manifest: ProjectionManifest
try {
  manifest = readManifest()
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error))
  manifest = { version: 0, source: "", contract: {}, files: {} }
}

const expectedPaths = Object.keys(manifest.files)
const actualPaths = [
  ...canonicalRoots.flatMap(listMarkdownFiles),
  ...canonicalSingleFiles.filter((file) => fs.existsSync(path.join(root, file))),
]
const expectedIndex = indexNormalizedPaths(expectedPaths)
const actualIndex = indexNormalizedPaths(actualPaths)
for (const collision of expectedIndex.collisions) {
  failures.push(`Unicode-normalized manifest path collision: ${collision.paths.join(" <> ")}`)
}
for (const collision of actualIndex.collisions) {
  failures.push(`Unicode-normalized public path collision: ${collision.paths.join(" <> ")}`)
}

for (const [normalizedPath, actualRelativePath] of [...actualIndex.paths].sort(([left], [right]) =>
  left.localeCompare(right),
)) {
  const manifestRelativePath = expectedIndex.paths.get(normalizedPath)
  const entry = manifestRelativePath ? manifest.files[manifestRelativePath] : undefined
  if (!entry) {
    failures.push(`unmanifested DB export file: ${actualRelativePath}`)
    continue
  }
  if (!/^[a-f0-9]{64}$/i.test(entry.rendered_hash)) {
    failures.push(`invalid rendered hash: ${manifestRelativePath}`)
    continue
  }
  const actualHash = sha256(fs.readFileSync(path.join(root, actualRelativePath)))
  if (actualHash !== entry.rendered_hash) {
    failures.push(`DB export drift: ${manifestRelativePath}`)
  }
}

for (const [normalizedPath, manifestRelativePath] of [...expectedIndex.paths].sort(
  ([left], [right]) => left.localeCompare(right),
)) {
  if (!actualIndex.paths.has(normalizedPath)) {
    failures.push(`missing DB export file: ${manifestRelativePath}`)
  }
}

for (const [key, value] of Object.entries(manifest.contract)) {
  if (!Number.isInteger(value) || value !== 0) {
    failures.push(`DB export contract is not clean: ${key}=${value}`)
  }
}

console.log(
  JSON.stringify(
    {
      manifest: path.relative(root, manifestPath),
      exportedFiles: expectedPaths.length,
      actualFiles: actualPaths.length,
      failures,
    },
    null,
    2,
  ),
)

if (failures.length > 0) process.exitCode = 1
