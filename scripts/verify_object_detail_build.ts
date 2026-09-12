import fs from "node:fs"
import path from "node:path"
import { objectDetailEvidence } from "../quartz/util/objectDetail"

const corpusRoot = path.resolve(process.env.CORPUS_ROOT ?? "objektai")
const publicRoot = path.resolve(process.env.PUBLIC_ROOT ?? "public")
const sourcePath = path.join(corpusRoot, "asmenys", "Vytautas.md")
const pageRoot = path.join(publicRoot, "objektai", "asmenys", "Vytautas")

if (!fs.existsSync(sourcePath)) throw new Error(`Missing source: ${sourcePath}`)
if (!fs.existsSync(path.join(pageRoot, "index.html")))
  throw new Error(`Missing object page: ${pageRoot}`)

const evidence = objectDetailEvidence(fs.readFileSync(sourcePath, "utf8"))
const evidenceRoot = path.join(pageRoot, "irodymai")
const pageFiles = [path.join(evidenceRoot, "index.html")]
for (let page = 2; ; page += 1) {
  const candidate = path.join(evidenceRoot, String(page), "index.html")
  if (!fs.existsSync(candidate)) break
  pageFiles.push(candidate)
}
const html = pageFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n")
const uniqueMatches = (pattern: RegExp) =>
  new Set([...html.matchAll(pattern)].map((match) => match[1]))
const renderedClaims = uniqueMatches(/id="claim-([^"]+)"/g)
const renderedLinkedCitations = uniqueMatches(/data-citation-id="([^"]+)"/g)
const renderedStandalone = uniqueMatches(/id="citation-([^"]+)"/g)
const missingClaims = evidence.claims
  .map((claim) => claim.id)
  .filter((id) => !renderedClaims.has(id))
const missingCitations = [...evidence.citations.keys()].filter(
  (id) =>
    !renderedLinkedCitations.has(id) &&
    ![...renderedStandalone].some((anchor) => anchor.endsWith(`-${id}`)),
)
const significantMentions = evidence.citationRecords.filter((record) => record.significantMention)
const missingMentions = significantMentions.filter(
  (record) => ![...renderedStandalone].some((anchor) => anchor.endsWith(`-${record.id}`)),
)
const result = {
  claims: evidence.claims.length,
  canonicalCitations: evidence.citations.size,
  citationRecords: evidence.citationRecords.length,
  significantMentions: significantMentions.length,
  standaloneCitations: evidence.citationRecords.filter((record) => record.standalone).length,
  evidencePages: pageFiles.length,
  renderedClaims: renderedClaims.size,
  renderedLinkedCitations: renderedLinkedCitations.size,
  renderedStandaloneRecords: renderedStandalone.size,
  missingClaims,
  missingCitations,
  missingMentions: missingMentions.map((record) => `${record.section}:${record.id}`),
}
console.log(JSON.stringify(result, null, 2))
if (missingClaims.length || missingCitations.length || missingMentions.length) process.exitCode = 1
