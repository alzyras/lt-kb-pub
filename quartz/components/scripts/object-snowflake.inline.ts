document.addEventListener("nav", () => {
  const graph = document.querySelector<HTMLElement>(".object-snowflake")
  if (!graph) return
  let touch = false
  const pointer = (event: PointerEvent) => { touch = event.pointerType === "touch" }
  const click = (event: MouseEvent) => {
    const node = (event.target as Element).closest<SVGAElement>(".snowflake-node")
    if (!touch || !node) return
    if (!node.classList.contains("is-selected")) {
      event.preventDefault()
      graph.querySelectorAll(".is-selected").forEach((previous) => previous.classList.remove("is-selected"))
      node.classList.add("is-selected")
      node.focus()
    }
  }
  graph.addEventListener("pointerdown", pointer)
  graph.addEventListener("click", click)
  window.addCleanup(() => {
    graph.removeEventListener("pointerdown", pointer)
    graph.removeEventListener("click", click)
  })
})
