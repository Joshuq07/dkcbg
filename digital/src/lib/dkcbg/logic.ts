import {
  materialList,
  levelNames,
  bonusDifficulties,
  starValue,
  totalLevels
} from "./data"

export interface Entry {
  level: number
  box_type: string
  value: string
  lost: boolean
  user_email: string
}

export interface InventoryResult {
  materials: string[]
  bonusCoins: number
  money: number
}

export function computeInventory(entries: Entry[]): InventoryResult {
  const materials: string[] = []
  let bonusCoins = 0
  let money = 0

  for (const e of entries) {
    if (e.box_type !== "material") continue
    if (e.lost) continue

    // Material
    materials.push(e.value)

    if (e.value === "BonusCoin") {
      bonusCoins += 1
    }

    if (e.value === "Money") {
      money += 1
    }
  }

  return { materials, bonusCoins, money }
}

export function computeBuiltLevels(entries: Entry[]): number[] {
  const built = new Set<number>()

  for (const e of entries) {
    if (e.box_type === "number" && !e.lost) {
      built.add(Number(e.level))
    }
  }

  return Array.from(built)
}

export function computeRemainingLevels(entries: Entry[]): number[] {
  const built = computeBuiltLevels(entries)
  return totalLevels.filter(lvl => !built.includes(lvl))
}
export function canBuildLevel(
  levelId: number,
  inventory: InventoryResult
): boolean {
  const requiredMaterials = materialList[levelId - 1]
  const { materials, bonusCoins } = inventory

  for (const req of requiredMaterials) {
    if (!materials.includes(req)) {
      return false
    }
  }


  if (levelId === 39 || levelId === 136) {
    const bossCount = materials.filter(m => m === "Boss").length
    if (bossCount <= 1) return false
  }


  if (
    [82, 83, 84, 85, 86, 87, 137, 138, 139, 140, 141, 142].includes(levelId)
  ) {
    if (bonusCoins <= 1) return false
  }

  return true
}


export function computeBuildableLevels(
  entries: Entry[],
  inventory: InventoryResult
): number[] {
  const remaining = computeRemainingLevels(entries)
  return remaining.filter(levelId => canBuildLevel(levelId, inventory))
}


export function computeMissingMaterials(
  levelId: number,
  inventory: InventoryResult
): string[] {
  const required = materialList[levelId - 1]
  return required.filter(req => !inventory.materials.includes(req))
}


export function computeClosestLevels(
  entries: Entry[],
  inventory: InventoryResult
): { levelId: number; missing: string[] }[] {
  const remaining = computeRemainingLevels(entries)

  const scored = remaining.map(levelId => {
    const missing = computeMissingMaterials(levelId, inventory)
    return { levelId, missing }
  })

  scored.sort((a, b) => a.missing.length - b.missing.length)

  return scored
}


export function computeStats(entries: Entry[]) {
  const built = computeBuiltLevels(entries)
  const remaining = totalLevels.length - built.length

  const totalDifficulty = built.reduce(
    (sum, lvl) => sum + bonusDifficulties[lvl - 1],
    0
  )

  const totalStars = built.reduce(
    (sum, lvl) => sum + starValue[lvl - 1],
    0
  )

  return {
    builtCount: built.length,
    remainingCount: remaining,
    completionPercent: (built.length / totalLevels.length) * 100,
    totalDifficulty,
    totalStars
  }
}
