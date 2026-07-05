import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  // If baseUrl contains a pathname after the domain, use this as the home link
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint bm-not-found">
      <div class="bm-not-found-media" aria-hidden="true" />
      <div class="bm-not-found-copy">
        <p>404</p>
        <h1>{i18n(cfg.locale).pages.error.notFound}</h1>
        <a href={baseDir}>{i18n(cfg.locale).pages.error.home}</a>
      </div>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
