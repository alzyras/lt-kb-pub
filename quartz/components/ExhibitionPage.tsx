import { ArrowLeft, ArrowRight, ExternalLink, Images, Quote, Tags } from "lucide-preact"
import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import type { ExhibitionItem, ExhibitionManifest } from "../util/exhibitions"
import { cleanText, displayCreator, displayDate, mediaDetailUrl } from "../util/objectMedia"
import { mediaLicenseLabel } from "../util/mediaGallery"
import style from "./styles/exhibitionPage.scss"

function parseManifest(value: unknown): ExhibitionManifest | undefined {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value
    return parsed &&
      typeof parsed === "object" &&
      Array.isArray((parsed as ExhibitionManifest).sections)
      ? (parsed as ExhibitionManifest)
      : undefined
  } catch {
    return undefined
  }
}

function ItemMeta({ item }: { item: ExhibitionItem }) {
  const media = item.media
  const facts = [
    displayCreator(media.creator),
    displayDate(media.dateDisplay),
    cleanText(media.institution || media.providerLabel || media.provider),
  ].filter(Boolean)
  return (
    <>
      {facts.length > 0 && <p class="exhibition-item-meta">{facts.join(" · ")}</p>}
      <div class="exhibition-item-rights">
        <span>{mediaLicenseLabel(media.license) || "Teisės nenurodytos"}</span>
        {media.attribution && <span>{media.attribution}</span>}
      </div>
    </>
  )
}

function ClaimLinks({ item }: { item: ExhibitionItem }) {
  if (!item.claims.length) return null
  return (
    <div class="exhibition-claims">
      {item.claims.map((claim) => (
        <details
          class={`exhibition-claim ${claim.role === "direct" ? "is-direct" : "is-contextual"}`}
        >
          <summary>
            <Quote size={14} aria-hidden="true" /> {claim.label || "Šaltinis ir citata"}
          </summary>
          <div class="exhibition-claim-label">
            {claim.role === "direct" ? "Tiesiogiai apie eksponatą" : "Istorinis kontekstas"}
          </div>
          <p>{claim.text}</p>
          <div class="exhibition-claim-footer">
            <small>{claim.sourceTitle}</small>
            <a href={claim.url}>
              Skaityti citatą <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </details>
      ))}
    </div>
  )
}

function ItemTags({ item }: { item: ExhibitionItem }) {
  const canonical = (item.media.tags ?? []).slice(0, 8)
  const source = (item.media.sourceTags ?? []).slice(0, 10)
  if (!canonical.length && !source.length) return null
  return (
    <div class="exhibition-tag-groups">
      {canonical.length > 0 && (
        <div>
          <strong>
            <Tags size={13} /> Temos
          </strong>
          <p>{canonical.map((tag) => `#${tag.label}`).join(" · ")}</p>
        </div>
      )}
      {source.length > 0 && (
        <details>
          <summary>Originalios šaltinio žymos ({source.length})</summary>
          <p>{source.map((tag) => tag.label).join(" · ")}</p>
        </details>
      )}
    </div>
  )
}

function Exhibit({ item, index }: { item: ExhibitionItem; index: number }) {
  const media = item.media
  const imageUrl = cleanText(media.thumbUrl || media.sourceUrl)
  return (
    <article class={`exhibition-item ${index % 2 ? "is-reversed" : ""}`} id={item.exhibitionItemId}>
      <a
        class="exhibition-item-image"
        href={mediaDetailUrl(media)}
        aria-label={`Atidaryti vaizdą: ${item.titleLt}`}
      >
        <img
          src={imageUrl}
          alt={cleanText(media.caption) || item.titleLt}
          width={media.width || undefined}
          height={media.height || undefined}
          loading={index < 2 ? "eager" : "lazy"}
          decoding="async"
        />
        <span>
          Atidaryti vaizdo kortelę <ExternalLink size={14} />
        </span>
      </a>
      <div class="exhibition-item-copy">
        <span class="exhibition-item-number">{String(index + 1).padStart(2, "0")}</span>
        <h3>{item.titleLt}</h3>
        <ItemMeta item={item} />
        <p class="exhibition-item-description">{item.descriptionLt}</p>
        <ClaimLinks item={item} />
        <ItemTags item={item} />
        {media.canonicalUrl && (
          <a
            class="exhibition-source-link"
            href={media.canonicalUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            Pirminis vaizdo įrašas <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  )
}

function ExhibitionDetail({ exhibition }: { exhibition: ExhibitionManifest }) {
  const hero = cleanText(exhibition.hero.sourceUrl || exhibition.hero.thumbUrl)
  let exhibitIndex = 0
  const catalogue = exhibition.sections.flatMap((section) =>
    section.items.filter((item) => !item.featured),
  )
  return (
    <main class={`exhibition-page exhibition-theme--${exhibition.theme || "historical"}`}>
      <header
        class="exhibition-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5,3,2,.88), rgba(5,3,2,.24)), url(${JSON.stringify(hero).slice(1, -1)})`,
        }}
      >
        <div>
          <p class="exhibition-eyebrow">
            <Images size={15} /> Skaitmeninė paroda
          </p>
          <h1>{exhibition.title}</h1>
          <p class="exhibition-subtitle">{exhibition.subtitle}</p>
          <p class="exhibition-intro">{exhibition.description}</p>
          <p class="exhibition-proof-note">
            Kiekvienas faktinis teiginys turi nuorodą į šaltinį. Vaizdo interpretacijos pažymėtos
            kaip parodos pasakojimas.
          </p>
          <a href="#parodos-pradzia">
            Pradėti parodą <ArrowRight size={17} />
          </a>
        </div>
      </header>
      <nav class="exhibition-chapters" aria-label="Parodos skyriai">
        {exhibition.sections.map((section, index) => (
          <a href={`#${section.slug}`}>
            <span>{index + 1}</span>
            {section.title}
          </a>
        ))}
      </nav>
      <div id="parodos-pradzia" />
      {exhibition.sections.map((section, sectionIndex) => {
        const featured = section.items.filter((item) => item.featured)
        return (
          <section class="exhibition-section" id={section.slug}>
            <header>
              <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
              <h2>{section.title}</h2>
              <p>{section.lead}</p>
            </header>
            <div class="exhibition-section-items">
              {featured.map((item) => {
                const index = exhibitIndex++
                return <Exhibit item={item} index={index} />
              })}
            </div>
          </section>
        )
      })}
      {catalogue.length > 0 && (
        <section class="exhibition-catalogue" id="katalogas">
          <header>
            <p class="exhibition-eyebrow">Papildomas katalogas</p>
            <h2>Kiti patikrinti Vytauto vaizdai</h2>
          </header>
          <div>
            {catalogue.map((item) => (
              <article>
                <a href={mediaDetailUrl(item.media)}>
                  <img
                    src={item.media.thumbUrl || item.media.sourceUrl}
                    alt={item.titleLt}
                    loading="lazy"
                  />
                </a>
                <h3>{item.titleLt}</h3>
                <p>{item.catalogDescriptionLt}</p>
                <ClaimLinks item={item} />
              </article>
            ))}
          </div>
        </section>
      )}
      <footer class="exhibition-footer">
        <a href="/parodos">
          <ArrowLeft size={16} /> Visos parodos
        </a>
        <a href="/objektai/asmenys/Vytautas%20Didysis">
          Vytauto Didžiojo istorijos objektas <ArrowRight size={16} />
        </a>
      </footer>
    </main>
  )
}

function ExhibitionIndex({ exhibitions }: { exhibitions: ExhibitionManifest[] }) {
  return (
    <main class="exhibitions-index">
      <header>
        <p class="exhibition-eyebrow">
          <Images size={15} /> Kuruoti pasakojimai
        </p>
        <h1>Skaitmeninės parodos</h1>
        <p>
          Dvi perspektyvos į tą patį istorijos pasaulį: šaltinis, vaizdas ir atmintis vienoje
          kelionėje.
        </p>
      </header>
      <div>
        {exhibitions.map((exhibition) => (
          <article
            class={`exhibition-index-card exhibition-theme--${exhibition.theme || "historical"}`}
          >
            <a href={`/${exhibition.slug}`}>
              <img
                src={exhibition.hero.thumbUrl || exhibition.hero.sourceUrl}
                alt={exhibition.title}
              />
            </a>
            <div>
              <span>
                {exhibition.theme === "interwar" ? "Teminė paroda · 1930-ieji" : "Nuolatinė paroda"}
              </span>
              <h2>
                <a href={`/${exhibition.slug}`}>{exhibition.title}</a>
              </h2>
              <p>{exhibition.subtitle}</p>
              <a href={`/${exhibition.slug}`}>
                Atidaryti parodą <ArrowRight size={15} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

const ExhibitionPage: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const detail = parseManifest(fileData.frontmatter?.exhibition_manifest_json)
  if (detail) return <ExhibitionDetail exhibition={detail} />
  let exhibitions: ExhibitionManifest[] = []
  try {
    const value = fileData.frontmatter?.exhibitions_index_json
    exhibitions =
      typeof value === "string" ? JSON.parse(value) : ((value as ExhibitionManifest[]) ?? [])
  } catch {}
  return <ExhibitionIndex exhibitions={exhibitions} />
}

ExhibitionPage.css = style

export default (() => ExhibitionPage) satisfies QuartzComponentConstructor
