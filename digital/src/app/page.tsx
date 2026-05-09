'use client'

import { useAuth } from '@/lib/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  const { isAuthenticated, isLoading, signIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated, router])

  if (isLoading) return <div className="page-container">Loading...</div>

  return (
    <main className="page-container flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">Donkey Kong Country Board Game</h1>
        <p className="text-gray-500 text-lg">Sign in to unlock access.</p>
      </div>
      <Image
        src="/title.png"
        alt="Donkey Kong Country"
        width={900}
        height={465}
        className="rounded-lg"
      />
      <button onClick={signIn} className="btn-primary flex items-center gap-3 text-base px-6 py-3">
        <GoogleIcon />
        Sign in with Google
      </button>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.6-8 19.6-20 0-1.3-.1-2.7-.4-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.6-3-11.4-7.4l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.5-4.6 5.8l6.2 5.2C40.9 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
    </svg>
  )
}
