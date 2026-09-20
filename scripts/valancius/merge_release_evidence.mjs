/** Compose the reviewed, DB-bound evidence export with a newer public release.
 * Never removes existing claims, citations, object modules or authored summaries.
 * Both inputs must match their committed projection manifests. No IDs are minted.
 */
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
const [base, reviewed] = process.argv.slice(2)
if (!base || !reviewed) throw new Error('Usage: merge_release_evidence.mjs BASE REVIEWED_EXPORT')
const git = (...args) => execFileSync('git', args, {encoding:'utf8',maxBuffer:32*1024*1024})
const show = (ref, path) => git('show', `${ref}:${path}`)
const hash = text => createHash('sha256').update(text).digest('hex')
const manifest = JSON.parse(show(base, 'public-projection-manifest.json'))
const source = JSON.parse(show(reviewed, 'public-projection-manifest.json'))
const notes = git('diff-tree','--no-commit-id','--name-only','-r','-z',reviewed).split('\0').filter(p=>p.startsWith('objektai/'))
const receipt = {base, reviewed, notes:[]}
function parse(text) {
  const sections = text.split(/^(?=## )/m)
  const claims = sections.find(s=>s.startsWith('## Teiginiai\n')) || ''
  const quotes = sections.find(s=>s.startsWith('## Citatos\n')) || ''
  const claimMap = new Map([...claims.matchAll(/(<a id="claim-(t-\d+)"[^]*?)(?=<a id="claim-t-|$)/g)].map(m=>[m[2],m[1].trim()]))
  const quoteMap = new Map([...quotes.matchAll(/(^- id: (c-\d+)\n[^]*?)(?=^- id: c-|$(?![^]))/gm)].map(m=>[m[2],m[1].trim()]))
  if ((claims.match(/<a id="claim-/g)||[]).length!==claimMap.size) throw new Error('Unparsed claim')
  if ((quotes.match(/^- id:/gm)||[]).length!==quoteMap.size) throw new Error('Unparsed citation')
  return {sections,claimMap,quoteMap}
}
for (const note of notes) {
  const current = show(base,note), incoming = show(reviewed,note)
  for(const [text,entry] of [[current,manifest.files[note]],[incoming,source.files[note]]])
    if(hash(text)!==entry?.rendered_hash) throw new Error(`Unbound export: ${note}`)
  const a=parse(current), b=parse(incoming)
  // Keep current local IDs. Assign only already allocated incoming global IDs
  // an unused page-local ordinal (not a new global identifier).
  const merged = new Map(a.claimMap)
  let ordinal=Math.max(0,...[...merged.values()].map(v=>Number(v.match(/^- t-(\d+)/m)?.[1]||0)))
  for(const [id,block] of b.claimMap) {
    const local=merged.get(id)?.match(/^- (t-\d+)/m)?.[1] || `t-${String(++ordinal).padStart(3,'0')}`
    merged.set(id,block.replace(/^- t-\d+/m,`- ${local}`))
  }
  const quotes=new Map([...a.quoteMap,...b.quoteMap])
  for(const [id,block] of quotes) {
    const supporting=[...merged.values()].filter(v=>new RegExp(`^    - ${id}$`,'m').test(v)).map(v=>v.match(/^- (t-\d+)/m)[1])
    // Standalone quotations are valid; do not invent a claim for them.
    quotes.set(id,block.replace(/\n  pagrind[žz]ia:\n(?:    - t-\d+\n?)*/g,'').trim()+(supporting.length?'\n  pagrindzia:\n'+supporting.map(v=>`    - ${v}`).join('\n'):''))
  }
  const claimsText='## Teiginiai\n\n'+[...merged.values()].join('\n\n')+'\n\n'
  const quotesText='## Citatos\n\n'+[...quotes.values()].join('\n\n')+'\n'
  let output=a.sections.map(s=>s.startsWith('## Teiginiai\n')?claimsText:s.startsWith('## Citatos\n')?quotesText:s).join('')
  if(!a.sections.some(s=>s.startsWith('## Teiginiai\n'))) output+='\n'+claimsText
  if(!a.sections.some(s=>s.startsWith('## Citatos\n'))) output+='\n'+quotesText
  if(merged.size!==a.claimMap.size) output=output.replace(/^object_page_claim_count:.*$/m,`object_page_claim_count: '${merged.size}'`)
  fs.writeFileSync(note,output)
  manifest.files[note]={...manifest.files[note],rendered_hash:hash(output),projection_mode:'authored_object_page',evidence_export_hash:hash(incoming),evidence_export_content_hash:source.files[note].content_hash,evidence_base_hash:hash(current)}
  receipt.notes.push({note,retainedClaimIds:[...a.claimMap.keys()],retainedCitationIds:[...a.quoteMap.keys()],retainedClaims:a.claimMap.size,reviewedClaims:b.claimMap.size,publishedClaims:merged.size,retainedCitations:a.quoteMap.size,publishedCitations:quotes.size})
}
fs.writeFileSync('public-projection-manifest.json',JSON.stringify(manifest,null,2)+'\n')
fs.writeFileSync('scripts/valancius/review/release-evidence-merge.json',JSON.stringify(receipt,null,2)+'\n')
console.log(JSON.stringify(receipt,null,2))
