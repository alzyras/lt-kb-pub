import { FullSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/objectDirectory.scss"

type DirectoryCategory = {
  type: string
  label: string
  description: string
  image: string
  imageAlt: string
}

const categories: DirectoryCategory[] = [
  { type: "asmuo", label: "Asmenys", description: "Valdovai, autoriai, veikėjai ir liudininkai.", image: "category-asmenys-960.webp", imageAlt: "Istorinis asmens portreto fragmentas" },
  { type: "autorius", label: "Autoriai", description: "Istorikai, metraštininkai ir tyrimo balsai.", image: "category-autoriai-960.webp", imageAlt: "Istorinio autoriaus portreto fragmentas" },
  { type: "ivykis", label: "Įvykiai", description: "Mūšiai, sutartys, sukilimai ir lūžiai.", image: "category-ivykiai-960.webp", imageAlt: "Istorinio mūšio vaizdo fragmentas" },
  { type: "vieta", label: "Vietos", description: "Pilys, miestai, žemės, upės ir erdvės.", image: "category-vietos-960.webp", imageAlt: "Istorinės vietos vaizdo fragmentas" },
  { type: "grupe", label: "Grupės", description: "Giminės, luomai, kariuomenės ir bendruomenės.", image: "category-grupes-960.webp", imageAlt: "Istorinės bendruomenės iliustracijos fragmentas" },
  { type: "daiktas", label: "Daiktai", description: "Dokumentai, ženklai, ginklai ir artefaktai.", image: "category-daiktai-960.webp", imageAlt: "Istorinio daikto vaizdo fragmentas" },
  { type: "paprotys", label: "Papročiai", description: "Apeigos, praktikos, normos ir tradicijos.", image: "category-paprociai-960.webp", imageAlt: "Liaudies tradicijos vaizdo fragmentas" },
  { type: "posakis", label: "Posakiai", description: "Citatos, formulės ir įsimintini pasakymai.", image: "category-posakiai-960.webp", imageAlt: "Istorinio rašto fragmentas" },
  { type: "zodyno_irasas", label: "Žodynas", description: "Sąvokos, terminai ir istorinė leksika.", image: "category-zodynas-960.webp", imageAlt: "Senojo rašto fragmentas" },
  { type: "saltinis", label: "Šaltiniai", description: "Knygos, kronikos ir tekstai, iš kurių mokomės.", image: "category-saltiniai-960.webp", imageAlt: "Istorinio šaltinio puslapio fragmentas" },
]

function objectPages(allFiles: QuartzPluginData[]): QuartzPluginData[] {
  return allFiles.filter((page) => {
    const slug = String(page.slug ?? "")
    const type = String(page.frontmatter?.tipas ?? "")
    return slug.startsWith("objektai/") && slug.split("/").length >= 3 && type && type !== "aplankas"
  })
}

const ObjectDirectory: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const pages = objectPages(allFiles)
  const counts = new Map<string, number>()
  for (const page of pages) {
    const type = String(page.frontmatter?.tipas ?? "")
    counts.set(type, (counts.get(type) ?? 0) + 1)
  }

  const currentSlug = (fileData.slug ?? "objektai/index") as FullSlug
  const total = pages.length

  return (
    <div class="object-directory">
      <section class="object-directory-hero" aria-labelledby="object-directory-title">
        <div class="object-directory-hero-copy">
          <p class="object-directory-kicker">Lietuvos istorijos žinynas</p>
          <h1 id="object-directory-title">Objektai</h1>
          <p class="object-directory-lead">
            Žmonės, vietos, įvykiai, šaltiniai ir sąvokos, sujungti į vieną patikrinamą istorijos tinklą.
          </p>
          <div class="object-directory-actions">
            <a class="object-directory-primary" href={resolveRelative(currentSlug, "index" as FullSlug)}>Ieškoti kolekcijoje <span aria-hidden="true">→</span></a>
            <a class="object-directory-secondary" href={resolveRelative(currentSlug, "zemelapis" as FullSlug)}>Atverti žemėlapį <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <dl class="object-directory-stats" aria-label="Objektų kolekcijos statistika">
          <div><dt>Objektų</dt><dd>{total.toLocaleString("lt-LT")}</dd></div>
          <div><dt>Tipų</dt><dd>{categories.length}</dd></div>
        </dl>
      </section>

      <section class="object-directory-browse" aria-labelledby="object-directory-browse-title">
        <div class="object-directory-section-heading">
          <div>
            <p class="object-directory-kicker">Pasirink kelią</p>
            <h2 id="object-directory-browse-title">Naršyti pagal tipą</h2>
          </div>
          <p>Pradėk nuo srities, kurią nori tyrinėti. Kiekviename kataloge išlieka teiginiai, citatos ir ryšiai.</p>
        </div>
        <div class="object-directory-grid">
          {categories.map((category, index) => {
            const count = counts.get(category.type) ?? 0
            const folderSlug = ["asmuo", "autorius", "ivykis", "vieta", "grupe", "daiktas", "paprotys", "posakis", "zodyno_irasas", "saltinis"][index]
            return (
              <a class={`object-directory-card object-directory-card-${(index % 4) + 1}`} href={resolveRelative(currentSlug, `objektai/${folderSlug}` as FullSlug)}>
                <span class="object-directory-card-image"><img src={resolveRelative(currentSlug, `static/collection-images/${category.image}` as FullSlug)} alt={category.imageAlt} loading="lazy" /></span>
                <span class="object-directory-card-body">
                  <span class="object-directory-card-index">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{category.label}</strong>
                  <span class="object-directory-card-description">{category.description}</span>
                  <span class="object-directory-card-meta">{count.toLocaleString("lt-LT")} {count === 1 ? "įrašas" : "įrašų"}<span aria-hidden="true">↗</span></span>
                </span>
              </a>
            )
          })}
        </div>
      </section>

      <section class="object-directory-footer-card" aria-label="Tyrimo pradžia">
        <div><p class="object-directory-kicker">Tyrimo pradžia</p><h2>Ieškai konkretaus vardo?</h2></div>
        <p>Naudok paiešką, jei nori rasti objektą pagal vardą, laikotarpį, šaltinį ar teiginio temą.</p>
        <a href={resolveRelative(currentSlug, "index" as FullSlug)}>Atverti paiešką <span aria-hidden="true">→</span></a>
      </section>
    </div>
  )
}

ObjectDirectory.css = style
export default (() => ObjectDirectory) satisfies QuartzComponentConstructor
