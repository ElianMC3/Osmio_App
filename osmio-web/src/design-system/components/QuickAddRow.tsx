import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Plus } from 'lucide-react'

interface QuickAddRowProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  onAdd: () => void
  icon?: ReactNode
}

export const QuickAddRow = forwardRef<HTMLButtonElement, QuickAddRowProps>(
  ({ label, onAdd, icon, className = '', ...props }, ref) => {
    return (
      <div
        className={`flex items-center justify-between py-2 border-b border-outline-variant/15 ${className}`}
      >
        <span className="text-sm text-on-surface-variant">{label}</span>
        <button
          ref={ref}
          onClick={onAdd}
          className="p-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          aria-label={`Add ${label}`}
          {...props}
        >
          {icon || <Plus size={16} />}
        </button>
      </div>
    )
  },
)

QuickAddRow.displayName = 'QuickAddRow'
