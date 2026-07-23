interface StepperProps {
  currentStep: number
  totalSteps: number
  stepLabel?: string
  className?: string
}

export function Stepper({
  currentStep,
  totalSteps,
  stepLabel,
  className = '',
}: StepperProps) {
  return (
    <div className={`mb-xl ${className}`}>
      {(stepLabel || totalSteps > 0) && (
        <div className="flex justify-between items-end mb-sm">
          {stepLabel && (
            <span className="font-label-caps text-label-caps text-primary uppercase">
              {stepLabel}
            </span>
          )}
          <span className="font-data-display text-sm text-primary/50">
            {String(currentStep).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
          </span>
        </div>
      )}
      <div
        className="flex gap-xs h-1 w-full bg-surface-variant"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={stepLabel || 'Progress'}
      >
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-full flex-1 transition-all duration-500 ${
              i < currentStep ? 'bg-primary-fixed' : 'bg-surface-container'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
