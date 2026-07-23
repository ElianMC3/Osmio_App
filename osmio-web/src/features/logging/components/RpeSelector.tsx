import { Chip } from '../../../design-system/components/Chip'

interface RpeSelectorProps {
  value: number
  onChange: (value: number) => void
}

export function RpeSelector({ value, onChange }: RpeSelectorProps) {
  return (
    <div>
      <label className="text-sm text-gray-400 mb-2 block">RPE: {value}/10</label>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <Chip key={n} selected={value === n} onClick={() => onChange(n)}>
            {n}
          </Chip>
        ))}
      </div>
    </div>
  )
}
