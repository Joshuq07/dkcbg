import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sessionId = params.id

  const { data: session, error: sErr } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (sErr || !session)
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })

  const { data: members } = await supabase
    .from('session_members')
    .select('*')
    .eq('session_id', sessionId)
    .order('position')

  return NextResponse.json({
    session,
    members,
  })
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sessionId = params.id
  const body = await req.json()
  const { mode } = body

  const { error } = await supabase
    .from('sessions')
    .update({ mode })
    .eq('id', sessionId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session_id = params.id

  await supabase
    .from('box_entries')
    .delete()
    .eq('session_id', session_id)

  await supabase
    .from('session_members')
    .delete()
    .eq('session_id', session_id)

  await supabase
    .from('sessions')
    .delete()
    .eq('id', session_id)

  return NextResponse.json({ ok: true })
}

