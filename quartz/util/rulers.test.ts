import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import matter from "gray-matter"
import { loadRulers, rulersForEra, museumPlaces, rulerExhibitionSlug } from "./rulers"
import { slugifyFilePath } from "./path"

const rulers = loadRulers()
const exhibition = JSON.parse(fs.readFileSync("quartz/static/exhibitionRulers.json", "utf8")).exhibitions[0]
test("one canonical biography covers every ruler and the cross-union reign", () => {
  assert.equal(rulers.length, 33)
  assert.equal(new Set(rulers.map(r => r.id)).size, 33)
  assert.equal(new Set(rulers.map(r => r.objectSlug)).size, 33)
  assert.equal(exhibition.slug, rulerExhibitionSlug)
  const entries = exhibition.sections.flatMap((s: any) => s.items)
  assert.deepEqual(new Set(entries.map((i: any) => i.rulerId)), new Set(rulers.map(r => r.id)))
  assert.equal(entries.length, 33)
  assert.deepEqual(rulers.filter(r => r.eras.length === 2).map(r => r.id), ["zygimantas-augustas"])
  for (const era of ["ldk", "atr"] as const) {
    assert.ok(rulersForEra(era).some(r => r.id === "zygimantas-augustas"))
  }
  assert.equal(rulers.filter(r => r.reigns.length > 1).length, 3)
  assert.ok(rulers.find(r => r.id === "svarnas")?.notice.includes("ginčijami"))
  assert.ok(rulers.find(r => r.id === "daumantas")?.notice.includes("Pskovo"))
  for (const ruler of rulers) {
    assert.equal(ruler.objectSlug, slugifyFilePath(ruler.notePath as any))
    const item = entries.find((i: any) => i.rulerId === ruler.id)
    assert.equal(item.objectSlug, ruler.objectSlug)
    assert.equal(item.mediaId, ruler.media.mediaId)
    assert.ok(item.narrativeParagraphs.length >= 3)
    assert.ok(item.narrativeParagraphs.join(" ").split(/\s+/).length >= 100)
    assert.deepEqual(item.externalSources, ruler.sources)
    assert.equal(item.claimCodes.length, 0, "encyclopedia provenance must not invent local book claims")
    for (const source of ruler.sources) assert.equal(new URL(source.url).protocol, "https:")
    const fm = matter(fs.readFileSync(ruler.notePath, "utf8")).data
    const wiki = JSON.parse(fm.object_page_view_json).wiki
    assert.equal(wiki.status, "published")
    assert.ok(wiki.intro.length > 100)
    assert.equal(JSON.parse(fm.media_primary_json).mediaId, ruler.media.mediaId)
    assert.ok(fs.existsSync(`quartz${ruler.media.displayUrl}`))
    assert.ok(ruler.media.focalPoint && ruler.media.license && ruler.imageNote)
  }
})
test("all eight homepage places have a sourced introduction and reviewed local image", () => {
  assert.equal(museumPlaces.length, 8)
  for (const [name] of museumPlaces) {
    const fm = matter(fs.readFileSync(`objektai/vietos/${name}.md`, "utf8")).data
    assert.ok(JSON.parse(fm.object_page_view_json).wiki.intro.length > 150)
    const image = JSON.parse(fm.media_primary_json)
    assert.equal(image.reviewStatus, "accepted")
    assert.ok(fs.existsSync(`quartz${image.displayUrl}`))
  }
})
