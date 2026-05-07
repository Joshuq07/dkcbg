import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabase } from '@/lib/supabase'

// PUT /api/cells — upsert a cell entry
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { session_id, row_id, value, icon, label, target_email } = await req.json()
  const email = session.user.email

  // Check if user is host (hosts can edit any cell)
  const { data: sess } = await supabase.from('sessions').select().eq('id', session_id).single()
  const isHost = sess?.host_email === email
  const userEmail = isHost && target_email ? target_email : email

  const { error } = await supabase.from('cell_entries').upsert(
    { session_id, row_id, user_email: userEmail, value, icon, label, updated_at: new Date().toISOString() },
    { onConflict: 'row_id,user_email' }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE /api/cells — remove a cell entry
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { row_id, session_id, target_email } = await req.json()
  const email = session.user.email

  const { data: sess } = await supabase.from('sessions').select().eq('id', session_id).single()
  const isHost = sess?.host_email === email
  const userEmail = isHost && target_email ? target_email : email

  const { error } = await supabase.from('cell_entries')
    .delete()
    .eq('row_id', row_id)
    .eq('user_email', userEmail)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// GET /api/cells?session_id=xxx — get all entries for a session
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const session_id = searchParams.get('session_id')

  const { data, error } = await supabase
    .from('cell_entries')
    .select()
    .eq('session_id', session_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entries: data })
}
