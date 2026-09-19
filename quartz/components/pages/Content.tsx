import { ComponentChildren } from "preact"
import type { Root } from "hast"
import { toString } from "hast-util-to-string"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const Content: QuartzComponent = ({ fileData, tree }: QuartzComponentProps) => {
  if (fileData.slug === "index") {
    return null
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

export default (() => Content) satisfies QuartzComponentConstructor
