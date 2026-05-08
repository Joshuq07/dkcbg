'use client'

import { useMemo, useState } from 'react'
import { WORLD_MAP, bonusDifficulties } from '@/lib/dkcbg/data'
import type { BoxEntry } from '@/lib/types'

// Final boss level numbers
const FINAL_BOSS_LEVELS = new Set([40, 79, 85, 120, 142])
const FINAL_BOSS_NAMES: Record<number, string> = {
  40: 'Gang-Plank Galleon',
  79: 'K. Rool Duel',
  85: 'Krocodile Kore',
  120: 'Kastle KAOS',
  142: 'Knautilus',
}

// Build world → level[] map from WORLD_MAP
function buildWorldLevels(): Record<string, number[]> {
  const map: Record<string, number[]> = {}
  Object.entries(WORLD_MAP).forEach(([levelStr, world]) => {
    if (!world) return
    const level = Number(levelStr)
    if (!map[world]) map[world] = []
    map[world].push(level)
  })
  return map
}

const WORLD_LEVELS = buildWorldLevels()
const ALL_WORLDS = Object.keys(WORLD_LEVELS)

interface Member {
  user_email: string
  display_name: string | null
  player_name?: string | null
}

interface Props {
  members: Member[]
  entries: BoxEntry[]
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

  // Worlds completed (all levels built)
  let worldsCompleted = 0
  let worldsFullyCompleted = 0
  for (const world of ALL_WORLDS) {
    const levels = WORLD_LEVELS[world]
    const allBuilt = levels.every(l => builtLevels.has(l))
    const allBang = levels.every(l => bangLevels.has(l))
    if (allBuilt) worldsCompleted++
    if (allBuilt && allBang) worldsFullyCompleted++
  }

  // Final bosses completed (built + bang)
  const finalBossesCompleted = Array.from(FINAL_BOSS_LEVELS).filter(
    l => builtLevels.has(l) && bangLevels.has(l)
  )

  // Failed "!" cost — built levels without bang, excluding final bosses
  let failedBangCost = 0
  for (const level of builtLevels) {
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

export default function SessionStats({ members, entries, onClose }: Props) {
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
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Player Stats</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
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

        {/* Stats */}
        {stats && (
          <div className="px-5 py-3 max-h-[70vh] overflow-y-auto">
            <StatRow
              label="Levels Built"
              value={`${stats.builtCount} / 142`}
            />
            <StatRow
              label={'! Completed'}
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
              sub="All levels built + !"
              value={`${stats.worldsFullyCompleted} / 24`}
            />
            <StatRow
              label="Cards Scrapbooked"
              value="—"
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
