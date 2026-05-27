import { supabase } from '@/lib/supabase'


export async function renumberAfterDelete(session_id: string, user_email: string) {
  const { data: numbers, error } = await supabase
    .from('box_entries')
    .select('*')
    .eq('session_id', session_id)
    .eq('user_email', user_email)
    .eq('box_type', 'number')

  if (error || !numbers) return

  const active = numbers.filter(n => !n.lost)

  active.sort((a, b) => Number(a.value) - Number(b.value))

  const updates = active.map((entry, index) => ({
    session_id,
    level: entry.level,
    box_type: 'number',
    user_email,
    value: String(index + 1),
    lost: null,
  }))

  if (updates.length > 0) {
    await supabase.from('box_entries').upsert(updates)
  }
}
