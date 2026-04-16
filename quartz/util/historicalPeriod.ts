export function visibleHistoricalPeriod(period: unknown): string | undefined {
  const value = Array.isArray(period) ? (period.length === 1 ? period[0] : undefined) : period

  if (typeof value !== "string") {
    return undefined
  }

  const normalized = value.trim()
  if (!normalized) {
    return undefined
  }

  // Mixed periods are less useful as article metadata than no metadata.
  if (/[;\n]/.test(normalized) || normalized.split(",").length > 1) {
    return undefined
  }

  return normalized
}
