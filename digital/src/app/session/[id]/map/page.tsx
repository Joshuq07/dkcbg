'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { FULL_SPACE_GUIDE, SPACE_COORDINATES, WORLD_MAP } from '@/lib/dkcbg/data'

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

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

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
      ...searchableEntries,
      ...bearAliases,
      world,
      String(spaceIndex),
      isMaterial ? 'material' : ''
    ]
      .join(' ')
      .toLowerCase()

    const expandedTerms = terms.flatMap(term =>
      term === 'bazaar'
        ? ['bazaar', ...Object.keys(BEAR_ALIASES).flatMap(k => BEAR_ALIASES[k])]
        : [term]
    )

    const allMatch = expandedTerms.every(term => haystack.includes(term))
    if (allMatch) results.push(spaceIndex)
  })

  return results
}

export default function MapPage() {
  const [query, setQuery] = useState('')
  const [matchedSpaces, setMatchedSpaces] = useState<number[]>([])
  const [selected, setSelected] = useState<SpaceInfo | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })
  const [dimness, setDimness] = useState(100)

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height
        })
      }
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const handleSearch = (value: string) => {
    setQuery(value)
    setMatchedSpaces(getMatchingSpaces(value))
    setSelected(null)
  }

  const handleStarClick = (spaceIndex: number) => {
    const i = spaceIndex - 1
    const entries = FULL_SPACE_GUIDE[i] ?? []
    const coords = SPACE_COORDINATES[i] as [number, number]
    const world = WORLD_MAP[spaceIndex] ?? null
    setSelected({ index: spaceIndex, entries, world, coords })
  }

  // Scale factor to map board coords → rendered coords
  const scaleX = containerSize.w / BOARD_WIDTH
  const scaleY = containerSize.h / BOARD_HEIGHT

  const isMaterial = (entries: string[]) => entries[0] === 'M'

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Search bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search spaces…"
          className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2 text-sm outline-none"
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
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="text-gray-400 hover:text-gray-700 text-sm px-2"
          >
            ✕
          </button>
        )}
      </div>

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden" ref={containerRef}>
        <Image
          src="/board.png"
          alt="Board"
          fill
          className="object-contain"
          priority
          style={{ filter: `brightness(${dimness}%)` }}
        />

        {/* Stars */}
        {containerSize.w > 0 &&
          matchedSpaces.map(spaceIndex => {
            const i = spaceIndex - 1
            const coords = SPACE_COORDINATES[i]
            if (!coords) return null

            const BOARD_W = 2690
            const BOARD_H = 1905

            const containerAspect = containerSize.w / containerSize.h
            const boardAspect = BOARD_W / BOARD_H

            let renderedW: number, renderedH: number, offsetX: number, offsetY: number

            if (containerAspect > boardAspect) {
              // letterbox left/right
              renderedH = containerSize.h
              renderedW = renderedH * boardAspect
              offsetX = (containerSize.w - renderedW) / 2
              offsetY = 0
            } else {
              // letterbox top/bottom
              renderedW = containerSize.w
              renderedH = renderedW / boardAspect
              offsetX = 0
              offsetY = (containerSize.h - renderedH) / 2
            }

            const x = offsetX + (coords[0] / BOARD_W) * renderedW
            const y = offsetY + (coords[1] / BOARD_H) * renderedH

            return (
              <button
                key={spaceIndex}
                onClick={() => handleStarClick(spaceIndex)}
                className="absolute"
                style={{
                  left: x,
                  top: y,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
              >
                <img
                  src="/star.png"
                  alt={`Space ${spaceIndex}`}
                  style={{ width: 28, height: 28 }}
                  className="drop-shadow-lg hover:scale-125 transition-transform"
                />
              </button>
            )
          })}

        {/* Info box */}
        {selected && (
          <div
            className="absolute bg-gray-900/95 border border-yellow-400 rounded-xl shadow-2xl p-4 w-64 z-20"
            style={{ top: 16, right: 16 }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-1">
                  Space #{selected.index}
                </div>
                {selected.world && (
                  <div className="text-gray-300 text-xs">{selected.world}</div>
                )}
              </div>
              <button
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
                  {selected.entries.slice(1).map((mat, i) => (
                    <span
                      key={i}
                      className="bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {selected.entries.map((entry, i) => (
                  <span key={i} className="text-white text-sm">
                    {entry}
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
