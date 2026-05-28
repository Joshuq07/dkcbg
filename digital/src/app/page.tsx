'use client'

import { useAuth } from '@/lib/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { isAuthenticated, isLoading, signIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated, router])

  if (isLoading) return <div className="page-container">Loading...</div>

  return (
    <main className="relative flex items-center justify-center overflow-hidden" style={{ height: 'calc(100dvh - 56px)' }}>
  <img
    src="/signinbackground.png"
    alt=""
    className="absolute inset-0 w-full h-full"
    style={{ objectFit: 'cover', objectPosition: 'center' }}
  />
  <button
    onClick={signIn}
    className="relative border-0 bg-transparent p-0 cursor-pointer z-10"
  >
    <img src="/signin.png" alt="Sign in with Google" width={600} height={261} />
  </button>
</main>
  )
}