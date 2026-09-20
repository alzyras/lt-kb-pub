/** Build both public registers from reviewed identities, using the real site slug map. */
import fs from "node:fs"
import { createUniqueSlugMap, type FilePath } from "../../quartz/util/path"
const files = fs.readdirSync("objektai", { recursive: true }).map(String)
  .filter((name) => name.endsWith(".md")).map((name) => `objektai/${name}` as FilePath)
const slugs = createUniqueSlugMap(files)
const manifestPath = "quartz/static/exhibitionNobleFamilies.json"
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
const existing = JSON.parse(fs.readFileSync("scripts/gimines/nariu-nuorodos.json", "utf8"))
const seeds = ["radvilos", "sapiegos"].map((id) => JSON.parse(fs.readFileSync(`scripts/gimines/${id}-asmenys.json`, "utf8")))
function href(notePath: string) {
  const slug = slugs.get(notePath as FilePath)
  if (!slug || !fs.existsSync(notePath)) throw new Error(`Missing object: ${notePath}`)
  return "/" + slug
}
function sourceTitle(url: string, fallback: string) {
  const host = new URL(url).hostname
  return host === "www.vle.lt" ? "Visuotinė lietuvių enciklopedija" :
    host === "virtus.biblioteka.vu.lt" ? "VU bibliotekos projektas „Virtus“" :
    host === "proveniencijos.lnb.lt" ? "LNB proveniencijų duomenų bazė" : fallback
}
for (const seed of seeds) {
  const people = [...seed.people]
  if (seed.family === "Radvilos") people.push(...seeds[1].people.filter((p: any) => /Radvilaitė/.test(p.name)))
  const members = people.map((p: any) => ({ name: p.name, dates: p.dates, href: href(p.notePath),
    sources: p.sources.map((s: any) => ({ title: sourceTitle(s.url, s.title), url: s.url })) }))
  for (const [file, name, dates, source] of existing[seed.family]) {
    const url = source.startsWith("https:") ? source : `https://www.vle.lt/straipsnis/${source}/`
    members.push({ name, dates, href: href(`objektai/asmenys/${file}.md`),
      sources: [{ title: sourceTitle(url, url.includes("lkma.lt") ? "Rimvydas Petrauskas: Albertas Radvila" : url.includes("istorija.lt") ? "Lietuvos istorijos institutas: Antano Kazimiero Sapiegos korespondencija" : "Dalia Tarandaitė: Sapiegų portretai"), url }] })
  }
  if (new Set(members.map((p) => p.href)).size !== members.length) throw new Error("Repeated person")
  members.sort((a, b) => a.name.localeCompare(b.name, "lt"))
  const e = manifest.exhibitions.find((e: any) => e.slug === `parodos/${seed.articleSlug}`)
  e.familyMembers = members
  e.familyMembersScope = `Čia surinkti ${members.length} šaltiniais identifikuoti istoriniai asmenys: giminės nariai ir jų sutuoktiniai. Registras apima XV–XX a. biografijas, tačiau nėra visų palikuonių genealoginis medis. Kai tikslios datos nepatvirtintos, nurodytas tik amžius. Kiekvienas vardas veda į atskirą puslapį.`
  const table = `## Giminės žmonės\n\n${e.familyMembersScope}\n\n| Asmuo | Gyvenimo laikas | Šaltinis |\n|---|---|---|\n` + members.map((p) => `| [${p.name}](${p.href}) | ${p.dates} | ${p.sources.map((s: any) => `[${s.title}](${s.url})`).join(" · ")} |`).join("\n") + "\n"
  const article = `straipsniai/${seed.articleSlug}.md`
  let text = fs.readFileSync(article, "utf8")
  const start = text.indexOf("<!-- FAMILY-REGISTER:START -->")
  if (start >= 0) text = text.replace(/<!-- FAMILY-REGISTER:START -->[\s\S]*?<!-- FAMILY-REGISTER:END -->/, `<!-- FAMILY-REGISTER:START -->\n${table}<!-- FAMILY-REGISTER:END -->`)
  else if (seed.family === "Radvilos") text = text.replace(/## Radvilų narių puslapiai[\s\S]*?(?=## Plačiau apie giminę)/, `<!-- FAMILY-REGISTER:START -->\n${table}<!-- FAMILY-REGISTER:END -->\n\n`)
  else text = text.replace(/## Žmonių ir įvykių puslapiai[\s\S]*/, `<!-- FAMILY-REGISTER:START -->\n${table}<!-- FAMILY-REGISTER:END -->\n\n[Radvilų giminės apžvalga](/straipsniai/radvilos-gimine-valdos-ir-paveldas).\n`)
  fs.writeFileSync(article, text)
  fs.writeFileSync(`scripts/gimines/${seed.family === "Radvilos" ? "radvilos" : "sapiegos"}-nariu-registras.md`, `# ${seed.family}: patikrintų tapatybių registras\n\nAtnaujinta 2026-09-21.\n\n${table}`)
  console.log(`${seed.family}: ${members.length}`)
}
const byId = new Map(manifest.exhibitions.flatMap((e: any) => e.sections.flatMap((s: any) => s.items.map((i: any) => [i.exhibitionItemId, i])))) as Map<string, any>
function addLinks(id: string, paths: string[]) {
  const item = byId.get(id)
  const links = item.objectLinks ?? []
  for (const notePath of paths) if (!links.some((l: any) => l.href === href(notePath))) links.push({ title: notePath.split("/").at(-1)!.slice(0, -3), href: href(notePath) })
  item.objectLinks = links
}
addLinks("rad-juodasis", ["objektai/asmenys/Jurgis Radvila (1556–1600).md", "objektai/asmenys/Elžbieta Šidloveckaitė.md"])
addLinks("rad-perkunas", ["objektai/vietos/Biržai.md", "objektai/asmenys/Elžbieta Radvilaitė (Leono Sapiegos žmona).md"])
addLinks("rad-rudasis", ["objektai/asmenys/Jurgis Radvila (1480–1541).md", "objektai/asmenys/Barbora Radvilaitė.md"])
addLinks("rad-nesvyzius", ["objektai/asmenys/Pranciška Uršulė Radvilienė (1705–1753).md", "objektai/vietos/Nesvyžius.md"])
addLinks("sap-knygos", ["objektai/asmenys/Kazimieras Leonas Sapiega (1609–1656).md"])
addLinks("sap-leonas", ["objektai/asmenys/Dorotėja Firlėjūtė.md", "objektai/asmenys/Elžbieta Radvilaitė (Leono Sapiegos žmona).md"])
// The document catalogue gives only Kazimieras; do not infer which namesake owned the estate.
byId.get("sap-svobiskis").objectLinks = byId.get("sap-svobiskis").objectLinks.filter((l: any) => !l.href.includes("/asmenys/"))
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n")
