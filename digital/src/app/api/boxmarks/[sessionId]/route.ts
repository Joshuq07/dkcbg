import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: Request, { params }: { params: { sessionId: string } }) {
  const userId = req.headers.get('x-user-id')
  const { data } = await supabase
    .from('user_box_marks')
    .select('greyed, extras')
    .eq('session_id', params.sessionId)
    .eq('user_email', userId)
    .maybeSingle()

  return NextResponse.json({
    greyed: data?.greyed || [],
    extras: data?.extras || {},
  })
}

export async function POST(req: Request, { params }: { params: { sessionId: string } }) {
  const { user_email, greyed, extras } = await req.json()
  const { error } = await supabase
    .from('user_box_marks')
    .upsert(
      { session_id: params.sessionId, user_email, greyed, extras, updated_at: new Date().toISOString() },
      { onConflict: 'session_id,user_email' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}