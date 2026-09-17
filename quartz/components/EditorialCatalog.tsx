import type { QuartzComponentProps } from "./types"
import { readFileSync } from "node:fs"
import { cleanText } from "../util/objectMedia"
import style from "./styles/editorialCatalog.scss"

export type CatalogEntry = {
  slug: string
  title: string
  description: string
  image: string
  kicker: string
}

export function EditorialCatalog({
  title,
  lead,
  entries,
}: {
  title: string
  lead: string
  entries: CatalogEntry[]
}) {
  const unique = [
    ...new Map(entries.map((entry) => [entry.slug.replace(/\/$/u, ""), entry])).values(),
  ]
  return (
    <main class="editorial-catalog">
      <header class="editorial-catalog-intro">
        <p class="catalog-kicker">Lietuvos istorijos kolekcija</p>
        <h1>{title}</h1>
        <p>{lead}</p>
        <span class="catalog-total">
          {unique.length} {title === "Parodos" ? "parodos" : "pasakojimai"}
        </span>
      </header>
      <div class="editorial-catalog-grid">
        {unique.map((entry, index) => (
          <a class="editorial-catalog-card" href={`/${entry.slug.replace(/^\/+/u, "")}`}>
            <div class="editorial-catalog-image">
              {entry.image && (
                <img
                  src={entry.image}
                  alt=""
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              )}
            </div>
            <div class="editorial-catalog-copy">
              <span class="catalog-kicker">{entry.kicker}</span>
              <h2>{entry.title}</h2>
              <p>{entry.description}</p>
              <span class="editorial-catalog-action">
                {title === "Parodos" ? "Žiūrėti parodą" : "Skaityti pasakojimą"}{" "}
                <span aria-hidden="true">↗</span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}

export function ArticleCatalog({ allFiles }: QuartzComponentProps) {
  const entries = allFiles
    .filter(
      (file) =>
        /^straipsniai\/[^/]+$/u.test(file.slug || "") &&
        file.slug !== "straipsniai/index" &&
        file.frontmatter?.draft !== true,
    )
    .map((file): CatalogEntry => {
      let image = cleanText(file.frontmatter?.image || file.frontmatter?.socialImage)
      if (!image && file.filePath)
        try {
          image =
            readFileSync(String(file.filePath), "utf8").match(
              /<img\b[^>]*\bsrc=["']([^"']+)/iu,
            )?.[1] || ""
        } catch {}
      return {
        slug: file.slug!,
        title: cleanText(file.frontmatter?.title),
        description: cleanText(file.frontmatter?.description || file.description),
        image,
        kicker: "Istorijos pasakojimai",
      }
    })
  return (
    <EditorialCatalog
      title="Straipsniai"
      lead="Istorija iš arti. Žmonės, kasdienybė ir įvykiai — pasakojimuose, kurie prasideda nuo šaltinių."
      entries={entries}
    />
  )
}

export const editorialCatalogStyle = style
