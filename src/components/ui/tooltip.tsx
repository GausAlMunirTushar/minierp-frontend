import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

const sideClasses: Record<TooltipSide, string> = {
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
}

export function Tooltip({
  label,
  children,
  side = 'right',
}: {
  label: string
  children: ReactNode
  side?: TooltipSide
}) {
  return (
    <div className="group relative inline-flex w-full">
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-[100] whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100',
          sideClasses[side],
        )}
      >
        {label}
      </span>
    </div>
  )
}
