'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
const PDF_URL = '/Rules/5.2.pdf'

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function RulesViewer({
  query,
  dimness,
  jumpSignal,
  onMatchCount,
}: {
  query: string
  dimness: number
  jumpSignal: number
  onMatchCount: (n: number) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])
  const cursor = useRef(0)

  const [numPages, setNumPages] = useState(0)
  const [pageTexts, setPageTexts] = useState<string[]>([])
  const [width, setWidth] = useState(800)

  // Fit page width to the container (max 1100px)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width
      setWidth(Math.min(1100, Math.max(300, w - 32)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const q = query.trim().toLowerCase()

  // Pages that contain the query, plus total occurrences
  const { matchPages, total } = useMemo(() => {
    if (!q) return { matchPages: [] as number[], total: 0 }
    const pages: number[] = []
    let count = 0
    pageTexts.forEach((t, i) => {
      const n = t.split(q).length - 1
      if (n > 0) {
        pages.push(i + 1)
        count += n
      }
    })
    return { matchPages: pages, total: count }
  }, [q, pageTexts])

  useEffect(() => { onMatchCount(total) }, [total, onMatchCount])

  // Restart from the first match when the search changes
  useEffect(() => { cursor.current = 0 }, [q])

  // Enter in the search box jumps to the next page with a match
  useEffect(() => {
    if (jumpSignal === 0 || matchPages.length === 0) return
    const page = matchPages[cursor.current % matchPages.length]
    cursor.current++
    pageRefs.current[page - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [jumpSignal]) // eslint-disable-line react-hooks/exhaustive-deps

  // Highlights matches inside each text item of the page
  const highlight = useMemo(() => {
    if (!q) return (item: { str: string }) => escapeHtml(item.str)
    const re = new RegExp(escapeRegex(escapeHtml(q)), 'gi')
    return (item: { str: string }) =>
      escapeHtml(item.str).replace(re, m => `<mark style="background:#facc15;color:transparent">${m}</mark>`)
  }, [q])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-auto bg-gray-200"
    >
      <div style={{ filter: `brightness(${dimness}%)` }} className="flex flex-col items-center gap-4 py-4">
        <Document
          file={PDF_URL}
          externalLinkTarget="_blank"
          externalLinkRel="noopener noreferrer"
          onItemClick={({ pageNumber }) => {
            pageRefs.current[pageNumber - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          onLoadSuccess={async pdf => {
            setNumPages(pdf.numPages)
            const texts: string[] = []
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i)
              const content = await page.getTextContent()
              texts.push(
                content.items.map(it => ('str' in it ? it.str : '')).join(' ').toLowerCase()
              )
            }
            setPageTexts(texts)
          }}
          loading={<div className="text-gray-500 text-sm p-8">Loading rules…</div>}
          error={<div className="text-red-500 text-sm p-8">Couldn't load the rules PDF.</div>}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <div
              key={i}
              ref={el => { pageRefs.current[i] = el }}
              className="shadow-md bg-white"
            >
              <Page
                pageNumber={i + 1}
                width={width}
                renderTextLayer
                renderAnnotationLayer
                customTextRenderer={highlight}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  )
}