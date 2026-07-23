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
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {description && <p className="text-gray-400 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  )
}
