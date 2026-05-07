import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

export function useSessionData(sessionId, userEmail = null) {
  const [session, setSession] = useState(null)
  const [members, setMembers] = useState([])
  const [entries, setEntries] = useState([])

  // -----------------------------
  // Initial load
  // -----------------------------
  useEffect(() => {
    if (!sessionId) return

    async function load() {
      const s = await fetch(`/api/sessions/${sessionId}`).then(r => r.json())
      setSession(s.session)
      setMembers(s.members ?? [])

      const e = await fetch(`/api/box_entries?session_id=${sessionId}`).then(r => r.json())
      setEntries(e.entries ?? [])
    }

    load()
  }, [sessionId])

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
        () => {
          fetch(`/api/box_entries?session_id=${sessionId}`)
            .then(r => r.json())
            .then(data => setEntries(data.entries ?? []))
        }
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