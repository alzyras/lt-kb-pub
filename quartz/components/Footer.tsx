import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import style from "./styles/footer.scss"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg, fileData }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    const currentSlug = fileData.slug ?? ("index" as FullSlug)
    return (
      <footer class={`site-footer ${displayClass ?? ""}`}>
        <div class="site-footer-brand">
          <p class="site-footer-kicker">LT KB kolekcija</p>
          <h2>{cfg.pageTitle}</h2>
          <p>
            Struktūruota Lietuvos istorijos kolekcija, jungianti šaltinius, citatas, teiginius,
            objektus ir jų ryšius.
          </p>
        </div>
        <div class="site-footer-actions">
          <section>
            <h3>Naršyti</h3>
            <a href={resolveRelative(currentSlug, "objektai" as FullSlug)}>Objektai</a>
            <a href={resolveRelative(currentSlug, "temos" as FullSlug)}>Temos</a>
            <a href={resolveRelative(currentSlug, "laikotarpiai" as FullSlug)}>Laikotarpiai</a>
          </section>
          <section>
            <h3>Tirti</h3>
            <a href={resolveRelative(currentSlug, "objektai/asmenys" as FullSlug)}>Asmenys</a>
            <a href={resolveRelative(currentSlug, "objektai/saltiniai" as FullSlug)}>Šaltiniai</a>
            <a href={resolveRelative(currentSlug, "zemelapis" as FullSlug)}>Žemėlapis</a>
          </section>
        </div>
        <div class="site-footer-meta">
          <p>
            © {year} {cfg.pageTitle}
          </p>
          <ul>
            {Object.entries(links).map(([text, link]) => (
              <li>
                <a href={link}>{text}</a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
