import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type AlertVariant = 'error' | 'success' | 'info'

const variants: Record<AlertVariant, string> = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  info: 'border-cyan-200 bg-cyan-50 text-cyan-700',
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
