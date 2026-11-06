'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

const RulesViewer = dynamic(() => import('@/components/RulesViewer'), {
  ssr: false,
  loading: () => <div className="p-8 text-gray-500 text-sm">Loading rules…</div>,
})

export default function Rules() {
  const [query, setQuery] = useState('')
  const [dimness, setDimness] = useState(100)
  const [jumpSignal, setJumpSignal] = useState(0)
  const [matchCount, setMatchCount] = useState(0)

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0 flex-wrap">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') setJumpSignal(n => n + 1) }}
          placeholder="Search rules…"
          className="flex-1 min-w-0 bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2 text-sm outline-none"
        />
        {query.trim() && (
          <span className="text-gray-500 text-xs shrink-0">
            {matchCount} match{matchCount !== 1 ? 'es' : ''}
          </span>
        )}
        <select
          value={dimness}
          onChange={e => setDimness(Number(e.target.value))}
          className="border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-700 bg-white"
        >
          {[100, 80, 70, 60, 50, 40].map(v => (
            <option key={v} value={v}>{v}%</option>
          ))}
        </select>
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-700 text-sm px-2">
            ✕
          </button>
        )}
      </div>

      <RulesViewer
        query={query}
        dimness={dimness}
        jumpSignal={jumpSignal}
        onMatchCount={setMatchCount}
      />
    </div>
  )
}