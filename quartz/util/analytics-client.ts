import type {
  AnalyticsDedupeScope,
  AnalyticsFeatureDetail,
  AnalyticsMapDetail,
  AnalyticsParams,
} from "./analytics"

export function emitAnalyticsFeature(detail: AnalyticsFeatureDetail): void {
  document.dispatchEvent(new CustomEvent("analyticsfeature", { detail }))
}

export function emitAnalyticsMap(detail: AnalyticsMapDetail): void
export function emitAnalyticsMap(
  action: string,
  params?: AnalyticsParams,
  options?: { dedupeScope?: AnalyticsDedupeScope; dedupeKey?: string },
): void
export function emitAnalyticsMap(
  detailOrAction: AnalyticsMapDetail | string,
  params?: AnalyticsParams,
  options?: { dedupeScope?: AnalyticsDedupeScope; dedupeKey?: string },
): void {
  const detail: AnalyticsMapDetail =
    typeof detailOrAction === "string"
      ? { action: detailOrAction, params, ...options }
      : detailOrAction
  document.dispatchEvent(new CustomEvent("analyticsmap", { detail }))
}
