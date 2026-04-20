import { FullSlug, isFolderPath, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date as QuartzDate, getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"
import { isPeriodFilterTargetType, parseFrontmatterPeriodRange } from "../util/periodRange"
// @ts-ignore
import periodFilterScript from "./scripts/period-filter.inline"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byDateAndAlphabetical(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

export function byDateAndAlphabeticalFolderFirst(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort folders first
    const f1IsFolder = isFolderPath(f1.slug ?? "")
    const f2IsFolder = isFolderPath(f2.slug ?? "")
    if (f1IsFolder && !f2IsFolder) return -1
    if (!f1IsFolder && f2IsFolder) return 1

    // If both are folders or both are files, sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

type Props = {
  limit?: number
  sort?: SortFn
} & QuartzComponentProps

export const PageList: QuartzComponent = ({ cfg, fileData, allFiles, limit, sort }: Props) => {
  const sorter = sort ?? byDateAndAlphabeticalFolderFirst(cfg)
  let list = allFiles.sort(sorter)
  if (limit) {
    list = list.slice(0, limit)
  }

  const prepared = list.map((page) => {
    const tipas = page.frontmatter?.tipas
    const isTargetType = isPeriodFilterTargetType(tipas)
    const range =
      isTargetType && page.frontmatter ? parseFrontmatterPeriodRange(page.frontmatter) : undefined
    return {
      page,
      isTargetType,
      range,
    }
  })

  const showPeriodFilter = prepared.some(({ isTargetType }) => isTargetType)

  return (
    <>
      {showPeriodFilter && (
        <div class="period-filter-controls" data-period-filter-controls="true">
          <div class="period-filter-row">
            <label>Nuo</label>
            <input type="range" min="0" max="2000" step="50" value="0" data-period-input="start" />
            <span class="period-filter-value" data-period-value="start">
              0
            </span>
          </div>
          <div class="period-filter-row">
            <label>Iki</label>
            <input type="range" min="0" max="2000" step="50" value="2000" data-period-input="end" />
            <span class="period-filter-value" data-period-value="end">
              2000
            </span>
          </div>
          <label class="period-filter-unknown">
            <input type="checkbox" checked={true} data-period-input="unknown" />
            Rodyti be aiškaus laikotarpio
          </label>
          <p class="period-filter-summary" data-period-summary="">
            Rodoma 0 iš 0
          </p>
        </div>
      )}
      <ul
        class="section-ul"
        data-period-filter-list={showPeriodFilter ? "true" : undefined}
        data-period-filter-enabled={showPeriodFilter ? "true" : undefined}
      >
        {prepared.map(({ page, isTargetType, range }) => {
          const title = page.frontmatter?.title
          const tags = page.frontmatter?.tags ?? []
          const pageDate = getDate(cfg, page)

          return (
            <li
              class="section-li"
              data-period-filterable={isTargetType ? "true" : "false"}
              data-period-start={range ? `${range.start}` : undefined}
              data-period-end={range ? `${range.end}` : undefined}
            >
              <div class="section">
                <div class="meta-box">
                  {pageDate && <QuartzDate date={pageDate} locale={cfg.locale} />}
                </div>
                <div class="desc">
                  <h3 class="title-row">
                    <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                      {title}
                    </a>
                  </h3>
                  {tags.length > 0 && (
                    <ul class="tags inline-tags">
                      {tags.map((tag) => (
                        <li>
                          <a
                            class="internal tag-link"
                            href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                          >
                            {tag}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

PageList.afterDOMLoaded = periodFilterScript

PageList.css = `
.section h3 {
  margin: 0;
}

.section .title-row {
  display: block;
}

.section .inline-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0.35rem 0 0;
  padding: 0;
  list-style: none;
}

.section .inline-tags .tag-link {
  font-size: 0.72rem;
  line-height: 1.2;
  opacity: 0.9;
}

.period-filter-controls {
  margin-top: 1.1rem;
  padding: 0.65rem 0.75rem 0.7rem;
  border-radius: 0.65rem;
  border: 1px solid var(--lightgray);
  background: color-mix(in srgb, var(--light) 70%, transparent);
}

.period-filter-row {
  display: grid;
  grid-template-columns: 2.4rem minmax(0, 1fr) 3rem;
  align-items: center;
  gap: 0.6rem;
}

.period-filter-row + .period-filter-row {
  margin-top: 0.45rem;
}

.period-filter-row > label {
  font-size: 0.8rem;
  color: var(--gray);
}

.period-filter-value {
  text-align: right;
  font-size: 0.8rem;
  color: var(--darkgray);
  font-variant-numeric: tabular-nums;
}

.period-filter-unknown {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.6rem;
  font-size: 0.78rem;
  color: var(--gray);
}

.period-filter-summary {
  margin: 0.45rem 0 0;
  font-size: 0.76rem;
  color: var(--gray);
}
`
