import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"
import { FullSlug, resolveRelative } from "../util/path"
import { PeriodChip, visiblePeriodDisplay } from "../util/periodRange"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

function PeriodChips({ chips, currentSlug }: { chips: PeriodChip[]; currentSlug: FullSlug }) {
  if (chips.length === 0) {
    return null
  }

  return (
    <span class="period-chips" aria-label="Laikotarpis">
      {chips.map((chip) =>
        chip.slug ? (
          <a
            class={`period-chip period-chip-${chip.kind}`}
            href={resolveRelative(currentSlug, chip.slug as FullSlug)}
          >
            {chip.label}
          </a>
        ) : (
          <span class={`period-chip period-chip-${chip.kind}`}>{chip.label}</span>
        ),
      )}
    </span>
  )
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []
      const periodDisplay = visiblePeriodDisplay(fileData.frontmatter)

      if (periodDisplay && fileData.slug) {
        segments.push(
          <span class="period-meta" title={periodDisplay.label}>
            <span class="period-meta-label">Laikotarpis</span>
            <PeriodChips chips={periodDisplay.chips} currentSlug={fileData.slug} />
          </span>,
        )
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      if (segments.length === 0) {
        return null
      }

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
