import type { QuartzComponent, QuartzComponentConstructor } from "./types"

export type RelatedContentLink = { title: string; href: string }

const valanciusLinks: RelatedContentLink[] = [
  {
    title: "Valančius ir Rusijos imperija · straipsnis",
    href: "/straipsniai/motiejus-valancius-ir-rusijos-imperija/",
  },
  {
    title: "Laiškai imperijos šešėlyje · paroda",
    href: "/parodos/valancius-laiskai-imperijos-seselyje/",
  },
  {
    title: "Kai kaimas atsisakė degtinės · straipsnis",
    href: "/straipsniai/kaip-valancius-keite-kasdienybe/",
  },
  {
    title: "Karčema, pažadas, permaina · paroda",
    href: "/parodos/valancius-nuo-sakyklos-iki-skaitytojo/",
  },
]

export function RelatedContent({
  links,
  currentSlug,
  label = "Susiję kūriniai",
}: {
  links: RelatedContentLink[]
  currentSlug?: string
  label?: string
}) {
  if (!links.length) return null
  return (
    <nav class="content-cycle" aria-label={label}>
      <strong>{label}</strong>
      <ul>
        {links.map((link) => (
          <li>
            <a
              href={link.href}
              aria-current={
                link.href.replace(/^\//, "").replace(/\/$/, "") === currentSlug ? "page" : undefined
              }
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default (() => {
  const ContentCycle: QuartzComponent = ({ fileData }) => {
    const personPage = fileData.slug === "objektai/asmenys/Motiejus-Valancius"
    const links = fileData.frontmatter?.relatedContent ?? (personPage ? valanciusLinks : undefined)
    if (!Array.isArray(links) || fileData.frontmatter?.exhibition_page === true) return null
    return (
      <RelatedContent
        links={links as RelatedContentLink[]}
        currentSlug={fileData.slug}
        label={String(
          fileData.frontmatter?.cycle_title ||
            (personPage ? "Motiejaus Valančiaus ciklas" : "Susiję kūriniai"),
        )}
      />
    )
  }
  return ContentCycle
}) satisfies QuartzComponentConstructor
