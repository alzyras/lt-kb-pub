type BrandLockupProps = {
  compact?: boolean
  invert?: boolean
  showTagline?: boolean
}

export function BrandLockup({
  compact = false,
  invert = false,
  showTagline = true,
}: BrandLockupProps) {
  return (
    <span
      class={`lt-history-lockup${compact ? " is-compact" : ""}${invert ? " is-invert" : ""}`}
    >
      <span class="lt-history-lockup-mark" aria-hidden="true">
        <svg viewBox="0 0 88 108" role="img" focusable="false">
          <path d="M33 8 45 3l10 7-4 12-12 5-10-8Z" fill="currentColor" opacity="0.96" />
          <path
            d="M23 26 37 18l10 8-5 18-14 7-11-10ZM50 19l13 8 2 19-14 8-10-9 5-18Z"
            fill="currentColor"
            opacity="0.88"
          />
          <path
            d="M17 54 29 46l10 8-4 19-13 8-11-9ZM42 46l10-7 12 9-2 20-13 8-11-9Z"
            fill="currentColor"
            opacity="0.8"
          />
          <path
            d="M25 82 37 74l11 8-4 16-12 7-11-8ZM49 74l13-8 10 8-3 17-13 7-12-8Z"
            fill="currentColor"
            opacity="0.72"
          />
          <path d="M57 38h15l-4 9H55Z" fill="var(--lt-history-accent, currentColor)" opacity="0.9" />
        </svg>
      </span>
      <span class="lt-history-lockup-copy">
        <span class="lt-history-lockup-name">
          <span>Lietuvos</span>
          <strong>istorija</strong>
        </span>
        {showTagline && <small>Lietuvos istorijos žinių lobynas</small>}
      </span>
    </span>
  )
}
