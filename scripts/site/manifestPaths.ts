export type NormalizedPathIndex = {
  paths: Map<string, string>
  collisions: Array<{ key: string; paths: string[] }>
}

/** Compare exported relative paths consistently on macOS and Linux. */
export function indexNormalizedPaths(paths: Iterable<string>): NormalizedPathIndex {
  const indexed = new Map<string, string>()
  const collisions = new Map<string, string[]>()
  for (const relativePath of paths) {
    const key = relativePath.normalize("NFC")
    const previous = indexed.get(key)
    if (previous === undefined) {
      indexed.set(key, relativePath)
    } else if (previous !== relativePath) {
      const pathsForKey = collisions.get(key) ?? [previous]
      if (!pathsForKey.includes(relativePath)) pathsForKey.push(relativePath)
      collisions.set(key, pathsForKey)
    }
  }
  return {
    paths: indexed,
    collisions: [...collisions.entries()].map(([key, pathsForKey]) => ({
      key,
      paths: pathsForKey,
    })),
  }
}
