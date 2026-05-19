'use client'

import { useAuth } from '@/lib/useAuth'
import { useRouter, useParams } from 'next/navigation'
import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Draggable from "react-draggable"

import {
  LEVEL_ANCHORS_IMAGE_1,
  LEVEL_ANCHORS_IMAGE_2,
  boxesFromLevelAnchor,
  Box,
  BoxType,
} from '@/lib/boxes'
import { computePercentage } from '@/lib/percentages'
import type { BoxEntry as BoxEntryType } from '@/lib/types'
import SessionStats from './SessionStats'
import { SCRAPBOOK_ANCHORS } from '@/lib/boxes'
import { materialList } from '@/lib/dkcbg/data'

type SessionData = {
  id: string
  name: string
  host_email: string
  mode: 'my' | 'global'
  rotation?: number 
}

type Member = {
  user_email: string
  display_name: string | null
  position: number | null
  player_name?: string | null
  character_name?: string | null
}

type BoxEntry = BoxEntryType

export default function SessionPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const sessionId = params.id as string

  const [session, setSession] = useState<SessionData | null>(null)
  const [entries, setEntries] = useState<BoxEntry[]>([])
  const [members, setMembers] = useState<Member[]>([])

  const [zoomScale, setZoomScale] = useState(1)
  const [showStats, setShowStats] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const pendingNextNumber = useRef<number | null>(null)
  const [scrapbooked, setScrapbooked] = useState<string[]>([])
const [scrapHydrated, setScrapHydrated] = useState(false)
const [allScrapbooked, setAllScrapbooked] = useState<Record<string, string[]>>({})

  useEffect(() => {
    function updateZoom() {
      const ratio = window.devicePixelRatio || 1
      // Only counter-scale if zoomed in past 100%
      setZoomScale(ratio > 1 ? 1 / ratio : 1)
    }
    updateZoom()
    window.addEventListener('resize', updateZoom)
    return () => window.removeEventListener('resize', updateZoom)
  }, [])

  const isHost = session?.host_email === user?.email
  const rawMode = session?.mode ?? 'my'
  const viewMode = isHost ? rawMode : 'my'

  const allBoxes: Box[] = useMemo(() => [
    ...LEVEL_ANCHORS_IMAGE_1.flatMap(a => boxesFromLevelAnchor(a)),
    ...LEVEL_ANCHORS_IMAGE_2.flatMap(a => boxesFromLevelAnchor(a)),
  ], [])

  const boxesByPage = useMemo(() => ({
    1: allBoxes.filter(b => b.page === 1),
    2: allBoxes.filter(b => b.page === 2),
  }), [allBoxes])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/')
  }, [isLoading, isAuthenticated, router])

  const loadSession = useCallback(async () => {
    if (!sessionId) return
    const s = await fetch(`/api/sessions/${sessionId}`).then(r => r.json())
    setSession(s.session)
    setMembers(s.members ?? [])
    // after setMembers(s.members)
const scrapResults = await Promise.all(
  (s.members ?? []).map((m: Member) =>
    fetch(`/api/scrapbook/${sessionId}`, {
      headers: { 'x-user-id': m.user_email }
    }).then(r => r.json())
  )
)
const allScrap: Record<string, string[]> = {}
for (let i = 0; i < s.members.length; i++) {
  allScrap[s.members[i].user_email] = scrapResults[i].scrapbooked_materials || []
}
setAllScrapbooked(allScrap)
  }, [sessionId])

  const loadEntries = useCallback(async () => {
    if (!sessionId) return
    const e = await fetch(`/api/box_entries?session_id=${sessionId}`).then(r => r.json())
    setEntries(e.entries ?? [])
  }, [sessionId])

  useEffect(() => {
    loadSession()
    loadEntries()
  }, [loadSession, loadEntries])

  useEffect(() => {
    pendingNextNumber.current = null
  }, [entries])

  useEffect(() => {
    if (!sessionId) return

    const sub = supabase
      .channel(`box_entries:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'box_entries',
          filter: `session_id=eq.${sessionId}`,
        },
        payload => {
          if (payload.eventType === 'DELETE') {
            const old = payload.old as BoxEntry
            setEntries(prev =>
              prev.filter(
                e =>
                  !(
                    e.level === old.level &&
                    e.box_type === old.box_type &&
                    e.user_email === old.user_email
                  )
              )
            )
          } else {
            const next = payload.new as BoxEntry
            setEntries(prev => {
              const filtered = prev.filter(
                e =>
                  !(
                    e.level === next.level &&
                    e.box_type === next.box_type &&
                    e.user_email === next.user_email
                  )
              )
              return [...filtered, next]
            })
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(sub) }
  }, [sessionId])

  useEffect(() => {
    if (!sessionId) return

    const sub = supabase
      .channel(`session_members:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_members',
          filter: `session_id=eq.${sessionId}`,
        },
        () => { loadSession() }
      )
      .subscribe()

    return () => { supabase.removeChannel(sub) }
  }, [sessionId, loadSession])

  useEffect(() => {
    if (!sessionId) return

    const sub = supabase
      .channel(`sessions:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${sessionId}`,
        },
        payload => {
          const updated = payload.new as SessionData
          setSession(prev => (prev ? { ...prev, mode: updated.mode, rotation: updated.rotation } : prev))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(sub) }
  }, [sessionId])

  // Load scrapbook
useEffect(() => {
  if (!user || !sessionId || scrapHydrated) return
  fetch(`/api/scrapbook/${sessionId}`, {
    headers: { 'x-user-id': user.email! }
  })
    .then(r => r.json())
    .then(json => {
      setScrapbooked(json.scrapbooked_materials || [])
      setScrapHydrated(true)
    })
}, [user, sessionId, scrapHydrated])

// Save scrapbook
useEffect(() => {
  if (!user || !sessionId || !scrapHydrated) return
  const timeout = setTimeout(() => {
    fetch(`/api/scrapbook/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_email: user.email,
        scrapbooked_materials: scrapbooked
      })
    })
  }, 300)
  return () => clearTimeout(timeout)
}, [scrapbooked, sessionId, user, scrapHydrated])

  const sortedMembers = useMemo(
    () => [...members].sort((a, b) => (a.position ?? 999) - (b.position ?? 999)),
    [members]
  )

  const memberEmails = useMemo(
    () => sortedMembers.map(m => m.user_email),
    [sortedMembers]
  )

  function levelsBuilt(userEmail: string): string {
    const count = entries.filter(
      e =>
        e.user_email === userEmail &&
        e.box_type === 'number' &&
        e.value &&
        !e.lost
    ).length
    return `${count} / 142`
  }

  function bangCount(userEmail: string): string {
    const count = entries.filter(
      e =>
        e.user_email === userEmail &&
        e.box_type === 'bang' &&
        e.value
    ).length
    return `${count}`
  }

  function getUserForBox(box: Box): string | null {
    if (box.type === 'number' || box.type === 'check' || box.type === 'bang') {
      return user?.email ?? null
    }
    if (box.type.startsWith('star')) {
      const col = parseInt(box.type.replace('star', ''), 10) - 1
      return sortedMembers[col]?.user_email ?? null
    }
    return null
  }

  function computeBuiltFraction(level: number) {
    const total = memberEmails.length
    const built = entries.filter(
      e => e.level === level && e.box_type === 'number' && e.value && !e.lost
    ).length
    return built === 0 ? '' : `${built}/${total}`
  }

  function computeCheckFraction(level: number) {
    const total = memberEmails.length
    const checks = entries.filter(
      e => e.level === level && e.box_type === 'check' && e.value && !e.lost
    ).length
    return checks === 0 ? '' : `${checks}/${total}`
  }

  function computeBangFraction(level: number) {
    const total = memberEmails.length
    const bangs = entries.filter(
      e => e.level === level && e.box_type === 'bang' && e.value && !e.lost
    ).length
    return bangs === 0 ? '' : `${bangs}/${total}`
  }

  function getEntry(level: number, boxType: BoxType, userEmail: string) {
    return entries.find(
      e => e.level === level && e.box_type === boxType && e.user_email === userEmail
    )
  }

  function levelIsLost(level: number) {
    return entries.some(e => e.level === level && e.lost)
  }

  function nextNumberForUser(userEmail: string) {
    const nums = entries
      .filter(e => e.user_email === userEmail && e.box_type === 'number' && e.value)
      .map(e => parseInt(e.value!, 10))
      .filter(n => !Number.isNaN(n))
    const fromState = nums.length === 0 ? 1 : Math.max(...nums) + 1
    const next = Math.max(fromState, (pendingNextNumber.current ?? 0) + 1)
    pendingNextNumber.current = next
    return next
  }

  function materialUsedCount(material: string): number {
  const builtLevelNums = entries
    .filter(e => e.user_email === user?.email && e.box_type === 'number' && e.value && !e.lost)
    .map(e => e.level)
  let count = 0
  for (const lvl of builtLevelNums) {
    count += (materialList[lvl - 1] || []).filter(m => m === material).length
  }
  return count
}

function toggleScrapbook(material: string) {
  setScrapbooked(prev =>
    prev.includes(material)
      ? prev.filter(m => m !== material)
      : [...prev, material]
  )
}

  async function handleBoxClick(box: Box) {
    if (!user) return
    const userEmail = user.email!

    const ownerEmail = getUserForBox(box)
    const entry = ownerEmail ? getEntry(box.level, box.type, ownerEmail) : undefined
    const existing = entry

    if (entry?.lost && box.type !== 'number') return

    if (!isHost || viewMode === 'my') {
      if (box.type === 'number') {
        if (!existing) {
          const next = nextNumberForUser(userEmail)
          await fetch('/api/box_entries', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionId,
              level: box.level,
              box_type: 'number',
              user_email: userEmail,
              value: String(next),
              lost: false,
            }),
          })
          return
        }

        const current = existing.value ?? ''
        const choice = window.prompt(
          'Enter a number, leave blank to delete, or type "lost" or "rebuilt":',
          current
        )
        if (choice === null) return
        const trimmed = choice.trim()

        if (trimmed === 'lost') {
          await fetch('/api/box_entries', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionId,
              level: box.level,
              box_type: 'number',
              user_email: userEmail,
              lost: true,
            }),
          })
          await fetch('/api/box_entries', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, level: box.level, box_type: 'check', user_email: userEmail }),
          })
          await fetch('/api/box_entries', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, level: box.level, box_type: 'bang', user_email: userEmail }),
          })
          return
        }

        if (trimmed === 'rebuilt') {
          await fetch('/api/box_entries', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionId,
              level: box.level,
              box_type: 'number',
              user_email: userEmail,
              value: existing.value,
              lost: false,
            }),
          })
          return
        }

        if (!trimmed) {
          await saveEntry(box, userEmail, null)
          return
        }

        if (!Number.isNaN(Number(trimmed))) {
          await fetch('/api/box_entries', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionId,
              level: box.level,
              box_type: 'number',
              user_email: userEmail,
              value: String(Number(trimmed)),
              lost: false,
            }),
          })
          return
        }
      }

      if (box.type === 'check') await saveEntry(box, userEmail, existing ? null : '1')
      if (box.type === 'bang') await saveEntry(box, userEmail, existing ? null : '1')
      return
    }

    if (isHost && viewMode === 'global' && box.type.startsWith('star')) {
      const starOwner = ownerEmail!
      const level = box.level

      const existingNumber = entries.find(
        e => e.level === level && e.box_type === 'number' && e.user_email === starOwner && !e.lost
      )
      const lostNumber = entries.find(
        e => e.level === level && e.box_type === 'number' && e.user_email === starOwner && e.lost === true
      )

      if (lostNumber) {
        await fetch('/api/box_entries', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            level,
            box_type: 'number',
            user_email: starOwner,
            value: lostNumber.value,
            lost: false,
          }),
        })
        return
      }

      if (!existingNumber) {
        await fetch('/api/box_entries', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            level,
            box_type: box.type,
            user_email: starOwner,
            global_star: true,
          }),
        })
        return
      }

      const choice = window.prompt(
        'Remove this entry? Type "remove" to delete, or "lost" to mark this level lost:',
        ''
      )

      if (choice === 'lost') {
        await fetch('/api/box_entries', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, level, box_type: 'number', user_email: starOwner, lost: true }),
        })
        await fetch('/api/box_entries', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, level, box_type: 'check', user_email: starOwner }),
        })
        await fetch('/api/box_entries', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, level, box_type: 'bang', user_email: starOwner }),
        })
        return
      }

      if (choice !== 'remove') return

      await fetch('/api/box_entries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          level,
          box_type: box.type,
          user_email: starOwner,
          global_star: true,
        }),
      })
    }
  }

  async function saveEntry(box: Box, userEmail: string, value: string | null) {
    await fetch('/api/box_entries', {
      method: value ? 'PUT' : 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        level: box.level,
        box_type: box.type,
        user_email: userEmail,
        value,
      }),
    })
  }

  async function saveRotation(newRotation: number) {
  await fetch(`/api/sessions/${sessionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rotation: newRotation }),
  })
  setSession(s => s ? { ...s, rotation: newRotation } : s)
}

  function renderBox(box: Box) {
    const ownerEmail = getUserForBox(box)
    const entry = ownerEmail ? getEntry(box.level, box.type, ownerEmail) : undefined
    const lost = entry?.lost === true

    const clickable =
      (!isHost && viewMode === 'my') ||
      (isHost && viewMode === 'my') ||
      (isHost && viewMode === 'global')

    const isStar = box.type.startsWith('star')
    const isNumber = box.type === 'number'
    const isCheck = box.type === 'check'
    const isBang = box.type === 'bang'

    let display = ''

    if (viewMode === 'global') {
      if (isNumber) display = computeBuiltFraction(box.level)
      else if (isCheck) display = computeCheckFraction(box.level)
      else if (isBang) display = computeBangFraction(box.level)
      else if (isStar) display = entry?.value ?? ''
    } else {
      if (isStar) display = entry?.value ?? ''
      else if (isCheck) display = entry ? '✔︎' : ''
      else if (isBang) display = entry ? '!' : ''
      else if (isNumber) display = entry?.value ?? ''
    }

    return (
      <button
        key={box.id}
        onClick={() => clickable && handleBoxClick(box)}
        className="absolute flex items-center justify-center leading-none"
        style={{
          left: `${(box.x / 3300) * 100}%`,
          top: `${(box.y / 4740) * 100}%`,
          width: `${(box.w / 3300) * 100}%`,
          height: `${(box.h / 4740) * 100}%`,
          border: '1px solid rgba(0,0,0,0)',
          background: entry ? 'rgba(0,150,255,0)' : 'transparent',
          pointerEvents: clickable ? 'auto' : 'none',
          fontSize: 'clamp(0.25rem, 1.2cqw, 1.1rem)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color:
            viewMode === 'global'
              ? 'black'
              : lost && isNumber
                ? 'red'
                : 'black',
        }}
      >
        {display}
      </button>
    )
  }

  if (isLoading || !session) return <div className="page-container">Loading…</div>

  return (
    <main className="w-full min-h-screen p-4 flex justify-center">
      <div className="w-full max-w-[2400px]">

        <h1 className="text-2xl font-bold mb-2">{session.name}</h1>


        {isHost && (
          <button
            onClick={async () => {
              const newMode = viewMode === 'my' ? 'global' : 'my'
              await fetch(`/api/sessions/${sessionId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: newMode }),
              })
              setSession(s => (s ? { ...s, mode: newMode } : s))
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded mb-4 ml-2 hover:bg-gray-600"
          >
            {viewMode === 'global' ? 'All Players' : 'My View'}
          </button>
        )}

        <button
          onClick={() => setShowStats(true)}
          className="bg-gray-500 text-white px-4 py-2 rounded mb-4 ml-2 hover:bg-gray-600"
        >
          Stats
        </button>
        {/* Rotation display — visible to all */}
<button
  onClick={async () => {
    if (!isHost) return
    const input = window.prompt('Set rotation number:', String(session.rotation ?? 1))
    if (input === null) return
    const n = parseInt(input.trim(), 10)
    if (!isNaN(n)) await saveRotation(n)
  }}
  className="bg-gray-500 text-white px-4 py-2 rounded mb-4 ml-2 hover:bg-gray-600"
  style={{ cursor: isHost ? 'pointer' : 'default' }}
>
  Rotation: {session.rotation ?? 1}
</button>

{/* + increment button — host only */}
{isHost && (
  <button
    onClick={async () => {
      const next = (session.rotation ?? 1) + 1
      await saveRotation(next)
      const audio = new Audio('/rotation-ding.mp3')  // ← rename to your actual file
      audio.play().catch(() => {})
    }}
    className="bg-gray-500 text-white px-3 py-2 rounded mb-4 ml-1 hover:bg-gray-600 font-bold"
    title="Next rotation"
  >
    +
  </button>
)}

        {isHost && (
          <>
            <button
              onClick={() => setShowOptions(true)}
              className="bg-gray-500 text-white px-4 py-2 rounded mb-4 ml-2 hover:bg-gray-600"
            >
              Options
            </button>

            {showOptions && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Options</h2>
                    <button
                      onClick={() => setShowOptions(false)}
                      className="text-gray-400 hover:text-gray-700 text-xl leading-none"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="px-5 py-4 space-y-3">
                    <button
                      onClick={async () => {
                        const confirmDelete = window.prompt(
                          'Type DELETE to permanently remove this session:',
                          ''
                        )
                        if (confirmDelete !== 'DELETE') return
                        await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' })
                        router.push('/sessions')
                      }}
                      className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                    >
                      Delete Session
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/**/}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* PAGE 1 */}
          <div className="relative w-full md:flex-1" style={{ containerType: 'inline-size' }}>
            <img src="/page1.png" className="w-full h-auto block" />
            {boxesByPage[1].map(box => (
              <div key={box.id}>{renderBox(box)}</div>
            ))}
          </div>
          <div className="relative w-full md:flex-1" style={{ containerType: 'inline-size' }}>
  <img src="/page2.png" className="w-full h-auto block" />
  {boxesByPage[2].map(box => (
    <div key={box.id}>{renderBox(box)}</div>
  ))}
  {SCRAPBOOK_ANCHORS.map(anchor => {
    const used = materialUsedCount(anchor.material)
    const isScrapbooked = scrapbooked.includes(anchor.material)
    const tb = anchor.totalBox
    const sb = anchor.scrapBox

    return (
      <React.Fragment key={anchor.material}>
        {/* Total box */}
        <div
          className="absolute flex items-center justify-center text-black leading-none overflow-hidden"
          style={{
            left: `${(tb.x / 3300) * 100}%`,
            top: `${(tb.y / 4740) * 100}%`,
            width: `${(tb.w / 3300) * 100}%`,
            height: `${(tb.h / 4740) * 100}%`,
            fontSize: 'min(1.2cqw, 0.8rem)',
          }}
        >
          {used || ''}
        </div>

        {/* Scrapbook checkbox */}
<button
  onClick={() => viewMode !== 'global' && toggleScrapbook(anchor.material)}
  className="absolute flex items-center justify-center leading-none"
  style={{
    left: `${(sb.x / 3300) * 100}%`,
    top: `${(sb.y / 4740) * 100}%`,
    width: `${(sb.w / 3300) * 100}%`,
    height: `${(sb.h / 4740) * 100}%`,
    fontSize: 'min(1.2cqw, 0.8rem)',
    color: 'black',
    background: 'transparent',
    border: 'none',
    pointerEvents: viewMode === 'global' ? 'none' : 'auto',
    cursor: viewMode === 'global' ? 'default' : 'pointer',
  }}
>
  {viewMode === 'global'
  ? (() => {
      const count = members.filter(m =>
        (allScrapbooked[m.user_email] || []).includes(anchor.material)
      ).length
      return count > 0 ? `${count}/${members.length}` : ''
    })()
  : isScrapbooked ? '✔︎' : ''}
</button>
      </React.Fragment>
    )
  })}
</div>


          <Draggable handle=".drag-handle" cancel="input">
            <div
              className="
      fixed
      bottom-20
      right-4
      bg-white/85
      backdrop-blur-sm
      rounded-lg
      shadow-lg
      z-[9999]
    "
              style={{}}
            >
              <div className="drag-handle cursor-move px-3 pt-2 pb-1 text-xs text-gray-400 select-none border-b border-gray-200">
                ⠿
              </div>
              <div className="p-3 flex flex-wrap gap-4" style={{ width: `${500 * (1 / (window.devicePixelRatio || 1))}px`, maxWidth: '90vw', fontSize: `${12 * (1 / (window.devicePixelRatio || 1))}px` }}>
              {sortedMembers.map((m, idx) => {
                const canEdit =
                  (viewMode === 'my' && m.user_email === user?.email) ||
                  (viewMode === 'global' && user?.email === session.host_email)

                return (
                  <div key={m.user_email} className="flex flex-col" style={{ width: 'calc(50% - 8px)' }}>
                    <span className="font-semibold text-gray-800 text-xs truncate">
                      {m.display_name || m.user_email}
                    </span>
                    <span className="mb-2 text-xs text-gray-500">Player {idx + 1}</span>

                    { }
                    <input
                      className="border rounded px-2 py-1 text-xs mb-1"
                      placeholder="Player Name"
                      value={m.player_name ?? ''}
                      disabled={!canEdit}
                      onChange={async e => {
                        const value = e.target.value
                        setMembers(prev =>
                          prev.map(mem =>
                            mem.user_email === m.user_email
                              ? { ...mem, player_name: value }
                              : mem
                          )
                        )
                        await fetch('/api/session_members', {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            session_id: sessionId,
                            user_email: m.user_email,
                            player_name: value
                          })
                        })
                      }}
                    />

                    { }
                    <input
                      className="border rounded px-2 py-1 text-xs mb-1"
                      placeholder="Character Name"
                      value={m.character_name ?? ''}
                      disabled={!canEdit}
                      onChange={async e => {
                        const value = e.target.value
                        setMembers(prev =>
                          prev.map(mem =>
                            mem.user_email === m.user_email
                              ? { ...mem, character_name: value }
                              : mem
                          )
                        )
                        await fetch('/api/session_members', {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            session_id: sessionId,
                            user_email: m.user_email,
                            character_name: value
                          })
                        })
                      }}
                    />

                    { }
                    <div className="border rounded px-2 py-1 text-xs mb-1 bg-gray-50 text-gray-600">
                      {levelsBuilt(m.user_email)} levels
                    </div>

                    { }
                    <div className="border rounded px-2 py-1 text-xs bg-gray-50 text-gray-600">
                      {bangCount(m.user_email)} / 142 "!"
                    </div>
                  </div>
                )
             })}
              </div>
            </div>
          </Draggable>


        </div>


      </div>

      {showStats && (
        <SessionStats
          members={members}
          entries={entries}
          scrapbooked={{ [user?.email ?? '']: scrapbooked }}
          onClose={() => setShowStats(false)}
        />
      )}
    </main>
  )
}
