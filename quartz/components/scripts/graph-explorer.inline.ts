import { Application, Container, Graphics, Text } from "pixi.js"
import { select, zoom, zoomIdentity, ZoomTransform } from "d3"
import { FullSlug, SimpleSlug, getFullSlug, resolveRelative, simplifySlug } from "../../util/path"
import { loadSourceCatalog } from "../../util/sourceSettings"
import {
  buildVisibleGraph,
  cloneGraphState,
  layoutGlobalGraph,
  parseGraphState,
  serializeGraphState,
  summarizeFocusedGraph,
  type GraphState,
  type GraphTopology,
  type RuntimeEdge,
  type RuntimeNode,
  type TopologyEdge,
  type TopologyNode,
  type VisibleGraph,
} from "./graph-explorer-model"

type NodeDetails = { summary: string; topClaims: Array<{ id: string; text: string }>; sources: string[] }
type EdgeEvidence = { claimId: string; claimText: string; quoteId: string; quoteText: string; source: string; confidence: number }
type Camera = { x: number; y: number; k: number }
type HistoryEntry = { state: GraphState; camera?: Camera }
type SourceEntry = { id: string; title: string; quoteCount?: number; objectCount?: number }

const typeLabels: Record<string, string> = {
  asmuo: "Asmenys", autorius: "Autoriai", ivykis: "Įvykiai", grupe: "Grupės", vieta: "Vietos",
  daiktas: "Daiktai", paprotys: "Papročiai", posakis: "Posakiai", zodyno_irasas: "Žodynas",
}
const typeColors: Record<string, number> = {
  asmuo: 0x286456, autorius: 0x5d6f63, ivykis: 0x923120, grupe: 0x9b7b49, vieta: 0x557d8b,
  daiktas: 0x735a91, paprotys: 0xb66941, posakis: 0x8d4d72, zodyno_irasas: 0x626262,
}
const genericKinds = new Set(["claim_entity_mention", "quote_entity_mention", "shared_public_quote"])
const nodeDetailCache = new Map<string, Record<string, NodeDetails>>()
const evidenceCache = new Map<string, Record<string, EdgeEvidence[]>>()
const layerCache = new Map<string, TopologyEdge[]>()
const sourceTitleCache = new Map<string, string>()
const graphDataBase = new URL("../static/graph-data/", window.location.href)

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]!)
}
function normalize(value: string): string {
  return value.toLocaleLowerCase("lt-LT").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}
function parseNumber(value: string | null, fallback: number): number { const parsed=Number(value); return value!==null&&value!==""&&Number.isFinite(parsed)?parsed:fallback }
function parseOptional(value: string | null): number | null { if(!value)return null;const parsed=Number(value);return Number.isFinite(parsed)?parsed:null }
function mobileProfile(): boolean {
  return window.matchMedia("(max-width: 760px), (pointer: coarse)").matches
}
function stateFromUrl(defaultRelations: string[], allTypes: string[]): GraphState {
  const state=parseGraphState(new URLSearchParams(window.location.search),defaultRelations,allTypes)
  state.focus=state.focus?simplifySlug(state.focus as FullSlug):""
  return state
}
function stateUrl(state: GraphState, defaults: { relations: string[]; types: string[] }): string {
  const p=serializeGraphState(state,defaults)
  const query = p.toString()
  return query ? `${window.location.pathname}?${query}` : window.location.pathname
}
async function json<T>(url: URL): Promise<T> {
  const response = await fetch(url, { cache: "force-cache" })
  if (!response.ok) throw new Error(`${response.status} ${url.pathname}`)
  return response.json() as Promise<T>
}
async function bucketFor(value: string, count: number): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)))
  const first = ((digest[0] << 24) | (digest[1] << 16) | (digest[2] << 8) | digest[3]) >>> 0
  return (first % count).toString(16).padStart(2, "0")
}
async function nodeDetails(slug: string, topology: GraphTopology): Promise<NodeDetails | undefined> {
  const bucket = await bucketFor(slug, topology.nodeBuckets)
  if (!nodeDetailCache.has(bucket)) { const url=new URL(`nodes/${bucket}.json`,graphDataBase);url.searchParams.set("v",topology.generatedAt);nodeDetailCache.set(bucket,await json(url)) }
  return nodeDetailCache.get(bucket)?.[slug]
}
async function edgeEvidence(edgeId: string, topology: GraphTopology): Promise<EdgeEvidence[]> {
  const bucket = await bucketFor(edgeId, topology.evidenceBuckets)
  if (!evidenceCache.has(bucket)) { const url=new URL(`evidence/${bucket}.json`,graphDataBase);url.searchParams.set("v",topology.generatedAt);evidenceCache.set(bucket,await json(url)) }
  return evidenceCache.get(bucket)?.[edgeId] ?? []
}
async function loadLayer(kind: string, topology: GraphTopology): Promise<TopologyEdge[]> {
  if (layerCache.has(kind)) return layerCache.get(kind)!
  const file = topology.layerFiles[kind]
  if (!file) return []
  const url=new URL(file,graphDataBase);url.searchParams.set("v",topology.generatedAt)
  type CompactEdge = [string, number, number, number, number, number, number[]]
  const payload = await json<CompactEdge[]>(url)
  const edges:TopologyEdge[]=payload.map(([id,fromIndex,toIndex,kindIndex,confidence,evidenceCount,sourceRefs])=>{
    const sourceIds=sourceRefs.map((index)=>topology.sourceIds[index]).filter(Boolean)
    return{id,from:topology.nodes[fromIndex].slug,to:topology.nodes[toIndex].slug,kind:topology.relationKindCodes[kindIndex]??kind,layer:kind,confidence,evidenceCount,sourceIds,sourceTitles:sourceIds.map((id)=>sourceTitleCache.get(id)??id)}
  })
  layerCache.set(kind, edges)
  return edges
}
function createLayoutWorker(): Worker {
  const source = `onmessage=e=>{const{nodes,focus}=e.data;if(!focus){postMessage(nodes);return}const byHop={};for(const n of nodes){const hop=Math.max(0,n.hop);(byHop[hop]??=[]).push(n)}let previousOuter=0;for(const [raw,hopNodes] of Object.entries(byHop)){const hop=+raw;if(hop===0){hopNodes[0].px=0;hopNodes[0].py=0;continue}const typeGroups={};for(const n of hopNodes)(typeGroups[n.type]??=[]).push(n);const groups=Object.values(typeGroups).sort((a,b)=>b.length-a.length||a[0].type.localeCompare(b[0].type));const total=hopNodes.length;const inner=hop===1?75:previousOuter+95;const outer=inner+Math.max(180,Math.min(560,110+Math.sqrt(total)*20));previousOuter=outer;let offset=0;for(const list of groups){list.sort((a,b)=>b.degree-a.degree||a.id.localeCompare(b.id));const share=list.length/total;const start=(offset/total)*Math.PI*2;const span=Math.max(.16,share*Math.PI*2);for(let i=0;i<list.length;i++){const n=list[i];const seed=[...n.id].reduce((v,c)=>(v*33+c.charCodeAt(0))>>>0,5381);const phase=((i*.61803398875)%1);const angle=start+span*(.08+.84*phase)+(seed%37)*.0009;const radius=inner+Math.sqrt((i+.65)/Math.max(1,list.length))*(outer-inner)+(seed%13-6)*1.5;n.px=Math.cos(angle)*radius;n.py=Math.sin(angle)*radius}offset+=list.length}}postMessage(nodes)}`
  return new Worker(URL.createObjectURL(new Blob([source], { type: "text/javascript" })))
}
async function layoutGraph(graph: VisibleGraph, worker: Worker): Promise<void> {
  if (!graph.focus) {
    layoutGlobalGraph(graph.nodes)
    return
  }
  const result = await new Promise<Array<{ id: string; px: number; py: number }>>((resolve) => {
    const listener = (event: MessageEvent) => { worker.removeEventListener("message", listener); resolve(event.data) }
    worker.addEventListener("message", listener)
    worker.postMessage({ focus: graph.focus!.id, nodes: graph.nodes.map(({ id, px, py, hop, degree, type }) => ({ id, px, py, hop, degree, type })) })
  })
  const positions = new Map(result.map((node) => [node.id, node]))
  for (const node of graph.nodes) { const position = positions.get(node.id); if (position) { node.px = position.px; node.py = position.py } }
}
function nodeRadius(node: RuntimeNode, focused: boolean): number {
  return Math.min(17, 3.8 + Math.log1p(node.claimCount + node.quoteCount * 1.4 + node.degree) * 1.25) + (focused ? 4 : 0)
}
function relativePageUrl(slug: string): string {
  return new URL(resolveRelative(getFullSlug(window), slug as SimpleSlug), window.location.href).toString()
}
function panelControls(state: GraphState): string {
  return `<div class="graph-explorer-panel-modes"><button data-panel-mode="details" class="${state.panel === "details" ? "is-active" : ""}">Detalės</button><button data-panel-mode="page" class="${state.panel === "page" ? "is-active" : ""}">Puslapis</button><button data-panel-mode="hidden">Slėpti</button></div>`
}
function bindPanelControls(panel: HTMLElement, change: (mode: GraphState["panel"]) => void) {
  panel.querySelectorAll<HTMLButtonElement>("[data-panel-mode]").forEach((button) => button.addEventListener("click", () => change(button.dataset.panelMode as GraphState["panel"])))
}
function relationBreakdown(node: TopologyNode, graph: VisibleGraph, topology: GraphTopology, state: GraphState): string {
  const rows = Object.entries(node.relationCounts ?? {}).map(([kind, count]) => {
    const spec = topology.relationKinds[kind]
    if (!spec) return ""
    const active = state.relations.includes(kind)
    const shownOut = graph.edges.filter((edge) => edge.kind === kind && edge.from === node.slug).length
    const shownIn = graph.edges.filter((edge) => edge.kind === kind && edge.to === node.slug).length
    return `<button type="button" class="graph-relation-count ${active ? "is-active" : ""}" data-panel-relation="${escapeHtml(kind)}"><span>${escapeHtml(spec.label)}</span><b>${shownOut} / ${count.out}</b><small>${escapeHtml(spec.inverseLabel)}</small><b>${shownIn} / ${count.in}</b></button>`
  }).filter(Boolean)
  return rows.length ? `<h3 class="graph-relation-heading"><span>Ryšiai pagal tipą</span><small>Aktyvūs / visi</small></h3><div class="graph-relation-breakdown">${rows.join("")}</div>` : ""
}
function activeFilterSummary(state: GraphState, topology: GraphTopology): string {
  const labels:string[]=[]
  if(state.direction!=="both")labels.push(state.direction==="out"?"tik išeinantys ryšiai":"tik įeinantys ryšiai")
  if(state.minClaims)labels.push(`nuo ${state.minClaims} teiginių`)
  if(state.minQuotes)labels.push(`nuo ${state.minQuotes} citatų`)
  if(state.minConfidence!==.5)labels.push(`patikimumas nuo ${Math.round(state.minConfidence*100)} %`)
  if(state.from!==null||state.to!==null)labels.push(`laikotarpis ${state.from??"…"}–${state.to??"…"}`)
  if(state.sources.length)labels.push(`${state.sources.length} pasirinkt. knygų`)
  const defaultRelations=Object.values(topology.relationKinds).filter((spec)=>spec.defaultOn).length
  if(state.relations.length!==defaultRelations)labels.push(`${state.relations.length} ryšių tipai`)
  return labels.length?`<div class="graph-active-filters"><strong>Aktyvūs filtrai</strong><span>${labels.map(escapeHtml).join(" · ")}</span></div>`:""
}
async function renderNodePanel(panel: HTMLElement, node: RuntimeNode, graph: VisibleGraph, topology: GraphTopology, state: GraphState, setPanel: (mode: GraphState["panel"]) => void, toggleRelation: (kind: string) => void) {
  panel.scrollTop = 0
  if (state.panel === "page") {
    panel.innerHTML = `${panelControls(state)}<p>Kraunamas puslapis…</p>`; bindPanelControls(panel, setPanel)
    try {
      const response = await fetch(relativePageUrl(node.id)); const html = await response.text(); const doc = new DOMParser().parseFromString(html, "text/html")
      const article = doc.querySelector("article.popover-hint, article")
      panel.innerHTML = `${panelControls(state)}<div class="graph-explorer-page-content">${article?.innerHTML ?? "Puslapio nepavyko įkelti."}</div>`; bindPanelControls(panel, setPanel)
    } catch { panel.innerHTML = `${panelControls(state)}<p>Puslapio nepavyko įkelti.</p>`; bindPanelControls(panel, setPanel) }
    return
  }
  const details = await nodeDetails(node.id, topology)
  const counts = summarizeFocusedGraph(graph)
  panel.innerHTML = `${panelControls(state)}
    <header class="graph-explorer-panel-header"><p>${escapeHtml(typeLabels[node.type] ?? node.type)}</p><h2>${escapeHtml(node.title)}</h2></header>
    <dl class="graph-explorer-stats"><div><dt>Teiginiai</dt><dd>${node.claimCount}</dd></div><div><dt>Citatos</dt><dd>${node.quoteCount}</dd></div><div><dt>Susiję objektai</dt><dd>${counts.linkedObjects}</dd></div><div><dt>Tiesioginiai ryšiai</dt><dd>${counts.directEdges} / ${counts.possibleDirectEdges}</dd></div><div><dt>Subgrafo ryšiai</dt><dd>${counts.subgraphEdges}</dd></div></dl>
    <p class="graph-count-explanation">Tiesioginiai ryšiai jungia pasirinktą objektą su jo kaimynais. Subgrafo ryšiai apima ir ekrane rodomų kaimynų tarpusavio ryšius. Skaičiai pateikti kaip aktyvūs / visi.</p>
    ${activeFilterSummary(state,topology)}
    ${details?.summary ? `<p class="graph-explorer-summary">${escapeHtml(details.summary)}</p>` : ""}
    <div class="graph-explorer-actions"><a href="${relativePageUrl(node.id)}">Atidaryti</a></div>
    ${relationBreakdown(node, graph, topology, state)}
    ${details?.topClaims?.length ? `<h3>Teiginiai</h3><ol>${details.topClaims.slice(0, 3).map((claim) => `<li>${escapeHtml(claim.text)}</li>`).join("")}</ol>` : ""}
    ${details?.sources?.length ? `<h3>Šaltiniai</h3><ul>${details.sources.slice(0, 8).map((source) => `<li>${escapeHtml(source)}</li>`).join("")}</ul>` : ""}`
  bindPanelControls(panel, setPanel)
  panel.querySelectorAll<HTMLButtonElement>("[data-panel-relation]").forEach((button) => button.addEventListener("click", () => toggleRelation(button.dataset.panelRelation!)))
}
async function renderEdgePanel(panel: HTMLElement, edge: RuntimeEdge, topology: GraphTopology, state: GraphState, setPanel: (mode: GraphState["panel"]) => void) {
  panel.scrollTop = 0
  const spec = topology.relationKinds[edge.kind]
  const evidence = await edgeEvidence(edge.id, topology)
  panel.innerHTML = `${panelControls(state)}<header class="graph-explorer-panel-header"><p>Ryšys</p><h2>${escapeHtml(edge.source.title)} <span>${escapeHtml(spec?.label ?? edge.kind)}</span> ${escapeHtml(edge.target.title)}</h2></header>
    <dl class="graph-explorer-stats"><div><dt>Patikimumas</dt><dd>${Math.round(edge.confidence * 100)}%</dd></div><div><dt>Įrodymai</dt><dd>${edge.evidenceCount}</dd></div><div><dt>Sluoksnis</dt><dd>${escapeHtml(edge.layer)}</dd></div></dl>
    ${edge.sourceTitles.length?`<p class="graph-edge-sources"><strong>Šaltiniai:</strong> ${edge.sourceTitles.map(escapeHtml).join(", ")}</p>`:""}
    ${evidence.slice(0, 3).map((item) => `<article class="graph-edge-evidence"><strong>${escapeHtml(item.claimId)}</strong><p>${escapeHtml(item.claimText)}</p>${item.quoteText ? `<blockquote>${escapeHtml(item.quoteText)}</blockquote>` : ""}<small>${escapeHtml(item.source)}</small></article>`).join("") || "<p>Ryšys pateiktas viešame puslapyje be atskiros citatos peržiūros.</p>"}`
  bindPanelControls(panel, setPanel)
}
type Renderer = { destroy: () => void; camera: () => Camera; applyCamera: (camera: Camera) => void }
async function renderPixi(container: HTMLElement, graph: VisibleGraph, handlers: { focus: (slug: string) => void; edge: (edge: RuntimeEdge) => void; camera: (camera: Camera) => void }): Promise<Renderer> {
  container.querySelector("canvas")?.remove()
  const width = Math.max(320, container.clientWidth), height = Math.max(320, container.clientHeight)
  const app = new Application()
  await app.init({ width, height, antialias: true, autoStart: false, autoDensity: true, backgroundAlpha: 0, preference: "webgl", resolution: Math.min(2, window.devicePixelRatio) })
  container.prepend(app.canvas)
  const world = new Container(); const edgeGfx = new Graphics(); const nodeGfx = new Graphics(); const labelLayer = new Container<Text>()
  world.addChild(edgeGfx, nodeGfx, labelLayer); app.stage.addChild(world)
  let transform: ZoomTransform = zoomIdentity
  let hovered: RuntimeNode | null = null
  const labels = new Map<string, Text>()
  const rankedNodes = [...graph.nodes].sort((a, b) => (b.degree + b.claimCount * .08) - (a.degree + a.claimCount * .08))
  const byNodeId = new Map(graph.nodes.map((node)=>[node.id,node]))
  function ensureLabel(node: RuntimeNode): Text {
    let label=labels.get(node.id)
    if(!label){label=new Text({text:node.title,anchor:{x:.5,y:1.3},style:{fontSize:12,fill:0x241c18,fontFamily:"Arial, sans-serif",fontWeight:node===graph.focus?"700":"500",stroke:{color:0xf8f2e8,width:3}}});label.position.set(node.px,node.py-nodeRadius(node,node===graph.focus));labelLayer.addChild(label);labels.set(node.id,label)}
    return label
  }
  function updateLabels(){
    const limit=mobileProfile()?(transform.k<.7?20:transform.k<1.4?60:250):(transform.k<.35?30:transform.k<.7?90:transform.k<1.2?180:transform.k<2?500:1400)
    const wanted=new Set(rankedNodes.slice(0,limit).map((node)=>node.id));if(graph.focus)wanted.add(graph.focus.id);if(hovered)wanted.add(hovered.id)
    for(const id of wanted){const node=byNodeId.get(id);if(node)ensureLabel(node)}
    for(const [id,label] of labels){label.visible=wanted.has(id);label.scale.set(1/Math.max(.75,Math.sqrt(transform.k)))}
  }
  function draw(redrawGeometry=true) {
    if(redrawGeometry){
      edgeGfx.clear(); nodeGfx.clear()
      for (const edge of graph.edges) {
        const selected = hovered && (edge.from === hovered.id || edge.to === hovered.id)
        const touchesFocus = graph.focus && (edge.from === graph.focus.id || edge.to === graph.focus.id)
        const density = graph.edges.length > 900 ? .34 : graph.edges.length > 350 ? .56 : 1
        const alpha = selected ? .9 : Math.max(.025, Math.min(touchesFocus ? .3 : .2, edge.confidence * .42 * density * (touchesFocus ? 1 : .55)))
        const color = selected ? 0xa52d20 : edge.layer === "semantic" ? 0x756149 : 0xb0a18a
      edgeGfx.moveTo(edge.source.px, edge.source.py).lineTo(edge.target.px, edge.target.py).stroke({ color, alpha, width: selected ? 2.2 : Math.min(2.1, .35 + Math.log1p(edge.evidenceCount) * .28) })
      }
      for (const node of graph.nodes) {
        const focused = node === graph.focus, active = node === hovered
        nodeGfx.circle(node.px, node.py, nodeRadius(node, focused)).fill({ color: typeColors[node.type] ?? 0x85755f, alpha: .96 }).stroke({ color: focused ? 0xb52c1e : active ? 0x301d18 : 0xfffaf1, width: focused ? 4 : active ? 2.5 : 1.1 })
      }
    }
    updateLabels()
    app.render()
  }
  const spatialCellSize = 100
  const spatial = new Map<string, RuntimeNode[]>()
  for (const node of graph.nodes) {
    const key = `${Math.floor(node.px / spatialCellSize)}:${Math.floor(node.py / spatialCellSize)}`
    const bucket = spatial.get(key) ?? []
    bucket.push(node)
    spatial.set(key, bucket)
  }
  function hitNode(event: PointerEvent): RuntimeNode | null {
    const rect = app.canvas.getBoundingClientRect(); const x = (event.clientX - rect.left - transform.x) / transform.k; const y = (event.clientY - rect.top - transform.y) / transform.k
    let best: RuntimeNode | null = null, distance = Infinity
    const cellX = Math.floor(x / spatialCellSize), cellY = Math.floor(y / spatialCellSize)
    const candidates: RuntimeNode[] = []
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) candidates.push(...(spatial.get(`${cellX + dx}:${cellY + dy}`) ?? []))
    for (const node of candidates) { const d = Math.hypot(node.px - x, node.py - y); if (d < distance && d <= nodeRadius(node, node === graph.focus) + 7 / transform.k) { best = node; distance = d } }
    return best
  }
  function hitEdge(event: PointerEvent): RuntimeEdge | null {
    const rect = app.canvas.getBoundingClientRect(); const x = (event.clientX - rect.left - transform.x) / transform.k; const y = (event.clientY - rect.top - transform.y) / transform.k
    let best: RuntimeEdge | null = null, bestDistance = 7 / transform.k
    for (const edge of graph.edges) { const ax=edge.source.px, ay=edge.source.py, bx=edge.target.px, by=edge.target.py, dx=bx-ax, dy=by-ay; const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1))); const d=Math.hypot(x-(ax+t*dx),y-(ay+t*dy)); if(d<bestDistance){best=edge;bestDistance=d} }
    return best
  }
  const zoomBehavior = zoom<HTMLCanvasElement, unknown>().scaleExtent([.08, 8]).on("zoom", (event) => { transform=event.transform; world.position.set(transform.x, transform.y); world.scale.set(transform.k); draw(false) }).on("end", () => handlers.camera({ x: transform.x, y: transform.y, k: transform.k }))
  select(app.canvas).call(zoomBehavior as any)
  app.canvas.addEventListener("pointermove", (event) => { const node=hitNode(event); if(node!==hovered){hovered=node; app.canvas.style.cursor=node?"pointer":"grab"; draw()} })
  app.canvas.addEventListener("click", (event) => { const node=hitNode(event); if(node){handlers.focus(node.id);return} const edge=hitEdge(event); if(edge){handlers.edge(edge);draw()} })
  const bounds = graph.nodes.reduce((acc,node)=>({minX:Math.min(acc.minX,node.px-25),maxX:Math.max(acc.maxX,node.px+25),minY:Math.min(acc.minY,node.py-35),maxY:Math.max(acc.maxY,node.py+25)}),{minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity})
  if (graph.nodes.length) { const graphWidth=Math.max(1,bounds.maxX-bounds.minX), graphHeight=Math.max(1,bounds.maxY-bounds.minY), padding=mobileProfile()?46:72; const scale=Math.max(.08,Math.min(2.4,Math.min((width-padding*2)/graphWidth,(height-padding*2)/graphHeight))); const cx=(bounds.minX+bounds.maxX)/2,cy=(bounds.minY+bounds.maxY)/2; select(app.canvas).call(zoomBehavior.transform as any,zoomIdentity.translate(width/2-cx*scale,height/2-cy*scale).scale(scale)) }
  draw()
  return { destroy: () => app.destroy(true), camera: () => ({x:transform.x,y:transform.y,k:transform.k}), applyCamera: (camera) => select(app.canvas).call(zoomBehavior.transform as any,zoomIdentity.translate(camera.x,camera.y).scale(camera.k)) }
}
function renderCanvasFallback(container: HTMLElement, graph: VisibleGraph, handlers: { focus: (slug: string) => void; edge: (edge: RuntimeEdge) => void; camera: (camera: Camera) => void }): Renderer {
  container.querySelector("canvas")?.remove()
  const canvas = document.createElement("canvas")
  const width = Math.max(320, container.clientWidth), height = Math.max(320, container.clientHeight)
  const ratio = Math.min(2, window.devicePixelRatio || 1)
  canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio)
  canvas.style.width = `${width}px`; canvas.style.height = `${height}px`
  container.prepend(canvas)
  const context = canvas.getContext("2d")!
  let transform: ZoomTransform = zoomIdentity
  const important = new Set([...graph.nodes].sort((a,b)=>(b.degree+b.claimCount*.08)-(a.degree+a.claimCount*.08)).slice(0,mobileProfile()?20:80).map((node)=>node.id))
  const spatialCellSize=100, spatial=new Map<string,RuntimeNode[]>()
  for(const node of graph.nodes){const key=`${Math.floor(node.px/spatialCellSize)}:${Math.floor(node.py/spatialCellSize)}`;const bucket=spatial.get(key)??[];bucket.push(node);spatial.set(key,bucket)}
  const point=(event:PointerEvent)=>{const rect=canvas.getBoundingClientRect();return{x:(event.clientX-rect.left-transform.x)/transform.k,y:(event.clientY-rect.top-transform.y)/transform.k}}
  const hitNode=(event:PointerEvent)=>{const {x,y}=point(event);const cx=Math.floor(x/spatialCellSize),cy=Math.floor(y/spatialCellSize);let best:RuntimeNode|null=null,distance=Infinity;for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(const node of spatial.get(`${cx+dx}:${cy+dy}`)??[]){const d=Math.hypot(node.px-x,node.py-y);if(d<distance&&d<=nodeRadius(node,node===graph.focus)+7/transform.k){best=node;distance=d}}return best}
  const hitEdge=(event:PointerEvent)=>{const {x,y}=point(event);let best:RuntimeEdge|null=null,distance=7/transform.k;for(const edge of graph.edges){const ax=edge.source.px,ay=edge.source.py,bx=edge.target.px,by=edge.target.py,dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1))),d=Math.hypot(x-(ax+t*dx),y-(ay+t*dy));if(d<distance){best=edge;distance=d}}return best}
  function draw(){context.setTransform(ratio,0,0,ratio,0,0);context.clearRect(0,0,width,height);context.save();context.translate(transform.x,transform.y);context.scale(transform.k,transform.k);const density=graph.edges.length>900?.34:graph.edges.length>350?.56:1;for(const edge of graph.edges){const touchesFocus=graph.focus&&(edge.from===graph.focus.id||edge.to===graph.focus.id),alpha=Math.max(.025,Math.min(touchesFocus?.3:.2,edge.confidence*.42*density*(touchesFocus?1:.55)));context.beginPath();context.moveTo(edge.source.px,edge.source.py);context.lineTo(edge.target.px,edge.target.py);context.strokeStyle=edge.layer==="semantic"?`rgba(117,97,73,${alpha})`:`rgba(176,161,138,${alpha})`;context.lineWidth=Math.min(2.1,.35+Math.log1p(edge.evidenceCount)*.28);context.stroke()}for(const node of graph.nodes){const focus=node===graph.focus;context.beginPath();context.arc(node.px,node.py,nodeRadius(node,focus),0,Math.PI*2);context.fillStyle=`#${(typeColors[node.type]??0x85755f).toString(16).padStart(6,"0")}`;context.fill();context.lineWidth=focus?4:1.1;context.strokeStyle=focus?"#b52c1e":"#fffaf1";context.stroke();if((transform.k>=.65&&important.has(node.id))||focus){context.save();context.scale(1/transform.k,1/transform.k);context.font=`${focus?700:500} 12px Arial, sans-serif`;context.textAlign="center";context.lineWidth=3;const tx=node.px*transform.k,ty=(node.py-nodeRadius(node,focus)-5)*transform.k;context.strokeStyle="#f8f2e8";context.strokeText(node.title,tx,ty);context.fillStyle="#241c18";context.fillText(node.title,tx,ty);context.restore()}}context.restore()}
  const zoomBehavior=zoom<HTMLCanvasElement,unknown>().scaleExtent([.08,8]).on("zoom",(event)=>{transform=event.transform;draw()}).on("end",()=>handlers.camera({x:transform.x,y:transform.y,k:transform.k}))
  select(canvas).call(zoomBehavior as any)
  canvas.addEventListener("pointermove",(event)=>canvas.style.cursor=hitNode(event)?"pointer":"grab")
  canvas.addEventListener("click",(event)=>{const node=hitNode(event);if(node){handlers.focus(node.id);return}const edge=hitEdge(event);if(edge)handlers.edge(edge)})
  const bounds=graph.nodes.reduce((acc,node)=>({minX:Math.min(acc.minX,node.px-25),maxX:Math.max(acc.maxX,node.px+25),minY:Math.min(acc.minY,node.py-35),maxY:Math.max(acc.maxY,node.py+25)}),{minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity})
  if(graph.nodes.length){const graphWidth=Math.max(1,bounds.maxX-bounds.minX),graphHeight=Math.max(1,bounds.maxY-bounds.minY),padding=mobileProfile()?46:72,scale=Math.max(.08,Math.min(2.4,Math.min((width-padding*2)/graphWidth,(height-padding*2)/graphHeight))),cx=(bounds.minX+bounds.maxX)/2,cy=(bounds.minY+bounds.maxY)/2;select(canvas).call(zoomBehavior.transform as any,zoomIdentity.translate(width/2-cx*scale,height/2-cy*scale).scale(scale))}
  draw()
  return{destroy:()=>{select(canvas).on(".zoom",null);canvas.remove()},camera:()=>({x:transform.x,y:transform.y,k:transform.k}),applyCamera:(camera)=>select(canvas).call(zoomBehavior.transform as any,zoomIdentity.translate(camera.x,camera.y).scale(camera.k))}
}
async function renderGraph(container: HTMLElement, graph: VisibleGraph, handlers: { focus: (slug: string) => void; edge: (edge: RuntimeEdge) => void; camera: (camera: Camera) => void }): Promise<Renderer> {
  try { return await renderPixi(container, graph, handlers) }
  catch (error) { console.warn("WebGL nepasiekiamas, naudojamas Canvas2D rendereris.", error); return renderCanvasFallback(container, graph, handlers) }
}
function typeOptions(root: HTMLElement, topology: GraphTopology, state: GraphState, onChange: () => void) {
  const list=root.querySelector<HTMLElement>("[data-type-list]")!; const counts=new Map<string,number>(); for(const node of topology.nodes)counts.set(node.type,(counts.get(node.type)??0)+1)
  list.innerHTML=[...counts].filter(([type])=>typeLabels[type]).sort((a,b)=>typeLabels[a[0]].localeCompare(typeLabels[b[0]],"lt")).map(([type,count])=>`<label><input type="checkbox" value="${escapeHtml(type)}" ${state.types.includes(type)?"checked":""}/><span>${escapeHtml(typeLabels[type])}</span><b>${count}</b></label>`).join("")
  list.querySelectorAll<HTMLInputElement>("input").forEach((input)=>input.addEventListener("change",()=>{state.types=input.checked?[...new Set([...state.types,input.value])]:state.types.filter((value)=>value!==input.value);onChange()}))
  const isolated=root.querySelector<HTMLInputElement>("input[name='showIsolated']")!; isolated.checked=state.showIsolated; isolated.onchange=()=>{state.showIsolated=isolated.checked;onChange()}
  root.querySelector<HTMLElement>("[data-isolated-count]")!.textContent=String(topology.nodes.filter((node)=>!node.connected).length)
}
function relationOptions(root: HTMLElement, topology: GraphTopology, state: GraphState, onChange: (kind?:string)=>void) {
  const container=root.querySelector<HTMLElement>("[data-relation-groups]")!; const groups=new Map<string,{label:string;kinds:string[]}>()
  for(const [kind,spec] of Object.entries(topology.relationKinds)){const group=groups.get(spec.group)??{label:spec.groupLabel,kinds:[]};group.kinds.push(kind);groups.set(spec.group,group)}
  container.innerHTML=[...groups].map(([group,data])=>{const active=data.kinds.filter((kind)=>state.relations.includes(kind)).length;const count=data.kinds.reduce((sum,kind)=>sum+(topology.relationKinds[kind].edgeCount??0),0);return `<details ${group!=="bendri"?"open":""}><summary><label><input type="checkbox" data-relation-group="${group}" ${active===data.kinds.length?"checked":""}/><span>${escapeHtml(data.label)}</span><b>${count}</b></label></summary><div>${data.kinds.sort((a,b)=>topology.relationKinds[a].label.localeCompare(topology.relationKinds[b].label,"lt")).map((kind)=>`<label><input type="checkbox" value="${kind}" ${state.relations.includes(kind)?"checked":""}/><span>${escapeHtml(topology.relationKinds[kind].label)}</span><b>${topology.relationKinds[kind].edgeCount??0}</b></label>`).join("")}</div></details>`}).join("")
  container.querySelectorAll<HTMLInputElement>("input[value]").forEach((input)=>input.addEventListener("change",()=>{state.relations=input.checked?[...new Set([...state.relations,input.value])]:state.relations.filter((value)=>value!==input.value);onChange(input.value)}))
  container.querySelectorAll<HTMLInputElement>("[data-relation-group]").forEach((input)=>input.addEventListener("change",()=>{const kinds=groups.get(input.dataset.relationGroup!)!.kinds;state.relations=input.checked?[...new Set([...state.relations,...kinds])]:state.relations.filter((value)=>!kinds.includes(value));onChange()}))
}
function popovers(root: HTMLElement) {
  const close=()=>{root.querySelectorAll<HTMLElement>("[data-popover-panel]").forEach((panel)=>panel.hidden=true);root.querySelectorAll<HTMLButtonElement>("[data-popover-toggle]").forEach((button)=>button.setAttribute("aria-expanded","false"))}
  root.querySelectorAll<HTMLButtonElement>("[data-popover-toggle]").forEach((button)=>button.addEventListener("click",()=>{const panel=root.querySelector<HTMLElement>(`[data-popover-panel='${button.dataset.popoverToggle}']`)!;const opening=panel.hidden;close();panel.hidden=!opening;button.setAttribute("aria-expanded",String(opening))}))
  root.querySelectorAll<HTMLButtonElement>("[data-popover-close]").forEach((button)=>button.addEventListener("click",close))
  document.addEventListener("keydown",(event)=>{if(event.key==="Escape")close()})
}
async function setup(root: HTMLElement) {
  document.body.classList.add("graph-explorer-active")
  const status=root.querySelector<HTMLElement>("[data-graph-status]")!,canvas=root.querySelector<HTMLElement>("[data-graph-canvas]")!,panel=root.querySelector<HTMLElement>("[data-graph-panel]")!
  const runtime=globalThis as typeof globalThis & {loadGraphTopology?:()=>Promise<GraphTopology>}
  const topology=runtime.loadGraphTopology?await runtime.loadGraphTopology():await json<GraphTopology>(new URL("topology.json",graphDataBase)); const allTypes=[...new Set(topology.nodes.map((node)=>node.type))].filter((type)=>typeLabels[type]); const defaults={relations:Object.entries(topology.relationKinds).filter(([,spec])=>spec.defaultOn).map(([kind])=>kind),types:allTypes}
  let state=stateFromUrl(defaults.relations,defaults.types); let allEdges=[...topology.edges]; let renderer:Renderer|null=null; const worker=createLayoutWorker(); let renderToken=0; let camera:Camera|undefined
  let historyEntries:HistoryEntry[]=[{state:cloneGraphState(state)}],historyIndex=0
  const sourceCatalog=(await loadSourceCatalog().catch(()=>[])) as SourceEntry[]
  for(const source of sourceCatalog)sourceTitleCache.set(source.id,source.title)
  const selectedSourceIds=()=>new Set(state.sources)
  const updateHistoryButtons=()=>{(root.querySelector("[data-history-back]") as HTMLButtonElement).disabled=historyIndex<=0;(root.querySelector("[data-history-forward]") as HTMLButtonElement).disabled=historyIndex>=historyEntries.length-1}
  const saveCamera=()=>{historyEntries[historyIndex].camera=camera;window.history.replaceState({graphIndex:historyIndex,camera},"",stateUrl(state,defaults))}
  const commit=(mode:"push"|"replace"="push")=>{const entry={state:cloneGraphState(state),camera};if(mode==="push"){historyEntries=historyEntries.slice(0,historyIndex+1);historyEntries.push(entry);historyIndex++;window.history.pushState({graphIndex:historyIndex,camera},"",stateUrl(state,defaults))}else{historyEntries[historyIndex]=entry;window.history.replaceState({graphIndex:historyIndex,camera},"",stateUrl(state,defaults))}updateHistoryButtons()}
  async function ensureLayers(){for(const kind of state.relations)if(genericKinds.has(kind)&&!layerCache.has(kind)){allEdges.push(...await loadLayer(kind,topology))}}
  async function rerender(restoreCamera?: Camera) {
    const token = ++renderToken
    status.hidden = false
    status.textContent = "Ruošiamas žemėlapis…"
    await ensureLayers()
    const graph = buildVisibleGraph(topology, allEdges, state, selectedSourceIds())
    await layoutGraph(graph, worker)
    if (token !== renderToken) return

    root.querySelector<HTMLElement>("[data-focus-context]")!.hidden = !graph.focus
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    if (token !== renderToken) return
    renderer?.destroy()
    renderer = await renderGraph(canvas, graph, {
      focus: (slug) => {
        state = { ...state, focus: slug, depth: 1, panel: state.panel === "hidden" ? "details" : state.panel }
        commit()
        sync()
        void rerender()
      },
      edge: (edge) => {
        state = { ...state, panel: "details" }
        root.dataset.panel = "details"
        commit("replace")
        void renderEdgePanel(panel, edge, topology, state, (mode) => {
          state = { ...state, panel: mode }
          root.dataset.panel = mode
          commit("replace")
          void rerender(camera)
        })
      },
      camera: (value) => {
        camera = value
        saveCamera()
      },
    })
    if (restoreCamera) renderer.applyCamera(restoreCamera)

    status.hidden = true
    root.dataset.panel = state.panel

    if (graph.focus) {
      const counts = summarizeFocusedGraph(graph)
      root.querySelector<HTMLElement>("[data-focus-title]")!.textContent = graph.focus.title
      root.querySelector<HTMLElement>("[data-focus-neighbours]")!.textContent = `${counts.linkedObjects.toLocaleString("lt-LT")} susiję objektai`
      root.querySelector<HTMLElement>("[data-focus-direct]")!.textContent = `${counts.directEdges.toLocaleString("lt-LT")} tiesioginiai ryšiai`
      root.querySelector<HTMLElement>("[data-focus-subgraph]")!.textContent = `${counts.subgraphEdges.toLocaleString("lt-LT")} ryšiai subgrafe`
      if (state.panel !== "hidden") {
        void renderNodePanel(
          panel,
          graph.focus,
          graph,
          topology,
          state,
          (mode) => {
            state = { ...state, panel: mode }
            commit("replace")
            void rerender(camera)
          },
          (kind) => {
            state.relations = state.relations.includes(kind)
              ? state.relations.filter((value) => value !== kind)
              : [...state.relations, kind]
            commit()
            sync()
            void rerender()
          },
        )
      }
    } else if (state.panel !== "hidden") {
      panel.innerHTML = `${panelControls(state)}<h2>${graph.nodes.length.toLocaleString("lt-LT")} objektai</h2><p>${graph.edges.length.toLocaleString("lt-LT")} ryšiai visame matomame tinkle. Pasirink objektą arba ryšį.</p>`
      bindPanelControls(panel, (mode) => {
        state = { ...state, panel: mode }
        commit("replace")
        void rerender(camera)
      })
    }

    const scope = graph.focus ? "Subgrafas" : "Tinklas"
    root.querySelector<HTMLElement>("[data-graph-legend]")!.innerHTML = `<span>${scope}: ${graph.nodes.length.toLocaleString("lt-LT")} objektai</span><span>${graph.edges.length.toLocaleString("lt-LT")} ryšiai</span>`
  }
  function sync(){typeOptions(root,topology,state,()=>{commit();sync();void rerender()});relationOptions(root,topology,state,()=>{commit();sync();void rerender()});root.querySelector<HTMLElement>("[data-type-count]")!.textContent=String(state.types.length);root.querySelector<HTMLElement>("[data-relation-count]")!.textContent=String(state.relations.length);(root.querySelector("input[name='minClaims']") as HTMLInputElement).value=String(state.minClaims);(root.querySelector("input[name='minQuotes']") as HTMLInputElement).value=String(state.minQuotes);(root.querySelector("input[name='minConfidence']") as HTMLInputElement).value=String(state.minConfidence);(root.querySelector("select[name='direction']") as HTMLSelectElement).value=state.direction;root.querySelector<HTMLOutputElement>("[data-confidence-output]")!.value=`${Math.round(state.minConfidence*100)}%`;(root.querySelector("input[name='from']") as HTMLInputElement).value=state.from===null?"":String(state.from);(root.querySelector("input[name='to']") as HTMLInputElement).value=state.to===null?"":String(state.to);root.querySelectorAll<HTMLInputElement>("input[name='depth']").forEach((input)=>input.checked=Number(input.value)===state.depth);root.dataset.panel=state.panel;updateHistoryButtons()}
  popovers(root); sync(); updateHistoryButtons(); window.history.replaceState({graphIndex:0},"",stateUrl(state,defaults))
  const search=root.querySelector<HTMLInputElement>("[data-graph-search-input]")!,suggest=root.querySelector<HTMLElement>("[data-graph-suggest]")!,suggestList=root.querySelector<HTMLElement>("[data-graph-suggest-list]")!;let suggestions:TopologyNode[]=[];let active=0
  const overview=root.querySelector<HTMLElement>("[data-graph-overview]")!
  const renderSuggestions=()=>{const needle=normalize(search.value.trim());if(needle.length<2){suggest.hidden=true;return}suggestions=topology.nodes.filter((node)=>normalize(node.title).includes(needle)).sort((a,b)=>{const ae=normalize(a.title)===needle?1:0,be=normalize(b.title)===needle?1:0;return be-ae||b.degree-a.degree||a.title.localeCompare(b.title,"lt")}).slice(0,10);suggestList.innerHTML=suggestions.map((node,index)=>`<button type="button" role="option" class="${index===active?"is-active":""}" data-suggestion="${escapeHtml(node.slug)}"><strong>${escapeHtml(node.title)}</strong><span>${escapeHtml(typeLabels[node.type]??node.type)} · ${node.claimCount} teig. · ${node.quoteCount} cit.</span></button>`).join("")||"<p>Nerasta objektų.</p>";suggest.hidden=false;suggestList.querySelectorAll<HTMLButtonElement>("[data-suggestion]").forEach((button)=>button.addEventListener("click",()=>choose(button.dataset.suggestion!)))}
  const choose=(slug:string)=>{search.value="";suggest.hidden=true;overview.hidden=true;state={...state,focus:slug,depth:1,panel:state.panel==="hidden"?"details":state.panel};commit();sync();void rerender()}
  search.addEventListener("input",()=>{active=0;renderSuggestions()});search.addEventListener("keydown",(event)=>{if(event.key==="ArrowDown"){active=Math.min(suggestions.length-1,active+1);event.preventDefault();renderSuggestions()}else if(event.key==="ArrowUp"){active=Math.max(0,active-1);event.preventDefault();renderSuggestions()}else if(event.key==="Enter"&&suggestions[active]){event.preventDefault();choose(suggestions[active].slug)}else if(event.key==="Escape")suggest.hidden=true})
  root.querySelector<HTMLButtonElement>("[data-history-back]")!.onclick=()=>{if(historyIndex>0)window.history.back()}
  root.querySelector<HTMLButtonElement>("[data-history-forward]")!.onclick=()=>{if(historyIndex<historyEntries.length-1)window.history.forward()}
  root.querySelector<HTMLButtonElement>("[data-graph-home]")!.onclick=()=>{state={...state,focus:"",depth:1,panel:"hidden"};commit();sync();renderer?.destroy();renderer=null;overview.hidden=false;status.hidden=true}
  root.querySelector<HTMLButtonElement>("[data-clear-focus]")!.onclick=()=>{state={...state,focus:"",depth:1,panel:"hidden"};const context=root.querySelector<HTMLElement>("[data-focus-context]")!;context.hidden=true;root.querySelector<HTMLElement>("[data-focus-title]")!.textContent="";commit();sync();renderer?.destroy();renderer=null;overview.hidden=false;status.hidden=true}
  root.querySelector<HTMLButtonElement>("[data-graph-reset]")!.onclick=()=>{state={...stateFromUrl(defaults.relations,defaults.types),sources:[]};commit();sync();void rerender()}
  root.querySelector<HTMLButtonElement>("[data-panel-toggle]")!.onclick=()=>{state={...state,panel:state.panel==="hidden"?"details":"hidden"};commit("replace");sync();void rerender()};root.querySelector<HTMLButtonElement>("[data-panel-show]")!.onclick=()=>{state={...state,panel:"details"};commit("replace");sync();void rerender()}
  root.querySelectorAll<HTMLInputElement>("input[name='depth']").forEach((input)=>input.onchange=()=>{state.depth=Number(input.value);commit();sync();void rerender()})
  for(const name of ["minClaims","minQuotes","from","to"]){const input=root.querySelector<HTMLInputElement>(`input[name='${name}']`)!;input.onchange=()=>{if(name==="minClaims")state.minClaims=parseNumber(input.value,0);if(name==="minQuotes")state.minQuotes=parseNumber(input.value,0);if(name==="from")state.from=parseOptional(input.value);if(name==="to")state.to=parseOptional(input.value);commit();void rerender()}}
  const confidence=root.querySelector<HTMLInputElement>("input[name='minConfidence']")!;confidence.oninput=()=>{state.minConfidence=Number(confidence.value);root.querySelector<HTMLOutputElement>("[data-confidence-output]")!.value=`${Math.round(state.minConfidence*100)}%`;commit("replace");void rerender()};confidence.onchange=()=>commit()
  const direction=root.querySelector<HTMLSelectElement>("select[name='direction']")!;direction.onchange=()=>{state.direction=direction.value as GraphState["direction"];commit();void rerender()}
  const sourceList=root.querySelector<HTMLElement>("[data-source-list]")!,sourceSearch=root.querySelector<HTMLInputElement>("[data-source-search]")!;const renderSources=()=>{const needle=normalize(sourceSearch.value);sourceList.innerHTML=sourceCatalog.filter((source)=>normalize(source.title).includes(needle)).map((source)=>`<label><input type="checkbox" value="${escapeHtml(source.id)}" ${state.sources.includes(source.id)?"checked":""}/><span>${escapeHtml(source.title)}</span><b>${source.quoteCount??0}</b></label>`).join("");sourceList.querySelectorAll<HTMLInputElement>("input").forEach((input)=>input.onchange=()=>{state.sources=input.checked?[...new Set([...state.sources,input.value])]:state.sources.filter((value)=>value!==input.value);commit();void rerender()})};sourceSearch.oninput=renderSources;root.querySelector<HTMLButtonElement>("[data-source-select-all]")!.onclick=()=>{state.sources=[];commit();renderSources();void rerender()};root.querySelector<HTMLButtonElement>("[data-source-clear]")!.onclick=()=>{state.sources=["__none__"];commit();renderSources();void rerender()};renderSources()
  window.addEventListener("popstate",(event)=>{const index=Number(event.state?.graphIndex);if(Number.isInteger(index)&&historyEntries[index]){historyIndex=index;state=cloneGraphState(historyEntries[index].state);camera=historyEntries[index].camera}else{state=stateFromUrl(defaults.relations,defaults.types)}sync();void rerender(camera)})
  root.querySelector<HTMLButtonElement>("[data-overview-search]")!.onclick=()=>search.focus()
  root.querySelector<HTMLButtonElement>("[data-overview-all]")!.onclick=()=>{overview.hidden=true;void rerender()}
  if (state.focus) await rerender()
  else { overview.hidden=false; status.hidden=true }
  window.addCleanup?.(()=>{renderer?.destroy();worker.terminate();document.body.classList.remove("graph-explorer-active")})
}

document.addEventListener("nav",()=>{const root=document.querySelector<HTMLElement>("[data-graph-explorer]");if(root)void setup(root).catch((error)=>{const status=root.querySelector<HTMLElement>("[data-graph-status]");if(status)status.textContent=`Nepavyko įkelti žemėlapio: ${error instanceof Error?error.message:String(error)}`})})
