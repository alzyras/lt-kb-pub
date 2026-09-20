document.addEventListener("nav", () => {
  const graph = document.querySelector<HTMLElement>(".object-snowflake")
  if (!graph) return
  let touch = false
  let frame = 0
  let active = false
  let interacting = false
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
  const desktop = window.matchMedia("(min-width: 801px)")
  const scene = graph.querySelector<SVGSVGElement>(".snowflake-scene")!
  const overlay = document.createElementNS("http://www.w3.org/2000/svg", "g")
  overlay.setAttribute("class", "snowflake-label-overlay")
  overlay.setAttribute("aria-hidden", "true")
  scene.append(overlay)
  let labelled: SVGAElement | null = null
  const showLabel = (node: SVGAElement | null) => {
    if (node === labelled) return
    labelled = node
    overlay.replaceChildren()
    overlay.removeAttribute("transform")
    const original = node?.querySelector("text")
    if (!original) return
    const label = original.cloneNode(true) as SVGTextElement
    label.setAttribute("class", "snowflake-active-label")
    overlay.append(label)
    const bounds = label.getBBox()
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    background.setAttribute("x", String(bounds.x - 8))
    background.setAttribute("y", String(bounds.y - 5))
    background.setAttribute("width", String(bounds.width + 16))
    background.setAttribute("height", String(bounds.height + 10))
    background.setAttribute("rx", "3")
    overlay.prepend(background)
    // Keep long names within the scene without changing link/tab order.
    const dx = Math.max(0, -302 - bounds.x) - Math.max(0, bounds.x + bounds.width - 302)
    const dy = Math.max(0, -302 - bounds.y) - Math.max(0, bounds.y + bounds.height - 302)
    overlay.setAttribute("transform", `translate(${dx} ${dy})`)
  }
  const nodeAt = (target: EventTarget | null) => target instanceof Element ? target.closest<SVGAElement>(".snowflake-node") : null
  const hover = (event: PointerEvent) => showLabel(nodeAt(event.target))
  const leave = (event: PointerEvent) => showLabel(nodeAt(event.relatedTarget) || nodeAt(document.activeElement))
  const renderDepth = () => {
    frame = 0
    if (motion.matches || !desktop.matches) {
      graph.removeAttribute("data-depth-motion")
      return
    }
    graph.setAttribute("data-depth-motion", "")
    const box = graph.getBoundingClientRect()
    const distance = (box.top + box.height / 2 - innerHeight / 2) / (innerHeight * .85)
    const proximity = Math.max(0, 1 - Math.abs(distance))
    const eased = proximity * proximity * (3 - 2 * proximity)
    graph.style.setProperty("--snowflake-opacity", String(interacting ? 1 : .18 + .82 * eased))
    graph.style.setProperty("--snowflake-scale", String(.94 + .06 * eased))
    graph.style.setProperty("--snowflake-shift", `${-Math.sign(distance) * 100 * (1 - eased)}px`)
  }
  const schedule = () => { if (!frame && active) frame = requestAnimationFrame(renderDepth) }
  const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; schedule() }, {rootMargin:"240px"})
  observer.observe(graph)
  const focus = (event: FocusEvent) => { interacting = true; showLabel(nodeAt(event.target)); schedule() }
  const blur = (event: FocusEvent) => {
    if (!graph.contains(event.relatedTarget as Node)) { interacting = false; schedule() }
    showLabel(nodeAt(event.relatedTarget))
  }
  const pointer = (event: PointerEvent) => { touch = event.pointerType === "touch" }
  const resize = () => {
    const selected = labelled
    labelled = null
    showLabel(selected)
    schedule()
  }
  const keydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") showLabel(null)
  }
  const click = (event: MouseEvent) => {
    const node = (event.target as Element).closest<SVGAElement>(".snowflake-node")
    if (!touch || !node) return
    if (!node.classList.contains("is-selected")) {
      event.preventDefault()
      graph.querySelectorAll(".is-selected").forEach(previous => previous.classList.remove("is-selected"))
      node.classList.add("is-selected")
      node.focus()
    }
  }
  graph.addEventListener("pointerdown", pointer)
  graph.addEventListener("pointerover", hover)
  graph.addEventListener("pointerout", leave)
  graph.addEventListener("click", click)
  graph.addEventListener("focusin", focus)
  graph.addEventListener("focusout", blur)
  graph.addEventListener("keydown", keydown)
  window.addEventListener("scroll", schedule, {passive:true})
  window.addEventListener("resize", resize, {passive:true})
  motion.addEventListener("change", renderDepth)
  desktop.addEventListener("change", renderDepth)
  renderDepth()
  window.addCleanup(() => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    graph.removeEventListener("pointerdown", pointer)
    graph.removeEventListener("pointerover", hover)
    graph.removeEventListener("pointerout", leave)
    graph.removeEventListener("click", click)
    graph.removeEventListener("focusin", focus)
    graph.removeEventListener("focusout", blur)
    graph.removeEventListener("keydown", keydown)
    window.removeEventListener("scroll", schedule)
    window.removeEventListener("resize", resize)
    motion.removeEventListener("change", renderDepth)
    desktop.removeEventListener("change", renderDepth)
    overlay.remove()
  })
})
