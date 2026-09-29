import assert from "node:assert/strict"
import test from "node:test"
import { changedObjectGraphShardSlugs } from "./graphShardChanges"

type Fixture = {
  nodes: Array<{
    slug: string
    title: string
    type: string
    claimCount?: number
    quoteCount?: number
  }>
  edges: Array<{
    id: string
    from: string
    to: string
    kind: string
    evidenceCount?: number
    confidence?: number
    claimIds?: string[]
    quoteIds?: string[]
  }>
  relationKinds: Record<string, { defaultOn: boolean; group: string }>
}

test("a claim-count change refreshes only that object's shard", () => {
  const previous: Fixture = {
    nodes: [
      { slug: "objektai/daiktai/a", title: "A", type: "daiktas", claimCount: 1 },
      { slug: "objektai/vietos/b", title: "B", type: "vieta", claimCount: 0 },
    ],
    edges: [{ id: "a-b", from: "objektai/daiktai/a", to: "objektai/vietos/b", kind: "authored" }],
    relationKinds: { authored: { defaultOn: true, group: "authored" } },
  }
  const current = structuredClone(previous)
  current.nodes![0].claimCount = 2

  assert.deepEqual(changedObjectGraphShardSlugs(previous, current), new Set(["objektai/daiktai/a"]))
})

test("a relation change refreshes both endpoint shards", () => {
  const previous: Fixture = {
    nodes: [
      { slug: "objektai/daiktai/a", title: "A", type: "daiktas" },
      { slug: "objektai/vietos/b", title: "B", type: "vieta" },
    ],
    edges: [],
    relationKinds: { authored: { defaultOn: true, group: "authored" } },
  }
  const current = structuredClone(previous)
  current.edges!.push({
    id: "a-b",
    from: "objektai/daiktai/a",
    to: "objektai/vietos/b",
    kind: "authored",
  })

  assert.deepEqual(
    changedObjectGraphShardSlugs(previous, current),
    new Set(["objektai/daiktai/a", "objektai/vietos/b"]),
  )
})

test("a node title change refreshes that node and its neighbors", () => {
  const previous: Fixture = {
    nodes: [
      { slug: "objektai/daiktai/a", title: "Old", type: "daiktas" },
      { slug: "objektai/vietos/b", title: "B", type: "vieta" },
    ],
    edges: [{ id: "a-b", from: "objektai/daiktai/a", to: "objektai/vietos/b", kind: "authored" }],
    relationKinds: { authored: { defaultOn: true, group: "authored" } },
  }
  const current = structuredClone(previous)
  current.nodes![0].title = "New"

  assert.deepEqual(
    changedObjectGraphShardSlugs(previous, current),
    new Set(["objektai/daiktai/a", "objektai/vietos/b"]),
  )
})

test("a relation group change refreshes all endpoints of that relation kind", () => {
  const previous: Fixture = {
    nodes: [
      { slug: "objektai/daiktai/a", title: "A", type: "daiktas" },
      { slug: "objektai/vietos/b", title: "B", type: "vieta" },
      { slug: "objektai/asmenys/c", title: "C", type: "asmuo" },
    ],
    edges: [
      { id: "a-b", from: "objektai/daiktai/a", to: "objektai/vietos/b", kind: "authored" },
      { id: "a-c", from: "objektai/daiktai/a", to: "objektai/asmenys/c", kind: "other" },
    ],
    relationKinds: {
      authored: { defaultOn: true, group: "old" },
      other: { defaultOn: true, group: "other" },
    },
  }
  const current = structuredClone(previous)
  current.relationKinds!.authored.group = "new"

  assert.deepEqual(
    changedObjectGraphShardSlugs(previous, current),
    new Set(["objektai/daiktai/a", "objektai/vietos/b"]),
  )
})
