import { uniqueCitations } from "../util/objectDetail"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-preact"
import {
  citationQuoteForClaim,
  objectDetailEvidenceFromFile,
  objectEvidenceClaimItems,
  type ObjectEvidenceClaim,
} from "../util/objectDetail"
import { FullSlug } from "../util/path"
import { cleanText } from "../util/objectMedia"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { ObjectPageShell } from "./ObjectPageShell"
// @ts-ignore
import mapScript from "./scripts/object-map-preview.inline"
// @ts-ignore
import tabsScript from "./scripts/object-detail-tabs.inline"
// @ts-ignore
import lazyScript from "./scripts/object-evidence-lazy.inline"
import { objectPageViewModel } from "../util/objectPageView"
import style from "./styles/objectDetail.scss"

const PAGE_SIZE = 50

export function Claim({
  claim,
  topics = [],
  context = "",
}: {
  claim: ObjectEvidenceClaim
  topics?: string[]
  context?: string
}) {
  return (
    <article class="object-claim-card" data-evidence-kind="claim" id={`claim-${claim.id}`}>
      {claim.globalIds
        ?.filter((id) => id !== claim.id)
        .map((id) => (
          <span id={`claim-${id}`} class="object-claim-anchor" />
        ))}
      <div class="object-claim-card-header">
        <a class="object-claim-id" href={`#claim-${claim.id}`}>
          {claim.id}
        </a>
        {claim.reliability && <span class="object-claim-reliability">{claim.reliability}</span>}
      </div>
      <p>{claim.text}</p>
      {topics.length > 0 && (
        <p class="object-claim-topics">
          {topics.map((topic) => (
            <span>{topic.replaceAll("-", " ")}</span>
          ))}
        </p>
      )}
      {uniqueCitations(claim.citations).map((citation) => {
        const source = cleanText(citation.fields.get("šaltinis") || citation.fields.get("saltinis"))
        const quote = citationQuoteForClaim(citation, claim.text, context, Number.MAX_SAFE_INTEGER)
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

const ObjectEvidencePage: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData } = props
  const frontmatter = (fileData.frontmatter ?? {}) as Record<string, unknown>
  const objectSlug = String(frontmatter.object_slug ?? "") as FullSlug
  const sourcePath = String(frontmatter.object_source_path ?? "")
  const page = Math.max(1, Number(frontmatter.object_evidence_page ?? 1) || 1)
  const evidence = objectDetailEvidenceFromFile(sourcePath)
  const items = objectEvidenceClaimItems(evidence)
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const displayed = items.slice(start, start + PAGE_SIZE)
  const view = objectPageViewModel(frontmatter, evidence)
  const pagePath = (pageNumber: number) =>
    pageNumber === 1 ? `${objectSlug}/irodymai` : `${objectSlug}/irodymai/${pageNumber}`
  const pageUrl = (pageNumber: number) => `/${pagePath(pageNumber).replace(/^\/+|\/+$/g, "")}`

  return (
    <main
      class="object-detail-page object-evidence-page"
      data-object-evidence-page="true"
      data-object-evidence-index={String(frontmatter.object_evidence_index ?? "")}
      data-object-evidence-start={String(start)}
      data-object-evidence-loaded={String(start + displayed.length)}
    >
      <ObjectPageShell props={props} active="evidence" />
      <header class="object-evidence-header">
        <p class="object-detail-eyebrow">Šaltiniai ir citatos</p>
        <h2>Teiginiai ir įrodymai</h2>
        <p>
          Visi {view.counts.claims} objekto teiginiai. Su kiekvienu teiginiu susietos citatos ir
          šaltiniai atveriami pačiame teiginyje.
        </p>
        <a href={`/${String(objectSlug).replace(/^\/+|\/+$/g, "")}`}>
          <ArrowLeft size={16} /> Grįžti į objekto apžvalgą
        </a>
      </header>
      {displayed.length > 0 ? (
        <section class="object-detail-evidence" aria-label="Visi teiginiai">
          <p
            class="object-evidence-count"
            data-object-evidence-count="true"
            data-total={items.length}
            data-start={start + 1}
          >
            {start + 1}–{start + displayed.length} iš {items.length} teiginių
          </p>
          <div class="object-detail-claims">
            {displayed.map((item) => (
              <Claim claim={item.value} context={cleanText(frontmatter.object_title)} />
            ))}
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
                  Rodyti daugiau (dar {items.length - (start + displayed.length)} teiginių)
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
        <p class="object-evidence-empty">Šiam objektui dar nėra teiginių.</p>
      )}
    </main>
  )
}

ObjectEvidencePage.css = `${style}
.object-evidence-header { width: 100%; max-width: 62rem; box-sizing: border-box; padding: clamp(1rem, 2.5vw, 1.65rem); border-top: 4px solid var(--secondary); border-bottom: 1px solid var(--object-rule); background: var(--object-wash); }
.object-evidence-header h1 { max-width: 24ch; margin: 0; font-size: clamp(1.85rem, 3.5vw, 3.15rem); line-height: .98; letter-spacing: -.05em; }
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
`
ObjectEvidencePage.afterDOMLoaded = `${mapScript}\n${tabsScript}\n${lazyScript}`

export default (() => ObjectEvidencePage) satisfies QuartzComponentConstructor
export { PAGE_SIZE }
