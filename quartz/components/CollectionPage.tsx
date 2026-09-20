import { QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { collectionCategories, collectionMembers, collectionPeriods } from "../util/collections"
import { PageList } from "./PageList"
import style from "./styles/collectionPage.scss"

export const collectionStyle = style

export function CollectionNav({ fileData }: QuartzComponentProps) {
  const current = String(fileData.slug).replace(/\/index$/, "")
  return (
    <nav class="collection-nav" aria-label="Žinyno skyriai">
      {[
        ["objektai", "Visi objektai"],
        ...collectionCategories.map(([route, label]) => [`objektai/${route}`, label]),
        ["laikotarpiai", "Laikotarpiai"],
        ["temos", "Temos"],
      ].map(([route, label]) => (
        <a
          class="internal"
          href={resolveRelative(fileData.slug!, route as FullSlug)}
          aria-current={current === route ? "page" : undefined}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}

export function CollectionIntro({
  title,
  label,
  description,
  count,
  range,
}: {
  title: string
  label: string
  description: string
  count: number
  range?: string
}) {
  return (
    <header class="collection-intro">
      <p class="collection-eyebrow">
        {label}
        {range && <span> / {range}</span>}
      </p>
      <h1>{title}</h1>
      <p class="collection-description">{description}</p>
      <span class="collection-count">{count.toLocaleString("lt-LT")} įrašų kolekcijoje</span>
    </header>
  )
}

export function PeriodDirectory(props: QuartzComponentProps) {
  const periods = collectionPeriods(props.allFiles)
  return (
    <div class="popover-hint bm-list-page collection-page">
      <CollectionIntro
        title="Laikotarpiai"
        label="Istorijos laiko juosta"
        description="Atraskite žmones, vietas ir įvykius skirtinguose Lietuvos istorijos laikotarpiuose."
        count={periods.length}
      />
      <CollectionNav {...props} />
      <div class="collection-period-grid">
        {periods.map((page) => (
          <a
            class="internal collection-period-card"
            href={resolveRelative(props.fileData.slug!, page.slug!)}
          >
            <span class="collection-period-years">
              {String(page.frontmatter?.periodo_pradzia)} —{" "}
              {String(page.frontmatter?.periodo_pabaiga)}
            </span>
            <h2>{String(page.frontmatter?.pavadinimas ?? page.frontmatter?.title)}</h2>
            <span>
              {Number(page.frontmatter?.periodo_objektu_skaicius ?? 0).toLocaleString("lt-LT")}{" "}
              objektų <span aria-hidden="true">↗</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

export function CollectionDetail(props: QuartzComponentProps) {
  const { fileData, allFiles } = props
  const fm = fileData.frontmatter
  const period = fm?.tipas === "laikotarpis"
  const members = collectionMembers(fileData, allFiles)
  const periods = collectionPeriods(allFiles)
  // Adjacent centuries and broader eras are separate sequences.
  const duration = Number(fm?.periodo_pabaiga) - Number(fm?.periodo_pradzia)
  const sequence = periods.filter(
    (page) =>
      (Number(page.frontmatter?.periodo_pabaiga) - Number(page.frontmatter?.periodo_pradzia) ===
        99) ===
      (duration === 99),
  )
  const position = sequence.findIndex((page) => page.slug === fileData.slug)
  return (
    <div class="popover-hint bm-list-page collection-page">
      <CollectionIntro
        title={String(fm?.pavadinimas ?? fm?.title)}
        label={period ? "Laikotarpiai" : "Temų kolekcija"}
        range={period ? `${fm?.periodo_pradzia}–${fm?.periodo_pabaiga}` : undefined}
        description={
          period
            ? "Šio laikotarpio žmonės, vietos ir įvykiai. Tyrinėkite jų istorijas ir šaltiniuose išlikusius liudijimus."
            : String(
                fm?.tema_aprasymas ||
                  "Vienos temos jungiami žmonės, įvykiai, vietos ir kiti istorijos objektai.",
              )
        }
        count={members.length}
      />
      <CollectionNav {...props} />
      {period && (
        <nav class="collection-neighbours" aria-label="Gretimi laikotarpiai">
          {[sequence[position - 1], sequence[position + 1]].map(
            (page, i) =>
              page && (
                <a class="internal" href={resolveRelative(fileData.slug!, page.slug!)}>
                  {i === 0 && "← "}
                  {String(page.frontmatter?.pavadinimas ?? page.frontmatter?.title)}
                  {i === 1 && " →"}
                </a>
              ),
          )}
        </nav>
      )}
      {members.length ? (
        <div class="collection-results">
          <PageList {...props} allFiles={members} />
        </div>
      ) : (
        <p class="collection-empty">Šioje kolekcijoje objektų dar nėra.</p>
      )}
    </div>
  )
}
