'use client'

import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'

import { useAuth } from '@/lib/useAuth'
import { useSessionData } from '@/hooks/useSessionData'
import {
  computeInventory,
  computeBuildableLevels,
  computeClosestLevels,
  computeStats,
  computeRemainingLevels
} from '@/lib/dkcbg/logic'

import {
  levelNames,
  animalList,
  resourceList,
  environmentList,
  materialList,
  starValue,
getLevelCode
} from '@/lib/dkcbg/data'

const ALL_MATERIALS = [
  
  
  ...environmentList,
...resourceList,
...animalList
]

const BONUS_COIN_COST_LEVELS = new Set([
  82, 83, 84, 85, 86, 87,
  137, 138, 139, 140, 141, 142
])

const BONUS_COIN_REWARD: Record<number, number> = {
  6: 1,
  12: 1,
  19: 1,
  26: 1,
  33: 1,
  39: 2,   
  40: 1,
  46: 1,
  52: 1,
  59: 1,
  66: 1,
  72: 1,
  79: 1,
  81: 1,
  93: 1,
  99: 1,
  105: 1,
  111: 1,
  117: 1,
  124: 1,
  130: 1,
  136: 2    
}

const BONUS_COIN_COST = 2

function createEmptyInventory() {
  const base = {}
  for (const m of ALL_MATERIALS) base[m] = 0
  return base
}

function StatCard({ label, value }) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}

function modeButton(mode, current, set) {
  const active = mode === current

  return (
    <button
      onClick={() => set(mode)}
      className={`px-3 py-1 rounded border ${
        active
          ? 'bg-blue-600 text-white border-blue-700'
          : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      {mode[0].toUpperCase() + mode.slice(1)}
    </button>
  )
}

function MaterialEditor({
  counts,
  displayedMaterials,
  onIncrement,
  onDecrement
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-2">
        Materials <span className="text-gray-500 font-normal">({Object.values(counts).reduce((a, b) => a + b, 0)})</span>
      </h2>

      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1">
        {displayedMaterials.map(item => {
  const name = typeof item === "string" ? item : item.name
  const missing = typeof item === "string" ? 0 : item.missing

  const count = counts[name] ?? 0

  return (
    <div
      key={name}
      className={`relative p-2 border rounded-lg shadow-sm flex flex-col items-center bg-white ${
        count === 0 ? 'opacity-40' : 'opacity-100'
      }`}
    >
      <Image
        src={`/materials/${name}.png`}
        alt={name}
        width={64}
        height={64}
      />

      <span className="text-xs mt-1">{name}</span>

      <div className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 rounded">
        {count}
      </div>

      {missing > 0 && (
        <div className="absolute bottom-1 left-1 bg-red-600 text-white text-xs px-1 rounded">
          ×{missing}
        </div>
      )}

      <button
        onClick={() => onIncrement(name)}
        className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded hover:bg-green-600"
      >
        +
      </button>

      <button
        onClick={() => onDecrement(name)}
        className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 rounded hover:bg-red-600"
      >
        –
      </button>
    </div>
  )
})}

      </div>
    </section>
  )
}





function Stars({ value }) {
  return <span className="text-yellow-500">{'★'.repeat(value)}</span>
}

export default function LevelBuilderPage({ params }) {
  const { id: sessionId } = params
  const { user } = useAuth()
  const { session, userEntries } = useSessionData(sessionId, user?.email)

  const [materialCounts, setMaterialCounts] = useState(() =>
  createEmptyInventory()
)

const [viewMode, setViewMode] = useState('default')
const [hydrated, setHydrated] = useState(false)
const [materialSortMode, setMaterialSortMode] = useState("grouped") 
const [closestLimit, setClosestLimit] = useState(10)
const [showZeroMaterials, setShowZeroMaterials] = useState(false)
const [matProgressTab, setMatProgressTab] = useState<'all' | 'environments' | 'resources' | 'animals'>('all')
const [matProgressAsc, setMatProgressAsc] = useState(true)
const [includeInventory, setIncludeInventory] = useState(true)

useEffect(() => {
  if (!user || !sessionId) return
  if (hydrated) return

  async function init() {
    const res = await fetch(`/api/materials/${sessionId}`, {
      headers: {
        'x-user-id': user.email
      }
    })

    const json = await res.json()
    const saved = json?.material_counts || {}

    const base = createEmptyInventory()

    if (userEntries) {
      const inv = computeInventory(userEntries)

      for (const m of inv.materials) {
        if (base[m] !== undefined) base[m]++
      }
    }

    setMaterialCounts({
      ...base,
      ...saved
    })

    setHydrated(true)
  }

  init()
}, [user, sessionId, hydrated])

useEffect(() => {
  if (!user || !sessionId || !hydrated) return

  const timeout = setTimeout(() => {
    fetch(`/api/materials/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        material_counts: materialCounts,
        user_id: user.email
      })
    })
  }, 300)

  return () => clearTimeout(timeout)
}, [materialCounts, sessionId, user, hydrated])

const remainingLevels = useMemo(() => {
  return computeRemainingLevels(userEntries || [])
}, [userEntries])

const missingCounts = useMemo(() => {
  const requiredTotals: Record<string, number> = {}
  for (const lvl of remainingLevels || []) {
    const mats = materialList[lvl - 1] || []
    for (const m of mats) {
      requiredTotals[m] = (requiredTotals[m] || 0) + 1
    }
  }
  const counts: Record<string, number> = {}
  for (const mat of ALL_MATERIALS) {
    counts[mat] = Math.max(0, (requiredTotals[mat] || 0) - (materialCounts[mat] || 0))
  }
  return counts
}, [remainingLevels, materialCounts])

const stats = useMemo(() => {
  const base = computeStats(userEntries || [])

  const builtLevels = new Set(
    (userEntries || [])
      .filter(e => e.box_type === "number" && e.value)
      .map(e => e.level)
  )

  let earned = 0
  for (const lvl of builtLevels) {
    if (BONUS_COIN_REWARD[lvl]) {
      earned += BONUS_COIN_REWARD[lvl]
    }
  }

  let spent = 0
  for (const lvl of builtLevels) {
    if (BONUS_COIN_COST_LEVELS.has(lvl)) {
      spent += 2
    }
  }

  const bonusCoins = earned - spent

const totalMaterials = ALL_MATERIALS.length

const materialsCompleted = ALL_MATERIALS.filter(
  m => (missingCounts[m] || 0) === 0
).length

const materialCompletionPercent =
  (materialsCompleted / totalMaterials) * 100

  const starBrackets = [1, 2, 3, 4, 5]
  const sizeBrackets = [1, 2, 3, 4, 5]

  const totalStarCounts = {}
  const unbuiltStarCounts = {}

  const totalSizeCounts = {}
  const unbuiltSizeCounts = {}

  const totalLevels = materialList.length

  for (let level = 1; level <= totalLevels; level++) {
    const star = starValue[level - 1]
    const size = materialList[level - 1]?.length || 0

    // Count totals
    totalStarCounts[star] = (totalStarCounts[star] || 0) + 1
    totalSizeCounts[size] = (totalSizeCounts[size] || 0) + 1

    // Count unbuilt
    if (!builtLevels.has(level)) {
      unbuiltStarCounts[star] = (unbuiltStarCounts[star] || 0) + 1
      unbuiltSizeCounts[size] = (unbuiltSizeCounts[size] || 0) + 1
    }
  }

  return {
    ...base,
    bonusCoins,
    starProgress: {
      total: totalStarCounts,
      unbuilt: unbuiltStarCounts
    },
    sizeProgress: {
      total: totalSizeCounts,
      unbuilt: unbuiltSizeCounts
    }
  }
}, [userEntries])

const buildable = useMemo(() => {
  const builtLevels = new Set(
  (userEntries || [])
    .filter(e => e.box_type === "number" && e.value) // number box = built
    .map(e => e.level)
)


  let bonusCoins = 0
  for (const lvl of builtLevels) {
    if (BONUS_COIN_REWARD[lvl]) bonusCoins += BONUS_COIN_REWARD[lvl]
  }

  let spent = 0
  for (const lvl of builtLevels) {
    if (BONUS_COIN_COST_LEVELS.has(lvl)) spent += 2
  }

  const netBonusCoins = bonusCoins - spent

  const baseBuildable = computeBuildableLevels(userEntries || [], {
    materials: Object.entries(materialCounts).flatMap(([m, c]) =>
      Array(c).fill(m)
    )
  })

  return baseBuildable.filter(levelId => {
    if (BONUS_COIN_COST_LEVELS.has(levelId)) {
      return netBonusCoins >= 2
    }
    return true
  })
}, [userEntries, materialCounts])

const closestRaw = useMemo(() => {
  const buildableSet = new Set(buildable)

  return computeClosestLevels(userEntries || [], {
    materials: Object.entries(materialCounts).flatMap(([m, c]) =>
      Array(c).fill(m)
    )
  }).filter(x => !buildableSet.has(x.levelId))
}, [userEntries, materialCounts, buildable])

const closest = useMemo(() => {
  const enriched = closestRaw.map(x => {
    const total = materialList[x.levelId - 1]?.length || 0
    const stars = starValue[x.levelId - 1] || 0

    const missingMaterials = [...x.missing]
    const missingBonus = []

    if (BONUS_COIN_COST_LEVELS.has(x.levelId)) {
      const cost = 2
      const missingAmount = Math.max(0, cost - stats.bonusCoins)

      if (missingAmount > 0) {
        missingBonus.push(`${missingAmount} Bonus Coin${missingAmount > 1 ? "s" : ""}`)
      }
    }

    return {
      ...x,
      total,
      stars,
      missingMaterials,
      missingBonus
    }
  })

  enriched.sort((a, b) => {
  const aMissing = a.missingMaterials.length
  const bMissing = b.missingMaterials.length

  if (aMissing !== bMissing) {
    return aMissing - bMissing        
  }

  if (a.total !== b.total) {
    return b.total - a.total          
  }

  if (a.stars !== b.stars) {
    return b.stars - a.stars           
  }

  return a.levelId - b.levelId
})


  return enriched
}, [closestRaw, stats.bonusCoins])


  const displayedMaterials = useMemo(() => {
    let list = ALL_MATERIALS

const neededCounts = {}
  const missingCounts = {}

if (viewMode === "needed") {
    for (const lvl of remainingLevels || []) {
      const mats = materialList[lvl - 1] || []
      for (const m of mats) {
        neededCounts[m] = (neededCounts[m] || 0) + 1
      }
    }

    for (const m of Object.keys(neededCounts)) {
      const have = materialCounts[m] || 0
      const need = neededCounts[m]
      const missing = Math.max(0, need - have)
      if (missing > 0) missingCounts[m] = missing
    }
  }

    if (viewMode === 'owned') {
      list = list.filter(m => (materialCounts[m] || 0) > 0)
    }

    if (viewMode === 'needed') {
    const needed = new Set(Object.keys(neededCounts))

    list = list
      .filter(m => needed.has(m))
      .map(m => ({
        name: m,
        missing: missingCounts[m] || 0
      }))
  }
if (materialSortMode === "mixed") {
    return [...list].sort((a, b) => {
      const aName = typeof a === "string" ? a : a.name
      const bName = typeof b === "string" ? b : b.name
      return aName.localeCompare(bName)
    })
  }

  if (materialSortMode === "frequency") {
    const totalNeededMap: Record<string, number> = {}
    for (const m of ALL_MATERIALS) {
      let count = 0
      for (let lvl = 1; lvl <= materialList.length; lvl++) {
        count += (materialList[lvl - 1] || []).filter(x => x === m).length
      }
      totalNeededMap[m] = count
    }

    return [...list].sort((a, b) => {
      const aName = typeof a === "string" ? a : a.name
      const bName = typeof b === "string" ? b : b.name

      if (viewMode === "needed") {
        const aMissing = typeof a === "string" ? 0 : (a.missing || 0)
        const bMissing = typeof b === "string" ? 0 : (b.missing || 0)
        if (bMissing !== aMissing) return bMissing - aMissing
      }

      return (totalNeededMap[bName] || 0) - (totalNeededMap[aName] || 0)
    })
  }

  return list

  }, [viewMode, materialCounts, remainingLevels, materialSortMode])

  const formatLevel = (id, missingMaterials = [], missingBonus = [], have = 0, total = 0, haveMaterials = [], haveBonus = false) => {
  const name = levelNames[id - 1]
  const stars = starValue[id - 1] || 0
  const bcTag = BONUS_COIN_COST_LEVELS.has(id)
  const code = getLevelCode(id)

  const missingList = [...missingMaterials, ...missingBonus]

  return (
    <span>
      <strong>{code}</strong> {name}{bcTag ? ' (BC)' : ''} <Stars value={stars} /> | Have {have}/{total}
      {(haveMaterials.length > 0 || haveBonus) && (
        <span> ({[...haveMaterials, ...(haveBonus ? ['Bonus Coins (2)'] : [])].join(', ')})</span>
      )}
      {missingList.length > 0 && (
        <span> | Need - {missingList.join(', ')}</span>
      )}
    </span>
  )
}



  if (!session || !userEntries) {
    return <div className="p-6 text-gray-500">Loading Level Builder…</div>
  }

  return (
    <div className="p-6 space-y-10 max-w-[1600px] mx-auto">

      <div className="flex gap-2 text-sm">
        {modeButton('default', viewMode, setViewMode)}
        {modeButton('owned', viewMode, setViewMode)}
        {modeButton('needed', viewMode, setViewMode)}
      </div>

<button
  onClick={() =>
    setMaterialSortMode(m =>
      m === "grouped" ? "mixed" : m === "mixed" ? "frequency" : "grouped"
    )
  }
  className="px-2 py-1 border rounded hover:bg-gray-100 text-sm"
>
  {materialSortMode === "grouped"
    ? "Sort: By Type"
    : materialSortMode === "mixed"
    ? "Sort: Alphabetical"
    : "Sort: By Frequency"}
</button>


      <MaterialEditor
        counts={materialCounts}
        displayedMaterials={displayedMaterials}
        onIncrement={mat =>
          setMaterialCounts(p => ({ ...p, [mat]: (p[mat] || 0) + 1 }))
        }
        onDecrement={mat =>
          setMaterialCounts(p => ({
            ...p,
            [mat]: Math.max(0, (p[mat] || 0) - 1)
          }))
        }
      />

      <section>
        <h2 className="text-2xl font-semibold mb-2">Levels You Can Build</h2>

        {buildable.map(id => (
          <div key={id} className="p-2 border rounded bg-green-50">
            {formatLevel(
  id,
  [],
  [],
  materialList[id - 1]?.length || 0,
  materialList[id - 1]?.length || 0,
  (materialList[id - 1] || []).filter(m => (materialCounts[m] || 0) > 0),
  BONUS_COIN_COST_LEVELS.has(id)
)}

          </div>
        ))}
      </section>

      <section>
  <div className="flex justify-between mb-2">
    <h2 className="text-2xl font-semibold">Closest Levels</h2>
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-1 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={showZeroMaterials}
          onChange={e => setShowZeroMaterials(e.target.checked)}
        />
        Include levels with 0 materials contributed
      </label>
      <select
        value={closestLimit}
        onChange={e => setClosestLimit(Number(e.target.value))}
        className="border rounded px-2 py-1 text-sm"
      >
        {[5, 10, 15, 20, 25, 30].map(n => (
          <option key={n} value={n}>Show {n}</option>
        ))}
      </select>
    </div>
  </div>

  <ul className="space-y-2">
    {closest
      .filter(x => showZeroMaterials || x.total - x.missingMaterials.length > 0)
      .slice(0, closestLimit)
      .map(x => (
            <li key={x.levelId} className="p-2 border rounded bg-yellow-50">
              {formatLevel(
  x.levelId,
  x.missingMaterials,
  x.missingBonus,
  x.total - x.missingMaterials.length,
  x.total,
  (materialList[x.levelId - 1] || []).filter(m =>
    (materialCounts[m] || 0) > 0 && !x.missingMaterials.includes(m)
  ),
  BONUS_COIN_COST_LEVELS.has(x.levelId) && x.missingBonus.length === 0
)}

            </li>
          ))}
        </ul>
      </section>

      {/* STATS */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Stats</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Built Levels" value={stats.builtCount} />
          <StatCard label="Remaining" value={stats.remainingCount} />
          <StatCard
  label="Materials Completed"
  value={
    (() => {
      const done = ALL_MATERIALS.filter(m => (missingCounts[m] || 0) === 0).length
      return `${done}/${ALL_MATERIALS.length} (${((done / ALL_MATERIALS.length) * 100).toFixed(1)}%)`
    })()
  }
/>
          <StatCard label="Bonus Coins" value={stats.bonusCoins} />
        </div>
      </section>



<section>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div>
      <h3 className="text-xl font-semibold mb-2">Star Progress</h3>
      <ul className="space-y-1">
        {[1,2,3,4,5].map(star => {
          const total = stats.starProgress.total[star] || 0
          const unbuilt = stats.starProgress.unbuilt[star] || 0
          const built = total - unbuilt

          return (
            <li key={star}>
              {unbuilt} {star}-star level{unbuilt !== 1 ? "s" : ""} remaining:
              Built ({built}/{total})
            </li>
          )
        })}
      </ul>
    </div>

    <div>
      <h3 className="text-xl font-semibold mb-2">Size Progress</h3>
      <ul className="space-y-1">
        {[2,3,4,5,6,7,11].map(size => {
          const total = stats.sizeProgress.total[size] || 0
          const unbuilt = stats.sizeProgress.unbuilt[size] || 0
          const built = total - unbuilt

          return (
            <li key={size}>
              {unbuilt} {size}-card level{unbuilt !== 1 ? "s" : ""} remaining:
              Built ({built}/{total})
            </li>
          )
        })}
      </ul>
    </div>

  </div>
</section>
<section>
  <h2 className="text-2xl font-semibold mb-3">Material Progress</h2>

  <div className="flex gap-2 mb-3 text-sm">
    {(['all', 'environments', 'resources', 'animals'] as const).map(tab => (
      <button
        key={tab}
        onClick={() => setMatProgressTab(tab)}
        className={`px-3 py-1 rounded border ${
          matProgressTab === tab
            ? 'bg-blue-600 text-white border-blue-700'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        {tab[0].toUpperCase() + tab.slice(1)}
      </button>
    ))}
    <label className="ml-auto flex items-center gap-1 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={includeInventory}
        onChange={e => setIncludeInventory(e.target.checked)}
      />
      Include materials in your inventory towards completion
    </label>
    <button
      onClick={() => setMatProgressAsc(a => !a)}
      className="px-3 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100"
    >
      {matProgressAsc ? '↑ Lowest first' : '↓ Highest first'}
    </button>
  </div>

  {(() => {
    const tabMap = {
      all: ALL_MATERIALS,
      environments: environmentList,
      resources: resourceList,
      animals: animalList
    }

    const list = tabMap[matProgressTab]

    const builtLevels = new Set(
      (userEntries || [])
        .filter(e => e.box_type === "number" && e.value)
        .map(e => e.level)
    )

    const withStats = list.map(m => {
      let totalNeeded = 0
      for (let lvl = 1; lvl <= materialList.length; lvl++) {
        totalNeeded += (materialList[lvl - 1] || []).filter(x => x === m).length
      }

      let usedByBuilt = 0
      for (const lvl of builtLevels) {
        usedByBuilt += (materialList[lvl - 1] || []).filter(x => x === m).length
      }

      const stillNeeded = totalNeeded - usedByBuilt
      const have = includeInventory ? (materialCounts[m] || 0) : 0
      const usedFromInventory = Math.min(have, stillNeeded)

      const used = usedByBuilt + usedFromInventory
      const pct = totalNeeded === 0 ? 100 : (used / totalNeeded) * 100

      return { m, used, totalNeeded, pct }
    })

    const sorted = [...withStats].sort((a, b) =>
      matProgressAsc ? a.pct - b.pct : b.pct - a.pct
    )

    return (
      <div className="flex flex-col gap-2">
        {sorted.map(({ m, used, totalNeeded, pct }) => (
          <div
            key={m}
            className="flex items-center gap-3 p-2 border rounded-lg bg-white shadow-sm"
          >
            <Image
              src={`/materials/${m}.png`}
              alt={m}
              width={28}
              height={28}
              className="shrink-0"
            />
            <span className="w-36 text-sm font-medium truncate">{m}</span>
            <span className="text-sm text-gray-600 w-16 text-center">
              {used}/{totalNeeded}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-3 min-w-[80px]">
              <div
                className="h-3 rounded-full bg-blue-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm font-semibold w-14 text-right">
              {pct.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    )
  })()}
</section>

    </div>
    
  )
}