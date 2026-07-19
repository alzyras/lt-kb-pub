import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import {
  CITATION_SECTION_TITLES,
  EvidenceEntry,
  normalizeEvidenceId,
  parseEvidenceSections,
} from "../quartz/util/citationFilter"

const DEFAULT_BASELINE = "243e80db6bad18776ff6134c34f72da62f973e38"
const baselineCommit =
  process.argv.slice(2).find((argument) => !argument.startsWith("--")) ?? DEFAULT_BASELINE
const writeChanges = process.argv.includes("--write")
const baselineDirectory = process.env.EVIDENCE_BASELINE_DIR

interface EntrySpan extends EvidenceEntry {
  start: number
  end: number
  section: string
}

function listMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdownFiles(entryPath)
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : []
  })
}

function normalizeText(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/\u00ad/g, "")
    .replace(/[\s\u00a0]+/g, " ")
    .trim()
    .toLowerCase()
}

function claimKey(text: string): string {
  return normalizeText(text.replace(/^['"]|['"]$/g, ""))
}

function quoteKey(text: string): string {
  return normalizeText(text).replace(/[—–-]/g, " ").replace(/\s+/g, " ")
}

function quoteText(entry: EvidenceEntry): string {
  return entry.fields.get("citata_originali") ?? entry.fields.get("citata") ?? ""
}

function evidenceTokens(text: string): Set<string> {
  return new Set(
    (
      text
        .normalize("NFKD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .match(/[a-z0-9]{4,}/g) ?? []
    ).filter(
      (token) =>
        ![
          "apie",
          "buvo",
          "kaip",
          "kad",
          "kuris",
          "savo",
          "su",
          "ir",
          "bei",
          "metu",
          "metais",
        ].includes(token),
    ),
  )
}

function claimCitationOverlap(claim: EvidenceEntry, citation: EvidenceEntry): number {
  const claimWords = evidenceTokens(claim.fields.get("teiginys") ?? "")
  const citationWords = evidenceTokens(quoteText(citation))
  return [...claimWords].filter((token) => citationWords.has(token)).length
}

function parseEntrySpans(markdown: string): EntrySpan[] {
  const lines = markdown.split(/\r?\n/)
  const entries: EntrySpan[] = []
  let section = ""

  for (let index = 0; index < lines.length; index++) {
    const heading = lines[index].match(/^##\s+(.+?)\s*$/)
    if (heading) {
      section = heading[1].trim()
      continue
    }
    const idMatch = lines[index].match(/^-\s+(?:id:\s*)?([tcq]-\d{3,})\s*$/i)
    if (!idMatch) continue

    const start = index
    let end = index + 1
    while (end < lines.length) {
      if (lines[end].startsWith("## ")) break
      if (end > start && lines[end].trim() && /^-\s+(?:id:\s*)?[tcq]-\d{3,}\s*$/i.test(lines[end]))
        break
      end++
    }
    const parsed = parseEvidenceSections(
      `## ${section}\n${lines.slice(start, end).join("\n")}`,
    ).get(section)?.[0]
    if (parsed) entries.push({ ...parsed, start, end, section })
    index = end - 1
  }
  return entries
}

function allCitations(markdown: string): EvidenceEntry[] {
  const sections = parseEvidenceSections(markdown)
  return [...sections.entries()]
    .filter(([title]) => CITATION_SECTION_TITLES.has(title))
    .flatMap(([, entries]) => entries)
    .filter((entry) => entry.id.startsWith("c-"))
}

function entryRaw(markdown: string, span: EntrySpan): string {
  const lines = markdown.split(/\r?\n/)
  return lines.slice(span.start, span.end).join("\n")
}

function citationBacklinkCount(entry: EvidenceEntry): number {
  return (entry.lists.get("pagrindžia") ?? entry.lists.get("pagrindzia") ?? []).length
}

function removeEntrySpans(markdown: string, spansToRemove: EntrySpan[]): string {
  if (spansToRemove.length === 0) return markdown
  const lines = markdown.split(/\r?\n/)
  for (const span of [...spansToRemove].sort((left, right) => right.start - left.start)) {
    let start = span.start
    if (start > 0 && /^<a id="claim-[^"]+"><\/a>$/.test(lines[start - 1])) {
      start -= 1
    }
    lines.splice(start, span.end - start)
  }
  return lines.join("\n")
}

function removeLineInSpan(
  markdown: string,
  span: EntrySpan,
  predicate: (line: string) => boolean,
): string {
  const lines = markdown.split(/\r?\n/)
  for (let index = span.start; index < span.end; index++) {
    if (predicate(lines[index])) {
      lines.splice(index, 1)
      return lines.join("\n")
    }
  }
  return markdown
}

function dedupeClaims(markdown: string): string {
  const sections = parseEvidenceSections(markdown)
  const claims = (sections.get("Teiginiai") ?? []).filter((entry) => entry.id.startsWith("t-"))
  const groups = new Map<string, EntrySpan[]>()
  const spans = parseEntrySpans(markdown)
  const claimSpans = spans.filter(
    (span) => span.section === "Teiginiai" && span.id.startsWith("t-"),
  )
  const appendedLegacySpans = claimSpans.filter((span) => /^t-3(?:8[89]|9[0-8])$/.test(span.id))
  if (appendedLegacySpans.length > 0) {
    return dedupeClaims(removeEntrySpans(markdown, appendedLegacySpans))
  }

  const byText = new Map<string, EntrySpan[]>()
  for (const span of claimSpans) {
    const key = claimKey(span.fields.get("teiginys") ?? "")
    if (key) byText.set(key, [...(byText.get(key) ?? []), span])
  }
  const exactDuplicateSpans = [...byText.values()]
    .filter((group) => group.length > 1)
    .flatMap((group) => {
      const keep = group.reduce((best, candidate) => {
        const score = (candidate.fields.get("global_id") ? 1000 : 0) + candidate.fields.size
        const bestScore = (best.fields.get("global_id") ? 1000 : 0) + best.fields.size
        return score > bestScore ? candidate : best
      }, group[0])
      return group.filter((candidate) => candidate !== keep)
    })
  if (exactDuplicateSpans.length > 0) {
    return dedupeClaims(removeEntrySpans(markdown, exactDuplicateSpans))
  }

  for (const claim of claims) {
    const globalId = claim.fields.get("global_id")?.trim()
    if (!globalId) continue
    const span = claimSpans.find(
      (candidate) =>
        candidate.id === claim.id && candidate.fields.get("global_id")?.trim() === globalId,
    )
    if (span) groups.set(globalId, [...(groups.get(globalId) ?? []), span])
  }

  let result = markdown
  for (const [globalId, group] of groups) {
    if (group.length < 2) continue
    const groupEntries = group
      .map((span) =>
        claims.find(
          (claim) => claim.id === span.id && claim.fields.get("global_id")?.trim() === globalId,
        ),
      )
      .filter((entry): entry is EvidenceEntry => Boolean(entry))
    const textKeys = new Set(
      groupEntries.map((entry) => claimKey(entry.fields.get("teiginys") ?? "")),
    )
    if (textKeys.size === 1) {
      const keepIndex = groupEntries.reduce((best, entry, index, entries) => {
        const score =
          entry.fields.size * 10 +
          (entry.lists.get("pagrindžia") ?? entry.lists.get("pagrindzia") ?? []).length
        const bestScore =
          entries[best].fields.size * 10 +
          (entries[best].lists.get("pagrindžia") ?? entries[best].lists.get("pagrindzia") ?? [])
            .length
        return score > bestScore ? index : best
      }, 0)
      const keepId = groupEntries[keepIndex].id
      const remove = group.filter((span) => span.id !== keepId)
      result = removeEntrySpans(result, remove)
      continue
    }

    // The merged Vytautas projection appended an older copy of the same
    // evidence block. Those entries have no surviving citation records.
    if (
      globalId.startsWith("t-2014") &&
      group.some((span) => /^t-3(?:88|89|9[0-8])$/.test(span.id))
    ) {
      result = removeEntrySpans(
        result,
        group.filter((span) => /^t-3(?:88|89|9[0-8])$/.test(span.id)),
      )
      continue
    }

    // Keep both facts, but do not leave an ambiguous global identifier on
    // the later legacy entry. Local ids remain valid within the page.
    const duplicate = group.sort((left, right) => left.start - right.start).slice(1)
    for (const span of duplicate.sort((left, right) => right.start - left.start)) {
      result = removeLineInSpan(result, span, (line) => /^\s*global_id\s*:/.test(line))
    }
  }
  return result
}

function dedupeCitationIds(markdown: string): string {
  const sections = parseEvidenceSections(markdown)
  const spans = parseEntrySpans(markdown).filter((span) => span.id.startsWith("c-"))
  const groups = new Map<string, EntrySpan[]>()
  for (const span of spans) groups.set(span.id, [...(groups.get(span.id) ?? []), span])
  let result = markdown
  for (const [citationId, group] of groups) {
    if (group.length < 2) continue
    const entries = group
      .map((span) => sections.get(span.section)?.find((entry) => entry.id === citationId))
      .filter((entry): entry is EvidenceEntry => Boolean(entry))
    const keepIndex = entries.reduce(
      (best, entry, index, values) =>
        citationBacklinkCount(entry) > citationBacklinkCount(values[best]) ? index : best,
      0,
    )
    result = removeEntrySpans(
      result,
      group.filter((_span, index) => index !== keepIndex),
    )
  }
  return result
}

function appendCitationBlocks(markdown: string, blocks: string[]): string {
  if (blocks.length === 0) return markdown
  const lines = markdown.split(/\r?\n/)
  const headingIndex = lines.findIndex((line) => line.trim() === "## Citatos")
  if (headingIndex < 0) {
    return `${markdown.trimEnd()}\n\n## Citatos\n\n${blocks.join("\n")}`
  }
  let end = headingIndex + 1
  while (end < lines.length && !lines[end].startsWith("## ")) end++
  const prefix = lines.slice(0, end).join("\n").replace(/\s*$/, "")
  const suffix = lines.slice(end).join("\n")
  return `${prefix}\n${blocks.join("\n")}\n${suffix}`
}

function replaceList(lines: string[], span: EntrySpan, keys: string[], values: string[]): boolean {
  const keyIndex = lines.findIndex(
    (line, index) =>
      index >= span.start &&
      index < span.end &&
      new RegExp(`^\\s*(${keys.join("|")})\\s*:\\s*$`).test(line),
  )
  if (keyIndex < 0) return false

  const keyIndent = lines[keyIndex].match(/^\s*/)?.[0] ?? ""
  let listEnd = keyIndex + 1
  while (listEnd < span.end) {
    const line = lines[listEnd]
    if (line.trim() && (line.match(/^\s*/)?.[0].length ?? 0) <= keyIndent.length) break
    listEnd++
  }
  const nextLines = values.map((value) => `${keyIndent}  - ${value}`)
  lines.splice(keyIndex + 1, listEnd - keyIndex - 1, ...nextLines)
  return true
}

function rewriteCitationBacklinks(markdown: string): string {
  const sections = parseEvidenceSections(markdown)
  const claims = (sections.get("Teiginiai") ?? []).filter((entry) => entry.id.startsWith("t-"))
  const citations = allCitations(markdown)
  const citationIds = new Set(citations.map((citation) => citation.id))
  const backlinks = new Map<string, Set<string>>()

  for (const claim of claims) {
    const claimReference = claim.fields.get("global_id")?.trim() || claim.id
    for (const rawCitationId of claim.lists.get("pagrindžia") ??
      claim.lists.get("pagrindzia") ??
      []) {
      const citationId = normalizeEvidenceId(rawCitationId)
      if (!citationIds.has(citationId)) continue
      backlinks.set(citationId, new Set([...(backlinks.get(citationId) ?? []), claimReference]))
    }
  }

  const lines = markdown.split(/\r?\n/)
  const spans = parseEntrySpans(markdown)
    .filter((span) => span.id.startsWith("c-"))
    .sort((left, right) => right.start - left.start)
  for (const span of spans) {
    const values = [...(backlinks.get(span.id) ?? [])]
    replaceList(lines, span, ["pagrindžia", "pagrindzia"], values)
  }
  return lines.join("\n")
}

function baselineText(relativePath: string): string | null {
  if (baselineDirectory) {
    const baselinePath = path.join(baselineDirectory, relativePath)
    return fs.existsSync(baselinePath) ? fs.readFileSync(baselinePath, "utf8") : null
  }
  try {
    return execFileSync("git", ["show", `${baselineCommit}:${relativePath}`], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
  } catch {
    return null
  }
}

function repairFile(filePath: string): { changed: boolean; changedLinks: number } {
  const relativePath = path.relative(process.cwd(), filePath)
  const baseline = baselineText(relativePath)
  if (!baseline) return { changed: false, changedLinks: 0 }

  const originalMarkdown = fs.readFileSync(filePath, "utf8")
  const currentMarkdown = dedupeClaims(originalMarkdown)
  const baselineSections = parseEvidenceSections(baseline)
  const currentSections = parseEvidenceSections(currentMarkdown)
  const baselineClaims = baselineSections.get("Teiginiai") ?? []
  const currentClaims = currentSections.get("Teiginiai") ?? []
  let repairedMarkdown = currentMarkdown
  let currentCitations = allCitations(repairedMarkdown)
  const baselineCitations = allCitations(baseline)
  const baselineCitationById = new Map(baselineCitations.map((citation) => [citation.id, citation]))
  const currentByQuote = () => {
    const byQuote = new Map<string, EvidenceEntry[]>()
    for (const citation of allCitations(repairedMarkdown)) {
      const key = quoteKey(quoteText(citation))
      if (!key) continue
      byQuote.set(key, [...(byQuote.get(key) ?? []), citation])
    }
    return byQuote
  }

  const currentByClaim = new Map<string, EvidenceEntry[]>()
  for (const claim of currentClaims) {
    const key = claimKey(claim.fields.get("teiginys") ?? "")
    if (key) currentByClaim.set(key, [...(currentByClaim.get(key) ?? []), claim])
  }

  const expectedByClaim = new Map<string, Set<string>>()
  const expectedClaimByCitation = new Map<string, Set<string>>()
  const citationBlocksToAppend: string[] = []
  const citationBlocksToAppendIds = new Set<string>()
  const baselineCitationSpans = parseEntrySpans(baseline).filter((span) => span.id.startsWith("c-"))
  const baselineRawById = new Map(
    baselineCitationSpans.map((span) => [span.id, entryRaw(baseline, span)]),
  )

  for (const baselineClaim of baselineClaims) {
    const key = claimKey(baselineClaim.fields.get("teiginys") ?? "")
    if (!key || (currentByClaim.get(key) ?? []).length !== 1) continue
    for (const baselineCitationId of baselineClaim.lists.get("pagrindžia") ?? []) {
      const normalizedBaselineCitationId = normalizeEvidenceId(baselineCitationId)
      const baselineCitation = baselineCitationById.get(normalizedBaselineCitationId)
      if (!baselineCitation) continue
      const matchingCurrent = currentByQuote().get(quoteKey(quoteText(baselineCitation))) ?? []
      let currentCitationId = matchingCurrent.sort(
        (left, right) => citationBacklinkCount(right) - citationBacklinkCount(left),
      )[0]?.id
      if (
        !currentCitationId &&
        !currentCitations.some((citation) => citation.id === normalizedBaselineCitationId)
      ) {
        const rawBlock = baselineRawById.get(normalizedBaselineCitationId)
        if (rawBlock) {
          if (!citationBlocksToAppendIds.has(normalizedBaselineCitationId)) {
            citationBlocksToAppend.push(rawBlock)
            citationBlocksToAppendIds.add(normalizedBaselineCitationId)
          }
          currentCitationId = normalizedBaselineCitationId
        }
      }
      if (!currentCitationId) continue
      expectedByClaim.set(key, new Set([...(expectedByClaim.get(key) ?? []), currentCitationId]))
      expectedClaimByCitation.set(
        currentCitationId,
        new Set([...(expectedClaimByCitation.get(currentCitationId) ?? []), key]),
      )
    }
  }

  repairedMarkdown = appendCitationBlocks(repairedMarkdown, citationBlocksToAppend)
  currentCitations = allCitations(repairedMarkdown)

  const spans = parseEntrySpans(currentMarkdown)
  const spanById = new Map(spans.map((span) => [`${span.section}:${span.id}`, span]))
  const lines = repairedMarkdown.split(/\r?\n/)
  let changedLinks = 0
  const currentCitationIds = new Set(currentCitations.map((citation) => citation.id))

  const claimsToRepair = currentClaims
    .filter((entry) => entry.id.startsWith("t-"))
    .sort(
      (left, right) =>
        (spanById.get(`Teiginiai:${right.id}`)?.start ?? -1) -
        (spanById.get(`Teiginiai:${left.id}`)?.start ?? -1),
    )
  for (const claim of claimsToRepair) {
    const key = claimKey(claim.fields.get("teiginys") ?? "")
    const expected = expectedByClaim.get(key)
    const currentRefs = claim.lists.get("pagrindžia") ?? claim.lists.get("pagrindzia") ?? []
    const mappedMissingRefs = new Map<string, string>()
    for (const rawCitationId of currentRefs) {
      const normalizedCitationId = normalizeEvidenceId(rawCitationId)
      if (currentCitationIds.has(normalizedCitationId)) continue
      const baselineCitation = baselineCitationById.get(normalizedCitationId)
      let replacement = baselineCitation
        ? (currentByQuote().get(quoteKey(quoteText(baselineCitation))) ?? []).sort(
            (left, right) => citationBacklinkCount(right) - citationBacklinkCount(left),
          )[0]
        : undefined
      if (!replacement) {
        const candidates = allCitations(repairedMarkdown)
          .map((citation) => ({ citation, score: claimCitationOverlap(claim, citation) }))
          .filter(({ score }) => score >= 3)
          .sort((left, right) => right.score - left.score)
        if (candidates.length > 0 && candidates[0].score > (candidates[1]?.score ?? 0)) {
          replacement = candidates[0].citation
        }
      }
      if (replacement) mappedMissingRefs.set(normalizedCitationId, replacement.id)
    }
    const hasMissingRefs = currentRefs.some(
      (citationId) => !currentCitationIds.has(normalizeEvidenceId(citationId)),
    )
    if (!expected && mappedMissingRefs.size === 0 && !hasMissingRefs) continue
    const nextRefs = currentRefs.filter((citationId) => {
      const normalizedCitationId = normalizeEvidenceId(citationId)
      if (!currentCitationIds.has(normalizedCitationId)) return false
      const owners = expectedClaimByCitation.get(normalizedCitationId)
      return !owners || owners.has(key)
    })
    for (const citationId of mappedMissingRefs.values())
      if (!nextRefs.includes(citationId)) nextRefs.push(citationId)
    for (const citationId of expected ?? [])
      if (!nextRefs.includes(citationId)) nextRefs.push(citationId)
    const uniqueRefs = [...new Set(nextRefs)]
    if (uniqueRefs.join("|") === currentRefs.join("|")) continue
    const span = spanById.get(`Teiginiai:${claim.id}`)
    if (span && replaceList(lines, span, ["pagrindžia", "pagrindzia"], uniqueRefs)) changedLinks++
  }

  repairedMarkdown = rewriteCitationBacklinks(lines.join("\n"))
  repairedMarkdown = dedupeCitationIds(repairedMarkdown)
  repairedMarkdown = rewriteCitationBacklinks(repairedMarkdown)
  if (writeChanges && (changedLinks > 0 || repairedMarkdown !== originalMarkdown)) {
    fs.writeFileSync(filePath, repairedMarkdown)
  }
  if (repairedMarkdown !== originalMarkdown) changedLinks++
  return { changed: changedLinks > 0, changedLinks }
}

const files = listMarkdownFiles(path.resolve("objektai"))
let changedFiles = 0
let changedLinks = 0
const changedPaths: string[] = []
for (const filePath of files) {
  const result = repairFile(filePath)
  if (result.changed) {
    changedFiles++
    changedPaths.push(path.relative(process.cwd(), filePath))
  }
  changedLinks += result.changedLinks
}

console.log(
  JSON.stringify({
    baselineCommit,
    writeChanges,
    files: files.length,
    changedFiles,
    changedLinks,
    changedPaths,
  }),
)
