import assert from "node:assert/strict"
import test from "node:test"
import { loadObjectTopology, objectGraphRelations } from "./objectGraph"
import {
  objectDetailEvidence,
  objectDetailEvidenceFromFile,
  objectEvidenceClaimItems,
  relationsFromMarkdown,
} from "./objectDetail"
import {
  objectRelationInputs,
  objectRelationGroups,
  objectRelationCount,
  PAGE_LINKS_GROUP_LABEL,
} from "./objectRelations"
import { buildVisibleGraph, parseGraphState } from "../components/scripts/graph-explorer-model"

test("unlinked evidence does not remove a claim from the complete list", () => {
  const evidence = objectDetailEvidence(
    "## Teiginiai\n- t-001\n  teiginys: Pirmas teiginys.\n- t-002\n  teiginys: Antras teiginys.\n",
  )
  assert.equal(evidence.claims.length, 2)
  assert.deepEqual(
    objectEvidenceClaimItems(evidence).map((item) => item.value.id),
    ["t-001", "t-002"],
  )
})

test("object lists and the opened map retain exactly the same complete neighbourhood", () => {
  const topology = loadObjectTopology()
  const defaults = Object.keys(topology.relationKinds).filter(
    (kind) => topology.relationKinds[kind].defaultOn,
  )
  const types = [...new Set<string>(topology.nodes.map((node: any) => node.type))]
  for (const slug of [
    "objektai/asmenys/Vytautas",
    "objektai/asmenys/Jogaila",
    "objektai/vietos/Vilnius",
  ]) {
    const evidence = objectDetailEvidenceFromFile(`${slug}.md`)
    const rows = objectRelationInputs({}, evidence)
    const inventory = objectGraphRelations(slug)
    assert.deepEqual(rows, inventory)
    assert.equal(
      objectRelationCount(objectRelationGroups(rows, [], { dedupe: false })),
      inventory.length,
    )
    const groups = objectRelationGroups(rows, [], { dedupe: false })
    const pageLinks = groups.findIndex((group) => group.label === PAGE_LINKS_GROUP_LABEL)
    if (pageLinks >= 0) assert.equal(pageLinks, groups.length - 1, slug)
    const state = parseGraphState(
      new URLSearchParams({ focus: slug, minConfidence: "0" }),
      defaults,
      types,
    )
    const graph = buildVisibleGraph(topology, topology.edges, state)
    const direct = graph.edges.filter((edge) => edge.from === slug || edge.to === slug)
    assert.deepEqual(
      new Set(direct.map((edge) => edge.id)),
      new Set(inventory.map((row) => row.id)),
      slug,
    )
    assert.equal(direct.length, inventory.length, slug)
    assert.equal(graph.nodes.length - 1, new Set(inventory.map((row) => row.target)).size, slug)
    if (slug.endsWith("Vytautas")) assert.ok(inventory.length > 200)
  }
})

test("legacy Markdown relation links keep their predicate separate from the target title", () => {
  assert.deepEqual(
    relationsFromMarkdown("## Ryšiai\n- Gyveno: [Vilniuje](/objektai/vietos/Vilnius)\n"),
    [{ label: "Gyveno", target: "objektai/vietos/Vilnius", display: "Vilniuje" }],
  )
})
