'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { GAMES, PLAYERS, CHARACTER_NAMES } from '@/app/session/[id]/records/data'
import { VERSION_LAYOUTS } from '@/lib/versionLayouts'
import { SCRAPBOOK_ANCHORS } from '@/lib/boxes'
import type { VersionId, GamePlacementBase } from '@/lib/types'

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const PLACEMENT_LABELS: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' }
const PLACEMENT_COLORS: Record<number, string> = {
  1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32', 4: '#6B7280',
}

function getPlayerName(id: string) {
  return PLAYERS.find(p => p.id === id)?.name ?? id
}

// ─── STATIC LEVEL SHEET ───────────────────────────────────────────────────────

function StaticLevelSheet({
  levelStats,
  scrapbook,
  versionId,
  playerCount,
  playerIndex,
}: {
  levelStats: Record<string, { buildOrder: number; star?: 0 | 1; starOrder?: 0 | 1 | 2 | 3 | 4; bang?: 0 | 1; save?: 0 | 1 }>
  scrapbook?: string[]
  versionId: VersionId
  playerCount: number
  playerIndex: number
}) {
  const layout = VERSION_LAYOUTS[versionId]
  if (!layout) return <div className="text-gray-400 text-sm italic">No layout config for {versionId}</div>

  // Map level name → level number using anchor order
  const levelNames = Object.keys(levelStats)

  function getDisplay(levelNum: number, colType: string): string {
    const levelName = levelNames[levelNum - 1]
    if (!levelName) return ''
    const stat = levelStats[levelName]
    if (!stat) return ''

    switch (colType) {
      case 'number':   return stat.buildOrder > 0 ? String(stat.buildOrder) : ''
      case 'star':     return stat.star === 1 ? '★' : ''
      case 'star1':    return stat.starOrder === 1 ? '★' : ''
      case 'star2':    return stat.starOrder === 2 ? '★' : ''
      case 'star3':    return stat.starOrder === 3 ? '★' : ''
      case 'star4':    return stat.starOrder === 4 ? '★' : ''
      case 'check':    return stat.buildOrder > 0 ? '✔︎' : ''
      case 'bang':     return stat.bang === 1 ? '!' : ''
      case 'save':     return stat.save === 1 ? '✔︎' : ''
      default:         return ''
    }
  }

  const anchorsByPage = {
    1: layout.anchors.filter(a => a.page === 1),
    2: layout.anchors.filter(a => a.page === 2),
  }

  function renderPage(page: 1 | 2, imageSrc: string) {
    return (
      <div className="relative w-full flex-1" style={{ containerType: 'inline-size' }}>
        <img src={imageSrc} className="w-full h-auto block" alt={`Sheet page ${page}`} />
        {anchorsByPage[page].map(anchor => (
          layout.columns.map(col => {
            const display = getDisplay(anchor.level, col.type)
            const h = anchor.hOverride ?? col.h
            return (
              <div
                key={`${anchor.level}_${col.type}`}
                className="absolute flex items-center justify-center leading-none text-black overflow-hidden"
                style={{
                  left: `${((anchor.x + col.dx) / layout.imageWidth) * 100}%`,
                  top: `${(anchor.y / layout.imageHeight) * 100}%`,
                  width: `${(col.w / layout.imageWidth) * 100}%`,
                  height: `${(h / layout.imageHeight) * 100}%`,
                  fontSize: 'clamp(0.25rem, 1.2cqw, 1.1rem)',
                  whiteSpace: 'nowrap',
                }}
              >
                {display}
              </div>
            )
          })
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {renderPage(1, layout.pages[1])}
      {layout.pages[2] && renderPage(2, layout.pages[2])}

      {/* Scrapbook — only for versions that have it */}
      {layout.hasScrapbook && scrapbook && scrapbook.length > 0 && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Scrapbook ({scrapbook.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {scrapbook.map(card => (
              <span
                key={card}
                className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200"
              >
                {card}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string
  const gameId = params.gameId as string

  const game = GAMES.find(g => g.id === gameId)

  const [activePlayerIndex, setActivePlayerIndex] = useState(0)

  if (!game) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-800 mb-4">
            ← Back
          </button>
          <div className="text-gray-400 italic">Game not found.</div>
        </div>
      </main>
    )
  }

  const activePlacement = game.placements[activePlayerIndex]

 // Group by teamId for display
  const teams = useMemo(() => {
    const map = new Map<string, GamePlacementBase[]>()
    const placements = game.placements as GamePlacementBase[]
    for (const p of placements) {
      const key = p.teamId ?? p.playerId
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(p)
    }
    return [...map.values()]
  }, [game])

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.push(`/session/${sessionId}/records`)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
        >
          ← Back to Records
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {game.name ?? game.id}
          </h1>
          <div className="text-sm text-gray-400 mt-1">{game.date} · {game.version}</div>
          {game.notes && <div className="text-sm text-gray-500 mt-1 italic">{game.notes}</div>}
        </div>

        {/* Placements summary */}
        <div className="flex flex-wrap gap-3 mb-6">
          {teams.map((teamPlacements, ti) => {
            const place = teamPlacements[0].place
            const color = PLACEMENT_COLORS[place]
            const isTeam = teamPlacements.length > 1
            return (
              <div
                key={ti}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                style={{
                  background: `${color}18`,
                  border: `1.5px solid ${color}66`,
                }}
              >
                <span style={{ color, fontWeight: 700 }}>{PLACEMENT_LABELS[place]}</span>
                <span className="text-gray-700">
                  {teamPlacements.map(p => getPlayerName(p.playerId)).join(' & ')}
                </span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">
                  {teamPlacements.map(p => CHARACTER_NAMES[p.characterId]).join(' & ')}
                </span>
                {isTeam && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Team</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Player tabs */}
        <div className="flex gap-1 mb-4 bg-white border border-gray-200 rounded-xl p-1 shadow-sm w-fit">
          {game.placements.map((p, i) => (
            <button
              key={p.playerId}
              onClick={() => setActivePlayerIndex(i)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: activePlayerIndex === i ? '#1f2937' : 'transparent',
                color: activePlayerIndex === i ? 'white' : '#6b7280',
              }}
            >
              {getPlayerName(p.playerId)}
              <span
                className="ml-1.5 text-xs"
                style={{ color: activePlayerIndex === i ? PLACEMENT_COLORS[p.place] : '#9ca3af' }}
              >
                {PLACEMENT_LABELS[p.place]}
              </span>
            </button>
          ))}
        </div>

        {/* Active player stats bar */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Character</div>
            <div className="text-sm font-semibold text-gray-800 mt-0.5">
              {CHARACTER_NAMES[activePlacement.characterId]}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Turns Taken</div>
            <div className="text-sm font-semibold text-gray-800 mt-0.5">{activePlacement.turnsTaken}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Levels Built</div>
            <div className="text-sm font-semibold text-gray-800 mt-0.5">
              {Object.values(activePlacement.levelStats).filter(s => s.buildOrder > 0).length} / {Object.keys(activePlacement.levelStats).length}
            </div>
          </div>
          {'scrapbook' in activePlacement && (
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Scrapbook</div>
              <div className="text-sm font-semibold text-gray-800 mt-0.5">
                {(activePlacement as any).scrapbook.length} cards
              </div>
            </div>
          )}
          {activePlacement.teamId && (
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Team</div>
              <div className="text-sm font-semibold text-gray-800 mt-0.5">{activePlacement.teamId}</div>
            </div>
          )}
        </div>

        {/* Level sheet */}
        <StaticLevelSheet
          levelStats={activePlacement.levelStats}
          scrapbook={'scrapbook' in activePlacement ? (activePlacement as any).scrapbook : undefined}
          versionId={game.version as VersionId}
          playerCount={game.placements.length}
          playerIndex={activePlayerIndex}
        />
      </div>
    </main>
  )
}