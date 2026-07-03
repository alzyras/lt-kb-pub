import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/graph-explorer.inline"
import style from "./styles/graph-explorer.scss"

export default (() => {
  const GraphExplorer: QuartzComponent = () => {
    return (
      <main class="graph-explorer" data-graph-explorer>
        <form class="graph-explorer-topbar" data-graph-filters>
          <a class="graph-explorer-brand" href="/">
            Lietuvos istorijos žinių bazė
          </a>
          <label class="graph-explorer-search">
            <span class="sr-only">Paieška</span>
            <input
              type="search"
              name="q"
              placeholder="Ieškoti objekto"
              autocomplete="off"
              aria-autocomplete="list"
              aria-controls="graph-explorer-suggestions"
              data-graph-search-input
            />
            <div class="graph-explorer-suggest" data-graph-suggest hidden>
              <div
                id="graph-explorer-suggestions"
                class="graph-explorer-suggest-list"
                role="listbox"
                aria-label="Žemėlapio paieškos pasiūlymai"
                data-graph-suggest-list
              ></div>
            </div>
          </label>
          <label class="graph-explorer-preset">
            <span class="sr-only">Presetas</span>
            <select name="preset" aria-label="Žemėlapio presetai">
              <option value="important">Svarbiausi objektai</option>
              <option value="vytautas">Vytautas</option>
              <option value="ldk">LDK</option>
              <option value="xx">XX amžius</option>
              <option value="people-events">Asmenys + įvykiai</option>
              <option value="events">Tik įvykiai</option>
              <option value="topics">Temos</option>
            </select>
          </label>

          <fieldset class="graph-explorer-type-control" aria-label="Objektų tipai">
            <legend>Objektai</legend>
            <label>
              <input type="checkbox" value="asmuo" data-type-toggle />
              <span>Asmenys</span>
            </label>
            <label>
              <input type="checkbox" value="autorius" data-type-toggle />
              <span>Autoriai</span>
            </label>
            <label>
              <input type="checkbox" value="ivykis" data-type-toggle />
              <span>Įvykiai</span>
            </label>
            <label>
              <input type="checkbox" value="grupe" data-type-toggle />
              <span>Grupės</span>
            </label>
            <label>
              <input type="checkbox" value="vieta" data-type-toggle />
              <span>Vietos</span>
            </label>
            <label>
              <input type="checkbox" value="daiktas" data-type-toggle />
              <span>Daiktai</span>
            </label>
            <label>
              <input type="checkbox" value="paprotys" data-type-toggle />
              <span>Papročiai</span>
            </label>
            <label>
              <input type="checkbox" value="posakis" data-type-toggle />
              <span>Posakiai</span>
            </label>
            <label>
              <input type="checkbox" value="zodyno_irasas" data-type-toggle />
              <span>Žodynas</span>
            </label>
            <label>
              <input type="checkbox" value="tema" data-type-toggle />
              <span>Temos</span>
            </label>
          </fieldset>

          <fieldset class="graph-explorer-depth-control" aria-label="Ryšių gylis">
            <legend>Gylis</legend>
            <label>
              <input type="radio" name="depth" value="1" />
              <span>1</span>
            </label>
            <label>
              <input type="radio" name="depth" value="2" />
              <span>2</span>
            </label>
            <label>
              <input type="radio" name="depth" value="3" />
              <span>3</span>
            </label>
            <label>
              <input type="radio" name="depth" value="-1" />
              <span>Visas</span>
            </label>
          </fieldset>

          <div class="graph-explorer-actions-bar" role="toolbar" aria-label="Žemėlapio veiksmai">
            <button
              class="graph-explorer-tool-button graph-explorer-books-button"
              type="button"
              data-popover-toggle="books"
              aria-expanded="false"
              aria-label="Pasirinkti knygas"
              title="Knygos"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span data-source-summary>Visos knygos</span>
            </button>
            <button
              class="graph-explorer-tool-button"
              type="button"
              data-popover-toggle="filters"
              aria-expanded="false"
              aria-label="Atidaryti filtrus"
              title="Filtrai"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 21v-7" />
                <path d="M4 10V3" />
                <path d="M12 21v-9" />
                <path d="M12 8V3" />
                <path d="M20 21v-5" />
                <path d="M20 12V3" />
                <path d="M2 14h4" />
                <path d="M10 8h4" />
                <path d="M18 16h4" />
              </svg>
            </button>
            <button
              class="graph-explorer-tool-button"
              type="button"
              data-panel-toggle
              aria-label="Rodyti arba slėpti detalių panelį"
              title="Detalės"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 4h7v16H4z" />
                <path d="M15 5h5" />
                <path d="M15 12h5" />
                <path d="M15 19h5" />
              </svg>
            </button>
            <button
              class="graph-explorer-tool-button"
              type="button"
              data-graph-reset
              aria-label="Atstatyti filtrus"
              title="Atstatyti"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v6h6" />
              </svg>
            </button>
          </div>

          <div class="graph-explorer-popovers">
            <section class="graph-explorer-popover graph-explorer-books-popover" data-popover-panel="books" hidden>
              <div class="graph-explorer-popover-header">
                <strong>Knygos</strong>
                <button type="button" data-popover-close aria-label="Uždaryti knygų pasirinkimą">×</button>
              </div>
              <input
                class="graph-explorer-source-search"
                type="search"
                placeholder="Filtruoti knygas..."
                autocomplete="off"
                data-source-search
              />
              <div class="graph-explorer-source-actions">
                <button type="button" data-source-select-all>Visos knygos</button>
                <button type="button" data-source-clear>Nuimti</button>
              </div>
              <div class="graph-explorer-source-list" data-source-list>
                <p class="graph-explorer-empty">Kraunamos knygos...</p>
              </div>
            </section>

            <section class="graph-explorer-popover graph-explorer-filter-popover" data-popover-panel="filters" hidden>
              <div class="graph-explorer-popover-header">
                <strong>Filtrai</strong>
                <button type="button" data-popover-close aria-label="Uždaryti filtrus">×</button>
              </div>
              <div class="graph-explorer-filter-grid">
                <label>
                  <span>Min. teiginių</span>
                  <input type="number" name="minClaims" min="0" max="200" step="1" />
                </label>
                <label>
                  <span>Min. citatų</span>
                  <input type="number" name="minQuotes" min="0" max="200" step="1" />
                </label>
                <label>
                  <span>Max</span>
                  <input type="number" name="maxNodes" min="25" max="1500" step="25" />
                </label>
                <label>
                  <span>Nuo</span>
                  <input type="number" name="from" placeholder="metai" />
                </label>
                <label>
                  <span>Iki</span>
                  <input type="number" name="to" placeholder="metai" />
                </label>
              </div>
            </section>
          </div>
        </form>
        <section class="graph-explorer-stage">
          <aside class="graph-explorer-panel" data-graph-panel>
            <div class="graph-explorer-panel-empty">
              Pasirink objektą arba ryšį.
            </div>
          </aside>
          <div class="graph-explorer-canvas" data-graph-canvas>
            <div class="graph-explorer-status">Kraunamas žemėlapis...</div>
            <button class="graph-explorer-show-panel" type="button" data-panel-show>
              Rodyti panelį
            </button>
          </div>
        </section>
      </main>
    )
  }

  GraphExplorer.css = style
  GraphExplorer.afterDOMLoaded = script
  return GraphExplorer
}) satisfies QuartzComponentConstructor
