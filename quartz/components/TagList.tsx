import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const typeTags = new Set([
  "asmuo",
  "autorius",
  "vieta",
  "ivykis",
  "įvykis",
  "daiktas",
  "paprotys",
  "posakis",
  "grupe",
  "grupė",
  "saltinis",
  "šaltinis",
  "sąvoka",
  "zodyno_irasas",
])

function tagKind(tag: string): "type" | "period" | "topic" {
  const norm = tag.trim().toLowerCase()
  if (typeTags.has(norm)) return "type"
  if (/^(x|v|i)+$/i.test(tag) || norm.includes("amžius") || norm.includes("viduramž")) {
    return "period"
  }
  return "topic"
}

const TagList: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const tags = fileData.frontmatter?.tags
  if (tags && tags.length > 0) {
    const orderedTags = [...tags].sort((a, b) => {
      const rank = { topic: 0, period: 1, type: 2 }
      const kindDiff = rank[tagKind(a)] - rank[tagKind(b)]
      return kindDiff === 0 ? a.localeCompare(b, "lt") : kindDiff
    })
    return (
      <ul class={classNames(displayClass, "tags", "tags-curated")}>
        {orderedTags.map((tag) => {
          const linkDest = resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)
          const kind = tagKind(tag)
          return (
            <li>
              <a href={linkDest} class={`internal tag-link tag-link-${kind}`}>
                {tag}
              </a>
            </li>
          )
        })}
      </ul>
    )
  } else {
    return null
  }
}

TagList.css = `
.tags {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.4rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.section-li > .section > .tags {
  justify-content: flex-end;
}
  
.tags > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}

a.internal.tag-link {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
  font-size: 0.84rem;
  line-height: 1.1;
}

a.internal.tag-link-topic {
  background-color: color-mix(in srgb, var(--tertiary) 18%, transparent);
  border-color: color-mix(in srgb, var(--tertiary) 38%, transparent);
}

a.internal.tag-link-period {
  background-color: color-mix(in srgb, var(--secondary) 13%, transparent);
  border-color: color-mix(in srgb, var(--secondary) 32%, transparent);
}

a.internal.tag-link-type {
  background-color: color-mix(in srgb, var(--lightgray) 48%, transparent);
  border-color: var(--lightgray);
  color: var(--darkgray);
}
`

export default (() => TagList) satisfies QuartzComponentConstructor
