import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Input({
  label,
  className,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-foreground">
      {label && <span>{label}</span>}
      <input
        className={cn(
          'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20',
          error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  )
}
