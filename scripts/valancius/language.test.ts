import assert from "node:assert/strict"
import test from "node:test"
import fs from "node:fs"
import { createHash } from "node:crypto"
import matter from "gray-matter"
import { seoTitle } from "../../quartz/util/seo"

const read = (p:string) => fs.readFileSync(p,"utf8")
const json = (p:string) => JSON.parse(read(p))
const digest = (v:unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex')
const a = 'straipsniai/motiejus-valancius-ir-rusijos-imperija.md'
const b = 'straipsniai/kaip-valancius-keite-kasdienybe.md'
const curation = json('scripts/valancius/curation.json')
const exhibitions = json('quartz/static/exhibitionValancius.json').exhibitions

test('all four approved titles retain distinct URLs, dates and publication metadata', () => {
  for (const [file,title] of [[a,'Valančius ir caro valdžia'],[b,'Kodėl kaimas gėrė ir kaip Valančius ragino negerti']]) {
    const {data} = matter(read(file))
    assert.equal(data.title,title)
    assert.equal(data.seo_title,title)
    assert.equal(data.noindex,false)
    assert.equal(data.statusas,'paskelbta')
    assert.equal(data.atnaujinta,'2026-09-20')
    assert.equal(data.sukurta,'2026-09-13')
    assert.equal(new Date(data.date).toISOString().slice(0,10),'2026-09-20')
    assert.equal(data.relatedContent.length,4)
    assert.ok(seoTitle({title,seoTitle:title}, 'Lietuvos istorija',' – Lietuvos istorija').startsWith(title))
  }
  assert.equal(curation.A.title,'Valančiaus laiškai ir draudžiamos knygos')
  assert.equal(curation.B.title,'Valančiaus blaivybės brolijos')
  for (const e of exhibitions) {
    assert.equal(e.noindex,false)
    assert.equal(e.status,'published')
    assert.deepEqual(e.relatedContent,matter(read(b)).data.relatedContent)
  }
})

test('copy editing preserves every article link and image URL in order', () => {
  // Baseline 9a0b1f0a7d: deliberate copy edit, no identity or evidence migration.
  for (const [p,expected] of [[a,'23fc2a179c872e2147bbab0eb2ae2b8daa36e143eabad42b84579071ecf96c5b'],[b,'18b5618809654c291a3d67f70c7f36228aede5e909e54492bde0f5b39307aeab']])
    assert.equal(digest([...read(p).matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[0])),expected)
  assert.equal(digest(json('scripts/valancius/evidence-register.json')),'8787346671821038ada91c179e9217ac1df1952e5abfc39cafefc0dd6f0dbd91')
})

test('exhibit dates, creators, identities and source evidence survive the rewrite', () => {
  const protectedFields=exhibitions.map((e:any)=>({id:e.exhibitionId,hero:e.heroMediaId,items:e.sections.flatMap((s:any)=>s.items.map((i:any)=>({id:i.exhibitionItemId,mediaId:i.mediaId,claimCodes:i.claimCodes,claims:i.claims,refs:i.claimRefs,creator:i.creatorDisplay,date:i.dateDisplay})))}))
  assert.equal(digest(protectedFields),'25847ab7dcae6f117b0804ab6bf8a79555f382827fa10af478dfdc852793dfd5')
})

test('curation, exhibition, media captions and register contain the same edited prose', () => {
  const register=json('scripts/valancius/exhibit-register.json')
  const media=json('quartz/static/mediaCatalogSource.json').entries
  for(const e of Object.values(curation) as any[]) {
    const exported=exhibitions.find((x:any)=>x.exhibitionId===e.slug)
    assert.equal(exported.title,e.title)
    assert.equal(exported.description,e.description)
    for(const s of e.sections){
      const section=exported.sections.find((x:any)=>x.slug===s.slug)
      assert.equal(section.title,s.title)
      assert.equal(section.lead,s.lead)
      const count=s.lead.split(/\s+/).length
      assert.ok(count>=60&&count<=100)
      for(const i of s.items){
        const record=register.find((r:any)=>r.key===i.key)
        const item=section.items.find((x:any)=>x.mediaId===record.mediaId)
        const entry=media.find((x:any)=>x.mediaId===record.mediaId)
        assert.equal(record.description,i.description)
        assert.equal(item.descriptionLt,i.description)
        assert.equal(item.catalogDescriptionLt,i.description)
        assert.equal(item.media.visualEvidence,i.description)
        assert.equal(entry.visualEvidence,i.description)
        const words=i.description.split(/\s+/).length
        assert.ok(words>=70&&words<=120)
      }
    }
  }
  assert.deepEqual(json('scripts/valancius/b-curation.json'),curation.B)
})

test('B authored text and compiled article have identical prose and unchanged historical quotes', () => {
  const normalize=(s:string)=>matter(s).content.replace(/<details[\s\S]*?<\/details>/g,'').replace(/<figure[\s\S]*?<\/figure>/g,'').replace(/<!--[\s\S]*?-->/g,'').replace(/\s+/g,' ').trim()
  assert.equal(normalize(read(b)),normalize(read('scripts/valancius/b-article.md')))
  for(const quote of ['„Tyluma ir ramybė įsiviešpatavo.“','„Šitą mano gromatą perskaitys kunigai iš ambonos, per tris pagrečias šventes.“']) assert.ok(read(b).includes(quote))
})

test('public copy no longer uses the rejected titles or stock editorial self-commentary', () => {
  const current=[a,b,'straipsniai/index.md','quartz/components/ContentCycle.tsx','quartz/static/exhibitionValancius.json'].map(read).join('\n')
  for(const phrase of ['imperijos šešėlyje','Karčema, pažadas, permaina','Kai kaimas atsisakė degtinės','tarp lojalumo ir pasipriešinimo','Tai nėra mūsų sukurta','Straipsnio tezė siauresnė','Straipsnio ribos sąmoningos','Nerasta literatūra nėra rasta literatūra']) assert.ok(!current.includes(phrase),phrase)
})
