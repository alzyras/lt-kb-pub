import { ExternalLink, Images } from "lucide-preact"
import { FullSlug, resolveRelative, simplifySlug, slugifyFilePath } from "../util/path"
import {
  citationQuote,
  isMeaningfulObjectText,
  objectDetailEvidenceFromFile,
  type ObjectEvidenceClaim,
} from "../util/objectDetail"
import {
  cleanText,
  directnessLabel,
  displayCaption,
  mediaDetailUrl,
  objectGallerySlug,
  objectMediaSet,
  relationLabel,
  type MediaEntry,
} from "../util/objectMedia"
import { graphSlugForPageData } from "../util/graphIdentity"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { ObjectPageTabs } from "./ObjectPageTabs"
import { objectPageViewModel } from "../util/objectPageView"
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
type RelationTarget = { slug: FullSlug; label: string; title: string; type: string }
type RelationGroup = { label: string; targets: RelationTarget[] }
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

function titleParts(frontmatter: Record<string, unknown> | undefined) {
  const value = cleanText(
    frontmatter?.canonical_name || frontmatter?.pavadinimas || frontmatter?.title,
  )
  const match = value.match(/^(.+?)\s*\(([^()]{3,})\)$/u)
  return match
    ? { title: match[1].trim(), qualifier: match[2].trim() }
    : { title: value || "Istorijos objektas", qualifier: "" }
}

function objectType(frontmatter: Record<string, unknown> | undefined): string {
  return cleanText(frontmatter?.tipas).toLocaleLowerCase("lt")
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

function sourceLinks(titles: string[], index: ObjectPageIndexes, currentSlug: FullSlug) {
  return [...new Set(titles.filter(isMeaningfulObjectText))].map((title) => {
    const source = index.sourceByTitle.get(normalized(title))
    return { title, href: source ? resolveRelative(currentSlug, source) : undefined }
  })
}

function heroImage(media: MediaEntry | undefined): string {
  return media ? cleanText(media.thumbUrl || media.displayUrl || media.sourceUrl) : ""
}

function galleryPreview(media: MediaEntry[], primary?: MediaEntry): MediaEntry[] {
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
  return unique
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
    .slice(0, 3)
}

function relationGroups(
  relations: Array<{ label: string; target: string; display: string }>,
  index: ObjectPageIndexes,
): RelationGroup[] {
  const groups = new Map<string, RelationTarget[]>()
  for (const relation of relations) {
    const label = cleanText(relation.label)
    const targets = groups.get(label) ?? []
    // Relation markdown keeps the human path (spaces/diacritics), while the
    // Quartz file index uses its canonical slug.  Normalize both through the
    // same slugifier before lookup; otherwise valid relation targets silently
    // disappeared from the page.
    const file = index.bySlug.get(simplifySlug(slugifyFilePath(relation.target as any)))
    if (!file?.slug?.startsWith("objektai/")) continue
    if (!targets.some((target) => target.slug === file.slug)) {
      const targetTitle = titleParts(file.frontmatter as Record<string, unknown>).title
      targets.push({
        slug: file.slug,
        label: cleanText(relation.display) || targetTitle,
        title: targetTitle,
        type: objectType(file.frontmatter as Record<string, unknown>),
      })
    }
    if (targets.length) groups.set(label, targets)
  }
  return [...groups.entries()].map(([label, targets]) => ({ label, targets }))
}

function relationDirectionLabel(label: string, direction = ""): string {
  const readable = cleanText(label).replaceAll("_", " ")
  if (!readable) return "Susijęs objektas"
  return direction === "inbound" ? `${readable} ←` : `${readable} →`
}

function ClaimCard({
  claim,
  sources,
}: {
  claim: ObjectEvidenceClaim
  sources: Map<string, string | undefined>
}) {
  return (
    <article class="object-claim-card" id={`claim-${claim.id}`}>
      <div class="object-claim-card-header">
        <a class="object-claim-id" href={`#claim-${claim.id}`}>
          {claim.id}
        </a>
        {claim.reliability && <span class="object-claim-reliability">{claim.reliability}</span>}
      </div>
      <p>{claim.text}</p>
      <details>
        <summary>Įrodymai ({claim.citations.length})</summary>
        {claim.citations.map((citation) => {
          const source = cleanText(
            citation.fields.get("šaltinis") || citation.fields.get("saltinis"),
          )
          const quote = citationQuote(citation, 900)
          const href = sources.get(normalized(source))
          return (
            <article class="object-claim-citation" data-citation-id={citation.id}>
              {source && (
                <p class="object-claim-source">
                  Šaltinis: {href ? <a href={href}>{source}</a> : source}
                </p>
              )}
              {quote && <blockquote>{quote}</blockquote>}
            </article>
          )
        })}
        {claim.citations.length === 0 && (
          <p class="object-claim-source">Vieša citata šiam teiginiui dar nesusieta.</p>
        )}
      </details>
    </article>
  )
}

function ObjectMapPreview({
  title,
  graphSlug,
  relationCount,
}: {
  title: string
  graphSlug: string
  relationCount: number
}) {
  const mapHref = `/zemelapis/?focus=${encodeURIComponent(graphSlug)}&depth=1&panel=details`
  return (
    <aside
      class="object-detail-map object-map-cta"
      data-object-map-cta="true"
      data-object-slug={graphSlug}
      data-object-title={title}
      data-object-map-href={mapHref}
      data-object-semantic-count={relationCount}
    >
      <div class="object-detail-map-heading">
        <span>Ryšių žemėlapis</span>
        <strong data-object-map-count="">Kraunami ryšiai…</strong>
      </div>
      <a
        class="object-map-preview-link"
        href={mapHref}
        aria-label={`Atidaryti ${title} ryšių žemėlapį`}
      >
        <canvas class="object-map-preview-canvas" data-object-map-canvas="" />
        <span class="object-map-preview-status" data-object-map-status="" />
      </a>
    </aside>
  )
}

const ObjectDetailPage: QuartzComponent = (props) => {
  const { fileData, allFiles } = props
  const slug = fileData.slug as FullSlug
  const frontmatter = (fileData.frontmatter ?? {}) as Record<string, unknown>
  const evidence = objectDetailEvidenceFromFile(String(fileData.filePath ?? ""))
  const index = objectPageIndexes(allFiles)
  const title = titleParts(frontmatter)
  const type = objectType(frontmatter)
  const media = objectMediaSet(frontmatter as any)
  const primary =
    media.primary?.directness === "direct" ? media.primary : (media.direct[0] ?? media.primary)
  const galleryItems = galleryPreview(media.all, primary)
  const sources = sourceLinks(
    [...new Set([...evidence.sourceTitles, ...asStrings(frontmatter.saltiniai)])],
    index,
    slug,
  )
  const sourceHrefs = new Map(sources.map((source) => [normalized(source.title), source.href]))
  const view = objectPageViewModel(frontmatter, evidence, { gallery: media.all.length })
  const relations = relationGroups(
    view.relationRows.length
      ? view.relationRows.map((row) => ({
          label: relationDirectionLabel(row.predicate, row.direction),
          target: row.target,
          display: row.label || "",
        }))
      : evidence.relations,
    index,
  )
  const fallbackRelationCount = relations.reduce((total, group) => total + group.targets.length, 0)
  const graphSlug = graphSlugForPageData(fileData as any, slug)
  const externalLinks = externalReading(frontmatter.external_sources_json)
  const aliases = asStrings(frontmatter.aliases)
  const roles = asStrings(frontmatter.entity_roles)
  const galleryHref = resolveRelative(slug, objectGallerySlug(slug))
  const evidenceHref = resolveRelative(slug, `${slug}/irodymai` as FullSlug)
  const relationCount = view.counts.relations || fallbackRelationCount
  const summary = evidence.summary
  const fallbackMessage = evidence.claims.length
    ? "Šiam įrašui rengiama šaltiniais pagrįsta santrauka."
    : "Šis įrašas dar laukia šaltiniais pagrįstos santraukos."

  return (
    <main class="object-detail-page" data-object-detail="true" data-object-tabs="true">
      <nav class="object-detail-breadcrumbs" aria-label="Kelias">
        <a href="/">Pradžia</a>
        <span>/</span>
        <a href="/objektai">Objektai</a>
        <span>/</span>
        <span>{typeLabel(type)}</span>
      </nav>
      <header class="object-detail-intro">
        <div class="object-detail-identity">
          <div>
            <p class="object-detail-eyebrow">{typeLabel(type)}</p>
            <h1>{title.title}</h1>
            {title.qualifier && <p class="object-detail-qualifier">{title.qualifier}</p>}
            <p class="object-detail-counts">
              <span>{view.counts.claims} teiginiai</span>
              <span>{view.counts.citations + view.counts.mentions} įrašai</span>
              <span>{relationCount} ryšiai</span>
            </p>
          </div>
        </div>
        <ObjectMapPreview title={title.title} graphSlug={graphSlug} relationCount={relationCount} />
      </header>
      <ObjectPageTabs currentSlug={slug} objectSlug={slug} counts={view.counts} active="overview" />
      <section class="object-detail-overview" id="apzvalga" data-object-panel="apzvalga">
        <div class="object-section-heading">
          <p>Apžvalga</p>
          <h2>{title.title}</h2>
        </div>
        {summary ? (
          <div class="object-detail-summary-layout">
            <p class="object-detail-summary">{summary}</p>
            {heroImage(primary) && (
              <a class="object-detail-summary-media" href={mediaDetailUrl(primary!)}>
                <img
                  src={heroImage(primary)}
                  alt={displayCaption(primary!)}
                  width={primary?.width || undefined}
                  height={primary?.height || undefined}
                  fetchPriority="high"
                  decoding="async"
                />
                <span>{displayCaption(primary!)}</span>
              </a>
            )}
          </div>
        ) : (
          <p class="object-detail-summary object-detail-summary-pending">{fallbackMessage}</p>
        )}
        {evidence.claims.length > 0 && (
          <div class="object-detail-overview-evidence">
            <div class="object-section-heading">
              <p>Patikrinti teiginiai</p>
              <h2>Svarbiausi faktai</h2>
            </div>
            <div class="object-detail-claims">
              {(view.featuredClaimIds.length
                ? view.featuredClaimIds
                    .map((id) => evidence.claims.find((claim) => claim.id === id))
                    .filter((claim): claim is ObjectEvidenceClaim => Boolean(claim))
                : evidence.claims.slice(0, 6)
              )
                .slice(0, 6)
                .map((claim) => (
                  <ClaimCard claim={claim} sources={sourceHrefs} />
                ))}
            </div>
            <a class="object-detail-all-evidence" href={evidenceHref}>
              Visi teiginiai ir įrodymai ({view.counts.claims} teiginiai,{" "}
              {view.counts.citations + view.counts.mentions} įrašai)
            </a>
          </div>
        )}
        {(aliases.length > 0 || roles.length > 0) && (
          <details class="object-detail-extra">
            <summary>Papildoma informacija</summary>
            {roles.length > 0 && (
              <p>
                <strong>Vaidmenys:</strong> {roles.join(" · ")}
              </p>
            )}
            {aliases.length > 0 && (
              <p>
                <strong>Kiti vardai:</strong> {aliases.join(" · ")}
              </p>
            )}
          </details>
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
          <div class="object-detail-relation-groups">
            {relations.map((group) => (
              <section class="object-detail-relation-group">
                <h3>{group.label}</h3>
                <ul>
                  {group.targets.map((target) => (
                    <li>
                      <a href={resolveRelative(slug, target.slug)}>
                        <span>{typeLabel(target.type)}</span>
                        {target.label || target.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
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
          <p>Provenansas</p>
          <h2>Šaltiniai ir tolesnis skaitymas</h2>
        </div>
        {sources.length > 0 && (
          <section class="object-detail-source-group">
            <div class="object-detail-source-group-heading">
              <h3>Vidiniai šaltiniai</h3>
              <span>{sources.length}</span>
            </div>
            <ul>
              {sources.map((source) => (
                <li>{source.href ? <a href={source.href}>{source.title}</a> : source.title}</li>
              ))}
            </ul>
          </section>
        )}
        {externalLinks.length > 0 && (
          <section class="object-detail-source-group object-detail-external-links">
            <div class="object-detail-source-group-heading">
              <h3>Išoriniai šaltiniai</h3>
              <span>{externalLinks.length}</span>
            </div>
            <ul class="object-detail-external-links">
              {externalLinks.map((source) => (
                <li>
                  <a href={source.url} target="_blank" rel="noreferrer noopener">
                    {source.title}
                    <ExternalLink size={13} />
                  </a>
                  {source.publisher && <span>{source.publisher}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}
        {sources.length === 0 && externalLinks.length === 0 && (
          <p class="object-detail-panel-note">
            Šaltinių sąrašas bus papildytas kartu su įrodymais.
          </p>
        )}
      </section>
      {galleryItems.length > 0 && (
        <section class="object-detail-gallery-peek" data-object-panel="apzvalga">
          <div class="object-section-heading">
            <p>Vaizdų archyvas</p>
            <h2>Atvaizdai ir dokumentai</h2>
          </div>
          <div class="object-detail-gallery-grid">
            {galleryItems.map((entry) => (
              <a class="object-detail-gallery-card" href={mediaDetailUrl(entry)}>
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
ObjectDetailPage.afterDOMLoaded = `${mapScript}\n${tabsScript}`

export default (() => ObjectDetailPage) satisfies QuartzComponentConstructor
