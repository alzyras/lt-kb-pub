import { BrandLockup } from "./BrandLockup"
import { QuartzComponent, QuartzComponentConstructor } from "./types"
import style from "./styles/graph-explorer.scss"
const Icon = ({ children }: { children: any }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {children}
  </svg>
)
export default (() => {
  const GraphExplorer: QuartzComponent = () => (
    <main class="graph-explorer" data-graph-explorer>
      <header class="history-map-toolbar">
        <a class="history-map-brand" href="/" aria-label="Lietuvos istorijos žinių bazė">
          <BrandLockup compact invert showTagline={false} />
        </a>
        <div class="history-map-search">
          <Icon>
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" />
          </Icon>
          <input
            type="search"
            placeholder="Ieškoti istorijoje…"
            autocomplete="off"
            aria-label="Ieškoti objekto"
            role="combobox"
            aria-expanded="false"
            aria-autocomplete="list"
            aria-controls="graph-explorer-suggestions"
            data-graph-search-input
          />
          <div class="history-map-suggest" hidden data-graph-suggest>
            <div id="graph-explorer-suggestions" role="listbox" data-graph-suggest-list />
          </div>
        </div>
        <div class="history-map-toolbar-actions">
          <button
            type="button"
            data-filter-toggle
            aria-controls="graph-filters"
            aria-expanded="false"
          >
            <Icon>
              <path d="M4 7h16M4 17h16M8 4v6m8 4v6" />
            </Icon>
            <span>Filtrai</span>
            <b data-filter-count hidden />
          </button>
          <button type="button" data-graph-theme aria-label="Keisti temą" title="Keisti temą">
            <Icon>
              <circle cx="12" cy="12" r="8" />
              <path d="M12 4a8 8 0 0 0 0 16Z" fill="currentColor" />
            </Icon>
          </button>
        </div>
      </header>
      <section class="history-map-stage">
        <div class="history-map-canvas" data-graph-canvas>
          <div class="history-map-hover" role="tooltip" data-graph-hover hidden />
        </div>
        <nav class="history-map-navigation" aria-label="Žemėlapio navigacija">
          <button type="button" data-history-back disabled aria-label="Atgal" title="Atgal">
            <Icon>
              <path d="m14 6-6 6 6 6" />
            </Icon>
          </button>
          <button type="button" data-history-forward disabled aria-label="Pirmyn" title="Pirmyn">
            <Icon>
              <path d="m10 6 6 6-6 6" />
            </Icon>
          </button>
          <button
            type="button"
            data-graph-home
            aria-label="Pradinis vaizdas"
            title="Pradinis vaizdas"
          >
            <Icon>
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
            </Icon>
          </button>
        </nav>
        <div class="history-map-overview" data-overview>
          <span>LIETUVOS ISTORIJOS RYŠIAI</span>
          <h1>Istorijos visata</h1>
          <p>Pasirinkite objektą. Atraskite jo istoriją.</p>
        </div>
        <div class="history-map-context" data-focus-context hidden>
          <strong data-focus-title />
          <label>
            Ryšių gylis{" "}
            <select data-graph-depth aria-label="Ryšių gylis">
              <option value="1">1 žingsnis</option>
              <option value="2">2 žingsniai</option>
              <option value="3">3 žingsniai</option>
              <option value="-1">Visas tinklas</option>
            </select>
          </label>
        </div>
        <section
          class="history-map-filters"
          id="graph-filters"
          role="dialog"
          aria-label="Žemėlapio filtrai"
          hidden
          data-filters
        >
          <header>
            <h2>Filtrai</h2>
            <button type="button" data-filter-close aria-label="Uždaryti filtrus">
              ×
            </button>
          </header>
          <div class="history-map-filter-body">
            <fieldset>
              <legend>Objektų tipai</legend>
              <div class="history-map-options" data-type-options />
            </fieldset>
            <fieldset>
              <legend>Ryšiai</legend>
              <div class="history-map-options" data-relation-options />
            </fieldset>
            <fieldset>
              <legend>Laikotarpis</legend>
              <div class="history-map-dates">
                <label>
                  Nuo
                  <input type="number" placeholder="Metai" data-date-from />
                </label>
                <span>—</span>
                <label>
                  Iki
                  <input type="number" placeholder="Metai" data-date-to />
                </label>
              </div>
            </fieldset>
            <label class="history-map-switch">
              <span>
                Objektai be ryšių<small>Atskiras išorinis sluoksnis</small>
              </span>
              <input type="checkbox" role="switch" data-isolated />
            </label>
            <p class="history-map-legacy" data-legacy-filters hidden>
              Ši nuoroda turi papildomų filtrų. Juos pašalinsite atkūrę filtrus.
            </p>
          </div>
          <footer>
            <button type="button" data-reset-filters>
              Atstatyti filtrus
            </button>
            <button type="button" data-filter-close>
              Rodyti žemėlapį
            </button>
          </footer>
        </section>
        <aside
          class="history-map-panel"
          role="dialog"
          aria-label="Objekto peržiūra"
          data-graph-panel
          hidden
        >
          <header>
            <span>OBJEKTO PERŽIŪRA</span>
            <button type="button" data-preview-close aria-label="Uždaryti peržiūrą">
              ×
            </button>
          </header>
          <div class="history-map-panel-body" data-preview-content aria-live="polite" />
        </aside>
        <div class="history-map-orbit-types" data-orbit-types aria-label="Objektų tipai" />
        <div class="history-map-status" role="status" aria-live="polite" data-graph-status>
          Rengiamas žemėlapis…
        </div>
        <div class="history-map-zoom" role="toolbar" aria-label="Mastelis">
          <button type="button" data-zoom-in aria-label="Priartinti">
            +
          </button>
          <button type="button" data-zoom-out aria-label="Atitolinti">
            −
          </button>
          <button
            type="button"
            data-zoom-fit
            aria-label="Sutalpinti visą vaizdą"
            title="Sutalpinti visą vaizdą"
          >
            <Icon>
              <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
            </Icon>
          </button>
        </div>
      </section>
    </main>
  )
  GraphExplorer.css = style
  return GraphExplorer
}) satisfies QuartzComponentConstructor
