import { useEffect, useRef } from 'react'
import { Play, Pause } from '@phosphor-icons/react'
import { ICONS } from '../lib/icons'

type Props = {
  label: string
  src: string
  isPlaying: boolean
  onToggle: () => void
  onEnded: () => void
  /** optional phosphor icon name shown at rest (falls back to Play) */
  icon?: string
  /** whether to render the text label under the circle (default true) */
  showLabel?: boolean
}

/** A tap-to-play / tap-to-pause circle paired with its short label. */
export function AudioCircle({ label, src, isPlaying, onToggle, onEnded, icon, showLabel = true }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const Meaning = icon ? ICONS[icon] : undefined

  // When this circle is no longer the active one (another was tapped, or it
  // finished), stop and rewind it. Starting playback is NOT done here: iOS
  // Safari only honours play() called directly inside the tap handler, so the
  // effect would run too late in the gesture and be blocked.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || isPlaying) return
    audio.pause()
    audio.currentTime = 0
  }, [isPlaying])

  function handleClick() {
    const audio = audioRef.current
    if (audio && !isPlaying) {
      // Kick off playback synchronously within the user gesture so iOS allows it.
      audio.currentTime = 0
      audio.play().catch(() => onEnded())
    }
    onToggle()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        aria-label={isPlaying ? `Pause ${label}` : `Play ${label}`}
        className={`flex h-28 w-28 items-center justify-center rounded-full transition-transform active:scale-95 ${
          isPlaying ? 'bg-emerald-500 text-black' : 'bg-neutral-800 text-neutral-100'
        }`}
      >
        {isPlaying ? (
          <Pause weight="fill" size={40} />
        ) : Meaning ? (
          <Meaning weight="duotone" size={44} />
        ) : (
          <Play weight="fill" size={40} />
        )}
      </button>
      {showLabel && (
        <span className="max-w-32 text-center text-lg font-medium break-words">
          {label}
        </span>
      )}
      <audio ref={audioRef} src={src} onEnded={onEnded} preload="metadata" playsInline />
    </div>
  )
}
