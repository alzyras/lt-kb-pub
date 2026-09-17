import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FullSlug, joinSegments, pathToRoot } from "../../util/path"
import { Footer, ObjectEvidencePage } from "../../components"
import { defaultProcessedContent } from "../vfile"
import { write } from "./helpers"
import { sharedPageComponents } from "../../../quartz.layout"
import { PAGE_SIZE, Claim } from "../../components/ObjectEvidencePage"
import { renderToString } from "preact-render-to-string"
import { claimTopics } from "../../util/objectEvidenceFilter"
import { objectBibliography } from "../../util/objectBibliography"
import {
  isObjectDetailSlug,
  objectDetailEvidenceFromFile,
  objectEvidenceClaimItems,
  objectEvidenceIndexFile,
} from "../../util/objectDetail"
import { objectMediaSet } from "../../util/objectMedia"
import { objectPageViewModel } from "../../util/objectPageView"

export const ObjectEvidencePages: QuartzEmitterPlugin = () => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    pageBody: ObjectEvidencePage(),
    beforeBody: [],
    left: [],
    right: [],
    afterBody: [],
    footer: Footer({
      links: { GitHub: "https://github.com/alzyras/lt-kb-pub", Quartz: "https://quartz.jzhao.xyz" },
    }),
  }
  const { head: Head, pageBody, footer: FooterComponent } = opts
  const Body = BodyConstructor()
  return {
    name: "ObjectEvidencePages",
    getQuartzComponents() {
      return [Head, Body, pageBody, FooterComponent]
    },
    async *emit(ctx, content, resources) {
      const cfg = ctx.cfg.configuration
      const allFiles = content.map((item) => item[1].data)
      for (const [_tree, file] of content) {
        const objectSlug = file.data.slug
        if (!isObjectDetailSlug(objectSlug)) continue
        const sourcePath = String(file.data.filePath ?? "")
        const evidence = objectDetailEvidenceFromFile(sourcePath)
        const items = objectEvidenceClaimItems(evidence)
        const bibliography = objectBibliography(allFiles, evidence)
        const sourceIds = new Map(
          bibliography.flatMap((row) => row.aliases.map((alias) => [alias, row.id] as const)),
        )
        const view = objectPageViewModel(
          (file.data.frontmatter ?? {}) as Record<string, unknown>,
          evidence,
          { gallery: objectMediaSet(file.data.frontmatter as any).all.length },
        )
        const count = items.length
        const pages = Math.max(1, Math.ceil(count / PAGE_SIZE))
        const indexSlug =
          `static/object-evidence/${objectEvidenceIndexFile(objectSlug!)}` as FullSlug
        const itemHref = (page: number, anchor: string) => {
          const route = page === 1 ? `${objectSlug}/irodymai` : `${objectSlug}/irodymai/${page}`
          return `/${route}#${anchor}`
        }
        yield write({
          ctx,
          content: JSON.stringify({
            version: 2,
            items: items.map((item, position) => {
              const page = Math.floor(position / PAGE_SIZE) + 1
              return {
                kind: "claim",
                id: item.value.id,
                text: item.value.text,
                sources: item.value.sourceTitles,
                sourceIds: item.value.sourceTitles.map((title) => sourceIds.get(title) || title),
                topics: claimTopics(
                  file.data.frontmatter as Record<string, unknown>,
                  item.value.id,
                  item.value.globalIds,
                ),
                origin: "internal",
                rank: view.featuredClaimIds.includes(item.value.id)
                  ? 6 - view.featuredClaimIds.indexOf(item.value.id)
                  : 0,
                html: renderToString(
                  <Claim
                    claim={item.value}
                    context={String(file.data.frontmatter?.title ?? "")}
                    topics={claimTopics(
                      file.data.frontmatter as Record<string, unknown>,
                      item.value.id,
                      item.value.globalIds,
                    )}
                  />,
                ),
                href: itemHref(page, `claim-${item.value.id}`),
              }
            }),
          }),
          slug: indexSlug,
          ext: ".json",
        })
        for (let page = 1; page <= pages; page += 1) {
          const slug = (
            page === 1
              ? joinSegments(objectSlug!, "irodymai")
              : joinSegments(objectSlug!, "irodymai", String(page))
          ) as FullSlug
          const objectTitle = String(file.data.frontmatter?.title ?? "Istorijos objektas")
          const [tree, vfile] = defaultProcessedContent({
            slug,
            text: objectTitle,
            description: `${objectTitle}: visi šaltiniais pagrįsti teiginiai ir citatos.`,
            frontmatter: {
              title: `${objectTitle}: visi teiginiai ir įrodymai`,
              noindex: true,
              tipas: file.data.frontmatter?.tipas,
              object_slug: objectSlug,
              object_title: objectTitle,
              object_source_path: sourcePath,
              object_evidence_page: page,
              object_evidence_index: `/${indexSlug}.json`,
              object_page_counts_json: JSON.stringify({ counts: view.counts }),
            },
          })
          const externalResources = pageResources(pathToRoot(slug), resources)
          const componentData: QuartzComponentProps = {
            ctx,
            fileData: vfile.data,
            externalResources,
            cfg,
            children: [],
            tree,
            allFiles,
          }
          yield write({
            ctx,
            content: renderPage(cfg, slug, componentData, opts, externalResources),
            slug,
            ext: ".html",
          })
        }
      }
    },
  }
}
