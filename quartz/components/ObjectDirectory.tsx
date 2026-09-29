import { QuartzPluginData } from "../plugins/vfile"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/objectDirectory.scss"

type DirectoryCategory = {
  type: string
  route: string
  label: string
  description: string
  image: string
  imageAlt: string
}

const categories: DirectoryCategory[] = [
  {
    type: "asmuo",
    route: "asmenys",
    label: "Asmenys",
    description: "Valdovai, autoriai, veikėjai ir liudininkai.",
    image: "category-asmenys-960.webp",
    imageAlt: "Istorinis asmens portreto fragmentas",
  },
  {
    type: "autorius",
    route: "autoriai",
    label: "Autoriai",
    description: "Istorikai, metraštininkai ir tyrimo balsai.",
    image: "category-autoriai-960.webp",
    imageAlt: "Istorinio autoriaus portreto fragmentas",
  },
  {
    type: "ivykis",
    route: "ivykiai",
    label: "Įvykiai",
    description: "Mūšiai, sutartys, sukilimai ir lūžiai.",
    image: "category-ivykiai-960.webp",
    imageAlt: "Istorinio mūšio vaizdo fragmentas",
  },
  {
    type: "vieta",
    route: "vietos",
    label: "Vietos",
    description: "Pilys, miestai, žemės, upės ir erdvės.",
    image: "category-vietos-960.webp",
    imageAlt: "Istorinės vietos vaizdo fragmentas",
  },
  {
    type: "grupe",
    route: "grupes",
    label: "Grupės",
    description: "Giminės, luomai, kariuomenės ir bendruomenės.",
    image: "category-grupes-960.webp",
    imageAlt: "Istorinės bendruomenės iliustracijos fragmentas",
  },
  {
    type: "daiktas",
    route: "daiktai",
    label: "Daiktai",
    description: "Dokumentai, ženklai, ginklai ir artefaktai.",
    image: "category-daiktai-960.webp",
    imageAlt: "Istorinio daikto vaizdo fragmentas",
  },
  {
    type: "paprotys",
    route: "paprociai",
    label: "Papročiai",
    description: "Apeigos, praktikos, normos ir tradicijos.",
    image: "category-paprociai-960.webp",
    imageAlt: "Liaudies tradicijos vaizdo fragmentas",
  },
  {
    type: "posakis",
    route: "posakiai",
    label: "Posakiai",
    description: "Citatos, formulės ir įsimintini pasakymai.",
    image: "category-posakiai-960.webp",
    imageAlt: "Istorinio rašto fragmentas",
  },
  {
    type: "zodyno_irasas",
    route: "zodynas",
    label: "Žodynas",
    description: "Sąvokos, terminai ir istorinė leksika.",
    image: "category-zodynas-960.webp",
    imageAlt: "Senojo rašto fragmentas",
  },
  {
    type: "saltinis",
    route: "saltiniai",
    label: "Šaltiniai",
    description: "Knygos, kronikos ir tekstai, iš kurių mokomės.",
    image: "category-saltiniai-960.webp",
    imageAlt: "Istorinio šaltinio puslapio fragmentas",
  },
]

function objectPages(allFiles: QuartzPluginData[]): QuartzPluginData[] {
  return [...new Map(allFiles.map((page) => [page.slug, page])).values()].filter((page) => {
    const slug = String(page.slug ?? "")
    const type = String(page.frontmatter?.tipas ?? "")
    return (
      slug.startsWith("objektai/") &&
      slug.split("/").length === 3 &&
      !slug.endsWith("/index") &&
      type &&
      type !== "aplankas"
    )
  })
}

const ObjectDirectory: QuartzComponent = ({ allFiles }: QuartzComponentProps) => {
  const pages = objectPages(allFiles)
  const counts = new Map<string, number>()
  for (const page of pages) {
    const type = String(page.frontmatter?.tipas ?? "")
    counts.set(type, (counts.get(type) ?? 0) + 1)
  }

  const total = pages.length

  return (
    <div class="object-directory">
      <section class="object-directory-hero" aria-labelledby="object-directory-title">
        <div class="object-directory-hero-copy">
          <p class="object-directory-kicker">Lietuvos istorijos žinynas</p>
          <h1 id="object-directory-title">Objektai</h1>
          <p class="object-directory-lead">
            Žmonės, vietos, įvykiai, šaltiniai ir sąvokos, sujungti į vieną patikrinamą istorijos
            tinklą.
          </p>
          <div class="object-directory-actions">
            <a class="object-directory-primary" href="/">
              Ieškoti kolekcijoje <span aria-hidden="true">→</span>
            </a>
            <a class="object-directory-secondary" href="/zemelapis">
              Atverti žemėlapį <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <dl class="object-directory-stats" aria-label="Objektų kolekcijos statistika">
          <div>
            <dt>Objektų</dt>
            <dd>{total.toLocaleString("lt-LT")}</dd>
          </div>
          <div>
            <dt>Tipų</dt>
            <dd>{categories.length}</dd>
          </div>
        </dl>
      </section>

      <section class="object-directory-browse" aria-labelledby="object-directory-browse-title">
        <div class="object-directory-section-heading">
          <div>
            <p class="object-directory-kicker">Pasirink kelią</p>
            <h2 id="object-directory-browse-title">Naršyti pagal tipą</h2>
          </div>
          <p>
            Pradėk nuo srities, kurią nori tyrinėti. Kiekviename kataloge išlieka teiginiai, citatos
            ir ryšiai.
          </p>
        </div>
        <div class="object-directory-grid">
          {categories.map((category, index) => {
            const count = counts.get(category.type) ?? 0
            return (
              <a
                class={`object-directory-card object-directory-card-${(index % 4) + 1}`}
                href={`/objektai/${category.route}`}
              >
                <span class="object-directory-card-image">
                  <img
                    src={`/static/collection-images/${category.image}`}
                    alt={category.imageAlt}
                    loading="lazy"
                  />
                </span>
                <span class="object-directory-card-body">
                  <span class="object-directory-card-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong>{category.label}</strong>
                  <span class="object-directory-card-description">{category.description}</span>
                  <span class="object-directory-card-meta">
                    {count.toLocaleString("lt-LT")} {count === 1 ? "įrašas" : "įrašų"}
                    <span aria-hidden="true">↗</span>
                  </span>
                </span>
              </a>
            )
          })}
        </div>
      </section>

      <section class="object-directory-footer-card" aria-label="Tyrimo pradžia">
        <div>
          <p class="object-directory-kicker">Tyrimo pradžia</p>
          <h2>Ieškai konkretaus vardo?</h2>
        </div>
        <p>
          Naudok paiešką, jei nori rasti objektą pagal vardą, laikotarpį, šaltinį ar teiginio temą.
        </p>
        <a href="/">
          Atverti paiešką <span aria-hidden="true">→</span>
        </a>
      </section>
    </div>
  )
}

ObjectDirectory.css = style
export default (() => ObjectDirectory) satisfies QuartzComponentConstructor
