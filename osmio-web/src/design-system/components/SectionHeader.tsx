import { type ReactNode } from 'react'

interface SectionHeaderProps {
  kicker?: string
  title: string
  titleAccent?: string
  right?: ReactNode
}

export function SectionHeader({ kicker, title, titleAccent, right }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-3 flex-wrap">
      <div className="min-w-0">
        {kicker && (
          <p className="flex items-center gap-2 font-label-caps text-[10px] tracking-[0.22em] text-text-muted uppercase mb-1">
            <span className="w-1.5 h-1.5 bg-acid inline-block rotate-45" />
            {kicker}
          </p>
        )}
        <h2 className="font-headline-md text-[20px] leading-tight font-semibold uppercase tracking-tight text-text-green">
          {title}
          {titleAccent && <span className="text-gradient-green ml-2">{titleAccent}</span>}
        </h2>
      </div>
      {right}
    </div>
  )
}