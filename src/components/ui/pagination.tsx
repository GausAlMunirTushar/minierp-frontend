import { Button } from '@/components/ui/button'
import type { ApiMeta } from '@/apis/types/common_type'

export function Pagination({
  meta,
  page,
  onPageChange,
  labels,
}: {
  meta?: ApiMeta
  page: number
  onPageChange: (page: number) => void
  labels: {
    page: string
    of: string
    previous: string
    next: string
    total: string
  }
}) {
  const totalPages = meta?.totalPages ?? 1

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 p-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <span>
        {labels.page} {meta?.page ?? page} {labels.of} {totalPages} - {meta?.total ?? 0}{' '}
        {labels.total}
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          {labels.previous}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          {labels.next}
        </Button>
      </div>
    </div>
  )
}
