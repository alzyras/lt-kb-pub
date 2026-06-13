import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FullSlug, pathToRoot } from "../../util/path"
import { sharedPageComponents } from "../../../quartz.layout"
import { GraphExplorer } from "../../components"
import { defaultProcessedContent } from "../vfile"
import { write } from "./helpers"

export const GraphExplorerPage: QuartzEmitterPlugin = () => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    pageBody: GraphExplorer(),
    beforeBody: [],
    left: [],
    right: [],
    header: [],
  }

  const { head: Head, pageBody, footer: Footer } = opts
  const Body = BodyConstructor()

  return {
    name: "GraphExplorerPage",
    getQuartzComponents() {
      return [Head, Body, pageBody, Footer]
    },
    async *emit(ctx, _content, resources) {
      const cfg = ctx.cfg.configuration
      const slug = "zemelapis/index" as FullSlug
      const title = "Žemėlapis"
      const [tree, vfile] = defaultProcessedContent({
        slug,
        text: title,
        description: "Viso ekrano Lietuvos istorijos objektų ryšių žemėlapis.",
        frontmatter: { title, tags: ["zemelapis"] },
      })
      const externalResources = pageResources(pathToRoot(slug), resources)
      const componentData: QuartzComponentProps = {
        ctx,
        fileData: vfile.data,
        externalResources,
        cfg,
        children: [],
        tree,
        allFiles: [],
      }

      yield write({
        ctx,
        content: renderPage(cfg, slug, componentData, opts, externalResources),
        slug,
        ext: ".html",
      })
    },
    async *partialEmit() {},
  }
}
