import test, { describe } from "node:test"
import assert from "node:assert"
import { buildGraphExplorerIndex, ContentDetails, ContentIndexMap } from "./contentIndex"
import { FilePath, FullSlug, SimpleSlug } from "../../util/path"

function node(slug: FullSlug, details: Partial<ContentDetails>): ContentDetails {
  return {
    slug,
    filePath: `${slug}.md` as FilePath,
    title: slug,
    links: [],
    allLinks: [],
    tags: [],
    content: "",
    claimCount: 0,
    quoteCount: 0,
    ...details,
  } as ContentDetails
}

describe("GraphExplorerIndex", () => {
  test("keeps rich node metadata and evidence-backed edge previews", () => {
    const idx: ContentIndexMap = new Map([
      [
        "objektai/asmenys/Vytautas" as FullSlug,
        node("objektai/asmenys/Vytautas" as FullSlug, {
          title: "Vytautas",
          itemType: "asmuo",
          allLinks: ["objektai/ivykiai/Žalgirio mūšis (1410 m.)" as SimpleSlug],
          claimCount: 1,
          quoteCount: 1,
          citationSourceIds: ["source-a"],
          citationSourceTitles: ["Testinis šaltinis"],
          dateStart: 1350,
          dateEnd: 1430,
          centuries: ["XIV", "XV"],
          periodGroups: ["LDK"],
          summary: "Vytautas buvo Lietuvos valdovas.",
          claimEntries: [
            {
              id: "t-001",
              text: "Vytautas vadovavo Lietuvos kariuomenei per Žalgirio mūšis.",
              quoteIds: ["c-001"],
            },
          ],
          quoteEntries: [
            {
              id: "c-001",
              text: "Vytautas vadovavo Lietuvos kariuomenei per Žalgirio mūšis.",
              sourceTitle: "Testinis šaltinis",
              claimIds: ["t-001"],
            },
          ],
        }),
      ],
      [
        "objektai/ivykiai/Žalgirio mūšis (1410 m.)" as FullSlug,
        node("objektai/ivykiai/Žalgirio mūšis (1410 m.)" as FullSlug, {
          title: "Žalgirio mūšis (1410 m.)",
          itemType: "ivykis",
          claimCount: 3,
          quoteCount: 2,
        }),
      ],
    ])

    const graph = buildGraphExplorerIndex(idx)
    const vytautas = graph["objektai/asmenys/Vytautas" as FullSlug]

    assert.strictEqual(vytautas.type, "asmuo")
    assert.strictEqual(vytautas.claimCount, 1)
    assert.strictEqual(vytautas.quoteCount, 1)
    assert.deepStrictEqual(vytautas.citationSourceTitles, ["Testinis šaltinis"])
    assert.strictEqual(vytautas.dateStart, 1350)
    assert.strictEqual(vytautas.dateEnd, 1430)
    assert.deepStrictEqual(vytautas.centuries, ["XIV", "XV"])
    assert.strictEqual(vytautas.topClaims[0].id, "t-001")
    assert.strictEqual(vytautas.links[0].relationKind, "claim_quote_mention")
    assert.strictEqual(vytautas.links[0].evidencePreview[0].claimId, "t-001")
    assert.strictEqual(vytautas.links[0].evidencePreview[0].quoteId, "c-001")
    assert.deepStrictEqual(vytautas.links[0].sourceIds, ["testinis-saltinis"])
  })

  test("excludes period and source targets from object graph index", () => {
    const idx: ContentIndexMap = new Map([
      [
        "objektai/asmenys/Vytautas" as FullSlug,
        node("objektai/asmenys/Vytautas" as FullSlug, {
          title: "Vytautas",
          allLinks: [
            "laikotarpiai/XV amžius" as SimpleSlug,
            "objektai/saltiniai/Testas" as SimpleSlug,
          ],
        }),
      ],
      ["laikotarpiai/XV amžius" as FullSlug, node("laikotarpiai/XV amžius" as FullSlug, {})],
      [
        "objektai/saltiniai/Testas" as FullSlug,
        node("objektai/saltiniai/Testas" as FullSlug, {}),
      ],
    ])

    const graph = buildGraphExplorerIndex(idx)

    assert.deepStrictEqual(graph["objektai/asmenys/Vytautas" as FullSlug].links, [])
  })
})
