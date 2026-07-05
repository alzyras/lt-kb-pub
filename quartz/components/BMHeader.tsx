import { FullSlug, resolveRelative, slugTag } from "../util/path"
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

const topicLinks = [
  ["Visos temos", "temos"],
  ["Aktas", "temos/aktas"],
  ["Aktas - dokumentas", "temos/aktas - dokumentas"],
  ["Bajoras", "temos/bajoras"],
  ["Bibliografija", "temos/bibliografija"],
  ["Buities daiktas", "temos/buities-daiktas"],
  ["Didikas", "temos/didikas"],
  ["Dinastija", "temos/dinastija"],
  ["Dokumentas", "temos/dokumentas"],
  ["Drabužis", "temos/drabužis"],
  ["Dvasininkas", "temos/dvasininkas"],
  ["Ežeras", "temos/ežeras"],
  ["Formulė", "temos/formulė"],
  ["Frazė", "temos/frazė"],
  ["Ginklas", "temos/ginklas"],
  ["Istorinė sąvoka", "temos/istorinė-sąvoka"],
  ["Įrankis", "temos/įrankis"],
  ["Karalienė", "temos/karalienė"],
  ["Karinis terminas", "temos/karinis-terminas"],
  ["Karo reikmuo", "temos/karo-reikmuo"],
  ["Karūnacija", "temos/karūnacija"],
  ["Karvedys", "temos/karvedys"],
  ["Karyba", "temos/karyba"],
  ["Kasdienybė", "temos/kasdienybė"],
  ["Konfliktas", "temos/konfliktas"],
  ["Krikštas", "temos/krikštas"],
  ["Laidotuvės", "temos/laidotuvės"],
  ["Metraštis", "temos/metraštis"],
  ["Mūšis", "temos/mūšis"],
  ["Paliaubos", "temos/paliaubos"],
  ["Papuošalas", "temos/papuošalas"],
  ["Politinis sprendimas", "temos/politinis-sprendimas"],
  ["Popiežius", "temos/popiežius"],
  ["Popiežius - valdovas", "temos/popiežius - valdovas"],
  ["Privilegija", "temos/privilegija"],
  ["Redaktorius", "temos/redaktorius"],
  ["Religinė praktika", "temos/religinė-praktika"],
  ["Religinis terminas", "temos/religinis-terminas"],
  ["Ritualas", "temos/ritualas"],
  ["Schema", "temos/schema"],
  ["Simbolis", "temos/simbolis"],
  ["Socialinė praktika", "temos/socialinė-praktika"],
  ["Šeima", "temos/šeima"],
  ["Teisinis terminas", "temos/teisinis-terminas"],
  ["Tikėjimas", "temos/tikėjimas"],
  ["Transportas", "temos/transportas"],
  ["Ūkio įrankis", "temos/ūkio-įrankis"],
  ["Upė", "temos/upė"],
  ["Valdovas", "temos/valdovas"],
  ["Vilnius", "temos/vilnius"],
  ["Žemėlapis", "temos/žemėlapis"],
] as const

const periodLinks = [
  ["Visi laikotarpiai", "laikotarpiai"],
  ["XX amžius pr. Kr", "laikotarpiai/XX amžius pr. Kr"],
  ["X amžius", "laikotarpiai/X amžius"],
  ["XI amžius", "laikotarpiai/XI amžius"],
  ["XIII amžius", "laikotarpiai/XIII amžius"],
  ["XIV amžius", "laikotarpiai/XIV amžius"],
  ["XV amžius", "laikotarpiai/XV amžius"],
  ["XVI amžius", "laikotarpiai/XVI amžius"],
  ["XVII amžius", "laikotarpiai/XVII amžius"],
  ["XVIII amžius", "laikotarpiai/XVIII amžius"],
  ["XIX amžius", "laikotarpiai/XIX amžius"],
  ["XX amžius", "laikotarpiai/XX amžius"],
  ["XXI amžius", "laikotarpiai/XXI amžius"],
] as const

function navSlug(slug: string): FullSlug {
  return slugTag(slug) as FullSlug
}

function HeaderDropdown({
  label,
  slug,
  ariaLabel,
  links,
  variant,
  currentSlug,
}: {
  label: string
  slug: string
  ariaLabel: string
  links: readonly (readonly [string, string])[]
  variant?: string
  currentSlug: FullSlug
}) {
  return (
    <div class="bm-header-menu" data-bm-menu>
      <a
        class="bm-header-menu-trigger"
        href={resolveRelative(currentSlug, navSlug(slug))}
        aria-haspopup="true"
        aria-expanded="false"
        data-bm-menu-trigger
      >
        {label}
      </a>
      <div
        class={`bm-header-dropdown${variant ? ` bm-header-dropdown--${variant}` : ""}`}
        aria-label={ariaLabel}
        data-bm-menu-panel
      >
        {links.map(([linkLabel, linkSlug]) => (
          <a href={resolveRelative(currentSlug, navSlug(linkSlug))}>{linkLabel}</a>
        ))}
      </div>
    </div>
  )
}

const BMHeader: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const currentSlug = fileData.slug ?? ("index" as FullSlug)

  return (
    <div class="bm-header-shell">
      <div class="bm-header-hours" aria-label="Žinių bazės būsena">
        <p>Atvira žinių bazė: Lietuvos istorijos šaltiniai, objektai ir teiginiai</p>
        <div class="bm-header-tools" aria-label="Svetainės įrankiai">
          <button type="button" data-bm-search>
            Paieška
          </button>
          <button type="button" data-bm-reader>
            Skaitymas
          </button>
          <button type="button" data-bm-theme>
            Tema
          </button>
          <button type="button" data-bm-adv>
            ADV
          </button>
        </div>
      </div>
      <div class="bm-header-main">
        <a class="bm-header-brand" href={resolveRelative(currentSlug, "index" as FullSlug)}>
          <span>Lietuvos istorijos</span>
          <strong>žinių bazė</strong>
        </a>
        <nav class="bm-header-nav" aria-label="Pagrindinė navigacija">
          <HeaderDropdown
            label="Objektai"
            slug="objektai"
            ariaLabel="Objektų tipai"
            links={objectLinks}
            currentSlug={currentSlug}
          />
          <HeaderDropdown
            label="Temos"
            slug="temos"
            ariaLabel="Temos"
            links={topicLinks}
            variant="topics"
            currentSlug={currentSlug}
          />
          <HeaderDropdown
            label="Laikotarpiai"
            slug="laikotarpiai"
            ariaLabel="Laikotarpiai"
            links={periodLinks}
            variant="periods"
            currentSlug={currentSlug}
          />
          <a href={resolveRelative(currentSlug, navSlug("zemelapis"))}>Žemėlapis</a>
        </nav>
      </div>
    </div>
  )
}

BMHeader.css = styles
BMHeader.afterDOMLoaded = script

export default (() => BMHeader) satisfies QuartzComponentConstructor
