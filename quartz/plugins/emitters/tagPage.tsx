import { FullSlug, getAllSegmentPrefixes, joinSegments, simplifySlug } from "../../util/path"
import { legacyTagDestination } from "../../util/themeCatalog"
import { BuildCtx } from "../../util/ctx"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"

function tagRedirect(ctx: BuildCtx, tag: string) {
  const slug = joinSegments("tags", tag) as FullSlug
  const destination = legacyTagDestination(tag)
  const targetPath = simplifySlug(destination)
  const redirectUrl = targetPath === "/" ? "/" : `/${targetPath}`
  const canonicalUrl = ctx.cfg.configuration.baseUrl
    ? joinSegments(`https://${ctx.cfg.configuration.baseUrl}`, destination)
    : redirectUrl

  return write({
    ctx,
    content: `<!doctype html><html lang="lt"><head><meta charset="utf-8"><title>${tag}</title><link rel="canonical" href="${canonicalUrl}"><meta http-equiv="refresh" content="0; url=${redirectUrl}"></head></html>`,
    slug,
    ext: ".html",
  })
}

export const TagPage: QuartzEmitterPlugin = () => ({
  name: "TagPage",
  getQuartzComponents() {
    return []
  },
  async *emit(ctx, content) {
    const tags = new Set(
      content
        .flatMap(([, file]) => file.data.frontmatter?.tags ?? [])
        .flatMap(getAllSegmentPrefixes),
    )
    tags.add("index")
    for (const tag of tags) {
      yield tagRedirect(ctx, tag)
    }
  },
  async *partialEmit(ctx, _content, _resources, changeEvents) {
    const tags = new Set<string>(["index"])
    for (const event of changeEvents) {
      for (const tag of event.file?.data.frontmatter?.tags ?? []) {
        getAllSegmentPrefixes(tag).forEach((prefix) => tags.add(prefix))
      }
    }
    for (const tag of tags) {
      yield tagRedirect(ctx, tag)
    }
  },
})
