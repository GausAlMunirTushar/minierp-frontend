import { Skeleton } from '@/components/ui/skeleton'

export function FormRowSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-[1fr_150px_160px_auto]"
        >
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-9" />
        </div>
      ))}
    </div>
  )
}
