export type RequestTracker = {
  begin: () => number
  invalidate: () => void
  isCurrent: (requestId: number) => boolean
}

export function createRequestTracker(): RequestTracker {
  let latestRequestId = 0

  return {
    begin: () => ++latestRequestId,
    invalidate: () => {
      latestRequestId += 1
    },
    isCurrent: (requestId) => requestId === latestRequestId,
  }
}

export function ensureSuccessfulSearchPreviewResponse(
  response: Pick<Response, "ok" | "status">,
  targetUrl: string,
): void {
  if (!response.ok) {
    throw new Error(`Could not fetch search preview ${targetUrl}: HTTP ${response.status}`)
  }
}

/** Search-index keys are site-root slugs, never paths relative to the open page. */
export function searchResultUrl(slug: string, origin: string): URL {
  const normalized = slug.replace(/^\/+/, "").replace(/\/index$/, "")
  const pathname = normalized === "index" || normalized === "" ? "/" : `/${normalized}`
  return new URL(pathname, origin)
}
