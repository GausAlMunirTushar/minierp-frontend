import type { ElementType, ReactNode, SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  label?: string
  error?: string
  placeholder?: string
  options?: SelectOption[]
  children?: ReactNode
  containerClassName?: string
}

export function Select({
  label,
  error,
  placeholder,
  options,
  children,
  className,
  containerClassName,
  ...props
}: SelectProps) {
  const Wrapper: ElementType = label ? 'label' : 'div'

  return (
    <Wrapper
      className={cn(
        label
          ? 'block space-y-1.5 text-sm font-medium text-foreground'
          : 'inline-block',
        containerClassName,
      )}
    >
      {label && <span>{label}</span>}
      <div className="relative">
        <select
          className={cn(
            'w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </Wrapper>
  )
}
