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
      <select data-translate-language aria-label="Pasirinkti svetainės kalbą">
        <option value="lt">LT - Lietuvių</option>
        <option value="en">EN - English</option>
        <option value="pl">PL - Polski</option>
        <option value="lv">LV - Latviešu</option>
        <option value="et">EE - Eesti</option>
        <option value="be">BY - Беларуская</option>
        <option value="ru">RU - Русский</option>
        <option value="uk">UA - Українська</option>
        <option value="de">DE - Deutsch</option>
        <option value="yi">YI - ייִדיש</option>
        <option value="he">HE - עברית</option>
      </select>
      <div id="google_translate_element" aria-hidden="true" />
      <span class="google-translate-status" data-translate-status aria-live="polite" />
    </div>
  )
}

GoogleTranslate.css = styles
GoogleTranslate.afterDOMLoaded = script

export default (() => GoogleTranslate) satisfies QuartzComponentConstructor
