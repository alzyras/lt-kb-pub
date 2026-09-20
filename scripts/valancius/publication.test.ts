import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'
import { objectDetailEvidenceFromFile } from '../../quartz/util/objectDetail'

const json=(path:string)=>JSON.parse(fs.readFileSync(path,'utf8'))
const register=json('scripts/valancius/evidence-register.json')
const receipt=json('scripts/valancius/review/release-evidence-merge.json')
const normalize=(s:string)=>s.replace(/\s+/g,' ').trim()

test('publication preserves every pre-existing global claim and citation in the scoped merge',()=>{
  for(const note of receipt.notes){
    const text=fs.readFileSync(note.note,'utf8')
    for(const id of note.retainedClaimIds) assert.ok(text.includes(`<a id="claim-${id}"`),`${note.note}: ${id}`)
    for(const id of note.retainedCitationIds) assert.match(text,new RegExp(`^- id: ${id}$`,'m'))
    assert.ok(note.publishedClaims>=note.retainedClaims)
    assert.ok(note.publishedCitations>=note.retainedCitations)
  }
})

test('every used editorial claim is present with its original source quotation',()=>{
  for(const row of register.filter((r:any)=>r.usedBy.length)){
    const parsed=objectDetailEvidenceFromFile(row.notePath)
    const claim=parsed.claims.find(c=>c.id===row.claimId||c.globalIds?.includes(row.claimId))
    assert.ok(claim,`${row.notePath}: ${row.claimId}`)
    assert.equal(normalize(claim.text),normalize(row.claim))
    for(const quote of row.evidence){
      const citation=parsed.citations.get(quote.citationId)
      assert.ok(citation,quote.citationId)
      assert.equal(normalize(citation.fields.get('citata_originali')||''),normalize(quote.exactOriginal),quote.citationId)
      assert.ok(claim.citationIds.includes(quote.citationId),`${row.claimId} -> ${quote.citationId}`)
    }
  }
})

test('only reviewed exhibits enter the approved public cycle',()=>{
  const items=json('scripts/valancius/exhibit-register.json')
  assert.equal(items.length,16)
  assert.equal(new Set(items.map((i:any)=>i.mediaId)).size,16)
  assert.ok(items.every((i:any)=>i.reviewStatus==='approved-for-publication'&&!i.hold))
})
