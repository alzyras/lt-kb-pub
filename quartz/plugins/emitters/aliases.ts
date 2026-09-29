import {
  FullSlug,
  isRelativeURL,
  joinSegments,
  simplifySlug,
  slugCollisionKey,
} from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"
import { VFile } from "vfile"
import { rm } from "node:fs/promises"
import path from "path"
import { FilePath } from "../../util/path"

const MAX_SEGMENT_BYTES = 240
const TRAILING_PARENTHETICAL = /-\([^)]{1,120}\)$/
const LEGACY_CANONICAL_REDIRECTS: Array<[FullSlug, FullSlug]> = [
  ["objektai/asmenys/Vytautas-Didysis" as FullSlug, "objektai/asmenys/Vytautas" as FullSlug],
  [
    "objektai/grupes/Draugija-Uzsienio-Lietuviams-Remti" as FullSlug,
    "objektai/grupes/Draugija-Uzsienio-Lietuviams-Remti-(DULR)" as FullSlug,
  ],
]

function hasOverlongSegment(slug: FullSlug): boolean {
  return String(slug)
    .split("/")
    .some((segment) => Buffer.byteLength(segment, "utf8") > MAX_SEGMENT_BYTES)
}

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
  if (hasOverlongSegment(fromSlug)) {
    console.warn(
      `[AliasRedirects] Skipping redirect for overlong slug segment: ${fromSlug} -> ${toSlug}`,
    )
    return null
  }
  const targetPath = simplifySlug(toSlug)
  const redirUrl = targetPath === "/" ? "/" : `/${targetPath}`
  const canonicalUrl = ctx.cfg.configuration.baseUrl
    ? joinSegments(`https://${ctx.cfg.configuration.baseUrl}`, toSlug)
    : redirUrl
  return write({
    ctx,
    content: `
      <!DOCTYPE html>
      <html lang="lt">
      <head>
      <title>${toSlug}</title>
      <link rel="canonical" href="${canonicalUrl}">
      <meta name="robots" content="noindex,follow">
      <meta charset="utf-8">
      <meta http-equiv="refresh" content="0; url=${redirUrl}">
      </head>
      </html>
      `,
    slug: fromSlug,
    ext: ".html",
  })
}

function canonicalSlugCollisionKeys(ctx: BuildCtx): Set<string> {
  return new Set(ctx.allSlugs.map((canonicalSlug) => slugCollisionKey(canonicalSlug)))
}

function collidesWithCanonicalSlug(slug: FullSlug, canonicalSlugs: ReadonlySet<string>): boolean {
  return canonicalSlugs.has(slugCollisionKey(slug))
}

function generatedAliasCandidates(ogSlug: FullSlug): FullSlug[] {
  const candidates = new Set<string>()
  const slug = String(ogSlug)
  const segments = slug.split("/")
  const last = segments.at(-1)

  if (last) {
    const withoutParenthetical = last.replace(TRAILING_PARENTHETICAL, "")
    if (withoutParenthetical && withoutParenthetical !== last) {
      candidates.add([...segments.slice(0, -1), withoutParenthetical].join("/"))
    }
  }

  const commaCompat = slug.replace(/,/g, "-percent2C")
  if (commaCompat !== slug) {
    candidates.add(commaCompat)
  }

  return [...candidates].filter((candidate) => candidate !== slug) as FullSlug[]
}

function buildGeneratedAliasIndex(content: [unknown, VFile][]) {
  const canonicalSlugs = new Set<string>()
  const explicitAliasSlugs = new Set<string>()
  const candidates = new Map<FullSlug, Set<FullSlug>>()

  for (const [_tree, file] of content) {
    const ogSlug = file.data.slug as FullSlug | undefined
    if (!ogSlug) continue
    canonicalSlugs.add(slugCollisionKey(ogSlug))

    for (const aliasTarget of file.data.aliases ?? []) {
      const aliasTargetSlug = (
        isRelativeURL(aliasTarget)
          ? path.normalize(path.join(ogSlug, "..", aliasTarget))
          : aliasTarget
      ) as FullSlug
      explicitAliasSlugs.add(slugCollisionKey(aliasTargetSlug))
    }

    for (const candidate of generatedAliasCandidates(ogSlug)) {
      if (!candidates.has(candidate)) {
        candidates.set(candidate, new Set())
      }
      candidates.get(candidate)!.add(ogSlug)
    }
  }

  const safeAliases = new Map<FullSlug, FullSlug>()
  for (const [candidate, targets] of candidates) {
    if (
      targets.size !== 1 ||
      canonicalSlugs.has(slugCollisionKey(candidate)) ||
      explicitAliasSlugs.has(slugCollisionKey(candidate))
    ) {
      continue
    }
    safeAliases.set(candidate, [...targets][0])
  }

  return { safeAliases, canonicalSlugs, explicitAliasSlugs }
}

async function* processFile(ctx: BuildCtx, file: VFile, canonicalSlugs: ReadonlySet<string>) {
  const ogSlug = file.data.slug! as FullSlug
  const legacySlug = legacySlugifyFilePath(String(file.data.relativePath ?? ""))

  if (
    legacySlug &&
    legacySlug !== file.data.slug &&
    !collidesWithCanonicalSlug(legacySlug, canonicalSlugs)
  ) {
    const page = redirectPage(legacySlug, ogSlug, ctx)
    if (page) {
      yield page
    }
  }

  for (const aliasTarget of file.data.aliases ?? []) {
    const aliasTargetSlug = (
      isRelativeURL(aliasTarget)
        ? path.normalize(path.join(ogSlug, "..", aliasTarget))
        : aliasTarget
    ) as FullSlug

    if (collidesWithCanonicalSlug(aliasTargetSlug, canonicalSlugs)) continue
    const page = redirectPage(aliasTargetSlug, ogSlug, ctx)
    if (page) {
      yield page
    }
  }
}

async function* processGeneratedAliases(ctx: BuildCtx, content: [unknown, VFile][]) {
  const { safeAliases } = buildGeneratedAliasIndex(content)
  for (const [fromSlug, toSlug] of safeAliases) {
    const page = redirectPage(fromSlug, toSlug, ctx)
    if (page) {
      yield page
    }
  }
}

export const AliasRedirects: QuartzEmitterPlugin = () => ({
  name: "AliasRedirects",
  async *emit(ctx, content) {
    const canonicalSlugs = canonicalSlugCollisionKeys(ctx)
    for (const [fromSlug, toSlug] of LEGACY_CANONICAL_REDIRECTS) {
      if (collidesWithCanonicalSlug(fromSlug, canonicalSlugs)) continue
      const page = redirectPage(fromSlug, toSlug, ctx)
      if (page) yield page
    }
    for (const [_tree, file] of content) {
      yield* processFile(ctx, file, canonicalSlugs)
    }
    yield* processGeneratedAliases(ctx, content)
  },
  async *incrementalEmit(ctx, content, _resources, changeEvents) {
    const canonicalSlugs = canonicalSlugCollisionKeys(ctx)
    const added = changeEvents.filter((event) => event.type === "add" && event.file)
    const newGeneratedCandidates = new Set<FullSlug>()
    for (const event of added) {
      const slug = event.file!.data.slug
      if (typeof slug !== "string") continue
      for (const candidate of generatedAliasCandidates(slug as FullSlug)) {
        newGeneratedCandidates.add(candidate)
      }
    }

    const generatedAliases = added.length > 0 ? buildGeneratedAliasIndex(content) : undefined
    for (const event of changeEvents) {
      if (!event.file || event.type === "delete") continue
      yield* processFile(ctx, event.file, canonicalSlugs)
    }

    if (!generatedAliases) return
    for (const candidate of newGeneratedCandidates) {
      const target = generatedAliases.safeAliases.get(candidate)
      if (target) {
        const page = redirectPage(candidate, target, ctx)
        if (page) yield page
        continue
      }

      const collisionKey = slugCollisionKey(candidate)
      if (
        canonicalSlugs.has(collisionKey) ||
        generatedAliases.explicitAliasSlugs.has(collisionKey)
      ) {
        continue
      }
      const stalePath = path.join(ctx.argv.output, ...String(candidate).split("/"), "index.html")
      await rm(stalePath, { force: true })
      ctx.deletedFiles?.add(stalePath as FilePath)
    }
  },
  async *partialEmit(ctx, _content, _resources, changeEvents) {
    const canonicalSlugs = canonicalSlugCollisionKeys(ctx)
    for (const changeEvent of changeEvents) {
      if (!changeEvent.file) continue
      if (changeEvent.type === "add" || changeEvent.type === "change") {
        // add new ones if this file still exists
        yield* processFile(ctx, changeEvent.file, canonicalSlugs)
      }
    }
  },
})
