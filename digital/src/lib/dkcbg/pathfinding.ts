import { CONNECTIONS, FULL_SPACE_GUIDE, materialList } from '@/lib/dkcbg/data'

export function findAllPaths(startSpace: number, endSpace: number, maxDepth = 300): number[][] {
  const results: number[][] = []
  const visited = new Set<number>()

  function dfs(current: number, path: number[]) {
    if (path.length > maxDepth) return
    if (current === endSpace) {
      results.push([...path])
      return
    }
    const neighbors = CONNECTIONS[current] ?? []
    for (const next of neighbors) {
      if (!visited.has(next)) {
        visited.add(next)
        path.push(next)
        dfs(next, path)
        path.pop()
        visited.delete(next)
      }
    }
  }

  visited.add(startSpace)
  dfs(startSpace, [startSpace])
  return results
}

export function getMaterialsOnPath(path: number[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const spaceIdx of path) {
    const entries = FULL_SPACE_GUIDE[spaceIdx - 1]
    if (!entries || entries[0] !== 'M') continue
    for (const mat of entries.slice(1)) {
      counts[mat] = (counts[mat] || 0) + 1
    }
  }
  return counts
}

export function scorePath(
  path: number[],
  neededWeights: Record<string, number>
): number {
  const onPath = getMaterialsOnPath(path)
  let score = 0
  for (const [mat, weight] of Object.entries(neededWeights)) {
    if (onPath[mat]) {
      score += onPath[mat] * weight
    }
  }
  return score / path.length
}

export function buildNeededWeights(
  remainingLevels: number[],
  scrapbooked: string[]
): Record<string, number> {
  const weights: Record<string, number> = {}

  for (const lvl of remainingLevels) {
    const mats = materialList[lvl - 1] || []
    for (const m of mats) {
      weights[m] = (weights[m] || 0) + 1
    }
  }

  const allMaterials = Object.keys(weights)
  for (const m of allMaterials) {
    if (!scrapbooked.includes(m)) {
      weights[m] = (weights[m] || 0) + 1
    }
  }

  return weights
}

export function findBestPath(
  startSpace: number,
  endSpace: number,
  neededWeights: Record<string, number>,
  remainingLevels: number[]
): {
  path: number[]
  score: number
  materialsOnPath: Record<string, number>
  coveredLevels: { levelId: number; materialsFound: string[] }[]
} | null {
  const paths = findAllPaths(startSpace, endSpace)
  if (paths.length === 0) return null

  let bestPath = paths[0]
  let bestScore = scorePath(paths[0], neededWeights)

  for (const path of paths.slice(1)) {
    const s = scorePath(path, neededWeights)
    if (s > bestScore) {
      bestScore = s
      bestPath = path
    }
  }

  const materialsOnPath = getMaterialsOnPath(bestPath)

  const coveredLevels: { levelId: number; materialsFound: string[] }[] = []
  for (const lvl of remainingLevels) {
    const mats = materialList[lvl - 1] || []
    const found = mats.filter(m => materialsOnPath[m])
    if (found.length > 0) {
      coveredLevels.push({ levelId: lvl, materialsFound: found })
    }
  }

  coveredLevels.sort((a, b) => b.materialsFound.length - a.materialsFound.length)

  return { path: bestPath, score: bestScore, materialsOnPath, coveredLevels }
}

export function getPathSplits(path: number[]): number[] {
  return path.filter(space => (CONNECTIONS[space] ?? []).length > 1)
}

export function findPathsThroughWaypoints(
  startSpace: number,
  endSpace: number,
  waypoints: number[]
): number[][] {
  const allPaths = findAllPaths(startSpace, endSpace)

  return allPaths.filter(path => {
    let waypointIdx = 0
    for (const space of path) {
      if (waypointIdx < waypoints.length && space === waypoints[waypointIdx]) {
        waypointIdx++
      }
    }
    return waypointIdx === waypoints.length
  })
}