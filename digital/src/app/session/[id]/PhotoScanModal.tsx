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
      resolve(result.split(',')[1]) // strip data:image/...;base64,
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
  const [checkedDetected, setCheckedDetected] = useState<Set<string>>(new Set())
  const [checkedUndetected, setCheckedUndetected] = useState<Set<string>>(new Set())
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
      setCheckedDetected(new Set(result.detected))
      setCheckedUndetected(new Set())
      setPhase('confirm')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
      setPhase('error')
    }
  }

  function handleConfirm() {
    if (!scanResult) return
    const finalDetected = new Set([...Array.from(checkedDetected), ...Array.from(checkedUndetected)])
    const counts: Record<string, number> = {}
    for (const m of ALL_MATERIALS) {
      counts[m] = finalDetected.has(m) ? 1 : 0
    }
    onConfirm(counts)
    onClose()
  }

  function handleRetake() {
    setPhase('upload')
    setImageUrl(null)
    setScanResult(null)
    setCheckedDetected(new Set())
    setCheckedUndetected(new Set())
    setErrorMsg('')
  }

  function toggleDetected(m: string) {
    setCheckedDetected(prev => {
      const next = new Set(prev)
      if (next.has(m)) next.delete(m); else next.add(m)
      return next
    })
  }

  function toggleUndetected(m: string) {
    setCheckedUndetected(prev => {
      const next = new Set(prev)
      if (next.has(m)) next.delete(m); else next.add(m)
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

        {/* ── UPLOAD phase ── */}
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
              capture="environment"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.removeAttribute('capture')
                    fileInputRef.current.click()
                  }
                }}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                📁 Upload Photo
              </button>
              <button
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute('capture', 'environment')
                    fileInputRef.current.click()
                  }
                }}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                📷 Take Photo
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center">
              For best results, lay cards flat in good lighting with names visible.
            </p>
          </div>
        )}

        {/* ── SCANNING phase ── */}
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
              <p className="text-sm text-gray-500">Scanning cards with AI…</p>
            </div>
          </div>
        )}

        {/* ── CONFIRM phase ── */}
        {phase === 'confirm' && scanResult && (
          <>
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
              {/* Image preview */}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Scanned cards"
                  className="w-full max-h-48 object-contain rounded-lg border"
                />
              )}

              <p className="text-xs text-gray-500">
                Review the results below. Accepting will <strong>replace</strong> your entire inventory with only the checked cards.
              </p>

              {/* Detected */}
              <div>
                <h3 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                  <span>✅ Detected ({checkedDetected.size})</span>
                  <span className="text-xs font-normal text-gray-400 ml-1">— uncheck to exclude</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {scanResult.detected.map(m => (
                    <label key={m} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-green-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checkedDetected.has(m)}
                        onChange={() => toggleDetected(m)}
                        className="accent-green-600 shrink-0"
                      />
                      <Image
                        src={`/materials/${m.toLowerCase()}.png`}
                        alt={m}
                        width={20}
                        height={20}
                        className="shrink-0"
                      />
                      <span className="text-xs truncate">{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Not detected — only show if there are any */}
              {scanResult.undetected.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1">
                    <span>❌ Not detected ({checkedUndetected.size} added back)</span>
                    <span className="text-xs font-normal text-gray-400 ml-1">— check to include</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                    {scanResult.undetected.map(m => (
                      <label key={m} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer opacity-60">
                        <input
                          type="checkbox"
                          checked={checkedUndetected.has(m)}
                          onChange={() => toggleUndetected(m)}
                          className="accent-red-600 shrink-0"
                        />
                        <Image
                          src={`/materials/${m.toLowerCase()}.png`}
                          alt={m}
                          width={20}
                          height={20}
                          className="shrink-0"
                        />
                        <span className="text-xs truncate">{m}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
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
                Accept ({checkedDetected.size + checkedUndetected.size} cards)
              </button>
            </div>
          </>
        )}

        {/* ── ERROR phase ── */}
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
