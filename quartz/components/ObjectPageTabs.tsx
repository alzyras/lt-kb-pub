import { FullSlug } from "../util/path"
import type { ObjectPageCounts } from "../util/objectPageView"

export type ObjectPageTab = "overview" | "evidence" | "relations" | "gallery" | "sources"

export function ObjectPageTabs({
  objectSlug,
  counts,
  active,
}: {
  objectSlug: FullSlug
  counts: ObjectPageCounts
  active: ObjectPageTab
}) {
  const absolute = (slug: FullSlug) => `/${String(slug).replace(/^\/+|\/+$/g, "")}`
  const evidence = absolute(`${objectSlug}/irodymai` as FullSlug)
  const relations = absolute(`${objectSlug}/rysiai` as FullSlug)
  const gallery = absolute(`${objectSlug}/galerija` as FullSlug)
  const overview = absolute(objectSlug)
  const tab = (key: ObjectPageTab, href: string, label: string, count?: number) => (
    <a href={href} data-object-tab={key} aria-current={active === key ? "page" : undefined}>
      {label}
      {typeof count === "number" ? ` (${count})` : ""}
    </a>
  )
  return (
    <nav class="object-detail-tabs" aria-label="Objekto skyriai" data-object-base={objectSlug}>
      {tab("overview", overview, "Apžvalga")}
      {tab("evidence", evidence, "Teiginiai", counts.claims)}
      {tab("relations", relations, "Ryšiai", counts.relations)}
      {tab("gallery", gallery, "Galerija", counts.gallery)}
      {tab("sources", `${overview}#saltiniai`, "Šaltiniai", counts.sources)}
    </nav>
  )
}
