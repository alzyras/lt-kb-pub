import fs from "node:fs"
import { QuartzPluginData } from "../plugins/vfile"
import { collectCitationMetadata, collectClaimCount } from "../util/citationFilter"
import { FullSlug, resolveRelative } from "../util/path"
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
  summary: string
}

type SpotlightClaim = {
  id: string
  text: string
  source?: string
  author?: string
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

function citationSources(markdown: string): Map<string, { source?: string; author?: string }> {
  const section = sectionMarkdown(markdown, "Reikšmingi paminėjimai")
  const citations = new Map<string, { source?: string; author?: string }>()
  const citationRegex = /(?:^|\n)-\s+(c-\d+)\s*\n([\s\S]*?)(?=\n-\s+c-\d+\s*\n|\s*$)/g

  for (const match of section.matchAll(citationRegex)) {
    const id = match[1]
    const block = match[2] ?? ""
    const source = fieldValue(block, "šaltinis") || fieldValue(block, "saltinis")
    const author = fieldValue(block, "autorius")

    citations.set(id, {
      source: source || undefined,
      author: author || undefined,
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
      .find((entry) => entry?.source || entry?.author)

    seen.add(text.toLocaleLowerCase("lt-LT"))
    claims.push({
      id,
      text,
      source: citation?.source,
      author: citation?.author,
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
  return new Set([...markdown.matchAll(/\[\[(objektai\/[^\]|#]+)(?:\|[^\]]+)?\]\]/g)].map((match) => match[1])).size
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

function topCards(cards: ObjectCard[], limit: number): ObjectCard[] {
  return [...cards]
    .sort((a, b) => {
      const scoreA = a.quoteCount * 4 + a.claimCount
      const scoreB = b.quoteCount * 4 + b.claimCount
      return scoreB - scoreA || a.title.localeCompare(b.title, "lt")
    })
    .slice(0, limit)
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
    .sort(
      (a, b) =>
        b.count - a.count || pageTitle(a.page).localeCompare(pageTitle(b.page), "lt"),
    )

  return (typeof limit === "number" ? links.slice(0, limit) : links)
    .map(({ page, count }) => ({
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
      links: largestHubLinks(
        allFiles,
        "temos/",
        undefined,
        "category-temos",
        "1696 m. Lietuvos ir Lenkijos žemėlapio fragmentas",
      ),
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

function sourceCards(cards: ObjectCard[], limit: number): ObjectCard[] {
  return [...cards]
    .filter((card) => card.type === "saltinis")
    .sort((a, b) => b.quoteCount + b.claimCount - (a.quoteCount + a.claimCount))
    .slice(0, limit)
}

const HomeCollection: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const typeCounts = countByType(allFiles)
  const cards = objectCards(allFiles)
  const highlights = topCards(cards, 6)
  const sources = sourceCards(cards, 4)
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
            <div
              class="collection-search-suggestions"
              data-collection-search-suggestions
              hidden
            />
          </form>
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

      <section class="collection-full-search" aria-labelledby="collection-full-search-title">
        <div>
          <p class="collection-kicker">Paieška</p>
          <h2 id="collection-full-search-title">Ieškok visoje LT KB kolekcijoje</h2>
        </div>
        <div class="collection-full-search-actions">
          <p>
            Atverk bendrą paiešką, jei ieškai konkretaus asmens, vietos, šaltinio, teiginio, datos
            ar raktinio žodžio visame viešame korpuse.
          </p>
          <button type="button" data-collection-search-trigger="true">
            Atidaryti paiešką
          </button>
        </div>
      </section>

      <section
        class="collection-info-band collection-care-band"
        aria-labelledby="collection-info-title"
      >
        <div>
          <p class="collection-kicker">Tyrimo struktūra</p>
          <h2 id="collection-info-title">Šaltiniai, ryšiai ir įrodymai vienoje vietoje.</h2>
        </div>
        <div class="collection-info-copy">
          <p>
            Kolekcija leidžia pereiti nuo šaltinio citatos iki objekto, nuo objekto iki laikotarpio,
            nuo teiginio iki susijusių vietų, asmenų ir įvykių.
          </p>
          <p>
            Tai darbo bazė, todėl skirtingų laikotarpių pasakojimai, legendiniai tekstai ir
            poleminiai šaltiniai pateikiami kartu su jų kilme bei citavimo kontekstu.
          </p>
        </div>
      </section>

      <section class="collection-editorial-band" aria-labelledby="collection-editorial-title">
        <p class="collection-kicker">Kolekcijos skaitymas</p>
        <h2 id="collection-editorial-title">
          Pradėk nuo objekto, tada sek jo citatas, laikotarpius ir susijusias temas.
        </h2>
        <div>
          <a href={resolveRelative(currentSlug, "objektai" as FullSlug)}>Objektai</a>
          <a href={resolveRelative(currentSlug, "temos" as FullSlug)}>Temos</a>
          <a href={resolveRelative(currentSlug, "laikotarpiai" as FullSlug)}>Laikotarpiai</a>
        </div>
      </section>

      <section class="collection-stats" aria-label="Kolekcijos statistika">
        <dl>
          <div>
            <dt>Objektai</dt>
            <dd>{objectTotal.toLocaleString("lt-LT")}</dd>
          </div>
          <div>
            <dt>Kategorijos</dt>
            <dd>{categories.length}</dd>
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
      </section>

      <section
        class="collection-section collection-highlights"
        aria-labelledby="collection-highlights-title"
      >
        <div class="collection-section-heading">
          <p>Akcentai</p>
          <h2 id="collection-highlights-title">Kolekcijos akcentai</h2>
        </div>
        <div class="collection-highlight-grid">
          {highlights.map((card, index) => (
            <a class="collection-highlight-card" href={resolveRelative(currentSlug, card.slug)}>
              <span class="collection-card-image" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span class="collection-type-label">{typeLabels.get(card.type) ?? card.type}</span>
              <h3>{card.title}</h3>
              {card.summary && <p>{card.summary}</p>}
              <span class="collection-card-meta">
                {card.claimCount.toLocaleString("lt-LT")} teig. /{" "}
                {card.quoteCount.toLocaleString("lt-LT")} cit.
              </span>
            </a>
          ))}
        </div>
      </section>

      <section
        class="collection-section collection-sources"
        aria-labelledby="collection-sources-title"
      >
        <div class="collection-section-heading">
          <p>Šaltiniai</p>
          <h2 id="collection-sources-title">Kolekcijos šaltiniai</h2>
        </div>
        <div class="collection-source-grid">
          {sources.map((source) => (
            <a class="collection-source-card" href={resolveRelative(currentSlug, source.slug)}>
              <h3>{source.title}</h3>
              <span>
                {source.claimCount.toLocaleString("lt-LT")} teig. /{" "}
                {source.quoteCount.toLocaleString("lt-LT")} cit.
              </span>
            </a>
          ))}
        </div>
      </section>

      <section class="collection-research-band" aria-labelledby="collection-research-title">
        <div>
          <p class="collection-kicker">Tolesnis tyrimas</p>
          <h2 id="collection-research-title">Peržiūrėk kolekciją per žemėlapį arba šaltinius.</h2>
        </div>
        <div class="collection-research-links">
          <a href={resolveRelative(currentSlug, "zemelapis" as FullSlug)}>Žemėlapis</a>
          <a href={resolveRelative(currentSlug, "objektai/saltiniai" as FullSlug)}>Šaltiniai</a>
          <button type="button" data-collection-copy-link>
            Kopijuoti nuorodą
          </button>
        </div>
      </section>
    </div>
  )
}

HomeCollection.css = styles
HomeCollection.afterDOMLoaded = script

export default (() => HomeCollection) satisfies QuartzComponentConstructor
