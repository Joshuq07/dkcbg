'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  IMAGE_WIDTH,
  IMAGE_HEIGHT,
  LevelAnchor,
  boxesFromLevelAnchor,
} from '@/lib/boxes'

const DISPLAY_WIDTH = 660
const DISPLAY_HEIGHT = 948
const SCALE = DISPLAY_WIDTH / IMAGE_WIDTH

type DragState = { level: number; page: 1 | 2; offsetX: number; offsetY: number } | null

function makeId() {
  return 'anchor_' + Math.random().toString(36).slice(2, 8)
}

type AnchorWithId = LevelAnchor & { id: string }

function toDisplay(v: number) {
  return Math.round(v * SCALE)
}
function toOriginal(v: number) {
  return Math.round(v / SCALE)
}

function PageEditor({
  page,
  imageSrc,
  anchors,
  setAnchors,
}: {
  page: 1 | 2
  imageSrc: string | null
  anchors: AnchorWithId[]
  setAnchors: (fn: (prev: AnchorWithId[]) => AnchorWithId[]) => void
}) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const dragRef = useRef<DragState>(null)

  const selected = anchors.find(a => a.id === selectedId) || null

  const addAnchorAtClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = toOriginal(e.clientX - rect.left)
    const y = toOriginal(e.clientY - rect.top)

    const level = anchors.length + (page === 1 ? 1 : 88)

    const newAnchor: AnchorWithId = {
      id: makeId(),
      level,
      page,
      x,
      y,
    }
    setAnchors(prev => [...prev, newAnchor])
    setSelectedId(newAnchor.id)
  }

  const onAnchorMouseDown = useCallback(
    (e: React.MouseEvent, anchor: AnchorWithId) => {
      e.stopPropagation()
      setSelectedId(anchor.id)
      dragRef.current = {
        level: anchor.level,
        page: anchor.page,
        offsetX: e.clientX - toDisplay(anchor.x),
        offsetY: e.clientY - toDisplay(anchor.y),
      }
    },
    []
  )

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragRef.current) return
      const { level, page, offsetX, offsetY } = dragRef.current
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const newX = Math.max(0, Math.min(e.clientX - offsetX, DISPLAY_WIDTH - 20))
      const newY = Math.max(0, Math.min(e.clientY - offsetY, DISPLAY_HEIGHT - 20))

      setAnchors(prev =>
        prev.map(a =>
          a.level === level && a.page === page
            ? { ...a, x: toOriginal(newX), y: toOriginal(newY) }
            : a
        )
      )
    }
    function onMouseUp() {
      dragRef.current = null
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [setAnchors])

  function updateAnchor(id: string, patch: Partial<AnchorWithId>) {
    setAnchors(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)))
  }

  function deleteAnchor(id: string) {
    setAnchors(prev => prev.filter(a => a.id !== id))
    setSelectedId(null)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-700">Page {page}</h2>
        <p className="text-xs text-gray-500">
          Click on the image to add a level anchor (top-left of box 1).
        </p>
      </div>

      <div
        ref={canvasRef}
        className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 cursor-crosshair"
        style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT }}
        onClick={addAnchorAtClick}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`Page ${page}`}
            className="absolute inset-0 w-full h-full object-fill pointer-events-none"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            Upload Page {page} PNG below
          </div>
        )}

        {anchors.map(anchor => {
          const boxes = boxesFromLevelAnchor(anchor)
          return (
            <div key={anchor.id}>
              {boxes.map(box => (
                <div
                  key={box.id}
                  className="absolute border border-orange-400 bg-orange-400/20 text-[8px] text-orange-800 flex items-center justify-center"
                  style={{
                    left: toDisplay(box.x),
                    top: toDisplay(box.y),
                    width: toDisplay(box.w),
                    height: toDisplay(box.h),
                  }}
                >
                  {box.type}
                </div>
              ))}
              {/* small draggable handle at the anchor */}
              <div
                onMouseDown={e => onAnchorMouseDown(e, anchor)}
                className={`absolute w-3 h-3 rounded-full border-2 ${
                  selectedId === anchor.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-orange-500 bg-white'
                }`}
                style={{
                  left: toDisplay(anchor.x) - 4,
                  top: toDisplay(anchor.y) - 4,
                  cursor: 'move',
                }}
              />
            </div>
          )
        })}
      </div>

      {selected && (
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700">
              Level {selected.level} (Page {selected.page})
            </span>
            <button
              onClick={() => deleteAnchor(selected.id)}
              className="text-red-500 text-xs hover:text-red-700"
            >
              Delete
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-gray-500 block mb-0.5">x</label>
              <input
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                value={selected.x}
                onChange={e =>
                  updateAnchor(selected.id, { x: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-0.5">y</label>
              <input
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                value={selected.y}
                onChange={e =>
                  updateAnchor(selected.id, { y: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-0.5">
                hOverride (optional)
              </label>
              <input
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                value={selected.hOverride ?? ''}
                onChange={e =>
                  updateAnchor(selected.id, {
                    hOverride: e.target.value
                      ? parseInt(e.target.value) || undefined
                      : undefined,
                  })
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function LayoutEditorPage() {
  const [anchors1, setAnchors1] = useState<AnchorWithId[]>([])
  const [anchors2, setAnchors2] = useState<AnchorWithId[]>([])
  const [img1Src, setImg1Src] = useState<string | null>(null)
  const [img2Src, setImg2Src] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  function loadImage(
    e: React.ChangeEvent<HTMLInputElement>,
    setImg: (s: string) => void
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setImg(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function generateCode() {
    const fmt = (anchors: AnchorWithId[], varName: string) =>
      `export const ${varName}: LevelAnchor[] = [\n` +
      anchors
        .map(
          a =>
            `  { level: ${a.level}, page: ${a.page}, x: ${a.x}, y: ${a.y}${
              a.hOverride ? `, hOverride: ${a.hOverride}` : ''
            } },`
        )
        .join('\n') +
      '\n]'

    return [
      `import { LevelAnchor } from '@/lib/boxes'\n`,
      fmt(anchors1, 'LEVEL_ANCHORS_IMAGE_1'),
      '',
      fmt(anchors2, 'LEVEL_ANCHORS_IMAGE_2'),
    ].join('\n')
  }

  async function copyCode() {
    await navigator.clipboard.writeText(generateCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="page-container">
      <h1 className="text-3xl font-bold mb-1">Layout Editor (Level Anchors)</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Upload your PNGs, click to place the top-left of each level, fine-tune with
        the number inputs, then copy the generated anchors into
        <code> src/lib/boxes.ts</code>.
      </p>

      <div className="flex gap-4 mb-6">
        {[1, 2].map(n => (
          <div key={n} className="card flex-1 py-3">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Upload Page {n} PNG
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={e => loadImage(e, n === 1 ? setImg1Src : setImg2Src)}
              className="text-sm text-gray-500"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        <PageEditor
          page={1}
          imageSrc={img1Src}
          anchors={anchors1}
          setAnchors={setAnchors1}
        />
        <PageEditor
          page={2}
          imageSrc={img2Src}
          anchors={anchors2}
          setAnchors={setAnchors2}
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-gray-700">Generated Level Anchors</h2>
          <button onClick={copyCode} className="btn-primary text-sm">
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>
        <pre className="bg-gray-900 text-green-400 text-xs rounded-xl p-4 overflow-auto max-h-72">
          {generateCode()}
        </pre>
        <p className="text-xs text-gray-400 mt-2">
          Paste this into <code>src/lib/boxes.ts</code> and wire it into your runtime
          layout logic.
        </p>
      </div>
    </main>
  )
}
