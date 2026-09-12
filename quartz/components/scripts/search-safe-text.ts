export type SearchTextPart = { text: string; highlighted: boolean }

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\[\]\\]/g, "\\$&")
}

/** Split search text into plain-text and highlighted pieces without producing HTML. */
export function splitSearchText(text: string, terms: string[]): SearchTextPart[] {
  const normalizedTerms = terms.map((term) => term.trim()).filter(Boolean).sort((a, b) => b.length - a.length)
  if (normalizedTerms.length === 0) return [{ text, highlighted: false }]
  const pattern = new RegExp(`(${normalizedTerms.map(escapeRegExp).join("|")})`, "gi")
  const parts: SearchTextPart[] = []
  let lastIndex = 0
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > lastIndex) parts.push({ text: text.slice(lastIndex, index), highlighted: false })
    parts.push({ text: match[0], highlighted: true })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex), highlighted: false })
  return parts.length > 0 ? parts : [{ text, highlighted: false }]
}
