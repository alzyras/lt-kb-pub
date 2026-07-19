import fs from "node:fs"
import path from "node:path"
import { collectCorpusEvidenceIntegrityIssues } from "../quartz/util/evidenceIntegrity"
import { parseEvidenceSections } from "../quartz/util/citationFilter"

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
const issues = collectCorpusEvidenceIntegrityIssues(documents)
const citationOwners = new Map<string, string>()

for (const { filePath, markdown } of documents) {
  const sections = parseEvidenceSections(markdown)
  const citations = [...sections.entries()]
    .filter(([title]) => title === "Citatos")
    .flatMap(([, entries]) => entries)
    .filter((entry) => entry.id.startsWith("c-"))
  for (const citation of citations) {
    if (!/^c-\d{5,}$/.test(citation.id)) {
      issues.push({
        code: "non_global_citation_id",
        severity: "error",
        entryId: citation.id,
        filePath,
        message: `Citation ${citation.id} is not a global citation code`,
      })
      continue
    }
    const previousFile = citationOwners.get(citation.id)
    if (previousFile && previousFile !== filePath) {
      issues.push({
        code: "duplicate_global_citation_id_across_files",
        severity: "error",
        entryId: citation.id,
        filePath,
        message: `Citation global id ${citation.id} is also used in ${previousFile}`,
      })
    } else {
      citationOwners.set(citation.id, filePath)
    }
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
      files: documents.length,
      issues: issues.length,
      counts,
      examples: issues.slice(0, 20),
    },
    null,
    2,
  ),
)

if (issues.length > 0) {
  process.exitCode = 1
}
