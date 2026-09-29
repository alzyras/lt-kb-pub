import path from "node:path"
import { FilePath, FullSlug, QUARTZ, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import { glob } from "../../util/glob"
import { dirname } from "path"
import { rm, readFile } from "node:fs/promises"
import { write } from "./helpers"

export const Static: QuartzEmitterPlugin = () => ({
  name: "Static",
  incrementalPolicy: "static",
  async *emit({ argv, cfg }) {
    const staticPath = joinSegments(QUARTZ, "static")
    const fps = await glob("**", staticPath, cfg.configuration.ignorePatterns)
    const outputStaticPath = joinSegments(argv.output, "static")
    await fs.promises.mkdir(outputStaticPath, { recursive: true })
    for (const fp of fps) {
      // Build-only catalogue: it contains reviewer/model evidence and must
      // never be copied into the public static output. Runtime gallery JSON is
      // emitted separately with a curated, public-safe shape.
      if (
        fp === "graph-data/topology.json" ||
        fp === "mediaCatalogSource.json" ||
        fp === "articleMediaCatalog.json"
      )
        continue
      const src = joinSegments(staticPath, fp) as FilePath
      const dest = joinSegments(outputStaticPath, fp) as FilePath
      await fs.promises.mkdir(dirname(dest), { recursive: true })
      await fs.promises.copyFile(src, dest)
      yield dest
    }
  },
  async *incrementalEmit(ctx, _content, _resources, changeEvents) {
    const prefix = "quartz/static/graph-data/"
    for (const event of changeEvents) {
      const inputPath = String(event.path)
      if (!inputPath.startsWith(prefix)) continue
      const relativePath = inputPath.slice(prefix.length)
      if (relativePath === "topology.json") continue
      const outputPath = joinSegments(ctx.argv.output, "static", "graph-data", relativePath)
      if (event.type === "delete") {
        await rm(outputPath, { force: true })
        ctx.deletedFiles?.add(outputPath as FilePath)
        continue
      }

      const sourcePath = joinSegments(QUARTZ, "static", "graph-data", relativePath)
      const ext = path.extname(relativePath) as `.${string}` | ""
      const slugPath = ext ? relativePath.slice(0, -ext.length) : relativePath
      yield write({
        ctx,
        content: await readFile(sourcePath),
        slug: joinSegments("static", "graph-data", slugPath) as FullSlug,
        ext,
      })
    }
  },
  async *partialEmit() {},
})
