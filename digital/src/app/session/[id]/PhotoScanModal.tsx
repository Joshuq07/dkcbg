'use client'

import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { environmentList, resourceList, animalList } from '@/lib/dkcbg/data'

const ALL_MATERIALS = [...environmentList, ...resourceList, ...animalList]

// ── Types ────────────────────────────────────────────────────────────────────

interface ScanResult {
  detected: string[]
  undetected: string[]
}

interface Props {
  onClose: () => void
  onConfirm: (counts: Record<string, number>) => void
}

// ── Helpers ──────────────────────────────────────────────────────────────────

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

async function scanImageWithClaude(base64: string, mediaType: string): Promise<ScanResult> {
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

  const detected: string[] = []

  for (const item of data.parsed?.detected || []) {
    const name = item.name
    const count = item.count ?? 1

    for (let i = 0; i < count; i++) {
      detected.push(name)
    }
  }

  const detectedSet = new Set(detected)
  const undetected = ALL_MATERIALS.filter(m => !detectedSet.has(m))

  return { detected, undetected }
}

// ── Component ─────────────────────────────────────────────────────────────────

type Phase = 'upload' | 'scanning' | 'confirm' | 'error'

export default function PhotoScanModal({ onClose, onConfirm }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [phase, setPhase] = useState<Phase>('upload')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)

  // ✅ COUNTER MAP STATE (fixed)
  const [checkedDetected, setCheckedDetected] = useState<Record<string, number>>({})
  const [checkedUndetected, setCheckedUndetected] = useState<Record<string, number>>({})

  const [errorMsg, setErrorMsg] = useState('')

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return

    const url = URL.createObjectURL(file)
    setImageUrl(url)
    setPhase('scanning')

    try {
      const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
      const base64 = await imageFileToBase64(file)
      const result = await scanImageWithClaude(base64, mediaType)

      setScanResult(result)

      // initialize counters
      const detectedInit: Record<string, number> = {}
      for (const m of result.detected) {
        detectedInit[m] = (detectedInit[m] || 0) + 1
      }

      setCheckedDetected(detectedInit)
      setCheckedUndetected({})

      setPhase('confirm')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
      setPhase('error')
    }
  }

  function handleConfirm() {
    const counts: Record<string, number> = {}

    for (const m of ALL_MATERIALS) counts[m] = 0

    for (const [m, c] of Object.entries(checkedDetected)) {
      counts[m] += c
    }

    for (const [m, c] of Object.entries(checkedUndetected)) {
      counts[m] += c
    }

    onConfirm(counts)
    onClose()
  }

  function handleRetake() {
    setPhase('upload')
    setImageUrl(null)
    setScanResult(null)
    setCheckedDetected({})
    setCheckedUndetected({})
    setErrorMsg('')
  }

  function toggleDetected(m: string) {
    setCheckedDetected(prev => {
      const next = { ...prev }
      next[m] = next[m] ? next[m] + 1 : 1
      return next
    })
  }

  function toggleUndetected(m: string) {
    setCheckedUndetected(prev => {
      const next = { ...prev }
      next[m] = next[m] ? next[m] + 1 : 1
      return next
    })
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Scan Cards</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
        </div>

        {/* UPLOAD */}
        {phase === 'upload' && (
          <div className="flex flex-col items-center justify-center gap-6 px-6 py-10">
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Take a photo or upload one. AI will detect your materials.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-sm"
              >
                📁 Upload / Take Photo
              </button>
            </div>
          </div>
        )}

        {/* SCANNING */}
        {phase === 'scanning' && (
          <div className="flex flex-col items-center gap-6 px-6 py-10">
            {imageUrl && (
              <img src={imageUrl} className="w-full max-h-64 object-contain rounded-lg border" />
            )}
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* CONFIRM */}
        {phase === 'confirm' && scanResult && (
          <>
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

              {imageUrl && (
                <img src={imageUrl} className="w-full max-h-48 object-contain rounded-lg border" />
              )}

              <div>
                <h3 className="font-semibold text-green-700 mb-2">
                  Detected
                </h3>

                {scanResult.detected.map(m => (
                  <label key={m} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={!!checkedDetected[m]}
                      onChange={() => toggleDetected(m)}
                    />
                    <span>{m}</span>
                  </label>
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-red-600 mb-2">
                  Not Detected
                </h3>

                {scanResult.undetected.map(m => (
                  <label key={m} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={!!checkedUndetected[m]}
                      onChange={() => toggleUndetected(m)}
                    />
                    <span>{m}</span>
                  </label>
                ))}
              </div>

            </div>

            <div className="flex gap-3 px-5 py-4 border-t">
              <button onClick={handleRetake} className="flex-1 border rounded-lg py-2">
                Retake
              </button>
              <button onClick={handleConfirm} className="flex-1 bg-blue-600 text-white rounded-lg py-2">
                Confirm
              </button>
            </div>
          </>
        )}

        {/* ERROR */}
        {phase === 'error' && (
          <div className="p-6 text-red-600 text-center">
            {errorMsg}
          </div>
        )}

      </div>
    </div>
  )
}