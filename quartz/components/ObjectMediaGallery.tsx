import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/objectMediaGallery.scss"
import {
  cleanText,
  directnessLabel,
  displayCaption,
  displayMeta,
  isObjectGalleryPage,
  objectMediaSet,
  relationLabel,
} from "../util/objectMedia"
import { FullSlug, resolveRelative } from "../util/path"
// @ts-ignore
import script from "./scripts/object-media-gallery.inline"

const ObjectMediaGallery: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (!isObjectGalleryPage(fileData.slug)) {
    return null
  }

  const { direct, contextual, all, fallbackPrimary, totalCount } = objectMediaSet(fileData.frontmatter)

  if (!fallbackPrimary || all.length === 0) {
    return null
  }

  const defaultView = direct.length > 0 ? "direct" : contextual.length > 0 ? "contextual" : "all"
  const relationOptions = [...new Set(all.map((entry) => String(entry.relationType ?? "").trim()).filter(Boolean))]
    .sort((a, b) => relationLabel(a).localeCompare(relationLabel(b), "lt"))
  const objectTitle = cleanText(fileData.frontmatter?.object_title) || cleanText(fileData.frontmatter?.title)
  const objectSlug = cleanText(fileData.frontmatter?.object_slug) as FullSlug
  const backHref = objectSlug ? resolveRelative(fileData.slug as FullSlug, objectSlug) : "../"

  return (
    <main
      class="object-media-gallery object-media-gallery-page"
      data-media-gallery="true"
      data-default-view={defaultView}
      data-total-count={String(totalCount)}
    >
      <p class="object-media-backlink">
        <a href={backHref}>Grįžti į objektą{objectTitle ? ` (${objectTitle})` : ""}</a>
      </p>
      <div class="object-media-gallery-header">
        <div>
          <p class="object-media-eyebrow">Atvaizdai</p>
          <h1>Galerija{objectTitle ? ` (${objectTitle})` : ""}</h1>
          <p class="object-media-lead">
            Visi su objektu susieti atvaizdai. Pagal nutylėjimą rodomi tiesioginiai atvaizdai, o susijusius
            gali įjungti atskirai.
          </p>
        </div>
        <div class="object-media-summary">
          <span>{totalCount} vaizd.</span>
          <span>{direct.length} tiesiog.</span>
          <span>{contextual.length} susij.</span>
        </div>
      </div>

      <div class="object-media-primary">
        <a
          class="object-media-primary-figure"
          href={fallbackPrimary.canonicalUrl || fallbackPrimary.thumbUrl || "#"}
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            src={fallbackPrimary.thumbUrl || fallbackPrimary.canonicalUrl || ""}
            alt={displayCaption(fallbackPrimary)}
            loading="eager"
            decoding="async"
          />
        </a>
        <div class="object-media-primary-copy">
          <p class="object-media-primary-label">
            {fallbackPrimary.directness === "direct" ? "Pagrindinis atvaizdas" : "Pagrindinis susijęs vaizdas"}
          </p>
          <h3>{displayCaption(fallbackPrimary)}</h3>
          <div class="object-media-chip-row">
            <span class="object-media-chip object-media-chip-directness">{directnessLabel(fallbackPrimary.directness)}</span>
            <span class="object-media-chip object-media-chip-relation">{relationLabel(fallbackPrimary.relationType)}</span>
            {Number(fallbackPrimary.isPrimary ?? 0) === 1 && (
              <span class="object-media-chip object-media-chip-primary">Pirminis</span>
            )}
          </div>
          {displayMeta(fallbackPrimary) && <p class="object-media-meta-line">{displayMeta(fallbackPrimary)}</p>}
          {cleanText(fallbackPrimary.license) && (
            <p class="object-media-license">Licencija: {cleanText(fallbackPrimary.license)}</p>
          )}
          {fallbackPrimary.directness !== "direct" && direct.length === 0 && (
            <p class="object-media-note">
              Tiesioginio portretinio ar analogiško atvaizdo dar neturime, todėl rodomas geriausias susijęs vaizdas.
            </p>
          )}
          <p class="object-media-linkline">
            <a href={fallbackPrimary.canonicalUrl || fallbackPrimary.thumbUrl || "#"} target="_blank" rel="noreferrer noopener">
              Atidaryti šaltinį
            </a>
          </p>
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
