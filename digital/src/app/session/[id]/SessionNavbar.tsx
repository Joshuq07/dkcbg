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

        <Link href="/sessions" className="relative z-10 flex items-center flex-shrink-0">
          <img src="/backlogo.png" alt="Back" style={{ height: '27px' }} />
        </Link>

        <Link href={`/session/${sessionId}`} className="relative z-10 shrink-0">
          <img src="/gamelogo.png" alt="Level Sheet" style={{ height: '27px' }} />
        </Link>

        <Link href={`/session/${sessionId}/levelbuilder`} className="relative z-10 shrink-0">
          <img src="/levelbuilderlogo.png" alt="Materials" style={{ height: '27px' }} />
        </Link>

        <Link href={`/session/${sessionId}/map`} className="relative z-10 shrink-0">
          <img src="/maplocationfinderlogo.png" alt="Map/Location Finder" style={{ height: '27px' }} />
        </Link>

        <Link href={`/session/${sessionId}/howtoplay`} className="relative z-10 shrink-0">
          <img src="/howtoplaylogo.png" alt="How To Play" style={{ height: '27px' }} />
        </Link>

        <Link href={`/session/${sessionId}/rules`} className="relative z-10 shrink-0">
          <img src="/ruleslogo.png" alt="Rules" style={{ height: '27px' }} />
        </Link>

        <Link href={`/session/${sessionId}/songs`} className="relative z-10 shrink-0">
          <img src="/musiclogo.png" alt="Music" style={{ height: '27px' }} />
        </Link>

        <Link href={`/session/${sessionId}/records`} className="relative z-10 shrink-0">
          <img src="/recordslogo.png" alt="Records" style={{ height: '27px' }} />
        </Link>

        <Link href={`/achievements`} className="relative z-10 shrink-0">
          <img src="/achievementslogo.png" alt="Achievements" style={{ height: '27px' }} />
        </Link>

        <div className="ml-auto relative z-10 flex items-center gap-2">
          {user?.image && (
            <Image
              src={user.image}
              alt="avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          {user?.name && (
            <span className="text-sm text-white">{user.name}</span>
          )}
        </div>

      </nav>
    </div>
  )
}