import type { BoxEntry } from './types'

export function computePercentage(
  entries: BoxEntry[],
  memberEmails: string[],
  level: number
): number {
  if (memberEmails.length === 0) return 0

  const haveNumber = new Set(
    entries
      .filter(
        e =>
          e.level === level &&
          e.box_type === 'number' &&
          e.value &&
          !e.lost
      )
      .map(e => e.user_email)
  )

  const count = memberEmails.filter(e => haveNumber.has(e)).length
  return Math.round((count / memberEmails.length) * 100)
}
