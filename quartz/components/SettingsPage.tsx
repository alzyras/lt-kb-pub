import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/settings-page.inline"
import styles from "./styles/settingsPage.scss"

const SettingsPage: QuartzComponent = () => (
  <main class="settings-page" data-settings-page="true">
    <div class="settings-page-intro">
      <p>
        Pasirinkimai galioja visoje svetainėje ir išsaugomi šioje naršyklėje.
      </p>
      <span class="settings-save-status" data-settings-save-status aria-live="polite"></span>
    </div>

    <div class="settings-tabs" role="tablist" aria-label="Nustatymų skyriai">
      <button type="button" role="tab" data-settings-tab="text" aria-selected="true">
        Tekstiniai šaltiniai
      </button>
      <button type="button" role="tab" data-settings-tab="media" aria-selected="false">
        Vaizdų šaltiniai
      </button>
      <button type="button" role="tab" data-settings-tab="display" aria-selected="false">
        Rodymas
      </button>
    </div>

    {(["text", "media"] as const).map((channel) => (
      <section
        class="settings-panel settings-source-panel"
        role="tabpanel"
        data-settings-panel={channel}
        hidden={channel !== "text"}
      >
        <div class="settings-source-toolbar">
          <label>
            <span>Paieška</span>
            <input
              type="search"
              placeholder="Pavadinimas, autorius arba serija"
              data-settings-source-search={channel}
            />
          </label>
          <div class="settings-source-actions">
            <button type="button" data-settings-select-all={channel}>Pasirinkti visus</button>
            <button type="button" data-settings-select-none={channel}>Atžymėti visus</button>
          </div>
        </div>
        <p class="settings-selection-summary" data-settings-summary={channel}></p>
        <div class="settings-source-tree" data-settings-source-tree={channel}>
          <p class="settings-loading">Kraunamas šaltinių katalogas…</p>
        </div>
      </section>
    ))}

    <section class="settings-panel settings-display-panel" role="tabpanel" data-settings-panel="display" hidden>
      <div class="settings-field">
        <label for="settings-min-claims">Minimalus teiginių skaičius objekte</label>
        <div class="settings-number-row">
          <input id="settings-min-claims-range" type="range" min="0" max="50" step="1" data-settings-min-claims-range />
          <input id="settings-min-claims" type="number" min="0" step="1" data-settings-min-claims-number />
        </div>
      </div>
      <label class="settings-toggle-row">
        <input type="checkbox" data-settings-person-parentheticals />
        <span>Rodyti asmenų paaiškinimus skliaustuose</span>
      </label>
      <label class="settings-toggle-row">
        <input type="checkbox" data-settings-advanced-evidence />
        <span>Rodyti išplėstus teiginių ir įrodymų metaduomenis</span>
      </label>
      <button class="settings-reset" type="button" data-settings-reset>Atstatyti numatytuosius</button>
    </section>
  </main>
)

SettingsPage.afterDOMLoaded = script
SettingsPage.css = styles

export default (() => SettingsPage) satisfies QuartzComponentConstructor
