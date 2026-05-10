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
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ height: 'calc(100dvh - 56px)' }}
    >
      <Image
        src="/DKC1.png"
        alt="Donkey Kong Country"
        fill
        className="object-cover"
        style={{ imageRendering: 'pixelated' }}
      />
    </main>
  )
}