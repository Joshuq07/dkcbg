import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { recomputeStars } from '@/lib/starLogic'
import { renumberAfterDelete } from '@/lib/renumber'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const session_id = searchParams.get('session_id')

  if (!session_id) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('box_entries')
    .select('*')
    .eq('session_id', session_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ entries: data })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { session_id, level, box_type, user_email, value, lost, global_star } = body

  if (!session_id || !level || !box_type || !user_email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (lost === true) {
    const { error: lostErr } = await supabase
      .from('box_entries')
      .upsert({
        session_id,
        level,
        box_type,
        user_email,
        value,
        lost: true,
      })

    if (lostErr) return NextResponse.json({ error: lostErr.message }, { status: 500 })

    await supabase
      .from('box_entries')
      .delete()
      .eq('session_id', session_id)
      .eq('level', level)
      .eq('user_email', user_email)
      .in('box_type', ['star1', 'star2', 'star3', 'star4'])

    await recomputeStars(session_id, level)

    return NextResponse.json({ ok: true })
  }

  if (box_type === 'number' && lost === false && global_star !== true) {
    const { error: rebuildErr } = await supabase
      .from('box_entries')
      .upsert({
        session_id,
        level,
        box_type: 'number',
        user_email,
        value,
        lost: false,
      })

    if (rebuildErr) return NextResponse.json({ error: rebuildErr.message }, { status: 500 })

    await recomputeStars(session_id, level)

    return NextResponse.json({ ok: true })
  }

  if (global_star === true) {
    const { data: userNumbers } = await supabase
      .from('box_entries')
      .select('value, lost')
      .eq('session_id', session_id)
      .eq('box_type', 'number')
      .eq('user_email', user_email)

    const personalNext =
      (userNumbers
        ?.filter(n => !n.lost)         
        .map(n => Number(n.value))
        .filter(v => !isNaN(v) && v > 0)
        .sort((a, b) => b - a)[0] ?? 0) + 1
    await supabase.from('box_entries').upsert({
      session_id,
      level,
      box_type: 'number',
      user_email,
      value: String(personalNext),
      lost: null,
    })

    await recomputeStars(session_id, level)

    return NextResponse.json({ ok: true })
  }

  const { error } = await supabase.from('box_entries').upsert({
    session_id,
    level,
    box_type,
    user_email,
    value,
    lost: null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (box_type === 'number') {
    await recomputeStars(session_id, level)
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { session_id, level, box_type, user_email, global_star } = body

  if (!session_id || !level || !box_type || !user_email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (global_star === true) {
    await supabase
      .from('box_entries')
      .delete()
      .eq('session_id', session_id)
      .eq('level', level)
      .eq('box_type', 'number')
      .eq('user_email', user_email)

    await supabase
      .from('box_entries')
      .delete()
      .eq('session_id', session_id)
      .eq('level', level)
      .eq('user_email', user_email)
      .in('box_type', ['star1', 'star2', 'star3', 'star4'])

    await recomputeStars(session_id, level)

    return NextResponse.json({ ok: true })
  }

  const { error } = await supabase
    .from('box_entries')
    .delete()
    .eq('session_id', session_id)
    .eq('level', level)
    .eq('box_type', box_type)
    .eq('user_email', user_email)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (box_type === 'number') {
    await renumberAfterDelete(session_id, user_email)
    await recomputeStars(session_id, level)
  }

  return NextResponse.json({ ok: true })
}