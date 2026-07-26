const cleanupFns: Set<(...args: any[]) => void> = new Set()

window.addCleanup = (fn) => cleanupFns.add(fn)

document.addEventListener("prenav", () => {
  cleanupFns.forEach((fn) => fn())
  cleanupFns.clear()
})
