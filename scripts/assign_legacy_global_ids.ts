import fs from "node:fs"
import path from "node:path"
import { parseEvidenceSections } from "../quartz/util/citationFilter"

const objectRoot = path.resolve(process.env.CORPUS_ROOT ?? "objektai")
const writeChanges = process.argv.includes("--write")

function listMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdownFiles(entryPath)
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : []
  })
}

function stableHash(value: string): number {
  let hash = 2166136261
  for (const byte of Buffer.from(value)) {
    hash ^= byte
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function nextGlobalId(seed: string, used: Set<string>): string {
  let candidate = 900000000 + (stableHash(seed) % 9000000)
  while (used.has(`t-${candidate}`)) candidate += 1
  return `t-${candidate}`
}

const used = new Set<string>()
const changes: Array<{ file: string; localId: string; globalId: string }> = []
const files = listMarkdownFiles(objectRoot)

for (const file of files) {
  const markdown = fs.readFileSync(file, "utf8")
  const sections = parseEvidenceSections(markdown)
  for (const claim of sections.get("Teiginiai") ?? []) {
    const globalId = claim.fields.get("global_id")?.trim()
    if (claim.id.startsWith("t-") && globalId) used.add(globalId)
  }
}

for (const file of files) {
  const original = fs.readFileSync(file, "utf8")
  const sections = parseEvidenceSections(original)
  const claims = (sections.get("Teiginiai") ?? []).filter(
    (claim) => claim.id.startsWith("t-") && !claim.fields.get("global_id")?.trim(),
  )
  if (claims.length === 0) continue

  let updated = original
  for (const claim of claims) {
    const globalId = nextGlobalId(
      `${path.relative(process.cwd(), file)}:${claim.id}:${claim.fields.get("teiginys") ?? ""}`,
      used,
    )
    used.add(globalId)
    const anchor = `- ${claim.id}\n`
    const position = updated.indexOf(anchor)
    if (position < 0) throw new Error(`Could not locate ${claim.id} in ${file}`)
    const insertAt = position + anchor.length
    updated = `${updated.slice(0, insertAt)}  global_id: ${globalId}\n${updated.slice(insertAt)}`
    changes.push({ file: path.relative(process.cwd(), file), localId: claim.id, globalId })
  }
  if (writeChanges) fs.writeFileSync(file, updated)
}

console.log(JSON.stringify({ writeChanges, changes }, null, 2))
