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
      className="flex flex-col items-center justify-center bg-white overflow-hidden"
      style={{ height: 'calc(100dvh - 56px)' }}
    >
      <div className="relative">
        <Image
          src="/DKC1.png"
          alt="Donkey Kong Country"
          width={256}
          height={224}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button onClick={signIn}>
            <Image
              src="/signin.png"
              alt="Sign in with Google"
              width={1139}
              height={497}
            />
          </button>
        </div>
      </div>
    </main>
  )
}