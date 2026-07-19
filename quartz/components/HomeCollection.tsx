import fs from "node:fs"
import { QuartzPluginData } from "../plugins/vfile"
import {
  CITATION_SECTION_TITLES,
  collectCitationMetadata,
  collectClaimCount,
  parseEvidenceSections,
  type EvidenceEntry,
} from "../util/citationFilter"
import {
  selectHomeCollectionCandidates,
  type HomeCollectionCandidate,
} from "../util/homeCollectionSelection"
import { cleanText, displayCaption, objectMediaSet, type MediaEntry } from "../util/objectMedia"
import { FullSlug, resolveRelative } from "../util/path"
import { selectTopThemes } from "../util/themeCatalog"
import { BrandLockup } from "./BrandLockup"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/home-collection.inline"
import styles from "./styles/homeCollection.scss"

type Category = {
  type: string
  label: string
  slug: FullSlug
  description: string
  imageKey: string
  imageAlt: string
}

type ObjectCard = {
  title: string
  slug: FullSlug
  type: string
  quoteCount: number
  claimCount: number
  relationCount: number
  summary: string
}

type MediaObjectCard = ObjectCard &
  HomeCollectionCandidate & {
    image: MediaEntry
    imageAlt: string
  }

type SpotlightClaim = {
  id: string
  text: string
  source?: string
  contributor?: string
}

type SpotlightObject = {
  title: string
  slug: FullSlug
  typeLabel: string
  claimCount: number
  claims: SpotlightClaim[]
}

type BrowseLink = {
  title: string
  slug: FullSlug
  meta?: string
  imageKey?: string
  imageAlt?: string
}

type BrowseGroup = {
  kind: "objects" | "topics" | "periods"
  label: string
  description: string
  links: BrowseLink[]
  href: FullSlug
}

const categories: Category[] = [
  {
    type: "asmuo",
    label: "Asmenys",
    slug: "objektai/asmenys" as FullSlug,
    description: "Valdovai, autoriai, veikėjai ir liudininkai.",
    imageKey: "category-asmenys",
    imageAlt: "Gedimino portretas",
  },
  {
    type: "autorius",
    label: "Autoriai",
    slug: "objektai/autoriai" as FullSlug,
    description: "Istorikai, metraštininkai, leidėjai ir tyrimo balsai.",
    imageKey: "category-autoriai",
    imageAlt: "Simono Daukanto portretas",
  },
  {
    type: "ivykis",
    label: "Įvykiai",
    slug: "objektai/ivykiai" as FullSlug,
    description: "Mūšiai, sutartys, sukilimai ir politiniai lūžiai.",
    imageKey: "category-ivykiai",
    imageAlt: "Žalgirio mūšio paveikslo fragmentas",
  },
  {
    type: "vieta",
    label: "Vietos",
    slug: "objektai/vietos" as FullSlug,
    description: "Pilys, miestai, žemės, upės ir istorinės erdvės.",
    imageKey: "category-vietos",
    imageAlt: "Trakų pilies vaizdas",
  },
  {
    type: "grupe",
    label: "Grupės",
    slug: "objektai/grupes" as FullSlug,
    description: "Giminės, luomai, kariuomenės ir bendruomenės.",
    imageKey: "category-grupes",
    imageAlt: "Lietuvos valstiečių istorinė iliustracija",
  },
  {
    type: "daiktas",
    label: "Daiktai",
    slug: "objektai/daiktai" as FullSlug,
    description: "Dokumentai, ženklai, ginklai, paminklai ir artefaktai.",
    imageKey: "category-daiktai",
    imageAlt: "Jogailos 1382 m. antspaudas su Vyčiu",
  },
  {
    type: "paprotys",
    label: "Papročiai",
    slug: "objektai/paprociai" as FullSlug,
    description: "Apeigos, praktikos, teisės normos ir tradicijos.",
    imageKey: "category-paprociai",
    imageAlt: "Liaudies meno parodos Kaune vaizdas",
  },
  {
    type: "posakis",
    label: "Posakiai",
    slug: "objektai/posakiai" as FullSlug,
    description: "Citatos, formulės ir įsimintini pasakymai.",
    imageKey: "category-posakiai",
    imageAlt: "Seniausio išlikusio lietuviško įrašo fragmentas",
  },
  {
    type: "zodyno_irasas",
    label: "Žodynas",
    slug: "objektai/zodynas" as FullSlug,
    description: "Sąvokos, terminai ir istorinė leksika.",
    imageKey: "category-zodynas",
    imageAlt: "Mažvydo katekizmo puslapis",
  },
  {
    type: "saltinis",
    label: "Šaltiniai",
    slug: "objektai/saltiniai" as FullSlug,
    description: "Knygos, kronikos ir kiti tekstai, iš kurių renkama bazė.",
    imageKey: "category-saltiniai",
    imageAlt: "Pirmojo Lietuvos Statuto rankraščio puslapis",
  },
]

const typeLabels = new Map(categories.map((category) => [category.type, category.label]))

const objectSearchTypes = [
  { value: "all", label: "Visi" },
  { value: "asmenys", label: "Asmenys" },
  { value: "autoriai", label: "Autoriai" },
  { value: "ivykiai", label: "Įvykiai" },
  { value: "vietos", label: "Vietos" },
  { value: "grupes", label: "Grupės" },
  { value: "daiktai", label: "Daiktai" },
  { value: "paprociai", label: "Papročiai" },
  { value: "posakiai", label: "Posakiai" },
  { value: "zodynas", label: "Žodynas" },
  { value: "saltiniai", label: "Šaltiniai" },
]

function pageType(page: QuartzPluginData): string {
  return String(page.frontmatter?.tipas ?? "").trim()
}

function isObjectPage(page: QuartzPluginData): boolean {
  return Boolean(page.slug?.startsWith("objektai/") && page.frontmatter?.tipas)
}

function markdownFor(page: QuartzPluginData): string {
  const filePath = String(page.filePath ?? "")
  if (!filePath) {
    return ""
  }
  try {
    return fs.readFileSync(filePath, "utf8")
  } catch {
    return ""
  }
}

function extractSummary(markdown: string): string {
  const match = markdown.match(/^##\s+Santrauka\s*\n([\s\S]*?)(?=^##\s+|\s*$)/m)
  if (!match) {
    return ""
  }
  return match[1]
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
}

function trimSentence(text: string, limit: number): string {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= limit) {
    return clean
  }
  const sliced = clean.slice(0, limit)
  const sentenceEnd = Math.max(
    sliced.lastIndexOf("."),
    sliced.lastIndexOf(";"),
    sliced.lastIndexOf(","),
  )
  return `${sliced.slice(0, sentenceEnd > limit * 0.6 ? sentenceEnd : limit).trim()}...`
}

function pageTitle(page: QuartzPluginData): string {
  return String(page.frontmatter?.title ?? page.frontmatter?.pavadinimas ?? page.slug ?? "")
}

function plainTitle(title: string): string {
  return title.replace(/\s*\([^)]*\)\s*$/g, "").trim() || title
}

function normalizeYamlInline(value: string | undefined): string {
  const trimmed = String(value ?? "").trim()
  if (!trimmed) {
    return ""
  }

  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1).replace(/''/g, "'").replace(/\\"/g, '"').trim()
  }

  return trimmed.trim()
}

function fieldValue(block: string, field: string): string {
  const match = block.match(new RegExp(`(?:^|\\n)\\s*${field}:\\s*([^\\n]+)`))
  return normalizeYamlInline(match?.[1])
}

function sectionMarkdown(markdown: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = new RegExp(`^##\\s+${escaped}\\s*$`, "m").exec(markdown)
  if (!match) {
    return ""
  }

  const start = match.index + match[0].length
  const rest = markdown.slice(start)
  const next = rest.search(/^##\s+/m)
  return (next >= 0 ? rest.slice(0, next) : rest).trim()
}

const contributorFields = [
  { keys: ["autorius"], label: "Autorius" },
  { keys: ["autoriai"], label: "Autoriai" },
  { keys: ["redaktorius"], label: "Redaktorius" },
  { keys: ["redaktoriai"], label: "Redaktoriai" },
  { keys: ["sudarytojas"], label: "Sudarytojas" },
  { keys: ["sudarytojai"], label: "Sudarytojai" },
  { keys: ["vertėjas", "vertejas"], label: "Vertėjas" },
  { keys: ["vertėjai", "vertejai"], label: "Vertėjai" },
]

function firstEvidenceField(entry: EvidenceEntry, keys: string[]): string {
  return keys.map((key) => entry.fields.get(key)?.trim() ?? "").find(Boolean) ?? ""
}

function citationContributorLabel(entry: EvidenceEntry): string {
  for (const field of contributorFields) {
    const value = firstEvidenceField(entry, field.keys)
    if (value) {
      return `${field.label}: ${value}`
    }
  }
  return ""
}

function citationSources(markdown: string): Map<string, { source?: string; contributor?: string }> {
  const citations = new Map<string, { source?: string; contributor?: string }>()
  const sections = parseEvidenceSections(markdown)
  const entries = [...sections.entries()]
    .filter(([title]) => CITATION_SECTION_TITLES.has(title))
    .flatMap(([, sectionEntries]) => sectionEntries)
    .filter((entry) => entry.id.startsWith("c-"))

  for (const entry of entries) {
    const source = firstEvidenceField(entry, ["šaltinis", "saltinis"])
    const contributor = citationContributorLabel(entry)
    citations.set(entry.id, {
      source: source || undefined,
      contributor: contributor || undefined,
    })
  }

  return citations
}

function claimSupportIds(block: string): string[] {
  const match = block.match(/pagrindžia:\s*\n((?:\s+-\s+c-\d+\s*\n?)+)/)
  if (!match) {
    return []
  }
  return [...match[1].matchAll(/-\s+(c-\d+)/g)].map((support) => support[1])
}

function spotlightClaims(markdown: string): SpotlightClaim[] {
  const claimsSection = sectionMarkdown(markdown, "Teiginiai")
  const citations = citationSources(markdown)
  const claimRegex =
    /<a id="claim-(t-\d+)"><\/a>\s*\n-\s+t-\d+\s*\n([\s\S]*?)(?=\n<a id="claim-t-\d+"><\/a>|\n-\s+susijęs iš|\s*$)/g
  const claims: SpotlightClaim[] = []
  const seen = new Set<string>()

  for (const match of claimsSection.matchAll(claimRegex)) {
    const id = match[1]
    const block = match[2] ?? ""
    const text = fieldValue(block, "teiginys")
    if (!id || !text || seen.has(text.toLocaleLowerCase("lt-LT"))) {
      continue
    }

    const citation = claimSupportIds(block)
      .map((supportId) => citations.get(supportId))
      .find((entry) => entry?.source || entry?.contributor)

    seen.add(text.toLocaleLowerCase("lt-LT"))
    claims.push({
      id,
      text,
      source: citation?.source,
      contributor: citation?.contributor,
    })
  }

  return claims
}

function claimPool(claims: SpotlightClaim[], limit: number): SpotlightClaim[] {
  if (claims.length <= limit) {
    return claims
  }

  return Array.from({ length: limit }, (_, index) => {
    const claimIndex = Math.round((index * (claims.length - 1)) / (limit - 1))
    return claims[claimIndex]
  })
}

function spotlightObjects(allFiles: QuartzPluginData[]): SpotlightObject[] {
  return allFiles
    .filter(isObjectPage)
    .map((page): SpotlightObject | undefined => {
      const markdown = markdownFor(page)
      const claimCount = collectClaimCount(markdown)
      if (claimCount <= 30) {
        return undefined
      }

      const claims = claimPool(spotlightClaims(markdown), 48)
      if (claims.length < 10) {
        return undefined
      }

      const type = pageType(page)
      return {
        title: plainTitle(pageTitle(page)),
        slug: page.slug as FullSlug,
        typeLabel: typeLabels.get(type) ?? type,
        claimCount,
        claims,
      }
    })
    .filter((entry): entry is SpotlightObject => Boolean(entry))
}

function safeJsonPayload(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}

function objectCountText(count: number): string {
  const label = count === 1 ? "objektas" : "objektai"
  return `${count.toLocaleString("lt-LT")} ${label}`
}

function hubObjectCount(page: QuartzPluginData): number {
  const markdown = markdownFor(page)
  const explicit = markdown.match(/Objektų skaičius:\s*([\d\s\u00a0]+)/i)
  if (explicit) {
    const parsed = Number(explicit[1].replace(/\s|\u00a0/g, ""))
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return new Set(
    [...markdown.matchAll(/\[\[(objektai\/[^\]|#]+)(?:\|[^\]]+)?\]\]/g)].map((match) => match[1]),
  ).size
}

function relationCount(markdown: string, selfSlug?: FullSlug): number {
  const links = new Set<string>()
  for (const match of markdown.matchAll(
    /\[\[(objektai\/[^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g,
  )) {
    const slug = match[1]?.trim()
    if (slug && slug !== selfSlug) {
      links.add(slug)
    }
  }
  return links.size
}

function objectCards(allFiles: QuartzPluginData[]): ObjectCard[] {
  return allFiles
    .filter(isObjectPage)
    .map((page) => {
      const markdown = markdownFor(page)
      const citation = collectCitationMetadata(markdown)
      const claimCount = collectClaimCount(markdown)
      return {
        title: pageTitle(page),
        slug: page.slug as FullSlug,
        type: pageType(page),
        quoteCount: citation.quoteCount,
        claimCount,
        relationCount: relationCount(markdown, page.slug as FullSlug),
        summary: trimSentence(extractSummary(markdown), 190),
      }
    })
    .filter((card) => card.title && (card.claimCount > 0 || card.quoteCount > 0))
}

function countByType(allFiles: QuartzPluginData[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const page of allFiles.filter(isObjectPage)) {
    const type = pageType(page)
    counts.set(type, (counts.get(type) ?? 0) + 1)
  }
  return counts
}

function mediaIdentity(entry: MediaEntry): string {
  return cleanText(entry.mediaId) || cleanText(entry.sourceUrl) || cleanText(entry.thumbUrl)
}

function mediaUrl(entry: MediaEntry): string {
  return cleanText(entry.thumbUrl) || cleanText(entry.sourceUrl)
}

function preferredDirectMedia(page: QuartzPluginData): MediaEntry | undefined {
  const media = objectMediaSet(page.frontmatter)
  const primaryId = mediaIdentity(media.primary ?? {})
  const candidates = [media.primary, ...media.direct]
    .filter((entry): entry is MediaEntry => Boolean(entry))
    .filter(
      (entry) =>
        entry.reviewStatus === "accepted" && entry.directness === "direct" && mediaUrl(entry),
    )

  return [...new Map(candidates.map((entry) => [mediaIdentity(entry), entry])).values()].sort(
    (a, b) => {
      const primaryDifference =
        Number(mediaIdentity(b) === primaryId) - Number(mediaIdentity(a) === primaryId)
      if (primaryDifference) return primaryDifference
      const markedDifference = Number(b.isPrimary ?? 0) - Number(a.isPrimary ?? 0)
      if (markedDifference) return markedDifference
      const confidenceDifference = Number(b.confidence ?? 0) - Number(a.confidence ?? 0)
      if (confidenceDifference) return confidenceDifference
      return (
        Number(b.width ?? 0) * Number(b.height ?? 0) - Number(a.width ?? 0) * Number(a.height ?? 0)
      )
    },
  )[0]
}

function mediaCards(
  allFiles: QuartzPluginData[],
  cards: ObjectCard[],
  limit: number,
): MediaObjectCard[] {
  const cardsBySlug = new Map(cards.map((card) => [card.slug, card]))
  const candidates = allFiles
    .filter(isObjectPage)
    .map((page): MediaObjectCard | undefined => {
      const slug = page.slug as FullSlug
      const card = cardsBySlug.get(slug)
      const image = preferredDirectMedia(page)
      if (!card || !image) return undefined

      const imageKey = mediaIdentity(image)
      const imageUrl = mediaUrl(image)
      const contentRank = card.claimCount * 2 + card.quoteCount * 3 + card.relationCount
      const imageRank =
        Number(image.isPrimary ?? 0) * 5_000 +
        Number(image.confidence ?? 0) * 1_000 +
        Math.min(Number(image.width ?? 0) * Number(image.height ?? 0), 12_000_000) / 100_000

      return {
        ...card,
        slug,
        image,
        imageKey,
        imageUrl,
        imageAlt: displayCaption(image),
        reviewStatus: cleanText(image.reviewStatus),
        directness: cleanText(image.directness),
        rank: imageRank + contentRank,
      }
    })
    .filter((card): card is MediaObjectCard => Boolean(card))

  return selectHomeCollectionCandidates(candidates, limit)
}

function linkFromPage(page: QuartzPluginData, meta?: string): BrowseLink {
  return {
    title: pageTitle(page),
    slug: page.slug as FullSlug,
    meta,
  }
}

function staticImage(currentSlug: FullSlug, filename: string): string {
  return resolveRelative(currentSlug, `static/collection-images/${filename}` as FullSlug)
}

function imagePicture(
  currentSlug: FullSlug,
  key: string,
  alt: string,
  className: string,
  loading: "eager" | "lazy",
  width: number,
  height: number,
) {
  const small = key === "hero-grunwald" ? "1600" : "640"
  const large = key === "hero-grunwald" ? "2400" : "960"
  return (
    <picture class={className}>
      <source
        type="image/webp"
        srcSet={`${staticImage(currentSlug, `${key}-${small}.webp`)} ${width === 2400 ? 1600 : 640}w, ${staticImage(currentSlug, `${key}-${large}.webp`)} ${width}w`}
        sizes={width === 2400 ? "100vw" : "(min-width: 900px) 33vw, 100vw"}
      />
      <source
        type="image/jpeg"
        srcSet={`${staticImage(currentSlug, `${key}-${small}.jpg`)} ${width === 2400 ? 1600 : 640}w, ${staticImage(currentSlug, `${key}-${large}.jpg`)} ${width}w`}
        sizes={width === 2400 ? "100vw" : "(min-width: 900px) 33vw, 100vw"}
      />
      <img
        src={staticImage(currentSlug, `${key}-${large}.jpg`)}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={loading === "eager" ? "sync" : "async"}
        fetchpriority={loading === "eager" ? "high" : undefined}
        data-collection-hero-image={key === "hero-grunwald" ? "true" : undefined}
        data-fallback-src={
          key === "hero-grunwald" ? staticImage(currentSlug, `${key}-1600.jpg`) : undefined
        }
      />
    </picture>
  )
}

function largestHubLinks(
  allFiles: QuartzPluginData[],
  prefix: string,
  limit?: number,
  imageKey?: string,
  imageAlt?: string,
): BrowseLink[] {
  const links = allFiles
    .filter((page) => String(page.slug ?? "").startsWith(prefix) && pageTitle(page))
    .map((page) => ({ page, count: hubObjectCount(page) }))
    .sort((a, b) => b.count - a.count || pageTitle(a.page).localeCompare(pageTitle(b.page), "lt"))

  return (typeof limit === "number" ? links.slice(0, limit) : links).map(({ page, count }) => ({
    ...linkFromPage(page, objectCountText(count)),
    imageKey,
    imageAlt,
  }))
}

function browseGroups(
  allFiles: QuartzPluginData[],
  typeCounts: Map<string, number>,
): BrowseGroup[] {
  const groups: BrowseGroup[] = [
    {
      kind: "objects",
      label: "Objektai",
      description: "Naršyk visus objektus pagal tipą.",
      href: "objektai" as FullSlug,
      links: categories.map((category) => ({
        title: category.label,
        slug: category.slug,
        meta: objectCountText(typeCounts.get(category.type) ?? 0),
        imageKey: category.imageKey,
        imageAlt: category.imageAlt,
      })),
    },
    {
      kind: "topics",
      label: "Temos",
      description: "Teminiai keliai per objektus, šaltinius ir teiginius.",
      href: "temos" as FullSlug,
      links: selectTopThemes(allFiles).map((theme) => ({
        title: theme.title,
        slug: theme.slug,
        meta: objectCountText(theme.objectCount),
        imageKey: "category-temos",
        imageAlt: "1696 m. Lietuvos ir Lenkijos žemėlapio fragmentas",
      })),
    },
    {
      kind: "periods",
      label: "Laikotarpiai",
      description: "Chronologiniai vartai į kolekciją.",
      href: "laikotarpiai" as FullSlug,
      links: largestHubLinks(
        allFiles,
        "laikotarpiai/",
        undefined,
        "category-laikotarpiai",
        "1696 m. Lietuvos ir Lenkijos žemėlapio fragmentas",
      ),
    },
  ]

  return groups.filter((group) => group.links.length > 0)
}

const HomeCollection: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const typeCounts = countByType(allFiles)
  const cards = objectCards(allFiles)
  const highlights = mediaCards(allFiles, cards, 8)
  const groups = browseGroups(allFiles, typeCounts)
  const spotlight = spotlightObjects(allFiles)
  const objectTotal = [...typeCounts.values()].reduce((sum, count) => sum + count, 0)
  const claimTotal = cards.reduce((sum, card) => sum + card.claimCount, 0)
  const quoteTotal = cards.reduce((sum, card) => sum + card.quoteCount, 0)
  const currentSlug = fileData.slug ?? ("index" as FullSlug)

  return (
    <div class="collection-home">
      <section class="collection-hero" aria-label="Objektų paieška">
        {imagePicture(
          currentSlug,
          "hero-grunwald",
          "",
          "collection-hero-image",
          "eager",
          2400,
          1080,
        )}
        <div class="collection-hero-content">
          {spotlight.length > 0 && (
            <section
              class="collection-hero-spotlight"
              aria-live="polite"
              data-collection-claim-spotlight="true"
            >
              <script
                type="application/json"
                data-collection-spotlight-data
                dangerouslySetInnerHTML={{ __html: safeJsonPayload(spotlight) }}
              />
              <p class="collection-spotlight-kicker">
                <span data-collection-spotlight-type>Objektas</span>
                <span data-collection-spotlight-count />
              </p>
              <a class="collection-spotlight-object" href="#" data-collection-spotlight-object />
              <a class="collection-spotlight-claim" href="#" data-collection-spotlight-claim />
              <p class="collection-spotlight-source" data-collection-spotlight-source />
              <div
                class="collection-spotlight-dots"
                aria-label="Teiginių pasirinkimas"
                data-collection-spotlight-dots
              />
            </section>
          )}
          <form
            class="collection-hero-search"
            role="search"
            action={resolveRelative(currentSlug, "objektai/index" as FullSlug)}
            data-collection-object-search="true"
          >
            <label class="sr-only" for="collection-object-type">
              Objekto tipas
            </label>
            <select id="collection-object-type" name="type" data-collection-search-type>
              {objectSearchTypes.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
            <label class="sr-only" for="collection-object-query">
              Ieškoti kolekcijoje
            </label>
            <input
              id="collection-object-query"
              name="q"
              type="search"
              autocomplete="off"
              placeholder="Ieškoti objekto, asmens, vietos ar sąvokos"
              data-collection-search-input
            />
            <button type="submit" aria-label="Ieškoti kolekcijoje">
              <span aria-hidden="true">→</span>
            </button>
            <div class="collection-search-suggestions" data-collection-search-suggestions hidden />
          </form>
          <dl class="collection-hero-stats" aria-label="Kolekcijos statistika">
            <div>
              <dt>Objektai</dt>
              <dd>{objectTotal.toLocaleString("lt-LT")}</dd>
            </div>
            <div>
              <dt>Teiginiai</dt>
              <dd>{claimTotal.toLocaleString("lt-LT")}</dd>
            </div>
            <div>
              <dt>Citatos</dt>
              <dd>{quoteTotal.toLocaleString("lt-LT")}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section class="collection-browse" aria-label="Objektai, temos ir laikotarpiai">
        <div class="collection-browse-shell" data-collection-browse-tabs="true">
          <div class="collection-browse-tabs" role="tablist" aria-label="Naršymo skiltys">
            {groups.map((group, index) => (
              <button
                id={`collection-browse-tab-${group.kind}`}
                type="button"
                role="tab"
                aria-selected={index === 0 ? "true" : "false"}
                aria-controls={`collection-browse-panel-${group.kind}`}
                data-collection-browse-tab={String(index)}
              >
                <span>{group.label}</span>
                <small>{group.links.length.toLocaleString("lt-LT")}</small>
              </button>
            ))}
          </div>
          {groups.map((group, index) => (
            <section
              id={`collection-browse-panel-${group.kind}`}
              class={`collection-browse-group collection-browse-group-${group.kind}`}
              role="tabpanel"
              aria-labelledby={`collection-browse-tab-${group.kind}`}
              data-collection-browse-panel={String(index)}
              hidden={index === 0 ? undefined : true}
            >
              <div class="collection-browse-group-header">
                <a class="collection-browse-all" href={resolveRelative(currentSlug, group.href)}>
                  Žiūrėti visus
                </a>
              </div>
              {group.kind === "objects" ? (
                <div class="collection-image-grid">
                  {group.links.map((link, linkIndex) => (
                    <a
                      class={`collection-image-link collection-crop-${(linkIndex % 6) + 1}`}
                      href={resolveRelative(currentSlug, link.slug)}
                    >
                      {link.imageKey &&
                        imagePicture(
                          currentSlug,
                          link.imageKey,
                          link.imageAlt ?? "",
                          "collection-image-link-media",
                          "lazy",
                          960,
                          640,
                        )}
                      <span class="collection-image-link-title">
                        <strong>{link.title}</strong>
                        {link.meta && <small>{link.meta}</small>}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <div class="collection-directory-grid">
                  {group.links.map((link, linkIndex) => (
                    <a
                      class="collection-directory-link"
                      href={resolveRelative(currentSlug, link.slug)}
                    >
                      <span>{String(linkIndex + 1).padStart(2, "0")}</span>
                      <strong>{link.title}</strong>
                      {link.meta && <small>{link.meta}</small>}
                    </a>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </section>

      <section class="collection-about-band" aria-labelledby="collection-about-title">
        <div class="collection-about-intro">
          <p class="collection-kicker">Apie svetainę</p>
          <h2 id="collection-about-title" class="collection-about-brand-title">
            <BrandLockup showTagline />
          </h2>
        </div>
        <div class="collection-about-methodology">
          <article>
            <h3>Metodas</h3>
            <p>
              Istorijos šaltiniai skaidomi į atskirus teiginius. Jie siejami su citatomis,
              asmenimis, vietomis, įvykiais, temomis ir laikotarpiais, išsaugant kelią atgal į
              pirminį šaltinį ir jo kontekstą.
            </p>
          </article>
          <article>
            <h3>Klaidos ir auditas</h3>
            <p>
              Automatinio apdorojimo, vardų sutapatinimo, datavimo ar interpretavimo klaidų gali
              pasitaikyti. Todėl tikrinama citatų aprėptis, dublikatai, dviprasmės tapatybės,
              objektų ryšiai ir vaizdų atitikimas.
            </p>
          </article>
          <article>
            <h3>Nuolatinis darbas</h3>
            <p>
              Audituose rasti netikslumai taisomi, įrašai papildomai pagrindžiami ir peržiūrimi iš
              naujo. Kolekcija nėra baigtinis leidinys: ji nuolat pildoma, tikslinama ir tobulinama.
            </p>
          </article>
        </div>
        <nav class="collection-about-actions" aria-label="Pradėti naršyti">
          <a href={resolveRelative(currentSlug, "objektai" as FullSlug)}>Objektai</a>
          <a href={resolveRelative(currentSlug, "temos" as FullSlug)}>Temos</a>
          <a href={resolveRelative(currentSlug, "laikotarpiai" as FullSlug)}>Laikotarpiai</a>
          <a href={resolveRelative(currentSlug, "zemelapis" as FullSlug)}>Žemėlapis</a>
        </nav>
      </section>

      <section
        class="collection-section collection-highlights"
        aria-labelledby="collection-highlights-title"
      >
        <div class="collection-section-heading collection-section-heading-compact">
          <p>Akcentai</p>
          <div>
            <h2 id="collection-highlights-title">Objektai, nuo kurių verta pradėti</h2>
            <p class="collection-section-lead">
              Skirtingi kolekcijos keliai per asmenis, vietas, grupes, autorius ir šaltinius.
            </p>
          </div>
        </div>
        <div class="collection-object-mosaic">
          {highlights.map((card, index) => (
            <a
              class={`collection-object-tile${index === 0 ? " collection-object-tile-featured" : ""}`}
              href={resolveRelative(currentSlug, card.slug)}
            >
              <img
                src={card.imageUrl}
                alt={card.imageAlt}
                width={card.image.width || undefined}
                height={card.image.height || undefined}
                loading="lazy"
                decoding="async"
              />
              <span class="collection-object-tile-shade" aria-hidden="true" />
              <span class="collection-object-tile-copy">
                <span class="collection-type-label">{typeLabels.get(card.type) ?? card.type}</span>
                <strong>{card.title}</strong>
                {index === 0 && card.summary && <small>{card.summary}</small>}
                <span class="collection-object-tile-meta">
                  {card.claimCount.toLocaleString("lt-LT")} teiginių
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

HomeCollection.css = styles
HomeCollection.afterDOMLoaded = script

export default (() => HomeCollection) satisfies QuartzComponentConstructor
