import { supabase } from '@/lib/supabase'

export async function markLost(session_id: string, level: number, user_email: string) {
  await supabase
    .from('box_entries')
    .update({ lost: true })
    .eq('session_id', session_id)
    .eq('level', level)
    .eq('user_email', user_email)
    .eq('box_type', 'number')

  await supabase
    .from('box_entries')
    .delete()
    .eq('session_id', session_id)
    .eq('level', level)
    .eq('user_email', user_email)
    .in('box_type', ['star1', 'star2', 'star3', 'star4'])
}
