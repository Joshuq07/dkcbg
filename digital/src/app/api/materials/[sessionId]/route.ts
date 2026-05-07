import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(req: Request, { params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId
  const supabase = createClient(supabaseUrl, supabaseAnon)

  const userId = req.headers.get('x-user-id')

const { data } = await supabase
  .from('user_material_overrides')
  .select('material_counts')
  .eq('session_id', sessionId)
  .eq('user_id', userId)
  .maybeSingle()


  return NextResponse.json({
    material_counts: data?.material_counts || {}
  })
}

export async function POST(req: Request, { params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId
  const body = await req.json()
  const supabase = createClient(supabaseUrl, supabaseAnon)

  const { material_counts, user_id } = body

  const { error } = await supabase
    .from('user_material_overrides')
    .upsert(
      {
        session_id: sessionId,
        user_id,
        material_counts
      },
      {
        onConflict: 'user_id,session_id'
      }
    )

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
