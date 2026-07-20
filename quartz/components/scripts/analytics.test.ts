import assert from "node:assert/strict"
import test from "node:test"
import {
  ANALYTICS_EVENT_NAMES,
  ANALYTICS_CUSTOM_DIMENSIONS,
  ANALYTICS_CUSTOM_METRICS,
  ANALYTICS_MAP_ACTIONS,
  ANALYTICS_SCHEMA_VERSION,
  analyticsZoomBucket,
  advanceExploration,
  analyticsDedupeKey,
  classifyAnalyticsPage,
  createGtagCommandQueue,
  emptyExplorationState,
  normalizeSearchTerm,
  searchTermContainsPotentialPii,
} from "../../util/analytics"

test("queues gtag commands as Arguments objects required by gtag.js", () => {
  const dataLayer: unknown[] = []
  const gtag = createGtagCommandQueue(dataLayer)

  gtag("config", "G-TEST", { send_page_view: false })
  gtag("event", "page_view", { page_title: "Test" })

  assert.equal(dataLayer.length, 2)
  assert.equal(Array.isArray(dataLayer[0]), false)
  assert.equal(Object.prototype.toString.call(dataLayer[0]), "[object Arguments]")
  assert.deepEqual(Array.from(dataLayer[0] as IArguments), [
    "config",
    "G-TEST",
    { send_page_view: false },
  ])
  assert.deepEqual(Array.from(dataLayer[1] as IArguments), [
    "event",
    "page_view",
    { page_title: "Test" },
  ])
})

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
  assert.deepEqual(ANALYTICS_EVENT_NAMES.includes("exhibition_interaction"), true)
  assert.deepEqual(ANALYTICS_EVENT_NAMES.includes("map_interaction"), true)
  for (const name of [
    "object_view",
    "citation_open",
    "deep_exploration",
    "exhibition_interaction",
    "gallery_open",
    "map_open",
    "rss_click",
    "newsletter_signup",
    "outbound_source_click",
  ] as const) {
    assert.equal(ANALYTICS_EVENT_NAMES.includes(name), true)
  }
  assert.deepEqual(ANALYTICS_MAP_ACTIONS.includes("node_select"), true)
  assert.deepEqual(ANALYTICS_CUSTOM_DIMENSIONS.includes("map_action"), true)
  assert.deepEqual(ANALYTICS_CUSTOM_DIMENSIONS.includes("exhibition_action"), true)
  assert.deepEqual(ANALYTICS_CUSTOM_METRICS.includes("result_count"), true)
  assert.equal(ANALYTICS_SCHEMA_VERSION, "ga4_events_v2")
  assert.equal(analyticsDedupeKey(["Feature", "On", 1]), "feature|on|1")
})

test("map zoom is reported using stable buckets", () => {
  assert.equal(analyticsZoomBucket(0.1), "far")
  assert.equal(analyticsZoomBucket(0.5), "medium")
  assert.equal(analyticsZoomBucket(1.2), "close")
  assert.equal(analyticsZoomBucket(2), "near")
})
