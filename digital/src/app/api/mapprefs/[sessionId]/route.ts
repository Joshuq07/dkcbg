import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: Request, { params }: { params: { sessionId: string } }) {
  const userId = req.headers.get('x-user-id')
  const { data } = await supabase
    .from('user_map_prefs')
    .select('brightness, ranking, count_inventory, count_scrapbook, use_rand_for_options')
    .eq('session_id', params.sessionId)
    .eq('user_email', userId)
    .maybeSingle()

  return NextResponse.json({
  brightness: data?.brightness ?? null,
  ranking: data?.ranking ?? null,
  count_inventory: data?.count_inventory ?? null,
  count_scrapbook: data?.count_scrapbook ?? null,
  use_rand_for_options: data?.use_rand_for_options ?? null,
})
}

export async function POST(req: Request, { params }: { params: { sessionId: string } }) {
  const { user_email, brightness, ranking, count_inventory, count_scrapbook, use_rand_for_options } = await req.json()
  const { error } = await supabase
    .from('user_map_prefs')
    .upsert(
  {
    session_id: params.sessionId,
    user_email,
    brightness,
    ranking,
    count_inventory,
    count_scrapbook,
    use_rand_for_options,
    updated_at: new Date().toISOString(),
  },
  { onConflict: 'session_id,user_email' }
)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}