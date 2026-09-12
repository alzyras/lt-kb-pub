import { ExternalLink, Images } from "lucide-preact"
import { FullSlug, resolveRelative, simplifySlug, slugifyFilePath } from "../util/path"
import {
  citationQuote,
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
  relationLabel,
  type MediaEntry,
} from "../util/objectMedia"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { ObjectPageShell, objectPortrait } from "./ObjectPageShell"
import { objectPageViewModel } from "../util/objectPageView"
import { objectBibliography } from "../util/objectBibliography"
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
  href,
}: {
  claim: ObjectEvidenceClaim
  sources: Map<string, string | undefined>
  href: string
}) {
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
        <summary>Įrodymai ({claim.citations.length})</summary>
        {claim.citations.map((citation) => {
          const source = cleanText(
            citation.fields.get("šaltinis") || citation.fields.get("saltinis"),
          )
          const quote = citationQuote(citation, Number.MAX_SAFE_INTEGER)
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

const ObjectDetailPage: QuartzComponent = (props) => {
  const { fileData, allFiles } = props
  const slug = fileData.slug as FullSlug
  const frontmatter = (fileData.frontmatter ?? {}) as Record<string, unknown>
  const evidence = objectDetailEvidenceFromFile(String(fileData.filePath ?? ""))
  const index = objectPageIndexes(allFiles)
  const media = objectMediaSet(frontmatter as any)
  const view = objectPageViewModel(frontmatter, evidence, { gallery: media.all.length })
  const hero = objectPortrait(frontmatter, view.portraitMediaId)
  const galleryItems = galleryPreview(media.all, hero, view.featuredGalleryIds)
  const sources = sourceLinks(
    [...new Set([...evidence.sourceTitles, ...asStrings(frontmatter.saltiniai)])],
    index,
    slug,
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
  const bibliography = objectBibliography(allFiles, evidence)
  const projectedRelations = view.relationRows.map((row) => ({
    label: relationDirectionLabel(row.predicate, row.direction),
    target: row.target,
    display: row.label || "",
  }))
  const projectedTargetSlugs = new Set(
    projectedRelations.map((relation) => simplifySlug(slugifyFilePath(relation.target as any))),
  )
  const relations = relationGroups(
    [
      ...projectedRelations,
      // A legacy relation may be present only as a Markdown URL. Keep it in
      // the object page when the semantic projection has not already covered
      // the same target, instead of dropping it because another relation row
      // exists for this object.
      ...evidence.relations.filter(
        (relation) =>
          !projectedTargetSlugs.has(simplifySlug(slugifyFilePath(relation.target as any))),
      ),
    ],
    index,
  )
  const fallbackRelationCount = relations.reduce((total, group) => total + group.targets.length, 0)
  const externalLinks = externalReading(frontmatter.external_sources_json)
  const aliases = asStrings(frontmatter.aliases)
  const roles = asStrings(frontmatter.entity_roles)
  const galleryHref = resolveRelative(slug, objectGallerySlug(slug))
  const evidenceHref = resolveRelative(slug, `${slug}/irodymai` as FullSlug)
  const relationCount = view.counts.relations || fallbackRelationCount
  const summary = evidence.summary
  const summaryPortrait = heroImage(hero)
  const fallbackMessage = evidence.claims.length
    ? "Šiam įrašui rengiama šaltiniais pagrįsta santrauka."
    : "Šis įrašas dar laukia šaltiniais pagrįstos santraukos."

  return (
    <main class="object-detail-page" data-object-detail="true" data-object-tabs="true">
      <ObjectPageShell props={props} active="overview" />
      <section class="object-detail-overview" id="apzvalga" data-object-panel="apzvalga">
        <div class="object-section-heading">
          <p>Apžvalga</p>
          <h2>Santrauka</h2>
        </div>
        <div class="object-detail-summary-with-portrait">
          <div>
            {summary ? (
              <p class="object-detail-summary">{summary}</p>
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
                decoding="async"
              />
              <span>Žiūrėti galerijoje</span>
            </a>
          )}
        </div>
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
        {externalLinks.length > 0 && (
          <nav class="object-detail-reading" aria-label="Patikrintos skaitymo nuorodos">
            {externalLinks.slice(0, 5).map((source) => (
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
        {evidence.claims.length > 0 && (
          <div class="object-detail-overview-evidence">
            <div class="object-section-heading">
              <p>Patikrinti teiginiai</p>
              <h2>Svarbiausi faktai</h2>
            </div>
            <div class="object-detail-claims">
              {(view.featuredClaimIds.length
                ? view.featuredClaimIds
                    .map((id) =>
                      evidence.claims.find(
                        (claim) => claim.id === id || claim.globalIds?.includes(id),
                      ),
                    )
                    .filter((claim): claim is ObjectEvidenceClaim => Boolean(claim))
                : evidence.claims.slice(0, 6)
              )
                .slice(0, 6)
                .map((claim) => (
                  <ClaimCard
                    claim={claim}
                    sources={sourceHrefs}
                    href={objectClaimHref(slug, evidence, claim.id)}
                  />
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
          <div class="object-detail-relation-lines">
            {relations.map((group) => (
              <div class="object-detail-relation-line">
                <span class="object-detail-relation-predicate">
                  {group.label.replace(/\s*\([^)]*\)/g, "")}:
                </span>
                <div class="object-detail-relation-targets">
                  {group.targets.map((target) => (
                    <a href={resolveRelative(slug, target.slug)} title={typeLabel(target.type)}>
                      {target.title}
                    </a>
                  ))}
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
          <p>Provenansas</p>
          <h2>Šaltiniai ir tolesnis skaitymas</h2>
        </div>
        {sources.length > 0 && (
          <div class="object-detail-source-table-wrap">
            <table class="object-detail-source-table">
              <thead>
                <tr>
                  <th scope="col">Vidinis šaltinis</th>
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
                        <a href={resolveRelative(slug, source.slug)}>{source.title}</a>
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
        {externalLinks.length > 0 && (
          <div class="object-detail-source-table-wrap">
            <table class="object-detail-source-table">
              <thead>
                <tr>
                  <th scope="col">Tolesnis skaitymas</th>
                  <th scope="col">Leidėjas</th>
                  <th scope="col">Atverti</th>
                </tr>
              </thead>
              <tbody>
                {externalLinks.map((source) => (
                  <tr>
                    <td>{source.title}</td>
                    <td>{source.publisher || "—"}</td>
                    <td>
                      <a href={source.url} target="_blank" rel="noreferrer noopener">
                        Nuorodą <ExternalLink size={13} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
ObjectDetailPage.afterDOMLoaded = `${mapScript}\n${tabsScript}`

export default (() => ObjectDetailPage) satisfies QuartzComponentConstructor
