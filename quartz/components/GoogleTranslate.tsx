import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/google-translate.inline"
import styles from "./styles/googleTranslate.scss"

const GoogleTranslate: QuartzComponent = () => {
  return (
    <div
      class="google-translate notranslate"
      data-google-translate
      role="group"
      aria-label="Svetainės kalba"
    >
      <button type="button" data-translate-language="lt" aria-pressed="true">
        LT
      </button>
      <span class="google-translate-divider" aria-hidden="true">
        /
      </span>
      <button type="button" data-translate-language="en" aria-pressed="false">
        EN
      </button>
      <div id="google_translate_element" aria-hidden="true" />
      <span class="google-translate-status" data-translate-status aria-live="polite" />
    </div>
  )
}

GoogleTranslate.css = styles
GoogleTranslate.afterDOMLoaded = script

export default (() => GoogleTranslate) satisfies QuartzComponentConstructor
