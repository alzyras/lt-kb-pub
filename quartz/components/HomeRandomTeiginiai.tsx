// @ts-ignore
import script from "./scripts/home-random-teiginiai.inline"
import styles from "./styles/homeRandomTeiginiai.scss"
import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  limit?: number
  minEvidence?: number
}

const HomeRandomTeiginiai: QuartzComponent = ({
  displayClass,
  title = "Atsitiktiniai teiginiai",
  limit = 5,
  minEvidence = 10,
}) => {
  return (
    <section
      class={classNames(displayClass, "home-random-teiginiai")}
      data-home-random-teiginiai="true"
      data-limit={String(Math.max(1, Number(limit) || 5))}
      data-min-evidence={String(Math.max(1, Number(minEvidence) || 10))}
    >
      <h2 class="home-random-teiginiai-title">{title}</h2>
      <ol class="home-random-teiginiai-list" data-home-random-teiginiai-list="true">
        <li class="home-random-teiginiai-loading">Kraunami teiginiai…</li>
      </ol>
    </section>
  )
}

HomeRandomTeiginiai.afterDOMLoaded = script
HomeRandomTeiginiai.css = styles

export default ((opts?: Options) => {
  const Component: QuartzComponent = (props) => <HomeRandomTeiginiai {...props} {...opts} />
  Component.afterDOMLoaded = HomeRandomTeiginiai.afterDOMLoaded
  Component.css = HomeRandomTeiginiai.css
  return Component
}) satisfies QuartzComponentConstructor<Options | undefined>
