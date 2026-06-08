import { useEffect, useMemo, useState } from 'react'
import { loadPairs, audioUrl } from '../lib/pairs'
import type { Pair } from '../lib/types'
import { AudioCircle } from './AudioCircle'
import { SearchInput } from './SearchInput'
import { Switch } from './ui/switch'

export function PlayerView() {
  const [pairs, setPairs] = useState<Pair[] | null>(null)
  const [query, setQuery] = useState('')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [showLabels, setShowLabels] = useState(true)

  useEffect(() => {
    loadPairs().then(setPairs).catch(() => setPairs([]))
  }, [])

  const filtered = useMemo(() => {
    if (!pairs) return []
    const q = query.trim().toLowerCase()
    if (!q) return pairs
    return pairs.filter((p) => p.label.toLowerCase().includes(q))
  }, [pairs, query])

  if (pairs === null) {
    return <p className="py-20 text-center text-neutral-500">Loading…</p>
  }

  if (pairs.length === 0) {
    return (
      <p className="py-20 text-center text-neutral-500">
        No recordings yet. Open the studio to create some.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <SearchInput value={query} onChange={setQuery} placeholder="Search labels…" />

      <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-neutral-300">
        <span>Show labels</span>
        <Switch checked={showLabels} onCheckedChange={setShowLabels} />
      </label>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
        {filtered.map((pair) => (
          <AudioCircle
            key={pair.id}
            label={pair.label}
            icon={pair.icon}
            src={audioUrl(pair)}
            isPlaying={playingId === pair.id}
            showLabel={showLabels}
            onToggle={() =>
              setPlayingId((cur) => (cur === pair.id ? null : pair.id))
            }
            onEnded={() => setPlayingId(null)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-neutral-500">No matches.</p>
      )}
    </div>
  )
}
