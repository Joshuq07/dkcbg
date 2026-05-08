'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SessionNavbar({ sessionId }: { sessionId: string }) {
  const pathname = usePathname()

  const linkClass = (href: string) =>
    pathname === href
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-gray-900"

  return (
    <nav className="w-full border-b bg-white px-4 py-3 flex items-center gap-6 overflow-x-auto">

      <Link href="/sessions" className="text-sm text-gray-500 hover:text-gray-800">
        ← Back
      </Link>

      <Link
        href={`/session/${sessionId}`}
        className={`shrink-0 ${linkClass(`/session/${sessionId}`)}`}
      >
        Game
      </Link>

      <Link
        href={`/session/${sessionId}/levelbuilder`}
        className={`shrink-0 ${linkClass(`/session/${sessionId}/levelbuilder`)}`}
      >
        Level Builder
      </Link>

      <Link
        href={`/session/${sessionId}/map`}
        className={`shrink-0 ${linkClass(`/session/${sessionId}/map`)}`}
      >
        Map/Location Finder
      </Link>


      <Link
        href={`/session/${sessionId}/howtoplay`}
        className={`shrink-0 ${linkClass(`/session/${sessionId}/howtoplay`)}`}
      >
        How To Play
      </Link>

      <Link
        href={`/session/${sessionId}/rules`}
        className={`shrink-0 ${linkClass(`/session/${sessionId}/rules`)}`}
      >
        Rules
      </Link>
      <Link
        href={`/session/${sessionId}/songs`}
        className={`shrink-0 ${linkClass(`/session/${sessionId}/songs`)}`}
      >
        Music
      </Link>

      <Link
        href={`/session/${sessionId}/spacealert`}
        className={`shrink-0 ${linkClass(`/session/${sessionId}/spacealert`)}`}
      >
        Space Alert
      </Link>

    </nav>
  )
}
