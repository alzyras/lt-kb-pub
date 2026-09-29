import { PerfTimer } from "../util/perf"
import { getStaticResourcesFromPlugins } from "../plugins"
import { ProcessedContent } from "../plugins/vfile"
import { QuartzLogger } from "../util/log"
import { trace } from "../util/trace"
import { BuildCtx } from "../util/ctx"
import { styleText } from "util"
import { performance } from "node:perf_hooks"

export async function emitContent(ctx: BuildCtx, content: ProcessedContent[]) {
  const { argv, cfg } = ctx
  const perf = new PerfTimer()
  const log = new QuartzLogger(ctx.argv.verbose)

  log.start(`Emitting files`)

  let emittedFiles = 0
  const staticResources = getStaticResourcesFromPlugins(ctx)
  await Promise.all(
    cfg.plugins.emitters.map(async (emitter) => {
      try {
        const emitted = await emitter.emit(ctx, content, staticResources)
        if (Symbol.asyncIterator in emitted) {
          // Async generator case
          for await (const file of emitted) {
            emittedFiles++
            if (ctx.argv.verbose) {
              console.log(`[emit:${emitter.name}] ${file}`)
            } else {
              log.updateText(`${emitter.name} -> ${styleText("gray", file)}`)
            }
          }
        } else {
          // Array case
          emittedFiles += emitted.length
          for (const file of emitted) {
            if (ctx.argv.verbose) {
              console.log(`[emit:${emitter.name}] ${file}`)
            } else {
              log.updateText(`${emitter.name} -> ${styleText("gray", file)}`)
            }
          }
        }
      } catch (err) {
        trace(`Failed to emit from plugin \`${emitter.name}\``, err as Error)
      }
    }),
  )

  log.end(`Emitted ${emittedFiles} files to \`${argv.output}\` in ${perf.timeSince()}`)
}

/**
 * Reuse the prior output tree for a stable Markdown-only change. Emitters opt
 * into a safe changed-page implementation, recompute their global index, or
 * declare that their output is independent of Markdown content.
 */
export async function emitIncrementalContent(
  ctx: BuildCtx,
  content: ProcessedContent[],
  changeEvents: import("../plugins/types").ChangeEvent[],
  staticGraphEvents: import("../plugins/types").ChangeEvent[] = [],
) {
  const resources = getStaticResourcesFromPlugins(ctx)
  const emitters = ctx.cfg.plugins.emitters.filter(
    (emitter) =>
      emitter.incrementalPolicy !== "static" ||
      (staticGraphEvents.length > 0 && emitter.name === "Static" && emitter.incrementalEmit),
  )
  ctx.incrementalSelectedSlugs = new Set(
    changeEvents.flatMap((event) => (event.file?.data.slug ? [String(event.file.data.slug)] : [])),
  )
  try {
    const results = await Promise.allSettled(
      emitters.map(async (emitter) => {
        const started = performance.now()
        let emittedFiles = 0
        try {
          const emitterChanges =
            emitter.incrementalPolicy === "static" ? staticGraphEvents : changeEvents
          const emitted = emitter.incrementalEmit
            ? await emitter.incrementalEmit(ctx, content, resources, emitterChanges)
            : await emitter.emit(ctx, content, resources)
          if (!emitted) return
          if (Symbol.asyncIterator in emitted) {
            for await (const file of emitted) {
              emittedFiles++
              ctx.emittedFiles?.add(file)
              if (ctx.argv.verbose) console.log(`[emit:${emitter.name}] ${file}`)
            }
          } else {
            for (const file of emitted) {
              emittedFiles++
              ctx.emittedFiles?.add(file)
              if (ctx.argv.verbose) console.log(`[emit:${emitter.name}] ${file}`)
            }
          }
        } finally {
          if (process.env.SITE_INCREMENTAL_TIMING === "1") {
            console.log(
              `[incremental-timing] ${emitter.name}: ${((performance.now() - started) / 1000).toFixed(2)}s, ${emittedFiles} files`,
            )
          }
        }
      }),
    )
    const failure = results.find(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    )
    if (failure) throw failure.reason
  } finally {
    ctx.incrementalSelectedSlugs = undefined
  }
}
