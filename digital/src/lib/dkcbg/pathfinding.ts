import { CONNECTIONS, FULL_SPACE_GUIDE, materialList } from '@/lib/dkcbg/data'

// Find all paths from startSpace to endSpace using DFS
// Returns array of paths, each path is array of space indices
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

// Get all materials from a path's material spaces
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

// Score a path against needed materials
// neededWeights: material -> how many times it's needed (higher = more valuable)
export function scorePath(
  path: number[],
  neededWeights: Record<string, number>
): number {
  const onPath = getMaterialsOnPath(path)
  let score = 0
  for (const [mat, weight] of Object.entries(neededWeights)) {
    if (onPath[mat]) {
      score += Math.min(onPath[mat], weight) * weight
    }
  }
  return score
}

// Build needed weights from remaining levels + unscrapbooked materials
export function buildNeededWeights(
  remainingLevels: number[],
  scrapbooked: string[]
): Record<string, number> {
  const weights: Record<string, number> = {}

  // Count how many remaining levels need each material
  for (const lvl of remainingLevels) {
    const mats = materialList[lvl - 1] || []
    for (const m of mats) {
      weights[m] = (weights[m] || 0) + 1
    }
  }

  // Add 1 for each unscrapbooked material
  const allMaterials = Object.keys(weights)
  for (const m of allMaterials) {
    if (!scrapbooked.includes(m)) {
      weights[m] = (weights[m] || 0) + 1
    }
  }

  return weights
}

// Find the best path and return it with stats
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

  // Find which remaining levels are covered by materials on path
  const coveredLevels: { levelId: number; materialsFound: string[] }[] = []
  for (const lvl of remainingLevels) {
    const mats = materialList[lvl - 1] || []
    const found = mats.filter(m => materialsOnPath[m])
    if (found.length > 0) {
      coveredLevels.push({ levelId: lvl, materialsFound: found })
    }
  }

  // Sort by most materials found first
  coveredLevels.sort((a, b) => b.materialsFound.length - a.materialsFound.length)

  return { path: bestPath, score: bestScore, materialsOnPath, coveredLevels }
}

// Get path splits — spaces where CONNECTIONS has multiple exits
export function getPathSplits(path: number[]): number[] {
  return path.filter(space => (CONNECTIONS[space] ?? []).length > 1)
}

// Check if a set of waypoints uniquely determines a path
export function findPathsThroughWaypoints(
  startSpace: number,
  endSpace: number,
  waypoints: number[]
): number[][] {
  // Find all paths from start to end, filter those passing through all waypoints in order
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