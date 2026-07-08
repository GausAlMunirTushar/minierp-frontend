import { useEffect, ReactNode } from 'react'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
  closeLabel = 'Close',
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
  closeLabel?: string
}) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={description ? 'dialog-description' : undefined}
    >
      <div className={cn('w-full max-w-2xl rounded-lg border border-border bg-card shadow-xl', className)}>
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <h2 id="dialog-title" className="text-lg font-semibold text-card-foreground">
              {title}
            </h2>
            {description && (
              <p id="dialog-description" className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <Button type="button" variant="ghost" onClick={onClose} aria-label={closeLabel}>
            <X size={16} />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
