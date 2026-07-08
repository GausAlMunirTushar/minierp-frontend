import type { InputHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function Input({
  label,
  className,
  error,
  endAdornment,
  required,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; endAdornment?: ReactNode }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-foreground">
      {label && (
        <span>
          {label}
          {required && (
            <span className="text-destructive ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </span>
      )}
      <div className="relative">
        <input
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          className={cn(
            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20',
            'disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-muted',
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
