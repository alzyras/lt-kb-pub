import test from "node:test"
import assert from "node:assert/strict"
import {
  filterEvidence,
  type EvidenceIndexItem,
  type EvidenceFilters,
} from "./objectEvidenceFilter"
const filters: EvidenceFilters = {
  query: "",
  kind: "claim",
  source: "",
  topics: [],
  origin: "",
  sort: "number",
}
const items: EvidenceIndexItem[] = Array.from({ length: 120 }, (_, i) => ({
  kind: "claim",
  id: `t-${i + 1}`,
  text: i === 100 ? "Žygis į Žemaitiją" : "Kitas tekstas",
  sources: [i % 2 ? "A" : "B"],
  topics: [i % 2 ? "karas" : "valdžia"],
  href: "#",
}))
test("filters the full index, accent-insensitive and token-order independent", () => {
  assert.equal(filterEvidence(items, { ...filters, query: "zemaitija zygis" })[0].id, "t-101")
})
test("OR within topics, AND across facets, and numeric ordering", () => {
  const result = filterEvidence(items, { ...filters, topics: ["karas", "valdžia"], source: "B" })
  assert.equal(result.length, 60)
  assert.deepEqual(
    result.slice(0, 3).map((row) => row.id),
    ["t-1", "t-3", "t-5"],
  )
})
test("linked quotes are searchable separately without duplication in all", () => {
  const quote: EvidenceIndexItem = {
    kind: "citation",
    id: "c-1",
    text: "Citata",
    sources: [],
    href: "#",
    standalone: false,
  }
  assert.equal(filterEvidence([quote], { ...filters, kind: "all" }).length, 0)
  assert.equal(filterEvidence([quote], { ...filters, kind: "citation" }).length, 1)
})
