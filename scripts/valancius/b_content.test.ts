import assert from "node:assert/strict"
import test from "node:test"
import fs from "node:fs"
import matter from "gray-matter"
const read = (p: string) => fs.readFileSync(p, "utf8")
const curation = JSON.parse(read("scripts/valancius/curation.json"))
const before = JSON.parse(read("scripts/valancius/archive/b-before-2026-09-14/curation.json"))
const article = matter(read("straipsniai/kaip-valancius-keite-kasdienybe.md"))

test("B keeps its URL, approved publication state, authorship and distinct social image", () => {
  assert.equal(article.data.title,"Kodėl kaimas gėrė ir kaip Valančius ragino negerti")
  assert.equal(article.data.seo_title,"Kodėl kaimas gėrė ir kaip Valančius ragino negerti")
  assert.equal(article.data.noindex,false)
  assert.equal(article.data.autorius,"Lietuvos istorijos žinių lobynas")
  assert.match(article.data.media_primary_thumb_url,/vinkus-vitkauskas/)
  assert.equal(curation.B.hero,"brostwa")
  assert.equal(curation.B.slug,"valancius-nuo-sakyklos-iki-skaitytojo")
})

test("B retains a substantial edited article and eight independent illustrations", () => {
  const main=article.content.split("## Šaltiniai")[0].replace(/<details[\s\S]*?<\/details>/g,"").replace(/<figure[\s\S]*?<\/figure>/g,"").replace(/<!--[\s\S]*?-->/g,"").replace(/<[^>]*>/g,"")
  const words=main.split(/\s+/).filter(Boolean).length
  // September 20 copy edit removes repeated methodological commentary.
  assert.ok(words>=2500&&words<=3500,`${words} main words`)
  const figures=[...article.content.matchAll(/<figure class="valancius-figure">[\s\S]*?<\/figure>/g)]
  assert.equal(figures.length,8)
  assert.equal(new Set(figures.map(f=>f[0].match(/src="([^"]+)/)?.[1])).size,8)
  assert.match(figures[0][0],/loading="eager"/)
  assert.ok(figures.slice(1).every(f=>f[0].includes('loading="lazy"')))
})

test("A selection is preserved through copy editing; B keeps five sections and eight objects", () => {
  const identities = (exhibition:any) => exhibition.sections.flatMap((s:any) =>
    s.items.map(({description, ...item}:any) => item))
  assert.deepEqual(identities(curation.A), identities(before.A))
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
    assert.equal(e.status,'published');assert.equal(e.noindex,false)
    assert.equal(e.relatedContent.length,4)
    assert.ok(e.relatedContent.some((l:any)=>l.title==='Valančiaus blaivybės brolijos · paroda'))
  }
})
