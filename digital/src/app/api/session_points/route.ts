import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const session_id = searchParams.get('session_id')

  const { data, error } = await supabase
    .from('session_points')
    .select('*')
    .eq('session_id', session_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ points: data })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { session_id, user_email, slot, name, points } = body

  const { error } = await supabase.from('session_points').upsert(
  { session_id, user_email, slot, name, points },
  { onConflict: 'session_id,user_email,slot' }
)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { session_id, user_email, slot } = body

  const { error } = await supabase
    .from('session_points')
    .delete()
    .eq('session_id', session_id)
    .eq('user_email', user_email)
    .eq('slot', slot)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}