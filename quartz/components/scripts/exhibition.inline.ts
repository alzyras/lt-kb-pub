type Cleanup = () => void

const cleanups = new Set<Cleanup>()

function initExhibitionNavigation() {
  for (const cleanup of cleanups) cleanup()
  cleanups.clear()

  const page = document.querySelector<HTMLElement>(".exhibition-page")
  const nav = page?.querySelector<HTMLElement>(".exhibition-chapters")
  if (!page || !nav) return

  const links = [...nav.querySelectorAll<HTMLAnchorElement>("[data-exhibition-chapter]")]
  const sections = links
    .map((link) => {
      const id = link.dataset.exhibitionChapter || ""
      const section = document.getElementById(id)
      return section ? { id, link, section } : undefined
    })
    .filter((value): value is { id: string; link: HTMLAnchorElement; section: HTMLElement } =>
      Boolean(value),
    )
  if (!sections.length) return

  let frame = 0
  let activeId = ""
  let hashTimers: number[] = []
  const setActive = (id: string) => {
    if (!id || id === activeId) return
    activeId = id
    for (const entry of sections) {
      const active = entry.id === id
      entry.link.toggleAttribute("data-active", active)
      if (active) entry.link.setAttribute("aria-current", "location")
      else entry.link.removeAttribute("aria-current")
    }
  }
  const update = () => {
    frame = 0
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) {
      setActive(sections[sections.length - 1].id)
      return
    }
    const probe = nav.getBoundingClientRect().bottom + Math.min(120, innerHeight * 0.18)
    let current = sections[0]
    for (const entry of sections) {
      if (entry.section.getBoundingClientRect().top <= probe) current = entry
      else break
    }
    setActive(current.id)
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }
  const observer = new IntersectionObserver(schedule, {
    rootMargin: "-10% 0px -70% 0px",
    threshold: [0, 0.01, 0.5],
  })
  const clearHashTimers = () => {
    for (const timer of hashTimers) clearTimeout(timer)
    hashTimers = []
  }
  const activateHash = () => {
    const id = decodeURIComponent(location.hash.slice(1))
    const entry = sections.find((candidate) => candidate.id === id)
    if (!entry) return false
    clearHashTimers()
    setActive(entry.id)
    for (const delay of [0, 200, 700, 1600]) {
      hashTimers.push(
        window.setTimeout(() => {
          entry.section.scrollIntoView({ block: "start" })
          setActive(entry.id)
          requestAnimationFrame(update)
        }, delay),
      )
    }
    return true
  }
  const handleNavClick = (event: MouseEvent) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
      "[data-exhibition-chapter]",
    )
    if (link?.dataset.exhibitionChapter) setActive(link.dataset.exhibitionChapter)
  }
  for (const entry of sections) observer.observe(entry.section)
  addEventListener("scroll", schedule, { passive: true })
  addEventListener("resize", schedule, { passive: true })
  addEventListener("hashchange", activateHash)
  addEventListener("wheel", clearHashTimers, { passive: true })
  addEventListener("touchstart", clearHashTimers, { passive: true })
  addEventListener("pointerdown", clearHashTimers, { passive: true })
  addEventListener("keydown", clearHashTimers)
  nav.addEventListener("click", handleNavClick)
  if (!activateHash()) update()

  cleanups.add(() => {
    observer.disconnect()
    removeEventListener("scroll", schedule)
    removeEventListener("resize", schedule)
    removeEventListener("hashchange", activateHash)
    removeEventListener("wheel", clearHashTimers)
    removeEventListener("touchstart", clearHashTimers)
    removeEventListener("pointerdown", clearHashTimers)
    removeEventListener("keydown", clearHashTimers)
    nav.removeEventListener("click", handleNavClick)
    clearHashTimers()
    if (frame) cancelAnimationFrame(frame)
  })
}

document.addEventListener("nav", initExhibitionNavigation)
initExhibitionNavigation()
