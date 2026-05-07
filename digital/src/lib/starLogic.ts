// src/lib/starLogic.ts
import { supabase } from '@/lib/supabase'

/**
 * Recomputes star entries for a level WITHOUT scrambling existing order.
 *
 * Strategy:
 * - Existing builders keep their current rank (read from existing star rows)
 * - Newly added builders are appended at the end in member-column order
 * - Removed builders (lost/deleted) are dropped and remaining ranks close up
 *
 * This means we never re-sort by value or created_at — we just diff
 * who is currently ranked vs who should be ranked.
 */
export async function recomputeStars(session_id: string, level: number) {
  // 1. Get all session members ordered by column position
  const { data: members, error: memErr } = await supabase
    .from('session_members')
    .select('user_email, position')
    .eq('session_id', session_id)
    .order('position', { ascending: true })

  if (memErr || !members) return

  const orderedMembers = members
    .filter(m => m.position != null)
    .slice(0, 4)

  if (orderedMembers.length === 0) return

  const memberEmails = orderedMembers.map(m => m.user_email)

  // 2. Get current active (non-lost) number entries for this level
  const { data: numbers, error: numErr } = await supabase
    .from('box_entries')
    .select('user_email, value, lost')
    .eq('session_id', session_id)
    .eq('level', level)
    .eq('box_type', 'number')
    .in('user_email', memberEmails)

  if (numErr || !numbers) return

  // Who is currently an active builder for this level
  const activeBuilders = new Set(
    numbers
      .filter(n => !n.lost && n.value)
      .map(n => n.user_email)
  )

  // 3. Get existing star rows so we can preserve their rank order
  const { data: existingStars } = await supabase
    .from('box_entries')
    .select('user_email, value')
    .eq('session_id', session_id)
    .eq('level', level)
    .in('box_type', ['star1', 'star2', 'star3', 'star4'])

  // Build an ordered list of currently-ranked emails (rank 1 first)
  // by reading the existing star values (★ = rank 1, "2" = rank 2, etc.)
  const existingRanked: { email: string; rank: number }[] = (existingStars ?? [])
    .map(s => ({
      email: s.user_email,
      rank: s.value === '★' ? 1 : Number(s.value),
    }))
    .filter(s => !isNaN(s.rank))
    .sort((a, b) => a.rank - b.rank)

  // 4. Compute new ordered builder list:
  //    - Keep existing ranked builders who are still active (preserve order)
  //    - Append any newly active builders not yet ranked (in member-column order)
  const kept = existingRanked
    .map(s => s.email)
    .filter(email => activeBuilders.has(email))

  const alreadyRanked = new Set(kept)

  const newlyAdded = orderedMembers
    .map(m => m.user_email)
    .filter(email => activeBuilders.has(email) && !alreadyRanked.has(email))

  const finalOrder = [...kept, ...newlyAdded] // rank 1 = index 0

  // 5. Delete all existing star entries for this level
  await supabase
    .from('box_entries')
    .delete()
    .eq('session_id', session_id)
    .eq('level', level)
    .in('box_type', ['star1', 'star2', 'star3', 'star4'])

  if (finalOrder.length === 0) return

  // 6. Re-insert star entries — column slot = member's position index,
  //    star value = rank in build order
  const rankByEmail = new Map<string, number>()
  finalOrder.forEach((email, idx) => {
    rankByEmail.set(email, idx + 1)
  })

  const starRows: any[] = []
  orderedMembers.forEach((member, idx) => {
    const email = member.user_email
    const rank = rankByEmail.get(email)
    if (!rank) return

    starRows.push({
      session_id,
      level,
      box_type: `star${idx + 1}`,
      user_email: email,
      value: rank === 1 ? '★' : String(rank),
      lost: null,
    })
  })

  if (starRows.length > 0) {
    await supabase.from('box_entries').insert(starRows)
  }
}