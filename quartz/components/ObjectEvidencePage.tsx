import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-preact"
import {
  citationQuote,
  objectDetailEvidenceFromFile,
  objectEvidenceDisplayItems,
  type ObjectEvidenceCitation,
  type ObjectEvidenceClaim,
} from "../util/objectDetail"
import { FullSlug, resolveRelative } from "../util/path"
import { cleanText } from "../util/objectMedia"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { ObjectPageTabs } from "./ObjectPageTabs"
import { objectPageViewModel } from "../util/objectPageView"
import style from "./styles/objectDetail.scss"
// @ts-ignore
import evidenceSearchScript from "./scripts/object-evidence-search.inline"

const PAGE_SIZE = 50

function title(frontmatter: Record<string, unknown>): string {
  return (
    cleanText(frontmatter.object_title || frontmatter.pavadinimas || frontmatter.title) ||
    "Istorijos objektas"
  )
}

function Claim({ claim }: { claim: ObjectEvidenceClaim }) {
  return (
    <article class="object-claim-card" data-evidence-kind="claim" id={`claim-${claim.id}`}>
      <div class="object-claim-card-header">
        <a class="object-claim-id" href={`#claim-${claim.id}`}>
          {claim.id}
        </a>
        {claim.reliability && <span class="object-claim-reliability">{claim.reliability}</span>}
      </div>
      <p>{claim.text}</p>
      {claim.citations.map((citation) => {
        const source = cleanText(citation.fields.get("šaltinis") || citation.fields.get("saltinis"))
        const quote = citationQuote(citation, 900)
        const pages = cleanText(citation.fields.get("puslapiai") || citation.fields.get("indeksas"))
        return (
          <details class="object-evidence-citation" data-citation-id={citation.id}>
            <summary>{source || "Atverti citatą"}</summary>
            {pages && <p class="object-claim-source">{pages}</p>}
            {quote ? (
              <blockquote>{quote}</blockquote>
            ) : (
              <p class="object-claim-source">Citatos tekstas nepasiekiamas.</p>
            )}
          </details>
        )
      })}
      {claim.citations.length === 0 && (
        <p class="object-claim-source">Šiam teiginiui atskira vieša citata dar nesusieta.</p>
      )}
    </article>
  )
}

function CitationRecord({ record }: { record: ObjectEvidenceCitation }) {
  const source = cleanText(
    record.entry.fields.get("šaltinis") || record.entry.fields.get("saltinis"),
  )
  const quote = citationQuote(record.entry, 900)
  const pages = cleanText(
    record.entry.fields.get("puslapiai") || record.entry.fields.get("indeksas"),
  )
  const anchor = `citation-${record.section}-${record.id}`
  return (
    <article
      class="object-claim-card object-standalone-citation"
      data-evidence-kind={record.significantMention ? "mention" : "citation"}
      id={anchor}
    >
      <div class="object-claim-card-header">
        <a class="object-claim-id" href={`#${anchor}`}>
          {record.id}
        </a>
        <span class="object-claim-reliability">{record.section}</span>
      </div>
      {source && <p class="object-claim-source">Šaltinis: {source}</p>}
      {pages && <p class="object-claim-source">{pages}</p>}
      {record.id.startsWith("t-") ? (
        <p class="object-claim-source">Susietas teiginys: {record.id}</p>
      ) : quote ? (
        <blockquote>{quote}</blockquote>
      ) : (
        <p class="object-claim-source">Citatos tekstas nepasiekiamas.</p>
      )}
      {record.linkedClaimIds.length > 0 && (
        <p class="object-claim-source">Susieti teiginiai: {record.linkedClaimIds.join(", ")}</p>
      )}
    </article>
  )
}

const ObjectEvidencePage: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const frontmatter = (fileData.frontmatter ?? {}) as Record<string, unknown>
  const objectSlug = String(frontmatter.object_slug ?? "") as FullSlug
  const sourcePath = String(frontmatter.object_source_path ?? "")
  const page = Math.max(1, Number(frontmatter.object_evidence_page ?? 1) || 1)
  const evidence = objectDetailEvidenceFromFile(sourcePath)
  const items = objectEvidenceDisplayItems(evidence)
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const displayed = items.slice(start, start + PAGE_SIZE)
  const titleValue = title(frontmatter)
  const currentSlug = fileData.slug as FullSlug
  const view = objectPageViewModel(frontmatter, evidence)
  const pagePath = (pageNumber: number) =>
    pageNumber === 1 ? `${objectSlug}/irodymai` : `${objectSlug}/irodymai/${pageNumber}`
  const pageUrl = (pageNumber: number) =>
    resolveRelative(currentSlug, pagePath(pageNumber) as FullSlug)

  return (
    <main class="object-detail-page object-evidence-page" data-object-evidence-page="true">
      <nav class="object-detail-breadcrumbs" aria-label="Kelias">
        <a href="/">Pradžia</a>
        <span aria-hidden="true">/</span>
        <a href={resolveRelative(currentSlug, objectSlug)}>{titleValue}</a>
        <span aria-hidden="true">/</span>
        <span>Visi įrodymai</span>
      </nav>
      <ObjectPageTabs
        currentSlug={currentSlug}
        objectSlug={objectSlug}
        counts={view.counts}
        active="evidence"
      />
      <header class="object-evidence-header">
        <p class="object-detail-eyebrow">Šaltiniai ir citatos</p>
        <h1>{titleValue}: visi teiginiai ir įrodymai</h1>
        <p>
          Rodomi visi {view.counts.claims} teiginiai ir visi{" "}
          {view.counts.citations + view.counts.mentions} citatų bei paminėjimų įrašai. Su teiginiais
          susietos citatos atveriamos prie teiginio; atskiros citatos ir reikšmingi paminėjimai
          rodomi savarankiškai.
        </p>
        <a href={resolveRelative(currentSlug, objectSlug)}>
          <ArrowLeft size={16} /> Grįžti į objekto apžvalgą
        </a>
      </header>
      <section
        class="object-evidence-search"
        data-object-evidence-search="true"
        data-object-evidence-index={String(frontmatter.object_evidence_index ?? "")}
        aria-label="Ieškoti visuose objekto teiginiuose"
      >
        <label>
          Ieškoti visuose teiginiuose, citatose ir paminėjimuose
          <input
            type="search"
            placeholder="Įveskite žodį, vardą ar šaltinį"
            data-object-evidence-query=""
          />
        </label>
        <div data-object-evidence-results="" aria-live="polite" />
      </section>
      <nav
        class="object-evidence-subfilters"
        aria-label="Įrodymų rūšys"
        data-object-evidence-filters
      >
        <button type="button" data-evidence-filter="all" aria-pressed="true">
          Visi
        </button>
        <button type="button" data-evidence-filter="claim">
          Teiginiai ({view.counts.claims})
        </button>
        <button type="button" data-evidence-filter="citation">
          Atskiros citatos ({view.counts.citations})
        </button>
        <button type="button" data-evidence-filter="mention">
          Reikšmingi paminėjimai ({view.counts.mentions})
        </button>
      </nav>
      {displayed.length > 0 ? (
        <section class="object-detail-evidence" aria-label="Teiginiai ir citatos">
          <p
            class="object-evidence-count"
            data-object-evidence-count="true"
            data-total={items.length}
            data-start={start + 1}
          >
            {start + 1}–{start + displayed.length} iš {items.length} rodomų įrašų
          </p>
          <div class="object-detail-claims">
            {displayed.map((item) =>
              item.kind === "claim" ? (
                <Claim claim={item.value} />
              ) : (
                <CitationRecord record={item.value} />
              ),
            )}
          </div>
          {pages > 1 && (
            <>
              {page < pages && (
                <button
                  type="button"
                  class="object-evidence-load-more"
                  data-object-evidence-load-more="true"
                  data-next-url={`/${pagePath(page + 1)}`}
                  data-total={items.length}
                  data-start={start + 1}
                >
                  Rodyti daugiau (dar {items.length - (start + displayed.length)})
                </button>
              )}
              <nav class="object-evidence-pagination" aria-label="Teiginių puslapiai">
                {page > 1 ? (
                  <a href={pageUrl(page - 1)}>
                    <ChevronLeft size={16} /> Ankstesni
                  </a>
                ) : (
                  <span />
                )}
                <span>
                  {page} / {pages}
                </span>
                {page < pages ? (
                  <a href={pageUrl(page + 1)}>
                    Kiti <ChevronRight size={16} />
                  </a>
                ) : (
                  <span />
                )}
              </nav>
            </>
          )}
        </section>
      ) : (
        <p class="object-evidence-empty">
          Šiam objektui dar nėra viešai rodomų, citatomis paremtų teiginių.
        </p>
      )}
    </main>
  )
}

ObjectEvidencePage.css = `${style}
.object-evidence-header { max-width: 56rem; padding: clamp(1.3rem, 4vw, 3rem); border-top: 5px solid var(--secondary); background: var(--object-wash); }
.object-evidence-header h1 { max-width: 18ch; margin: 0; font-size: clamp(2rem, 5vw, 4.1rem); line-height: .98; letter-spacing: -.05em; }
.object-evidence-header > p:not(.object-detail-eyebrow) { max-width: 45rem; line-height: 1.55; }
.object-evidence-header > a { display: inline-flex; align-items: center; gap: .35rem; font-weight: 800; }
.object-evidence-count { color: var(--gray); font-size: .9rem; }
.object-evidence-citation { margin-top: .7rem; }
.object-evidence-citation summary { cursor: pointer; color: var(--secondary); font-size: .88rem; font-weight: 800; }
.object-evidence-pagination { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem; margin-top: 1.4rem; }
.object-evidence-pagination a { display: inline-flex; align-items: center; gap: .25rem; font-weight: 800; }
.object-evidence-pagination a:last-child { justify-self: end; }
.object-evidence-pagination > span { color: var(--gray); font-size: .9rem; }
.object-evidence-load-more { display: flex; width: 100%; justify-content: center; margin-top: 1.4rem; padding: .75rem 1rem; border: 1px solid var(--object-rule); background: var(--object-wash); color: var(--dark); cursor: pointer; font: 800 .82rem var(--codeFont); letter-spacing: .04em; }
.object-evidence-load-more:hover, .object-evidence-load-more:focus-visible { border-color: var(--secondary); background: var(--secondary); color: var(--light); }
.object-evidence-load-more:disabled { cursor: wait; opacity: .68; }
[data-object-evidence-lazy-ready="true"] .object-evidence-pagination { display: none; }
.object-evidence-empty { max-width: 44rem; padding: 1rem; border-left: 4px solid var(--secondary); background: var(--object-wash); }
.object-standalone-citation blockquote { margin: .7rem 0 0; }
.object-evidence-search { max-width: 56rem; margin-top: 1rem; padding: 1rem; border: 1px solid var(--object-rule); background: var(--object-wash); }
.object-evidence-search label { display: grid; gap: .4rem; color: var(--dark); font-size: .88rem; font-weight: 800; }
.object-evidence-search input { width: 100%; min-height: 2.5rem; box-sizing: border-box; padding: .45rem .6rem; border: 1px solid var(--object-rule); font: inherit; }
.object-evidence-search [data-object-evidence-results] { display: grid; gap: .35rem; margin-top: .8rem; }
.object-evidence-search [data-object-evidence-results] a { color: var(--darkgray); font-size: .88rem; line-height: 1.35; }
.object-evidence-search [data-object-evidence-results] small { color: var(--gray); font-family: var(--codeFont); font-size: .7rem; text-transform: uppercase; }
`
ObjectEvidencePage.afterDOMLoaded = evidenceSearchScript

export default (() => ObjectEvidencePage) satisfies QuartzComponentConstructor
export { PAGE_SIZE }
