export type ParsedRange = {
  start: number
  end: number
}

export type PeriodChip = {
  label: string
  slug?: string
  kind: "periodas" | "amzius" | "date" | "laikotarpis"
}

export type PeriodDisplay = {
  label: string
  chips: PeriodChip[]
}

const PERIOD_MIN_YEAR = 0
const PERIOD_MAX_YEAR = 2000

const PERIODAS_RANGES: Record<string, ParsedRange> = {
  priesistore: { start: 0, end: 299 },
  senove: { start: 300, end: 499 },
  viduramziai: { start: 500, end: 1499 },
  ankstyvieji_naujieji_laikai: { start: 1500, end: 1799 },
  naujieji_laikai: { start: 1800, end: 1917 },
  siuolaikine_istorija: { start: 1918, end: 2000 },
}

const PERIODAS_LABELS: Record<string, string> = {
  priesistore: "Priešistorė",
  senove: "Senovė",
  viduramziai: "Viduramžiai",
  ankstyvieji_naujieji_laikai: "Ankstyvieji naujieji laikai",
  naujieji_laikai: "Naujieji laikai",
  siuolaikine_istorija: "Šiuolaikinė istorija",
}

const ROMAN_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
}

function asString(value: unknown): string {
  if (typeof value === "string") {
    return value.trim()
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return `${Math.trunc(value)}`
  }

  return ""
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(asString).filter((token) => token.length > 0)
  }

  const scalar = asString(value)
  return scalar ? [scalar] : []
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items))
}

function clampYear(year: number): number {
  return Math.min(PERIOD_MAX_YEAR, Math.max(PERIOD_MIN_YEAR, year))
}

function normalizeRange(start: number, end: number): ParsedRange {
  const normalizedStart = clampYear(Math.min(start, end))
  const normalizedEnd = clampYear(Math.max(start, end))
  return { start: normalizedStart, end: normalizedEnd }
}

function parsePeriodas(value: unknown): string | undefined {
  const token = asString(value).toLowerCase()
  return token && PERIODAS_LABELS[token] ? token : undefined
}

function parseYear(value: unknown): number | undefined {
  const token = asString(value)
  if (!/^-?\d{1,4}$/.test(token)) {
    return undefined
  }

  const year = Number(token)
  if (!Number.isFinite(year)) {
    return undefined
  }

  return clampYear(year)
}

function romanToInt(raw: string): number | undefined {
  const token = raw.trim().toUpperCase()
  if (!/^[IVXLCDM]+$/.test(token)) {
    return undefined
  }

  let sum = 0
  let prev = 0
  for (let i = token.length - 1; i >= 0; i -= 1) {
    const value = ROMAN_VALUES[token[i]]
    if (!value) {
      return undefined
    }

    if (value < prev) {
      sum -= value
    } else {
      sum += value
      prev = value
    }
  }

  return sum
}

function intToRoman(value: number): string {
  const numerals: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ]
  let remaining = Math.max(1, Math.trunc(value))
  let out = ""
  for (const [amount, symbol] of numerals) {
    while (remaining >= amount) {
      out += symbol
      remaining -= amount
    }
  }
  return out
}

function normalizeCenturyToken(token: string): string | undefined {
  const cleaned = token
    .trim()
    .toUpperCase()
    .replace(/AMŽ(?:IUS|IAUS)?/g, "")
    .replace(/\bA\b/g, "")
    .replace(/[.\s]+/g, "")
  if (!cleaned) {
    return undefined
  }

  if (/^\d{1,2}$/.test(cleaned)) {
    const century = Number(cleaned)
    return century >= 1 && century <= 30 ? intToRoman(century) : undefined
  }

  const roman = romanToInt(cleaned)
  return roman && roman >= 1 && roman <= 30 ? intToRoman(roman) : undefined
}

function centuryToRange(century: number): ParsedRange | undefined {
  if (!Number.isFinite(century) || century < 1 || century > 30) {
    return undefined
  }

  const start = (century - 1) * 100 + 1
  const end = century * 100
  return normalizeRange(start, end)
}

function parseCenturyToken(token: string): ParsedRange | undefined {
  const normalized = normalizeCenturyToken(token)
  const roman = normalized ? romanToInt(normalized) : undefined
  if (!roman) {
    return undefined
  }

  return centuryToRange(roman)
}

function parseCenturiesFromText(text: string): ParsedRange[] {
  const out: ParsedRange[] = []
  for (const match of text.matchAll(/\b([IVXLCDM]{1,7}|\d{1,2})\s*am(?:ž|z)/giu)) {
    const token = match[1]
    const parsed = parseCenturyToken(token)
    if (parsed) {
      out.push(parsed)
    }
  }

  return out
}

function parseYearsFromText(text: string): ParsedRange | undefined {
  const years = Array.from(text.matchAll(/\b(\d{3,4})\b/g), (match) => Number(match[1])).filter(
    (year) => Number.isFinite(year),
  )

  if (years.length === 0) {
    return undefined
  }

  return normalizeRange(Math.min(...years), Math.max(...years))
}

function mergeRanges(ranges: ParsedRange[]): ParsedRange | undefined {
  if (ranges.length === 0) {
    return undefined
  }

  const start = Math.min(...ranges.map((range) => range.start))
  const end = Math.max(...ranges.map((range) => range.end))
  return normalizeRange(start, end)
}

function centuryTokenFromYear(year: number): string | undefined {
  if (!Number.isFinite(year) || year === 0) {
    return undefined
  }

  const century =
    year > 0 ? Math.floor((year - 1) / 100) + 1 : Math.floor((Math.abs(year) - 1) / 100) + 1
  if (century < 1 || century > 30) {
    return undefined
  }

  return intToRoman(century)
}

function centuriesFromRange(start?: number, end?: number): string[] {
  if (start === undefined && end === undefined) {
    return []
  }

  const normalized = normalizeRange(start ?? end!, end ?? start!)
  const first = centuryTokenFromYear(normalized.start)
  const last = centuryTokenFromYear(normalized.end)
  if (!first) {
    return []
  }

  return unique(last && last !== first ? [first, last] : [first])
}

function dateRangeLabel(start?: number, end?: number): string | undefined {
  if (start === undefined && end === undefined) {
    return undefined
  }

  const normalized = normalizeRange(start ?? end!, end ?? start!)
  return normalized.start === normalized.end
    ? `${normalized.start}`
    : `${normalized.start}–${normalized.end}`
}

function centurySummary(tokens: string[]): string | undefined {
  const uniqueTokens = unique(tokens)
  if (uniqueTokens.length === 0) {
    return undefined
  }

  if (uniqueTokens.length === 2) {
    return `${uniqueTokens[0]}–${uniqueTokens[1]}`
  }

  return uniqueTokens.join(", ")
}

function visibleLegacyLaikotarpis(value: unknown): string | undefined {
  const scalar = Array.isArray(value) ? (value.length === 1 ? value[0] : undefined) : value
  const normalized = asString(scalar)
  if (!normalized || /[;\n]/.test(normalized) || normalized.split(",").length > 1) {
    return undefined
  }
  return normalized
}

export function parseFrontmatterPeriodRange(
  frontmatter: Record<string, unknown>,
): ParsedRange | undefined {
  const strongRanges: ParsedRange[] = []

  const dateStart = parseYear(frontmatter.date_start)
  const dateEnd = parseYear(frontmatter.date_end)
  if (dateStart !== undefined || dateEnd !== undefined) {
    strongRanges.push(normalizeRange(dateStart ?? dateEnd!, dateEnd ?? dateStart!))
  }

  for (const token of asStringList(frontmatter.amziai)) {
    const parsed = parseCenturyToken(token)
    if (parsed) {
      strongRanges.push(parsed)
    }
  }

  if (strongRanges.length > 0) {
    return mergeRanges(strongRanges)
  }

  const textualRanges: ParsedRange[] = []
  const textualFields = [
    ...asStringList(frontmatter.laikotarpis),
    ...asStringList(frontmatter.datos),
    ...asStringList(frontmatter.periodo_grupes),
  ]
  for (const text of textualFields) {
    const fromYears = parseYearsFromText(text)
    if (fromYears) {
      textualRanges.push(fromYears)
    }

    textualRanges.push(...parseCenturiesFromText(text))
  }

  if (textualRanges.length > 0) {
    return mergeRanges(textualRanges)
  }

  const periodas = parsePeriodas(frontmatter.periodas)
  if (periodas) {
    return PERIODAS_RANGES[periodas]
  }

  return undefined
}

export function visiblePeriodDisplay(
  frontmatter: Record<string, unknown> | undefined,
): PeriodDisplay | undefined {
  if (!frontmatter) {
    return undefined
  }

  const chips: PeriodChip[] = []
  const summaryParts: string[] = []
  const periodas = parsePeriodas(frontmatter.periodas)
  if (periodas) {
    const label = PERIODAS_LABELS[periodas]
    chips.push({ label, kind: "periodas" })
    summaryParts.push(label)
  }

  const dateStart = parseYear(frontmatter.date_start)
  const dateEnd = parseYear(frontmatter.date_end)
  const centuryTokens = unique([
    ...(asStringList(frontmatter.amziai)
      .map((token) => normalizeCenturyToken(token))
      .filter(Boolean) as string[]),
    ...centuriesFromRange(dateStart, dateEnd),
  ])

  const centuryText = centurySummary(centuryTokens)
  if (centuryText) {
    summaryParts.push(centuryText)
  }
  for (const token of centuryTokens) {
    chips.push({
      label: token,
      slug: `laikotarpiai/${token} amžius`,
      kind: "amzius",
    })
  }

  const dateText = dateRangeLabel(dateStart, dateEnd)
  if (dateText) {
    chips.push({ label: dateText, kind: "date" })
    summaryParts.push(dateText)
  }

  if (summaryParts.length === 0) {
    const legacy = visibleLegacyLaikotarpis(frontmatter.laikotarpis)
    if (legacy) {
      chips.push({ label: legacy, kind: "laikotarpis" })
      summaryParts.push(legacy)
    }
  }

  if (summaryParts.length === 0) {
    return undefined
  }

  return {
    label: unique(summaryParts).join(" · "),
    chips,
  }
}

export function isPeriodFilterTargetType(tipas: unknown): boolean {
  const normalized = asString(tipas).toLowerCase()
  return [
    "asmuo",
    "autorius",
    "saltinis",
    "šaltinis",
    "ivykis",
    "įvykis",
    "daiktas",
    "paprotys",
    "posakis",
    "zodyno_irasas",
    "žodyno_įrašas",
    "vieta",
    "grupe",
    "grupė",
  ].includes(normalized)
}
