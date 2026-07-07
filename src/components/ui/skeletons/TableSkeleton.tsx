import { Skeleton } from '@/components/ui/skeleton'

export function TableSkeleton({ rows = 4, columns = 4 }: { rows?: number; columns?: number }) {
  const gridStyle = { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }

  return (
    <div className="space-y-3" aria-hidden>
      <div className="grid gap-4 border-b border-border pb-3" style={gridStyle}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-2/3" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid items-center gap-4" style={gridStyle}>
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <Skeleton key={columnIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}
