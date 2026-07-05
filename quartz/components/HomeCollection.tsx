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
}

type ObjectCard = {
  title: string
  slug: FullSlug
  type: string
  quoteCount: number
  claimCount: number
  summary: string
}

type BrowseLink = {
  title: string
  slug: FullSlug
  meta?: string
}

type BrowseGroup = {
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
  },
  {
    type: "ivykis",
    label: "Įvykiai",
    slug: "objektai/ivykiai" as FullSlug,
    description: "Mūšiai, sutartys, sukilimai ir politiniai lūžiai.",
  },
  {
    type: "vieta",
    label: "Vietos",
    slug: "objektai/vietos" as FullSlug,
    description: "Pilys, miestai, žemės, upės ir istorinės erdvės.",
  },
  {
    type: "grupe",
    label: "Grupės",
    slug: "objektai/grupes" as FullSlug,
    description: "Giminės, luomai, kariuomenės ir bendruomenės.",
  },
  {
    type: "daiktas",
    label: "Daiktai",
    slug: "objektai/daiktai" as FullSlug,
    description: "Dokumentai, ženklai, ginklai, paminklai ir artefaktai.",
  },
  {
    type: "paprotys",
    label: "Papročiai",
    slug: "objektai/paprociai" as FullSlug,
    description: "Apeigos, praktikos, teisės normos ir tradicijos.",
  },
  {
    type: "posakis",
    label: "Posakiai",
    slug: "objektai/posakiai" as FullSlug,
    description: "Citatos, formulės ir įsimintini pasakymai.",
  },
  {
    type: "zodyno_irasas",
    label: "Žodynas",
    slug: "objektai/zodynas" as FullSlug,
    description: "Sąvokos, terminai ir istorinė leksika.",
  },
  {
    type: "saltinis",
    label: "Šaltiniai",
    slug: "objektai/saltiniai" as FullSlug,
    description: "Knygos, kronikos ir kiti tekstai, iš kurių renkama bazė.",
  },
]

const typeLabels = new Map(categories.map((category) => [category.type, category.label]))

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

function objectCards(allFiles: QuartzPluginData[]): ObjectCard[] {
  return allFiles
    .filter(isObjectPage)
    .map((page) => {
      const markdown = markdownFor(page)
      const citation = collectCitationMetadata(markdown)
      const claimCount = collectClaimCount(markdown)
      return {
        title: String(page.frontmatter?.title ?? page.slug ?? ""),
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
    title: String(page.frontmatter?.title ?? page.slug ?? ""),
    slug: page.slug as FullSlug,
    meta,
  }
}

function pagesByPrefix(allFiles: QuartzPluginData[], prefix: string, limit: number): BrowseLink[] {
  return allFiles
    .filter((page) => String(page.slug ?? "").startsWith(prefix) && page.frontmatter?.title)
    .sort((a, b) =>
      String(a.frontmatter?.title ?? "").localeCompare(String(b.frontmatter?.title ?? ""), "lt"),
    )
    .slice(0, limit)
    .map((page) => linkFromPage(page))
}

function objectLinks(cards: ObjectCard[], type: string, limit: number): BrowseLink[] {
  return [...cards]
    .filter((card) => card.type === type)
    .sort((a, b) => b.quoteCount * 4 + b.claimCount - (a.quoteCount * 4 + a.claimCount))
    .slice(0, limit)
    .map((card) => ({
      title: card.title,
      slug: card.slug,
      meta: `${card.claimCount.toLocaleString("lt-LT")} teig.`,
    }))
}

function browseGroups(
  allFiles: QuartzPluginData[],
  cards: ObjectCard[],
  typeCounts: Map<string, number>,
): BrowseGroup[] {
  return [
    {
      label: "Temos",
      description: "Teminiai keliai per objektus ir šaltinius.",
      href: "temos" as FullSlug,
      links: pagesByPrefix(allFiles, "temos/", 12),
    },
    {
      label: "Laikotarpiai",
      description: "Chronologiniai vartai į kolekciją.",
      href: "laikotarpiai" as FullSlug,
      links: pagesByPrefix(allFiles, "laikotarpiai/", 12),
    },
    {
      label: "Asmenys",
      description: "Vardai, valdovai, autoriai ir liudininkai.",
      href: "objektai/asmenys" as FullSlug,
      links: objectLinks(cards, "asmuo", 12),
    },
    {
      label: "Objektų tipai",
      description: "Pagrindinės kolekcijos kategorijos.",
      href: "objektai" as FullSlug,
      links: categories.map((category) => ({
        title: category.label,
        slug: category.slug,
        meta: `${(typeCounts.get(category.type) ?? 0).toLocaleString("lt-LT")} įraš.`,
      })),
    },
    {
      label: "Vietos",
      description: "Pilys, miestai, kraštai ir istorinės erdvės.",
      href: "objektai/vietos" as FullSlug,
      links: objectLinks(cards, "vieta", 12),
    },
  ].filter((group) => group.links.length > 0)
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
  const groups = browseGroups(allFiles, cards, typeCounts)
  const objectTotal = [...typeCounts.values()].reduce((sum, count) => sum + count, 0)
  const claimTotal = cards.reduce((sum, card) => sum + card.claimCount, 0)
  const quoteTotal = cards.reduce((sum, card) => sum + card.quoteCount, 0)
  const currentSlug = fileData.slug ?? ("index" as FullSlug)

  return (
    <div class="collection-home">
      <section class="collection-hero" aria-labelledby="collection-hero-title">
        <div class="collection-hero-image" aria-hidden="true" />
        <div class="collection-hero-content">
          <h1 id="collection-hero-title">Kolekcija</h1>
          <button
            class="collection-hero-search"
            type="button"
            data-collection-search-trigger="true"
          >
            <span>Search</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <section class="collection-intro" aria-labelledby="collection-intro-title">
        <div class="collection-intro-copy">
          <h2 id="collection-intro-title" class="sr-only">
            Apie kolekciją
          </h2>
          <p>
            LT KB kolekcijoje šaltiniai, objektai, teiginiai ir citatos sujungti į vieną naršomą
            Lietuvos istorijos tyrimo sistemą.
          </p>
          <button type="button" data-collection-search-trigger="true">
            Search Full Collection
          </button>
        </div>
      </section>

      <section class="collection-browse" aria-labelledby="collection-browse-title">
        <div class="collection-tabs-header">
          <h2 id="collection-browse-title">Browse</h2>
          <div class="collection-browse-tabs" role="tablist" aria-label="Kolekcijos naršymo keliai">
            {groups.map((group, index) => (
              <button
                id={`collection-tab-${index}`}
                class={index === 0 ? "is-active" : ""}
                type="button"
                role="tab"
                aria-selected={index === 0 ? "true" : "false"}
                aria-controls={`collection-panel-${index}`}
                data-collection-tab={index}
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>
        <div class="collection-tab-panels">
          {groups.map((group, index) => (
            <section
              id={`collection-panel-${index}`}
              class={`collection-tab-panel ${index === 0 ? "is-active" : ""}`}
              role="tabpanel"
              aria-labelledby={`collection-tab-${index}`}
              data-collection-tab-panel={index}
            >
              <p>{group.description}</p>
              <div class="collection-image-grid">
                {group.links.slice(0, 6).map((link, linkIndex) => (
                  <a
                    class={`collection-image-link collection-crop-${(linkIndex % 6) + 1}`}
                    href={resolveRelative(currentSlug, link.slug)}
                  >
                    <span class="collection-image-link-media" aria-hidden="true" />
                    <span class="collection-image-link-title">
                      <strong>{link.title}</strong>
                      {link.meta && <small>{link.meta}</small>}
                    </span>
                  </a>
                ))}
              </div>
              <a class="collection-browse-all" href={resolveRelative(currentSlug, group.href)}>
                Visi: {group.label}
              </a>
            </section>
          ))}
        </div>
      </section>

      <section class="collection-full-search" aria-labelledby="collection-full-search-title">
        <div>
          <p class="collection-kicker">Search Full Collection</p>
          <h2 id="collection-full-search-title">Ieškok visoje LT KB kolekcijoje</h2>
        </div>
        <div class="collection-full-search-actions">
          <p>
            Atverk bendrą paiešką, jei ieškai konkretaus asmens, vietos, šaltinio, teiginio, datos
            ar raktinio žodžio visame viešame korpuse.
          </p>
          <button type="button" data-collection-search-trigger="true">
            Search Full Collection
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
          <p>Featured</p>
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
          <p>Sources</p>
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
