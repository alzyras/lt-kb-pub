/** Import applied object-page output without replacing existing canonical evidence. */
import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { execFileSync } from "node:child_process"
import matter from "gray-matter"

const [sourceRoot, database] = process.argv.slice(2)
if (!sourceRoot || !database)
  throw new Error("Usage: node scripts/sync_object_page_enrichment.mjs SOURCE_ROOT DATABASE")
const snapshot = JSON.parse(
  execFileSync(
    "python3",
    [
      "-c",
      `
import sqlite3,json,sys
from pathlib import Path
c=sqlite3.connect(Path(sys.argv[1]).resolve().as_uri()+'?mode=ro',uri=True)
c.row_factory=sqlite3.Row
c.execute('BEGIN')
rows=c.execute("SELECT m.* FROM object_page_modules m JOIN items i ON i.note_path=m.note_path WHERE i.status='active' ORDER BY m.updated_at DESC, m.created_at DESC").fetchall()
modules={}
for r in rows:
    payload=json.loads(r['payload_json'])
    if r['status'] in ('rejected','revoked'): payload['status']=r['status']
    modules.setdefault(r['note_path'],{}).setdefault(r['module_key'],payload)
renders={r['note_path']:dict(r) for r in c.execute("SELECT r.note_path,r.content_hash,r.rendered_hash FROM render_state r JOIN items i ON i.note_path=r.note_path WHERE i.status='active' AND r.status='rendered'")}
print(json.dumps({'modules':modules,'renders':renders},ensure_ascii=False))
`,
      database,
    ],
    { encoding: "utf8", maxBuffer: 100 * 1024 * 1024 },
  ),
)

const manifest = JSON.parse(fs.readFileSync("public-projection-manifest.json", "utf8"))
const hash = (text) => crypto.createHash("sha256").update(text).digest("hex")
const parse = (value) => (typeof value === "string" ? JSON.parse(value) : value || {})
const report = { updated: 0, added: 0, wiki: 0, summaries: 0, traits: 0, links: 0, imported: [] }
const paths = new Set([...Object.keys(snapshot.renders), ...Object.keys(snapshot.modules)])
for (const note of [...paths].sort()) {
  if (!note.startsWith("objektai/") || !note.endsWith(".md")) continue
  const source = path.resolve(sourceRoot, note)
  if (!fs.existsSync(source)) continue
  const destination = path.resolve(note)
  const exists = fs.existsSync(destination)
  const sourceText = fs.readFileSync(source, "utf8")
  const applied = matter(sourceText)
  const original = exists ? fs.readFileSync(destination, "utf8") : sourceText
  const current = matter(original)
  const originalData = JSON.stringify(current.data)
  current.data = structuredClone(current.data)
  const dbModules = snapshot.modules[note] || {}
  const view = parse(applied.data.object_page_view_json)
  if (!exists || Object.keys(view).length || Object.keys(dbModules).length) {
    for (const [key, value] of Object.entries(applied.data)) {
      if (key.startsWith("object_page_") || key === "external_sources_json")
        current.data[key] = value
    }
    for (const [dbKey, viewKey] of [
      ["encyclopedia_intro", "wiki"],
      ["internal_summary", "internal_summary"],
      ["traits", "traits"],
    ]) {
      const module = dbModules[dbKey]
      if (module) view[viewKey] = module
    }
    if (dbModules.external_sources?.items) view.source_buttons = dbModules.external_sources.items
    if (dbModules.key_facts?.claims?.length) {
      view.featured_claims = dbModules.key_facts.claims
      view.featured_claim_ids = dbModules.key_facts.claim_ids
    }
    if (Object.keys(view).length) current.data.object_page_view_json = JSON.stringify(view)
    if (view.wiki?.intro || view.wiki?.infobox?.length) report.wiki++
    if (view.internal_summary?.text) report.summaries++
    if (view.traits?.rows?.length) report.traits++
    if (parse(current.data.external_sources_json)?.length || view.source_buttons?.length)
      report.links++
  }
  // Existing claim/citation bodies retain their audited IDs and exhibition links.
  const result = exists
    ? matter.stringify(current.content, current.data, { lineWidth: -1 })
    : matter.stringify(applied.content, current.data, { lineWidth: -1 })
  if (exists && JSON.stringify(current.data) === originalData) continue
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.writeFileSync(destination, result)
  const previous = manifest.files[note] || snapshot.renders[note]
  if (!previous?.content_hash) throw new Error(`No DB provenance for ${note}`)
  manifest.files[note] = {
    content_hash: previous.content_hash,
    rendered_hash: hash(result),
    projection_mode: "authored_object_page",
    enrichment_source_hash: hash(sourceText),
  }
  report[exists ? "updated" : "added"]++
  report.imported.push(note)
}
fs.writeFileSync("public-projection-manifest.json", JSON.stringify(manifest, null, 2) + "\n")
fs.mkdirSync("scripts/reports", { recursive: true })
fs.writeFileSync(
  "scripts/reports/object-page-enrichment.json",
  JSON.stringify(report, null, 2) + "\n",
)
console.log(JSON.stringify({ ...report, imported: report.imported.length }, null, 2))
