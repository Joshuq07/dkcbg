import { supabase } from '@/lib/supabase'

export async function recomputeStars(session_id: string, level: number) {
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

  const { data: numbers, error: numErr } = await supabase
    .from('box_entries')
    .select('user_email, value, lost')
    .eq('session_id', session_id)
    .eq('level', level)
    .eq('box_type', 'number')
    .in('user_email', memberEmails)

  if (numErr || !numbers) return

  const activeBuilders = new Set(
    numbers
      .filter(n => !n.lost && n.value)
      .map(n => n.user_email)
  )

  const { data: existingStars } = await supabase
    .from('box_entries')
    .select('user_email, value')
    .eq('session_id', session_id)
    .eq('level', level)
    .in('box_type', ['star1', 'star2', 'star3', 'star4'])

  const existingRanked: { email: string; rank: number }[] = (existingStars ?? [])
    .map(s => ({
      email: s.user_email,
      rank: s.value === '★' ? 1 : Number(s.value),
    }))
    .filter(s => !isNaN(s.rank))
    .sort((a, b) => a.rank - b.rank)


  const kept = existingRanked
    .map(s => s.email)
    .filter(email => activeBuilders.has(email))

  const alreadyRanked = new Set(kept)

  const newlyAdded = orderedMembers
    .map(m => m.user_email)
    .filter(email => activeBuilders.has(email) && !alreadyRanked.has(email))

  const finalOrder = [...kept, ...newlyAdded] 

  await supabase
    .from('box_entries')
    .delete()
    .eq('session_id', session_id)
    .eq('level', level)
    .in('box_type', ['star1', 'star2', 'star3', 'star4'])

  if (finalOrder.length === 0) return


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