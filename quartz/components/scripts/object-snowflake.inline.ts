document.addEventListener("nav", () => {
  const graph = document.querySelector<HTMLElement>(".object-snowflake")
  if (!graph) return
  let touch = false
  let frame = 0
  let active = false
  let interacting = false
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
  const desktop = window.matchMedia("(min-width: 801px)")
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
  const focus = () => { interacting = true; schedule() }
  const blur = (event: FocusEvent) => {
    if (!graph.contains(event.relatedTarget as Node)) { interacting = false; schedule() }
  }
  const pointer = (event: PointerEvent) => { touch = event.pointerType === "touch" }
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
  graph.addEventListener("click", click)
  graph.addEventListener("focusin", focus)
  graph.addEventListener("focusout", blur)
  window.addEventListener("scroll", schedule, {passive:true})
  window.addEventListener("resize", schedule, {passive:true})
  motion.addEventListener("change", renderDepth)
  desktop.addEventListener("change", renderDepth)
  renderDepth()
  window.addCleanup(() => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    graph.removeEventListener("pointerdown", pointer)
    graph.removeEventListener("click", click)
    graph.removeEventListener("focusin", focus)
    graph.removeEventListener("focusout", blur)
    window.removeEventListener("scroll", schedule)
    window.removeEventListener("resize", schedule)
    motion.removeEventListener("change", renderDepth)
    desktop.removeEventListener("change", renderDepth)
  })
})
