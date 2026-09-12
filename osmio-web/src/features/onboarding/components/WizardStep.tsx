import type { ReactNode } from 'react'

interface WizardStepProps {
  title: string
  description?: string
  children: ReactNode
}

export function WizardStep({ title, description, children }: WizardStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-on-surface">{title}</h3>
        {description && <p className="text-on-surface-variant mt-1">{description}</p>}
      </div>
      {children}
    </div>
  )
}
