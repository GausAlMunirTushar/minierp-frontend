import type { ChangeEvent } from 'react'

import { cn } from '@/lib/utils'

export function FileUpload({
  label,
  required,
  accept = 'image/*',
  previewUrl,
  onChange,
  error,
}: {
  label: string
  required?: boolean
  accept?: string
  previewUrl?: string
  error?: string
  onChange: (file: File | null) => void
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files?.[0] ?? null)
  }

  return (
    <label className="block space-y-1.5 text-sm font-medium text-foreground">
      <span>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          accept={accept}
          required={required}
          onChange={handleChange}
          className={cn(
            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none file:mr-3 file:rounded file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
          )}
        />
        {previewUrl && (
          <img src={previewUrl} alt="" className="h-20 w-20 rounded-md border border-border object-cover" />
        )}
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  )
}
