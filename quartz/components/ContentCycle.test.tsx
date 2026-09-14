import assert from "node:assert/strict"
import test from "node:test"
import { render } from "preact-render-to-string"
import ContentCycle, { RelatedContent } from "./ContentCycle"
import type { QuartzComponentProps } from "./types"

test("related content keeps all cycle links and marks only the current page", () => {
  const html = render(
    <RelatedContent
      currentSlug="parodos/pirma"
      label="Ciklas"
      links={[
        { title: "Straipsnis", href: "/straipsniai/pirmas/" },
        { title: "Paroda", href: "/parodos/pirma/" },
      ]}
    />,
  )
  assert.match(html, /aria-label="Ciklas"/)
  assert.match(html, /href="\/straipsniai\/pirmas\/"/)
  assert.match(html, /href="\/parodos\/pirma\/" aria-current="page"/)
  assert.equal((html.match(/aria-current/g) || []).length, 1)
  assert.equal(render(<RelatedContent links={[]} />), "")
})

test("only the Valančius person gets the default editorial cycle", () => {
  const Component = ContentCycle()
  const props = (slug: string) => ({ fileData: { slug, frontmatter: {} } }) as QuartzComponentProps
  const html = render(<Component {...props("objektai/asmenys/Motiejus-Valancius")} />)
  assert.equal((html.match(/<li>/g) || []).length, 4)
  assert.match(html, /Motiejaus Valančiaus ciklas/)
  assert.equal(render(<Component {...props("objektai/asmenys/Kitas-asmuo")} />), "")
})
