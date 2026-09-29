import esbuild from "esbuild"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { Processor, unified } from "unified"
import { Root as MDRoot } from "remark-parse/lib"
import { Root as HTMLRoot } from "hast"
import { MarkdownContent, ProcessedContent } from "../plugins/vfile"
import { PerfTimer } from "../util/perf"
import { read } from "to-vfile"
import { FilePath, QUARTZ, slugifyFilePath } from "../util/path"
import path from "path"
import workerpool, { Promise as WorkerPromise } from "workerpool"
import { QuartzLogger } from "../util/log"
import { trace } from "../util/trace"
import { BuildCtx, WorkerSerializableBuildCtx } from "../util/ctx"
import { styleText } from "util"
import { isObjectPage } from "../util/citationFilter"
import { collectEvidenceIntegrityIssues } from "../util/evidenceIntegrity"
import { ProcessedContentCache } from "../util/parseCache"
import { currentRelationResolutionDependencies } from "../plugins/transformers/advancedEvidence"
import { FullSlug, getFileExtension, simplifySlug, stripSlashes } from "../util/path"
import { loadExhibitionSlugs } from "../util/exhibitions"
import {
  isGeneratedMediaDetailLink,
  isGeneratedObjectEvidenceLink,
} from "../plugins/transformers/links"

export type QuartzMdProcessor = Processor<MDRoot, MDRoot, MDRoot>
export type QuartzHtmlProcessor = Processor<undefined, MDRoot, HTMLRoot>

export function createMdProcessor(ctx: BuildCtx): QuartzMdProcessor {
  const transformers = ctx.cfg.plugins.transformers

  return (
    unified()
      // base Markdown -> MD AST
      .use(remarkParse)
      // MD AST -> MD AST transforms
      .use(
        transformers.flatMap((plugin) => plugin.markdownPlugins?.(ctx) ?? []),
      ) as unknown as QuartzMdProcessor
    //  ^ sadly the typing of `use` is not smart enough to infer the correct type from our plugin list
  )
}

export function createHtmlProcessor(ctx: BuildCtx): QuartzHtmlProcessor {
  const transformers = ctx.cfg.plugins.transformers
  return (
    unified()
      // MD AST -> HTML AST
      .use(remarkRehype, { allowDangerousHtml: true })
      // HTML AST -> HTML AST transforms
      .use(transformers.flatMap((plugin) => plugin.htmlPlugins?.(ctx) ?? []))
  )
}

function* chunks<T>(arr: T[], size: number) {
  for (let index = 0; index < arr.length; index += size) {
    yield arr.slice(index, index + size)
  }
}

function processedFilePath(file: ProcessedContent[1]): string | undefined {
  const filePath = file.path ?? file.data.filePath
  return typeof filePath === "string" ? filePath : undefined
}

export function resolveProcessedFilePath(file: ProcessedContent[1]): string | undefined {
  const filePath = processedFilePath(file)
  return filePath ? path.resolve(filePath) : undefined
}

async function transpileWorkerScript() {
  // transpile worker script
  const cacheFile = "./.quartz-cache/transpiled-worker.mjs"
  const fp = "./quartz/worker.ts"
  return esbuild.build({
    entryPoints: [fp],
    outfile: path.join(QUARTZ, cacheFile),
    bundle: true,
    keepNames: true,
    platform: "node",
    format: "esm",
    packages: "external",
    sourcemap: true,
    sourcesContent: false,
    plugins: [
      {
        name: "css-and-scripts-as-text",
        setup(build) {
          build.onLoad({ filter: /\.scss$/ }, (_) => ({
            contents: "",
            loader: "text",
          }))
          build.onLoad({ filter: /\.inline\.(ts|js)$/ }, (_) => ({
            contents: "",
            loader: "text",
          }))
        },
      },
    ],
  })
}

export function createFileParser(ctx: BuildCtx, fps: FilePath[]) {
  const { argv, cfg } = ctx
  return async (processor: QuartzMdProcessor) => {
    const res: MarkdownContent[] = []
    for (const fp of fps) {
      try {
        const perf = new PerfTimer()
        const file = await read(fp)

        // strip leading and trailing whitespace
        file.value = file.value.toString().trim()

        const relativePath = path.posix.relative(argv.directory, fp)
        if (isObjectPage(relativePath)) {
          const integrityIssues = collectEvidenceIntegrityIssues(file.value.toString()).filter(
            (issue) => issue.severity === "error",
          )
          if (integrityIssues.length > 0) {
            const summary = integrityIssues
              .slice(0, 8)
              .map(
                (issue) =>
                  `${issue.code}:${issue.entryId}${issue.relatedId ? `->${issue.relatedId}` : ""}`,
              )
              .join(", ")
            throw new Error(`Evidence integrity failed for ${relativePath}: ${summary}`)
          }
        }

        // Text -> Text transforms
        ctx.parseCacheDependencies = new Map()
        for (const plugin of cfg.plugins.transformers.filter((p) => p.textTransform)) {
          file.value = plugin.textTransform!(ctx, file.value.toString())
        }
        file.data.relationResolutionDependencies = Object.fromEntries(ctx.parseCacheDependencies)
        ctx.parseCacheDependencies = undefined

        // base data properties that plugins may use
        file.data.filePath = file.path as FilePath
        file.data.relativePath = path.posix.relative(argv.directory, file.path) as FilePath
        file.data.slug =
          ctx.slugMap[file.data.relativePath] ?? slugifyFilePath(file.data.relativePath)

        const ast = processor.parse(file)
        const newAst = await processor.run(ast, file)
        res.push([newAst, file])

        if (argv.verbose) {
          console.log(`[markdown] ${fp} -> ${file.data.slug} (${perf.timeSince()})`)
        }
      } catch (err) {
        trace(`\nFailed to process markdown \`${fp}\``, err as Error)
      }
    }

    return res
  }
}

export function createMarkdownParser(ctx: BuildCtx, mdContent: MarkdownContent[]) {
  return async (processor: QuartzHtmlProcessor) => {
    const res: ProcessedContent[] = []
    for (const [ast, file] of mdContent) {
      try {
        const perf = new PerfTimer()

        const newAst = await processor.run(ast as MDRoot, file)
        res.push([newAst, file])

        if (ctx.argv.verbose) {
          console.log(`[html] ${file.data.slug} (${perf.timeSince()})`)
        }
      } catch (err) {
        trace(`\nFailed to process html \`${file.data.filePath}\``, err as Error)
      }
    }

    return res
  }
}

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(Math.round(num), min), max)

async function parseMarkdownUncached(ctx: BuildCtx, fps: FilePath[]): Promise<ProcessedContent[]> {
  const { argv } = ctx
  const perf = new PerfTimer()
  const log = new QuartzLogger(argv.verbose)

  // Four workers give the parser enough parallelism without oversubscribing a
  // development machine.
  const CHUNK_SIZE = 128
  const concurrency = ctx.argv.concurrency ?? clamp(fps.length / CHUNK_SIZE, 1, 4)

  let res: ProcessedContent[] = []
  log.start(`Parsing input files using ${concurrency} threads`)
  if (concurrency === 1) {
    try {
      const mdRes = await createFileParser(ctx, fps)(createMdProcessor(ctx))
      res = await createMarkdownParser(ctx, mdRes)(createHtmlProcessor(ctx))
    } catch (error) {
      log.end()
      throw error
    }
  } else {
    await transpileWorkerScript()
    const pool = workerpool.pool("./quartz/bootstrap-worker.mjs", {
      minWorkers: "max",
      maxWorkers: concurrency,
      workerType: "thread",
    })
    const errorHandler = (err: any) => {
      console.error(err)
      process.exit(1)
    }

    const serializableCtx: WorkerSerializableBuildCtx = {
      buildId: ctx.buildId,
      argv: ctx.argv,
      allSlugs: ctx.allSlugs,
      allFiles: ctx.allFiles,
      slugMap: ctx.slugMap,
      relationTargetMap: ctx.relationTargetMap,
      incremental: ctx.incremental,
    }

    // `serializableCtx` contains the complete slug and relation indexes. Keep
    // batches large enough to avoid repeatedly copying those maps, but bounded
    // so a worker never has to return thousands of parsed ASTs in one message.
    const WORKER_BATCH_SIZE = 512

    const textToMarkdownPromises: WorkerPromise<MarkdownContent[]>[] = []
    let processedFiles = 0
    for (const batch of chunks(fps, WORKER_BATCH_SIZE)) {
      textToMarkdownPromises.push(pool.exec("parseMarkdown", [serializableCtx, batch]))
    }

    const mdResults: Array<MarkdownContent[]> = await Promise.all(
      textToMarkdownPromises.map(async (promise) => {
        const result = await promise
        processedFiles += result.length
        log.updateText(`text->markdown ${styleText("gray", `${processedFiles}/${fps.length}`)}`)
        return result
      }),
    ).catch(errorHandler)

    const markdownToHtmlPromises: WorkerPromise<ProcessedContent[]>[] = []
    processedFiles = 0
    for (const mdChunk of mdResults) {
      markdownToHtmlPromises.push(pool.exec("processHtml", [serializableCtx, mdChunk]))
    }
    const results: ProcessedContent[][] = await Promise.all(
      markdownToHtmlPromises.map(async (promise) => {
        const result = await promise
        processedFiles += result.length
        log.updateText(`markdown->html ${styleText("gray", `${processedFiles}/${fps.length}`)}`)
        return result
      }),
    ).catch(errorHandler)

    res = results.flat()
    await pool.terminate()
  }

  log.end(`Parsed ${res.length} Markdown files in ${perf.timeSince()}`)
  return res
}

export async function parseMarkdown(ctx: BuildCtx, fps: FilePath[]): Promise<ProcessedContent[]> {
  const cache = await ProcessedContentCache.create(ctx)
  if (!cache || fps.length === 0) return parseMarkdownUncached(ctx, fps)

  const hits = new Map<string, ProcessedContent>()
  const keys = new Map<string, string>()
  const missing: FilePath[] = []
  for (const batch of chunks(fps, 16)) {
    const entries = await Promise.all(
      batch.map(async (filePath) => ({ filePath, entry: await cache.get(filePath) })),
    )
    for (const { filePath, entry } of entries) {
      const key = path.resolve(filePath)
      if (entry.content) {
        hits.set(key, entry.content)
        if (entry.key) keys.set(key, entry.key)
      } else {
        missing.push(filePath)
        if (entry.key) keys.set(key, entry.key)
      }
    }
  }

  // Cached frontmatter aliases participate in route resolution just like the
  // canonical Markdown slugs. Add them before parsing any cache misses so new
  // and cached notes see the same route set during this build.
  for (const [, file] of hits.values()) {
    for (const alias of file.data.aliases ?? []) {
      if (!ctx.allSlugs.includes(alias)) ctx.allSlugs.push(alias)
    }
  }

  let parsed = await parseMarkdownUncached(ctx, missing)
  for (const [, file] of parsed) {
    for (const alias of file.data.aliases ?? []) {
      if (!ctx.allSlugs.includes(alias)) ctx.allSlugs.push(alias)
    }
  }

  const routeSlugs = new Set(ctx.allSlugs.map((slug) => String(slug)))
  const exhibitions = loadExhibitionSlugs()
  const hasRoute = (rawSlug: string): boolean => {
    const slug = stripSlashes(rawSlug, true)
    const simple = simplifySlug(slug as FullSlug)
    return (
      routeSlugs.has(slug) ||
      routeSlugs.has(simple) ||
      routeSlugs.has(stripSlashes(simple)) ||
      exhibitions.has(stripSlashes(simple))
    )
  }
  const routeContextChanged = (root: unknown): boolean => {
    const stack: unknown[] = [root]
    while (stack.length > 0) {
      const node = stack.pop()
      if (!node || typeof node !== "object") continue
      const value = node as { properties?: Record<string, unknown>; children?: unknown[] }
      const properties = value.properties ?? {}
      const missingSlug = properties["data-missing-slug"]
      if (typeof missingSlug === "string" && hasRoute(missingSlug)) return true

      const resolvedSlug = properties["data-slug"]
      if (typeof resolvedSlug === "string") {
        const normalized = stripSlashes(resolvedSlug, true)
        const generated =
          isGeneratedMediaDetailLink(`/${normalized}`) ||
          isGeneratedObjectEvidenceLink(`/${normalized}`, ctx.allSlugs)
        if (!generated && !getFileExtension(normalized) && !hasRoute(normalized)) {
          return true
        }
      }
      if (Array.isArray(value.children)) stack.push(...value.children)
    }
    return false
  }

  const stale: string[] = []
  for (const [absolutePath, content] of hits) {
    const dependencies = content[1].data.relationResolutionDependencies
    if (!dependencies) {
      stale.push(absolutePath)
      continue
    }
    const current = currentRelationResolutionDependencies(ctx, Object.keys(dependencies))
    const relationsChanged = Object.entries(dependencies).some(
      ([key, value]) => current[key] !== value,
    )
    if (relationsChanged || routeContextChanged(content[0])) {
      stale.push(absolutePath)
      hits.delete(absolutePath)
    }
  }
  for (const absolutePath of stale) {
    const filePath = fps.find((candidate) => path.resolve(candidate) === absolutePath)
    if (filePath && !missing.includes(filePath)) missing.push(filePath)
  }

  const parsedPaths = new Set(
    parsed.flatMap((item) => {
      const filePath = resolveProcessedFilePath(item[1])
      return filePath ? [filePath] : []
    }),
  )
  parsed = [
    ...parsed,
    ...(await parseMarkdownUncached(
      ctx,
      missing.filter((fp) => !parsedPaths.has(path.resolve(fp))),
    )),
  ].sort(
    (left, right) =>
      fps.indexOf(processedFilePath(left[1]) as FilePath) -
      fps.indexOf(processedFilePath(right[1]) as FilePath),
  )
  const parsedByPath = new Map(
    parsed.flatMap((content) => {
      const filePath = resolveProcessedFilePath(content[1])
      return filePath ? [[filePath, content] as const] : []
    }),
  )
  let cachedWrites = 0
  for (const batch of chunks(parsed, 8)) {
    const results = await Promise.all(
      batch.map(async (content) => {
        const filePath = resolveProcessedFilePath(content[1])
        const key = filePath ? keys.get(filePath) : undefined
        if (!key) return false
        return cache.put(key, content)
      }),
    )
    cachedWrites += results.filter(Boolean).length
  }

  const result: ProcessedContent[] = []
  for (const filePath of fps) {
    const content = hits.get(path.resolve(filePath)) ?? parsedByPath.get(path.resolve(filePath))
    if (content) result.push(content)
  }
  console.log(
    `[parse-cache] reused ${hits.size}/${fps.length} processed files; parsed ${missing.length}; cached ${cachedWrites}`,
  )
  return result
}
