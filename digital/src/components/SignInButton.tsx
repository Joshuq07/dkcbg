'use client'

import { useAuth } from '@/lib/useAuth'
import { useRouter } from 'next/navigation'

export function SignInButton({ label = 'Sign in with Google' }: { label?: string }) {
  const { isAuthenticated, signIn } = useAuth()
  const router = useRouter()

  return isAuthenticated ? (
    <button onClick={() => router.push('/dashboard')} className="btn-primary">
      Go to Dashboard →
    </button>
  ) : (
    <button onClick={signIn} className="btn-primary">
      {label}
    </button>
  )
}
