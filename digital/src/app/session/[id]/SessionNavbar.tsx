'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/lib/useAuth'

export default function SessionNavbar({ sessionId }: { sessionId: string }) {
  const pathname = usePathname()
  const { user, isAuthenticated, signIn } = useAuth()

  const linkClass = (href: string) =>
    pathname === href
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-gray-900"

  return (
    <nav className="relative w-full px-4 py-3 flex items-center gap-6 overflow-x-auto">
      <img
        src="/headerbackground.png"
        alt=""
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'cover', objectPosition: 'left' }}
      />
      <Link href="/sessions" className="relative z-10 flex items-center flex-shrink-0">
        <img src="/backlogo.png" alt="Back" style={{ height: '27px' }} />
      </Link>

      <Link href={`/session/${sessionId}`} className={`relative z-10 shrink-0`}>
        <img src="/gamelogo.png" alt="Game" style={{ height: '27px' }} />
      </Link>

      <Link href={`/session/${sessionId}/levelbuilder`} className={`relative z-10 shrink-0`}>
        <img src="/levelbuilderlogo.png" alt="Level Builder" style={{ height: '27px' }} />
      </Link>

      <Link href={`/session/${sessionId}/map`} className={`relative z-10 shrink-0`}>
        <img src="/maplocationfinderlogo.png" alt="Map/Location Finder" style={{ height: '27px' }} />
      </Link>


      <Link href={`/session/${sessionId}/howtoplay`} className="relative z-10 shrink-0">
        <img src="/howtoplaylogo.png" alt="How To Play" style={{ height: '27px' }} />
      </Link>

      <Link href={`/session/${sessionId}/rules`} className="relative z-10 shrink-0">
        <img src="/ruleslogo.png" alt="Rules" style={{ height: '27px' }} />
      </Link>
      <Link
        href={`/session/${sessionId}/songs`}
        className={`shrink-0 ${linkClass(`/session/${sessionId}/songs`)}`}
      >
        Music
      </Link>

      <Link
        href={`/session/${sessionId}/records`}
        className={`shrink-0 ${linkClass(`/session/${sessionId}/records`)}`}
      >
        Records
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
  )
}
