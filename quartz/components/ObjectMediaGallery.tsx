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
import style from "./styles/objectMediaGallery.scss"
import photoswipeStyle from "./styles/photoswipe.scss"
import { cleanText, displayCaption, isMediaGalleryPage } from "../util/objectMedia"
import {
  computeFacetSummary,
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
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as MediaGalleryBootstrap).initialEntries)) {
      return parsed as MediaGalleryBootstrap
    }
  } catch {}
  return {
    initialEntries: [], totalCount: 0, facetSummary: computeFacetSummary([]),
    catalogUrl: "/static/mediaCatalog.json", catalogVersion: "unknown",
  }
}

const dateLabel = (value: unknown) => cleanText(value).replace(/\s+date\s+QS:.*$/i, "").trim()

function MediaCard({ entry, index }: { entry: MediaGalleryBootstrap["initialEntries"][number]; index: number }) {
  const tags = (entry.tags ?? []).slice(0, 2)
  return (
    <article class="media-gallery-card" data-media-id={entry.mediaId}>
      <button type="button" data-media-open={index} aria-label={`Atidaryti: ${displayCaption(entry)}`}>
        <span class="media-gallery-card-media">
          <img
            src={entry.thumbUrl || entry.sourceUrl}
            alt={displayCaption(entry)}
            width={entry.width || undefined}
            height={entry.height || undefined}
            loading={index < 8 ? "eager" : "lazy"}
            decoding="async"
          />
          <span class="media-gallery-card-overlay">
            <span class="media-gallery-card-title">{displayCaption(entry)}</span>
            {dateLabel(entry.dateDisplay) && <span>{dateLabel(entry.dateDisplay)}</span>}
          </span>
          <span class="media-gallery-card-hover" aria-hidden="true">
            <span>{cleanText(entry.creator)}</span>
            <span>{(entry.relatedObjects ?? []).slice(0, 2).map((object) => object.title).join(" · ")}</span>
          </span>
        </span>
        <span class="sr-only">{tags.map((tag) => tag.label).join(", ")}</span>
      </button>
    </article>
  )
}

function FacetOptions({ facetKey, options }: { facetKey: MediaFacetKey; options: MediaFacetOption[] }) {
  const visibleLimit = facetVisibleLimit(facetKey)
  return (
    <div class="media-facet-options" data-facet-options={facetKey}>
      {options.map((option, index) => (
        <label class="media-facet-option" data-facet-option data-facet-extra={index >= visibleLimit ? "true" : undefined}>
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
  if (!isMediaGalleryPage(fileData.slug)) return null

  const bootstrap = parseBootstrap(fileData.frontmatter?.media_gallery_bootstrap_json)
  const objectTitle = cleanText(fileData.frontmatter?.object_title) || cleanText(fileData.frontmatter?.title)
  const objectPath = cleanText(fileData.frontmatter?.object_note_path)
  const isObjectGallery = Boolean(objectPath)
  const objectUrl = objectPath ? `/${objectPath.replace(/\.md$/i, "").split("/").map(encodeURIComponent).join("/")}` : ""
  const safeBootstrap = JSON.stringify(bootstrap).replace(/</g, "\\u003c")

  return (
    <main
      class="media-gallery-page"
      translate="no"
      data-media-gallery="true"
      data-object-path={objectPath}
      data-catalog-url={bootstrap.catalogUrl}
      data-catalog-version={bootstrap.catalogVersion}
    >
      <header class="media-gallery-header">
        <div>
          <p class="media-gallery-eyebrow"><Images size={15} aria-hidden="true" /> Vaizdų archyvas</p>
          <h1>{isObjectGallery ? objectTitle : "Galerija"}</h1>
          <p class="media-gallery-lead">
            {isObjectGallery ? "Patikrinti šio objekto atvaizdai ir istorinis kontekstas." : "Patikrinti Lietuvos istorijos vaizdai iš atvirų kultūros paveldo rinkinių."}
          </p>
          {isObjectGallery && <a class="media-gallery-object-back" href={objectUrl}><ArrowLeft size={15} /> Grįžti į objektą</a>}
        </div>
        <strong class="media-gallery-count" data-media-count>{bootstrap.totalCount} vaizdų</strong>
      </header>

      <div class="media-gallery-workspace">
        <aside class="media-gallery-facets" data-media-facet-panel aria-label="Galerijos filtrai">
          <div class="media-facets-heading">
            <div><SlidersHorizontal size={18} aria-hidden="true" /><strong>Filtrai</strong></div>
            <button type="button" data-media-filter-close aria-label="Uždaryti filtrus"><X size={20} /></button>
          </div>
          <div class="media-facets-scroll" data-media-facets>
            {FACETS.filter(({ key }) => !(isObjectGallery && key === "objects")).map(({ key, title, open }) => (
              <details class="media-facet-group" data-facet-group={key} open={open}>
                <summary><span>{title}</span><span data-facet-selected-count /></summary>
                {(key === "objects" || key === "tags") && (
                  <label class="media-facet-search">
                    <Search size={14} aria-hidden="true" />
                    <input type="search" placeholder={`Ieškoti: ${title.toLocaleLowerCase("lt")}`} data-facet-search={key} />
                  </label>
                )}
                <FacetOptions facetKey={key} options={bootstrap.facetSummary[key] ?? []} />
                {(bootstrap.facetSummary[key]?.length ?? 0) > facetVisibleLimit(key) && <button type="button" class="media-facet-expand" data-facet-expand={key}>Rodyti visus</button>}
              </details>
            ))}
          </div>
          <div class="media-facets-actions">
            <button type="button" class="media-gallery-reset" data-media-reset><RotateCcw size={16} /> Išvalyti filtrus</button>
            <button type="button" class="media-facets-apply" data-media-filter-close>Rodyti <span data-media-mobile-count>{bootstrap.totalCount}</span> vaizdų</button>
          </div>
        </aside>

        <button type="button" class="media-gallery-backdrop" data-media-filter-close aria-label="Uždaryti filtrus" />

        <section class="media-gallery-results" aria-label="Galerijos rezultatai">
          <div class="media-gallery-toolbar">
            <label class="media-gallery-search">
              <Search size={20} aria-hidden="true" />
              <span class="sr-only">Ieškoti galerijoje</span>
              <input type="search" placeholder="Ieškoti vaizdų, kūrėjų, objektų ar institucijų" data-media-search />
              <button type="button" data-media-search-clear aria-label="Išvalyti paiešką" hidden><X size={17} /></button>
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
            <button type="button" data-media-retry>Bandyti dar kartą</button>
          </div>
          <div class="media-gallery-active-filters" data-media-active-filters />
          <div class="media-gallery-grid" data-media-grid aria-live="polite">
            {bootstrap.initialEntries.map((entry, index) => <MediaCard entry={entry} index={index} />)}
          </div>
          <div class="media-gallery-empty" data-media-empty hidden>
            <Images size={28} aria-hidden="true" />
            <strong>Nerasta tinkamų vaizdų</strong>
            <p>Pakeiskite paiešką arba pašalinkite vieną iš aktyvių filtrų.</p>
            <button type="button" data-media-reset>Išvalyti filtrus</button>
          </div>
          <div class="media-gallery-sentinel" data-media-sentinel aria-hidden="true" />
        </section>
      </div>
      <script type="application/json" data-media-bootstrap dangerouslySetInnerHTML={{ __html: safeBootstrap }} />
    </main>
  )
}

ObjectMediaGallery.css = [photoswipeStyle, style]
ObjectMediaGallery.afterDOMLoaded = script

export default (() => ObjectMediaGallery) satisfies QuartzComponentConstructor
