export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcrypt'

export async function GET() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ sessions: data })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { action } = body

  if (action === 'create') {
    const { name, password, user_email, display_name } = body

    const password_hash = await bcrypt.hash(password, 10)

    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        name,
        password_hash,
        host_email: user_email,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('session_members').insert({
      session_id: session.id,
      user_email,
      display_name,
    })

    return NextResponse.json({ session })
  }

  if (action === 'join') {
    const { sessionId, password, user_email, display_name } = body

    const { data: session, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error || !session)
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })

    const valid = await bcrypt.compare(password, session.password_hash)
    if (!valid) return NextResponse.json({ error: 'Invalid password' }, { status: 401 })

    // Add member if not already in
    await supabase.from('session_members').upsert({
      session_id: sessionId,
      user_email,
      display_name,
    })

    return NextResponse.json({ session })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
