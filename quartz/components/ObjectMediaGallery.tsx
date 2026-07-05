import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/objectMediaGallery.scss"
// @ts-ignore
import script from "./scripts/object-media-gallery.inline"

function isObjectPage(slug: string | undefined): boolean {
  return Boolean(slug?.startsWith("objektai/") && slug.split("/").length >= 3)
}

type MediaEntry = {
  mediaId?: string
  title?: string
  caption?: string
  creator?: string
  provider?: string
  providerLabel?: string
  license?: string
  rightsNote?: string
  dateDisplay?: string
  canonicalUrl?: string
  thumbUrl?: string
  relationType?: string
  directness?: string
  reviewStatus?: string
  confidence?: number
  sourceMethod?: string
  judgeModel?: string
  judgeReason?: string
  isPrimary?: number
}

function parseMediaEntries(value: unknown): MediaEntry[] {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is MediaEntry => Boolean(entry && typeof entry === "object"))
  }
  const text = String(value ?? "").trim()
  if (!text) return []
  try {
    const parsed = JSON.parse(text)
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is MediaEntry => Boolean(entry && typeof entry === "object"))
      : []
  } catch {
    return []
  }
}

function parseMediaEntry(value: unknown): MediaEntry | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as MediaEntry
  }
  const text = String(value ?? "").trim()
  if (!text) return undefined
  try {
    const parsed = JSON.parse(text)
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as MediaEntry) : undefined
  } catch {
    return undefined
  }
}

function relationLabel(relationType: string | undefined): string {
  switch (String(relationType ?? "")) {
    case "portrait_of":
      return "Portretas"
    case "painting_of":
      return "Paveikslas"
    case "statue_of":
      return "Skulptūra"
    case "seal_of":
      return "Antspaudas"
    case "coin_depiction_of":
      return "Moneta"
    case "map_of":
      return "Žemėlapis"
    case "manuscript_depiction_of":
      return "Rankraštis"
    case "associated_symbol_of":
      return "Simbolis"
    case "commemoration_of":
      return "Minėjimas"
    case "event_documentation_of":
      return "Įvykio vaizdas"
    case "edition_image_of":
      return "Leidinio vaizdas"
    default:
      return "Vaizdas"
  }
}

function directnessLabel(directness: string | undefined): string {
  switch (String(directness ?? "")) {
    case "direct":
      return "Tiesioginis"
    case "contextual":
      return "Susijęs"
    default:
      return "Kitas"
  }
}

function cleanText(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim()
}

function displayCaption(entry: MediaEntry): string {
  return cleanText(entry.caption) || cleanText(entry.title) || "Atvaizdas"
}

function displayMeta(entry: MediaEntry): string {
  const parts = [cleanText(entry.creator), cleanText(entry.dateDisplay), cleanText(entry.providerLabel || entry.provider)]
    .filter(Boolean)
  return parts.join(" • ")
}

const ObjectMediaGallery: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (!isObjectPage(fileData.slug)) {
    return null
  }

  const direct = parseMediaEntries(fileData.frontmatter?.media_direct_json)
  const contextual = parseMediaEntries(fileData.frontmatter?.media_contextual_json)
  const all = parseMediaEntries(fileData.frontmatter?.media_all_json)
  const primary = parseMediaEntry(fileData.frontmatter?.media_primary_json)
  const fallbackPrimary = primary ?? direct[0] ?? contextual[0] ?? all[0]

  if (!fallbackPrimary || all.length === 0) {
    return null
  }

  const totalCount = Number(fileData.frontmatter?.media_total_count ?? all.length) || all.length
  const defaultView = direct.length > 0 ? "direct" : contextual.length > 0 ? "contextual" : "all"
  const relationOptions = [...new Set(all.map((entry) => String(entry.relationType ?? "").trim()).filter(Boolean))]
    .sort((a, b) => relationLabel(a).localeCompare(relationLabel(b), "lt"))

  return (
    <section
      class="object-media-gallery"
      data-media-gallery="true"
      data-default-view={defaultView}
      data-total-count={String(totalCount)}
    >
      <div class="object-media-gallery-header">
        <div>
          <p class="object-media-eyebrow">Atvaizdai</p>
          <h2>Vizualinė medžiaga</h2>
          <p class="object-media-lead">
            Pagal nutylėjimą rodomi tiesioginiai atvaizdai. Susijusius vaizdus gali įjungti atskirai.
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
    </section>
  )
}

ObjectMediaGallery.css = style
ObjectMediaGallery.afterDOMLoaded = script

export default (() => ObjectMediaGallery) satisfies QuartzComponentConstructor
