import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: Request, { params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId
  const userId = req.headers.get('x-user-id')

  const { data } = await supabase
    .from('user_scrapbook')
    .select('scrapbooked_materials')
    .eq('session_id', sessionId)
    .eq('user_email', userId)
    .maybeSingle()

  return NextResponse.json({
    scrapbooked_materials: data?.scrapbooked_materials || []
  })
}

export async function POST(req: Request, { params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId
  const body = await req.json()
  const { user_email, scrapbooked_materials } = body

  const { error } = await supabase
    .from('user_scrapbook')
    .upsert(
      { session_id: sessionId, user_email, scrapbooked_materials },
      { onConflict: 'session_id,user_email' }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}