import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import yaml from "js-yaml"
import { unescapeHTML } from "../quartz/util/escape"
import { slugTag } from "../quartz/util/path"
import { seoDescription, seoTitle } from "../quartz/util/seo"

const sourceRoot = path.resolve("straipsniai")
const publicRoot = path.resolve(process.env.PUBLIC_ROOT ?? "public")
const siteOrigin = String(process.env.SITE_ORIGIN ?? "https://lietuvosistorija.eu").replace(
  /\/$/,
  "",
)
const suffix = " – Lietuvos istorija"
const organizationName = "Lietuvos istorijos žinių lobynas"
const failures: string[] = []
const articles = fs
  .readdirSync(sourceRoot)
  .filter((name) => name.endsWith(".md") && name !== "index.md")
  .sort()

function fail(article: string, message: string) {
  failures.push(`${article}: ${message}`)
}

function bodyText(value: string): string {
  return unescapeHTML(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")).trim()
}

function metaContent(html: string, key: string): string {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const tag = html.match(
    new RegExp(`<meta\\b(?=[^>]*(?:property|name)=["']${escaped}["'])[^>]*>`, "i"),
  )?.[0]
  return unescapeHTML(tag?.match(/\bcontent=(["'])([\s\S]*?)\1/i)?.[2] ?? "")
}

function jsonLdNodes(html: string): Record<string, unknown>[] {
  const nodes: Record<string, unknown>[] = []
  for (const match of html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const parsed = JSON.parse(match[1]) as { "@graph"?: unknown }
      if (Array.isArray(parsed["@graph"])) {
        nodes.push(
          ...parsed["@graph"].filter((node): node is Record<string, unknown> =>
            Boolean(node && typeof node === "object" && !Array.isArray(node)),
          ),
        )
      }
    } catch {
      // Required Article nodes below report missing or malformed structured data.
    }
  }
  return nodes
}

if (articles.length !== 7) failures.push(`expected 7 editorial articles, found ${articles.length}`)

for (const filename of articles) {
  const article = filename.slice(0, -3)
  const markdown = fs.readFileSync(path.join(sourceRoot, filename), "utf8")
  const parsed = matter(markdown, {
    engines: { yaml: (source) => yaml.load(source, { schema: yaml.JSON_SCHEMA }) as object },
  })
  const fm = parsed.data as Record<string, unknown>
  const title = String(fm.title ?? "").trim()
  const description = String(fm.description ?? "").trim()
  const image = String(fm.image ?? fm.media_primary_thumb_url ?? "").trim()
  const imageAlt = String(fm.media_social_alt ?? "").trim()
  const tags = Array.isArray(fm.tags) ? fm.tags : []
  const author = String(fm.autorius ?? "").trim()
  const published = String(fm.date ?? "").trim()
  const modified = String(fm.atnaujinta ?? fm.modified ?? fm.date ?? "").trim()
  const pagePath = path.join(publicRoot, "straipsniai", article, "index.html")
  const pageUrl = `${siteOrigin}/straipsniai/${article}/`
  const sitemapPath = path.join(publicRoot, "sitemap.xml")

  if (fm.tipas !== "straipsnis") fail(article, "frontmatter type is not straipsnis")
  if (fm.statusas !== "paskelbta") fail(article, "article is not marked as published")
  if (fm.noindex !== false) fail(article, "frontmatter must explicitly set noindex: false")
  if (!title || !description || description.length < 50 || description.length > 158)
    fail(article, "missing or search-unfriendly title/description")
  if (!author || author !== organizationName)
    fail(article, "missing visible editorial organization")
  if (!/^\d{4}-\d{2}-\d{2}$/.test(published) || !/^\d{4}-\d{2}-\d{2}$/.test(modified))
    fail(article, "published and modified dates must be ISO calendar dates")
  if (!fm.seo_title) fail(article, "missing curated search title")
  if (!image || !fs.existsSync(path.join(publicRoot, image.replace(/^\//, ""))))
    fail(article, "primary image is missing from the build")
  if (!imageAlt) fail(article, "primary image needs a descriptive social alt")
  if (!Number(fm.media_primary_width) || !Number(fm.media_primary_height))
    fail(article, "primary image dimensions are missing")
  if (!fs.existsSync(pagePath)) {
    fail(article, "rendered article page is missing")
    continue
  }

  const html = fs.readFileSync(pagePath, "utf8")
  const expectedTitle = seoTitle({ title, seoTitle: fm.seo_title }, "Lietuvos istorija", suffix)
  const expectedDescription = seoDescription({ title, description })
  if (!html.includes(`<link rel="canonical" href="${pageUrl}"`))
    fail(article, "canonical URL is missing or incorrect")
  if (metaContent(html, "description") !== expectedDescription)
    fail(article, "meta description differs from curated text")
  if (
    metaContent(html, "og:title") !== expectedTitle ||
    metaContent(html, "twitter:title") !== expectedTitle
  )
    fail(article, "social title differs from curated search title")
  if (metaContent(html, "og:description") !== expectedDescription)
    fail(article, "Open Graph description differs from curated text")
  const absoluteImage = new URL(image, `${siteOrigin}/`).toString()
  if (
    metaContent(html, "og:image") !== absoluteImage ||
    metaContent(html, "twitter:image") !== absoluteImage
  )
    fail(article, "social image is missing or does not match the article's primary image")
  if (
    metaContent(html, "og:image:width") !== String(fm.media_primary_width) ||
    metaContent(html, "og:image:height") !== String(fm.media_primary_height)
  )
    fail(article, "social image dimensions do not match the primary image")
  if (
    metaContent(html, "og:image:alt") !== imageAlt ||
    metaContent(html, "twitter:image:alt") !== imageAlt
  )
    fail(article, "social image alt does not describe the primary image")
  if (html.includes('name="robots" content="noindex'))
    fail(article, "published article is rendered noindex")
  const renderedHero = [...html.matchAll(/<img\b[^>]*>/gi)].some((match) => {
    const tag = match[0]
    const source = tag.match(/\bsrc=["']([^"']*)["']/i)?.[1]
    const alt = tag.match(/\balt=["']([^"']*)["']/i)?.[1] ?? ""
    return (
      source &&
      new URL(unescapeHTML(source), pageUrl).toString() === absoluteImage &&
      unescapeHTML(alt) === imageAlt
    )
  })
  if (!renderedHero)
    fail(article, "primary image or its descriptive alt is missing from article content")
  if (!bodyText(html).includes(`Parengė ${organizationName} · atnaujinta 2026-09-27.`))
    fail(article, "visible article byline is missing")

  const graph = jsonLdNodes(html)
  const articleNodes = graph.filter((node) => node["@type"] === "Article")
  if (articleNodes.length !== 1) {
    fail(article, `expected one Article schema node, found ${articleNodes.length}`)
  } else {
    const schema = articleNodes[0]
    const orgId = `${siteOrigin}/#organization`
    if (schema["@id"] !== `${pageUrl}#entity`)
      fail(article, "Article schema @id does not match canonical page")
    if (schema.headline !== title) fail(article, "Article headline differs from editorial title")
    if (schema.datePublished !== published || schema.dateModified !== modified)
      fail(article, "Article schema dates differ from publication metadata")
    if (schema.inLanguage !== "lt-LT") fail(article, "Article schema language is not lt-LT")
    if (schema.image !== new URL(image, `${siteOrigin}/`).toString())
      fail(article, "Article schema image is not the primary image")
    for (const role of ["author", "publisher"]) {
      const organization = schema[role] as Record<string, unknown> | undefined
      if (
        organization?.["@type"] !== "Organization" ||
        organization.name !== organizationName ||
        organization["@id"] !== orgId
      )
        fail(article, `Article ${role} is missing the named organization`)
    }
    const expectedKeywords = tags.map((tag) => slugTag(String(tag)))
    if (JSON.stringify(schema.keywords) !== JSON.stringify(expectedKeywords))
      fail(article, "Article schema keywords differ from editorial tags")
  }

  if (
    fs.existsSync(sitemapPath) &&
    !fs.readFileSync(sitemapPath, "utf8").includes(`<loc>${pageUrl}</loc>`)
  )
    fail(article, "canonical article URL is missing from the sitemap")
}

const robotsPath = path.join(publicRoot, "robots.txt")
const robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, "utf8") : ""
if (!/User-agent: \*\s+Allow: \/\s/i.test(robots))
  failures.push("robots.txt does not allow general crawlers")
if (!/User-agent: OAI-SearchBot\s+Allow: \/\s/i.test(robots))
  failures.push("robots.txt does not allow OAI-SearchBot")
if (!robots.includes(`Sitemap: ${siteOrigin}/sitemap.xml`))
  failures.push("robots.txt does not declare the sitemap")

console.log(JSON.stringify({ articles: articles.length, siteOrigin, failures }, null, 2))
if (failures.length) process.exitCode = 1
