import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const session_id = searchParams.get('session_id')
  const user_email = req.headers.get('x-user-id')

  const { data, error } = await supabase
    .from('session_preferences')
    .select('preferences')
    .eq('session_id', session_id)
    .eq('user_email', user_email)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ preferences: data?.preferences ?? {} })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { session_id, user_email, preferences } = body

  const { error } = await supabase
    .from('session_preferences')
    .upsert({ session_id, user_email, preferences }, { onConflict: 'session_id,user_email' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}