import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FullSlug, joinSegments, pathToRoot } from "../../util/path"
import { Footer, ObjectRelationsPage, RelationGroupCard } from "../../components"
import { defaultProcessedContent } from "../vfile"
import { write } from "./helpers"
import { sharedPageComponents } from "../../../quartz.layout"
import { objectDetailEvidenceFromFile } from "../../util/objectDetail"
import { objectRelationIndexFile } from "../../util/objectRelations"
import {
  objectRelationGroupItems,
  RELATIONS_PAGE_SIZE,
  type ObjectRelationGroupItem,
} from "../../components/ObjectRelationsPage"
import { renderToString } from "preact-render-to-string"

export const ObjectRelationsPages: QuartzEmitterPlugin = () => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    pageBody: ObjectRelationsPage(),
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
    name: "ObjectRelationsPages",
    getQuartzComponents() {
      return [Head, Body, pageBody, FooterComponent]
    },
    async *emit(ctx, content, resources) {
      const cfg = ctx.cfg.configuration
      const allFiles = content.map((item) => item[1].data)
      for (const [_tree, file] of content) {
        const objectSlug = file.data.slug
        if (!objectSlug || !objectSlug.startsWith("objektai/")) continue
        if (objectSlug.split("/").length !== 3) continue
        const sourcePath = String(file.data.filePath ?? "")
        const frontmatter = (file.data.frontmatter ?? {}) as Record<string, unknown>
        const evidence = objectDetailEvidenceFromFile(sourcePath)
        const groups = objectRelationGroupItems(frontmatter, evidence, allFiles)
        const indexSlug =
          `static/object-relations/${objectRelationIndexFile(objectSlug)}` as FullSlug
        const objectTitle = String(frontmatter.title ?? "Istorijos objektas")
        const total = groups.reduce((count, group) => count + group.targets.length, 0)
        const indexItems = groups.map((group: ObjectRelationGroupItem) => ({
          id: group.id,
          label: group.label,
          relationCount: group.targets.length,
          html: renderToString(<RelationGroupCard group={group} />),
        }))
        yield write({
          ctx,
          content: JSON.stringify({
            version: 2,
            relationCount: total,
            items: indexItems,
          }),
          slug: indexSlug,
          ext: ".json",
        })

        const pages = Math.max(1, Math.ceil(groups.length / RELATIONS_PAGE_SIZE))
        for (let page = 1; page <= pages; page += 1) {
          const slug = (
            page === 1
              ? joinSegments(objectSlug, "rysiai")
              : joinSegments(objectSlug, "rysiai", String(page))
          ) as FullSlug
          const [tree, vfile] = defaultProcessedContent({
            slug,
            text: objectTitle,
            description: `${objectTitle}: visi viešai patvirtinti struktūruoti ryšiai.`,
            frontmatter: {
              title: `${objectTitle}: visi ryšiai`,
              description: `${objectTitle}: visi viešai patvirtinti struktūruoti ryšiai.`,
              noindex: true,
              tipas: frontmatter.tipas,
              object_slug: objectSlug,
              object_title: objectTitle,
              object_source_path: sourcePath,
              object_relations_page: page,
              object_relations_index: `/${indexSlug}.json`,
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
