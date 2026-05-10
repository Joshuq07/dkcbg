'use client'

import { useAuth } from '@/lib/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Member = { user_email: string; player_name?: string; character_name?: string }
type Stats = { built: number; bangs: number }
type Session = { id: string; name: string; host_email: string; created_at: string; stats?: Stats; members?: Member[] }

export default function SessionsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const [sessions, setSessions] = useState<Session[]>([])
  const [mode, setMode] = useState<'idle' | 'create' | 'join'>('idle')
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/')
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
  if (!user) return

  async function load() {
    const s = await fetch('/api/sessions').then(r => r.json())
    const list = s.sessions ?? []

    const withStats = await Promise.all(
      list.map(async (session: Session) => {
        const stats = await fetch(
          `/api/session_stats/${session.id}?user_email=${user!.email}`
        ).then(r => r.json())

        const { members } = await fetch(`/api/session_members?session_id=${session.id}`)
  .then(r => r.json())

        return { ...session, stats, members }
      })
    )

    setSessions(withStats)
  }

  load()
}, [user])



  async function handleCreate() {
  if (!name || !password) return setError('Name and password required')
  setLoading(true); setError('')

  const res = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
  action: 'create',
  name,
  password,
  user_email: user!.email,          
  display_name: user!.name ?? user!.email,
}),
  })

  const data = await res.json()
  setLoading(false)
  if (data.error) return setError(data.error)
  router.push(`/session/${data.session.id}`)
}


  async function handleJoin() {
  if (!password || !selectedSession) return setError('Password required')
  setLoading(true); setError('')

  const res = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
  action: 'join',
  sessionId: selectedSession.id,
  password,
  user_email: user!.email,         
  display_name: user!.name ?? user!.email,
}),
  })

  const data = await res.json()
  setLoading(false)
  if (data.error) return setError(data.error)
localStorage.setItem(`joined_${data.session.id}`, 'true')
  router.push(`/session/${data.session.id}`)
}


  if (isLoading || !user) return <div className="page-container">Loading...</div>

  return (
    <main className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Games</h1>
        </div>
        <button onClick={() => { setMode('create'); setError('') }} className="btn-primary">
          + New Game
        </button>
      </div>

      {/* Create modal */}
      {mode === 'create' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="card w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Create New Game</h2>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm"
              placeholder="Session name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={loading} className="btn-primary flex-1">
                {loading ? 'Creating...' : 'Create'}
              </button>
              <button onClick={() => setMode('idle')} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Join modal */}
      {mode === 'join' && selectedSession && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="card w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-1">Join "{selectedSession.name}"</h2>
            <p className="text-gray-500 text-sm mb-4">Hosted by {selectedSession.host_email}</p>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="flex gap-2">
              <button onClick={handleJoin} disabled={loading} className="btn-primary flex-1">
                {loading ? 'Joining...' : 'Join'}
              </button>
              <button onClick={() => setMode('idle')} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Session list */}
      {sessions.length === 0 ? (
        <div className="card text-center text-gray-400 py-16">
          No sessions yet — create one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sessions.map(s => (
            <div key={s.id} className="card flex items-center justify-between">
  <div>
    <p className="font-semibold">{s.name}</p>

    <p className="text-xs text-gray-400 mt-0.5">
      {s.host_email === user.email ? 'You are the host' : `Host: ${s.host_email}`}
    </p>

    {s.stats && (
      <p className="text-xs text-gray-600 mt-1">
        <span className="font-semibold">{s.stats.built}</span>/142 built 
        <span className="ml-1 font-semibold">{s.stats.bangs}</span>/142 !
      </p>
    )}
{}
    {s.members && (
      <div className="text-xs text-gray-600 mt-2">
        {s.members.map((m: Member) => (
          <div key={m.user_email}>
            {m.user_email === user.email ? (
              <span className="font-semibold">You</span>
            ) : (
              <span>{m.player_name || m.user_email}</span>
            )}

            {m.character_name && (
              <span className="ml-1 text-gray-500">
                ({m.character_name})
              </span>
            )}
          </div>
        ))}
      </div>
    )}
  </div>

              <button
                onClick={() => {
  if (s.host_email === user.email) {
    router.push(`/session/${s.id}`)
    return
  }

  const alreadyJoined = localStorage.getItem(`joined_${s.id}`) === 'true'
  if (alreadyJoined) {
    router.push(`/session/${s.id}`)
    return
  }

  // Otherwise show password modal
  setSelectedSession(s)
  setPassword('')
  setMode('join')
  setError('')
}}

                className="btn-primary text-sm"
              >
                {s.host_email === user.email ? 'Open' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
