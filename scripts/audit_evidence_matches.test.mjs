import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { repositoryRoot } from "./site/regenerate.mjs"

const matchingMarkdown = `# Good object

## Teiginiai
- t-001
  teiginys: Vytautas vedė kariuomenę.
  pagrindžia:
    - c-001

## Citatos
- c-001
  citata_originali: |
    Vytautas vedė kariuomenę prie mūšio.
`

const mismatchingMarkdown = `# Bad object

## Teiginiai
- t-002
  teiginys: Karalius sudarė taikos sutartį po ilgo karo.
  pagrindžia:
    - c-002

## Citatos
- c-002
  citata_originali: |
    Laukuose augo aukšta žolė ir žydėjo gėlės.
`

function runEvidenceAudit(env) {
  return execFileSync(process.execPath, ["--import", "tsx", "scripts/audit_evidence_matches.ts"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env,
  })
}

test("incremental evidence audit checks only listed object Markdown files", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "evidence-audit-scope-test-"))
  t.after(() => rm(parent, { recursive: true, force: true }))
  const objectRoot = path.join(parent, "objektai")
  await mkdir(objectRoot)
  const matchingFile = path.join(objectRoot, "matching.md")
  await writeFile(matchingFile, matchingMarkdown)
  await writeFile(path.join(objectRoot, "mismatching.md"), mismatchingMarkdown)

  const scopedSummary = JSON.parse(
    runEvidenceAudit({
      ...process.env,
      CORPUS_ROOT: objectRoot,
      EVIDENCE_AUDIT_FILES: JSON.stringify([matchingFile]),
    }),
  )
  assert.equal(scopedSummary.files, 1)
  assert.equal(scopedSummary.references, 1)
  assert.equal(scopedSummary.textMismatchReferences, 0)

  const fullEnvironment = { ...process.env, CORPUS_ROOT: objectRoot }
  delete fullEnvironment.EVIDENCE_AUDIT_FILES
  assert.throws(
    () => runEvidenceAudit(fullEnvironment),
    (error) => {
      assert.equal(error.status, 1)
      const fullSummary = JSON.parse(error.stdout)
      assert.equal(fullSummary.files, 2)
      assert.equal(fullSummary.textMismatchReferences, 1)
      return true
    },
  )

  const outsideFile = path.join(parent, "outside.md")
  await writeFile(outsideFile, matchingMarkdown)
  assert.throws(
    () =>
      runEvidenceAudit({
        ...process.env,
        CORPUS_ROOT: objectRoot,
        EVIDENCE_AUDIT_FILES: JSON.stringify([outsideFile]),
      }),
    (error) => {
      assert.equal(error.status, 1)
      assert.match(error.stderr, /outside the object Markdown root/)
      return true
    },
  )

  const nestedRoot = path.join(objectRoot, "nested")
  await mkdir(nestedRoot)
  const escapingSymlink = path.join(nestedRoot, "outside.md")
  await symlink(outsideFile, escapingSymlink)
  assert.throws(
    () =>
      runEvidenceAudit({
        ...process.env,
        CORPUS_ROOT: objectRoot,
        EVIDENCE_AUDIT_FILES: JSON.stringify([escapingSymlink]),
      }),
    (error) => {
      assert.equal(error.status, 1)
      assert.match(error.stderr, /outside the object Markdown root/)
      return true
    },
  )
})
