import assert from "node:assert/strict"
import test from "node:test"
import {
  DEFAULT_SETTINGS_STATE,
  readSettingsState,
  selectedSources,
  setSelectionRule,
  sourceMatchesSelection,
  type SourceCatalogEntry,
} from "./sourceSettings"

const catalog: SourceCatalogEntry[] = [
  { id: "narbut-1", title: "Narbutas I", channel: "text", kind: "book", seriesId: "narbut", seriesTitle: "Narbutas", objectCount: 1, claimCount: 2, quoteCount: 2, mediaCount: 0 },
  { id: "narbut-2", title: "Narbutas II", channel: "text", kind: "book", seriesId: "narbut", seriesTitle: "Narbutas", objectCount: 1, claimCount: 2, quoteCount: 2, mediaCount: 0 },
  { id: "commons", title: "Wikimedia Commons", channel: "media", kind: "image", objectCount: 1, claimCount: 0, quoteCount: 0, mediaCount: 3 },
]

test("series rules include existing and future volumes", () => {
  const selection = setSelectionRule(
    { mode: "custom", rules: [] },
    { scope: "series", id: "narbut", include: true },
    catalog,
    "text",
  )
  assert.equal(sourceMatchesSelection(catalog[0], selection), true)
  assert.equal(sourceMatchesSelection({ ...catalog[0], id: "narbut-3" }, selection), true)
})

test("specific source rule overrides a selected series", () => {
  let selection = setSelectionRule(
    { mode: "custom", rules: [] },
    { scope: "series", id: "narbut", include: true },
    catalog,
    "text",
  )
  selection = setSelectionRule(selection, { scope: "source", id: "narbut-1", include: false }, catalog, "text")
  assert.equal(sourceMatchesSelection(catalog[0], selection), false)
  assert.equal(sourceMatchesSelection(catalog[1], selection), true)
})

test("text and media selections stay independent", () => {
  assert.deepEqual(selectedSources(catalog, "text", DEFAULT_SETTINGS_STATE.textSources).map((entry) => entry.id), ["narbut-1", "narbut-2"])
  assert.deepEqual(selectedSources(catalog, "media", { mode: "custom", rules: [] }), [])
})

test("legacy options migrate to explicit source rules", () => {
  const values = new Map<string, string>([
    ["ltkb-options-v4", JSON.stringify({ minClaimCount: 7, sourceSelectionMode: "custom", selectedSourceIds: ["narbut-2"] })],
    ["advancedEvidenceMode", "on"],
  ])
  const state = readSettingsState({ getItem: (key) => values.get(key) ?? null } as Storage)
  assert.equal(state.minClaimCount, 7)
  assert.equal(state.advancedEvidence, true)
  assert.deepEqual(state.textSources.rules, [{ scope: "source", id: "narbut-2", include: true }])
})
