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
    <main className="flex flex-col items-center justify-center bg-black" style={{ minHeight: '100dvh' }}>
      {/* Container fills remaining height after navbar, maintains 256:224 aspect ratio */}
      <div
        className="relative"
        style={{
          aspectRatio: '256/224',
          height: 'calc(100dvh - var(--navbar-height, 56px))',
          maxWidth: '100vw',
        }}
      >
        <Image
          src="/DKC1.png"
          alt="Donkey Kong Country"
          fill
          className="object-contain"
        />

        <div className="absolute inset-x-[5%] top-[5%] h-[45%]">
          <Image
            src="/title.png"
            alt="Title"
            fill
            className="object-contain"
          />
        </div>

        <div className="absolute inset-x-[25%] bottom-[8%] h-[25%]">
          <button onClick={signIn} className="relative w-full h-full">
            <Image
              src="/signin.png"
              alt="Sign in with Google"
              fill
              className="object-contain"
            />
          </button>
        </div>
      </div>
    </main>
  )
}