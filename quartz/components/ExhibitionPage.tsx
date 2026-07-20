import { ArrowLeft, ArrowRight, ExternalLink, Images, Play, Quote, Tags } from "lucide-preact"
import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import type { ExhibitionClaim, ExhibitionItem, ExhibitionManifest } from "../util/exhibitions"
import { cleanText, displayCreator, displayDate } from "../util/objectMedia"
import { mediaLicenseLabel } from "../util/mediaGallery"
import style from "./styles/exhibitionPage.scss"
import photoswipeStyle from "./styles/photoswipe.scss"
import viewerStyle from "./styles/objectMediaGallery.scss"
// @ts-ignore
import script from "./scripts/exhibition.inline"

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
    { value: displayCreator(item.creatorDisplay || media.creator), isDate: false },
    { value: displayDate(item.dateDisplay || media.dateDisplay), isDate: true },
    {
      value: cleanText(media.institution || media.providerLabel || media.provider),
      isDate: false,
    },
  ].filter((fact) => fact.value)
  return (
    <>
      {facts.length > 0 && (
        <p class="exhibition-item-meta">
          {facts.map((fact, index) => (
            <span class="exhibition-item-meta-fact" data-exhibition-date={fact.isDate || undefined}>
              {fact.value}
              {index < facts.length - 1 && <span aria-hidden="true"> · </span>}
            </span>
          ))}
        </p>
      )}
      <div class="exhibition-item-rights">
        <span>{mediaLicenseLabel(media.license) || "Teisės nenurodytos"}</span>
        {media.attribution && <span>{media.attribution}</span>}
      </div>
    </>
  )
}

function ClaimLinks({ claims }: { claims: ExhibitionClaim[] }) {
  if (!claims.length) return null
  return (
    <div class="exhibition-claims">
      {claims.map((claim) => (
        <details
          class={`exhibition-claim ${claim.role === "direct" ? "is-direct" : "is-contextual"}`}
        >
          <summary>
            <Quote size={14} aria-hidden="true" />
            <span>{claim.text}</span>
            <code>{claim.claimId}</code>
          </summary>
          <div class="exhibition-claim-label">
            {claim.label ||
              (claim.role === "direct" ? "Tiesiogiai apie eksponatą" : "Istorinis kontekstas")}
          </div>
          <blockquote>{claim.quote}</blockquote>
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

function galleryUrl(exhibitionId: string, mediaId: string): string {
  return `/galerija/?media=${encodeURIComponent(mediaId)}&exhibition=${encodeURIComponent(exhibitionId)}`
}

function mediaFrame(item: ExhibitionItem): { className: string; aspect: number } {
  const width = Number(item.media.width)
  const height = Number(item.media.height)
  const ratio = width > 0 && height > 0 ? width / height : 4 / 3
  const aspect = Math.min(1.72, Math.max(0.68, ratio))
  const orientation = ratio < 0.82 ? "is-portrait" : ratio > 1.3 ? "is-landscape" : "is-square"
  const codes = new Set((item.media.tags ?? []).flatMap((tag) => [tag.code, tag.label]))
  const material = codes.has("moneta")
    ? "is-coin"
    : codes.has("dokumentas") || codes.has("rankraštis")
      ? "is-document"
      : "is-artwork"
  return { className: `${orientation} ${material}`, aspect }
}

function Exhibit({
  item,
  index,
  exhibitionId,
}: {
  item: ExhibitionItem
  index: number
  exhibitionId: string
}) {
  const media = item.media
  // Large exhibition panels should never upscale a thumbnail.
  const imageUrl = cleanText(media.sourceUrl || media.thumbUrl)
  const frame = mediaFrame(item)
  return (
    <article
      class={`exhibition-item ${frame.className} ${index % 2 ? "is-reversed" : ""}`}
      id={item.exhibitionItemId}
    >
      <a
        class="exhibition-item-image"
        href={galleryUrl(exhibitionId, item.mediaId)}
        data-exhibition-media={item.mediaId}
        data-exhibition-id={exhibitionId}
        style={`--media-aspect:${frame.aspect}`}
        aria-label={`Atidaryti vaizdą: ${item.titleLt}`}
      >
        <img
          src={imageUrl}
          alt={cleanText(media.caption) || item.titleLt}
          width={media.width || undefined}
          height={media.height || undefined}
          loading={index < 6 ? "eager" : "lazy"}
          decoding="async"
          sizes="(max-width: 800px) calc(100vw - 2rem), 58vw"
        />
        <span>
          Atidaryti vaizdo kortelę <ExternalLink size={14} />
        </span>
      </a>
      <div class="exhibition-item-copy">
        <span class="exhibition-item-number">{String(index + 1).padStart(2, "0")}</span>
        <h3>{item.titleLt}</h3>
        <ItemMeta item={item} />
        <div class="exhibition-narrative-label">Parodos pasakojimas</div>
        <p class="exhibition-item-description">{item.descriptionLt}</p>
        {item.evidenceNoteLt && <p class="exhibition-evidence-note">{item.evidenceNoteLt}</p>}
        <ClaimLinks claims={item.claims} />
        <ItemTags item={item} />
        {media.canonicalUrl && (
          <a
            class="exhibition-source-link"
            href={media.canonicalUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            Pirminis vaizdas <ExternalLink size={14} />
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
    <main
      class={`exhibition-page exhibition-theme--${exhibition.theme || "historical"}`}
      data-exhibition-id={exhibition.exhibitionId}
    >
      <header class="exhibition-hero">
        <div class="exhibition-hero-media" aria-hidden="true">
          <img
            src={hero}
            alt=""
            width={exhibition.hero.width || undefined}
            height={exhibition.hero.height || undefined}
            loading="eager"
            decoding="async"
          />
        </div>
        <div class="exhibition-hero-scrim" aria-hidden="true" />
        <div class="exhibition-hero-content">
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
          <div class="exhibition-reading-key" aria-label="Kaip skaityti parodą">
            <span class="is-narrative">Parodos pasakojimas</span>
            <span class="is-source">Šaltinis ir citata</span>
          </div>
          <div class="exhibition-hero-actions">
            <a href="#parodos-pradzia">
              Pradėti parodą <ArrowRight size={17} />
            </a>
            <a
              class="is-slideshow"
              href="?mode=slideshow"
              data-exhibition-slideshow
              aria-label="Paleisti automatinę parodos peržiūrą"
            >
              <Play size={16} fill="currentColor" /> Paleisti peržiūrą
            </a>
          </div>
        </div>
      </header>
      <nav
        class="exhibition-chapters"
        aria-label="Parodos skyriai"
        style={`--chapter-count:${exhibition.sections.length}`}
      >
        {exhibition.sections.map((section, index) => (
          <a href={`#${section.slug}`} data-exhibition-chapter={section.slug}>
            <img
              src={section.navMedia.thumbUrl || section.navMedia.sourceUrl}
              alt=""
              aria-hidden="true"
              style={`object-position:${section.navImagePosition || "50% 30%"}`}
            />
            <span class="exhibition-chapter-scrim" aria-hidden="true" />
            <span class="exhibition-chapter-number">{index + 1}</span>
            <span class="exhibition-chapter-title">{section.title}</span>
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
              {section.evidenceNoteLt && (
                <p class="exhibition-evidence-note">{section.evidenceNoteLt}</p>
              )}
              {section.claims.length > 0 && (
                <div class="exhibition-section-claims">
                  <ClaimLinks claims={section.claims} />
                </div>
              )}
            </header>
            <div class="exhibition-section-items">
              {featured.map((item) => {
                const index = exhibitIndex++
                return <Exhibit item={item} index={index} exhibitionId={exhibition.exhibitionId} />
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
            {catalogue.map((item) => {
              const frame = mediaFrame(item)
              return (
                <article class={frame.className}>
                  <a
                    href={galleryUrl(exhibition.exhibitionId, item.mediaId)}
                    data-exhibition-media={item.mediaId}
                    data-exhibition-id={exhibition.exhibitionId}
                    style={`--media-aspect:${frame.aspect}`}
                  >
                    <img
                      src={item.media.sourceUrl || item.media.thumbUrl}
                      alt={item.titleLt}
                      loading="lazy"
                    />
                  </a>
                  <h3>{item.titleLt}</h3>
                  <div class="exhibition-narrative-label">Kuratoriaus pastaba</div>
                  <p>{item.catalogDescriptionLt}</p>
                  <ClaimLinks claims={item.claims} />
                </article>
              )
            })}
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

ExhibitionPage.css = [photoswipeStyle, viewerStyle, style]
ExhibitionPage.afterDOMLoaded = script

export default (() => ExhibitionPage) satisfies QuartzComponentConstructor
