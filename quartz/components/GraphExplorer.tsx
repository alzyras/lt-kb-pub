import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/graph-explorer.inline"
import style from "./styles/graph-explorer.scss"

export default (() => {
  const GraphExplorer: QuartzComponent = () => {
    return (
      <main class="graph-explorer" data-graph-explorer>
        <form class="graph-explorer-toolbar" data-graph-filters>
          <a class="graph-explorer-brand" href="/">
            Lietuvos istorijos žinių bazė
          </a>
          <div class="graph-explorer-primary-filters">
            <label class="graph-explorer-search">
              <span>Paieška</span>
              <input type="search" name="q" placeholder="Ieškoti objekto" autocomplete="off" />
            </label>
            <label>
              <span>Presetas</span>
              <select name="preset">
                <option value="important">Svarbiausi objektai</option>
                <option value="vytautas">Vytautas</option>
                <option value="ldk">LDK</option>
                <option value="xx">XX amžius</option>
                <option value="people-events">Tik asmenys + įvykiai</option>
                <option value="events">Tik įvykiai</option>
                <option value="topics">Temos</option>
              </select>
            </label>
            <label class="graph-explorer-source">
              <span>Knyga</span>
              <select name="source" data-source-select>
                <option value="">Visos knygos</option>
              </select>
            </label>
          </div>
          <details class="graph-explorer-advanced" open>
            <summary>Papildomi filtrai</summary>
            <div class="graph-explorer-advanced-grid">
              <label>
                <span>Tipai</span>
                <select name="types" multiple>
                  <option value="asmuo">Asmenys</option>
                  <option value="autorius">Autoriai</option>
                  <option value="ivykis">Įvykiai</option>
                  <option value="grupe">Grupės</option>
                  <option value="daiktas">Daiktai</option>
                  <option value="paprotys">Papročiai</option>
                  <option value="posakis">Posakiai</option>
                  <option value="zodyno_irasas">Žodynas</option>
                  <option value="vieta">Vietos</option>
                </select>
              </label>
              <label>
                <span>Min. teiginių</span>
                <input type="number" name="minClaims" min="0" max="200" step="1" />
              </label>
              <label>
                <span>Min. citatų</span>
                <input type="number" name="minQuotes" min="0" max="200" step="1" />
              </label>
              <label>
                <span>Gylis</span>
                <select name="depth">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="-1">Visas filtras</option>
                </select>
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
              <label class="graph-explorer-toggle">
                <input type="checkbox" name="showPlaces" />
                <span>Vietos</span>
              </label>
              <label class="graph-explorer-toggle">
                <input type="checkbox" name="showTopics" />
                <span>Temos</span>
              </label>
              <button type="button" data-graph-reset>Reset</button>
            </div>
          </details>
        </form>
        <section class="graph-explorer-stage">
          <div class="graph-explorer-canvas" data-graph-canvas>
            <div class="graph-explorer-status">Kraunamas žemėlapis...</div>
            <button class="graph-explorer-show-panel" type="button" data-panel-show>
              Rodyti panelį
            </button>
          </div>
          <aside class="graph-explorer-panel" data-graph-panel>
            <div class="graph-explorer-panel-empty">
              Pasirink objektą arba ryšį.
            </div>
          </aside>
        </section>
      </main>
    )
  }

  GraphExplorer.css = style
  GraphExplorer.afterDOMLoaded = script
  return GraphExplorer
}) satisfies QuartzComponentConstructor
