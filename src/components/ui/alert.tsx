import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type AlertVariant = 'error' | 'success' | 'info'

const variants: Record<AlertVariant, string> = {
  error: 'border-destructive/30 bg-destructive/10 text-destructive',
  success: 'border-success/30 bg-success/10 text-success',
  info: 'border-info/30 bg-info/10 text-info',
}

export function Alert({
  children,
  className,
  variant = 'info',
}: {
  children: ReactNode
  className?: string
  variant?: AlertVariant
}) {
  return (
    <div className={cn('rounded-md border px-3 py-2 text-sm', variants[variant], className)}>
      {children}
    </div>
  )
}
