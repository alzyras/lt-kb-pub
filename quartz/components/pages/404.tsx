import { FullSlug } from "../../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const sitePath = (path: string) => `/${path.replace(/^\/+/, "")}`

const battles = [
  {
    key: "grunwald",
    image: "notfound-grunwald",
    title: "Žalgirio mūšis",
    year: "1410 m.",
    result: "Lietuvos ir Lenkijos kariuomenė sutriuškino Vokiečių ordiną.",
    note:
      "Tavo šaltiniai pabrėžia, kad pergalė pakirto Ordino hegemoniją ir pašalino jo egzistencinę grėsmę Lietuvai.",
    linkSlug: "objektai/ivykiai/Zalgirio-musis-(1410-m.)" as FullSlug,
  },
  {
    key: "orsha",
    image: "notfound-orsha",
    title: "Oršos mūšis",
    year: "1514 m.",
    result: "Po pergalės Lietuvai vėl atiteko Mstislavlis, Dubrovna ir Kryčevas.",
    note:
      "Bazės citatos mini triumfo iškilmes Vilniuje, belaisvius ir trofėjines vėliavas katedroje.",
    linkSlug: "objektai/ivykiai/Orsos-musis-(1514-m.)" as FullSlug,
  },
  {
    key: "kircholm",
    image: "notfound-kircholm",
    title: "Salaspilio (Kircholmo) mūšis",
    year: "1605 m.",
    result: "Jono Karolio Chodkevičiaus vadovaujama LDK kariuomenė nugalėjo švedus.",
    note:
      "Šaltiniuose nurodoma, kad apie 3 tūkst. LDK raitelių įveikė apie 12 tūkst. švedų.",
    linkSlug: "objektai/ivykiai/Salaspilio-(Kircholmo)-musis-(1605-m.)" as FullSlug,
  },
  {
    key: "ula",
    image: "notfound-ula",
    title: "Ūlos (Čašnikų) mūšis",
    year: "1564 m.",
    result: "Lietuvos pajėgos sukėlė sumaištį Maskvos kariuomenėje ir ją sutriuškino.",
    note:
      "Citatos mini smūgį maskvėnų artilerijai bei šauliams ir bėgančius karius, skendusius Ulos upėje.",
    linkSlug: "objektai/ivykiai/Ulos-(Casniku)-musis-(1564-m.-sausio-23-d.)" as FullSlug,
  },
  {
    key: "chotyn1621",
    image: "notfound-chotyn1621",
    title: "Chotino mūšis",
    year: "1621 m.",
    result: "ATR stovykla atsilaikė, Turkija pasirašė paliaubas, o siena liko palei Dniestrą.",
    note:
      "Tavo puslapyje Chotinas įvardytas kaip paskutinė Jono Karolio Chodkevičiaus pergalė.",
    linkSlug: "objektai/ivykiai/Chotino-musis-(1621-m.-rugsejo-22-d.-spalio-10-d.)" as FullSlug,
  },
] as const

const selectionScript = `
(() => {
  const root = document.querySelector(".bm-not-found")
  if (!root) return
  const slides = [...root.querySelectorAll("[data-404-scene]")]
  if (!slides.length) return
  const seed = Array.from(window.location.pathname + window.location.search).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  )
  const activate = (index) => {
    const next = ((index % slides.length) + slides.length) % slides.length
    slides.forEach((slide, current) => {
      const active = current === next
      slide.toggleAttribute("data-active", active)
      slide.setAttribute("aria-hidden", active ? "false" : "true")
    })
  }
  activate(seed)
})()
`

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname
  const homeHref = baseDir === "/" ? "/" : baseDir

  return (
    <article class="popover-hint bm-not-found" data-404-page>
      <div class="bm-not-found-kicker">404 / klaidinga salė</div>
      <div class="bm-not-found-layout">
        <div class="bm-not-found-copy">
          <p class="bm-not-found-eyebrow">Puslapis nerastas</p>
          <h1>Šito puslapio nėra.</h1>
          <p class="bm-not-found-lead">
            Adresas neatsidarė. Gali grįžti į pradžią arba pereiti į istorinių įvykių sąrašą.
          </p>
          <div class="bm-not-found-actions" aria-label="Veiksmai">
            <a href={homeHref}>Į pradžią</a>
            <a href={sitePath("objektai/ivykiai")}>Įvykiai</a>
          </div>
        </div>
        <div class="bm-not-found-gallery" aria-live="polite">
          {battles.map((battle, index) => (
            <section
              class="bm-not-found-scene"
              data-404-scene
              data-active={index === 0 ? true : undefined}
              aria-hidden={index === 0 ? "false" : "true"}
            >
              <div class="bm-battle-frame">
                <picture>
                  <source
                    srcSet={`${sitePath(
                      `static/collection-images/${battle.image}-960.webp`,
                    )} 960w, ${sitePath(
                      `static/collection-images/${battle.image}-1440.webp`,
                    )} 1440w`}
                    type="image/webp"
                  />
                  <img
                    src={sitePath(`static/collection-images/${battle.image}-960.jpg`)}
                    alt={`${battle.title}, ${battle.year}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    width="960"
                    height="595"
                  />
                </picture>
              </div>
              <div class="bm-not-found-record">
                <p>{battle.year}</p>
                <h2>{battle.title}</h2>
                <strong>{battle.result}</strong>
                <span>{battle.note}</span>
                <a href={sitePath(battle.linkSlug)}>Atidaryti mūšio puslapį</a>
              </div>
            </section>
          ))}
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: selectionScript }} />
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
