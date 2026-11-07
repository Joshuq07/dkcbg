'use client'

import { useAuth } from '@/lib/useAuth'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { selectCharacterSrc } from '@/lib/selectCharacters'

type Member = {
  user_email: string
  position?: number | null
  player_name?: string | null
  character_name?: string | null
  player_name_2?: string | null
  character_name_2?: string | null
}
type Entry = { user_email: string; box_type: string; value: string | null; lost?: boolean }
type Session = {
  id: string
  name: string
  host_email: string
  created_at: string
  is_team?: boolean
  game_number?: number | null
}

// ---- Layout constants (all in native pixels of GameSelect.png) ----
const W = 256
const H = 273
const TAPE_W = 170
const TAPE_H = 34
const TAPE_POS = [[13, 41], [13, 91], [13, 140], [13, 186]]
const PLAYER_NUMBER_POS = [1, 2, 3, 4]
const PLACE_POS = [[210, 55], [210, 103], [210, 152], [210, 200]]
const CYAN = '#00e5ff'

const pctX = (x: number) => `${(x / W) * 100}%`
const pctY = (y: number) => `${(y / H) * 100}%`
// pt -> px (x 4/3) -> scaled to container width, so text scales with the image
const fs = (pt: number) => `${((pt * 4) / 3 / W) * 100}cqw`

function Txt({ x, y, pt, color = 'black', children }: {
  x: number; y: number; pt: number; color?: string; children: React.ReactNode
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: pctX(x), top: pctY(y),
        fontSize: fs(pt), color,
        lineHeight: 1, whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  )
}

const FONT_PATH = "/SelectFont";

function PixelText({
  value,
  x,
  y,
}: {
  value: string;
  x: number;
  y: number;
}) {
  const characters = value.toUpperCase().slice(0, 6).split("");
  let offset = 0;

  return (
    <>
      {characters.map((char, index) => {
        const valid = /^[A-Z0-9%]$/.test(char);
        if (!valid) return null;

        const width = char === "1" ? 4 : 6;

        const image = (
          <img
            key={index}
            src={`${FONT_PATH}/${char}.png`}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              left: pctX(x + offset),
              top: pctY(y),
              width: pctX(width),
              height: pctY(6),
              imageRendering: "pixelated",
            }}
          />
        );

        offset += width + 1;
        return image;
      })}
    </>
  );
}

function PixelPercent({
  value,
  x,
  y,
}: {
  value: number;
  x: number;
  y: number;
}) {
  const percent = Math.round((value / 142) * 100);
  const digits = String(percent).padStart(3, "0");

  return (
    <>
      {digits.split("").map((char, index) => (
        <img
          key={index}
          src={`${FONT_PATH}/${char}.png`}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            left: pctX(x + index * 7),
            top: pctY(y),
            width: pctX(6),
            height: pctY(6),
            imageRendering: "pixelated",
          }}
        />
      ))}
      <img
        src={`${FONT_PATH}/%25.png`}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          left: pctX(x + 21),
          top: pctY(y),
          width: pctX(6),
          height: pctY(6),
          imageRendering: "pixelated",
        }}
      />
    </>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}/${dd}/${d.getFullYear()}`
}

const first6 = (s?: string | null) => (s ?? '').slice(0, 6)

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export default function SessionsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const [sessions, setSessions] = useState<Session[]>([])
  const [index, setIndex] = useState(0)
  const [members, setMembers] = useState<Member[]>([])
  const [entries, setEntries] = useState<Entry[]>([])

  const [mode, setMode] = useState<'idle' | 'create' | 'join'>('idle')
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [gameNumber, setGameNumber] = useState('')
  const [isTeam, setIsTeam] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/')
  }, [isLoading, isAuthenticated, router])

  // Load session list, newest first
  useEffect(() => {
    if (!user) return
    fetch('/api/sessions')
      .then(r => r.json())
      .then(s => {
        const list: Session[] = [...(s.sessions ?? [])].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        setSessions(list)
        setIndex(0)
      })
  }, [user])

  const current: Session | undefined = sessions[index]

  // Load members + entries for only the displayed session
  useEffect(() => {
    if (!current) return
    let cancelled = false
    setMembers([])
    setEntries([])
    ;(async () => {
      const [m, e] = await Promise.all([
        fetch(`/api/session_members?session_id=${current.id}`).then(r => r.json()),
        fetch(`/api/box_entries?session_id=${current.id}`).then(r => r.json()),
      ])
      if (cancelled) return
      setMembers(m.members ?? [])
      setEntries(e.entries ?? [])
    })()
    return () => { cancelled = true }
  }, [current?.id])

  const sortedMembers = useMemo(
    () => [...members].sort((a, b) => (a.position ?? 999) - (b.position ?? 999)).slice(0, 4),
    [members]
  )

  const builtCounts = useMemo(() => {
    const out: Record<string, number> = {}
    for (const m of sortedMembers) {
      out[m.user_email] = entries.filter(
        e => e.user_email === m.user_email && e.box_type === 'number' && e.value && !e.lost
      ).length
    }
    return out
  }, [sortedMembers, entries])

  // Placement: most levels = 1st, ties share a spot (1,1,2 style)
  function placementFor(email: string) {
    const unique = Array.from(new Set(Object.values(builtCounts))).sort((a, b) => b - a)
    return unique.indexOf(builtCounts[email]) + 1
  }

  function hasJoined(s: Session) {
    return s.host_email === user!.email || localStorage.getItem(`joined_${s.id}`) === 'true'
  }

  function handleOpen() {
    if (!current) return
    if (hasJoined(current)) {
      router.push(`/session/${current.id}`)
      return
    }
    setSelectedSession(current)
    setPassword('')
    setMode('join')
    setError('')
  }

  function handleNext() {
    if (sessions.length === 0) return
    setIndex(i => (i + 1) % sessions.length)
  }

  function openCreate() {
  setMode('create'); setError(''); setPassword(''); setIsTeam(false)
  setGameNumber(String(Math.max(0, ...sessions.map(s => s.game_number ?? 0)) + 1))
}

  async function handleCreate() {
    const n = parseInt(gameNumber, 10)
    if (isNaN(n) || !password) return setError('Game number and password required')
    setLoading(true); setError('')

    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        name: `Game ${n}`,
        game_number: n,
        is_team: isTeam,
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

  const team = !!current?.is_team

  return (
    <main className="page-container">
      

      {/* Create modal */}
      {mode === 'create' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="card w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Create New Game</h2>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm"
              placeholder="Game number"
              value={gameNumber}
              onChange={e => setGameNumber(e.target.value)}
            />
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <label className="flex items-center gap-2 text-sm mb-3">
              <input
                type="checkbox"
                checked={isTeam}
                onChange={e => setIsTeam(e.target.checked)}
              />
              Teams (2 players per spot)
            </label>
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

      {/* Join modal (unchanged) */}
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

      {!current ? (
  <div className="w-full mx-auto" style={{ maxWidth: 512 }}>
    <div className="card text-center text-gray-400 py-16">
      No sessions yet — create one to get started.
    </div>
    <div className="flex justify-end mt-3">
      <button onClick={openCreate} className="btn-primary">+ New Game</button>
    </div>
  </div>
) : (
  <div className="w-full mx-auto" style={{ maxWidth: 512 }}>
    <div
      className="relative w-full"
      style={{ aspectRatio: `${W} / ${H}`, containerType: 'inline-size' }}
    >
          <img
            src="/GameSelect.png"
            alt=""
            className="absolute inset-0 w-full h-full block"
            style={{ imageRendering: 'pixelated' }}
            draggable={false}
          />

          <img
  src="/Select%20Game.png"
  alt=""
  className="absolute pointer-events-none"
  style={{
    left: pctX(85),
    top: pctY(11),
    width: pctX(86),
    height: pctY(16),
    imageRendering: 'pixelated',
  }}
  draggable={false}
/>

          <button
  aria-label="Open"
  onClick={handleOpen}
  className="absolute group"
  style={{
    left: pctX(12),
    top: pctY(241),
    width: `${(37 / W) * 100}%`,
    height: `${(19 / H) * 100}%`,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  }}
>
  <img
    src="/Open_On.png"
    alt=""
    className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 pointer-events-none"
    style={{ imageRendering: 'pixelated' }}
    draggable={false}
  />
</button>

<button
  aria-label="Next"
  onClick={handleNext}
  className="absolute group"
  style={{
    left: pctX(55),
    top: pctY(241),
    width: `${(42 / W) * 100}%`,
    height: `${(19 / H) * 100}%`,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  }}
>
  <img
    src="/Next_On.png"
    alt=""
    className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 pointer-events-none"
    style={{ imageRendering: 'pixelated' }}
    draggable={false}
  />
</button>


          {/* Tapes + placement */}
          {sortedMembers.map((m, i) => {
            const [tx, ty] = TAPE_POS[i]
            const [px, py] = PLACE_POS[i]
            const charSrc = selectCharacterSrc([m.character_name, m.character_name_2], team)

            return (
              <React.Fragment key={m.user_email}>
                <img
                  src="/Tape.png"
                  alt=""
                  className="absolute pointer-events-none"
                  style={{
                    left: pctX(tx), top: pctY(ty),
                    width: `${(TAPE_W / W) * 100}%`, height: `${(TAPE_H / H) * 100}%`,
                    imageRendering: 'pixelated',
                  }}
                />

                <img
  src={`/playernumber/${PLAYER_NUMBER_POS[i]}.png`}
  alt=""
  className="absolute pointer-events-none"
  style={{
    left: pctX(tx + 5),
    top: pctY(ty + 9),
    width: pctX(6),
    height: pctY(7),
    imageRendering: 'pixelated',
  }}
  draggable={false}
/>

                {charSrc && (
                  <img
                    src={charSrc}
                    alt=""
                    className="absolute pointer-events-none"
                    style={{
                      left: pctX(tx + 29), top: pctY(ty + 10),
                      width: `${(43 / W) * 100}%`, height: `${(20 / H) * 100}%`,
                      imageRendering: 'pixelated',
                    }}
                  />
                )}

                                {team ? (
                  <>
                    <PixelText value={first6(m.player_name)} x={tx + 77} y={ty + 10} />
                    <PixelText value={first6(m.player_name_2)} x={tx + 77} y={ty + 20} />
                  </>
                ) : (
                  <PixelText value={first6(m.player_name)} x={tx + 77} y={ty + 17} />
                )}

                <PixelPercent
                  value={builtCounts[m.user_email] ?? 0}
                  x={tx + 125}
                  y={ty + 17}
                />

                <img
  src={`/${placementFor(m.user_email)}${['th', 'st', 'nd', 'rd'][placementFor(m.user_email) % 10] && placementFor(m.user_email) === 1 ? 'st' : placementFor(m.user_email) === 2 ? 'nd' : placementFor(m.user_email) === 3 ? 'rd' : 'th'}.png`}
  alt=""
  className="absolute pointer-events-none"
  style={{
    left: pctX(px),
    top: pctY(py),
    width: pctX(21),
    height: pctY(7),
    imageRendering: 'pixelated',
  }}
  draggable={false}
/>
              </React.Fragment>
            )
          })}

          {/* Game # and date */}
          <Txt x={117} y={244} pt={8} color={CYAN}>
            Game {current.game_number ?? sessions.length - index}
          </Txt>
          <Txt x={185} y={244} pt={8} color={CYAN}>{formatDate(current.created_at)}</Txt>
         </div>

    <div className="flex justify-end mt-3">
      <button
        onClick={openCreate}
        className="btn-primary"
      >
        + New Game
      </button>
    </div>
  </div>
)}
      
    </main>
  )
}