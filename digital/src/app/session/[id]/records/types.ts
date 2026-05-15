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

export type LevelStat_V1 = {
  buildOrder: number
  bang: 0 | 1
}

export type LevelStat_V3 = {
  buildOrder: number
  star: 0 | 1
  bang: 0 | 1
  save: 0 | 1
}

export type LevelStat_V5 = {
  buildOrder: number
  starOrder: 0 | 1 | 2 | 3 | 4
  bang: 0 | 1
  save: 0 | 1
}

// ─── PER-VERSION PLACEMENT STAT SHAPES ───────────────────────────────────────

export type PlacementStats_V1 = {
  turnsTaken: number
  levelStats: Record<string, LevelStat_V1>
}

export type PlacementStats_V3 = {
  turnsTaken: number
  levelStats: Record<string, LevelStat_V3>
  scrapbook: string[]
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

export type GamePlacement<TStats> = GamePlacementBase & TStats

// ─── DISCRIMINATED GAME UNION ────────────────────────────────────────────────

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
      version: 'v2.0' | 'v3.0' | 'v3.1' | 'v4.2' | 'v4.3'
      placements: GamePlacement<PlacementStats_V3>[]
    })
  | (GameBase & {
      version: 'v5.0'
      placements: GamePlacement<PlacementStats_V5>[]
    })