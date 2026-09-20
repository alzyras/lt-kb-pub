import type { ComponentChildren } from "preact"
import type { QuartzComponentProps } from "./types"
import { ObjectPageTabs, type ObjectPageTab } from "./ObjectPageTabs"
import { objectDetailEvidenceFromFile } from "../util/objectDetail"
import { objectPageViewModel } from "../util/objectPageView"
import { objectBibliography } from "../util/objectBibliography"
import {
  cleanText,
  displayCaption,
  objectMediaSet,
} from "../util/objectMedia"
import { graphSlugForPageData } from "../util/graphIdentity"
import { FullSlug, simplifySlug, slugifyFilePath } from "../util/path"
import { objectRelationInputs } from "../util/objectRelations"
import { objectCountLabel, objectTypes } from "../util/objectTypes"

const filesBySlug = new WeakMap<
  QuartzComponentProps["allFiles"],
  Map<string, QuartzComponentProps["fileData"]>
>()
export function objectShellFile(props: QuartzComponentProps) {
  let index = filesBySlug.get(props.allFiles)
  if (!index) {
    index = new Map(props.allFiles.map((file) => [simplifySlug(file.slug!), file]))
    filesBySlug.set(props.allFiles, index)
  }
  const slug = String(props.fileData.frontmatter?.object_slug || props.fileData.slug) as FullSlug
  return index.get(simplifySlug(slug)) || props.fileData
}

export function objectPortrait(frontmatter: Record<string, unknown>, editorialMediaId = "") {
  const media = objectMediaSet(frontmatter as any)
  const editorial = media.all.find((entry) => cleanText(entry.mediaId) === editorialMediaId)
  return (
    media.primary ||
    editorial ||
    media.direct.find((entry) => /portret|atvaizd|graviūr/iu.test(displayCaption(entry))) ||
    media.direct[0]
  )
}

/** The same identity, media catalog and counts on every object route. */
export function ObjectPageShell({
  props,
  active,
  children,
}: {
  props: QuartzComponentProps
  active: ObjectPageTab
  children?: ComponentChildren
}) {
  const file = objectShellFile(props)
  const fm = (file.frontmatter || {}) as Record<string, unknown>
  const slug = file.slug as FullSlug
  const fullTitle = cleanText(fm.canonical_name || fm.pavadinimas || fm.title)
  const parts = fullTitle.match(/^(.+?)\s*\(([^()]+)\)$/u)
  const title = parts?.[1] || fullTitle
  const objectType = objectTypes.find((type) => type.type === cleanText(fm.tipas))
  const evidence = objectDetailEvidenceFromFile(
    String(file.filePath || fm.object_source_path || ""),
  )
  const media = objectMediaSet(fm as any)
  const view = objectPageViewModel(fm, evidence, { gallery: media.all.length })
  view.counts.sources = objectBibliography(props.allFiles, evidence).length + (evidence.authoredSources?.length ?? 0)
  const graphSlug = graphSlugForPageData(file as any, slug)
  const relations = objectRelationInputs(fm, evidence)
  const mapIndex: Record<string, any> = {
    [graphSlug]: { slug: graphSlug, title, type: cleanText(fm.tipas), links: [] },
  }
  const lookup = filesBySlug.get(props.allFiles)!
  for (const row of relations) {
    const target = lookup.get(simplifySlug(slugifyFilePath(row.target.replace(/\.md$/, "") as any)))
    if (target?.slug === slug) continue
    const targetSlug = target
      ? graphSlugForPageData(target as any, target.slug!)
      : row.target.replace(/\.md$/u, "")
    if (targetSlug === graphSlug) continue
    const targetTitle = cleanText(
      target?.frontmatter?.canonical_name ||
        target?.frontmatter?.pavadinimas ||
        target?.frontmatter?.title ||
        row.display ||
        row.target.split("/").at(-1),
    )
    mapIndex[targetSlug] = {
      slug: targetSlug,
      title: targetTitle,
      type: cleanText(target?.frontmatter?.tipas),
      links: [],
    }
    mapIndex[graphSlug].links.push({
      target: targetSlug,
      targetTitle,
      targetType: cleanText(target?.frontmatter?.tipas),
      relationKind: row.label,
      defaultOn: true,
    })
  }
  view.counts.relations = mapIndex[graphSlug].links.length


  mapIndex[graphSlug].totalRelationCount = view.counts.relations

  return (
    <>
      <nav class="object-detail-breadcrumbs" aria-label="Kelias">
        <a href="/">Pradžia</a>
        <span>/</span>
        <a href="/objektai">Objektai</a>
        <span>/</span>
        {objectType && (
          <>
            <a href={`/objektai/${objectType.folder}`}>{objectType.title}</a>
            <span>/</span>
          </>
        )}
        <span class="object-detail-current-crumb">{title}</span>
      </nav>
      <header
        class={`object-detail-intro${title.length > 48 ? " object-detail-intro--long" : ""}`}
        data-object-shell={slug}
        data-object-type={cleanText(fm.tipas)}
      >
        <div class="object-detail-identity">
          <div class="object-detail-identity-copy">
            <p class="object-detail-eyebrow">
              {objectType?.singular ?? cleanText(fm.tipas).replaceAll("_", " ")}
            </p>
            <h1 title={fullTitle}>{title}</h1>
            {parts?.[2] && <p class="object-detail-qualifier">{parts[2]}</p>}
            <p class="object-detail-counts">
              <span>
                <strong>{view.counts.claims}</strong>{" "}
                {objectCountLabel(view.counts.claims, "claims")}
              </span>
              <span>
                <strong>{view.counts.citations + view.counts.mentions}</strong>{" "}
                {objectCountLabel(view.counts.citations + view.counts.mentions, "entries")}
              </span>
              <span>
                <strong>{view.counts.relations}</strong>{" "}
                {objectCountLabel(view.counts.relations, "relations")}
              </span>
            </p>
          </div>
        </div>

      </header>
      <ObjectPageTabs objectSlug={slug} counts={view.counts} active={active} />
      {children}
    </>
  )
}
