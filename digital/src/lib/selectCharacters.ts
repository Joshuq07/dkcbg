import type { CharacterId } from '@/lib/types'


export const PLACEMENT_FILE_PREFIX: Record<CharacterId, string> = {
  'donkey-kong': 'dk',
  'diddy-kong': 'diddy',
  'dixie-kong': 'dixie',
  'kiddy-kong': 'kiddy',
  'tiny-kong': 'tiny',
  'lanky-kong': 'lanky',
  'chunky-kong': 'chunky',
  'taj': 'taj',
  'xananab': 'xananab',
  'klubba': 'klubba',
  'voidco': 'voidco',
  'king-k-rool': 'krool',
}

// Order here = order used for "first & second" in duo file names
const ORDER: CharacterId[] = [
  'donkey-kong', 'diddy-kong', 'dixie-kong', 'kiddy-kong',
  'tiny-kong', 'lanky-kong', 'chunky-kong', 'taj',
  'xananab', 'klubba', 'voidco', 'king-k-rool',
]

// Display names stored in session_members.character_name -> id
const LABEL_TO_ID: Record<string, CharacterId> = {
  'Donkey Kong': 'donkey-kong',
  'Diddy Kong': 'diddy-kong',
  'Dixie Kong': 'dixie-kong',
  'Kiddy Kong': 'kiddy-kong',
  'Tiny Kong': 'tiny-kong',
  'Lanky Kong': 'lanky-kong',
  'Chunky Kong': 'chunky-kong',
  'Taj': 'taj',
  'Xananab': 'xananab',
  'Klubba': 'klubba',
  'VoidCo': 'voidco',
  'King K. Rool': 'king-k-rool',
}

/** Returns the /public path of the select-screen image, or null if not ready. */
export function selectCharacterSrc(
  names: (string | null | undefined)[],
  isTeam: boolean
): string | null {
  const ids = names
    .filter((n): n is string => !!n)
    .map(n => LABEL_TO_ID[n])
    .filter((id): id is CharacterId => !!id)

  if (!isTeam) {
    if (ids.length < 1) return null
    return `/SelectCharacters/Solo/${PLACEMENT_FILE_PREFIX[ids[0]]}.png`
  }

  if (ids.length < 2) return null
  const [a, b] = [...ids].sort((x, y) => ORDER.indexOf(x) - ORDER.indexOf(y))
  return encodeURI(
    `/SelectCharacters/Duo/${PLACEMENT_FILE_PREFIX[a]} & ${PLACEMENT_FILE_PREFIX[b]}.png`
  )
}