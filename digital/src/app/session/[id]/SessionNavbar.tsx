'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SessionNavbar({ sessionId }) {
  const pathname = usePathname()

  const linkClass = (href) =>
    pathname === href
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-gray-900"

  return (
    <nav className="w-full border-b bg-white px-4 py-3 flex items-center gap-6">

      <Link href="/sessions" className="text-sm text-gray-500 hover:text-gray-800">
        ← Back
      </Link>

      <Link
        href={`/session/${sessionId}`}
        className={linkClass(`/session/${sessionId}`)}
      >
        Session
      </Link>

      <Link
        href={`/session/${sessionId}/levelbuilder`}
        className={linkClass(`/session/${sessionId}/levelbuilder`)}
      >
        Level Builder
      </Link>

<Link
        href={`/session/${sessionId}/map`}
        className={linkClass(`/session/${sessionId}/map`)}
      >
        Map/Location Finder
      </Link>


      <Link
        href={`/session/${sessionId}/howtoplay`}
        className={linkClass(`/session/${sessionId}/howtoplay`)}
      >
        How To Play
      </Link>

      <Link
        href={`/session/${sessionId}/rules`}
        className={linkClass(`/session/${sessionId}/rules`)}
      >
        Rules
      </Link>
<Link
        href={`/session/${sessionId}/songs`}
        className={linkClass(`/session/${sessionId}/songs`)}
      >
        Music
      </Link>

<Link
        href={`/session/${sessionId}/spacealert`}
        className={linkClass(`/session/${sessionId}/spacealert`)}
      >
        Space Alert
      </Link>

    </nav>
  )
}
