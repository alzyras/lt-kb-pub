import assert from "node:assert/strict"
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { resolve } from "node:path"
import { loadExhibitions } from "../../quartz/util/exhibitions"
import { mediaDetailUrl } from "../../quartz/util/objectMedia"

const pages = [
  "straipsniai/motiejus-valancius-ir-rusijos-imperija",
  "straipsniai/kaip-valancius-keite-kasdienybe",
  "parodos/valancius-laiskai-imperijos-seselyje",
  "parodos/valancius-nuo-sakyklos-iki-skaitytojo",
]
const titles = new Set(),
  descriptions = new Set(),
  images = new Set()
const reports: any[] = []
const publicRoot = process.env.PUBLIC_ROOT || "public"
const cache = new Map<string, string>()
function readPage(slug: string) {
  const base = resolve(publicRoot, slug.replace(/^\/+|\/+$/g, ""))
  const path = [`${base}/index.html`, `${base}.html`].find(existsSync)
  assert.ok(path, `Missing ${base}`)
  if (!cache.has(path)) cache.set(path, readFileSync(path, "utf8"))
  return cache.get(path)!
}
const search = JSON.parse(readFileSync(resolve(publicRoot, "static/searchIndex.json"), "utf8"))
const sitemap = readFileSync(resolve(publicRoot, "sitemap.xml"), "utf8")
const rss = readFileSync(resolve(publicRoot, "index.xml"), "utf8")
for (const slug of pages) {
  const html = readPage(slug)
  assert.ok(!html.includes("broken-internal"), `Stripped internal link: ${slug}`)
  if (slug.startsWith("straipsniai/")) {
    const evidenceLabels = [...html.matchAll(/>([tc]-\d+)<\/a>/g)]
    assert.ok(evidenceLabels.length >= 20, `Missing editorial evidence: ${slug}`)
  }
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1]
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]
  const ogImage = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1]
  assert.ok(title && description && canonical && ogImage, `Incomplete SEO: ${slug}`)
  if (slug === "straipsniai/kaip-valancius-keite-kasdienybe")
    assert.equal(title, "Kodėl kaimas gėrė ir kaip Valančius ragino negerti")
  if (slug === "parodos/valancius-nuo-sakyklos-iki-skaitytojo")
    assert.ok(title.startsWith("Valančiaus blaivybės brolijos"))
  // A complete introductory question can be shorter than 90 characters.
  // Match the shared SEO minimum, and reject genuinely clipped descriptions.
  assert.ok(description.length >= 50 && !description.endsWith("…"), `Truncated description: ${slug}`)
  assert.equal(canonical, `https://lietuvosistorija.eu/${slug}/`)
  assert.match(ogImage, /^https:\/\//)
  assert.doesNotMatch(html, /<meta name="robots" content="noindex/)
  assert.ok(sitemap.includes(canonical), `Published page missing from sitemap: ${slug}`)
  if (slug.startsWith('straipsniai/')) assert.ok(rss.includes(canonical), `Published article missing from RSS: ${slug}`)
  assert.doesNotMatch(html, /peržiūros juodraštis|redakcinė peržiūra|Ši peržiūros versija dar nepaskelbta/)
  assert.ok(search[slug], `Missing internal search result ${slug}`)
  assert.equal((html.match(/aria-label="Motiejaus Valančiaus ciklas"/g) || []).length, 1)
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(
    (m) => JSON.parse(m[1]),
  )
  const entities = schemas.flatMap((s) => s["@graph"] || [s])
  assert.equal(
    entities.filter(
      (e) => e["@type"] === (slug.startsWith("straipsniai") ? "Article" : "CollectionPage"),
    ).length,
    1,
  )
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)]
    .map((m) => new URL(m[1].replaceAll("&amp;", "&"), canonical))
    .filter(
      (url) =>
        url.origin === "https://lietuvosistorija.eu" &&
        (url.hash.startsWith("#claim-t-") || url.pathname.startsWith("/galerija/")),
    )
  for (const url of hrefs) {
    const target = readPage(decodeURIComponent(url.pathname))
    if (url.hash)
      assert.ok(
        target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        `Broken anchor ${url.href}`,
      )
  }
  titles.add(title)
  descriptions.add(description)
  images.add(ogImage)
  reports.push({ slug, title, description, canonical, ogImage, internalLinksChecked: hrefs.length })
}
assert.equal(titles.size, 4)
assert.equal(descriptions.size, 4)
assert.equal(images.size, 4)
for (const exhibition of loadExhibitions().filter((e) => e.exhibitionId.startsWith("valancius-"))) {
  const html = readPage(exhibition.slug)
  for (const section of exhibition.sections)
    for (const item of section.items) {
      assert.ok(
        html.includes(item.descriptionLt),
        `Narrative missing from initial HTML: ${item.exhibitionItemId}`,
      )
      const gallery = readPage(mediaDetailUrl(item.media))
      assert.ok(
        gallery.includes(`href="/${exhibition.slug}/#${item.exhibitionItemId}"`),
        `Missing exhibition return context: ${item.mediaId}`,
      )
      assert.ok(
        html.includes(`id="${item.exhibitionItemId}"`),
        `Missing return anchor: ${item.exhibitionItemId}`,
      )
    }
}
const person = readPage("objektai/asmenys/Motiejus-Valancius")
for (const slug of pages) assert.ok(person.includes(`/${slug}/`), `Missing person link ${slug}`)
for (const slug of pages) {
  const index = readPage(slug.startsWith("straipsniai/") ? "straipsniai" : "parodos")
  assert.ok(index.includes(slug.split("/")[1]), `Missing listing: ${slug}`)
}
mkdirSync("scripts/valancius/review", { recursive: true })
writeFileSync(
  "scripts/valancius/review/preview-verification.json",
  JSON.stringify(reports, null, 2) + "\n",
)
console.log(JSON.stringify(reports, null, 2))
