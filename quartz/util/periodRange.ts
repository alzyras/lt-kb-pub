type ParsedRange = {
  start: number
  end: number
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

function clampYear(year: number): number {
  return Math.min(PERIOD_MAX_YEAR, Math.max(PERIOD_MIN_YEAR, year))
}

function normalizeRange(start: number, end: number): ParsedRange {
  const normalizedStart = clampYear(Math.min(start, end))
  const normalizedEnd = clampYear(Math.max(start, end))
  return { start: normalizedStart, end: normalizedEnd }
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

function centuryToRange(century: number): ParsedRange | undefined {
  if (!Number.isFinite(century) || century < 1 || century > 30) {
    return undefined
  }

  const start = (century - 1) * 100 + 1
  const end = century * 100
  return normalizeRange(start, end)
}

function parseCenturyToken(token: string): ParsedRange | undefined {
  const cleaned = token
    .trim()
    .toUpperCase()
    .replace(/[.\s]+/g, "")
  if (!cleaned) {
    return undefined
  }

  if (/^\d{1,2}$/.test(cleaned)) {
    return centuryToRange(Number(cleaned))
  }

  const roman = romanToInt(cleaned)
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

export function parseFrontmatterPeriodRange(
  frontmatter: Record<string, unknown>,
): ParsedRange | undefined {
  const ranges: ParsedRange[] = []

  const dateStart = parseYear(frontmatter.date_start)
  const dateEnd = parseYear(frontmatter.date_end)
  if (dateStart !== undefined || dateEnd !== undefined) {
    ranges.push(normalizeRange(dateStart ?? dateEnd!, dateEnd ?? dateStart!))
  }

  for (const token of asStringList(frontmatter.amziai)) {
    const parsed = parseCenturyToken(token)
    if (parsed) {
      ranges.push(parsed)
    }
  }

  const textualFields = [
    ...asStringList(frontmatter.laikotarpis),
    ...asStringList(frontmatter.datos),
    ...asStringList(frontmatter.periodo_grupes),
  ]
  for (const text of textualFields) {
    const fromYears = parseYearsFromText(text)
    if (fromYears) {
      ranges.push(fromYears)
    }

    ranges.push(...parseCenturiesFromText(text))
  }

  const periodas = asString(frontmatter.periodas).toLowerCase()
  if (periodas && PERIODAS_RANGES[periodas]) {
    ranges.push(PERIODAS_RANGES[periodas])
  }

  return mergeRanges(ranges)
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
