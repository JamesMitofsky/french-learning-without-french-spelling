import { useEffect, useMemo, useRef, useState } from 'react'
import JSZip from 'jszip'
import { Microphone, Stop, Trash, DownloadSimple } from '@phosphor-icons/react'
import { loadPairs } from '../lib/pairs'
import type { Pair } from '../lib/types'
import { extForMime, type Draft } from '../lib/recording'
import { SearchInput } from './SearchInput'

export function StudioView() {
  const [existing, setExisting] = useState<Pair[]>([])
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  // Load the current manifest so exports are cumulative (existing + new).
  useEffect(() => {
    loadPairs().then(setExisting).catch(() => setExisting([]))
  }, [])

  // Revoke object URLs on unmount to avoid leaks.
  useEffect(() => {
    return () => drafts.forEach((d) => URL.revokeObjectURL(d.url))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function startRecording() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const mime = recorder.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: mime })
        const draft: Draft = {
          id: crypto.randomUUID(),
          label: '',
          blob,
          ext: extForMime(mime),
          url: URL.createObjectURL(blob),
        }
        setDrafts((cur) => [...cur, draft])
        stream.getTracks().forEach((t) => t.stop())
      }
      recorder.start()
      recorderRef.current = recorder
      setIsRecording(true)
    } catch {
      setError('Microphone access denied or unavailable.')
    }
  }

  function stopRecording() {
    recorderRef.current?.stop()
    recorderRef.current = null
    setIsRecording(false)
  }

  function updateLabel(id: string, label: string) {
    setDrafts((cur) => cur.map((d) => (d.id === id ? { ...d, label } : d)))
  }

  function deleteDraft(id: string) {
    setDrafts((cur) => {
      const target = cur.find((d) => d.id === id)
      if (target) URL.revokeObjectURL(target.url)
      return cur.filter((d) => d.id !== id)
    })
  }

  const unlabeled = drafts.filter((d) => d.label.trim() === '').length

  async function exportZip() {
    if (drafts.length === 0) {
      setError('Record at least one clip before exporting.')
      return
    }
    if (unlabeled > 0) {
      setError(`${unlabeled} clip(s) still need a label.`)
      return
    }
    setError(null)

    const zip = new JSZip()
    const audioDir = zip.folder('audio')!

    const newPairs: Pair[] = drafts.map((d) => {
      const audioFile = `audio/${d.id}.${d.ext}`
      audioDir.file(`${d.id}.${d.ext}`, d.blob)
      return { id: d.id, label: d.label.trim(), audioFile }
    })

    const merged: Pair[] = [...existing, ...newPairs]
    zip.file('pairs.json', JSON.stringify(merged, null, 2))

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data-export.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredExisting = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return existing
    return existing.filter((p) => p.label.toLowerCase().includes(q))
  }, [existing, query])

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 text-sm text-neutral-400">
        Record a clip, label it, then export. Unzip{' '}
        <code className="text-neutral-200">data-export.zip</code> into{' '}
        <code className="text-neutral-200">public/data/</code> — it replaces{' '}
        <code className="text-neutral-200">pairs.json</code> and adds the new
        audio files. Commit and push.
      </div>

      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={`flex items-center justify-center gap-2 rounded-2xl py-5 text-lg font-semibold transition-colors ${
          isRecording
            ? 'bg-red-500 text-white'
            : 'bg-emerald-500 text-black'
        }`}
      >
        {isRecording ? (
          <>
            <Stop weight="fill" size={24} /> Stop
          </>
        ) : (
          <>
            <Microphone weight="fill" size={24} /> Record
          </>
        )}
      </button>

      {error && <p className="text-center text-red-400">{error}</p>}

      {/* New, unsaved recordings */}
      {drafts.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-neutral-400 uppercase">
            New clips ({drafts.length})
          </h2>
          {drafts.map((d) => (
            <div
              key={d.id}
              className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-3"
            >
              <input
                type="text"
                value={d.label}
                onChange={(e) => updateLabel(d.id, e.target.value)}
                placeholder="Label (e.g. bonjour)"
                className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-100 outline-none focus:border-neutral-600"
              />
              <div className="flex items-center gap-3">
                <audio src={d.url} controls className="h-10 w-full" />
                <button
                  type="button"
                  onClick={() => deleteDraft(d.id)}
                  aria-label="Delete clip"
                  className="shrink-0 rounded-xl bg-neutral-800 p-2 text-red-400 active:scale-95"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={exportZip}
        disabled={drafts.length === 0}
        className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-700 py-4 font-semibold text-neutral-100 disabled:opacity-40"
      >
        <DownloadSimple size={22} /> Export zip ({existing.length + drafts.length}{' '}
        total)
      </button>

      {/* Already-published pairs, for reference */}
      {existing.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-neutral-800 pt-6">
          <h2 className="text-sm font-semibold text-neutral-400 uppercase">
            Already published ({existing.length})
          </h2>
          <SearchInput value={query} onChange={setQuery} placeholder="Search published…" />
          <ul className="flex flex-col gap-1">
            {filteredExisting.map((p) => (
              <li
                key={p.id}
                className="rounded-lg bg-neutral-900 px-3 py-2 text-neutral-300"
              >
                {p.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
