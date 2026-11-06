'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import {
  FULL_SPACE_GUIDE, SPACE_COORDINATES, WORLD_MAP, CONNECTIONS,
  levelNames, getLevelCode, materialList,
  environmentList, resourceList, animalList,
} from '@/lib/dkcbg/data'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { useSessionData } from '@/hooks/useSessionData'
import { computeRemainingLevels, Entry as LogicEntry } from '@/lib/dkcbg/logic'
import {
  findAllPaths, getMaterialsOnPath, buildNeededWeights, findBestPath,
  findPathsThroughWaypoints, SPACE_PBR, MATERIAL_PBR,
} from '@/lib/dkcbg/pathfinding'

interface SpaceInfo {
  index: number
  entries: string[]
  world: string | null
  coords: [number, number]
}

const ALL_MATERIALS = [...environmentList, ...resourceList, ...animalList]

// ── ranking categories ────────────────────────────────────────────────────
const DEFAULT_RANKING = [
  'mat3', 'mat2', 'token', 'funky', 'bazaar', 'swanky', 'mat1',
  'cranky', 'candy', 'wrinkly', 'bonus', 'mat0', 'lose',
]

const CATEGORY_LABELS: Record<string, string> = {
  mat3: 'Material Space — 3 materials you need',
  mat2: 'Material Space — 2 materials you need',
  token: 'Token Space (Camera Piece, Banana Bird, Golden Feather, Crystal Coconut)',
  funky: "Funky's Flights",
  bazaar: 'Bazaar (all bear spaces)',
  swanky: "Swanky's Bonus Bonanza",
  mat1: 'Material Space — 1 material you need',
  cranky: "Cranky's Cabin",
  candy: "Candy's Save Point (and Start)",
  wrinkly: "Wrinkly's Kong Kollege",
  bonus: 'Bonus Spaces (DKC, DKC2, DKC3, ANY)',
  mat0: 'Material Space — 0 materials you need',
  lose: 'Lose a Life',
}

// Spaces the walk may never enter: K. Rool spaces, Queen Banana Bird, finish
const BLOCKED_SPACES = new Set([2, 3, 4, 5, 6])

const TOKEN_LABELS = new Set(['camera piece', 'banana bird', 'golden feather', 'crystal coconut'])

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

function getCanonicalLabel(label: string): string {
  const l = label.toLowerCase()
  for (const [key, aliases] of Object.entries(BEAR_ALIASES)) {
    if (key === l || aliases.includes(l)) return 'bazaar'
  }
  return l
}

function getSpaceCategory(spaceIndex: number, need: Record<string, number>): string | null {
  const entries = FULL_SPACE_GUIDE[spaceIndex - 1]
  if (!entries) return null

  if (entries[0] === 'M') {
    const count = entries.slice(1).filter(m => (need[m] ?? 0) > 0).length
    return count >= 3 ? 'mat3' : count === 2 ? 'mat2' : count === 1 ? 'mat1' : 'mat0'
  }

  const label = getCanonicalLabel(entries[0] ?? '')
  if (TOKEN_LABELS.has(label)) return 'token'
  if (label === "funky's flights") return 'funky'
  if (label === 'bazaar') return 'bazaar'
  if (label === "swanky's bonus bonanza") return 'swanky'
  if (label === "cranky's cabin") return 'cranky'
  if (label === "candy's save point") return 'candy'
  if (label === "wrinkly's kong kollege") return 'wrinkly'
  if (label.endsWith('bonus')) return 'bonus'
  if (label === 'lose a life') return 'lose'
  return null
}

// Every space you could land on after exactly `steps` moves (all branches)
function landingSpaces(start: number, steps: number): number[] {
  let frontier = new Set<number>([start])
  for (let i = 0; i < steps; i++) {
    const next = new Set<number>()
    frontier.forEach(s => {
      for (const t of CONNECTIONS[s] ?? []) {
        if (!BLOCKED_SPACES.has(t)) next.add(t)
      }
    })
    frontier = next
    if (frontier.size === 0) break
  }
  return Array.from(frontier)
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
      const l = getCanonicalLabel(e[0] ?? '')
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

  const label = getCanonicalLabel(entries[0] ?? '')
  let total = 0
  FULL_SPACE_GUIDE.forEach((e, i) => {
    if (e[0] === 'M') return
    if (getCanonicalLabel(e[0] ?? '') === label) total += SPACE_PBR[i + 1] ?? 0
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

  // random number tool
  const [randMax, setRandMax] = useState('')
  const [randResult, setRandResult] = useState('')

  // saved preferences
  const [ranking, setRanking] = useState<string[]>(DEFAULT_RANKING)
  const [countInventory, setCountInventory] = useState(true)
  const [countScrapbook, setCountScrapbook] = useState(true)
  const [prefsHydrated, setPrefsHydrated] = useState(false)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
 const [useRandForOptions, setUseRandForOptions] = useState(false)
  const params = useParams()
  const sessionId = params.id as string
  const { user } = useAuth()
  const { userEntries } = useSessionData(sessionId, user?.email)
  const [scrapbooked, setScrapbooked] = useState<string[]>([])
  const [inventory, setInventory] = useState<Record<string, number>>({})
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

  useEffect(() => {
    if (!user || !sessionId) return
    fetch(`/api/materials/${sessionId}`, {
      headers: { 'x-user-id': user.email! }
    })
      .then(r => r.json())
      .then(json => setInventory(json.material_counts || {}))
  }, [user, sessionId])

  // load prefs
  useEffect(() => {
    if (!user || !sessionId || prefsHydrated) return
    fetch(`/api/mapprefs/${sessionId}`, {
      headers: { 'x-user-id': user.email! }
    })
      .then(r => r.json())
      .then(json => {
        if (typeof json.brightness === 'number') setDimness(json.brightness)
          if (typeof json.use_rand_for_options === 'boolean') setUseRandForOptions(json.use_rand_for_options)
        if (Array.isArray(json.ranking)) {
          const known = json.ranking.filter((k: string) => DEFAULT_RANKING.includes(k))
          const missing = DEFAULT_RANKING.filter(k => !known.includes(k))
          setRanking([...known, ...missing])
        }
        if (typeof json.count_inventory === 'boolean') setCountInventory(json.count_inventory)
        if (typeof json.count_scrapbook === 'boolean') setCountScrapbook(json.count_scrapbook)
        setPrefsHydrated(true)
      })
      .catch(() => setPrefsHydrated(true))
  }, [user, sessionId, prefsHydrated])

  // save prefs
  useEffect(() => {
    if (!user || !sessionId || !prefsHydrated) return
    const t = setTimeout(() => {
      fetch(`/api/mapprefs/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          use_rand_for_options: useRandForOptions,
          user_email: user.email,
          brightness: dimness,
          ranking,
          count_inventory: countInventory,
          count_scrapbook: countScrapbook,
        }),
      })
    }, 400)
    return () => clearTimeout(t)
  }, [dimness, ranking, countInventory, countScrapbook, useRandForOptions, sessionId, user, prefsHydrated])

  const remainingLevels = useMemo(() =>
    computeRemainingLevels((userEntries || []) as LogicEntry[]),
    [userEntries]
  )

  const neededWeights = useMemo(() =>
    buildNeededWeights(remainingLevels, scrapbooked),
    [remainingLevels, scrapbooked]
  )

  // how many of each material you still need (remaining levels + scrapbook − inventory)
  const materialNeed = useMemo(() => {
    const need: Record<string, number> = {}
    for (const lvl of remainingLevels) {
      for (const m of materialList[lvl - 1] || []) need[m] = (need[m] || 0) + 1
    }
    if (countScrapbook) {
      for (const m of ALL_MATERIALS) {
        if (!scrapbooked.includes(m)) need[m] = (need[m] || 0) + 1
      }
    }
    if (countInventory) {
      for (const m of Object.keys(need)) {
        need[m] = Math.max(0, need[m] - (inventory[m] || 0))
      }
    }
    return need
  }, [remainingLevels, scrapbooked, inventory, countInventory, countScrapbook])

  type PathMode =
    | 'idle'
    | 'best-picking-start' | 'best-picking-end' | 'best-result'
    | 'check-picking-start' | 'check-picking-end' | 'check-picking-waypoints' | 'check-result'
    | 'opt-start' | 'opt-roll' | 'opt-result'

  const [pathMode, setPathMode] = useState<PathMode>('idle')
  const [pathStart, setPathStart] = useState<number | null>(null)
  const [pathEnd, setPathEnd] = useState<number | null>(null)
  const [pathWaypoints, setPathWaypoints] = useState<number[]>([])
  const [bestPathResult, setBestPathResult] = useState<ReturnType<typeof findBestPath> | null>(null)
  const [checkPathCandidates, setCheckPathCandidates] = useState<number[][]>([])
  const [highlightedPath, setHighlightedPath] = useState<number[]>([])
  const [showPathStats, setShowPathStats] = useState(false)

  // Show Options / Best Option
  const [optKind, setOptKind] = useState<'show' | 'best'>('show')
  const [optStart, setOptStart] = useState<number | null>(null)
  const [optRoll, setOptRoll] = useState<number | null>(null)
  const [rollInput, setRollInput] = useState('')
 

  const optResults = useMemo(() => {
    if (pathMode !== 'opt-result' || optStart === null || optRoll === null) return []
    const spaces = landingSpaces(optStart, optRoll)

    if (optKind === 'show') {
      return spaces.map(space => ({ space, rank: null as number | null }))
    }

    const items = spaces
      .map(space => ({
        space,
        idx: ranking.indexOf(getSpaceCategory(space, materialNeed) ?? ''),
      }))
      .filter(x => x.idx >= 0)

    const unique = Array.from(new Set(items.map(i => i.idx))).sort((a, b) => a - b)
    return items.map(i => ({
      space: i.space,
      rank: unique.indexOf(i.idx) + 1 as number | null,
    }))
  }, [pathMode, optStart, optRoll, optKind, ranking, materialNeed])

  function submitRoll() {
    const n = parseInt(rollInput, 10)
    if (optStart === null || isNaN(n) || n < 1 || n > 300) return
    setOptRoll(n)
    setPathMode('opt-result')
  }

  function handlePathSpaceClick(spaceIndex: number) {
    if (pathMode === 'opt-start' || pathMode === 'opt-roll') {
  setOptStart(spaceIndex)
  const n = parseInt(randMax, 10)
  if (useRandForOptions && !isNaN(n) && n >= 1) {
    setOptRoll(n)
    setPathMode('opt-result')
  } else {
    setRollInput('')
    setPathMode('opt-roll')
  }
} else if (pathMode === 'best-picking-start') {
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
    setOptStart(null)
    setOptRoll(null)
    setRollInput('')
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

  const handleRandomNumber = () => {
    const n = parseInt(randMax, 10)
    if (isNaN(n) || n < 1) return
    setRandResult(String(Math.floor(Math.random() * n) + 1))
  }

  const handleStarClick = (spaceIndex: number) => {
    if (pathMode !== 'idle' && !pathMode.endsWith('-result')) {
      handlePathSpaceClick(spaceIndex)
      return
    }
    const i = spaceIndex - 1
    const entries = FULL_SPACE_GUIDE[i] ?? []
    const coords = SPACE_COORDINATES[i] as [number, number]
    const world = WORLD_MAP[spaceIndex] ?? null
    setSelected({ index: spaceIndex, entries, world, coords })
  }

  function moveRank(from: number, to: number) {
    if (to < 0 || to >= ranking.length || from === to) return
    setRanking(prev => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  const isMaterial = (entries: string[]) => entries[0] === 'M'

  const allSpaceIndices = useMemo(
    () => SPACE_COORDINATES.map((_, i) => i + 1).filter(i => SPACE_COORDINATES[i - 1]),
    []
  )

  const isPicking = pathMode !== 'idle' && !pathMode.endsWith('-result')
  const optActive = pathMode.startsWith('opt')

  const rowBtn = 'border rounded-lg px-3 py-2 text-sm shrink-0'
  const rowBtnIdle = 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* ── toolbar (2 rows) ── */}
      <div className="bg-white border-b border-gray-200 shrink-0">
        {/* Row 1 */}
        <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
          <input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search spaces…"
            className="flex-1 min-w-[180px] bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2 text-sm outline-none"
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="text-gray-400 hover:text-gray-700 text-sm px-1"
            >
              ✕
            </button>
          )}
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
          <button onClick={handleRandom} className={`${rowBtn} ${rowBtnIdle}`}>
            Random Space
          </button>

          {/* random number tool */}
          <input
            type="number"
            min={1}
            value={randMax}
            onChange={e => setRandMax(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleRandomNumber() }}
            placeholder="Max #"
            className="w-24 border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-800 bg-white"
          />
          <input
            type="text"
            readOnly
            value={randResult}
            placeholder="Result"
            className="w-20 border border-gray-200 rounded-lg px-2 py-2 text-sm text-center font-semibold text-gray-900 bg-gray-50"
          />
          <button onClick={handleRandomNumber} className={`${rowBtn} ${rowBtnIdle}`}>
            Random
          </button>
        </div>

        {/* Row 2 */}
        <div className="flex items-center gap-3 px-4 pb-3 flex-wrap">
          <button onClick={() => setShowOptionsMenu(true)} className={`${rowBtn} ${rowBtnIdle}`}>
            Options
          </button>
          <button
            onClick={() => {
  resetPathMode()
  setOptKind('show')
  const n = parseInt(randMax, 10)
  if (useRandForOptions && !isNaN(n) && n >= 1) {
    setPathMode('opt-start')
  } else {
    setPathMode('opt-start')
  }
}}
            className={`${rowBtn} ${optActive && optKind === 'show' ? 'bg-yellow-400 border-yellow-500 text-black' : rowBtnIdle}`}
          >
            Show Options
          </button>
          <button
            onClick={() => { resetPathMode(); setOptKind('best'); setPathMode('opt-start') }}
            className={`${rowBtn} ${optActive && optKind === 'best' ? 'bg-yellow-400 border-yellow-500 text-black' : rowBtnIdle}`}
          >
            Best Option
          </button>
          <button
            onClick={() => { resetPathMode(); setPathMode('check-picking-start') }}
            className={`${rowBtn} ${pathMode.startsWith('check') ? 'bg-blue-400 border-blue-500 text-white' : rowBtnIdle}`}
          >
            Check Path
          </button>
          <button
            onClick={() => setShowPbr(v => !v)}
            className={`${rowBtn} transition-colors ${showPbr ? 'bg-emerald-500 border-emerald-600 text-white' : rowBtnIdle}`}
          >
            {showPbr ? 'Hide PBP' : 'Show PBP'}
          </button>
          {pathMode !== 'idle' && (
            <button onClick={resetPathMode} className={`${rowBtn} ${rowBtnIdle}`}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── board ── */}
      <div className="flex-1 relative" ref={containerRef} style={{ overflow: 'hidden' }}>
        <Image
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
        {isPicking && pathMode !== 'opt-roll' && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-start justify-center pt-4">
            <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {pathMode === 'opt-start' && '★ Click the space you are on'}
              {pathMode === 'best-picking-start' && '★ Click your current space'}
              {pathMode === 'best-picking-end' && '★ Click your destination space'}
              {pathMode === 'check-picking-start' && '⬡ Click your start space'}
              {pathMode === 'check-picking-end' && '⬡ Click your end space'}
              {pathMode === 'check-picking-waypoints' &&
                `⬡ ${checkPathCandidates.length} paths remaining — click a space to narrow down`}
            </div>
          </div>
        )}

        {/* ── roll input ── */}
        {pathMode === 'opt-roll' && (
          <div className="absolute inset-x-0 top-4 z-30 flex justify-center pointer-events-none">
            <div className="pointer-events-auto bg-black/85 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <span>Space #{optStart} — enter your roll:</span>
              <input
                autoFocus
                type="number"
                min={1}
                value={rollInput}
                onChange={e => setRollInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') submitRoll() }}
                className="w-16 text-black rounded px-2 py-0.5"
              />
              <button
                onClick={submitRoll}
                className="bg-yellow-400 text-black rounded px-3 py-0.5 font-semibold"
              >
                Go
              </button>
            </div>
          </div>
        )}

        {pathMode === 'opt-result' && (
          <div className="absolute inset-x-0 top-4 z-30 flex justify-center pointer-events-none">
            <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm">
              Roll {optRoll} from #{optStart} — {optResults.length} space{optResults.length !== 1 ? 's' : ''}
              {optKind === 'best' ? ' (1 = best)' : ''}
            </div>
          </div>
        )}

        {/* ── clickable space pickers ── */}
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

        {/* ── start-space ring for options ── */}
        {containerSize.w > 0 && optActive && optStart !== null && (() => {
          const coords = SPACE_COORDINATES[optStart - 1] as [number, number]
          if (!coords) return null
          const { x, y } = boardToCanvas(coords, containerSize)
          return (
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                left: x, top: y, transform: 'translate(-50%,-50%)',
                width: 26, height: 26, zIndex: 14,
                border: '3px solid #22c55e',
                boxShadow: '0 0 6px rgba(0,0,0,0.6)',
              }}
            />
          )
        })()}

        {/* ── Show Options / Best Option result stars ── */}
        {containerSize.w > 0 && pathMode === 'opt-result' &&
          optResults.map(r => {
            const coords = SPACE_COORDINATES[r.space - 1] as [number, number]
            if (!coords) return null
            const { x, y } = boardToCanvas(coords, containerSize)
            return (
              <button
                key={`opt-${r.space}`}
                onClick={() => handleStarClick(r.space)}
                className="absolute flex items-center justify-center"
                style={{
                  left: x, top: y, transform: 'translate(-50%,-50%)',
                  width: 32, height: 32, zIndex: 26,
                }}
              >
                <img
                  src="/star.png"
                  alt={`Space ${r.space}`}
                  style={{ width: 32, height: 32 }}
                  className="absolute inset-0 drop-shadow-lg"
                />
                {r.rank !== null && (
                  <span
                    className="relative font-bold"
                    style={{ fontSize: 12, color: '#111', textShadow: '0 0 3px #fff, 0 0 3px #fff' }}
                  >
                    {r.rank}
                  </span>
                )}
              </button>
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
              className="absolute pointer-events-auto bg-gray-900 border border-yellow-400 rounded-xl shadow-2xl p-4 w-64 z-40 cursor-grab active:cursor-grabbing"
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
                  onClick={() => setShowPathStats(false)}
                  className="text-gray-500 hover:text-white text-lg leading-none ml-2"
                >
                  ✕
                </button>
              </div>

              <div className="mb-3">
                <div className="text-gray-400 text-xs mb-1">
                  Unique materials on path ({Object.keys(mats).length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.keys(mats).sort((a, b) => {
                    const countDiff = mats[b] - mats[a]
                    if (countDiff !== 0) return countDiff
                    const colorOrder: Record<string, number> = { '#ef4444': 0, '#eab308': 1, '#22c55e': 2 }
                    const aColor = colorOrder[UNIFIED_PBR_COLOR[`mat:${a}`] ?? '#22c55e'] ?? 2
                    const bColor = colorOrder[UNIFIED_PBR_COLOR[`mat:${b}`] ?? '#22c55e'] ?? 2
                    if (aColor !== bColor) return aColor - bColor
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
            className="absolute pointer-events-auto bg-gray-900 border border-yellow-400 rounded-xl shadow-2xl p-4 w-64 z-40 cursor-grab active:cursor-grabbing"
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
    <div className="flex flex-wrap gap-1 mb-2">
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
    {(() => {
      const spaceMats = new Set(selected.entries.slice(1))
      const covered = remainingLevels
        .map(lvl => ({
          levelId: lvl,
          materialsFound: (materialList[lvl - 1] || []).filter(m => spaceMats.has(m)),
        }))
        .filter(x => x.materialsFound.length > 0)
        .sort((a, b) => b.materialsFound.length - a.materialsFound.length)
      if (covered.length === 0) return null
      return (
        <div>
          <div className="text-gray-400 text-xs mb-1">
            Levels with materials here ({covered.length})
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {covered.map(({ levelId, materialsFound }) => (
              <div key={levelId} className="bg-gray-800 rounded p-1.5">
                <div className="text-white text-xs font-medium">
                  {getLevelCode(levelId)} {levelNames[levelId - 1]}
                </div>
                <div className="text-gray-400 text-xs">{materialsFound.join(', ')}</div>
              </div>
            ))}
          </div>
        </div>
      )
    })()}
  </div>
            ) : (
              <div className="flex flex-col gap-1">
                {selected.entries.map((entry, i) => (
                  <span key={i} className="text-white text-sm flex items-center gap-1">
                    {entry}
                    {i === 0 && (() => {
                      const sum = getSpacePbr(selected.index)
                      if (sum === null || sum === undefined) return null
                      const l = getCanonicalLabel(FULL_SPACE_GUIDE[selected.index - 1]?.[0] ?? '')
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

      {/* ── Options menu ── */}
      {showOptionsMenu && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
          onClick={() => setShowOptionsMenu(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[85vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-gray-900">Map Options</h2>
              <button
                onClick={() => setShowOptionsMenu(false)}
                className="text-gray-400 hover:text-gray-700 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-4 space-y-5">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-800">What counts as “needed”</div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={countInventory}
                    onChange={e => setCountInventory(e.target.checked)}
                  />
                  Subtract materials in my inventory
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={countScrapbook}
                    onChange={e => setCountScrapbook(e.target.checked)}
                  />
                  Include unscrapbooked materials
                </label>
              </div>
<div className="space-y-2">
  <div className="text-sm font-semibold text-gray-800">Random number</div>
  <label className="flex items-center gap-2 text-sm cursor-pointer">
    <input
      type="checkbox"
      checked={useRandForOptions}
      onChange={e => setUseRandForOptions(e.target.checked)}
    />
    Use random number box for Show/Best Options
  </label>
  <p className="text-xs text-gray-500">
    When checked, clicking Show Options or Best Options will use the number in the Max # box as the roll automatically.
  </p>
</div>
              <div>
                <div className="text-sm font-semibold text-gray-800 mb-1">Space ranking</div>
                <p className="text-xs text-gray-500 mb-2">
                  Drag or use the arrows. Rank 1 is best for Best Option.
                </p>
                <ul className="space-y-1">
                  {ranking.map((key, i) => (
                    <li
                      key={key}
                      draggable
                      onDragStart={() => setDragIdx(i)}
                      onDragOver={e => e.preventDefault()}
                      onDrop={() => {
                        if (dragIdx !== null) moveRank(dragIdx, i)
                        setDragIdx(null)
                      }}
                      className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1.5 bg-white cursor-grab"
                    >
                      <span className="w-6 text-center text-xs font-bold text-gray-500">{i + 1}</span>
                      <span className="flex-1 text-sm text-gray-800">{CATEGORY_LABELS[key]}</span>
                      <button
                        onClick={() => moveRank(i, i - 1)}
                        disabled={i === 0}
                        className="px-1.5 text-gray-600 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveRank(i, i + 1)}
                        disabled={i === ranking.length - 1}
                        className="px-1.5 text-gray-600 disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-2 px-5 py-4 border-t border-gray-100 shrink-0">
              <button
                onClick={() => setRanking(DEFAULT_RANKING)}
                className="flex-1 bg-gray-200 text-gray-800 rounded px-3 py-2 text-sm hover:bg-gray-300"
              >
                Reset to default
              </button>
              <button
                onClick={() => setShowOptionsMenu(false)}
                className="flex-1 bg-blue-600 text-white rounded px-3 py-2 text-sm hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}