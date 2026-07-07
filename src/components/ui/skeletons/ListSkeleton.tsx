import { Skeleton } from '@/components/ui/skeleton'

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-1" aria-hidden>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-md border border-border px-3 py-2"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      ))}
    </div>
  )
}
