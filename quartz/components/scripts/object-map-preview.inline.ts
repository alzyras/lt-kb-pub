type ObjectMapPreviewLink = {
  target?: string
  targetTitle?: string
  targetType?: string
  evidenceCount?: number
  confidence?: number
}

type ObjectMapPreviewNode = {
  slug?: string
  title?: string
  type?: string
  links?: ObjectMapPreviewLink[]
}

type ObjectMapPreviewRuntime = typeof globalThis & {
  loadGraphExplorerIndex?: () => Promise<Record<string, ObjectMapPreviewNode>>
  addCleanup?: (cleanup: () => void) => void
}

type ObjectMapNeighbour = {
  slug: string
  title: string
  type: string
  evidenceCount: number
  confidence: number
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

async function loadObjectMapIndex(): Promise<Record<string, ObjectMapPreviewNode>> {
  if (!objectMapIndexPromise) {
    objectMapIndexPromise = (async () => {
      if (objectMapRuntime.loadGraphExplorerIndex) {
        try {
          return await objectMapRuntime.loadGraphExplorerIndex()
        } catch {
          // Fall back to stable static paths; object pages live several folders deep.
        }
      }

      const candidates = [
        "/static/graphExplorerIndex.json",
        "../static/graphExplorerIndex.json",
        "../../static/graphExplorerIndex.json",
        "../../../static/graphExplorerIndex.json",
      ]

      for (const candidate of candidates) {
        try {
          const response = await fetch(candidate, { cache: "force-cache" })
          if (response.ok) {
            return (await response.json()) as Record<string, ObjectMapPreviewNode>
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

function drawObjectMapPreview(
  canvas: HTMLCanvasElement,
  title: string,
  type: string,
  neighbours: ObjectMapNeighbour[],
) {
  const rect = canvas.getBoundingClientRect()
  const width = Math.max(260, rect.width || canvas.clientWidth || 320)
  const height = Math.max(170, rect.height || canvas.clientHeight || 200)
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.floor(width * pixelRatio)
  canvas.height = Math.floor(height * pixelRatio)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, width, height)

  const center = { x: width * 0.48, y: height * 0.52 }
  const count = neighbours.length
  const ringCount = count <= 28 ? 1 : count <= 90 ? 2 : 3
  const nodeScale = count > 140 ? 0.52 : count > 80 ? 0.62 : count > 36 ? 0.76 : 1
  const edgeAlphaScale = count > 140 ? 0.46 : count > 80 ? 0.58 : count > 36 ? 0.74 : 1
  const innerRadiusX = width * 0.2
  const innerRadiusY = height * 0.18
  const outerRadiusX = width * 0.38
  const outerRadiusY = height * 0.38
  const outer = neighbours.map((neighbour, index) => {
    const ring = ringCount === 1 ? 0 : index % ringCount
    const ringProgress = ringCount === 1 ? 1 : ring / (ringCount - 1)
    const ringIndex = Math.floor(index / ringCount)
    const ringItems = Math.ceil((count - ring) / ringCount)
    const angleOffset = (ring * Math.PI) / Math.max(ringCount, 1)
    const angle = -Math.PI / 2 + angleOffset + (Math.PI * 2 * ringIndex) / Math.max(ringItems, 1)
    const radiusX = innerRadiusX + (outerRadiusX - innerRadiusX) * ringProgress
    const radiusY = innerRadiusY + (outerRadiusY - innerRadiusY) * ringProgress
    return {
      ...neighbour,
      x: center.x + Math.cos(angle) * radiusX,
      y: center.y + Math.sin(angle) * radiusY,
      ring,
    }
  })

  ctx.lineCap = "round"
  outer.forEach((node) => {
    ctx.beginPath()
    ctx.moveTo(center.x, center.y)
    ctx.lineTo(node.x, node.y)
    const alpha = Math.max(0.08, Math.min(0.58, (node.confidence || 0.34) * edgeAlphaScale))
    ctx.strokeStyle = `rgba(90, 37, 95, ${alpha})`
    ctx.lineWidth = Math.max(0.75, Math.min(3.4, (0.8 + Math.log1p(node.evidenceCount) * 0.72) * nodeScale))
    ctx.stroke()
  })

  outer.forEach((node) => {
    const nodeRadius = Math.max(2.1, (5.2 + Math.min(5, Math.log1p(node.evidenceCount))) * nodeScale)
    ctx.beginPath()
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2)
    ctx.fillStyle = objectMapTypeColors[node.type] ?? "#735a91"
    ctx.fill()
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.stroke()
  })

  const centerRadius = 16
  ctx.beginPath()
  ctx.arc(center.x, center.y, centerRadius, 0, Math.PI * 2)
  ctx.fillStyle = objectMapTypeColors[type] ?? "#d6421f"
  ctx.fill()
  ctx.strokeStyle = "#d6421f"
  ctx.lineWidth = 4
  ctx.stroke()

  ctx.font = "700 13px var(--bodyFont, sans-serif)"
  ctx.textAlign = "center"
  ctx.textBaseline = "top"
  ctx.lineWidth = 4
  ctx.strokeStyle = "rgba(255,255,255,0.9)"
  ctx.fillStyle = "#5a255f"
  const label = title.length > 22 ? `${title.slice(0, 21)}…` : title
  ctx.strokeText(label, center.x, center.y + centerRadius + 8)
  ctx.fillText(label, center.x, center.y + centerRadius + 8)

  ctx.font = "700 10px var(--codeFont, monospace)"
  ctx.textAlign = "left"
  ctx.textBaseline = "bottom"
  ctx.fillStyle = "#d6421f"
  ctx.fillText(`${count.toLocaleString("lt-LT")} RYS.`, 12, height - 12)
}

function setObjectMapStatus(root: HTMLElement, text: string, hidden = false) {
  const status = root.querySelector<HTMLElement>("[data-object-map-status]")
  if (!status) return
  status.textContent = text
  status.hidden = hidden
}

async function renderObjectMapPreview(root: HTMLElement) {
  const slug = String(root.dataset.objectSlug ?? "")
  const fallbackTitle = String(root.dataset.objectTitle ?? "")
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
    const title = String(node.title ?? fallbackTitle)
    const type = objectMapNodeType(resolvedSlug, node)

    if (count) {
      count.textContent =
        neighbours.length === 0
          ? "Ryšių šiame žemėlapyje dar nėra."
          : `${neighbours.length.toLocaleString("lt-LT")} ryšiai`
    }
    setObjectMapStatus(root, neighbours.length === 0 ? "Nėra ryšių" : "", neighbours.length > 0)
    drawObjectMapPreview(canvas, title, type, neighbours)
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
