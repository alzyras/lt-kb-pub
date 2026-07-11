import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/objectMediaGallery.scss"
import photoswipeStyle from "./styles/photoswipe.scss"
import {
  cleanText,
  isMediaGalleryPage,
} from "../util/objectMedia"
// @ts-ignore
import script from "./scripts/object-media-gallery.inline"

const ObjectMediaGallery: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (!isMediaGalleryPage(fileData.slug)) {
    return null
  }
  const objectTitle = cleanText(fileData.frontmatter?.object_title) || cleanText(fileData.frontmatter?.title)
  const objectPath = cleanText(fileData.frontmatter?.object_note_path)
  const isObjectGallery = Boolean(objectPath)

  return (
    <main
      class="media-gallery-page"
      data-media-gallery="true"
      data-object-path={objectPath}
    >
      <header class="media-gallery-header">
        <div>
          <p class="media-gallery-eyebrow">Vaizdų archyvas</p>
          <h1>{isObjectGallery ? objectTitle : "Galerija"}</h1>
          <p class="media-gallery-lead">
            {isObjectGallery
              ? "Patikrinti tiesioginiai ir kontekstiniai šio objekto vaizdai."
              : "Patikrinti Lietuvos istorijos vaizdai iš atvirų kultūros paveldo rinkinių."}
          </p>
        </div>
        <strong class="media-gallery-count" data-media-count>0 vaizdų</strong>
      </header>

      <section class="media-gallery-controls" aria-label="Galerijos filtrai">
        <label class="media-gallery-search">
          <span class="sr-only">Ieškoti galerijoje</span>
          <input type="search" placeholder="Ieškoti vaizdų, kūrėjų, objektų ar institucijų" data-media-search />
        </label>
        <select data-media-directness aria-label="Ryšys su objektu"><option value="">Visi ryšiai</option><option value="direct">Tiesioginiai</option><option value="contextual">Kontekstiniai</option></select>
        <select data-media-type aria-label="Vaizdo tipas"><option value="">Visi tipai</option></select>
        <select data-media-provider aria-label="Tiekėjas"><option value="">Visi tiekėjai</option></select>
        <select data-media-sort aria-label="Rūšiavimas"><option value="recommended">Rekomenduojami</option><option value="date-asc">Seniausi kūriniai</option><option value="date-desc">Naujausi kūriniai</option><option value="collected-desc">Naujausiai surinkti</option></select>
        <details class="media-gallery-more">
          <summary>Daugiau filtrų</summary>
          <div>
            <label>Tagas<select data-media-tag><option value="">Visi tagai</option></select></label>
            <label>Objektas<select data-media-object><option value="">Visi objektai</option></select></label>
            <label>Objekto tipas<select data-media-object-type><option value="">Visi objektų tipai</option></select></label>
            <label>Laikotarpis<select data-media-period><option value="">Visi laikotarpiai</option></select></label>
            <label>Institucija<select data-media-institution><option value="">Visos institucijos</option></select></label>
            <label>Licencija<select data-media-license><option value="">Visos licencijos</option></select></label>
          </div>
        </details>
        <button type="button" class="media-gallery-reset" data-media-reset>Atstatyti</button>
      </section>

      <div class="media-gallery-active-filters" data-media-active-filters></div>
      <div class="media-gallery-grid" data-media-grid aria-live="polite"></div>
      <div class="media-gallery-empty" data-media-empty hidden>Nėra vaizdų, atitinkančių pasirinktus filtrus.</div>
      <button type="button" class="media-gallery-more-results" data-media-load-more hidden>Rodyti daugiau</button>
    </main>
  )
}

ObjectMediaGallery.css = [photoswipeStyle, style]
ObjectMediaGallery.afterDOMLoaded = script

export default (() => ObjectMediaGallery) satisfies QuartzComponentConstructor
