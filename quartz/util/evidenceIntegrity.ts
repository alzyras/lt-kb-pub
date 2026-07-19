import {
  CITATION_SECTION_TITLES,
  EvidenceEntry,
  normalizeEvidenceId,
  parseEvidenceSections,
} from "./citationFilter"

export type EvidenceIntegritySeverity = "error" | "warning"

export interface EvidenceIntegrityIssue {
  code: string
  severity: EvidenceIntegritySeverity
  entryId: string
  relatedId?: string
  message: string
}

export interface CorpusEvidenceIntegrityIssue extends EvidenceIntegrityIssue {
  filePath: string
}

export interface EvidenceDocument {
  filePath: string
  markdown: string
}

function citationEntries(sections: Map<string, EvidenceEntry[]>): EvidenceEntry[] {
  return [...sections.entries()]
    .filter(([title]) => CITATION_SECTION_TITLES.has(title))
    .flatMap(([, entries]) => entries)
    .filter((entry) => entry.id.startsWith("c-"))
}

function citationText(entry: EvidenceEntry): string {
  return ["citata_originali", "citata_rodoma", "citata"]
    .map((key) => entry.fields.get(key)?.trim() ?? "")
    .filter(Boolean)
    .filter((text, index, values) => values.indexOf(text) === index)
    .join("\n")
}

export function evidenceCitationQuote(entry: EvidenceEntry): string {
  return (
    entry.fields.get("citata_rodoma")?.trim() ||
    entry.fields.get("citata")?.trim() ||
    entry.fields.get("citata_originali")?.trim() ||
    ""
  )
}

function normalizedTokens(text: string): Set<string> {
  const stopwords = new Set([
    "apie",
    "buvo",
    "kaip",
    "kad",
    "kur",
    "kuris",
    "kuri",
    "savo",
    "su",
    "ir",
    "bei",
    "bet",
    "nuo",
    "iki",
    "per",
    "tai",
    "tik",
    "taip",
    "sį",
    "ši",
    "šio",
    "į",
    "jo",
    "jis",
    "jos",
    "ji",
    "jų",
    "ne",
    "ar",
    "o",
    "už",
    "po",
    "metu",
    "metais",
  ])
  const normalized = text
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[-\u00ad]\s*\n\s*(?=\p{L})/gu, "")
    .toLowerCase()
  return new Set(
    (normalized.match(/[\p{L}\p{N}]{3,}/gu) ?? []).filter((token) => !stopwords.has(token)),
  )
}

function tokenOverlap(claimText: string, quoteText: string): { exact: number; prefix: number } {
  const claimTokens = normalizedTokens(claimText)
  const citationTokens = normalizedTokens(quoteText)
  let exact = 0
  let prefix = 0

  for (const claimToken of claimTokens) {
    const exactMatch = [...citationTokens].some((citationToken) => claimToken === citationToken)
    if (exactMatch) {
      exact += 1
      continue
    }
    const prefixMatch = [...citationTokens].some((citationToken) => {
      const commonLength = Math.min(claimToken.length, citationToken.length)
      let prefixLength = 0
      while (
        prefixLength < commonLength &&
        claimToken[prefixLength] === citationToken[prefixLength]
      ) {
        prefixLength++
      }
      return prefixLength >= 4 && commonLength >= 6
    })
    if (prefixMatch) prefix += 1
  }
  return { exact, prefix }
}

export function evidenceTextOverlapScore(
  claimText: string,
  quoteText: string,
  contextText = "",
): number {
  const claimTokens = normalizedTokens(`${claimText} ${contextText}`)
  const citationTokens = normalizedTokens(quoteText)
  return [...claimTokens].filter((claimToken) =>
    [...citationTokens].some((citationToken) => {
      if (claimToken === citationToken) return true
      const commonLength = Math.min(claimToken.length, citationToken.length)
      let prefixLength = 0
      while (
        prefixLength < commonLength &&
        claimToken[prefixLength] === citationToken[prefixLength]
      ) {
        prefixLength++
      }
      return prefixLength >= 4
    }),
  ).length
}

/**
 * Conservative display guard. A page title may identify a short object quote,
 * but a single weak word prefix must never make an unrelated quote visible.
 */
export function evidenceSupportsClaim(
  claimText: string,
  quoteText: string,
  contextText = "",
): boolean {
  if (!quoteText.trim()) return false
  const claimOverlap = tokenOverlap(claimText, quoteText)
  if (claimOverlap.exact > 0) return true
  if (claimOverlap.prefix >= 2) return true
  const contextOverlap = tokenOverlap(contextText, quoteText)
  return contextOverlap.exact > 0
}

export function evidenceCitationQuoteForClaim(
  entry: EvidenceEntry,
  claimText: string,
  contextText = "",
): string {
  const displayQuote =
    entry.fields.get("citata_rodoma")?.trim() || entry.fields.get("citata")?.trim() || ""
  const originalQuote = entry.fields.get("citata_originali")?.trim() || ""
  if (displayQuote && evidenceSupportsClaim(claimText, displayQuote, contextText)) {
    return displayQuote
  }
  return originalQuote || displayQuote
}

export function evidenceDocumentContext(markdown: string): string {
  const frontmatterTitle = markdown.match(/^pavadinimas:\s*["']?(.+?)["']?\s*$/m)?.[1]
  if (frontmatterTitle) return frontmatterTitle.trim()
  return markdown.match(/^#\s+(.+?)\s*$/m)?.[1]?.trim() ?? ""
}

function overlapScore(claim: EvidenceEntry, citation: EvidenceEntry, contextText: string): number {
  return evidenceTextOverlapScore(
    claim.fields.get("teiginys") ?? "",
    citationText(citation),
    contextText,
  )
}

function claimIds(claims: EvidenceEntry[]): Set<string> {
  return new Set(
    claims
      .flatMap((claim) => [claim.id, claim.fields.get("global_id")?.trim() ?? ""])
      .filter(Boolean),
  )
}

export function collectEvidenceIntegrityIssues(markdown: string): EvidenceIntegrityIssue[] {
  const sections = parseEvidenceSections(markdown)
  const contextText = evidenceDocumentContext(markdown)
  const claims = (sections.get("Teiginiai") ?? []).filter((entry) => entry.id.startsWith("t-"))
  const citations = citationEntries(sections)
  const issues: EvidenceIntegrityIssue[] = []
  const claimIdSet = claimIds(claims)
  const citationById = new Map<string, EvidenceEntry>()
  const claimById = new Map<string, EvidenceEntry>()
  const claimByGlobalId = new Map<string, EvidenceEntry>()

  for (const citation of citations) {
    const previous = citationById.get(citation.id)
    if (previous) {
      issues.push({
        code: "duplicate_citation_id",
        severity: "error",
        entryId: citation.id,
        message: `Duplicate citation id ${citation.id}`,
      })
    } else {
      citationById.set(citation.id, citation)
    }
  }

  for (const claim of claims) {
    const previous = claimById.get(claim.id)
    if (previous) {
      issues.push({
        code: "duplicate_claim_id",
        severity: "error",
        entryId: claim.id,
        message: `Duplicate claim id ${claim.id}`,
      })
    } else {
      claimById.set(claim.id, claim)
    }

    const globalId = claim.fields.get("global_id")?.trim()
    if (globalId) {
      const previousGlobal = claimByGlobalId.get(globalId)
      if (previousGlobal) {
        issues.push({
          code: "duplicate_claim_global_id",
          severity: "error",
          entryId: claim.id,
          relatedId: globalId,
          message: `Duplicate claim global id ${globalId}`,
        })
      } else {
        claimByGlobalId.set(globalId, claim)
      }
    }

    const supports = claim.lists.get("pagrindžia") ?? claim.lists.get("pagrindzia") ?? []
    for (const rawCitationId of supports) {
      const citationId = normalizeEvidenceId(rawCitationId)
      if (!citationById.has(citationId)) {
        issues.push({
          code: "missing_supporting_citation",
          severity: "error",
          entryId: claim.id,
          relatedId: citationId,
          message: `Claim ${claim.id} references missing citation ${citationId}`,
        })
      }
    }
  }

  for (const citation of citations) {
    if (!citationText(citation)) {
      issues.push({
        code: "empty_citation_text",
        severity: "error",
        entryId: citation.id,
        message: `Citation ${citation.id} has no quote text`,
      })
    }

    const backlinks = citation.lists.get("pagrindžia") ?? citation.lists.get("pagrindzia") ?? []
    for (const rawClaimId of backlinks) {
      const claimId = rawClaimId.trim()
      if (!claimIdSet.has(claimId)) {
        issues.push({
          code: "missing_citation_backlink_target",
          severity: "error",
          entryId: citation.id,
          relatedId: claimId,
          message: `Citation ${citation.id} points to missing claim ${claimId}`,
        })
        continue
      }
      const claim = claimById.get(claimId) ?? claimByGlobalId.get(claimId)
      const supports = claim?.lists.get("pagrindžia") ?? claim?.lists.get("pagrindzia") ?? []
      if (claim && !supports.map(normalizeEvidenceId).includes(citation.id)) {
        issues.push({
          code: "backlink_forward_mismatch",
          severity: "error",
          entryId: citation.id,
          relatedId: claim.id,
          message: `Citation ${citation.id} backlinks claim ${claim.id}, but the claim does not reference it`,
        })
      }
    }
  }

  for (const claim of claims) {
    const supports = claim.lists.get("pagrindžia") ?? claim.lists.get("pagrindzia") ?? []
    const claimGlobalId = claim.fields.get("global_id")?.trim()
    for (const rawCitationId of supports) {
      const citation = citationById.get(normalizeEvidenceId(rawCitationId))
      if (!citation) continue
      const backlinks = citation.lists.get("pagrindžia") ?? citation.lists.get("pagrindzia") ?? []
      if (
        backlinks.length > 0 &&
        !backlinks.includes(claim.id) &&
        (!claimGlobalId || !backlinks.includes(claimGlobalId))
      ) {
        issues.push({
          code: "forward_backlink_mismatch",
          severity: "error",
          entryId: claim.id,
          relatedId: citation.id,
          message: `Claim ${claim.id} references ${citation.id}, but the citation does not backlink the claim`,
        })
      }

      if (overlapScore(claim, citation, contextText) === 0) {
        issues.push({
          code: "citation_text_mismatch",
          severity: "warning",
          entryId: claim.id,
          relatedId: citation.id,
          message: `Claim ${claim.id} and citation ${citation.id} share no meaningful text tokens`,
        })
      }
    }
  }

  return issues
}

export function collectCorpusEvidenceIntegrityIssues(
  documents: EvidenceDocument[],
): CorpusEvidenceIntegrityIssue[] {
  const issues = documents.flatMap(({ filePath, markdown }) =>
    collectEvidenceIntegrityIssues(markdown).map((issue) => ({
      ...issue,
      filePath,
    })),
  )
  const globalIds = new Map<string, string>()

  for (const { filePath, markdown } of documents) {
    const claims = (parseEvidenceSections(markdown).get("Teiginiai") ?? []).filter((entry) =>
      entry.id.startsWith("t-"),
    )
    for (const claim of claims) {
      const globalId = claim.fields.get("global_id")?.trim()
      if (!globalId) {
        issues.push({
          code: "missing_claim_global_id",
          severity: "error",
          entryId: claim.id,
          filePath,
          message: `Claim ${claim.id} has no global_id`,
        })
        continue
      }
      const previousFile = globalIds.get(globalId)
      if (previousFile && previousFile !== filePath) {
        issues.push({
          code: "duplicate_claim_global_id_across_files",
          severity: "error",
          entryId: claim.id,
          relatedId: globalId,
          filePath,
          message: `Claim global id ${globalId} is also used in ${previousFile}`,
        })
      } else {
        globalIds.set(globalId, filePath)
      }
    }
  }
  return issues
}
