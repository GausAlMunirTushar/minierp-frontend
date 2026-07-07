import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/50 p-6 text-sm text-muted-foreground">
      <Loader2 className="animate-spin text-primary" size={22} />
      <span>{label}</span>
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/50 p-6 text-center">
      <Inbox className="text-muted-foreground" size={24} />
      <p className="font-medium text-foreground">{title}</p>
      {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel,
}: {
  title: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
}) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-md border border-destructive/20 bg-destructive/10 p-6 text-center">
      <AlertTriangle className="text-destructive" size={24} />
      <div>
        <p className="font-medium text-destructive">{title}</p>
        {description && <p className="mt-1 max-w-md text-sm text-destructive/80">{description}</p>}
      </div>
      {onRetry && (
        <Button type="button" variant="outline" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
