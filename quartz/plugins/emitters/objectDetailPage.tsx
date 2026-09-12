import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { pathToRoot } from "../../util/path"
import { sharedPageComponents } from "../../../quartz.layout"
import { Explorer, Footer, ObjectDetailPage, PageTitle } from "../../components"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"
import { Node } from "unist"
import { StaticResources } from "../../util/resources"
import { QuartzPluginData } from "../vfile"
import { isObjectDetailSlug } from "../../util/objectDetail"

async function processObjectDetail(
  ctx: BuildCtx,
  tree: Node,
  fileData: QuartzPluginData,
  allFiles: QuartzPluginData[],
  opts: FullPageLayout,
  resources: StaticResources,
) {
  const slug = fileData.slug!
  const cfg = ctx.cfg.configuration
  const externalResources = pageResources(pathToRoot(slug), resources)
  const componentData: QuartzComponentProps = {
    ctx,
    fileData,
    externalResources,
    cfg,
    children: [],
    tree,
    allFiles,
  }
  return write({
    ctx,
    content: renderPage(cfg, slug, componentData, opts, externalResources),
    slug,
    ext: ".html",
  })
}

/** Emits only canonical /objektai/{type}/{slug}/ pages. Generic content pages are untouched. */
export const ObjectDetailPages: QuartzEmitterPlugin = () => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    pageBody: ObjectDetailPage(),
    beforeBody: [],
    left: [PageTitle(), Explorer()],
    right: [],
    afterBody: [],
    footer: Footer({
      links: {
        GitHub: "https://github.com/alzyras/lt-kb-pub",
        Quartz: "https://quartz.jzhao.xyz",
      },
    }),
  }
  const { head: Head, header, pageBody, left, right, footer: FooterComponent } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "ObjectDetailPages",
    getQuartzComponents() {
      return [Head, Header, Body, ...header, pageBody, ...left, ...right, FooterComponent]
    },
    async *emit(ctx, content, resources) {
      const allFiles = content.map((item) => item[1].data)
      for (const [tree, file] of content) {
        if (!isObjectDetailSlug(file.data.slug)) continue
        yield await processObjectDetail(ctx, tree, file.data, allFiles, opts, resources)
      }
    },
    async *partialEmit(ctx, content, resources, changeEvents) {
      const allFiles = content.map((item) => item[1].data)
      const changed = new Set<string>()
      for (const event of changeEvents) {
        if (event.file && (event.type === "add" || event.type === "change")) {
          changed.add(event.file.data.slug!)
        }
      }
      for (const [tree, file] of content) {
        if (!changed.has(file.data.slug!) || !isObjectDetailSlug(file.data.slug)) continue
        yield await processObjectDetail(ctx, tree, file.data, allFiles, opts, resources)
      }
    },
  }
}
