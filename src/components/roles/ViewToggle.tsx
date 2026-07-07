import { LayoutGrid, List } from 'lucide-react'

import { cn } from '@/lib/utils'

export type PermissionView = 'grid' | 'list'

export function ViewToggle({
  value,
  onChange,
  gridLabel,
  listLabel,
}: {
  value: PermissionView
  onChange: (view: PermissionView) => void
  gridLabel: string
  listLabel: string
}) {
  return (
    <div className="inline-flex items-center rounded-md border border-input bg-background p-0.5">
      <button
        type="button"
        onClick={() => onChange('grid')}
        aria-label={gridLabel}
        aria-pressed={value === 'grid'}
        className={cn(
          'flex items-center justify-center rounded p-1.5 transition-colors',
          value === 'grid'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <LayoutGrid size={16} />
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-label={listLabel}
        aria-pressed={value === 'list'}
        className={cn(
          'flex items-center justify-center rounded p-1.5 transition-colors',
          value === 'list'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <List size={16} />
      </button>
    </div>
  )
}
