/** Add the already reviewed encyclopedia and artwork layers to the split ruler. */
import fs from 'node:fs'
import crypto from 'node:crypto'
import matter from 'gray-matter'
const path='objektai/asmenys/Daumantas (Lietuvos valdovas).md'
const input=JSON.parse(fs.readFileSync('scripts/museum/curated-input.json','utf8'))
const obj=input.objects.find(x=>x.notePath===path)
const ruler=input.rulers.find(x=>x.id==='daumantas')
if(!obj || !ruler || obj.wiki.extraction_version!=='wikipedia-rendered-v2') throw new Error('Reviewed ruler inputs missing')
const doc=matter(fs.readFileSync(path,'utf8'))
if(doc.data.pavadinimas!=='Daumantas (Lietuvos valdovas)') throw new Error('Unexpected identity')
const media=ruler.media
Object.assign(doc.data,{
 object_page_view_json:JSON.stringify({version:3,wiki:obj.wiki,portrait:{media_id:media.mediaId},counts:{gallery:1},related_content:{exhibitions:[{slug:input.exhibition.slug,title:input.exhibition.title}]}}),
 media_primary_json:JSON.stringify(media),media_primary_thumb_url:media.displayUrl,media_primary_canonical_url:media.canonicalUrl,
 media_primary_directness:'direct',media_primary_relation_type:media.relationType,
 media_all_json:JSON.stringify([media]),media_direct_json:JSON.stringify([media]),media_total_count:1,
 media_primary_width:media.width,media_primary_height:media.height,
})
const result=matter.stringify(doc.content,doc.data,{lineWidth:-1});fs.writeFileSync(path,result)
const mpath='public-projection-manifest.json';const manifest=JSON.parse(fs.readFileSync(mpath,'utf8'))
if(!manifest.files[path])throw new Error('Canonical DB export must precede the reviewed overlay')
manifest.files[path]={...manifest.files[path],rendered_hash:crypto.createHash('sha256').update(result).digest('hex'),projection_mode:'authored_object_page',curation:'editorial-identity-review-20260927'}
fs.writeFileSync(mpath,JSON.stringify(manifest,null,2)+'\n')
console.log('Projected reviewed ruler encyclopedia and portrait')
