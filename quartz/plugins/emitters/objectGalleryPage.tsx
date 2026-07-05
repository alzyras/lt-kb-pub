import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FullSlug, pathToRoot } from "../../util/path"
import { sharedPageComponents } from "../../../quartz.layout"
import { ObjectMediaGallery } from "../../components"
import { defaultProcessedContent } from "../vfile"
import { write } from "./helpers"
import { cleanText, isObjectPage, objectGallerySlug, objectMediaSet } from "../../util/objectMedia"

export const ObjectGalleryPage: QuartzEmitterPlugin = () => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    pageBody: ObjectMediaGallery(),
    beforeBody: [],
    left: [],
    right: [],
    header: [],
    afterBody: [],
  }

  const { head: Head, pageBody, footer: Footer } = opts
  const Body = BodyConstructor()

  return {
    name: "ObjectGalleryPage",
    getQuartzComponents() {
      return [Head, Body, pageBody, Footer]
    },
    async *emit(ctx, content, resources) {
      const cfg = ctx.cfg.configuration
      const allFiles = content.map((c) => c[1].data)

      for (const [_tree, file] of content) {
        const rawObjectSlug = file.data.slug
        if (!rawObjectSlug || !isObjectPage(rawObjectSlug) || rawObjectSlug.endsWith("/galerija")) continue
        const objectSlug = rawObjectSlug as FullSlug

        const media = objectMediaSet(file.data.frontmatter)
        if (!media.fallbackPrimary || media.all.length === 0) continue

        const objectTitle = cleanText(file.data.frontmatter?.title) || objectSlug.split("/").at(-1) || "objektas"
        const slug = objectGallerySlug(objectSlug)
        const [tree, vfile] = defaultProcessedContent({
          slug,
          text: `Galerija (${objectTitle})`,
          description: `Objekto ${objectTitle} atvaizdų galerija.`,
          frontmatter: {
            ...file.data.frontmatter,
            title: `Galerija (${objectTitle})`,
            object_title: objectTitle,
            object_slug: objectSlug,
            object_gallery_page: true,
            tags: ["galerija"],
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
    },
    async *partialEmit() {},
  }
}
