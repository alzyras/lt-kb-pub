declare module "*.scss" {
  const content: string
  export = content
}

// dom custom event
interface CustomEventMap {
  prenav: CustomEvent<{}>
  nav: CustomEvent<{ url: FullSlug }>
  themechange: CustomEvent<{ theme: "light" | "dark" }>
  readermodechange: CustomEvent<{ mode: "on" | "off" }>
  "quartz-options-change": CustomEvent<{}>
  citationopen: CustomEvent<{ citationKey: string; sourceKind: string }>
  analyticsfeature: CustomEvent<{
    name: string
    action: string
    value?: string
    params?: Record<string, string | number | boolean>
    dedupeScope?: "none" | "page" | "session"
    dedupeKey?: string
  }>
  analyticsmap: CustomEvent<{
    action: string
    params?: Record<string, string | number | boolean>
    dedupeScope?: "none" | "page" | "session"
    dedupeKey?: string
  }>
  periodfiltercommit: CustomEvent<{ start: number; end: number; includeUnknown: boolean }>
}

type ContentIndex = Record<FullSlug, ContentDetails>
declare const fetchData: Promise<ContentIndex>
