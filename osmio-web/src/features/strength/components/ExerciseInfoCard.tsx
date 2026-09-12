import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenTag } from '@/design-system/components/GreenTag'
import { exerciseGifUrl, exerciseImageUrl } from '@/shared/lib/media'
import type { Exercise } from '@/shared/types/session.types'

export default function ExerciseInfoCard({ exercise }: { exercise: Exercise }) {
  const gif = exerciseGifUrl(exercise.gifUrl)
  const image = exerciseImageUrl(exercise.image)
  const instructionsEs = exercise.instructions?.es?.trim()
  const muscle = exercise.target || exercise.muscleGroup

  return (
    <GreenCard variant="glass" padding="md" effects={false}>
      <div className="flex flex-col sm:flex-row gap-4">
        {(gif || image) && (
          <div className="shrink-0 self-start w-full sm:w-40">
            <img
              src={gif ?? image}
              alt={exercise.name}
              loading="lazy"
              className="w-full aspect-square rounded-xl object-cover border border-outline-variant/35 bg-panel/40"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-headline-md text-lg text-gradient-green uppercase font-semibold mb-2">
            {exercise.name}
          </h3>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {exercise.category && (
              <GreenTag color="green" variant="outlined" effects={false}>
                {exercise.category.replace(/-/g, ' ')}
              </GreenTag>
            )}
            {exercise.equipment && (
              <GreenTag color="muted" variant="ghost" effects={false}>
                {exercise.equipment}
              </GreenTag>
            )}
            {muscle && (
              <GreenTag color="muted" variant="ghost" effects={false}>
                {muscle}
              </GreenTag>
            )}
            {(exercise.secondaryMuscles ?? []).length > 0 && (
              <GreenTag color="muted" variant="ghost" effects={false}>
                {exercise.secondaryMuscles!.slice(0, 2).join(', ')}
              </GreenTag>
            )}
          </div>

          {instructionsEs && (
            <>
              <span className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider">
                Cómo ejecutarlo
              </span>
              <p className="mt-1 font-body-sm text-[13px] text-text-green/80 leading-relaxed">
                {instructionsEs}
              </p>
            </>
          )}

          {exercise.attribution && (
            <p className="mt-3 font-label-caps text-[9px] text-text-muted opacity-60">
              {exercise.attribution}
            </p>
          )}
        </div>
      </div>
    </GreenCard>
  )
}
