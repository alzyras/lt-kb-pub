import { FullSlug, isFolderPath, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"
import { isPeriodFilterTargetType, parseFrontmatterPeriodRange } from "../util/periodRange"
import { visibleHistoricalPeriod } from "../util/historicalPeriod"
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
      periodLabel: visibleHistoricalPeriod(page.frontmatter?.laikotarpis),
    }
  })

  const showPeriodFilter = prepared.some(({ isTargetType }) => isTargetType)

  return (
    <>
      {showPeriodFilter && (
        <div class="period-filter-controls" data-period-filter-controls="true">
          <div class="period-filter-header">
            <span class="period-filter-label">Laikotarpis</span>
            <span class="period-filter-range-label">
              <span data-period-value="start">0</span>
              {" – "}
              <span data-period-value="end">2000</span>
            </span>
          </div>
          <div class="period-filter-slider" aria-label="Laikotarpio intervalas">
            <div class="period-filter-track" />
            <div class="period-filter-range" data-period-range-fill="" />
            <input
              type="range"
              min="0"
              max="2000"
              step="25"
              value="0"
              aria-label="Nuo metų"
              data-period-input="start"
            />
            <input
              type="range"
              min="0"
              max="2000"
              step="25"
              value="2000"
              aria-label="Iki metų"
              data-period-input="end"
            />
          </div>
          <div class="period-filter-footer">
            <label class="period-filter-unknown">
              <input type="checkbox" checked={true} data-period-input="unknown" />
              Rodyti be aiškaus laikotarpio
            </label>
            <span class="period-filter-summary" data-period-summary="">
              Rodoma 0 iš 0
            </span>
          </div>
        </div>
      )}
      <ul
        class="section-ul"
        data-period-filter-list={showPeriodFilter ? "true" : undefined}
        data-period-filter-enabled={showPeriodFilter ? "true" : undefined}
      >
        {prepared.map(({ page, isTargetType, range, periodLabel }) => {
          const title = page.frontmatter?.title
          const tags = page.frontmatter?.tags ?? []

          return (
            <li
              class="section-li"
              data-period-filterable={isTargetType ? "true" : "false"}
              data-period-start={range ? `${range.start}` : undefined}
              data-period-end={range ? `${range.end}` : undefined}
            >
              <div class="section">
                <div class="meta-box">{periodLabel && <span>{periodLabel}</span>}</div>
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
  width: min(42rem, 100%);
  margin: 1.25rem 0 1.4rem;
  padding: 1rem 1.1rem 1.05rem;
  border-radius: 1rem;
  border: 1px solid var(--lightgray);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--light) 90%, transparent), transparent),
    color-mix(in srgb, var(--light) 72%, var(--dark) 8%);
  box-shadow: 0 0.45rem 1.6rem color-mix(in srgb, var(--dark) 12%, transparent);
}

.period-filter-header,
.period-filter-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.period-filter-label {
  color: var(--dark);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.period-filter-range-label {
  color: var(--secondary);
  font-size: 1rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.period-filter-slider {
  position: relative;
  height: 3.2rem;
  margin: 0.65rem 0 0.35rem;
}

.period-filter-track,
.period-filter-range {
  position: absolute;
  left: 0;
  right: 0;
  top: 1.42rem;
  height: 0.55rem;
  border-radius: 999rem;
}

.period-filter-track {
  background: color-mix(in srgb, var(--lightgray) 72%, var(--dark) 16%);
}

.period-filter-range {
  background: linear-gradient(90deg, var(--secondary), var(--tertiary));
  box-shadow: 0 0 0.9rem color-mix(in srgb, var(--secondary) 38%, transparent);
}

.period-filter-slider input[type="range"] {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 3.2rem;
  margin: 0;
  appearance: none;
  pointer-events: none;
  background: transparent;
}

.period-filter-slider input[type="range"]::-webkit-slider-runnable-track {
  height: 0.55rem;
  background: transparent;
}

.period-filter-slider input[type="range"]::-moz-range-track {
  height: 0.55rem;
  background: transparent;
}

.period-filter-slider input[type="range"]::-webkit-slider-thumb {
  width: 1.45rem;
  height: 1.45rem;
  margin-top: -0.45rem;
  appearance: none;
  pointer-events: auto;
  cursor: grab;
  border: 0.18rem solid var(--light);
  border-radius: 999rem;
  background: var(--secondary);
  box-shadow:
    0 0.18rem 0.55rem color-mix(in srgb, var(--dark) 26%, transparent),
    0 0 0 0.18rem color-mix(in srgb, var(--secondary) 28%, transparent);
}

.period-filter-slider input[type="range"]::-moz-range-thumb {
  width: 1.45rem;
  height: 1.45rem;
  pointer-events: auto;
  cursor: grab;
  border: 0.18rem solid var(--light);
  border-radius: 999rem;
  background: var(--secondary);
  box-shadow:
    0 0.18rem 0.55rem color-mix(in srgb, var(--dark) 26%, transparent),
    0 0 0 0.18rem color-mix(in srgb, var(--secondary) 28%, transparent);
}

.period-filter-unknown {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--darkgray);
  font-size: 0.82rem;
}

.period-filter-unknown input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--secondary);
}

.period-filter-summary {
  color: var(--gray);
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

@media all and (max-width: 600px) {
  .period-filter-controls {
    padding: 0.9rem;
  }

  .period-filter-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.55rem;
  }
}
`
