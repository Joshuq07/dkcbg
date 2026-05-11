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
        className="flex items-center gap-3 px-6 py-3 border border-gray-300 rounded shadow-sm bg-white hover:bg-gray-50 text-gray-700 font-medium text-base"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" width={20} height={20} />
        Sign in with Google
      </button>
    </main>
  )
}