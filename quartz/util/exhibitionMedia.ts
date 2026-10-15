import type { MediaEntry } from "./objectMedia"

export function resolveExhibitionNavigationMedia(
  navMediaId: string,
  items: readonly { media?: MediaEntry }[],
  mediaById: ReadonlyMap<string, MediaEntry>,
): MediaEntry | undefined {
  return (
    mediaById.get(navMediaId) ?? items.find((item) => item.media?.mediaId === navMediaId)?.media
  )
}
