export type EvidenceIndexItem = {
  kind: "claim" | "citation" | "mention"
  id: string
  text: string
  sources: string[]
  sourceIds?: string[]
  topics?: string[]
  origin?: string
  standalone?: boolean
  rank?: number
  href: string
  html?: string
}
export type EvidenceFilters = {
  query: string
  kind: string
  source: string
  topics: string[]
  origin: string
  sort: string
}
export const normalizeEvidenceText = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("lt")
export function filterEvidence(items: EvidenceIndexItem[], filters: EvidenceFilters) {
  const tokens = normalizeEvidenceText(filters.query).split(/\s+/u).filter(Boolean)
  return items
    .filter((item) => {
      const text = normalizeEvidenceText(`${item.id} ${item.text} ${item.sources.join(" ")}`)
      return (
        (filters.kind === "records"
          ? item.kind !== "claim"
          : filters.kind === "all"
            ? item.kind === "claim" || item.kind === "mention" || item.standalone
            : filters.kind === "standalone"
              ? item.standalone
              : item.kind === filters.kind) &&
        (!filters.source ||
          item.sources.includes(filters.source) ||
          item.sourceIds?.includes(filters.source)) &&
        (!filters.origin || (item.origin || "internal") === filters.origin) &&
        (!filters.topics.length ||
          filters.topics.some((topic) => (item.topics || []).includes(topic))) &&
        tokens.every((token) => text.includes(token))
      )
    })
    .sort(
      (a, b) =>
        (filters.sort === "importance" ? (b.rank || 0) - (a.rank || 0) : 0) ||
        (a.kind === b.kind
          ? a.id.localeCompare(b.id, "lt", { numeric: true })
          : a.kind === "claim"
            ? -1
            : b.kind === "claim"
              ? 1
              : 0),
    )
}

export function claimTopics(
  frontmatter: Record<string, unknown>,
  id: string,
  aliases: string[] = [],
): string[] {
  try {
    const raw = frontmatter.claim_topics_by_id_json
    const map = typeof raw === "string" ? JSON.parse(raw) : raw
    return [
      ...new Set(
        [id, ...aliases].flatMap((key) =>
          Array.isArray(map?.[key])
            ? (map[key].filter((topic: unknown) => typeof topic === "string") as string[])
            : [],
        ),
      ),
    ].slice(0, 3)
  } catch {
    return []
  }
}
