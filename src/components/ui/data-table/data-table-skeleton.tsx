import { Skeleton } from '@/components/ui/skeleton'

export function DataTableSkeleton({ columns = 6, rows = 5 }: { columns?: number; rows?: number }) {
  return (
    <div className="space-y-4 p-4" aria-hidden>
      <div className="flex items-center justify-end">
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid gap-4 border-b border-border bg-muted p-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-3/5" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4 border-b border-border p-4 last:border-b-0"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <Skeleton key={columnIndex} className="h-4 w-4/5" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
