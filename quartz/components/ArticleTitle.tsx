import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ArticleTitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  if (title) {
    const normalizedTitle = String(title).trim()
    const titleLengthClass =
      normalizedTitle.length >= 58
        ? "article-title--very-long"
        : normalizedTitle.length >= 34
          ? "article-title--long"
          : ""
    return <h1 class={classNames(displayClass, "article-title", titleLengthClass)}>{title}</h1>
  } else {
    return null
  }
}

ArticleTitle.css = `
.article-title {
  margin: 2rem 0 0 0;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
