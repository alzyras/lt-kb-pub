import assert from "node:assert/strict"
import test from "node:test"
import {
  ANALYTICS_EVENT_NAMES,
  advanceExploration,
  analyticsDedupeKey,
  classifyAnalyticsPage,
  emptyExplorationState,
  normalizeSearchTerm,
  searchTermContainsPotentialPii,
} from "../../util/analytics"

test("classifies only recognized object pages as objects", () => {
  assert.equal(classifyAnalyticsPage("objektai/asmenys/Gediminas", "asmuo").pageType, "object")
  assert.equal(classifyAnalyticsPage("objektai/asmenys", "aplankas").pageType, "folder")
  assert.equal(classifyAnalyticsPage("tags/valdovas", "", false).pageType, "tag")
  assert.equal(classifyAnalyticsPage("tyrimai/auditas", "", false).pageType, "research")
  assert.equal(classifyAnalyticsPage("404", "", true).pageType, "not_found")
})

test("deep exploration supports both qualification paths and fires once", () => {
  let result = advanceExploration(emptyExplorationState(), { objectId: "a" })
  result = advanceExploration(result.state, { objectId: "b" })
  assert.equal(result.qualified, false)
  result = advanceExploration(result.state, { citationKey: "b|source" })
  assert.equal(result.qualified, true)
  assert.equal(advanceExploration(result.state, { objectId: "c" }).qualified, false)

  let three = advanceExploration(emptyExplorationState(), { objectId: "a" })
  three = advanceExploration(three.state, { objectId: "a" })
  three = advanceExploration(three.state, { objectId: "b" })
  three = advanceExploration(three.state, { objectId: "c" })
  assert.equal(three.qualified, true)
})

test("PII-like search terms are suppressed while ordinary history terms remain", () => {
  assert.equal(searchTermContainsPotentialPii("Vytautas Didysis"), false)
  assert.equal(searchTermContainsPotentialPii("jonas@example.com"), true)
  assert.equal(searchTermContainsPotentialPii("+370 612 34567"), true)
  assert.equal(searchTermContainsPotentialPii("https://example.com/?token=abc"), true)
  assert.equal(searchTermContainsPotentialPii("api_key=secret-value"), true)
  assert.equal(normalizeSearchTerm("  Vilniaus   istorija "), "Vilniaus istorija")
})

test("event allowlist and dedupe keys are deterministic", () => {
  assert.deepEqual(ANALYTICS_EVENT_NAMES.includes("deep_exploration"), true)
  assert.equal(analyticsDedupeKey(["Feature", "On", 1]), "feature|on|1")
})
