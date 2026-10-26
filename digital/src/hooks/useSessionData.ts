import { useState, useEffect, useMemo, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type Entry = {
  user_email?: string
  [key: string]: any
}

export function useSessionData(
  sessionId: string,
  userEmail?: string | null
) {
  const [session, setSession] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [entries, setEntries] = useState<Entry[]>([])

  

  const requestId = useRef(0)

  // -----------------------------
  // Initial load
  // -----------------------------
  useEffect(() => {
    if (!sessionId) return

    async function load() {
      const s = await fetch(`/api/sessions/${sessionId}`).then(r => r.json())
      setSession(s.session)
      setMembers(s.members ?? [])
      await refetchEntries()
    }

    load()
  }, [sessionId])

  // -----------------------------
  // Fetch entries, ignoring stale responses
  // -----------------------------
  async function refetchEntries() {
    const myId = ++requestId.current
    const data = await fetch(`/api/box_entries?session_id=${sessionId}`).then(r => r.json())

    // A newer request started while this one was in flight, so drop this result
    if (myId !== requestId.current) return

    setEntries(data.entries ?? [])
  }

  // -----------------------------
  // Realtime subscription
  // -----------------------------
  useEffect(() => {
    if (!sessionId) return

    const channel = supabase
      .channel(`box_entries:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'box_entries',
          filter: `session_id=eq.${sessionId}`
        },
        () => { refetchEntries() }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  // -----------------------------
  // USER-SCOPED ENTRIES (NEW)
  // -----------------------------
  const userEntries = useMemo(() => {
    if (!userEmail) return []
    return entries.filter(e => e.user_email === userEmail)
  }, [entries, userEmail])

  return {
    session,
    members,
    entries,      // full session (Session page still uses this)
    userEntries   // Level Builder uses this
  }
}