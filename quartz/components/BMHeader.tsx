import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/bm-header.inline"
import styles from "./styles/bmHeader.scss"

const objectLinks = [
  ["Objektai", "objektai"],
  ["Asmenys", "objektai/asmenys"],
  ["Autoriai", "objektai/autoriai"],
  ["Įvykiai", "objektai/ivykiai"],
  ["Vietos", "objektai/vietos"],
  ["Grupės", "objektai/grupes"],
  ["Daiktai", "objektai/daiktai"],
  ["Papročiai", "objektai/paprociai"],
  ["Posakiai", "objektai/posakiai"],
  ["Žodynas", "objektai/zodynas"],
  ["Šaltiniai", "objektai/saltiniai"],
] as const

const BMHeader: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const currentSlug = fileData.slug ?? ("index" as FullSlug)

  return (
    <div class="bm-header-shell">
      <div class="bm-header-hours" aria-label="Kolekcijos būsena">
        <p>Atvira kolekcija: Lietuvos istorijos šaltiniai, objektai ir teiginiai</p>
        <div class="bm-header-tools" aria-label="Svetainės įrankiai">
          <button type="button" data-bm-search>
            Search
          </button>
          <button type="button" data-bm-reader>
            Reader
          </button>
          <button type="button" data-bm-theme>
            Theme
          </button>
          <button type="button" data-bm-adv>
            Evidence
          </button>
        </div>
      </div>
      <div class="bm-header-main">
        <a class="bm-header-brand" href={resolveRelative(currentSlug, "index" as FullSlug)}>
          <span>Lietuvos istorijos</span>
          <strong>žinių bazė</strong>
        </a>
        <nav class="bm-header-nav" aria-label="Pagrindinė navigacija">
          <a href={resolveRelative(currentSlug, "index" as FullSlug)}>Kolekcija</a>
          <div class="bm-header-menu" data-bm-menu>
            <a
              class="bm-header-menu-trigger"
              href={resolveRelative(currentSlug, "objektai" as FullSlug)}
              aria-haspopup="true"
              aria-expanded="false"
              data-bm-menu-trigger
            >
              Objektai
            </a>
            <div class="bm-header-dropdown" aria-label="Objektų tipai" data-bm-menu-panel>
              {objectLinks.map(([label, slug]) => (
                <a href={resolveRelative(currentSlug, slug as FullSlug)}>{label}</a>
              ))}
            </div>
          </div>
          <a href={resolveRelative(currentSlug, "temos" as FullSlug)}>Temos</a>
          <a href={resolveRelative(currentSlug, "laikotarpiai" as FullSlug)}>Laikotarpiai</a>
          <a href={resolveRelative(currentSlug, "zemelapis" as FullSlug)}>Žemėlapis</a>
        </nav>
      </div>
    </div>
  )
}

BMHeader.css = styles
BMHeader.afterDOMLoaded = script

export default (() => BMHeader) satisfies QuartzComponentConstructor
