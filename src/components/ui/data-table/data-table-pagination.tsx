import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'

export function DataTablePagination({
  page,
  pageCount,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: {
  page: number
  pageCount: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}) {
  const { t } = useTranslation()
  const safePage = Number(page) || 1
  const safePageSize = Number(pageSize) || 0
  const safeTotal = Number(totalCount) || 0

  const from = safeTotal === 0 ? 0 : (safePage - 1) * safePageSize + 1
  const to = safeTotal === 0 ? 0 : Math.min(safePage * safePageSize, safeTotal)

  return (
    <div className="flex flex-col gap-3 border-t border-border p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>
        {t('showing')} <span className="font-medium text-foreground">{from}</span>–
        <span className="font-medium text-foreground">{to}</span> {t('of')}{' '}
        <span className="font-medium text-foreground">{safeTotal}</span>
      </span>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          {t('rowsPerPage')}
          <Select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            options={[10, 20, 25, 30, 40, 50].map((size) => ({ value: String(size), label: String(size) }))}
            className="w-auto px-2 py-1"
          />
        </label>

        <span className="font-medium">
          {t('page')} {safePage} {t('of')} {pageCount}
        </span>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            className="px-2"
            onClick={() => onPageChange(1)}
            disabled={safePage <= 1}
          >
            <ChevronsLeft size={16} />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="px-2"
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage <= 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="px-2"
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage >= pageCount}
          >
            <ChevronRight size={16} />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="px-2"
            onClick={() => onPageChange(pageCount)}
            disabled={safePage >= pageCount}
          >
            <ChevronsRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
