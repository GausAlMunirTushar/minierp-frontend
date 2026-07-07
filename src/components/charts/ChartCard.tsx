import React from 'react'

import { cn } from '@/lib/utils'

interface ChartCardProps {
  title: string
  children: React.ReactNode
  subtitle?: string
  actions?: React.ReactNode
  className?: string
  isLoading?: boolean
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children, actions, className = '', isLoading = false }) => {
  if (isLoading) {
    return (
      <div className={cn('overflow-hidden rounded-xl border border-border bg-card shadow-sm', className)}>
        <div className="flex flex-col items-start justify-between gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:p-5">
          <div>
            <div className="mb-2 h-5 w-32 animate-pulse rounded bg-muted"></div>
            <div className="h-3 w-40 animate-pulse rounded bg-muted"></div>
          </div>
          {actions && <div>{actions}</div>}
        </div>
        <div className="p-3 sm:p-4">
          <div className="flex h-[300px] items-center justify-center rounded-xl bg-muted">
            <div className="text-muted-foreground">Loading chart...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-card shadow-sm', className)}>
      <div className="flex flex-col items-start justify-between gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:p-5">
        <div>
          <h3 className="text-base font-semibold text-card-foreground sm:text-lg">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  )
}

export default ChartCard
