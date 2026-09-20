import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import {
  isObjectDetailSlug,
  objectDetailEvidence,
  objectDetailTier,
  objectPageIndexable,
  uniqueCitations,
} from "./objectDetail"

const supported = `## Santrauka
Trumpa, šaltiniais pagrįsta apžvalga apie istorinį objektą.

## Teiginiai
- t-001
  teiginys: Patikrintas teiginys apie objektą.
  pagrindžia:
    - c-001

## Citatos
- c-001
  šaltinis: Patikimas šaltinis
  citata_rodoma: Tiksli šaltinio ištrauka, pagrindžianti teiginį.
`

test("keeps every claim and identifies whether it has linked public evidence", () => {
  const evidence = objectDetailEvidence(
    supported.replace("\n## Citatos", "\n- t-002\n  teiginys: Nepagrįstas teiginys.\n\n## Citatos"),
  )
  assert.equal(evidence.claims.length, 2)
  assert.equal(evidence.claims[0].id, "t-001")
  assert.equal(evidence.claims[0].sourceTitles[0], "Patikimas šaltinis")
  assert.equal(evidence.claims[1].id, "t-002")
  assert.equal(evidence.claims[1].citations.length, 0)
})

test("exposes canonical, standalone, and significant-mention citation records", () => {
  const evidence = objectDetailEvidence(`${supported}
## Reikšmingi paminėjimai
- c-002
  šaltinis: Kitas šaltinis
  citata_rodoma: Savarankiškas paminėjimas.
`)
  assert.equal(evidence.citationRecords.length, 2)
  assert.equal(evidence.citationRecords.find((item) => item.id === "c-001")?.standalone, false)
  assert.equal(evidence.citationRecords.find((item) => item.id === "c-002")?.standalone, true)
  assert.equal(
    evidence.citationRecords.find((item) => item.id === "c-002")?.significantMention,
    true,
  )
})

test("matches only exact canonical object routes", () => {
  assert.equal(isObjectDetailSlug("objektai/asmenys/Vytautas"), true)
  assert.equal(isObjectDetailSlug("objektai/asmenys/Vytautas/irodymai"), false)
  assert.equal(isObjectDetailSlug("objektai/asmenys/Vytautas/galerija"), false)
  assert.equal(isObjectDetailSlug("objektai/nezinomi/Vytautas"), false)
})

test("keeps sparse records out of search but indexes a sourced compact record", () => {
  const empty = objectDetailEvidence("## Santrauka\nNenurodyta")
  assert.equal(objectDetailTier(empty), "t0")
  assert.equal(objectPageIndexable(empty), false)
  const compact = objectDetailEvidence(supported)
  assert.equal(objectDetailTier(compact), "t1")
  assert.equal(objectPageIndexable(compact), true)
})

test("classifies each object completeness tier deterministically", () => {
  const evidence = objectDetailEvidence(supported)
  const claims = evidence.claims[0]
  assert.equal(objectDetailTier(evidence), "t1")
  assert.equal(objectDetailTier({ ...evidence, claims: [claims, claims, claims] }), "t2")
  assert.equal(
    objectDetailTier({ ...evidence, claims: Array.from({ length: 10 }, () => claims) }),
    "t3",
  )
})

test("keeps every Vytautas claim, canonical citation, and significant mention reachable", () => {
  const source = path.join(process.cwd(), "content/objektai/asmenys/Vytautas.md")
  if (!fs.existsSync(source)) return
  const evidence = objectDetailEvidence(fs.readFileSync(source, "utf8"))
  assert.equal(evidence.claims.length, 369)
  assert.equal(evidence.citations.size, 312)
  assert.equal(evidence.citationRecords.filter((record) => record.significantMention).length, 30)
  assert.equal(evidence.citationRecords.filter((record) => record.standalone).length, 84)
})

test("collapses duplicate quote displays but preserves distinct sources, pages and records", () => {
  const entry = (id: string, source = "Metraštis", pages = "12", quote = "Tas pats tekstas.") => ({
    id,
    fields: new Map([
      ["šaltinis", source],
      ["puslapiai", pages],
      ["citata", quote],
    ]),
    lists: new Map<string, string[]>(),
  })
  const entries = [
    entry("c-001"),
    entry("c-001"),
    entry("c-002"),
    entry("c-003", "Kitas šaltinis"),
    entry("c-004", "Metraštis", "13"),
    entry("c-005", "Metraštis", "12", "Kita citata."),
  ]
  assert.deepEqual(
    uniqueCitations(entries).map((row) => row.id),
    ["c-001", "c-003", "c-004", "c-005"],
  )
  assert.equal(entries.length, 6)
})
