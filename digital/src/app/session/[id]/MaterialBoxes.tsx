'use client'

import { useState } from 'react'
import { MAT_BOXES, MAT_BOX_SIZE } from '@/lib/boxCoords'

type Props = {
  page: 1 | 2
  greyed: Set<string>
  extras: Record<string, string[]>
  hoveredName: string | null
  selectedMaterial: string
  outline: boolean
  setHoveredName: (n: string | null) => void
  onToggle: (id: string) => void
  onOpenExtra: (level: number) => void
}

const W = 3300
const H = 4740

export default function MaterialBoxes({
  page,
  greyed,
  extras,
  hoveredName,
  selectedMaterial,
  setHoveredName,
  onToggle,
  onOpenExtra,
  outline,
}: Props) {
  const [hoverExtra, setHoverExtra] = useState<number | null>(null)

  return (
    <>
      {MAT_BOXES.filter(b => b.page === page).map(b => {
        const items = extras[String(b.level)] ?? []
        const activeName = selectedMaterial || hoveredName
const extraMatches = items.includes(activeName || '')

       const dimmed =
  !b.isExtra &&
  (greyed.has(b.id) ||
    (activeName !== null && b.name !== activeName))
const highlighted =
  outline && !b.isExtra && !!activeName && b.name === activeName

        return (
          <button
            key={b.id}
            onClick={() => (b.isExtra ? onOpenExtra(b.level) : onToggle(b.id))}
            onMouseEnter={() => {
              if (b.isExtra) setHoverExtra(b.level)
              else setHoveredName(b.name)
            }}
            onMouseLeave={() => {
              setHoverExtra(null)
              setHoveredName(null)
            }}
            className="absolute flex items-center justify-center leading-none"
            style={{
              left: `${(b.x / W) * 100}%`,
              top: `${(b.y / H) * 100}%`,
              width: `${(MAT_BOX_SIZE / W) * 100}%`,
              height: `${(MAT_BOX_SIZE / H) * 100}%`,
              background: dimmed ? 'rgba(128,128,128,0.35)' : 'transparent',
              backdropFilter: dimmed ? 'grayscale(1)' : 'none',
              WebkitBackdropFilter: dimmed ? 'grayscale(1)' : 'none',
              border: 'none',
boxShadow: highlighted ? 'inset 0 0 0 1px #facc15' : 'none',
              cursor: 'pointer',
              padding: 0,
              zIndex: hoverExtra === b.level ? 30 : highlighted ? 6 : 5,
            }}
          >
            {b.isExtra && items.length > 0 && (
              <span
  style={{
    color: !activeName || extraMatches ? '#facc15' : '#9ca3af',
    fontSize: 'clamp(0.4rem, 1.6cqw, 1.4rem)',
    textShadow: '0 0 2px #000',
  }}
>
                ★
              </span>
            )}

            {b.isExtra && items.length > 0 && hoverExtra === b.level && (
              <div
                className="absolute bg-gray-900 text-white rounded-lg shadow-xl text-left whitespace-nowrap pointer-events-none"
                style={{ bottom: '100%', left: '50%', transform: 'translateX(-50%)', padding: '6px 8px', fontSize: 12, lineHeight: 1.3 }}
              >
                {items.map((m, i) => <div key={i}>{m}</div>)}
              </div>
            )}
          </button>
        )
      })}
    </>
  )
}