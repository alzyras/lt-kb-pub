/** Overlay scoped DB output while retaining the audited public evidence verbatim. */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import matter from 'gray-matter'
const [exportRoot] = process.argv.slice(2)
if (!exportRoot) throw new Error('Usage: node scripts/museum/project_curated.mjs DB_EXPORT_DIRECTORY')
const report = JSON.parse(fs.readFileSync(path.join(exportRoot,'objects.json'),'utf8'))
const curated = JSON.parse(fs.readFileSync('scripts/museum/curated-input.json','utf8'))
const manifest = JSON.parse(fs.readFileSync('public-projection-manifest.json','utf8'))
const parse = (v, fallback={}) => { try{return typeof v==='string'?JSON.parse(v):v||fallback}catch{return fallback} }
const hash = text => crypto.createHash('sha256').update(text).digest('hex')
for (const obj of report.objects) {
  const exists = fs.existsSync(obj.notePath)
  const current = matter(exists ? fs.readFileSync(obj.notePath,'utf8') : obj.canonical_text)
  const view = parse(current.data.object_page_view_json)
  const media = obj.media
  view.wiki = obj.wiki
  view.portrait = {media_id:media.mediaId}
  view.version = 3
  view.counts = {...view.counts,gallery:Math.max(1,view.counts?.gallery||0)}
  view.related_content ||= {}
  if(obj.notePath.includes('/asmenys/')) view.related_content.exhibitions = [{slug:curated.exhibition.slug,title:curated.exhibition.title}, ...(view.related_content.exhibitions||[]).filter(x=>x.slug!==curated.exhibition.slug)]
  current.data.object_page_view_json=JSON.stringify(view)
  if(!exists) current.data.museum_external_only=true
  const rejected = obj.notePath === 'objektai/asmenys/Daumantas.md' ? new Set(['m-15513ab57f711e9781350d2c','m-c772ce26865ac2052da559d3']) : new Set()
  const keep = x => x.mediaId!==media.mediaId && x.sourceUrl!==media.sourceUrl && !rejected.has(x.mediaId)
  const all=[media,...parse(current.data.media_all_json,[]).filter(keep)]
  const direct=[media,...parse(current.data.media_direct_json,[]).filter(keep)]
  Object.assign(current.data, {media_primary_json:JSON.stringify(media),media_primary_thumb_url:media.displayUrl,media_primary_canonical_url:media.canonicalUrl,media_primary_directness:'direct',media_primary_relation_type:media.relationType,media_all_json:JSON.stringify(all),media_direct_json:JSON.stringify(direct),media_total_count:all.length,media_primary_width:media.width,media_primary_height:media.height})
  const result=matter.stringify(current.content,current.data,{lineWidth:-1})
  fs.mkdirSync(path.dirname(obj.notePath),{recursive:true});fs.writeFileSync(obj.notePath,result)
  const prior=manifest.files[obj.notePath]
  manifest.files[obj.notePath]={content_hash:prior?.content_hash||obj.content_hash,rendered_hash:hash(result),projection_mode:'authored_object_page',enrichment_source_hash:hash(JSON.stringify(obj)),curation:'museum-20260920'}
}
fs.writeFileSync('public-projection-manifest.json',JSON.stringify(manifest,null,2)+'\n')
const catalogue=JSON.parse(fs.readFileSync('quartz/static/mediaCatalogSource.json','utf8'))
const fresh=JSON.parse(fs.readFileSync(path.join(exportRoot,'museumMediaCatalog.json'),'utf8'))
const ids=new Set(fresh.entries.map(x=>x.mediaId));catalogue.entries=[...catalogue.entries.filter(x=>!ids.has(x.mediaId)),...fresh.entries]
fs.writeFileSync('quartz/static/mediaCatalogSource.json',JSON.stringify(catalogue,null,2)+'\n')
fs.copyFileSync(path.join(exportRoot,'exhibitionRulers.json'),'quartz/static/exhibitionRulers.json')
fs.writeFileSync('quartz/static/rulersSource.json',JSON.stringify({version:1,rulers:curated.rulers},null,2)+'\n')
fs.mkdirSync('scripts/reports',{recursive:true})
fs.writeFileSync('scripts/reports/museum-curation.json',JSON.stringify({objects:report.objects.map(x=>x.notePath),reactivated:report.created_or_reactivated,rulers:curated.rulers.length,media:report.media_ids.length,exhibition:report.exhibition,publication:'Local preview; exhibition remains draft in backend; main unchanged'},null,2)+'\n')
console.log(`Projected ${report.objects.length} objects, ${curated.rulers.length} rulers and the draft exhibition.`)
