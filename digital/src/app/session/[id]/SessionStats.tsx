'use client'

import { useMemo, useState } from 'react'
import { LEVEL_CODE, bonusDifficulties } from '@/lib/dkcbg/data'
import type { BoxEntry } from '@/lib/types'


const FINAL_BOSS_LEVELS = new Set([40, 81, 87, 136, 142])
const FINAL_BOSS_NAMES: Record<number, string> = {
  40: 'Gang-Plank Galleon',
  81: 'K. Rool Duel',
  87: 'Krocodile Kore',
  136: 'Kastle KAOS',
  142: 'Knautilus',
}

const WORLD_NAMES: Record<string, Record<number, string>> = {
  '1': { 1: 'Kongo Jungle', 2: 'Monkey Mines', 3: 'Vine Valley', 4: 'Gorilla Glacier', 5: 'Kremkroc Industries Inc.', 6: 'Chimp Caverns', 7: 'Gang-Plank Galleon' },
  '2': { 1: 'Gangplank Galleon', 2: 'Crocodile Cauldron', 3: 'Krem Quay', 4: 'Krazy Kremland', 5: 'Gloomy Gulch', 6: "K. Rool's Keep", 7: 'The Flying Krock', 8: 'Lost World' },
  '3': { 1: 'Lake Orangatanga', 2: 'Kremwood Forest', 3: 'Cotton-Top Cove', 4: 'Mekanos', 5: 'K3', 6: 'Razor Ridge', 7: 'Pacifica', 8: 'KAOS Kore', 9: 'Krematoa' },
}

const LEVEL_TO_WORLD: Record<number, string> = {}
const WORLD_LEVELS: Record<string, number[]> = {}

for (const [gameKey, worlds] of Object.entries(LEVEL_CODE)) {
  for (const [worldKey, levels] of Object.entries(worlds)) {
    const worldName = WORLD_NAMES[gameKey]?.[Number(worldKey)] ?? `Game ${gameKey} World ${worldKey}`
    for (const levelNum of Object.values(levels)) {
      LEVEL_TO_WORLD[levelNum] = worldName
      if (!WORLD_LEVELS[worldName]) WORLD_LEVELS[worldName] = []
      WORLD_LEVELS[worldName].push(levelNum)
    }
  }
}

const ALL_WORLDS = Object.keys(WORLD_LEVELS)

interface Member {
  user_email: string
  display_name: string | null
  player_name?: string | null
}

interface Props {
  members: Member[]
  entries: BoxEntry[]
  scrapbooked: Record<string, string[]>
  onClose: () => void
}

function StatRow({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <div>
        <span className="text-sm text-gray-700">{label}</span>
        {sub && <div className="text-xs text-gray-400">{sub}</div>}
      </div>
      <span className="text-sm font-bold text-gray-900 ml-4 shrink-0">{value}</span>
    </div>
  )
}

function computeStatsForUser(userEmail: string, entries: BoxEntry[]) {
  const userEntries = entries.filter(e => e.user_email === userEmail)

  const builtLevels = new Set(
    userEntries.filter(e => e.box_type === 'number' && e.value && !e.lost).map(e => e.level)
  )
  const bangLevels = new Set(
    userEntries.filter(e => e.box_type === 'bang' && e.value).map(e => e.level)
  )
  const savedLevels = new Set(
    userEntries.filter(e => e.box_type === 'check' && e.value).map(e => e.level)
  )

  let worldsCompleted = 0
  let worldsFullyCompleted = 0
  for (const world of ALL_WORLDS) {
    const levels = WORLD_LEVELS[world]
    const allBuilt = levels.every(l => builtLevels.has(l))
    const allBang = levels.every(l => bangLevels.has(l))
    if (allBuilt) worldsCompleted++
    if (allBuilt && allBang) worldsFullyCompleted++
  }

  const finalBossesCompleted = Array.from(FINAL_BOSS_LEVELS).filter(
    l => builtLevels.has(l) && bangLevels.has(l)
  )

  let failedBangCost = 0
  for (const level of Array.from(builtLevels)) {
    if (FINAL_BOSS_LEVELS.has(level)) continue

    if (!bangLevels.has(level)) {
      const difficulty = bonusDifficulties[level - 1] ?? 0
      failedBangCost += difficulty * 100
    }
  }

  return {
    builtCount: builtLevels.size,
    bangCount: bangLevels.size,
    savedCount: savedLevels.size,
    worldsCompleted,
    worldsFullyCompleted,
    finalBossesCompleted,
    failedBangCost,
  }
}

export default function SessionStats({ members, entries, scrapbooked, onClose }: Props) {
  const [activeTab, setActiveTab] = useState(members[0]?.user_email ?? '')

  const statsByUser = useMemo(() => {
    const map: Record<string, ReturnType<typeof computeStatsForUser>> = {}
    for (const m of members) {
      map[m.user_email] = computeStatsForUser(m.user_email, entries)
    }
    return map
  }, [members, entries])

  const stats = statsByUser[activeTab]
  const activeMember = members.find(m => m.user_email === activeTab)

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Player Stats</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {members.length > 1 && (
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {members.map(m => (
              <button
                key={m.user_email}
                onClick={() => setActiveTab(m.user_email)}
                className={`px-4 py-2 text-sm shrink-0 border-b-2 transition-colors ${activeTab === m.user_email
                  ? 'border-blue-500 text-blue-600 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {m.player_name || m.display_name || m.user_email}
              </button>
            ))}
          </div>
        )}

        {stats && (
          <div className="px-5 py-3 max-h-[70vh] overflow-y-auto">
            <StatRow
              label="Levels Built"
              value={`${stats.builtCount} / 142`}
            />
            <StatRow
              label={'"!" Completed'}
              value={`${stats.bangCount} / 142`}
            />
            <StatRow
              label="Saved"
              value={`${stats.savedCount} / 142`}
            />
            <StatRow
              label="Worlds Completed"
              sub="All levels built"
              value={`${stats.worldsCompleted} / 24`}
            />
            <StatRow
              label="Worlds Fully Completed"
              sub="All levels built & !"
              value={`${stats.worldsFullyCompleted} / 24`}
            />
            <StatRow
              label="Cards Scrapbooked"
              value={`${(scrapbooked[activeTab] || []).length} / 68`}
            />
            <StatRow
              label="Final Bosses Completed"
              sub={
                stats.finalBossesCompleted.length > 0
                  ? stats.finalBossesCompleted.map(l => FINAL_BOSS_NAMES[l]).join(', ')
                  : 'None yet'
              }
              value={`${stats.finalBossesCompleted.length} / 5`}
            />
            <StatRow
              label="Remaining ! Cost"
              sub="Cost to buy missing ! at Cranky's"
              value={`$${stats.failedBangCost.toLocaleString()}`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
