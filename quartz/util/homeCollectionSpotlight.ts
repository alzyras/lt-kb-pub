export type CollectionSpotlightClaim = {
  id: string
  text: string
  source?: string
  contributor?: string
}

export type CollectionSpotlightObject = {
  title: string
  slug: string
  typeLabel: string
  claimCount: number
  claims: CollectionSpotlightClaim[]
}

export type CollectionSpotlightItem = {
  object: Omit<CollectionSpotlightObject, "claims">
  claim: CollectionSpotlightClaim
}

function isSpotlightClaim(value: unknown): value is CollectionSpotlightClaim {
  if (!value || typeof value !== "object") return false
  const claim = value as Partial<CollectionSpotlightClaim>
  return (
    typeof claim.id === "string" &&
    Boolean(claim.id) &&
    typeof claim.text === "string" &&
    Boolean(claim.text.trim())
  )
}

export function validCollectionSpotlightData(value: unknown): CollectionSpotlightObject[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((entry): CollectionSpotlightObject[] => {
    if (!entry || typeof entry !== "object") return []
    const object = entry as Partial<CollectionSpotlightObject>
    if (
      typeof object.title !== "string" ||
      !object.title.trim() ||
      typeof object.slug !== "string" ||
      !object.slug.trim() ||
      typeof object.typeLabel !== "string" ||
      typeof object.claimCount !== "number" ||
      !Array.isArray(object.claims)
    ) {
      return []
    }

    const claims = object.claims.filter(isSpotlightClaim)
    if (claims.length === 0) return []

    return [
      {
        title: object.title,
        slug: object.slug,
        typeLabel: object.typeLabel,
        claimCount: object.claimCount,
        claims,
      },
    ]
  })
}

function shuffle<T>(items: T[], randomIndex: (length: number) => number): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1)
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

function claimIdentity(claim: CollectionSpotlightClaim): string {
  return claim.text.trim().toLocaleLowerCase("lt-LT").replace(/\s+/g, " ")
}

/** Select distinct statements from different objects before repeating an object. */
export function selectCollectionSpotlightItems(
  objects: CollectionSpotlightObject[],
  limit: number,
  randomIndex: (length: number) => number = (length) => Math.floor(Math.random() * length),
): CollectionSpotlightItem[] {
  if (limit <= 0) return []

  const candidates = shuffle(objects, randomIndex)
  const selected: CollectionSpotlightItem[] = []
  const selectedTexts = new Set<string>()

  const addClaim = (object: CollectionSpotlightObject, claim: CollectionSpotlightClaim) => {
    const identity = claimIdentity(claim)
    if (!identity || selectedTexts.has(identity)) return

    const { claims: _claims, ...objectDetails } = object
    selected.push({ object: objectDetails, claim })
    selectedTexts.add(identity)
  }

  // Prefer one different object for each carousel slot.
  for (const object of candidates) {
    const claim = shuffle(object.claims, randomIndex).find(
      (entry) => !selectedTexts.has(claimIdentity(entry)),
    )
    if (claim) addClaim(object, claim)
    if (selected.length >= limit) return selected
  }

  // If there are fewer objects than slots, use other distinct claims from
  // those objects instead of repeating a statement.
  for (const object of candidates) {
    for (const claim of shuffle(object.claims, randomIndex)) {
      addClaim(object, claim)
      if (selected.length >= limit) return selected
    }
  }

  return selected
}
