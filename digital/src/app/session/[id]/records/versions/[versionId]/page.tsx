'use client'

import { useParams, useRouter } from 'next/navigation'
import { VERSIONS, GAMES, PLAYERS } from '@/app/session/[id]/records/data'
import type { VersionId } from '@/lib/types'

const PLACEMENT_COLORS: Record<number, string> = {
  1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32', 4: '#6B7280',
}
const PLACEMENT_LABELS: Record<number, string> = {
  1: '1st', 2: '2nd', 3: '3rd', 4: '4th',
}

export default function VersionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string
  const versionId = params.versionId as VersionId

  const versionIndex = VERSIONS.findIndex(v => v.id === versionId)
  const version = VERSIONS[versionIndex]
  const prevVersion = VERSIONS[versionIndex - 1] ?? null
  const nextVersion = VERSIONS[versionIndex + 1] ?? null

  const gamesOnVersion = GAMES.filter(g => g.version === versionId)
    .sort((a, b) => b.date.localeCompare(a.date))

  if (!version) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-800 mb-4">← Back</button>
          <div className="text-gray-400 italic">Version not found.</div>
        </div>
      </main>
    )
  }

  const isLatest = versionIndex === VERSIONS.length - 1

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.push(`/session/${sessionId}/records`)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
        >
          ← Back to Records
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{version.displayName}</h1>
          {isLatest && (
            <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">Current</span>
          )}
        </div>
        <div className="text-sm text-gray-400 mb-6">{version.date}</div>

        {/* Prev / Next nav */}
        <div className="flex gap-2 mb-8">
          {prevVersion && (
            <button
              onClick={() => router.push(`/session/${sessionId}/records/versions/${prevVersion.id}`)}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-gray-400 transition-all"
            >
              ← {prevVersion.displayName}
            </button>
          )}
          {nextVersion && (
            <button
              onClick={() => router.push(`/session/${sessionId}/records/versions/${nextVersion.id}`)}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-gray-400 transition-all"
            >
              {nextVersion.displayName} →
            </button>
          )}
        </div>

        {/* Full timeline */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">All Versions</div>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-1 pl-10">
              {[...VERSIONS].reverse().map((v, i) => {
                const isActive = v.id === versionId
                const isCurrentVersion = i === 0
                return (
                  <button
                    key={v.id}
                    onClick={() => router.push(`/session/${sessionId}/records/versions/${v.id}`)}
                    className="relative w-full text-left px-4 py-3 rounded-xl transition-all"
                    style={{
                      background: isActive ? '#1f2937' : 'white',
                      border: isActive ? '1.5px solid #1f2937' : '1px solid #f3f4f6',
                      boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute -left-7 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white"
                      style={{ background: isActive ? '#1f2937' : isCurrentVersion ? '#374151' : '#d1d5db' }}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-bold text-sm"
                          style={{ color: isActive ? 'white' : '#1f2937' }}
                        >
                          {v.displayName}
                        </span>
                        {isCurrentVersion && !isActive && (
                          <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">Current</span>
                        )}
                      </div>
                      <span
                        className="text-xs"
                        style={{ color: isActive ? '#9ca3af' : '#6b7280' }}
                      >
                        {v.date}
                      </span>
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: isActive ? '#d1d5db' : '#6b7280' }}
                    >
                      {v.summary}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Version detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          {/* Summary + highlights */}
          <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Summary</div>
            <p className="text-sm text-gray-700 mb-4">{version.summary}</p>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Highlights</div>
            <ul className="space-y-1.5">
              {version.highlights.map(h => (
                <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-0.5 text-gray-300">—</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Stats schema */}
          <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Tracked Stats</div>
            <div className="space-y-2">
              {version.statsSchema.map(stat => (
                <div
                  key={stat.key}
                  className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0"
                >
                  <span className="text-gray-700">{stat.label}</span>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded font-mono">{stat.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Games played on this version */}
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Games on {version.displayName} ({gamesOnVersion.length})
          </div>
          {gamesOnVersion.length === 0 ? (
            <div className="text-sm text-gray-300 italic">No games recorded on this version.</div>
          ) : (
            <div className="space-y-2">
              {gamesOnVersion.map(game => (
                <button
                  key={game.id}
                  onClick={() => router.push(`/session/${sessionId}/records/games/${game.id}`)}
                  className="w-full text-left p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-gray-800 group-hover:text-black text-sm">
                        {game.name ?? game.id}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{game.date}</div>
                    </div>
                    <span className="text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {game.placements.map(p => (
                      <div
                        key={p.playerId}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                        style={{
                          background: `${PLACEMENT_COLORS[p.place]}18`,
                          border: `1px solid ${PLACEMENT_COLORS[p.place]}55`,
                        }}
                      >
                        <span style={{ color: PLACEMENT_COLORS[p.place], fontWeight: 700 }}>
                          {PLACEMENT_LABELS[p.place]}
                        </span>
                        <span className="text-gray-600 ml-0.5">
                          {PLAYERS.find(pl => pl.id === p.playerId)?.name ?? p.playerId}
                        </span>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}