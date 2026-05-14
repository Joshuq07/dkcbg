'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/useAuth'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const { user, isAuthenticated, signIn, signOut } = useAuth()
  const pathname = usePathname()

  const inSession = pathname.startsWith('/session/')
  if (inSession) return null

  return (
    <nav className="w-full border-b border-gray-200 bg-white px-4 py-3 flex items-center justify-between gap-3 min-w-0">
      <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
        <Link href="/" className="font-semibold text-gray-900 text-lg whitespace-nowrap">
          <span className="hidden sm:inline">Donkey Kong Country Board Game Digital</span>
          <span className="sm:hidden">DKCBG Digital</span>
        </Link>

        <Link href="/sessions" className="text-sm text-gray-500 hover:text-gray-800 whitespace-nowrap flex-shrink-0">
          Games
        </Link>
      </div>

      {/* Right: auth */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {isAuthenticated && user ? (
          <>
            {user.image && (
              <Image
                src={user.image}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full flex-shrink-0"
              />
            )}
            <Link
              href="/dashboard"
              className="text-sm text-gray-700 hover:underline cursor-pointer truncate max-w-[120px] sm:max-w-none"
            >
              {user.name}
            </Link>
          </>
        ) : (
          <button
            onClick={signIn}
            className="text-sm font-medium bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition whitespace-nowrap flex-shrink-0"
          >
            <span className="hidden sm:inline">Sign in with Google</span>
            <span className="sm:hidden">Sign in</span>
          </button>
        )}
      </div>
    </nav>
  )
}