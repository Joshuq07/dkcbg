'use client'

import { useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  PLAYERS,
  GAMES,
  VERSIONS,
  CHARACTER_ORDER,
  CHARACTER_NAMES,
} from './data'
import type { Game, Placement, CharacterId } from '@/lib/types'
import Image from 'next/image'


const PLACEMENT_COLORS: Record<Placement, string> = {
  0: '#000000',
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
  4: '#6B7280',
}
const TROPHY_IMAGES: Record<CharacterId, string> = {
  'donkey-kong': '/trophies/donkey-kong.png',
  'diddy-kong': '/trophies/diddy-kong.png',
  'dixie-kong': '/trophies/dixie-kong.png',
  'kiddy-kong': '/trophies/kiddy-kong.png',
  'tiny-kong': '/trophies/tiny-kong.png',
  'lanky-kong': '/trophies/lanky-kong.png',
  'chunky-kong': '/trophies/chunky-kong.png',
  'taj': '/trophies/taj.png',
  'xananab': '/trophies/xananab.png',
  'klubba': '/trophies/klubba.png',
  'voidco': '/trophies/voidco.png',
  'king-k-rool': '/trophies/king-k-rool.png',
}
const PLAYER_TROPHY_IMAGES: Record<string, string> = {
  josh: '/trophies/josh.png',
  justin: '/trophies/justin.png',
  austin: '/trophies/austin.png',
  tom: '/trophies/tom.png',
  chris: '/trophies/chris.png',
  dario: '/trophies/dario.png',
  eddie: '/trophies/eddie.png',
  everett: '/trophies/everett.png',
}

const PLACEMENT_LABELS: Record<Placement, string> = {
  0: 'Unfinished',
  1: '1st',
  2: '2nd',
  3: '3rd',
  4: '4th',
}

const PLACEMENT_SIZES: Record<Placement, number> = {
  0: 0,
  1: 72,
  2: 58,
  3: 48,
  4: 38,
}

function getPlayerName(id: string) {
  return PLAYERS.find(p => p.id === id)?.name ?? id
}

// A minimal shape we can safely use across all versions
type PlacementSummary = {
  playerId: string
  characterId: CharacterId
  place: Placement
  teamId?: string
  turnsTaken: number
}

function getPlacementSummaries(game: Game): PlacementSummary[] {
  return game.placements.map(p => ({
    playerId: p.playerId,
    characterId: p.characterId,
    place: p.place,
    teamId: p.teamId,
    turnsTaken: p.turnsTaken,
  }))
}

function trophiesForPlayer(playerId: string): { game: Game; placement: PlacementSummary }[] {
  const result: { game: Game; placement: PlacementSummary }[] = []
  for (const game of GAMES) {
    const summaries = getPlacementSummaries(game)
    const p = summaries.find(pl => pl.playerId === playerId)
    if (p) result.push({ game, placement: p })
  }
  return result.sort((a, b) => {
  // 1. Sort by placement
  if (a.placement.place !== b.placement.place) {
    return a.placement.place - b.placement.place
  }

  // 2. Sort by character order
  const aCharIndex = CHARACTER_ORDER.indexOf(a.placement.characterId)
  const bCharIndex = CHARACTER_ORDER.indexOf(b.placement.characterId)
  if (aCharIndex !== bCharIndex) {
    return aCharIndex - bCharIndex
  }

  // 3. Sort by game number
  const getGameNumber = (id: string) => {
    const match = id.match(/\d+/)
    return match ? Number(match[0]) : 0
  }

  return getGameNumber(a.game.id) - getGameNumber(b.game.id)
})
}

function trophiesForCharacter(characterId: CharacterId): { game: Game; placement: PlacementSummary }[] {
  const result: { game: Game; placement: PlacementSummary }[] = []
  for (const game of GAMES) {
    const summaries = getPlacementSummaries(game)
    const p = summaries.find(pl => pl.characterId === characterId)
    if (p && p.place !== 0) result.push({ game, placement: p })  
  }
  return result.sort((a, b) => {
  // 1. Sort by placement
  if (a.placement.place !== b.placement.place) {
    return a.placement.place - b.placement.place
  }

  // 2. Sort by character order
  const aCharIndex = CHARACTER_ORDER.indexOf(a.placement.characterId)
  const bCharIndex = CHARACTER_ORDER.indexOf(b.placement.characterId)
  if (aCharIndex !== bCharIndex) {
    return aCharIndex - bCharIndex
  }

  // 3. Sort by game number
  const getGameNumber = (id: string) => {
    const match = id.match(/\d+/)
    return match ? Number(match[0]) : 0
  }

  return getGameNumber(a.game.id) - getGameNumber(b.game.id)
})
}

function Trophy({
  game,
  placement,
  labelTop,
  onClick,
  imageSrc,
}: {
  game: Game
  placement: PlacementSummary
  labelTop?: string
  onClick: () => void
  imageSrc?: string
}) {
  const [hovered, setHovered] = useState(false)
  const size = PLACEMENT_SIZES[placement.place]
  const color = PLACEMENT_COLORS[placement.place]
  const tooltipRef = useRef<HTMLDivElement>(null)
  const src = imageSrc ?? TROPHY_IMAGES[placement.characterId]


  return (
    <div
      className="relative flex flex-col items-center"
      style={{ width: size + 8 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

<button
  onClick={onClick}
  className="relative transition-transform"
  style={{
    width: size,
    height: size,
    transform: hovered ? 'scale(1.08)' : 'scale(1)',
    transition: 'all 0.15s ease',
    flexShrink: 0,
    background: 'transparent',
    border: 'none',
    padding: 0,
  }}
>
  <Image
    src={src}
    alt={`${CHARACTER_NAMES[placement.characterId]} trophy`}
    fill
    className="object-contain select-none pointer-events-none"
    draggable={false}
    style={{
      filter:
        placement.place === 2
          ? 'none'
          : placement.place === 1
          ? 'brightness(0.95) sepia(1) saturate(3) hue-rotate(10deg)'
          : placement.place === 3
          ? 'brightness(0.85) sepia(0.8) saturate(2) hue-rotate(-10deg)'
          : 'brightness(0.7) grayscale(0.3)',
    }}
  />
</button>

      {hovered && (
        <div
          ref={tooltipRef}
          className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-lg shadow-xl pointer-events-none"
          style={{ minWidth: 160, maxWidth: 220, padding: '10px 12px' }}
        >
          <div
  className="text-xs font-bold mb-1"
  style={{ color: PLACEMENT_COLORS[placement.place] }}
>
  {PLACEMENT_LABELS[placement.place]} — Game {game.id.match(/\d+/)?.[0] ?? game.id}
</div>

<div className="text-xs text-gray-200 mb-1">
  {labelTop ?? CHARACTER_NAMES[placement.characterId]}
</div>

<div className="text-xs text-gray-300 mb-2">
  {game.date} · {game.version}
</div>
          {placement.turnsTaken !== 0 && (
  <div className="flex justify-between text-xs gap-4">
    <span className="text-gray-400">Turns Taken</span>
    <span className="text-white font-medium">
      {placement.turnsTaken}
    </span>
  </div>
)}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #111827',
            }}
          />
        </div>
      )}
    </div>
  )
}


type MainTab = 'trophy' | 'history' | 'versions'
type TrophyMode = 'player' | 'character'


export default function RecordsPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string

  const [mainTab, setMainTab] = useState<MainTab>('trophy')
  const [trophyMode, setTrophyMode] = useState<TrophyMode>('player')

  function goToGame(gameId: string) {
    router.push(`/session/${sessionId}/records/games/${gameId}`)
  }

  function goToVersion(versionId: string) {
    router.push(`/session/${sessionId}/records/versions/${versionId}`)
  }


  function TrophyRoom() {
    return (
      <div>
        <div className="flex gap-2 mb-6">
          {(['player', 'character'] as TrophyMode[]).map(m => (
            <button
              key={m}
              onClick={() => setTrophyMode(m)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: trophyMode === m ? '#1f2937' : 'transparent',
                color: trophyMode === m ? 'white' : '#6b7280',
                border: trophyMode === m ? '1px solid #374151' : '1px solid #e5e7eb',
              }}
            >
              {m === 'player' ? 'By Player' : 'By Character'}
            </button>
          ))}
        </div>

        {trophyMode === 'player' ? (
          <div className="space-y-4">
            {PLAYERS.map(player => {
              const trophies = trophiesForPlayer(player.id).filter(
  t => t.placement.place !== 0
)

if (trophies.length === 0) return null
              return (
                <div key={player.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="w-36 shrink-0">
                    <div className="font-semibold text-gray-800 text-sm">{player.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {trophies.filter(t => t.placement.place === 1).length}🥇{' '}
                      {trophies.filter(t => t.placement.place === 2).length}🥈{' '}
                      {trophies.filter(t => t.placement.place === 3).length}🥉
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {trophies.length === 0 && (
                      <span className="text-xs text-gray-300 italic">No games yet</span>
                    )}
                    {trophies
  .filter(({ placement }) => placement.place !== 0)
  .map(({ game, placement }) => (
    <Trophy
      key={game.id}
      game={game}
      placement={placement}
      onClick={() => goToGame(game.id)}
    />
))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {CHARACTER_ORDER.map(charId => {
              const trophies = trophiesForCharacter(charId)
              return (
                <div key={charId} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="w-36 shrink-0">
                    <div className="font-semibold text-gray-800 text-sm">{CHARACTER_NAMES[charId]}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {trophies.filter(t => t.placement.place === 1).length}🥇{' '}
                      {trophies.filter(t => t.placement.place === 2).length}🥈{' '}
                      {trophies.filter(t => t.placement.place === 3).length}🥉
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {trophies.length === 0 && (
                      <span className="text-xs text-gray-300 italic">No games yet</span>
                    )}
                    {trophies
  .filter(({ placement }) => placement.place !== 0)
  .map(({ game, placement }) => (
    <Trophy
      key={game.id}
      game={game}
      placement={placement}
      labelTop={getPlayerName(placement.playerId)}
      imageSrc={PLAYER_TROPHY_IMAGES[placement.playerId]}
      onClick={() => goToGame(game.id)}
    />
))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }


 function GameHistory() {
  const sorted = [...GAMES].sort((a, b) => {
    const getGameNumber = (id: string) => {
      const match = id.match(/\d+/)
      return match ? Number(match[0]) : 0
    }

    return getGameNumber(a.id) - getGameNumber(b.id)
  })

  return (
    <div className="space-y-3">
      {sorted.map(game => {
        const summaries = getPlacementSummaries(game)
        return (
          <button
            key={game.id}
            onClick={() => goToGame(game.id)}
            className="w-full text-left p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-gray-800 group-hover:text-black transition-colors">
                  {game.name ?? game.id}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {game.date} · {game.version}
                </div>
                {game.notes && (
                  <div className="text-xs text-gray-500 mt-1 italic">
                    {game.notes}
                  </div>
                )}
              </div>
              <span className="text-gray-300 group-hover:text-gray-500 text-lg mt-0.5 transition-colors">
                →
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {summaries.map(p => (
                <div
                  key={p.playerId}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
                  style={{
                    background: `${PLACEMENT_COLORS[p.place]}22`,
                    border: `1px solid ${PLACEMENT_COLORS[p.place]}66`,
                    color: '#1f2937',
                  }}
                >
                  <span
                    style={{
                      color: PLACEMENT_COLORS[p.place],
                      fontWeight: 700,
                    }}
                  >
                    {PLACEMENT_LABELS[p.place]}
                  </span>
                  <span className="text-gray-600">
                    {getPlayerName(p.playerId)}
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500">
                    {CHARACTER_NAMES[p.characterId]}
                  </span>
                </div>
              ))}
            </div>
          </button>
        )
      })}

      {GAMES.length === 0 && (
        <div className="text-center text-gray-400 py-12 text-sm italic">
          No games recorded yet.
        </div>
      )}
    </div>
  )
}

  // ── VERSION HISTORY ───────────────────────────────────────────────────────

  function VersionHistory() {
    return (
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />
        <div className="space-y-1 pl-10">
          {[...VERSIONS].reverse().map((v, i) => (
            <button
              key={v.id}
              onClick={() => goToVersion(v.id)}
              className="relative w-full text-left p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
            >
              <div
                className="absolute -left-7 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white"
                style={{ background: i === 0 ? '#1f2937' : '#d1d5db' }}
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 group-hover:text-black">{v.displayName}</span>
                    {i === 0 && (
                      <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">Current</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{v.date}</div>
                  <div className="text-sm text-gray-600 mt-1">{v.summary}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                  </div>
                </div>
                <span className="text-gray-300 group-hover:text-gray-500 text-lg mt-0.5 transition-colors shrink-0">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }


  const TAB_LABELS: Record<MainTab, string> = {
    trophy: 'Trophy Room',
    history: 'Game History',
    versions: 'Version History',
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Records</h1>

        <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 shadow-sm w-fit">
          {(Object.keys(TAB_LABELS) as MainTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: mainTab === tab ? '#1f2937' : 'transparent',
                color: mainTab === tab ? 'white' : '#6b7280',
              }}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {mainTab === 'trophy' && <TrophyRoom />}
        {mainTab === 'history' && <GameHistory />}
        {mainTab === 'versions' && <VersionHistory />}
      </div>
    </main>
  )
}