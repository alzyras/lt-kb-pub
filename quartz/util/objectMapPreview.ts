/**
 * The object preview is an overview of the complete public neighbourhood.
 * It deliberately has no arbitrary node budget: dense objects retain every
 * distinct public neighbour, just as sparse ones do.
 */
export function objectMapPreviewNeighbours<T>(neighbours: readonly T[]): T[] {
  return [...neighbours]
}
