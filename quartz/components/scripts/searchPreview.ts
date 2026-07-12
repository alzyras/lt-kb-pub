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
