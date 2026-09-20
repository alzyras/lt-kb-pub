/** Assemble a copied input subset for the normal Quartz renderer.
 * This is a review aid, never a replacement for the full-site release gate.
 * No source, database, config or existing build is changed.
 */
import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../../", import.meta.url))
if (!["lt-kb-pub-valancius", "lt-kb-pub-valancius-integration"].includes(path.basename(root.replace(/\/$/, ""))))
  throw new Error("Restricted to the isolated review worktree")
// Keep input outside .cache: Quartz's ignore patterns also apply to its input path.
const input = fs.mkdtempSync(path.join(os.tmpdir(), "valancius-preview-"))
const registry = JSON.parse(fs.readFileSync(path.join(root, "scripts/valancius/evidence-register.json")))
const files = new Set(registry.filter(r => r.publicStatus === "accepted").map(r => r.notePath))
for (const name of fs.readdirSync(path.join(root, "straipsniai")))
  if (name.endsWith(".md")) files.add(`straipsniai/${name}`)
for (const name of fs.readdirSync(path.join(root, "objektai/saltiniai")))
  if (/Puzaras|Ganytojiski laiskai|Aleksandravicius - Blaivybe|Merkys - Motiejus/.test(name))
    files.add(`objektai/saltiniai/${name}`)
for (const name of ["index.md", "nustatymai.md"]) files.add(name)
for (const name of ["privatumo-politika.md", "naudojimo-salygos.md", "duomenu-istrynimas.md"])
  files.add(`content/${name}`)
for (const name of files) {
  const target = path.join(input, name.replace(/^content\//, ""))
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(path.join(root, name), target)
}
const receipt = { scope: "Ciklo peržiūra, ne pilno svetainės surinkimo patikra", input, files: [...files].sort() }
fs.writeFileSync(path.join(root, "scripts/valancius/review/scoped-preview-input.json"), JSON.stringify(receipt, null, 2) + "\n")
console.log(JSON.stringify({ input, files: files.size }))
