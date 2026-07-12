import path from "path"
import fs from "fs"
import { BuildCtx } from "../../util/ctx"
import { FilePath, FullSlug, joinSegments } from "../../util/path"
import { Readable } from "stream"

type WriteOptions = {
  ctx: BuildCtx
  slug: FullSlug
  ext: `.${string}` | ""
  content: string | Buffer | Readable
}

function offsetRelativeAssetPathsForPrettyIndex(content: string): string {
  return content.replace(/\b(href|src)=(["'])([^"']*)\2/g, (match, attr, quote, rawUrl) => {
    const url = String(rawUrl)
    if (
      url === "" ||
      url.startsWith("#") ||
      url.startsWith("?") ||
      url.startsWith("/") ||
      url.startsWith("//") ||
      /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(url)
    ) {
      return match
    }

    return `${attr}=${quote}../${url}${quote}`
  })
}

export const write = async ({ ctx, slug, ext, content }: WriteOptions): Promise<FilePath> => {
  const pathToPage = joinSegments(ctx.argv.output, slug + ext) as FilePath
  const dir = path.dirname(pathToPage)
  await fs.promises.mkdir(dir, { recursive: true })
  await fs.promises.writeFile(pathToPage, content)

  if (
    ext === ".html" &&
    slug !== "index" &&
    slug !== "404" &&
    !slug.endsWith("/index") &&
    (typeof content === "string" || Buffer.isBuffer(content))
  ) {
    const prettyPath = joinSegments(ctx.argv.output, slug, "index.html") as FilePath
    const prettyDir = path.dirname(prettyPath)
    const prettyContent = offsetRelativeAssetPathsForPrettyIndex(content.toString())
    await fs.promises.mkdir(prettyDir, { recursive: true })
    await fs.promises.writeFile(prettyPath, prettyContent)
  }

  return pathToPage
}
