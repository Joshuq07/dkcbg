import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const session_id = searchParams.get('session_id')

  const { data, error } = await supabase
    .from('session_members')
    .select('*') 
    .eq('session_id', session_id)
    .order('position')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ members: data })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { session_id, user_email, display_name } = body

  const { error } = await supabase.from('session_members').upsert({
    session_id,
    user_email,
    display_name,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { session_id, user_email, player_name, character_name, game } = body

  const { error } = await supabase
    .from('session_members')
    .update({
      ...(player_name !== undefined && { player_name }),
      ...(character_name !== undefined && { character_name }),
      ...(game !== undefined && { game }),
    })
    .eq('session_id', session_id)
    .eq('user_email', user_email)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { session_id, user_email } = body

  const { error } = await supabase
    .from('session_members')
    .delete()
    .eq('session_id', session_id)
    .eq('user_email', user_email)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
