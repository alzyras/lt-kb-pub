import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const Content: QuartzComponent = ({ fileData, tree }: QuartzComponentProps) => {
  if (fileData.slug === "index") {
    return null
  }

  const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
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
