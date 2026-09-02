import { FullSlug, resolveRelative } from "../util/path"
import type { ObjectPageCounts } from "../util/objectPageView"

export type ObjectPageTab = "overview" | "evidence" | "relations" | "gallery" | "sources"

export function ObjectPageTabs({
  currentSlug,
  objectSlug,
  counts,
  active,
}: {
  currentSlug: FullSlug
  objectSlug: FullSlug
  counts: ObjectPageCounts
  active: ObjectPageTab
}) {
  const evidence = resolveRelative(currentSlug, `${objectSlug}/irodymai` as FullSlug)
  const gallery = resolveRelative(currentSlug, `${objectSlug}/galerija` as FullSlug)
  const overview = resolveRelative(currentSlug, objectSlug)
  const tab = (key: ObjectPageTab, href: string, label: string, count?: number) => (
    <a
      href={href}
      data-object-tab={
        key === "overview" || key === "relations" || key === "sources" ? key : undefined
      }
      aria-current={active === key ? "page" : undefined}
    >
      {label}
      {typeof count === "number" ? ` (${count})` : ""}
    </a>
  )
  return (
    <nav class="object-detail-tabs" aria-label="Objekto skyriai">
      {tab("overview", overview, "Apžvalga")}
      {tab("evidence", evidence, "Teiginiai", counts.claims)}
      {tab("relations", `${overview}#rysiai`, "Ryšiai", counts.relations)}
      {tab("gallery", gallery, "Galerija", counts.gallery)}
      {tab("sources", `${overview}#saltiniai`, "Šaltiniai", counts.sources)}
    </nav>
  )
}
