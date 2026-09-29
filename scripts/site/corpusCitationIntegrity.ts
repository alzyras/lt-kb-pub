import { parseEvidenceSections } from "../../quartz/util/citationFilter"
import {
  evidenceCitationQuote,
  type CorpusEvidenceIntegrityIssue,
  type EvidenceDocument,
} from "../../quartz/util/evidenceIntegrity"

function normalizedField(fields: Map<string, string>, keys: string[]): string {
  const value =
    keys.map((key) => fields.get(key)).find((candidate) => candidate !== undefined) ?? ""
  return value.normalize("NFKC").replace(/\s+/gu, " ").trim()
}

function citationIdentity(
  fields: Map<string, string>,
  filePath: string,
  citationId: string,
): string {
  const source = normalizedField(fields, ["šaltinis", "saltinis", "source"])
  const author = normalizedField(fields, ["autorius", "author"])
  const pages = normalizedField(fields, ["puslapiai", "puslapis"])
  const quote = evidenceCitationQuote({ id: citationId, fields, lists: new Map() })
    .normalize("NFKC")
    .replace(/\s+/gu, " ")
    .trim()
  const index = normalizedField(fields, ["indeksas"])
  const mode = normalizedField(fields, ["citatos_rezimas"])

  // A global ID is shareable only when the pages expose enough bibliographic
  // data to establish that they refer to the same source record.
  return source && (quote || index)
    ? JSON.stringify({ source, author, pages, quote, index, mode })
    : `${filePath}:${citationId}`
}

export function collectCorpusCitationIdIssues(
  documents: EvidenceDocument[],
): CorpusEvidenceIntegrityIssue[] {
  const issues: CorpusEvidenceIntegrityIssue[] = []
  const citationOwners = new Map<string, { filePath: string; identity: string }>()

  for (const { filePath, markdown } of documents) {
    const citations = (parseEvidenceSections(markdown).get("Citatos") ?? []).filter((entry) =>
      entry.id.startsWith("c-"),
    )
    for (const citation of citations) {
      if (!/^c-\d{5,}$/.test(citation.id)) {
        issues.push({
          code: "non_global_citation_id",
          severity: "error",
          entryId: citation.id,
          filePath,
          message: `Citation ${citation.id} is not a global citation code`,
        })
        continue
      }

      const identity = citationIdentity(citation.fields, filePath, citation.id)
      const previous = citationOwners.get(citation.id)
      if (previous && previous.filePath !== filePath && previous.identity !== identity) {
        issues.push({
          code: "duplicate_global_citation_id_across_files",
          severity: "error",
          entryId: citation.id,
          filePath,
          message: `Citation global id ${citation.id} is also used in ${previous.filePath} with different source, page, or quotation data`,
        })
      } else if (!previous) {
        citationOwners.set(citation.id, { filePath, identity })
      }
    }
  }

  return issues
}
