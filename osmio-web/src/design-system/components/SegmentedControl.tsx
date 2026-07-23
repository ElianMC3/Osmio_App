interface SegmentedControlOption<T extends string> {
  label: string
  value: T
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[]
  selected: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  selected,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`flex p-unit bg-surface-container rounded-lg border border-outline-variant/20 h-14 w-full ${className}`}
      role="tablist"
    >
      {options.map((opt) => {
        const isSelected = selected === opt.value
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(opt.value)}
            className={`
              flex-1 flex items-center justify-center
              font-label-caps text-label-caps uppercase
              transition-all rounded-sm
              border-b-4
              ${
                isSelected
                  ? 'border-primary-fixed text-on-surface bg-surface-container-high'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }
            `}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
