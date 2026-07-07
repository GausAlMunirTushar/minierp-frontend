import type { InputHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function Input({
  label,
  className,
  error,
  endAdornment,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; endAdornment?: ReactNode }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-foreground">
      {label && <span>{label}</span>}
      <div className="relative">
        <input
          className={cn(
            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20',
            endAdornment && 'pr-10',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
            className,
          )}
          {...props}
        />
        {endAdornment && <div className="absolute inset-y-0 right-0 flex items-center pr-2">{endAdornment}</div>}
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  )
}
