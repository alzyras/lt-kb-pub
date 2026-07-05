import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/object-map-preview.inline"

function isObjectPage(slug: string | undefined): boolean {
  if (!slug?.startsWith("objektai/")) return false

  const parts = slug.split("/")
  return parts.length >= 3
}

function displayTitle(value: unknown): string {
  return String(value ?? "").trim()
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

const ObjectMapCTA: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug
  if (!isObjectPage(slug)) {
    return null
  }

  const currentSlug = slug as FullSlug
  const title = displayTitle(fileData.frontmatter?.title)
  const mapHref = `${resolveRelative(currentSlug, "zemelapis/index" as FullSlug)}?focus=${encodeURIComponent(
    currentSlug,
  )}&depth=1&panel=details&maxNodes=1000&types=${encodeURIComponent(objectMapTypes)}`

  return (
    <div
      class="object-map-cta"
      data-object-map-cta="true"
      data-object-slug={currentSlug}
      data-object-title={title}
      data-object-map-href={mapHref}
    >
      <div class="object-map-cta-copy">
        <span>Žemėlapis</span>
        <a href={mapHref}>
          <strong>Atidaryti ryšius</strong>
          <em aria-hidden="true">&gt;</em>
        </a>
        <p data-object-map-count="">Kraunami ryšiai...</p>
      </div>
      <a class="object-map-preview-link" href={mapHref} aria-label={`Atidaryti ${title} ryšių žemėlapį`}>
        <canvas class="object-map-preview-canvas" data-object-map-canvas=""></canvas>
        <span class="object-map-preview-status" data-object-map-status=""></span>
      </a>
    </div>
  )
}

ObjectMapCTA.afterDOMLoaded = script

export default (() => ObjectMapCTA) satisfies QuartzComponentConstructor
