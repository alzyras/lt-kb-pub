export type SourceChannel = "text" | "media"

export type SourceKind =
  | "book"
  | "periodical"
  | "document"
  | "image"
  | "map"
  | "audio_video"
  | "collection"
  | "other"

export type SourceCatalogEntry = {
  id: string
  title: string
  channel: SourceChannel
  kind: SourceKind
  seriesId?: string
  seriesTitle?: string
  volumeLabel?: string
  publicSlug?: string
  provider?: string
  searchText?: string
  objectCount: number
  claimCount: number
  quoteCount: number
  mediaCount: number
}

export type SourceKindSpec = {
  code: SourceKind
  label: string
  channel: SourceChannel
  order: number
}

export type SourceSelectionRule = {
  scope: "kind" | "series" | "source"
  id: string
  include: boolean
}

export type SourceSelection = {
  mode: "all" | "custom"
  rules: SourceSelectionRule[]
}

export type SettingsState = {
  version: 1
  minClaimCount: number
  showPersonParentheticals: boolean
  advancedEvidence: boolean
  textSources: SourceSelection
  mediaSources: SourceSelection
}

export const SOURCE_KIND_SPECS: SourceKindSpec[] = [
  { code: "book", label: "Knygos", channel: "text", order: 10 },
  { code: "periodical", label: "Periodika", channel: "text", order: 20 },
  { code: "document", label: "Dokumentai", channel: "text", order: 30 },
  { code: "collection", label: "Kolekcijos", channel: "text", order: 40 },
  { code: "image", label: "Atvaizdai", channel: "media", order: 50 },
  { code: "map", label: "Žemėlapiai", channel: "media", order: 60 },
  { code: "audio_video", label: "Garso ir vaizdo įrašai", channel: "media", order: 70 },
  { code: "other", label: "Kiti šaltiniai", channel: "text", order: 90 },
]

export const SETTINGS_STORAGE_KEY = "ltkb-settings-v1"
export const LEGACY_OPTIONS_STORAGE_KEY = "ltkb-options-v4"
export const ADVANCED_EVIDENCE_STORAGE_KEY = "advancedEvidenceMode"

export const DEFAULT_SETTINGS_STATE: SettingsState = {
  version: 1,
  minClaimCount: 0,
  showPersonParentheticals: true,
  advancedEvidence: false,
  textSources: { mode: "all", rules: [] },
  mediaSources: { mode: "all", rules: [] },
}

function cleanRules(value: unknown): SourceSelectionRule[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const out: SourceSelectionRule[] = []
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue
    const scope = String((raw as SourceSelectionRule).scope)
    const id = String((raw as SourceSelectionRule).id ?? "").trim()
    if (!(["kind", "series", "source"] as string[]).includes(scope) || !id) continue
    const key = `${scope}:${id}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push({
      scope: scope as SourceSelectionRule["scope"],
      id,
      include: (raw as SourceSelectionRule).include !== false,
    })
  }
  return out
}

function cleanSelection(value: unknown): SourceSelection {
  if (!value || typeof value !== "object") return { mode: "all", rules: [] }
  const selection = value as Partial<SourceSelection>
  return {
    mode: selection.mode === "custom" ? "custom" : "all",
    rules: cleanRules(selection.rules),
  }
}

function migrateLegacy(storage: Pick<Storage, "getItem">): SettingsState {
  let minClaimCount = DEFAULT_SETTINGS_STATE.minClaimCount
  let showPersonParentheticals = DEFAULT_SETTINGS_STATE.showPersonParentheticals
  let textSources: SourceSelection = { mode: "all", rules: [] }
  try {
    const legacy = JSON.parse(storage.getItem(LEGACY_OPTIONS_STORAGE_KEY) ?? "{}") as {
      minClaimCount?: number
      showPersonParentheticals?: boolean
      sourceSelectionMode?: "all" | "custom"
      selectedSourceIds?: unknown[]
    }
    if (Number.isFinite(legacy.minClaimCount))
      minClaimCount = Math.max(0, Number(legacy.minClaimCount))
    if (typeof legacy.showPersonParentheticals === "boolean") {
      showPersonParentheticals = legacy.showPersonParentheticals
    }
    const selected = Array.isArray(legacy.selectedSourceIds)
      ? legacy.selectedSourceIds
          .map(String)
          .map((id) => id.trim())
          .filter(Boolean)
      : []
    if (legacy.sourceSelectionMode === "custom" || selected.length > 0) {
      textSources = {
        mode: "custom",
        rules: selected.map((id) => ({ scope: "source" as const, id, include: true })),
      }
    }
  } catch {
    // Use defaults when old state is malformed.
  }
  return {
    ...DEFAULT_SETTINGS_STATE,
    minClaimCount,
    showPersonParentheticals,
    advancedEvidence: storage.getItem(ADVANCED_EVIDENCE_STORAGE_KEY) === "on",
    textSources,
  }
}

export function readSettingsState(storage: Pick<Storage, "getItem"> = localStorage): SettingsState {
  const raw = storage.getItem(SETTINGS_STORAGE_KEY)
  if (!raw) return migrateLegacy(storage)
  try {
    const parsed = JSON.parse(raw) as Partial<SettingsState>
    return {
      version: 1,
      minClaimCount: Number.isFinite(parsed.minClaimCount)
        ? Math.max(0, Number(parsed.minClaimCount))
        : DEFAULT_SETTINGS_STATE.minClaimCount,
      showPersonParentheticals:
        typeof parsed.showPersonParentheticals === "boolean"
          ? parsed.showPersonParentheticals
          : DEFAULT_SETTINGS_STATE.showPersonParentheticals,
      advancedEvidence:
        typeof parsed.advancedEvidence === "boolean"
          ? parsed.advancedEvidence
          : storage.getItem(ADVANCED_EVIDENCE_STORAGE_KEY) === "on",
      textSources: cleanSelection(parsed.textSources),
      mediaSources: cleanSelection(parsed.mediaSources),
    }
  } catch {
    return migrateLegacy(storage)
  }
}

export function sourceMatchesSelection(
  entry: SourceCatalogEntry,
  selection: SourceSelection,
): boolean {
  let included = selection.mode === "all"
  const scopes: SourceSelectionRule["scope"][] = ["kind", "series", "source"]
  for (const scope of scopes) {
    for (const rule of selection.rules) {
      if (rule.scope !== scope) continue
      const matches =
        (scope === "kind" && entry.kind === rule.id) ||
        (scope === "series" && entry.seriesId === rule.id) ||
        (scope === "source" && entry.id === rule.id)
      if (matches) included = rule.include
    }
  }
  return included
}

export function selectedSources(
  catalog: SourceCatalogEntry[],
  channel: SourceChannel,
  selection: SourceSelection,
): SourceCatalogEntry[] {
  return catalog.filter(
    (entry) => entry.channel === channel && sourceMatchesSelection(entry, selection),
  )
}

export function setSelectionRule(
  selection: SourceSelection,
  rule: SourceSelectionRule,
  catalog: SourceCatalogEntry[],
  channel: SourceChannel,
): SourceSelection {
  const entries = catalog.filter((entry) => entry.channel === channel)
  const isDescendant = (candidate: SourceSelectionRule): boolean => {
    if (candidate.scope === rule.scope && candidate.id === rule.id) return true
    if (rule.scope === "source") return false
    return entries.some((entry) => {
      const belongs = rule.scope === "kind" ? entry.kind === rule.id : entry.seriesId === rule.id
      if (!belongs) return false
      return (
        (candidate.scope === "source" && candidate.id === entry.id) ||
        (candidate.scope === "series" && candidate.id === entry.seriesId)
      )
    })
  }
  const rules = selection.rules.filter((candidate) => !isDescendant(candidate))
  const baseValue = selection.mode === "all"
  if (rule.include !== baseValue || rule.scope !== "kind") rules.push(rule)
  return { ...selection, rules }
}

export function writeSettingsState(
  state: SettingsState,
  catalog: SourceCatalogEntry[],
  storage: Pick<Storage, "setItem"> = localStorage,
) {
  storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state))
  storage.setItem(ADVANCED_EVIDENCE_STORAGE_KEY, state.advancedEvidence ? "on" : "off")
  if (catalog.length > 0) {
    const selectedText = selectedSources(catalog, "text", state.textSources).map(
      (entry) => entry.id,
    )
    storage.setItem(
      LEGACY_OPTIONS_STORAGE_KEY,
      JSON.stringify({
        minClaimCount: state.minClaimCount,
        showPersonParentheticals: state.showPersonParentheticals,
        sourceSelectionMode:
          state.textSources.mode === "all" && state.textSources.rules.length === 0
            ? "all"
            : "custom",
        selectedSourceIds: selectedText,
      }),
    )
  }
  document.documentElement.setAttribute("advanced-evidence", state.advancedEvidence ? "on" : "off")
}

export function dispatchSettingsChange() {
  document.dispatchEvent(new CustomEvent("quartz-settings-change", { detail: {} }))
  document.dispatchEvent(new CustomEvent("quartz-options-change", { detail: {} }))
}

export function normalizeCatalog(value: unknown): SourceCatalogEntry[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((entry): entry is SourceCatalogEntry => Boolean(entry && typeof entry === "object"))
    .map(
      (entry): SourceCatalogEntry => ({
        ...entry,
        id: String(entry.id ?? "").trim(),
        title: String(entry.title ?? "").trim(),
        channel: entry.channel === "media" ? "media" : "text",
        kind: SOURCE_KIND_SPECS.some((spec) => spec.code === entry.kind) ? entry.kind : "other",
        objectCount: Math.max(0, Number(entry.objectCount) || 0),
        claimCount: Math.max(0, Number(entry.claimCount) || 0),
        quoteCount: Math.max(0, Number(entry.quoteCount) || 0),
        mediaCount: Math.max(0, Number(entry.mediaCount) || 0),
      }),
    )
    .filter((entry) => entry.id && entry.title)
}

type SourceCatalogRuntime = typeof globalThis & {
  fetchSourceCatalog?: Promise<SourceCatalogEntry[]>
}

export async function loadSourceCatalog(): Promise<SourceCatalogEntry[]> {
  try {
    const catalog = normalizeCatalog(await (globalThis as SourceCatalogRuntime).fetchSourceCatalog)
    if (catalog.length > 0) return catalog
  } catch {
    // The component may initialize before the shared static-data promise exists.
  }
  try {
    const response = await fetch("/static/sourceCatalog.json", { cache: "force-cache" })
    if (!response.ok) return []
    return normalizeCatalog(await response.json())
  } catch {
    return []
  }
}
