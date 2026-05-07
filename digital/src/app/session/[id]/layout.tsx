import SessionNavbar from './SessionNavbar'
import { ReactNode } from 'react'

type SessionLayoutProps = {
  children: ReactNode
  params: {
    id: string
  }
}

export default function SessionLayout({
  children,
  params,
}: SessionLayoutProps) {
  const { id: sessionId } = params

  return (
    <div className="min-h-screen flex flex-col">
      <SessionNavbar sessionId={sessionId} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}