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
        aria-label="Atidaryti įrankius"
        title="Įrankiai"
        data-options-toggle=""
        aria-expanded="false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="options-panel-icon"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M10 11H6.5a1.5 1.5 0 0 1-1.5-1.5V6a1 1 0 0 1 1-1h5v4a6 6 0 0 1-6 6" />
          <path d="M19 11h-3.5A1.5 1.5 0 0 1 14 9.5V6a1 1 0 0 1 1-1h5v4a6 6 0 0 1-6 6" />
        </svg>
        <span class="options-panel-toggle-label">Įrankiai</span>
        <span class="options-panel-badge" data-options-active-count hidden></span>
      </button>
      <div class="options-panel-popover" data-options-popover="" hidden>
        <div class="options-panel-header">
          <strong>Įrankiai</strong>
          <button
            class="options-panel-close"
            type="button"
            aria-label="Uždaryti įrankius"
            data-options-close=""
          >
            ×
          </button>
        </div>
        <div class="options-panel-command-grid" aria-label="Rodymo įrankiai">
          <button type="button" data-options-reader aria-pressed="false">
            Skaitymo režimas
          </button>
          <button type="button" data-options-theme>
            Keisti temą
          </button>
          <button type="button" data-options-research aria-pressed="false">
            Tyrimo režimas
          </button>
        </div>
        <div class="options-panel-section">
          <label class="options-panel-label" for="ltkb-min-claim-count-number">
            Min. teiginių skaičius
          </label>
          <div class="options-panel-range-row">
            <input
              id="ltkb-min-claim-count-range"
              type="range"
              min="0"
              max="50"
              step="1"
              value="0"
              data-options-quote-range=""
            />
            <input
              id="ltkb-min-claim-count-number"
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
          <label class="options-panel-check-row" for="ltkb-show-person-parentheticals">
            <input
              id="ltkb-show-person-parentheticals"
              type="checkbox"
              checked
              data-options-person-parentheticals=""
            />
            <span>Rodyti asmenų paaiškinimus skliaustuose</span>
          </label>
        </div>
        <div class="options-panel-section options-panel-source-summary">
          <span class="options-panel-label">Tekstiniai šaltiniai</span>
          <div class="options-panel-selected" data-options-selected-summary>
            Pasirinkti visi
          </div>
          <input
            class="options-panel-search"
            type="search"
            placeholder="Ieškoti knygos"
            aria-label="Ieškoti tekstinio šaltinio"
            data-options-source-search=""
          />
          <div class="options-panel-source-list" data-options-source-list="" />
        </div>
        <div class="options-panel-actions">
          <button class="options-panel-reset" type="button" data-options-reset="">
            Atstatyti
          </button>
          <a class="options-panel-settings-link" href="/nustatymai" data-router-ignore>
            Visi nustatymai
          </a>
        </div>
      </div>
    </div>
  )
}

OptionsPanel.beforeDOMLoaded = optionsPanelScript
OptionsPanel.css = styles

export default (() => OptionsPanel) satisfies QuartzComponentConstructor
