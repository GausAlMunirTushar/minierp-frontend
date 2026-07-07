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
    <label className="block space-y-1.5 text-sm font-medium text-slate-700">
      <span>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          accept={accept}
          required={required}
          onChange={handleChange}
          className={cn(
            'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-100',
          )}
        />
        {previewUrl && (
          <img src={previewUrl} alt="" className="h-20 w-20 rounded-md border object-cover" />
        )}
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  )
}
