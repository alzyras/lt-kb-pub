import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { displayCaption, isObjectPage, objectGallerySlug, objectMediaSet } from "../util/objectMedia"

function displayTitle(value: unknown): string {
  return String(value ?? "").trim()
}

const ObjectMapCTA: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug
  if (!slug || !isObjectPage(slug) || slug.endsWith("/galerija")) {
    return null
  }

  const currentSlug = slug as FullSlug
  const title = displayTitle(fileData.frontmatter?.title)
  const { direct, contextual, all, fallbackPrimary, totalCount } = objectMediaSet(fileData.frontmatter)

  if (!fallbackPrimary || all.length === 0) {
    return null
  }

  const galleryHref = resolveRelative(currentSlug, objectGallerySlug(currentSlug))
  const imageSrc = fallbackPrimary.thumbUrl || fallbackPrimary.canonicalUrl || ""

  return (
    <div
      class="object-map-cta object-gallery-cta"
      data-object-slug={currentSlug}
      data-object-title={title}
      data-object-gallery-href={galleryHref}
    >
      <div class="object-map-cta-copy">
        <span>Galerija</span>
        <a href={galleryHref}>
          <strong>Eiti į galeriją{title ? ` (${title})` : ""}</strong>
          <em aria-hidden="true">&gt;</em>
        </a>
        <p>{totalCount} vaizd. / {direct.length} tiesiog. / {contextual.length} susij.</p>
      </div>
      <a class="object-map-preview-link object-gallery-preview-link" href={galleryHref} aria-label={`Atidaryti ${title} galeriją`}>
        <img class="object-gallery-preview-image" src={imageSrc} alt={displayCaption(fallbackPrimary)} loading="eager" decoding="async" />
        <span class="object-gallery-preview-label">Galerija</span>
      </a>
    </div>
  )
}

export default (() => ObjectMapCTA) satisfies QuartzComponentConstructor
