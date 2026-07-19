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

const changes: Array<{ file: string; claim: string; citations: string[] }> = []
const failures: Array<{ file: string; claim: string; reason: string }> = []

for (const file of listMarkdownFiles(objectRoot)) {
  const original = fs.readFileSync(file, "utf8")
  const sections = parseEvidenceSections(original)
  const claims = (sections.get("Teiginiai") ?? []).filter((entry) => entry.id.startsWith("t-"))
  const citations = [...sections.values()]
    .flat()
    .filter((entry) => entry.id.startsWith("c-"))
  const citationIds = new Set(citations.map((citation) => citation.id))
  const citationsByClaim = new Map<string, string[]>()

  for (const citation of citations) {
    const backlinks = citation.lists.get("pagrindzia") ?? citation.lists.get("pagrindžia") ?? []
    for (const backlink of backlinks) {
      const list = citationsByClaim.get(backlink) ?? []
      list.push(citation.id)
      citationsByClaim.set(backlink, list)
    }
  }

  for (const claim of claims) {
    const globalId = claim.fields.get("global_id")?.trim()
    if (!globalId) continue
    const linkedByLocalId = citationsByClaim.get(claim.id)
    if (linkedByLocalId) citationsByClaim.set(globalId, linkedByLocalId)
  }

  let updated = original
  for (const claim of claims) {
    const currentRefs = claim.lists.get("pagrindžia") ?? claim.lists.get("pagrindzia") ?? []
    if (currentRefs.length === 0 || currentRefs.every((ref) => citationIds.has(ref))) continue

    const replacement = [...new Set(citationsByClaim.get(claim.id) ?? [])]
    if (replacement.length === 0) {
      failures.push({
        file: path.relative(process.cwd(), file),
        claim: claim.id,
        reason: "No citation backlink could repair the claim",
      })
      continue
    }

    const claimStart = new RegExp(`(^- ${claim.id}\\s*$)`, "m")
    const startMatch = claimStart.exec(updated)
    if (!startMatch || startMatch.index === undefined) {
      failures.push({
        file: path.relative(process.cwd(), file),
        claim: claim.id,
        reason: "Claim block not found",
      })
      continue
    }
    const afterStart = startMatch.index + startMatch[0].length
    const rest = updated.slice(afterStart)
    const endMatch = rest.search(/^(?:- t-|## )/m)
    const blockEnd = endMatch >= 0 ? afterStart + endMatch : updated.length
    const block = updated.slice(startMatch.index, blockEnd)
    const supportPattern = /(\n\s+pagrind(?:žia|zia):\n)(?:\s+- [^\n]*\n?)+/u
    if (!supportPattern.test(block)) {
      failures.push({
        file: path.relative(process.cwd(), file),
        claim: claim.id,
        reason: "Claim has no replaceable pagrindžia list",
      })
      continue
    }
    const replacementBlock = `\n  pagrindžia:\n${replacement.map((id) => `    - ${id}`).join("\n")}\n`
    const nextBlock = block.replace(supportPattern, replacementBlock)
    updated = `${updated.slice(0, startMatch.index)}${nextBlock}${updated.slice(blockEnd)}`
    changes.push({ file: path.relative(process.cwd(), file), claim: claim.id, citations: replacement })
  }

  if (writeChanges && updated !== original) fs.writeFileSync(file, updated)
}

console.log(JSON.stringify({ writeChanges, changes, failures }, null, 2))
if (failures.length > 0) process.exitCode = 1
