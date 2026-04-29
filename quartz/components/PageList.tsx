import { FullSlug, isFolderPath, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"
import {
  isPeriodFilterTargetType,
  parseFrontmatterPeriodRange,
  visiblePeriodDisplay,
} from "../util/periodRange"
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
      periodDisplay: visiblePeriodDisplay(page.frontmatter),
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
              step="50"
              value="0"
              aria-label="Nuo metų"
              data-period-input="start"
            />
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value="2000"
              aria-label="Iki metų"
              data-period-input="end"
            />
          </div>
          <div class="period-filter-footer">
            <span class="period-filter-summary" data-period-summary="">
              Rodoma 0 iš 0
            </span>
            <label class="period-filter-unknown">
              <input type="checkbox" checked={true} data-period-input="unknown" />
              Rodyti be aiškaus laikotarpio
            </label>
          </div>
        </div>
      )}
      <ul
        class="section-ul"
        data-period-filter-list={showPeriodFilter ? "true" : undefined}
        data-period-filter-enabled={showPeriodFilter ? "true" : undefined}
      >
        {prepared.map(({ page, isTargetType, range, periodDisplay }) => {
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
                <div class="meta-box" title={periodDisplay?.label}>
                  {periodDisplay?.chips.map((chip) =>
                    chip.slug ? (
                      <a
                        class={`period-chip period-chip-${chip.kind}`}
                        href={resolveRelative(fileData.slug!, chip.slug as FullSlug)}
                      >
                        {chip.label}
                      </a>
                    ) : (
                      <span class={`period-chip period-chip-${chip.kind}`}>{chip.label}</span>
                    ),
                  )}
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

.section .meta-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  min-width: 5.5rem;
}

.section .period-chip {
  display: inline-flex;
  align-items: center;
  min-height: 1.25rem;
  padding: 0.1rem 0.42rem;
  border: 1px solid color-mix(in srgb, var(--secondary) 28%, var(--lightgray));
  border-radius: 999rem;
  background: color-mix(in srgb, var(--secondary) 8%, transparent);
  color: var(--darkgray);
  font-size: 0.7rem;
  font-weight: 750;
  line-height: 1.2;
  text-decoration: none;
}

.section a.period-chip {
  color: var(--secondary);
}

.section .period-chip-date {
  border-color: color-mix(in srgb, var(--darkgray) 22%, var(--lightgray));
  background: color-mix(in srgb, var(--lightgray) 30%, transparent);
  color: var(--darkgray);
  font-variant-numeric: tabular-nums;
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
  gap: 0.9rem;
}

.period-filter-header {
  justify-content: space-between;
}

.period-filter-footer {
  justify-content: flex-start;
  flex-wrap: wrap;
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
  --period-track-height: 0.5rem;
  --period-thumb-size: 1.15rem;
  position: relative;
  height: 2.5rem;
  margin: 0.55rem 0 0.3rem;
}

.period-filter-track,
.period-filter-range {
  position: absolute;
  left: 0;
  right: 0;
  top: calc((2.5rem - var(--period-track-height)) / 2);
  height: var(--period-track-height);
  border-radius: 999rem;
}

.period-filter-track {
  background: color-mix(in srgb, var(--lightgray) 82%, var(--dark) 12%);
}

.period-filter-range {
  background: var(--secondary);
  box-shadow: 0 0 0.55rem color-mix(in srgb, var(--secondary) 24%, transparent);
}

.period-filter-slider input[type="range"] {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 2.5rem;
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
  pointer-events: none;
  background: transparent;
}

.period-filter-slider input[data-period-input="start"] {
  z-index: 2;
}

.period-filter-slider input[data-period-input="end"] {
  z-index: 3;
}

.period-filter-slider input[type="range"]::-webkit-slider-runnable-track {
  height: var(--period-track-height);
  background: transparent;
}

.period-filter-slider input[type="range"]::-moz-range-track {
  height: var(--period-track-height);
  background: transparent;
  border: 0;
}

.period-filter-slider input[type="range"]::-moz-range-progress {
  background: transparent;
}

.period-filter-slider input[type="range"]::-webkit-slider-thumb {
  width: var(--period-thumb-size);
  height: var(--period-thumb-size);
  margin-top: calc((var(--period-track-height) - var(--period-thumb-size)) / 2);
  -webkit-appearance: none;
  appearance: none;
  pointer-events: auto;
  cursor: ew-resize;
  border: 2px solid var(--light);
  border-radius: 999rem;
  background: var(--secondary);
  box-shadow:
    0 0.1rem 0.45rem color-mix(in srgb, var(--dark) 20%, transparent),
    0 0 0 0.12rem color-mix(in srgb, var(--secondary) 24%, transparent);
}

.period-filter-slider input[type="range"]::-moz-range-thumb {
  width: var(--period-thumb-size);
  height: var(--period-thumb-size);
  margin-top: calc((var(--period-track-height) - var(--period-thumb-size)) / 2);
  pointer-events: auto;
  cursor: ew-resize;
  border: 2px solid var(--light);
  border-radius: 999rem;
  background: var(--secondary);
  box-shadow:
    0 0.1rem 0.45rem color-mix(in srgb, var(--dark) 20%, transparent),
    0 0 0 0.12rem color-mix(in srgb, var(--secondary) 24%, transparent);
}

.period-filter-unknown {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--darkgray);
  font-size: 0.82rem;
  white-space: nowrap;
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
    gap: 0.6rem 0.9rem;
  }
}
`
