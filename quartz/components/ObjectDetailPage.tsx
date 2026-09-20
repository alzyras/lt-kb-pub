// @ts-ignore bundled as a browser script
import snowflakeScript from "./scripts/object-snowflake.inline"
import { ObjectSnowflake } from "./ObjectSnowflake"
import { uniqueCitations } from "../util/objectDetail"
import { objectPageModules, moduleVisible } from "../util/objectPageModules"
import { ExternalLink, Images } from "lucide-preact"
import { FullSlug, resolveRelative, simplifySlug } from "../util/path"
import {
  citationQuoteForClaim,
  isMeaningfulObjectText,
  objectDetailEvidenceFromFile,
  objectClaimHref,
  type ObjectEvidenceClaim,
} from "../util/objectDetail"
import {
  cleanText,
  directnessLabel,
  displayCaption,
  objectGallerySlug,
  objectMediaSet,
  mediaImageUrl,
  mediaPosition,
  relationLabel,
  type MediaEntry,
} from "../util/objectMedia"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { ObjectPageShell, objectPortrait } from "./ObjectPageShell"
import { objectPageViewModel } from "../util/objectPageView"
import { objectBibliography } from "../util/objectBibliography"
import {
  objectRelationCount,
  objectRelationGroups,
  objectRelationInputs,
} from "../util/objectRelations"
import style from "./styles/objectDetail.scss"
// @ts-ignore Quartz bundles the inline lifecycle scripts as strings.
import mapScript from "./scripts/object-map-preview.inline"
// @ts-ignore
import tabsScript from "./scripts/object-detail-tabs.inline"

const TYPE_LABELS: Record<string, string> = {
  asmuo: "Asmuo",
  autorius: "Autorius",
  vieta: "Vieta",
  ivykis: "Istorinis įvykis",
  grupe: "Grupė",
  daiktas: "Istorinis objektas",
  paprotys: "Paprotys",
  posakis: "Posakis",
  saltinis: "Šaltinis",
  zodyno_irasas: "Sąvoka",
}

type ExternalReading = { title: string; url: string; publisher?: string; kind?: string }
type ObjectPageModule = Record<string, any>
type ObjectPageIndexes = {
  bySlug: Map<string, QuartzComponentProps["fileData"]>
  sourceByTitle: Map<string, FullSlug>
}

const objectPageIndexCache = new WeakMap<QuartzComponentProps["allFiles"], ObjectPageIndexes>()

function normalized(value: unknown): string {
  return cleanText(value)
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("lt")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function typeLabel(type: string): string {
  return TYPE_LABELS[type] ?? "Istorijos objektas"
}

function asStrings(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(cleanText).filter(isMeaningfulObjectText)
  return typeof value === "string"
    ? value.split(",").map(cleanText).filter(isMeaningfulObjectText)
    : []
}

function externalReading(value: unknown): ExternalReading[] {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((entry): entry is Record<string, unknown> =>
        Boolean(entry && typeof entry === "object"),
      )
      .map((entry) => ({
        title: cleanText(entry.title || entry.label || entry.url),
        url: cleanText(entry.url || entry.canonicalUrl),
        publisher: cleanText(entry.publisher),
        kind: cleanText(entry.kind),
      }))
      .filter((entry) => /^https:\/\//iu.test(entry.url) && isMeaningfulObjectText(entry.title))
      .sort((a, b) => sourcePriority(a) - sourcePriority(b) || a.title.localeCompare(b.title, "lt"))
  } catch {
    return []
  }
}

function moduleRows(value: unknown): ObjectPageModule[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is ObjectPageModule =>
        Boolean(entry && typeof entry === "object" && !Array.isArray(entry)),
      )
    : []
}

function claimKey(value: unknown): string {
  return cleanText(value)
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("lt")
    .replace(/\s+/g, " ")
}

function featuredClaimsForPage(
  ids: string[],
  projectedClaims: ObjectPageModule[],
  claims: ObjectEvidenceClaim[],
): ObjectEvidenceClaim[] {
  // A finisher projection can outlive a Markdown re-emission. Stable IDs are
  // preferred, but exact text matching keeps a valid featured fact visible
  // when only the local claim number changed. The rendered card still uses
  // the current evidence claim and therefore keeps a current permalink.
  const requested: ObjectPageModule[] = projectedClaims.length
    ? projectedClaims
    : ids.map((claimId) => ({ claim_id: claimId }))
  const selected: ObjectEvidenceClaim[] = []
  const used = new Set<string>()
  for (const row of requested) {
    const claimId = cleanText(row.claim_id || row.id)
    const rowText = claimKey(row.text)
    const byId = claimId
      ? claims.find(
          (claim) => claim.id === claimId || Boolean(claim.globalIds?.some((id) => id === claimId)),
        )
      : undefined
    const byText = rowText
      ? claims.find((claim) => claimKey(claim.text) === rowText && !used.has(claim.id))
      : undefined
    const claim = byId && !used.has(byId.id) ? byId : byText
    if (claim && !used.has(claim.id)) {
      selected.push(claim)
      used.add(claim.id)
    }
  }
  // A projection may contain a now-invalid or renamed featured id. Fill the
  // remaining slots from the current supported stream so one stale row never
  // makes the overview look artificially short.
  for (const claim of claims) {
    if (selected.length >= 7) break
    if (used.has(claim.id)) continue
    selected.push(claim)
    used.add(claim.id)
  }
  return selected.slice(0, 7)
}

function safeExternalUrl(value: unknown): string {
  const url = cleanText(value)
  return /^https:\/\//iu.test(url) ? url : ""
}

function publicRouteHref(value: FullSlug | string): string {
  return `/${String(value).replace(/^\/+|\/+$/g, "")}`
}

function wikiSourceLabel(source: ObjectPageModule): string {
  const language = cleanText(source.language).toLocaleLowerCase("lt")
  if (language && language !== "lt") return `Vikipedija (${language})`
  return "Vikipedija"
}

function wikiModuleHasContent(module: ObjectPageModule | undefined): boolean {
  if (!module) return false
  const source =
    module.source && typeof module.source === "object" && !Array.isArray(module.source)
      ? (module.source as ObjectPageModule)
      : {}
  return Boolean(
    cleanText(module.intro) ||
    moduleRows(module.infobox).some((row) => cleanText(row.value)) ||
    safeExternalUrl(source.url),
  )
}

function WikipediaIntro({
  module,
  sourceButtons,
  portrait,
  galleryHref,
  additionalLinks = [],
  summary = "",
}: {
  module: ObjectPageModule
  sourceButtons?: unknown
  portrait?: MediaEntry
  galleryHref?: string
  additionalLinks?: ExternalReading[]
  summary?: string
}) {
  const source =
    module.source && typeof module.source === "object" && !Array.isArray(module.source)
      ? (module.source as ObjectPageModule)
      : {}
  const intro = cleanText(module.intro)
  const infobox = moduleRows(module.infobox).filter((row) => cleanText(row.value) || moduleRows(row.cells).some(cell => cleanText(cell.text)))
  const wikiUrl = safeExternalUrl(source.url)
  if (!intro && infobox.length === 0 && !wikiUrl && !summary) return null
  const languageLabel = wikiSourceLabel(source)
  const translation = cleanText(module.translation_status) === "translated_verified"
  const links = [
    ...moduleRows(module.source_buttons ?? sourceButtons).map((entry) => ({
      label: cleanText(entry.label || entry.title || entry.publisher || "Šaltinis"),
      url: safeExternalUrl(entry.url),
    })),
    ...additionalLinks.map((entry) => ({
      label: cleanText(entry.publisher || entry.title || "Šaltinis"),
      url: safeExternalUrl(entry.url),
    })),
    ...(wikiUrl ? [{ label: languageLabel, url: wikiUrl }] : []),
  ].filter((entry) => entry.url)
  const uniqueLinks = links.filter(
    (entry, index) => links.findIndex((candidate) => candidate.url === entry.url) === index,
  )
  const portraitUrl = heroImage(portrait)
  const hasAside = Boolean(infobox.length > 0 || (portraitUrl && galleryHref))
  const hasLinks = uniqueLinks.length > 0
  const attribution = (
    <p class="object-detail-wiki-attribution">
      {languageLabel}
      {" · Vikipedijos bendradarbiai"}
      {cleanText(source.license) && ` · ${cleanText(source.license)}`}
      {safeExternalUrl(source.revision_url) && <> · <a href={safeExternalUrl(source.revision_url)} target="_blank" rel="noreferrer noopener">Naudota straipsnio versija</a></>}
      {safeExternalUrl(source.history_url) && (
        <>
          {" · "}
          <a href={safeExternalUrl(source.history_url)} target="_blank" rel="noreferrer noopener">
            Straipsnio istorija
          </a>
        </>
      )}
      {safeExternalUrl(source.license_url) && (
        <>
          {" · "}
          <a href={safeExternalUrl(source.license_url)} target="_blank" rel="noreferrer noopener">
            Licencija
          </a>
        </>
      )}
    </p>
  )
  return (
    <section
      class="object-detail-wiki"
      id="vikipedija"
      aria-label="Apie objektą"
      data-object-panel="apzvalga"
    >
      <div class="object-detail-wiki-main">
        <div class="object-detail-wiki-copy">
          <p class="museum-eyebrow">Vikipedijos įžanga</p>
          {intro && <p class="object-detail-wiki-intro">{intro}</p>}
          <p class="object-detail-paragraph-source">
            Šaltinis: <a href={wikiUrl}>{languageLabel}</a>
            {translation && " · versta"}
          </p>
        </div>
        {summary && (
          <div class="object-detail-wiki-summary" id="musu-santrauka">
            <p class="museum-eyebrow">Pagal publikuotus šaltinius</p>
            <p class="object-detail-wiki-summary-text">{summary}</p>
            <p class="object-detail-paragraph-source">
              Šaltinis: <a href="https://lietuvosistorija.eu">lietuvosistorija.eu</a>
            </p>
          </div>
        )}
      </div>
      {hasAside && (
        <aside class="object-detail-wiki-aside" aria-label="Vikipedijos duomenys ir portretas">
          {portraitUrl && galleryHref && (
            <a class="object-detail-wiki-portrait" href={galleryHref}>
              <img
                src={portraitUrl}
                alt={displayCaption(portrait!)}
                width={portrait?.width || undefined}
                height={portrait?.height || undefined}
                style={`object-position:${mediaPosition(portrait!)}`}
                decoding="async"
              />
              <span>{portrait?.dateDisplay ? `${portrait.dateDisplay} · ` : ""}Žiūrėti galerijoje</span>
            </a>
          )}
          {infobox.length > 0 && (
            <div class="object-detail-wiki-infobox">
              <p class="object-detail-wiki-infobox-label">
                Pagrindinė lentelė · {languageLabel}
              </p>
              <div class="object-detail-wiki-table-wrap">
                <table class="object-detail-wiki-table">
                  <tbody>
                    {infobox.map((row) => (
                      <tr>
                        {moduleRows(row.cells).length ? moduleRows(row.cells).map((cell) => {
                          const Tag = cell.header ? "th" : "td"
                          const span = (value: unknown) => Math.max(1, Math.min(100, Number(value) || 1))
                          return <Tag colSpan={span(cell.colspan)} rowSpan={span(cell.rowspan)}
                            scope={cell.header ? (span(cell.colspan) > 1 ? "colgroup" : "row") : undefined}>
                            {String(cell.text || "")}
                          </Tag>
                        }) : <><th scope="row">{cleanText(row.label)}</th><td>{cleanText(row.value)}</td></>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </aside>
      )}
      {(hasLinks || source.license || source.history_url || source.license_url) && (
        <footer class="object-detail-wiki-footer">
          {hasLinks && (
            <div>
              <p class="object-detail-wiki-footer-heading">Nuorodos</p>
              <nav
                class="object-detail-wiki-links"
                aria-label="Vikipedijos ir kiti išoriniai šaltiniai"
              >
                {uniqueLinks.map((link) => (
                  <a href={link.url} target="_blank" rel="noreferrer noopener">
                    {link.label} <ExternalLink size={13} />
                  </a>
                ))}
              </nav>
            </div>
          )}
          {attribution}
        </footer>
      )}
    </section>
  )
}

type TraitGroup = { key: string; label: string; rows: ObjectPageModule[] }

function sourceDisplayName(value: unknown): string {
  const text = cleanText(value)
  if (!text || /^https?:\/\//iu.test(text)) return text
  const base = text.replaceAll("\\", "/").split("/").at(-1) || text
  return base.replace(/\.md$/iu, "").trim()
}

function groupedTraitRows(rows: ObjectPageModule[]): TraitGroup[] {
  const groups = new Map<string, TraitGroup>()
  rows.forEach((row, index) => {
    const label = cleanText(row.label || row.canonical_code) || `Savybė ${index + 1}`
    const key = normalized(row.canonical_code || label) || `trait-${index}`
    const group = groups.get(key)
    if (group) group.rows.push(row)
    else groups.set(key, { key, label, rows: [row] })
  })
  return [...groups.values()]
}

function traitSources(
  rows: ObjectPageModule[],
  sourceHrefs: Map<string, string | undefined>,
): Array<{ title: string; href?: string }> {
  const entries = new Map<string, { title: string; href?: string }>()
  for (const row of rows) {
    for (const ref of moduleRows(row.source_refs)) {
      const title = sourceDisplayName(ref.title || ref.source)
      if (!title) continue
      const key = normalized(title)
      if (entries.has(key)) continue
      entries.set(key, {
        title,
        href: sourceHrefs.get(key) || sourceHrefs.get(normalized(ref.title || ref.source)),
      })
    }
  }
  return [...entries.values()]
}

function TraitsSection({
  module,
  sourceHrefs,
}: {
  module: ObjectPageModule
  sourceHrefs: Map<string, string | undefined>
}) {
  if (!moduleVisible(module)) return null
  const rows = moduleRows(module.rows).filter((row) => cleanText(row.value))
  if (rows.length === 0) return null
  const groups = groupedTraitRows(rows)
  return (
    <section class="object-detail-traits" id="savybes" aria-labelledby="object-traits-title">
      <div class="object-section-heading">
        <p>Šaltiniais pagrįsti bruožai</p>
        <h2 id="object-traits-title">Savybės</h2>
      </div>
      <div class="object-detail-traits-table-wrap">
        <table class="object-detail-traits-table">
          <thead>
            <tr>
              <th scope="col">Savybė</th>
              <th scope="col">Aprašymas</th>
              <th scope="col">Laikas / kontekstas</th>
              <th scope="col">Šaltiniai</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const contexts = [
                ...new Set(group.rows.map((row) => cleanText(row.context)).filter(Boolean)),
              ]
              const sources = traitSources(group.rows, sourceHrefs)
              const conflict = group.rows.some(
                (row) => cleanText(row.conflict_status) === "source_disagreement",
              )
              return (
                <tr>
                  <th scope="row">
                    {group.label}
                    {conflict && <small>Šaltinių nesutarimas</small>}
                  </th>
                  <td>
                    <ul class="object-detail-trait-values">
                      {group.rows.map((row) => (
                        <li>{cleanText(row.value)}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {contexts.length > 0 ? (
                      <ul class="object-detail-trait-values">
                        {contexts.map((context) => (
                          <li>{context}</li>
                        ))}
                      </ul>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    {sources.length > 0 ? (
                      <ul class="object-detail-trait-values">
                        {sources.map((source) => (
                          <li>
                            {source.href ? <a href={source.href}>{source.title}</a> : source.title}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function sourcePriority(source: ExternalReading): number {
  const text = `${source.publisher} ${source.kind} ${source.title}`.toLocaleLowerCase("lt")
  if (/visuotinė lietuvių enciklopedija|\bvle\b/.test(text)) return 1
  if (/archyv|bibliotek|muziej|universitet|instituc/.test(text)) return 2
  if (/vikiped|wikipedia/.test(text)) return 4
  if (/wikidata/.test(text)) return 5
  return 3
}

function objectPageIndexes(files: QuartzComponentProps["allFiles"]): ObjectPageIndexes {
  const cached = objectPageIndexCache.get(files)
  if (cached) return cached
  const bySlug = new Map<string, QuartzComponentProps["fileData"]>()
  const sourceByTitle = new Map<string, FullSlug>()
  for (const file of files) {
    bySlug.set(simplifySlug(file.slug!), file)
    if (!file.slug?.startsWith("objektai/saltiniai/")) continue
    for (const title of [file.frontmatter?.title, file.frontmatter?.pavadinimas]) {
      const key = normalized(title)
      if (key) sourceByTitle.set(key, file.slug)
    }
  }
  const index = { bySlug, sourceByTitle }
  objectPageIndexCache.set(files, index)
  return index
}

function sourceLinks(titles: string[], index: ObjectPageIndexes) {
  return [...new Set(titles.filter(isMeaningfulObjectText))].map((title) => {
    const displayTitle = sourceDisplayName(title)
    const source =
      index.sourceByTitle.get(normalized(title)) ||
      index.sourceByTitle.get(normalized(displayTitle))
    return { title: displayTitle, href: source ? publicRouteHref(source) : undefined }
  })
}

function heroImage(media: MediaEntry | undefined): string {
  return media ? mediaImageUrl(media) : ""
}

function galleryPreview(
  media: MediaEntry[],
  primary?: MediaEntry,
  editorialIds: string[] = [],
): MediaEntry[] {
  const seen = new Set<string>()
  const unique = media.filter((entry) => {
    const key = cleanText(
      entry.mediaId || entry.canonicalUrl || heroImage(entry) || displayCaption(entry),
    )
    if (!key || seen.has(key) || !heroImage(entry)) return false
    seen.add(key)
    return true
  })
  const primaryId = cleanText(primary?.mediaId || primary?.canonicalUrl || heroImage(primary))
  const editorial = editorialIds
    .map((id) => unique.find((entry) => cleanText(entry.mediaId) === id))
    .filter((entry): entry is MediaEntry => Boolean(entry))
    .filter(
      (entry) =>
        unique.length <= 1 ||
        cleanText(entry.mediaId || entry.canonicalUrl || heroImage(entry)) !== primaryId,
    )
  if (editorial.length) return editorial.slice(0, 5)
  return unique
    .filter(
      (entry) =>
        unique.length <= 1 ||
        cleanText(entry.mediaId || entry.canonicalUrl || heroImage(entry)) !== primaryId,
    )
    .sort((a, b) => {
      const score = (entry: MediaEntry) => {
        const id = cleanText(entry.mediaId || entry.canonicalUrl || heroImage(entry))
        const ratio =
          Number(entry.width) > 0 && Number(entry.height) > 0
            ? Number(entry.width) / Number(entry.height)
            : 1
        const balancedFrame = ratio >= 0.65 && ratio <= 1.8 ? 1 : 0
        return (
          (id === primaryId ? 100 : 0) +
          (entry.directness === "direct" ? 30 : 0) +
          (entry.reviewStatus === "accepted" ? 20 : 0) +
          Number(entry.isPrimary || 0) * 10 +
          balancedFrame * 4 +
          Number(entry.confidence || 0)
        )
      }
      return score(b) - score(a) || displayCaption(a).localeCompare(displayCaption(b), "lt")
    })
    .slice(0, 5)
}

function ClaimCard({
  claim,
  sources,
  href,
  context = "",
}: {
  claim: ObjectEvidenceClaim
  sources: Map<string, string | undefined>
  href: string
  context?: string
}) {
  if (claim.citations.length === 0) return null
  return (
    <article class="object-claim-card" id={`claim-${claim.id}`}>
      <div class="object-claim-card-header">
        <a class="object-claim-id" href={href}>
          {claim.id}
        </a>
        {claim.reliability && <span class="object-claim-reliability">{claim.reliability}</span>}
      </div>
      <p>{claim.text}</p>
      <details>
        <summary>Įrodymai ({uniqueCitations(claim.citations).length})</summary>
        {uniqueCitations(claim.citations).map((citation) => {
          const source = cleanText(
            citation.fields.get("šaltinis") || citation.fields.get("saltinis"),
          )
          const sourceLabel = sourceDisplayName(source)
          const quote = citationQuoteForClaim(
            citation,
            claim.text,
            context,
            Number.MAX_SAFE_INTEGER,
          )
          const href = sources.get(normalized(source)) || sources.get(normalized(sourceLabel))
          return (
            <article class="object-claim-citation" data-citation-id={citation.id}>
              {sourceLabel && (
                <p class="object-claim-source">
                  Šaltinis: {href ? <a href={href}>{sourceLabel}</a> : sourceLabel}
                </p>
              )}
              {quote && <blockquote>{quote}</blockquote>}
            </article>
          )
        })}
      </details>
    </article>
  )
}

const ObjectDetailPage: QuartzComponent = (props) => {
  const { fileData, allFiles } = props
  const slug = fileData.slug as FullSlug
  const frontmatter = (fileData.frontmatter ?? {}) as Record<string, unknown>
  const evidence = objectDetailEvidenceFromFile(String(fileData.filePath ?? ""))
  const index = objectPageIndexes(allFiles)
  const media = objectMediaSet(frontmatter as any)
  const view = objectPageViewModel(frontmatter, evidence, { gallery: media.all.length })
  const pageModules = objectPageModules(frontmatter)
  const wikiModule =
    pageModules.wiki && typeof pageModules.wiki === "object" && !Array.isArray(pageModules.wiki)
      ? (pageModules.wiki as ObjectPageModule)
      : undefined
  const traitsModule =
    pageModules.traits &&
    typeof pageModules.traits === "object" &&
    !Array.isArray(pageModules.traits)
      ? (pageModules.traits as ObjectPageModule)
      : undefined
  const projectedFeaturedClaims = moduleRows(pageModules.featured_claims)
  const hero = objectPortrait(frontmatter, view.portraitMediaId)
  const galleryItems = galleryPreview(media.all, hero, view.featuredGalleryIds)
  const sources = sourceLinks(
    [...new Set([...evidence.sourceTitles, ...asStrings(frontmatter.saltiniai)])],
    index,
  )
  const sourceClaimCounts = new Map<string, number>()
  const sourceCitationCounts = new Map<string, number>()
  for (const record of evidence.citationRecords) {
    const key = normalized(
      record.entry.fields.get("šaltinis") || record.entry.fields.get("saltinis"),
    )
    sourceCitationCounts.set(key, (sourceCitationCounts.get(key) || 0) + 1)
  }
  for (const claim of evidence.claims) {
    for (const sourceTitle of new Set(claim.sourceTitles)) {
      const key = normalized(sourceTitle)
      sourceClaimCounts.set(key, (sourceClaimCounts.get(key) ?? 0) + 1)
    }
  }
  const sourceHrefs = new Map(sources.map((source) => [normalized(source.title), source.href]))
  for (const source of sources) {
    sourceHrefs.set(normalized(sourceDisplayName(source.title)), source.href)
  }
  const bibliography = objectBibliography(allFiles, evidence)
  const relations = objectRelationGroups(
    objectRelationInputs(frontmatter, evidence),
    index.bySlug,
    {
      dedupe: false,
    },
  )
  const fallbackRelationCount = objectRelationCount(relations)
  const externalLinks = externalReading(frontmatter.external_sources_json)
  const galleryHref = publicRouteHref(objectGallerySlug(slug))
  const evidenceHref = publicRouteHref(`${slug}/irodymai` as FullSlug)
  const relationCount = Math.max(view.counts.relations, fallbackRelationCount)
  const internalSummaryModule =
    pageModules.internal_summary &&
    typeof pageModules.internal_summary === "object" &&
    !Array.isArray(pageModules.internal_summary)
      ? (pageModules.internal_summary as ObjectPageModule)
      : undefined
  const rawSummary = cleanText(internalSummaryModule?.text) || evidence.summary
  const summary = frontmatter.museum_external_only || normalized(rawSummary) === normalized(cleanText(wikiModule?.intro)) ? "" : rawSummary
  const supportedClaims = evidence.claims.filter((claim) => claim.citations.length > 0)
  const evidenceContext = cleanText(
    frontmatter.pavadinimas || frontmatter.canonical_name || frontmatter.title,
  )
  const wikiPublished = Boolean(
    wikiModule && moduleVisible(wikiModule) && wikiModuleHasContent(wikiModule),
  )
  const summaryPortrait = wikiPublished ? "" : heroImage(hero)
  const fallbackMessage = evidence.claims.length
    ? "Šiam įrašui rengiama šaltiniais pagrįsta santrauka."
    : "Šis įrašas dar laukia šaltiniais pagrįstos santraukos."

  return (
    <main class="object-detail-page" data-object-detail="true" data-object-tabs="true">
      <ObjectPageShell props={props} active="overview" />
      {wikiModule && wikiPublished && (
        <WikipediaIntro
          module={wikiModule}
          sourceButtons={pageModules.source_buttons}
          portrait={hero}
          galleryHref={galleryHref}
          additionalLinks={externalLinks}
          summary={summary}
        />
      )}
      {wikiPublished && <ObjectSnowflake props={props} />}
      <section class="object-detail-overview" id="apzvalga" data-object-panel="apzvalga">
        {!wikiPublished && (
          <div class="object-detail-summary-with-portrait">
            <div>
              {summary ? (
                <>
                  <p class="object-detail-summary">{summary}</p>
                  <p class="object-detail-paragraph-source">
                    Šaltinis: <a href="https://lietuvosistorija.eu">lietuvosistorija.eu</a>
                  </p>
                </>
              ) : (
                <p class="object-detail-summary object-detail-summary-pending">{fallbackMessage}</p>
              )}
            </div>
            {summaryPortrait && (
              <a class="object-detail-summary-portrait" href={galleryHref}>
                <img
                  src={summaryPortrait}
                  alt={displayCaption(hero!)}
                  width={hero?.width || undefined}
                  height={hero?.height || undefined}
                  style={`object-position:${mediaPosition(hero!)}`}
                  decoding="async"
                />
                <span>Žiūrėti galerijoje</span>
              </a>
            )}
          </div>
        )}
        {!wikiPublished && <ObjectSnowflake props={props} />}
        {view.featuredQuote && (
          <figure class="object-detail-featured-quote">
            <blockquote>{view.featuredQuote.text}</blockquote>
            <figcaption>
              <a href={objectClaimHref(slug, evidence, view.featuredQuote.claimId)}>
                {view.featuredQuote.source} · {view.featuredQuote.evidenceId}
              </a>
            </figcaption>
          </figure>
        )}
        {!wikiPublished && externalLinks.length > 0 && (
          <nav class="object-detail-reading" aria-label="Patikrintos skaitymo nuorodos">
            {externalLinks.map((source) => (
              <a href={source.url} target="_blank" rel="noreferrer noopener">
                {source.publisher || source.title} <ExternalLink size={13} />
              </a>
            ))}
          </nav>
        )}
        {(view.relatedContent.articles.length > 0 ||
          view.relatedContent.exhibitions.length > 0) && (
          <nav class="object-detail-related-reading" aria-label="Susijęs turinys">
            {view.relatedContent.articles.map((article) => (
              <a href={resolveRelative(slug, article.slug as FullSlug)}>
                Straipsnis · {article.title}
              </a>
            ))}
            {view.relatedContent.exhibitions.map((exhibition) => (
              <a href={resolveRelative(slug, ("parodos/" + exhibition.slug) as FullSlug)}>
                Paroda · {exhibition.title}
                {exhibition.matchedItems ? " (" + exhibition.matchedItems + ")" : ""}
              </a>
            ))}
          </nav>
        )}
        {traitsModule && <TraitsSection module={traitsModule} sourceHrefs={sourceHrefs} />}
        {supportedClaims.length > 0 && (
          <div class="object-detail-overview-evidence">
            <div class="object-section-heading">
              <p>Patikrinti teiginiai</p>
              <h2>Atrinkti teiginiai</h2>
            </div>
            <div class="object-detail-claims">
              {(projectedFeaturedClaims.length || view.featuredClaimIds.length
                ? featuredClaimsForPage(
                    view.featuredClaimIds,
                    projectedFeaturedClaims,
                    supportedClaims,
                  )
                : supportedClaims.slice(0, 7)
              ).map((claim) => (
                <ClaimCard
                  claim={claim}
                  sources={sourceHrefs}
                  href={objectClaimHref(slug, evidence, claim.id)}
                  context={evidenceContext}
                />
              ))}
            </div>
            <a class="object-detail-all-evidence" href={evidenceHref}>
              Visi teiginiai ir įrodymai ({view.counts.claims} teiginiai,{" "}
              {view.counts.citations + view.counts.mentions} įrašai)
            </a>
          </div>
        )}
      </section>
      <section class="object-detail-relations" id="rysiai" data-object-panel="rysiai">
        <div class="object-section-heading">
          <p>Struktūruoti ryšiai</p>
          <h2>Su kuo susijęs objektas</h2>
        </div>
        <p class="object-detail-panel-note">
          Ryšiai pateikiami pagal viešą objekto ryšių projekciją. Bendri paminėjimai čia nerodomi
          kaip faktiniai ryšiai.
        </p>
        {relationCount > 0 ? (
          <div class="object-detail-relation-lines">
            {relations.map((group) => (
              <div class="object-detail-relation-line">
                <span class="object-detail-relation-predicate">
                  {group.label.replace(/\s*\([^)]*\)/g, "")}:
                </span>
                <div class="object-detail-relation-targets">
                  {group.targets.map((target) =>
                    target.linked ? (
                      <a href={publicRouteHref(target.slug)} title={typeLabel(target.type)}>
                        {target.title}
                      </a>
                    ) : (
                      <span
                        class="object-detail-relation-unresolved"
                        title="Tikslinis puslapis šioje peržiūroje neįtrauktas"
                      >
                        {target.title}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p class="object-detail-panel-note">
            Šiam objektui dar nėra viešai publikuotinų struktūruotų ryšių.
          </p>
        )}
      </section>
      <section class="object-detail-sources" id="saltiniai" data-object-panel="saltiniai">
        <div class="object-section-heading">
          <h2>Šaltinių sąrašas</h2>
        </div>
        {sources.length > 0 && (
          <div class="object-detail-source-table-wrap">
            <table class="object-detail-source-table">
              <thead>
                <tr>
                  <th scope="col">Šaltinis</th>
                  <th scope="col">Autorius / metai</th>
                  <th scope="col">Teiginiai</th>
                  <th scope="col">Citatos ir paminėjimai</th>
                </tr>
              </thead>
              <tbody>
                {bibliography.map((source) => (
                  <tr>
                    <td data-label="Šaltinis">
                      {source.slug ? (
                        <a href={publicRouteHref(source.slug)}>{source.title}</a>
                      ) : (
                        source.title
                      )}
                    </td>
                    <td data-label="Autorius / metai">
                      {[source.author, source.year].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td data-label="Teiginiai">
                      <a
                        href={`${evidenceHref}?source=${encodeURIComponent(source.id)}&kind=claim`}
                      >
                        {source.claimIds.size}
                      </a>
                    </td>
                    <td data-label="Citatos">
                      <a
                        href={`${evidenceHref}?source=${encodeURIComponent(source.id)}&kind=records`}
                      >
                        {source.citationIds.size}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {sources.length === 0 && (
          <p class="object-detail-panel-note">
            Šaltinių sąrašas bus papildytas kartu su įrodymais.
          </p>
        )}
      </section>
      {galleryItems.length > 0 && (
        <section class="object-detail-gallery-peek" data-object-panel="apzvalga">
          <div class="object-section-heading">
            <p>Galerija</p>
            <h2>Atrinkta iš galerijos</h2>
          </div>
          <div class="object-detail-gallery-grid">
            {galleryItems.map((entry) => (
              <a class="object-detail-gallery-card" href={galleryHref}>
                {heroImage(entry) && (
                  <img
                    src={heroImage(entry)}
                    alt={displayCaption(entry)}
                    width={entry.width || undefined}
                    height={entry.height || undefined}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <span>{displayCaption(entry)}</span>
                <small>
                  {directnessLabel(entry.directness)} · {relationLabel(entry.relationType)}
                </small>
              </a>
            ))}
          </div>
          <a class="object-detail-all-evidence" href={galleryHref}>
            Visa galerija ({view.counts.gallery}) <Images size={15} />
          </a>
        </section>
      )}
    </main>
  )
}

ObjectDetailPage.css = style
ObjectDetailPage.afterDOMLoaded = `${mapScript}\n${tabsScript}\n${snowflakeScript}`

export default (() => ObjectDetailPage) satisfies QuartzComponentConstructor
