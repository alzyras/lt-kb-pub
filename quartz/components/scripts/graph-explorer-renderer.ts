import { Application, Container, Graphics } from "pixi.js"
import { select, zoom, zoomIdentity } from "d3"
import { graphVisualRegistry as visual } from "../../util/graphVisualRegistry"
import { graphNodeRadius, type RuntimeNode, type VisibleGraph } from "./graph-explorer-model"
import type { Bounds } from "../../util/graphExplorerData"

export type Camera = { x: number; y: number; k: number }
export type MapRenderer = {
  camera(): Camera
  applyCamera(camera: Camera): void
  fit(includeOuter?: boolean): void
  viewport(): Bounds
  append(nodes: RuntimeNode[]): void
  clearOuter(): void
  destroy(): void
}
export async function createMapRenderer(
  container: HTMLElement,
  graph: VisibleGraph,
  handlers: {
    select(node: RuntimeNode): void
    camera(camera: Camera): void
  },
): Promise<MapRenderer> {
  const width = container.clientWidth,
    height = container.clientHeight
  const dark = document.documentElement.getAttribute("saved-theme") === "dark"
  const ink = dark ? "#f1e8da" : "#241c18",
    paper = dark ? "#191b20" : "#f8f2e8"
  let app: Application | undefined,
    world: Container | undefined,
    edgeGfx: Graphics | undefined,
    coreGfx: Graphics | undefined,
    outerGfx: Container | undefined
  let canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D | null = null
  try {
    app = new Application()
    await app.init({
      width,
      height,
      antialias: true,
      autoStart: false,
      autoDensity: true,
      backgroundAlpha: 0,
      preference: "webgl",
      resolution: Math.min(2, devicePixelRatio),
    })
    canvas = app.canvas
    world = new Container()
    edgeGfx = new Graphics()
    coreGfx = new Graphics()
    outerGfx = new Container()
    world.addChild(edgeGfx, outerGfx, coreGfx)
    app.stage.addChild(world)
  } catch {
    try {
      app?.destroy(true)
    } catch {}
    app = undefined
    canvas = document.createElement("canvas")
    canvas.width = width * Math.min(2, devicePixelRatio)
    canvas.height = height * Math.min(2, devicePixelRatio)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    context = canvas.getContext("2d")
    if (!context) throw new Error("Naršyklė negali parodyti žemėlapio")
  }
  container.prepend(canvas)
  const labels = document.createElement("canvas")
  labels.className = "graph-label-canvas"
  labels.width = width * Math.min(2, devicePixelRatio)
  labels.height = height * Math.min(2, devicePixelRatio)
  container.append(labels)
  const textContext = labels.getContext("2d")!
  let camera: Camera = { x: width / 2, y: height / 2, k: 1 },
    hovered: RuntimeNode | null = null,
    destroyed = false
  const outer = new Map<string, RuntimeNode>(),
    grid = new Map<string, RuntimeNode[]>()
  const ranked = [...graph.nodes].sort(
    (a, b) => b.degree - a.degree || a.id.localeCompare(b.id, "lt"),
  )
  const tooltip = container.querySelector<HTMLElement>("[data-graph-hover]")!
  const color = (node: RuntimeNode) => {
    const base = (visual.typeColors as Record<string, number>)[node.type] ?? visual.fallbackNode
    if (!dark) return base
    const c = (s: number) => Math.round(((base >> s) & 255) * 0.76 + 255 * 0.24)
    return (c(16) << 16) | (c(8) << 8) | c(0)
  }
  const hex = (value: number) => `#${value.toString(16).padStart(6, "0")}`
  function index(node: RuntimeNode) {
    const key = `${Math.floor(node.px / 50)},${Math.floor(node.py / 50)}`
    const bucket = grid.get(key) ?? []
    bucket.push(node)
    grid.set(key, bucket)
  }
  graph.nodes.forEach(index)
  function bubble(node: RuntimeNode, graphics?: Graphics) {
    const radius = graphNodeRadius(node, node === graph.focus),
      alpha = node.isolated ? 0.55 : 0.9
    if (graphics)
      graphics
        .circle(node.px, node.py, radius)
        .fill({ color: color(node), alpha })
        .stroke({ color: dark ? 0xe9e0d4 : 0xffffff, alpha: 0.6, width: 0.7 })
    else if (context) {
      context.beginPath()
      context.arc(node.px, node.py, radius, 0, Math.PI * 2)
      context.fillStyle = hex(color(node))
      context.globalAlpha = alpha
      context.fill()
      context.strokeStyle = paper
      context.lineWidth = 0.7
      context.stroke()
      context.globalAlpha = 1
    }
  }
  function edges() {
    edgeGfx?.clear()
    for (const edge of graph.edges) {
      const active = hovered && (edge.from === hovered.id || edge.to === hovered.id)
      const alpha = active ? 0.75 : graph.focus ? 0.13 : 0.008
      if (edgeGfx)
        edgeGfx
          .moveTo(edge.source.px, edge.source.py)
          .lineTo(edge.target.px, edge.target.py)
          .stroke({
            color: active ? visual.focus : visual.edgeSemantic,
            alpha,
            width: active ? 1.4 : 0.65,
          })
      else if (context) {
        context.beginPath()
        context.moveTo(edge.source.px, edge.source.py)
        context.lineTo(edge.target.px, edge.target.py)
        context.strokeStyle = hex(active ? visual.focus : visual.edgeSemantic)
        context.globalAlpha = alpha
        context.lineWidth = active ? 1.4 : 0.65
        context.stroke()
        context.globalAlpha = 1
      }
    }
  }
  function drawLabels() {
    const dpr = Math.min(2, devicePixelRatio)
    textContext.setTransform(dpr, 0, 0, dpr, 0, 0)
    textContext.clearRect(0, 0, width, height)
    textContext.font = "12px Arial, sans-serif"
    textContext.textAlign = "center"
    textContext.lineJoin = "round"
    const boxes: Array<{ x: number; y: number; w: number }> = []
    const candidates = [
      ...(graph.focus ? [graph.focus] : []),
      ...(camera.k > 0.6 || graph.focus ? ranked : []),
    ]
    const visited = new Set<string>()
    for (const node of candidates) {
      if (boxes.length >= 65 || visited.has(node.id)) continue
      visited.add(node.id)
      const x = node.px * camera.k + camera.x,
        y =
          node.py * camera.k + camera.y - graphNodeRadius(node, node === graph.focus) * camera.k - 7
      const w = textContext.measureText(node.title).width
      if (
        x - w / 2 < 5 ||
        x + w / 2 > width - 5 ||
        y < 15 ||
        y > height - 10 ||
        boxes.some((b) => Math.abs(b.y - y) < 23 && Math.abs(b.x - x) < (b.w + w) / 2 + 10)
      )
        continue
      boxes.push({ x, y, w })
      textContext.strokeStyle = paper
      textContext.lineWidth = 4
      textContext.strokeText(node.title, x, y)
      textContext.fillStyle = ink
      textContext.fillText(node.title, x, y)
    }
  }
  function draw() {
    if (destroyed) return
    canvas.dataset.camera = `${camera.x},${camera.y},${camera.k}`
    canvas.dataset.coreCount = String(graph.nodes.length)
    canvas.dataset.outerCount = String(outer.size)
    if (app && world) {
      world.position.set(camera.x, camera.y)
      world.scale.set(camera.k)
      app.render()
    } else if (context) {
      const dpr = Math.min(2, devicePixelRatio)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)
      context.translate(camera.x, camera.y)
      context.scale(camera.k, camera.k)
      edges()
      outer.forEach((node) => bubble(node))
      graph.nodes.forEach((node) => bubble(node))
    }
    drawLabels()
  }
  if (app) {
    edges()
    graph.nodes.forEach((node) => bubble(node, coreGfx))
  }
  function hit(event: PointerEvent | MouseEvent) {
    const rect = canvas.getBoundingClientRect(),
      x = (event.clientX - rect.left - camera.x) / camera.k,
      y = (event.clientY - rect.top - camera.y) / camera.k
    let result: RuntimeNode | null = null,
      distance = Infinity
    const reach = Math.ceil(Math.max(28, 8 / camera.k) / 50)
    for (let ix = -reach; ix <= reach; ix++)
      for (let iy = -reach; iy <= reach; iy++) {
        for (const node of grid.get(`${Math.floor(x / 50) + ix},${Math.floor(y / 50) + iy}`) ??
          []) {
          const d = Math.hypot(x - node.px, y - node.py)
          if (
            d < Math.max(graphNodeRadius(node, node === graph.focus), 7 / camera.k) &&
            d < distance
          ) {
            result = node
            distance = d
          }
        }
      }
    return result
  }
  function clearHover() {
    tooltip.hidden = true
    if (hovered) {
      hovered = null
      edges()
      draw()
    }
  }
  const zoomBehavior = zoom<HTMLCanvasElement, unknown>()
    .scaleExtent([0.06, 8])
    .clickDistance(6)
    .on("zoom", (event) => {
      camera = { x: event.transform.x, y: event.transform.y, k: event.transform.k }
      clearHover()
      draw()
    })
    .on("end", () => handlers.camera(camera))
  select(canvas).call(zoomBehavior)
  canvas.addEventListener("pointermove", (event) => {
    if (event.buttons) return
    const node = hit(event)
    if (node !== hovered) {
      hovered = node
      edges()
      draw()
    }
    canvas.style.cursor = node ? "pointer" : "grab"
    tooltip.hidden = !node
    if (!node) return
    tooltip.replaceChildren()
    const type = document.createElement("span"),
      title = document.createElement("strong")
    type.textContent = (visual.typeLabels as Record<string, string>)[node.type] ?? node.type
    title.textContent = node.title
    tooltip.append(type, title)
    const rect = canvas.getBoundingClientRect()
    tooltip.style.left = `${Math.max(8, Math.min(width - tooltip.offsetWidth - 8, event.clientX - rect.left + 14))}px`
    tooltip.style.top = `${Math.max(8, Math.min(height - tooltip.offsetHeight - 8, event.clientY - rect.top - tooltip.offsetHeight - 12))}px`
  })
  canvas.addEventListener("pointerleave", clearHover)
  canvas.addEventListener("click", (event) => {
    const node = hit(event)
    if (node) {
      clearHover()
      handlers.select(node)
    }
  })
  const renderer: MapRenderer = {
    camera: () => ({ ...camera }),
    applyCamera: (value) => {
      select(canvas).call(
        zoomBehavior.transform,
        zoomIdentity.translate(value.x, value.y).scale(value.k),
      )
    },
    viewport: () => ({
      minX: -camera.x / camera.k,
      maxX: (width - camera.x) / camera.k,
      minY: -camera.y / camera.k,
      maxY: (height - camera.y) / camera.k,
    }),
    fit: (includeOuter = false) => {
      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity
      for (const node of graph.nodes) {
        minX = Math.min(minX, node.px - 30)
        maxX = Math.max(maxX, node.px + 30)
        minY = Math.min(minY, node.py - 30)
        maxY = Math.max(maxY, node.py + 30)
      }
      if (includeOuter) {
        minX = minY = -2200
        maxX = maxY = 2200
      }
      if (!Number.isFinite(minX)) {
        minX = minY = -300
        maxX = maxY = 300
      }
      const k = Math.max(
        0.06,
        Math.min(2, (width - 80) / (maxX - minX), (height - 110) / (maxY - minY)),
      )
      renderer.applyCamera({
        x: width / 2 - ((minX + maxX) / 2) * k,
        y: height / 2 - ((minY + maxY) / 2) * k,
        k,
      })
    },
    append: (nodes) => {
      const batch = app ? new Graphics() : undefined
      for (const node of nodes)
        if (!outer.has(node.id)) {
          outer.set(node.id, node)
          index(node)
          if (app) bubble(node, batch)
        }
      if (batch) outerGfx?.addChild(batch)
      draw()
    },
    clearOuter: () => {
      outer.clear()
      grid.clear()
      graph.nodes.forEach(index)
      outerGfx?.removeChildren().forEach((child) => child.destroy())
      clearHover()
      draw()
    },
    destroy: () => {
      destroyed = true
      select(canvas).on(".zoom", null)
      app?.destroy(true)
      canvas.remove()
      labels.remove()
      tooltip.hidden = true
    },
  }
  canvas.tabIndex = 0
  canvas.setAttribute(
    "aria-label",
    "Istorijos žemėlapis. Rodyklėmis judėkite, pliusu ir minusu keiskite mastelį. Objektą pasirinkite paieškoje.",
  )
  canvas.addEventListener("keydown", (event) => {
    const factor = ["+", "="].includes(event.key) ? 1.3 : event.key === "-" ? 1 / 1.3 : 1
    if (factor !== 1) {
      const k = Math.max(0.06, Math.min(8, camera.k * factor))
      renderer.applyCamera({
        x: width / 2 - ((width / 2 - camera.x) * k) / camera.k,
        y: height / 2 - ((height / 2 - camera.y) * k) / camera.k,
        k,
      })
    } else if (event.key.startsWith("Arrow"))
      renderer.applyCamera({
        ...camera,
        x: camera.x + (event.key === "ArrowLeft" ? 60 : event.key === "ArrowRight" ? -60 : 0),
        y: camera.y + (event.key === "ArrowUp" ? 60 : event.key === "ArrowDown" ? -60 : 0),
      })
    else return
    event.preventDefault()
  })
  renderer.fit()
  return renderer
}
