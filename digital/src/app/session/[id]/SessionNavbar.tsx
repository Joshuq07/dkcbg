'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/lib/useAuth'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SessionNavbar({ sessionId }: { sessionId: string }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [game, setGame] = useState<string>('dkc1')

  useEffect(() => {
    if (!user?.email || !sessionId) return
    fetch(`/api/sessions/${sessionId}`)
      .then(r => r.json())
      .then(data => {
        const member = (data.members ?? []).find((m: any) => m.user_email === user.email)
        if (member?.game) setGame(member.game)
      })
  }, [user, sessionId])

  useEffect(() => {
    if (!user?.email || !sessionId) return
    const sub = supabase
      .channel(`session_members_game:${sessionId}:${user.email}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'session_members',
          filter: `session_id=eq.${sessionId}`,
        },
        payload => {
          const updated = payload.new as any
          if (updated.user_email === user.email && updated.game) {
            setGame(updated.game)
          }
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(sub) }
  }, [user, sessionId])

  const bgImage = game === 'dkc3' ? '/headerbackground3.png' : game === 'dkc2' ? '/headerbackground2.png' : '/headerbackground1.png'

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '56px' }}>
      <img
        src={bgImage}
        alt=""
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'cover', objectPosition: 'left' }}
      />
      <nav className="absolute inset-0 px-4 py-3 flex items-center gap-6 overflow-x-auto">
        {/* ... rest of your links unchanged ... */}
      </nav>
    </div>
  )
}