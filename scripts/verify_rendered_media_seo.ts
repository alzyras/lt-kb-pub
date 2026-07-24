import fs from "node:fs"
import path from "node:path"
import { unescapeHTML } from "../quartz/util/escape"
import { displayCaption, mediaDetailSlug, mediaImageUrl, type MediaEntry } from "../quartz/util/objectMedia"

const publicRoot = path.resolve(process.env.PUBLIC_ROOT ?? "public")
const siteOrigin = String(process.env.SITE_ORIGIN ?? "https://lietuvosistorija.eu").replace(/\/$/, "")
const placeholderCaption = /^(?:atvaizdas|vaizdas|image|unknown|nenurodyta|nežinoma)$/i

function fail(failures: string[], message: string) {
  failures.push(message)
}

function text(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim()
}

function htmlEscape(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function readJson<T>(relativePath: string): T | undefined {
  try {
    return JSON.parse(fs.readFileSync(path.join(publicRoot, relativePath), "utf8")) as T
  } catch {
    return undefined
  }
}

function htmlForMedia(entry: MediaEntry): { relative: string; html: string } | undefined {
  // Gallery pages and their sitemap entries are emitted from the canonical
  // title+media-id slug. `detailUrl` may be a legacy redirect and must not be
  // used as the SEO verification target.
  const relative = `${mediaDetailSlug(entry).replace(/^\/+/, "")}/index.html`
  const filePath = path.join(publicRoot, relative)
  if (!fs.existsSync(filePath)) return undefined
  return { relative, html: fs.readFileSync(filePath, "utf8") }
}

function jsonLdNodes(html: string): Record<string, unknown>[] {
  const nodes: Record<string, unknown>[] = []
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1]) as unknown
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) continue
      const graph = (parsed as { "@graph"?: unknown })["@graph"]
      if (Array.isArray(graph)) {
        nodes.push(...graph.filter((node): node is Record<string, unknown> => Boolean(node && typeof node === "object" && !Array.isArray(node))))
      } else {
        nodes.push(parsed as Record<string, unknown>)
      }
    } catch {
      // A malformed JSON-LD block is reported by the required schema below.
    }
  }
  return nodes
}

function isImageObject(node: Record<string, unknown>): boolean {
  const type = node["@type"]
  return type === "ImageObject" || (Array.isArray(type) && type.includes("ImageObject"))
}

function metaContent(html: string, property: string): string {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const tag = html.match(new RegExp(`<meta\\b(?=[^>]*(?:property|name)=["']${escaped}["'])[^>]*>`, "i"))?.[0]
  return text(unescapeHTML(tag?.match(/\bcontent=["']([^"']*)["']/i)?.[1] ?? ""))
}

const failures: string[] = []
const catalog = readJson<MediaEntry[]>("static/mediaCatalog.json")
const sitemapPath = path.join(publicRoot, "sitemap.xml")
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, "utf8") : ""

if (!Array.isArray(catalog) || !catalog.length) {
  fail(failures, "static/mediaCatalog.json is missing or empty")
} else if (!sitemap) {
  fail(failures, "sitemap.xml is missing")
} else {
  const seen = new Set<string>()
  for (const [index, entry] of catalog.entries()) {
    const mediaId = text(entry.mediaId)
    const label = mediaId || `catalog[${index}]`
    if (!mediaId || seen.has(mediaId)) {
      fail(failures, `${label}: missing or duplicate mediaId`)
      continue
    }
    seen.add(mediaId)

    const caption = displayCaption(entry)
    if (caption.length < 5 || placeholderCaption.test(caption)) {
      fail(failures, `${mediaId}: weak caption "${caption}"`)
    }
    const imageUrl = mediaImageUrl(entry)
    try {
      const url = new URL(imageUrl)
      if (!(url.protocol === "https:" || url.protocol === "http:")) throw new Error("unsupported protocol")
    } catch {
      fail(failures, `${mediaId}: invalid image URL`)
      continue
    }

    const page = htmlForMedia(entry)
    if (!page) {
      fail(failures, `${mediaId}: missing gallery detail page`)
      continue
    }
    const canonicalUrl = `${siteOrigin}/${mediaDetailSlug(entry)}`
    if (!page.html.includes(`<link rel="canonical" href="${htmlEscape(canonicalUrl)}"`)) {
      fail(failures, `${page.relative}: missing or incorrect canonical URL`)
    }
    if (!page.html.includes(`src="${htmlEscape(imageUrl)}"`)) {
      fail(failures, `${page.relative}: rendered image does not use catalog source URL`)
    }
    if (!page.html.includes(`alt="${htmlEscape(caption)}"`)) {
      fail(failures, `${page.relative}: image alt does not equal DB caption`)
    }
    if (metaContent(page.html, "og:image:alt") !== caption) {
      fail(failures, `${page.relative}: og:image:alt does not equal DB caption`)
    }
    if (metaContent(page.html, "twitter:image:alt") !== caption) {
      fail(failures, `${page.relative}: twitter:image:alt does not equal DB caption`)
    }

    const images = jsonLdNodes(page.html).filter(isImageObject)
    if (images.length !== 1) {
      fail(failures, `${page.relative}: expected exactly one ImageObject, found ${images.length}`)
    } else {
      const image = images[0]
      if (image["@id"] !== `${canonicalUrl}#image`) fail(failures, `${page.relative}: wrong ImageObject @id`)
      if (text(image.name) !== caption || text(image.caption) !== caption) {
        fail(failures, `${page.relative}: ImageObject name/caption does not equal DB caption`)
      }
      if (text(image.contentUrl) !== imageUrl) fail(failures, `${page.relative}: ImageObject contentUrl mismatch`)
      if (entry.creator && !image.creator) fail(failures, `${page.relative}: missing ImageObject creator`)
      if (entry.licenseUrl && text(image.license) !== text(entry.licenseUrl)) {
        fail(failures, `${page.relative}: ImageObject license mismatch`)
      }
    }

    const sitemapEntry = sitemap.match(
      new RegExp(
        `<url>\\s*<loc>${htmlEscape(canonicalUrl)}</loc>[\\s\\S]*?<image:loc>${htmlEscape(imageUrl)}</image:loc>[\\s\\S]*?</url>`,
      ),
    )
    if (!sitemapEntry) fail(failures, `${mediaId}: sitemap lacks canonical page + image URL pair`)
  }
}

console.log(JSON.stringify({ catalogEntries: Array.isArray(catalog) ? catalog.length : 0, failures }, null, 2))
if (failures.length) process.exitCode = 1
