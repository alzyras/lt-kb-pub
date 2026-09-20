;(function museumInteractions() {
  document.addEventListener("nav", () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const click = (event: MouseEvent) => {
      const button = (event.target as Element).closest<HTMLButtonElement>("[data-ruler-scroll]")
      const track = button?.closest("[data-ruler-era]")?.querySelector<HTMLElement>(".ruler-track")
      if (button && track) track.scrollBy({ left: Number(button.dataset.rulerScroll) * track.clientWidth * .8, behavior: reduced.matches ? "instant" : "smooth" })
    }
    const change = (event: Event) => {
      const select = event.target as HTMLSelectElement
      if (!select.matches("[data-ruler-jump]") || !select.value) return
      const target = document.getElementById(select.value)
      if (target) {
        history.replaceState(null, "", `#${select.value}`)
        target.scrollIntoView({ behavior: reduced.matches ? "instant" : "smooth", block: "start" })
        target.tabIndex = -1
        target.focus({ preventScroll: true })
      }
    }
    document.addEventListener("click", click)
    document.addEventListener("change", change)
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.remove("museum-awaiting")
        observer.unobserve(entry.target)
      }
    }, { rootMargin: "0px 0px -25px 0px", threshold: .02 })
    if (!reduced.matches) for (const section of document.querySelectorAll<HTMLElement>(".museum-section")) {
      if (section.getBoundingClientRect().top > window.innerHeight) {
        section.classList.add("museum-awaiting")
        observer.observe(section)
      }
    }
    window.addCleanup(() => {
      observer.disconnect()
      document.removeEventListener("click", click)
      document.removeEventListener("change", change)
    })
  })
})()
