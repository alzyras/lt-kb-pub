import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

function isObjectDetailPage(slug: string | undefined): boolean {
  return Boolean(slug?.startsWith("objektai/") && slug.split("/").length >= 3)
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.BMHeader()],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/alzyras/lt-kb-pub",
      Quartz: "https://quartz.jzhao.xyz",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ContentMeta({ showReadingTime: false }),
    Component.ObjectMapCTA(),
    Component.ConditionalRender({
      component: Component.HomeCollection(),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.HomeRandomTeiginiai({
        title: "Atsitiktiniai teiginiai iš kolekcijos",
        limit: 5,
        minEvidence: 10,
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      wrap: "wrap",
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
        { Component: Component.AdvancedEvidenceToggle() },
        { Component: Component.OptionsPanel(), basis: "100%", order: 10, align: "start" },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.ConditionalRender({
      component: Component.Graph(),
      condition: (page) => !isObjectDetailPage(page.fileData.slug),
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs()],
  left: [],
  right: [],
}
