import { BrandLockup } from "./BrandLockup"
import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/graph-explorer.inline"
import style from "./styles/graph-explorer.scss"

const Icon = ({ children }: { children: any }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">{children}</svg>
)

export default (() => {
  const GraphExplorer: QuartzComponent = () => (
    <main class="graph-explorer" data-graph-explorer data-panel="hidden">
      <header class="graph-explorer-toolbar">
        <a class="graph-explorer-brand" href="/" aria-label="Lietuvos istorijos žinių bazė">
          <BrandLockup compact />
        </a>

        <div class="graph-explorer-history" role="toolbar" aria-label="Žemėlapio istorija">
          <button type="button" data-history-back disabled aria-label="Atgal" title="Atgal">
            <Icon><path d="m15 18-6-6 6-6" /></Icon>
          </button>
          <button type="button" data-history-forward disabled aria-label="Pirmyn" title="Pirmyn">
            <Icon><path d="m9 18 6-6-6-6" /></Icon>
          </button>
          <button type="button" data-graph-home aria-label="Pradinis vaizdas" title="Pradinis vaizdas">
            <Icon><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></Icon>
          </button>
        </div>

        <label class="graph-explorer-search">
          <span class="sr-only">Ieškoti objekto</span>
          <Icon><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>
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
            <div id="graph-explorer-suggestions" role="listbox" data-graph-suggest-list></div>
          </div>
        </label>

        <div class="graph-explorer-toolbar-actions" role="toolbar" aria-label="Žemėlapio filtrai">
          <button type="button" data-popover-toggle="types" aria-expanded="false">
            <Icon><circle cx="6" cy="7" r="2" /><circle cx="18" cy="7" r="2" /><circle cx="12" cy="17" r="2" /><path d="m8 8.5 3 6M16 8.5l-3 6" /></Icon>
            <span>Objektai</span><b data-type-count></b>
          </button>
          <button type="button" data-popover-toggle="relations" aria-expanded="false">
            <Icon><circle cx="5" cy="12" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><path d="m7 11 10-4M7 13l10 4" /></Icon>
            <span>Ryšiai</span><b data-relation-count></b>
          </button>
          <button type="button" data-popover-toggle="books" aria-expanded="false">
            <Icon><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></Icon>
            <span data-source-summary>Knygos</span>
          </button>
          <button type="button" data-popover-toggle="filters" aria-expanded="false" aria-label="Daugiau filtrų" title="Daugiau filtrų">
            <Icon><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4" /></Icon>
          </button>
          <button type="button" data-panel-toggle aria-label="Rodyti arba slėpti panelį" title="Detalės">
            <Icon><path d="M4 4h7v16H4zM15 5h5M15 12h5M15 19h5" /></Icon>
          </button>
          <button type="button" data-graph-reset aria-label="Atstatyti filtrus" title="Atstatyti filtrus">
            <Icon><path d="M3 12a9 9 0 1 0 3-6.7M3 4v6h6" /></Icon>
          </button>
        </div>

        <div class="graph-explorer-popovers">
          <section class="graph-explorer-popover" data-popover-panel="types" hidden>
            <div class="graph-explorer-popover-header"><strong>Objektų tipai</strong><button type="button" data-popover-close aria-label="Uždaryti">×</button></div>
            <div class="graph-explorer-check-grid" data-type-list></div>
            <label class="graph-explorer-isolated-toggle"><input type="checkbox" name="showIsolated" /> <span>Rodyti nesusietus objektus</span><b data-isolated-count></b></label>
          </section>

          <section class="graph-explorer-popover graph-explorer-relations-popover" data-popover-panel="relations" hidden>
            <div class="graph-explorer-popover-header"><strong>Ryšių tipai</strong><button type="button" data-popover-close aria-label="Uždaryti">×</button></div>
            <div class="graph-explorer-relation-groups" data-relation-groups></div>
          </section>

          <section class="graph-explorer-popover" data-popover-panel="books" hidden>
            <div class="graph-explorer-popover-header"><strong>Knygos</strong><button type="button" data-popover-close aria-label="Uždaryti">×</button></div>
            <input type="search" placeholder="Filtruoti knygas" autocomplete="off" data-source-search />
            <div class="graph-explorer-source-actions"><button type="button" data-source-select-all>Visos</button><button type="button" data-source-clear>Nuimti</button></div>
            <div class="graph-explorer-source-list" data-source-list><p>Kraunamos knygos…</p></div>
          </section>

          <section class="graph-explorer-popover" data-popover-panel="filters" hidden>
            <div class="graph-explorer-popover-header"><strong>Daugiau filtrų</strong><button type="button" data-popover-close aria-label="Uždaryti">×</button></div>
            <div class="graph-explorer-filter-grid">
              <label><span>Min. teiginių</span><input type="number" name="minClaims" min="0" max="500" step="1" /></label>
              <label><span>Min. citatų</span><input type="number" name="minQuotes" min="0" max="500" step="1" /></label>
              <label><span>Min. patikimumas</span><input type="range" name="minConfidence" min="0" max="1" step="0.05" /><output data-confidence-output></output></label>
              <label><span>Kryptis</span><select name="direction"><option value="both">Abi kryptys</option><option value="out">Išeinantys</option><option value="in">Įeinantys</option></select></label>
              <label><span>Nuo</span><input type="number" name="from" placeholder="metai" /></label>
              <label><span>Iki</span><input type="number" name="to" placeholder="metai" /></label>
            </div>
          </section>
        </div>
      </header>

      <section class="graph-explorer-context" data-focus-context hidden>
        <div class="graph-explorer-focus-title"><span>Pasirinkta</span><strong data-focus-title></strong><button type="button" data-clear-focus aria-label="Uždaryti fokusą">×</button></div>
        <fieldset class="graph-explorer-depth-control" aria-label="Ryšių gylis">
          <legend>Gylis</legend>
          <label><input type="radio" name="depth" value="1" /><span>1</span></label>
          <label><input type="radio" name="depth" value="2" /><span>2</span></label>
          <label><input type="radio" name="depth" value="3" /><span>3</span></label>
          <label><input type="radio" name="depth" value="-1" /><span>Visas</span></label>
        </fieldset>
        <div class="graph-explorer-focus-counts">
          <span data-focus-neighbours></span>
          <span data-focus-direct></span>
          <span data-focus-subgraph></span>
        </div>
      </section>

      <section class="graph-explorer-stage">
        <aside class="graph-explorer-panel" data-graph-panel></aside>
        <div class="graph-explorer-canvas" data-graph-canvas>
          <div class="graph-explorer-status" data-graph-status>Kraunamas žemėlapis…</div>
          <button type="button" class="graph-explorer-show-panel" data-panel-show>Rodyti panelį</button>
          <div class="graph-explorer-legend" data-graph-legend></div>
        </div>
      </section>
    </main>
  )

  GraphExplorer.css = style
  GraphExplorer.afterDOMLoaded = script
  return GraphExplorer
}) satisfies QuartzComponentConstructor
