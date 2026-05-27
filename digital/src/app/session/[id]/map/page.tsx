'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { FULL_SPACE_GUIDE, SPACE_COORDINATES, WORLD_MAP } from '@/lib/dkcbg/data'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { useSessionData } from '@/hooks/useSessionData'
import { computeRemainingLevels, Entry as LogicEntry } from '@/lib/dkcbg/logic'
import { CONNECTIONS, levelNames, getLevelCode, materialList } from '@/lib/dkcbg/data'
import {
  findAllPaths, getMaterialsOnPath, buildNeededWeights, findBestPath,
  findPathsThroughWaypoints, SPACE_PBR, MATERIAL_PBR,
} from '@/lib/dkcbg/pathfinding'

const BOARD_WIDTH = 2976
const BOARD_HEIGHT = 2976

interface SpaceInfo {
  index: number
  entries: string[]
  world: string | null
  coords: [number, number]
}

const BEAR_ALIASES: Record<string, string[]> = {
  "barnacle's island": ["bazaar"],
  "brash's stadium": ["bazaar"],
  "blunder's booth": ["bazaar"],
  "bramble's bungalow": ["bazaar"],
  "blue's beach hut": ["bazaar"],
  "bazooka's barracks": ["bazaar"],
  "blizzard's basecamp": ["bazaar"],
  "barter's swap shop": ["bazaar"],
  "benny's chairlift": ["bazaar"],
  "björn's chairlift": ["bazaar"],
  "baffle's code room": ["bazaar"],
  "boomer's bomb shelter": ["bazaar"],
  "bachelor's pad": ["bazaar"],
  "bazaar's general store": ["bazaar"],
}

function getMatchingSpaces(query: string): number[] {
  if (!query.trim()) return []
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const results: number[] = []

  FULL_SPACE_GUIDE.forEach((entries, i) => {
    const spaceIndex = i + 1
    const coords = SPACE_COORDINATES[i]
    if (!coords) return

    const isMaterial = entries[0] === 'M'
    const searchableEntries = isMaterial ? entries.slice(1) : entries
    const world = WORLD_MAP[spaceIndex] ?? ''
    const spaceNameLower = searchableEntries.join(' ').toLowerCase()
    const bearAliases = BEAR_ALIASES[spaceNameLower] ?? []

    const haystack = [
      ...searchableEntries, ...bearAliases, world,
      String(spaceIndex), isMaterial ? 'material' : ''
    ].join(' ').toLowerCase()

    const expandedTerms = terms.flatMap(term =>
      term === 'bazaar'
        ? ['bazaar', ...Object.keys(BEAR_ALIASES).flatMap(k => BEAR_ALIASES[k])]
        : [term]
    )

    if (expandedTerms.every(term => haystack.includes(term))) results.push(spaceIndex)
  })

  return results
}

function boardToCanvas(
  coords: [number, number],
  containerSize: { w: number; h: number }
): { x: number; y: number } {
  const BOARD_W = 2690
  const BOARD_H = 1905
  const containerAspect = containerSize.w / containerSize.h
  const boardAspect = BOARD_W / BOARD_H
  let renderedW: number, renderedH: number, offsetX: number, offsetY: number

  if (containerAspect > boardAspect) {
    renderedH = containerSize.h
    renderedW = renderedH * boardAspect
    offsetX = (containerSize.w - renderedW) / 2
    offsetY = 0
  } else {
    renderedW = containerSize.w
    renderedH = renderedW / boardAspect
    offsetX = 0
    offsetY = (containerSize.h - renderedH) / 2
  }

  return {
    x: offsetX + (coords[0] / BOARD_W) * renderedW,
    y: offsetY + (coords[1] / BOARD_H) * renderedH,
  }
}

// Space PBR: absolute scale 0-100
function spacePbrColor(pbr: number): string {
  if (pbr === 0) return '#6b7280'
  if (pbr === 100) return '#16a34a'
  if (pbr >= 75) return '#4ade80'
  if (pbr >= 36) return '#eab308'
  if (pbr >= 21) return '#f97316'
  return '#ef4444'
}


const UNIFIED_PBR_COLOR = (() => {
  const counts: Record<string, number> = {}
  const totals: Record<string, number> = {}

  FULL_SPACE_GUIDE.forEach((e, i) => {
    const pbr = SPACE_PBR[i + 1] ?? 0
    if (e[0] === 'M') {
      for (const mat of e.slice(1)) {
        counts[`mat:${mat}`] = (counts[`mat:${mat}`] ?? 0) + 1
        totals[`mat:${mat}`] = (totals[`mat:${mat}`] ?? 0) + pbr
      }
    } else {
      const l = e[0]?.toLowerCase() ?? ''
      counts[`space:${l}`] = (counts[`space:${l}`] ?? 0) + 1
      totals[`space:${l}`] = (totals[`space:${l}`] ?? 0) + pbr
    }
  })

  const result: Record<string, string> = {}
  for (const key of Object.keys(counts)) {
    const individualPbr = totals[key] / 100 
    const expected = counts[key] * 0.28      
    const diff = individualPbr - expected
    if (diff > 0.28) result[key] = '#22c55e'
    else if (diff >= -0.28) result[key] = '#eab308'
    else result[key] = '#ef4444'
  }
  return result
})()

function getSpacePbr(spaceIndex: number): number | null {
  const entries = FULL_SPACE_GUIDE[spaceIndex - 1]
  if (!entries || entries[0] === 'M') return null

  const label = entries[0]?.toLowerCase() ?? ''
  const aliases = BEAR_ALIASES[label] ?? []
  const isAlias = Object.values(BEAR_ALIASES).some(v => v.includes(label))

  let total = 0
  FULL_SPACE_GUIDE.forEach((e, i) => {
    if (e[0] === 'M') return
    const l = e[0]?.toLowerCase() ?? ''
    const match = l === label
      || (aliases.length > 0 && aliases.includes(l))
      || (isAlias && (BEAR_ALIASES[l]?.includes(label) || l === label))
    if (match) total += SPACE_PBR[i + 1] ?? 0
  })
  return Math.round(total) / 100
}
function useDraggable(initialPos: { x: number; y: number }) {
  const [pos, setPos] = useState(initialPos)
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y })
  }
  const onPointerUp = () => { dragging.current = false }

  return { pos, onPointerDown, onPointerMove, onPointerUp }
}
export default function MapPage() {
  const [query, setQuery] = useState('')
  const [matchedSpaces, setMatchedSpaces] = useState<number[]>([])
  const [selected, setSelected] = useState<SpaceInfo | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })
  const [dimness, setDimness] = useState(100)
  const [randomSpace, setRandomSpace] = useState<number | null>(null)
  const [showPbr, setShowPbr] = useState(false)

  const params = useParams()
  const sessionId = params.id as string
  const { user } = useAuth()
  const { userEntries } = useSessionData(sessionId, user?.email)
  const [scrapbooked, setScrapbooked] = useState<string[]>([])
  const dragCard = useDraggable({ x: 16, y: 16 })
  const dragStats = useDraggable({ x: 16, y: 16 })
  useEffect(() => {
    if (!user || !sessionId) return
    fetch(`/api/scrapbook/${sessionId}`, {
      headers: { 'x-user-id': user.email! }
    })
      .then(r => r.json())
      .then(json => setScrapbooked(json.scrapbooked_materials || []))
  }, [user, sessionId])

  const remainingLevels = useMemo(() =>
    computeRemainingLevels((userEntries || []) as LogicEntry[]),
    [userEntries]
  )

  const neededWeights = useMemo(() =>
    buildNeededWeights(remainingLevels, scrapbooked),
    [remainingLevels, scrapbooked]
  )

  type PathMode =
    | 'idle'
    | 'best-picking-start' | 'best-picking-end' | 'best-result'
    | 'check-picking-start' | 'check-picking-end' | 'check-picking-waypoints' | 'check-result'

  const [pathMode, setPathMode] = useState<PathMode>('idle')
  const [pathStart, setPathStart] = useState<number | null>(null)
  const [pathEnd, setPathEnd] = useState<number | null>(null)
  const [pathWaypoints, setPathWaypoints] = useState<number[]>([])
  const [bestPathResult, setBestPathResult] = useState<ReturnType<typeof findBestPath> | null>(null)
  const [checkPathCandidates, setCheckPathCandidates] = useState<number[][]>([])
  const [highlightedPath, setHighlightedPath] = useState<number[]>([])
  const [showPathStats, setShowPathStats] = useState(false)

  function handlePathSpaceClick(spaceIndex: number) {
    if (pathMode === 'best-picking-start') {
      setPathStart(spaceIndex)
      setPathMode('best-picking-end')
    } else if (pathMode === 'best-picking-end') {
      setPathEnd(spaceIndex)
      const result = findBestPath(pathStart!, spaceIndex, neededWeights, remainingLevels, UNIFIED_PBR_COLOR)
      setBestPathResult(result)
      setHighlightedPath(result?.path ?? [])
      setPathMode('best-result')
      setShowPathStats(true)
    } else if (pathMode === 'check-picking-start') {
      setPathStart(spaceIndex)
      setPathMode('check-picking-end')
    } else if (pathMode === 'check-picking-end') {
      setPathEnd(spaceIndex)
      const paths = findAllPaths(pathStart!, spaceIndex)
      setCheckPathCandidates(paths)
      if (paths.length === 1) {
        setHighlightedPath(paths[0])
        setShowPathStats(true)
        setPathMode('check-result')
      } else {
        setPathMode('check-picking-waypoints')
      }
    } else if (pathMode === 'check-picking-waypoints') {
      const newWaypoints = [...pathWaypoints, spaceIndex]
      setPathWaypoints(newWaypoints)
      const filtered = findPathsThroughWaypoints(pathStart!, pathEnd!, newWaypoints)
      setCheckPathCandidates(filtered)
      if (filtered.length === 1) {
        setHighlightedPath(filtered[0])
        setShowPathStats(true)
        setPathMode('check-result')
      } else if (filtered.length === 0) {
        setPathWaypoints(pathWaypoints)
      }
    }
  }

  function resetPathMode() {
    setPathMode('idle')
    setPathStart(null)
    setPathEnd(null)
    setPathWaypoints([])
    setBestPathResult(null)
    setHighlightedPath([])
    setShowPathStats(false)
    setCheckPathCandidates([])
  }

  const checkPathMaterials = useMemo(() => {
    if (highlightedPath.length === 0) return null
    const mats = getMaterialsOnPath(highlightedPath)
    const covered: { levelId: number; materialsFound: string[] }[] = []
    for (const lvl of remainingLevels) {
      const levelMats = materialList[lvl - 1] || []
      const found = levelMats.filter(m => mats[m])
      if (found.length > 0) covered.push({ levelId: lvl, materialsFound: found })
    }
    covered.sort((a, b) => b.materialsFound.length - a.materialsFound.length)
    return { materialsOnPath: mats, coveredLevels: covered }
  }, [highlightedPath, remainingLevels])

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height })
      }
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const handleSearch = (value: string) => {
    setQuery(value)
    setMatchedSpaces(getMatchingSpaces(value))
    setSelected(null)
    setRandomSpace(null)
  }

  const handleRandom = () => {
    const worldSpaces = Object.entries(WORLD_MAP)
      .filter(([, world]) => world !== null)
      .map(([index]) => Number(index))
    const pick = worldSpaces[Math.floor(Math.random() * worldSpaces.length)]
    setQuery('')
    setMatchedSpaces([])
    setSelected(null)
    setRandomSpace(pick)
  }

  const handleStarClick = (spaceIndex: number) => {
    if (pathMode !== 'idle' && pathMode !== 'best-result' && pathMode !== 'check-result') {
      handlePathSpaceClick(spaceIndex)
      return
    }
    const i = spaceIndex - 1
    const entries = FULL_SPACE_GUIDE[i] ?? []
    const coords = SPACE_COORDINATES[i] as [number, number]
    const world = WORLD_MAP[spaceIndex] ?? null
    setSelected({ index: spaceIndex, entries, world, coords })
  }

  const isMaterial = (entries: string[]) => entries[0] === 'M'

  const allSpaceIndices = useMemo(
    () => SPACE_COORDINATES.map((_, i) => i + 1).filter(i => SPACE_COORDINATES[i - 1]),
    []
  )

  const isPicking = pathMode !== 'idle' && pathMode !== 'best-result' && pathMode !== 'check-result'

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* ── toolbar ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0 flex-wrap">
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search spaces…"
          className="flex-1 min-w-0 bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2 text-sm outline-none"
        />
        {matchedSpaces.length > 0 && (
          <span className="text-gray-500 text-xs shrink-0">
            {matchedSpaces.length} space{matchedSpaces.length !== 1 ? 's' : ''}
          </span>
        )}
        <select
          value={dimness}
          onChange={e => setDimness(Number(e.target.value))}
          className="border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-700 bg-white"
        >
          {[100, 80, 70, 60, 50, 40].map(v => (
            <option key={v} value={v}>{v}%</option>
          ))}
        </select>
        <button
          onClick={handleRandom}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 shrink-0"
        >
          Random Space
        </button>
        <button
          onClick={() => setShowPbr(v => !v)}
          className={`border rounded-lg px-3 py-2 text-sm shrink-0 transition-colors ${
            showPbr
              ? 'bg-emerald-500 border-emerald-600 text-white'
              : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          {showPbr ? 'Hide PBR' : 'Show PBR'}
        </button>
        <button
          onClick={() => { resetPathMode(); setPathMode('best-picking-start') }}
          className={`border rounded-lg px-3 py-2 text-sm shrink-0 ${
            pathMode.startsWith('best')
              ? 'bg-yellow-400 border-yellow-500 text-black'
              : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          Best Path
        </button>
        <button
          onClick={() => { resetPathMode(); setPathMode('check-picking-start') }}
          className={`border rounded-lg px-3 py-2 text-sm shrink-0 ${
            pathMode.startsWith('check')
              ? 'bg-blue-400 border-blue-500 text-white'
              : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          Check Path
        </button>
        {pathMode !== 'idle' && (
          <button
            onClick={resetPathMode}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 shrink-0"
          >
            Cancel
          </button>
        )}
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="text-gray-400 hover:text-gray-700 text-sm px-2"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── board ── */}
<div className="flex-1 relative" ref={containerRef} style={{ overflow: 'hidden' }}>        <Image
          src="/board.png"
          alt="Board"
          fill
          className="object-contain"
          priority
          style={{ filter: `brightness(${dimness}%)` }}
        />

        {/* ── PBR overlay ── */}
        {containerSize.w > 0 && showPbr &&
          allSpaceIndices.map(spaceIndex => {
            const coords = SPACE_COORDINATES[spaceIndex - 1] as [number, number]
            if (!coords) return null
            const pbr = SPACE_PBR[spaceIndex] ?? 0
            if (pbr === 0) return null
            const { x, y } = boardToCanvas(coords, containerSize)
            return (
              <button
                key={`pbr-${spaceIndex}`}
                onClick={() => handleStarClick(spaceIndex)}
                className="absolute flex items-center justify-center rounded-full text-white font-bold shadow-lg transition-transform hover:scale-110"
                style={{
                  left: x,
                  top: y,
                  transform: 'translate(-50%, -50%)',
                  width: 28,
                  height: 28,
                  fontSize: 9,
                  backgroundColor: spacePbrColor(pbr),
                  border: '1.5px solid rgba(255,255,255,0.6)',
                  zIndex: 10,
                  lineHeight: 1,
                }}
              >
                {pbr}
              </button>
            )
          })
        }

        {/* ── search / random star markers ── */}
        {containerSize.w > 0 && !showPbr &&
          [...matchedSpaces, ...(randomSpace ? [randomSpace] : [])].map(spaceIndex => {
            const coords = SPACE_COORDINATES[spaceIndex - 1] as [number, number]
            if (!coords) return null
            const { x, y } = boardToCanvas(coords, containerSize)
            return (
              <button
                key={spaceIndex}
                onClick={() => handleStarClick(spaceIndex)}
                className="absolute"
                style={{ left: x, top: y, transform: 'translate(-50%, -50%)', zIndex: 10 }}
              >
                <img
                  src="/star.png"
                  alt={`Space ${spaceIndex}`}
                  style={{ width: 28, height: 28 }}
                  className="drop-shadow-lg hover:scale-125 transition-transform"
                />
              </button>
            )
          })
        }

        {/* ── instruction banner ── */}
        {isPicking && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-start justify-center pt-4">
            <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {pathMode === 'best-picking-start' && '★ Click your current space'}
              {pathMode === 'best-picking-end' && '★ Click your destination space'}
              {pathMode === 'check-picking-start' && '⬡ Click your start space'}
              {pathMode === 'check-picking-end' && '⬡ Click your end space'}
              {pathMode === 'check-picking-waypoints' &&
                `⬡ ${checkPathCandidates.length} paths remaining — click a space to narrow down`}
            </div>
          </div>
        )}

        {/* ── clickable space pickers (path modes) ── */}
        {containerSize.w > 0 &&
          allSpaceIndices.map(spaceIndex => {
            const coords = SPACE_COORDINATES[spaceIndex - 1] as [number, number]
            if (!coords) return null
            const { x, y } = boardToCanvas(coords, containerSize)
            return (
              <button
                key={`pick-${spaceIndex}`}
                onClick={() => isPicking ? handlePathSpaceClick(spaceIndex) : handleStarClick(spaceIndex)}
                className="absolute rounded-full transition-colors"
                style={{
                  left: x, top: y, transform: 'translate(-50%,-50%)',
                  width: 18, height: 18, zIndex: 25,
                  backgroundColor: isPicking ? 'rgba(255,255,255,0.2)' : 'transparent',
                }}
              />
            )
          })
        }

        {/* ── highlighted path dots ── */}
        {containerSize.w > 0 && highlightedPath.length > 0 &&
          highlightedPath.map((spaceIndex, order) => {
            const coords = SPACE_COORDINATES[spaceIndex - 1] as [number, number]
            if (!coords) return null
            const { x, y } = boardToCanvas(coords, containerSize)
            return (
              <button
                key={`path-${spaceIndex}`}
                onClick={() => handleStarClick(spaceIndex)}
                className="absolute flex items-center justify-center rounded-full bg-yellow-400 text-black text-xs font-bold shadow-lg hover:scale-110 transition-transform"
                style={{ left: x, top: y, transform: 'translate(-50%,-50%)', width: 22, height: 22, zIndex: 15, opacity: 0.9 }}
              >
                {order + 1}
              </button>
            )
          })
        }

        {/* ── path stats panel ── */}
        {showPathStats && (bestPathResult || checkPathMaterials) && (() => {
          const stats = bestPathResult ?? checkPathMaterials!
          const mats = stats.materialsOnPath
          const covered = stats.coveredLevels
          return (
           <div
            className="absolute pointer-events-auto bg-gray-900 border border-yellow-400 rounded-xl shadow-2xl p-4 w-64 z-20 cursor-grab active:cursor-grabbing"
            style={{ left: dragStats.pos.x, top: dragStats.pos.y, touchAction: 'none', pointerEvents: 'auto' }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => { e.stopPropagation(); dragStats.onPointerDown(e) }}
            onPointerMove={dragStats.onPointerMove}
            onPointerUp={dragStats.onPointerUp}
          >
              <div className="flex justify-between items-start mb-3">
                <div className="text-yellow-400 text-xs font-semibold uppercase tracking-widest">
                  {pathMode === 'best-result' ? 'Best Path' : 'Check Path'} — {highlightedPath.length} spaces
                </div>
                <button
  onPointerDown={(e) => e.stopPropagation()}
  onClick={() => setShowPathStats(false)} className="text-gray-500 hover:text-white text-lg leading-none ml-2">✕</button>
              </div>

              <div className="mb-3">
                <div className="text-gray-400 text-xs mb-1">
                  Unique materials on path ({Object.keys(mats).length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.keys(mats).sort((a, b) => {
  // 1. count descending
  const countDiff = mats[b] - mats[a]
  if (countDiff !== 0) return countDiff
  // 2. color: red first, then yellow, then green
  const colorOrder: Record<string, number> = { '#ef4444': 0, '#eab308': 1, '#22c55e': 2 }
  const aColor = colorOrder[UNIFIED_PBR_COLOR[`mat:${a}`] ?? '#22c55e'] ?? 2
  const bColor = colorOrder[UNIFIED_PBR_COLOR[`mat:${b}`] ?? '#22c55e'] ?? 2
  const colorDiff = aColor - bColor
  if (colorDiff !== 0) return colorDiff
  // 3. alphabetical
  return a.localeCompare(b)
}).map(m => {
                    const mpbr = MATERIAL_PBR[m]
                    return (
                      <span
                        key={m}
                        className="text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ backgroundColor: '#374151' }}
                        title={`Material PBR: ${mpbr}`}
                      >
                        {m}{mats[m] > 1 ? ` (${mats[m]})` : ''}{' '}
        {mpbr !== undefined && (
                          <span
                            className="text-[9px] font-bold px-1 rounded"
                            style={{ backgroundColor: UNIFIED_PBR_COLOR[`mat:${m}`] ?? '#22c55e', color: '#fff' }}
                          >
                            {Number.isInteger(mpbr) ? mpbr : mpbr.toFixed(2)}
                          </span>
                        )}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="text-gray-400 text-xs mb-1">
                  Levels with materials on path ({covered.length})
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {covered.map(({ levelId, materialsFound }: { levelId: number; materialsFound: string[] }) => (
                    <div key={levelId} className="bg-gray-800 rounded p-1.5">
                      <div className="text-white text-xs font-medium">
                        {getLevelCode(levelId)} {levelNames[levelId - 1]}
                      </div>
                      <div className="text-gray-400 text-xs">{materialsFound.join(', ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })()}

        {/* ── space info card ── */}
        {selected && (
          <div
            className="absolute pointer-events-auto bg-gray-900 border border-yellow-400 rounded-xl shadow-2xl p-4 w-64 z-20 cursor-grab active:cursor-grabbing"
            style={{ left: dragCard.pos.x, top: dragCard.pos.y, touchAction: 'none', pointerEvents: 'auto' }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => { e.stopPropagation(); dragCard.onPointerDown(e) }}
            onPointerMove={dragCard.onPointerMove}
            onPointerUp={dragCard.onPointerUp}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-1">
                  Space #{selected.index}
                </div>
                {selected.world && (
                  <div className="text-gray-300 text-xs">{selected.world}</div>
                )}
                {/* Space PBR badge — always the raw integer for this one space */}
                {(() => {
                  const pbr = SPACE_PBR[selected.index] ?? null
                  if (pbr === null) return null
                  return (
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-gray-400 text-xs">PBP</span>
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: spacePbrColor(pbr) }}
                      >
                        {pbr}
                      </span>
                    </div>
                  )
                })()}
              </div>
              <button
  onPointerDown={(e) => e.stopPropagation()}
  onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-white text-lg leading-none ml-2"
              >
                ✕
              </button>
            </div>

            {isMaterial(selected.entries) ? (
              <div>
                <div className="text-xs text-gray-400 mb-1">Material Space</div>
                <div className="flex flex-wrap gap-1">
                  {selected.entries.slice(1).map((mat, i) => {
                    const mpbr = MATERIAL_PBR[mat]
                    return (
                      <span
                        key={i}
                        className="bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                      >
                        {mat}
                        {mpbr !== undefined && (
                          <span
                            className="text-[9px] font-bold px-1 rounded"
                            style={{ backgroundColor: UNIFIED_PBR_COLOR[`mat:${mat}`] ?? '#22c55e', color: '#fff' }}
                          >
                            {Number.isInteger(mpbr) ? mpbr : mpbr.toFixed(2)}
                          </span>
                        )}
                      </span>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {selected.entries.map((entry, i) => (
                  <span key={i} className="text-white text-sm flex items-center gap-1">
                    {entry}
                    {i === 0 && (() => {
                      const sum = getSpacePbr(selected.index)
                      if (sum === null || sum === undefined) return null
                      const l = FULL_SPACE_GUIDE[selected.index - 1]?.[0]?.toLowerCase() ?? ''
                      return (
                        <span
                          className="text-[9px] font-bold px-1 rounded"
                          style={{ backgroundColor: UNIFIED_PBR_COLOR[`space:${l}`] ?? '#22c55e', color: '#fff' }}
                        >
                          {Number.isInteger(sum) ? sum : sum.toFixed(2)}
                        </span>
                      )
                    })()}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}