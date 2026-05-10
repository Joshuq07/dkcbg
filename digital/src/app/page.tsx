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
    <main className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="relative">
        {/* Base game image */}
        <Image
          src="/DKC1.png"
          alt="Donkey Kong Country"
          width={256}
          height={224}
        />

        {/* Title overlaid on top, centered within DKC1 */}
        <div className="absolute inset-0 flex flex-col items-center justify-between py-4">
          <Image
            src="/title.png"
            alt="Title"
            width={220}
            height={114}
            className="object-contain"
          />

          {/* Sign in button as image */}
          <button onClick={signIn} className="flex items-center justify-center">
            <Image
              src="/signin.png"
              alt="Sign in with Google"
              width={104}
              height={63}
            />
          </button>
        </div>
      </div>
    </main>
  )
}