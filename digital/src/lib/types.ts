export type Placement = 1 | 2 | 3 | 4

export type Player = {
  id: string
  name: string
}

export type CharacterId =
  | 'donkey-kong'
  | 'diddy-kong'
  | 'dixie-kong'
  | 'kiddy-kong'
  | 'tiny-kong'
  | 'lanky-kong'
  | 'chunky-kong'
  | 'taj'
  | 'xananab'
  | 'klubba'
  | 'voidco'
  | 'king-k-rool'

export type StatValue = string | number | boolean

export type StatType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'

export type StatDefinition = {
  key: string
  label: string
  type: StatType
}

export type VersionId =
  | 'v1.0'
  | 'v1.1'
  | 'v2.0'
  | 'v3.0'
  | 'v3.1'
  | 'v4.2'
  | 'v4.3'
  | 'v5.0'

export type Version = {
  id: VersionId
  displayName: string
  date: string
  summary: string
  highlights: string[]
  statsSchema: StatDefinition[]
}

// ─── PER-VERSION LEVEL STAT SHAPES ───────────────────────────────────────────

/** v1.0, v1.1 — only build order tracked; checkmark = 1, blank = 0 */
export type LevelStat_V1 = {
  buildOrder: number
}

/** v2.0 — build order + bonus (was "bang") + save */
export type LevelStat_V2 = {
  buildOrder: number
  bonus: 0 | 1
  save: 0 | 1
}

/** v3.0, v3.1, v4.2, v4.3 — build order + star + bonus + save */
export type LevelStat_V3 = {
  buildOrder: number
  star: 0 | 1
  bonus: 0 | 1
  save: 0 | 1
}

/** v5.0 — build order + ordered star (1-4) + bonus + save */
export type LevelStat_V5 = {
  buildOrder: number
  starOrder: 0 | 1 | 2 | 3 | 4
  bonus: 0 | 1
  save: 0 | 1
}

// ─── PER-VERSION PLACEMENT STAT SHAPES ───────────────────────────────────────

export type PlacementStats_V1 = {
  turnsTaken: number
  levelStats: Record<string, LevelStat_V1>
}

export type PlacementStats_V2 = {
  turnsTaken: number
  levelStats: Record<string, LevelStat_V2>
}

/** v3.0, v3.1 */
export type PlacementStats_V3 = {
  turnsTaken: number
  levelStats: Record<string, LevelStat_V3>
  scrapbook: string[]
}

/** v4.2 — adds musicPoints and bananaBirdsReturned */
export type PlacementStats_V4_2 = {
  turnsTaken: number
  levelStats: Record<string, LevelStat_V3>
  scrapbook: string[]
  points: number
  completed: string[]
  bananaBirdsReturned: number
}

/** v4.3 — adds songsCompleted */
export type PlacementStats_V4_3 = {
  turnsTaken: number
  levelStats: Record<string, LevelStat_V3>
  scrapbook: string[]
  points: number
  completed: string[]
  bananaBirdsReturned: number
}

export type PlacementStats_V5 = {
  turnsTaken: number
  levelStats: Record<string, LevelStat_V5>
  scrapbook: string[]
}

export type GamePlacementBase = {
  playerId: string
  characterId: CharacterId
  place: Placement
  teamId?: string
}

export type GamePlacement<TStats extends object> = TStats & GamePlacementBase

type GameBase = {
  id: string
  date: string
  name?: string
  notes?: string
}

export type Game =
  | (GameBase & {
      version: 'v1.0' | 'v1.1'
      placements: GamePlacement<PlacementStats_V1>[]
    })
  | (GameBase & {
      version: 'v2.0'
      placements: GamePlacement<PlacementStats_V2>[]
    })
  | (GameBase & {
      version: 'v3.0' | 'v3.1'
      placements: GamePlacement<PlacementStats_V3>[]
    })
  | (GameBase & {
      version: 'v4.2'
      placements: GamePlacement<PlacementStats_V4_2>[]
    })
  | (GameBase & {
      version: 'v4.3'
      placements: GamePlacement<PlacementStats_V4_3>[]
    })
  | (GameBase & {
      version: 'v5.0'
      placements: GamePlacement<PlacementStats_V5>[]
    })

export type BoxEntry = {
  session_id: string
  level: number
  box_type: string
  user_email: string
  value: string | null
  star: boolean | null
  lost: boolean | null
}