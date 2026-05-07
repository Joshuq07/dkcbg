/**
 * useAuth — convenience wrapper around next-auth's useSession.
 * Use this in any React component to get the current user.
 *
 * For plain HTML pages, use the /api/auth/session endpoint directly:
 *   fetch('/api/auth/session').then(r => r.json()).then(session => { ... })
 */
'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user ?? null,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    signIn: () => signIn('google'),
    signOut: () => signOut({ callbackUrl: '/' }),
  }
}
