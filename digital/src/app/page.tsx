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
    <main
      className="flex items-center justify-center overflow-hidden"
      style={{
        height: 'calc(100dvh - 56px)',
        backgroundImage: 'url(/DKC1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        imageRendering: 'pixelated',
      }}
    >
      <button onClick={signIn}>
        <Image
          src="/signin.png"
          alt="Sign in with Google"
          width={570}
          height={249}
        />
      </button>
    </main>
  )
}