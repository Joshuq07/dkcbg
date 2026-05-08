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
    <nav className="w-full border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-semibold text-gray-900 text-lg">
          Donkey Kong Board Game Digital
        </Link>

        <Link href="/sessions" className="text-sm text-gray-500 hover:text-gray-800">
          Games
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <>
            {user.image && (
              <Image
                src={user.image}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <Link href="/dashboard" className="text-sm text-gray-700 hover:underline cursor-pointer">
              {user.name}
            </Link>


          </>
        ) : (
          <button
            onClick={signIn}
            className="text-sm font-medium bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  )
}
