import { FullSlug, isRelativeURL, resolveRelative } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"
import { VFile } from "vfile"
import path from "path"

function legacySluggify(s: string): string {
  return s
    .split("/")
    .map((segment) =>
      segment
        .replace(/\s/g, "-")
        .replace(/&/g, "-and-")
        .replace(/%/g, "-percent")
        .replace(/\?/g, "")
        .replace(/#/g, ""),
    )
    .join("/")
    .replace(/\/$/, "")
}

function legacySlugifyFilePath(fp: string): FullSlug {
  fp = fp.replace(/^\/+/, "")
  let ext = fp.match(/\.[A-Za-z0-9]+$/)?.[0]
  const withoutFileExt = ext ? fp.replace(new RegExp(ext + "$"), "") : fp
  if ([".md", ".html", undefined].includes(ext)) {
    ext = ""
  }

  let slug = legacySluggify(withoutFileExt)
  if (slug.endsWith("_index")) {
    slug = slug.replace(/_index$/, "index")
  }

  return (slug + ext) as FullSlug
}

function redirectPage(fromSlug: FullSlug, toSlug: FullSlug, ctx: BuildCtx) {
  const redirUrl = resolveRelative(fromSlug, toSlug)
  return write({
    ctx,
    content: `
      <!DOCTYPE html>
      <html lang="lt">
      <head>
      <title>${toSlug}</title>
      <link rel="canonical" href="${redirUrl}">
      <meta charset="utf-8">
      <meta http-equiv="refresh" content="0; url=${redirUrl}">
      </head>
      </html>
      `,
    slug: fromSlug,
    ext: ".html",
  })
}

async function* processFile(ctx: BuildCtx, file: VFile) {
  const ogSlug = file.data.slug! as FullSlug
  const legacySlug = legacySlugifyFilePath(String(file.data.relativePath ?? ""))

  if (legacySlug && legacySlug !== file.data.slug) {
    yield redirectPage(legacySlug, ogSlug, ctx)
  }

  for (const aliasTarget of file.data.aliases ?? []) {
    const aliasTargetSlug = (
      isRelativeURL(aliasTarget)
        ? path.normalize(path.join(ogSlug, "..", aliasTarget))
        : aliasTarget
    ) as FullSlug

    yield redirectPage(aliasTargetSlug, ogSlug, ctx)
  }
}

export const AliasRedirects: QuartzEmitterPlugin = () => ({
  name: "AliasRedirects",
  async *emit(ctx, content) {
    for (const [_tree, file] of content) {
      yield* processFile(ctx, file)
    }
  },
  async *partialEmit(ctx, _content, _resources, changeEvents) {
    for (const changeEvent of changeEvents) {
      if (!changeEvent.file) continue
      if (changeEvent.type === "add" || changeEvent.type === "change") {
        // add new ones if this file still exists
        yield* processFile(ctx, changeEvent.file)
      }
    }
  },
})
