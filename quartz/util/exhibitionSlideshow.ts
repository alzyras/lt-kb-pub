export const EXHIBITION_SLIDESHOW_LANGUAGES = [
  "lt",
  "en",
  "pl",
  "lv",
  "et",
  "be",
  "ru",
  "uk",
  "de",
  "yi",
  "he",
] as const

export type ExhibitionSlideshowLanguage = (typeof EXHIBITION_SLIDESHOW_LANGUAGES)[number]

export type ExhibitionSlideshowItem = {
  mediaId: string
  titleLt: string
  descriptionLt: string
  dateDisplay: string
  sectionTitle: string
  sectionSlug: string
  featured: boolean
}

export type ExhibitionSlideshowLabels = {
  play: string
  pause: string
  fullscreen: string
  exitFullscreen: string
  close: string
  previous: string
  next: string
  progress: string
  exhibit: string
}

const LABELS: Record<ExhibitionSlideshowLanguage, ExhibitionSlideshowLabels> = {
  lt: {
    play: "Paleisti",
    pause: "Pauzė",
    fullscreen: "Visas ekranas",
    exitFullscreen: "Išeiti iš viso ekrano",
    close: "Uždaryti",
    previous: "Ankstesnis vaizdas",
    next: "Kitas vaizdas",
    progress: "Parodos eiga",
    exhibit: "Parodos eksponatas",
  },
  en: {
    play: "Play",
    pause: "Pause",
    fullscreen: "Full screen",
    exitFullscreen: "Exit full screen",
    close: "Close",
    previous: "Previous image",
    next: "Next image",
    progress: "Exhibition progress",
    exhibit: "Exhibition object",
  },
  pl: {
    play: "Odtwórz",
    pause: "Pauza",
    fullscreen: "Pełny ekran",
    exitFullscreen: "Wyjdź z pełnego ekranu",
    close: "Zamknij",
    previous: "Poprzedni obraz",
    next: "Następny obraz",
    progress: "Postęp wystawy",
    exhibit: "Eksponat wystawy",
  },
  lv: {
    play: "Atskaņot",
    pause: "Pauze",
    fullscreen: "Pilnekrāns",
    exitFullscreen: "Iziet no pilnekrāna",
    close: "Aizvērt",
    previous: "Iepriekšējais attēls",
    next: "Nākamais attēls",
    progress: "Izstādes norise",
    exhibit: "Izstādes eksponāts",
  },
  et: {
    play: "Esita",
    pause: "Paus",
    fullscreen: "Täisekraan",
    exitFullscreen: "Välju täisekraanilt",
    close: "Sulge",
    previous: "Eelmine pilt",
    next: "Järgmine pilt",
    progress: "Näituse edenemine",
    exhibit: "Näituse eksponaat",
  },
  be: {
    play: "Прайграць",
    pause: "Паўза",
    fullscreen: "На ўвесь экран",
    exitFullscreen: "Выйсці з поўнаэкраннага рэжыму",
    close: "Закрыць",
    previous: "Папярэдняя выява",
    next: "Наступная выява",
    progress: "Ход выставы",
    exhibit: "Экспанат выставы",
  },
  ru: {
    play: "Воспроизвести",
    pause: "Пауза",
    fullscreen: "Полный экран",
    exitFullscreen: "Выйти из полноэкранного режима",
    close: "Закрыть",
    previous: "Предыдущее изображение",
    next: "Следующее изображение",
    progress: "Ход выставки",
    exhibit: "Экспонат выставки",
  },
  uk: {
    play: "Відтворити",
    pause: "Пауза",
    fullscreen: "На весь екран",
    exitFullscreen: "Вийти з повноекранного режиму",
    close: "Закрити",
    previous: "Попереднє зображення",
    next: "Наступне зображення",
    progress: "Перебіг виставки",
    exhibit: "Експонат виставки",
  },
  de: {
    play: "Abspielen",
    pause: "Pause",
    fullscreen: "Vollbild",
    exitFullscreen: "Vollbild verlassen",
    close: "Schließen",
    previous: "Vorheriges Bild",
    next: "Nächstes Bild",
    progress: "Ausstellungsfortschritt",
    exhibit: "Ausstellungsobjekt",
  },
  yi: {
    play: "שפּילן",
    pause: "פּויזע",
    fullscreen: "פֿולער עקראַן",
    exitFullscreen: "אַרויסגיין פֿונעם פולן עקראַן",
    close: "פֿאַרמאַכן",
    previous: "פֿריִערדיק בילד",
    next: "נעקסטן בילד",
    progress: "אויסשטעלונג־פֿאָרשריט",
    exhibit: "אויסשטעלונג־אָביעקט",
  },
  he: {
    play: "הפעלה",
    pause: "השהיה",
    fullscreen: "מסך מלא",
    exitFullscreen: "יציאה ממסך מלא",
    close: "סגירה",
    previous: "התמונה הקודמת",
    next: "התמונה הבאה",
    progress: "התקדמות בתערוכה",
    exhibit: "פריט בתערוכה",
  },
}

export function exhibitionSlideshowLanguage(
  value: string | undefined | null,
): ExhibitionSlideshowLanguage {
  const language = (value || "lt").toLowerCase().split(/[-_]/, 1)[0]
  return (EXHIBITION_SLIDESHOW_LANGUAGES as readonly string[]).includes(language)
    ? (language as ExhibitionSlideshowLanguage)
    : "lt"
}

export function exhibitionSlideshowLabels(
  value: string | undefined | null,
): ExhibitionSlideshowLabels {
  return LABELS[exhibitionSlideshowLanguage(value)]
}

export function exhibitionSlideshowIsRtl(value: string | undefined | null): boolean {
  return ["he", "yi"].includes(exhibitionSlideshowLanguage(value))
}

export function exhibitionSlideshowSequence<T extends ExhibitionSlideshowItem>(items: T[]): T[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (!item.featured || !item.mediaId || seen.has(item.mediaId)) return false
    seen.add(item.mediaId)
    return true
  })
}

export function exhibitionSlideshowDurationMs(description: string): number {
  const words = description.trim() ? description.trim().split(/\s+/u).length : 0
  return Math.min(22_000, Math.max(10_000, 8_000 + words * 180))
}

export function exhibitionSlideshowNextIndex(index: number, length: number, step = 1): number {
  if (length <= 0) return -1
  return (((index + step) % length) + length) % length
}
