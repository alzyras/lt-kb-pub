export type HomeCollectionCandidate = {
  slug: string
  type: string
  imageKey: string
  imageUrl: string
  reviewStatus: string
  directness: string
  rank: number
}

function isEligible(candidate: HomeCollectionCandidate): boolean {
  return Boolean(
    candidate.slug &&
    candidate.type &&
    candidate.imageKey &&
    candidate.imageUrl &&
    candidate.reviewStatus === "accepted" &&
    candidate.directness === "direct",
  )
}

export function selectHomeCollectionCandidates<T extends HomeCollectionCandidate>(
  candidates: T[],
  limit = 8,
): T[] {
  if (limit <= 0) return []

  const bySlug = new Map<string, T>()
  for (const candidate of candidates.filter(isEligible)) {
    const current = bySlug.get(candidate.slug)
    if (!current || candidate.rank > current.rank) bySlug.set(candidate.slug, candidate)
  }

  const ranked = [...bySlug.values()].sort(
    (a, b) => b.rank - a.rank || a.slug.localeCompare(b.slug, "lt"),
  )
  const selected: T[] = []
  const usedImages = new Set<string>()
  const typeCounts = new Map<string, number>()

  const add = (candidate: T): boolean => {
    if (selected.length >= limit || usedImages.has(candidate.imageKey)) return false
    selected.push(candidate)
    usedImages.add(candidate.imageKey)
    typeCounts.set(candidate.type, (typeCounts.get(candidate.type) ?? 0) + 1)
    return true
  }

  for (const candidate of ranked) {
    if ((typeCounts.get(candidate.type) ?? 0) === 0) add(candidate)
    if (selected.length >= limit) return selected
  }

  for (const candidate of ranked) {
    if (selected.includes(candidate) || (typeCounts.get(candidate.type) ?? 0) >= 2) continue
    add(candidate)
    if (selected.length >= limit) return selected
  }

  return selected
}
