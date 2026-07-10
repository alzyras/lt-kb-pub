type ObjectMapPreviewLink = {
  target?: string
  targetTitle?: string
  targetType?: string
  evidenceCount?: number
  confidence?: number
  relationKind?: string
  defaultOn?: boolean
}

type ObjectMapPreviewNode = {
  slug?: string
  title?: string
  type?: string
  claimCount?: number
  quoteCount?: number
  links?: ObjectMapPreviewLink[]
}

type ObjectMapPreviewRuntime = typeof globalThis & {
  loadGraphTopology?: () => Promise<{
    nodes?: Array<{ slug: string; title: string; type: string; claimCount: number; quoteCount: number }>
    edges?: Array<{ from: string; to: string; kind: string; evidenceCount: number; confidence: number }>
    relationKinds?: Record<string, { defaultOn?: boolean }>
  }>
  addCleanup?: (cleanup: () => void) => void
}

type ObjectMapNeighbour = {
  slug: string
  title: string
  type: string
  evidenceCount: number
  confidence: number
}

type ObjectMapRuntimeNode = {
  id: string
  title: string
  type: string
  score: number
  degree: number
  evidenceCount: number
  focus: boolean
  x: number
  y: number
}

type ObjectMapRuntimeLink = {
  source: ObjectMapRuntimeNode
  target: ObjectMapRuntimeNode
  evidenceCount: number
  confidence: number
  relationKind?: string
}

type ObjectMapLabelBounds = {
  left: number
  right: number
  top: number
  bottom: number
}

const objectMapRuntime = globalThis as ObjectMapPreviewRuntime
let objectMapIndexPromise: Promise<Record<string, ObjectMapPreviewNode>> | undefined
const objectMapPreviewInitialized = new WeakSet<HTMLElement>()

const objectMapTypeColors: Record<string, string> = {
  asmuo: "#286456",
  autorius: "#5d6f63",
  ivykis: "#923120",
  grupe: "#9b7b49",
  vieta: "#557d8b",
  daiktas: "#735a91",
  paprotys: "#b66941",
  posakis: "#8d4d72",
  zodyno_irasas: "#626262",
  tema: "#445f8f",
}

const objectMapPreviewMinConfidence = 0.5

function objectMapIndexFromTopology(topology: {
  nodes?: Array<{ slug: string; title: string; type: string; claimCount: number; quoteCount: number }>
  edges?: Array<{ from: string; to: string; kind: string; evidenceCount: number; confidence: number }>
  relationKinds?: Record<string, { defaultOn?: boolean }>
}): Record<string, ObjectMapPreviewNode> {
  const index: Record<string, ObjectMapPreviewNode> = {}
  for (const node of topology.nodes ?? []) {
    index[node.slug] = { ...node, links: [] }
  }
  for (const edge of topology.edges ?? []) {
    const source = index[edge.from]
    const target = index[edge.to]
    const relation = topology.relationKinds?.[edge.kind]
    if (!source || !target || !relation?.defaultOn || edge.confidence < objectMapPreviewMinConfidence) continue
    source.links!.push({
      target: edge.to,
      targetTitle: target.title,
      targetType: target.type,
      evidenceCount: edge.evidenceCount,
      confidence: edge.confidence,
      relationKind: edge.kind,
      defaultOn: relation?.defaultOn ?? true,
    })
  }
  return index
}

async function loadObjectMapIndex(): Promise<Record<string, ObjectMapPreviewNode>> {
  if (!objectMapIndexPromise) {
    objectMapIndexPromise = (async () => {
      if (objectMapRuntime.loadGraphTopology) {
        try {
          const topology = await objectMapRuntime.loadGraphTopology()
          return objectMapIndexFromTopology(topology)
        } catch {
          // Fall back to stable static paths; object pages live several folders deep.
        }
      }

      const candidates = [
        "/static/graph-data/topology.json",
        "../static/graph-data/topology.json",
        "../../static/graph-data/topology.json",
        "../../../static/graph-data/topology.json",
      ]

      for (const candidate of candidates) {
        try {
          const response = await fetch(candidate, { cache: "force-cache" })
          if (response.ok) {
            const topology = (await response.json()) as {
              nodes?: Array<{ slug: string; title: string; type: string; claimCount: number; quoteCount: number }>
              edges?: Array<{ from: string; to: string; kind: string; evidenceCount: number; confidence: number }>
            }
            return objectMapIndexFromTopology(topology)
          }
        } catch {
          // Try the next candidate.
        }
      }

      throw new Error("Failed to fetch graph explorer index")
    })()
  }
  return objectMapIndexPromise
}

function objectMapNodeType(slug: string, node?: ObjectMapPreviewNode): string {
  if (node?.type) return node.type
  if (slug.startsWith("temos/")) return "tema"
  if (slug.startsWith("objektai/ivykiai/")) return "ivykis"
  if (slug.startsWith("objektai/grupes/")) return "grupe"
  if (slug.startsWith("objektai/vietos/")) return "vieta"
  if (slug.startsWith("objektai/daiktai/")) return "daiktas"
  if (slug.startsWith("objektai/paprociai/")) return "paprotys"
  if (slug.startsWith("objektai/posakiai/")) return "posakis"
  if (slug.startsWith("objektai/zodynas/")) return "zodyno_irasas"
  if (slug.startsWith("objektai/autoriai/")) return "autorius"
  return "asmuo"
}

function objectMapPreviewAllowed(slug: string): boolean {
  return (
    !slug.startsWith("laikotarpiai/") &&
    !slug.startsWith("temos/") &&
    !slug.startsWith("objektai/saltiniai/")
  )
}

function objectMapResolveNode(
  index: Record<string, ObjectMapPreviewNode>,
  slug: string,
): [string, ObjectMapPreviewNode] | undefined {
  const direct = index[slug]
  if (direct) return [slug, direct]

  const simplified = slug.replace(/\/index$/, "")
  const match = Object.entries(index).find(([candidate]) => candidate.replace(/\/index$/, "") === simplified)
  return match
}

function objectMapNeighbours(
  index: Record<string, ObjectMapPreviewNode>,
  slug: string,
  node: ObjectMapPreviewNode,
): ObjectMapNeighbour[] {
  const neighbours = new Map<string, ObjectMapNeighbour>()

  const add = (targetSlug: string, fallbackTitle: string, fallbackType: string, evidenceCount = 0, confidence = 0) => {
    if (!targetSlug || targetSlug === slug) return
    if (!objectMapPreviewAllowed(targetSlug)) return
    const target = index[targetSlug]
    const existing = neighbours.get(targetSlug)
    const next = {
      slug: targetSlug,
      title: target?.title || fallbackTitle || targetSlug.split("/").at(-1) || targetSlug,
      type: fallbackType || objectMapNodeType(targetSlug, target),
      evidenceCount: Math.max(0, Number(evidenceCount) || 0),
      confidence: Math.max(0, Math.min(1, Number(confidence) || 0)),
    }
    if (!existing || next.evidenceCount > existing.evidenceCount) {
      neighbours.set(targetSlug, next)
    }
  }

  for (const link of node.links ?? []) {
    const target = String(link.target ?? "")
    add(target, String(link.targetTitle ?? ""), String(link.targetType ?? ""), link.evidenceCount, link.confidence)
  }

  for (const [sourceSlug, source] of Object.entries(index)) {
    if (sourceSlug === slug) continue
    const matching = (source.links ?? []).find((link) => link.target === slug)
    if (matching) {
      add(
        sourceSlug,
        String(source.title ?? ""),
        objectMapNodeType(sourceSlug, source),
        matching.evidenceCount,
        matching.confidence,
      )
    }
  }

  return [...neighbours.values()]
    .sort((a, b) => {
      const evidenceDiff = b.evidenceCount - a.evidenceCount
      if (evidenceDiff !== 0) return evidenceDiff
      return a.title.localeCompare(b.title, "lt")
    })
}

function objectMapHash(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function objectMapRuntimeRadius(node: ObjectMapRuntimeNode): number {
  if (node.focus) return 23
  return Math.min(18, Math.max(4.8, 4.5 + Math.log1p(node.score) * 1.6))
}

function objectMapLinkEndpoints(link: ObjectMapRuntimeLink): [ObjectMapRuntimeNode, ObjectMapRuntimeNode] {
  return [link.source as ObjectMapRuntimeNode, link.target as ObjectMapRuntimeNode]
}

function objectMapBoundsOverlap(a: ObjectMapLabelBounds, b: ObjectMapLabelBounds): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

function objectMapLabelBounds(
  x: number,
  y: number,
  width: number,
  height: number,
): ObjectMapLabelBounds {
  return {
    left: x - width / 2,
    right: x + width / 2,
    top: y - height,
    bottom: y,
  }
}

function buildObjectMapPreviewGraph(
  index: Record<string, ObjectMapPreviewNode>,
  slug: string,
  node: ObjectMapPreviewNode,
  neighbours: ObjectMapNeighbour[],
): { nodes: ObjectMapRuntimeNode[]; links: ObjectMapRuntimeLink[] } {
  const selected = new Set([slug, ...neighbours.map((neighbour) => neighbour.slug)])

  const neighbourBySlug = new Map(neighbours.map((neighbour) => [neighbour.slug, neighbour]))
  const nodes = [...selected].map((id, position): ObjectMapRuntimeNode => {
    const source = id === slug ? node : index[id]
    const neighbour = neighbourBySlug.get(id)
    const hash = objectMapHash(id)
    const angle = position * 2.399963229728653 + ((hash % 1000) / 1000) * 0.28
    const spread = 68 + Math.sqrt(Math.max(1, position)) * 23
    const jitter = ((hash % 31) - 15) * 0.8
    return {
      id,
      title: String(source?.title || neighbour?.title || id.split("/").at(-1) || id),
      type: objectMapNodeType(id, source) || neighbour?.type || "asmuo",
      score: 1,
      degree: 0,
      evidenceCount: neighbour?.evidenceCount ?? 0,
      focus: id === slug,
      x: id === slug ? 0 : Math.cos(angle) * spread + jitter,
      y: id === slug ? 0 : Math.sin(angle) * spread + jitter,
    }
  })
  const nodeById = new Map(nodes.map((runtimeNode) => [runtimeNode.id, runtimeNode]))
  const linksByPair = new Map<string, ObjectMapRuntimeLink>()

  const addLink = (sourceSlug: string, targetSlug: string, link: ObjectMapPreviewLink) => {
    if (sourceSlug === targetSlug || !selected.has(sourceSlug) || !selected.has(targetSlug)) return
    const source = nodeById.get(sourceSlug)
    const target = nodeById.get(targetSlug)
    if (!source || !target) return
    const pairKey = [sourceSlug, targetSlug].sort().join(" ")
    const evidenceCount = Math.max(0, Number(link.evidenceCount) || 0)
    const confidence = Math.max(0, Math.min(1, Number(link.confidence) || 0.34))
    if (link.defaultOn === false || confidence < objectMapPreviewMinConfidence) return
    const existing = linksByPair.get(pairKey)
    if (existing) {
      existing.evidenceCount += evidenceCount
      existing.confidence = Math.max(existing.confidence, confidence)
      return
    }
    linksByPair.set(pairKey, {
      source,
      target,
      evidenceCount,
      confidence,
      relationKind: link.relationKind,
    })
  }

  for (const sourceSlug of selected) {
    const source = sourceSlug === slug ? node : index[sourceSlug]
    for (const link of source?.links ?? []) {
      const targetSlug = String(link.target ?? "")
      addLink(sourceSlug, targetSlug, link)
    }
  }

  const links = [...linksByPair.values()]
  for (const link of links) {
    const [source, target] = objectMapLinkEndpoints(link)
    source.degree += 1
    target.degree += 1
    source.evidenceCount += link.evidenceCount
    target.evidenceCount += link.evidenceCount
  }

  for (const runtimeNode of nodes) {
    const source = runtimeNode.id === slug ? node : index[runtimeNode.id]
    const claimCount = Math.max(0, Number(source?.claimCount) || 0)
    const quoteCount = Math.max(0, Number(source?.quoteCount) || 0)
    runtimeNode.score = claimCount + quoteCount * 1.8 + runtimeNode.degree * 2 + Math.log1p(runtimeNode.evidenceCount) * 3
  }

  return { nodes, links }
}

function layoutObjectMapPreviewGraph(nodes: ObjectMapRuntimeNode[]) {
  const focus = nodes.find((node) => node.focus)
  if (!focus) return
  focus.x = 0
  focus.y = 0

  const groups = new Map<string, ObjectMapRuntimeNode[]>()
  for (const node of nodes) {
    if (node.focus) continue
    const group = groups.get(node.type) ?? []
    group.push(node)
    groups.set(node.type, group)
  }
  const outerNodes = nodes.filter((node) => !node.focus)
  const total = Math.max(1, outerNodes.length)
  let offset = 0
  const innerRadius = 92
  const outerRadius = innerRadius + Math.max(132, Math.min(296, 104 + Math.sqrt(total) * 23))
  const orderedGroups = [...groups.values()].sort(
    (a, b) => b.length - a.length || a[0].type.localeCompare(b[0].type, "lt"),
  )

  for (const group of orderedGroups) {
    group.sort((a, b) => b.score - a.score || b.degree - a.degree || a.title.localeCompare(b.title, "lt"))
    const start = (offset / total) * Math.PI * 2
    const span = Math.max(0.14, (group.length / total) * Math.PI * 2)
    for (let index = 0; index < group.length; index++) {
      const node = group[index]
      const seed = objectMapHash(node.id)
      const phase = (index * 0.61803398875) % 1
      const angle = start + span * (0.09 + phase * 0.82) + (seed % 37) * 0.0009
      const radius =
        innerRadius +
        Math.sqrt((index + 0.65) / Math.max(1, group.length)) * (outerRadius - innerRadius) +
        ((seed % 13) - 6) * 1.5
      node.x = Math.cos(angle) * radius
      node.y = Math.sin(angle) * radius
    }
    offset += group.length
  }
}

function drawObjectMapPreview(
  canvas: HTMLCanvasElement,
  neighbours: ObjectMapNeighbour[],
  index: Record<string, ObjectMapPreviewNode>,
  slug: string,
  node: ObjectMapPreviewNode,
) {
  const rect = canvas.getBoundingClientRect()
  const width = Math.max(430, rect.width || canvas.clientWidth || 540)
  const height = Math.max(290, rect.height || canvas.clientHeight || 350)
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.floor(width * pixelRatio)
  canvas.height = Math.floor(height * pixelRatio)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = "#fdfcf9"
  ctx.fillRect(0, 0, width, height)

  const graph = buildObjectMapPreviewGraph(index, slug, node, neighbours)
  layoutObjectMapPreviewGraph(graph.nodes)

  const labelNodes = [...graph.nodes]
    .sort((a, b) => {
      const diff = (b.focus ? 10000 : 0) + b.score + b.degree * 2 - ((a.focus ? 10000 : 0) + a.score + a.degree * 2)
      return diff === 0 ? a.title.localeCompare(b.title, "lt") : diff
    })
    .slice(0, graph.nodes.length > 96 ? 38 : 54)
  const labelSet = new Set(labelNodes.map((runtimeNode) => runtimeNode.id))
  const bounds = graph.nodes.map((runtimeNode) => {
    const x = runtimeNode.x ?? 0
    const y = runtimeNode.y ?? 0
    const radius = objectMapRuntimeRadius(runtimeNode) + 8
    const labelWidth = labelSet.has(runtimeNode.id) ? Math.min(170, runtimeNode.title.length * 5.8 + 14) : 0
    const halfWidth = Math.max(radius, labelWidth / 2)
    return {
      minX: x - halfWidth,
      maxX: x + halfWidth,
      minY: y - radius - (labelSet.has(runtimeNode.id) ? 18 : 0),
      maxY: y + radius,
    }
  })
  const minX = Math.min(...bounds.map((bound) => bound.minX))
  const maxX = Math.max(...bounds.map((bound) => bound.maxX))
  const minY = Math.min(...bounds.map((bound) => bound.minY))
  const maxY = Math.max(...bounds.map((bound) => bound.maxY))
  const graphWidth = Math.max(1, maxX - minX)
  const graphHeight = Math.max(1, maxY - minY)
  const padding = graph.nodes.length > 96 ? 26 : 38
  const scale = Math.min((width - padding * 2) / graphWidth, (height - padding * 2) / graphHeight)
  const offsetX = width / 2 - ((minX + maxX) / 2) * scale
  const offsetY = height / 2 - ((minY + maxY) / 2) * scale
  const project = (runtimeNode: ObjectMapRuntimeNode) => ({
    x: (runtimeNode.x ?? 0) * scale + offsetX,
    y: (runtimeNode.y ?? 0) * scale + offsetY,
  })

  ctx.lineCap = "round"
  for (const link of graph.links) {
    const [source, target] = objectMapLinkEndpoints(link)
    const s = project(source)
    const t = project(target)
    ctx.beginPath()
    ctx.moveTo(s.x, s.y)
    ctx.lineTo(t.x, t.y)
    ctx.globalAlpha = Math.max(0.18, Math.min(0.68, (link.confidence || 0.34) * 0.72))
    ctx.strokeStyle =
      link.relationKind === "public_relation" ? "rgba(176, 161, 138, 0.7)" : "rgba(117, 97, 73, 0.78)"
    ctx.lineWidth = Math.max(0.5, Math.min(2.3, 0.45 + Math.log1p(link.evidenceCount) * 0.42))
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  for (const runtimeNode of graph.nodes) {
    const pos = project(runtimeNode)
    const nodeRadius = Math.max(2.5, objectMapRuntimeRadius(runtimeNode) * Math.sqrt(scale))
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2)
    ctx.fillStyle = objectMapTypeColors[runtimeNode.type] ?? "#735a91"
    ctx.fill()
    ctx.strokeStyle = runtimeNode.focus ? "#d6421f" : "rgba(255, 255, 255, 0.9)"
    ctx.lineWidth = runtimeNode.focus ? 3.2 : 1.2
    ctx.stroke()
  }

  const drawnLabelBounds: ObjectMapLabelBounds[] = []
  ctx.textAlign = "center"
  ctx.textBaseline = "bottom"
  for (const runtimeNode of labelNodes) {
    const pos = project(runtimeNode)
    const required = runtimeNode.focus
    const fontSize = required ? 11 : runtimeNode.degree > 8 ? 10 : 8.8
    const label = runtimeNode.title.length > 24 ? `${runtimeNode.title.slice(0, 23)}…` : runtimeNode.title
    const nodeRadius = Math.max(2.5, objectMapRuntimeRadius(runtimeNode) * Math.sqrt(scale))
    ctx.font = `${required ? 700 : 500} ${fontSize}px var(--bodyFont, sans-serif)`
    const labelWidth = Math.min(width - 16, ctx.measureText(label).width + 7)
    const labelHeight = fontSize + 5
    const labelY = pos.y - nodeRadius - 3
    const labelBounds = objectMapLabelBounds(pos.x, labelY, labelWidth, labelHeight)
    const inCanvas =
      labelBounds.right >= 0 &&
      labelBounds.left <= width &&
      labelBounds.bottom >= 0 &&
      labelBounds.top <= height
    if (!inCanvas && !required) continue
    if (!required && drawnLabelBounds.some((existing) => objectMapBoundsOverlap(existing, labelBounds))) continue
    drawnLabelBounds.push(labelBounds)
    ctx.lineWidth = 3
    ctx.strokeStyle = "rgba(255,255,255,0.9)"
    ctx.fillStyle = "#33241a"
    ctx.strokeText(label, pos.x, labelY)
    ctx.fillText(label, pos.x, labelY)
  }

  ctx.font = "700 10px var(--codeFont, monospace)"
  ctx.textAlign = "left"
  ctx.textBaseline = "bottom"
  ctx.fillStyle = "#d6421f"
  ctx.fillText(`${neighbours.length.toLocaleString("lt-LT")} RYS.`, 12, height - 12)
}

function setObjectMapStatus(root: HTMLElement, text: string, hidden = false) {
  const status = root.querySelector<HTMLElement>("[data-object-map-status]")
  if (!status) return
  status.textContent = text
  status.hidden = hidden
}

async function renderObjectMapPreview(root: HTMLElement) {
  const slug = String(root.dataset.objectSlug ?? "")
  const count = root.querySelector<HTMLElement>("[data-object-map-count]")
  const canvas = root.querySelector<HTMLCanvasElement>("[data-object-map-canvas]")
  if (!slug || !canvas) return

  try {
    const index = await loadObjectMapIndex()
    const resolved = objectMapResolveNode(index, slug)
    if (!resolved) {
      if (count) count.textContent = "Žemėlapio duomenų šiam objektui dar nėra."
      setObjectMapStatus(root, "Nėra duomenų")
      return
    }

    const [resolvedSlug, node] = resolved
    const neighbours = objectMapNeighbours(index, resolvedSlug, node)
    if (count) {
      count.textContent =
        neighbours.length === 0
          ? "Ryšių šiame žemėlapyje dar nėra."
          : `${neighbours.length.toLocaleString("lt-LT")} ryšiai`
    }
    setObjectMapStatus(root, neighbours.length === 0 ? "Nėra ryšių" : "", neighbours.length > 0)
    drawObjectMapPreview(canvas, neighbours, index, resolvedSlug, node)
  } catch {
    if (count) count.textContent = "Žemėlapio preview nepavyko įkelti."
    setObjectMapStatus(root, "Nepavyko įkelti")
  }
}

function initObjectMapPreviews() {
  document.querySelectorAll<HTMLElement>('[data-object-map-cta="true"]').forEach((root) => {
    if (objectMapPreviewInitialized.has(root)) return
    objectMapPreviewInitialized.add(root)

    const render = () => {
      window.requestAnimationFrame(() => renderObjectMapPreview(root))
    }
    render()

    const observer = "ResizeObserver" in window ? new ResizeObserver(render) : undefined
    if (observer) {
      observer.observe(root)
      objectMapRuntime.addCleanup?.(() => observer.disconnect())
    }
  })
}

initObjectMapPreviews()
document.addEventListener("nav", initObjectMapPreviews)
