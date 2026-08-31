import {
  ArrowLeft,
  ArrowUpDown,
  Images,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-preact"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { ObjectPageTabs } from "./ObjectPageTabs"
import { objectDetailEvidenceFromFile } from "../util/objectDetail"
import { objectPageViewModel } from "../util/objectPageView"
import { FullSlug } from "../util/path"
// @ts-ignore Quartz bundles inline lifecycle scripts as strings.
import tabsScript from "./scripts/object-detail-tabs.inline"
import style from "./styles/objectMediaGallery.scss"
import photoswipeStyle from "./styles/photoswipe.scss"
import objectDetailStyle from "./styles/objectDetail.scss"
import {
  cleanText,
  displayCaption,
  displayCreator,
  displayDate,
  isMediaGalleryPage,
  MediaEntry,
  mediaDetailUrl,
  mediaImageUrl,
  parseMediaEntry,
  relationLabel,
} from "../util/objectMedia"
import {
  computeFacetSummary,
  mediaLicenseLabel,
  type MediaFacetKey,
  type MediaFacetOption,
  type MediaGalleryBootstrap,
} from "../util/mediaGallery"
// @ts-ignore
import script from "./scripts/object-media-gallery.inline"

const FACET_VISIBLE_LIMIT: Partial<Record<MediaFacetKey, number>> = {
  objects: 24,
  tags: 18,
}

const facetVisibleLimit = (key: MediaFacetKey) => FACET_VISIBLE_LIMIT[key] ?? 10

const FACETS: Array<{ key: MediaFacetKey; title: string; open?: boolean }> = [
  { key: "types", title: "Vaizdo tipas", open: true },
  { key: "directness", title: "Ryšys su objektu", open: true },
  { key: "objects", title: "Objektai", open: true },
  { key: "tags", title: "Temos ir tagai", open: true },
  { key: "periods", title: "Laikotarpis" },
  { key: "objectTypes", title: "Objekto tipas" },
  { key: "providers", title: "Tiekėjas" },
  { key: "institutions", title: "Institucija" },
  { key: "licenses", title: "Licencija" },
]

function parseBootstrap(value: unknown): MediaGalleryBootstrap {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray((parsed as MediaGalleryBootstrap).initialEntries)
    ) {
      return parsed as MediaGalleryBootstrap
    }
  } catch {}
  return {
    initialEntries: [],
    totalCount: 0,
    facetSummary: computeFacetSummary([]),
    catalogUrl: "/static/mediaCatalog.json",
    catalogVersion: "unknown",
  }
}

const objectHref = (notePath: string) =>
  `/${notePath.replace(/\.md$/i, "").split("/").map(encodeURIComponent).join("/")}`

function mediaAspect(entry: MediaEntry): number {
  const width = Number(entry.width)
  const height = Number(entry.height)
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return 4 / 3
  const ratio = width / height
  return ratio >= 0.1 && ratio <= 10 ? ratio : 4 / 3
}

function MediaDetailPage({ entry }: { entry: MediaEntry }) {
  const caption = displayCaption(entry)
  const originalTitle = cleanText(entry.originalTitle || entry.title)
  const creator = displayCreator(entry.creator)
  const date = displayDate(entry.dateDisplay)
  const provider = cleanText(entry.providerLabel || entry.provider)
  const imageUrl = mediaImageUrl(entry)
  const tags = [...new Map((entry.tags ?? []).map((tag) => [tag.code || tag.label, tag])).values()]
  const sourceTags = [
    ...new Map(
      (entry.sourceTags ?? []).map((tag) => [
        `${tag.provider}:${tag.field}:${tag.label.toLocaleLowerCase("lt")}`,
        tag,
      ]),
    ).values(),
  ]
  const context = cleanText(entry.visualEvidence || entry.metadataEvidence || entry.judgeReason)
  const facts = [
    ["Kūrėjas", creator],
    ["Data", date],
    ["Vaizdo tipas", relationLabel(entry.relationType)],
    ["Institucija", cleanText(entry.institution)],
    ["Rinkinys", cleanText(entry.collection)],
    ["Tiekėjas", provider],
  ].filter(([, value]) => value)

  return (
    <main class="media-detail-page" itemScope itemType="https://schema.org/ImageObject">
      <nav class="media-detail-breadcrumbs" aria-label="Kelias">
        <a href="/galerija">Lietuvos istorijos vaizdų galerija</a>
        <span aria-hidden="true">/</span>
        <span>Vaizdas</span>
      </nav>
      <header class="media-detail-header">
        <p class="media-gallery-eyebrow">
          <Images size={15} aria-hidden="true" /> Istorinis vaizdas
        </p>
        <h1 itemProp="name">{caption}</h1>
        {originalTitle && originalTitle !== caption && (
          <p class="media-detail-original-title">Originalus pavadinimas: {originalTitle}</p>
        )}
      </header>
      <div class="media-detail-layout">
        <figure class="media-detail-figure">
          <a href={imageUrl} target="_blank" rel="noreferrer noopener">
            <img
              src={imageUrl}
              alt={caption}
              width={entry.width || undefined}
              height={entry.height || undefined}
              decoding="async"
              itemProp="contentUrl"
            />
          </a>
          <figcaption itemProp="caption">{caption}</figcaption>
        </figure>
        <aside class="media-detail-panel">
          {facts.length > 0 && (
            <dl class="media-detail-facts">
              {facts.map(([label, value]) => (
                <div>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
          {(entry.relatedObjects?.length ?? 0) > 0 && (
            <section>
              <h2>Susiję istorijos objektai</h2>
              <div class="media-detail-links">
                {(entry.relatedObjects ?? []).map((object) => (
                  <a href={objectHref(object.notePath)}>{object.title}</a>
                ))}
              </div>
            </section>
          )}
          {tags.length > 0 && (
            <section>
              <h2>Temos</h2>
              <div class="media-detail-tags">
                {tags.map((tag) => (
                  <a href={`/galerija?tags=${encodeURIComponent(tag.code)}`}>#{tag.label}</a>
                ))}
              </div>
            </section>
          )}
          {sourceTags.length > 0 && (
            <section>
              <h2>Šaltinio žymos</h2>
              <div class="media-detail-source-tags">
                {sourceTags.map((tag) => (
                  <span title={`${tag.provider} · ${tag.field}`}>{tag.label}</span>
                ))}
              </div>
            </section>
          )}
          <section>
            <h2>Naudojimo teisės</h2>
            <p>
              <strong>{mediaLicenseLabel(entry.license) || "Nenurodyta"}</strong>
            </p>
            {entry.attribution && <p itemProp="creditText">{entry.attribution}</p>}
          </section>
          <div class="media-detail-actions">
            {entry.canonicalUrl && (
              <a href={entry.canonicalUrl} target="_blank" rel="noreferrer noopener">
                Atidaryti originalų šaltinį
              </a>
            )}
            {entry.licenseUrl && (
              <a href={entry.licenseUrl} target="_blank" rel="noreferrer noopener">
                Licencijos sąlygos
              </a>
            )}
          </div>
        </aside>
      </div>
      {context && (
        <section class="media-detail-context">
          <h2>Istorinis ir vaizdinis kontekstas</h2>
          <p itemProp="description">{context}</p>
        </section>
      )}
      <footer class="media-detail-footer">
        <a href="/galerija">
          <ArrowLeft size={16} /> Grįžti į visą galeriją
        </a>
        <code>{cleanText(entry.mediaId)}</code>
      </footer>
    </main>
  )
}

function MediaCard({
  entry,
  index,
}: {
  entry: MediaGalleryBootstrap["initialEntries"][number]
  index: number
}) {
  const tags = (entry.tags ?? []).slice(0, 2)
  const mediaHref = mediaDetailUrl(entry)
  return (
    <article
      class="media-gallery-card"
      data-media-id={entry.mediaId}
      style={`--media-aspect:${mediaAspect(entry)}`}
    >
      <a
        href={mediaHref}
        data-media-open={index}
        aria-label={`Atidaryti: ${displayCaption(entry)}`}
      >
        <span class="media-gallery-card-media">
          <img
            src={mediaImageUrl(entry)}
            alt={displayCaption(entry)}
            width={entry.width || undefined}
            height={entry.height || undefined}
            loading={index < 8 ? "eager" : "lazy"}
            decoding="async"
          />
          <span class="media-gallery-card-overlay">
            <span class="media-gallery-card-title">{displayCaption(entry)}</span>
            {displayDate(entry.dateDisplay) && <span>{displayDate(entry.dateDisplay)}</span>}
          </span>
          <span class="media-gallery-card-hover" aria-hidden="true">
            <span>{displayCreator(entry.creator)}</span>
            <span>
              {(entry.relatedObjects ?? [])
                .slice(0, 2)
                .map((object) => object.title)
                .join(" · ")}
            </span>
          </span>
        </span>
        <span class="sr-only">{tags.map((tag) => tag.label).join(", ")}</span>
      </a>
    </article>
  )
}

function FacetOptions({
  facetKey,
  options,
}: {
  facetKey: MediaFacetKey
  options: MediaFacetOption[]
}) {
  const visibleLimit = facetVisibleLimit(facetKey)
  return (
    <div class="media-facet-options" data-facet-options={facetKey}>
      {options.map((option, index) => (
        <label
          class="media-facet-option"
          data-facet-option
          data-facet-extra={index >= visibleLimit ? "true" : undefined}
        >
          <input type="checkbox" value={option.value} data-facet-input={facetKey} />
          <span class="media-facet-check" aria-hidden="true" />
          <span class="media-facet-label">{option.label}</span>
          <span class="media-facet-count">{option.count}</span>
        </label>
      ))}
    </div>
  )
}

const ObjectMediaGallery: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const mediaDetail = parseMediaEntry(fileData.frontmatter?.media_detail_json)
  if (fileData.frontmatter?.media_detail_page && mediaDetail) {
    return <MediaDetailPage entry={mediaDetail} />
  }
  if (!isMediaGalleryPage(fileData.slug)) return null

  const bootstrap = parseBootstrap(fileData.frontmatter?.media_gallery_bootstrap_json)
  const objectTitle =
    cleanText(fileData.frontmatter?.object_title) || cleanText(fileData.frontmatter?.title)
  const objectPath = cleanText(fileData.frontmatter?.object_note_path)
  const isObjectGallery = Boolean(objectPath)
  const objectUrl = objectPath
    ? `/${objectPath.replace(/\.md$/i, "").split("/").map(encodeURIComponent).join("/")}`
    : ""
  const safeBootstrap = JSON.stringify(bootstrap).replace(/</g, "\\u003c")
  const galleryTitle =
    cleanText(fileData.frontmatter?.title) || "Lietuvos istorijos vaizdų galerija"
  const galleryDescription = cleanText(fileData.frontmatter?.description)
  const objectSlug = cleanText(fileData.frontmatter?.object_slug) as FullSlug
  const galleryEvidence = isObjectGallery
    ? objectDetailEvidenceFromFile(String(fileData.frontmatter?.object_source_path || ""))
    : objectDetailEvidenceFromFile("")
  const objectView = objectPageViewModel(
    (fileData.frontmatter ?? {}) as Record<string, unknown>,
    galleryEvidence,
    { gallery: bootstrap.totalCount },
  )

  return (
    <main
      class="media-gallery-page"
      data-media-gallery="true"
      data-object-path={objectPath}
      data-catalog-url={bootstrap.catalogUrl}
      data-catalog-version={bootstrap.catalogVersion}
      data-gallery-path={`/${fileData.slug}`}
    >
      <header class="media-gallery-header">
        <div>
          <p class="media-gallery-eyebrow">
            <Images size={15} aria-hidden="true" /> Vaizdų archyvas
          </p>
          <h1>{isObjectGallery ? `${objectTitle} vaizdų galerija` : galleryTitle}</h1>
          <p class="media-gallery-lead">
            {galleryDescription ||
              (isObjectGallery
                ? "Patikrinti šio objekto atvaizdai ir istorinis kontekstas."
                : "Patikrinti Lietuvos istorijos vaizdai iš atvirų kultūros paveldo rinkinių.")}
          </p>
          {isObjectGallery && (
            <a class="media-gallery-object-back" href={objectUrl}>
              <ArrowLeft size={15} /> Grįžti į objektą
            </a>
          )}
        </div>
        <strong class="media-gallery-count" data-media-count>
          {bootstrap.totalCount} vaizdų
        </strong>
      </header>
      {isObjectGallery && objectSlug && (
        <ObjectPageTabs
          currentSlug={fileData.slug as FullSlug}
          objectSlug={objectSlug}
          counts={objectView.counts}
          active="gallery"
        />
      )}

      <div class="media-gallery-workspace">
        <aside class="media-gallery-facets" data-media-facet-panel aria-label="Galerijos filtrai">
          <div class="media-facets-heading">
            <div>
              <SlidersHorizontal size={18} aria-hidden="true" />
              <strong>Filtrai</strong>
            </div>
            <button type="button" data-media-filter-close aria-label="Uždaryti filtrus">
              <X size={20} />
            </button>
          </div>
          <div class="media-facets-scroll" data-media-facets>
            {FACETS.filter(({ key }) => !(isObjectGallery && key === "objects")).map(
              ({ key, title, open }) => (
                <details class="media-facet-group" data-facet-group={key} open={open}>
                  <summary>
                    <span>{title}</span>
                    <span data-facet-selected-count />
                  </summary>
                  {(key === "objects" || key === "tags") && (
                    <label class="media-facet-search">
                      <Search size={14} aria-hidden="true" />
                      <input
                        type="search"
                        placeholder={`Ieškoti: ${title.toLocaleLowerCase("lt")}`}
                        data-facet-search={key}
                      />
                    </label>
                  )}
                  <FacetOptions facetKey={key} options={bootstrap.facetSummary[key] ?? []} />
                  {(bootstrap.facetSummary[key]?.length ?? 0) > facetVisibleLimit(key) && (
                    <button type="button" class="media-facet-expand" data-facet-expand={key}>
                      Rodyti visus
                    </button>
                  )}
                </details>
              ),
            )}
          </div>
          <div class="media-facets-actions">
            <button type="button" class="media-gallery-reset" data-media-reset>
              <RotateCcw size={16} /> Išvalyti filtrus
            </button>
            <button type="button" class="media-facets-apply" data-media-filter-close>
              Rodyti <span data-media-mobile-count>{bootstrap.totalCount}</span> vaizdų
            </button>
          </div>
        </aside>

        <button
          type="button"
          class="media-gallery-backdrop"
          data-media-filter-close
          aria-label="Uždaryti filtrus"
        />

        <section class="media-gallery-results" aria-label="Galerijos rezultatai">
          <div class="media-gallery-toolbar">
            <label class="media-gallery-search">
              <Search size={20} aria-hidden="true" />
              <span class="sr-only">Ieškoti galerijoje</span>
              <input
                type="search"
                placeholder="Ieškoti vaizdų, kūrėjų, objektų ar institucijų"
                data-media-search
              />
              <button type="button" data-media-search-clear aria-label="Išvalyti paiešką" hidden>
                <X size={17} />
              </button>
            </label>
            <button type="button" class="media-filter-mobile" data-media-filter-open>
              <SlidersHorizontal size={18} /> Filtrai <span data-media-filter-badge hidden />
            </button>
            <label class="media-gallery-sort">
              <ArrowUpDown size={17} aria-hidden="true" />
              <span class="sr-only">Rūšiavimas</span>
              <select data-media-sort>
                <option value="recommended">Rekomenduojami</option>
                <option value="date-asc">Seniausi kūriniai</option>
                <option value="date-desc">Naujausi kūriniai</option>
                <option value="collected-desc">Naujausiai surinkti</option>
              </select>
            </label>
          </div>

          <div class="media-gallery-status" data-media-status hidden>
            <span data-media-status-text />
            <button type="button" data-media-retry>
              Bandyti dar kartą
            </button>
          </div>
          <div class="media-gallery-active-filters" data-media-active-filters />
          <div class="media-gallery-grid" data-media-grid aria-live="polite">
            {bootstrap.initialEntries.map((entry, index) => (
              <MediaCard entry={entry} index={index} />
            ))}
          </div>
          <div class="media-gallery-empty" data-media-empty hidden>
            <Images size={28} aria-hidden="true" />
            <strong>Nerasta tinkamų vaizdų</strong>
            <p>Pakeiskite paiešką arba pašalinkite vieną iš aktyvių filtrų.</p>
            <button type="button" data-media-reset>
              Išvalyti filtrus
            </button>
          </div>
          <div class="media-gallery-sentinel" data-media-sentinel aria-hidden="true" />
        </section>
      </div>
      <script
        type="application/json"
        data-media-bootstrap
        dangerouslySetInnerHTML={{ __html: safeBootstrap }}
      />
    </main>
  )
}

ObjectMediaGallery.css = [photoswipeStyle, style, objectDetailStyle]
ObjectMediaGallery.afterDOMLoaded = `${script}\n${tabsScript}`

export default (() => ObjectMediaGallery) satisfies QuartzComponentConstructor
