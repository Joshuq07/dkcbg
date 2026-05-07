// src/lib/dkcbg/logic.ts

import {
  materialList,
  levelNames,
  bonusDifficulties,
  starValue,
  totalLevels
} from "./data"

// -----------------------------
// Types
// -----------------------------
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

// -----------------------------
// Compute Inventory From Session Entries
// -----------------------------
export function computeInventory(entries: Entry[]): InventoryResult {
  const materials: string[] = []
  let bonusCoins = 0
  let money = 0

  for (const e of entries) {
    if (e.box_type !== "material") continue
    if (e.lost) continue

    // Material
    materials.push(e.value)

    // Bonus coins (Python logic: levels 82–87, 137–142)
    if (e.value === "BonusCoin") {
      bonusCoins += 1
    }

    // Money (placeholder — depends on your session rules)
    if (e.value === "Money") {
      money += 1
    }
  }

  return { materials, bonusCoins, money }
}

// -----------------------------
// Compute Which Levels Are Already Built
// -----------------------------
export function computeBuiltLevels(entries: Entry[]): number[] {
  const built = new Set<number>()

  for (const e of entries) {
    if (e.box_type === "number" && !e.lost) {
      built.add(Number(e.level))
    }
  }

  return Array.from(built)
}

// -----------------------------
// Compute Which Levels Are Still Available
// -----------------------------
export function computeRemainingLevels(entries: Entry[]): number[] {
  const built = computeBuiltLevels(entries)
  return totalLevels.filter(lvl => !built.includes(lvl))
}

// -----------------------------
// Check if a Level is Buildable
// -----------------------------
export function canBuildLevel(
  levelId: number,
  inventory: InventoryResult
): boolean {
  const requiredMaterials = materialList[levelId - 1]
  const { materials, bonusCoins } = inventory

  // Check material requirements
  for (const req of requiredMaterials) {
    if (!materials.includes(req)) {
      return false
    }
  }

  // Special boss rule (Python logic)
  if (levelId === 39 || levelId === 136) {
    const bossCount = materials.filter(m => m === "Boss").length
    if (bossCount <= 1) return false
  }

  // Bonus coin rule (Python logic)
  if (
    [82, 83, 84, 85, 86, 87, 137, 138, 139, 140, 141, 142].includes(levelId)
  ) {
    if (bonusCoins <= 1) return false
  }

  return true
}

// -----------------------------
// Compute All Buildable Levels
// -----------------------------
export function computeBuildableLevels(
  entries: Entry[],
  inventory: InventoryResult
): number[] {
  const remaining = computeRemainingLevels(entries)
  return remaining.filter(levelId => canBuildLevel(levelId, inventory))
}

// -----------------------------
// Compute Missing Materials For a Level
// -----------------------------
export function computeMissingMaterials(
  levelId: number,
  inventory: InventoryResult
): string[] {
  const required = materialList[levelId - 1]
  return required.filter(req => !inventory.materials.includes(req))
}

// -----------------------------
// Compute Closest Levels (Fewest Missing Materials)
// -----------------------------
export function computeClosestLevels(
  entries: Entry[],
  inventory: InventoryResult
): { levelId: number; missing: string[] }[] {
  const remaining = computeRemainingLevels(entries)

  const scored = remaining.map(levelId => {
    const missing = computeMissingMaterials(levelId, inventory)
    return { levelId, missing }
  })

  // Sort by fewest missing materials
  scored.sort((a, b) => a.missing.length - b.missing.length)

  return scored
}

// -----------------------------
// Compute Stats (Completion %, Difficulty, Stars, etc.)
// -----------------------------
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
