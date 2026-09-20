import { externalSourceGroup, parseExternalSources } from "../util/externalSources"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import styles from "./styles/externalSources.scss"
import objectPageStyles from "./styles/objectPageModules.scss"

const ExternalSources: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const view = (() => {
    const raw = fileData.frontmatter?.object_page_view_json
    if (raw && typeof raw === "object") return raw as Record<string, unknown>
    if (typeof raw !== "string") return {}
    try {
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : {}
    } catch {
      return {}
    }
  })()
  const primaryUrls = new Set(Array.isArray(view.primary_source_urls) ? view.primary_source_urls.map(String) : [])
  const sources = parseExternalSources(fileData.frontmatter?.external_sources_json).filter((source) => !primaryUrls.has(source.url))
  if (sources.length === 0) return null

  const groups = new Map<string, typeof sources>()
  for (const source of sources) {
    const group = externalSourceGroup(source)
    const current = groups.get(group) ?? []
    current.push(source)
    groups.set(group, current)
  }

  return (
    <section class="external-sources" aria-labelledby="external-sources-title">
      <div class="external-sources-heading">
        <p class="external-sources-eyebrow">Papildomi skaitymai</p>
        <h2 id="external-sources-title">Daugiau šaltinių</h2>
      </div>
      <div class="external-sources-groups">
        {[...groups.entries()].map(([group, entries]) => (
          <div class="external-sources-group" key={group}>
            <h3>{group}</h3>
            <ul>
              {entries.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer noopener">
                    {source.title}
                  </a>
                  {source.publisher !== group && (
                    <span class="external-sources-publisher">{source.publisher}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

ExternalSources.css = `${styles}\n${objectPageStyles}`

export default (() => ExternalSources) satisfies QuartzComponentConstructor
