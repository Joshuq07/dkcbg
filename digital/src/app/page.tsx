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
    <main className="flex items-center justify-center bg-white" style={{ height: 'calc(100dvh - 56px)' }}>
      <button
        onClick={signIn}
        className="relative border-0 bg-transparent p-0 cursor-pointer"
      >
        <img src="/signin.png" alt="Sign in with Google" width={480} height={208} />
      </button>
    </main>
  )
}