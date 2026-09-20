/** Project only canonical Wikipedia modules; preserve every local evidence block. */
import fs from 'node:fs'
import crypto from 'node:crypto'
import matter from 'gray-matter'
const [input] = process.argv.slice(2)
if (!input) throw new Error('Usage: node scripts/museum/project_wikipedia.mjs BACKEND_REPORT')
const report=JSON.parse(fs.readFileSync(input,'utf8'))
const manifest=JSON.parse(fs.readFileSync('public-projection-manifest.json','utf8'))
const hash=s=>crypto.createHash('sha256').update(s).digest('hex')
let updated=0
for(const {notePath,wiki} of report.objects){
  if(!notePath.startsWith('objektai/') || notePath.includes('..') || !manifest.files[notePath]) throw new Error(`Not a projected object: ${notePath}`)
  if(wiki.extraction_version!=='wikipedia-rendered-v2' || !wiki.intro || !wiki.source.revision_id) throw new Error(`Incomplete Wikipedia snapshot: ${notePath}`)
  const current=matter(fs.readFileSync(notePath,'utf8'))
  const view=typeof current.data.object_page_view_json==='string'?JSON.parse(current.data.object_page_view_json):current.data.object_page_view_json||{}
  view.wiki=wiki
  current.data.object_page_view_json=JSON.stringify(view)
  const result=matter.stringify(current.content,current.data,{lineWidth:-1})
  fs.writeFileSync(notePath,result)
  manifest.files[notePath]={...manifest.files[notePath],rendered_hash:hash(result),projection_mode:'authored_object_page',wikipedia_snapshot_version:wiki.extraction_version}
  updated++
}
fs.writeFileSync('public-projection-manifest.json',JSON.stringify(manifest,null,2)+'\n')
console.log(`Projected ${updated} complete Wikipedia snapshots.`)
