import fs from "node:fs"
import path from "node:path"
import {
  CITATION_SECTION_TITLES,
  normalizeEvidenceId,
  parseEvidenceSections,
} from "../quartz/util/citationFilter"
import {
  evidenceCitationQuoteForClaim,
  evidenceDocumentContext,
  evidenceSupportsClaim,
} from "../quartz/util/evidenceIntegrity"
import { INTENTIONAL_IGNORED_OBJECT_PAGES } from "../quartz/util/contentPaths"
import { createUniqueSlugMap, FilePath } from "../quartz/util/path"

const objectRoot = path.resolve(process.env.CORPUS_ROOT ?? "objektai")
const publicRoot = path.resolve(process.env.PUBLIC_ROOT ?? "public")

function listMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdownFiles(entryPath)
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : []
  })
}

function htmlDecode(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
}

function renderedLocalClaimKey(localId: string, index: number, usedKeys: Set<string>): string {
  const base =
    localId
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || `claim-${index + 1}`
  let candidate = base
  if (usedKeys.has(candidate)) candidate = `${base}-${index + 1}`
  let suffix = 2
  while (usedKeys.has(candidate)) {
    candidate = `${base}-${index + 1}-${suffix}`
    suffix += 1
  }
  usedKeys.add(candidate)
  return candidate
}

function claimAssetHtml(pageHtml: string, domKey: string): string | null {
  const escapedKey = domKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = pageHtml.match(
    new RegExp(
      `data-claim-detail="${escapedKey}"[\\s\\S]*?data-claim-detail-url="([^"]+)"`,
    ),
  )
  if (!match) return null
  const assetPath = path.join(publicRoot, decodeURIComponent(match[1].replace(/^\//, "")))
  if (!fs.existsSync(assetPath)) return null
  const raw = htmlDecode(fs.readFileSync(assetPath, "utf8"))
  try {
    return JSON.parse(raw) as string
  } catch {
    return null
  }
}

function citationCard(assetHtml: string, citationId: string): string | null {
  const escapedId = citationId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return (
    assetHtml.match(
      new RegExp(
        `<article class="([^"]*claim-citation-card[^"]*)" data-claim-citation-id="${escapedId}">[\\s\\S]*?<\\/article>`,
      ),
    )?.[0] ?? null
  )
}

function hiddenClaimGlobalIds(markdown: string): string[] {
  const heading = markdown.search(/^##\s+Teiginiai\s*$/m)
  if (heading < 0) return []
  const bodyStart = markdown.indexOf("\n", heading) + 1
  if (bodyStart <= 0) return []
  const body = markdown.slice(bodyStart)
  const nextHeading = body.search(/^##\s+/m)
  const section = nextHeading >= 0 ? body.slice(0, nextHeading) : body
  const ids: string[] = []
  let pending = ""
  for (const line of section.split("\n")) {
    const anchor = line.match(/^\s*<a\s+id=["']claim-(t-\d+)["']\s*><\/a>\s*$/i)
    if (anchor) {
      pending = anchor[1]
      continue
    }
    if (/^\s*-\s+t-\d+\s*$/i.test(line)) {
      ids.push(pending)
      pending = ""
    }
  }
  return ids
}

const issues: Array<{ file: string; claim: string; citation?: string; reason: string }> = []
const ignoredSourcePaths = new Set<string>(INTENTIONAL_IGNORED_OBJECT_PAGES)
const sourceFiles = listMarkdownFiles(objectRoot)
const slugMap = createUniqueSlugMap(
  sourceFiles.map((file) => path.relative(process.cwd(), file) as FilePath),
)

for (const file of sourceFiles) {
  const relativePath = path.relative(process.cwd(), file) as FilePath
  if (ignoredSourcePaths.has(relativePath)) continue
  const markdown = fs.readFileSync(file, "utf8")
  const sections = parseEvidenceSections(markdown)
  const claims = (sections.get("Teiginiai") ?? []).filter((entry) => entry.id.startsWith("t-"))
  if (claims.length === 0) continue

  const citations = [...sections.entries()]
    .filter(([title]) => CITATION_SECTION_TITLES.has(title))
    .flatMap(([, entries]) => entries)
    .filter((entry) => entry.id.startsWith("c-"))
  const citationById = new Map(citations.map((entry) => [entry.id, entry]))
  const slug = slugMap.get(relativePath)
  if (!slug) {
    issues.push({ file: relativePath, claim: "", reason: "Missing source slug mapping" })
    continue
  }
  const htmlCandidates = [
    path.join(publicRoot, `${slug}.html`),
    path.join(publicRoot, slug, "index.html"),
  ]
  const htmlPath = htmlCandidates.find((candidate) => fs.existsSync(candidate))
  if (!htmlPath) {
    issues.push({
      file: relativePath,
      claim: "",
      reason: `Missing rendered page; tried ${htmlCandidates.join(", ")}`,
    })
    continue
  }
  const pageHtml = fs.readFileSync(htmlPath, "utf8")
  const context = evidenceDocumentContext(markdown)
  const renderedKeys = new Set<string>()
  const renderedLocalKeys = new Set<string>()
  const hiddenGlobals = hiddenClaimGlobalIds(markdown)

  claims.forEach((claim, index) => {
    const globalId = claim.fields.get("global_id")?.trim() || hiddenGlobals[index]
    const globalKey = (globalId || `${claim.id}-${index + 1}`).toLowerCase()
    if (renderedKeys.has(globalKey)) {
      issues.push({ file: relativePath, claim: claim.id, reason: `Duplicate rendered claim key ${globalKey}` })
    }
    renderedKeys.add(globalKey)
    const refs = claim.lists.get("pagrindžia") ?? claim.lists.get("pagrindzia") ?? []
    if (refs.length === 0) return
    // The rendered detail row uses the deterministic local DOM key produced by
    // AdvancedEvidence (the local claim id, with a suffix only when that id is
    // repeated on the same page). The global id is an anchor/deep-link, not the
    // detail asset key.
    const renderedDomKey = renderedLocalClaimKey(claim.id, index, renderedLocalKeys)
    const assetHtml =
      claimAssetHtml(pageHtml, renderedDomKey) ??
      (globalId && globalId.toLowerCase() !== renderedDomKey
        ? claimAssetHtml(pageHtml, globalId.toLowerCase())
        : null)
    if (!assetHtml) {
      issues.push({
        file: relativePath,
        claim: claim.id,
        reason: `Missing rendered claim asset ${renderedDomKey}`,
      })
      return
    }

    for (const rawRef of refs) {
      const citationId = normalizeEvidenceId(rawRef)
      const citation = citationById.get(citationId)
      if (!citation) continue
      const card = citationCard(assetHtml, citationId)
      if (!card) {
        issues.push({ file: relativePath, claim: claim.id, citation: citationId, reason: "Missing rendered citation card" })
        continue
      }
      if (
        citation.fields.get("citatos_rezimas")?.trim() === "indeksas" &&
        citation.fields.get("indeksas")?.trim()
      ) {
        continue
      }
      const shouldRenderQuote = evidenceSupportsClaim(
        claim.fields.get("teiginys") ?? "",
        evidenceCitationQuoteForClaim(citation, claim.fields.get("teiginys") ?? "", context),
        context,
      )
      const isUnsupported = card.includes("claim-citation-card-unverified")
      const hasQuote = card.includes("claim-citation-quote")
      if (shouldRenderQuote && (isUnsupported || !hasQuote)) {
        issues.push({ file: relativePath, claim: claim.id, citation: citationId, reason: "Supported citation quote is not rendered" })
      }
      if (!shouldRenderQuote && (!isUnsupported || hasQuote)) {
        issues.push({ file: relativePath, claim: claim.id, citation: citationId, reason: "Unsupported citation quote is rendered" })
      }
    }
  })
}

console.log(JSON.stringify({ issues: issues.length, examples: issues.slice(0, 20) }, null, 2))
if (issues.length > 0) process.exitCode = 1
