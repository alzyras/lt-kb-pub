import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { isObjectPage, objectGallerySlug, objectMediaSet } from "../util/objectMedia"
// @ts-ignore
import script from "./scripts/object-map-preview.inline"

function displayTitle(value: unknown): string {
  return String(value ?? "").trim()
}

const ObjectMapCTA: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug
  if (!slug || !isObjectPage(slug)) {
    return null
  }

  const currentSlug = slug as FullSlug
  const isGalleryPage = slug.endsWith("/galerija")
  const objectSlug = (isGalleryPage ? slug.replace(/\/galerija$/, "") : slug) as FullSlug
  const title = displayTitle(fileData.frontmatter?.object_title) || displayTitle(fileData.frontmatter?.title)
  const { direct, contextual, all, fallbackPrimary, totalCount } = objectMediaSet(fileData.frontmatter)
  const hasGallery = Boolean(fallbackPrimary && all.length > 0)
  const objectHref = resolveRelative(currentSlug, objectSlug)
  const galleryHref = resolveRelative(currentSlug, objectGallerySlug(objectSlug))
  const mapHref = `${resolveRelative(currentSlug, "zemelapis/index" as FullSlug)}?focus=${encodeURIComponent(
    objectSlug,
  )}&depth=1&panel=details&maxNodes=1000&types=${encodeURIComponent(objectMapTypes)}`

  return (
    <div
      class="object-map-cta"
      data-object-map-cta="true"
      data-object-slug={objectSlug}
      data-object-title={title}
      data-object-map-href={mapHref}
    >
      <div class="object-map-cta-copy">
        <span>Žemėlapis</span>
        <div class="object-map-cta-actions">
          {isGalleryPage && (
            <a href={objectHref} class="object-map-object-action">
              <strong>Grįžti į objektą{title ? ` (${title})` : ""}</strong>
              <em aria-hidden="true">&gt;</em>
            </a>
          )}
          <a href={mapHref} class={isGalleryPage ? "" : "is-active"}>
            <strong>Eiti į žemėlapį</strong>
            <em aria-hidden="true">&gt;</em>
          </a>
          {hasGallery && (
            <a href={galleryHref} class={`object-map-gallery-action${isGalleryPage ? " is-active" : ""}`}>
              <strong>Eiti į galeriją{title ? ` (${title})` : ""}</strong>
              <em aria-hidden="true">&gt;</em>
            </a>
          )}
        </div>
        <p class="object-map-cta-count" data-object-map-count="">Kraunami ryšiai...</p>
        {hasGallery && <p class="object-map-cta-media">{totalCount} vaizd. / {direct.length} tiesiog. / {contextual.length} susij.</p>}
      </div>
      <a class="object-map-preview-link" href={mapHref} aria-label={`Atidaryti ${title} ryšių žemėlapį`}>
        <canvas class="object-map-preview-canvas" data-object-map-canvas=""></canvas>
        <span class="object-map-preview-status" data-object-map-status=""></span>
      </a>
    </div>
  )
}

const objectMapTypes = [
  "asmuo",
  "autorius",
  "ivykis",
  "grupe",
  "vieta",
  "daiktas",
  "paprotys",
  "posakis",
  "zodyno_irasas",
].join(",")

ObjectMapCTA.afterDOMLoaded = script

export default (() => ObjectMapCTA) satisfies QuartzComponentConstructor
