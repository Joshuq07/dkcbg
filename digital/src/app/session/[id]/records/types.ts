export type Placement = 1 | 2 | 3 | 4

export type Player = {
  id: string
  name: string
}

export type CharacterId =
  | 'general-tips'
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

export type GamePlacement = {
  playerId: string
  characterId: CharacterId
  place: Placement
  stats?: Record<string, string | number>
}

export type Game = {
  id: string
  date: string           // 'YYYY-MM-DD'
  version: VersionId
  name?: string          // optional display name
  placements: GamePlacement[]
  notes?: string
}

export type VersionId = 'v1.0' | 'v1.1' | 'v2.0' | 'v3.0' | 'v3.1' | 'v4.2' | 'v4.3' | 'v5.0'

export type Version = {
  id: VersionId
  displayName: string
  date: string
  summary: string
  highlights: string[]
}
