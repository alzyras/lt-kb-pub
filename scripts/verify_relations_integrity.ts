import fs from "node:fs"
import path from "node:path"
import { createUniqueSlugMap, FilePath, FullSlug } from "../quartz/util/path"
import { parseEvidenceSections } from "../quartz/util/citationFilter"
import {
  buildRelationTargetMap,
  readRelationDocuments,
  relationTargetFromValue,
  relationTargetSlug,
  relationTargetWikilinks,
} from "../quartz/util/relations"

type RelationIssue = {
  code: string
  filePath: string
  claimId?: string
  target?: string
  message: string
}

const objectRoot = path.resolve(process.env.CORPUS_ROOT ?? "objektai")
const projectRoot = path.resolve(process.env.PROJECT_ROOT ?? ".")

function listMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdownFiles(entryPath)
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : []
  })
}

function claimGlobalIds(markdown: string): string[] {
  const heading = markdown.search(/^##\s+Teiginiai\s*$/m)
  if (heading < 0) return []
  const bodyStart = markdown.indexOf("\n", heading) + 1
  const body = markdown.slice(bodyStart)
  const nextHeading = body.search(/^##\s+/m)
  const section = nextHeading >= 0 ? body.slice(0, nextHeading) : body
  const ids: string[] = []
  let pending = ""
  for (const line of section.split(/\r?\n/)) {
    const anchor = line.match(/^\s*<a\s+id=["']claim-(t-\d+)["']\s*><\/a>\s*$/i)
    if (anchor) {
      pending = anchor[1]
      continue
    }
    const claim = line.match(/^\s*-\s+(?:id:\s*)?(t-\d+)\s*$/i)
    if (claim) {
      ids.push(pending)
      pending = ""
    }
  }
  return ids
}

function relationsSection(markdown: string): string {
  const heading = markdown.search(/^##\s+Ryšiai\s*$/m)
  if (heading < 0) return ""
  const bodyStart = markdown.indexOf("\n", heading) + 1
  const body = markdown.slice(bodyStart)
  const nextHeading = body.search(/^##\s+/m)
  return nextHeading >= 0 ? body.slice(0, nextHeading) : body
}

const absoluteFiles = listMarkdownFiles(objectRoot)
const relativeFiles = absoluteFiles.map((file) => path.relative(projectRoot, file) as FilePath)
const slugMap = Object.fromEntries(createUniqueSlugMap(relativeFiles)) as Record<string, FullSlug>
const documents = readRelationDocuments(projectRoot, relativeFiles, slugMap)
const targetMap = buildRelationTargetMap(documents)
const issues: RelationIssue[] = []
const globalOwners = new Map<string, string>()

for (const document of documents) {
  const sections = parseEvidenceSections(document.markdown)
  const claims = (sections.get("Teiginiai") ?? []).filter((entry) => entry.id.startsWith("t-"))
  const globalIds = claimGlobalIds(document.markdown)

  claims.forEach((claim, index) => {
    const globalId = claim.fields.get("global_id")?.trim() || globalIds[index] || ""
    if (!/^t-\d{3,}$/.test(globalId)) {
      issues.push({
        code: "missing_global_claim_id",
        filePath: document.filePath,
        claimId: claim.id,
        message: `Claim ${claim.id} has no valid global id`,
      })
    } else {
      const previous = globalOwners.get(globalId)
      if (previous && previous !== document.filePath) {
        issues.push({
          code: "duplicate_global_claim_id",
          filePath: document.filePath,
          claimId: globalId,
          message: `Global claim id ${globalId} is also used in ${previous}`,
        })
      } else {
        globalOwners.set(globalId, document.filePath)
      }
    }

  })

  for (const rawTarget of relationTargetWikilinks(document.markdown)) {
    const directPath = relationTargetFromValue(rawTarget).replace(/\.md$/i, "")
    if (directPath.startsWith("objektai/") && fs.existsSync(path.resolve(projectRoot, `${directPath}.md`))) {
      continue
    }
    const resolved = relationTargetSlug(rawTarget, targetMap)
    if (!resolved) {
      issues.push({
        code: "broken_direct_relation_target",
        filePath: document.filePath,
        target: rawTarget,
        message: `Direct relation target ${rawTarget} does not resolve to an object`,
      })
    }
  }

  // Global claim IDs are stable technical identities. Public `Ryšiai` is a
  // human-facing semantic projection and must not expose them inline.
  if (/\bt-\d{3,}\b/i.test(relationsSection(document.markdown))) {
    issues.push({
      code: "technical_global_claim_id_in_public_relations",
      filePath: document.filePath,
      message: "Ryšiai must not expose a global claim id outside Advanced mode",
    })
  }
}

const counts = Object.fromEntries(
  [...new Set(issues.map((issue) => issue.code))].map((code) => [
    code,
    issues.filter((issue) => issue.code === code).length,
  ]),
)

console.log(
  JSON.stringify(
    {
      schema: "ltkb-relation-integrity/v1",
      files: documents.length,
      relationTargetLabels: Object.keys(targetMap).length,
      issues: issues.length,
      counts,
      examples: issues.slice(0, 50),
    },
    null,
    2,
  ),
)

if (issues.length > 0) process.exitCode = 1
