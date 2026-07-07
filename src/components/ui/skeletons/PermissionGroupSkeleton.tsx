import { Skeleton } from '@/components/ui/skeleton'

export function PermissionGroupSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-hidden>
      {Array.from({ length: 4 }).map((_, groupIndex) => (
        <div key={groupIndex} className="space-y-2 rounded-md border border-border p-3">
          <Skeleton className="h-3 w-16" />
          <div className="space-y-1.5">
            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <Skeleton key={rowIndex} className="h-4 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
