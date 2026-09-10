import { useState } from 'react'
import { exerciseGifUrl, exerciseImageUrl } from '@/shared/lib/media'
import type { Exercise } from '@/shared/types/session.types'

interface Props {
  exercise?: Pick<Exercise, 'name' | 'image' | 'gifUrl'>
  className?: string
  onInfo?: (() => void) | null
  size?: 'sm' | 'md'
}

export default function ExerciseThumb({ exercise, className = '', onInfo = null, size = 'sm' }: Props) {
  const [hover, setHover] = useState(false)
  const image = exercise?.image ? exerciseImageUrl(exercise.image) : undefined
  const gif = exercise?.gifUrl ? exerciseGifUrl(exercise.gifUrl) : undefined
  const src = hover && gif ? gif : image

  const sizeClass =
    size === 'md' ? 'w-20 h-20' : 'w-14 h-14'

  return (
    <div
      className={`relative shrink-0 ${sizeClass} rounded-lg overflow-hidden border border-green/25 bg-black/40 ${className}`}
      onMouseEnter={() => setHover(!!gif)}
      onMouseLeave={() => setHover(false)}
    >
      {src ? (
        <img
          src={src}
          alt={exercise?.name ?? ''}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="material-symbols-outlined text-text-muted text-[20px]">fitness_center</span>
        </div>
      )}

      {gif && !hover && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="material-symbols-outlined text-white text-[18px] drop-shadow">play_circle</span>
        </div>
      )}

      {onInfo && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onInfo()
          }}
          aria-label={`Información de ${exercise?.name ?? 'ejercicio'}`}
          className="absolute bottom-0.5 right-0.5 p-0.5 rounded-full bg-black/60 hover:bg-primary-fixed hover:text-on-primary-fixed text-white transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[13px]">info</span>
        </button>
      )}
    </div>
  )
}
