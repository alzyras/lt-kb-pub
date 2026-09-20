/** Project copy edits from curation to existing records; preserve identities and evidence. */
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import matter from 'gray-matter'

const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const save = (p, value) => fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n')
const curated = read('scripts/valancius/curation.json')
const registry = read('scripts/valancius/exhibit-register.json')
let catalogueText = fs.readFileSync('quartz/static/mediaCatalogSource.json', 'utf8')
const catalogue = JSON.parse(catalogueText)
const exported = read('quartz/static/exhibitionValancius.json')
const article = matter(fs.readFileSync('straipsniai/kaip-valancius-keite-kasdienybe.md', 'utf8'))
const links = article.data.relatedContent
for (const source of Object.values(curated)) {
  const exhibition = exported.exhibitions.find(e => e.exhibitionId === source.slug)
  if (!exhibition) throw new Error(`Missing exported exhibition ${source.slug}`)
  for (const field of ['title', 'seo_title', 'subtitle', 'description']) exhibition[field] = source[field]
  exhibition.status = source.status || 'draft'
  exhibition.noindex = source.noindex ?? true
  exhibition.relatedContent = links
  exhibition.updatedAt = article.data.atnaujinta
  for (const section of source.sections) {
    const target = exhibition.sections.find(s => s.slug === section.slug)
    if (!target) throw new Error(`Missing section ${section.slug}`)
    target.title = section.title
    target.lead = section.lead
    for (const item of section.items) {
      const record = registry.find(r => r.key === item.key)
      const exportedItem = target.items.find(i => i.mediaId === record?.mediaId)
      const media = catalogue.entries.find(e => e.mediaId === record?.mediaId)
      if (!record || !exportedItem || !media) throw new Error(`Missing item ${item.key}`)
      exportedItem.titleLt = item.title
      exportedItem.descriptionLt = item.description
      exportedItem.catalogDescriptionLt = item.description
      exportedItem.evidenceNoteLt = 'Eksponato kilmė ir data nurodytos katalogo kortelėje. Susietas istorinis šaltinis papildo jo aprašymą.'
      if (media.visualEvidence !== item.description) {
        const before = JSON.stringify(media.visualEvidence)
        if (catalogueText.split(before).length !== 2) throw new Error(`Ambiguous media prose ${item.key}`)
        catalogueText = catalogueText.replace(before, JSON.stringify(item.description))
        media.visualEvidence = item.description
      }
      exportedItem.media.visualEvidence = item.description
      if (exhibition.hero?.mediaId === record.mediaId) exhibition.hero.visualEvidence = item.description
    }
  }
}
save('scripts/valancius/b-curation.json', curated.B)
// Preserve unrelated exporter formatting (for example confidence: 1.0).
fs.writeFileSync('quartz/static/mediaCatalogSource.json', catalogueText)
save('quartz/static/exhibitionValancius.json', exported)
execFileSync('node_modules/.bin/tsx', ['scripts/valancius/register_exhibits.ts'], { stdio: 'inherit' })
