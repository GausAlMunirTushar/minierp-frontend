import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Input({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-slate-700">
      {label && <span>{label}</span>}
      <input
        className={cn(
          'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100',
          className,
        )}
        {...props}
      />
    </label>
  )
}
