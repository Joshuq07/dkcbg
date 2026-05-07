// src/lib/lostLevel.ts
import { supabase } from '@/lib/supabase'

/**
 * LOST LEVEL LOGIC:
 *
 * - Keep the number entry
 * - Mark lost = true
 * - Remove all star1–star4 entries for this user for this level
 * - Does NOT renumber anything
 * - Does NOT affect other levels
 */
export async function markLost(session_id: string, level: number, user_email: string) {
  // 1. Mark the number entry as lost
  await supabase
    .from('box_entries')
    .update({ lost: true })
    .eq('session_id', session_id)
    .eq('level', level)
    .eq('user_email', user_email)
    .eq('box_type', 'number')

  // 2. Remove all star entries for this user for this level
  await supabase
    .from('box_entries')
    .delete()
    .eq('session_id', session_id)
    .eq('level', level)
    .eq('user_email', user_email)
    .in('box_type', ['star1', 'star2', 'star3', 'star4'])
}
