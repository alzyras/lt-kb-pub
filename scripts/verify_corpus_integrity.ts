import fs from "node:fs"
import path from "node:path"
import { collectEvidenceIntegrityIssues } from "../quartz/util/evidenceIntegrity"

const objectRoot = path.resolve("objektai")

function listMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdownFiles(entryPath)
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : []
  })
}

const issues = listMarkdownFiles(objectRoot).flatMap((file) => {
  const markdown = fs.readFileSync(file, "utf8")
  return collectEvidenceIntegrityIssues(markdown).map((issue) => ({
    file: path.relative(process.cwd(), file),
    ...issue,
  }))
})

const counts = Object.fromEntries(
  [...new Set(issues.map((issue) => issue.code))].map((code) => [
    code,
    issues.filter((issue) => issue.code === code).length,
  ]),
)

console.log(
  JSON.stringify(
    {
      files: listMarkdownFiles(objectRoot).length,
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
