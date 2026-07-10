import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/objectMediaGallery.scss"
import { FullSlug, resolveRelative } from "../util/path"
import {
  cleanText,
  directnessLabel,
  displayCaption,
  displayMeta,
  isObjectGalleryPage,
  objectMediaSet,
  relationLabel,
} from "../util/objectMedia"
// @ts-ignore
import script from "./scripts/object-media-gallery.inline"

const ObjectMediaGallery: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (!isObjectGalleryPage(fileData.slug)) {
    return null
  }

  const { direct, contextual, all, totalCount } = objectMediaSet(fileData.frontmatter)

  if (all.length === 0) {
    return null
  }

  const defaultView = direct.length > 0 ? "direct" : contextual.length > 0 ? "contextual" : "all"
  const relationOptions = [...new Set(all.map((entry) => String(entry.relationType ?? "").trim()).filter(Boolean))]
    .sort((a, b) => relationLabel(a).localeCompare(relationLabel(b), "lt"))
  const objectTitle = cleanText(fileData.frontmatter?.object_title) || cleanText(fileData.frontmatter?.title)
  const objectSlug = String(fileData.slug ?? "").replace(/\/galerija$/, "") as FullSlug
  const objectHref = resolveRelative(fileData.slug as FullSlug, objectSlug)

  return (
    <main
      class="object-media-gallery object-media-gallery-page"
      data-media-gallery="true"
      data-default-view={defaultView}
      data-total-count={String(totalCount)}
    >
      <div class="object-media-gallery-header">
        <div>
          <p class="object-media-eyebrow">Atvaizdai</p>
          <h1>Galerija{objectTitle ? ` (${objectTitle})` : ""}</h1>
          <p class="object-media-lead">
            Visi su objektu susieti atvaizdai. Pagal nutylėjimą rodomi tiesioginiai atvaizdai, o susijusius
            gali įjungti atskirai.
          </p>
          <a class="object-media-backlink" href={objectHref}>
            Grįžti į pagrindinį puslapį{objectTitle ? ` (${objectTitle})` : ""}
          </a>
        </div>
        <div class="object-media-summary">
          <span>{totalCount} vaizd.</span>
          <span>{direct.length} tiesiog.</span>
          <span>{contextual.length} susij.</span>
        </div>
      </div>

      <div class="object-media-controls">
        <div class="object-media-view-switch" role="tablist" aria-label="Atvaizdų rodymas">
          <button type="button" data-media-view-button data-media-view="direct">
            Tiesioginiai
          </button>
          <button type="button" data-media-view-button data-media-view="contextual">
            Susiję
          </button>
          <button type="button" data-media-view-button data-media-view="all">
            Visi
          </button>
        </div>
        <label class="object-media-filter">
          <span>Tipas</span>
          <select data-media-relation-filter>
            <option value="all">Visi tipai</option>
            {relationOptions.map((relationType) => (
              <option value={relationType}>{relationLabel(relationType)}</option>
            ))}
          </select>
        </label>
        <p class="object-media-status" data-media-status=""></p>
      </div>

      <div class="object-media-grid" data-media-grid>
        {all.map((entry) => {
          const href = entry.canonicalUrl || entry.thumbUrl || "#"
          const imageSrc = entry.thumbUrl || entry.canonicalUrl || ""
          return (
            <article
              class="object-media-card"
              data-media-card="true"
              data-media-source-id={`media-${String(entry.provider ?? "other").trim().toLowerCase() || "other"}`}
              data-media-directness={String(entry.directness ?? "weak")}
              data-media-relation={String(entry.relationType ?? "")}
            >
              <a href={href} target="_blank" rel="noreferrer noopener">
                <img src={imageSrc} alt={displayCaption(entry)} loading="lazy" decoding="async" />
                <div class="object-media-card-body">
                  <div class="object-media-chip-row">
                    <span class="object-media-chip object-media-chip-directness">{directnessLabel(entry.directness)}</span>
                    <span class="object-media-chip object-media-chip-relation">{relationLabel(entry.relationType)}</span>
                  </div>
                  <h4>{displayCaption(entry)}</h4>
                  {displayMeta(entry) && <p class="object-media-meta-line">{displayMeta(entry)}</p>}
                </div>
              </a>
            </article>
          )
        })}
      </div>
    </main>
  )
}

ObjectMediaGallery.css = style
ObjectMediaGallery.afterDOMLoaded = script

export default (() => ObjectMediaGallery) satisfies QuartzComponentConstructor
