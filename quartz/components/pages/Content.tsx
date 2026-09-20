import { ComponentChildren } from "preact"
import type { Root } from "hast"
import { toString } from "hast-util-to-string"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { CollectionDetail, collectionStyle } from "../CollectionPage"
import { PageList } from "../PageList"
import { concatenateResources } from "../../util/resources"

const Content: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, tree } = props
  if (fileData.slug === "index") {
    return null
  }
  if (["tema", "laikotarpis"].includes(String(fileData.frontmatter?.tipas))) {
    return <CollectionDetail {...props} />
  }

  // The shared page header already renders the title. Avoid a second H1 when
  // the Markdown repeats it, while preserving all other document headings.
  const root = tree as Root
  const firstHeading = root.children.findIndex(
    (node) => node.type === "element" && node.tagName === "h1",
  )
  const title = String(fileData.frontmatter?.title ?? "").trim()
  const contentTree =
    firstHeading >= 0 && toString(root.children[firstHeading]).trim() === title
      ? { ...root, children: root.children.filter((_, index) => index !== firstHeading) }
      : root
  const content = htmlToJsx(fileData.filePath!, contentTree) as ComponentChildren
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  // Topic pages are content pages (rather than folder pages), but deserve the
  // same calm, full-width collection treatment as the topic index. Keeping a
  // dedicated class here lets the global shell stay unchanged for articles and
  // source pages.
  const isTopicPage = String(fileData.slug ?? "").startsWith("temos/")
  const classString = ["popover-hint", isTopicPage ? "topic-page-content" : "", ...classes]
    .filter(Boolean)
    .join(" ")
  return <article class={classString}>{content}</article>
}
Content.css = concatenateResources(PageList.css, collectionStyle)
Content.afterDOMLoaded = PageList.afterDOMLoaded

export default (() => Content) satisfies QuartzComponentConstructor
