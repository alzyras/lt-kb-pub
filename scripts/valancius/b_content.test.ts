import assert from "node:assert/strict"
import test from "node:test"
import fs from "node:fs"
import matter from "gray-matter"
const read = (p: string) => fs.readFileSync(p, "utf8")
const curation = JSON.parse(read("scripts/valancius/curation.json"))
const before = JSON.parse(read("scripts/valancius/archive/b-before-2026-09-14/curation.json"))
const article = matter(read("straipsniai/kaip-valancius-keite-kasdienybe.md"))

test("B keeps its URL, draft state, authorship and distinct social image", () => {
  assert.equal(article.data.title,"Kai kaimas atsisakė degtinės: Valančius ir blaivybės sąjūdis")
  assert.equal(article.data.seo_title,"Valančius ir blaivybė: kaip keitėsi kaimas")
  assert.equal(article.data.noindex,true)
  assert.equal(article.data.autorius,"Lietuvos istorijos žinių lobynas")
  assert.match(article.data.media_primary_thumb_url,/vinkus-vitkauskas/)
  assert.equal(curation.B.hero,"brostwa")
  assert.equal(curation.B.slug,"valancius-nuo-sakyklos-iki-skaitytojo")
})

test("B article has requested main-text length and eight independent illustrations", () => {
  const main=article.content.split("## Šaltiniai")[0].replace(/<details[\s\S]*?<\/details>/g,"").replace(/<figure[\s\S]*?<\/figure>/g,"").replace(/<!--[\s\S]*?-->/g,"").replace(/<[^>]*>/g,"")
  const words=main.split(/\s+/).filter(Boolean).length
  assert.ok(words>=3000&&words<=3500,`${words} main words`)
  const figures=[...article.content.matchAll(/<figure class="valancius-figure">[\s\S]*?<\/figure>/g)]
  assert.equal(figures.length,8)
  assert.equal(new Set(figures.map(f=>f[0].match(/src="([^"]+)/)?.[1])).size,8)
  assert.match(figures[0][0],/loading="eager"/)
  assert.ok(figures.slice(1).every(f=>f[0].includes('loading="lazy"')))
})

test("A curatorial prose is unchanged; B uses five sections with eight nonduplicated objects", () => {
  assert.deepEqual(curation.A,before.A)
  assert.equal(curation.B.sections.length,5)
  const items=curation.B.sections.flatMap((s:any)=>s.items)
  assert.equal(items.length,8)
  const oldKeys=before.A.sections.flatMap((s:any)=>s.items.map((i:any)=>i.key))
  assert.ok(items.every((i:any)=>!oldKeys.includes(i.key)))
  assert.ok(items.every((i:any)=>!['altorius','litanija','giesmynas','vyskupyste'].includes(i.key)))
  assert.ok(items.some((i:any)=>i.key==='medalis'&&i.date.includes('1889')))
  for(const s of curation.B.sections){
    const count=s.lead.split(/\s+/).length;assert.ok(count>=60&&count<=100)
    for(const i of s.items){const count=i.description.split(/\s+/).length;assert.ok(count>=70&&count<=120,i.key)}
  }
})

test("withdrawn media are preserved while B navigation uses new titles", () => {
  const catalog=JSON.parse(read("quartz/static/mediaCatalogSource.json")).entries
  const old=JSON.parse(read("scripts/valancius/archive/b-before-2026-09-14/exhibit-register.json"))
  assert.ok(old.every((i:any)=>catalog.some((e:any)=>e.mediaId===i.mediaId)))
  const exported=JSON.parse(read("quartz/static/exhibitionValancius.json")).exhibitions
  for(const e of exported){
    assert.equal(e.status,'draft');assert.equal(e.noindex,true)
    assert.equal(e.relatedContent.length,4)
    assert.ok(e.relatedContent.some((l:any)=>l.title==='Karčema, pažadas, permaina · paroda'))
  }
})
