import type { Exercise } from '@/shared/types/session.types'
import { exerciseGifUrl, exerciseImageUrl } from '@/shared/lib/media'
import { GreenTag } from '@/design-system/components/GreenTag'
import { Gallery3D } from '@/design-system/components/Gallery3D'

interface GalleryListProps {
  exercises: Exercise[]
  addingId: number | null
  onSelect: (exercise: Exercise) => void
  onInfo?: (exercise: Exercise) => void
  className?: string
}

export function GalleryList({
  exercises,
  addingId,
  onSelect,
  onInfo,
  className = '',
}: GalleryListProps) {
  return (
    <Gallery3D
      items={exercises}
      getKey={(exercise) => exercise.id}
      getLabel={(exercise) => `Añadir ${exercise.name} a la rutina`}
      ariaLabel="Galería de ejercicios"
      hint="Arrastra o usa ← → para explorar"
      onSelect={onSelect}
      isBusy={(exercise) => addingId === exercise.id}
      className={className}
      viewportClassName="h-[400px] sm:h-[452px]"
      cardWidthClassName="w-[232px] sm:w-[264px]"
      cardClassName="h-[316px] sm:h-[352px]"
      renderCard={(exercise, { index, hovered }) => {
        const isAdding = addingId === exercise.id
        const image = exercise.image ? exerciseImageUrl(exercise.image) : undefined
        const gif = exercise.gifUrl ? exerciseGifUrl(exercise.gifUrl) : undefined
        const src = hovered && gif ? gif : image

        return (
          <>
            {src ? (
              <img
                src={src}
                alt=""
                loading="lazy"
                draggable={false}
                className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-500 ${
                  hovered ? 'scale-105' : 'scale-100'
                }`}
              />
            ) : (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-surface-container-high to-panel">
                <span className="material-symbols-outlined absolute inset-0 grid place-items-center text-4xl text-text-muted/40">
                  fitness_center
                </span>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />

            <span className="pointer-events-none absolute left-4 top-3 font-mono text-[11px] tracking-[0.25em] text-white/60">
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5">
              {onInfo && (
                <button
                  type="button"
                  data-card-action
                  onClick={(event) => {
                    event.stopPropagation()
                    onInfo(exercise)
                  }}
                  onKeyDown={(event) => event.stopPropagation()}
                  aria-label={`Información de ${exercise.name}`}
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-white/20 bg-black/60 text-white/80 transition-colors hover:bg-primary-fixed hover:text-on-primary-fixed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed"
                >
                  <span className="material-symbols-outlined text-[16px]">info</span>
                </button>
              )}
              <span
                aria-hidden="true"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-black/60 text-white/80"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${isAdding ? 'animate-spin' : ''}`}
                >
                  {isAdding ? 'progress_activity' : 'add'}
                </span>
              </span>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] p-4">
              <p className="line-clamp-2 font-label-caps text-sm font-semibold leading-tight text-white">
                {exercise.name}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <GreenTag color="green" variant="outlined" effects={false}>
                  {exercise.category}
                </GreenTag>
                {exercise.equipment && (
                  <GreenTag color="muted" variant="ghost" effects={false}>
                    {exercise.equipment}
                  </GreenTag>
                )}
              </div>
            </div>
          </>
        )
      }}
    />
  )
}
