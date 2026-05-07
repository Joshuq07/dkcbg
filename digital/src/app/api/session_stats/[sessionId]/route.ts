import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: Request, { params }: { params: { sessionId: string } }) {
  const session_id = params.sessionId
  const { searchParams } = new URL(req.url)
  const user_email = searchParams.get('user_email')

  if (!user_email) {
    return NextResponse.json({ error: 'Missing user_email' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('box_entries')
    .select('*')
    .eq('session_id', session_id)
    .eq('user_email', user_email)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const built = data.filter(e => e.box_type === 'number' && e.value && !e.lost).length
  const checks = data.filter(e => e.box_type === 'check' && e.value && !e.lost).length
  const bangs = data.filter(e => e.box_type === 'bang' && e.value && !e.lost).length

  return NextResponse.json({
    built,
    checks,
    bangs,
  })
}
