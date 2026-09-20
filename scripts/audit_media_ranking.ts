import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"
import {
  emptyGalleryState,
  evaluateGalleryRanking,
  mediaDuplicateFingerprints,
  rankMediaEntries,
} from "../quartz/util/mediaGallery"
import type { MediaEntry } from "../quartz/util/objectMedia"
import { cleanText } from "../quartz/util/objectMedia"

type JsonRecord = Record<string, unknown>

function argument(name: string): string {
  const index = process.argv.indexOf(name)
  return index >= 0 ? cleanText(process.argv[index + 1]) : ""
}

function readJsonPayload(filePath: string): unknown {
  const text = fs.readFileSync(filePath, "utf8")
  try {
    return JSON.parse(text)
  } catch {
    return text
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line))
  }
}

function catalogEntries(payload: unknown): MediaEntry[] {
  let entries: unknown[] = []
  if (Array.isArray(payload)) entries = payload
  else if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as JsonRecord).entries)
  ) {
    entries = (payload as JsonRecord).entries as unknown[]
  }
  return entries.filter((entry): entry is MediaEntry => Boolean(entry && typeof entry === "object"))
}

export function parseMediaRankingTelemetryCsv(text: string): JsonRecord[] {
  const rows: string[][] = []
  let row: string[] = []
  let value = ""
  let quoted = false
  for (let index = 0; index < text.length; index++) {
    const char = text[index]
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        value += '"'
        index += 1
      } else if (char === '"') quoted = false
      else value += char
    } else if (char === '"') quoted = true
    else if (char === ",") {
      row.push(value)
      value = ""
    } else if (char === "\n") {
      row.push(value.replace(/\r$/, ""))
      rows.push(row)
      row = []
      value = ""
    } else value += char
  }
  if (value || row.length) {
    row.push(value.replace(/\r$/, ""))
    rows.push(row)
  }
  const headers = rows.shift()?.map((header) => header.trim()) ?? []
  return rows
    .filter((values) => values.some(Boolean))
    .map((values) =>
      Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
    )
}

function telemetryRecords(filePath: string): JsonRecord[] {
  const text = fs.readFileSync(filePath, "utf8")
  if (path.extname(filePath).toLowerCase() === ".csv") return parseMediaRankingTelemetryCsv(text)
  const payload = readJsonPayload(filePath)
  if (Array.isArray(payload)) {
    return payload.filter((record): record is JsonRecord =>
      Boolean(record && typeof record === "object"),
    )
  }
  if (!payload || typeof payload !== "object") return []
  const object = payload as JsonRecord
  if (Array.isArray(object.events)) return telemetryRecordsFromUnknown(object.events)
  if (Array.isArray(object.rows)) {
    const dimensionHeaders = Array.isArray(object.dimensionHeaders)
      ? object.dimensionHeaders.map((header) => cleanText((header as JsonRecord | undefined)?.name))
      : []
    return object.rows.flatMap((row) => {
      if (!row || typeof row !== "object") return []
      const values = Array.isArray((row as JsonRecord).dimensionValues)
        ? ((row as JsonRecord).dimensionValues as unknown[])
        : []
      return [
        Object.fromEntries(
          dimensionHeaders.map((header, index) => [
            header,
            cleanText((values[index] as JsonRecord | undefined)?.value),
          ]),
        ),
      ]
    })
  }
  return [object]
}

function telemetryRecordsFromUnknown(value: unknown[]): JsonRecord[] {
  return value.filter((record): record is JsonRecord =>
    Boolean(record && typeof record === "object"),
  )
}

function eventParameters(record: JsonRecord): JsonRecord {
  const parameters = Array.isArray(record.event_params) ? record.event_params : []
  return Object.fromEntries(
    parameters.flatMap((parameter) => {
      if (!parameter || typeof parameter !== "object") return []
      const item = parameter as JsonRecord
      const key = cleanText(item.key)
      const value = item.value as JsonRecord | undefined
      const resolved =
        value?.string_value ??
        value?.int_value ??
        value?.double_value ??
        value?.float_value ??
        item.value
      return key ? [[key, resolved]] : []
    }),
  )
}

function field(record: JsonRecord, parameters: JsonRecord, ...names: string[]): string {
  for (const name of names) {
    const value = cleanText(record[name] ?? parameters[name])
    if (value) return value
  }
  return ""
}

export function openedMediaIdFromTelemetryRecord(record: JsonRecord): string {
  const parameters = eventParameters(record)
  const eventName = field(record, parameters, "event_name", "eventName", "name").toLowerCase()
  const featureName = field(
    record,
    parameters,
    "feature_name",
    "featureName",
    "customEvent:feature_name",
  ).toLowerCase()
  const featureAction = field(
    record,
    parameters,
    "feature_action",
    "featureAction",
    "action",
    "media_action",
    "customEvent:feature_action",
    "customEvent:media_action",
  ).toLowerCase()
  const isOpen =
    eventName === "gallery_open" ||
    (eventName === "feature_use" && featureName === "media_gallery" && featureAction === "open") ||
    (eventName === "media_gallery" && featureAction === "open")
  return isOpen ? field(record, parameters, "media_id", "mediaId", "customEvent:media_id") : ""
}

function duplicateSummary(entries: MediaEntry[]) {
  const parent = entries.map((_, index) => index)
  const find = (index: number): number => {
    while (parent[index] !== index) {
      parent[index] = parent[parent[index]]
      index = parent[index]
    }
    return index
  }
  const union = (left: number, right: number) => {
    const leftRoot = find(left)
    const rightRoot = find(right)
    if (leftRoot !== rightRoot) parent[rightRoot] = leftRoot
  }
  const fingerprints = new Map<string, number[]>()
  entries.forEach((entry, index) => {
    for (const fingerprint of mediaDuplicateFingerprints(entry)) {
      fingerprints.set(fingerprint, [...(fingerprints.get(fingerprint) ?? []), index])
    }
  })
  for (const indices of fingerprints.values()) {
    const [first, ...rest] = indices
    if (first !== undefined) rest.forEach((index) => union(first, index))
  }
  const hashes = entries
    .map((entry, index) => ({ index, hash: cleanText(entry.perceptualHash).toLowerCase() }))
    .filter(({ hash }) => /^[a-f0-9]+$/i.test(hash))
  for (let left = 0; left < hashes.length; left++) {
    for (let right = 0; right < left; right++) {
      if (hashes[left].hash.length !== hashes[right].hash.length) continue
      let distance = 0
      for (let index = 0; index < hashes[left].hash.length; index++) {
        let xor =
          Number.parseInt(hashes[left].hash[index], 16) ^
          Number.parseInt(hashes[right].hash[index], 16)
        while (xor) {
          distance += xor & 1
          xor >>= 1
        }
      }
      if (distance <= 6) union(hashes[left].index, hashes[right].index)
    }
  }
  const groups = new Map<number, number[]>()
  entries.forEach((_, index) => {
    const root = find(index)
    groups.set(root, [...(groups.get(root) ?? []), index])
  })
  const duplicates = [...groups.values()].filter((indices) => indices.length > 1)
  return {
    fingerprintCoverage: entries.length
      ? entries.filter((entry) => mediaDuplicateFingerprints(entry).length).length / entries.length
      : 0,
    perceptualHashCoverage: entries.length ? hashes.length / entries.length : 0,
    candidateGroupCount: duplicates.length,
    candidateEntryCount: duplicates.reduce((sum, indices) => sum + indices.length, 0),
    candidatePairCount: duplicates.reduce(
      (sum, indices) => sum + (indices.length * (indices.length - 1)) / 2,
      0,
    ),
    largestCandidateGroup: Math.max(0, ...duplicates.map((indices) => indices.length)),
    sampleGroups: duplicates
      .slice(0, 10)
      .map((indices) => indices.map((index) => cleanText(entries[index].mediaId)).filter(Boolean)),
  }
}

export function runMediaRankingAudit(): void {
  if (process.argv.includes("--help")) {
    process.stdout.write(
      [
        "Usage: npm run audit:media-ranking -- [options]",
        "",
        "  --catalog PATH          canonical catalogue JSON",
        "  --telemetry PATH        GA4 JSON, NDJSON, Data API JSON, or CSV export",
        "  --relevance PATH        optional JSON map of media_id to relevance grade",
        "  --first-page-size N     evaluated first-page size (default: 36)",
        "  --output PATH           also write the JSON report to this path",
        "  --fail                  fail when ranking quality thresholds are missed",
        "",
      ].join("\n"),
    )
    return
  }

  const catalogPath = path.resolve(
    argument("--catalog") ||
      process.env.MEDIA_CATALOG_PATH ||
      "quartz/static/mediaCatalogSource.json",
  )
  const telemetryPath = argument("--telemetry") || process.env.MEDIA_RANKING_TELEMETRY
  const relevancePath = argument("--relevance") || process.env.MEDIA_RANKING_RELEVANCE
  const outputPath = argument("--output") || process.env.MEDIA_RANKING_AUDIT_JSON
  const firstPageSize = Math.max(1, Number(argument("--first-page-size") || 36))
  const entries = catalogEntries(readJsonPayload(catalogPath))
  if (!entries.length) throw new Error(`No media entries found in ${catalogPath}`)

  const ranked = rankMediaEntries(entries, emptyGalleryState(), { firstPageSize })
  const catalogIds = new Set(entries.map((entry) => cleanText(entry.mediaId)).filter(Boolean))
  const telemetry = telemetryPath ? telemetryRecords(path.resolve(telemetryPath)) : []
  const openedIds = telemetry.map(openedMediaIdFromTelemetryRecord).filter(Boolean)
  const matchedOpenedIds = new Set(openedIds.filter((mediaId) => catalogIds.has(mediaId)))
  const relevancePayload = relevancePath ? readJsonPayload(path.resolve(relevancePath)) : undefined
  const relevance =
    relevancePayload &&
    typeof relevancePayload === "object" &&
    !Array.isArray(relevancePayload) &&
    (relevancePayload as JsonRecord).relevance &&
    typeof (relevancePayload as JsonRecord).relevance === "object"
      ? ((relevancePayload as JsonRecord).relevance as Record<string, number>)
      : relevancePayload && typeof relevancePayload === "object" && !Array.isArray(relevancePayload)
        ? (relevancePayload as Record<string, number>)
        : undefined
  const evaluation = evaluateGalleryRanking(ranked, {
    relevance,
    openedMediaIds: telemetryPath ? matchedOpenedIds : undefined,
    firstPageSize,
  })
  const report = {
    schema: "ltkb-media-ranking-audit/v1",
    catalogPath,
    catalogEntries: entries.length,
    evaluatedAt: new Date().toISOString(),
    relevanceSource: relevance ? "supplied-judgments" : "ranking-signals",
    duplicateDetection: duplicateSummary(entries),
    telemetry: telemetryPath
      ? {
          path: path.resolve(telemetryPath),
          records: telemetry.length,
          openEventsWithMediaId: openedIds.length,
          matchedUniqueMediaIds: matchedOpenedIds.size,
          unmatchedUniqueMediaIds: new Set(openedIds.filter((mediaId) => !catalogIds.has(mediaId)))
            .size,
        }
      : { status: "not_provided" },
    evaluation,
    firstPageMediaIds: ranked
      .slice(0, firstPageSize)
      .map((entry) => cleanText(entry.mediaId))
      .filter(Boolean),
  }

  const serialized = `${JSON.stringify(report, null, 2)}\n`
  if (outputPath) fs.writeFileSync(path.resolve(outputPath), serialized)
  process.stdout.write(serialized)

  if (process.argv.includes("--fail")) {
    const failed =
      evaluation.ndcgAt12 < 0.85 ||
      evaluation.nearDuplicateRate > 0.1 ||
      evaluation.firstPageUniqueObjectCount < Math.min(12, firstPageSize)
    if (failed) process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  runMediaRankingAudit()
}
