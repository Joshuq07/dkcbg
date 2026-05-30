export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('achievement_completions')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ completions: data ?? [] })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { achievement_name, user_email, display_name, character_name, player_id, game_number } = body
  const { data, error } = await supabase
    .from('achievement_completions')
    .insert({ achievement_name, user_email, display_name, character_name, player_id, game_number })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ completion: data })
}