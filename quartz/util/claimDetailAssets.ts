import { createHash } from "node:crypto"
import { FullSlug, joinSegments } from "./path"

export type ClaimDetailAsset = {
  slug: FullSlug
  payload: string
}

const claimDetailPayload = /<script type="application\/json" data-claim-detail-payload="true">([^<]*)<\/script>/g

function assetSlug(pageSlug: FullSlug, index: number): FullSlug {
  const digest = createHash("sha256")
    .update(`${pageSlug}:${index}`)
    .digest("hex")
    .slice(0, 24)
  return joinSegments("static", "claim-details", digest) as FullSlug
}

/**
 * Moves the lazy detail HTML for each claim out of the document. Keeping it in
 * a small JSON asset avoids making pages with hundreds of claims download all
 * citation and audit metadata before a reader opens a single claim.
 */
export function extractClaimDetailAssets(
  html: string,
  pageSlug: FullSlug,
): { html: string; assets: ClaimDetailAsset[] } {
  const assets: ClaimDetailAsset[] = []
  const extracted = html.replace(claimDetailPayload, (_match, payload: string) => {
    const slug = assetSlug(pageSlug, assets.length)
    assets.push({ slug, payload })
    return `<span data-claim-detail-url="/${slug}.json" hidden></span>`
  })
  return { html: extracted, assets }
}
