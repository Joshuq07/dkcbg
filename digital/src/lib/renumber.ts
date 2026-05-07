// src/lib/renumber.ts
import { supabase } from '@/lib/supabase'

/**
 * RENUMBER LOGIC (mistake delete):
 *
 * - Only renumbers the user's NON-LOST number entries
 * - Lost levels keep their number and are NOT renumbered
 * - After renumbering, stars will be recomputed by the caller
 */
export async function renumberAfterDelete(session_id: string, user_email: string) {
  // 1. Load all number entries for this user
  const { data: numbers, error } = await supabase
    .from('box_entries')
    .select('*')
    .eq('session_id', session_id)
    .eq('user_email', user_email)
    .eq('box_type', 'number')

  if (error || !numbers) return

  // 2. Filter to NON-LOST entries (lost levels keep their number)
  const active = numbers.filter(n => !n.lost)

  // 3. Sort by numeric value
  active.sort((a, b) => Number(a.value) - Number(b.value))

  // 4. Assign new sequential numbers
  const updates = active.map((entry, index) => ({
    session_id,
    level: entry.level,
    box_type: 'number',
    user_email,
    value: String(index + 1),
    lost: null,
  }))

  // 5. Upsert new numbers
  if (updates.length > 0) {
    await supabase.from('box_entries').upsert(updates)
  }
}
