import { Chip } from '../../../design-system/components/Chip'
import { useState } from 'react'

const positions = ['Guard', 'Half Guard', 'Mount', 'Side Control', 'Back', 'Standing']

export function PositionChips() {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (pos: string) => {
    setSelected((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    )
  }

  return (
    <div>
      <label className="text-sm text-gray-400 mb-2 block">Posiciones trabajadas</label>
      <div className="flex flex-wrap gap-2">
        {positions.map((pos) => (
          <Chip key={pos} selected={selected.includes(pos)} onClick={() => toggle(pos)} variant="secondary">
            {pos}
          </Chip>
        ))}
      </div>
    </div>
  )
}
