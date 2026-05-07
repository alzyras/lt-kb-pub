import fs from "node:fs"
import { Root } from "hast"
import { GlobalConfiguration } from "../../cfg"
import { getDate } from "../../components/Date"
import { escapeHTML } from "../../util/escape"
import {
  FilePath,
  FullSlug,
  SimpleSlug,
  joinSegments,
  simplifySlug,
  stripSlashes,
} from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { toHtml } from "hast-util-to-html"
import { write } from "./helpers"
import { i18n } from "../../i18n"
import { collectCitationMetadata, isObjectPage } from "../../util/citationFilter"

export type ContentIndexMap = Map<FullSlug, ContentDetails>
export type ContentDetails = {
  slug: FullSlug
  filePath: FilePath
  title: string
  links: SimpleSlug[]
  tags: string[]
  content: string
  richContent?: string
  date?: Date
  modifiedDate?: Date
  description?: string
  citationFilterable?: boolean
  quoteCount?: number
  citationSourceIds?: string[]
  claimCount?: number
  claims?: string[]
}

interface Options {
  enableSiteMap: boolean
  enableRSS: boolean
  rssLimit?: number
  rssFullHtml: boolean
  rssSlug: string
  includeEmptyFiles: boolean
}

const defaultOptions: Options = {
  enableSiteMap: true,
  enableRSS: true,
  rssLimit: 10,
  rssFullHtml: false,
  rssSlug: "index",
  includeEmptyFiles: true,
}

function extractClaims(markdown: string): string[] {
  if (!markdown) {
    return []
  }

  const matches = markdown.matchAll(/^\s*teiginys:\s*(.+)\s*$/gm)
  const claims: string[] = []

  for (const match of matches) {
    const raw = String(match[1] ?? "").trim()
    if (!raw) {
      continue
    }
    let value = raw
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1).trim()
    }
    if (value) {
      claims.push(value)
    }
  }

  return claims
}

function canonicalUrl(baseUrl: string, slug: SimpleSlug): string {
  const normalizedBase = /^https?:\/\//.test(baseUrl) ? baseUrl : `https://${baseUrl}`
  const base = new URL(normalizedBase)
  if (!base.pathname.endsWith("/")) {
    base.pathname = `${base.pathname}/`
  }

  return new URL(slug === "/" ? "" : stripSlashes(encodeURI(slug)), base).toString()
}

export function generateSiteMap(cfg: GlobalConfiguration, idx: ContentIndexMap): string {
  const base = cfg.baseUrl ?? ""
  const createURLEntry = (slug: SimpleSlug, content: ContentDetails): string => {
    const lastmodDate = content.modifiedDate ?? content.date
    const lastmod = lastmodDate ? `\n    <lastmod>${lastmodDate.toISOString()}</lastmod>` : ""
    return `  <url>
    <loc>${escapeHTML(canonicalUrl(base, slug))}</loc>${lastmod}
  </url>`
  }
  const urls = Array.from(idx)
    .map(([slug, content]) => createURLEntry(simplifySlug(slug), content))
    .join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

function generateRSSFeed(cfg: GlobalConfiguration, idx: ContentIndexMap, limit?: number): string {
  const base = cfg.baseUrl ?? ""

  const createURLEntry = (slug: SimpleSlug, content: ContentDetails): string => `<item>
    <title>${escapeHTML(content.title)}</title>
    <link>https://${joinSegments(base, encodeURI(slug))}</link>
    <guid>https://${joinSegments(base, encodeURI(slug))}</guid>
    <description><![CDATA[ ${content.richContent ?? content.description} ]]></description>
    <pubDate>${content.date?.toUTCString()}</pubDate>
  </item>`

  const items = Array.from(idx)
    .sort(([_, f1], [__, f2]) => {
      if (f1.date && f2.date) {
        return f2.date.getTime() - f1.date.getTime()
      } else if (f1.date && !f2.date) {
        return -1
      } else if (!f1.date && f2.date) {
        return 1
      }

      return f1.title.localeCompare(f2.title)
    })
    .map(([slug, content]) => createURLEntry(simplifySlug(slug), content))
    .slice(0, limit ?? idx.size)
    .join("")

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
      <title>${escapeHTML(cfg.pageTitle)}</title>
      <link>https://${base}</link>
      <description>${!!limit ? i18n(cfg.locale).pages.rss.lastFewNotes({ count: limit }) : i18n(cfg.locale).pages.rss.recentNotes} on ${escapeHTML(
        cfg.pageTitle,
      )}</description>
      <generator>Quartz -- quartz.jzhao.xyz</generator>
      ${items}
    </channel>
  </rss>`
}

export const ContentIndex: QuartzEmitterPlugin<Partial<Options>> = (opts) => {
  opts = { ...defaultOptions, ...opts }
  return {
    name: "ContentIndex",
    async *emit(ctx, content) {
      const cfg = ctx.cfg.configuration
      const linkIndex: ContentIndexMap = new Map()
      for (const [tree, file] of content) {
        const slug = file.data.slug!
        const date = getDate(ctx.cfg.configuration, file.data) ?? new Date()
        const relativePath = file.data.relativePath!
        const frontmatter = file.data.frontmatter
        const filePath = String(file.data.filePath ?? "")
        const markdownSource = filePath ? fs.readFileSync(filePath, "utf8") : ""
        const citationMetadata =
          isObjectPage(relativePath) && filePath ? collectCitationMetadata(markdownSource) : null
        const claims = extractClaims(markdownSource)
        if (opts?.includeEmptyFiles || (file.data.text && file.data.text !== "")) {
          linkIndex.set(slug, {
            slug,
            filePath: relativePath,
            title: frontmatter?.title!,
            links: file.data.links ?? [],
            tags: frontmatter?.tags ?? [],
            content: file.data.text ?? "",
            richContent: opts?.rssFullHtml
              ? escapeHTML(toHtml(tree as Root, { allowDangerousHtml: true }))
              : undefined,
            date: date,
            modifiedDate: file.data.dates?.modified,
            description: file.data.description ?? "",
            citationFilterable: Boolean(citationMetadata),
            quoteCount: citationMetadata?.quoteCount ?? 0,
            citationSourceIds: citationMetadata?.sourceIds ?? [],
            claimCount: claims.length,
            claims,
          })
        }
      }

      if (opts?.enableSiteMap) {
        yield write({
          ctx,
          content: generateSiteMap(cfg, linkIndex),
          slug: "sitemap" as FullSlug,
          ext: ".xml",
        })
      }

      if (opts?.enableRSS) {
        yield write({
          ctx,
          content: generateRSSFeed(cfg, linkIndex, opts.rssLimit),
          slug: (opts?.rssSlug ?? "index") as FullSlug,
          ext: ".xml",
        })
      }

      const fp = joinSegments("static", "contentIndex") as FullSlug
      const simplifiedIndex = Object.fromEntries(
        Array.from(linkIndex).map(([slug, content]) => {
          // remove description and from content index as nothing downstream
          // actually uses it. we only keep it in the index as we need it
          // for the RSS feed
          delete content.description
          delete content.date
          delete content.modifiedDate
          return [slug, content]
        }),
      )

      yield write({
        ctx,
        content: JSON.stringify(simplifiedIndex),
        slug: fp,
        ext: ".json",
      })
    },
    externalResources: (ctx) => {
      if (opts?.enableRSS) {
        return {
          additionalHead: [
            <link
              rel="alternate"
              type="application/rss+xml"
              title="RSS Feed"
              href={`https://${ctx.cfg.configuration.baseUrl}/index.xml`}
            />,
          ],
        }
      }
    },
  }
}
