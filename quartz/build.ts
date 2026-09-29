import sourceMapSupport from "source-map-support"
sourceMapSupport.install(options)
import path from "path"
import { PerfTimer } from "./util/perf"
import { mkdir, readFile, readdir, rename, rm, writeFile } from "fs/promises"
import { GlobbyFilterFunction, isGitIgnored } from "globby"
import { styleText } from "util"
import { parseMarkdown } from "./processors/parse"
import { filterContent } from "./processors/filter"
import { emitContent, emitIncrementalContent } from "./processors/emit"
import cfg from "../quartz.config"
import { createUniqueSlugMap, FilePath, joinSegments, simplifySlug } from "./util/path"
import chokidar from "chokidar"
import { ProcessedContent } from "./plugins/vfile"
import { Argv, BuildCtx } from "./util/ctx"
import { glob, toPosixPath } from "./util/glob"
import { trace } from "./util/trace"
import { options } from "./util/sourcemap"
import { Mutex } from "async-mutex"
import { getStaticResourcesFromPlugins } from "./plugins"
import { randomIdNonSecure } from "./util/random"
import { ChangeEvent } from "./plugins/types"
import { minimatch } from "minimatch"
import { buildRelationTargetMap, readRelationDocuments } from "./util/relations"
import { isObjectDetailSlug } from "./util/objectDetail"
import { performance } from "node:perf_hooks"

type ContentMap = Map<
  FilePath,
  | {
      type: "markdown"
      content: ProcessedContent
    }
  | {
      type: "other"
    }
>

type BuildData = {
  ctx: BuildCtx
  ignored: GlobbyFilterFunction
  mut: Mutex
  contentMap: ContentMap
  changesSinceLastBuild: Record<FilePath, ChangeEvent["type"]>
  lastBuildMs: number
}

type CachedFileMetadata = {
  slug: string
  links: string[]
  tags: string[]
  aliases: string[]
  relationResolutionDependencies: Record<string, string>
  title: string
  type: string
}

type IncrementalPlan = {
  schemaVersion: 1
  previousMetadataPath: string
  changes: Array<{ path: string; type: "add" | "change" | "delete" }>
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T
}

async function writeJsonFileAtomic(filePath: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true })
  const temporaryPath = `${filePath}.${randomIdNonSecure()}.tmp`
  try {
    await writeFile(temporaryPath, `${JSON.stringify(value)}\n`, "utf8")
    await rename(temporaryPath, filePath)
  } finally {
    await rm(temporaryPath, { force: true })
  }
}

function metadataFromParsedContent(
  content: ProcessedContent[],
): Record<string, CachedFileMetadata> {
  const result: Record<string, CachedFileMetadata> = {}
  for (const [, file] of content) {
    const relativePath = file.data.relativePath
    const slug = file.data.slug
    if (!relativePath || !slug) continue
    const frontmatter = (file.data.frontmatter ?? {}) as Record<string, unknown>
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : []
    const aliases = Array.isArray(file.data.aliases) ? file.data.aliases.map(String) : []
    result[String(relativePath)] = {
      slug: String(slug),
      links: [...new Set((file.data.links ?? []).map(String))].sort(),
      tags: [...new Set(tags)].sort(),
      aliases: [...new Set(aliases)].sort(),
      relationResolutionDependencies: file.data.relationResolutionDependencies ?? {},
      title: String(frontmatter.title ?? frontmatter.pavadinimas ?? ""),
      type: String(frontmatter.tipas ?? ""),
    }
  }
  return result
}

function arraysEqual(left: string[] = [], right: string[] = []): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

function recordsEqual(
  left: Record<string, string> = {},
  right: Record<string, string> = {},
): boolean {
  const leftKeys = Object.keys(left).sort()
  const rightKeys = Object.keys(right).sort()
  return arraysEqual(leftKeys, rightKeys) && leftKeys.every((key) => left[key] === right[key])
}

function incrementalFallbackReason(
  previous: Record<string, CachedFileMetadata>,
  current: Record<string, CachedFileMetadata>,
  changes: IncrementalPlan["changes"],
): string | undefined {
  for (const [filePath, oldFile] of Object.entries(previous)) {
    const newFile = current[filePath]
    if (newFile && oldFile.slug !== newFile.slug) {
      return `An existing route changed at ${filePath}; a full build is required.`
    }
  }

  for (const change of changes) {
    if (change.path.startsWith("quartz/static/graph-data/")) continue
    if (!/^content\/.+\.md$/i.test(change.path)) {
      return `Input ${change.path} is outside the supported incremental content and graph-data paths.`
    }
    const relativePath = change.path.replace(/^content\//, "")
    const oldFile = previous[relativePath]
    const newFile = current[relativePath]
    if (!newFile) return `Changed Markdown is not in the parsed content set: ${change.path}.`
    if (
      oldFile &&
      (!arraysEqual(oldFile.tags, newFile.tags) || !arraysEqual(oldFile.aliases, newFile.aliases))
    ) {
      return `Tags or aliases changed at ${change.path}; a full build avoids leaving stale redirect routes.`
    }
    if (newFile.slug.startsWith("objektai/saltiniai/")) {
      return `A source-object route changed at ${change.path}; it can affect bibliographies site-wide.`
    }
  }

  return undefined
}

function changeEventsForFiles(
  parsedByRelativePath: Map<string, ProcessedContent>,
  fileTypes: Map<string, "add" | "change">,
): ChangeEvent[] {
  const events: ChangeEvent[] = []
  for (const [relativePath, type] of fileTypes) {
    const processed = parsedByRelativePath.get(relativePath)
    if (!processed) continue
    events.push({
      path: relativePath as FilePath,
      type,
      file: processed[1],
    })
  }
  return events
}

function contentPagePath(outputRoot: string, slug: string): string {
  const isPretty = slug !== "index" && slug !== "404" && !slug.endsWith("/index")
  return isPretty
    ? path.join(outputRoot, ...slug.split("/"), "index.html")
    : path.join(outputRoot, `${slug}.html`)
}

async function claimAssetReferences(htmlPath: string): Promise<Set<string>> {
  try {
    const html = await readFile(htmlPath, "utf8")
    return new Set(
      [...html.matchAll(/data-claim-detail-url="\/([^"?#]+\.json)"/g)].map((match) => match[1]),
    )
  } catch {
    return new Set()
  }
}

async function htmlFilesUnder(directory: string): Promise<string[]> {
  let entries
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return []
    throw error
  }
  const files: string[] = []
  for (const entry of entries) {
    const child = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await htmlFilesUnder(child)))
    else if (entry.isFile() && entry.name === "index.html") files.push(child)
  }
  return files
}

async function existingObjectSubpages(outputRoot: string, slugs: string[]): Promise<Set<string>> {
  const paths = new Set<string>()
  for (const slug of slugs) {
    for (const route of ["irodymai", "rysiai"]) {
      const directory = path.join(outputRoot, ...slug.split("/"), route)
      for (const filePath of await htmlFilesUnder(directory)) paths.add(filePath)
    }
  }
  return paths
}

async function buildQuartz(argv: Argv, mut: Mutex, clientRefresh: () => void) {
  const incrementalBuild = process.env.SITE_INCREMENTAL_BUILD === "1"
  const incrementalPlanPath = process.env.SITE_INCREMENTAL_PLAN_PATH
  const buildMetadataPath = process.env.SITE_BUILD_METADATA_PATH
  const emittedFilesPath = process.env.SITE_EMITTED_FILES_PATH
  const incrementalFallbackPath = process.env.SITE_INCREMENTAL_FALLBACK_PATH
  const ctx: BuildCtx = {
    buildId: randomIdNonSecure(),
    argv,
    cfg,
    allSlugs: [],
    allFiles: [],
    slugMap: {},
    relationTargetMap: {},
    incremental: false,
    emittedFiles: new Set(),
    deletedFiles: new Set(),
  }

  const perf = new PerfTimer()
  const output = argv.output

  const pluginCount = Object.values(cfg.plugins).flat().length
  const pluginNames = (key: "transformers" | "filters" | "emitters") =>
    cfg.plugins[key].map((plugin) => plugin.name)
  if (argv.verbose) {
    console.log(`Loaded ${pluginCount} plugins`)
    console.log(`  Transformers: ${pluginNames("transformers").join(", ")}`)
    console.log(`  Filters: ${pluginNames("filters").join(", ")}`)
    console.log(`  Emitters: ${pluginNames("emitters").join(", ")}`)
  }

  const release = await mut.acquire()
  if (!incrementalBuild) {
    perf.addEvent("clean")
    await rm(output, { recursive: true, force: true })
    console.log(`Cleaned output directory \`${output}\` in ${perf.timeSince("clean")}`)
  } else if (!incrementalPlanPath || !buildMetadataPath || !emittedFilesPath) {
    release()
    throw new Error("Incremental build is missing its plan or metadata paths.")
  }

  perf.addEvent("glob")
  const allFiles = await glob("**/*.*", argv.directory, cfg.configuration.ignorePatterns)
  const markdownPaths = allFiles.filter((fp) => fp.endsWith(".md")).sort()
  console.log(
    `Found ${markdownPaths.length} input files from \`${argv.directory}\` in ${perf.timeSince("glob")}`,
  )

  const filePaths = markdownPaths.map((fp) => joinSegments(argv.directory, fp) as FilePath)
  ctx.allFiles = allFiles
  const slugMap = createUniqueSlugMap(allFiles as FilePath[])
  ctx.slugMap = Object.fromEntries(slugMap)
  ctx.allSlugs = allFiles.map((fp) => slugMap.get(fp as FilePath)!)
  ctx.relationTargetMap = buildRelationTargetMap(
    readRelationDocuments(argv.directory, ctx.allFiles, ctx.slugMap),
  )

  const parsedFiles = await parseMarkdown(ctx, filePaths)
  const filteredContent = filterContent(ctx, parsedFiles)
  const parsedByRelativePath = new Map(
    parsedFiles
      .filter(([, file]) => file.data.relativePath)
      .map((content) => [String(content[1].data.relativePath), content]),
  )
  const currentMetadata = metadataFromParsedContent(parsedFiles)
  if (buildMetadataPath)
    await writeJsonFileAtomic(buildMetadataPath, { schemaVersion: 1, files: currentMetadata })

  if (incrementalBuild) {
    const plan = await readJsonFile<IncrementalPlan>(incrementalPlanPath!)
    if (plan.schemaVersion !== 1 || !plan.previousMetadataPath) {
      throw new Error("Incremental plan has an unsupported schema or missing previous metadata.")
    }
    const previousMetadata = await readJsonFile<{
      schemaVersion: number
      files: Record<string, CachedFileMetadata>
    }>(plan.previousMetadataPath)
    if (previousMetadata.schemaVersion !== 1) {
      throw new Error("Previous Quartz content metadata has an unsupported schema.")
    }

    const fallbackReason = incrementalFallbackReason(
      previousMetadata.files,
      currentMetadata,
      plan.changes,
    )
    if (fallbackReason) {
      if (incrementalFallbackPath) {
        await writeJsonFileAtomic(incrementalFallbackPath, { reason: fallbackReason })
      }
      release()
      return
    }

    const fileTypes = new Map<string, "add" | "change">()
    const staticGraphEvents: ChangeEvent[] = []
    for (const change of plan.changes) {
      if (change.path.startsWith("quartz/static/graph-data/")) {
        staticGraphEvents.push({ path: change.path as FilePath, type: change.type })
        continue
      }
      if (change.type === "delete") continue
      fileTypes.set(change.path.replace(/^content\//, ""), change.type)
    }
    const dirtyPaths = new Map(fileTypes)
    for (const [relativePath, current] of Object.entries(currentMetadata)) {
      const previous = previousMetadata.files[relativePath]
      if (!previous) {
        dirtyPaths.set(relativePath, "add")
      } else if (
        !arraysEqual(previous.links, current.links) ||
        !recordsEqual(
          previous.relationResolutionDependencies,
          current.relationResolutionDependencies,
        ) ||
        previous.title !== current.title ||
        previous.type !== current.type
      ) {
        dirtyPaths.set(relativePath, "change")
      }
    }

    const dirtyEvents = changeEventsForFiles(parsedByRelativePath, dirtyPaths)
    const pageTypes = new Map(dirtyPaths)
    const dirtySlugs = new Set(
      dirtyEvents.map((event) => String(event.file?.data.slug ?? "")).filter(Boolean),
    )

    // A page's outgoing links drive both its backlinks and its transclusions.
    // Refresh pages that point at a changed page, plus target pages whose
    // backlinks changed when a source page was added or edited.
    for (const [relativePath, current] of Object.entries(currentMetadata)) {
      const previous = previousMetadata.files[relativePath]
      if (!previous) continue
      if (
        [...dirtySlugs].some(
          (slug) => previous.links.includes(slug) || current.links.includes(slug),
        )
      ) {
        pageTypes.set(relativePath, "change")
      }
    }
    const pageSlugs = new Set(pageTypes.keys())
    for (const relativePath of dirtyPaths.keys()) {
      const oldFile = previousMetadata.files[relativePath]
      const newFile = currentMetadata[relativePath]
      for (const link of [...(oldFile?.links ?? []), ...(newFile?.links ?? [])]) {
        const target = [...parsedByRelativePath.entries()].find(([, content]) => {
          const slug = String(content[1].data.slug ?? "")
          return simplifySlug(slug as never) === simplifySlug(link as never)
        })
        if (target) pageSlugs.add(target[0])
      }
    }

    // The home page and its live collection data are global views of the full
    // corpus. Top-level theme links are shared by every page, so refresh the
    // whole site shell when the theme directory changes.
    if (parsedByRelativePath.has("index.md")) pageSlugs.add("index.md")
    if ([...dirtyPaths.keys()].some((relativePath) => relativePath.startsWith("temos/"))) {
      for (const relativePath of parsedByRelativePath.keys()) pageSlugs.add(relativePath)
    }
    ctx.incrementalPageEvents = changeEventsForFiles(
      parsedByRelativePath,
      new Map([...pageSlugs].map((relativePath) => [relativePath, "change"])),
    )
    ctx.incremental = true

    const oldClaimAssets = new Map<string, Set<string>>()
    for (const event of ctx.incrementalPageEvents) {
      const slug = String(event.file?.data.slug ?? "")
      if (slug) oldClaimAssets.set(slug, await claimAssetReferences(contentPagePath(output, slug)))
    }
    const oldObjectSubpages = await existingObjectSubpages(
      output,
      dirtyEvents
        .map((event) => String(event.file?.data.slug ?? ""))
        .filter((slug) => isObjectDetailSlug(slug)),
    )

    const incrementalEmitStarted = performance.now()
    await emitIncrementalContent(ctx, filteredContent, dirtyEvents, staticGraphEvents)
    if (process.env.SITE_INCREMENTAL_TIMING === "1") {
      console.log(
        `[incremental-timing] all emitters: ${((performance.now() - incrementalEmitStarted) / 1000).toFixed(2)}s`,
      )
    }

    // Claim detail URLs include a content hash. Remove obsolete assets for
    // changed pages after their replacement HTML has been written atomically.
    for (const [slug, oldAssets] of oldClaimAssets) {
      const currentAssets = await claimAssetReferences(contentPagePath(output, slug))
      for (const oldAsset of oldAssets) {
        if (currentAssets.has(oldAsset)) continue
        const stalePath = path.join(output, ...oldAsset.split("/"))
        await rm(stalePath, { force: true })
        ctx.deletedFiles?.add(stalePath as FilePath)
      }
    }
    const currentObjectSubpages = new Set(
      [...ctx.emittedFiles!]
        .filter((filePath) => /\/(?:irodymai|rysiai)\/(?:\d+\/)?index\.html$/.test(filePath))
        .map(String),
    )
    for (const oldPath of oldObjectSubpages) {
      if (currentObjectSubpages.has(oldPath)) continue
      await rm(oldPath, { force: true })
      ctx.deletedFiles?.add(oldPath as FilePath)
    }
  } else {
    await emitContent(ctx, filteredContent)
  }
  if (emittedFilesPath) {
    await writeJsonFileAtomic(emittedFilesPath, {
      written: [...(ctx.emittedFiles ?? [])].map(String),
      deleted: [...(ctx.deletedFiles ?? [])].map(String),
    })
  }
  console.log(
    styleText("green", `Done processing ${markdownPaths.length} files in ${perf.timeSince()}`),
  )
  release()

  if (argv.watch) {
    ctx.incremental = true
    return startWatching(ctx, mut, parsedFiles, clientRefresh)
  }
}

// setup watcher for rebuilds
async function startWatching(
  ctx: BuildCtx,
  mut: Mutex,
  initialContent: ProcessedContent[],
  clientRefresh: () => void,
) {
  const { argv, allFiles } = ctx

  const contentMap: ContentMap = new Map()
  for (const filePath of allFiles) {
    contentMap.set(filePath, {
      type: "other",
    })
  }

  for (const content of initialContent) {
    const [_tree, vfile] = content
    contentMap.set(vfile.data.relativePath!, {
      type: "markdown",
      content,
    })
  }

  const gitIgnoredMatcher = await isGitIgnored()
  const buildData: BuildData = {
    ctx,
    mut,
    contentMap,
    ignored: (fp) => {
      const pathStr = toPosixPath(fp.toString())
      if (pathStr.startsWith(".git/")) return true
      if (gitIgnoredMatcher(pathStr)) return true
      for (const pattern of cfg.configuration.ignorePatterns) {
        if (minimatch(pathStr, pattern)) {
          return true
        }
      }

      return false
    },

    changesSinceLastBuild: {},
    lastBuildMs: 0,
  }

  const watcher = chokidar.watch(".", {
    awaitWriteFinish: { stabilityThreshold: 250 },
    persistent: true,
    cwd: argv.directory,
    ignoreInitial: true,
  })

  const changes: ChangeEvent[] = []
  watcher
    .on("add", (fp) => {
      fp = toPosixPath(fp)
      if (buildData.ignored(fp)) return
      changes.push({ path: fp as FilePath, type: "add" })
      void rebuild(changes, clientRefresh, buildData)
    })
    .on("change", (fp) => {
      fp = toPosixPath(fp)
      if (buildData.ignored(fp)) return
      changes.push({ path: fp as FilePath, type: "change" })
      void rebuild(changes, clientRefresh, buildData)
    })
    .on("unlink", (fp) => {
      fp = toPosixPath(fp)
      if (buildData.ignored(fp)) return
      changes.push({ path: fp as FilePath, type: "delete" })
      void rebuild(changes, clientRefresh, buildData)
    })

  return async () => {
    await watcher.close()
  }
}

async function rebuild(changes: ChangeEvent[], clientRefresh: () => void, buildData: BuildData) {
  const { ctx, contentMap, mut, changesSinceLastBuild } = buildData
  const { argv, cfg } = ctx

  const buildId = randomIdNonSecure()
  ctx.buildId = buildId
  buildData.lastBuildMs = new Date().getTime()
  const numChangesInBuild = changes.length
  const release = await mut.acquire()

  // if there's another build after us, release and let them do it
  if (ctx.buildId !== buildId) {
    release()
    return
  }

  const perf = new PerfTimer()
  perf.addEvent("rebuild")
  console.log(styleText("yellow", "Detected change, rebuilding..."))

  // update changesSinceLastBuild
  for (const change of changes) {
    changesSinceLastBuild[change.path] = change.type
  }

  const staticResources = getStaticResourcesFromPlugins(ctx)
  const pathsToParse: FilePath[] = []
  for (const [fp, type] of Object.entries(changesSinceLastBuild)) {
    if (type === "delete" || path.extname(fp) !== ".md") continue
    const fullPath = joinSegments(argv.directory, toPosixPath(fp)) as FilePath
    pathsToParse.push(fullPath)
  }

  const parsed = await parseMarkdown(ctx, pathsToParse)
  for (const content of parsed) {
    contentMap.set(content[1].data.relativePath!, {
      type: "markdown",
      content,
    })
  }

  // update state using changesSinceLastBuild
  // we do this weird play of add => compute change events => remove
  // so that partialEmitters can do appropriate cleanup based on the content of deleted files
  for (const [file, change] of Object.entries(changesSinceLastBuild)) {
    if (change === "delete") {
      // universal delete case
      contentMap.delete(file as FilePath)
    }

    // manually track non-markdown files as processed files only
    // contains markdown files
    if (change === "add" && path.extname(file) !== ".md") {
      contentMap.set(file as FilePath, {
        type: "other",
      })
    }
  }

  const changeEvents: ChangeEvent[] = Object.entries(changesSinceLastBuild).map(([fp, type]) => {
    const path = fp as FilePath
    const processedContent = contentMap.get(path)
    if (processedContent?.type === "markdown") {
      const [_tree, file] = processedContent.content
      return {
        type,
        path,
        file,
      }
    }

    return {
      type,
      path,
    }
  })

  // update allFiles and then allSlugs with the consistent view of content map
  ctx.allFiles = Array.from(contentMap.keys())
  const slugMap = createUniqueSlugMap(ctx.allFiles)
  ctx.slugMap = Object.fromEntries(slugMap)
  ctx.allSlugs = ctx.allFiles.map((fp) => slugMap.get(fp)!)
  ctx.relationTargetMap = buildRelationTargetMap(
    readRelationDocuments(ctx.argv.directory, ctx.allFiles, ctx.slugMap),
  )
  let processedFiles = filterContent(
    ctx,
    Array.from(contentMap.values())
      .filter((file) => file.type === "markdown")
      .map((file) => file.content),
  )

  let emittedFiles = 0
  for (const emitter of cfg.plugins.emitters) {
    // Try to use partialEmit if available, otherwise assume the output is static
    const emitFn = emitter.partialEmit ?? emitter.emit
    const emitted = await emitFn(ctx, processedFiles, staticResources, changeEvents)
    if (emitted === null) {
      continue
    }

    if (Symbol.asyncIterator in emitted) {
      // Async generator case
      for await (const file of emitted) {
        emittedFiles++
        if (ctx.argv.verbose) {
          console.log(`[emit:${emitter.name}] ${file}`)
        }
      }
    } else {
      // Array case
      emittedFiles += emitted.length
      if (ctx.argv.verbose) {
        for (const file of emitted) {
          console.log(`[emit:${emitter.name}] ${file}`)
        }
      }
    }
  }

  console.log(`Emitted ${emittedFiles} files to \`${argv.output}\` in ${perf.timeSince("rebuild")}`)
  console.log(styleText("green", `Done rebuilding in ${perf.timeSince()}`))
  changes.splice(0, numChangesInBuild)
  clientRefresh()
  release()
}

export default async (argv: Argv, mut: Mutex, clientRefresh: () => void) => {
  try {
    return await buildQuartz(argv, mut, clientRefresh)
  } catch (err) {
    trace("\nExiting Quartz due to a fatal error", err as Error)
  }
}
