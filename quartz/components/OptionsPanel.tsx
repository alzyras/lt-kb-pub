// @ts-ignore
import optionsPanelScript from "./scripts/options-panel.inline"
import styles from "./styles/optionsPanel.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const OptionsPanel: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "options-panel-root")} data-options-root="">
      <button
        class="options-panel-toggle"
        type="button"
        aria-label="Atidaryti filtravimo parinktis"
        title="Options"
        data-options-toggle=""
        aria-expanded="false"
      >
        <span class="options-panel-toggle-label">Options</span>
      </button>
      <div class="options-panel-popover" data-options-popover="" hidden>
        <div class="options-panel-header">
          <strong>Options</strong>
          <button
            class="options-panel-close"
            type="button"
            aria-label="Uždaryti filtravimo parinktis"
            data-options-close=""
          >
            ×
          </button>
        </div>
        <div class="options-panel-section">
          <label class="options-panel-label" for="ltkb-min-quote-count-number">
            Min. citatų skaičius
          </label>
          <div class="options-panel-range-row">
            <input
              id="ltkb-min-quote-count-range"
              type="range"
              min="0"
              max="50"
              step="1"
              value="0"
              data-options-quote-range=""
            />
            <input
              id="ltkb-min-quote-count-number"
              class="options-panel-number"
              type="number"
              min="0"
              step="1"
              value="0"
              data-options-quote-number=""
            />
          </div>
        </div>
        <div class="options-panel-section">
          <label class="options-panel-label" for="ltkb-source-search">
            Knygos su citatomis
          </label>
          <input
            id="ltkb-source-search"
            class="options-panel-search"
            type="search"
            placeholder="Filtruoti knygas..."
            data-options-source-search=""
          />
          <div class="options-panel-selected" data-options-selected-summary="">
            Pasirinkta: 0
          </div>
          <div class="options-panel-source-list" data-options-source-list="">
            <p class="options-panel-empty">Kraunamas knygų sąrašas…</p>
          </div>
        </div>
        <div class="options-panel-actions">
          <button class="options-panel-reset" type="button" data-options-reset="">
            Atstatyti
          </button>
        </div>
      </div>
    </div>
  )
}

OptionsPanel.beforeDOMLoaded = optionsPanelScript
OptionsPanel.css = styles

export default (() => OptionsPanel) satisfies QuartzComponentConstructor
