import { useEffect, useRef } from 'react'
import { Play, Pause } from '@phosphor-icons/react'

type Props = {
  label: string
  src: string
  isPlaying: boolean
  onToggle: () => void
  onEnded: () => void
}

/** A tap-to-play / tap-to-pause circle paired with its short label. */
export function AudioCircle({ label, src, isPlaying, onToggle, onEnded }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)

  // Drive the element from the parent-owned isPlaying flag so only one
  // circle ever plays at a time.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(() => onEnded())
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [isPlaying, onEnded])

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onToggle}
        aria-label={isPlaying ? `Pause ${label}` : `Play ${label}`}
        className={`flex h-28 w-28 items-center justify-center rounded-full transition-transform active:scale-95 ${
          isPlaying ? 'bg-emerald-500 text-black' : 'bg-neutral-800 text-neutral-100'
        }`}
      >
        {isPlaying ? (
          <Pause weight="fill" size={40} />
        ) : (
          <Play weight="fill" size={40} />
        )}
      </button>
      <span className="max-w-32 text-center text-lg font-medium break-words">
        {label}
      </span>
      <audio ref={audioRef} src={src} onEnded={onEnded} preload="none" />
    </div>
  )
}
