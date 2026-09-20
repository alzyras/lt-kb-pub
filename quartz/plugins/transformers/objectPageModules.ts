import { Element, ElementContent, Root as HTMLRoot, RootContent } from "hast"
import { toString } from "hast-util-to-string"
import { QuartzTransformerPlugin } from "../types"
import { cleanText, isObjectPage } from "../../util/objectMedia"

type ViewModel = Record<string, any>
type Topic = { id: string; label: string }

const FALLBACK_TOPIC_LABELS: Record<string, string> = {
  "karas-ir-karyba": "Karas ir karyba",
  "valdžia-ir-politika": "Valdžia ir politika",
  "diplomatija-ir-sutartys": "Diplomatija ir sutartys",
  "giminystė-ir-dinastija": "Giminystė ir dinastija",
  "šeima-meilė-ir-santuoka": "Šeima, meilė ir santuoka",
  "religija-ir-tikėjimas": "Religija ir tikėjimas",
  "teisė-ir-teisingumas": "Teisė ir teisingumas",
  "visuomenė-ir-luomai": "Visuomenė ir luomai",
  "ekonomika-ūkis-ir-prekyba": "Ekonomika, ūkis ir prekyba",
  "teritorijos-ir-valdos": "Teritorijos ir valdos",
  "miestai-pastatai-ir-infrastruktūra": "Miestai, pastatai ir infrastruktūra",
  "kelionės-ryšiai-ir-pasiuntinybės": "Kelionės, ryšiai ir pasiuntinybės",
  "kultūra-švietimas-ir-raštija": "Kultūra, švietimas ir raštija",
  "menas-simboliai-ir-atmintis": "Menas, simboliai ir atmintis",
  "kasdienybė-ir-materialinė-kultūra": "Kasdienybė ir materialinė kultūra",
  "sveikata-mirtis-ir-laidojimas": "Sveikata, mirtis ir laidojimas",
  "nusikaltimai-konfliktai-ir-bausmės": "Nusikaltimai, konfliktai ir bausmės",
  "gamta-ir-aplinka": "Gamta ir aplinka",
  kita: "Kita",
}

function text(value: unknown): ElementContent {
  return { type: "text", value: cleanText(value) }
}

// ``hast-util-to-string`` does not add whitespace between adjacent nodes. Keep
// intentional leading/trailing spaces for the few inline labels where the
// generated meta description and the visible markup both need them.
function rawText(value: string): ElementContent {
  return { type: "text", value }
}

function element(
  tagName: string,
  properties: Element["properties"] = {},
  children: ElementContent[] = [],
): Element {
  return { type: "element", tagName, properties, children }
}

function decode(value: unknown): unknown {
  if (value && typeof value === "object") return value
  if (typeof value !== "string" || !value.trim()) return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function decodeNested(value: unknown): unknown {
  let current = value
  for (let index = 0; index < 3 && typeof current === "string"; index += 1) {
    const next = decode(current)
    if (next === null || next === current) break
    current = next
  }
  return current
}

function viewModel(value: unknown): ViewModel | undefined {
  const decoded = decode(value)
  return decoded && typeof decoded === "object" && !Array.isArray(decoded)
    ? (decoded as ViewModel)
    : undefined
}

function hasClass(node: RootContent, className: string): boolean {
  if (node.type !== "element") return false
  const classes = node.properties?.className
  return Array.isArray(classes) ? classes.includes(className) : classes === className
}

function walk(node: RootContent, visit: (node: Element) => void): void {
  if (node.type !== "element") return
  visit(node)
  node.children.forEach((child) => walk(child, visit))
}

function elements(tree: HTMLRoot, predicate: (node: Element) => boolean): Element[] {
  const found: Element[] = []
  tree.children.forEach((child) => walk(child, (node) => {
    if (predicate(node)) found.push(node)
  }))
  return found
}

function heading(node: RootContent, title: string): boolean {
  return node.type === "element" && node.tagName === "h2" && toString(node).replace(/\s+/g, " ").trim().toLocaleLowerCase("lt-LT") === title.toLocaleLowerCase("lt-LT")
}

function safeHttps(value: unknown): string {
  const candidate = cleanText(value)
  return candidate.startsWith("https://") ? candidate : ""
}

function linkButton(label: unknown, href: unknown, className = "object-page-source-button"): Element | undefined {
  const url = safeHttps(href)
  if (!url) return undefined
  return element("a", { className: [className], href: url, target: "_blank", rel: "noreferrer noopener" }, [text(label)])
}

function sourceAttribution(wiki: ViewModel): Element[] {
  const source = wiki.source && typeof wiki.source === "object" ? wiki.source : {}
  const links = [
    linkButton("Straipsnio istorija", source.history_url, "object-page-source-meta-link"),
    linkButton("Licencija", source.license_url, "object-page-source-meta-link"),
  ].filter((value): value is Element => Boolean(value))
  const language = cleanText(source.language) || "lt"
  const revision = cleanText(source.revision_id)
  const label = language === "lt" ? "Vikipedija" : `Vikipedija (${language})`
  return [
    element("p", { className: ["object-page-source-attribution"] }, [
      text(`${label}${revision ? ` · versija ${revision}` : ""} · ${cleanText(source.license) || "CC BY-SA 4.0"}`),
      ...(links.length ? [rawText(" · "), ...links.flatMap((item, index) => index ? [rawText(" · "), item] : [item])] : []),
    ]),
  ]
}

function wikiPanel(wiki: ViewModel, sources: unknown): Element {
  const buttons = Array.isArray(sources)
    ? sources.map((source) => source && typeof source === "object" ? linkButton((source as ViewModel).label || (source as ViewModel).title || "Šaltinis", (source as ViewModel).url) : undefined).filter((value): value is Element => Boolean(value))
    : []
  const source = wiki.source && typeof wiki.source === "object" ? wiki.source : {}
  const original = cleanText(wiki.original_intro)
  return element("div", { className: ["object-page-wiki-panel"] }, [
    element("p", { className: ["object-page-eyebrow"] }, [text("Enciklopedinis įvadas")]),
    element("h2", {}, [text("Iš Vikipedijos")]),
    element("p", { className: ["object-page-wiki-origin"] }, [
      text(wiki.translation_status === "translated_verified" ? `Versta iš ${cleanText(source.language) || "kitos kalbos"} Vikipedijos` : "Paimta iš lietuviškos Vikipedijos"),
    ]),
    element("p", { className: ["object-page-wiki-intro"] }, [text(wiki.intro)]),
    ...(original ? [
      element("details", { className: ["object-page-wiki-original"] }, [
        element("summary", {}, [text("Rodyti originalią pastraipą")]),
        element("p", {}, [text(original)]),
      ]),
    ] : []),
    element("div", { className: ["object-page-source-buttons"], "aria-label": "Pagrindiniai šaltiniai" }, buttons),
    ...sourceAttribution(wiki),
  ])
}

function infoboxPanel(wiki: ViewModel): Element | undefined {
  const rows = Array.isArray(wiki.infobox) ? wiki.infobox.filter((row) => row && typeof row === "object" && cleanText(row.value)) : []
  if (!rows.length) return undefined
  return element("div", { className: ["object-page-infobox"] }, [
    element("p", { className: ["object-page-infobox-label"] }, [text("Pagrindiniai duomenys · Vikipedija")]),
    element("table", {}, [
      element("tbody", {}, rows.map((row) => element("tr", {}, [
        element("th", { scope: "row" }, [text(row.label)]),
        element("td", {}, [text(row.value)]),
      ]))),
    ]),
  ])
}

function introLayout(wiki: ViewModel, sources: unknown): Element {
  const right: ElementContent[] = [element("div", { className: ["object-page-media-slot"] }, [])]
  const infobox = infoboxPanel(wiki)
  if (infobox) right.push(infobox)
  return element("section", { className: ["object-page-intro-layout"], "aria-label": "Objekto įvadas" }, [
    wikiPanel(wiki, sources),
    element("aside", { className: ["object-page-profile-column"] }, right),
  ])
}

function traitTable(traits: ViewModel): Element | undefined {
  const rows = Array.isArray(traits.rows) ? traits.rows.filter((row) => row && typeof row === "object" && cleanText(row.value)) : []
  if (!rows.length || traits.status !== "published") return undefined
  return element("section", { className: ["object-page-traits"], "aria-labelledby": "object-page-traits-title" }, [
    element("p", { className: ["object-page-eyebrow"] }, [text("Šaltiniais pagrįsti bruožai")]),
    element("h2", { id: "object-page-traits-title" }, [text("Savybės")]),
    element("div", { className: ["object-page-table-wrap"] }, [
      element("table", { className: ["object-page-data-table"] }, [
        element("thead", {}, [element("tr", {}, [element("th", {}, [text("Savybė")]), element("th", {}, [text("Aprašymas")]), element("th", {}, [text("Laikas / kontekstas")]), element("th", {}, [text("Šaltiniai")])])]),
        element("tbody", {}, rows.map((row) => element("tr", { "data-trait-code": cleanText(row.canonical_code) }, [
          element("th", { scope: "row" }, [text(row.label)]),
          element("td", {}, [text(row.value)]),
          element("td", {}, [text(row.context || "—")]),
          element("td", {}, [
            ...(Array.isArray(row.source_refs) ? row.source_refs.slice(0, 4).flatMap((source: ViewModel, index: number) => {
              const external = linkButton(source.title || source.source || "Šaltinis", source.url, "object-page-trait-source")
              return index ? [rawText(" · "), ...(external ? [external] : [text(source.source || "Šaltinis")])] : [external || text(source.source || "Šaltinis")]
            }) : [text("Šaltinis")]),
          ]),
        ]))),
      ]),
    ]),
  ])
}

function featuredClaims(view: ViewModel): Element | undefined {
  const claims = Array.isArray(view.featured_claims) ? view.featured_claims.filter((row) => row && typeof row === "object" && cleanText(row.text)) : []
  if (!claims.length) return undefined
  return element("section", { className: ["object-page-featured-claims"], "aria-labelledby": "object-page-featured-title" }, [
    element("p", { className: ["object-page-eyebrow"] }, [text("Atrinkta iš patvirtintų teiginių")]),
    element("h2", { id: "object-page-featured-title" }, [text("Atrinkti faktai")]),
    element("ol", {}, claims.map((claim) => element("li", { "data-claim-id": cleanText(claim.claim_id) }, [
      element("p", {}, [text(claim.text)]),
      element("small", { className: ["object-page-claim-source"] }, [text(cleanText(claim.source))]),
    ]))),
  ])
}

function insertAfterSection(tree: HTMLRoot, title: string, sections: Element[]): void {
  if (!sections.length) return
  const summaryIndex = tree.children.findIndex((node) => heading(node, title))
  if (summaryIndex === -1) {
    tree.children.push(...sections)
    return
  }
  let insertIndex = summaryIndex + 1
  while (insertIndex < tree.children.length) {
    const node = tree.children[insertIndex]
    if (node.type === "element" && node.tagName === "h2") break
    insertIndex += 1
  }
  tree.children.splice(insertIndex, 0, ...sections)
}

function topicCatalog(frontmatter: Record<string, any> | undefined): Topic[] {
  const raw = decodeNested(frontmatter?.claim_topics_catalog_json)
  if (!Array.isArray(raw)) return Object.entries(FALLBACK_TOPIC_LABELS).map(([id, label]) => ({ id, label }))
  const parsed = raw
    .filter((row): row is Record<string, unknown> => Boolean(row && typeof row === "object"))
    .map((row) => ({ id: cleanText(row.id), label: cleanText(row.label) }))
    .filter((row) => row.id && row.label)
  return parsed.length > 0 ? parsed : Object.entries(FALLBACK_TOPIC_LABELS).map(([id, label]) => ({ id, label }))
}

function topicAssignments(frontmatter: Record<string, any> | undefined): Record<string, string[]> {
  const raw = decodeNested(frontmatter?.claim_topics_by_id_json)
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {}
  const result: Record<string, string[]> = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(value)) continue
    result[key] = [...new Set(value.map((item) => cleanText(item)).filter(Boolean))].slice(0, 3)
  }
  return result
}

function claimRows(tree: HTMLRoot): Element[] {
  return elements(tree, (node) => {
    const properties = node.properties as Record<string, unknown> | undefined
    return properties?.["data-claim-row"] === "true" || properties?.dataClaimRow === "true"
  })
}

function claimTopicPills(ids: string[], labels: Map<string, string>): Element | undefined {
  if (!ids.length) return undefined
  return element("span", { className: ["claim-topic-pills"], "aria-label": "Teiginio temos" }, ids.map((id) =>
    element("button", { className: ["claim-topic-pill"], type: "button", "data-claim-topic": id, "data-topic-id": id }, [text(labels.get(id) || id)]),
  ))
}

function decorateClaimTopics(rows: Element[], assignments: Record<string, string[]>, labels: Map<string, string>): Map<string, number> {
  const counts = new Map<string, number>()
  rows.forEach((row) => {
    const properties = row.properties as Record<string, unknown> | undefined
    // HAST may expose data-* attributes in either their literal HTML spelling
    // or the camel-cased property spelling, depending on which Markdown
    // transformer created the row. Accept both so topic assignments are not
    // silently dropped before the filter toolbar is built.
    const globalId = cleanText(properties?.["data-global-claim-id"] ?? properties?.dataGlobalClaimId)
    const localId = cleanText(properties?.["data-claim-local-id"] ?? properties?.dataClaimLocalId)
    const ids = assignments[globalId] || assignments[localId] || []
    row.properties = { ...row.properties, "data-claim-topics": ids.join("|") }
    ids.forEach((id) => counts.set(id, (counts.get(id) || 0) + 1))
    const cell = row.children.find((child): child is Element => child.type === "element" && child.tagName === "td")
    const pills = claimTopicPills(ids, labels)
    if (cell && pills) cell.children.push(pills)
  })
  return counts
}

function claimFilterToolbar(rows: Element[], counts: Map<string, number>, topics: Topic[]): Element {
  const topicButton = (topic: Topic): Element => element("button", {
    className: ["object-claim-topic-button"],
    type: "button",
    "data-object-topic": topic.id,
    "data-object-topic-id": topic.id,
    "data-topic-id": topic.id,
    "aria-pressed": "false",
  }, [text(topic.label), element("span", { className: ["object-claim-topic-count"], "data-topic-count": topic.id }, [text(String(counts.get(topic.id) || 0))])])
  const ordered = topics
    .filter((topic) => (counts.get(topic.id) || 0) > 0)
    .sort((left, right) => (counts.get(right.id) || 0) - (counts.get(left.id) || 0) || left.label.localeCompare(right.label, "lt"))
  const common = ordered.slice(0, 6)
  const more = ordered.slice(6)
  const controls: ElementContent[] = [
    element("div", { className: ["object-claim-filter-search"] }, [
      element("label", { htmlFor: "object-claim-search" }, [text("Ieškoti teiginiuose")]),
      element("input", { id: "object-claim-search", type: "search", placeholder: "Ieškoti teiginio tekste…", "data-object-claim-search": "true", autocomplete: "off" }),
    ]),
    element("div", { className: ["object-claim-filter-summary"], "aria-live": "polite" }, [
      element("strong", { "data-object-claim-result-count": "true" }, [text(`${rows.length}`)]),
      rawText(` iš ${rows.length} teiginių`),
    ]),
    element("div", { className: ["object-claim-topic-mode"], role: "group", "aria-label": "Temų atrankos logika" }, [
      element("span", { className: ["object-claim-filter-label"] }, [text("Temų logika")]),
      element("button", { className: ["object-claim-mode-button", "is-active"], type: "button", "data-object-topic-mode": "any", "aria-pressed": "true" }, [text("Bent viena")]),
      element("button", { className: ["object-claim-mode-button"], type: "button", "data-object-topic-mode": "all", "aria-pressed": "false" }, [text("Visos")]),
    ]),
    element("button", { className: ["object-claim-clear-button"], type: "button", "data-object-claim-clear": "true" }, [text("Išvalyti")]),
    element("div", { className: ["object-claim-topic-list"], role: "group", "aria-label": "Teiginių temos" }, common.map(topicButton)),
  ]
  if (more.length) {
    controls.push(element("details", { className: ["object-claim-more-topics"] }, [
      element("summary", {}, [text(`Daugiau temų (${more.length})`)]),
      element("div", { className: ["object-claim-topic-list", "object-claim-topic-list-more"], role: "group", "aria-label": "Daugiau teiginių temų" }, more.map(topicButton)),
    ]))
  }
  if (rows.length > 0 && ordered.length < 1) {
    controls.push(element("p", { className: ["object-claim-unclassified-note"] }, [text("Šių teiginių temos dar nesužymėtos; jie lieka bendrame sąraše.")]))
  }
  return element("section", { className: ["object-claim-filters", "object-page-generated"], "data-object-claim-filters": "true", "aria-label": "Teiginių filtrai" }, controls)
}

function fallbackHeader(state: "empty" | "content" | "enriched", claimCount: number, sourceCount: number): Element {
  const stats = [
    element("span", { className: ["object-page-stat"] }, [element("strong", {}, [text(String(claimCount))]), rawText(" patvirtintų teiginių")]),
    element("span", { className: ["object-page-stat"] }, [element("strong", {}, [text(String(sourceCount))]), rawText(" patikrintų šaltinių")]),
  ]
  return element("section", { className: ["object-page-overview-header", "object-page-generated"], "data-object-page-state": state, "aria-label": "Objekto turinio apžvalga" }, [
    element("p", { className: ["object-page-eyebrow"] }, [text(state === "empty" ? "Objekto įrašas" : state === "enriched" ? "Objekto apžvalga" : "Turima medžiaga")]),
    element("div", { className: ["object-page-overview-stats"] }, stats),
    ...(state === "empty" ? [element("p", { className: ["object-page-empty-message"] }, [text("Šis įrašas dar neturi patvirtintos medžiagos. Puslapis išlieka pasiekiamas, kol įrašas papildomas.")])] : []),
  ])
}

export const ObjectPageModules: QuartzTransformerPlugin = () => ({
  name: "ObjectPageModules",
  htmlPlugins() {
    return [
      () => (tree: HTMLRoot, file) => {
        if (!isObjectPage(file.data.slug)) return
        if (tree.children.some((child) => hasClass(child, "object-page-overview-header"))) return
        const frontmatter = (file.data.frontmatter ?? {}) as Record<string, any>
        const objectTitle = cleanText(frontmatter.pavadinimas)
        if (objectTitle) frontmatter.title = objectTitle
        const view = viewModel(frontmatter.object_page_view_json)
        const rows = claimRows(tree)
        const sourceData = decodeNested(frontmatter.external_sources_json)
        const sourceCount = Array.isArray(sourceData)
          ? sourceData.filter((source) => source && typeof source === "object" && cleanText((source as ViewModel).status || "published") === "published").length
          : 0
        const visibleText = cleanText(toString(tree))
        const state: "empty" | "content" | "enriched" = view ? "enriched" : rows.length || visibleText.length >= 80 ? "content" : "empty"
        frontmatter.object_page_content_state = state
        frontmatter.object_page_claim_count = rows.length
        frontmatter.object_page_source_count = sourceCount
        if (state === "empty" && frontmatter.noindex === undefined) frontmatter.noindex = true
        const topics = topicCatalog(frontmatter)
        const labels = new Map(topics.map((topic) => [topic.id, topic.label]))
        const counts = decorateClaimTopics(rows, topicAssignments(frontmatter), labels)
        if (rows.length) {
          const claimsSection = elements(tree, (node) => hasClass(node, "claims-section"))[0]
          const toolbar = claimFilterToolbar(rows, counts, topics)
          const toolbarIndex = claimsSection ? tree.children.findIndex((node) => node === claimsSection) : -1
          if (toolbarIndex >= 0) tree.children.splice(toolbarIndex, 0, toolbar)
          else tree.children.unshift(toolbar)
        }
        tree.children.unshift(fallbackHeader(state, rows.length, sourceCount))
        if (!view) return
        const wiki = view.wiki && typeof view.wiki === "object" && view.wiki.status === "published" ? view.wiki : undefined
        const infobox = wiki && Array.isArray(wiki.infobox) && wiki.infobox.length > 0
        if (wiki && (cleanText(wiki.intro) || infobox)) {
          const layout = introLayout(wiki, view.source_buttons)
          layout.properties = { ...layout.properties, className: ["object-page-generated", "object-page-intro-layout"] }
          const summaryIndex = tree.children.findIndex((node) => heading(node, "Santrauka"))
          if (summaryIndex >= 0) tree.children.splice(summaryIndex, 0, layout)
          else tree.children.unshift(layout)
        }
        const generated: Element[] = []
        const traits = view.traits && typeof view.traits === "object" ? traitTable(view.traits) : undefined
        if (traits) generated.push(traits)
        const facts = featuredClaims(view)
        if (facts) generated.push(facts)
        insertAfterSection(tree, "Santrauka", generated)
      },
    ]
  },
})
