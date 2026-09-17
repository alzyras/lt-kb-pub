import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-preact"
import { FullSlug } from "../util/path"
import { objectDetailEvidenceFromFile, type ObjectDetailEvidence } from "../util/objectDetail"
import {
  objectRelationGroups,
  objectRelationInputs,
  PAGE_LINKS_GROUP_LABEL,
  type ObjectRelationGroup,
  type ObjectRelationTarget,
} from "../util/objectRelations"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { ObjectPageShell, objectShellFile } from "./ObjectPageShell"
// @ts-ignore Quartz bundles inline lifecycle scripts as strings.
import mapScript from "./scripts/object-map-preview.inline"
// @ts-ignore
import tabsScript from "./scripts/object-detail-tabs.inline"
// @ts-ignore
import lazyScript from "./scripts/object-relations-lazy.inline"
import style from "./styles/objectDetail.scss"

/** Number of predicate groups rendered before the optional lazy continuation. */
export const RELATIONS_PAGE_SIZE = 50

export type ObjectRelationGroupItem = {
  id: string
  label: string
  targets: ObjectRelationTarget[]
  kind: "relation" | "page-links"
}

export function objectRelationGroupItems(
  frontmatter: Record<string, unknown>,
  evidence: ObjectDetailEvidence,
  allFiles: QuartzComponentProps["allFiles"],
): ObjectRelationGroupItem[] {
  return objectRelationGroups(objectRelationInputs(frontmatter, evidence), allFiles, {
    dedupe: false,
  }).map((group: ObjectRelationGroup, index) => ({
    id: `${index + 1}:${group.label}`,
    label: group.label,
    targets: group.targets,
    kind: group.label === PAGE_LINKS_GROUP_LABEL ? "page-links" : "relation",
  }))
}

export function RelationGroupCard({ group }: { group: ObjectRelationGroupItem }) {
  const pageLinks = group.kind === "page-links"
  return (
    <article
      class={`object-relation-group${pageLinks ? " object-relation-page-links-group" : ""}`}
      data-relation-group-id={group.id}
      data-relation-group-kind={group.kind}
    >
      <div class="object-relation-group-heading">
        {pageLinks && <p class="object-relation-page-links-kicker">Atskira grupė</p>}
        <h3 class="object-relation-group-predicate">
          {pageLinks ? "Puslapių nuorodos" : group.label.replace(/\s*\([^)]*\)/g, "")}:
        </h3>
      </div>
      <div class="object-relation-group-targets">
        {group.targets.map((target, index) => (
          <span class="object-relation-group-target">
            {index > 0 && <span aria-hidden="true"> · </span>}
            {target.linked ? (
              <a
                href={`/${String(target.slug).replace(/^\/+|\/+$/g, "")}`}
                title={target.label !== target.title ? target.label : undefined}
              >
                {target.title}
              </a>
            ) : (
              <span class="object-detail-relation-unresolved" title={target.label}>
                {target.title}
              </span>
            )}
          </span>
        ))}
      </div>
    </article>
  )
}

const ObjectRelationsPage: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, allFiles } = props
  const objectFile = objectShellFile(props)
  const objectSlug = objectFile.slug as FullSlug
  const objectFrontmatter = (objectFile.frontmatter ?? {}) as Record<string, unknown>
  const evidence = objectDetailEvidenceFromFile(String(objectFile.filePath ?? ""))
  const groups = objectRelationGroupItems(objectFrontmatter, evidence, allFiles)
  const page = Math.max(1, Number(fileData.frontmatter?.object_relations_page ?? 1) || 1)
  const pages = Math.max(1, Math.ceil(groups.length / RELATIONS_PAGE_SIZE))
  const start = (page - 1) * RELATIONS_PAGE_SIZE
  const displayed = groups.slice(start, start + RELATIONS_PAGE_SIZE)
  const pagePath = (pageNumber: number) =>
    pageNumber === 1 ? `${objectSlug}/rysiai` : `${objectSlug}/rysiai/${pageNumber}`
  const pageUrl = (pageNumber: number) => `/${pagePath(pageNumber).replace(/^\/+|\/+$/g, "")}`
  const total = groups.reduce((count, group) => count + group.targets.length, 0)

  return (
    <main
      class="object-detail-page object-relations-page"
      data-object-relations-page="true"
      data-object-relations-index={String(fileData.frontmatter?.object_relations_index ?? "")}
      data-object-relations-start={String(start)}
      data-object-relations-loaded={String(start + displayed.length)}
    >
      <ObjectPageShell props={props} active="relations" />
      <header class="object-relations-header">
        <p class="object-detail-eyebrow">Objekto struktūra</p>
        <h2>Visi ryšiai</h2>
        <p>
          Visi objekto ryšiai abiem kryptimis, sugrupuoti pagal jų reikšmę. Nuorodos į kitus
          puslapius pateikiamos atskiroje grupėje.
        </p>
        <a href={`/${String(objectSlug).replace(/^\/+|\/+$/g, "")}`}>
          <ArrowLeft size={16} /> Grįžti į objekto apžvalgą
        </a>
      </header>
      {displayed.length > 0 ? (
        <section class="object-detail-relations object-relations-stream" aria-label="Visi ryšiai">
          <p class="object-relations-count" data-object-relations-count="true" data-total={total}>
            Iš viso {total} ryšiai · {groups.length} grupių
          </p>
          <div class="object-relations-list">
            {displayed.map((group) => (
              <RelationGroupCard group={group} />
            ))}
          </div>
          {pages > 1 && (
            <>
              {page < pages && (
                <button
                  type="button"
                  class="object-relations-load-more"
                  data-object-relations-load-more="true"
                  data-total={total}
                  data-start={start}
                  data-next-url={pageUrl(page + 1)}
                >
                  Rodyti daugiau grupių (dar {groups.length - (start + displayed.length)})
                </button>
              )}
              <nav class="object-relations-pagination" aria-label="Ryšių puslapiai">
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
        <p class="object-relations-empty">Šiam objektui dar nėra viešai publikuotinų ryšių.</p>
      )}
    </main>
  )
}

ObjectRelationsPage.css = `${style}
.object-relations-header { width: 100%; max-width: 62rem; box-sizing: border-box; padding: clamp(1rem, 2.5vw, 1.65rem); border-top: 4px solid var(--secondary); border-bottom: 1px solid var(--object-rule); background: var(--object-wash); }
.object-relations-header h1 { max-width: 24ch; margin: 0; font-size: clamp(1.85rem, 3.5vw, 3.15rem); line-height: .98; letter-spacing: -.05em; }
.object-relations-header > p:not(.object-detail-eyebrow) { max-width: 45rem; line-height: 1.55; }
.object-relations-header > a { display: inline-flex; align-items: center; gap: .35rem; font-weight: 800; }
.object-relations-count { color: var(--gray); font-size: .9rem; }
.object-relations-list { display: grid; gap: .35rem; }
.object-relation-group { display: grid; grid-template-columns: minmax(13rem, .35fr) minmax(0, 1fr); gap: .35rem 1rem; align-items: baseline; padding: .85rem 1rem; border: 1px solid var(--object-rule); background: var(--object-wash); }
.object-relation-group-heading { min-width: 0; }
.object-relation-page-links-group { margin-top: 1.35rem; border-top: 3px solid var(--secondary); background: color-mix(in srgb, var(--secondary) 5%, var(--object-wash)); }
.object-relation-page-links-kicker { margin: 0 0 .25rem; color: var(--secondary); font: 700 .68rem var(--codeFont); letter-spacing: .08em; text-transform: uppercase; }
.object-relation-group-predicate { margin: 0; color: var(--gray); font: 800 .76rem var(--codeFont); letter-spacing: .04em; text-transform: uppercase; }
.object-relation-page-links-group .object-relation-group-predicate { color: var(--secondary); }
.object-relation-group-targets { line-height: 1.55; }
.object-relation-group-target a { font-weight: 800; }
.object-relations-pagination { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem; margin-top: 1.4rem; }
.object-relations-pagination a { display: inline-flex; align-items: center; gap: .25rem; font-weight: 800; }
.object-relations-pagination a:last-child { justify-self: end; }
.object-relations-pagination > span { color: var(--gray); font-size: .9rem; }
.object-relations-load-more { display: flex; width: 100%; justify-content: center; margin-top: 1.4rem; padding: .75rem 1rem; border: 1px solid var(--object-rule); background: var(--object-wash); color: var(--dark); cursor: pointer; font: 800 .82rem var(--codeFont); letter-spacing: .04em; }
.object-relations-load-more:hover, .object-relations-load-more:focus-visible { border-color: var(--secondary); background: var(--secondary); color: var(--light); }
.object-relations-load-more:disabled { cursor: wait; opacity: .68; }
[data-object-relations-lazy-ready="true"] .object-relations-pagination { display: none; }
.object-relations-empty { max-width: 44rem; padding: 1rem; border-left: 4px solid var(--secondary); background: var(--object-wash); }
@media (max-width: 38rem) { .object-relation-group { grid-template-columns: 1fr; } }
`
ObjectRelationsPage.afterDOMLoaded = `${mapScript}\n${tabsScript}\n${lazyScript}`

export default (() => ObjectRelationsPage) satisfies QuartzComponentConstructor
