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
import {
  collectCitationMetadata,
  isObjectPage,
  parseEvidenceSections,
} from "../../util/citationFilter"
import { normalizeCitationSourceId } from "../../util/citationFilter"
import { buildMediaCatalog, MediaCatalogFile, mediaEntriesByObject } from "../../util/mediaCatalog"
import {
  cleanText,
  isObjectPage as isMediaObjectPage,
  mediaDetailSlug,
  objectGallerySlug,
} from "../../util/objectMedia"
import { loadExhibitions } from "../../util/exhibitions"
import { isPoorSeoPage } from "../../util/seo"

export type ContentIndexMap = Map<FullSlug, ContentDetails>
export type SitemapExtraEntry = {
  slug: FullSlug
  modifiedDate?: Date
  imageUrls?: string[]
}
export type ContentDetails = {
  slug: FullSlug
  filePath: FilePath
  title: string
  links: SimpleSlug[]
  allLinks?: SimpleSlug[]
  tags: string[]
  content: string
  richContent?: string
  date?: Date
  modifiedDate?: Date
  description?: string
  citationFilterable?: boolean
  quoteCount?: number
  citationSourceIds?: string[]
  citationSourceTitles?: string[]
  claimCount?: number
  claims?: string[]
  itemType?: string
  summary?: string
  dateStart?: number
  dateEnd?: number
  centuries?: string[]
  periodGroups?: string[]
  claimEntries?: GraphExplorerClaimDetails[]
  quoteEntries?: GraphExplorerQuoteDetails[]
  noindex?: boolean
}

export type ContentMetaDetails = Pick<
  ContentDetails,
  | "slug"
  | "title"
  | "tags"
  | "citationFilterable"
  | "quoteCount"
  | "citationSourceIds"
  | "claimCount"
  | "itemType"
  | "dateStart"
  | "dateEnd"
>

export type GraphIndexDetails = Pick<ContentDetails, "slug" | "title" | "links" | "tags">

export type GraphExplorerEvidencePreview = {
  claimId?: string
  quoteId?: string
  claimText?: string
  quoteText?: string
  sourceTitle?: string
}

export type GraphExplorerLinkDetails = {
  target: FullSlug
  targetTitle: string
  targetType: string
  relationKind: string
  confidence: number
  evidenceCount: number
  claimIds: string[]
  quoteIds: string[]
  evidencePreview: GraphExplorerEvidencePreview[]
  sourceIds: string[]
}

export type GraphExplorerClaimDetails = {
  id: string
  text: string
  quoteIds: string[]
}

export type GraphExplorerQuoteDetails = {
  id: string
  text: string
  sourceTitle: string
  claimIds: string[]
}

export type GraphExplorerIndexDetails = {
  slug: FullSlug
  title: string
  type: string
  tags: string[]
  claimCount: number
  quoteCount: number
  citationSourceIds: string[]
  citationSourceTitles: string[]
  dateStart?: number
  dateEnd?: number
  centuries: string[]
  periodGroups: string[]
  summary: string
  topClaims: GraphExplorerClaimDetails[]
  links: GraphExplorerLinkDetails[]
}

export type SearchIndexDetails = Pick<
  ContentDetails,
  | "slug"
  | "title"
  | "tags"
  | "content"
  | "citationFilterable"
  | "quoteCount"
  | "citationSourceIds"
  | "claimCount"
>

export type RandomClaimsDetails = Pick<
  ContentDetails,
  "slug" | "title" | "quoteCount" | "claimCount" | "claims"
>

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

const publicNavigationSuppressedLinkPrefixes = [
  "laikotarpiai/",
  "objektai/saltiniai/",
  "objektai/vietos/",
]
const publicNavigationSuppressedSourceOnlyPrefixes = ["temos/"]

export function isPublicNavigationSuppressedSlug(slug: SimpleSlug | string): boolean {
  const value = String(slug)
  return publicNavigationSuppressedLinkPrefixes.some((prefix) => value.startsWith(prefix))
}

export function filterPublicNavigationLinks(
  links: SimpleSlug[],
  sourceSlug?: SimpleSlug | string,
): SimpleSlug[] {
  if (
    sourceSlug &&
    (isPublicNavigationSuppressedSlug(sourceSlug) ||
      publicNavigationSuppressedSourceOnlyPrefixes.some((prefix) =>
        String(sourceSlug).startsWith(prefix),
      ))
  ) {
    return []
  }
  return links.filter((link) => {
    return !isPublicNavigationSuppressedSlug(link)
  })
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

function frontmatterArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry ?? "").trim()).filter(Boolean)
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
  }
  return []
}

function parseFrontmatterYear(value: unknown): number | undefined {
  if (value == null || value === "") {
    return undefined
  }
  const match = String(value).match(/-?\d{1,4}/)
  if (!match) {
    return undefined
  }
  const parsed = Number.parseInt(match[0], 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

function extractSummary(markdown: string): string {
  const match = markdown.match(/^##\s+Santrauka\s*\n([\s\S]*?)(?=^##\s+|\s*$)/m)
  if (!match) {
    return ""
  }
  return match[1].replace(/\n+/g, " ").replace(/\s+/g, " ").trim()
}

function normalizeInlineValue(value: string): string {
  const trimmed = String(value ?? "").trim()
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}

function evidenceClaimEntries(markdown: string): GraphExplorerClaimDetails[] {
  const sections = parseEvidenceSections(markdown)
  const entries = sections.get("Teiginiai") ?? []
  return entries
    .map((entry) => ({
      id: entry.id,
      text: normalizeInlineValue(entry.fields.get("teiginys") ?? ""),
      quoteIds: entry.lists.get("pagrindžia") ?? entry.lists.get("pagrindzia") ?? [],
    }))
    .filter((entry) => entry.id && entry.text)
}

function evidenceQuoteEntries(markdown: string): GraphExplorerQuoteDetails[] {
  const sections = parseEvidenceSections(markdown)
  const out: GraphExplorerQuoteDetails[] = []
  for (const sectionName of [
    "Citatos",
    "Reikšmingi paminėjimai",
    "Šaltiniai ir įrodymai",
    "Bibliografiniai įrodymai",
  ]) {
    for (const entry of sections.get(sectionName) ?? []) {
      if (!entry.id.startsWith("c-")) {
        continue
      }
      const sourceTitle = entry.fields.get("šaltinis") ?? entry.fields.get("saltinis") ?? ""
      out.push({
        id: entry.id,
        text: entry.fields.get("citata_originali") ?? "",
        sourceTitle,
        claimIds: entry.lists.get("pagrindžia") ?? entry.lists.get("pagrindzia") ?? [],
      })
    }
  }
  return out
}

function basenameTerms(content: ContentDetails): string[] {
  const title = content.title.replace(/\s*\([^)]*\)\s*$/, "").trim()
  const basename = String(content.slug).split("/").pop()?.replace(/-/g, " ") ?? ""
  return [
    ...new Set(
      [title, basename, content.title]
        .map((term) => term.trim())
        .filter((term) => term.length >= 3),
    ),
  ]
}

function textContainsAnyTerm(text: string, terms: string[]): boolean {
  const normalized = text.normalize("NFKC").toLocaleLowerCase("lt-LT")
  return terms.some((term) =>
    normalized.includes(term.normalize("NFKC").toLocaleLowerCase("lt-LT")),
  )
}

function edgeEvidence(
  source: ContentDetails,
  target: ContentDetails,
): Pick<
  GraphExplorerLinkDetails,
  | "relationKind"
  | "confidence"
  | "evidenceCount"
  | "claimIds"
  | "quoteIds"
  | "evidencePreview"
  | "sourceIds"
> {
  const targetTerms = basenameTerms(target)
  const quotesById = new Map((source.quoteEntries ?? []).map((quote) => [quote.id, quote]))
  const claimIds: string[] = []
  const quoteIds = new Set<string>()
  const previews: GraphExplorerEvidencePreview[] = []
  const sourceIds = new Set<string>()

  for (const claim of source.claimEntries ?? []) {
    const quoteMatches = claim.quoteIds
      .map((quoteId) => quotesById.get(quoteId))
      .filter((quote): quote is GraphExplorerQuoteDetails => Boolean(quote))
    const claimMatches = textContainsAnyTerm(claim.text, targetTerms)
    const matchingQuotes = quoteMatches.filter((quote) =>
      textContainsAnyTerm(quote.text, targetTerms),
    )
    if (!claimMatches && matchingQuotes.length === 0) {
      continue
    }
    claimIds.push(claim.id)
    for (const quote of matchingQuotes.length ? matchingQuotes : quoteMatches.slice(0, 1)) {
      quoteIds.add(quote.id)
      const sourceId = normalizeCitationSourceId(quote.sourceTitle)
      if (sourceId) sourceIds.add(sourceId)
      if (previews.length < 3) {
        previews.push({
          claimId: claim.id,
          quoteId: quote.id,
          claimText: claim.text,
          quoteText: quote.text,
          sourceTitle: quote.sourceTitle,
        })
      }
    }
  }

  if (claimIds.length || quoteIds.size) {
    return {
      relationKind: "claim_quote_mention",
      confidence: 0.86,
      evidenceCount: claimIds.length + quoteIds.size,
      claimIds: [...new Set(claimIds)],
      quoteIds: [...quoteIds],
      evidencePreview: previews,
      sourceIds: [...sourceIds],
    }
  }

  return {
    relationKind: "public_relation",
    confidence: 0.6,
    evidenceCount: 1,
    claimIds: [],
    quoteIds: [],
    evidencePreview: [],
    sourceIds: [],
  }
}

function compactSearchContent(content: ContentDetails): string {
  const parts = [
    content.title,
    ...(content.claims ?? []),
    ...(content.tags ?? []).map((tag) => `#${tag}`),
  ]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
  return parts.join("\n")
}

function asContentMeta(content: ContentDetails): ContentMetaDetails {
  return {
    slug: content.slug,
    title: content.title,
    tags: content.tags,
    citationFilterable: content.citationFilterable,
    quoteCount: content.quoteCount,
    citationSourceIds: content.citationSourceIds,
    claimCount: content.claimCount,
    itemType: content.itemType,
    dateStart: content.dateStart,
    dateEnd: content.dateEnd,
  }
}

function asSearchIndex(content: ContentDetails): SearchIndexDetails {
  return {
    slug: content.slug,
    title: content.title,
    tags: content.tags,
    content: compactSearchContent(content),
    citationFilterable: content.citationFilterable,
    quoteCount: content.quoteCount,
    citationSourceIds: content.citationSourceIds,
    claimCount: content.claimCount,
  }
}

function asGraphIndex(content: ContentDetails): GraphIndexDetails {
  return {
    slug: content.slug,
    title: content.title,
    links: content.links,
    tags: content.tags,
  }
}

function graphTargetAllowed(slug: string): boolean {
  return !slug.startsWith("laikotarpiai/") && !slug.startsWith("objektai/saltiniai/")
}

export function buildGraphExplorerIndex(
  linkIndex: ContentIndexMap,
): Record<FullSlug, GraphExplorerIndexDetails> {
  const contentBySimpleSlug = new Map<SimpleSlug, ContentDetails>(
    Array.from(linkIndex.entries()).map(([slug, content]) => [simplifySlug(slug), content]),
  )

  return Object.fromEntries(
    Array.from(linkIndex.entries()).map(([slug, content]) => {
      const rawLinks = content.allLinks ?? content.links ?? []
      const links: GraphExplorerLinkDetails[] = []
      const seen = new Set<string>()
      for (const rawTarget of rawLinks) {
        const targetSlug = simplifySlug(rawTarget as unknown as FullSlug)
        if (!graphTargetAllowed(targetSlug) || seen.has(targetSlug)) {
          continue
        }
        const target = contentBySimpleSlug.get(targetSlug)
        if (!target) {
          continue
        }
        seen.add(targetSlug)
        const evidence = edgeEvidence(content, target)
        links.push({
          target: target.slug,
          targetTitle: target.title,
          targetType: target.itemType ?? "",
          ...evidence,
        })
      }

      return [
        slug,
        {
          slug,
          title: content.title,
          type: content.itemType ?? "",
          tags: content.tags,
          claimCount: content.claimCount ?? 0,
          quoteCount: content.quoteCount ?? 0,
          citationSourceIds: content.citationSourceIds ?? [],
          citationSourceTitles: content.citationSourceTitles ?? [],
          dateStart: content.dateStart,
          dateEnd: content.dateEnd,
          centuries: content.centuries ?? [],
          periodGroups: content.periodGroups ?? [],
          summary: content.summary ?? "",
          topClaims: (content.claimEntries ?? []).slice(0, 5),
          links,
        } satisfies GraphExplorerIndexDetails,
      ]
    }),
  ) as Record<FullSlug, GraphExplorerIndexDetails>
}

function asRandomClaims(content: ContentDetails): RandomClaimsDetails | undefined {
  const claims = (content.claims ?? []).map((claim) => claim.trim()).filter(Boolean)
  if (claims.length === 0) {
    return undefined
  }
  return {
    slug: content.slug,
    title: content.title,
    quoteCount: content.quoteCount,
    claimCount: content.claimCount,
    claims,
  }
}

function canonicalUrl(baseUrl: string, slug: SimpleSlug): string {
  const normalizedBase = /^https?:\/\//.test(baseUrl) ? baseUrl : `https://${baseUrl}`
  const base = new URL(normalizedBase)
  if (!base.pathname.endsWith("/")) {
    base.pathname = `${base.pathname}/`
  }

  return new URL(slug === "/" ? "" : stripSlashes(encodeURI(slug)), base).toString()
}

function parseFrontmatterDate(value: unknown): Date | undefined {
  if (value == null || value === "") {
    return undefined
  }
  const text = String(value).trim()
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(text) ? `${text}T00:00:00` : text
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function newestDate(dates: Array<Date | undefined>): Date | undefined {
  return dates
    .filter((date): date is Date => Boolean(date))
    .sort((left, right) => right.getTime() - left.getTime())[0]
}

function entryModifiedDate(value: unknown): Date | undefined {
  return parseFrontmatterDate(value)
}

export function gallerySitemapEntries(files: MediaCatalogFile[]): SitemapExtraEntry[] {
  const catalog = buildMediaCatalog(files)
  if (!catalog.length) return []
  const byObject = mediaEntriesByObject(catalog)
  const imageUrl = (entry: (typeof catalog)[number]) => cleanText(entry.sourceUrl || entry.thumbUrl)
  const modifiedDate = (entry: (typeof catalog)[number]) =>
    entryModifiedDate(entry.reviewedAt || entry.firstDiscoveredAt)
  const entries: SitemapExtraEntry[] = [
    {
      slug: "galerija" as FullSlug,
      modifiedDate: newestDate(catalog.map(modifiedDate)),
      imageUrls: [...new Set(catalog.map(imageUrl).filter(Boolean))],
    },
  ]

  for (const file of files) {
    const slug = file.slug
    if (!slug || !isMediaObjectPage(slug) || slug.endsWith("/galerija")) continue
    const related = byObject.get(`${slug}.md`) ?? []
    if (!related.length) continue
    entries.push({
      slug: objectGallerySlug(slug as FullSlug),
      modifiedDate: newestDate(related.map(modifiedDate)),
      imageUrls: [...new Set(related.map(imageUrl).filter(Boolean))],
    })
  }

  for (const entry of catalog) {
    const url = imageUrl(entry)
    entries.push({
      slug: mediaDetailSlug(entry),
      modifiedDate: modifiedDate(entry),
      imageUrls: url ? [url] : [],
    })
  }
  const exhibitions = loadExhibitions()
  if (exhibitions.length) {
    entries.push({
      slug: "parodos" as FullSlug,
      modifiedDate: newestDate(
        exhibitions.map((exhibition) => entryModifiedDate(exhibition.updatedAt)),
      ),
      imageUrls: exhibitions
        .map((exhibition) => cleanText(exhibition.hero.sourceUrl || exhibition.hero.thumbUrl))
        .filter(Boolean),
    })
  }
  for (const exhibition of exhibitions) {
    entries.push({
      slug: exhibition.slug as FullSlug,
      modifiedDate: entryModifiedDate(exhibition.updatedAt),
      imageUrls: exhibition.imageUrls,
    })
  }
  return entries
}

export function generateSiteMap(
  cfg: GlobalConfiguration,
  idx: ContentIndexMap,
  extraEntries: SitemapExtraEntry[] = [],
): string {
  const base = cfg.baseUrl ?? ""
  const createURLEntry = (
    slug: SimpleSlug,
    lastmodDate?: Date,
    imageUrls: string[] = [],
  ): string => {
    const lastmod = lastmodDate ? `\n    <lastmod>${lastmodDate.toISOString()}</lastmod>` : ""
    const images = imageUrls
      .slice(0, 1000)
      .map(
        (url) =>
          `\n    <image:image>\n      <image:loc>${escapeHTML(url)}</image:loc>\n    </image:image>`,
      )
      .join("")
    return `  <url>
    <loc>${escapeHTML(canonicalUrl(base, slug))}</loc>${lastmod}${images}
  </url>`
  }
  const urls = [
    ...Array.from(idx)
      .filter(([, content]) => !content.noindex)
      .map(([slug, content]) => ({
      slug: simplifySlug(slug),
      modifiedDate: content.modifiedDate,
      imageUrls: [] as string[],
      })),
    ...extraEntries.map((entry) => ({ ...entry, slug: simplifySlug(entry.slug) })),
  ]
    .filter(
      (entry, index, all) => all.findIndex((candidate) => candidate.slug === entry.slug) === index,
    )
    .map((entry) => createURLEntry(entry.slug, entry.modifiedDate, entry.imageUrls))
    .join("\n")
  const imageNamespace = extraEntries.some((entry) => (entry.imageUrls?.length ?? 0) > 0)
    ? '\n  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : ""
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${imageNamespace}>
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
        const claimEntries = evidenceClaimEntries(markdownSource)
        const quoteEntries = evidenceQuoteEntries(markdownSource)
        if (opts?.includeEmptyFiles || (file.data.text && file.data.text !== "")) {
          const sitemapModifiedDate =
            parseFrontmatterDate(
              frontmatter?.atnaujinta ?? frontmatter?.modified ?? frontmatter?.updated,
            ) ??
            parseFrontmatterDate(
              frontmatter?.sukurta ??
                frontmatter?.created ??
                frontmatter?.date ??
                frontmatter?.published,
            )
          const contentText = file.data.text ?? ""
          const descriptionSource =
            frontmatter?.socialDescription ?? frontmatter?.description ?? file.data.description
          const noindex = isPoorSeoPage({
            slug,
            title: frontmatter?.title,
            description: descriptionSource,
            text: contentText,
            itemType: frontmatter?.tipas,
            noindex: frontmatter?.noindex,
          })
          linkIndex.set(slug, {
            slug,
            filePath: relativePath,
            title: frontmatter?.title!,
            links: filterPublicNavigationLinks(file.data.links ?? [], slug),
            allLinks: file.data.links ?? [],
            tags: frontmatter?.tags ?? [],
            content: contentText,
            richContent: opts?.rssFullHtml
              ? escapeHTML(toHtml(tree as Root, { allowDangerousHtml: true }))
              : undefined,
            date: date,
            modifiedDate: sitemapModifiedDate,
            description: descriptionSource ?? "",
            citationFilterable: Boolean(citationMetadata),
            quoteCount: citationMetadata?.quoteCount ?? 0,
            citationSourceIds: citationMetadata?.sourceIds ?? [],
            citationSourceTitles: citationMetadata?.sourceTitles ?? [],
            claimCount: claimEntries.length || claims.length,
            claims,
            itemType: String(frontmatter?.tipas ?? ""),
            summary: extractSummary(markdownSource),
            dateStart: parseFrontmatterYear(frontmatter?.date_start),
            dateEnd: parseFrontmatterYear(frontmatter?.date_end),
            centuries: frontmatterArray(frontmatter?.amziai),
            periodGroups: frontmatterArray(frontmatter?.periodo_grupes),
            claimEntries,
            quoteEntries,
            noindex,
          })
        }
      }

      if (opts?.enableSiteMap) {
        const generatedGalleryEntries = gallerySitemapEntries(content.map((item) => item[1].data))
        yield write({
          ctx,
          content: generateSiteMap(cfg, linkIndex, generatedGalleryEntries),
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

      const contentMetaIndex = Object.fromEntries(
        Array.from(linkIndex).map(([slug, content]) => [slug, asContentMeta(content)]),
      )
      const searchIndex = Object.fromEntries(
        Array.from(linkIndex).map(([slug, content]) => [slug, asSearchIndex(content)]),
      )
      const graphIndex = Object.fromEntries(
        Array.from(linkIndex).map(([slug, content]) => [slug, asGraphIndex(content)]),
      )
      const randomClaimsIndex = Object.fromEntries(
        Array.from(linkIndex)
          .map(([slug, content]) => [slug, asRandomClaims(content)] as const)
          .filter(
            (entry): entry is readonly [FullSlug, RandomClaimsDetails] => entry[1] !== undefined,
          ),
      )

      const emittedIndexes: Array<[FullSlug, unknown]> = [
        [joinSegments("static", "contentMeta") as FullSlug, contentMetaIndex],
        [joinSegments("static", "searchIndex") as FullSlug, searchIndex],
        [joinSegments("static", "graphIndex") as FullSlug, graphIndex],
        [joinSegments("static", "randomClaims") as FullSlug, randomClaimsIndex],
        // Backward-compatible alias. It intentionally no longer contains full page bodies.
        [joinSegments("static", "contentIndex") as FullSlug, contentMetaIndex],
      ]

      for (const [slug, payload] of emittedIndexes) {
        yield write({
          ctx,
          content: JSON.stringify(payload),
          slug,
          ext: ".json",
        })
      }
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
