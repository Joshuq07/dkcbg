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
    <nav className="relative w-full px-4 py-3 flex items-center justify-between gap-3 min-w-0 overflow-hidden">
      <img
        src="/headerbackground1.png"
        alt=""
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'cover', objectPosition: 'left' }}
      />
      <div className="relative z-10 flex items-center gap-4 min-w-0 flex-shrink-0">
        <Link href="/" className="flex items-center">
          <img src="/logolong.png" alt="DKCBG Digital" className="hidden sm:block" style={{ height: '27px' }} />
          <img src="/logoshort.png" alt="DKCBG Digital" className="sm:hidden" style={{ height: '27px' }} />
        </Link>

        <Link href="/sessions" className="flex items-center flex-shrink-0">
          <img src="/gameslogo.png" alt="Games" style={{ height: '27px' }} />
        </Link>
      </div>

      <div className="relative z-10 flex items-center gap-3 flex-shrink-0">
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
              className="text-sm text-white hover:underline cursor-pointer truncate max-w-[120px] sm:max-w-none"            >
              {user.name}
            </Link>
          </>
        ) : (
          <button onClick={signIn} className="flex items-center bg-transparent border-0 p-0 cursor-pointer flex-shrink-0">
            <img src="/signinlogo.png" alt="Sign in" style={{ height: '27px' }} />
          </button>
        )}
      </div>
    </nav>
  )
}