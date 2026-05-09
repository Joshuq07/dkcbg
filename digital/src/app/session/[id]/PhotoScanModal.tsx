'use client'

import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { environmentList, resourceList, animalList } from '@/lib/dkcbg/data'

const ALL_MATERIALS = [...environmentList, ...resourceList, ...animalList]


interface Props {
  onClose: () => void
  onConfirm: (counts: Record<string, number>) => void
}


function imageFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function scanImageWithClaude(base64: string, mediaType: string): Promise<Record<string, number>> {
  const response = await fetch('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      base64,
      mediaType,
      materialList: ALL_MATERIALS.join(', ')
    })
  })

  const data = await response.json()

  // Build a counts map from the detected array
  const counts: Record<string, number> = {}
  for (const item of data.parsed?.detected || []) {
    const name = item.name
    const count = typeof item.count === 'number' ? item.count : 1
    if (ALL_MATERIALS.includes(name)) {
      counts[name] = (counts[name] || 0) + count
    }
  }

  return counts
}


function CountRow({
  name,
  count,
  onChange,
  dim,
}: {
  name: string
  count: number
  onChange: (val: number) => void
  dim?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-2 p-1.5 rounded-lg ${
        dim && count === 0 ? 'opacity-40' : ''
      }`}
    >
      <Image
        src={`/materials/${name.toLowerCase()}.png`}
        alt={name}
        width={24}
        height={24}
        className="shrink-0"
      />
      <span className="flex-1 text-xs truncate">{name}</span>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onChange(Math.max(0, count - 1))}
          className="w-6 h-6 rounded bg-red-100 text-red-600 hover:bg-red-200 text-sm font-bold leading-none"
        >
          –
        </button>
        <span className="w-5 text-center text-sm font-semibold tabular-nums">{count}</span>
        <button
          onClick={() => onChange(count + 1)}
          className="w-6 h-6 rounded bg-green-100 text-green-600 hover:bg-green-200 text-sm font-bold leading-none"
        >
          +
        </button>
      </div>
    </div>
  )
}


type Phase = 'upload' | 'scanning' | 'confirm' | 'error'

export default function PhotoScanModal({ onClose, onConfirm }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [phase, setPhase] = useState<Phase>('upload')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [errorMsg, setErrorMsg] = useState('')

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return

    const url = URL.createObjectURL(file)
    setImageUrl(url)
    setPhase('scanning')

    try {
      const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
      const base64 = await imageFileToBase64(file)
      const detected = await scanImageWithClaude(base64, mediaType)

      const initial: Record<string, number> = {}
      for (const m of ALL_MATERIALS) {
        initial[m] = detected[m] ?? 0
      }

      setCounts(initial)
      setPhase('confirm')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
      setPhase('error')
    }
  }

  function handleConfirm() {
    onConfirm({ ...counts })
    onClose()
  }

  function handleRetake() {
    setPhase('upload')
    setImageUrl(null)
    setCounts({})
    setErrorMsg('')
  }

  function setCount(mat: string, val: number) {
    setCounts(prev => ({ ...prev, [mat]: val }))
  }

  const detected = ALL_MATERIALS.filter(m => (counts[m] ?? 0) > 0)
  const undetected = ALL_MATERIALS.filter(m => (counts[m] ?? 0) === 0)
  const totalCards = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">

        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Scan Cards</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
        </div>

        {phase === 'upload' && (
          <div className="flex flex-col items-center justify-center gap-6 px-6 py-10">
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Take a photo of your material cards or upload one from your device.
              The AI will read the card names and update your inventory.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
                e.target.value = ''
              }}
            />

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button
                onClick={() => {
                  if (!fileInputRef.current) return
                  fileInputRef.current.removeAttribute('capture')
                  fileInputRef.current.click()
                }}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Upload Photo
              </button>
              <button
                onClick={() => {
                  if (!fileInputRef.current) return
                  fileInputRef.current.setAttribute('capture', 'environment')
                  fileInputRef.current.click()
                }}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Take Photo
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              For best results, lay cards flat in good lighting with names visible.
            </p>
          </div>
        )}

        {phase === 'scanning' && (
          <div className="flex flex-col items-center gap-6 px-6 py-10">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded cards"
                className="w-full max-h-64 object-contain rounded-lg border"
              />
            )}
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Scanning cards…</p>
            </div>
          </div>
        )}

        {phase === 'confirm' && (
          <>
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Scanned cards"
                  className="w-full max-h-48 object-contain rounded-lg border"
                />
              )}

              <p className="text-xs text-gray-500">
                Adjust counts below. Accepting will <strong>replace</strong> your entire inventory with these values.
              </p>

              <div>
                <h3 className="text-sm font-semibold text-green-700 mb-2">
                  ✅ Detected ({detected.length} type{detected.length !== 1 ? 's' : ''}, {totalCards} card{totalCards !== 1 ? 's' : ''} total)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
                  {detected.length === 0 && (
                    <p className="text-xs text-gray-400 col-span-2">No cards detected.</p>
                  )}
                  {detected.map(m => (
                    <CountRow
                      key={m}
                      name={m}
                      count={counts[m] ?? 0}
                      onChange={val => setCount(m, val)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">
                  ❌ Not detected
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
                  {undetected.map(m => (
                    <CountRow
                      key={m}
                      name={m}
                      count={counts[m] ?? 0}
                      onChange={val => setCount(m, val)}
                      dim
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 py-4 border-t shrink-0">
              <button
                onClick={handleRetake}
                className="flex-1 px-4 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50"
              >
                Retake / Reupload
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
              >
                Accept ({totalCards} card{totalCards !== 1 ? 's' : ''})
              </button>
            </div>
          </>
        )}

        {phase === 'error' && (
          <div className="flex flex-col items-center gap-4 px-6 py-10">
            <p className="text-red-600 text-sm text-center">{errorMsg || 'Something went wrong.'}</p>
            <button
              onClick={handleRetake}
              className="px-4 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50"
            >
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
