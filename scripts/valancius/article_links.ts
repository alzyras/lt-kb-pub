/** Link editorial identifiers in text, never inside an HTML attribute. */
export function linkEvidenceText(content: string, links: Map<string, string>): string {
  const plain = content.replace(
    /<a href="[^"]*#claim-t-\d+">([\s\S]*?)<\/a>/g,
    "$1",
  )
  return plain.split(/(<[^>]*>)/g).map((part, index) => {
    if (index % 2) return part
    return part.replace(/\b[tc]-\d+\b/g, id => {
      const href = links.get(id)
      if (!href) throw new Error(`Unpublished or unresolvable ${id}`)
      return `<a href="${href}">${id}</a>`
    })
  }).join("")
}
