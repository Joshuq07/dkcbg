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
    </main>
  )
}
