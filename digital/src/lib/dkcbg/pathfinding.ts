import { CONNECTIONS, FULL_SPACE_GUIDE, materialList } from '@/lib/dkcbg/data'

// ---------------------------------------------------------------------------
// PBR (Path Branch Rarity) — probability of visiting each space on a random
// traversal, expressed as an integer 0-100.
// Computed by propagating probability through the DAG (back-edges and the
// destination-only spaces 2-6 are excluded from flow).
// ---------------------------------------------------------------------------
export const SPACE_PBR: Record<number, number> = {"1":100,"2":0,"3":0,"4":0,"5":0,"6":0,"7":100,"8":100,"9":100,"10":33,"11":33,"12":33,"13":17,"14":17,"15":17,"16":17,"17":17,"18":17,"19":17,"20":17,"21":17,"22":17,"23":17,"24":17,"25":17,"26":17,"27":17,"28":17,"29":17,"30":17,"31":17,"32":17,"33":17,"34":17,"35":17,"36":17,"37":17,"38":17,"39":17,"40":17,"41":17,"42":17,"43":17,"44":17,"45":17,"46":17,"47":17,"48":17,"49":17,"50":17,"51":17,"52":33,"53":33,"54":33,"55":33,"56":33,"57":33,"58":33,"59":33,"60":33,"61":11,"62":11,"63":11,"64":11,"65":11,"66":11,"67":11,"68":11,"69":11,"70":11,"71":11,"72":36,"73":36,"74":36,"75":36,"76":36,"77":36,"78":36,"79":36,"80":36,"81":42,"82":42,"83":42,"84":42,"85":42,"86":42,"87":42,"88":42,"89":42,"90":42,"91":42,"92":42,"93":21,"94":21,"95":21,"96":21,"97":21,"98":21,"99":21,"100":21,"101":26,"102":26,"103":26,"104":26,"105":26,"106":26,"107":26,"108":26,"109":26,"110":26,"111":26,"112":26,"113":26,"114":26,"115":26,"116":26,"117":26,"118":26,"119":26,"120":26,"121":33,"122":33,"123":33,"124":33,"125":17,"126":17,"127":17,"128":17,"129":17,"130":17,"131":17,"132":17,"133":17,"134":17,"135":17,"136":17,"137":17,"138":8,"139":8,"140":25,"141":25,"142":25,"143":25,"144":25,"145":25,"146":25,"147":25,"148":25,"149":25,"150":25,"151":25,"152":25,"153":25,"154":25,"155":25,"156":11,"157":11,"158":11,"159":11,"160":11,"161":11,"162":11,"163":11,"164":11,"165":11,"166":11,"167":11,"168":11,"169":11,"170":47,"171":47,"172":47,"173":47,"174":47,"175":47,"176":26,"177":26,"178":26,"179":26,"180":26,"181":26,"182":26,"183":26,"184":26,"185":26,"186":26,"187":26,"188":26,"189":26,"190":26,"191":26,"192":26,"193":26,"194":26,"195":26,"196":16,"197":16,"198":16,"199":16,"200":16,"201":16,"202":16,"203":16,"204":16,"205":16,"206":16,"207":16,"208":16,"209":16,"210":16,"211":16,"212":16,"213":16,"214":16,"215":16,"216":16,"217":16,"218":16,"219":16,"220":16,"221":16,"222":16,"223":16,"224":16,"225":16,"226":16,"227":16,"228":16,"229":16,"230":16,"231":16,"232":16,"233":79,"234":79,"235":79,"236":100,"237":100,"238":42,"239":42,"240":42,"241":42,"242":42,"243":42,"244":42,"245":42,"246":42,"247":42,"248":42,"249":42,"250":42,"251":42,"252":42,"253":42,"254":42,"255":33,"256":33,"257":33,"258":33,"259":33,"260":33,"261":33,"262":33,"263":33,"264":33,"265":33,"266":33,"267":33,"268":33,"269":33,"270":33,"271":33,"272":17,"273":17,"274":17,"275":8,"276":8,"277":8,"278":8,"279":8,"280":8,"281":8,"282":8,"283":8,"284":8,"285":8,"286":8,"287":8,"288":8,"289":53,"290":53,"291":53,"292":53,"293":53,"294":53,"295":53,"296":53,"297":53,"298":53,"299":53,"300":53,"301":53,"302":53,"303":53,"304":53,"305":53,"306":21,"307":21,"308":21,"309":21,"310":21,"311":21,"312":21,"313":21,"314":21,"315":21,"316":21,"317":21,"318":21,"319":21,"320":21,"321":21,"322":21,"323":11,"324":11,"325":11,"326":11,"327":11,"328":11,"329":11,"330":11,"331":11,"332":11,"333":11,"334":11,"335":11,"336":11,"337":11,"338":11,"339":19,"340":16,"341":16,"342":16,"343":16,"344":16,"345":16,"346":16,"347":16,"348":31,"349":16,"350":16,"351":16,"352":16,"353":16,"354":16,"355":16,"356":16,"357":16,"358":16,"359":16,"360":16,"361":16,"362":16,"363":16,"364":58,"365":58,"366":58,"367":58,"368":58,"369":58,"370":58,"371":58,"372":79,"373":79,"374":79,"375":79,"376":79,"377":39,"378":39,"379":39,"380":39,"381":39,"382":39,"383":39,"384":39,"385":39,"386":39,"387":39,"388":39,"389":39,"390":39,"391":39,"392":39,"393":39,"394":39,"395":39,"396":39,"397":39,"398":39,"399":39,"400":39,"401":39,"402":39,"403":39,"404":39,"405":39,"406":39,"407":39,"408":39,"409":39,"410":39,"411":39,"412":39}

// ---------------------------------------------------------------------------
// Material PBR — average PBR of all material spaces that carry each material.
// A low value means the material is only reachable on rare branches.
// ---------------------------------------------------------------------------
export const MATERIAL_PBR: Record<string, number> = (() => {
  const totals: Record<string, number> = {}
  const counts: Record<string, number> = {}
  for (let i = 0; i < FULL_SPACE_GUIDE.length; i++) {
    const entries = FULL_SPACE_GUIDE[i]
    if (!entries || entries[0] !== 'M') continue
    const pbr = SPACE_PBR[i + 1] ?? 0
    for (const mat of entries.slice(1)) {
      totals[mat] = (totals[mat] ?? 0) + pbr
      counts[mat] = (counts[mat] ?? 0) + 1
    }
  }
  const result: Record<string, number> = {}
  for (const mat of Object.keys(totals)) {
    result[mat] = Math.round(totals[mat] / counts[mat])
  }
  return result
})()

// ---------------------------------------------------------------------------
// Path-finding
// ---------------------------------------------------------------------------
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

// How much rarity amplifies the score for a needed material.
// 0 = ignore rarity entirely, 1 = full inverse-PBR weighting.
const PBR_WEIGHT = 0.5

// Score = sum over needed materials of (count_on_path * need_weight * rarity_mult)
// divided by path length. Rare materials (low avg PBR) earn a higher rarity_mult.
export function scorePath(
  path: number[],
  neededWeights: Record<string, number>
): number {
  const onPath = getMaterialsOnPath(path)
  let score = 0
  for (const [mat, weight] of Object.entries(neededWeights)) {
    if (!onPath[mat]) continue
    const avgPbr = MATERIAL_PBR[mat] ?? 100
    const rarityMult = 1 + PBR_WEIGHT * (1 - avgPbr / 100)
    score += onPath[mat] * weight * rarityMult
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

  for (const m of Object.keys(weights)) {
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