import type { Player, Game, Version, CharacterId } from './types'

// ─── PLAYERS ────────────────────────────────────────────────────────────────
// Add/edit players here
export const PLAYERS: Player[] = [
  { id: 'player1', name: 'Player One' },
  { id: 'player2', name: 'Player Two' },
  { id: 'player3', name: 'Player Three' },
  { id: 'player4', name: 'Player Four' },
]

// ─── CHARACTER ORDER ─────────────────────────────────────────────────────────
// Same order as the how-to-play / character guide page
export const CHARACTER_ORDER: CharacterId[] = [
  'donkey-kong',
  'diddy-kong',
  'dixie-kong',
  'kiddy-kong',
  'tiny-kong',
  'lanky-kong',
  'chunky-kong',
  'taj',
  'xananab',
  'klubba',
  'voidco',
  'king-k-rool',
]

export const CHARACTER_NAMES: Record<CharacterId, string> = {
  'general-tips': 'General Tips',
  'donkey-kong': 'Donkey Kong',
  'diddy-kong': 'Diddy Kong',
  'dixie-kong': 'Dixie Kong',
  'kiddy-kong': 'Kiddy Kong',
  'tiny-kong': 'Tiny Kong',
  'lanky-kong': 'Lanky Kong',
  'chunky-kong': 'Chunky Kong',
  'taj': 'Taj',
  'xananab': 'Xananab',
  'klubba': 'Klubba',
  'voidco': 'VoidCo',
  'king-k-rool': 'King K. Rool',
}

// ─── GAMES ───────────────────────────────────────────────────────────────────
// Add new games here. placements array should be in finish order (1st first).
// stats keys are version-specific — just put whatever you want to display on hover.
export const GAMES: Game[] = [
  {
    id: 'game1',
    date: '2024-01-15',
    version: 'v5.0',
    name: 'Game 1',
    placements: [
      {
        playerId: 'player1',
        characterId: 'donkey-kong',
        place: 1,
        stats: {
          'Levels Built': 142,
          'Turns Taken': 312,
          '! Completed': 142,
        },
      },
      {
        playerId: 'player2',
        characterId: 'diddy-kong',
        place: 2,
        stats: {
          'Levels Built': 138,
          'Turns Taken': 315,
          '! Completed': 138,
        },
      },
      {
        playerId: 'player3',
        characterId: 'dixie-kong',
        place: 3,
        stats: {
          'Levels Built': 121,
          'Turns Taken': 315,
          '! Completed': 121,
        },
      },
      {
        playerId: 'player4',
        characterId: 'tiny-kong',
        place: 4,
        stats: {
          'Levels Built': 98,
          'Turns Taken': 315,
          '! Completed': 95,
        },
      },
    ],
    notes: 'First full game at v5.0',
  },
  {
    id: 'game2',
    date: '2024-02-10',
    version: 'v5.0',
    name: 'Game 2',
    placements: [
      {
        playerId: 'player3',
        characterId: 'lanky-kong',
        place: 1,
        stats: {
          'Levels Built': 142,
          'Turns Taken': 289,
          '! Completed': 142,
        },
      },
      {
        playerId: 'player1',
        characterId: 'chunky-kong',
        place: 2,
        stats: {
          'Levels Built': 139,
          'Turns Taken': 291,
          '! Completed': 139,
        },
      },
      {
        playerId: 'player4',
        characterId: 'taj',
        place: 3,
        stats: {
          'Levels Built': 115,
          'Turns Taken': 291,
          '! Completed': 110,
        },
      },
      {
        playerId: 'player2',
        characterId: 'klubba',
        place: 4,
        stats: {
          'Levels Built': 88,
          'Turns Taken': 291,
          '! Completed': 82,
        },
      },
    ],
  },
]

// ─── VERSIONS ────────────────────────────────────────────────────────────────
export const VERSIONS: Version[] = [
  {
    id: 'v1.0',
    displayName: 'v1.0',
    date: '2022-01-01',
    summary: 'Initial release.',
    highlights: ['First playable build', 'Core level building mechanics'],
  },
  {
    id: 'v1.1',
    displayName: 'v1.1',
    date: '2022-03-01',
    summary: 'Balance pass and bug fixes.',
    highlights: ['Adjusted ability costs', 'Fixed several rule ambiguities'],
  },
  {
    id: 'v2.0',
    displayName: 'v2.0',
    date: '2022-07-01',
    summary: 'Major overhaul.',
    highlights: ['New characters added', 'Scrapbook system introduced'],
  },
  {
    id: 'v3.0',
    displayName: 'v3.0',
    date: '2023-01-01',
    summary: 'Music system added.',
    highlights: ['Music pool mechanics', 'Instrument unlockables'],
  },
  {
    id: 'v3.1',
    displayName: 'v3.1',
    date: '2023-04-01',
    summary: 'Polish and balance.',
    highlights: ['Rebalanced negative abilities', 'New target items'],
  },
  {
    id: 'v4.2',
    displayName: 'v4.2',
    date: '2023-08-01',
    summary: 'Digital companion launched.',
    highlights: ['Online session tracking', 'Live level sheet'],
  },
  {
    id: 'v4.3',
    displayName: 'v4.3',
    date: '2023-11-01',
    summary: 'Refinement update.',
    highlights: ['Scrapbook tracking in digital', 'Stats panel'],
  },
  {
    id: 'v5.0',
    displayName: 'v5.0',
    date: '2024-01-01',
    summary: 'Current version. Full character roster.',
    highlights: ['VoidCo added', 'King K. Rool rework', 'Records system'],
  },
]
