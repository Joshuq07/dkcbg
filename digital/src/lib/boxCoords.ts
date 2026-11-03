import raw from './boxCoords.json'

export type MatBox = {
  id: string        // "level-indexWithinLevel", e.g. "38-1"
  page: 1 | 2
  x: number
  y: number
  name: string
  level: number     // 0-based, matches materialList[level]
  isExtra: boolean
}

type RawEntry = { x: number; y: number; name: string; level: number }

const counters: Record<number, number> = {}

function build(entries: RawEntry[], page: 1 | 2): MatBox[] {
  return entries.map(e => {
    const idx = counters[e.level] ?? 0
    counters[e.level] = idx + 1
    return {
      id: `${e.level}-${idx}`,
      page,
      x: e.x,
      y: e.y,
      name: e.name,
      level: e.level,
      isExtra: e.name === 'Extra',
    }
  })
}

export const MAT_BOXES: MatBox[] = [
  ...build(raw.images.page1.entries, 1),
  ...build(raw.images.page2.entries, 2),
]

export const MAT_BOX_SIZE = 64