import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Maximize2, Minimize2, X } from 'lucide-react'

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
  showMaximize = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
  closeLabel?: string
  showMaximize?: boolean
}) {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [prevOpen, setPrevOpen] = useState(open)

  if (open !== prevOpen) {
    setPrevOpen(open)
    setIsFullScreen(false)
  }

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
      <div
        className={cn(
          'border bg-card shadow-xl transition-all duration-200',
          isFullScreen
            ? 'fixed inset-0 z-50 h-screen w-screen max-w-none rounded-none border-none flex flex-col'
            : 'w-full max-w-2xl rounded-lg border-border',
          !isFullScreen && className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="flex-1">
            <h2 id="dialog-title" className="text-lg font-semibold text-card-foreground">
              {title}
            </h2>
            {description && (
              <p id="dialog-description" className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {showMaximize && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsFullScreen(!isFullScreen)}
                aria-label={isFullScreen ? 'Minimize' : 'Maximize'}
                className="h-8 w-8 p-0"
              >
                {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              aria-label={closeLabel}
              className="h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
        <div className={cn('p-5', isFullScreen ? 'flex-1 overflow-y-auto' : '')}>{children}</div>
      </div>
    </div>
  )
}
