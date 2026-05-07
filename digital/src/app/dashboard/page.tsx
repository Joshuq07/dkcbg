'use client'

import { useAuth } from '@/lib/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/')
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !user) return <div className="page-container">Loading...</div>

  return (
    <main className="page-container">
      <div className="card flex items-center gap-5 mb-6">
        {user.image && (
          <Image src={user.image} alt="avatar" width={56} height={56} className="rounded-full" />
        )}
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{user.name?.split(' ')[0]}</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
        <button onClick={signOut} className="text-sm text-red-500 hover:text-red-700">Sign out</button>
      </div>
          </main>
  )
}
