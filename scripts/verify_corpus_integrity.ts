import fs from "node:fs"
import path from "node:path"
import {
  collectCorpusEvidenceIntegrityIssues,
  collectDuplicateCitationIdentityIssues,
} from "../quartz/util/evidenceIntegrity"
import { collectCorpusCitationIdIssues } from "./site/corpusCitationIntegrity"

const objectRoot = path.resolve(process.env.CORPUS_ROOT ?? "objektai")

function listMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdownFiles(entryPath)
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : []
  })
}

const documents = listMarkdownFiles(objectRoot).map((file) => ({
  filePath: path.relative(process.cwd(), file),
  markdown: fs.readFileSync(file, "utf8"),
}))
const issues = [
  ...collectCorpusEvidenceIntegrityIssues(documents),
  ...collectDuplicateCitationIdentityIssues(documents),
  ...collectCorpusCitationIdIssues(documents).filter(
    (issue) => issue.code === "non_global_citation_id",
  ),
]

const counts = Object.fromEntries(
  [...new Set(issues.map((issue) => issue.code))].map((code) => [
    code,
    issues.filter((issue) => issue.code === code).length,
  ]),
)

console.log(
  JSON.stringify(
    {
      files: documents.length,
      issues: issues.length,
      errors: issues.filter((issue) => issue.severity === "error").length,
      warnings: issues.filter((issue) => issue.severity === "warning").length,
      counts,
      examples: issues.slice(0, 20),
    },
    null,
    2,
  ),
)

if (issues.some((issue) => issue.severity === "error")) {
  process.exitCode = 1
}
