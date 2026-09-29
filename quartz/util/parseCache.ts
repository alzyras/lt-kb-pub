import { createHash, randomUUID } from "node:crypto"
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"
import { gzip, gunzip } from "node:zlib"
import { VFile } from "vfile"

import type { BuildCtx } from "./ctx"
import type { ProcessedContent } from "../plugins/vfile"

const gzipAsync = promisify(gzip)
const gunzipAsync = promisify(gunzip)
const PARSE_CACHE_SCHEMA_VERSION = 2

class UnsupportedCacheValue extends Error {}

function sha256(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex")
}

function pack(value: unknown, seen = new WeakSet<object>()): unknown {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value
  }
  if (typeof value === "undefined") return { $quartzCache: "undefined" }
  if (typeof value === "bigint") return { $quartzCache: "bigint", value: value.toString() }
  if (typeof value === "function" || typeof value === "symbol") {
    throw new UnsupportedCacheValue(`Unsupported parsed value: ${typeof value}`)
  }
  if (value instanceof Date) return { $quartzCache: "date", value: value.toISOString() }
  if (value instanceof URL) return { $quartzCache: "url", value: value.toString() }
  if (value instanceof Map) {
    if (seen.has(value)) throw new UnsupportedCacheValue("Cyclic parsed map cannot be cached")
    seen.add(value)
    const entries = [...value.entries()].map(([key, item]) => [pack(key, seen), pack(item, seen)])
    seen.delete(value)
    return { $quartzCache: "map", entries }
  }
  if (value instanceof Set) {
    if (seen.has(value)) throw new UnsupportedCacheValue("Cyclic parsed set cannot be cached")
    seen.add(value)
    const values = [...value].map((item) => pack(item, seen))
    seen.delete(value)
    return { $quartzCache: "set", values }
  }
  if (Buffer.isBuffer(value)) return { $quartzCache: "buffer", value: value.toString("base64") }
  if (ArrayBuffer.isView(value)) {
    return {
      $quartzCache: "bytes",
      value: Buffer.from(value.buffer, value.byteOffset, value.byteLength).toString("base64"),
    }
  }
  if (Array.isArray(value)) {
    if (seen.has(value)) throw new UnsupportedCacheValue("Cyclic parsed array cannot be cached")
    seen.add(value)
    const output = value.map((item) => pack(item, seen))
    seen.delete(value)
    return output
  }
  if (typeof value === "object") {
    if (seen.has(value)) throw new UnsupportedCacheValue("Cyclic parsed value cannot be cached")
    seen.add(value)
    const prototype = Object.getPrototypeOf(value)
    if (prototype !== Object.prototype && prototype !== null) {
      throw new UnsupportedCacheValue(
        `Unsupported parsed object: ${prototype?.constructor?.name ?? "unknown"}`,
      )
    }
    const output: Record<string, unknown> = {}
    for (const key of Object.keys(value).sort()) {
      output[key] = pack((value as Record<string, unknown>)[key], seen)
    }
    seen.delete(value)
    return output
  }
  throw new UnsupportedCacheValue("Unsupported parsed value")
}

function unpack(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(unpack)
  if (!value || typeof value !== "object") return value
  const source = value as Record<string, unknown>
  switch (source.$quartzCache) {
    case "undefined":
      return undefined
    case "bigint":
      return BigInt(String(source.value))
    case "date":
      return new Date(String(source.value))
    case "url":
      return new URL(String(source.value))
    case "bytes":
      return Uint8Array.from(Buffer.from(String(source.value), "base64"))
    case "buffer":
      return Buffer.from(String(source.value), "base64")
    case "map":
      return new Map(
        (source.entries as Array<[unknown, unknown]>).map(([key, item]) => [
          unpack(key),
          unpack(item),
        ]),
      )
    case "set":
      return new Set((source.values as unknown[]).map(unpack))
    default: {
      const output: Record<string, unknown> = {}
      for (const [key, item] of Object.entries(source)) output[key] = unpack(item)
      return output
    }
  }
}

function contentContext(ctx: BuildCtx): string {
  const payload = {
    schemaVersion: PARSE_CACHE_SCHEMA_VERSION,
    codeFingerprint: process.env.SITE_PARSE_CODE_FINGERPRINT,
    contentRoot: path.resolve(ctx.argv.directory),
  }
  return sha256(JSON.stringify(payload))
}

async function cacheDirectorySize(directory: string): Promise<number> {
  let bytes = 0
  let entries
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return 0
    throw error
  }
  for (const entry of entries) {
    const filePath = path.join(directory, entry.name)
    if (entry.isDirectory()) bytes += await cacheDirectorySize(filePath)
    else if (entry.isFile()) bytes += Number((await stat(filePath)).size)
  }
  return bytes
}

async function pruneOtherContexts(cacheRoot: string, currentContext: string): Promise<void> {
  let entries
  try {
    entries = await readdir(cacheRoot, { withFileTypes: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return
    throw error
  }
  await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && entry.name !== currentContext)
      .map((entry) => rm(path.join(cacheRoot, entry.name), { recursive: true, force: true })),
  )
}

export class ProcessedContentCache {
  private bytesUsed: number
  private readonly maxBytes: number

  private constructor(
    private readonly directory: string,
    private readonly contextFingerprint: string,
    bytesUsed: number,
    maxBytes: number,
  ) {
    this.bytesUsed = bytesUsed
    this.maxBytes = maxBytes
  }

  static async create(ctx: BuildCtx): Promise<ProcessedContentCache | undefined> {
    const cacheRoot = process.env.SITE_PARSE_CACHE_DIR
    if (!cacheRoot || !process.env.SITE_PARSE_CODE_FINGERPRINT) return undefined
    let contextFingerprint: string
    try {
      contextFingerprint = contentContext(ctx)
    } catch (error) {
      console.warn(
        `[parse-cache] disabled: ${error instanceof Error ? error.message : String(error)}`,
      )
      return undefined
    }
    try {
      await mkdir(cacheRoot, { recursive: true })
      await pruneOtherContexts(cacheRoot, contextFingerprint)
      const directory = path.join(cacheRoot, contextFingerprint)
      await mkdir(directory, { recursive: true })
      const configuredMaximum = Number(process.env.SITE_PARSE_CACHE_MAX_BYTES ?? 805306368)
      const maxBytes =
        Number.isSafeInteger(configuredMaximum) && configuredMaximum > 0
          ? configuredMaximum
          : 805306368
      return new ProcessedContentCache(
        directory,
        contextFingerprint,
        await cacheDirectorySize(directory),
        maxBytes,
      )
    } catch (error) {
      console.warn(
        `[parse-cache] disabled: ${error instanceof Error ? error.message : String(error)}`,
      )
      return undefined
    }
  }

  async get(filePath: string): Promise<{ key: string; content?: ProcessedContent }> {
    const absolutePath = path.resolve(filePath)
    let key: string
    try {
      const bytes = await readFile(absolutePath)
      key = sha256(
        JSON.stringify({
          schemaVersion: PARSE_CACHE_SCHEMA_VERSION,
          context: this.contextFingerprint,
          filePath: absolutePath,
          content: sha256(bytes),
        }),
      )
    } catch {
      return { key: "" }
    }
    const cachePath = path.join(this.directory, `${key}.json.gz`)
    try {
      const compressed = await readFile(cachePath)
      const parsed = JSON.parse((await gunzipAsync(compressed)).toString("utf8")) as {
        schemaVersion?: number
        key?: string
        value?: unknown
      }
      if (parsed.schemaVersion !== PARSE_CACHE_SCHEMA_VERSION || parsed.key !== key) {
        throw new Error("parse cache entry schema or key does not match")
      }
      const decoded = unpack(parsed.value) as {
        ast: ProcessedContent[0]
        vfile: Record<string, unknown>
      }
      const restoredFile = decoded.vfile as {
        cwd?: string
        history?: string[]
        path?: string
        value?: string | Uint8Array
        map?: VFile["map"]
        result?: unknown
        stored?: boolean
        data?: VFile["data"]
      }
      const file = new VFile({
        cwd: restoredFile.cwd,
        history: restoredFile.history,
        path: restoredFile.path,
        value: restoredFile.value,
        map: restoredFile.map,
        result: restoredFile.result,
        stored: restoredFile.stored,
      })
      file.data = restoredFile.data ?? {}
      file.messages = []
      return { key, content: [decoded.ast, file] }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.warn(
          `[parse-cache] discarded invalid entry: ${error instanceof Error ? error.message : String(error)}`,
        )
        await rm(cachePath, { force: true }).catch(() => {})
      }
      return { key }
    }
  }

  async put(key: string, content: ProcessedContent): Promise<boolean> {
    const [ast, file] = content
    if (file.messages.length > 0) return false
    let packed: unknown
    try {
      packed = pack({
        ast,
        vfile: {
          cwd: file.cwd,
          history: file.history,
          path: file.path,
          value: String(file.value ?? ""),
          map: file.map,
          result: file.result,
          stored: file.stored,
          data: file.data,
        },
      })
    } catch {
      return false
    }
    let compressed: Buffer
    try {
      compressed = await gzipAsync(
        Buffer.from(
          JSON.stringify({ schemaVersion: PARSE_CACHE_SCHEMA_VERSION, key, value: packed }),
          "utf8",
        ),
      )
    } catch {
      return false
    }
    const cachePath = path.join(this.directory, `${key}.json.gz`)
    let previousBytes = 0
    try {
      previousBytes = Number((await stat(cachePath)).size)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") return false
    }
    if (this.bytesUsed - previousBytes + compressed.byteLength > this.maxBytes) return false
    const temporaryPath = `${cachePath}.${randomUUID()}.tmp`
    try {
      await writeFile(temporaryPath, compressed, { flag: "wx" })
      await rename(temporaryPath, cachePath)
      this.bytesUsed = this.bytesUsed - previousBytes + compressed.byteLength
      return true
    } catch {
      await rm(temporaryPath, { force: true })
      return false
    }
  }
}
