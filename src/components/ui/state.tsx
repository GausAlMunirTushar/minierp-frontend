import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
      <Loader2 className="animate-spin text-cyan-700" size={22} />
      <span>{label}</span>
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
      <Inbox className="text-slate-400" size={24} />
      <p className="font-medium text-slate-800">{title}</p>
      {description && <p className="max-w-md text-sm text-slate-500">{description}</p>}
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
    <div className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-md border border-red-100 bg-red-50 p-6 text-center">
      <AlertTriangle className="text-red-600" size={24} />
      <div>
        <p className="font-medium text-red-800">{title}</p>
        {description && <p className="mt-1 max-w-md text-sm text-red-600">{description}</p>}
      </div>
      {onRetry && (
        <Button type="button" variant="outline" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
